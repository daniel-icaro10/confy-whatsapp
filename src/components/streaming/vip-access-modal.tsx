"use client";

import { useState, useEffect } from "react";
import {
    Heart,
    Sparkles,
    Lock,
    CheckCircle2,
    Copy,
    Check,
    Phone,
    Loader2,
    QrCode,
    X,
    ShieldCheck,
    Play
} from "lucide-react";

interface VipAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlocked: (phone: string) => void;
    dramaId?: string;
    dramaTitle?: string;
    defaultTab?: "login" | "pix";
    planPrice?: number;
}

export function VipAccessModal({
    isOpen,
    onClose,
    onUnlocked,
    dramaId,
    dramaTitle,
    defaultTab = "pix",
    planPrice = 19.9
}: VipAccessModalProps) {
    const [tab, setTab] = useState<"login" | "pix">(defaultTab);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Estado do Pix gerado
    const [pixOrder, setPixOrder] = useState<{
        orderId: string;
        amount: number;
        pixCopyPaste: string;
        phone: string;
        isSimulated?: boolean;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTab(defaultTab);
            setError("");
            const savedPhone = localStorage.getItem("sdc_viewer_phone") || "";
            if (savedPhone) setPhone(savedPhone);
        }
    }, [isOpen, defaultTab]);

    // Polling automático a cada 3 segundos quando há um Pix pendente
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
                // ignora falha de rede momentânea
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
                setError(
                    "Ainda não encontramos uma assinatura ativa neste número. Se você ainda não liberou seu acesso, clique na aba 'Liberar com Pix'!"
                );
            }
        } catch {
            setError("Erro ao verificar seu número. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePix = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/pix/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    name: name || "Assinante Segredos do Coração",
                    dramaId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || "Não foi possível gerar o Pix.");
                return;
            }
            setPixOrder(data);
        } catch {
            setError("Erro ao conectar para gerar seu Pix.");
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
                setError("Ainda aguardando confirmação do banco... Assim que pagar, libera em segundos!");
            }
        } finally {
            setCheckingPayment(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-[#120b16] text-white shadow-2xl shadow-rose-950/60 overflow-hidden">
                {/* Glow topo */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-rose-600/25 blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 pt-7 relative">
                    {/* Cabeçalho */}
                    <div className="flex flex-col items-center text-center mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-600/30 mb-3">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 mb-2">
                            <Sparkles className="w-3 h-3" /> Segredos do Coração VIP
                        </span>
                        <h3 className="text-xl font-bold tracking-tight">
                            {dramaTitle
                                ? `Continue assistindo "${dramaTitle}"`
                                : "Acesso Ilimitado a Todas as Novelas"}
                        </h3>
                        <p className="text-xs text-white/65 mt-1 max-w-xs">
                            Assista a todos os episódios completos sem cortes no celular ou entre com seu WhatsApp já liberado.
                        </p>
                    </div>

                    {/* Seletor de Abas */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
                        <button
                            type="button"
                            onClick={() => {
                                setTab("pix");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                tab === "pix"
                                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow"
                                    : "text-white/60 hover:text-white"
                            }`}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Liberar com Pix
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTab("login");
                                setError("");
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                tab === "login"
                                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow"
                                    : "text-white/60 hover:text-white"
                            }`}
                        >
                            <Phone className="w-3.5 h-3.5" />
                            Já Paguei (Entrar)
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 text-center">
                            {error}
                        </div>
                    )}

                    {tab === "login" ? (
                        <form onSubmit={handleCheckAccess} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/80 mb-1.5">
                                    Seu número de WhatsApp (com DDD)
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ex: (11) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-rose-500"
                                />
                                <p className="text-[11px] text-white/45 mt-1.5">
                                    Digite o mesmo número de WhatsApp que você usou para falar com a nossa atendente ou pagar o Pix.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Play className="w-4 h-4 fill-white" />
                                )}
                                Entrar e Assistir Agora
                            </button>
                        </form>
                    ) : !pixOrder ? (
                        <form onSubmit={handleGeneratePix} className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/15 to-pink-500/5 border border-rose-500/25 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-semibold text-rose-300">
                                        Passe VIP Completo — Todas as Novelas
                                    </div>
                                    <div className="text-[11px] text-white/60">
                                        Liberação automática na hora pelo WhatsApp
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-white/40 line-through">R$ 49,90</div>
                                    <div className="text-lg font-extrabold text-emerald-400">
                                        R$ {planPrice.toFixed(2).replace(".", ",")}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/80 mb-1">
                                    Seu WhatsApp com DDD (para liberar seu acesso)
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ex: (11) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/80 mb-1">
                                    Seu Nome (opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Como podemos te chamar?"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <QrCode className="w-4 h-4" />
                                )}
                                Gerar Pix Copia e Cola — R$ {planPrice.toFixed(2).replace(".", ",")}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-white/50 pt-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Liberação imediata via Mangofy Pix Seguro
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                                <div className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 mb-1">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Aguardando pagamento de R$ {pixOrder.amount.toFixed(2).replace(".", ",")}
                                </div>
                                <p className="text-[11px] text-white/65">
                                    Copie o código abaixo e pague no app do seu banco. Esta tela libera sozinha assim que você pagar!
                                </p>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium text-white/60 mb-1">
                                    Código Pix Copia e Cola:
                                </label>
                                <div className="p-3 rounded-xl bg-black/50 border border-white/15 text-[11px] font-mono text-white/80 break-all max-h-24 overflow-y-auto">
                                    {pixOrder.pixCopyPaste}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyPix}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" /> Código Pix Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" /> Copiar Código Pix
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleManualVerify}
                                disabled={checkingPayment}
                                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white/90 flex items-center justify-center gap-1.5 transition"
                            >
                                {checkingPayment ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                                Já realizei o pagamento
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

