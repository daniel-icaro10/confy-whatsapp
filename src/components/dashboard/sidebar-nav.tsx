"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export const segredosNavGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Visão geral" },
      { href: "/dashboard/novelas", label: "Novelas e episódios" },
      { href: "/dashboard/funil", label: "Funil WhatsApp (Kanban)" },
      { href: "/dashboard/assinantes", label: "Assinantes e pedidos" },
    ],
  },
  {
    label: "WhatsApp",
    items: [
      { href: "/dashboard/sessions", label: "Conexões" },
      { href: "/dashboard/chat", label: "Atendimento" },
      { href: "/dashboard/broadcast", label: "Disparos" },
      { href: "/dashboard/autoreply", label: "Respostas automáticas" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/", label: "Ver site público", external: true },
      { href: "/dashboard/system-monitor", label: "Servidor" },
      { href: "/dashboard/settings", label: "Configurações" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
      {segredosNavGroups.map((group) => (
        <div key={group.label}>
          {!isCollapsed && (
            <div className="px-2.5 mb-1.5 text-[11px] font-medium text-neutral-500">
              {group.label}
            </div>
          )}

          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className={`block px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                    active
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  {isCollapsed ? item.label.slice(0, 2) : item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
