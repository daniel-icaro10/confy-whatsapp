"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { DEFAULT_OFFER_PLANS, OfferPlan } from "@/lib/segredos-defaults";

interface WaSessionOption {
    id: string;
    name: string;
    sessionId: string;
    status: string;
}

export default function AdminFunilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copiedWebhook, setCopiedWebhook] = useState(false);
    const [copiedStripeWebhook, setCopiedStripeWebhook] = useState(false);
    const [sessions, setSessions] = useState<WaSessionOption[]>([]);
    const [plans, setPlans] = useState<OfferPlan[]>(DEFAULT_OFFER_PLANS);

    const [config, setConfig] = useState({
        enabled: false,
        sessionId: "",
        planName: "Plano Mensal — TvDrama Reels",
        planPrice: 9.9,
        siteUrl: "",
        mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
        mangofyApiKey: "",
        mangofyStoreCode: "",
        mangofyWebhookSecret: "",
        stripeSecretKey: "",
        stripePublishableKey: "",
        stripeWebhookSecret: "",
        step1Greeting: "",
        step1MediaUrl: "",
        step1MediaType: "none",
        step2OfferMessage: "",
        pixTriggerKeywords: "",
        pixGeneratedMessage: "",
        paymentApprovedMessage: "",
        useAiSaleswoman: false,
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
                if (Array.isArray(data?.sessions)) {
                    setSessions(data.sessions);
                }
                if (Array.isArray(data?.plans) && data.plans.length > 0) {
                    setPlans(data.plans);
                }
                if (data?.config) {
                    setConfig({
                        ...data.config,
                        sessionId: data.config.sessionId || "",
                        mangofyApiKey: data.config.mangofyApiKey || "",
                        mangofyStoreCode: data.config.mangofyStoreCode || "",
                        mangofyWebhookSecret: data.config.mangofyWebhookSecret || "",
                        stripeSecretKey: data.config.stripeSecretKey || "",
                        stripePublishableKey: data.config.stripePublishableKey || "",
                        stripeWebhookSecret: data.config.stripeWebhookSecret || "",
                        step1MediaUrl: data.config.step1MediaUrl || "",
                        aiApiKey: data.config.aiApiKey || "",
                        siteUrl:
                            data.config.siteUrl ||
                            (typeof window !== "undefined" ? window.location.origin : "")
                    });
                }
            } catch {
                toast.error("Erro ao carregar configurações");
            } finally {
                setLoading(false);
            }
        }
        loadConfig();
    }, []);

    const updatePlanField = (
        key: OfferPlan["key"],
        field: keyof OfferPlan,
        value: string | number
    ) => {
        setPlans((prev) =>
            prev.map((p) => (p.key === key ? { ...p, [field]: value } : p))
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (config.enabled && !config.sessionId.trim()) {
            toast.error(
                "Selecione qual sessão do WhatsApp será usada exclusivamente pelo TvDrama Reels antes de ativar o funil."
            );
            return;
        }
        setSaving(true);
        try {
            const monthly = plans.find((p) => p.key === "monthly") || plans[0];
            const res = await fetch("/api/funnel/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...config,
                    planPrice: monthly?.price ?? config.planPrice,
                    plansJson: plans
                })
            });
            if (!res.ok) throw new Error("Falha ao salvar");
            toast.success("Configurações salvas");
        } catch {
            toast.error("Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    const baseOrigin = (
        config.siteUrl || (typeof window !== "undefined" ? window.location.origin : "")
    ).replace(/\/+$/, "");

    const webhookUrl = `${baseOrigin}/api/webhooks/mangofy`;
    const stripeWebhookUrl = `${baseOrigin}/api/webhooks/stripe`;

    const copyWebhook = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopiedWebhook(true);
        toast.success("URL Mangofy copiada");
        setTimeout(() => setCopiedWebhook(false), 3000);
    };

    const copyStripeWebhook = () => {
        navigator.clipboard.writeText(stripeWebhookUrl);
        setCopiedStripeWebhook(true);
        toast.success("URL Stripe copiada");
        setTimeout(() => setCopiedStripeWebhook(false), 3000);
    };

    if (loading) {
        return (
            <div className="p-8 text-xs text-neutral-400">
                Carregando...
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Funil, Planos e Pagamentos
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                        Configuração exclusiva do WhatsApp TvDrama Reels, planos promocionais, Pix Mangofy e assinatura recorrente Stripe.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/sessions"
                        className="px-3.5 py-2 rounded border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-neutral-200"
                    >
                        Conexões WhatsApp
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium transition"
                    >
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </div>

            {/* Sessão exclusiva & URL */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                        <h2 className="font-medium text-sm text-white">Sessão exclusiva do WhatsApp</h2>
                        <p className="text-xs text-neutral-500">
                            O atendimento do TvDrama Reels funcionará apenas na sessão selecionada abaixo, sem interferir nas sessões de outros projetos.
                        </p>
                    </div>

                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                        <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                        />
                        <span>Funil ativo</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                            Sessão do Baileys exclusiva do TvDrama Reels
                        </label>
                        <select
                            value={config.sessionId}
                            onChange={(e) => setConfig({ ...config, sessionId: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                        >
                            <option value="">— Selecione uma sessão específica —</option>
                            {sessions.map((s) => (
                                <option key={s.id} value={s.sessionId}>
                                    {s.name} ({s.sessionId}) — {s.status === "CONNECTED" ? "Conectada" : s.status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                            URL pública do site
                        </label>
                        <input
                            type="text"
                            placeholder="http://142.93.123.185:3000"
                            value={config.siteUrl}
                            onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Planos e Ofertas Promocionais */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">
                        Planos promocionais (Mensal, Anual e Trimestral)
                    </h2>
                    <p className="text-xs text-neutral-500">
                        Configure o preço De/Por, selo de desconto, Price ID da Stripe (opcional) ou link de checkout externo por plano.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.key}
                            className="p-4 rounded border border-neutral-800 bg-[#0a0a0a] space-y-3"
                        >
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                                <span className="text-xs font-semibold text-white">
                                    {plan.name}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    {plan.durationDays} dias
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[11px] text-neutral-400 mb-1">
                                        De (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={plan.originalPrice}
                                        onChange={(e) =>
                                            updatePlanField(plan.key, "originalPrice", Number(e.target.value))
                                        }
                                        className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-neutral-400 mb-1">
                                        Por (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={plan.price}
                                        onChange={(e) =>
                                            updatePlanField(plan.key, "price", Number(e.target.value))
                                        }
                                        className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] text-neutral-400 mb-1">
                                    Selo de economia
                                </label>
                                <input
                                    type="text"
                                    value={plan.badge}
                                    onChange={(e) => updatePlanField(plan.key, "badge", e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-neutral-400 mb-1">
                                    Stripe Price ID (opcional, ex: price_123...)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Cria automático se vazio"
                                    value={plan.stripePriceId || ""}
                                    onChange={(e) =>
                                        updatePlanField(plan.key, "stripePriceId", e.target.value)
                                    }
                                    className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs font-mono text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-neutral-400 mb-1">
                                    Link externo de checkout (opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={plan.externalCheckoutUrl || ""}
                                    onChange={(e) =>
                                        updatePlanField(plan.key, "externalCheckoutUrl", e.target.value)
                                    }
                                    className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stripe (Assinatura Recorrente / Cartão) */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">
                        Integração Stripe (Plano Recorrente no Cartão)
                    </h2>
                    <p className="text-xs text-neutral-500">
                        Cria sessões de assinatura recorrente na Stripe e libera o telefone do assinante automaticamente via Webhook.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Secret Key (sk_live_... ou sk_test_...)
                        </label>
                        <input
                            type="password"
                            value={config.stripeSecretKey}
                            onChange={(e) => setConfig({ ...config, stripeSecretKey: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Publishable Key (pk_live_...)
                        </label>
                        <input
                            type="text"
                            value={config.stripePublishableKey}
                            onChange={(e) => setConfig({ ...config, stripePublishableKey: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Webhook Signing Secret (whsec_...)
                        </label>
                        <input
                            type="password"
                            value={config.stripeWebhookSecret}
                            onChange={(e) => setConfig({ ...config, stripeWebhookSecret: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                </div>

                <div className="p-3 rounded bg-[#0a0a0a] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="text-xs text-neutral-400">
                            URL de Webhook da Stripe (evento <code>checkout.session.completed</code>):
                        </div>
                        <div className="text-xs font-mono text-white break-all mt-0.5">
                            {stripeWebhookUrl}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={copyStripeWebhook}
                        className="px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 shrink-0"
                    >
                        {copiedStripeWebhook ? "Copiado" : "Copiar URL Stripe"}
                    </button>
                </div>
            </div>

            {/* Mangofy (Pix) */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">Integração Mangofy (Pix Imediato)</h2>
                    <p className="text-xs text-neutral-500">
                        Credenciais para geração de Pix Copia e Cola no site e no funil do WhatsApp.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">URL da API</label>
                        <input
                            type="text"
                            value={config.mangofyApiUrl}
                            onChange={(e) => setConfig({ ...config, mangofyApiUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Chave da API (Token)
                        </label>
                        <input
                            type="password"
                            value={config.mangofyApiKey}
                            onChange={(e) => setConfig({ ...config, mangofyApiKey: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Código da loja (Store Code)
                        </label>
                        <input
                            type="text"
                            value={config.mangofyStoreCode}
                            onChange={(e) => setConfig({ ...config, mangofyStoreCode: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                </div>

                <div className="p-3 rounded bg-[#0a0a0a] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="text-xs text-neutral-400">
                            URL de postback / webhook Mangofy:
                        </div>
                        <div className="text-xs font-mono text-white break-all mt-0.5">
                            {webhookUrl}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={copyWebhook}
                        className="px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 shrink-0"
                    >
                        {copiedWebhook ? "Copiado" : "Copiar URL Mangofy"}
                    </button>
                </div>
            </div>

            {/* Mensagens do Funil */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-5">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">Mensagens do funil (WhatsApp)</h2>
                    <p className="text-xs text-neutral-500">
                        Variáveis aceitas: <code>{"{{VALOR}}"}</code>, <code>{"{{NOME}}"}</code>, <code>{"{{TELEFONE}}"}</code>, <code>{"{{PIX_COPIA_E_COLA}}"}</code>, <code>{"{{LINK_ACESSO}}"}</code>
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-medium text-neutral-300">
                        1. Mensagem inicial (primeiro contato)
                    </label>
                    <textarea
                        rows={3}
                        value={config.step1Greeting}
                        onChange={(e) => setConfig({ ...config, step1Greeting: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-neutral-400 mb-1">
                                Tipo de mídia complementar
                            </label>
                            <select
                                value={config.step1MediaType}
                                onChange={(e) => setConfig({ ...config, step1MediaType: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs text-white"
                            >
                                <option value="none">Sem mídia</option>
                                <option value="video">Vídeo</option>
                                <option value="audio">Áudio</option>
                                <option value="image">Imagem</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs text-neutral-400 mb-1">
                                URL do arquivo de mídia
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={config.step1MediaUrl}
                                onChange={(e) => setConfig({ ...config, step1MediaUrl: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-800">
                    <label className="block text-xs font-medium text-neutral-300">
                        2. Mensagem de oferta
                    </label>
                    <textarea
                        rows={3}
                        value={config.step2OfferMessage}
                        onChange={(e) => setConfig({ ...config, step2OfferMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-800">
                    <label className="block text-xs font-medium text-neutral-300">
                        3. Geração do Pix
                    </label>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Palavras que acionam o envio do Pix (separadas por vírgula)
                        </label>
                        <input
                            type="text"
                            value={config.pixTriggerKeywords}
                            onChange={(e) => setConfig({ ...config, pixTriggerKeywords: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            Texto enviado junto com o código Pix
                        </label>
                        <textarea
                            rows={3}
                            value={config.pixGeneratedMessage}
                            onChange={(e) => setConfig({ ...config, pixGeneratedMessage: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-800">
                    <label className="block text-xs font-medium text-neutral-300">
                        4. Mensagem de liberação após pagamento
                    </label>
                    <textarea
                        rows={3}
                        value={config.paymentApprovedMessage}
                        onChange={(e) => setConfig({ ...config, paymentApprovedMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />
                </div>
            </div>

            {/* IA */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                        <h2 className="font-medium text-sm text-white">
                            Resposta automática por IA
                        </h2>
                        <p className="text-xs text-neutral-500">
                            Responde dúvidas abertas antes da geração do Pix (somente na sessão exclusiva selecionada acima).
                        </p>
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.useAiSaleswoman}
                            onChange={(e) => setConfig({ ...config, useAiSaleswoman: e.target.checked })}
                        />
                        <span>Ativar IA</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">Provedor</label>
                        <select
                            value={config.aiProvider}
                            onChange={(e) => setConfig({ ...config, aiProvider: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs text-white"
                        >
                            <option value="GROQ">Groq</option>
                            <option value="OPENAI">OpenAI</option>
                            <option value="GEMINI">Gemini</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">Modelo</label>
                        <input
                            type="text"
                            value={config.aiModel}
                            onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">Chave de API</label>
                        <input
                            type="password"
                            value={config.aiApiKey}
                            onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-xs font-mono text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                        Instruções de atendimento
                    </label>
                    <textarea
                        rows={4}
                        value={config.aiSystemPrompt}
                        onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />
                </div>
            </div>
        </form>
    );
}
