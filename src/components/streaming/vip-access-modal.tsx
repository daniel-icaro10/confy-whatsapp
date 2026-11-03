"use client";

import { useState, useEffect } from "react";

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
                setError(
                    "Nenhuma assinatura ativa encontrada para este número."
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
                    name: name || "Cliente",
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
            setError("Erro ao gerar o Pix.");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="relative w-full max-w-md rounded-lg border border-neutral-800 bg-[#121212] text-white p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {dramaTitle || "Liberar acesso completo"}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1">
                            Assista a todos os episódios no celular ou entre com seu número já cadastrado.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xs text-neutral-400 hover:text-white"
                    >
                        Fechar
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 rounded bg-[#0a0a0a] border border-neutral-800 mb-5">
                    <button
                        type="button"
                        onClick={() => {
                            setTab("pix");
                            setError("");
                        }}
                        className={`py-2 px-3 rounded text-xs font-medium transition ${
                            tab === "pix"
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        Liberar com Pix
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTab("login");
                            setError("");
                        }}
                        className={`py-2 px-3 rounded text-xs font-medium transition ${
                            tab === "login"
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        Já tenho acesso
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-900/50 text-xs text-red-300">
                        {error}
                    </div>
                )}

                {tab === "login" ? (
                    <form onSubmit={handleCheckAccess} className="space-y-4">
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1.5">
                                WhatsApp com DDD
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded bg-[#0a0a0a] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-medium text-sm transition disabled:opacity-50"
                        >
                            {loading ? "Verificando..." : "Entrar"}
                        </button>
                    </form>
                ) : !pixOrder ? (
                    <form onSubmit={handleGeneratePix} className="space-y-4">
                        <div className="p-3.5 rounded bg-[#0a0a0a] border border-neutral-800 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-medium text-white">
                                    Acesso completo ao catálogo
                                </div>
                                <div className="text-[11px] text-neutral-400">
                                    Liberação imediata após o pagamento
                                </div>
                            </div>
                            <div className="text-base font-semibold text-white">
                                R$ {planPrice.toFixed(2).replace(".", ",")}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                                WhatsApp com DDD
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded bg-[#0a0a0a] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                                Nome (opcional)
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-medium text-sm transition disabled:opacity-50"
                        >
                            {loading ? "Gerando Pix..." : `Gerar Pix — R$ ${planPrice.toFixed(2).replace(".", ",")}`}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-3 rounded bg-[#0a0a0a] border border-neutral-800">
                            <div className="text-xs font-medium text-white mb-1">
                                Aguardando pagamento — R$ {pixOrder.amount.toFixed(2).replace(".", ",")}
                            </div>
                            <p className="text-[11px] text-neutral-400">
                                Copie o código abaixo e realize o pagamento no aplicativo do seu banco. O acesso será liberado automaticamente.
                            </p>
                        </div>

                        <div>
                            <label className="block text-[11px] text-neutral-400 mb-1">
                                Pix Copia e Cola:
                            </label>
                            <div className="p-3 rounded bg-[#0a0a0a] border border-neutral-800 text-[11px] font-mono text-neutral-300 break-all max-h-24 overflow-y-auto">
                                {pixOrder.pixCopyPaste}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopyPix}
                            className="w-full py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-medium text-sm"
                        >
                            {copied ? "Código copiado" : "Copiar código Pix"}
                        </button>

                        <button
                            type="button"
                            onClick={handleManualVerify}
                            disabled={checkingPayment}
                            className="w-full py-2 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 transition"
                        >
                            {checkingPayment ? "Verificando..." : "Já realizei o pagamento"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
