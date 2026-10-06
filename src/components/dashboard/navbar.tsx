"use client";

import { useState, useEffect } from "react";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { SessionSelector } from "@/components/dashboard/session-selector";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Inbox, Trash2, Search, Sun, Moon, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { useTheme } from "@/components/theme-provider";

interface NavbarProps {
  appName?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  href?: string;
  createdAt: string;
}

const sectionNames: Record<string, string> = {
  "/dashboard": "Painel Geral",
  "/dashboard/companies": "Empresas Cadastradas",
  "/dashboard/api-keys": "Chaves de API Master",
  "/dashboard/api-docs": "Documentação da API",
  "/dashboard/chat": "Conversas / Fila",
  "/dashboard/sessions": "Sessões / QR Code",
  "/dashboard/broadcast": "Disparos em Massa",
  "/dashboard/contacts": "Contatos",
  "/dashboard/groups": "Grupos",
  "/dashboard/labels": "Etiquetas",
  "/dashboard/quick-replies": "Respostas Rápidas",
  "/dashboard/departments": "Setores & Filas",
  "/dashboard/attendance-settings": "Horários & CSAT",
  "/dashboard/attendance-reports": "Relatórios & Análises",
  "/dashboard/bot-settings": "Configurações do Bot",
  "/dashboard/autoreply": "Gatilhos de Palavras-Chave",
  "/dashboard/webhooks": "Webhooks e Integrações",
  "/dashboard/users": "Atendentes & Equipe",
  "/dashboard/settings": "Configurações Gerais",
  "/dashboard/system-monitor": "Monitor do Sistema",
  "/dashboard/design-system": "Design System",
};

export function Navbar({ appName = "Confy WhatsApp" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const currentSection = sectionNames[pathname] || "Dashboard";

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const responseData = await res.json();
        const items = responseData?.data || [];
        setNotifications(items);
        setUnreadCount(items.filter((n: Notification) => !n.read).length);
      }
    } catch {
      // silent catch
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (session?.user?.id) {
      const socketInstance = io({
        path: "/api/socket/io",
      });

      socketInstance.on("connect", () => {
        socketInstance.emit("join-user-room", session.user.id);
      });

      socketInstance.on("notification:new", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        toast.info(notification.title, {
          description: notification.message,
          action: notification.href
            ? {
                label: "Ver",
                onClick: () => router.push(notification.href!),
              }
            : undefined,
        });
      });

      setSocket(socketInstance);
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session?.user?.id]);

  const markAsRead = async (id?: string) => {
    try {
      const ids = id ? [id] : [];
      const res = await fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        if (id) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } else {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        }
      }
    } catch {
      // silent catch
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => {
          const notification = notifications.find((n) => n.id === id);
          return notification && !notification.read ? Math.max(0, prev - 1) : prev;
        });
        toast.success("Notificação excluída");
      }
    } catch {
      toast.error("Falha ao excluir notificação");
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.href) router.push(n.href);
    setIsOpen(false);
  };

  return (
    <>
      <header className="topbar">
        {/* Left: Mobile Nav & Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <MobileNav appName={appName} />

          <nav className="crumbs" aria-label="Breadcrumbs">
            <button onClick={() => router.push("/dashboard")}>
              {appName}
            </button>
            <span className="sep">/</span>
            <button className="cur font-medium">{currentSection}</button>
          </nav>
        </div>

        {/* Center: Search / Command Bar */}
        <div className="flex items-center justify-center flex-1 min-w-0 px-2 sm:px-6">
          <button
            type="button"
            className="topsearch"
            onClick={() => setCmdOpen(true)}
            aria-label="Abrir menu de comandos"
          >
            <Search size={14} className="text-[var(--text-4)] shrink-0" />
            <span className="lbltxt text-xs text-[var(--text-3)] font-normal">
              Buscar ou digitar comando…
            </span>
            <kbd className="kbd">⌘K</kbd>
          </button>
        </div>

        {/* Right: Session Selector, Theme Switcher, Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {(session?.user as any)?.role === "SUPERADMIN" ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Painel Master</span>
            </div>
          ) : (
            <SessionSelector />
          )}

          <div className="h-4 w-px bg-[var(--border)] mx-1 hidden sm:block" />

          {/* Quick Design System Link */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/design-system")}
            className="ibtn ibtn-sm hidden md:inline-flex text-[var(--text-3)] hover:text-[var(--text)]"
            title="Design System Showcase"
          >
            <Sparkles size={15} />
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="ibtn ibtn-sm text-[var(--text-3)] hover:text-[var(--text)]"
            title={resolvedTheme === "dark" ? "Modo Claro" : "Modo Escuro"}
            aria-label="Alternar tema"
          >
            {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="ibtn ibtn-sm relative text-[var(--text-3)] hover:text-[var(--text)]"
                aria-label="Notificações"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]"
              align="end"
            >
              <div className="p-3 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-2)]">
                <div>
                  <h4 className="text-[13px] font-semibold leading-none text-[var(--text)]">
                    Notificações
                  </h4>
                  <p className="text-[11px] text-[var(--text-3)] mt-1">
                    {unreadCount > 0
                      ? `${unreadCount} ${unreadCount === 1 ? "não lida" : "não lidas"}`
                      : "Tudo em dia"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAsRead()}
                    className="btn btn-ghost btn-sm text-[11px] h-6 px-2"
                  >
                    Marcar lidas
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto styled-scrollbar">
                {notifications.length === 0 ? (
                  <div className="empty-state sm py-8">
                    <div className="glyph">
                      <Inbox size={20} />
                    </div>
                    <h3 className="es-h text-[13px]">Nenhuma notificação</h3>
                    <p className="text-[12px]">Novidades aparecerão aqui.</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-[var(--divider)] transition-colors ${
                          !n.read ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-2)]"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2.5">
                          <div
                            className="flex-1 space-y-1 cursor-pointer"
                            onClick={() => handleNotificationClick(n)}
                          >
                            <p
                              className={`text-[12.5px] font-medium leading-snug ${
                                !n.read ? "text-[var(--text)] font-semibold" : "text-[var(--text-2)]"
                              }`}
                            >
                              {n.title}
                            </p>
                            <p className="text-[11.5px] text-[var(--text-3)] line-clamp-2">
                              {n.message}
                            </p>
                            <p className="text-[10.5px] text-[var(--text-4)]">
                              {formatDistanceToNow(new Date(n.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            )}
                            <button
                              type="button"
                              className="ibtn ibtn-xs text-[var(--text-4)] hover:text-[var(--red)]"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n.id);
                              }}
                              aria-label="Excluir notificação"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
