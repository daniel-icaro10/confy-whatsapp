import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { createMangofyPixCharge } from "@/lib/mangofy";
import { logger } from "@/lib/logger";

// Controle em memória para evitar disparo duplicado no mesmo segundo e rastrear quem já recebeu o Passo 1
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
        // Ignora grupos e status
        if (!remoteJid || remoteJid.endsWith("@g.us") || remoteJid.includes("broadcast")) {
            return false;
        }

        const config = await ensureFunnelConfig();
        if (!config.enabled) return false;

        // Se o funil estiver restrito a uma sessão específica, verifica se bate
        if (config.sessionId && config.sessionId.trim() !== "" && config.sessionId !== sessionId) {
            return false;
        }

        const cleanPhone = normalizeBrPhone(senderJid || remoteJid);
        if (!cleanPhone) return false;

        const incomingLower = text.trim().toLowerCase();
        const valorFormatado = (config.planPrice ?? 19.90).toFixed(2).replace(".", ",");
        const baseSiteUrl = (config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

        // 1. Verifica se o cliente já é VIP e está pedindo o link de acesso
        const variants = getPhoneVariants(cleanPhone);
        const existingVip = await prisma.viewerAccess.findFirst({
            where: {
                phone: { in: variants },
                isVip: true
            }
        });

        if (existingVip && (incomingLower.includes("link") || incomingLower.includes("acesso") || incomingLower.includes("entrar") || incomingLower.includes("ja paguei") || incomingLower.includes("já paguei"))) {
            const magicLink = `${baseSiteUrl}/?phone=${existingVip.phone}`;
            await sock.sendMessage(remoteJid, {
                text: `Oiê, meu amor! ❤️ Seu número *${existingVip.phone}* já está liberado como *Assinante VIP*!\n\n👉 *Clique aqui para entrar direto no catálogo e assistir:*\n${magicLink}`
            });
            return true;
        }

        // 2. Verifica se a mensagem contém gatilho de pedido de PIX ("quero", "pix", "sim", "assistir", etc.)
        const pixKeywords = (config.pixTriggerKeywords || "pix, quero, sim, continuar, assistir, liberar, pagar")
            .toLowerCase()
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);

        const lastGreetedAt = greetedLeads.get(cleanPhone) || 0;
        const hasBeenGreetedRecently = Date.now() - lastGreetedAt < 24 * 60 * 60 * 1000;

        // Se a pessoa já recebeu a saudação inicial e respondeu "quero" / "pix" / "sim", ou se ela já pediu "gerar pix" direto:
        const explicitPixRequest =
            incomingLower === "pix" ||
            incomingLower === "quero" ||
            incomingLower === "sim" ||
            incomingLower.includes("gerar pix") ||
            incomingLower.includes("manda o pix") ||
            incomingLower.includes("quero pagar") ||
            incomingLower.includes("quero o acesso");

        const matchesPixKeywordAfterGreeting =
            hasBeenGreetedRecently && pixKeywords.some((kw) => incomingLower.includes(kw));

        if (explicitPixRequest || matchesPixKeywordAfterGreeting) {
            logger.info("Funnel", `Gerando cobrança Pix Mangofy para ${cleanPhone}...`);

            // Simula "digitando..." para humanizar
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const charge = await createMangofyPixCharge({
                phone: cleanPhone,
                jid: remoteJid,
                sessionId,
                customerName: pushName || "Cliente WhatsApp"
            });

            const pixMsgTemplate =
                config.pixGeneratedMessage ||
                "✨ *Prontinho! Seu acesso VIP já está reservado!*\n\nValor: *R$ {{VALOR}}*\n\nCopie o código Pix Copia e Cola abaixo:\n\n{{PIX_COPIA_E_COLA}}";

            const formattedPixMsg = pixMsgTemplate
                .replace(/\{\{VALOR\}\}/g, valorFormatado)
                .replace(/\{\{PIX_COPIA_E_COLA\}\}/g, charge.pixCopyPaste)
                .replace(/\{\{TELEFONE\}\}/g, cleanPhone);

            await sock.sendMessage(remoteJid, { text: formattedPixMsg }, rawMsg ? { quoted: rawMsg } : undefined);

            // Envia o código Pix puro em uma mensagem separada para facilitar o "copiar" no celular
            await sock.sendMessage(remoteJid, { text: charge.pixCopyPaste });

            return true;
        }

        // 3. Se for o primeiro contato do lead vindo do anúncio de 3 minutos: envia Passo 1 (Boas-vindas + Mídia Parte 2) + Passo 2 (Oferta)
        if (!hasBeenGreetedRecently) {
            greetedLeads.set(cleanPhone, Date.now());
            logger.info("Funnel", `Novo lead no funil X1: ${cleanPhone} (${pushName || "Sem nome"})`);

            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const greetingText = (config.step1Greeting || "")
                .replace(/\{\{NOME\}\}/g, pushName || "meu amor")
                .replace(/\{\{VALOR\}\}/g, valorFormatado);

            if (greetingText) {
                await sock.sendMessage(remoteJid, { text: greetingText });
            }

            // Se tiver mídia configurada no Passo 1 (ex: Parte 2 do vídeo ou áudio gravado)
            if (config.step1MediaUrl && config.step1MediaType && config.step1MediaType !== "none") {
                try {
                    const mediaUrl = config.step1MediaUrl.trim();
                    if (config.step1MediaType === "video") {
                        await sock.sendMessage(remoteJid, {
                            video: { url: mediaUrl },
                            caption: "🎬 *Parte 2 — Olha o que acontece logo depois...*"
                        });
                    } else if (config.step1MediaType === "audio") {
                        await sock.sendMessage(remoteJid, {
                            audio: { url: mediaUrl },
                            mimetype: "audio/mp4",
                            ptt: true // Envia como áudio gravado na hora!
                        });
                    } else if (config.step1MediaType === "image") {
                        await sock.sendMessage(remoteJid, {
                            image: { url: mediaUrl }
                        });
                    }
                } catch (mediaErr) {
                    logger.error("Funnel", "Falha ao enviar mídia do Passo 1:", mediaErr);
                }
            }

            // Aguarda 1.8s e envia o Passo 2 (Oferta persuasiva com chamada para o Pix)
            const offerText = (config.step2OfferMessage || "")
                .replace(/\{\{NOME\}\}/g, pushName || "meu amor")
                .replace(/\{\{VALOR\}\}/g, valorFormatado);

            if (offerText) {
                await new Promise((r) => setTimeout(r, 1800));
                await sock.sendMessage(remoteJid, { text: offerText });
            }

            return true;
        }

        // 4. Se o lead já recebeu as boas-vindas e mandou uma dúvida/conversa -> IA Vendedora Sofia responde!
        if (config.useAiSaleswoman && config.aiApiKey?.trim()) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
                const aiReply = await callSaleswomanAi({
                    provider: config.aiProvider || "GROQ",
                    apiKey: config.aiApiKey.trim(),
                    model: config.aiModel || "llama-3.3-70b-versatile",
                    systemPrompt: (config.aiSystemPrompt || "").replace(/\{\{VALOR\}\}/g, valorFormatado),
                    userMessage: text,
                    customerName: pushName || "Cliente"
                });

                if (aiReply) {
                    await sock.sendMessage(remoteJid, { text: aiReply }, rawMsg ? { quoted: rawMsg } : undefined);
                    return true;
                }
            } catch (aiErr: any) {
                logger.error("Funnel", "Erro na IA Vendedora do Funil:", aiErr?.message);
            }
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
                                text: `${systemPrompt}\n\nNome da cliente: ${customerName}\nMensagem da cliente: ${userMessage}`
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
                { role: "user", content: `[Cliente ${customerName}]: ${userMessage}` }
            ],
            temperature: 0.7
        })
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
}

