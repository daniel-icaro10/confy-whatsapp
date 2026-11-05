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
 * Envia uma mensagem com botões interativos nativos do WhatsApp (Quick Reply, Copiar Código, etc.)
 * com suporte completo a fallback textual caso o dispositivo do cliente não suporte native flows.
 */
export async function sendInteractiveMessage(
    sock: WASocket,
    jid: string,
    params: SendInteractiveParams
): Promise<boolean> {
    try {
        const { body, footer, header, buttons, quoted, fallbackText } = params;

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
                userJid: sock.user?.id || jid,
                quoted
            }
        );

        if (!waMsg || !waMsg.message) {
            throw new Error("Falha ao gerar mensagem interativa com Baileys");
        }

        await sock.relayMessage(jid, waMsg.message, {
            messageId: waMsg.key.id!
        });

        return true;
    } catch (err: any) {
        logger.warn(
            "InteractiveButtons",
            `Falha ao enviar interativo via relayMessage (${err?.message}). Usando fallback textual.`
        );
        try {
            await sock.sendMessage(
                jid,
                { text: params.fallbackText },
                params.quoted ? { quoted: params.quoted } : undefined
            );
            return true;
        } catch (fallbackErr: any) {
            logger.error("InteractiveButtons", `Erro crítico no fallback textual: ${fallbackErr?.message}`);
            return false;
        }
    }
}

/**
 * Envia a mensagem inicial do funil: "Qual você prefere?"
 * com os botões rápidos "3 Séries R$ 10,00" e "Completo R$ 20,00".
 */
export async function sendOfferSelectionMessage(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    const body = "Qual você prefere?";
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
        "Qual você prefere? 😊\n\n" +
        "1️⃣ *3 Séries R$ 10,00*\n" +
        "2️⃣ *Completo R$ 20,00*\n\n" +
        "_Responda 1 ou 2_";

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}

/**
 * Envia a mensagem de cobrança Pix com botão de cópia nativo (cta_copy):
 * "prontinho! segue o pix da catálogo completo (R$ 20,00) 👇 ..."
 * com botão "📋 Copiar código".
 * NUNCA envia mensagem duplicada.
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
                copy_code: pixCode
            })
        }
    ];

    // No fallback para clientes sem suporte a botão nativo de cópia, envia o código uma única vez no rodapé
    const fallbackText =
        `${body}\n\n` +
        `*Código Pix Copia e Cola:*\n` +
        `${pixCode}`;

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}

/**
 * Envia o remarketing de Pix abandonado:
 * "o pix ainda não apareceu aqui 😊 conseguiu fazer? ..."
 * com os botões "Mandar pix de novo" e "Já paguei".
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
        `Responda:\n` +
        `*1* - Mandar pix de novo\n` +
        `*2* - Já paguei`;

    return sendInteractiveMessage(sock, jid, {
        body,
        buttons,
        fallbackText,
        quoted
    });
}

