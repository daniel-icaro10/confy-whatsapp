'use client';

import { useState, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Label } from '@/components/ui/label';
import { 
    Smartphone, 
    Plus, 
    Settings, 
    UserPlus, 
    Search, 
    QrCode, 
    CheckCircle2, 
    AlertTriangle, 
    WifiOff, 
    Radio,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Session = {
    id: string;
    name: string;
    sessionId: string;
    status: string;
    qr?: string | null;
    user?: {
        name: string | null;
        email: string;
    } | null;
};

const STATUS_LABELS: Record<string, string> = {
    CONNECTED: "Conectado",
    DISCONNECTED: "Desconectado",
    CONNECTING: "Conectando",
    STOPPED: "Parado",
    SCAN_QR: "Aguardando QR Code",
    LOGGED_OUT: "Sessão encerrada",
};

export function SessionManager({ user }: { user: any }) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [newSessionName, setNewSessionName] = useState("");
    const [newSessionId, setNewSessionId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "CONNECTED" | "ATTENTION">("ALL");
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchSessions();

        const socketInstance = io({
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
        });

        socketInstance.on('connection.update', (data: { sessionId: string; status: string; qr: string }) => {
            setSessions(prev => prev.map(s => {
                if (s.sessionId === data.sessionId) {
                    return { ...s, status: data.status, qr: data.qr };
                }
                return s;
            }));

            if (data.status === 'CONNECTED') {
                fetchSessions();
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const fetchSessions = () => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(responseData => {
                const data = responseData?.data || [];
                if (Array.isArray(data)) setSessions(data);
            })
            .catch(() => {});
    };

    const createSession = async () => {
        if (!newSessionName.trim()) {
            toast.error("O nome da sessão é obrigatório");
            return;
        }

        if (newSessionId && sessions.some(s => s.sessionId === newSessionId)) {
            toast.error("Já existe uma sessão com esse ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    name: newSessionName.trim(),
                    sessionId: newSessionId.trim() || undefined
                })
            });
            const responseData = await res.json();
            const session = responseData?.data;

            if (!res.ok || !session) throw new Error(responseData.error || responseData.message || "Falha ao criar");

            setSessions(prev => [...prev, session]);
            setNewSessionName("");
            setNewSessionId("");
            toast.success("Sessão criada com sucesso! Conecte via QR Code.");
            router.push(`/dashboard/sessions/${session.sessionId}`);
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Falha ao criar a sessão");
        } finally {
            setLoading(false);
        }
    };

    const handleManageSession = (sessionId: string) => {
        router.push(`/dashboard/sessions/${sessionId}`);
    };

    // Metrics
    const totalCount = sessions.length;
    const connectedCount = sessions.filter(s => s.status === 'CONNECTED').length;
    const attentionCount = sessions.filter(s => s.status !== 'CONNECTED').length;

    // Filtered Sessions
    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const matchesSearch = 
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.user?.name && s.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (s.user?.email && s.user.email.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (statusFilter === "CONNECTED") return s.status === "CONNECTED";
            if (statusFilter === "ATTENTION") return s.status !== "CONNECTED";
            return true;
        });
    }, [sessions, searchQuery, statusFilter]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-[#8696a0] uppercase tracking-wider">Total de Sessões</p>
                        <h3 className="text-2xl font-bold text-[#e9edef] mt-1">{totalCount}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-[#202c33] text-[#8696a0] flex items-center justify-center border border-white/[0.05]">
                        <Smartphone className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111b21] border border-emerald-500/20 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Conectadas e Ativas</p>
                        </div>
                        <h3 className="text-2xl font-bold text-[#e9edef] mt-1">{connectedCount}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111b21] border border-[#222d34] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">Aguardando / Desconectadas</p>
                        <h3 className="text-2xl font-bold text-[#e9edef] mt-1">{attentionCount}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Radio className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Create New Session Card */}
            <Card className="bg-[#111b21] border border-[#222d34] rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00a884]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
                
                <CardHeader className="pb-4 pt-5 px-5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#00a884]/15 border border-[#00a884]/25 text-[#00a884] flex items-center justify-center shrink-0 shadow-sm">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#e9edef] tracking-tight flex items-center gap-2">
                                Criar Nova Sessão
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30">
                                    WhatsApp Web
                                </span>
                            </CardTitle>
                            <CardDescription className="text-xs text-[#8696a0] mt-0.5">
                                Adicione uma nova conta ou número de WhatsApp para atendimento e integrações.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 sm:px-6 pb-6 pt-1">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5 space-y-1.5">
                            <Label htmlFor="session-name" className="text-xs font-semibold text-[#e9edef]">
                                Nome da sessão <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="session-name"
                                value={newSessionName}
                                onChange={e => setNewSessionName(e.target.value)}
                                placeholder="Ex: Atendimento Comercial, Suporte, Vendas"
                                className="bg-[#202c33] border-[#2a3942] text-[#e9edef] placeholder:text-[#8696a0]/60 focus-visible:ring-[#00a884] focus-visible:border-[#00a884] h-10 rounded-xl text-sm"
                            />
                        </div>
                        <div className="md:col-span-4 space-y-1.5">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="session-id" className="text-xs font-semibold text-[#e9edef]">
                                    ID da sessão <span className="text-xs font-normal text-[#8696a0]">(opcional)</span>
                                </Label>
                            </div>
                            <Input
                                id="session-id"
                                value={newSessionId}
                                onChange={e => setNewSessionId(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                placeholder="Ex: suporte-01"
                                className="bg-[#202c33] border-[#2a3942] text-[#e9edef] placeholder:text-[#8696a0]/60 focus-visible:ring-[#00a884] focus-visible:border-[#00a884] h-10 rounded-xl text-sm font-mono"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Button 
                                onClick={createSession} 
                                disabled={loading}
                                className="w-full h-10 rounded-xl bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#00b890] hover:to-[#00a884] text-white font-semibold shadow-lg shadow-[#00a884]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Criando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        <span>Criar sessão</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-[11px] text-[#8696a0]/80 mt-2">
                        💡 Após criar a sessão, você poderá escanear o QR Code oficial diretamente no celular.
                    </p>
                </CardContent>
            </Card>

            {/* Sessions Table Card */}
            <Card className="bg-[#111b21] border border-[#222d34] rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="pb-3 pt-5 px-5 sm:px-6 border-b border-[#222d34]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-bold text-[#e9edef] flex items-center gap-2">
                                Sessões Ativas ({sessions.length})
                            </CardTitle>
                            <CardDescription className="text-xs text-[#8696a0]">
                                Lista de instâncias conectadas e status operacional em tempo real.
                            </CardDescription>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <div className="relative min-w-[200px]">
                                <Search className="h-3.5 w-3.5 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nome ou ID..."
                                    className="h-8 pl-8 pr-3 text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-lg focus-visible:ring-[#00a884]"
                                />
                            </div>

                            <div className="flex items-center bg-[#202c33] rounded-lg p-0.5 border border-[#2a3942]">
                                <button
                                    onClick={() => setStatusFilter("ALL")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                                        statusFilter === "ALL" 
                                            ? "bg-[#111b21] text-[#e9edef] shadow-xs" 
                                            : "text-[#8696a0] hover:text-[#e9edef]"
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setStatusFilter("CONNECTED")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                                        statusFilter === "CONNECTED" 
                                            ? "bg-[#111b21] text-emerald-400 shadow-xs" 
                                            : "text-[#8696a0] hover:text-emerald-400"
                                    }`}
                                >
                                    Conectadas
                                </button>
                                <button
                                    onClick={() => setStatusFilter("ATTENTION")}
                                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                                        statusFilter === "ATTENTION" 
                                            ? "bg-[#111b21] text-amber-400 shadow-xs" 
                                            : "text-[#8696a0] hover:text-amber-400"
                                    }`}
                                >
                                    Atenção
                                </button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 overflow-x-auto">
                    {filteredSessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="h-12 w-12 rounded-full bg-[#202c33] text-[#8696a0] flex items-center justify-center mb-3 border border-white/[0.05]">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <h4 className="text-sm font-semibold text-[#e9edef]">
                                {searchQuery ? "Nenhuma sessão encontrada" : "Nenhuma sessão cadastrada"}
                            </h4>
                            <p className="text-xs text-[#8696a0] max-w-sm mt-1">
                                {searchQuery ? "Tente alterar os termos da busca acima." : "Crie uma nova sessão no formulário acima para conectar seu primeiro número de WhatsApp."}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-[#182229]/60">
                                <TableRow className="border-b border-[#222d34] hover:bg-transparent">
                                    <TableHead className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#8696a0]">
                                        Sessão / Dispositivo
                                    </TableHead>
                                    <TableHead className="py-3 text-xs uppercase tracking-wider font-semibold text-[#8696a0]">
                                        Status
                                    </TableHead>
                                    <TableHead className="py-3 text-xs uppercase tracking-wider font-semibold text-[#8696a0]">
                                        Proprietário
                                    </TableHead>
                                    <TableHead className="text-right px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#8696a0]">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-[#222d34]/60">
                                {filteredSessions.map(session => {
                                    const isConnected = session.status === 'CONNECTED';
                                    const isQrWaiting = session.status === 'SCAN_QR';
                                    const isError = session.status === 'DISCONNECTED' || session.status === 'STOPPED';

                                    return (
                                        <TableRow key={session.id} className="hover:bg-[#182229]/40 transition-colors">
                                            {/* Session / Device */}
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                                        isConnected 
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-xs shadow-emerald-950/20' 
                                                            : 'bg-[#202c33] text-[#8696a0] border-white/[0.05]'
                                                    }`}>
                                                        <Smartphone className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="font-semibold text-[#e9edef] text-sm">
                                                            {session.name}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] font-mono text-[#8696a0] bg-[#202c33] px-2 py-0.5 rounded border border-[#2a3942]/60">
                                                                {session.sessionId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Status Badge */}
                                            <TableCell className="py-4">
                                                {isConnected ? (
                                                    <Badge className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-xs">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                        Conectado
                                                    </Badge>
                                                ) : isQrWaiting ? (
                                                    <Badge className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5 shadow-xs">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                        </span>
                                                        Aguardando QR Code
                                                    </Badge>
                                                ) : (
                                                    <Badge className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#202c33] text-[#8696a0] border border-[#2a3942] inline-flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#8696a0]/70" />
                                                        {STATUS_LABELS[session.status] ?? session.status}
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            {/* Owner */}
                                            <TableCell className="py-4">
                                                {session.user ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-7 w-7 rounded-full bg-[#202c33] text-[#00a884] font-bold text-xs flex items-center justify-center border border-[#2a3942]">
                                                            {(session.user.name || session.user.email).charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="leading-tight">
                                                            <div className="font-semibold text-xs text-[#e9edef]">
                                                                {session.user.name || "Super Admin"}
                                                            </div>
                                                            <div className="text-[10px] text-[#8696a0] mt-0.5">
                                                                {session.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-[#8696a0]/50">-</span>
                                                )}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="py-4 text-right px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {isQrWaiting && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 px-3 text-xs rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all font-semibold cursor-pointer"
                                                            onClick={() => handleManageSession(session.sessionId)}
                                                        >
                                                            <QrCode className="h-3.5 w-3.5 mr-1.5" /> Escanear QR
                                                        </Button>
                                                    )}

                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 px-3 text-xs rounded-xl bg-[#202c33]/70 hover:bg-[#202c33] text-[#e9edef] hover:text-white border-[#2a3942] transition-colors cursor-pointer"
                                                        onClick={() => router.push(`/dashboard/sessions/access?session=${session.sessionId}`)}
                                                    >
                                                        <UserPlus className="h-3.5 w-3.5 mr-1.5 text-[#8696a0]" /> Compartilhar
                                                    </Button>

                                                    <Button 
                                                        size="sm" 
                                                        className="h-8 px-3 text-xs rounded-xl bg-[#202c33] hover:bg-[#00a884]/15 hover:text-[#00a884] text-[#e9edef] border border-[#2a3942] hover:border-[#00a884]/30 transition-all cursor-pointer font-semibold"
                                                        onClick={() => handleManageSession(session.sessionId)}
                                                    >
                                                        <Settings className="h-3.5 w-3.5 mr-1.5 text-[#8696a0]" /> Gerenciar
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
