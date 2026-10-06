"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, PanelLeftClose, PanelLeft, Sparkles } from "lucide-react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  QrCode,
  Webhook,
  Bot,
  UserCheck,
  Megaphone,
  Activity,
  Tag,
  MessageCircleReply,
  UserPlus,
  Building2,
  BarChart3,
  Zap,
  Clock,
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
  badge?: string;
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
      { href: "/dashboard/autoreply", label: "Gatilhos Automáticos", icon: MessageCircleReply, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/webhooks", label: "Webhooks e APIs", icon: Webhook, allowedRoles: ["SUPERADMIN", "OWNER"] },
    ],
  },
  {
    label: "Administração",
    items: [
      { href: "/dashboard/users", label: "Atendentes & Equipe", icon: Users, superadminOnly: true },
      { href: "/dashboard/sessions/access", label: "Permissões de Sessão", icon: UserPlus, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/settings", label: "Configurações Gerais", icon: Settings },
      { href: "/dashboard/system-monitor", label: "Monitor do Sistema", icon: Activity, superadminOnly: true },
      { href: "/dashboard/design-system", label: "Design System", icon: Sparkles, badge: "Gr8r" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isCollapsed, toggleCollapse } = useSidebar();
  // @ts-ignore
  const userRole = session?.user?.role;

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex-1 px-2 py-1.5 overflow-y-auto overflow-x-hidden space-y-1 styled-scrollbar">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.superadminOnly && userRole !== "SUPERADMIN") return false;
            if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) return false;
            return true;
          });
          if (visibleItems.length === 0) return null;

          const isGroupCollapsed = collapsedGroups[group.label] ?? false;

          return (
            <div key={group.label} className="sgroup">
              {/* Group Header */}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="sgroup-h w-full flex items-center justify-between text-left cursor-pointer hover:text-[var(--text)] transition-colors group"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    size={11}
                    className={`text-[var(--text-4)] transition-transform duration-200 ${
                      isGroupCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>
              )}

              {isCollapsed && (
                <div className="mx-2 my-1.5 border-t border-[var(--border)]" />
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

      {/* Collapse Toggle */}
      <div className="px-2 py-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={toggleCollapse}
          className="sitem flex items-center justify-center w-full gap-2 text-[12px] font-medium text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
        >
          {isCollapsed ? (
            <PanelLeft size={16} />
          ) : (
            <>
              <PanelLeftClose size={15} />
              <span className="truncate">Recolher barra lateral</span>
            </>
          )}
        </button>
      </div>
    </TooltipProvider>
  );
}

function NavLink({
  item,
  active,
  isCollapsed,
}: {
  item: NavItem;
  active: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      className={`sitem ${active ? "on" : ""} ${
        isCollapsed ? "justify-center px-0" : ""
      }`}
    >
      <span className="pico" style={{ "--c": "var(--accent)" } as React.CSSProperties}>
        <Icon size={13} className="i" />
      </span>
      {!isCollapsed && (
        <>
          <span className="truncate flex-1 min-w-0">{item.label}</span>
          {item.badge && (
            <span className="ct dotc text-[10px] px-1.5 py-0 h-4">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p className="text-xs font-medium">{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
