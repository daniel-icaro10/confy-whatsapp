import { prisma } from "@/lib/prisma";
import { waManager } from "@/modules/whatsapp/manager";
import type { AnyMessageContent } from "@whiskeysockets/baileys";
import { getMessageForContact } from "@/lib/spintax";
import { logger } from "@/lib/logger";

export interface ActiveBroadcast {
    status: "running" | "paused" | "cancelled";
    sessionId?: string;
}

export const getActiveBroadcastMap = (): Map<string, ActiveBroadcast> => {
    if (!(global as any).activeBroadcasts) {
        (global as any).activeBroadcasts = new Map<string, ActiveBroadcast>();
    }
    return (global as any).activeBroadcasts as Map<string, ActiveBroadcast>;
};

/**
 * Executes or resumes a broadcast loop for pending recipients.
 * Safe against server restarts: reads remaining "pending" recipients directly from DB.
 */
export async function executeBroadcastLoop(broadcastId: string): Promise<void> {
    const map = getActiveBroadcastMap();

    const log = await prisma.broadcastLog.findUnique({
        where: { id: broadcastId },
        include: {
            recipients: {
                where: { status: "pending" }
            }
        }
    });

    if (!log) {
        logger.error("Broadcast", `Broadcast ${broadcastId} not found`);
        return;
    }

    const { sessionId, delay, message: rawMessage } = log;
    const pendingRecipients = log.recipients;

    if (pendingRecipients.length === 0) {
        await prisma.broadcastLog.update({
            where: { id: broadcastId },
            data: { status: "completed", completedAt: new Date() }
        });
        map.delete(broadcastId);
        logger.info("Broadcast", `Broadcast ${broadcastId} has no pending recipients. Marked as completed.`);
        return;
    }

    // Parse stored message variations
    let messageVariations: string[] = [];
    try {
        if (rawMessage.startsWith("[") && rawMessage.endsWith("]")) {
            const parsed = JSON.parse(rawMessage);
            if (Array.isArray(parsed)) messageVariations = parsed;
        }
    } catch {
        // Not a JSON array, treat as single message
    }
    if (messageVariations.length === 0) {
        messageVariations = [rawMessage];
    }

    // Register in memory map
    map.set(broadcastId, { status: "running", sessionId });

    const instance = waManager.getInstance(sessionId);
    if (!instance?.socket) {
        logger.error("Broadcast", `Cannot run broadcast ${broadcastId}: WhatsApp session ${sessionId} is not connected`);
        await prisma.broadcastLog.update({
            where: { id: broadcastId },
            data: { status: "interrupted" }
        });
        map.set(broadcastId, { status: "paused", sessionId });
        return;
    }

    const io = (global as any).io;

    logger.info("Broadcast", `Starting/Resuming broadcast ${broadcastId} with ${pendingRecipients.length} pending recipients (delay: ${delay}ms)`);

    // Run execution loop asynchronously
    (async () => {
        let sent = log.sent;
        let failed = log.failed;
        const total = log.total;
        const errors: { jid: string; error: string }[] = [];

        for (let i = 0; i < pendingRecipients.length; i++) {
            // Check status in memory and DB
            let currentStatus = map.get(broadcastId)?.status || "running";

            const dbLog = await prisma.broadcastLog.findUnique({
                where: { id: broadcastId },
                select: { status: true }
            });

            if (dbLog?.status === "cancelled" || currentStatus === "cancelled") {
                logger.warn("Broadcast", `Disparo ${broadcastId} cancelado.`);
                map.set(broadcastId, { status: "cancelled", sessionId });
                break;
            }

            if (dbLog?.status === "paused") {
                currentStatus = "paused";
                map.set(broadcastId, { status: "paused", sessionId });
            }

            // Pause wait loop
            while (currentStatus === "paused") {
                await new Promise(r => setTimeout(r, 1000));
                const memStatus = map.get(broadcastId)?.status;
                if (memStatus === "cancelled") {
                    currentStatus = "cancelled";
                    break;
                }
                if (memStatus === "running") {
                    currentStatus = "running";
                    break;
                }

                const pollDb = await prisma.broadcastLog.findUnique({
                    where: { id: broadcastId },
                    select: { status: true }
                });
                if (pollDb?.status === "cancelled") {
                    currentStatus = "cancelled";
                    map.set(broadcastId, { status: "cancelled", sessionId });
                    break;
                } else if (pollDb?.status === "running") {
                    currentStatus = "running";
                    map.set(broadcastId, { status: "running", sessionId });
                    break;
                }
            }

            if (currentStatus === "cancelled") {
                break;
            }

            const recipient = pendingRecipients[i];
            const jid = recipient.jid;
            let targetJid = jid;

            try {
                // Verify recipient on WhatsApp if available and not a group/broadcast
                if (instance.socket?.onWhatsApp && !jid.endsWith("@g.us") && !jid.endsWith("@broadcast")) {
                    try {
                        const check = await instance.socket.onWhatsApp(jid);
                        const res = Array.isArray(check) && check.length > 0 ? check[0] : null;

                        if (res?.exists && res.jid) {
                            targetJid = res.jid;
                        } else {
                            // Fallback check for Brazilian numbers (9th digit divergence)
                            const digits = jid.replace("@s.whatsapp.net", "");
                            let resolved = false;

                            if (digits.startsWith("55") && digits.length === 13) {
                                const altJid = `55${digits.slice(2, 4)}${digits.slice(5)}@s.whatsapp.net`;
                                const altCheck = await instance.socket.onWhatsApp(altJid);
                                const altRes = Array.isArray(altCheck) && altCheck.length > 0 ? altCheck[0] : null;
                                if (altRes?.exists && altRes.jid) {
                                    targetJid = altRes.jid;
                                    resolved = true;
                                }
                            } else if (digits.startsWith("55") && digits.length === 12) {
                                const altJid = `55${digits.slice(2, 4)}9${digits.slice(4)}@s.whatsapp.net`;
                                const altCheck = await instance.socket.onWhatsApp(altJid);
                                const altRes = Array.isArray(altCheck) && altCheck.length > 0 ? altCheck[0] : null;
                                if (altRes?.exists && altRes.jid) {
                                    targetJid = altRes.jid;
                                    resolved = true;
                                }
                            }

                            if (!resolved) {
                                throw new Error("Número não cadastrado no WhatsApp");
                            }
                        }
                    } catch (checkErr: any) {
                        if (checkErr.message === "Número não cadastrado no WhatsApp") {
                            throw checkErr;
                        }
                    }
                }

                // Resolve message variation & spintax
                const individualMessage = getMessageForContact(messageVariations, sent + failed, "random");
                if (!instance.socket) {
                    throw new Error("Sessão desconectada durante o disparo");
                }
                const messageContent: AnyMessageContent = { text: individualMessage };
                await instance.socket.sendMessage(targetJid, messageContent);
                sent++;

                await prisma.broadcastRecipient.update({
                    where: { id: recipient.id },
                    data: { status: "sent", sentAt: new Date() }
                });
            } catch (e: any) {
                failed++;
                errors.push({ jid, error: e.message || "Unknown error" });
                logger.error("Broadcast", `Failed to send broadcast to ${jid}:`, e.message);

                await prisma.broadcastRecipient.update({
                    where: { id: recipient.id },
                    data: { status: "failed", error: e.message || "Unknown error" }
                });
            }

            const progress = Math.round(((sent + failed) / total) * 100);

            // Update BroadcastLog progress in DB
            await prisma.broadcastLog.update({
                where: { id: broadcastId },
                data: { sent, failed }
            });

            // Emit real-time progress via socket
            if (io) {
                io.to(sessionId).emit("broadcast.progress", {
                    broadcastId,
                    status: "running",
                    total,
                    sent,
                    failed,
                    current: jid,
                    progress,
                    startedAt: log.startedAt.toISOString()
                });
            }

            // Apply configured anti-ban delay with jitter
            if (i < pendingRecipients.length - 1) {
                const jitter = Math.floor(Math.random() * 500);
                await new Promise(r => setTimeout(r, (delay || 2000) + jitter));
            }
        }

        const wasCancelled = map.get(broadcastId)?.status === "cancelled" ||
            (await prisma.broadcastLog.findUnique({ where: { id: broadcastId }, select: { status: true } }))?.status === "cancelled";

        const finalStatus = wasCancelled ? "cancelled" : "completed";

        await prisma.broadcastLog.update({
            where: { id: broadcastId },
            data: { status: finalStatus, sent, failed, completedAt: new Date() }
        });

        map.delete(broadcastId);

        if (io) {
            io.to(sessionId).emit("broadcast.progress", {
                broadcastId,
                status: finalStatus,
                total,
                sent,
                failed,
                errors,
                progress: Math.round(((sent + failed) / total) * 100),
                completedAt: new Date().toISOString()
            });
        }

        logger.success("Broadcast", `Disparo ${broadcastId} concluído com status "${finalStatus}": ${sent} enviadas, ${failed} falhas de ${total}`);
    })();
}

