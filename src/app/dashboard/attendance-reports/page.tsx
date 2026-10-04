"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionGuard } from "@/components/dashboard/session-guard";
import {
    BarChart3,
    Clock,
    CheckCircle2,
    MessageSquare,
    Users,
    Building2,
    RefreshCw,
    TrendingUp,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface AttendanceMetrics {
    summary: {
        totalTickets: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
        avgTmrSeconds: number;
        avgTmrFormatted: string;
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
    }[];
}

export default function AttendanceReportsPage() {
    return (
        <SessionGuard>
            <AttendanceReportsContent />
        </SessionGuard>
    );
}

function AttendanceReportsContent() {
    const { sessionId } = useSession();
    const [metrics, setMetrics] = useState<AttendanceMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const loadMetrics = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/reports/attendance/${sessionId}`);
            const data = await res.json();
            if (res.ok) {
                setMetrics(data.data);
            } else {
                toast.error(data.message || "Erro ao carregar relatórios");
            }
        } catch (error) {
            console.error("Failed to load attendance metrics", error);
            toast.error("Falha ao carregar métricas de atendimento");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        Relatórios & Métricas de Atendimento
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Acompanhe o tempo médio de primeira resposta (TMR), produtividade da equipe e distribuição por setor.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadMetrics} disabled={loading} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar Dados
                </Button>
            </div>

            {loading && !metrics ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : metrics ? (
                <>
                    {/* Summary KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total de Atendimentos</p>
                                    <h3 className="text-2xl font-bold text-foreground">{metrics.summary.totalTickets}</h3>
                                    <p className="text-[11px] text-muted-foreground">Todas as conversas registradas</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tempo Médio de Resposta (TMR)</p>
                                    <h3 className="text-2xl font-bold text-foreground">{metrics.summary.avgTmrFormatted}</h3>
                                    <p className="text-[11px] text-muted-foreground">Espera até 1ª resposta humana</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Em Atendimento</p>
                                    <h3 className="text-2xl font-bold text-foreground">{metrics.summary.inProgressTickets}</h3>
                                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                        {metrics.summary.openTickets} aguardando na fila
                                    </span>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Finalizados com Sucesso</p>
                                    <h3 className="text-2xl font-bold text-foreground">{metrics.summary.resolvedTickets}</h3>
                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                        {metrics.summary.totalTickets > 0 ? `${Math.round((metrics.summary.resolvedTickets / metrics.summary.totalTickets) * 100)}% de resolução` : "Sem dados"}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendants Ranking Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Desempenho & Produtividade da Equipe
                            </CardTitle>
                            <CardDescription>
                                Ranking de operadores por número de atendimentos concluídos e tempo de resposta individual.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {metrics.attendants.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-6 text-center">Nenhum operador com atendimentos registrados ainda.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase bg-muted/40 text-muted-foreground border-b">
                                            <tr>
                                                <th className="py-3 px-4 font-semibold">Atendente</th>
                                                <th className="py-3 px-4 font-semibold text-center">Total Assumidos</th>
                                                <th className="py-3 px-4 font-semibold text-center">Ativos Agora</th>
                                                <th className="py-3 px-4 font-semibold text-center">Resolvidos</th>
                                                <th className="py-3 px-4 font-semibold text-center">TMR Médio</th>
                                                <th className="py-3 px-4 font-semibold text-right">Taxa de Resolução</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40">
                                            {metrics.attendants.map((att, i) => {
                                                const rate = att.assignedTotal > 0 ? Math.round((att.resolvedCount / att.assignedTotal) * 100) : 0;
                                                return (
                                                    <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="py-3 px-4 flex items-center gap-2.5">
                                                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                                                {i + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground">{att.name}</p>
                                                                <p className="text-[11px] text-muted-foreground">{att.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-medium">{att.assignedTotal}</td>
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
                                                        <td className="py-3 px-4 text-center font-mono text-xs">
                                                            {att.avgTmrSeconds > 0 ? `${att.avgTmrSeconds}s` : "--"}
                                                        </td>
                                                        <td className="py-3 px-4 text-right font-semibold">
                                                            {rate}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Department Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Distribuição de Atendimentos por Setor
                            </CardTitle>
                            <CardDescription>
                                Volume de conversas por fila e departamento configurado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {metrics.departments.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-6 text-center">Nenhum setor cadastrado ainda.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {metrics.departments.map(d => (
                                        <div key={d.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.colorHex }} />
                                                    <span className="font-semibold text-foreground">{d.name}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {d.attendantsCount} operadores
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                <div className="p-2 rounded-lg bg-background border">
                                                    <p className="text-muted-foreground text-[10px]">Fila</p>
                                                    <p className="font-bold text-amber-500 text-sm mt-0.5">{d.openCount}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-background border">
                                                    <p className="text-muted-foreground text-[10px]">Atendendo</p>
                                                    <p className="font-bold text-blue-500 text-sm mt-0.5">{d.inProgressCount}</p>
                                                </div>
                                                <div className="p-2 rounded-lg bg-background border">
                                                    <p className="text-muted-foreground text-[10px]">Resolvidos</p>
                                                    <p className="font-bold text-emerald-500 text-sm mt-0.5">{d.resolvedCount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            ) : null}
        </div>
    );
}
