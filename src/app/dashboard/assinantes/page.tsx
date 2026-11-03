"use client";

import { useState, useEffect } from "react";
import {
    Crown,
    UserPlus,
    Trash2,
    CheckCircle2,
    Clock,
    Copy,
    Loader2,
    CreditCard,
    Send
} from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
    id: string;
    phone: string;
    name?: string | null;
    planName: string;
    isVip: boolean;
    createdAt: string;
}

interface PixOrderItem {
    id: string;
    externalId?: string | null;
    phone: string;
    customerName?: string | null;
    amount: number;
    status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
    createdAt: string;
    paidAt?: string | null;
}

export default function AdminAssinantesPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [orders, setOrders] = useState<PixOrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Liberação manual
    const [newPhone, setNewPhone] = useState("");
    const [newName, setNewName] = useState("");
    const [adding, setAdding] = useState(false);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/viewer/access?list=true");
            const data = await res.json();
            if (data?.subscribers) setSubscribers(data.subscribers);
            if (data?.orders) setOrders(data.orders);
        } catch {
            toast.error("Erro ao carregar assinantes e pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleManualGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await fetch("/api/viewer/access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: newPhone,
                    name: newName || "Cliente VIP"
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Erro ao liberar");
            toast.success(`Número ${data.viewer.phone} liberado como VIP!`);
            setNewPhone("");
            setNewName("");
            await loadData();
        } catch (err: any) {
            toast.error(err?.message || "Erro ao liberar acesso");
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveSubscriber = async (id: string) => {
        if (!confirm("Remover acesso VIP deste número?")) return;
        try {
            await fetch(`/api/viewer/access?id=${id}`, { method: "DELETE" });
            toast.success("Acesso removido");
            await loadData();
        } catch {
            toast.error("Erro ao remover");
        }
    };

    const handleApproveOrder = async (orderId: string) => {
        setApprovingId(orderId);
        try {
            const res = await fetch("/api/webhooks/mangofy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    forceApprove: true
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Erro ao aprovar");
            toast.success("Pagamento aprovado! Acesso liberado no site e enviado no WhatsApp!");
            await loadData();
        } catch (err: any) {
            toast.error(err?.message || "Falha ao aprovar pedido");
        } finally {
            setApprovingId(null);
        }
    };

    const copyMagicLink = (phone: string) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const link = `${origin}/?phone=${phone}`;
        navigator.clipboard.writeText(link);
        toast.success("Link de acesso direto copiado!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2.5">
                    <Crown className="w-6 h-6 text-amber-400" />
                    Assinantes VIP & Pedidos Pix (Mangofy)
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Acompanhe os pagamentos gerados no funil do WhatsApp ou libere qualquer número manualmente em 1 clique.
                </p>
            </div>

            {/* Card de Liberação Rápida Manual */}
            <form
                onSubmit={handleManualGrant}
                className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-end gap-3"
            >
                <div className="w-full sm:flex-1">
                    <label className="block text-xs font-medium mb-1">
                        Liberar Número de WhatsApp Manualmente (com DDD)
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Ex: 11999999999"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />
                </div>
                <div className="w-full sm:flex-1">
                    <label className="block text-xs font-medium mb-1">Nome da Cliente (opcional)</label>
                    <input
                        type="text"
                        placeholder="Ex: Maria Silva"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={adding}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 h-[42px]"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Liberar Acesso VIP
                </button>
            </form>

            {loading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Coluna 1: Assinantes VIP Liberados */}
                    <div className="lg:col-span-6 p-5 rounded-2xl border border-border bg-card space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Clientes com Acesso VIP Liberado ({subscribers.length})
                            </h2>
                        </div>

                        {subscribers.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-6 text-center">
                                Nenhum assinante VIP liberado ainda.
                            </p>
                        ) : (
                            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                                {subscribers.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="p-3.5 rounded-xl border border-border bg-background/60 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <div className="font-bold text-sm flex items-center gap-2">
                                                <span>+{sub.phone}</span>
                                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                                                    VIP Ativo
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {sub.name || "Cliente"} • {sub.planName}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => copyMagicLink(sub.phone)}
                                                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-accent text-xs font-medium flex items-center gap-1"
                                                title="Copiar link mágico já logado"
                                            >
                                                <Copy className="w-3.5 h-3.5" /> Link Mágico
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubscriber(sub.id)}
                                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                                                title="Revogar acesso"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coluna 2: Pedidos Pix (Mangofy) */}
                    <div className="lg:col-span-6 p-5 rounded-2xl border border-border bg-card space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-rose-400" />
                                Últimos Pedidos Pix Gerados ({orders.length})
                            </h2>
                        </div>

                        {orders.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-6 text-center">
                                Nenhum pedido Pix gerado ainda no funil ou no site.
                            </p>
                        ) : (
                            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-3.5 rounded-xl border border-border bg-background/60 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">+{order.phone}</span>
                                                <span className="text-xs font-extrabold text-emerald-400">
                                                    R$ {order.amount.toFixed(2).replace(".", ",")}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                                        order.status === "PAID"
                                                            ? "bg-emerald-500/15 text-emerald-400"
                                                            : "bg-amber-500/15 text-amber-400"
                                                    }`}
                                                >
                                                    {order.status === "PAID" ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3" /> PAGO
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" /> AGUARDANDO PIX
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                {order.customerName || "Cliente"} •{" "}
                                                {new Date(order.createdAt).toLocaleString("pt-BR")}
                                            </div>
                                        </div>

                                        {order.status !== "PAID" && (
                                            <button
                                                type="button"
                                                disabled={approvingId === order.id}
                                                onClick={() => handleApproveOrder(order.id)}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                                                title="Aprovar pagamento e enviar link no WhatsApp"
                                            >
                                                {approvingId === order.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Send className="w-3.5 h-3.5" />
                                                )}
                                                Aprovar & Entregar
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

