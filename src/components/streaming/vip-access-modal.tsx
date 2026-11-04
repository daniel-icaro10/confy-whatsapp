"use client";

import { useState, useEffect } from "react";
import { DEFAULT_OFFER_PLANS, OfferPlan } from "@/lib/segredos-defaults";

interface VipAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlocked: (phone: string) => void;
    dramaId?: string;
    dramaTitle?: string;
    defaultTab?: "login" | "pix";
    initialPlanKey?: "monthly" | "quarterly" | "annual";
    plans?: OfferPlan[];
}

export function VipAccessModal({
    isOpen,
    onClose,
    onUnlocked,
    dramaId,
    dramaTitle,
    defaultTab = "pix",
    initialPlanKey = "monthly",
    plans = DEFAULT_OFFER_PLANS
}: VipAccessModalProps) {
    const [tab, setTab] = useState<"login" | "pix">(defaultTab);
    const [selectedPlanKey, setSelectedPlanKey] = useState<"monthly" | "quarterly" | "annual">(initialPlanKey);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "stripe">("pix");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [pixOrder, setPixOrder] = useState<{
        orderId: string;
        amount: number;
        planName?: string;
        pixCopyPaste: string;
        phone: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);

    const activePlans = plans && plans.length > 0 ? plans : DEFAULT_OFFER_PLANS;
    const selectedPlan =
        activePlans.find((p) => p.key === selectedPlanKey) || activePlans[0];

    useEffect(() => {
        if (isOpen) {
            setTab(defaultTab);
            setSelectedPlanKey(initialPlanKey);
            setError("");
            setPixOrder(null);
            const savedPhone = localStorage.getItem("sdc_viewer_phone") || "";
            if (savedPhone) setPhone(savedPhone);
        }
    }, [isOpen, defaultTab, initialPlanKey]);

    useEffect(() => {
        if (!pixOrder || !isOpen) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/pix/status?orderId=${pixOrder.orderId}`);
                const data = await res.json();
                if (data?.isPaid) {
                    clearInterval(interval);
                    localStorage.setItem("sdc_viewer_phone", pixOrder.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                    onUnlocked(pixOrder.phone);
                }
            } catch {
                // ignore
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [pixOrder, isOpen, onUnlocked]);

    if (!isOpen) return null;

    const handleCheckAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();

            if (data?.isVip) {
                localStorage.setItem("sdc_viewer_phone", data.phone);
                localStorage.setItem("sdc_viewer_vip", "true");
                onUnlocked(data.phone);
            } else {
                setError("Nenhuma assinatura ativa encontrada para este número.");
            }
        } catch {
            setError("Erro ao verificar seu número. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (paymentMethod === "stripe") {
                const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone,
                        name: name || "Assinante",
                        planKey: selectedPlan.key,
                        dramaId
                    })
                });
                const data = await res.json();
                if (!res.ok || !data?.checkoutUrl) {
                    setError(data?.error || "Não foi possível iniciar o checkout com cartão.");
                    return;
                }
                localStorage.setItem("sdc_viewer_phone", phone);
                window.location.href = data.checkoutUrl;
                return;
            }

            // Pagamento via Pix (Mangofy)
            const res = await fetch("/api/pix/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    name: name || "Cliente",
                    dramaId,
                    planKey: selectedPlan.key
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || "Não foi possível gerar o Pix.");
                return;
            }
            setPixOrder(data);
        } catch {
            setError("Erro ao processar pagamento.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPix = () => {
        if (!pixOrder?.pixCopyPaste) return;
        navigator.clipboard.writeText(pixOrder.pixCopyPaste);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleManualVerify = async () => {
        if (!pixOrder) return;
        setCheckingPayment(true);
        try {
            const res = await fetch(`/api/pix/status?orderId=${pixOrder.orderId}`);
            const data = await res.json();
            if (data?.isPaid) {
                localStorage.setItem("sdc_viewer_phone", pixOrder.phone);
                localStorage.setItem("sdc_viewer_vip", "true");
                onUnlocked(pixOrder.phone);
            } else {
                setError("Pagamento ainda em processamento. Aguarde alguns instantes.");
            }
        } finally {
            setCheckingPayment(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hd-theme overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-[22px] hd-shell overflow-hidden my-auto">
                <div className="px-6 pt-6 pb-4 border-b border-[rgb(239_233_222/0.12)] flex items-start justify-between gap-4">
                    <div>
                        <span className="text-[11px] uppercase tracking-[0.06em] text-[#efe9de]/45 font-medium block">
                            TvDrama Reels · Planos Promocionais
                        </span>
                        <h3 className="text-[19px] font-semibold tracking-[-0.012em] text-[#efe9de] mt-0.5">
                            {dramaTitle || "Escolha seu plano de acesso"}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="hd-btn-sm hd-button-quiet text-xs shrink-0"
                    >
                        Fechar
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full hd-surface mb-5">
                        <button
                            type="button"
                            onClick={() => {
                                setTab("pix");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-full text-xs font-medium transition ${
                                tab === "pix"
                                    ? "bg-[#efe9de] text-[#151413]"
                                    : "text-[#efe9de]/64 hover:text-[#efe9de]"
                            }`}
                        >
                            Assinar um plano
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTab("login");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-full text-xs font-medium transition ${
                                tab === "login"
                                    ? "bg-[#efe9de] text-[#151413]"
                                    : "text-[#efe9de]/64 hover:text-[#efe9de]"
                            }`}
                        >
                            Já sou assinante
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3.5 rounded-[14px] bg-[#ff8a7a]/10 border border-[#ff8a7a]/25 text-xs text-[#ff8a7a]">
                            {error}
                        </div>
                    )}

                    {tab === "login" ? (
                        <form onSubmit={handleCheckAccess} className="space-y-4">
                            <div>
                                <label className="block text-xs text-[#efe9de]/75 mb-1.5">
                                    WhatsApp cadastrado (com DDD)
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="(11) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-[14px] hd-pill-field text-sm placeholder:text-[#efe9de]/35"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full hd-btn hd-button-cream disabled:opacity-50"
                            >
                                {loading ? "Verificando..." : "Validar acesso"}
                            </button>
                        </form>
                    ) : !pixOrder ? (
                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            {/* Seletor dos 3 Planos */}
                            <div className="grid grid-cols-3 gap-2">
                                {activePlans.map((plan) => {
                                    const isSelected = plan.key === selectedPlan.key;
                                    return (
                                        <button
                                            key={plan.key}
                                            type="button"
                                            onClick={() => setSelectedPlanKey(plan.key)}
                                            className={`p-3 rounded-[14px] text-left transition flex flex-col justify-between ${
                                                isSelected
                                                    ? "hd-plan ring-1 ring-[#e2b383]"
                                                    : "hd-surface opacity-75 hover:opacity-100"
                                            }`}
                                        >
                                            <div>
                                                <div className="text-[10px] text-[#e2b383] font-medium truncate">
                                                    {plan.isPopular ? "Mais escolhido" : plan.subtitle}
                                                </div>
                                                <div className="text-xs font-semibold text-[#efe9de] mt-0.5">
                                                    {plan.name.replace("Plano ", "")}
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-[rgb(239_233_222/0.08)]">
                                                <div className="text-[10px] text-[#efe9de]/40 line-through tabular-nums">
                                                    R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                                                </div>
                                                <div className="text-sm font-semibold text-[#efe9de] tabular-nums">
                                                    R$ {plan.price.toFixed(2).replace(".", ",")}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-3.5 rounded-[14px] hd-surface flex items-center justify-between gap-2 text-xs">
                                <div>
                                    <span className="font-medium text-[#efe9de]">
                                        {selectedPlan.name} · {selectedPlan.subtitle}
                                    </span>
                                    <span className="block text-[11px] text-[#e2b383] mt-0.5">
                                        {selectedPlan.badge}
                                    </span>
                                </div>
                                <span className="text-base font-semibold text-[#efe9de] tabular-nums shrink-0">
                                    R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
                                    <small className="text-[11px] font-normal text-[#efe9de]/55">
                                        {selectedPlan.periodLabel}
                                    </small>
                                </span>
                            </div>

                            {/* Método de Pagamento: Pix vs Cartão Recorrente (Stripe) */}
                            <div>
                                <label className="block text-xs text-[#efe9de]/75 mb-1.5">
                                    Forma de pagamento
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("pix")}
                                        className={`py-2.5 px-3 rounded-[12px] text-xs font-medium transition text-center ${
                                            paymentMethod === "pix"
                                                ? "bg-[#efe9de] text-[#151413]"
                                                : "hd-surface text-[#efe9de]/70 hover:text-[#efe9de]"
                                        }`}
                                    >
                                        Pix (Liberação na hora)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`py-2.5 px-3 rounded-[12px] text-xs font-medium transition text-center ${
                                            paymentMethod === "stripe"
                                                ? "bg-[#efe9de] text-[#151413]"
                                                : "hd-surface text-[#efe9de]/70 hover:text-[#efe9de]"
                                        }`}
                                    >
                                        Cartão / Assinatura (Stripe)
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-[#efe9de]/75 mb-1.5">
                                        WhatsApp com DDD
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-[12px] hd-pill-field text-sm placeholder:text-[#efe9de]/35"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#efe9de]/75 mb-1.5">
                                        Nome (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-[12px] hd-pill-field text-sm placeholder:text-[#efe9de]/35"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full hd-btn hd-button-cream disabled:opacity-50"
                            >
                                {loading
                                    ? "Processando..."
                                    : paymentMethod === "pix"
                                    ? `Gerar Pix — R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`
                                    : `Assinar no Cartão — R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-[16px] hd-plan">
                                <div className="text-xs font-medium text-[#e2b383] mb-1 tabular-nums">
                                    {pixOrder.planName || selectedPlan.name} · R${" "}
                                    {pixOrder.amount.toFixed(2).replace(".", ",")}
                                </div>
                                <p className="text-xs text-[#efe9de]/64 leading-relaxed">
                                    Copie o código abaixo e pague via Pix Copia e Cola no seu banco. Seu número ({pixOrder.phone}) será liberado automaticamente em segundos.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs text-[#efe9de]/64 mb-1.5">
                                    Código Pix Copia e Cola
                                </label>
                                <div className="p-3.5 rounded-[14px] hd-surface text-[11px] font-mono text-[#efe9de]/80 break-all max-h-24 overflow-y-auto">
                                    {pixOrder.pixCopyPaste}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyPix}
                                className="w-full hd-btn hd-button-cream"
                            >
                                {copied ? "Código Pix copiado" : "Copiar código Pix"}
                            </button>

                            <button
                                type="button"
                                onClick={handleManualVerify}
                                disabled={checkingPayment}
                                className="w-full hd-btn hd-button-quiet text-xs"
                            >
                                {checkingPayment ? "Verificando pagamento..." : "Já realizei o pagamento"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
