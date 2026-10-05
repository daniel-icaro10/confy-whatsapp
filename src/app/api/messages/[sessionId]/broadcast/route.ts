import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { waManager } from "@/modules/whatsapp/manager";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import type { AnyMessageContent } from "@whiskeysockets/baileys";
import { formatToWhatsAppJid } from "@/lib/phone-utils";
import { getMessageForContact } from "@/lib/spintax";
import { z } from "zod";

const broadcastBodySchema = z.object({
    recipients: z.array(z.string()),
    message: z.string().optional(),
    messages: z.array(z.string()).optional(),
    distributionMode: z.enum(["random", "round_robin"]).optional(),
    delay: z.number().optional()
});

export const getActiveBroadcastMap = () => {
    if (!(global as any).activeBroadcasts) {
        (global as any).activeBroadcasts = new Map<string, { status: "running" | "paused" | "cancelled" }>();
    }
    return (global as any).activeBroadcasts as Map<string, { status: "running" | "paused" | "cancelled" }>;
};

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Unauthorized", error: "Unauthorized" }, { status: 401 });
        }

        const { sessionId } = await params;
        const body = await request.json();

        const parseResult = broadcastBodySchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
        }

        const { recipients: rawRecipients, delay } = parseResult.data;
        const messageVariations: string[] = [];
        if (parseResult.data.messages && Array.isArray(parseResult.data.messages)) {
            messageVariations.push(...parseResult.data.messages.map(m => m.trim()).filter(Boolean));
        }
        if (messageVariations.length === 0 && parseResult.data.message && parseResult.data.message.trim()) {
            messageVariations.push(parseResult.data.message.trim());
        }

        if (messageVariations.length === 0) {
            return NextResponse.json({ status: false, message: "A mensagem não pode ficar vazia", error: "Message required" }, { status: 400 });
        }

        const distributionMode = parseResult.data.distributionMode || "random";
        const storedMessage = messageVariations.length > 1
            ? JSON.stringify(messageVariations)
            : messageVariations[0];

        const recipients = Array.from(
            new Set(
                rawRecipients
                    .map(r => formatToWhatsAppJid(r))
                    .filter(Boolean)
            )
        );

        if (recipients.length === 0) {
            return NextResponse.json({ status: false, message: "Nenhum destinatário válido informado", error: "No valid recipients" }, { status: 400 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden", error: "Forbidden" }, { status: 403 });
        }

        const instance = waManager.getInstance(sessionId);
        if (!instance?.socket) {
            return NextResponse.json({ status: false, message: "Session not ready", error: "Session not ready" }, { status: 503 });
        }

        // --- Save BroadcastLog & recipients to DB ---
        const log = await prisma.broadcastLog.create({
            data: {
                sessionId,
                message: storedMessage,
                total: recipients.length,
                delay: delay || 2000,
                status: "running",
                recipients: {
                    create: recipients.map(jid => ({
                        jid,
                        status: "pending"
                    }))
                }
            },
            include: { recipients: true }
        });

        const io = (global as any).io;
        const broadcastId = log.id;

        // Register in active in-memory map
        getActiveBroadcastMap().set(broadcastId, { status: "running" });

        // Emit initial state
        if (io) {
            io.to(sessionId).emit("broadcast.progress", {
                broadcastId,
                status: "running",
                total: recipients.length,
                sent: 0,
                failed: 0,
                current: null,
                progress: 0,
                startedAt: log.startedAt.toISOString()
            });
        }

        // Process in background — update DB as we go
        (async () => {
            let sent = 0;
            let failed = 0;
            const errors: { jid: string; error: string }[] = [];

            for (let i = 0; i < recipients.length; i++) {
                // 1. Check if cancelled in memory or DB
                let currentStatus = getActiveBroadcastMap().get(broadcastId)?.status || "running";

                const dbLog = await prisma.broadcastLog.findUnique({
                    where: { id: broadcastId },
                    select: { status: true }
                });

                if (dbLog?.status === "cancelled" || currentStatus === "cancelled") {
                    console.log(`[Broadcast] Disparo ${broadcastId} cancelado. Interrompendo envio.`);
                    getActiveBroadcastMap().set(broadcastId, { status: "cancelled" });
                    break;
                }

                if (dbLog?.status === "paused") {
                    currentStatus = "paused";
                    getActiveBroadcastMap().set(broadcastId, { status: "paused" });
                }

                // If paused, wait until resumed or cancelled
                while (currentStatus === "paused") {
                    await new Promise(r => setTimeout(r, 1000));

                    const memStatus = getActiveBroadcastMap().get(broadcastId)?.status;
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
                        getActiveBroadcastMap().set(broadcastId, { status: "cancelled" });
                        break;
                    } else if (pollDb?.status === "running") {
                        currentStatus = "running";
                        getActiveBroadcastMap().set(broadcastId, { status: "running" });
                        break;
                    }
                }

                if (currentStatus === "cancelled") {
                    console.log(`[Broadcast] Disparo ${broadcastId} cancelado enquanto pausado. Interrompendo.`);
                    break;
                }

                const jid = recipients[i];
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
                                    // Try checking without 9th digit (legacy 8-digit registrations)
                                    const altJid = `55${digits.slice(2, 4)}${digits.slice(5)}@s.whatsapp.net`;
                                    const altCheck = await instance.socket.onWhatsApp(altJid);
                                    const altRes = Array.isArray(altCheck) && altCheck.length > 0 ? altCheck[0] : null;
                                    if (altRes?.exists && altRes.jid) {
                                        targetJid = altRes.jid;
                                        resolved = true;
                                    }
                                } else if (digits.startsWith("55") && digits.length === 12) {
                                    // Try checking with 9th digit
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
                            // In case of transient onWhatsApp network error, proceed with targetJid
                        }
                    }

                    // Dynamically resolve message variation & spintax for this contact
                    const individualMessage = getMessageForContact(messageVariations, i, distributionMode);
                    const messageContent: AnyMessageContent = { text: individualMessage };

                    await instance.socket!.sendMessage(targetJid, messageContent);
                    sent++;

                    // Update recipient status in DB
                    await prisma.broadcastRecipient.updateMany({
                        where: { broadcastLogId: broadcastId, jid },
                        data: { status: "sent", sentAt: new Date() }
                    });
                } catch (e: any) {
                    failed++;
                    errors.push({ jid, error: e.message || "Unknown error" });
                    console.error(`Failed to send broadcast to ${jid}`, e);

                    // Update recipient error in DB
                    await prisma.broadcastRecipient.updateMany({
                        where: { broadcastLogId: broadcastId, jid },
                        data: { status: "failed", error: e.message || "Unknown error" }
                    });
                }

                const progress = Math.round(((sent + failed) / recipients.length) * 100);

                // Update BroadcastLog progress in DB
                await prisma.broadcastLog.update({
                    where: { id: broadcastId },
                    data: { sent, failed }
                });

                // Socket real-time
                if (io) {
                    io.to(sessionId).emit("broadcast.progress", {
                        broadcastId,
                        status: "running",
                        total: recipients.length,
                        sent,
                        failed,
                        current: targetJid,
                        progress
                    });
                }

                // Delay between sends
                if (i < recipients.length - 1) {
                    const baseDelay = delay || 2000;
                    const randomDelay = baseDelay + Math.floor(Math.random() * (baseDelay * 0.5));
                    await new Promise(r => setTimeout(r, randomDelay));
                }
            }

            const wasCancelled = getActiveBroadcastMap().get(broadcastId)?.status === "cancelled" ||
                (await prisma.broadcastLog.findUnique({ where: { id: broadcastId }, select: { status: true } }))?.status === "cancelled";

            const finalStatus = wasCancelled ? "cancelled" : "completed";

            // Mark in DB
            await prisma.broadcastLog.update({
                where: { id: broadcastId },
                data: { status: finalStatus, sent, failed, completedAt: new Date() }
            });

            getActiveBroadcastMap().delete(broadcastId);

            // Final socket emit
            if (io) {
                io.to(sessionId).emit("broadcast.progress", {
                    broadcastId,
                    status: finalStatus,
                    total: recipients.length,
                    sent,
                    failed,
                    errors,
                    progress: Math.round(((sent + failed) / recipients.length) * 100),
                    completedAt: new Date().toISOString()
                });
            }
            console.log(`[Broadcast] Disparo ${broadcastId} finalizado com status "${finalStatus}": ${sent} enviadas, ${failed} falhas de ${recipients.length}`);
        })();

        return NextResponse.json({
            status: true,
            message: "Broadcast started",
            data: { broadcastId: log.id, total: recipients.length }
        });

    } catch (e) {
        console.error("Broadcast error", e);
        return NextResponse.json({ status: false, message: "Failed to start broadcast", error: "Failed to start broadcast" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
        }

        const { sessionId } = await params;
        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden" }, { status: 403 });
        }

        const body = await request.json().catch(() => ({}));
        const { broadcastId, action = "cancel" } = body;

        const map = getActiveBroadcastMap();
        const io = (global as any).io;

        if (action === "pause") {
            if (broadcastId) {
                map.set(broadcastId, { status: "paused" });
                await prisma.broadcastLog.updateMany({
                    where: { id: broadcastId, sessionId },
                    data: { status: "paused" }
                });
            } else {
                await prisma.broadcastLog.updateMany({
                    where: { sessionId, status: "running" },
                    data: { status: "paused" }
                });
                for (const [id, s] of map.entries()) {
                    if (s.status === "running") map.set(id, { status: "paused" });
                }
            }

            if (io) {
                io.to(sessionId).emit("broadcast.progress", {
                    broadcastId,
                    status: "paused"
                });
            }

            return NextResponse.json({ status: true, message: "Disparo pausado com sucesso" });
        }

        if (action === "resume") {
            if (broadcastId) {
                map.set(broadcastId, { status: "running" });
                await prisma.broadcastLog.updateMany({
                    where: { id: broadcastId, sessionId },
                    data: { status: "running" }
                });
            } else {
                await prisma.broadcastLog.updateMany({
                    where: { sessionId, status: "paused" },
                    data: { status: "running" }
                });
                for (const [id, s] of map.entries()) {
                    if (s.status === "paused") map.set(id, { status: "running" });
                }
            }

            if (io) {
                io.to(sessionId).emit("broadcast.progress", {
                    broadcastId,
                    status: "running"
                });
            }

            return NextResponse.json({ status: true, message: "Disparo retomado com sucesso" });
        }

        if (action === "cancel" || action === "stop_all") {
            if (broadcastId) {
                map.set(broadcastId, { status: "cancelled" });
                await prisma.broadcastLog.updateMany({
                    where: { id: broadcastId, sessionId },
                    data: { status: "cancelled", completedAt: new Date() }
                });
            } else {
                await prisma.broadcastLog.updateMany({
                    where: { sessionId, status: { in: ["running", "paused"] } },
                    data: { status: "cancelled", completedAt: new Date() }
                });
                for (const [id] of map.entries()) {
                    map.set(id, { status: "cancelled" });
                }
            }

            if (io) {
                io.to(sessionId).emit("broadcast.progress", {
                    broadcastId,
                    status: "cancelled"
                });
            }

            return NextResponse.json({ status: true, message: "Disparo interrompido e cancelado com sucesso" });
        }

        return NextResponse.json({ status: false, message: "Ação inválida" }, { status: 400 });
    } catch (e: any) {
        console.error("Broadcast control error:", e);
        return NextResponse.json({ status: false, message: e.message || "Erro ao controlar disparo" }, { status: 500 });
    }
}
