import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { createMangofyPixCharge } from "@/lib/mangofy";
import { createStripePixCharge, createStripeCheckoutSession } from "@/lib/stripe";
import { logger } from "@/lib/logger";

const greetedLeads = new Map<string, number>();

export async function processFunnelIncomingMessage(
    sock: WASocket,
    sessionId: string,
    remoteJid: string,
    senderJid: string,
    text: string,
    pushName?: string | null,
    rawMsg?: WAMessage
): Promise<boolean> {
    try {
        if (!remoteJid || remoteJid.endsWith("@g.us") || remoteJid.includes("broadcast")) {
            return false;
        }

        const config = await ensureFunnelConfig();
        if (!config.enabled) return false;

        // Se houver sessão específica configurada, filtra por ela
        const targetSessionId = config.sessionId?.trim();
        if (targetSessionId && targetSessionId !== sessionId) {
            return false;
        }

        const cleanPhone = normalizeBrPhone(senderJid || remoteJid);
        if (!cleanPhone) return false;

        const incomingLower = text.trim().toLowerCase();
        const baseSiteUrl = (
            config.siteUrl ||
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://2.24.89.184:3000"
        ).replace(/\/+$/, "");

        // 1. Verifica se o cliente já é assinante e enviou mensagem pedindo o link ou avisando que pagou
        const variants = getPhoneVariants(cleanPhone);
        const existingVip = await prisma.viewerAccess.findFirst({
            where: {
                phone: { in: variants },
                isVip: true
            }
        });

        if (
            existingVip &&
            (incomingLower.includes("link") ||
                incomingLower.includes("acesso") ||
                incomingLower.includes("entrar") ||
                incomingLower.includes("ja paguei") ||
                incomingLower.includes("já paguei") ||
                incomingLower.includes("assistir"))
        ) {
            const magicLink = `${baseSiteUrl}/?phone=${existingVip.phone}`;
            const template =
                config.paymentApprovedMessage?.trim() ||
                "🎉 Pagamento confirmado com sucesso, {{NOME}}!\n\nSeu acesso exclusivo já está liberado! 🎬🍿\nClique no link abaixo para assistir agora:\n👉 {{LINK_ACESSO}}\n\n✅ Assista no celular, tablet, computador ou TV\n✅ Sem anúncios e episódios completos em HD\nBom entretenimento! ❤️";

            const formattedApproved = template
                .replace(/\{\{TELEFONE\}\}/g, existingVip.phone)
                .replace(/\{\{LINK_ACESSO\}\}/g, magicLink)
                .replace(/\{\{NOME\}\}/g, pushName || "Cliente")
                .replace(/\{\{VALOR\}\}/g, "19,90");

            await sock.sendMessage(remoteJid, { text: formattedApproved });
            return true;
        }

        // 2. Detecta se o cliente escolheu a Opção 1 (3 Séries - R$ 9,90)
        const isOption1 = [
            "1",
            "opcao 1",
            "opção 1",
            "3 series",
            "3 séries",
            "3 serie",
            "3 série",
            "9,90",
            "9.90",
            "primeira",
            "a primeira",
            "quero 3",
            "quero a 1",
            "escolho 1",
            "1️⃣"
        ].some((k) => incomingLower === k || (incomingLower.length <= 25 && incomingLower.includes(k)));

        // 3. Detecta se o cliente escolheu a Opção 2 (Catálogo Completo - R$ 19,90)
        const isOption2 = [
            "2",
            "opcao 2",
            "opção 2",
            "catalogo",
            "catálogo",
            "completo",
            "catalogo completo",
            "catálogo completo",
            "19,90",
            "19.90",
            "segunda",
            "a segunda",
            "todas",
            "quero 2",
            "quero a 2",
            "escolho 2",
            "tudo",
            "501",
            "2️⃣"
        ].some((k) => incomingLower === k || (incomingLower.length <= 25 && incomingLower.includes(k)));

        if (isOption1 || isOption2) {
            const selectedPrice = isOption1 ? 9.90 : 19.90;
            const selectedHeader = isOption1
                ? "🎬 Excelente escolha! Você escolheu *3 Séries por R$ 9,90*!\nVocê escolhe as séries e o acesso é enviado aqui na hora."
                : "🚀 Escolha perfeita! Você escolheu o *Catálogo Completo por R$ 19,90* com mais de 501 séries por 30 dias! ⭐";

            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const isStripePreferred = Boolean((config as any).stripeSecretKey?.trim()) || !Boolean(config.mangofyApiKey?.trim());

            const charge = isStripePreferred
                ? await createStripePixCharge({
                    phone: cleanPhone,
                    jid: remoteJid,
                    sessionId,
                    customerName: pushName || "Cliente",
                    customAmount: selectedPrice,
                    planKey: isOption1 ? "monthly" : "quarterly"
                })
                : await createMangofyPixCharge({
                    phone: cleanPhone,
                    jid: remoteJid,
                    sessionId,
                    customerName: pushName || "Cliente",
                    customAmount: selectedPrice,
                    planKey: isOption1 ? "monthly" : "quarterly"
                });

            const valorTxt = selectedPrice.toFixed(2).replace(".", ",");
            const pixText = `${selectedHeader}\n\nAqui está a sua chave Pix Copia e Cola no valor de *R$ ${valorTxt}*:\n\n${charge.pixCopyPaste}\n\n📱 *Como pagar:*\n1. Copie o código acima\n2. Abra o app do seu banco e escolha *Pix Copia e Cola*\n3. Cole e confirme o pagamento\n\n⚡ *Acesso liberado*: Assim que pagar, o acesso chega aqui no seu WhatsApp na hora!\n\n💳 _Se preferir pagar no Cartão de Crédito, basta responder *cartão*._`;

            await sock.sendMessage(remoteJid, { text: pixText }, rawMsg ? { quoted: rawMsg } : undefined);

            // Envia também o código limpo na sequência para facilitar a cópia com 1 clique no celular
            if (charge.pixCopyPaste) {
                await sock.sendMessage(remoteJid, { text: charge.pixCopyPaste });
            }

            return true;
        }

        // 3.1 Detecta se o cliente pediu para pagar no cartão de crédito
        const isCardRequest = [
            "cartao",
            "cartão",
            "credito",
            "crédito",
            "link do cartao",
            "link do cartão",
            "link de cartao",
            "link de cartão",
            "parcelar",
            "aceita cartao",
            "aceita cartão",
            "paga no cartao",
            "paga no cartão"
        ].some((k) => incomingLower.includes(k));

        if (isCardRequest) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
                const checkout = await createStripeCheckoutSession({
                    phone: cleanPhone,
                    customerName: pushName || "Cliente",
                    planKey: "monthly",
                    mode: "subscription"
                });
                const cardMsg = `💳 Sim! Aceitamos Cartão de Crédito com liberação imediata.\n\nClique no link seguro da Stripe abaixo para assinar no cartão:\n👉 ${checkout.checkoutUrl}\n\n✅ Assim que a operadora aprovar, seu acesso chega aqui no WhatsApp na hora!`;
                await sock.sendMessage(remoteJid, { text: cardMsg });
                return true;
            } catch (err: any) {
                logger.error("Funnel", "Erro ao gerar link de cartão Stripe:", err?.message);
            }
        }

        // 4. Se enviou "pix" ou "quero" sem dizer 1 ou 2, orienta sobre as duas opções
        const isGenericPixRequest = [
            "pix",
            "quero",
            "sim",
            "pagar",
            "como pago",
            "quero pagar",
            "me manda o pix",
            "manda o pix",
            "quero o pix",
            "chave pix",
            "comprar"
        ].some((k) => incomingLower === k || (incomingLower.length <= 20 && incomingLower.includes(k)));

        if (isGenericPixRequest) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const clarifyMsg = `Qual das duas opções você prefere? 😊\n\nDigite *1* para 🎬 *3 Séries por R$ 9,90*\nDigite *2* para 🚀 *Catálogo Completo por R$ 19,90* ⭐\n\n📌 Catálogo:\n${baseSiteUrl}\n\n✅ Depois do pagamento a série chega aqui na hora!`;
            await sock.sendMessage(remoteJid, { text: clarifyMsg }, rawMsg ? { quoted: rawMsg } : undefined);
            return true;
        }

        // 5. Primeiro contato do lead: envia a mensagem de oferta principal
        const lastGreetedAt = greetedLeads.get(cleanPhone) || 0;
        const hasBeenGreetedRecently = Date.now() - lastGreetedAt < 24 * 60 * 60 * 1000;

        if (!hasBeenGreetedRecently) {
            greetedLeads.set(cleanPhone, Date.now());

            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const defaultInitialGreeting = `Qual das duas vc prefere? 😊\n\n🎬 *3 Séries por R$ 9,90*\n✅ Você que escolhe as séries\n✅ Acesso enviado no WhatsApp após o pagamento\n\n🚀 *Catálogo Completo por R$ 19,90* ⭐\n✅ Todas as +501 séries liberadas\n✅ Assista quantas quiser por 30 dias\n✅ TODO DIA entra série nova\n✅ Melhor custo-benefício\n\n📌 Catálogo:\n{{LINK_CATALOGO}}\n\n✅ Depois do pagamento a série chega aqui na hora`;

            let initialText = config.step1Greeting?.trim() || defaultInitialGreeting;
            initialText = initialText
                .replace(/\{\{NOME\}\}/g, pushName || "")
                .replace(/\{\{TELEFONE\}\}/g, cleanPhone)
                .replace(/\{\{LINK_CATALOGO\}\}/g, baseSiteUrl)
                .replace(/\{\{LINK_SITE\}\}/g, baseSiteUrl);

            // Garante que o link do catálogo está presente caso o template tenha ficado em branco após "📌 Catálogo:"
            if (initialText.includes("📌 Catálogo:") && !initialText.includes(baseSiteUrl)) {
                initialText = initialText.replace(/📌 Catálogo:(\s*)/, `📌 Catálogo:\n${baseSiteUrl}\n\n`);
            }

            await sock.sendMessage(remoteJid, { text: initialText });

            // Envio opcional de mídia configurada
            if (
                config.step1MediaUrl?.trim() &&
                config.step1MediaType &&
                config.step1MediaType !== "none"
            ) {
                try {
                    const mediaUrl = config.step1MediaUrl.trim();
                    if (config.step1MediaType === "video") {
                        await sock.sendMessage(remoteJid, { video: { url: mediaUrl } });
                    } else if (config.step1MediaType === "audio") {
                        await sock.sendMessage(remoteJid, {
                            audio: { url: mediaUrl },
                            mimetype: "audio/mp4",
                            ptt: true
                        });
                    } else if (config.step1MediaType === "image") {
                        await sock.sendMessage(remoteJid, { image: { url: mediaUrl } });
                    }
                } catch (mediaErr) {
                    logger.error("Funnel", "Falha ao enviar mídia do Passo 1:", mediaErr);
                }
            }

            return true;
        }

        // 6. Resposta por IA Vendedora (se ativada no painel)
        if (config.useAiSaleswoman && config.aiApiKey?.trim() && config.aiSystemPrompt?.trim()) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
                const aiReply = await callSaleswomanAi({
                    provider: config.aiProvider || "GROQ",
                    apiKey: config.aiApiKey.trim(),
                    model: config.aiModel || "llama-3.3-70b-versatile",
                    systemPrompt: config.aiSystemPrompt.replace(/\{\{VALOR\}\}/g, "19,90"),
                    userMessage: text,
                    customerName: pushName || "Cliente"
                });

                if (aiReply) {
                    await sock.sendMessage(remoteJid, { text: aiReply }, rawMsg ? { quoted: rawMsg } : undefined);
                    return true;
                }
            } catch (aiErr: any) {
                logger.error("Funnel", "Erro na IA do Funil:", aiErr?.message);
            }
        } else {
            // Se o lead já foi saudado e enviou outra mensagem sem escolher opção
            const helpMsg = `Para liberar o seu acesso agora mesmo, basta responder:\n\n*1* para 🎬 *3 Séries por R$ 9,90*\n*2* para 🚀 *Catálogo Completo por R$ 19,90* ⭐\n\n📌 Catálogo:\n${baseSiteUrl}\n\n✅ Depois do pagamento a série chega aqui na hora!`;
            await sock.sendMessage(remoteJid, { text: helpMsg });
            return true;
        }

        return false;
    } catch (error) {
        logger.error("Funnel", "Erro ao processar mensagem no funil:", error);
        return false;
    }
}

async function callSaleswomanAi(params: {
    provider: string;
    apiKey: string;
    model: string;
    systemPrompt: string;
    userMessage: string;
    customerName: string;
}): Promise<string> {
    const { provider, apiKey, model, systemPrompt, userMessage, customerName } = params;

    if (provider === "GEMINI") {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${systemPrompt}\n\nNome do cliente: ${customerName}\nMensagem: ${userMessage}`
                            }
                        ]
                    }
                ],
                generationConfig: { temperature: 0.7 }
            })
        });
        if (!res.ok) return "";
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    }

    const endpoint =
        provider === "GROQ"
            ? "https://api.groq.com/openai/v1/chat/completions"
            : "https://api.openai.com/v1/chat/completions";

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `[${customerName}]: ${userMessage}` }
            ],
            temperature: 0.7
        })
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
}
