import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { waManager } from "./manager";
import { logger } from "@/lib/logger";
import { sendAbandonedPixRemarketing } from "./interactive-buttons";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Remarketing de Pix Abandonado:
 * Dispara uma mensagem amigável no WhatsApp 15 minutos após a geração do Pix
 * caso o cliente ainda não tenha concluído o pagamento.
 * Exibe exatamente o layout com os 2 botões rápidos ("Mandar pix de novo" e "Já paguei").
 */
export async function runPixAbandonRemarketing(): Promise<{ processed: number; sent: number; skipped: number }> {
    let processed = 0;
    let sent = 0;
    let skipped = 0;

    try {
        const config = await ensureFunnelConfig();
        if ((config as any).pixAbandonRemarketingEnabled === false) {
            return { processed, sent, skipped };
        }

        const waitMinutes = Number((config as any).pixAbandonMinutes) || 15;
        const now = Date.now();
        const maxCreatedAt = new Date(now - waitMinutes * 60 * 1000);
        // Não envia para pedidos com mais de 24 horas para evitar disparos indevidos
        const minCreatedAt = new Date(now - 24 * 60 * 60 * 1000);

        const pendingOrders = await prisma.pixOrder.findMany({
            where: {
                status: "PENDING",
                remarketingSentAt: null,
                createdAt: {
                    gte: minCreatedAt,
                    lte: maxCreatedAt
                }
            },
            take: 15,
            orderBy: { createdAt: "asc" }
        });

        if (pendingOrders.length === 0) {
            return { processed, sent, skipped };
        }

        logger.info("Remarketing", `Encontrados ${pendingOrders.length} pedidos Pix pendentes para remarketing.`);

        for (const order of pendingOrders) {
            processed++;
            const cleanPhone = normalizeBrPhone(order.phone);
            if (!cleanPhone) {
                await prisma.pixOrder.update({
                    where: { id: order.id },
                    data: { remarketingSentAt: new Date(), remarketingStatus: "FAILED_INVALID_PHONE" }
                }).catch(() => {});
                skipped++;
                continue;
            }

            // 1. Verifica se o lead já possui acesso VIP ativo (pode ter pago via cartão ou outro pedido)
            const variants = getPhoneVariants(cleanPhone);
            const activeVip = await prisma.viewerAccess.findFirst({
                where: {
                    phone: { in: variants },
                    isVip: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                }
            });

            if (activeVip) {
                await prisma.pixOrder.update({
                    where: { id: order.id },
                    data: {
                        remarketingSentAt: new Date(),
                        remarketingStatus: "SKIPPED_ALREADY_VIP"
                    }
                }).catch(() => {});
                skipped++;
                continue;
            }

            // 2. Busca a sessão conectada ativa no WhatsApp
            const sessionResult = waManager.getSessionOrAnyActive(order.sessionId || config.sessionId);
            if (!sessionResult || !sessionResult.instance.socket) {
                logger.warn("Remarketing", `Nenhuma sessão WhatsApp ativa para enviar remarketing da ordem ${order.id}. Aguardando reconexão.`);
                break; // Aguarda o WhatsApp reconectar
            }

            const targetJid = order.jid || `${cleanPhone}@s.whatsapp.net`;

            try {
                // Envia a mensagem interativa de remarketing idêntica ao print com os 2 botões rápidos
                // SEM mensagem duplicada de Pix
                await sendAbandonedPixRemarketing(sessionResult.instance.socket, targetJid);

                await prisma.pixOrder.update({
                    where: { id: order.id },
                    data: {
                        remarketingSentAt: new Date(),
                        remarketingStatus: "SENT"
                    }
                });

                sent++;
                logger.success("Remarketing", `Mensagem de remarketing Pix enviada para ${targetJid} (Pedido ${order.id})`);

                // Pausa anti-spam de 2 segundos entre envios
                await sleep(2000);
            } catch (err: any) {
                logger.error("Remarketing", `Erro ao enviar remarketing para ${targetJid}:`, err?.message);
                await prisma.pixOrder.update({
                    where: { id: order.id },
                    data: {
                        remarketingSentAt: new Date(),
                        remarketingStatus: "FAILED_SEND_ERROR"
                    }
                }).catch(() => {});
                skipped++;
            }
        }
    } catch (e: any) {
        logger.error("Remarketing", "Erro no motor de remarketing de Pix abandonado:", e?.message);
    }

    return { processed, sent, skipped };
}

