import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";

export async function GET(
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

        const current = await prisma.broadcastLog.findFirst({
            where: {
                sessionId,
                status: { in: ["running", "paused"] }
            },
            orderBy: { startedAt: "desc" }
        });

        return NextResponse.json({ status: true, data: current });
    } catch (e: any) {
        console.error("Broadcast current error:", e);
        return NextResponse.json({ status: false, message: "Failed to fetch current broadcast" }, { status: 500 });
    }
}
