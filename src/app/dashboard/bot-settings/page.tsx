"use client";

import { useState, useEffect } from "react";
import { useSession as useSessionProvider } from "@/components/dashboard/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    RefreshCw,
    Save,
    ShieldCheck,
    Zap,
    UserCheck,
    MessageSquarePlus,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertTriangle,
    Sliders,
    Bot,
    Plus,
    X,
    Sparkles,
    Smartphone,
    Activity,
    Lock,
    Globe,
    UserX,
    MessageSquare,
    Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SessionGuard } from "@/components/dashboard/session-guard";

type AntiSpamPreset = "safe" | "broadcast" | "fast" | "custom";

export default function BotSettingsPage() {
    const { sessionId } = useSessionProvider();

    const [activeTab, setActiveTab] = useState("identidade");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [botConfig, setBotConfig] = useState({
        botName: "Atendente Virtual",
        prefix: "#",
        enableSticker: true,
        enableVideoSticker: true,
        maxStickerDuration: 10,
        enablePing: true,
        enableUptime: true,
        removeBgApiKey: "",
        botMode: "OWNER",
        autoReplyMode: "ALL",
        antiSpamEnabled: false,
        spamLimit: 5,
        spamInterval: 10,
        spamDelayMin: 1000,
        spamDelayMax: 3000,

        // Presença e Mensagens
        welcomeMessage: "",
        autoRead: false,
        alwaysOnline: false,
        botAllowedJids: [] as string[],
        botBlockedJids: [] as string[],
        autoReplyAllowedJids: [] as string[],
        autoReplyBlockedJids: [] as string[],
    });

    const [privacyConfig, setPrivacyConfig] = useState({
        ghostMode: false,
        antiDelete: false,
        readReceipts: true,
    });

    const [newJid, setNewJid] = useState("");

    // Load configs from API
    useEffect(() => {
        if (!sessionId) return;
        setLoading(true);

        Promise.all([
            fetch(`/api/sessions/${sessionId}/bot-config`)
                .then(res => res.ok ? res.json() : null),
            fetch(`/api/sessions/${sessionId}/settings`)
                .then(res => res.ok ? res.json() : null)
        ])
            .then(([botRes, privacyRes]) => {
                if (botRes?.data && !botRes.error) {
                    const data = botRes.data;
                    setBotConfig(prev => ({
                        ...prev,
                        ...data,
                        botName: data.botName || "Atendente Virtual",
                        removeBgApiKey: data.removeBgApiKey || "",
                        prefix: data.prefix || "#",
                        welcomeMessage: data.welcomeMessage || "",
                        botAllowedJids: data.botAllowedJids || [],
                        botBlockedJids: data.botBlockedJids || [],
                        autoReplyAllowedJids: data.autoReplyAllowedJids || [],
                        autoReplyBlockedJids: data.autoReplyBlockedJids || [],
                    }));
                }

                if (privacyRes?.data && !privacyRes.error) {
                    const data = privacyRes.data;
                    setPrivacyConfig({
                        ghostMode: data.config?.ghostMode || false,
                        antiDelete: data.config?.antiDelete || false,
                        readReceipts: data.config?.readReceipts ?? true
                    });
                }
            })
            .catch(() => {
                toast.error("Erro ao carregar configurações da sessão");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [sessionId]);

    // Save All (Unified Action)
    const handleSaveAll = async () => {
        if (!sessionId) return;
        setSaving(true);
        try {
            const [resBot, resPrivacy] = await Promise.all([
                fetch(`/api/sessions/${sessionId}/bot-config`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(botConfig)
                }),
                fetch(`/api/sessions/${sessionId}/settings`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        config: {
                            ghostMode: privacyConfig.ghostMode,
                            antiDelete: privacyConfig.antiDelete,
                            readReceipts: privacyConfig.readReceipts
                        }
                    })
                })
            ]);

            if (resBot.ok && resPrivacy.ok) {
                toast.success("Todas as configurações foram salvas com sucesso!");
            } else if (!resBot.ok) {
                toast.error("Falha ao salvar configurações do bot");
            } else {
                toast.error("Falha ao salvar configurações de privacidade");
            }
        } catch (e) {
            console.error(e);
            toast.error("Erro de comunicação ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    // JID Management
    const addJid = (listName: "botAllowedJids" | "botBlockedJids") => {
        if (!newJid || !newJid.trim()) return;
        let formatted = newJid.trim().replace(/\D/g, "");
        if (!formatted) return;

        const jidString = `${formatted}@s.whatsapp.net`;

        if (!botConfig[listName].includes(jidString)) {
            setBotConfig(prev => ({
                ...prev,
                [listName]: [...prev[listName], jidString]
            }));
            toast.success(`Número adicionado com sucesso`);
        } else {
            toast.info("Este número já está na lista");
        }
        setNewJid("");
    };

    const removeJid = (listName: "botAllowedJids" | "botBlockedJids", jid: string) => {
        setBotConfig(prev => ({
            ...prev,
            [listName]: prev[listName].filter(item => item !== jid)
        }));
    };

    // Determine current anti-spam preset
    const currentPreset: AntiSpamPreset = (() => {
        if (
            botConfig.spamLimit === 5 &&
            botConfig.spamInterval === 10 &&
            botConfig.spamDelayMin === 1000 &&
            botConfig.spamDelayMax === 3000
        ) return "safe";

        if (
            botConfig.spamLimit === 3 &&
            botConfig.spamInterval === 15 &&
            botConfig.spamDelayMin === 2000 &&
            botConfig.spamDelayMax === 5000
        ) return "broadcast";

        if (
            botConfig.spamLimit === 10 &&
            botConfig.spamInterval === 10 &&
            botConfig.spamDelayMin === 500 &&
            botConfig.spamDelayMax === 1500
        ) return "fast";

        return "custom";
    })();

    const applyPreset = (preset: AntiSpamPreset) => {
        if (preset === "safe") {
            setBotConfig(prev => ({
                ...prev,
                spamLimit: 5,
                spamInterval: 10,
                spamDelayMin: 1000,
                spamDelayMax: 3000
            }));
        } else if (preset === "broadcast") {
            setBotConfig(prev => ({
                ...prev,
                spamLimit: 3,
                spamInterval: 15,
                spamDelayMin: 2000,
                spamDelayMax: 5000
            }));
        } else if (preset === "fast") {
            setBotConfig(prev => ({
                ...prev,
                spamLimit: 10,
                spamInterval: 10,
                spamDelayMin: 500,
                spamDelayMax: 1500
            }));
        }
    };

    return (
        <SessionGuard>
            <div className="space-y-6 max-w-5xl mx-auto pb-16">
                {/* Header & Sticky Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[#222d34] bg-gradient-to-r from-[#182229] to-[#111b21] shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#e9edef] flex items-center gap-2">
                                <Bot className="h-6 w-6 text-[#00a884]" />
                                Configurações do Bot & Sessão
                            </h2>
                            {sessionId && (
                                <Badge variant="outline" className="bg-[#00a884]/10 text-[#00a884] border-[#00a884]/30 text-xs py-0.5">
                                    Conectado
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#8696a0]">
                            Controle a identidade, comportamento, segurança anti-banimento e privacidade da sua conta ativa.
                        </p>
                    </div>

                    <Button
                        onClick={handleSaveAll}
                        disabled={saving || !sessionId || loading}
                        className="h-10 px-5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-xs shadow-md transition-all shrink-0 gap-2 cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Salvando alterações...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Salvar Todas as Configurações</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Main Tabs Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-[#182229] border border-[#222d34] p-1 rounded-xl w-full grid grid-cols-2 md:grid-cols-4 h-auto gap-1">
                        <TabsTrigger
                            value="identidade"
                            className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-[#202c33] data-[state=active]:text-[#00a884] data-[state=active]:shadow-xs gap-2 transition-colors cursor-pointer"
                        >
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            <span>Identidade & Acesso</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="presenca"
                            className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-[#202c33] data-[state=active]:text-[#00a884] data-[state=active]:shadow-xs gap-2 transition-colors cursor-pointer"
                        >
                            <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                            <span>Presença & Atendimento</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="antiban"
                            className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-[#202c33] data-[state=active]:text-[#00a884] data-[state=active]:shadow-xs gap-2 transition-colors cursor-pointer"
                        >
                            <AlertTriangle className="h-4 w-4 shrink-0 text-orange-400" />
                            <span>Proteção Anti-Ban</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="privacidade"
                            className="rounded-lg py-2.5 text-xs font-semibold data-[state=active]:bg-[#202c33] data-[state=active]:text-[#00a884] data-[state=active]:shadow-xs gap-2 transition-colors cursor-pointer"
                        >
                            <Eye className="h-4 w-4 shrink-0 text-blue-400" />
                            <span>Privacidade & Discrição</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* ============================================================== */}
                    {/* TAB 1: IDENTIDADE & ACESSO */}
                    {/* ============================================================== */}
                    <TabsContent value="identidade" className="space-y-6 focus:outline-none">
                        {/* 1. Nome e Prefixo */}
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-[#00a884]" />
                                    <div>
                                        <CardTitle className="text-sm font-bold text-[#e9edef]">Identidade do Assistente</CardTitle>
                                        <CardDescription className="text-xs text-[#8696a0]">
                                            Defina o nome pelo qual o bot se apresenta e como ele reconhece comandos.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-5">
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <Label className="text-xs font-semibold text-[#e9edef]">Nome de Exibição do Bot</Label>
                                        <Input
                                            placeholder="Ex: Atendente Virtual, Suporte Aurora"
                                            value={botConfig.botName}
                                            onChange={(e) => setBotConfig(prev => ({ ...prev, botName: e.target.value }))}
                                            className="h-9 text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-xl focus:ring-[#00a884]"
                                        />
                                        <p className="text-[11px] text-[#8696a0]">Nome assinado ou exibido nas respostas automáticas.</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-[#e9edef]">Prefixo de Comandos</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                maxLength={3}
                                                placeholder="#"
                                                value={botConfig.prefix}
                                                onChange={(e) => setBotConfig(prev => ({ ...prev, prefix: e.target.value }))}
                                                className="h-9 text-center font-mono font-bold text-xs bg-[#202c33] border-[#2a3942] text-[#00a884] rounded-xl w-16"
                                            />
                                            <div className="text-[11px] text-[#8696a0] leading-tight">
                                                Exemplo: <span className="font-mono text-[#e9edef] bg-[#202c33] px-1 py-0.5 rounded">{botConfig.prefix}ping</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comandos Rápidos do Sistema */}
                                <div className="pt-3 border-t border-[#222d34]/60 space-y-2">
                                    <Label className="text-xs font-semibold text-[#8696a0]">Comandos Rápidos do Sistema</Label>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold text-xs text-[#e9edef] block">Comando Ping</span>
                                                <span className="text-[11px] text-[#8696a0]">Responde com a latência da conexão ao digitar {botConfig.prefix}ping</span>
                                            </div>
                                            <Switch
                                                checked={botConfig.enablePing}
                                                onCheckedChange={(c) => setBotConfig(prev => ({ ...prev, enablePing: c }))}
                                            />
                                        </div>

                                        <div className="p-3 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold text-xs text-[#e9edef] block">Tempo de Atividade (Uptime)</span>
                                                <span className="text-[11px] text-[#8696a0]">Informa há quanto tempo o robô está ativo com {botConfig.prefix}uptime</span>
                                            </div>
                                            <Switch
                                                checked={botConfig.enableUptime}
                                                onCheckedChange={(c) => setBotConfig(prev => ({ ...prev, enableUptime: c }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Controle de Acesso / Modo de Interação */}
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-[#00a884]" />
                                    <div>
                                        <CardTitle className="text-sm font-bold text-[#e9edef]">Controle de Acesso</CardTitle>
                                        <CardDescription className="text-xs text-[#8696a0]">
                                            Defina quem tem permissão para acionar comandos e interagir com o bot.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {/* Opção 1: ALL */}
                                    <div
                                        onClick={() => setBotConfig(prev => ({ ...prev, botMode: "ALL" }))}
                                        className={cn(
                                            "p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5",
                                            botConfig.botMode === "ALL"
                                                ? "border-[#00a884] bg-[#00a884]/10 shadow-xs"
                                                : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Globe className={cn("h-4 w-4", botConfig.botMode === "ALL" ? "text-[#00a884]" : "text-[#8696a0]")} />
                                            {botConfig.botMode === "ALL" && <Check className="h-3.5 w-3.5 text-[#00a884]" />}
                                        </div>
                                        <span className="font-semibold text-xs text-[#e9edef] block">Público (Todos)</span>
                                        <p className="text-[11px] text-[#8696a0] leading-snug">
                                            Qualquer pessoa ou grupo pode acionar os comandos do bot.
                                        </p>
                                    </div>

                                    {/* Opção 2: OWNER */}
                                    <div
                                        onClick={() => setBotConfig(prev => ({ ...prev, botMode: "OWNER" }))}
                                        className={cn(
                                            "p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5",
                                            botConfig.botMode === "OWNER"
                                                ? "border-[#00a884] bg-[#00a884]/10 shadow-xs"
                                                : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Lock className={cn("h-4 w-4", botConfig.botMode === "OWNER" ? "text-[#00a884]" : "text-[#8696a0]")} />
                                            {botConfig.botMode === "OWNER" && <Check className="h-3.5 w-3.5 text-[#00a884]" />}
                                        </div>
                                        <span className="font-semibold text-xs text-[#e9edef] block">Privado (Dono)</span>
                                        <p className="text-[11px] text-[#8696a0] leading-snug">
                                            Apenas a própria conta e administradores podem usar comandos.
                                        </p>
                                    </div>

                                    {/* Opção 3: SPECIFIC */}
                                    <div
                                        onClick={() => setBotConfig(prev => ({ ...prev, botMode: "SPECIFIC" }))}
                                        className={cn(
                                            "p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5",
                                            botConfig.botMode === "SPECIFIC"
                                                ? "border-[#00a884] bg-[#00a884]/10 shadow-xs"
                                                : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <UserCheck className={cn("h-4 w-4", botConfig.botMode === "SPECIFIC" ? "text-[#00a884]" : "text-[#8696a0]")} />
                                            {botConfig.botMode === "SPECIFIC" && <Check className="h-3.5 w-3.5 text-[#00a884]" />}
                                        </div>
                                        <span className="font-semibold text-xs text-[#e9edef] block">Lista de Permitidos</span>
                                        <p className="text-[11px] text-[#8696a0] leading-snug">
                                            Somente números cadastrados explicitamente na lista VIP.
                                        </p>
                                    </div>

                                    {/* Opção 4: BLACKLIST */}
                                    <div
                                        onClick={() => setBotConfig(prev => ({ ...prev, botMode: "BLACKLIST" }))}
                                        className={cn(
                                            "p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5",
                                            botConfig.botMode === "BLACKLIST"
                                                ? "border-[#00a884] bg-[#00a884]/10 shadow-xs"
                                                : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <UserX className={cn("h-4 w-4", botConfig.botMode === "BLACKLIST" ? "text-[#00a884]" : "text-[#8696a0]")} />
                                            {botConfig.botMode === "BLACKLIST" && <Check className="h-3.5 w-3.5 text-[#00a884]" />}
                                        </div>
                                        <span className="font-semibold text-xs text-[#e9edef] block">Lista de Bloqueados</span>
                                        <p className="text-[11px] text-[#8696a0] leading-snug">
                                            Aberto a todos, exceto contatos cadastrados no bloqueio.
                                        </p>
                                    </div>
                                </div>

                                {/* Gestão da Lista (quando SPECIFIC ou BLACKLIST estiver ativo) */}
                                {(botConfig.botMode === "SPECIFIC" || botConfig.botMode === "BLACKLIST") && (
                                    <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/40 space-y-3 animate-in fade-in-50 duration-200">
                                        <Label className="text-xs font-semibold text-[#e9edef] flex items-center gap-1.5">
                                            {botConfig.botMode === "SPECIFIC" ? (
                                                <>
                                                    <UserCheck className="h-4 w-4 text-emerald-400" />
                                                    Números com Acesso Permitido
                                                </>
                                            ) : (
                                                <>
                                                    <UserX className="h-4 w-4 text-rose-400" />
                                                    Números Bloqueados
                                                </>
                                            )}
                                        </Label>

                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Digite o número (ex: 5511999998888)"
                                                value={newJid}
                                                onChange={(e) => setNewJid(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && addJid(botConfig.botMode === "SPECIFIC" ? "botAllowedJids" : "botBlockedJids")}
                                                className="h-9 text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-xl"
                                            />
                                            <Button
                                                onClick={() => addJid(botConfig.botMode === "SPECIFIC" ? "botAllowedJids" : "botBlockedJids")}
                                                size="sm"
                                                className="h-9 px-3 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#e9edef] border border-white/[0.05] cursor-pointer"
                                            >
                                                <Plus className="h-4 w-4 mr-1 text-[#00a884]" />
                                                Adicionar
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-1 min-h-8">
                                            {(botConfig.botMode === "SPECIFIC" ? botConfig.botAllowedJids : botConfig.botBlockedJids).map(item => (
                                                <span
                                                    key={item}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#202c33] text-[#e9edef] border border-[#2a3942]"
                                                >
                                                    <span>{item.replace("@s.whatsapp.net", "")}</span>
                                                    <button
                                                        onClick={() => removeJid(botConfig.botMode === "SPECIFIC" ? "botAllowedJids" : "botBlockedJids", item)}
                                                        className="text-[#8696a0] hover:text-rose-400 transition-colors cursor-pointer"
                                                        title="Remover"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                            {(botConfig.botMode === "SPECIFIC" ? botConfig.botAllowedJids : botConfig.botBlockedJids).length === 0 && (
                                                <p className="text-xs text-[#8696a0] italic py-1">Nenhum número cadastrado nesta lista ainda.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ============================================================== */}
                    {/* TAB 2: PRESENÇA & ATENDIMENTO */}
                    {/* ============================================================== */}
                    <TabsContent value="presenca" className="space-y-6 focus:outline-none">
                        {/* 1. Presença no WhatsApp */}
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-[#00a884]" />
                                    <div>
                                        <CardTitle className="text-sm font-bold text-[#e9edef]">Presença & Status no WhatsApp</CardTitle>
                                        <CardDescription className="text-xs text-[#8696a0]">
                                            Configure a visibilidade da sua conta para contatos e clientes.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Sempre Online */}
                                    <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs text-[#e9edef]">Sempre Online</span>
                                                {botConfig.alwaysOnline && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Ativo
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#8696a0] leading-relaxed">
                                                Mantém a sua conta exibindo o status verde <strong>"Online"</strong> para clientes, transmitindo maior confiabilidade de atendimento imediato.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={botConfig.alwaysOnline}
                                            onCheckedChange={(c) => setBotConfig(prev => ({ ...prev, alwaysOnline: c }))}
                                        />
                                    </div>

                                    {/* Leitura Automática */}
                                    <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <span className="font-semibold text-xs text-[#e9edef] block">Confirmação de Leitura Automática</span>
                                            <p className="text-[11px] text-[#8696a0] leading-relaxed">
                                                Marca automaticamente novas mensagens recebidas como lidas (emite os dois tiques azuis instantaneamente).
                                            </p>
                                        </div>
                                        <Switch
                                            checked={botConfig.autoRead}
                                            onCheckedChange={(c) => setBotConfig(prev => ({ ...prev, autoRead: c }))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Mensagem de Boas-Vindas */}
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center gap-2">
                                    <MessageSquarePlus className="h-5 w-5 text-amber-400" />
                                    <div>
                                        <CardTitle className="text-sm font-bold text-[#e9edef]">Mensagem de Primeiro Contato (Boas-Vindas)</CardTitle>
                                        <CardDescription className="text-xs text-[#8696a0]">
                                            Enviada automaticamente quando um novo cliente mandar mensagem pela primeira vez.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="grid lg:grid-cols-5 gap-6 items-start">
                                    <div className="lg:col-span-3 space-y-2">
                                        <Label className="text-xs font-semibold text-[#e9edef]">Texto da Mensagem</Label>
                                        <Textarea
                                            placeholder="Ex: Olá! Seja muito bem-vindo. Já vamos te atender, por favor aguarde um momento..."
                                            rows={5}
                                            value={botConfig.welcomeMessage}
                                            onChange={(e) => setBotConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                            className="text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-xl resize-none focus:ring-[#00a884] leading-relaxed"
                                        />
                                        <p className="text-[11px] text-[#8696a0]">
                                            Deixe este campo em branco caso prefira não disparar mensagem de boas-vindas automática.
                                        </p>
                                    </div>

                                    {/* Preview Visual no WhatsApp */}
                                    <div className="lg:col-span-2 space-y-2">
                                        <Label className="text-xs font-semibold text-[#8696a0] flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                                            Prévia no WhatsApp
                                        </Label>
                                        <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#222d34] shadow-inner relative overflow-hidden min-h-[140px] flex items-end">
                                            <div className="max-w-[90%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#202c33] text-[#e9edef] text-xs shadow-sm space-y-1">
                                                <span className="text-[10px] font-bold text-[#00a884] block">{botConfig.botName || "Atendente"}</span>
                                                <p className="text-xs whitespace-pre-wrap leading-relaxed text-[#e9edef]/90">
                                                    {botConfig.welcomeMessage || "Olá! Seja bem-vindo ao nosso atendimento."}
                                                </p>
                                                <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] pt-0.5">
                                                    <span>14:30</span>
                                                    <span className="text-[#53bdeb]">✓✓</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ============================================================== */}
                    {/* TAB 3: PROTEÇÃO ANTI-BAN (ANTI-SPAM) */}
                    {/* ============================================================== */}
                    <TabsContent value="antiban" className="space-y-6 focus:outline-none">
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-orange-400" />
                                        <div>
                                            <CardTitle className="text-sm font-bold text-[#e9edef]">Cadência Inteligente Anti-Banimento</CardTitle>
                                            <CardDescription className="text-xs text-[#8696a0]">
                                                Protege seu número do WhatsApp contra suspensão através de atrasos humanizados entre envios.
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-[#8696a0]">Proteção:</span>
                                        <Switch
                                            checked={botConfig.antiSpamEnabled}
                                            onCheckedChange={(c) => setBotConfig(prev => ({ ...prev, antiSpamEnabled: c }))}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-6">
                                {/* Status Banner */}
                                <div className={cn(
                                    "p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 transition-colors",
                                    botConfig.antiSpamEnabled
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-[#e9edef]"
                                        : "bg-orange-500/10 border-orange-500/30 text-[#e9edef]"
                                )}>
                                    <div className="flex items-center gap-2 font-semibold">
                                        {botConfig.antiSpamEnabled ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                <span className="text-emerald-400">Proteção Ativa e Operante</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-4 w-4 text-orange-400" />
                                                <span className="text-orange-400">Proteção Desativada (Risco de Bloqueio em Envios Rápidos)</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-[#8696a0]">
                                        Quando ativado, caso haja muitos envios em sequência (disparos em massa ou atendimento simultâneo), as mensagens não são canceladas: elas aguardam em uma fila de entrega suave com intervalos aleatórios.
                                    </p>
                                </div>

                                {botConfig.antiSpamEnabled && (
                                    <div className="space-y-6 animate-in fade-in-50 duration-200">
                                        {/* Presets Rápidos */}
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-[#e9edef]">Perfis de Envio Pré-Configurados</Label>
                                            <div className="grid sm:grid-cols-3 gap-3">
                                                {/* Preset 1: Seguro */}
                                                <button
                                                    type="button"
                                                    onClick={() => applyPreset("safe")}
                                                    className={cn(
                                                        "p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1.5",
                                                        currentPreset === "safe"
                                                            ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                                                            : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-[#e9edef]">🛡️ Padrão Seguro</span>
                                                        {currentPreset === "safe" && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                                                    </div>
                                                    <p className="text-[11px] text-[#8696a0]">
                                                        5 mensagens a cada 10s. Intervalo de 1s a 3s.
                                                    </p>
                                                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                                                        Recomendado
                                                    </Badge>
                                                </button>

                                                {/* Preset 2: Disparo em Massa */}
                                                <button
                                                    type="button"
                                                    onClick={() => applyPreset("broadcast")}
                                                    className={cn(
                                                        "p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1.5",
                                                        currentPreset === "broadcast"
                                                            ? "border-amber-500 bg-amber-500/10 shadow-xs"
                                                            : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-[#e9edef]">📢 Disparo em Massa</span>
                                                        {currentPreset === "broadcast" && <Check className="h-3.5 w-3.5 text-amber-400" />}
                                                    </div>
                                                    <p className="text-[11px] text-[#8696a0]">
                                                        3 mensagens a cada 15s. Intervalo de 2s a 5s.
                                                    </p>
                                                    <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                                                        Para Campanhas
                                                    </Badge>
                                                </button>

                                                {/* Preset 3: Alta Demanda */}
                                                <button
                                                    type="button"
                                                    onClick={() => applyPreset("fast")}
                                                    className={cn(
                                                        "p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1.5",
                                                        currentPreset === "fast"
                                                            ? "border-blue-500 bg-blue-500/10 shadow-xs"
                                                            : "border-[#222d34] bg-[#182229]/60 hover:border-[#2a3942]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-[#e9edef]">⚡ Atendimento Rápido</span>
                                                        {currentPreset === "fast" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                                                    </div>
                                                    <p className="text-[11px] text-[#8696a0]">
                                                        10 mensagens a cada 10s. Intervalo de 0.5s a 1.5s.
                                                    </p>
                                                    <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                                                        Muitos Atendentes
                                                    </Badge>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Ajustes Finos (Slidables & Inputs) */}
                                        <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/40 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-xs text-[#e9edef] flex items-center gap-1.5">
                                                    <Sliders className="h-3.5 w-3.5 text-[#00a884]" />
                                                    Parâmetros de Cadência
                                                </span>
                                                {currentPreset === "custom" && (
                                                    <Badge variant="secondary" className="text-[10px]">Personalizado</Badge>
                                                )}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold text-[#8696a0]">Limite sem espera (Mensagens)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        value={botConfig.spamLimit}
                                                        onChange={(e) => setBotConfig(prev => ({ ...prev, spamLimit: parseInt(e.target.value) || 1 }))}
                                                        className="h-9 text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-xl"
                                                    />
                                                    <p className="text-[10px] text-[#8696a0]">Quantas mensagens saem instantaneamente antes de acionar a fila.</p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold text-[#8696a0]">Janela de Monitoramento (Segundos)</Label>
                                                    <Input
                                                        type="number"
                                                        min={5}
                                                        max={120}
                                                        value={botConfig.spamInterval}
                                                        onChange={(e) => setBotConfig(prev => ({ ...prev, spamInterval: parseInt(e.target.value) || 5 }))}
                                                        className="h-9 text-xs bg-[#202c33] border-[#2a3942] text-[#e9edef] rounded-xl"
                                                    />
                                                    <p className="text-[10px] text-[#8696a0]">Tempo em que a contagem de disparos é contabilizada.</p>
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold text-[#8696a0]">Atraso Mínimo: {(botConfig.spamDelayMin / 1000).toFixed(1)}s</Label>
                                                    <Slider
                                                        min={100}
                                                        max={5000}
                                                        step={100}
                                                        value={[botConfig.spamDelayMin]}
                                                        onValueChange={([val]) => setBotConfig(prev => ({ ...prev, spamDelayMin: val }))}
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold text-[#8696a0]">Atraso Máximo: {(botConfig.spamDelayMax / 1000).toFixed(1)}s</Label>
                                                    <Slider
                                                        min={500}
                                                        max={10000}
                                                        step={100}
                                                        value={[botConfig.spamDelayMax]}
                                                        onValueChange={([val]) => setBotConfig(prev => ({ ...prev, spamDelayMax: Math.max(val, prev.spamDelayMin) }))}
                                                    />
                                                </div>
                                            </div>

                                            {/* Resumo Dinâmico em Português */}
                                            <div className="p-3 rounded-lg bg-[#202c33]/70 border border-[#2a3942] text-[11px] text-[#e9edef] leading-relaxed">
                                                💡 <strong>Como vai funcionar na prática:</strong> As primeiras <strong>{botConfig.spamLimit} mensagens</strong> em até <strong>{botConfig.spamInterval} segundos</strong> serão enviadas imediatamente. A partir da mensagem nº {botConfig.spamLimit + 1}, cada mensagem aguardará um tempo aleatório entre <strong>{(botConfig.spamDelayMin / 1000).toFixed(1)}s e {(botConfig.spamDelayMax / 1000).toFixed(1)}s</strong>, simulando uma pessoa real digitando.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ============================================================== */}
                    {/* TAB 4: PRIVACIDADE & DISCREÇÃO */}
                    {/* ============================================================== */}
                    <TabsContent value="privacidade" className="space-y-6 focus:outline-none">
                        <Card className="border-[#222d34] bg-[#111b21] shadow-sm">
                            <CardHeader className="pb-4 border-b border-[#222d34]/60">
                                <div className="flex items-center gap-2">
                                    <EyeOff className="h-5 w-5 text-blue-400" />
                                    <div>
                                        <CardTitle className="text-sm font-bold text-[#e9edef]">Privacidade & Recursos Avançados</CardTitle>
                                        <CardDescription className="text-xs text-[#8696a0]">
                                            Controle o modo fantasma, antiexclusão e recibos de leitura da sessão.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Modo Fantasma */}
                                    <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs text-[#e9edef]">Modo Fantasma (Ghost Mode)</span>
                                                {privacyConfig.ghostMode && (
                                                    <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                                                        Ativado
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#8696a0] leading-relaxed">
                                                Permite que seus atendentes leiam mensagens e vejam status de contatos no painel sem que o remetente saiba que foi visualizado.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={privacyConfig.ghostMode}
                                            onCheckedChange={(c) => setPrivacyConfig(prev => ({ ...prev, ghostMode: c }))}
                                        />
                                    </div>

                                    {/* Antiexclusão */}
                                    <div className="p-4 rounded-xl border border-[#222d34] bg-[#182229]/60 flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs text-[#e9edef]">Antiexclusão de Mensagens</span>
                                                {privacyConfig.antiDelete && (
                                                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                                        Ativado
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-[#8696a0] leading-relaxed">
                                                Se um contato enviar uma mensagem ou mídia e depois selecionar "Apagar para todos", ela continuará visível no seu painel.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={privacyConfig.antiDelete}
                                            onCheckedChange={(c) => setPrivacyConfig(prev => ({ ...prev, antiDelete: c }))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SessionGuard>
    );
}
