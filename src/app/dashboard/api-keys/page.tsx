"use client";

import { useState, useEffect } from "react";
import {
    Key,
    Plus,
    Copy,
    Check,
    Eye,
    EyeOff,
    Trash2,
    Shield,
    ExternalLink,
    Code2,
    Terminal,
    Clock,
    AlertCircle,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ApiKeyItem {
    id: string;
    name: string;
    key: string;
    userId: string;
    isActive: boolean;
    lastUsedAt?: string | null;
    createdAt: string;
    user?: {
        name?: string | null;
        companyName?: string | null;
        email?: string;
    };
}

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [keyName, setKeyName] = useState("");
    const [deletingKey, setDeletingKey] = useState<ApiKeyItem | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<"curl" | "js" | "python" | "php">("curl");

    const fetchKeys = async () => {
        try {
            const res = await fetch("/api/admin/api-keys");
            if (res.ok) {
                const json = await res.json();
                setApiKeys(json.data || []);
            } else {
                toast.error("Falha ao buscar chaves de API");
            }
        } catch (error) {
            console.error("Fetch API keys error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyName.trim()) {
            toast.error("Informe um nome para a chave de API");
            return;
        }

        try {
            const res = await fetch("/api/admin/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: keyName.trim() }),
            });

            const json = await res.json();
            if (res.ok) {
                toast.success("Chave de API gerada com sucesso!");
                setCreatedKey(json.data?.key);
                setKeyName("");
                fetchKeys();
            } else {
                toast.error(json.message || "Falha ao gerar chave");
            }
        } catch {
            toast.error("Erro ao gerar chave de API");
        }
    };

    const handleDeleteKey = async () => {
        if (!deletingKey) return;

        try {
            const res = await fetch(`/api/admin/api-keys?id=${deletingKey.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Chave de API revogada com sucesso!");
                setApiKeys((prev) => prev.filter((k) => k.id !== deletingKey.id));
                setDeletingKey(null);
            } else {
                toast.error("Falha ao revogar chave");
            }
        } catch {
            toast.error("Erro ao revogar chave");
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Chave copiada para a área de transferência!");
        setTimeout(() => setCopiedId(null), 2500);
    };

    const toggleReveal = (id: string) => {
        setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const sampleKey = apiKeys[0]?.key || "wag_live_sample_token_123456789";

    const codeExamples = {
        curl: `# Enviar mensagem de texto via WhatsApp
curl -X POST "https://seu-dominio.com/api/chat/send" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${sampleKey}" \\
  -d '{
    "sessionId": "sua-sessao-id",
    "jid": "5511999999999@s.whatsapp.net",
    "message": "Olá! Sua compra foi confirmada com sucesso."
  }'`,
        js: `// Envio via Node.js / JavaScript Fetch
const response = await fetch("https://seu-dominio.com/api/chat/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${sampleKey}"
  },
  body: JSON.stringify({
    sessionId: "sua-sessao-id",
    jid: "5511999999999@s.whatsapp.net",
    message: "Olá! Sua compra foi confirmada com sucesso."
  })
});

const data = await response.json();
console.log(data);`,
        python: `# Envio via Python Requests
import requests

url = "https://seu-dominio.com/api/chat/send"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "${sampleKey}"
}
payload = {
    "sessionId": "sua-sessao-id",
    "jid": "5511999999999@s.whatsapp.net",
    "message": "Olá! Sua compra foi confirmada com sucesso."
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
        php: `<?php
// Envio via PHP cURL
$ch = curl_init("https://seu-dominio.com/api/chat/send");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-api-key: ${sampleKey}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "sessionId" => "sua-sessao-id",
    "jid" => "5511999999999@s.whatsapp.net",
    "message" => "Olá! Sua compra foi confirmada com sucesso."
]));

