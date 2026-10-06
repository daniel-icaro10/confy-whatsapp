import { auth } from "@/lib/auth";
import { SessionManager } from "@/components/dashboard/session-manager";

import { redirect } from "next/navigation";

export default async function SessionsPage() {
    const session = await auth();

    if (!session?.user || session.user.role === "STAFF") {
        redirect("/dashboard/chat");
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#222d34]/60">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#e9edef] flex items-center gap-2.5">
                        Gerenciar Sessões
                        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            Multi-Device
                        </span>
                    </h1>
                    <p className="text-xs text-[#8696a0] mt-1">
                        Conecte, monitore e administre seus números de WhatsApp conectados ao sistema.
                    </p>
                </div>
            </div>

            <SessionManager user={session?.user} />
        </div>
    );
}
