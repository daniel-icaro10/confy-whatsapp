"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
          className="px-2.5 py-1.5 rounded border border-neutral-800 bg-neutral-900 md:hidden text-xs font-medium text-white"
        >
          Menu
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[260px] p-0 flex flex-col bg-[#0f0f0f] border-r border-neutral-800 text-white"
      >
        <SheetHeader className="px-4 py-3.5 text-left border-b border-neutral-800">
          <SheetTitle className="text-sm font-semibold text-white">
            {appName}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {segredosNavGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2.5 mb-1.5 text-[11px] font-medium text-neutral-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, external }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      onClick={() => setOpen(false)}
                      className={`block px-2.5 py-2 rounded text-xs font-medium transition ${
                        active
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOut({ callbackUrl: "/auth/login" });
              }}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
