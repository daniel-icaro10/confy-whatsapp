"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SessionGuard } from "@/components/dashboard/session-guard";
import {
    Kanban,
    Plus,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    RefreshCw,
    MessageCircle,
    User,
    Tag,
    AlertCircle,
    MoreVertical,
    Trash2,
    Edit3,
    ArrowRight,
    Sparkles,
    Briefcase,
    Phone
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Contact {
    id: string;
    jid: string;
    name?: string | null;
    notify?: string | null;
    profilePic?: string | null;
    email?: string | null;
    plan?: string | null;
    planValue?: string | null;
}

interface AssignedUser {
    id: string;
    name?: string | null;
    email: string;
}

interface Deal {
    id: string;
    sessionId: string;
    stageId: string;
    contactId?: string | null;
    title: string;
    value: number;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "OPEN" | "WON" | "LOST";
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    contact?: Contact | null;
    assignedUser?: AssignedUser | null;
}

interface Stage {
    id: string;
    pipelineId: string;
    name: string;
    order: number;
    color: string;
    deals: Deal[];
}

interface Pipeline {
    id: string;
    sessionId: string;
    name: string;
    isDefault: boolean;
    stages: Stage[];
}

export default function CrmPage() {
    return (
        <SessionGuard>
            <CrmContent />
        </SessionGuard>
    );
}

function formatCurrency(val: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(val || 0);
}

const PRIORITY_CONFIG = {
    LOW: { label: "Baixa", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    MEDIUM: { label: "Média", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    HIGH: { label: "Alta", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    URGENT: { label: "Urgente", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
};

function CrmContent() {
    const { sessionId } = useSession();
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "WON" | "LOST">("ALL");

    // Drag and Drop state
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
    const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

    // Modal Create Deal
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createStageId, setCreateStageId] = useState("");
    const [dealTitle, setDealTitle] = useState("");
    const [dealValue, setDealValue] = useState("");
    const [dealContactId, setDealContactId] = useState("none");
    const [dealPriority, setDealPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
    const [dealNotes, setDealNotes] = useState("");
    const [savingDeal, setSavingDeal] = useState(false);

    // Modal Edit Deal
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

    // Modal Create Stage
    const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
    const [stageName, setStageName] = useState("");
    const [stageColor, setStageColor] = useState("#3b82f6");
    const [savingStage, setSavingStage] = useState(false);

    const loadCrmData = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/crm/${sessionId}`);
            const data = await res.json();
            if (data.status && data.data) {
                setPipeline(data.data);
            } else {
                toast.error(data.message || "Erro ao carregar o CRM");
            }
        } catch (err) {
            console.error(err);
            toast.error("Falha na comunicação com o servidor");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    const loadContacts = useCallback(async () => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/contacts?sessionId=${sessionId}&limit=100`);
            if (res.ok) {
                const data = await res.json();
                setContacts(data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    }, [sessionId]);

    useEffect(() => {
        loadCrmData();
        loadContacts();
    }, [loadCrmData, loadContacts]);

    // Handle Drag and Drop
    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        setDraggedDealId(dealId);
        e.dataTransfer.setData("text/plain", dealId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, stageId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverStageId !== stageId) {
            setDragOverStageId(stageId);
        }
    };

    const handleDragLeave = (e: React.DragEvent, stageId: string) => {
        if (dragOverStageId === stageId) {
            setDragOverStageId(null);
        }
    };

    const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
        e.preventDefault();
        setDragOverStageId(null);
        const dealId = draggedDealId || e.dataTransfer.getData("text/plain");
        if (!dealId || !pipeline) return;

        // Find deal & current stage
        let foundDeal: Deal | null = null;
        let sourceStageId: string | null = null;

        for (const stage of pipeline.stages) {
            const d = stage.deals.find((deal) => deal.id === dealId);
            if (d) {
                foundDeal = d;
                sourceStageId = stage.id;
                break;
            }
        }

        if (!foundDeal || sourceStageId === targetStageId) {
            setDraggedDealId(null);
            return;
        }

        // Optimistic UI update
        const updatedStages = pipeline.stages.map((st) => {
            if (st.id === sourceStageId) {
                return { ...st, deals: st.deals.filter((d) => d.id !== dealId) };
            }
            if (st.id === targetStageId) {
                return { ...st, deals: [{ ...foundDeal!, stageId: targetStageId }, ...st.deals] };
            }
            return st;
        });

        setPipeline({ ...pipeline, stages: updatedStages });
        setDraggedDealId(null);

        // Send to backend
        try {
            const res = await fetch(`/api/crm/${sessionId}/deals/${dealId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stageId: targetStageId })
            });
            const result = await res.json();
            if (!result.status) {
                toast.error("Não foi possível mover o card");
                loadCrmData();
            }
        } catch {
            toast.error("Erro ao sincronizar movimento");
            loadCrmData();
        }
    };

    // Create Deal
    const handleCreateDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dealTitle.trim()) {
            toast.warning("Preencha o título da oportunidade");
            return;
        }
        if (!createStageId) {
            toast.warning("Selecione a etapa inicial");
            return;
        }

        setSavingDeal(true);
        try {
            const parsedVal = parseFloat(dealValue.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
            const res = await fetch(`/api/crm/${sessionId}/deals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stageId: createStageId,
                    title: dealTitle.trim(),
                    value: parsedVal,
                    contactId: dealContactId === "none" ? null : dealContactId,
                    priority: dealPriority,
                    notes: dealNotes.trim() || null
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Oportunidade criada com sucesso!");
                setIsCreateOpen(false);
                setDealTitle("");
                setDealValue("");
                setDealContactId("none");
                setDealNotes("");
                loadCrmData();
            } else {
                toast.error(data.message || "Erro ao criar oportunidade");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSavingDeal(false);
        }
    };

    // Update Deal
    const handleUpdateDealStatus = async (dealId: string, status: "OPEN" | "WON" | "LOST") => {
        try {
            const res = await fetch(`/api/crm/${sessionId}/deals/${dealId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(`Negócio marcado como ${status === "WON" ? "Ganho" : status === "LOST" ? "Perdido" : "Aberto"}`);
                loadCrmData();
                setEditingDeal(null);
            }
        } catch {
            toast.error("Erro ao atualizar status");
        }
    };

    // Delete Deal
    const handleDeleteDeal = async (dealId: string) => {
        if (!confirm("Tem certeza que deseja excluir esta oportunidade?")) return;
        try {
            const res = await fetch(`/api/crm/${sessionId}/deals/${dealId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Oportunidade excluída");
                loadCrmData();
                setEditingDeal(null);
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    // Create Stage
    const handleCreateStage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stageName.trim() || !pipeline) return;
        setSavingStage(true);
        try {
            const res = await fetch(`/api/crm/${sessionId}/stages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pipelineId: pipeline.id,
                    name: stageName.trim(),
                    color: stageColor
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Nova coluna criada!");
                setIsCreateStageOpen(false);
                setStageName("");
                loadCrmData();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Erro ao criar coluna");
        } finally {
            setSavingStage(false);
        }
    };

    // Computed Stats
    const stats = useMemo(() => {
        if (!pipeline) return { totalPipeline: 0, wonTotal: 0, openCount: 0, conversionRate: 0 };
        let totalVal = 0;
        let wonVal = 0;
        let openCount = 0;
        let wonCount = 0;
        let totalCount = 0;

        pipeline.stages.forEach((st) => {
            st.deals.forEach((d) => {
                totalCount++;
                if (d.status === "OPEN") {
                    totalVal += d.value;
                    openCount++;
                } else if (d.status === "WON") {
                    wonVal += d.value;
                    wonCount++;
                }
            });
        });

        const conversionRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;

        return {
            totalPipeline: totalVal,
            wonTotal: wonVal,
            openCount,
            conversionRate
        };
    }, [pipeline]);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas & CRM</h1>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs">
                            Zapply Flow
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie suas oportunidades de vendas, arraste cards e converta leads do WhatsApp em clientes.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadCrmData}
                        disabled={loading}
                        className="gap-1.5"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        Atualizar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreateStageOpen(true)}
                        className="gap-1.5"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Coluna
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            if (pipeline?.stages.length) {
                                setCreateStageId(pipeline.stages[0].id);
                            }
                            setIsCreateOpen(true);
                        }}
                        className="gap-1.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Oportunidade
                    </Button>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/40 border-border/60 shadow-none backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Em Negociação</p>
                            <p className="text-xl font-bold mt-1 text-primary">{formatCurrency(stats.totalPipeline)}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-border/60 shadow-none backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Ganho</p>
                            <p className="text-xl font-bold mt-1 text-emerald-500">{formatCurrency(stats.wonTotal)}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-border/60 shadow-none backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Leads Ativos</p>
                            <p className="text-xl font-bold mt-1">{stats.openCount} no funil</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-border/60 shadow-none backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Conversão Geral</p>
                            <p className="text-xl font-bold mt-1 text-amber-500">{stats.conversionRate}%</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/20 p-2.5 rounded-xl border border-border/60">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por lead, título ou nota..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 bg-background/50 text-xs"
                    />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {(["ALL", "OPEN", "WON", "LOST"] as const).map((st) => (
                        <Button
                            key={st}
                            variant={statusFilter === st ? "default" : "ghost"}
                            size="sm"
                            className="h-8 text-xs px-3"
                            onClick={() => setStatusFilter(st)}
                        >
                            {st === "ALL" && "Todos"}
                            {st === "OPEN" && "Abertos"}
                            {st === "WON" && "Ganhos"}
                            {st === "LOST" && "Perdidos"}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            {loading && !pipeline ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Carregando funil de oportunidades...</p>
                </div>
            ) : !pipeline || pipeline.stages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-card/20">
                    <Kanban className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
                    <p className="font-semibold text-lg">Nenhum estágio no funil</p>
                    <p className="text-sm text-muted-foreground mb-4">Crie sua primeira etapa para organizar seus negócios.</p>
                    <Button onClick={() => setIsCreateStageOpen(true)}>Criar Primeira Etapa</Button>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-6 items-start min-h-[550px]">
                    {pipeline.stages.map((stage) => {
                        // Filter stage deals
                        const filteredDeals = stage.deals.filter((deal) => {
                            if (statusFilter !== "ALL" && deal.status !== statusFilter) return false;
                            if (search.trim()) {
                                const q = search.toLowerCase();
                                const matchTitle = deal.title.toLowerCase().includes(q);
                                const matchContact = deal.contact?.name?.toLowerCase().includes(q) || deal.contact?.notify?.toLowerCase().includes(q);
                                const matchNotes = deal.notes?.toLowerCase().includes(q);
                                if (!matchTitle && !matchContact && !matchNotes) return false;
                            }
                            return true;
                        });

                        const stageTotal = filteredDeals.reduce((acc, curr) => acc + (curr.value || 0), 0);
                        const isDragOver = dragOverStageId === stage.id;

                        return (
                            <div
                                key={stage.id}
                                onDragOver={(e) => handleDragOver(e, stage.id)}
                                onDragLeave={(e) => handleDragLeave(e, stage.id)}
                                onDrop={(e) => handleDrop(e, stage.id)}
                                className={cn(
                                    "flex flex-col flex-shrink-0 w-80 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm transition-all duration-150",
                                    isDragOver && "border-primary ring-2 ring-primary/20 bg-primary/5"
                                )}
                            >
                                {/* Stage Column Header */}
                                <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: stage.color || "#3b82f6" }}
                                        />
                                        <span className="font-semibold text-sm tracking-tight">{stage.name}</span>
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[11px] font-mono">
                                            {filteredDeals.length}
                                        </Badge>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => {
                                            setCreateStageId(stage.id);
                                            setIsCreateOpen(true);
                                        }}
                                        title="Adicionar negócio nesta etapa"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Stage Subheader (Total R$) */}
                                <div className="px-3.5 py-1.5 bg-muted/20 border-b border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>Total da etapa:</span>
                                    <span className="font-semibold text-foreground font-mono">{formatCurrency(stageTotal)}</span>
                                </div>

                                {/* Deals Cards List */}
                                <div className="p-2.5 flex flex-col gap-2.5 overflow-y-auto max-h-[620px] min-h-[140px]">
                                    {filteredDeals.length === 0 ? (
                                        <div className="h-28 flex flex-col items-center justify-center border border-dashed border-border/50 rounded-lg text-xs text-muted-foreground">
                                            Arraste cards aqui
                                        </div>
                                    ) : (
                                        filteredDeals.map((deal) => {
                                            const priority = PRIORITY_CONFIG[deal.priority] || PRIORITY_CONFIG.MEDIUM;
                                            const contactName = deal.contact?.name || deal.contact?.notify || "Contato sem nome";
                                            const contactJid = deal.contact?.jid;

                                            return (
                                                <div
                                                    key={deal.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, deal.id)}
                                                    onClick={() => setEditingDeal(deal)}
                                                    className={cn(
                                                        "group relative p-3 rounded-lg border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                                                        deal.status === "WON" && "border-emerald-500/40 bg-emerald-500/5",
                                                        deal.status === "LOST" && "border-rose-500/40 opacity-70"
                                                    )}
                                                >
                                                    {/* Top Badges */}
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-[10px] px-1.5 py-0 h-4 uppercase font-semibold", priority.color)}
                                                        >
                                                            {priority.label}
                                                        </Badge>

                                                        {deal.status === "WON" && (
                                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] h-4 px-1.5 gap-1">
                                                                <CheckCircle2 className="h-3 w-3" /> Ganho
                                                            </Badge>
                                                        )}
                                                        {deal.status === "LOST" && (
                                                            <Badge className="bg-rose-500/20 text-rose-400 border-0 text-[10px] h-4 px-1.5 gap-1">
                                                                <XCircle className="h-3 w-3" /> Perdido
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Deal Title */}
                                                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                                        {deal.title}
                                                    </h3>

                                                    {/* Deal Value */}
                                                    <p className="text-base font-bold text-foreground mt-1.5 font-mono">
                                                        {formatCurrency(deal.value)}
                                                    </p>

                                                    {/* Contact & WhatsApp Shortcut */}
                                                    {deal.contact && (
                                                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                                                                    {contactName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-xs text-muted-foreground truncate font-medium">
                                                                    {contactName}
                                                                </span>
                                                            </div>

                                                            {contactJid && (
                                                                <Link
                                                                    href={`/dashboard/chat?jid=${encodeURIComponent(contactJid)}`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="h-6 w-6 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 transition-colors"
                                                                    title="Abrir chat no WhatsApp"
                                                                >
                                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Notes preview if any */}
                                                    {deal.notes && (
                                                        <p className="mt-2 text-[11px] text-muted-foreground line-clamp-1 italic bg-muted/20 px-1.5 py-0.5 rounded">
                                                            "{deal.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal: Nova Oportunidade */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Nova Oportunidade no Funil
                        </DialogTitle>
                        <DialogDescription>
                            Crie um card de negociação para acompanhar o fechamento da venda.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateDeal} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-xs">Título do Negócio *</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Assinatura Anual, Curso VIP, Imóvel Centro"
                                value={dealTitle}
                                onChange={(e) => setDealTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="value" className="text-xs">Valor Estimado (R$)</Label>
                                <Input
                                    id="value"
                                    placeholder="0,00"
                                    value={dealValue}
                                    onChange={(e) => setDealValue(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Prioridade</Label>
                                <Select value={dealPriority} onValueChange={(v: any) => setDealPriority(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Baixa</SelectItem>
                                        <SelectItem value="MEDIUM">Média</SelectItem>
                                        <SelectItem value="HIGH">Alta</SelectItem>
                                        <SelectItem value="URGENT">Urgente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Etapa Inicial *</Label>
                            <Select value={createStageId} onValueChange={setCreateStageId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a etapa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pipeline?.stages.map((st) => (
                                        <SelectItem key={st.id} value={st.id}>
                                            {st.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Vincular Contato do WhatsApp</Label>
                            <Select value={dealContactId} onValueChange={setDealContactId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sem contato vinculado" />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                    <SelectItem value="none">Nenhum (Avulso)</SelectItem>
                                    {contacts.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name || c.notify || c.jid.split("@")[0]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs">Observações / Próximos Passos</Label>
                            <Textarea
                                id="notes"
                                placeholder="Ex: Cliente aguarda proposta com desconto até sexta..."
                                rows={3}
                                value={dealNotes}
                                onChange={(e) => setDealNotes(e.target.value)}
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={savingDeal}>
                                {savingDeal ? "Criando..." : "Criar Oportunidade"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Editar/Visualizar Oportunidade */}
            <Dialog open={!!editingDeal} onOpenChange={(open) => !open && setEditingDeal(null)}>
                <DialogContent className="sm:max-w-md">
                    {editingDeal && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between pr-4">
                                    <Badge
                                        variant="outline"
                                        className={cn("text-[10px] uppercase", PRIORITY_CONFIG[editingDeal.priority]?.color)}
                                    >
                                        Prioridade {PRIORITY_CONFIG[editingDeal.priority]?.label}
                                    </Badge>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-rose-500 hover:bg-rose-500/10"
                                        onClick={() => handleDeleteDeal(editingDeal.id)}
                                        title="Excluir Oportunidade"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <DialogTitle className="text-lg mt-1">{editingDeal.title}</DialogTitle>
                                <p className="text-2xl font-bold font-mono text-primary mt-1">
                                    {formatCurrency(editingDeal.value)}
                                </p>
                            </DialogHeader>

                            <div className="space-y-4 py-2 text-sm">
                                {editingDeal.contact && (
                                    <div className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                {(editingDeal.contact.name || editingDeal.contact.notify || "C").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-xs leading-none">
                                                    {editingDeal.contact.name || editingDeal.contact.notify || "Cliente"}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {editingDeal.contact.jid.split("@")[0]}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/dashboard/chat?jid=${encodeURIComponent(editingDeal.contact.jid)}`}
                                            className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                                        >
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            WhatsApp
                                        </Link>
                                    </div>
                                )}

                                {editingDeal.notes && (
                                    <div className="p-3 rounded-lg bg-muted/20 border border-border/50 text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground block mb-1">Notas:</span>
                                        {editingDeal.notes}
                                    </div>
                                )}

                                {/* Status Switchers */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Desfecho do Negócio:</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={editingDeal.status === "OPEN" ? "default" : "outline"}
                                            onClick={() => handleUpdateDealStatus(editingDeal.id, "OPEN")}
                                            className="text-xs"
                                        >
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            Em Aberto
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={editingDeal.status === "WON" ? "default" : "outline"}
                                            onClick={() => handleUpdateDealStatus(editingDeal.id, "WON")}
                                            className={cn("text-xs", editingDeal.status === "WON" && "bg-emerald-600 hover:bg-emerald-700")}
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                            Ganho
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={editingDeal.status === "LOST" ? "default" : "outline"}
                                            onClick={() => handleUpdateDealStatus(editingDeal.id, "LOST")}
                                            className={cn("text-xs", editingDeal.status === "LOST" && "bg-rose-600 hover:bg-rose-700")}
                                        >
                                            <XCircle className="h-3.5 w-3.5 mr-1" />
                                            Perdido
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal: Nova Coluna */}
            <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Nova Etapa do Funil</DialogTitle>
                        <DialogDescription>
                            Adicione uma coluna para representar uma fase do seu processo comercial.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateStage} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nome da Coluna *</Label>
                            <Input
                                placeholder="Ex: Demonstração Agendada, Em Contrato"
                                value={stageName}
                                onChange={(e) => setStageName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Cor da Etapa</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={stageColor}
                                    onChange={(e) => setStageColor(e.target.value)}
                                    className="w-8 h-8 rounded border cursor-pointer p-0"
                                />
                                <span className="text-xs text-muted-foreground font-mono">{stageColor}</span>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateStageOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={savingStage}>
                                {savingStage ? "Salvando..." : "Salvar Coluna"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
