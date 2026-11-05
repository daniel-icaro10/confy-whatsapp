import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { logger } from "@/lib/logger";

/**
 * Envia uma mensagem com entrega 100% garantida via sendMessage do Baileys.
 * Evita o descarte silencioso de mensagens que ocorre quando se usa relayMessage com botões em contas Web.
 */
export async function sendOfferSelectionMessage(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    try {
        const text =
            "Qual você prefere? 😊\n\n" +
            "1️⃣ *3 Séries R$ 10,00*\n" +
            "2️⃣ *Completo R$ 20,00*\n\n" +
            "_Responda *1* ou *2*_";

        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar escolha de oferta: ${err?.message}`);
        return false;
    }
}

/**
 * Envia o Pix Copia e Cola formatado em mensagem única.
 * SEM duplicação e com instruções diretas para copiar e pagar.
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

    const text =
        `prontinho! segue o pix da ${planLabel} 👇\n\n` +
        `pra copiar é só tocar e segurar no código aqui embaixo ⬇️\n` +
        `aí abre o app do seu banco ➔ Pix copia e cola ➔ cola e paga:\n\n` +
        `${pixCode}`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar Pix: ${err?.message}`);
        return false;
    }
}

/**
 * Envia a mensagem de remarketing de Pix abandonado:
 * "o pix ainda não apareceu aqui 😊 conseguiu fazer? ..."
 */
export async function sendAbandonedPixRemarketing(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    const text =
        `o pix ainda não apareceu aqui 😊\n` +
        `conseguiu fazer?\n\n` +
        `se travou no banco, me avisa que eu te mando um novinho\n\n` +
        `_Responda:_\n` +
        `*1* - Mandar pix de novo\n` +
        `*2* - Já paguei`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar remarketing: ${err?.message}`);
        return false;
    }
}
