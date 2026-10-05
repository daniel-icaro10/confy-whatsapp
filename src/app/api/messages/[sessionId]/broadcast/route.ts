import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { waManager } from "@/modules/whatsapp/manager";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import type { AnyMessageContent } from "@whiskeysockets/baileys";
import { z } from "zod";

const broadcastBodySchema = z.object({
    recipients: z.array(z.string()),
    message: z.string().min(1),
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

        const { recipients, message, delay } = parseResult.data;

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
                message,
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

        const messageContent: AnyMessageContent = { text: message };
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
                try {
                    await instance.socket!.sendMessage(jid, messageContent);
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
                        current: jid,
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
