"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  Command,
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  LayoutDashboard,
  QrCode,
  Megaphone,
  UserCheck,
  Users,
  Tag,
  Bot,
  Zap,
  Settings,
  Activity,
  Palette,
  BarChart3,
  Building2,
  Clock,
  Sparkles,
  Kanban,
  Brain,
  Globe,
  Mail,
} from "lucide-react";
import { useTheme, AccentColor, ThemeMode } from "@/components/theme-provider";

interface CommandItem {
  id: string;
  name: string;
  sub?: string;
  icon: React.ElementType;
  kbd?: string;
  category: "Navegação" | "Tema & Estilo" | "Ações";
  allowedRoles?: string[];
  superadminOnly?: boolean;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "STAFF";
  const { theme, setTheme, accent, setAccent, resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Keyboard shortcut listener (Cmd/Ctrl + K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        onOpenChange(true);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dash",
      name: "Painel Geral",
      sub: "Visão geral e métricas do WhatsApp",
      icon: LayoutDashboard,
      kbd: "G D",
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard"),
    },
    {
      id: "nav-chat",
      name: "Conversas / Fila",
      sub: "Atendimento ao vivo e mensagens",
      icon: MessageSquare,
      kbd: "G C",
      category: "Navegação",
      run: () => router.push("/dashboard/chat"),
    },
    {
      id: "nav-sessions",
      name: "Sessões / QR Code",
      sub: "Conectar e gerenciar instâncias",
      icon: QrCode,
      kbd: "G S",
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/sessions"),
    },
    {
      id: "nav-quick-replies",
      name: "Respostas Rápidas",
      sub: "Atalhos de texto e templates",
      icon: Zap,
      category: "Navegação",
      run: () => router.push("/dashboard/quick-replies"),
    },
    {
      id: "nav-broadcast",
      name: "Disparos em Massa",
      sub: "Envios em lote e campanhas",
      icon: Megaphone,
      kbd: "G B",
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/broadcast"),
    },
    {
      id: "nav-crm",
      name: "Funil de Vendas (CRM)",
      sub: "Kanban de oportunidades e Zapply Flow",
      icon: Kanban,
      category: "Navegação",
      run: () => router.push("/dashboard/crm"),
    },
    {
      id: "nav-ai-agent",
      name: "Agente de IA & RAG",
      sub: "Treinamento com documentos e assistente virtual",
      icon: Brain,
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/ai-agent"),
    },
    {
      id: "nav-webchat",
      name: "Widget de Webchat",
      sub: "Chat flutuante para sites e landing pages",
      icon: Globe,
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/webchat"),
    },
    {
      id: "nav-email",
      name: "Campanhas de E-mail",
      sub: "Disparos em lote e configuração SMTP",
      icon: Mail,
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/email-campaigns"),
    },
    {
      id: "nav-contacts",
      name: "Contatos",
      sub: "Base de contatos e CRM",
      icon: UserCheck,
      category: "Navegação",
      run: () => router.push("/dashboard/contacts"),
    },
    {
      id: "nav-groups",
      name: "Grupos do WhatsApp",
      sub: "Listagem e participantes",
      icon: Users,
      category: "Navegação",
      run: () => router.push("/dashboard/groups"),
    },
    {
      id: "nav-labels",
      name: "Etiquetas",
      sub: "Tags e categorização",
      icon: Tag,
      category: "Navegação",
      run: () => router.push("/dashboard/labels"),
    },
    {
      id: "nav-bot",
      name: "Configurações do Bot",
      sub: "Inteligência e automações",
      icon: Bot,
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/bot-settings"),
    },
    {
      id: "nav-reports",
      name: "Relatórios & Análises",
      sub: "Métricas de atendimento e CSAT",
      icon: BarChart3,
      category: "Navegação",
      allowedRoles: ["SUPERADMIN", "OWNER"],
      run: () => router.push("/dashboard/attendance-reports"),
    },
    {
      id: "nav-settings",
      name: "Configurações Gerais",
      sub: "Preferências do sistema",
      icon: Settings,
      category: "Navegação",
      run: () => router.push("/dashboard/settings"),
    },
    {
      id: "nav-system-ds",
      name: "Design System Showcase",
      sub: "Tokens, cores e componentes do Gr8r Studio",
      icon: Sparkles,
      kbd: "G Y",
      category: "Navegação",
      superadminOnly: true,
      run: () => router.push("/dashboard/design-system"),
    },

    // Theme & Style
    {
      id: "theme-toggle",
      name: resolvedTheme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro",
      sub: "Alternar entre paleta clara e escura",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      kbd: "⌘ L",
      category: "Tema & Estilo",
      run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    {
      id: "theme-system",
      name: "Usar Tema do Sistema",
      sub: "Sincronizar com preferências do sistema operacional",
      icon: Monitor,
      category: "Tema & Estilo",
      run: () => setTheme("system"),
    },
    {
      id: "accent-indigo",
      name: "Cor de Destaque: Indigo",
      sub: "Cor padrão do Gr8r Studio (#4B5BD6)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("indigo"),
    },
    {
      id: "accent-emerald",
      name: "Cor de Destaque: Emerald",
      sub: "Verde esmeralda WhatsApp (#25754B)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("emerald"),
    },
    {
      id: "accent-blue",
      name: "Cor de Destaque: Blue",
      sub: "Azul clássico (#2F6CD4)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("blue"),
    },
    {
      id: "accent-violet",
      name: "Cor de Destaque: Violet",
      sub: "Violeta expressivo (#7348CC)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("violet"),
    },
    {
      id: "accent-teal",
      name: "Cor de Destaque: Teal",
      sub: "Verde azulado (#1A7F7A)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("teal"),
    },
    {
      id: "accent-rose",
      name: "Cor de Destaque: Rose",
      sub: "Rosa suave (#B93D68)",
      icon: Palette,
      category: "Tema & Estilo",
      run: () => setAccent("rose"),
    },
  ];

  const filtered = items.filter((item) => {
    if (item.superadminOnly && userRole !== "SUPERADMIN") return false;
    if (item.allowedRoles && !item.allowedRoles.includes(userRole)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.sub?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const categories = Array.from(new Set(filtered.map((item) => item.category)));

  // Navigation with arrows
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      e.preventDefault();
      filtered[selectedIdx].run();
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="scrim enter"
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--overlay)",
          zIndex: 90,
          backdropFilter: "blur(2px)",
        }}
        onClick={() => onOpenChange(false)}
      />
      <div
        style={{
          position: "fixed",
          top: "12vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(640px, calc(100vw - 32px))",
          background: "var(--surface)",
          borderRadius: "12px",
          boxShadow: "var(--shadow-pop)",
          zIndex: 95,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          maxHeight: "70vh",
          border: "1px solid var(--border)",
          animation: "popIn 0.16s var(--ease) both",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de Comandos"
      >
        {/* Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 14px",
            height: "50px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Search size={18} className="text-[var(--text-3)] shrink-0" />
          <input
            id="gr8r-pal-in"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando ou busque telas, ferramentas e cores…"
            autoComplete="off"
            autoFocus
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              fontSize: "14px",
              height: "100%",
              color: "var(--text)",
            }}
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        {/* Results List */}
        <div
          style={{
            overflowY: "auto",
            padding: "6px",
            flex: 1,
          }}
        >
          {filtered.length === 0 ? (
            <div className="empty-state sm">
              <div className="glyph">
                <Search size={18} />
              </div>
              <h2 className="es-h">Nenhum comando encontrado</h2>
              <p>Tente palavras-chave como &quot;conversas&quot;, &quot;sessões&quot;, &quot;tema&quot; ou &quot;cor&quot;.</p>
            </div>
          ) : (
            categories.map((cat) => {
              const catItems = filtered.filter((i) => i.category === cat);
              return (
                <div key={cat} style={{ marginBottom: "6px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                      color: "var(--text-3)",
                      padding: "8px 10px 4px",
                    }}
                  >
                    {cat}
                  </div>
                  {catItems.map((item) => {
                    const idx = filtered.indexOf(item);
                    const isSelected = idx === selectedIdx;
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.run();
                          onOpenChange(false);
                        }}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          height: "38px",
                          padding: "0 10px",
                          borderRadius: "var(--r-sm)",
                          width: "100%",
                          textAlign: "left",
                          fontSize: "13.5px",
                          cursor: "pointer",
                          background: isSelected ? "var(--surface-2)" : "transparent",
                          transition: "background var(--dur)",
                        }}
                      >
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "5px",
                            display: "grid",
                            placeItems: "center",
                            background: isSelected
                              ? "var(--accent-soft)"
                              : "var(--surface-3)",
                            color: isSelected ? "var(--accent)" : "var(--text-2)",
                            flexShrink: 0,
                          }}
                        >
                          <IconComp size={14} />
                        </div>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "var(--text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </span>
                        {item.sub && (
                          <span
                            style={{
                              color: "var(--text-3)",
                              fontSize: "12px",
                              marginLeft: "4px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.sub}
                          </span>
                        )}
                        <span
                          style={{
                            marginLeft: "auto",
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                          }}
                        >
                          {item.kbd && (
                            <span className="row" style={{ gap: "4px" }}>
                              {item.kbd.split(" ").map((k) => (
                                <kbd key={k} className="kbd">
                                  {k}
                                </kbd>
                              ))}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            padding: "8px 14px",
            borderTop: "1px solid var(--border)",
            fontSize: "11.5px",
            color: "var(--text-3)",
            background: "var(--sunken)",
            alignItems: "center",
          }}
        >
          <span className="row" style={{ gap: "4px" }}>
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navegar
          </span>
          <span className="row" style={{ gap: "4px" }}>
            <kbd className="kbd">↵</kbd> selecionar
          </span>
          <span className="row" style={{ gap: "4px" }}>
            <kbd className="kbd">Esc</kbd> fechar
          </span>
          <span className="sp" />
          <span className="row" style={{ gap: "4px" }}>
            <Command size={12} /> Gr8r System
          </span>
        </div>
      </div>
    </>
  );
}