$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
                            Super Administrador
                        </Badge>
                        <span className="text-xs text-muted-foreground">· Integrações Globais</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                        <Key className="h-7 w-7 text-amber-500" /> Geração de Chaves de API
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Crie tokens de acesso REST para conectar a plataforma a sistemas externos, SaaS, checkout de pagamento ou ERPs.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Link href="/dashboard/api-docs">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Code2 className="h-3.5 w-3.5" /> Documentação Completa (Swagger)
                        </Button>
                    </Link>
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5">
                        <Plus className="h-4 w-4" /> Nova Chave de API
                    </Button>
                </div>
            </div>

            {/* Info Notice */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-semibold">Segurança das Chaves Master</p>
                    <p className="text-muted-foreground dark:text-amber-200/80">
                        As chaves de API do Superadmin possuem privilégios totais na plataforma e devem ser mantidas em segredo. Use o header <code>x-api-key: SUA_CHAVE</code> em todas as requisições HTTP REST.
                    </p>
                </div>
            </div>

            {/* API Keys List */}
            <Card className="glass-panel border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" /> Chaves de API Ativas ({apiKeys.length})
                        </CardTitle>
                        <CardDescription>
                            Chaves de integração geradas para chamadas aos endpoints
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={fetchKeys} className="gap-1 text-xs">
                        <RefreshCw className="h-3.5 w-3.5" /> Atualizar
                    </Button>
                </CardHeader>
                <CardContent className="pt-0">
                    {loading ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                            Carregando chaves de API...
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            <Key className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            Nenhuma chave de API gerada até o momento.
                            <div className="mt-3">
                                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                                    Gerar Primeira Chave
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/40">
                            {apiKeys.map((k) => {
                                const isRevealed = revealedIds[k.id] ?? false;
                                const isCopied = copiedId === k.id;

                                return (
                                    <div key={k.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-foreground">{k.name}</span>
                                                <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                                                    Ativa
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono bg-surface-2 px-2.5 py-1 rounded border border-border/50 text-foreground">
                                                    {isRevealed
                                                        ? k.key
                                                        : `${k.key.substring(0, 8)}••••••••••••••••••••••••`}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                    onClick={() => toggleReveal(k.id)}
                                                    title={isRevealed ? "Ocultar" : "Mostrar chave"}
                                                >
                                                    {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                    onClick={() => copyToClipboard(k.key, k.id)}
                                                    title="Copiar chave"
                                                >
                                                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                <span>
                                                    Criada em {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                                                </span>
                                                {k.lastUsedAt && (
                                                    <span>
                                                        · Último uso: {formatDistanceToNow(new Date(k.lastUsedAt), { addSuffix: true, locale: ptBR })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeletingKey(k)}
                                                className="text-xs text-destructive hover:bg-destructive/10 gap-1.5 h-8"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Revogar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Integration Code Samples */}
            <Card className="glass-panel border-border/60">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-primary" /> Exemplos de Uso da API
                            </CardTitle>
                            <CardDescription>
                                Como integrar e enviar mensagens através de código em sua aplicação externa
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border/40 text-xs">
                            {(["curl", "js", "python", "php"] as const).map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`px-2.5 py-1 rounded font-mono uppercase text-[11px] transition-colors ${
                                        selectedLanguage === lang
                                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="relative">
                        <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-border/40 styled-scrollbar">
                            {codeExamples[selectedLanguage]}
                        </pre>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => copyToClipboard(codeExamples[selectedLanguage], "sample-code")}
                            className="absolute top-2.5 right-2.5 text-xs gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                        >
                            <Copy className="h-3 w-3" /> Copiar Código
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Create API Key Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-amber-500" /> Nova Chave de API
                        </DialogTitle>
                        <DialogDescription>
                            Dê um nome para identificar a integração externa (ex: Kiwify, Asaas, ERP Bling, Checkout).
                        </DialogDescription>
                    </DialogHeader>

                    {createdKey ? (
                        <div className="space-y-4 py-2">
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-2">
                                <p className="font-semibold text-xs flex items-center gap-1.5">
                                    <Check className="h-4 w-4 text-emerald-500" /> Chave gerada com sucesso!
                                </p>
                                <p className="text-[11px] text-muted-foreground dark:text-emerald-200/80">
                                    Copie o token agora e guarde em local seguro:
                                </p>
                                <div className="flex items-center gap-2">
                                    <Input
                                        readOnly
                                        value={createdKey}
                                        className="font-mono text-xs bg-surface-2"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => copyToClipboard(createdKey, "modal-copy")}
                                        className="shrink-0 gap-1"
                                    >
                                        <Copy className="h-3.5 w-3.5" /> Copiar
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={() => {
                                        setCreatedKey(null);
                                        setIsCreateOpen(false);
                                    }}
                                >
                                    Concluir
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateKey} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Identificador da Integração / Nome *</Label>
                                <Input
                                    required
                                    placeholder="Ex: Webhook Checkout Kiwify"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Gerar Chave</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Revoke Confirmation Alert */}
            <AlertDialog open={!!deletingKey} onOpenChange={(open) => !open && setDeletingKey(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" /> Revogar Chave de API
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza de que deseja revogar a chave{" "}
                            <strong>{deletingKey?.name}</strong>?
                            Qualquer sistema externo que utilize esta chave perderá o acesso imediatamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingKey(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteKey} className="bg-destructive hover:bg-destructive/90">
                            Sim, Revogar Chave
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
