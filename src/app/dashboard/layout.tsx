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
    const appName = "TvDrama Reels";

    return (
        <SessionProvider>
            <SidebarProvider>
                <div
                    className="flex h-screen bg-[#0a0a0a] text-[#ededed] overflow-hidden"
                    suppressHydrationWarning={true}
                >
                    <SidebarShell
                        appName={appName}
                        userName={session?.user?.name}
                        userEmail={session?.user?.email}
                        version={pkg.version}
                    />

                    <div
                        className="flex-1 flex flex-col overflow-hidden min-w-0"
                        suppressHydrationWarning={true}
                    >
                        <Navbar appName={appName} />
                        <main className="flex-1 overflow-auto p-6">
                            {children}
                        </main>
                    </div>
                    <Toaster theme="dark" />
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}
