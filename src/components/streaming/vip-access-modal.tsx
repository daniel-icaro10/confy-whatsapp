"use client";

import { useState, useEffect, useRef } from "react";
import { DEFAULT_OFFER_PLANS, OfferPlan } from "@/lib/segredos-defaults";
import { loadStripeClient } from "@/lib/stripe-client";

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
    const [cardholderName, setCardholderName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cardSuccess, setCardSuccess] = useState(false);

    // Stripe in-page Elements
    const [stripeReady, setStripeReady] = useState(false);
    const [stripePublishableKey, setStripePublishableKey] = useState("");
    const cardContainerRef = useRef<HTMLDivElement>(null);
    const stripeRef = useRef<any>(null);
    const cardElementRef = useRef<any>(null);

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

    // Carrega a chave pública Stripe
    useEffect(() => {
        let isMounted = true;
        fetch("/api/funnel/config")
            .then((r) => r.json())
            .then((data) => {
                if (!isMounted) return;
                const pubKey = data?.config?.stripePublishableKey;
                if (pubKey) setStripePublishableKey(pubKey);
            })
            .catch(() => {});
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTab(defaultTab);
            setSelectedPlanKey(initialPlanKey);
            setError("");
            setPixOrder(null);
            setCardSuccess(false);
            const savedPhone = localStorage.getItem("sdc_viewer_phone") || "";
            if (savedPhone) setPhone(savedPhone);
        }
    }, [isOpen, defaultTab, initialPlanKey]);

    // Monta o Stripe Card Element transparente sem sair da página
    useEffect(() => {
        if (!isOpen || paymentMethod !== "stripe" || tab !== "pix" || pixOrder || cardSuccess) {
            if (cardElementRef.current) {
                try {
                    cardElementRef.current.destroy();
                } catch {}
                cardElementRef.current = null;
            }
            return;
        }

        let isMounted = true;
        const key = stripePublishableKey || "pk_live_51Rj3NkCmp0vwBFJWkWFoa5MMpcMv6bq25zC6jKOYgeMSfspVF7OeaAy0vexwmh7JbSx51HmzKoYho1kJeYESoCpT00r68X5IZs";

        async function mountStripeCard() {
            try {
                if (!cardContainerRef.current) return;
                const stripe = await loadStripeClient(key);
                if (!isMounted || !stripe || !cardContainerRef.current) return;
                stripeRef.current = stripe;

                if (cardElementRef.current) {
                    try {
                        cardElementRef.current.destroy();
                    } catch {}
                    cardElementRef.current = null;
                }

                const elements = stripe.elements({ locale: "pt-BR" });
                const card = elements.create("card", {
                    hidePostalCode: true,
                    style: {
                        base: {
                            color: "#ffffff",
                            fontFamily: "'Sora', sans-serif",
                            fontSize: "14px",
                            fontSmoothing: "antialiased",
                            "::placeholder": {
                                color: "#71717a"
                            }
                        },
                        invalid: {
                            color: "#f43f5e",
                            iconColor: "#f43f5e"
                        }
                    }
                });

                card.mount(cardContainerRef.current);
                cardElementRef.current = card;
                setStripeReady(true);

                card.on("change", (event: any) => {
                    if (event.error) {
                        setError(event.error.message);
                    } else {
                        setError("");
                    }
                });
            } catch (err: any) {
                console.error("Erro ao montar Stripe Card Element:", err);
            }
        }

        const timer = setTimeout(() => {
            mountStripeCard();
        }, 120);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (cardElementRef.current) {
                try {
                    cardElementRef.current.destroy();
                } catch {}
                cardElementRef.current = null;
            }
        };
    }, [isOpen, paymentMethod, tab, pixOrder, cardSuccess, stripePublishableKey]);

    // Polling de status do Pix
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

        if (!phone.trim()) {
            setError("Informe o seu número de WhatsApp com DDD.");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === "stripe") {
                if (!cardholderName.trim()) {
                    setError("Informe o nome impresso no cartão de crédito.");
                    setLoading(false);
                    return;
                }

                if (!stripeRef.current || !cardElementRef.current) {
                    setError("O formulário de cartão seguro ainda está carregando. Aguarde um instante.");
                    setLoading(false);
                    return;
                }

                // 1. Cria PaymentIntent no backend
                const piRes = await fetch("/api/stripe/payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone,
                        name: cardholderName,
                        planKey: selectedPlan.key,
                        dramaId
                    })
                });

                const piData = await piRes.json();
                if (!piRes.ok || !piData?.clientSecret) {
                    setError(piData?.error || "Não foi possível preparar a cobrança com cartão.");
                    setLoading(false);
                    return;
                }

                // 2. Confirma o pagamento diretamente pelo Stripe.js seguro no navegador (sem redirecionar)
                const { paymentIntent, error: stripeErr } = await stripeRef.current.confirmCardPayment(
                    piData.clientSecret,
                    {
                        payment_method: {
                            card: cardElementRef.current,
                            billing_details: {
                                name: cardholderName,
                                phone
                            }
                        }
                    }
                );

                if (stripeErr) {
                    let msg = stripeErr.message || "Cartão não autorizado pela operadora.";
                    if (stripeErr.code === "card_declined") {
                        msg = "Cartão recusado pelo banco emissor. Verifique os dados ou pague via Pix instantâneo.";
                    } else if (stripeErr.code === "insufficient_funds") {
                        msg = "Saldo insuficiente no cartão. Você pode efetuar o pagamento via Pix instantâneo.";
                    } else if (stripeErr.code === "expired_card") {
                        msg = "Data de validade do cartão expirada.";
                    } else if (stripeErr.code === "incorrect_cvc") {
                        msg = "Código de segurança (CVC) inválido.";
                    }
                    setError(msg);
                    setLoading(false);
                    return;
                }

                if (paymentIntent && paymentIntent.status === "succeeded") {
                    // 3. Notifica backend para aprovar o pedido e liberar acesso
                    await fetch("/api/stripe/confirm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            paymentIntentId: paymentIntent.id,
                            phone
                        })
                    }).catch(() => {});

                    localStorage.setItem("sdc_viewer_phone", phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                    setCardSuccess(true);
                    onUnlocked(phone);
                } else {
                    setError("O pagamento está em processamento pelo banco emissor.");
                }
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
            setError("Erro ao processar pagamento. Tente novamente.");
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
                                : cardSuccess
                                ? "Assinatura Ativada"
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
                    {/* Seletor de Abas (Liberar Agora / Já paguei) - oculto se o cartão já foi pago com sucesso */}
                    {!cardSuccess && (
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
                    )}

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
                    ) : cardSuccess ? (
                        <div className="space-y-4 text-center py-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 grid place-items-center mx-auto text-emerald-400 text-3xl shadow-[0_0_24px_rgba(16,185,129,0.35)]">
                                ✓
                            </div>
                            <div>
                                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-emerald-400 block">
                                    PAGAMENTO CONFIRMADO
                                </span>
                                <h3 className="text-xl font-black text-white mt-1">
                                    Acesso VIP Liberado!
                                </h3>
                                <p className="text-xs text-[#a1a1aa] mt-1.5 max-w-sm mx-auto leading-relaxed">
                                    Seu plano <strong className="text-white">{selectedPlan.name}</strong> está 100% ativo para o WhatsApp <strong className="text-white">{phone}</strong>.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
                                🎬 Todas as novelas e episódios liberados sem anúncios em alta definição.
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full min-h-[48px] rounded-full bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-sm shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition cursor-pointer"
                            >
                                Começar a Assistir Agora ▶
                            </button>
                        </div>
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
                                            className={`relative p-3 rounded-xl text-left transition flex flex-col justify-between border cursor-pointer ${
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

                            {/* Método de Pagamento: Pix vs Cartão Transparente (In-Page) */}
                            <div>
                                <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                    Forma de pagamento
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("pix")}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                                            paymentMethod === "pix"
                                                ? "bg-white text-black border-white"
                                                : "bg-[#09090b] border-white/12 text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        ⚡ Pix (Instantâneo)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("stripe")}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                                            paymentMethod === "stripe"
                                                ? "bg-white text-black border-white"
                                                : "bg-[#09090b] border-white/12 text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        💳 Cartão de Crédito
                                    </button>
                                </div>
                            </div>

                            {/* Formulário In-Page: Pix ou Cartão Transparente */}
                            {paymentMethod === "stripe" ? (
                                <div className="space-y-3 pt-1">
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
                                                Nome impresso no cartão
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ex: MARIA S SILVA"
                                                value={cardholderName}
                                                onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-semibold text-[#e6e6eb]">
                                                Dados do Cartão de Crédito
                                            </label>
                                            <span className="text-[10px] text-[#4ade8a] flex items-center gap-1 font-medium">
                                                🔒 Criptografia SSL 256-bit
                                            </span>
                                        </div>
                                        <div
                                            ref={cardContainerRef}
                                            className="w-full px-3.5 py-3 rounded-xl bg-[#09090b] border border-white/15 focus-within:border-amber-400/60 transition min-h-[44px]"
                                        />
                                        {!stripeReady && (
                                            <p className="text-[11px] text-white/40 mt-1">Carregando ambiente seguro de cartão...</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-1 text-[11px] text-white/50 border-t border-white/[0.06]">
                                        <span>Bandeiras aceitas:</span>
                                        <div className="flex items-center gap-1 text-white/70 font-semibold text-[9px] tracking-wider">
                                            <span className="px-1.5 py-0.5 rounded bg-white/10">VISA</span>
                                            <span className="px-1.5 py-0.5 rounded bg-white/10">MASTERCARD</span>
                                            <span className="px-1.5 py-0.5 rounded bg-white/10">ELO</span>
                                            <span className="px-1.5 py-0.5 rounded bg-white/10">AMEX</span>
                                            <span className="px-1.5 py-0.5 rounded bg-white/10">HIPERCARD</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
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
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50 cursor-pointer"
                            >
                                {loading
                                    ? "Processando pagamento seguro..."
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
                                className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition cursor-pointer"
                            >
                                {copied ? "✓ Código Pix copiado!" : "Copiar código Pix"}
                            </button>

                            <button
                                type="button"
                                onClick={handleManualVerify}
                                disabled={checkingPayment}
                                className="w-full min-h-[44px] rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition cursor-pointer"
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
