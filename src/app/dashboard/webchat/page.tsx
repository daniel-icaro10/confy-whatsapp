"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SessionGuard } from "@/components/dashboard/session-guard";
import { RoleGuard } from "@/components/dashboard/role-guard";
import {
    Globe,
    Code,
    Copy,
    Check,
    Sparkles,
    ExternalLink,
    RefreshCw,
    MessageCircle,
    Palette,
    Layers,
    Bot
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WebchatSettingsPage() {
    return (
        <RoleGuard allowedRoles={["SUPERADMIN", "OWNER"]}>
            <SessionGuard>
                <WebchatContent />
            </SessionGuard>
        </RoleGuard>
    );
}

function WebchatContent() {
    const { sessionId } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form fields
    const [enabled, setEnabled] = useState(true);
    const [title, setTitle] = useState("Atendimento Online");
    const [subtitle, setSubtitle] = useState("Fale com nossa equipe em tempo real");
    const [primaryColor, setPrimaryColor] = useState("#2563eb");
    const [welcomeMessage, setWelcomeMessage] = useState("Olá! Como podemos ajudar você hoje?");
    const [requireName, setRequireName] = useState(true);
    const [requireEmail, setRequireEmail] = useState(false);

    const [domainUrl, setDomainUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDomainUrl(window.location.origin);
        }
    }, []);

    const loadConfig = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/webchat/${sessionId}/config`);
            const data = await res.json();
            if (data.status && data.data) {
                const c = data.data;
                setEnabled(c.enabled);
                setTitle(c.title || "Atendimento Online");
                setSubtitle(c.subtitle || "Fale com nossa equipe em tempo real");
                setPrimaryColor(c.primaryColor || "#2563eb");
                setWelcomeMessage(c.welcomeMessage || "Olá! Como podemos ajudar você hoje?");
                setRequireName(c.requireName);
                setRequireEmail(c.requireEmail);
            }
        } catch {
            toast.error("Erro ao carregar dados do Webchat");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const handleSave = async () => {
        if (!sessionId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/webchat/${sessionId}/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled,
                    title,
                    subtitle,
                    primaryColor,
                    welcomeMessage,
                    requireName,
                    requireEmail
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Configurações do widget atualizadas!");
            } else {
                toast.error(data.message || "Erro ao salvar");
            }
        } catch {
            toast.error("Erro ao sincronizar com o servidor");
        } finally {
            setSaving(false);
        }
    };

    const embedScriptTag = `<script src="${domainUrl}/api/webchat/embed.js" data-session="${sessionId}" async></script>`;

    const handleCopyScript = () => {
        navigator.clipboard.writeText(embedScriptTag);
        setCopied(true);
        toast.success("Código copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Widget de Webchat para Sites</h1>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
                            Embeddable JS
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Incorpore um balão flutuante de atendimento em qualquer landing page, loja ou site para capturar visitantes.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <a href={`/webchat/${sessionId}`} target="_blank" rel="noreferrer" className="gap-1.5">
                            <ExternalLink className="h-4 w-4" />
                            Abrir Chat em Nova Aba
                        </a>
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="gap-1.5 shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Settings (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Embed Code Snippet Card */}
                    <Card className="bg-card/40 border-border/70">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Code className="h-4 w-4 text-primary" />
                                Código de Instalação (Script)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Copie e cole esta linha antes da tag <code className="text-primary font-mono">&lt;/body&gt;</code> do seu site ou WordPress:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="relative">
                                <pre className="p-3 bg-muted/30 border border-border/60 rounded-lg text-xs font-mono text-foreground overflow-x-auto select-all">
                                    {embedScriptTag}
                                </pre>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleCopyScript}
                                    className="absolute right-2 top-2 h-7 px-2.5 gap-1.5 text-xs shadow-sm"
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copied ? "Copiado!" : "Copiar"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customization Card */}
                    <Card className="bg-card/40 border-border/70">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Palette className="h-4 w-4 text-primary" />
                                Personalização Visual do Balão
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Defina textos, cores e campos obrigatórios para os visitantes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Título do Cabeçalho</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ex: Atendimento Comercial"
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Subtítulo / Status</Label>
                                    <Input
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        placeholder="Ex: Respondemos em poucos minutos"
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Cor Primária do Widget</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
                                    />
                                    <Input
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="font-mono text-xs w-36"
                                    />
                                    <div className="flex gap-1.5">
                                        {["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#0f172a"].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setPrimaryColor(c)}
                                                className="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Mensagem Inicial de Boas-Vindas</Label>
                                <Textarea
                                    rows={2}
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    placeholder="Ex: Olá! Seja bem-vindo, como podemos ajudar?"
                                    className="text-xs"
                                />
                            </div>

                            <div className="pt-2 border-t border-border/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-semibold">Exigir Nome do Visitante</Label>
                                        <p className="text-[11px] text-muted-foreground">Pergunta o nome antes de iniciar o chat.</p>
                                    </div>
                                    <Switch checked={requireName} onCheckedChange={setRequireName} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-semibold">Exigir E-mail do Visitante</Label>
                                        <p className="text-[11px] text-muted-foreground">Captura o e-mail do lead para follow-up.</p>
                                    </div>
                                    <Switch checked={requireEmail} onCheckedChange={setRequireEmail} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" />
                            Pré-visualização em Tempo Real
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                            Interativo
                        </Badge>
                    </div>

                    <div className="w-full max-w-[380px] h-[580px] rounded-2xl border border-border/80 shadow-2xl overflow-hidden bg-slate-950 flex flex-col">
                        {/* Frame Header */}
                        <div
                            className="p-3.5 flex items-center gap-3 text-white transition-colors"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-xs truncate leading-tight">{title}</p>
                                <p className="text-[10px] text-white/80 truncate">{subtitle}</p>
                            </div>
                        </div>

                        {/* Frame Body Mock */}
                        <div className="flex-1 bg-slate-900 p-3.5 space-y-2.5 overflow-y-auto text-xs">
                            <div className="p-2.5 rounded-2xl rounded-bl-none bg-slate-800 text-slate-200 border border-slate-700/60 max-w-[85%] shadow-sm">
                                <p>{welcomeMessage}</p>
                                <span className="text-[9px] text-slate-400 mt-1 block text-right">Agora</span>
                            </div>

                            <div className="p-2.5 rounded-2xl rounded-br-none text-white max-w-[80%] ml-auto shadow-sm" style={{ backgroundColor: primaryColor }}>
                                <p>Gostaria de saber mais sobre os planos.</p>
                                <span className="text-[9px] text-white/70 mt-1 block text-right">14:00</span>
                            </div>

                            <div className="p-2.5 rounded-2xl rounded-bl-none bg-slate-800 text-slate-200 border border-slate-700/60 max-w-[85%] shadow-sm">
                                <p>Com certeza! Temos planos a partir de R$ 99/mês. Gostaria de falar com um especialista?</p>
                                <span className="text-[9px] text-slate-400 mt-1 block text-right">14:01</span>
                            </div>
                        </div>

                        {/* Frame Input Mock */}
                        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2 items-center">
                            <div className="flex-1 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-[11px]">
                                Digite sua mensagem...
                            </div>
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 shadow"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <MessageCircle className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
