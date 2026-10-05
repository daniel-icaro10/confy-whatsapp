"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    QrCode,
    Webhook,
    Bot,
    Send,
    UserCheck,
    Megaphone,
    Activity,
    Tag,
    MessageCircleReply,
    Contact,
    UserPlus,
    Building2,
    BarChart3,
    Zap,
    Clock
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavGroup {
    label: string;
    items: NavItem[];
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    external?: boolean;
    superadminOnly?: boolean;
    allowedRoles?: string[];
}

const navGroups: NavGroup[] = [
    {
        label: "Atendimento",
        items: [
            { href: "/dashboard/chat", label: "Conversas / Fila", icon: MessageSquare },
            { href: "/dashboard/quick-replies", label: "Respostas Rápidas", icon: Zap },
            { href: "/dashboard/departments", label: "Setores & Filas", icon: Building2, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/attendance-settings", label: "Horários & CSAT", icon: Clock, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/attendance-reports", label: "Relatórios & Análises", icon: BarChart3, allowedRoles: ["SUPERADMIN", "OWNER"] },
        ],
    },
    {
        label: "WhatsApp",
        items: [
            { href: "/dashboard", label: "Painel Geral", icon: LayoutDashboard, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/sessions", label: "Sessões / QR Code", icon: QrCode, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/broadcast", label: "Disparos em Massa", icon: Megaphone, allowedRoles: ["SUPERADMIN", "OWNER"] },
        ],
    },
    {
        label: "Contatos & CRM",
        items: [
            { href: "/dashboard/contacts", label: "Contatos", icon: UserCheck },
            { href: "/dashboard/groups", label: "Grupos", icon: Users },
            { href: "/dashboard/labels", label: "Etiquetas", icon: Tag },
        ],
    },
    {
        label: "Automação",
        items: [
            { href: "/dashboard/bot-settings", label: "Configurações do Bot", icon: Bot, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/autoreply", label: "Gatilhos de Palavras-Chave", icon: MessageCircleReply, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/webhooks", label: "Webhooks e Integrações", icon: Webhook, allowedRoles: ["SUPERADMIN", "OWNER"] },
        ],
    },
    {
        label: "Administração",
        items: [
            { href: "/dashboard/users", label: "Atendentes & Equipe", icon: Users, superadminOnly: true },
            { href: "/dashboard/sessions/access", label: "Permissões de Sessão", icon: UserPlus, allowedRoles: ["SUPERADMIN", "OWNER"] },
            { href: "/dashboard/settings", label: "Configurações Gerais", icon: Settings },
            { href: "/dashboard/system-monitor", label: "Monitor do Sistema", icon: Activity, superadminOnly: true },
        ],
    },
];

export function SidebarNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { isCollapsed, toggleCollapse } = useSidebar();
    // @ts-ignore
    const userRole = session?.user?.role;

    // Track collapsed groups — all expanded by default
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (label: string) => {
        setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex-1 px-2 py-2 overflow-y-auto overflow-x-hidden space-y-0.5 styled-scrollbar">
                {navGroups.map((group) => {
                    const visibleItems = group.items.filter((item) => {
                        if (item.superadminOnly && userRole !== "SUPERADMIN") return false;
                        if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) return false;
                        return true;
                    });
                    if (visibleItems.length === 0) return null;

                    const isGroupCollapsed = collapsedGroups[group.label] ?? false;

                    // "Main" group doesn't show a collapsible header
                    if (group.label === "Main") {
                        return (
                            <div key={group.label} className="mb-1">
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        item={item}
                                        active={isActive(item.href)}
                                        isCollapsed={isCollapsed}
                                    />
                                ))}
                            </div>
                        );
                    }

                    return (
                        <div key={group.label} className="mb-1">
                            {/* Group header — hidden when sidebar collapsed */}
                            {!isCollapsed && (
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground/80 transition-colors group"
                                >
                                    {group.label}
                                    <ChevronDown
                                        size={12}
                                        className={`transition-transform duration-200 ${isGroupCollapsed ? "-rotate-90" : ""}`}
                                    />
                                </button>
                            )}

                            {/* Collapsed sidebar: show a thin divider between groups */}
                            {isCollapsed && (
                                <div className="mx-3 my-2 border-t border-border/30" />
                            )}

                            {(!isGroupCollapsed || isCollapsed) && (
                                <div className="space-y-0.5">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            item={item}
                                            active={isActive(item.href)}
                                            isCollapsed={isCollapsed}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse Toggle Button */}
            <div className="px-2 py-2 border-t border-border/30">
                <button
                    onClick={toggleCollapse}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                    {isCollapsed ? (
                        <PanelLeft size={18} />
                    ) : (
                        <>
                            <PanelLeftClose size={16} />
                            <span>Recolher</span>
                        </>
                    )}
                </button>
            </div>
        </TooltipProvider>
    );
}

function NavLink({ item, active, isCollapsed }: { item: NavItem; active: boolean; isCollapsed: boolean }) {
    const Icon = item.icon;

    const linkContent = (
        <Link
            href={item.href}
            target={item.external ? "_blank" : undefined}
            className={`
                flex items-center rounded-lg text-sm font-medium
                transition-all duration-200 group relative
                ${isCollapsed ? "justify-center px-2 py-2.5 mx-1" : "gap-3 px-3 py-2"}
                ${active
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
            `}
        >
            {active && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
            )}
            <Icon
                size={isCollapsed ? 20 : 17}
                className={`flex-shrink-0 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}`}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
        </Link>
    );

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                    <p className="text-xs font-medium">{item.label}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return linkContent;
}