/**
 * Scan database on server boot to find and recover any broadcasts
 * that were left in "running" status when the process crashed or restarted.
 */
export async function recoverInterruptedBroadcasts(): Promise<void> {
    try {
        const interrupted = await prisma.broadcastLog.findMany({
            where: { status: "running" },
            include: {
                _count: {
                    select: {
                        recipients: {
                            where: { status: "pending" }
                        }
                    }
                }
            }
        });

        if (interrupted.length === 0) {
            logger.info("BroadcastQueue", "No interrupted broadcasts found on startup.");
            return;
        }

        logger.warn("BroadcastQueue", `Found ${interrupted.length} interrupted broadcasts from previous shutdown.`);

        for (const log of interrupted) {
            const pendingCount = log._count.recipients;
            if (pendingCount === 0) {
                // All were already sent, just close it
                await prisma.broadcastLog.update({
                    where: { id: log.id },
                    data: { status: "completed", completedAt: new Date() }
                });
            } else {
                // Mark as paused/interrupted so user can resume anytime with 1 click
                await prisma.broadcastLog.update({
                    where: { id: log.id },
                    data: { status: "paused" }
                });
                logger.info("BroadcastQueue", `Broadcast ${log.id} (${pendingCount} pending) marked as "paused" for safe resumption.`);
            }
        }
    } catch (error) {
        logger.error("BroadcastQueue", "Error recovering interrupted broadcasts:", error);
    }
}
