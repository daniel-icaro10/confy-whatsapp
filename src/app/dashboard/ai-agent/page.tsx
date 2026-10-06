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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { RoleGuard } from "@/components/dashboard/role-guard";
import {
    Bot,
    Sparkles,
    Key,
    Brain,
    FileText,
    Send,
    RefreshCw,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    MessageSquare,
    Zap,
    Cpu,
    HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiConfig {
    id: string;
    sessionId: string;
    enabled: boolean;
    provider: "OPENAI" | "GEMINI" | "GROQ";
    apiKey?: string | null;
    model: string;
    systemPrompt?: string | null;
    temperature: number;
    transferKeywords?: string | null;
    outOfScopeMessage?: string | null;
}

interface KnowledgeDocument {
    id: string;
    sessionId: string;
    title: string;
    content: string;
    category?: string | null;
    active: boolean;
    createdAt: string;
}

interface TestMessage {
    role: "user" | "assistant";
    content: string;
    shouldTransfer?: boolean;
}

const PRESET_PROMPTS = [
    {
        name: "Atendimento Geral & FAQ",
        prompt: "Você é a assistente virtual oficial da empresa. Seu objetivo é recepcionar os clientes no WhatsApp, responder dúvidas comuns com base na base de conhecimento com gentileza, simpatia e brevidade. Nunca invente dados que não estão nos documentos."
    },
    {
        name: "Qualificação de Vendas",
        prompt: "Você é um consultor comercial de pré-vendas via WhatsApp. Seja persuasivo, cordial e objetivo. Entenda as necessidades do cliente, apresente os diferenciais da nossa solução e busque agendar uma demonstração ou passar para um vendedor humano."
    },
    {
        name: "Suporte Técnico",
        prompt: "Você é o suporte técnico de primeiro nível no WhatsApp. Seja paciente, dê instruções passo a passo e consulte os procedimentos da base de conhecimento. Se o problema for crítico ou complexo, transfira para o atendente humano."
    }
];

export default function AiAgentPage() {
    return (
        <RoleGuard allowedRoles={["SUPERADMIN", "OWNER"]}>
            <SessionGuard>
                <AiAgentContent />
            </SessionGuard>
        </RoleGuard>
    );
}

function AiAgentContent() {
    const { sessionId } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);

    // AI Config Form
    const [enabled, setEnabled] = useState(false);
    const [provider, setProvider] = useState<"OPENAI" | "GEMINI" | "GROQ">("OPENAI");
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("gpt-4o-mini");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [temperature, setTemperature] = useState(0.7);
    const [transferKeywords, setTransferKeywords] = useState("humano, atendente, suporte, pessoa");

    // Knowledge Documents
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [isAddDocOpen, setIsAddDocOpen] = useState(false);
    const [docTitle, setDocTitle] = useState("");
    const [docCategory, setDocCategory] = useState("Geral");
    const [docContent, setDocContent] = useState("");
    const [savingDoc, setSavingDoc] = useState(false);

    // Live Simulator Chat
    const [chatMessages, setChatMessages] = useState<TestMessage[]>([
        { role: "assistant", content: "Olá! Sou o assistente de IA configurado para sua empresa. Como posso ajudar você hoje?" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);

    const loadData = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/ai/${sessionId}`);
            const data = await res.json();
            if (data.status && data.data) {
                const cfg: AiConfig = data.data.config;
                setEnabled(cfg.enabled);
                setProvider(cfg.provider || "OPENAI");
                setApiKey(cfg.apiKey || "");
                setModel(cfg.model || "gpt-4o-mini");
                setSystemPrompt(cfg.systemPrompt || "");
                setTemperature(cfg.temperature ?? 0.7);
                setTransferKeywords(cfg.transferKeywords || "humano, atendente, suporte, pessoa");
                setDocuments(data.data.documents || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar dados do Agente de IA");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveConfig = async () => {
        if (!sessionId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/ai/${sessionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled,
                    provider,
                    apiKey: apiKey.trim(),
                    model,
                    systemPrompt,
                    temperature,
                    transferKeywords
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Configurações da IA salvas com sucesso!");
            } else {
                toast.error(data.message || "Erro ao salvar");
            }
        } catch {
            toast.error("Erro de conexão com o servidor");
        } finally {
            setSaving(false);
        }
    };

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!docTitle.trim() || !docContent.trim() || !sessionId) return;
        setSavingDoc(true);
        try {
            const res = await fetch(`/api/ai/${sessionId}/documents`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: docTitle.trim(),
                    category: docCategory.trim() || "Geral",
                    content: docContent.trim()
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Documento adicionado à Base de Conhecimento!");
                setIsAddDocOpen(false);
                setDocTitle("");
                setDocContent("");
                loadData();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Erro ao salvar documento");
        } finally {
            setSavingDoc(false);
        }
    };

    const handleDeleteDoc = async (id: string) => {
        if (!confirm("Remover este documento da base de conhecimento da IA?")) return;
        try {
            const res = await fetch(`/api/ai/${sessionId}/documents/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Documento removido");
                setDocuments(prev => prev.filter(d => d.id !== id));
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const handleSendTestMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isSimulating || !sessionId) return;

        const userMsg = inputMessage.trim();
        setInputMessage("");
        const newHistory: TestMessage[] = [...chatMessages, { role: "user", content: userMsg }];
        setChatMessages(newHistory);
        setIsSimulating(true);

        try {
            const res = await fetch(`/api/ai/${sessionId}/test`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: chatMessages.slice(-6)
                })
            });
            const data = await res.json();
            if (data.status && data.data) {
                setChatMessages([
                    ...newHistory,
                    {
                        role: "assistant",
                        content: data.data.reply,
                        shouldTransfer: data.data.shouldTransfer
                    }
                ]);
            } else {
                setChatMessages([
                    ...newHistory,
                    {
                        role: "assistant",
                        content: `⚠️ Falha ao obter resposta: ${data.message || "Verifique se a chave de API está correta e a IA está ligada."}`
                    }
                ]);
            }
        } catch {
            toast.error("Erro na comunicação com a IA");
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Agente de IA & Base de Conhecimento</h1>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-xs">
                            RAG Powered
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Treine uma inteligência artificial com documentos da sua empresa para atender seus clientes no WhatsApp 24/7.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/60">
                        <span className="text-xs font-semibold">Ativar IA:</span>
                        <Switch checked={enabled} onCheckedChange={setEnabled} />
                        <span className={cn("text-xs font-bold", enabled ? "text-emerald-500" : "text-muted-foreground")}>
                            {enabled ? "LIGADO" : "DESLIGADO"}
                        </span>
                    </div>

                    <Button onClick={handleSaveConfig} disabled={saving} className="gap-1.5 shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        {saving ? "Salvando..." : "Salvar Configurações"}
                    </Button>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="settings" className="space-y-4">
                <TabsList className="bg-card/40 border border-border/70 p-1">
                    <TabsTrigger value="settings" className="gap-2">
                        <Bot className="h-4 w-4" />
                        Configurações do Assistente
                    </TabsTrigger>
                    <TabsTrigger value="knowledge" className="gap-2">
                        <Brain className="h-4 w-4" />
                        Base de Conhecimento ({documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="simulator" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Simulador em Tempo Real
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Configurações Gerais */}
                <TabsContent value="settings" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coluna 1 & 2: Provedor e Prompts */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-card/40 border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Cpu className="h-5 w-5 text-primary" />
                                        Motor de Inteligência Artificial
                                    </CardTitle>
                                    <CardDescription>
                                        Escolha qual provedor de ponta você deseja utilizar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Provedor LLM</Label>
                                            <Select
                                                value={provider}
                                                onValueChange={(v: any) => {
                                                    setProvider(v);
                                                    if (v === "OPENAI") setModel("gpt-4o-mini");
                                                    if (v === "GEMINI") setModel("gemini-1.5-flash");
                                                    if (v === "GROQ") setModel("llama-3.3-70b-versatile");
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="OPENAI">OpenAI (ChatGPT)</SelectItem>
                                                    <SelectItem value="GEMINI">Google Gemini</SelectItem>
                                                    <SelectItem value="GROQ">Groq (Ultra Rápido / Llama 3)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Modelo Escolhido</Label>
                                            <Select value={model} onValueChange={setModel}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provider === "OPENAI" && (
                                                        <>
                                                            <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recomendado - Rápido & Econômico)</SelectItem>
                                                            <SelectItem value="gpt-4o">GPT-4o (Máxima Capacidade de Raciocínio)</SelectItem>
                                                        </>
                                                    )}
                                                    {provider === "GEMINI" && (
                                                        <>
                                                            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Super Rápido)</SelectItem>
                                                            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Contexto Gigante)</SelectItem>
                                                        </>
                                                    )}
                                                    {provider === "GROQ" && (
                                                        <>
                                                            <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B (Velocidade Extrema)</SelectItem>
                                                            <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B Instant</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs flex items-center gap-1.5">
                                                <Key className="h-3.5 w-3.5" />
                                                Chave de API ({provider})
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => setShowKey(!showKey)}
                                                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                                            >
                                                {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                {showKey ? "Ocultar" : "Mostrar"}
                                            </button>
                                        </div>
                                        <Input
                                            type={showKey ? "text" : "password"}
                                            placeholder={`Cole sua chave da API do ${provider}...`}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="font-mono text-xs"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            {provider === "OPENAI" && "Obtenha em platform.openai.com/api-keys"}
                                            {provider === "GEMINI" && "Obtenha em aistudio.google.com"}
                                            {provider === "GROQ" && "Obtenha gratuitamente em console.groq.com/keys"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Persona / System Prompt */}
                            <Card className="bg-card/40 border-border/60">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base">Persona & Tom de Voz</CardTitle>
                                            <CardDescription>
                                                Instruções de como a inteligência artificial deve se comportar.
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {PRESET_PROMPTS.map((preset) => (
                                                <Button
                                                    key={preset.name}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-7 px-2"
                                                    onClick={() => {
                                                        setSystemPrompt(preset.prompt);
                                                        toast.success(`Prompt "${preset.name}" aplicado!`);
                                                    }}
                                                >
                                                    {preset.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        rows={6}
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        placeholder="Ex: Você é a atendente Sofia da empresa XPTO. Seja atenciosa, use emojis moderadamente e..."
                                        className="text-xs leading-relaxed"
                                    />

                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Criatividade (Temperatura): {temperature}</span>
                                            <span className="text-muted-foreground">
                                                {temperature < 0.4 ? "Mais precisa e concisa" : temperature > 0.8 ? "Mais criativa e prolixa" : "Equilibrada (Recomendado)"}
                                            </span>
                                        </div>
                                        <Slider
                                            value={[temperature]}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            onValueChange={(v) => setTemperature(v[0])}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Coluna 3: Regras de Transbordo Humano */}
                        <div className="space-y-6">
                            <Card className="bg-card/40 border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-emerald-500" />
                                        Transbordo para Humano
                                    </CardTitle>
                                    <CardDescription>
                                        Quando transferir a conversa para a equipe de atendentes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Palavras-chave que chamam atendente</Label>
                                        <Input
                                            value={transferKeywords}
                                            onChange={(e) => setTransferKeywords(e.target.value)}
                                            placeholder="humano, atendente, suporte, pessoa"
                                            className="text-xs"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Separadas por vírgula. Se o cliente digitar qualquer um desses termos, a IA cede o lugar para o atendente.
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-muted-foreground space-y-2">
                                        <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Como funciona o transbordo:
                                        </p>
                                        <p>
                                            Quando a transferência é acionada, a IA responde avisando que chamará um humano e a conversa entra automaticamente na fila de atendimento com prioridade alta.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 2: Base de Conhecimento (RAG) */}
                <TabsContent value="knowledge" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold">Documentos da Base de Conhecimento</h2>
                            <p className="text-xs text-muted-foreground">
                                A IA lê esses conteúdos para responder dúvidas sobre preços, produtos, horários e políticas sem inventar.
                            </p>
                        </div>

                        <Button onClick={() => setIsAddDocOpen(true)} className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Adicionar Conhecimento
                        </Button>
                    </div>

                    {documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-xl bg-card/20">
                            <Brain className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
                            <p className="font-semibold text-base">Sua base de conhecimento está vazia</p>
                            <p className="text-xs text-muted-foreground mb-4">Adicione textos, FAQs ou tabelas de preços para a IA aprender.</p>
                            <Button variant="outline" size="sm" onClick={() => setIsAddDocOpen(true)}>
                                Adicionar Primeiro Documento
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documents.map((doc) => (
                                <Card key={doc.id} className="bg-card/40 border-border/70 flex flex-col justify-between">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <Badge variant="secondary" className="text-[10px]">
                                                {doc.category || "Geral"}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-rose-500 hover:bg-rose-500/10"
                                                onClick={() => handleDeleteDoc(doc.id)}
                                                title="Remover documento"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                        <CardTitle className="text-sm font-semibold mt-1">{doc.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed bg-muted/20 p-2.5 rounded-md border border-border/40 whitespace-pre-line font-mono">
                                            {doc.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Tab 3: Simulador de Chat ao Vivo */}
                <TabsContent value="simulator" className="space-y-4">
                    <Card className="bg-card/40 border-border/70 max-w-3xl mx-auto">
                        <CardHeader className="border-b border-border/40 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm">Simulador de Atendimento com IA</CardTitle>
                                        <CardDescription className="text-xs">
                                            Converse como se fosse um cliente para testar se as respostas estão de acordo.
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setChatMessages([{ role: "assistant", content: "Olá! Como posso ajudar você hoje?" }])}
                                    className="text-xs h-7"
                                >
                                    Limpar Conversa
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Messages Scroll Area */}
                            <div className="p-4 space-y-3.5 min-h-[350px] max-h-[450px] overflow-y-auto">
                                {chatMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                                            msg.role === "user"
                                                ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                                                : "mr-auto bg-muted/50 border border-border/60 text-foreground rounded-bl-none"
                                        )}
                                    >
                                        <p className="whitespace-pre-line">{msg.content}</p>
                                        {msg.shouldTransfer && (
                                            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] mt-2 self-start gap-1">
                                                <UserCheck className="h-3 w-3" /> Transbordo Humano Acionado
                                            </Badge>
                                        )}
                                    </div>
                                ))}

                                {isSimulating && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mr-auto bg-muted/40 px-3 py-2 rounded-xl">
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                                        IA formulando resposta com a base de conhecimento...
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendTestMessage} className="p-3 border-t border-border/40 flex gap-2">
                                <Input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Digite uma pergunta que um cliente faria..."
                                    className="text-xs"
                                    disabled={isSimulating}
                                />
                                <Button type="submit" size="sm" disabled={isSimulating || !inputMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal: Adicionar Documento à Base de Conhecimento */}
            <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-400" />
                            Novo Conteúdo para a Base de Conhecimento
                        </DialogTitle>
                        <DialogDescription>
                            Cole informações que a IA deve aprender (ex: Catálogo, Horários, Preços, Políticas).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddDocument} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Título do Documento / FAQ *</Label>
                            <Input
                                placeholder="Ex: Tabela de Preços e Planos 2026, Horário de Funcionamento"
                                value={docTitle}
                                onChange={(e) => setDocTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Categoria</Label>
                            <Input
                                placeholder="Ex: Preços, Suporte, Vendas, Políticas"
                                value={docCategory}
                                onChange={(e) => setDocCategory(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Conteúdo Informativo *</Label>
                            <Textarea
                                rows={8}
                                placeholder="Descreva os fatos detalhados aqui..."
                                value={docContent}
                                onChange={(e) => setDocContent(e.target.value)}
                                required
                                className="text-xs font-mono"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddDocOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={savingDoc}>
                                {savingDoc ? "Salvando..." : "Salvar no Conhecimento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
