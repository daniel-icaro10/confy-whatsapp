import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { getAvatar } from "@/modules/whatsapp/avatar.service";

// GET: Cached profile picture (JPEG) for a chat — usable directly as <img src>
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string; jid: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Unauthorized", error: "Unauthorized" }, { status: 401 });
        }

        const { sessionId, jid } = await params;

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden - Cannot access this session", error: "Forbidden - Cannot access this session" }, { status: 403 });
        }

        const decodedJid = decodeURIComponent(jid);
        const avatar = decodedJid.endsWith("@broadcast") ? null : await getAvatar(sessionId, decodedJid);

        if (!avatar) {
            return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, max-age=600" } });
        }

        return new NextResponse(new Uint8Array(avatar), {
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "private, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Fetch avatar error:", error);
        return NextResponse.json({ status: false, message: "Failed to fetch avatar", error: "Failed to fetch avatar" }, { status: 500 });
    }
}