/**
 * Lembrete de Renovação:
 * Envia um aviso no WhatsApp no 29º dia de acesso (entre 24h e 36h antes do vencimento)
 * para reativar o acesso por mais 30 dias.
 */
export async function runRenewalReminder(): Promise<{ processed: number; sent: number; skipped: number }> {
    let processed = 0;
    let sent = 0;
    let skipped = 0;

    try {
        const config = await ensureFunnelConfig();
        if ((config as any).renewalReminderEnabled === false) {
            return { processed, sent, skipped };
        }

        const now = new Date();
        const daysBefore = Number((config as any).renewalReminderDaysBefore) || 1;
        // Janela de 24h a 36h antes do vencimento (29º dia de um ciclo de 30 dias)
        const threshold = new Date(now.getTime() + (daysBefore * 24 + 12) * 60 * 60 * 1000);

        const expiringViewers = await prisma.viewerAccess.findMany({
            where: {
                isVip: true,
                expiresAt: {
                    gt: now,
                    lte: threshold
                },
                renewalReminderSentAt: null
            },
            take: 15,
            orderBy: { expiresAt: "asc" }
        });

        if (expiringViewers.length === 0) {
            return { processed, sent, skipped };
        }

        logger.info("RenewalReminder", `Encontrados ${expiringViewers.length} assinantes no 29º dia para lembrete de renovação.`);

        const baseSiteUrl = (
            config.siteUrl ||
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://tvdramareels.online"
        ).replace(/\/+$/, "");

        const defaultTemplate =
            (config as any).renewalReminderMessage?.trim() ||
            `Oi, {{NOME}}! Passando com um aviso importante: ⏳\n\nSeu acesso VIP ao *TvDrama Reels* vence amanhã! 🎬🍿\n\nPara você continuar assistindo todas as suas séries favoritas sem interrupção e aproveitar todos os novos lançamentos diários, você pode renovar seu acesso por mais 30 dias por apenas *R$ 20,00*.\n\n👉 Para renovar agora no Pix ou Cartão com liberação imediata, clique aqui:\n{{LINK_RENOVACAO}}\n\nOu se preferir, basta responder *RENOVAR* aqui que eu já gero o seu Pix na hora! ❤️`;

        for (const viewer of expiringViewers) {
            processed++;
            const cleanPhone = normalizeBrPhone(viewer.phone);
            if (!cleanPhone) {
                await prisma.viewerAccess.update({
                    where: { id: viewer.id },
                    data: { renewalReminderSentAt: new Date() }
                }).catch(() => {});
                skipped++;
                continue;
            }

            const sessionResult = waManager.getSessionOrAnyActive(config.sessionId);
            if (!sessionResult || !sessionResult.instance.socket) {
                logger.warn("RenewalReminder", "Nenhuma sessão WhatsApp ativa para enviar lembrete de renovação. Aguardando.");
                break;
            }

            const targetJid = `${cleanPhone}@s.whatsapp.net`;
            const customerName = (viewer.name || "amigo(a)").split(" ")[0];
            const renewalLink = `${baseSiteUrl}/?phone=${cleanPhone}&renew=true`;

            const messageText = defaultTemplate
                .replace(/\{\{NOME\}\}/g, customerName)
                .replace(/\{\{TELEFONE\}\}/g, cleanPhone)
                .replace(/\{\{LINK_RENOVACAO\}\}/g, renewalLink)
                .replace(/\{\{LINK_SITE\}\}/g, baseSiteUrl)
                .replace(/\{\{VALOR\}\}/g, "20,00");

            try {
                await sessionResult.instance.socket.sendMessage(targetJid, { text: messageText });

                await prisma.viewerAccess.update({
                    where: { id: viewer.id },
                    data: { renewalReminderSentAt: new Date() }
                });

                sent++;
                logger.success("RenewalReminder", `Lembrete de renovação enviado para ${targetJid}`);

                await sleep(2000);
            } catch (err: any) {
                logger.error("RenewalReminder", `Erro ao enviar lembrete para ${targetJid}:`, err?.message);
                await prisma.viewerAccess.update({
                    where: { id: viewer.id },
                    data: { renewalReminderSentAt: new Date() }
                }).catch(() => {});
                skipped++;
            }
        }
    } catch (e: any) {
        logger.error("RenewalReminder", "Erro no motor de lembrete de renovação:", e?.message);
    }

    return { processed, sent, skipped };
}

/**
 * Executa ambos os motores (Pix abandonado + lembrete de renovação)
 */
export async function runRemarketingAndRenewalJobs() {
    await runPixAbandonRemarketing();
    await runRenewalReminder();
}
