"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { segredosNavGroups } from "./sidebar-nav";

export function MobileNav({ appName = "Segredos do Coração" }: { appName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 md:hidden text-white"
          aria-label="Abrir menu"
        >
          <Menu size={16} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85vw] sm:w-[300px] p-0 flex flex-col bg-[#0c0712] border-r border-white/10 text-white"
      >
        <SheetHeader className="px-4 py-4 text-left border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <SheetTitle className="text-sm font-extrabold text-white">
                {appName}
              </SheetTitle>
              <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                Streaming & Funil X1
              </p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {segredosNavGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2.5 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(({ href, label, icon: Icon, external, badge }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="truncate flex-1">{label}</span>
                      {badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#08050a]">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {session?.user?.name || "Administrador"}
              </p>
              <p className="text-[11px] text-white/45 truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOut({ callbackUrl: "/auth/login" });
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/15 text-rose-300 text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
