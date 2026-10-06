"use client";

import React, { useState } from "react";
import { useTheme, AccentColor, ThemeMode } from "@/components/theme-provider";
import { RoleGuard } from "@/components/dashboard/role-guard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  Monitor,
  Check,
  Search,
  Plus,
  Trash2,
  Share2,
  Star,
  Settings,
  Bell,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  Command,
  ArrowRight,
  User,
  Calendar,
  Lock,
  CheckCheck,
  Send,
  Paperclip,
  Smile,
  MessageSquare,
  Bot,
} from "lucide-react";

export default function DesignSystemPage() {
  const { theme, setTheme, accent, setAccent, resolvedTheme } = useTheme();
  const [toggleState, setToggleState] = useState(true);
  const [checkState, setCheckState] = useState(true);
  const [radioState, setRadioState] = useState("option1");
  const [segState, setSegState] = useState("list");
  const [tabState, setTabState] = useState("overview");

  const accentColors: { key: AccentColor; label: string; hex: string }[] = [
    { key: "indigo", label: "Indigo (Gr8r)", hex: "#4B5BD6" },
    { key: "emerald", label: "Emerald (WhatsApp)", hex: "#25754B" },
    { key: "blue", label: "Blue", hex: "#2F6CD4" },
    { key: "violet", label: "Violet", hex: "#7348CC" },
    { key: "teal", label: "Teal", hex: "#1A7F7A" },
    { key: "rose", label: "Rose", hex: "#B93D68" },
    { key: "graphite", label: "Graphite", hex: "#34332F" },
  ];

  const colorTokens = [
    { name: "Background", token: "--bg", desc: "Superfície base da página" },
    { name: "Sidebar", token: "--bg-side", desc: "Barra lateral de navegação" },
    { name: "Surface", token: "--surface", desc: "Cartões, painéis e modais" },
    { name: "Surface 2", token: "--surface-2", desc: "Hover e estados secundários" },
    { name: "Surface 3", token: "--surface-3", desc: "Segmented controls e ativos" },
    { name: "Sunken", token: "--sunken", desc: "Áreas afundadas e buscas" },
    { name: "Border", token: "--border", desc: "Linhas divisórias suaves" },
    { name: "Border Strong", token: "--border-strong", desc: "Bordas de inputs e botões" },
    { name: "Text", token: "--text", desc: "Texto primário de alto contraste" },
    { name: "Text 2", token: "--text-2", desc: "Texto secundário e labels" },
    { name: "Text 3", token: "--text-3", desc: "Metadados e timestamps" },
    { name: "Accent", token: "--accent", desc: "Destaque e foco ativo" },
    { name: "Success", token: "--green", desc: "Confirmações e sucesso" },
    { name: "Warning", token: "--amber", desc: "Avisos e pendências" },
    { name: "Error", token: "--red", desc: "Erros e ações destrutivas" },
  ];

  return (
    <RoleGuard allowedRoles={["SUPERADMIN"]} fallbackTitle="Acesso Restrito ao Design System" fallbackDescription="O catálogo do Design System é restrito exclusivamente ao Super Administrador.">
      <div className="space-y-10 max-w-6xl pb-16">
      {/* Page Header */}
      <div className="ph border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge accent">Gr8r Studio Clone</span>
            <span className="text-[12px] text-[var(--text-3)] font-mono">system-design.v1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Design System &amp; Tokens
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1 max-w-2xl">
            Clone fiel do design system do Gr8r Studio: tokens de cores quentes e estruturadas, tipografia Geist, micro-animações táteis e componentes de alta precisão.
          </p>
        </div>

        {/* Theme and Accent Live Switcher in Header */}
        <div className="acts">
          <div className="seg">
            {(
              [
                ["light", "Claro", Sun],
                ["dark", "Escuro", Moon],
                ["system", "Sistema", Monitor],
              ] as [ThemeMode, string, React.ElementType][]
            ).map(([k, label, IconComp]) => (
              <button
                key={k}
                type="button"
                className={theme === k ? "on" : ""}
                onClick={() => setTheme(k)}
              >
                <IconComp size={13} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Theme & Accent Customizer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
              Paleta e Cor de Destaque
            </h2>
            <p className="text-[12.5px] text-[var(--text-3)]">
              Alterne o tom ativo do sistema e veja todos os componentes se adaptarem em tempo real.
            </p>
          </div>
          <span className="text-[11.5px] font-mono text-[var(--text-3)]">
            Ativo: {accent}
          </span>
        </div>

        <div className="panel p-4 sm:p-5 flex flex-wrap items-center gap-3">
          <span className="text-[12.5px] font-medium text-[var(--text-2)] mr-2">
            Variações de Destaque:
          </span>
          <div className="swatches">
            {accentColors.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`sw ${accent === c.key ? "on" : ""}`}
                style={{ "--c": c.hex } as React.CSSProperties}
                onClick={() => setAccent(c.key)}
                title={`${c.label} (${c.hex})`}
              >
                {accent === c.key && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Color Tokens Matrix */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Tokens de Cores Semânticas
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Redefinidos para modo claro e modo escuro garantindo contraste calmo e natural.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {colorTokens.map((tok) => (
            <div
              key={tok.token}
              className="border border-[var(--border)] rounded-[8px] overflow-hidden bg-[var(--surface)] text-[12px] shadow-[var(--shadow-sm)]"
            >
              <div
                className="h-12 w-full border-b border-[var(--border)] transition-colors"
                style={{ background: `var(${tok.token})` }}
              />
              <div className="p-2.5 space-y-0.5">
                <div className="font-semibold text-[var(--text)] leading-tight">{tok.name}</div>
                <div className="font-mono text-[10.5px] text-[var(--text-3)]">{tok.token}</div>
                <div className="text-[10px] text-[var(--text-4)] truncate">{tok.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography Scale */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Escala Tipográfica (Geist &amp; Geist Mono)
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Proporções desenhadas para hierarquia de densidade confortável.
          </p>
        </div>

        <div className="panel divide-y divide-[var(--divider)] overflow-hidden">
          {[
            { label: "Título de Página", token: "var(--fs-2xl)", weight: "600 (Semibold)", sample: "Central de Mensagens WhatsApp", code: "23px / -0.022em" },
            { label: "Título de Seção", token: "var(--fs-xl)", weight: "600 (Semibold)", sample: "Campanhas e Disparos Ativos", code: "19px / -0.018em" },
            { label: "Subseção", token: "var(--fs-md)", weight: "600 (Semibold)", sample: "Parâmetros do Gateway Baileys", code: "14.5px / -0.01em" },
            { label: "Texto Base (Body)", token: "var(--fs)", weight: "400 (Regular)", sample: "Gateway auto-hospedado pronto para envio em massa e atendimento multicanal.", code: "13.5px / 1.45" },
            { label: "Secundário", token: "var(--fs-sm)", weight: "450 (Medium)", sample: "Atualizado há 5 minutos atrás · Instância conectada", code: "12.5px / 1.4" },
            { label: "Metadado / Tag", token: "var(--fs-xs)", weight: "500 (Medium)", sample: "WA-SESS-901 · Fila Atendimento", code: "12px / 1.3" },
            { label: "Eyebrow / Label", token: "var(--fs-2xs)", weight: "600 (Uppercase)", sample: "ADMINISTRAÇÃO DO SISTEMA", code: "11px / 0.06em" },
          ].map((item) => (
            <div key={item.label} className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <span className="text-[11.5px] text-[var(--text-3)] font-medium w-32 shrink-0">{item.label}</span>
              <span className="flex-1 text-[var(--text)] truncate" style={{ fontSize: item.token }}>
                {item.sample}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-4)] shrink-0">{item.code}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Buttons Matrix */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Botões e Ações Interativas
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Variantes tátil com escala suave no toque (`active:scale-[0.97]`).
          </p>
        </div>

        <div className="panel p-5 space-y-5">
          {/* Variants */}
          <div className="space-y-2">
            <span className="text-[11.5px] font-medium text-[var(--text-3)] uppercase tracking-wider">
              Variantes Principais
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">
                <Plus size={14} /> Novo Disparo
              </Button>
              <Button variant="secondary">
                <Share2 size={14} /> Compartilhar
              </Button>
              <Button variant="outline">
                <Settings size={14} /> Configurações
              </Button>
              <Button variant="ghost">
                <Star size={14} /> Favoritar
              </Button>
              <Button variant="destructive">
                <Trash2 size={14} /> Excluir Sessão
              </Button>
              <Button disabled variant="default">
                Desabilitado
              </Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-2 border-t border-[var(--divider)]">
            <span className="text-[11.5px] font-medium text-[var(--text-3)] uppercase tracking-wider">
              Escala de Tamanhos
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">
                Pequeno (26px)
              </Button>
              <Button size="default">
                Padrão (30px)
              </Button>
              <Button size="lg">
                Grande (36px)
              </Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="space-y-2 pt-2 border-t border-[var(--divider)]">
            <span className="text-[11.5px] font-medium text-[var(--text-3)] uppercase tracking-wider">
              Icon Buttons (.ibtn)
            </span>
            <div className="flex items-center gap-2">
              <button type="button" className="ibtn" title="Buscar">
                <Search size={15} />
              </button>
              <button type="button" className="ibtn on" title="Favorito Ativo">
                <Star size={15} />
              </button>
              <button type="button" className="ibtn" title="Notificações">
                <Bell size={15} />
              </button>
              <button type="button" className="ibtn" title="Ajustes">
                <Settings size={15} />
              </button>
              <button type="button" className="ibtn" disabled title="Desativado">
                <Trash2 size={15} />
              </button>
              <span className="text-xs text-[var(--text-3)] ml-3">Pílula com borda:</span>
              <span className="pillbtn bordered">
                <Sparkles size={13} className="text-[var(--accent)]" /> Pro Mode
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Inputs & Form Elements */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Inputs &amp; Formulários
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Controles com 30px de altura, anel de foco suave e estilo harmonioso.
          </p>
        </div>

        <div className="panel p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Default input */}
          <div className="field">
            <label className="label">Nome da Campanha</label>
            <Input placeholder="Ex: Black Friday 2026" />
            <span className="hint">Usado para identificação interna.</span>
          </div>

          {/* Inwrap with Icon and Shortcut */}
          <div className="field">
            <label className="label">Busca com Atalho</label>
            <div className="inwrap">
              <Search size={14} className="i" />
              <Input placeholder="Buscar contatos…" />
              <kbd className="kbd">/</kbd>
            </div>
            <span className="hint">Pressione &apos;/&apos; para focar instantaneamente.</span>
          </div>

          {/* Select */}
          <div className="field">
            <label className="label">Instância Padrão</label>
            <select className="select">
              <option>WhatsApp Principal (Conectado)</option>
              <option>Suporte Comercial</option>
              <option>Atendimento Pós-Venda</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="field">
            <label className="label">Toggles &amp; Interruptores</label>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={toggleState}
                  onChange={(e) => setToggleState(e.target.checked)}
                />
                <span>Auto-resposta {toggleState ? "Ativa" : "Pausada"}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input type="checkbox" className="toggle" defaultChecked={false} />
                <span>Webhooks</span>
              </label>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="field">
            <label className="label">Caixas de Seleção</label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  className="check"
                  checked={checkState}
                  onChange={(e) => setCheckState(e.target.checked)}
                />
                <span>Marcar lido</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input type="checkbox" className="check round" defaultChecked />
                <span>Modo Circular</span>
              </label>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="field">
            <label className="label">Controle Segmentado (.seg)</label>
            <div className="seg w-fit">
              <button
                type="button"
                className={segState === "list" ? "on" : ""}
                onClick={() => setSegState("list")}
              >
                Lista
              </button>
              <button
                type="button"
                className={segState === "board" ? "on" : ""}
                onClick={() => setSegState("board")}
              >
                Kanban
              </button>
              <button
                type="button"
                className={segState === "table" ? "on" : ""}
                onClick={() => setSegState("table")}
              >
                Tabela
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Badges & Status Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Badges, Chips &amp; Indicadores de Status
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Semântica de cores suaves para estados de sincronização, filas e tags.
          </p>
        </div>

        <div className="panel p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="badge">Padrão</span>
            <span className="badge accent">Em Andamento</span>
            <span className="badge green">
              <span className="dot" /> Conectado
            </span>
            <span className="badge amber">
              <span className="dot" /> Reconectando
            </span>
            <span className="badge red">
              <span className="dot" /> Desconectado
            </span>
            <span className="badge violet">VIP Atendimento</span>
            <span className="badge gray">Rascunho</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[var(--divider)]">
            <span className="chip">
              <Layers size={13} />
              <b>Status</b> é <span>Online</span>
            </span>

            <span className="lbl" style={{ "--c": "var(--violet)" } as React.CSSProperties}>
              <i /> Suporte Técnico
            </span>

            <span className="lbl" style={{ "--c": "var(--blue)" } as React.CSSProperties}>
              <i /> Comercial
            </span>

            <span className="lbl" style={{ "--c": "var(--teal)" } as React.CSSProperties}>
              <i /> Financeiro
            </span>

            <span className="due">
              <Calendar size={12} /> Vence hoje
            </span>

            <span className="due over">
              <Calendar size={12} /> Atrasado há 2 dias
            </span>
          </div>
        </div>
      </section>

      {/* 7. Stats Widgets & Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Widgets de Métricas &amp; Cartões (.stat e .pcard)
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Métricas com números tabulares e cartões de projeto estruturados.
          </p>
        </div>

        {/* 4-Stat Grid from Gr8r Studio */}
        <div className="stats">
          <div className="stat">
            <span className="k">Mensagens Enviadas</span>
            <span className="v">128.490</span>
            <span className="d up">↑ 14% vs semana anterior</span>
          </div>
          <div className="stat">
            <span className="k">Taxa de Entrega</span>
            <span className="v">98.7%</span>
            <span className="d up">↑ Alta confiabilidade</span>
          </div>
          <div className="stat">
            <span className="k">Tempo Médio Resposta</span>
            <span className="v">1m 42s</span>
            <span className="d up">↓ 24s mais rápido</span>
          </div>
          <div className="stat">
            <span className="k">Sessões Ativas</span>
            <span className="v">12 / 12</span>
            <span className="d">Todas operacionais</span>
          </div>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="pcard">
            <div className="flex items-center justify-between">
              <span className="pstatus" style={{ "--c": "var(--green)" } as React.CSSProperties}>
                <i /> Operacional
              </span>
              <span className="text-[11px] font-mono text-[var(--text-3)]">WA-01</span>
            </div>
            <div>
              <h3 className="font-semibold text-[14.5px] text-[var(--text)]">WhatsApp Principal</h3>
              <p className="text-[12.5px] text-[var(--text-2)] line-clamp-2 mt-1">
                Conectado com o número de atendimento ao cliente oficial.
              </p>
            </div>
            <div className="foot flex items-center justify-between pt-3 border-t border-[var(--divider)]">
              <span className="text-[11.5px] text-[var(--text-3)]">Sincronizado há 1m</span>
              <Button size="sm" variant="outline">
                Gerenciar
              </Button>
            </div>
          </div>

          <div className="pcard">
            <div className="flex items-center justify-between">
              <span className="pstatus" style={{ "--c": "var(--amber)" } as React.CSSProperties}>
                <i /> Em fila
              </span>
              <span className="text-[11px] font-mono text-[var(--text-3)]">DISPARO</span>
            </div>
            <div>
              <h3 className="font-semibold text-[14.5px] text-[var(--text)]">Campanha de Reativação</h3>
              <p className="text-[12.5px] text-[var(--text-2)] line-clamp-2 mt-1">
                Envio programado de 1.500 mensagens para clientes inativos há 30 dias.
              </p>
            </div>
            <div className="foot flex items-center justify-between pt-3 border-t border-[var(--divider)]">
              <span className="text-[11.5px] text-[var(--text-3)]">Inicia às 14:00</span>
              <Button size="sm" variant="outline">
                Ver detalhes
              </Button>
            </div>
          </div>

          <div className="pcard">
            <div className="flex items-center justify-between">
              <span className="pstatus" style={{ "--c": "var(--violet)" } as React.CSSProperties}>
                <i /> AI Bot
              </span>
              <span className="text-[11px] font-mono text-[var(--text-3)]">AGENTE</span>
            </div>
            <div>
              <h3 className="font-semibold text-[14.5px] text-[var(--text)]">Assistente Comercial</h3>
              <p className="text-[12.5px] text-[var(--text-2)] line-clamp-2 mt-1">
                Responde dúvidas frequentes, qualifica leads e transfere para humanos.
              </p>
            </div>
            <div className="foot flex items-center justify-between pt-3 border-t border-[var(--divider)]">
              <span className="text-[11.5px] text-[var(--text-3)]">42 diálogos hoje</span>
              <Button size="sm" variant="outline">
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Feedback & System Alerts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Alertas &amp; Feedback do Sistema (.alert)
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Avisos de sistema sutis com bordas refinadas e fundos suaves.
          </p>
        </div>

        <div className="space-y-3">
          <div className="alert info">
            <Info size={16} className="i" />
            <div>
              <b>Informação:</b> O gateway utiliza autenticação multi-device via WebSocket para garantir latência ultra baixa.
            </div>
          </div>

          <div className="alert ok">
            <CheckCircle2 size={16} className="i" />
            <div>
              <b>Tudo pronto:</b> Sessão conectada com sucesso e fila de atendimento pronta para envio.
            </div>
          </div>

          <div className="alert warn">
            <AlertTriangle size={16} className="i" />
            <div>
              <b>Atenção com disparos:</b> Recomenda-se intervalo de no mínimo 5 segundos entre mensagens para evitar bloqueios.
            </div>
          </div>

          <div className="alert danger">
            <AlertCircle size={16} className="i" />
            <div>
              <b>Sessão desconectada:</b> A instância &quot;Suporte 02&quot; precisa de leitura do QR Code novamente.
            </div>
          </div>
        </div>
      </section>

      {/* 9. Interactive Triggers (Toasts, Modals, Command Palette) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em]">
            Demos Interativas &amp; Triggers
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Teste os toasts, paleta de comandos e efeitos táteis.
          </p>
        </div>

        <div className="panel p-5 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              toast.success("Mensagem enviada com sucesso!", {
                description: "O contato recebeu o template formatado.",
              })
            }
          >
            Toast de Sucesso
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              toast.error("Erro na conexão", {
                description: "Verifique os logs do servidor para mais detalhes.",
              })
            }
          >
            Toast de Erro
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              toast.info("Nova mensagem recebida", {
                description: "Cliente solicitou atendimento via fila comercial.",
              })
            }
          >
            Toast Informativo
          </Button>

          <Button
            variant="default"
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <Command size={14} /> Abrir Menu de Comandos (⌘K)
          </Button>
        </div>
      </section>

      {/* 9. WhatsApp Conversation Background & Chat UI */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text)] tracking-[-0.01em] flex items-center gap-2">
            <MessageSquare size={16} className="text-[#00a884]" />
            Plano de Fundo Oficial das Conversas (WhatsApp Wallpaper)
          </h2>
          <p className="text-[12.5px] text-[var(--text-3)]">
            Fundo escuro oficial com doodle de ícones (câmera, notas musicais, emojis, café) aplicado na tela de chat (/dashboard/chat).
          </p>
        </div>

        <div className="rounded-2xl border border-[#222d34] overflow-hidden shadow-2xl shadow-black/40 max-w-3xl">
          {/* Mock Header */}
          <div className="bg-[#202c33] px-4 py-3 border-b border-[#222d34] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00a884] to-[#005c4b] text-white flex items-center justify-center font-semibold text-sm">
                  JD
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-[#202c33]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#e9edef] leading-tight">João Silva</h3>
                <p className="text-[11px] text-[#8696a0]">online • Suporte ao Cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#00a884]/15 text-[#00a884] font-medium border border-[#00a884]/20">
                Fila Atendimento
              </span>
            </div>
          </div>

          {/* Wallpaper Chat Container */}
          <div className="whatsapp-chat-wallpaper p-4 space-y-3.5 min-h-[340px] flex flex-col justify-end">
            {/* Date Tag */}
            <div className="flex justify-center">
              <span className="text-[10px] font-semibold text-[#8696a0] bg-[#182229]/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/[0.06] shadow-xs">
                HOJE
              </span>
            </div>

            {/* Received Message */}
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-[#e9edef] border border-white/[0.05] rounded-2xl rounded-tl-xs px-3.5 py-2 max-w-[80%] shadow-xs space-y-1">
                <p className="text-[13px] leading-relaxed">
                  Olá! Gostaria de tirar uma dúvida sobre o plano de integração do WhatsApp.
                </p>
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#8696a0]">13:20</span>
                </div>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex justify-end">
              <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[80%] shadow-xs space-y-1">
                <p className="text-[13px] leading-relaxed">
                  Com certeza! O plano de fundo escuro com doodles e o design system do Gr8r Studio já estão 100% integrados no sistema!
                </p>
                <div className="flex items-center justify-end gap-1 select-none">
                  <span className="text-[10px] text-[#8696a0]">13:21</span>
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                </div>
              </div>
            </div>

            {/* Received Message with Bot Tag */}
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-[#e9edef] border border-white/[0.05] rounded-2xl rounded-tl-xs px-3.5 py-2 max-w-[80%] shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#00a884] font-medium pb-0.5">
                  <Bot size={12} /> Confy Auto-Reply
                </div>
                <p className="text-[13px] leading-relaxed">
                  Você precisa de mais algum ajuste ou deseja atualizar na VPS?
                </p>
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#8696a0]">13:22</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Input Bar */}
          <div className="bg-[#202c33] px-3 py-2.5 border-t border-[#222d34] flex items-center gap-2">
            <button className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-lg transition-colors">
              <Smile size={18} />
            </button>
            <button className="text-[#8696a0] hover:text-[#e9edef] p-1.5 rounded-lg transition-colors">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 bg-[#2a3942] rounded-lg px-3 py-1.5 text-xs text-[#e9edef] flex items-center justify-between">
              <span className="text-[#8696a0]">Digite uma mensagem...</span>
            </div>
            <button className="bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] p-2 rounded-lg transition-all shadow-sm">
              <Send size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
    </RoleGuard>
  );
}
