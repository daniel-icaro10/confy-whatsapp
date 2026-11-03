import { auth } from "@/lib/auth";
import { Navbar } from "@/components/dashboard/navbar";
import { SessionProvider } from "@/components/dashboard/session-provider";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { SidebarShell } from "@/components/dashboard/sidebar-shell";
import { Toaster } from "sonner";
import pkg from "../../../package.json";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const appName = "Segredos do Coração";

    return (
        <SessionProvider>
            <SidebarProvider>
                <div
                    className="flex h-screen bg-[#08050a] text-white relative overflow-hidden"
                    suppressHydrationWarning={true}
                >
                    <div
                        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
                        suppressHydrationWarning={true}
                    >
                        <div className="absolute -top-[20%] -left-[10%] w-[35rem] h-[35rem] bg-rose-600/[0.06] rounded-full blur-[110px]" />
                        <div className="absolute -bottom-[20%] -right-[10%] w-[25rem] h-[25rem] bg-pink-600/[0.05] rounded-full blur-[90px]" />
                    </div>

                    <SidebarShell
                        appName={appName}
                        userName={session?.user?.name}
                        userEmail={session?.user?.email}
                        version={pkg.version}
                    />

                    <div
                        className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10"
                        suppressHydrationWarning={true}
                    >
                        <Navbar appName={appName} />
                        <main className="flex-1 overflow-auto p-4 sm:p-6 styled-scrollbar">
                            {children}
                        </main>
                    </div>
                    <Toaster theme="dark" />
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}
