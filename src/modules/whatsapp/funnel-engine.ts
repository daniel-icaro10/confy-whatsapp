import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { createMangofyPixCharge, approvePixOrderAndGrantAccess } from "@/lib/mangofy";
import { createStripePixCharge, createStripeCheckoutSession } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import {
    sendOfferSelectionMessage,
    sendPixPaymentMessage,
    sendAbandonedPixRemarketing
} from "./interactive-buttons";
import { TicketService } from "./ticket.service";

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

        const currentSession = await prisma.session.findUnique({
            where: { sessionId },
            select: { name: true }
        });

        const sessionNameLower = (currentSession?.name || "").toLowerCase();
        const isTvDramaSession =
            sessionNameLower.includes("tvdrama") ||
            sessionNameLower.includes("dorama") ||
            sessionNameLower.includes("segredos") ||
            sessionId === config.sessionId;

        // Se houver mais de uma sessão ativa na VPS, o funil responde apenas na sessão do TvDrama Reels
        if (!isTvDramaSession) {
            return false;
        }

        // Auto-vincula a sessão do TvDrama Reels para garantir resposta sempre
        if (config.sessionId !== sessionId) {
            await prisma.funnelConfig.update({
                where: { id: "default" },
                data: { sessionId }
            }).catch(() => {});
        }

        const cleanPhone = normalizeBrPhone(senderJid || remoteJid);
        if (!cleanPhone) return false;

        const incomingLower = text.trim().toLowerCase();
        const baseSiteUrl = (
            config.siteUrl ||
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://tvdramareels.online"
        ).replace(/\/+$/, "");

        // Extrai o nome da novela se veio no padrão "(Nome da Novela)" dos anúncios ou catálogo
        const dramaMatch = text.match(/\(([^)]+)\)/);
        const dramaTitle = dramaMatch ? dramaMatch[1].trim() : undefined;

        // 1. Verifica se o cliente já é assinante VIP ativo
        const variants = getPhoneVariants(cleanPhone);
        const existingVip = await prisma.viewerAccess.findFirst({
            where: {
                phone: { in: variants },
                isVip: true
            }
        });

        // 1.1 Se o cliente já é VIP e pediu link, acesso ou avisou que pagou
        if (
            existingVip &&
            (incomingLower.includes("link") ||
                incomingLower.includes("acesso") ||
                incomingLower.includes("entrar") ||
                incomingLower.includes("ja paguei") ||
                incomingLower.includes("já paguei") ||
                incomingLower.includes("pix_already_paid") ||
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
                .replace(/\{\{VALOR\}\}/g, "20,00");

            await sock.sendMessage(remoteJid, { text: formattedApproved }, rawMsg ? { quoted: rawMsg } : undefined);
            return true;
        }

        // 2. Detecta clique no botão "Já paguei"
        const isAlreadyPaid = [
            "já paguei",
            "ja paguei",
            "paguei",
            "pago",
            "já fiz",
            "ja fiz",
            "fiz o pix",
            "pix_already_paid",
            "consegui",
            "pronto",
            "tá pago",
            "ta pago",
            "acabei de pagar",
            "acabei de fazer"
        ].some((k) => incomingLower === k || (incomingLower.length <= 25 && incomingLower.includes(k)));

        if (isAlreadyPaid) {
            // Busca o pedido Pix mais recente do cliente
            const latestOrder = await prisma.pixOrder.findFirst({
                where: { phone: { in: variants } },
                orderBy: { createdAt: "desc" }
            });

            if (latestOrder && latestOrder.status === "PAID") {
                const magicLink = `${baseSiteUrl}/?phone=${latestOrder.phone}`;
                const approvedMsg =
                    `🎉 Pagamento confirmado com sucesso, ${pushName || "Cliente"}!\n\n` +
                    `Seu acesso exclusivo já está liberado! 🎬🍿\n` +
                    `Clique no link abaixo para assistir agora:\n` +
                    `👉 ${magicLink}\n\n` +
                    `✅ Assista no celular, tablet, computador ou TV\n` +
                    `✅ Sem anúncios e episódios completos em HD\n` +
                    `Bom entretenimento! ❤️`;
                await sock.sendMessage(remoteJid, { text: approvedMsg }, rawMsg ? { quoted: rawMsg } : undefined);
                return true;
            }

            const pendingWaitMsg =
                `Ainda estou aguardando a confirmação do seu banco 😊\n\n` +
                `Normalmente o Pix é compensado em até 30 segundos. Assim que o banco aprovar, seu link de acesso exclusivo chega aqui na hora!\n\n` +
                `Se o valor já saiu da sua conta e demorar mais de 1 minuto, pode me avisar aqui que eu já te ajudo! ❤️`;
            await sock.sendMessage(remoteJid, { text: pendingWaitMsg }, rawMsg ? { quoted: rawMsg } : undefined);
            return true;
        }

        // 3. Detecta clique no botão "Mandar pix de novo"
        const isPixResend = [
            "mandar pix de novo",
            "pix de novo",
            "de novo",
            "novo pix",
            "manda outro",
            "outro pix",
            "pix_resend",
            "gerar de novo",
            "não consegui",
            "nao consegui",
            "travou",
            "manda o pix de novo",
            "manda de novo",
            "reenviar pix",
            "reenviar"
        ].some((k) => incomingLower === k || (incomingLower.length <= 30 && incomingLower.includes(k)));

        if (isPixResend) {
            // Verifica se o último pedido era de 3 Séries (R$ 10,00) ou Completo (R$ 20,00)
            const previousOrder = await prisma.pixOrder.findFirst({
                where: { phone: { in: variants } },
                orderBy: { createdAt: "desc" }
            });

            const isPrevOption1 = previousOrder ? (previousOrder.amount <= 12) : false;
            const hasDiscount = Boolean(previousOrder?.remarketingSentAt) || incomingLower.includes("desconto") || incomingLower.includes("cupom");
            const resendPrice = isPrevOption1 ? (hasDiscount ? 7.90 : 10.00) : (hasDiscount ? 15.00 : 20.00);
            const resendPlanType: "option1" | "option2" = isPrevOption1 ? "option1" : "option2";

            const isStripePreferred = Boolean((config as any).stripeSecretKey?.trim()) || !Boolean(config.mangofyApiKey?.trim());
            const charge = isStripePreferred
                ? await createStripePixCharge({
                    phone: cleanPhone,
                    jid: remoteJid,
                    sessionId,
                    customerName: pushName || "Cliente",
                    customAmount: resendPrice,
                    planKey: isPrevOption1 ? "monthly" : "quarterly"
                })
                : await createMangofyPixCharge({
                    phone: cleanPhone,
                    jid: remoteJid,
                    sessionId,
                    customerName: pushName || "Cliente",
                    customAmount: resendPrice,
                    planKey: isPrevOption1 ? "monthly" : "quarterly"
                });

            await sendPixPaymentMessage(sock, remoteJid, {
                planType: resendPlanType,
                priceTxt: resendPrice.toFixed(2).replace(".", ","),
                pixCode: charge.pixCopyPaste,
                quoted: rawMsg
            });

            return true;
        }

        // 4. Detecta escolha da Opção 2 explícita (Catálogo Completo - R$ 20,00 ou R$ 15,00 no remarketing)
        const isExplicitOption2 = [
            "2",
            "opt_2",
            "plan_completo",
            "completo r$ 20,00",
            "completo r$ 20",
            "completo 20",
            "completo",
            "catalogo",
            "catálogo",
            "catalogo completo",
            "catálogo completo",
            "catálogo completo (r$ 20,00)",
            "catalogo completo (r$ 20,00)",
            "20,00",
            "20.00",
            "20",
            "19,90",
            "19.90",
            "15,00",
            "15.00",
            "15",
            "completo por 15",
            "completo 15",
            "completo 15,00",
            "quero o completo",
            "quero o catalogo",
            "quero o catálogo",
            "segunda",
            "a segunda",
            "todas",
            "quero 2",
            "quero a 2",
            "escolho 2",
            "tudo",
            "501",
            "500",
            "2️⃣"
        ].some((k) => incomingLower === k || (incomingLower.length <= 30 && incomingLower.includes(k)));

        // 5. Detecta escolha da Opção 1 (3 Séries - R$ 10,00 ou R$ 7,90 no desconto de follow-up / remarketing)
        const isOption1 = [
            "1",
            "opt_1",
            "plan_3_series",
            "3 series",
            "3 séries",
            "3 serie",
            "3 série",
            "3 séries r$ 10,00",
            "3 series r$ 10,00",
            "3 series r$ 10",
            "3 séries r$ 10",
            "3 series 10",
            "3 séries 10",
            "10,00",
            "10.00",
            "10",
            "9,90",
            "9.90",
            "7,90",
            "7.90",
            "7,9",
            "7.9",
            "7",
            "3 series por 7,90",
            "3 séries por 7,90",
            "3 series 7,90",
            "3 séries 7,90",
            "primeira",
            "a primeira",
            "quero 3",
            "quero a 1",
            "escolho 1",
            "1️⃣",
            "quero",
            "sim",
            "sim quero",
            "eu quero",
            "quero sim",
            "manda",
            "pode mandar",
            "manda o pix",
            "desconto",
            "cupom",
            "promoção",
            "promocao"
        ].some((k) => incomingLower === k || (incomingLower.length <= 30 && incomingLower.includes(k))) && !isExplicitOption2;

        const isOption2 = isExplicitOption2;

        // 5.1 Detecta renovação
        const isRenewal = [
            "renovar",
            "renovação",
            "renovacao",
            "reativar",
            "reativação",
            "reativacao",
            "venceu",
            "vencendo",
            "quero renovar",
            "renovei",
            "meu acesso venceu"
        ].some((k) => incomingLower.includes(k));

        if (isOption1 || isOption2 || isRenewal) {
            const previousPending = await prisma.pixOrder.findFirst({
                where: { phone: { in: variants } },
                orderBy: { createdAt: "desc" }
            });
            const hasRemarketingDiscount =
                Boolean(previousPending?.remarketingSentAt) ||
                incomingLower.includes("desconto") ||
                incomingLower.includes("cupom") ||
                incomingLower.includes("7,90") ||
                incomingLower.includes("7.90") ||
                incomingLower.includes("15") ||
                incomingLower === "quero";

            const selectedPrice = isOption1
                ? (hasRemarketingDiscount ? 7.90 : 10.00)
                : (hasRemarketingDiscount ? 15.00 : 20.00);
            const planType: "option1" | "option2" = isOption1 ? "option1" : "option2";

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

            // Envia o modelo idêntico ao print com o botão de cópia nativo
            // SEM duplicar o código Pix e SEM mandar mensagem repetida
            await sendPixPaymentMessage(sock, remoteJid, {
                planType,
                priceTxt: selectedPrice.toFixed(2).replace(".", ","),
                pixCode: charge.pixCopyPaste,
                quoted: rawMsg
            });

            return true;
        }

        // 6. Detecta pedido para pagar no cartão de crédito
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

        // 7. Se enviou "pix" ou "quero" sem especificar a opção
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
            await sendOfferSelectionMessage(sock, remoteJid, rawMsg, baseSiteUrl, dramaTitle);
            return true;
        }

        // 8. Primeiro contato do lead: envia a saudação calorosa (Opção A) e registra para follow-up
        const lastGreetedAt = greetedLeads.get(cleanPhone) || 0;
        const hasBeenGreetedRecently = Date.now() - lastGreetedAt < 60 * 1000;

        if (!hasBeenGreetedRecently) {
            greetedLeads.set(cleanPhone, Date.now());

            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            // Registra a atividade no ticket para acompanhamento e follow-up automático de 30m
            try {
                const ticket = await TicketService.getOrCreateTicket(sessionId, remoteJid);
                if (ticket) {
                    await TicketService.logActivity(
                        sessionId,
                        ticket.id,
                        remoteJid,
                        "FUNNEL_GREETED",
                        dramaTitle ? `Drama: ${dramaTitle}` : "GREETED_INITIAL",
                        null
                    );
                }
            } catch (tErr) {
                logger.warn("Funnel", "Não foi possível registrar atividade de ticket para lead:", tErr);
            }

            // Envio opcional de mídia configurada (áudio de prévia, vídeo teaser) antes da pergunta
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

            // Envia a mensagem de boas-vindas com as 2 opções acolhedoras (Opção A)
            await sendOfferSelectionMessage(sock, remoteJid, rawMsg, baseSiteUrl, dramaTitle);
            return true;
        }

        // 9. Resposta por IA Vendedora (se ativada no painel)
        if (config.useAiSaleswoman && config.aiApiKey?.trim() && config.aiSystemPrompt?.trim()) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
                const aiReply = await callSaleswomanAi({
                    provider: config.aiProvider || "GROQ",
                    apiKey: config.aiApiKey.trim(),
                    model: config.aiModel || "llama-3.3-70b-versatile",
                    systemPrompt: config.aiSystemPrompt.replace(/\{\{VALOR\}\}/g, "20,00"),
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
            // Se o lead já foi saudado e mandou outra dúvida, reenvia as opções interativas
            await sendOfferSelectionMessage(sock, remoteJid, rawMsg, baseSiteUrl, dramaTitle);
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
