import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { logger } from "@/lib/logger";

/**
 * 1. Envia a mensagem de escolha de planos com entrega 100% garantida via sendMessage do Baileys.
 * Utiliza o texto rico e persuasivo solicitado, com o link do catálogo e instruções diretas (1 ou 2).
 * Evita o descarte silencioso do WhatsApp que ocorre ao tentar enviar botões interativos via relayMessage em contas Web.
 */
export async function sendOfferSelectionMessage(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage,
    siteUrl: string = "https://tvdramareels.online"
): Promise<boolean> {
    const cleanSiteUrl = (siteUrl || "https://tvdramareels.online").replace(/\/+$/, "");

    const text =
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
        `✅ Depois do pagamento a série chega aqui na hora\n\n` +
        `_Responda *1* para 3 Séries ou *2* para Catálogo Completo_`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        logger.info("InteractiveButtons", `Mensagem de oferta entregue via sendMessage para ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar escolha de oferta: ${err?.message}`);
        return false;
    }
}

/**
 * 2. Envia a cobrança Pix em 2 etapas para facilitar a cópia com 1 toque no celular:
 * Etapa 1: Instruções claras de pagamento (sem o código, sem gerar QR code duplicado)
 * Etapa 2: APENAS o código Pix Copia e Cola puro, isolado em sua própria bolha
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

    const instructionText =
        `prontinho! segue o pix da ${planLabel} 👇\n\n` +
        `pra copiar é só tocar no código que enviei logo abaixo ⬇️\n` +
        `aí abre o app do seu banco ➔ Pix copia e cola ➔ cola e paga`;

    try {
        // 1. Envia a mensagem explicativa
        await sock.sendMessage(jid, { text: instructionText }, quoted ? { quoted } : undefined);

        // 2. Envia o código Pix isolado em bolha própria para cópia com 1 clique no celular
        if (cleanPixCode) {
            await new Promise((resolve) => setTimeout(resolve, 350));
            await sock.sendMessage(jid, { text: cleanPixCode });
        }

        logger.info("InteractiveButtons", `Pix entregue com sucesso via sendMessage para ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar Pix: ${err?.message}`);
        return false;
    }
}

/**
 * 3. Envia o remarketing de Pix abandonado:
 * "o pix ainda não apareceu aqui 😊..."
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
        logger.info("InteractiveButtons", `Remarketing entregue via sendMessage para ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar remarketing: ${err?.message}`);
        return false;
    }
}
