import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { logger } from "@/lib/logger";

/**
 * 1. Envia a mensagem acolhedora de escolha de planos (Opção A) com entrega 100% garantida via Baileys.
 * Valida o interesse do lead, cita a novela solicitada (se veio pelo anúncio) e apresenta as 2 opções com clareza.
 */
export async function sendOfferSelectionMessage(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage,
    siteUrl: string = "https://tvdramareels.online",
    dramaTitle?: string
): Promise<boolean> {
    const dramaMention = dramaTitle ? ` "${dramaTitle}"` : "";

    const text =
        `Oie, que bom te ver por aqui! 🥰🎬\n\n` +
        `A novelinha${dramaMention} tá completa, dublada e em alta definição te esperando pra maratonar sem anúncios!\n\n` +
        `Liberamos 2 opções super acessíveis pra você assistir agora mesmo no celular:\n\n` +
        `1️⃣ *3 Séries completas por apenas R$ 10,00*\n` +
        `✅ Você que escolhe as 3 séries\n` +
        `✅ Acesso enviado no WhatsApp na hora\n\n` +
        `2️⃣ *Catálogo VIP Completo por apenas R$ 20,00* ⭐\n` +
        `✅ Todas as +500 séries liberadas\n` +
        `✅ Assista quantas quiser por 30 dias\n` +
        `✅ Todo dia entra novela nova\n` +
        `✅ Melhor custo-benefício\n\n` +
        `👉 *Responda 1 ou 2* para liberar seu acesso na hora!`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        logger.info("InteractiveButtons", `Mensagem de boas-vindas e oferta entregue para ${jid}`);
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
 * 3. Envia o remarketing de Pix abandonado (15 minutos):
 * "o pix ainda não apareceu aqui 😊..." com cupom de desconto (R$ 7,90 e R$ 15,00)
 */
export async function sendAbandonedPixRemarketing(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    const text =
        `o pix ainda não apareceu aqui 😊\n` +
        `conseguiu fazer?\n\n` +
        `se travou no banco, liberei um cupom especial de desconto pra você:\n` +
        `🎬 *3 Séries por R$ 7,90* (de ~R$ 10,00~)\n` +
        `🔥 *Catálogo Completo por R$ 15,00* (de ~R$ 20,00~)\n\n` +
        `_Responda:_\n` +
        `*1* - Mandar pix de novo (com desconto)\n` +
        `*2* - Já paguei`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        logger.info("InteractiveButtons", `Remarketing 15m entregue via sendMessage para ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar remarketing 15m: ${err?.message}`);
        return false;
    }
}

/**
 * 4. Envia o remarketing de 24 horas (D+1) com o cupom de última chance:
 * 3 Séries por R$ 7,90 ou Catálogo Completo por R$ 15,00
 */
export async function send24hPromoRemarketing(
    sock: WASocket,
    jid: string,
    quoted?: WAMessage
): Promise<boolean> {
    const text =
        `💜 Oie! Passando porque vi que você ainda não conseguiu garantir seu acesso ao TvDrama Reels 😢\n\n` +
        `🎬 Tem mais de 5000 novelinhas curtas, séries dubladas e lançamentos diários te esperando pra maratonar sem anúncios!\n\n` +
        `✨ Pra você não ficar de fora hoje, liberei um *CUPOM EXCLUSIVO DE ÚLTIMA CHANCE*:\n\n` +
        `🎬 *3 Séries por R$ 7,90* (de ~R$ 10,00~)\n` +
        `🔥 *Catálogo Completo VIP por apenas R$ 15,00* (de ~R$ 20,00~)\n\n` +
        `Quer que eu te envie o Pix com o desconto agora? 😊\n\n` +
        `_Responda:_\n` +
        `*1* - 3 Séries (R$ 7,90)\n` +
        `*2* - Catálogo Completo (R$ 15,00)\n` +
        `_(ou responda *QUERO* para liberar o Catálogo Completo)_`;

    try {
        await sock.sendMessage(jid, { text }, quoted ? { quoted } : undefined);
        logger.info("InteractiveButtons", `Remarketing 24h entregue via sendMessage para ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar remarketing 24h: ${err?.message}`);
        return false;
    }
}

/**
 * 5. Envia o remarketing para lead sem resposta (Opção B - após 30 a 45 minutos da 1ª mensagem):
 * Abordagem leve e descontraída com oferta irresistível de R$ 7,90 para destravar a conversa.
 */
export async function sendNoReplyLeadRemarketing(
    sock: WASocket,
    jid: string,
    dramaTitle?: string
): Promise<boolean> {
    const dramaMention = dramaTitle ? ` "${dramaTitle}"` : "";

    const text =
        `Oie! Passando rapidinho pra saber se você ainda quer assistir à novelinha${dramaMention} hoje? 😊\n\n` +
        `Liberamos uma condição especial de *R$ 7,90* pra você começar agora sem anúncios!\n\n` +
        `Quer que eu te envie o Pix com o desconto? Só me responder *QUERO* 🍿`;

    try {
        await sock.sendMessage(jid, { text });
        logger.info("InteractiveButtons", `Follow-up 30m enviado para lead sem resposta em ${jid}`);
        return true;
    } catch (err: any) {
        logger.error("InteractiveButtons", `Erro ao enviar follow-up para ${jid}: ${err?.message}`);
        return false;
    }
}
