"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  badgeColor?: string;
}

export const segredosNavGroups: NavGroup[] = [
  {
    label: "Operação Principal",
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
      {
        href: "/dashboard/novelas",
        label: "Novelas & Episódios",
        icon: Film,
        badge: "YouTube",
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      },
      {
        href: "/dashboard/funil",
        label: "Funil X1 + Mangofy + IA",
        icon: Zap,
        badge: "Pix",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
      {
        href: "/dashboard/assinantes",
        label: "Assinantes VIP & Pedidos",
        icon: Crown,
        badge: "VIP",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      },
    ],
  },
  {
    label: "WhatsApp (Baileys)",
    items: [
      { href: "/dashboard/sessions", label: "Conectar WhatsApp (QR)", icon: QrCode },
      { href: "/dashboard/chat", label: "Conversas ao Vivo (X1)", icon: MessageSquare },
      { href: "/dashboard/broadcast", label: "Disparos / Remarketing", icon: Megaphone },
      { href: "/dashboard/autoreply", label: "Gatilhos Extras", icon: MessageCircleReply },
    ],
  },
  {
    label: "Plataforma & VPS",
    items: [
      { href: "/", label: "Ver Site de Novelas", icon: ExternalLink, external: true },
      { href: "/dashboard/system-monitor", label: "Monitor da VPS", icon: Activity },
      { href: "/dashboard/settings", label: "Configurações da Conta", icon: Settings },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden space-y-6 styled-scrollbar">
        {segredosNavGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <div className="px-2.5 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
                {group.label}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                const linkEl = (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isCollapsed ? "justify-center px-0" : ""
                    } ${
                      active
                        ? "bg-gradient-to-r from-rose-600/90 to-pink-600/90 text-white shadow-lg shadow-rose-600/25"
                        : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-white" : "text-rose-400/85"
                      }`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                              active
                                ? "bg-white/20 text-white border-white/30"
                                : item.badgeColor || "bg-white/10 text-white/70 border-white/10"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <p className="text-xs font-semibold">{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return linkEl;
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-2.5 border-t border-white/10">
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full gap-2 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition"
        >
          {isCollapsed ? (
            <PanelLeft size={16} />
          ) : (
            <>
              <PanelLeftClose size={15} />
              <span className="truncate">Recolher menu</span>
            </>
          )}
        </button>
      </div>
    </TooltipProvider>
  );
}
