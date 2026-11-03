import { auth } from "@/lib/auth";
import { Navbar } from "@/components/dashboard/navbar";
import { SessionProvider } from "@/components/dashboard/session-provider";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { SidebarShell } from "@/components/dashboard/sidebar-shell";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import pkg from "../../../package.json";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    // @ts-ignore
    let systemConfig = null;
    try {
        systemConfig = await prisma.systemConfig.findUnique({ where: { id: "default" } });
    } catch {
        // Database connection fallback
    }
    const appName =
        systemConfig?.appName &&
        systemConfig.appName !== "WA-AKG" &&
        systemConfig.appName !== "Confy WhatsApp"
            ? systemConfig.appName
            : "Segredos do Coração";

    return (
        <SessionProvider>
            <SidebarProvider>
                <div className="flex h-screen bg-background relative overflow-hidden" suppressHydrationWarning={true}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" suppressHydrationWarning={true}>
                        <div className="absolute -top-[20%] -left-[10%] w-[35rem] h-[35rem] bg-rose-500/[0.04] rounded-full blur-[100px]" />
                        <div className="absolute -bottom-[20%] -right-[10%] w-[25rem] h-[25rem] bg-pink-500/[0.04] rounded-full blur-[80px]" />
                    </div>

                    <SidebarShell
                        appName={appName}
                        userName={session?.user?.name}
                        userEmail={session?.user?.email}
                        version={pkg.version}
                    />

                    <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10" suppressHydrationWarning={true}>
                        <Navbar appName={appName} />
                        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 styled-scrollbar">
                            {children}
                        </main>
                    </div>
                    <Toaster />
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}
