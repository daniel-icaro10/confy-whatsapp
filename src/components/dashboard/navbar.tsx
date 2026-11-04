"use client";

import { MobileNav } from "@/components/dashboard/mobile-nav";
import { SessionSelector } from "@/components/dashboard/session-selector";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  appName?: string;
}

const sectionNames: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/dashboard/novelas": "Novelas e episódios",
  "/dashboard/funil": "Funil WhatsApp (Kanban)",
  "/dashboard/assinantes": "Assinantes e pedidos",
  "/dashboard/chat": "Atendimento",
  "/dashboard/sessions": "Conexões WhatsApp",
  "/dashboard/broadcast": "Disparos",
  "/dashboard/autoreply": "Respostas automáticas",
  "/dashboard/settings": "Configurações",
  "/dashboard/system-monitor": "Servidor",
};

export function Navbar({ appName = "TvDrama Reels" }: NavbarProps) {
  const pathname = usePathname();
  const currentSection = sectionNames[pathname] || "Painel";

  return (
    <header className="h-14 border-b border-neutral-800 bg-[#0f0f0f] px-4 lg:px-6 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav appName={appName} />
        <span className="font-medium text-sm text-white truncate">
          {currentSection}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <SessionSelector />

        <Link
          href="/"
          target="_blank"
          className="px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-neutral-200 hover:text-white transition"
        >
          Abrir site
        </Link>
      </div>
    </header>
  );
}
