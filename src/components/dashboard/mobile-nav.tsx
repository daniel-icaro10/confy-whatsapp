"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  QrCode,
  Webhook,
  Bot,
  UserCheck,
  Megaphone,
  Activity,
  Tag,
  MessageCircleReply,
  UserPlus,
  Building2,
  BarChart3,
  Zap,
  Clock,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import pkg from "../../../package.json";

interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    external?: boolean;
    superadminOnly?: boolean;
    allowedRoles?: string[];
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Atendimento",
    items: [
      { href: "/dashboard/chat", label: "Conversas / Fila", icon: MessageSquare },
      { href: "/dashboard/quick-replies", label: "Respostas Rápidas", icon: Zap },
      { href: "/dashboard/departments", label: "Setores & Filas", icon: Building2, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/attendance-settings", label: "Horários & CSAT", icon: Clock, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/attendance-reports", label: "Relatórios & Análises", icon: BarChart3, allowedRoles: ["SUPERADMIN", "OWNER"] },
    ],
  },
  {
    label: "WhatsApp",
    items: [
      { href: "/dashboard", label: "Painel Geral", icon: LayoutDashboard, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/sessions", label: "Sessões / QR Code", icon: QrCode, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/broadcast", label: "Disparos em Massa", icon: Megaphone, allowedRoles: ["SUPERADMIN", "OWNER"] },
    ],
  },
  {
    label: "Contatos & CRM",
    items: [
      { href: "/dashboard/contacts", label: "Contatos", icon: UserCheck },
      { href: "/dashboard/groups", label: "Grupos", icon: Users },
      { href: "/dashboard/labels", label: "Etiquetas", icon: Tag },
    ],
  },
  {
    label: "Automação",
    items: [
      { href: "/dashboard/bot-settings", label: "Configurações do Bot", icon: Bot, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/autoreply", label: "Gatilhos Automáticos", icon: MessageCircleReply, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/webhooks", label: "Webhooks e APIs", icon: Webhook, allowedRoles: ["SUPERADMIN", "OWNER"] },
    ],
  },
  {
    label: "Administração",
    items: [
      { href: "/dashboard/users", label: "Atendentes & Equipe", icon: Users, superadminOnly: true },
      { href: "/dashboard/sessions/access", label: "Permissões de Sessão", icon: UserPlus, allowedRoles: ["SUPERADMIN", "OWNER"] },
      { href: "/dashboard/settings", label: "Configurações Gerais", icon: Settings },
      { href: "/dashboard/system-monitor", label: "Monitor do Sistema", icon: Activity, superadminOnly: true },
      { href: "/dashboard/design-system", label: "Design System", icon: Sparkles },
    ],
  },
];

export function MobileNav({ appName = "Confy WhatsApp" }: { appName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  // @ts-ignore
  const userRole = session?.user?.role;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="ibtn ibtn-sm md:hidden text-[var(--text-2)]"
          aria-label="Abrir menu"
        >
          <Menu size={16} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[300px] p-0 flex flex-col bg-[var(--bg-side)] border-r border-[var(--border)]">
        <SheetHeader className="px-4 py-3 text-left border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2">
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
            <SheetTitle className="text-[14px] font-semibold text-[var(--text)]">{appName}</SheetTitle>
          </div>
          <SheetDescription className="text-[11px] text-[var(--text-3)]">Gateway de WhatsApp</SheetDescription>
        </SheetHeader>

        <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-1 styled-scrollbar">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (item.superadminOnly && userRole !== "SUPERADMIN") return false;
              if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) return false;
              return true;
            });
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="sgroup">
                <p className="sgroup-h">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map(({ href, label, icon: Icon, external }) => (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      onClick={() => setOpen(false)}
                      className={`sitem ${isActive(href) ? "on" : ""}`}
                    >
                      <span className="pico" style={{ "--c": "var(--accent)" } as React.CSSProperties}>
                        <Icon size={13} className="i" />
                      </span>
                      <span className="truncate">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-2.5 mb-2.5 px-1">
            <div
              className="av md"
              style={{ "--c": "var(--accent)" } as React.CSSProperties}
            >
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-[var(--text)] truncate">{session?.user?.name || "Usuário"}</p>
              <p className="text-[11px] text-[var(--text-3)] truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-xs"
            onClick={async () => {
              setOpen(false);
              await signOut({ callbackUrl: "/auth/login" });
            }}
          >
            <LogOut size={13} /> Sair
          </Button>
          <p className="text-[10px] text-[var(--text-4)] text-center mt-2 mono">v{pkg.version}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
