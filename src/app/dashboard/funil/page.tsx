"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminFunilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copiedWebhook, setCopiedWebhook] = useState(false);

    const [config, setConfig] = useState({
        enabled: true,
        sessionId: "",
        planName: "Acesso completo — Segredos do Coração",
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
                toast.error("Erro ao carregar configurações");
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
            toast.success("Configurações salvas");
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
        toast.success("URL copiada");
        setTimeout(() => setCopiedWebhook(false), 3000);
    };

    if (loading) {
        return (
            <div className="p-8 text-xs text-neutral-400">
                Carregando...
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Funil e pagamentos
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                        Configuração do fluxo de WhatsApp, gateway Mangofy e inteligência artificial.
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

            {/* Oferta */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                        <h2 className="font-medium text-sm text-white">Oferta e funcionamento</h2>
                        <p className="text-xs text-neutral-500">
                            Define o valor cobrado no Pix e a URL enviada ao cliente após o pagamento.
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">Nome do plano</label>
                        <input
                            type="text"
                            value={config.planName}
                            onChange={(e) => setConfig({ ...config, planName: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">Valor (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={config.planPrice}
                            onChange={(e) => setConfig({ ...config, planPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                            URL do site
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

            {/* Mangofy */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">Integração Mangofy</h2>
                    <p className="text-xs text-neutral-500">
                        Credenciais para geração de Pix e recebimento de confirmação automática.
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
                            URL de postback / webhook:
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
                        {copiedWebhook ? "Copiado" : "Copiar URL"}
                    </button>
                </div>
            </div>

            {/* Mensagens do Funil */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-5">
                <div className="border-b border-neutral-800 pb-3">
                    <h2 className="font-medium text-sm text-white">Mensagens do funil</h2>
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
                            Responde dúvidas abertas antes da geração do Pix.
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
