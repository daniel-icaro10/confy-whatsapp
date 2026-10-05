"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { RefreshCw, Send, CheckCircle2, XCircle, Radio, Clock, AlertTriangle, History, Eye, Calendar, Pause, Play, Square, Sparkles, Plus, Trash2, Shuffle, ArrowRightLeft, HelpCircle, Dices } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/dashboard/session-provider";
import { SessionGuard } from "@/components/dashboard/session-guard";
import { useSocket } from "@/components/chat/socket-context";
import { parseBulkRecipients } from "@/lib/phone-utils";
import { getMessageForContact, parseStoredMessages, resolveSpintax } from "@/lib/spintax";

interface BroadcastProgress {
    broadcastId: string;
    status: "running" | "paused" | "completed" | "cancelled";
    total: number;
    sent: number;
    failed: number;
    current?: string | null;
    progress?: number;
    errors?: { jid: string; error: string }[];
    startedAt?: string;
    completedAt?: string;
}

interface BroadcastLog {
    id: string;
    sessionId: string;
    message: string;
    total: number;
    sent: number;
    failed: number;
    status: string;
    delay: number;
    startedAt: string;
    completedAt: string | null;
    _count?: { recipients: number };
    recipients?: BroadcastRecipient[];
}

interface BroadcastRecipient {
    id: string;
    jid: string;
    status: string;
    error: string | null;
    sentAt: string | null;
}

