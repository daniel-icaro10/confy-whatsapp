"use client";

import { MobileNav } from "@/components/dashboard/mobile-nav";
import { SessionSelector } from "@/components/dashboard/session-selector";
import { ExternalLink, Zap, Film, Crown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  appName?: string;
}

const sectionNames: Record<string, string> = {
  "/dashboard": "Visão Geral da Operação",
  "/dashboard/novelas": "Catálogo de Novelas & Episódios (YouTube)",
  "/dashboard/funil": "Funil X1 WhatsApp + Mangofy + IA",
  "/dashboard/assinantes": "Assinantes VIP & Pedidos Pix",
  "/dashboard/chat": "Conversas ao Vivo (X1)",
  "/dashboard/sessions": "Conectar WhatsApp (QR Code)",
  "/dashboard/broadcast": "Disparos / Remarketing",
  "/dashboard/autoreply": "Gatilhos Extras",
  "/dashboard/settings": "Configurações da Conta",
  "/dashboard/system-monitor": "Monitor da VPS",
};

export function Navbar({ appName = "Segredos do Coração" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentSection = sectionNames[pathname] || "Painel de Controle";

  return (
    <header className="h-16 border-b border-white/10 bg-[#0b0711]/90 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between gap-3 shrink-0">
      {/* Esquerda: Menu Mobile + Título da Seção */}
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav appName={appName} />

        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-white/50 hover:text-rose-300 font-semibold transition hidden sm:inline"
          >
            {appName}
          </button>
          <span className="text-white/25 hidden sm:inline">/</span>
          <span className="font-bold text-white truncate">{currentSection}</span>
        </div>
      </div>

      {/* Direita: Atalhos Rápidos + Seletor de Sessão WhatsApp */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5">
          <Link
            href="/dashboard/novelas"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition"
          >
            <Film className="w-3.5 h-3.5 text-rose-400" />
            Novelas
          </Link>
          <Link
            href="/dashboard/funil"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Funil X1
          </Link>
          <Link
            href="/dashboard/assinantes"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Assinantes
          </Link>
        </div>

        <SessionSelector />

        <Link
          href="/"
          target="_blank"
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Abrir Site</span>
        </Link>
      </div>
    </header>
  );
}
