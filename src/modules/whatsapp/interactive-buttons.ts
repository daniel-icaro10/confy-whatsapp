import { proto, generateWAMessageFromContent, type WASocket, type WAMessage } from "@whiskeysockets/baileys";
import { logger } from "@/lib/logger";

export interface InteractiveNativeButton {
    name: "quick_reply" | "cta_copy" | "cta_url" | "cta_call";
    buttonParamsJson: string;
}

export interface SendInteractiveParams {
    body: string;
    footer?: string;
    header?: string;
    buttons: InteractiveNativeButton[];
    fallbackText: string;
    quoted?: WAMessage;
}

/**
 * Envia uma mensagem com botões interativos nativos do WhatsApp (Native Flow: Quick Reply, CTA Copiar Código, etc.).
 * Utiliza o protocolo viewOnceMessage + interactiveMessage do Baileys para exibir os botões clicáveis no aplicativo mobile.
 * Se o envio nativo falhar por qualquer razão técnica, envia automaticamente o fallback textual legível.
 */
export async function sendInteractiveMessage(
    sock: WASocket,
    jid: string,
    params: SendInteractiveParams
): Promise<boolean> {
    const { body, footer, header, buttons, quoted, fallbackText } = params;

    try {
        const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
                text: body
            }),
            footer: footer
                ? proto.Message.InteractiveMessage.Footer.create({ text: footer })
                : undefined,
            header: header
                ? proto.Message.InteractiveMessage.Header.create({
                      title: header,
                      hasMediaAttachment: false
                  })
                : undefined,
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: buttons.map((b) => ({
                    name: b.name,
                    buttonParamsJson: b.buttonParamsJson
                })),
                messageVersion: 1
            })
        });

        // O Baileys precisa do userJid base sem o sufixo de dispositivo (:12)
        const rawUserJid = sock.user?.id;
        const userJid = rawUserJid
            ? (rawUserJid.includes(":") ? rawUserJid.split(":")[0] + "@s.whatsapp.net" : rawUserJid)
            : jid;

        const waMsg = generateWAMessageFromContent(
            jid,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage
                    }
                }
            },
            {
                userJid,
                quoted
            }
        );

        if (!waMsg || !waMsg.message) {
            throw new Error("Falha ao gerar mensagem interativa Baileys");
        }

        await sock.relayMessage(jid, waMsg.message, {
            messageId: waMsg.key.id!
        });

        logger.info("InteractiveButtons", `Mensagem interativa (Native Flow) enviada com sucesso para ${jid}`);
        return true;
    } catch (err: any) {
        logger.warn(
            "InteractiveButtons",
            `Falha ao enviar interativo via relayMessage (${err?.message}). Enviando fallback textual.`
        );
        try {
            await sock.sendMessage(
                jid,
                { text: fallbackText },
                quoted ? { quoted } : undefined
            );
            return true;
        } catch (fallbackErr: any) {
            logger.error("InteractiveButtons", `Erro no fallback textual: ${fallbackErr?.message}`);
            return false;
        }
    }
}

/**
 * 1. Envia a mensagem de escolha de planos idêntica ao modelo solicitado pelo cliente:
 * "Qual das duas vc prefere? 😊
 *  🎬 3 Séries por R$ 10,00 ...
 *  🚀 Catálogo Completo por R$ 20,00 ⭐ ...
 *  📌 Catálogo: https://tvdramareels.online"
 *
 * Botões nativos:
 * [ ↩ 3 Séries R$ 10,00 ]
 * [ ↩ Completo R$ 20,00 ]
 */
export async function sendOfferSelectionMessage(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage,
    siteUrl: string = "https://tvdramareels.online"
): Promise<boolean> {
    const cleanSiteUrl = (siteUrl || "https://tvdramareels.online").replace(/\/+$/, "");

    const body =
        `Qual das duas vc prefere? 😊\n\n` +
        `🎬 *3 Séries por R$ 10,00*\n` +
        `✅ Você que escolhe as séries\n` +
        `✅ Acesso enviado no WhatsApp após o pagamento\n\n` +
        `🚀 *Catálogo Completo por R$ 20,00* ⭐\n` +
        `✅ Todas as +501 séries liberadas\n` +
        `✅ Assista quantas quiser por 30 dias\n` +
        `✅ TODO DIA entra série nova\n` +
        `✅ Melhor custo-benefício\n\n` +
        `📌 Catálogo:\n` +
        `${cleanSiteUrl}\n\n` +
        `✅ Depois do pagamento a série chega aqui na hora`;

    const buttons: InteractiveNativeButton[] = [
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "3 Séries R$ 10,00",
                id: "plan_3_series"
            })
        },
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "Completo R$ 20,00",
                id: "plan_completo"
            })
        }
    ];

    const fallbackText =
        `${body}\n\n` +
        `_Responda *1* ou *2*_`;

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}

/**
 * 2. Envia a mensagem de pagamento Pix com o botão nativo de cópia (cta_copy):
 * "prontinho! segue o pix da catálogo completo (R$ 20,00) 👇
 * pra copiar é só tocar no botão aqui embaixo ⬇️
 * aí abre o app do seu banco ➔ Pix copia e cola ➔ cola e paga"
 *
 * Botão nativo:
 * [ 📋 Copiar código ] (copia o código Pix direto para a área de transferência do cliente)
 */
export async function sendPixPaymentMessage(
    sock: WASocket,
    jid: string,
    params: {
        planType: "option1" | "option2";
        priceTxt: string; // "10,00" ou "20,00"
        pixCode: string;
        quoted?: WAMessage;
    }
): Promise<boolean> {
    const { planType, priceTxt, pixCode, quoted } = params;
    const cleanPixCode = (pixCode || "").trim();

    const planLabel =
        planType === "option1"
            ? `3 séries (R$ ${priceTxt})`
            : `catálogo completo (R$ ${priceTxt})`;

    const body =
        `prontinho! segue o pix da ${planLabel} 👇\n\n` +
        `pra copiar é só tocar no botão aqui embaixo ⬇️\n` +
        `aí abre o app do seu banco ➔ Pix copia e cola ➔ cola e paga`;

    const buttons: InteractiveNativeButton[] = [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "📋 Copiar código",
                id: "pix_copy_button",
                copy_code: cleanPixCode
            })
        }
    ];

    const fallbackText =
        `${body}\n\n` +
        `*Código Pix Copia e Cola:*\n` +
        `${cleanPixCode}`;

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}

/**
 * 3. Envia o remarketing de Pix abandonado idêntico à imagem de referência:
 * "o pix ainda não apareceu aqui 😊
 *  conseguiu fazer?
 *  se travou no banco, me avisa que eu te mando um novinho"
 *
 * Botões nativos:
 * [ ↩ Mandar pix de novo ]
 * [ ↩ Já paguei ]
 */
export async function sendAbandonedPixRemarketing(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    const body =
        `o pix ainda não apareceu aqui 😊\n` +
        `conseguiu fazer?\n\n` +
        `se travou no banco, me avisa que eu te mando um novinho`;

    const buttons: InteractiveNativeButton[] = [
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "Mandar pix de novo",
                id: "pix_resend"
            })
        },
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "Já paguei",
                id: "pix_already_paid"
            })
        }
    ];

    const fallbackText =
        `${body}\n\n` +
        `_Responda:_\n` +
        `*1* - Mandar pix de novo\n` +
        `*2* - Já paguei`;

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}
