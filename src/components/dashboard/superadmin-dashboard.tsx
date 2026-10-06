"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Building2,
    Activity,
    Key,
    Server,
    Cpu,
    HardDrive,
    ShieldCheck,
    AlertTriangle,
    QrCode,
    Plus,
    ArrowRight,
    Users,
    Settings,
    FileCode,
    RefreshCw,
    CheckCircle2,
    XCircle,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface CompanyItem {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone?: string;
    plan: string;
    maxSessions: number;
    isActive: boolean;
    totalSessions: number;
    connectedSessions: number;
    staffCount: number;
    createdAt: string;
}

interface SuperadminDashboardProps {
    adminName?: string | null;
}

export function SuperadminDashboard({ adminName }: SuperadminDashboardProps) {
    const [companies, setCompanies] = useState<CompanyItem[]>([]);
    const [systemData, setSystemData] = useState<any>(null);
    const [apiKeysCount, setApiKeysCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [compRes, sysRes, keysRes] = await Promise.allSettled([
                fetch("/api/companies"),
                fetch("/api/system/monitor"),
                fetch("/api/admin/api-keys"),
            ]);

            if (compRes.status === "fulfilled" && compRes.value.ok) {
                const json = await compRes.value.json();
                setCompanies(json.data || []);
            }

            if (sysRes.status === "fulfilled" && sysRes.value.ok) {
                const json = await sysRes.value.json();
                if (json.status) {
                    setSystemData(json.data);
                }
            }

            if (keysRes.status === "fulfilled" && keysRes.value.ok) {
                const json = await keysRes.value.json();
                if (json.status) {
                    setApiKeysCount((json.data || []).length);
                }
            }
        } catch (e) {
            console.error("Dashboard error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData().then(() => toast.success("Métricas atualizadas!"));
    };

    // Calculate aggregated metrics
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter((c) => c.isActive).length;
    const blockedCompanies = totalCompanies - activeCompanies;

    const totalInstances = companies.reduce((acc, c) => acc + (c.totalSessions || 0), 0);
    const connectedInstances = companies.reduce((acc, c) => acc + (c.connectedSessions || 0), 0);
    const totalStaff = companies.reduce((acc, c) => acc + (c.staffCount || 0), 0);

    // VPS metrics
    const cpuLoad = systemData?.cpu?.load ? Math.round(systemData.cpu.load) : null;
    const memTotal = systemData?.memory?.total || 1;
    const memUsed = systemData?.memory?.used || 0;
    const memPercent = Math.round((memUsed / memTotal) * 100);

    const diskItem = systemData?.disk?.[0];
    const diskPercent = diskItem?.usePercent ? Math.round(diskItem.usePercent) : null;
    const diskSizeGB = diskItem?.size ? (diskItem.size / (1024 * 1024 * 1024)).toFixed(1) : null;
    const diskUsedGB = diskItem?.used ? (diskItem.used / (1024 * 1024 * 1024)).toFixed(1) : null;

    const formatUptime = (seconds: number) => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d > 0 ? d + "d " : ""}${h}h ${m}m`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-border/50 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
                            Super Administrador
                        </Badge>
                        <span className="text-xs text-muted-foreground">· Gestão da Infraestrutura & Empresas</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Painel de Controle Master
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Administre as empresas parceiras, acompanhe o hardware da VPS e controle integrações de API.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-1.5"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Atualizar
                    </Button>
                    <Link href="/dashboard/companies">
                        <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> Cadastrar Empresa
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Companies */}
                <Card className="glass-panel border-border/60 hover:border-primary/40 transition-all">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Empresas Cadastradas
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                                    {totalCompanies}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-emerald-500 font-semibold">{activeCompanies} ativas</span>
                                    {blockedCompanies > 0 && (
                                        <span className="text-destructive font-semibold ml-1.5">
                                            · {blockedCompanies} suspensas
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* WhatsApp Instances Cluster */}
                <Card className="glass-panel border-border/60 hover:border-primary/40 transition-all">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Instâncias WhatsApp
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                                    {connectedInstances}{" "}
                                    <span className="text-base text-muted-foreground font-normal">
                                        / {totalInstances}
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-emerald-500 font-semibold">{connectedInstances} online</span>
                                    {" "}no cluster Baileys
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <QrCode className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* VPS CPU & RAM Load */}
                <Card className="glass-panel border-border/60 hover:border-primary/40 transition-all">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Servidor VPS (CPU & RAM)
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                                    {cpuLoad !== null ? `${cpuLoad}%` : "—"}{" "}
                                    <span className="text-xs text-muted-foreground font-normal">
                                        CPU · {memPercent}% RAM
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {systemData?.os?.uptime ? `Uptime: ${formatUptime(systemData.os.uptime)}` : "Em execução normal"}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card className="glass-panel border-border/60 hover:border-primary/40 transition-all">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Chaves de API Master
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                                    {apiKeysCount}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Integrações ativas via REST
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Key className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Middle Section: Live VPS Health & Cluster Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* VPS Hardware & Resources */}
                <Card className="lg:col-span-2 glass-panel border-border/60">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Server className="h-4 w-4 text-primary" /> Recursos da VPS em Tempo Real
                            </CardTitle>
                            <CardDescription>
                                Consumo de hardware e saúde do host onde a aplicação está rodando.
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/system-monitor">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                                Monitor Completo <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-2">
                        {/* CPU Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-foreground flex items-center gap-1.5">
                                    <Cpu className="h-3.5 w-3.5 text-blue-500" /> Carga da CPU
                                </span>
                                <span className="font-semibold">{cpuLoad !== null ? `${cpuLoad}%` : "Calculando..."}</span>
                            </div>
                            <Progress value={cpuLoad || 0} className="h-2" />
                        </div>

                        {/* Memory Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-foreground flex items-center gap-1.5">
                                    <Server className="h-3.5 w-3.5 text-purple-500" /> Memória RAM
                                </span>
                                <span className="font-semibold">
                                    {memUsed && memTotal
                                        ? `${(memUsed / (1024 * 1024 * 1024)).toFixed(1)} GB de ${(memTotal / (1024 * 1024 * 1024)).toFixed(1)} GB (${memPercent}%)`
                                        : "—"}
                                </span>
                            </div>
                            <Progress value={memPercent || 0} className="h-2" />
                        </div>

                        {/* Disk Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-foreground flex items-center gap-1.5">
                                    <HardDrive className="h-3.5 w-3.5 text-emerald-500" /> Armazenamento em Disco
                                </span>
                                <span className="font-semibold">
                                    {diskUsedGB && diskSizeGB
                                        ? `${diskUsedGB} GB de ${diskSizeGB} GB (${diskPercent}%)`
                                        : "—"}
                                </span>
                            </div>
                            <Progress value={diskPercent || 0} className="h-2" />
                        </div>

                        {/* Quick Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-xs">
                            <div>
                                <p className="text-muted-foreground">Sistema Operacional</p>
                                <p className="font-semibold text-foreground truncate mt-0.5">
                                    {systemData?.os?.distro || "Linux VPS"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Processador</p>
                                <p className="font-semibold text-foreground truncate mt-0.5">
                                    {systemData?.cpu?.cores?.length ? `${systemData.cpu.cores.length} vCPUs` : "Multicore"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Node.js Uptime</p>
                                <p className="font-semibold text-foreground truncate mt-0.5">
                                    {systemData?.process?.uptime ? formatUptime(systemData.process.uptime) : "Ativo"}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status do Cluster</p>
                                <p className="font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                                    <CheckCircle2 className="h-3 w-3" /> Operacional
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Admin Actions & Status */}
                <Card className="glass-panel border-border/60 flex flex-col justify-between">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Serviços da Plataforma
                        </CardTitle>
                        <CardDescription>
                            Diagnóstico dos componentes de execução
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0 text-xs">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-border/40">
                            <span className="font-medium text-foreground">Next.js App Server</span>
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                                Online
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-border/40">
                            <span className="font-medium text-foreground">Banco de Dados MySQL</span>
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                                Conectado
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-border/40">
                            <span className="font-medium text-foreground">Baileys WA Engine</span>
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                                {connectedInstances} ativas
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 border border-border/40">
                            <span className="font-medium text-foreground">Socket.IO WebSockets</span>
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                                Ativo
                            </Badge>
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-border/40 space-y-2">
                        <Link href="/dashboard/api-keys" className="w-full block">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                                <Key className="h-3.5 w-3.5 text-amber-500" />
                                Gerenciar Chaves de API
                            </Button>
                        </Link>
                        <Link href="/dashboard/settings" className="w-full block">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                                Configurações Globais
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Bottom Section: Recent Companies */}
            <Card className="glass-panel border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" /> Empresas Cadastradas Recentemente
                        </CardTitle>
                        <CardDescription>
                            Visualização rápida dos clientes e planos contratados
                        </CardDescription>
                    </div>
                    <Link href="/dashboard/companies">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                            Ver todas as empresas ({totalCompanies}) <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="pt-0">
                    {companies.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            Nenhuma empresa cadastrada no momento.
                            <div className="mt-3">
                                <Link href="/dashboard/companies">
                                    <Button size="sm">Cadastrar primeira empresa</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-border/50 text-muted-foreground uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="py-2.5 px-3">Empresa</th>
                                        <th className="py-2.5 px-3">Contato / E-mail</th>
                                        <th className="py-2.5 px-3">Plano</th>
                                        <th className="py-2.5 px-3">Instâncias WhatsApp</th>
                                        <th className="py-2.5 px-3">Status</th>
                                        <th className="py-2.5 px-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {companies.slice(0, 6).map((c) => (
                                        <tr key={c.id} className="hover:bg-surface-2/60 transition-colors">
                                            <td className="py-3 px-3">
                                                <div className="font-semibold text-foreground text-sm">
                                                    {c.companyName || c.name}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {c.name !== c.companyName ? c.name : ""}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-medium text-foreground">{c.email}</div>
                                                {c.phone && <div className="text-[11px] text-muted-foreground">{c.phone}</div>}
                                            </td>
                                            <td className="py-3 px-3">
                                                <Badge variant="outline" className="font-semibold text-[10px]">
                                                    {c.plan}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="font-semibold text-foreground">
                                                    {c.connectedSessions} online
                                                </span>{" "}
                                                <span className="text-muted-foreground">
                                                    / {c.totalSessions} (limite: {c.maxSessions})
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                {c.isActive ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Ativa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-destructive font-medium">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                                                        Bloqueada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <Link href="/dashboard/companies">
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                        Gerenciar
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
