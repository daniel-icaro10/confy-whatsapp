"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: Array<"SUPERADMIN" | "OWNER" | "STAFF">;
    fallbackTitle?: string;
    fallbackDescription?: string;
}

export function RoleGuard({
    children,
    allowedRoles,
    fallbackTitle = "Acesso Restrito",
    fallbackDescription = "Seu perfil de usuário não possui permissão para acessar esta área administrativa."
}: RoleGuardProps) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex h-[50vh] items-center justify-center p-8 text-sm text-muted-foreground">
                Verificando permissões...
            </div>
        );
    }

    // @ts-ignore
    const userRole = (session?.user?.role || "STAFF") as "SUPERADMIN" | "OWNER" | "STAFF";

    if (!allowedRoles.includes(userRole)) {
        return (
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-6 text-center p-6">
                <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">{fallbackTitle}</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {fallbackDescription}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link href={userRole === "SUPERADMIN" ? "/dashboard" : "/dashboard/chat"}>
                        <Button className="gap-2 text-xs" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            {userRole === "SUPERADMIN" ? "Voltar ao Painel Master" : "Ir para o Atendimento / Chat"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
