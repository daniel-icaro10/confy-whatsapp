"use client";

import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "./sidebar-context";
import { LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

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
  version,
}: SidebarShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={`
        bg-[var(--bg-side)] border-r border-[var(--border)]
        hidden md:flex flex-col h-full sticky left-0 top-0 z-20
        transition-all duration-200 ease-[var(--ease)]
        ${isCollapsed ? "w-[52px]" : "w-[252px]"}
      `}
    >
      {/* Workspace Brand Header */}
      <div className={`p-2 border-b border-[var(--border)] transition-all ${isCollapsed ? "px-1.5" : "px-2.5"}`}>
        {isCollapsed ? (
          <div className="flex justify-center py-1">
            <div
              className="ws-logo"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "7px",
                background: "var(--accent)",
                color: "var(--on-accent)",
                fontSize: "12px",
                fontWeight: 600,
              }}
              title={appName}
            >
              {appName.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="ws py-1 px-2 rounded-[6px] hover:bg-[var(--surface-3)] transition-colors">
            <div
              className="ws-logo"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "6px",
                background: "var(--accent)",
                color: "var(--on-accent)",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {appName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="ws-name text-[13.5px] font-semibold text-[var(--text)] truncate leading-tight">
                {appName}
              </div>
              <div className="text-[10.5px] text-[var(--text-3)] truncate">
                Workspace · Gateway
              </div>
            </div>
            <ChevronDown size={13} className="text-[var(--text-4)] shrink-0" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <SidebarNav />

      {/* User Footer */}
      <div
        suppressHydrationWarning={true}
        className={`border-t border-[var(--border)] bg-[var(--bg-side)] transition-all ${
          isCollapsed ? "p-1.5" : "p-2.5"
        }`}
      >
        {isCollapsed ? (
          <div suppressHydrationWarning={true} className="flex flex-col items-center gap-2 py-1">
            <div
              suppressHydrationWarning={true}
              className="av sm"
              style={{ "--c": "var(--accent)" } as React.CSSProperties}
              title={userName || "Usuário"}
            >
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="ibtn ibtn-xs text-[var(--text-3)] hover:text-[var(--red)]"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <>
            <div suppressHydrationWarning={true} className="flex items-center gap-2 px-1 mb-2">
              <div
                suppressHydrationWarning={true}
                className="av md"
                style={{ "--c": "var(--accent)" } as React.CSSProperties}
              >
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div suppressHydrationWarning={true} className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium text-[var(--text)] truncate leading-tight">
                  {userName || "Usuário"}
                </p>
                <p className="text-[11px] text-[var(--text-3)] truncate">
                  {userEmail || "online"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="ibtn ibtn-xs text-[var(--text-4)] hover:text-[var(--red)]"
                title="Sair do sistema"
                aria-label="Sair"
              >
                <LogOut size={13} />
              </button>
            </div>
            <div className="flex items-center justify-between px-1 text-[10px] text-[var(--text-4)] mono">
              <span>Gr8r System</span>
              <span>v{version}</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
