"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionGuard } from "@/components/dashboard/session-guard";
import {
    BarChart3,
    Clock,
    CheckCircle2,
    MessageSquare,
    Users,
    Building2,
    RefreshCw,
    AlertCircle,
    Loader2,
    Star,
    Activity,
    Download,
    FileSpreadsheet,
    FileJson,
    ArrowUpRight,
    Tag,
    AlertTriangle,
    Check,
    Timer,
    Flame,
    Radio,
    UserCheck,
    Search,
    MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AttendanceMetricsData {
    period: {
        days: number;
        label: string;
    };
    summary: {
        totalTickets: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
        resolutionRate: number;
        avgTmrSeconds: number;
        avgTmrFormatted: string;
        avgTmaSeconds: number;
        avgTmaFormatted: string;
        avgCsat?: number | null;
        csatCount?: number;
        satisfactionPercentage?: number | null;
    };
    live: {
        waitingQueue: {
            id: string;
            jid: string;
            contactName: string;
            openedAt: string;
            waitingSeconds: number;
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            department: { name: string; colorHex: string } | null;
            assignedUser: { name: string } | null;
        }[];
        inProgressLive: {
            id: string;
            jid: string;
            contactName: string;
            openedAt: string;
            durationSeconds: number;
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            department: { name: string; colorHex: string } | null;
            assignedUser: { id: string; name: string } | null;
        }[];
        queueAlerts: {
            over5min: number;
            over15min: number;
            over30min: number;
        };
        totalActiveNow: number;
    };
    csat: {
        avgCsat: number | null;
        satisfactionPercentage: number | null;
        totalRatings: number;
        distribution: Record<number, number>;
        feedbacks: {
            id: string;
            jid: string;
            contactName: string;
            score: number;
            comment: string | null;
            answeredAt: string;
            attendantName: string;
            departmentName: string;
        }[];
    };
    departments: {
        id: string;
        name: string;
        colorHex: string;
        ticketsCount: number;
        openCount: number;
        inProgressCount: number;
        resolvedCount: number;
        attendantsCount: number;
        percentOfTotal: number;
    }[];
    attendants: {
        id: string;
        name: string;
        email: string;
        role: string;
        assignedTotal: number;
        resolvedCount: number;
        activeCount: number;
        avgTmrSeconds: number;
        avgCsat?: number | null;
        csatCount?: number;
        resolutionRate: number;
    }[];
    labels: {
        id: string;
        name: string;
        colorHex: string;
        count: number;
        percentOfTotal: number;
    }[];
    exportTickets: {
        id: string;
        jid: string;
        contactName: string;
        status: string;
        priority: string;
        attendant: string;
        department: string;
        tmrSeconds: number | null;
        csatScore: number | null;
        csatComment: string;
        openedAt: string;
        closedAt: string | null;
    }[];
}

export default function AttendanceReportsPage() {
    return (
        <SessionGuard>
            <AttendanceReportsContent />
        </SessionGuard>
    );
}

function formatDurationSeconds(sec: number): string {
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    if (min < 60) return `${min}m ${remSec}s`;
    const hours = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hours}h ${remMin}m`;
}

function downloadCsv(filename: string, rows: (string | number | null | undefined)[][], headers: string[]) {
    const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
    };
    const csvContent = "\uFEFF" + [
        headers.map(escapeCsv).join(";"),
        ...rows.map(row => row.map(escapeCsv).join(";"))
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadJson(filename: string, data: any) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function AttendanceReportsContent() {
    const { sessionId } = useSession();
    const [metrics, setMetrics] = useState<AttendanceMetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState<number>(7);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState("live");
    const [searchExport, setSearchExport] = useState("");

    const loadMetrics = useCallback(async (quiet = false) => {
        if (!sessionId) return;
        if (!quiet) setLoading(true);
        try {
            const queryParam = selectedDays > 0 ? `?days=${selectedDays}` : "";
            const res = await fetch(`/api/reports/attendance/${sessionId}${queryParam}`);
            const data = await res.json();
            if (res.ok) {
                setMetrics(data.data);
            } else {
                toast.error(data.message || "Erro ao carregar relatórios");
            }
        } catch (error) {
            console.error("Failed to load attendance metrics", error);
            toast.error("Falha ao conectar com o serviço de relatórios");
        } finally {
            if (!quiet) setLoading(false);
        }
    }, [sessionId, selectedDays]);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    // Auto-refresh timer (every 15s when active)
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            loadMetrics(true);
        }, 15000);
        return () => clearInterval(interval);
    }, [autoRefresh, loadMetrics]);

    // Handlers for exporting
    const handleExportTicketsCsv = () => {
        if (!metrics?.exportTickets?.length) {
            toast.warning("Nenhum dado de atendimento para exportar no período");
            return;
        }
        const headers = ["ID Ticket", "JID", "Contato", "Status", "Prioridade", "Atendente", "Setor", "TMR (segundos)", "Nota CSAT", "Comentário CSAT", "Aberto em", "Fechado em"];
        const rows = metrics.exportTickets.map(t => [
            t.id,
            t.jid,
            t.contactName,
            t.status,
            t.priority,
            t.attendant,
            t.department,
            t.tmrSeconds,
            t.csatScore,
            t.csatComment,
            t.openedAt ? new Date(t.openedAt).toLocaleString("pt-BR") : "",
            t.closedAt ? new Date(t.closedAt).toLocaleString("pt-BR") : ""
        ]);
        const dateStr = new Date().toISOString().slice(0, 10);
        downloadCsv(`atendimentos-${sessionId}-${dateStr}.csv`, rows, headers);
        toast.success("Relatório de atendimentos baixado com sucesso!");
    };

    const handleExportAttendantsCsv = () => {
        if (!metrics?.attendants?.length) {
            toast.warning("Nenhum dado de operadores para exportar");
            return;
        }
        const headers = ["Atendente", "Email", "Cargo", "Total Assumidos", "Ativos Agora", "Resolvidos", "TMR Médio (segundos)", "Nota CSAT", "Total Avaliações", "Taxa Resolução (%)"];
        const rows = metrics.attendants.map(a => [
            a.name,
            a.email,
            a.role,
            a.assignedTotal,
            a.activeCount,
            a.resolvedCount,
            a.avgTmrSeconds,
            a.avgCsat || "",
            a.csatCount || 0,
            `${a.resolutionRate}%`
        ]);
        const dateStr = new Date().toISOString().slice(0, 10);
        downloadCsv(`produtividade-agentes-${sessionId}-${dateStr}.csv`, rows, headers);
        toast.success("Relatório de produtividade baixado com sucesso!");
    };

    const handleExportFullJson = () => {
        if (!metrics) return;
        const dateStr = new Date().toISOString().slice(0, 10);
        downloadJson(`relatorio-completo-${sessionId}-${dateStr}.json`, metrics);
        toast.success("Relatório JSON completo baixado com sucesso!");
    };

    const filteredExportTickets = useMemo(() => {
        if (!metrics?.exportTickets) return [];
        if (!searchExport.trim()) return metrics.exportTickets.slice(0, 20);
        const q = searchExport.toLowerCase();
        return metrics.exportTickets.filter(t =>
            t.contactName.toLowerCase().includes(q) ||
            t.jid.toLowerCase().includes(q) ||
            t.attendant.toLowerCase().includes(q) ||
            t.department.toLowerCase().includes(q)
        ).slice(0, 50);
    }, [metrics?.exportTickets, searchExport]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Relatórios & Análises
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Ao Vivo
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-3xl">
                        Monitoramento em tempo real da fila, produtividade por agente, satisfação do cliente (CSAT) e exportações operacionais.
                    </p>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                    {/* Period Selector */}
                    <div className="bg-muted/60 p-1 rounded-xl flex items-center gap-1 border border-border/50 text-xs">
                        <button
                            type="button"
                            onClick={() => setSelectedDays(1)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg font-medium transition-all",
                                selectedDays === 1 ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Hoje
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedDays(7)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg font-medium transition-all",
                                selectedDays === 7 ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            7 Dias
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedDays(30)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg font-medium transition-all",
                                selectedDays === 30 ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            30 Dias
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedDays(0)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg font-medium transition-all",
                                selectedDays === 0 ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Tudo
                        </button>
                    </div>

                    {/* Auto Refresh Toggle */}
                    <Button
                        variant={autoRefresh ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn("gap-1.5 rounded-xl text-xs", autoRefresh && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                    >
                        <Radio className={cn("h-3.5 w-3.5", autoRefresh && "animate-pulse text-white")} />
                        {autoRefresh ? "Auto (15s)" : "Auto-refresh"}
                    </Button>

                    {/* Manual Refresh */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadMetrics(false)}
                        disabled={loading}
                        className="gap-1.5 rounded-xl text-xs"
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                        Atualizar
                    </Button>
                </div>
            </div>

            {loading && !metrics ? (
                <div className="flex flex-col items-center justify-center py-28 space-y-3">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Compilando inteligência e métricas em tempo real...</p>
                </div>
            ) : metrics ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    {/* Navigation Tabs Pill Bar */}
                    <TabsList className="bg-muted/40 p-1.5 rounded-2xl border border-border/50 flex flex-wrap h-auto gap-1">
                        <TabsTrigger
                            value="live"
                            className="rounded-xl px-4 py-2 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            Monitoramento Ao Vivo
                            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-bold bg-primary/10 text-primary">
                                {metrics.live.totalActiveNow}
                            </Badge>
                        </TabsTrigger>

                        <TabsTrigger
                            value="operational"
                            className="rounded-xl px-4 py-2 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Visibilidade Operacional
                        </TabsTrigger>

                        <TabsTrigger
                            value="csat"
                            className="rounded-xl px-4 py-2 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                        >
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            Relatórios CSAT
                            {metrics.csat.avgCsat && (
                                <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold">
                                    ★ {metrics.csat.avgCsat}
                                </Badge>
                            )}
                        </TabsTrigger>

                        <TabsTrigger
                            value="exports"
                            className="rounded-xl px-4 py-2 text-xs font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                        >
                            <Download className="h-4 w-4" />
                            Downloads & Exportação
                        </TabsTrigger>
                    </TabsList>

                    {/* ─────────────────────────────────────────────────────────────
                        TAB 1: MONITORAMENTO AO VIVO
                    ───────────────────────────────────────────────────────────── */}
                    <TabsContent value="live" className="space-y-6">
                        {/* Live SLA & Queue Alerts Banner */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <Card className="border-border/60 hover:border-emerald-500/40 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fila em Tempo Regular</p>
                                        <h3 className="text-2xl font-bold text-foreground">
                                            {metrics.live.waitingQueue.length - metrics.live.queueAlerts.over5min}
                                        </h3>
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Aguardando &lt; 5 min</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <Timer className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={cn(
                                "border-border/60 transition-colors",
                                metrics.live.queueAlerts.over15min > 0 && "border-amber-500/40 bg-amber-500/[0.02]"
                            )}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Atenção (Espera &gt; 15m)</p>
                                        <h3 className={cn("text-2xl font-bold", metrics.live.queueAlerts.over15min > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>
                                            {metrics.live.queueAlerts.over15min}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground">Demanda redistribuição</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={cn(
                                "border-border/60 transition-colors",
                                metrics.live.queueAlerts.over30min > 0 && "border-red-500/40 bg-red-500/[0.03]"
                            )}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Crítico (Espera &gt; 30m)</p>
                                        <h3 className={cn("text-2xl font-bold", metrics.live.queueAlerts.over30min > 0 ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                                            {metrics.live.queueAlerts.over30min}
                                        </h3>
                                        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Prioridade máxima de resposta</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                                        <Flame className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Live Waiting Queue and Attendant Workload side-by-side */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Waiting Queue Table (7 cols) */}
                            <Card className="lg:col-span-7 border-border/60">
                                <CardHeader className="pb-3 border-b border-border/40">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Clock className="h-4.5 w-4.5 text-amber-500" />
                                                Fila de Espera (Aguardando Atendimento)
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Conversas abertas que ainda não foram finalizadas ou atribuídas a um atendente.
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                                            {metrics.live.waitingQueue.length} na fila
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {metrics.live.waitingQueue.length === 0 ? (
                                        <div className="py-12 text-center space-y-2">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm font-semibold text-foreground">Fila zerada!</p>
                                            <p className="text-xs text-muted-foreground">Todos os clientes foram atendidos ou estão em andamento.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/30 max-h-[380px] overflow-y-auto">
                                            {metrics.live.waitingQueue.map((item) => {
                                                const isCritical = item.waitingSeconds >= 1800;
                                                const isWarning = item.waitingSeconds >= 900;
                                                return (
                                                    <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                        <div className="space-y-1 min-w-0 pr-3">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-sm text-foreground truncate">{item.contactName}</p>
                                                                {item.priority === "URGENT" && (
                                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 font-bold">
                                                                        Urgente
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground font-mono">{item.jid.split('@')[0]}</p>
                                                        </div>

                                                        <div className="flex items-center gap-3 shrink-0">
                                                            {item.department && (
                                                                <span
                                                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium hidden sm:inline-block"
                                                                    style={{
                                                                        backgroundColor: `${item.department.colorHex}20`,
                                                                        color: item.department.colorHex
                                                                    }}
                                                                >
                                                                    {item.department.name}
                                                                </span>
                                                            )}
                                                            <span className={cn(
                                                                "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1",
                                                                isCritical ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30" :
                                                                isWarning ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                                                                "bg-muted text-muted-foreground"
                                                            )}>
                                                                <Clock className="h-3 w-3" />
                                                                {formatDurationSeconds(item.waitingSeconds)}
                                                            </span>
                                                            <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                                                                <Link href={`/dashboard/chat?jid=${encodeURIComponent(item.jid)}`} title="Atender no Chat">
                                                                    <ArrowUpRight className="h-4 w-4 text-primary" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Attendant Live Workload (5 cols) */}
                            <Card className="lg:col-span-5 border-border/60">
                                <CardHeader className="pb-3 border-b border-border/40">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Users className="h-4.5 w-4.5 text-primary" />
                                                Carga Atual da Equipe
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Operadores e quantidade de conversas ativas agora.
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {metrics.attendants.length} agentes
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3.5 space-y-3 max-h-[380px] overflow-y-auto">
                                    {metrics.attendants.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-8">Nenhum operador configurado.</p>
                                    ) : (
                                        metrics.attendants.map(att => {
                                            const workloadPercent = Math.min(100, Math.round((att.activeCount / 10) * 100));
                                            return (
                                                <div key={att.id} className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                                                {att.name.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-foreground truncate">{att.name}</p>
                                                                <p className="text-[10px] text-muted-foreground truncate">{att.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <span className="font-bold text-sm text-primary">{att.activeCount}</span>
                                                            <span className="text-[10px] text-muted-foreground"> ativas</span>
                                                        </div>
                                                    </div>
                                                    {/* Workload Progress Bar */}
                                                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-300",
                                                                att.activeCount > 6 ? "bg-red-500" : att.activeCount > 3 ? "bg-amber-500" : "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${Math.max(5, workloadPercent)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* In Progress Live Chats Table */}
                        <Card className="border-border/60">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <Activity className="h-4.5 w-4.5 text-blue-500" />
                                            Conversas em Andamento Agora ({metrics.live.inProgressLive.length})
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Atendimentos ativos com operadores alocados em tempo real.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {metrics.live.inProgressLive.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-8">Nenhum atendimento em andamento no momento.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-muted/40 text-muted-foreground uppercase border-b border-border/40 text-[10px] tracking-wider">
                                                <tr>
                                                    <th className="py-2.5 px-4 font-semibold">Cliente</th>
                                                    <th className="py-2.5 px-4 font-semibold">Atendente Responsável</th>
                                                    <th className="py-2.5 px-4 font-semibold">Setor</th>
                                                    <th className="py-2.5 px-4 font-semibold text-center">Tempo Decorrido</th>
                                                    <th className="py-2.5 px-4 font-semibold text-right">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/30">
                                                {metrics.live.inProgressLive.map(chat => (
                                                    <tr key={chat.id} className="hover:bg-muted/20 transition-colors">
                                                        <td className="py-2.5 px-4">
                                                            <p className="font-semibold text-foreground text-sm">{chat.contactName}</p>
                                                            <p className="text-[11px] text-muted-foreground font-mono">{chat.jid.split('@')[0]}</p>
                                                        </td>
                                                        <td className="py-2.5 px-4">
                                                            <span className="font-medium text-foreground flex items-center gap-1.5">
                                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                {chat.assignedUser?.name || "Operador"}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-4">
                                                            {chat.department ? (
                                                                <span
                                                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                                                    style={{
                                                                        backgroundColor: `${chat.department.colorHex}20`,
                                                                        color: chat.department.colorHex
                                                                    }}
                                                                >
                                                                    {chat.department.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground/60">Geral</span>
                                                            )}
                                                        </td>
                                                        <td className="py-2.5 px-4 text-center font-mono font-medium">
                                                            {formatDurationSeconds(chat.durationSeconds)}
                                                        </td>
                                                        <td className="py-2.5 px-4 text-right">
                                                            <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1 rounded-lg">
                                                                <Link href={`/dashboard/chat?jid=${encodeURIComponent(chat.jid)}`}>
                                                                    Ver Chat
                                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ─────────────────────────────────────────────────────────────
                        TAB 2: VISIBILIDADE OPERACIONAL
                    ───────────────────────────────────────────────────────────── */}
                    <TabsContent value="operational" className="space-y-6">
                        {/* Executive KPI Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                            <Card className="border-border/60 hover:shadow-xs transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Volume de Conversas</p>
                                        <h3 className="text-2xl font-bold text-foreground">{metrics.summary.totalTickets}</h3>
                                        <p className="text-[11px] text-muted-foreground">{metrics.period.label}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 hover:shadow-xs transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">TMR Médio (1ª Resposta)</p>
                                        <h3 className="text-2xl font-bold text-foreground">{metrics.summary.avgTmrFormatted}</h3>
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Tempo até resposta humana</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 hover:shadow-xs transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">TMA Médio (Atendimento)</p>
                                        <h3 className="text-2xl font-bold text-foreground">{metrics.summary.avgTmaFormatted}</h3>
                                        <p className="text-[11px] text-muted-foreground">Até encerramento</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                                        <Timer className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 hover:shadow-xs transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Taxa de Resolução</p>
                                        <h3 className="text-2xl font-bold text-foreground">{metrics.summary.resolutionRate}%</h3>
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                            {metrics.summary.resolvedTickets} concluídos
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 hover:shadow-xs transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Índice CSAT</p>
                                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-1.5">
                                            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                            {metrics.summary.avgCsat ? `${metrics.summary.avgCsat}` : "--"}
                                            {metrics.summary.avgCsat && <span className="text-xs text-muted-foreground font-normal">/5</span>}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground">
                                            {metrics.summary.csatCount || 0} avaliações
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Star className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Agents Ranking Table */}
                        <Card className="border-border/60">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <Users className="h-4.5 w-4.5 text-primary" />
                                            Produtividade & Desempenho dos Atendentes
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Ranking por conversas resolvidas, tempo de primeira resposta (TMR) e satisfação de clientes.
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleExportAttendantsCsv} className="gap-1.5 text-xs rounded-xl">
                                        <Download className="h-3.5 w-3.5" />
                                        Exportar Ranking
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {metrics.attendants.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-8">Nenhum operador com atendimentos registrados no período.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="text-[10px] uppercase bg-muted/40 text-muted-foreground border-b border-border/40 tracking-wider">
                                                <tr>
                                                    <th className="py-3 px-4 font-semibold">Atendente</th>
                                                    <th className="py-3 px-4 font-semibold text-center">Assumidos</th>
                                                    <th className="py-3 px-4 font-semibold text-center">Ativos Agora</th>
                                                    <th className="py-3 px-4 font-semibold text-center">Resolvidos</th>
                                                    <th className="py-3 px-4 font-semibold text-center">TMR Médio</th>
                                                    <th className="py-3 px-4 font-semibold text-center">Nota CSAT</th>
                                                    <th className="py-3 px-4 font-semibold text-right">Taxa de Resolução</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/30">
                                                {metrics.attendants.map((att, i) => (
                                                    <tr key={att.id} className="hover:bg-muted/20 transition-colors">
                                                        <td className="py-3 px-4 flex items-center gap-2.5">
                                                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                                                {i + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground text-sm">{att.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">{att.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-medium text-sm">{att.assignedTotal}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold">
                                                                {att.activeCount}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold">
                                                                {att.resolvedCount}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-mono">
                                                            {att.avgTmrSeconds > 0 ? `${att.avgTmrSeconds}s` : "--"}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {att.avgCsat ? (
                                                                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                    {att.avgCsat}
                                                                    <span className="text-[10px] text-muted-foreground font-normal">({att.csatCount})</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground/60">--</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <span className="font-bold text-sm text-foreground">{att.resolutionRate}%</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Departments and Labels breakdown side by side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Department Breakdown */}
                            <Card className="border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Building2 className="h-4.5 w-4.5 text-primary" />
                                        Caixas de Entrada & Departamentos
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Volume e distribuição por fila configurada.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {metrics.departments.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-6">Nenhum departamento cadastrado.</p>
                                    ) : (
                                        metrics.departments.map(d => (
                                            <div key={d.id} className="p-3.5 rounded-xl border border-border/50 bg-muted/20 space-y-2.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.colorHex }} />
                                                        <span className="font-semibold text-foreground text-sm">{d.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {d.attendantsCount} operadores
                                                        </Badge>
                                                        <span className="font-bold text-foreground">{d.ticketsCount} conversas</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                    <div className="p-1.5 rounded-lg bg-background border border-border/40">
                                                        <p className="text-muted-foreground text-[10px]">Fila</p>
                                                        <p className="font-bold text-amber-500 mt-0.5">{d.openCount}</p>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-background border border-border/40">
                                                        <p className="text-muted-foreground text-[10px]">Atendendo</p>
                                                        <p className="font-bold text-blue-500 mt-0.5">{d.inProgressCount}</p>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-background border border-border/40">
                                                        <p className="text-muted-foreground text-[10px]">Resolvidos</p>
                                                        <p className="font-bold text-emerald-500 mt-0.5">{d.resolvedCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Labels / Tags Breakdown */}
                            <Card className="border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Tag className="h-4.5 w-4.5 text-primary" />
                                        Etiquetas (Tags) Mais Utilizadas
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Distribuição de categorias e motivos de contato.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {metrics.labels.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-6">Nenhuma etiqueta atribuída a conversas ainda.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {metrics.labels.slice(0, 8).map(lbl => (
                                                <div key={lbl.id} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: lbl.colorHex }} />
                                                        <span className="font-medium text-foreground">{lbl.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 bg-muted rounded-full h-1.5 hidden sm:block overflow-hidden">
                                                            <div className="h-full rounded-full bg-primary" style={{ width: `${lbl.percentOfTotal}%` }} />
                                                        </div>
                                                        <span className="font-mono font-bold text-foreground w-12 text-right">{lbl.count} ({lbl.percentOfTotal}%)</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* ─────────────────────────────────────────────────────────────
                        TAB 3: RELATÓRIOS CSAT
                    ───────────────────────────────────────────────────────────── */}
                    <TabsContent value="csat" className="space-y-6">
                        {/* CSAT Hero and Rating Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Score Card Hero (4 cols) */}
                            <Card className="lg:col-span-4 border-border/60 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-amber-500/[0.04] to-background">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nota Geral CSAT</p>
                                    <h2 className="text-5xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2">
                                        <Star className="h-10 w-10 fill-amber-500 text-amber-500" />
                                        {metrics.csat.avgCsat ? metrics.csat.avgCsat : "--"}
                                    </h2>
                                    <div className="flex justify-center gap-1 text-amber-500 py-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "h-5 w-5",
                                                    (metrics.csat.avgCsat || 0) >= star ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        {metrics.csat.satisfactionPercentage !== null ? `${metrics.csat.satisfactionPercentage}% de Satisfação Positiva` : "Aguardando avaliações"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Baseado em {metrics.csat.totalRatings} avaliações respondidas
                                    </p>
                                </div>
                            </Card>

                            {/* Stars breakdown distribution (8 cols) */}
                            <Card className="lg:col-span-8 border-border/60">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Distribuição de Estrelas (1 a 5)</CardTitle>
                                    <CardDescription className="text-xs">Proporção de notas recebidas pelos clientes após o encerramento do ticket.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = metrics.csat.distribution[stars] || 0;
                                        const percent = metrics.csat.totalRatings > 0 ? Math.round((count / metrics.csat.totalRatings) * 100) : 0;
                                        return (
                                            <div key={stars} className="flex items-center gap-3 text-xs">
                                                <div className="w-16 flex items-center gap-1 font-semibold text-foreground">
                                                    <span>{stars}</span>
                                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                </div>
                                                <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-500",
                                                            stars >= 4 ? "bg-emerald-500" : stars === 3 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <div className="w-20 text-right font-medium">
                                                    <span className="font-bold text-foreground">{count}</span>
                                                    <span className="text-muted-foreground text-[11px]"> ({percent}%)</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Feedbacks List */}
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <MessageSquare className="h-4.5 w-4.5 text-primary" />
                                    Comentários & Feedbacks dos Clientes
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Opiniões e avaliações qualitativas registradas pela pesquisa pós-atendimento.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {metrics.csat.feedbacks.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-10">Nenhum feedback com comentário registrado ainda.</p>
                                ) : (
                                    <div className="divide-y divide-border/30 max-h-[450px] overflow-y-auto">
                                        {metrics.csat.feedbacks.map(f => (
                                            <div key={f.id} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground text-sm">{f.contactName}</span>
                                                        <span className="text-muted-foreground">atendido por <strong className="text-foreground">{f.attendantName}</strong> ({f.departmentName})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                                                        {[...Array(f.score)].map((_, i) => (
                                                            <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                        ))}
                                                        <span className="text-xs text-muted-foreground ml-1.5">
                                                            {new Date(f.answeredAt).toLocaleDateString("pt-BR")}
                                                        </span>
                                                    </div>
                                                </div>
                                                {f.comment ? (
                                                    <p className="text-xs text-foreground/90 bg-muted/30 p-2.5 rounded-lg border border-border/40 italic">
                                                        “{f.comment}”
                                                    </p>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground/60 italic">Avaliação sem comentário por escrito.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ─────────────────────────────────────────────────────────────
                        TAB 4: DOWNLOADS & EXPORTAÇÃO
                    ───────────────────────────────────────────────────────────── */}
                    <TabsContent value="exports" className="space-y-6">
                        {/* 3 Download Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-border/60 hover:border-primary/40 transition-all p-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <FileSpreadsheet className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground">Relatório de Atendimentos</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Planilha completa em CSV/Excel com todos os tickets do período, atendentes, TMR, CSAT e status.
                                    </p>
                                </div>
                                <Button onClick={handleExportTicketsCsv} className="w-full gap-2 rounded-xl text-xs font-semibold">
                                    <Download className="h-4 w-4" />
                                    Baixar Planilha CSV
                                </Button>
                            </Card>

                            <Card className="border-border/60 hover:border-primary/40 transition-all p-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <UserCheck className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground">Produtividade da Equipe</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Tabela consolidada de métricas por operador: volume de conversas, média de TMR e taxa de resolução.
                                    </p>
                                </div>
                                <Button onClick={handleExportAttendantsCsv} variant="outline" className="w-full gap-2 rounded-xl text-xs font-semibold">
                                    <Download className="h-4 w-4" />
                                    Baixar Desempenho CSV
                                </Button>
                            </Card>

                            <Card className="border-border/60 hover:border-primary/40 transition-all p-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                        <FileJson className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground">Backup Analítico (JSON)</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Payload bruto completo de inteligência para integração com Power BI, Tableau ou data lakes externos.
                                    </p>
                                </div>
                                <Button onClick={handleExportFullJson} variant="outline" className="w-full gap-2 rounded-xl text-xs font-semibold">
                                    <Download className="h-4 w-4" />
                                    Baixar Arquivo JSON
                                </Button>
                            </Card>
                        </div>

                        {/* Interactive Data Preview Table */}
                        <Card className="border-border/60">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <CardTitle className="text-base font-semibold">Prévia dos Dados para Exportação</CardTitle>
                                        <CardDescription className="text-xs">
                                            Exibindo {filteredExportTickets.length} de {metrics.exportTickets.length} registros disponíveis para download.
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Buscar na prévia..."
                                            value={searchExport}
                                            onChange={(e) => setSearchExport(e.target.value)}
                                            className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-muted/40 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto max-h-[380px]">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40 sticky top-0">
                                            <tr>
                                                <th className="py-2.5 px-4 font-semibold">Cliente</th>
                                                <th className="py-2.5 px-4 font-semibold">Atendente</th>
                                                <th className="py-2.5 px-4 font-semibold">Setor</th>
                                                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                                                <th className="py-2.5 px-4 font-semibold text-center">TMR</th>
                                                <th className="py-2.5 px-4 font-semibold text-center">CSAT</th>
                                                <th className="py-2.5 px-4 font-semibold text-right">Abertura</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {filteredExportTickets.map(row => (
                                                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                                                    <td className="py-2.5 px-4 font-medium text-foreground">{row.contactName}</td>
                                                    <td className="py-2.5 px-4 text-muted-foreground">{row.attendant}</td>
                                                    <td className="py-2.5 px-4 text-muted-foreground">{row.department}</td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <Badge variant="outline" className={cn(
                                                            "text-[10px] font-semibold",
                                                            row.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                            row.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                            "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                        )}>
                                                            {row.status === "RESOLVED" ? "Resolvido" : row.status === "IN_PROGRESS" ? "Em Atendimento" : "Fila"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center font-mono">
                                                        {row.tmrSeconds ? `${row.tmrSeconds}s` : "--"}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        {row.csatScore ? (
                                                            <span className="font-bold text-amber-600 dark:text-amber-400">★ {row.csatScore}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground/60">--</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right text-muted-foreground font-mono text-[11px]">
                                                        {new Date(row.openedAt).toLocaleDateString("pt-BR")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            ) : null}
        </div>
    );
}
