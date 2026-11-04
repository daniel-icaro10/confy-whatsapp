import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { createMangofyPixCharge } from "@/lib/mangofy";
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

        // Obrigatório ter uma sessão específica selecionada para o TvDrama Reels (nunca roda em outras sessões do Baileys)
        const targetSessionId = config.sessionId?.trim();
        if (!targetSessionId || targetSessionId !== sessionId) {
            return false;
        }

        const cleanPhone = normalizeBrPhone(senderJid || remoteJid);
        if (!cleanPhone) return false;

        const incomingLower = text.trim().toLowerCase();
        const valorFormatado = (config.planPrice ?? 19.90).toFixed(2).replace(".", ",");
        const baseSiteUrl = (config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

        // 1. Verifica se o cliente já é assinante e enviou mensagem pedindo o link (somente se houver mensagem configurada no admin)
        const variants = getPhoneVariants(cleanPhone);
        const existingVip = await prisma.viewerAccess.findFirst({
            where: {
                phone: { in: variants },
                isVip: true
            }
        });

        if (
            existingVip &&
            config.paymentApprovedMessage?.trim() &&
            (incomingLower.includes("link") ||
                incomingLower.includes("acesso") ||
                incomingLower.includes("entrar") ||
                incomingLower.includes("ja paguei") ||
                incomingLower.includes("já paguei"))
        ) {
            const magicLink = `${baseSiteUrl}/?phone=${existingVip.phone}`;
            const formattedApproved = config.paymentApprovedMessage
                .replace(/\{\{TELEFONE\}\}/g, existingVip.phone)
                .replace(/\{\{LINK_ACESSO\}\}/g, magicLink)
                .replace(/\{\{NOME\}\}/g, pushName || "")
                .replace(/\{\{VALOR\}\}/g, valorFormatado);

            await sock.sendMessage(remoteJid, { text: formattedApproved });
            return true;
        }

        // 2. Verifica palavras-chave de geração de Pix configuradas no painel admin
        const pixKeywords = (config.pixTriggerKeywords || "")
            .toLowerCase()
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);

        const lastGreetedAt = greetedLeads.get(cleanPhone) || 0;
        const hasBeenGreetedRecently = Date.now() - lastGreetedAt < 24 * 60 * 60 * 1000;

        const matchesPixKeyword =
            pixKeywords.length > 0 &&
            pixKeywords.some((kw) => incomingLower === kw || (hasBeenGreetedRecently && incomingLower.includes(kw)));

        if (matchesPixKeyword) {
            logger.info("Funnel", `Gerando cobrança Pix Mangofy para ${cleanPhone}...`);

            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
            } catch {}

            const charge = await createMangofyPixCharge({
                phone: cleanPhone,
                jid: remoteJid,
                sessionId,
                customerName: pushName || "Cliente"
            });

            if (config.pixGeneratedMessage?.trim()) {
                const formattedPixMsg = config.pixGeneratedMessage
                    .replace(/\{\{VALOR\}\}/g, valorFormatado)
                    .replace(/\{\{PIX_COPIA_E_COLA\}\}/g, charge.pixCopyPaste)
                    .replace(/\{\{TELEFONE\}\}/g, cleanPhone)
                    .replace(/\{\{NOME\}\}/g, pushName || "");

                await sock.sendMessage(remoteJid, { text: formattedPixMsg }, rawMsg ? { quoted: rawMsg } : undefined);
            }

            if (charge.pixCopyPaste) {
                await sock.sendMessage(remoteJid, { text: charge.pixCopyPaste });
            }

            return true;
        }

        // 3. Primeiro contato do lead (envia apenas as mensagens/mídias que estiverem preenchidas no painel admin)
        if (!hasBeenGreetedRecently) {
            const hasStep1Text = Boolean(config.step1Greeting?.trim());
            const hasStep1Media = Boolean(config.step1MediaUrl?.trim() && config.step1MediaType && config.step1MediaType !== "none");
            const hasStep2Text = Boolean(config.step2OfferMessage?.trim());

            if (hasStep1Text || hasStep1Media || hasStep2Text) {
                greetedLeads.set(cleanPhone, Date.now());

                try {
                    await sock.sendPresenceUpdate("composing", remoteJid);
                } catch {}

                if (hasStep1Text) {
                    const greetingText = config.step1Greeting
                        .replace(/\{\{NOME\}\}/g, pushName || "")
                        .replace(/\{\{VALOR\}\}/g, valorFormatado)
                        .replace(/\{\{TELEFONE\}\}/g, cleanPhone);

                    await sock.sendMessage(remoteJid, { text: greetingText });
                }

                if (hasStep1Media) {
                    try {
                        const mediaUrl = config.step1MediaUrl!.trim();
                        if (config.step1MediaType === "video") {
                            await sock.sendMessage(remoteJid, {
                                video: { url: mediaUrl }
                            });
                        } else if (config.step1MediaType === "audio") {
                            await sock.sendMessage(remoteJid, {
                                audio: { url: mediaUrl },
                                mimetype: "audio/mp4",
                                ptt: true
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

                if (hasStep2Text) {
                    const offerText = config.step2OfferMessage
                        .replace(/\{\{NOME\}\}/g, pushName || "")
                        .replace(/\{\{VALOR\}\}/g, valorFormatado)
                        .replace(/\{\{TELEFONE\}\}/g, cleanPhone);

                    await new Promise((r) => setTimeout(r, 1500));
                    await sock.sendMessage(remoteJid, { text: offerText });
                }

                return true;
            }
        }

        // 4. Resposta por IA (somente se ativada e configurada com prompt e chave no painel admin)
        if (config.useAiSaleswoman && config.aiApiKey?.trim() && config.aiSystemPrompt?.trim()) {
            try {
                await sock.sendPresenceUpdate("composing", remoteJid);
                const aiReply = await callSaleswomanAi({
                    provider: config.aiProvider || "GROQ",
                    apiKey: config.aiApiKey.trim(),
                    model: config.aiModel || "llama-3.3-70b-versatile",
                    systemPrompt: config.aiSystemPrompt.replace(/\{\{VALOR\}\}/g, valorFormatado),
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
