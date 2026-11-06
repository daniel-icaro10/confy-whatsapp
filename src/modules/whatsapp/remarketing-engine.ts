import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone, getPhoneVariants } from "@/lib/segredos-defaults";
import { waManager } from "./manager";
import { logger } from "@/lib/logger";
import {
    sendAbandonedPixRemarketing,
    send24hPromoRemarketing,
    sendNoReplyLeadRemarketing
} from "./interactive-buttons";

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
                        remarketingStatus: "STAGE_1_SENT"
                    }
                });

                sent++;
                logger.success("Remarketing", `Mensagem de remarketing Pix 15m enviada para ${targetJid} (Pedido ${order.id})`);

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

        // ETAPA 2: Remarketing de 24 Horas com Cupom de Última Chance (R$ 7,90 e R$ 15,00)
        const minCreatedAt24h = new Date(now - 72 * 60 * 60 * 1000);
        const maxCreatedAt24h = new Date(now - 24 * 60 * 60 * 1000);

        const pendingOrders24h = await prisma.pixOrder.findMany({
            where: {
                status: "PENDING",
                remarketingStatus: { in: ["SENT", "STAGE_1_SENT"] },
                createdAt: {
                    gte: minCreatedAt24h,
                    lte: maxCreatedAt24h
                }
            },
            take: 15,
            orderBy: { createdAt: "asc" }
        });

        for (const order of pendingOrders24h) {
            processed++;
            const cleanPhone = normalizeBrPhone(order.phone);
            if (!cleanPhone) continue;

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
                    data: { remarketingStatus: "SKIPPED_ALREADY_VIP" }
                }).catch(() => {});
                skipped++;
                continue;
            }

            const sessionResult = waManager.getSessionOrAnyActive(order.sessionId || config.sessionId);
            if (!sessionResult || !sessionResult.instance.socket) break;

            const targetJid = order.jid || `${cleanPhone}@s.whatsapp.net`;

            try {
                await send24hPromoRemarketing(sessionResult.instance.socket, targetJid);
                await prisma.pixOrder.update({
                    where: { id: order.id },
                    data: { remarketingStatus: "STAGE_2_SENT" }
                });
                sent++;
                logger.success("Remarketing", `Mensagem 24h promocional enviada para ${targetJid} (Pedido ${order.id})`);
                await sleep(2000);
            } catch (err: any) {
                logger.error("Remarketing", `Erro ao enviar remarketing 24h para ${targetJid}:`, err?.message);
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
 * Remarketing para Leads Sem Resposta (Opção B):
 * Dispara uma mensagem amigável no WhatsApp após 30 a 45 minutos do 1º contato
 * caso o cliente NÃO tenha respondido à 1ª mensagem (não gerou Pix, não comprou e não interagiu mais).
 * Oferece a condição promocional de R$ 7,90 para destravar a conversa.
 */
export async function runNoReplyLeadRemarketing(): Promise<{ processed: number; sent: number; skipped: number }> {
    let processed = 0;
    let sent = 0;
    let skipped = 0;

    try {
        const config = await ensureFunnelConfig();
        if (!config.enabled) {
            return { processed, sent, skipped };
        }

        const now = Date.now();
        // Dispara para leads que entraram em contato entre 30 minutos e 24 horas atrás
        const maxCreatedAt = new Date(now - 30 * 60 * 1000); // Mais de 30 minutos
        const minCreatedAt = new Date(now - 24 * 60 * 60 * 1000); // Menos de 24 horas

        // Busca tickets abertos sem atendente atribuído criados no período
        const candidates = await prisma.ticket.findMany({
            where: {
                status: "OPEN" as any,
                assignedUserId: null,
                createdAt: {
                    gte: minCreatedAt,
                    lte: maxCreatedAt
                }
            },
            take: 20,
            orderBy: { createdAt: "asc" }
        });

        if (candidates.length === 0) {
            return { processed, sent, skipped };
        }

        for (const ticket of candidates) {
            processed++;
            const cleanPhone = normalizeBrPhone(ticket.jid);
            if (!cleanPhone) {
                skipped++;
                continue;
            }

            // 1. Verifica se já enviou follow-up para este ticket
            const alreadySent = await prisma.ticketActivity.findFirst({
                where: {
                    ticketId: ticket.id,
                    type: "FUNNEL_NO_REPLY_FOLLOWUP_SENT"
                }
            });
            if (alreadySent) {
                skipped++;
                continue;
            }

            // 2. Verifica se o lead é assinante VIP ativo
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
                skipped++;
                continue;
            }

            // 3. Verifica se o lead já gerou um Pix (se gerou, o remarketing de Pix abandonado cuida dele)
            const existingPixOrder = await prisma.pixOrder.findFirst({
                where: { phone: { in: variants } }
            });
            if (existingPixOrder) {
                skipped++;
                continue;
            }

            // 4. Verifica as mensagens do cliente
            const clientMessages = await prisma.message.findMany({
                where: {
                    remoteJid: ticket.jid,
                    fromMe: false
                },
                orderBy: { timestamp: "asc" }
            });

            // Se o lead mandou mais de uma mensagem, ele interagiu (não está totalmente mudo)
            if (clientMessages.length > 1) {
                skipped++;
                continue;
            }

            // 5. Extrai o nome da novela (se tiver no texto do 1º contato do lead)
            let dramaTitle: string | undefined;
            if (clientMessages.length === 1 && clientMessages[0].content) {
                const match = clientMessages[0].content.match(/\(([^)]+)\)/);
                if (match) dramaTitle = match[1].trim();
            }

            // 6. Busca a sessão conectada ativa no WhatsApp
            const sessionResult = waManager.getSessionOrAnyActive(config.sessionId);
            if (!sessionResult || !sessionResult.instance.socket) {
                logger.warn("Remarketing", `Nenhuma sessão WhatsApp ativa para follow-up sem resposta. Aguardando reconexão.`);
                break;
            }

            const targetJid = ticket.jid.includes("@") ? ticket.jid : `${cleanPhone}@s.whatsapp.net`;

            try {
                // Envia a mensagem calorosa com o cupom de R$ 7,90 (Opção B)
                await sendNoReplyLeadRemarketing(sessionResult.instance.socket, targetJid, dramaTitle);

                // Registra o envio para nunca duplicar
                await prisma.ticketActivity.create({
                    data: {
                        ticketId: ticket.id,
                        type: "FUNNEL_NO_REPLY_FOLLOWUP_SENT",
                        content: `Follow-up 30m enviado com sucesso (R$ 7,90)${dramaTitle ? ` - ${dramaTitle}` : ""}`
                    }
                }).catch(() => {});

                sent++;
                logger.success("Remarketing", `Follow-up de lead sem resposta (30m) enviado para ${targetJid}`);
                await sleep(2000);
            } catch (err: any) {
                logger.error("Remarketing", `Erro ao enviar follow-up para ${targetJid}:`, err?.message);
                skipped++;
            }
        }
    } catch (e: any) {
        logger.error("Remarketing", "Erro no motor de follow-up de leads sem resposta:", e?.message);
    }

    return { processed, sent, skipped };
}

/**
 * Executa todos os motores de automação do funil:
 * 1. Pix abandonado (15 min e 24 horas)
 * 2. Follow-up de lead sem resposta (30 a 45 min)
 * 3. Lembrete de renovação (29º dia)
 */
export async function runRemarketingAndRenewalJobs() {
    await runPixAbandonRemarketing();
    await runNoReplyLeadRemarketing();
    await runRenewalReminder();
}
