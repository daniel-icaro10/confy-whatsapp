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
    initialPlanKey = "annual",
    plans = DEFAULT_OFFER_PLANS
}: VipAccessModalProps) {
    const [tab, setTab] = useState<"login" | "pix">(defaultTab);
    const [selectedPlanKey, setSelectedPlanKey] = useState<"monthly" | "quarterly" | "annual">(
        initialPlanKey
    );
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
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[480px] rounded-[22px] bg-[#101014] border border-white/12 text-[#f5f5f5] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden my-auto"
            >
                {/* Cabeçalho */}
                <div className="px-5 pt-5 pb-4 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#0b0b0e]">
                    <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48] block">
                            TVDRAMA REELS · ACESSO COMPLETO
                        </span>
                        <h3 className="text-[19px] font-black tracking-tight text-white mt-0.5 line-clamp-1">
                            {tab === "login"
                                ? "Entrar na sua conta"
                                : dramaTitle || "Liberar todas as séries"}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center text-white text-xs shrink-0 transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 sm:p-6">
                    {/* Seletor de Abas (Liberar Agora / Já paguei) */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#09090b] border border-white/10 mb-5">
                        <button
                            type="button"
                            onClick={() => {
                                setTab("pix");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-full text-xs font-bold transition ${
                                tab === "pix"
                                    ? "bg-white text-black"
                                    : "text-[#9a9a9a] hover:text-white"
                            }`}
                        >
                            Liberar acesso
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTab("login");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-full text-xs font-bold transition ${
                                tab === "login"
                                    ? "bg-white text-black"
                                    : "text-[#9a9a9a] hover:text-white"
                            }`}
                        >
                            Já paguei · Entrar
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3.5 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/35 text-xs font-medium text-[#fda4af]">
                            {error}
                        </div>
                    )}

                    {tab === "login" ? (
                        <form onSubmit={handleCheckAccess} className="space-y-4">
                            <p className="text-xs text-[#9a9a9a] leading-relaxed">
                                Digite o número de WhatsApp (com DDD) usado no pagamento para liberar todo o catálogo imediatamente neste aparelho.
                            </p>
                            <div>
                                <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                    Seu WhatsApp cadastrado (com DDD)
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="(11) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50"
                            >
                                {loading ? "Verificando assinatura..." : "Entrar e liberar catálogo"}
                            </button>
                        </form>
                    ) : !pixOrder ? (
                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            {/* Seletor dos 3 Planos estilo TopDoramax */}
                            <div className="grid grid-cols-3 gap-2">
                                {activePlans.map((plan) => {
                                    const isSelected = plan.key === selectedPlan.key;
                                    return (
                                        <button
                                            key={plan.key}
                                            type="button"
                                            onClick={() => setSelectedPlanKey(plan.key)}
                                            className={`relative p-3 rounded-xl text-left transition flex flex-col justify-between border ${
                                                isSelected
                                                    ? "border-[#e11d48] bg-[#e11d48]/14 shadow-[0_4px_16px_rgba(225,29,72,0.25)]"
                                                    : "border-white/12 bg-[#09090b] opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            <div>
                                                <div
                                                    className={`text-[10px] font-extrabold uppercase truncate ${
                                                        plan.isPopular
                                                            ? "text-[#f43f5e]"
                                                            : "text-[#9a9a9a]"
                                                    }`}
                                                >
                                                    {plan.isPopular ? "Mais escolhido" : plan.subtitle}
                                                </div>
                                                <div className="text-xs font-bold text-white mt-0.5">
                                                    {plan.name.replace("Plano ", "")}
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-white/[0.08]">
                                                <div className="text-[10px] text-[#7a7a85] line-through tabular-nums">
                                                    R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                                                </div>
                                                <div className="text-sm font-black text-white tabular-nums">
                                                    R$ {plan.price.toFixed(2).replace(".", ",")}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/10 flex items-center justify-between gap-2 text-xs">
                                <div>
                                    <span className="font-bold text-white">
                                        {selectedPlan.name} · {selectedPlan.subtitle}
                                    </span>
                                    <span className="block text-[11px] font-semibold text-[#4ade8a] mt-0.5">
                                        {selectedPlan.badge}
                                    </span>
                                </div>
                                <span className="text-base font-black text-white tabular-nums shrink-0">
                                    R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
                                    <small className="text-[11px] font-normal text-[#9a9a9a]">
                                        {selectedPlan.periodLabel}
                                    </small>
                                </span>
                            </div>

                            {/* Método de Pagamento: Pix vs Cartão Recorrente (Stripe) */}
                            <div>
                                <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                    Forma de pagamento
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("pix")}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center border ${
                                            paymentMethod === "pix"
                                                ? "bg-white text-black border-white"
                                                : "bg-[#09090b] border-white/12 text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        ⚡ Pix (Liberação na hora)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center border ${
                                            paymentMethod === "stripe"
                                                ? "bg-white text-black border-white"
                                                : "bg-[#09090b] border-white/12 text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        💳 Cartão (Stripe)
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        WhatsApp com DDD
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        Seu nome (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Como podemos te chamar"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50"
                            >
                                {loading
                                    ? "Processando..."
                                    : paymentMethod === "pix"
                                    ? `Gerar Pix — R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`
                                    : `Pagar no Cartão — R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[#e11d48]/12 border border-[#e11d48]/35">
                                <div className="text-xs font-extrabold text-[#f43f5e] uppercase mb-1 tabular-nums">
                                    {pixOrder.planName || selectedPlan.name} · R${" "}
                                    {pixOrder.amount.toFixed(2).replace(".", ",")}
                                </div>
                                <p className="text-xs text-[#d4d4d8] leading-relaxed">
                                    Copie o código abaixo e pague via Pix Copia e Cola no seu aplicativo bancário. Seu número ({pixOrder.phone}) será liberado automaticamente em segundos.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#9a9a9a] mb-1.5">
                                    Código Pix Copia e Cola
                                </label>
                                <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/12 text-[11px] font-mono text-[#e4e4e7] break-all max-h-24 overflow-y-auto">
                                    {pixOrder.pixCopyPaste}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyPix}
                                className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                            >
                                {copied ? "✓ Código Pix copiado!" : "Copiar código Pix"}
                            </button>

                            <button
                                type="button"
                                onClick={handleManualVerify}
                                disabled={checkingPayment}
                                className="w-full min-h-[44px] rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition"
                            >
                                {checkingPayment
                                    ? "Verificando pagamento..."
                                    : "Já realizei o pagamento"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
