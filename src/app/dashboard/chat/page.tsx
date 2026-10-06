import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatLayoutClient } from "@/components/chat/chat-layout-client";
import { cookies } from "next/headers";
import { canAccessSession } from "@/lib/api-auth";
import { SessionGuard } from "@/components/dashboard/session-guard";

export default async function ChatPage() {
    const session = await auth();

    if (session?.user?.role === "SUPERADMIN") {
        redirect("/dashboard");
    }

    if (!session?.user?.id) return <div>Não autorizado</div>;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    let validSessionId: string | null = null;

    if (sessionId) {
        // Validate access
        const hasAccess = await canAccessSession(session.user.id, session.user.role, sessionId);
        if (hasAccess) {
            // Ideally also check if CONNECTED but canAccessSession checks ownership.
            // We can do an extra check if needed.
            validSessionId = sessionId;
        }
    }

    if (!validSessionId) {
        return (
            <SessionGuard>
                <ChatInterface sessionId={null} />
            </SessionGuard>
        );
    }

    return (
        <div className="-m-3 sm:-m-4 lg:-m-6 p-2 sm:p-3.5 lg:p-4 h-[calc(100vh-4rem)] bg-[#070a0d] flex flex-col min-h-0 overflow-hidden">
            <ChatLayoutClient key={validSessionId} sessionId={validSessionId} />
        </div>
    );
}
