"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
    DEFAULT_OFFER_PLANS,
    OfferPlan,
    FunnelStepNode,
    getFunnelNodes,
    DEFAULT_FUNNEL_STEPS
} from "@/lib/segredos-defaults";
import { FunnelKanbanEditor } from "@/components/funnel/funnel-kanban-editor";
import {
    Kanban,
    Smartphone,
    CreditCard,
    Bot,
    Save,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Copy,
    Sparkles,
    Zap
} from "lucide-react";

interface WaSessionOption {
    id: string;
    name: string;
    sessionId: string;
    status: string;
}

export default function AdminFunilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"kanban" | "whatsapp" | "plans" | "ai">("kanban");

    const [copiedWebhook, setCopiedWebhook] = useState(false);
    const [copiedStripeWebhook, setCopiedStripeWebhook] = useState(false);
    const [copiedAdUrl, setCopiedAdUrl] = useState(false);

    const [sessions, setSessions] = useState<WaSessionOption[]>([]);
    const [plans, setPlans] = useState<OfferPlan[]>(DEFAULT_OFFER_PLANS);
    const [detectedWhatsapp, setDetectedWhatsapp] = useState("");
    const [nodes, setNodes] = useState<FunnelStepNode[]>(DEFAULT_FUNNEL_STEPS);

    const [config, setConfig] = useState({
        enabled: false,
        sessionId: "",
        planName: "Plano Mensal — TvDrama Reels",
        planPrice: 9.9,
        siteUrl: "",
        whatsappNumber: "",
        adRedirectMessage: "Olá! Vi o anúncio e quero liberar meu acesso para assistir.",
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
                if (Array.isArray(data?.nodes) && data.nodes.length > 0) {
                    setNodes(data.nodes);
                } else if (data?.config?.flowJson && Array.isArray(data.config.flowJson)) {
                    setNodes(data.config.flowJson);
                } else if (data?.config) {
                    setNodes(getFunnelNodes(data.config));
                }
                if (data?.config) {
                    setDetectedWhatsapp(data.config.publicWhatsappNumber || "");
                    setConfig({
                        ...data.config,
                        sessionId: data.config.sessionId || "",
                        whatsappNumber: data.config.whatsappNumber || "",
                        adRedirectMessage:
                            data.config.adRedirectMessage ||
                            "Olá! Vi o anúncio e quero liberar meu acesso para assistir.",
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
                toast.error("Erro ao carregar configurações do funil");
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

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (config.enabled && !config.sessionId.trim()) {
            toast.error(
                "Selecione qual sessão do WhatsApp será usada exclusivamente pelo TvDrama Reels antes de ativar o funil."
            );
            setActiveTab("whatsapp");
            return;
        }

        setSaving(true);
        try {
            const monthly = plans.find((p) => p.key === "monthly") || plans[0];

            // Sincroniza os nós do Kanban com os campos padrão do config
            const greetingNode = nodes.find((n) => n.id === "step_greeting" || n.type === "greeting");
            const mediaNode = nodes.find((n) => n.id === "step_media" || n.type === "media");
            const offerNode = nodes.find((n) => n.id === "step_offer" || n.type === "offer");
            const pixNode = nodes.find((n) => n.id === "step_pix" || n.type === "pix_charge");
            const aiNode = nodes.find((n) => n.id === "step_ai" || n.type === "ai_assistant");
            const deliveryNode = nodes.find(
                (n) => n.id === "step_delivery" || n.type === "delivery"
            );

            const payload = {
                ...config,
                planPrice: monthly?.price ?? config.planPrice,
                plansJson: plans,
                flowJson: nodes,
                step1Greeting: greetingNode?.message ?? config.step1Greeting,
                step1MediaUrl: mediaNode?.mediaUrl ?? config.step1MediaUrl,
                step1MediaType: mediaNode?.mediaType ?? config.step1MediaType,
                step2OfferMessage: offerNode?.message ?? config.step2OfferMessage,
                pixGeneratedMessage: pixNode?.message ?? config.pixGeneratedMessage,
                pixTriggerKeywords: pixNode?.keywords ?? config.pixTriggerKeywords,
                paymentApprovedMessage: deliveryNode?.message ?? config.paymentApprovedMessage,
                aiSystemPrompt: aiNode?.message ?? config.aiSystemPrompt,
                useAiSaleswoman: aiNode?.enabled ?? config.useAiSaleswoman
            };

            const res = await fetch("/api/funnel/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Falha ao salvar");
            const data = await res.json();
            if (data?.config) {
                setConfig((prev) => ({ ...prev, ...data.config }));
            }
            toast.success("Funil e automações salvas com sucesso!");
        } catch {
            toast.error("Erro ao salvar configurações do funil");
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
                Carregando configurações do funil...
            </div>
        );
    }

    const currentSession = sessions.find((s) => s.sessionId === config.sessionId);

    return (
        <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-16">
            {/* Topbar com Título, Status e Salvar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101014] border border-white/10 shadow-lg">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs uppercase tracking-wider text-[#e11d48]">
                            TvDrama Reels
                        </span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-xs text-neutral-400">Automação de Vendas X1</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        Funil no WhatsApp, Quadro Kanban &amp; Ofertas
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#09090b] border border-white/10 hover:border-white/20 text-neutral-200 transition">
                        <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                            className="w-4 h-4 accent-[#e11d48] rounded cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    config.enabled ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
                                }`}
                            />
                            {config.enabled ? "Funil Ativo" : "Funil Pausado"}
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold flex items-center gap-2 shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Salvando..." : "Salvar Funil"}
                    </button>
                </div>
            </div>

            {/* Alerta de Sessão do Baileys */}
            {!config.sessionId ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>
                            Você ainda não vinculou uma sessão exclusiva do WhatsApp para o TvDrama
                            Reels. As mensagens do robô só serão disparadas após selecionar a sessão
                            desejada na aba <strong>Conexão WhatsApp</strong>.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTab("whatsapp")}
                        className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 transition"
                    >
                        Vincular Sessão
                    </button>
                </div>
            ) : (
                <div className="px-4 py-3 rounded-xl bg-[#101014] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-neutral-400">Sessão dedicada:</span>
                        <strong className="text-white font-bold">
                            {currentSession?.name || config.sessionId} ({config.sessionId})
                        </strong>
                        {detectedWhatsapp && (
                            <span className="text-neutral-400 font-mono">· {detectedWhatsapp}</span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Isolada (não afeta outros projetos)
                        </span>
                    </div>
                    <Link
                        href="/dashboard/sessions"
                        className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition"
                    >
                        Ver QR Codes <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {/* SELETOR DE ABAS PRINCIPAIS */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#101014] border border-white/10 overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab("kanban")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === "kanban"
                            ? "bg-white text-black shadow-md"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Kanban className={`w-4 h-4 ${activeTab === "kanban" ? "text-[#e11d48]" : "text-neutral-400"}`} />
                    Quadro Kanban &amp; Frases do Bot
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("whatsapp")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === "whatsapp"
                            ? "bg-white text-black shadow-md"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Smartphone className="w-4 h-4" />
                    Conexão WhatsApp &amp; Tráfego
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("plans")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === "plans"
                            ? "bg-white text-black shadow-md"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Planos &amp; Pagamentos (Pix &amp; Stripe)
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("ai")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === "ai"
                            ? "bg-white text-black shadow-md"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Bot className="w-4 h-4" />
                    Atendente Virtual IA
                </button>
            </div>

            {/* CONTEÚDO DA ABA 1: KANBAN COM QUADRADOS E LIGAÇÕES */}
            {activeTab === "kanban" && (
                <FunnelKanbanEditor
                    nodes={nodes}
                    onChange={(newNodes) => setNodes(newNodes)}
                    planPrice={config.planPrice}
                    siteUrl={config.siteUrl}
                />
            )}

            {/* CONTEÚDO DA ABA 2: CONEXÃO WHATSAPP & TRÁFEGO PAGO */}
            {activeTab === "whatsapp" && (
                <div className="space-y-6">
                    {/* Sessão Baileys */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                            <div>
                                <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-emerald-400" />
                                    Sessão Exclusiva do Baileys
                                </h2>
                                <p className="text-xs text-neutral-400 mt-1">
                                    O robô do TvDrama Reels atenderá apenas nas conexões vinculadas a esta sessão, sem interferir em nenhum outro projeto.
                                </p>
                            </div>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                                Instância Isolada
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                    Sessão do WhatsApp para o TvDrama Reels
                                </label>
                                <select
                                    value={config.sessionId}
                                    onChange={(e) =>
                                        setConfig({ ...config, sessionId: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:border-[#e11d48]/60 focus:ring-1 focus:ring-[#e11d48]/20 transition outline-none cursor-pointer"
                                >
                                    <option value="">— Selecione uma sessão específica —</option>
                                    {sessions.map((s) => (
                                        <option key={s.id} value={s.sessionId}>
                                            {s.name} ({s.sessionId}) —{" "}
                                            {s.status === "CONNECTED" ? "Conectada 🟢" : s.status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                    URL pública do site (Domínio ou IP)
                                </label>
                                <input
                                    type="text"
                                    placeholder="http://142.93.123.185:3000"
                                    value={config.siteUrl}
                                    onChange={(e) =>
                                        setConfig({ ...config, siteUrl: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:border-[#e11d48]/60 focus:ring-1 focus:ring-[#e11d48]/20 transition outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tráfego Pago & Anúncios */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                        <div className="border-b border-white/5 pb-4">
                            <h3 className="font-bold text-sm sm:text-base text-white">
                                Redirecionamento de Tráfego Pago (Anúncios → WhatsApp)
                            </h3>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                Leads que clicam nos anúncios (pelo link <code className="text-rose-400 font-mono">/anuncio</code> ou com parâmetros <code className="text-neutral-200">?anuncio=1</code>, <code className="text-neutral-200">fbclid</code>, etc.) são redirecionados imediatamente para o atendimento no WhatsApp. Visitantes orgânicos navegam direto no catálogo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                    Número do WhatsApp (com DDD e DDI)
                                </label>
                                <input
                                    type="text"
                                    placeholder={
                                        detectedWhatsapp
                                            ? `Detectado automaticamente: ${detectedWhatsapp}`
                                            : "Ex: 5511999999999"
                                    }
                                    value={config.whatsappNumber}
                                    onChange={(e) =>
                                        setConfig({ ...config, whatsappNumber: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:border-[#e11d48]/60 focus:ring-1 focus:ring-[#e11d48]/20 transition outline-none"
                                />
                                <p className="text-[11px] text-neutral-500 mt-1.5">
                                    Se em branco, puxa o telefone logado na sessão selecionada acima
                                    {detectedWhatsapp ? ` (${detectedWhatsapp})` : ""}.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                                    Mensagem inicial pré-digitada do lead
                                </label>
                                <input
                                    type="text"
                                    placeholder="Olá! Vi o anúncio e quero liberar meu acesso para assistir."
                                    value={config.adRedirectMessage}
                                    onChange={(e) =>
                                        setConfig({
                                            ...config,
                                            adRedirectMessage: e.target.value
                                        })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:border-[#e11d48]/60 focus:ring-1 focus:ring-[#e11d48]/20 transition outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-neutral-300">
                                <span className="font-semibold text-white block mb-0.5">
                                    Link para o Gerenciador de Anúncios (Facebook / TikTok / Google):
                                </span>
                                <div className="font-mono text-emerald-400 select-all font-semibold">
                                    {baseOrigin}/anuncio
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${baseOrigin}/anuncio`);
                                    setCopiedAdUrl(true);
                                    toast.success("Link de anúncio copiado!");
                                    setTimeout(() => setCopiedAdUrl(false), 3000);
                                }}
                                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-bold text-white shrink-0 cursor-pointer transition flex items-center justify-center gap-1.5"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedAdUrl ? "✓ Copiado!" : "Copiar Link de Anúncio"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO DA ABA 3: PLANOS & GATEWAYS DE PAGAMENTO */}
            {activeTab === "plans" && (
                <div className="space-y-6">
                    {/* Planos De/Por */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                        <div className="border-b border-white/5 pb-4">
                            <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[#e11d48]" />
                                Planos Promocionais de Assinatura
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                                Configure os preços De/Por, selos de economia e IDs da Stripe para cada período.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.key}
                                    className="p-4 rounded-xl border border-white/10 bg-[#0a0a0d] hover:border-white/20 transition space-y-3 shadow-md"
                                >
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                        <span className="text-xs font-bold text-white">
                                            {plan.name}
                                        </span>
                                        <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
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
                                                    updatePlanField(
                                                        plan.key,
                                                        "originalPrice",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#141419] border border-white/10 text-xs text-neutral-300 focus:border-rose-500/50 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-neutral-400 mb-1 font-semibold text-rose-400">
                                                Por (R$)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={plan.price}
                                                onChange={(e) =>
                                                    updatePlanField(
                                                        plan.key,
                                                        "price",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#141419] border border-rose-500/30 text-xs text-white font-bold focus:border-rose-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            Selo de Destaque / Economia
                                        </label>
                                        <input
                                            type="text"
                                            value={plan.badge}
                                            onChange={(e) =>
                                                updatePlanField(plan.key, "badge", e.target.value)
                                            }
                                            placeholder="Ex: Mais Popular, Economize 50%"
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#141419] border border-white/10 text-xs text-white focus:border-rose-500/50 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            Stripe Price ID (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="price_123..."
                                            value={plan.stripePriceId || ""}
                                            onChange={(e) =>
                                                updatePlanField(
                                                    plan.key,
                                                    "stripePriceId",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#141419] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mangofy (Pix) */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                        <div className="border-b border-white/5 pb-4">
                            <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                Integração Mangofy (Pix Imediato no Funil)
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                                Gera cobrança Pix Copia e Cola instantânea no site e no WhatsApp do lead através do gateway Mangofy.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    URL da API Mangofy
                                </label>
                                <input
                                    type="text"
                                    value={config.mangofyApiUrl}
                                    onChange={(e) =>
                                        setConfig({ ...config, mangofyApiUrl: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    Chave da API (Token Secret)
                                </label>
                                <input
                                    type="password"
                                    value={config.mangofyApiKey}
                                    onChange={(e) =>
                                        setConfig({ ...config, mangofyApiKey: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    Código da Loja (Store Code)
                                </label>
                                <input
                                    type="text"
                                    value={config.mangofyStoreCode}
                                    onChange={(e) =>
                                        setConfig({ ...config, mangofyStoreCode: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs">
                                <span className="text-neutral-400 block mb-0.5">
                                    URL de Postback / Webhook da Mangofy:
                                </span>
                                <div className="font-mono text-emerald-400 font-semibold select-all">
                                    {webhookUrl}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={copyWebhook}
                                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-bold text-white shrink-0 cursor-pointer transition flex items-center justify-center gap-1.5"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedWebhook ? "✓ Copiado" : "Copiar URL Mangofy"}
                            </button>
                        </div>
                    </div>

                    {/* Stripe (Cartão) */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                        <div className="border-b border-white/5 pb-4">
                            <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-sky-400" />
                                Integração Stripe (Assinatura Recorrente no Cartão)
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                                Permite aos clientes assinar com cartão de crédito internacional e nacional com renovação automática.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    Secret Key (sk_live_...)
                                </label>
                                <input
                                    type="password"
                                    value={config.stripeSecretKey}
                                    onChange={(e) =>
                                        setConfig({ ...config, stripeSecretKey: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    Publishable Key (pk_live_...)
                                </label>
                                <input
                                    type="text"
                                    value={config.stripePublishableKey}
                                    onChange={(e) =>
                                        setConfig({
                                            ...config,
                                            stripePublishableKey: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1.5 font-medium">
                                    Webhook Signing Secret (whsec_...)
                                </label>
                                <input
                                    type="password"
                                    value={config.stripeWebhookSecret}
                                    onChange={(e) =>
                                        setConfig({
                                            ...config,
                                            stripeWebhookSecret: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs">
                                <span className="text-neutral-400 block mb-0.5">
                                    URL de Webhook da Stripe (eventos <code className="text-sky-300">checkout.session.completed</code>, <code className="text-sky-300">payment_intent.succeeded</code> e <code className="text-sky-300">checkout.session.async_payment_succeeded</code>):
                                </span>
                                <div className="font-mono text-sky-400 font-semibold select-all">
                                    {stripeWebhookUrl}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={copyStripeWebhook}
                                className="px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-bold text-white shrink-0 cursor-pointer transition flex items-center justify-center gap-1.5"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedStripeWebhook ? "✓ Copiado" : "Copiar URL Stripe"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO DA ABA 4: INTELIGÊNCIA ARTIFICIAL */}
            {activeTab === "ai" && (
                <div className="p-6 rounded-2xl border border-white/10 bg-[#101014] shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                        <div>
                            <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                                <Bot className="w-4 h-4 text-cyan-400" />
                                Atendente Virtual com Inteligência Artificial
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                                Responde dúvidas abertas de clientes no WhatsApp e conduz o lead para o pagamento do Pix caso ele tenha objeções.
                            </p>
                        </div>

                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition self-start sm:self-auto">
                            <input
                                type="checkbox"
                                checked={config.useAiSaleswoman}
                                onChange={(e) =>
                                    setConfig({ ...config, useAiSaleswoman: e.target.checked })
                                }
                                className="accent-[#e11d48]"
                            />
                            <span>Ativar IA no Funil</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Provedor</label>
                            <select
                                value={config.aiProvider}
                                onChange={(e) =>
                                    setConfig({ ...config, aiProvider: e.target.value })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white focus:border-rose-500/50 outline-none cursor-pointer"
                            >
                                <option value="GROQ">Groq (Mais Rápido / Baixa Latência)</option>
                                <option value="OPENAI">OpenAI (GPT-4o mini)</option>
                                <option value="GEMINI">Google Gemini</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Modelo</label>
                            <input
                                type="text"
                                value={config.aiModel}
                                onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white focus:border-rose-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                                Chave de API
                            </label>
                            <input
                                type="password"
                                value={config.aiApiKey}
                                onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs font-mono text-white focus:border-rose-500/50 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-neutral-400">
                                Prompt / Instruções do Atendimento
                            </label>
                            <span className="text-[11px] text-neutral-500 font-mono">
                                {config.aiSystemPrompt.length} caracteres
                            </span>
                        </div>
                        <textarea
                            rows={6}
                            value={config.aiSystemPrompt}
                            onChange={(e) =>
                                setConfig({ ...config, aiSystemPrompt: e.target.value })
                            }
                            placeholder="Você é a Sofia, consultora do Segredos do Coração / TvDrama Reels. Seja simpática e responda dúvidas sobre as novelas e ajude o cliente a gerar o Pix..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:border-rose-500/50 outline-none leading-relaxed"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
