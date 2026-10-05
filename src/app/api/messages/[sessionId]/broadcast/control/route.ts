import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";

const getActiveBroadcastMap = () => {
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