export default function BroadcastPage() {
    const { sessionId } = useSession();
    const [contacts, setContacts] = useState("");
    const [messages, setMessages] = useState<string[]>([""]);
    const [distributionMode, setDistributionMode] = useState<"random" | "round_robin">("random");
    const [showSpintaxHelp, setShowSpintaxHelp] = useState(false);
    const [simulationPreviews, setSimulationPreviews] = useState<string[]>([]);
    const [delay, setDelay] = useState([2000]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [broadcastProgress, setBroadcastProgress] = useState<BroadcastProgress | null>(null);
    const [activeTab, setActiveTab] = useState<"new" | "history">("new");

    const handleUpdateMessage = (index: number, val: string) => {
        setMessages(prev => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    const handleAddVariation = () => {
        setMessages(prev => [...prev, ""]);
    };

    const handleRemoveVariation = (index: number) => {
        setMessages(prev => {
            if (prev.length <= 1) return prev;
            return prev.filter((_, i) => i !== index);
        });
    };

    const validMessageCount = messages.filter(m => m.trim().length > 0).length;

    const handleSimulate = () => {
        const valid = messages.map(m => m.trim()).filter(Boolean);
        if (valid.length === 0) return;
        const count = 3;
        const samples: string[] = [];
        for (let i = 0; i < count; i++) {
            samples.push(getMessageForContact(valid, i, distributionMode));
        }
        setSimulationPreviews(samples);
    };

    // History
    const [history, setHistory] = useState<BroadcastLog[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState<BroadcastLog | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    const { getSocket, joinSession } = useSocket();

    // Check for active broadcast on mount/session change
    const checkCurrentBroadcast = useCallback(async () => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/messages/${sessionId}/broadcast/current`);
            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    const log = data.data;
                    const progress = log.total > 0 ? Math.round(((log.sent + log.failed) / log.total) * 100) : 0;
                    setBroadcastProgress({
                        broadcastId: log.id,
                        status: log.status,
                        total: log.total,
                        sent: log.sent,
                        failed: log.failed,
                        progress,
                        startedAt: log.startedAt
                    });
                    setLoading(log.status === "running");
                }
            }
        } catch (e) {
            console.error("Failed to fetch current broadcast", e);
        }
    }, [sessionId]);

    useEffect(() => {
        checkCurrentBroadcast();
    }, [checkCurrentBroadcast]);

    // Socket for progress updates
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !sessionId) return;

        const onConnect = () => joinSession(sessionId);
        if (socket.connected) joinSession(sessionId);
        socket.on("connect", onConnect);

        const handler = (data: BroadcastProgress) => {
            setBroadcastProgress(data);
            if (data.status === "completed") {
                setLoading(false);
                fetchHistory();
                if (data.failed === 0) {
                    toast.success(`Disparo concluído! ${data.sent} enviada(s).`);
                } else {
                    toast.warning(`Disparo concluído. ${data.sent} enviada(s), ${data.failed} com falha.`);
                }
            } else if (data.status === "cancelled") {
                setLoading(false);
                fetchHistory();
                toast.warning(`Disparo cancelado e interrompido. ${data.sent} enviada(s).`);
            } else if (data.status === "paused") {
                setLoading(false);
                toast.info("Disparo pausado.");
            } else if (data.status === "running") {
                setLoading(true);
            }
        };

        socket.on("broadcast.progress", handler);
        return () => { socket.off("connect", onConnect); socket.off("broadcast.progress", handler); };
    }, [sessionId, getSocket, joinSession]);

    // Fetch history
    const fetchHistory = useCallback(async () => {
        if (!sessionId) return;
        setHistoryLoading(true);
        try {
            const res = await fetch(`/api/messages/${sessionId}/broadcast/history?limit=20`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.data || []);
            }
        } catch (e) {
            console.error("Failed to fetch broadcast history", e);
        } finally {
            setHistoryLoading(false);
        }
    }, [sessionId]);

    // Load history on mount & tab switch
    useEffect(() => {
        if (activeTab === "history" && sessionId) {
            fetchHistory();
        }
    }, [activeTab, sessionId, fetchHistory]);

    // Open detail modal
    const openDetail = async (log: BroadcastLog) => {
        setSelectedLog(log);
        setDetailOpen(true);
        setDetailLoading(true);
        try {
            const res = await fetch(`/api/messages/${sessionId}/broadcast/history/${log.id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedLog(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch broadcast detail", e);
        } finally {
            setDetailLoading(false);
        }
    };

    // Control broadcast (Pause, Resume, Cancel)
    const handleControlBroadcast = async (broadcastId?: string, action: "pause" | "resume" | "cancel" = "cancel") => {
        if (!sessionId) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/messages/${sessionId}/broadcast/control`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ broadcastId, action })
            });
            const data = await res.json();
            if (res.ok) {
                if (action === "pause") {
                    toast.info("Disparo pausado com sucesso");
                    setBroadcastProgress(prev => prev ? { ...prev, status: "paused" } : null);
                    setLoading(false);
                } else if (action === "resume") {
                    toast.success("Disparo retomado com sucesso");
                    setBroadcastProgress(prev => prev ? { ...prev, status: "running" } : null);
                    setLoading(true);
                } else if (action === "cancel") {
                    toast.warning("Disparo interrompido e cancelado!");
                    setBroadcastProgress(prev => prev ? { ...prev, status: "cancelled" } : null);
                    setLoading(false);
                    fetchHistory();
                }
            } else {
                toast.error(data.message || "Falha ao controlar disparo");
            }
        } catch (e) {
            console.error("Control error", e);
            toast.error("Erro ao enviar comando de controle");
        } finally {
            setActionLoading(false);
        }
    };

    const parsedContacts = useMemo(() => {
        return parseBulkRecipients(contacts);
    }, [contacts]);

    const handleSend = async () => {
        if (!sessionId) return toast.error("Nenhuma sessão ativa encontrada");
        const validMessages = messages.map(m => m.trim()).filter(Boolean);
        if (validMessages.length === 0) return toast.error("A mensagem não pode ficar vazia. Preencha ao menos uma variação.");
        setLoading(true);
        setBroadcastProgress(null);

        try {
            const recipients = parsedContacts.jids;

            if (recipients.length === 0) {
                toast.error("Nenhum destinatário válido informado");
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/messages/${sessionId}/broadcast`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipients,
                    messages: validMessages,
                    distributionMode,
                    delay: delay[0]
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.info(`Disparo iniciado para ${recipients.length} destinatário(s)...`);
            } else {
                toast.error(data.message || "Falha ao iniciar o disparo");
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Erro ao enviar o disparo");
            setLoading(false);
        }
    };

    const recipientCount = parsedContacts.total;
    const formatJid = (jid: string) => {
        if (!jid) return "-";
        return jid.replace("@s.whatsapp.net", "").replace("@g.us", " (Grupo)");
    };

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    };

    const recipientStatusLabels: Record<string, string> = {
        sent: "enviada",
        failed: "falhou",
        pending: "pendente",
        cancelled: "cancelada"
    };

    const tabs = [
        { id: "new" as const, label: "Novo disparo", icon: Send },
        { id: "history" as const, label: "Histórico", icon: History },
    ];

    const hasActiveBroadcast = broadcastProgress && (broadcastProgress.status === "running" || broadcastProgress.status === "paused");

    return (
        <SessionGuard>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Disparo em massa</h2>
                    <p className="text-muted-foreground text-sm mt-1">Envie mensagens em massa para vários destinatários com controle total de pausa e cancelamento.</p>
                </div>

                {/* Emergency Active Broadcast Banner */}
                {hasActiveBroadcast && (
                    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 animate-bounce" />
                            <div>
                                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <span>{broadcastProgress.status === "running" ? "Disparo ativo em andamento!" : "Disparo pausado!"}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-background/80 border">
                                        ID: {broadcastProgress.broadcastId}
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {broadcastProgress.sent} de {broadcastProgress.total} enviadas ({broadcastProgress.progress || 0}%) • {broadcastProgress.failed} falha(s)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {broadcastProgress.status === "running" ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 sm:flex-none border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                                    onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "pause")}
                                    disabled={actionLoading}
                                >
                                    <Pause className="h-3.5 w-3.5 mr-1" /> Pausar
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "resume")}
                                    disabled={actionLoading}
                                >
                                    <Play className="h-3.5 w-3.5 mr-1" /> Retomar
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1 sm:flex-none cursor-pointer"
                                onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "cancel")}
                                disabled={actionLoading}
                            >
                                <Square className="h-3.5 w-3.5 mr-1" /> Parar agora
                            </Button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "new" && (
                    <>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                            {/* Recipients Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Destinatários</span>
                                        {recipientCount > 0 && (
                                            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                {recipientCount} válido(s)
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Cole sua lista de números (linhas, vírgulas ou ponto-e-vírgula). Aceita com ou sem 9, com ou sem +55, espaços e traços.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Lista de telefones</Label>
                                            {parsedContacts.ninthDigitCount > 0 && (
                                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                    <Sparkles className="h-3 w-3" />
                                                    {parsedContacts.ninthDigitCount} com 9º dígito / DDI corrigidos
                                                </span>
                                            )}
                                        </div>
                                        <Textarea
                                            placeholder={"+55 31 85759690\n(31) 98575-9690\n3185759690\n5531985759690"}
                                            className="min-h-[200px] font-mono text-sm leading-relaxed"
                                            value={contacts}
                                            onChange={e => setContacts(e.target.value)}
                                            disabled={loading}
                                        />
                                        <div className="flex flex-col gap-1.5 pt-1">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{recipientCount} número(s) identificado(s) e prontos para envio</span>
                                                {parsedContacts.invalidCount > 0 && (
                                                    <span className="text-amber-500 font-medium">
                                                        {parsedContacts.invalidCount} inválido(s) ignorados
                                                    </span>
                                                )}
                                            </div>

                                            {/* Preview sample if numbers entered */}
                                            {parsedContacts.analyzed.length > 0 && (
                                                <div className="p-2.5 rounded-lg bg-muted/40 border text-xs space-y-1">
                                                    <p className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                                                        Exemplo do formato que será enviado ao WhatsApp:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                        {parsedContacts.analyzed.slice(0, 3).map((item, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 rounded bg-background border font-mono text-[11px] flex items-center gap-1.5"
                                                            >
                                                                <span>{item.formatted}</span>
                                                                {item.hasNinthDigitAdded && (
                                                                    <span className="text-[10px] text-emerald-500 font-bold" title="9º dígito adicionado">+9</span>
                                                                )}
                                                            </span>
                                                        ))}
                                                        {parsedContacts.analyzed.length > 3 && (
                                                            <span className="text-muted-foreground self-center text-[11px]">
                                                                +{parsedContacts.analyzed.length - 3} outros
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Message Card */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <span>Conteúdo da mensagem</span>
                                                {messages.length > 1 && (
                                                    <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                        {messages.length} variações
                                                    </span>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                Crie múltiplas variações e use Spintax para que cada contato receba um texto diferente, evitando bloqueios do WhatsApp.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                                            onClick={() => setShowSpintaxHelp(!showSpintaxHelp)}
                                        >
                                            <HelpCircle className="h-3.5 w-3.5 mr-1 text-primary" /> Spintax
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Spintax Help Box */}
                                    {showSpintaxHelp && (
                                        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 text-xs space-y-2 animate-in fade-in">
                                            <p className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                Como variar mensagens para evitar spam?
                                            </p>
                                            <p className="text-muted-foreground">
                                                1. <strong>Múltiplas Variações:</strong> Adicione 2 ou mais versões completas da mensagem clicando no botão abaixo. O sistema alternará ou sorteará entre elas para cada contato.
                                            </p>
                                            <p className="text-muted-foreground">
                                                2. <strong>Spintax no texto:</strong> Use chaves com barras verticais para sortear palavras no meio da frase. Exemplo: <code className="px-1.5 py-0.5 rounded bg-background border font-mono">{"{Olá|Oi|Bom dia}"}</code> {"{tudo bem|como vai}?"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Message Variations List */}
                                    <div className="space-y-3">
                                        {messages.map((msg, index) => {
                                            const hasSpintax = /\{([^{}]+)\}/.test(msg);
                                            return (
                                                <div key={index} className="p-3.5 rounded-xl border bg-card/60 space-y-2.5 relative group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted">
                                                                Variação #{index + 1}
                                                            </span>
                                                            {hasSpintax && (
                                                                <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                                    <Shuffle className="h-2.5 w-2.5" /> Spintax ativo
                                                                </span>
                                                            )}
                                                        </div>
                                                        {messages.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                                                                onClick={() => handleRemoveVariation(index)}
                                                                disabled={loading}
                                                                title="Remover esta variação"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <Textarea
                                                        placeholder={index === 0 ? "{Olá|Oi|Bom dia}! Passando para compartilhar uma novidade especial com você..." : `Escreva a variação #${index + 1} aqui...`}
                                                        className="min-h-[110px] text-sm leading-relaxed"
                                                        value={msg}
                                                        onChange={e => handleUpdateMessage(index, e.target.value)}
                                                        disabled={loading}
                                                    />

                                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                                        <span>{msg.length} caracteres</span>
                                                        {hasSpintax && (
                                                            <span className="italic text-muted-foreground/80 truncate max-w-[280px]">
                                                                Exemplo sorteado: &quot;{resolveSpintax(msg.slice(0, 40))}&quot;...
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Action: Add Variation Button & Test simulation */}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-dashed text-xs cursor-pointer hover:border-primary hover:text-primary"
                                            onClick={handleAddVariation}
                                            disabled={loading || messages.length >= 10}
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar outra variação de mensagem
                                        </Button>

                                        {validMessageCount > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                                onClick={handleSimulate}
                                            >
                                                <Dices className="h-3.5 w-3.5 mr-1 text-primary" /> Testar sorteio das mensagens
                                            </Button>
                                        )}
                                    </div>

                                    {/* Live Simulation Preview */}
                                    {simulationPreviews.length > 0 && (
                                        <div className="p-3 rounded-xl bg-muted/40 border text-xs space-y-2 animate-in fade-in">
                                            <div className="flex items-center justify-between font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                                                <span>Simulação de envio para 3 contatos:</span>
                                                <button
                                                    type="button"
                                                    className="text-[10px] text-primary hover:underline cursor-pointer font-medium"
                                                    onClick={handleSimulate}
                                                >
                                                    Sortear novamente
                                                </button>
                                            </div>
                                            <div className="space-y-1.5">
                                                {simulationPreviews.map((sample, i) => (
                                                    <div key={i} className="p-2.5 rounded bg-background border text-xs space-y-1">
                                                        <span className="text-[10px] text-muted-foreground font-semibold">Contato #{i + 1} receberá:</span>
                                                        <p className="text-foreground whitespace-pre-wrap">{sample}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Distribution Mode (when more than 1 variation) */}
                                    {messages.length > 1 && (
                                        <div className="p-3 rounded-xl bg-muted/30 border space-y-2">
                                            <Label className="text-xs font-semibold">Como distribuir entre as {messages.length} variações?</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setDistributionMode("random")}
                                                    className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                                        distributionMode === "random"
                                                            ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                                        <Shuffle className="h-3.5 w-3.5 text-primary" />
                                                        <span>Aleatório (Recomendado Antiban)</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">
                                                        Sorteia aleatoriamente entre as variações para cada destinatário.
                                                    </p>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setDistributionMode("round_robin")}
                                                    className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                                        distributionMode === "round_robin"
                                                            ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                                                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                                        <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                                                        <span>Alternado (Sequencial)</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-1">
                                                        Distribui igualmente: Variação 1 para o contato 1, Variação 2 para o contato 2, etc.
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Delay and Submit */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label>Intervalo: {(delay[0] / 1000).toFixed(1)}s</Label>
                                            <Slider
                                                defaultValue={[2000]}
                                                min={1000}
                                                max={15000}
                                                step={500}
                                                value={delay}
                                                onValueChange={setDelay}
                                                disabled={loading}
                                            />
                                            <p className="text-xs text-muted-foreground">Intervalo entre mensagens (+ variação aleatória de segurança).</p>
                                        </div>

                                        <Button
                                            className="w-full cursor-pointer font-semibold"
                                            onClick={handleSend}
                                            disabled={loading || !sessionId || recipientCount === 0 || validMessageCount === 0}
                                        >
                                            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {loading ? "Disparando..." : `Iniciar disparo (${recipientCount} contato${recipientCount === 1 ? '' : 's'})`}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Live Progress */}
                        {broadcastProgress && (
                            <Card className={`border-2 transition-colors ${
                                broadcastProgress.status === "completed"
                                    ? (broadcastProgress.failed === 0 ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/10" : "border-yellow-500/30 bg-yellow-50/30 dark:bg-yellow-950/10")
                                    : broadcastProgress.status === "cancelled"
                                    ? "border-red-500/30 bg-red-50/30 dark:bg-red-950/10"
                                    : broadcastProgress.status === "paused"
                                    ? "border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10"
                                    : "border-blue-500/30 bg-blue-50/30 dark:bg-blue-950/10"
                            }`}>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            {broadcastProgress.status === "running" ? (
                                                <><Radio className="h-5 w-5 text-blue-500 animate-pulse" /><span>Disparo em andamento</span></>
                                            ) : broadcastProgress.status === "paused" ? (
                                                <><Pause className="h-5 w-5 text-amber-500 animate-pulse" /><span>Disparo pausado</span></>
                                            ) : broadcastProgress.status === "cancelled" ? (
                                                <><XCircle className="h-5 w-5 text-red-500" /><span>Disparo cancelado / interrompido</span></>
                                            ) : broadcastProgress.failed === 0 ? (
                                                <><CheckCircle2 className="h-5 w-5 text-green-500" /><span>Disparo concluído</span></>
                                            ) : (
                                                <><AlertTriangle className="h-5 w-5 text-yellow-500" /><span>Disparo concluído com erros</span></>
                                            )}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            {broadcastProgress.status === "running" && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                                                        onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "pause")}
                                                        disabled={actionLoading}
                                                    >
                                                        <Pause className="h-3.5 w-3.5 mr-1" /> Pausar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "cancel")}
                                                        disabled={actionLoading}
                                                    >
                                                        <Square className="h-3.5 w-3.5 mr-1" /> Parar
                                                    </Button>
                                                </>
                                            )}
                                            {broadcastProgress.status === "paused" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                                        onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "resume")}
                                                        disabled={actionLoading}
                                                    >
                                                        <Play className="h-3.5 w-3.5 mr-1" /> Retomar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => handleControlBroadcast(broadcastProgress.broadcastId, "cancel")}
                                                        disabled={actionLoading}
                                                    >
                                                        <Square className="h-3.5 w-3.5 mr-1" /> Parar
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <CardDescription>ID: {broadcastProgress.broadcastId}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progresso</span>
                                            <span className="font-mono font-medium">
                                                {broadcastProgress.sent + broadcastProgress.failed} / {broadcastProgress.total} ({broadcastProgress.progress || 0}%)
                                            </span>
                                        </div>
                                        <Progress value={broadcastProgress.progress || 0} className="h-3" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-background rounded-lg p-3 text-center border">
                                            <div className="text-2xl font-bold text-green-600">{broadcastProgress.sent}</div>
                                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                                <CheckCircle2 className="h-3 w-3" /> Enviadas
                                            </div>
                                        </div>
                                        <div className="bg-background rounded-lg p-3 text-center border">
                                            <div className="text-2xl font-bold text-red-500">{broadcastProgress.failed}</div>
                                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                                <XCircle className="h-3 w-3" /> Com falha
                                            </div>
                                        </div>
                                        <div className="bg-background rounded-lg p-3 text-center border">
                                            <div className="text-2xl font-bold text-muted-foreground">
                                                {Math.max(0, broadcastProgress.total - broadcastProgress.sent - broadcastProgress.failed)}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                                <Clock className="h-3 w-3" /> Pendentes
                                            </div>
                                        </div>
                                    </div>

                                    {broadcastProgress.status === "running" && broadcastProgress.current && (
                                        <div className="flex items-center gap-2 text-sm px-3 py-2 bg-muted/50 rounded-lg">
                                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" />
                                            <span className="text-muted-foreground">Enviando agora:</span>
                                            <span className="font-mono font-medium">{formatJid(broadcastProgress.current)}</span>
                                        </div>
                                    )}

                                    {broadcastProgress.status === "paused" && (
                                        <div className="flex items-center gap-2 text-sm px-3 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-500/20">
                                            <Pause className="h-4 w-4 shrink-0" />
                                            <span>O disparo está pausado. Nenhuma mensagem será enviada até você clicar em <strong>Retomar</strong> ou <strong>Parar</strong>.</span>
                                        </div>
                                    )}

                                    {broadcastProgress.status === "cancelled" && (
                                        <div className="flex items-center gap-2 text-sm px-3 py-2 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg border border-red-500/20">
                                            <XCircle className="h-4 w-4 shrink-0" />
                                            <span>Este disparo foi cancelado. As mensagens restantes não foram enviadas.</span>
                                        </div>
                                    )}

                                    {broadcastProgress.errors && broadcastProgress.errors.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
                                                <XCircle className="h-4 w-4" /> Com falha ({broadcastProgress.errors.length})
                                            </h4>
                                            <div className="max-h-40 overflow-y-auto bg-red-50 dark:bg-red-950/30 rounded-lg p-2 space-y-1">
                                                {broadcastProgress.errors.map((err, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs py-1 px-2 bg-background/60 rounded">
                                                        <span className="font-mono">{formatJid(err.jid)}</span>
                                                        <span className="text-red-500 truncate ml-2 max-w-[200px]">{err.error}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                {activeTab === "history" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Histórico de disparos
                            </CardTitle>
                            <CardDescription>Histórico dos disparos enviados, armazenado permanentemente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {historyLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-sm">Nenhum disparo realizado ainda.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {history.map(log => {
                                        const isLogActive = log.status === "running" || log.status === "paused";
                                        return (
                                            <div key={log.id}
                                                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                                                    log.status === "cancelled" ? "bg-red-50/20 border-red-500/20" :
                                                    log.status === "paused" ? "bg-amber-50/20 border-amber-500/20" :
                                                    log.status === "running" ? "bg-blue-50/20 border-blue-500/20" : "hover:bg-muted/30"
                                                }`}
                                            >
                                                {/* Status icon */}
                                                <div className="shrink-0">
                                                    {log.status === "completed" ? (
                                                        log.failed === 0
                                                            ? <CheckCircle2 className="h-8 w-8 text-green-500" />
                                                            : <AlertTriangle className="h-8 w-8 text-yellow-500" />
                                                    ) : log.status === "cancelled" ? (
                                                        <XCircle className="h-8 w-8 text-red-500" />
                                                    ) : log.status === "paused" ? (
                                                        <Pause className="h-8 w-8 text-amber-500" />
                                                    ) : (
                                                        <Radio className="h-8 w-8 text-blue-500 animate-pulse" />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        {(() => {
                                                            const variations = parseStoredMessages(log.message);
                                                            if (variations.length > 1) {
                                                                return (
                                                                    <p className="text-sm font-medium truncate flex items-center gap-1.5">
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shrink-0">
                                                                            {variations.length} variações
                                                                        </span>
                                                                        <span className="truncate">{variations[0]}</span>
                                                                    </p>
                                                                );
                                                            }
                                                            return <p className="text-sm font-medium truncate">{log.message}</p>;
                                                        })()}
                                                        {log.status === "cancelled" && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-semibold shrink-0">Cancelado</span>
                                                        )}
                                                        {log.status === "paused" && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold shrink-0">Pausado</span>
                                                        )}
                                                        {log.status === "running" && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold shrink-0">Disparando</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3 text-green-500" /> {log.sent} / {log.total}
                                                        </span>
                                                        {log.failed > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <XCircle className="h-3 w-3 text-red-500" /> {log.failed}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" /> {formatTime(log.startedAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {isLogActive && (
                                                        <>
                                                            {log.status === "running" ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer text-xs"
                                                                    onClick={() => handleControlBroadcast(log.id, "pause")}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <Pause className="h-3 w-3 mr-1" /> Pausar
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                                                                    onClick={() => handleControlBroadcast(log.id, "resume")}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <Play className="h-3 w-3 mr-1" /> Retomar
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-8 cursor-pointer text-xs"
                                                                onClick={() => handleControlBroadcast(log.id, "cancel")}
                                                                disabled={actionLoading}
                                                            >
                                                                <Square className="h-3 w-3 mr-1" /> Parar
                                                            </Button>
                                                        </>
                                                    )}

                                                    {/* View button */}
                                                    <Button variant="ghost" size="sm" className="h-8 cursor-pointer" onClick={() => openDetail(log)}>
                                                        <Eye className="h-4 w-4 mr-1" /> Detalhes
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Detail Modal */}
                <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {selectedLog?.status === "completed"
                                    ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    : selectedLog?.status === "cancelled"
                                    ? <XCircle className="h-5 w-5 text-red-500" />
                                    : <Radio className="h-5 w-5 text-blue-500 animate-pulse" />
                                }
                                Detalhes do disparo
                            </DialogTitle>
                        </DialogHeader>

                        {detailLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : selectedLog ? (
                            <div className="flex flex-col gap-4 overflow-hidden min-h-0">
                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                                        <div className="text-xl font-bold text-green-600">{selectedLog.sent}</div>
                                        <div className="text-xs text-muted-foreground">Enviadas</div>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                                        <div className="text-xl font-bold text-red-500">{selectedLog.failed}</div>
                                        <div className="text-xs text-muted-foreground">Com falha</div>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                                        <div className="text-xl font-bold">{selectedLog.total}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                </div>

                                {/* Message */}
                                {(() => {
                                    const variations = parseStoredMessages(selectedLog.message);
                                    if (variations.length > 1) {
                                        return (
                                            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                                        <Shuffle className="h-3.5 w-3.5 text-primary" />
                                                        {variations.length} variações configuradas neste disparo:
                                                    </p>
                                                </div>
                                                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                                                    {variations.map((v, idx) => (
                                                        <div key={idx} className="p-2 rounded bg-background border text-xs space-y-1">
                                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                                                Variação #{idx + 1}
                                                            </span>
                                                            <p className="text-foreground whitespace-pre-wrap break-words">{v}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="bg-muted/30 rounded-lg p-3">
                                            <p className="text-xs text-muted-foreground mb-1">Mensagem:</p>
                                            <p className="text-sm whitespace-pre-wrap break-words">{selectedLog.message}</p>
                                        </div>
                                    );
                                })()}

                                {/* Time */}
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span>Início: {formatTime(selectedLog.startedAt)}</span>
                                    {selectedLog.completedAt && <span>Conclusão: {formatTime(selectedLog.completedAt)}</span>}
                                </div>

                                {/* Recipients list */}
                                {selectedLog.recipients && selectedLog.recipients.length > 0 && (
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                        <h4 className="text-sm font-semibold mb-2">Destinatários ({selectedLog.recipients.length})</h4>
                                        <div className="space-y-1">
                                            {selectedLog.recipients.map(r => (
                                                <div key={r.id}
                                                    className={`flex items-center justify-between gap-2 text-xs py-1.5 px-2 rounded ${
                                                        r.status === "sent" ? "bg-green-500/5" :
                                                        r.status === "failed" ? "bg-red-500/5" : "bg-muted/30"
                                                    }`}
                                                >
                                                    <span className="font-mono truncate">{formatJid(r.jid)}</span>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className={`px-1.5 py-0.5 rounded font-medium ${
                                                            r.status === "sent" ? "text-green-600 bg-green-500/10" :
                                                            r.status === "failed" ? "text-red-500 bg-red-500/10" : "text-muted-foreground bg-muted/50"
                                                        }`}>
                                                            {recipientStatusLabels[r.status] ?? r.status}
                                                        </span>
                                                        {r.error && (
                                                            <span className="text-red-500 max-w-[200px] truncate" title={r.error}>{r.error}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </SessionGuard>
    );
}
