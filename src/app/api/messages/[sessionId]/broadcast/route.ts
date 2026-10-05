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

import { executeBroadcastLoop, getActiveBroadcastMap } from "@/modules/whatsapp/broadcast-queue";

export { getActiveBroadcastMap };

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
        if (io) {
            io.to(sessionId).emit("broadcast.progress", {
                broadcastId: log.id,
                status: "running",
                total: recipients.length,
                sent: 0,
                failed: 0,
                current: null,
                progress: 0,
                startedAt: log.startedAt.toISOString()
            });
        }

        // Trigger resilient persistent execution loop
        executeBroadcastLoop(log.id);

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
                map.set(broadcastId, { status: "running", sessionId });
                await prisma.broadcastLog.updateMany({
                    where: { id: broadcastId, sessionId },
                    data: { status: "running" }
                });
                executeBroadcastLoop(broadcastId);
            } else {
                const pausedLogs = await prisma.broadcastLog.findMany({
                    where: { sessionId, status: { in: ["paused", "interrupted"] } }
                });
                await prisma.broadcastLog.updateMany({
                    where: { sessionId, status: { in: ["paused", "interrupted"] } },
                    data: { status: "running" }
                });
                for (const p of pausedLogs) {
                    map.set(p.id, { status: "running", sessionId });
                    executeBroadcastLoop(p.id);
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
