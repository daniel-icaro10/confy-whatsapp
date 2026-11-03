"use client";

import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "./sidebar-context";
import { LogOut, Heart, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface SidebarShellProps {
  appName: string;
  userName?: string | null;
  userEmail?: string | null;
  version: string;
}

export function SidebarShell({
  appName,
  userName,
  userEmail,
}: SidebarShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={`
        bg-[#0c0712] border-r border-white/10
        hidden md:flex flex-col h-full sticky left-0 top-0 z-20
        transition-all duration-200
        ${isCollapsed ? "w-[64px]" : "w-[260px]"}
      `}
    >
      {/* Topo da Marca Segredos do Coração */}
      <div className={`h-16 border-b border-white/10 flex items-center ${isCollapsed ? "justify-center px-2" : "px-4 justify-between"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-white truncate leading-tight">
                {appName || "Segredos do Coração"}
              </div>
              <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider truncate">
                Streaming & Funil X1
              </div>
            </div>
          )}
        </Link>

        {!isCollapsed && (
          <Link
            href="/"
            target="_blank"
            title="Abrir site público de novelas"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-rose-300 transition shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Menu de Navegação */}
      <SidebarNav />

      {/* Rodapé do Usuário */}
      <div
        suppressHydrationWarning={true}
        className={`border-t border-white/10 bg-[#09050e] transition-all ${
          isCollapsed ? "p-2" : "p-3.5"
        }`}
      >
        {isCollapsed ? (
          <div suppressHydrationWarning={true} className="flex flex-col items-center gap-2">
            <div
              suppressHydrationWarning={true}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center"
              title={userName || "Admin"}
            >
              {userName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-1.5 rounded-lg text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div suppressHydrationWarning={true} className="flex items-center gap-2.5">
            <div
              suppressHydrationWarning={true}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20"
            >
              {userName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div suppressHydrationWarning={true} className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {userName || "Administrador"}
              </p>
              <p className="text-[11px] text-white/45 truncate">
                {userEmail || "Admin Master"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/15 text-white/60 hover:text-rose-400 transition shrink-0"
              title="Sair do painel"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
