"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SessionGuard } from "@/components/dashboard/session-guard";
import { RoleGuard } from "@/components/dashboard/role-guard";
import {
    Mail,
    Send,
    Server,
    CheckCircle2,
    XCircle,
    Clock,
    Plus,
    RefreshCw,
    Users,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmailCampaign {
    id: string;
    title: string;
    subject: string;
    content: string;
    status: "DRAFT" | "SENDING" | "COMPLETED" | "CANCELLED";
    targetCount: number;
    sentCount: number;
    failedCount: number;
    createdAt: string;
}

interface SmtpSettings {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName?: string | null;
}

export default function EmailCampaignsPage() {
    return (
        <RoleGuard allowedRoles={["SUPERADMIN", "OWNER"]}>
            <SessionGuard>
                <EmailCampaignsContent />
            </SessionGuard>
        </RoleGuard>
    );
}

function EmailCampaignsContent() {
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);
    const [contactsWithEmailCount, setContactsWithEmailCount] = useState(0);

    // SMTP settings state
    const [smtp, setSmtp] = useState<SmtpSettings>({
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: "",
        fromEmail: "",
        fromName: ""
    });
    const [showPass, setShowPass] = useState(false);
    const [savingSmtp, setSavingSmtp] = useState(false);
    const [smtpConfigured, setSmtpConfigured] = useState(false);

    // Create Campaign modal
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [recipientMode, setRecipientMode] = useState<"contacts" | "manual">("contacts");
    const [manualEmails, setManualEmails] = useState("");
    const [creatingCampaign, setCreatingCampaign] = useState(false);

    const loadSmtp = useCallback(async () => {
        try {
            const res = await fetch("/api/email/settings");
            const data = await res.json();
            if (data.status && data.data) {
                setSmtp(data.data);
                setSmtpConfigured(true);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const loadCampaigns = useCallback(async () => {
        setLoadingCampaigns(true);
        try {
            const res = await fetch("/api/email/campaigns");
            const data = await res.json();
            if (data.status && data.data) {
                setCampaigns(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCampaigns(false);
        }
    }, []);

    const loadContacts = useCallback(async () => {
        try {
            const res = await fetch("/api/contacts?limit=500");
            const data = await res.json();
            if (data.data) {
                const withEmail = data.data.filter((c: any) => c.email && c.email.includes("@"));
                setContactsWithEmailCount(withEmail.length);
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        loadSmtp();
        loadCampaigns();
        loadContacts();
    }, [loadSmtp, loadCampaigns, loadContacts]);

    const handleSaveSmtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSmtp(true);
        try {
            const res = await fetch("/api/email/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    host: smtp.host.trim(),
                    port: Number(smtp.port),
                    secure: smtp.secure,
                    user: smtp.user.trim(),
                    pass: smtp.pass,
                    fromEmail: smtp.fromEmail.trim(),
                    fromName: smtp.fromName?.trim() || null
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message || "Servidor SMTP validado e salvo!");
                setSmtpConfigured(true);
            } else {
                toast.error(data.message || "Erro ao conectar no servidor SMTP");
            }
        } catch {
            toast.error("Erro ao testar SMTP");
        } finally {
            setSavingSmtp(false);
        }
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !subject.trim() || !content.trim()) {
            toast.warning("Preencha título, assunto e conteúdo");
            return;
        }

        let recipients: Array<{ email: string; name?: string }> = [];

        if (recipientMode === "contacts") {
            try {
                const res = await fetch("/api/contacts?limit=1000");
                const data = await res.json();
                if (data.data) {
                    recipients = data.data
                        .filter((c: any) => c.email && c.email.includes("@"))
                        .map((c: any) => ({
                            email: c.email.trim(),
                            name: c.name || c.notify || ""
                        }));
                }
            } catch {
                toast.error("Erro ao carregar contatos");
                return;
            }
        } else {
            const lines = manualEmails
                .split(/[\n,;]+/)
                .map((e) => e.trim())
                .filter((e) => e && e.includes("@"));

            recipients = lines.map((email) => ({ email }));
        }

        if (recipients.length === 0) {
            toast.warning("Nenhum destinatário válido encontrado");
            return;
        }

        setCreatingCampaign(true);
        try {
            const res = await fetch("/api/email/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    subject: subject.trim(),
                    content: content.trim(),
                    recipients
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Campanha iniciada com sucesso!");
                setIsCreateOpen(false);
                setTitle("");
                setSubject("");
                setContent("");
                setManualEmails("");
                loadCampaigns();
            } else {
                toast.error(data.message || "Erro ao disparar campanha");
            }
        } catch {
            toast.error("Falha ao comunicar com o servidor");
        } finally {
            setCreatingCampaign(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Disparos de E-mail Marketing</h1>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                            SMTP Próprio
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Crie campanhas de e-mail e envie para a sua base de clientes sem limite de envios de terceiros.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadCampaigns}
                        disabled={loadingCampaigns}
                        className="gap-1.5"
                    >
                        <RefreshCw className={cn("h-4 w-4", loadingCampaigns && "animate-spin")} />
                        Atualizar
                    </Button>
                    <Button
                        onClick={() => {
                            if (!smtpConfigured) {
                                toast.warning("Configure seu servidor SMTP antes de criar uma campanha");
                                return;
                            }
                            setIsCreateOpen(true);
                        }}
                        className="gap-1.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Campanha
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="campaigns" className="space-y-4">
                <TabsList className="bg-card/40 border border-border/70 p-1">
                    <TabsTrigger value="campaigns" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Campanhas Enviadas ({campaigns.length})
                    </TabsTrigger>
                    <TabsTrigger value="smtp" className="gap-2">
                        <Server className="h-4 w-4" />
                        Servidor SMTP {smtpConfigured && "✓"}
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Campanhas */}
                <TabsContent value="campaigns" className="space-y-4">
                    {!smtpConfigured && (
                        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-amber-400 text-xs">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>Você ainda não configurou seu servidor de envio SMTP. Vá para a aba "Servidor SMTP" para cadastrar.</span>
                            </div>
                        </div>
                    )}

                    {loadingCampaigns ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
                            <p className="text-xs">Carregando campanhas...</p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-card/20">
                            <Mail className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
                            <p className="font-semibold text-base">Nenhuma campanha de e-mail criada</p>
                            <p className="text-xs text-muted-foreground mb-4">Envie promoções, avisos e newsletters para seus leads.</p>
                            <Button size="sm" onClick={() => setIsCreateOpen(true)} disabled={!smtpConfigured}>
                                Criar Primeira Campanha
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campaigns.map((c) => (
                                <Card key={c.id} className="bg-card/40 border-border/70 flex flex-col justify-between">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] uppercase font-semibold",
                                                    c.status === "COMPLETED" && "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                                                    c.status === "SENDING" && "border-blue-500/30 text-blue-400 bg-blue-500/10 animate-pulse",
                                                    c.status === "DRAFT" && "border-slate-500/30 text-slate-400"
                                                )}
                                            >
                                                {c.status === "COMPLETED" && "Concluída"}
                                                {c.status === "SENDING" && "Disparando..."}
                                                {c.status === "DRAFT" && "Rascunho"}
                                            </Badge>
                                            <span className="text-[11px] text-muted-foreground">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base font-bold mt-2">{c.title}</CardTitle>
                                        <CardDescription className="text-xs line-clamp-1">
                                            Assunto: "{c.subject}"
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/40 text-center">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground">Total</p>
                                                <p className="text-sm font-bold">{c.targetCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-emerald-400">Enviados</p>
                                                <p className="text-sm font-bold text-emerald-500">{c.sentCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-rose-400">Falhas</p>
                                                <p className="text-sm font-bold text-rose-500">{c.failedCount}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Tab 2: Configuração SMTP */}
                <TabsContent value="smtp" className="space-y-4">
                    <Card className="bg-card/40 border-border/70 max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                Configurações do Servidor de Envio (SMTP)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Utilize seu servidor de e-mail corporativo, Google Workspace/Gmail, Hostgator, cPanel, Resend ou SendGrid.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveSmtp} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <Label className="text-xs">Servidor SMTP (Host) *</Label>
                                        <Input
                                            placeholder="smtp.gmail.com ou mail.seusite.com"
                                            value={smtp.host}
                                            onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                                            required
                                            className="text-xs font-mono"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Porta *</Label>
                                        <Input
                                            type="number"
                                            value={smtp.port}
                                            onChange={(e) => setSmtp({ ...smtp, port: Number(e.target.value) })}
                                            placeholder="587 ou 465"
                                            required
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Usuário SMTP *</Label>
                                        <Input
                                            placeholder="contato@seusite.com"
                                            value={smtp.user}
                                            onChange={(e) => setSmtp({ ...smtp, user: e.target.value })}
                                            required
                                            className="text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs">Senha SMTP *</Label>
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="text-[10px] text-muted-foreground flex items-center gap-1"
                                            >
                                                {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                {showPass ? "Ocultar" : "Mostrar"}
                                            </button>
                                        </div>
                                        <Input
                                            type={showPass ? "text" : "password"}
                                            placeholder="Sua senha ou App Password"
                                            value={smtp.pass}
                                            onChange={(e) => setSmtp({ ...smtp, pass: e.target.value })}
                                            required
                                            className="text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">E-mail Remetente (From) *</Label>
                                        <Input
                                            type="email"
                                            placeholder="contato@seusite.com"
                                            value={smtp.fromEmail}
                                            onChange={(e) => setSmtp({ ...smtp, fromEmail: e.target.value })}
                                            required
                                            className="text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Nome de Exibição do Remetente</Label>
                                        <Input
                                            placeholder="Ex: Equipe Confy"
                                            value={smtp.fromName || ""}
                                            onChange={(e) => setSmtp({ ...smtp, fromName: e.target.value })}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-semibold">Usar SSL Seguro (Porta 465)</Label>
                                        <p className="text-[11px] text-muted-foreground">Marque se sua porta for 465 com SSL direto.</p>
                                    </div>
                                    <Switch
                                        checked={smtp.secure}
                                        onCheckedChange={(checked) => setSmtp({ ...smtp, secure: checked })}
                                    />
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <Button type="submit" disabled={savingSmtp} className="gap-1.5">
                                        <Sparkles className="h-4 w-4" />
                                        {savingSmtp ? "Testando Conexão..." : "Testar e Salvar SMTP"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal: Criar Campanha de E-mail */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-primary" />
                            Criar Nova Campanha de E-mail
                        </DialogTitle>
                        <DialogDescription>
                            Configure o conteúdo e selecione os destinatários para o envio.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCampaign} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Identificador da Campanha *</Label>
                            <Input
                                placeholder="Ex: Black Friday 2026, Lançamento do Produto"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Assunto do E-mail *</Label>
                            <Input
                                placeholder="Ex: {nome}, temos uma novidade especial para você!"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="text-xs"
                            />
                        </div>

                        {/* Recipient Source */}
                        <div className="space-y-2">
                            <Label className="text-xs">Público-Alvo dos Destinatários</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={recipientMode === "contacts" ? "default" : "outline"}
                                    onClick={() => setRecipientMode("contacts")}
                                    className="text-xs justify-start h-9"
                                >
                                    <Users className="h-3.5 w-3.5 mr-1.5" />
                                    Contatos ({contactsWithEmailCount} com e-mail)
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={recipientMode === "manual" ? "default" : "outline"}
                                    onClick={() => setRecipientMode("manual")}
                                    className="text-xs justify-start h-9"
                                >
                                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                                    Lista Manual / Colar
                                </Button>
                            </div>
                        </div>

                        {recipientMode === "manual" && (
                            <div className="space-y-1.5">
                                <Label className="text-xs">Cole os e-mails (um por linha ou separados por vírgula):</Label>
                                <Textarea
                                    rows={3}
                                    placeholder="joao@gmail.com&#10;maria@empresa.com"
                                    value={manualEmails}
                                    onChange={(e) => setManualEmails(e.target.value)}
                                    className="text-xs font-mono"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Mensagem (HTML ou Texto)</Label>
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[10px] px-1.5"
                                        onClick={() => setContent((c) => c + " {nome}")}
                                    >
                                        + Inserir {"{nome}"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[10px] px-1.5"
                                        onClick={() => setContent((c) => c + " {email}")}
                                    >
                                        + Inserir {"{email}"}
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                rows={6}
                                placeholder="Olá {nome},&#10;&#10;Escrevemos para apresentar nossa nova solução..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="text-xs font-mono"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={creatingCampaign}>
                                {creatingCampaign ? "Disparando..." : "Disparar Campanha"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
