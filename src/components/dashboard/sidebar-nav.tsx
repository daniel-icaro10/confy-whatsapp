"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Film,
  Zap,
  Crown,
  QrCode,
  MessageSquare,
  Megaphone,
  MessageCircleReply,
  Settings,
  LayoutDashboard,
  ExternalLink,
  Activity
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
  badge?: string;
}

const segredosNavGroups: NavGroup[] = [
  {
    label: "Segredos do Coração",
    items: [
      { href: "/dashboard/novelas", label: "Catálogo de Novelas", icon: Film, badge: "YouTube" },
      { href: "/dashboard/funil", label: "Funil X1 + Mangofy + IA", icon: Zap, badge: "Pix" },
      { href: "/dashboard/assinantes", label: "Assinantes VIP & Pix", icon: Crown },
      { href: "/", label: "Abrir Site de Novelas", icon: ExternalLink, external: true },
    ],
  },
  {
    label: "WhatsApp & Operação",
    items: [
      { href: "/dashboard/sessions", label: "Conectar WhatsApp (QR)", icon: QrCode },
      { href: "/dashboard/chat", label: "Conversas ao Vivo", icon: MessageSquare },
      { href: "/dashboard/broadcast", label: "Remarketing / Disparos", icon: Megaphone },
      { href: "/dashboard/autoreply", label: "Gatilhos Extras", icon: MessageCircleReply },
    ],
  },
  {
    label: "Sistema & VPS",
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
      { href: "/dashboard/system-monitor", label: "Monitor da VPS", icon: Activity },
      { href: "/dashboard/settings", label: "Configurações da Conta", icon: Settings },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex-1 px-2 py-1.5 overflow-y-auto overflow-x-hidden space-y-1 styled-scrollbar">
        {segredosNavGroups.map((group) => {
          const isGroupCollapsed = collapsedGroups[group.label] ?? false;

          return (
            <div key={group.label} className="sgroup">
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
                  {group.items.map((item) => (
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
