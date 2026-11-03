"use client";

import { useState, useEffect } from "react";
import {
    Sparkles,
    Save,
    MessageSquareHeart,
    CreditCard,
    Bot,
    Copy,
    Check,
    Loader2,
    Zap,
    QrCode
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminFunilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copiedWebhook, setCopiedWebhook] = useState(false);

    const [config, setConfig] = useState({
        enabled: true,
        sessionId: "",
        planName: "Acesso VIP Completo — Segredos do Coração",
        planPrice: 19.9,
        siteUrl: "",
        mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
        mangofyApiKey: "",
        mangofyStoreCode: "",
        mangofyWebhookSecret: "",
        step1Greeting: "",
        step1MediaUrl: "",
        step1MediaType: "none",
        step2OfferMessage: "",
        pixTriggerKeywords: "",
        pixGeneratedMessage: "",
        paymentApprovedMessage: "",
        useAiSaleswoman: true,
        aiProvider: "GROQ",
        aiApiKey: "",
        aiModel: "llama-3.3-70b-versatile",
        aiSystemPrompt: ""
    });

    useEffect(() => {
        async function loadConfig() {
            try {
                const res = await fetch("/api/funnel/config");
                const data = await res.json();
                if (data?.config) {
                    setConfig({
                        ...data.config,
                        sessionId: data.config.sessionId || "",
                        mangofyApiKey: data.config.mangofyApiKey || "",
                        mangofyStoreCode: data.config.mangofyStoreCode || "",
                        mangofyWebhookSecret: data.config.mangofyWebhookSecret || "",
                        step1MediaUrl: data.config.step1MediaUrl || "",
                        aiApiKey: data.config.aiApiKey || "",
                        siteUrl:
                            data.config.siteUrl ||
                            (typeof window !== "undefined" ? window.location.origin : "")
                    });
                }
            } catch {
                toast.error("Erro ao carregar configurações do funil");
            } finally {
                setLoading(false);
            }
        }
        loadConfig();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/funnel/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            if (!res.ok) throw new Error("Falha ao salvar");
            toast.success("Configurações do Funil X1 + Mangofy salvas com sucesso!");
        } catch {
            toast.error("Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    const webhookUrl = `${(config.siteUrl || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/, "")}/api/webhooks/mangofy`;

    const copyWebhook = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopiedWebhook(true);
        toast.success("URL do Webhook copiada!");
        setTimeout(() => setCopiedWebhook(false), 3000);
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2.5">
                        <Zap className="w-6 h-6 text-rose-500" />
                        Funil X1 WhatsApp + Gateway Mangofy + IA
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure o atendimento automático para os leads que chegam do anúncio de 3 minutos da novela.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/dashboard/sessions"
                        className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold flex items-center gap-1.5"
                    >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        Conectar WhatsApp
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar Tudo
                    </button>
                </div>
            </div>

            {/* Bloco 1: Status do Funil e Oferta */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-rose-500" />
                        <div>
                            <h2 className="font-bold text-base">Oferta Principal & Status do Funil</h2>
                            <p className="text-xs text-muted-foreground">
                                Quando ativo, seu WhatsApp conectado responde automaticamente os leads que chegam dos anúncios.
                            </p>
                        </div>
                    </div>

                    <label className="inline-flex items-center gap-2 cursor-pointer px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                        <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-xs font-bold text-rose-400">
                            {config.enabled ? "Funil X1 Ativo" : "Funil Pausado"}
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">Nome do Produto / Acesso</label>
                        <input
                            type="text"
                            value={config.planName}
                            onChange={(e) => setConfig({ ...config, planName: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Valor do Pix (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={config.planPrice}
                            onChange={(e) => setConfig({ ...config, planPrice: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-bold text-emerald-400"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">
                            URL Pública do Site (para o link de entrega)
                        </label>
                        <input
                            type="text"
                            placeholder="https://seudominio.com"
                            value={config.siteUrl}
                            onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Bloco 2: Integração Mangofy Gateway */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-2.5 border-b border-border pb-3">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                        <h2 className="font-bold text-base">Gateway de Pagamento Pix — Mangofy</h2>
                        <p className="text-xs text-muted-foreground">
                            Gera o Pix Copia e Cola na conversa do WhatsApp (e no site) e libera o acesso sozinho quando pago.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">URL da API Mangofy</label>
                        <input
                            type="text"
                            value={config.mangofyApiUrl}
                            onChange={(e) => setConfig({ ...config, mangofyApiUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Chave da API Mangofy (Authorization Token)
                        </label>
                        <input
                            type="password"
                            placeholder="Cole aqui sua API Key da Mangofy"
                            value={config.mangofyApiKey}
                            onChange={(e) => setConfig({ ...config, mangofyApiKey: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Store Code / Código da Loja (se houver)
                        </label>
                        <input
                            type="text"
                            placeholder="Código da loja na Mangofy"
                            value={config.mangofyStoreCode}
                            onChange={(e) => setConfig({ ...config, mangofyStoreCode: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                        />
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-bold text-emerald-300">
                            URL de Postback / Webhook para cadastrar na Mangofy:
                        </div>
                        <div className="text-xs font-mono text-muted-foreground break-all mt-0.5">
                            {webhookUrl}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={copyWebhook}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                    >
                        {copiedWebhook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedWebhook ? "Copiado!" : "Copiar Webhook"}
                    </button>
                </div>
            </div>

            {/* Bloco 3: Etapas do Funil X1 no WhatsApp */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border pb-3">
                    <MessageSquareHeart className="w-5 h-5 text-rose-500" />
                    <div>
                        <h2 className="font-bold text-base">Passos Automáticos do Funil X1 no WhatsApp</h2>
                        <p className="text-xs text-muted-foreground">
                            Variáveis disponíveis nas mensagens: <code>{"{{VALOR}}"}</code>, <code>{"{{NOME}}"}</code>, <code>{"{{TELEFONE}}"}</code>, <code>{"{{PIX_COPIA_E_COLA}}"}</code>, <code>{"{{LINK_ACESSO}}"}</code>
                        </p>
                    </div>
                </div>

                {/* Passo 1 */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider">
                        Passo 1 — Boas-vindas imediata (Quando o lead chega do anúncio de 3 min)
                    </label>
                    <textarea
                        rows={4}
                        value={config.step1Greeting}
                        onChange={(e) => setConfig({ ...config, step1Greeting: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Enviar Mídia junto no Passo 1? (Ex: Parte 2 ou Áudio)
                            </label>
                            <select
                                value={config.step1MediaType}
                                onChange={(e) => setConfig({ ...config, step1MediaType: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                            >
                                <option value="none">Apenas Texto (Sem mídia)</option>
                                <option value="video">Vídeo Curto (Parte 2 de Degustação)</option>
                                <option value="audio">Áudio Gravado (Enviado como voz na hora)</option>
                                <option value="image">Imagem / Capa da Novela</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium mb-1">
                                URL Direta da Mídia (.mp4, .mp3, .ogg ou .jpg)
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={config.step1MediaUrl}
                                onChange={(e) => setConfig({ ...config, step1MediaUrl: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Passo 2 */}
                <div className="space-y-2 pt-2 border-t border-border">
                    <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider">
                        Passo 2 — Oferta do Acesso VIP (Enviada 2 segundos após o Passo 1)
                    </label>
                    <textarea
                        rows={4}
                        value={config.step2OfferMessage}
                        onChange={(e) => setConfig({ ...config, step2OfferMessage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />
                </div>

                {/* Passo 3: Geração do Pix */}
                <div className="space-y-3 pt-2 border-t border-border">
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Passo 3 — Geração Automática do Pix Copia e Cola
                    </label>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                            Palavras-chave que disparam a geração do Pix quando o cliente responde (separadas por vírgula):
                        </label>
                        <input
                            type="text"
                            value={config.pixTriggerKeywords}
                            onChange={(e) => setConfig({ ...config, pixTriggerKeywords: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                            Mensagem enviada junto com o código Pix:
                        </label>
                        <textarea
                            rows={4}
                            value={config.pixGeneratedMessage}
                            onChange={(e) => setConfig({ ...config, pixGeneratedMessage: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                        />
                    </div>
                </div>

                {/* Passo 4: Entrega Automática */}
                <div className="space-y-2 pt-2 border-t border-border">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Passo 4 — Entrega Automática após Pagamento Aprovado (Webhook Mangofy)
                    </label>
                    <textarea
                        rows={4}
                        value={config.paymentApprovedMessage}
                        onChange={(e) => setConfig({ ...config, paymentApprovedMessage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />
                </div>
            </div>

            {/* Bloco 4: IA Vendedora de Novelas (Sofia) */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2.5">
                        <Bot className="w-5 h-5 text-purple-400" />
                        <div>
                            <h2 className="font-bold text-base">
                                IA Vendedora &ldquo;Sofia&rdquo; (Quebra de Objeções no X1)
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Se a cliente fizer qualquer pergunta no WhatsApp antes de pagar, a IA responde como uma amiga e conduz para o Pix.
                            </p>
                        </div>
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.useAiSaleswoman}
                            onChange={(e) => setConfig({ ...config, useAiSaleswoman: e.target.checked })}
                        />
                        <span>Usar IA no Funil</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">Provedor de IA</label>
                        <select
                            value={config.aiProvider}
                            onChange={(e) => setConfig({ ...config, aiProvider: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs"
                        >
                            <option value="GROQ">Groq (Llama 3.3 — Ultra Rápido e Gratuito)</option>
                            <option value="OPENAI">OpenAI (GPT-4o-mini)</option>
                            <option value="GEMINI">Google Gemini Flash</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Modelo</label>
                        <input
                            type="text"
                            value={config.aiModel}
                            onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">API Key da IA</label>
                        <input
                            type="password"
                            placeholder="gsk_... ou sk-..."
                            value={config.aiApiKey}
                            onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium mb-1">
                        Personalidade e Instruções da IA Vendedora
                    </label>
                    <textarea
                        rows={4}
                        value={config.aiSystemPrompt}
                        onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />
                </div>
            </div>
        </form>
    );
}

