"use client";

import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "./sidebar-context";
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
        bg-[#0f0f0f] border-r border-neutral-800
        hidden md:flex flex-col h-full sticky left-0 top-0 z-20
        transition-all duration-150
        ${isCollapsed ? "w-[60px]" : "w-[230px]"}
      `}
    >
      <div className="h-14 border-b border-neutral-800 flex items-center px-4 justify-between">
        <Link href="/dashboard" className="font-semibold text-sm text-white truncate">
          {isCollapsed ? "TD" : appName || "TvDrama Reels"}
        </Link>
      </div>

      <SidebarNav />

      <div
        suppressHydrationWarning={true}
        className="border-t border-neutral-800 p-3.5"
      >
        {!isCollapsed ? (
          <div suppressHydrationWarning={true} className="flex items-center justify-between gap-2">
            <div suppressHydrationWarning={true} className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {userName || "Admin"}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {userEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-xs text-neutral-400 hover:text-white transition shrink-0"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full text-center text-[11px] text-neutral-400 hover:text-white"
          >
            Sair
          </button>
        )}
      </div>
    </aside>
  );
}
