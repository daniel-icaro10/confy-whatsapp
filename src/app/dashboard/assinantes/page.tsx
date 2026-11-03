"use client";

import { useState, useEffect } from "react";
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
            toast.error("Erro ao carregar dados");
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
                    name: newName || "Cliente"
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Erro ao liberar");
            toast.success(`Acesso liberado para ${data.viewer.phone}`);
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
        if (!confirm("Remover acesso deste número?")) return;
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
            toast.success("Pedido aprovado e enviado no WhatsApp");
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
        toast.success("Link copiado");
    };

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="border-b border-neutral-800 pb-5">
                <h1 className="text-xl font-semibold text-white">
                    Assinantes e pedidos
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                    Gerencie números liberados e pagamentos Pix.
                </p>
            </div>

            <form
                onSubmit={handleManualGrant}
                className="p-4 rounded-lg border border-neutral-800 bg-[#111111] flex flex-col sm:flex-row items-end gap-3"
            >
                <div className="w-full sm:flex-1">
                    <label className="block text-xs text-neutral-400 mb-1">
                        Telefone com DDD
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="11999999999"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />
                </div>
                <div className="w-full sm:flex-1">
                    <label className="block text-xs text-neutral-400 mb-1">Nome (opcional)</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                    />
                </div>
                <button
                    type="submit"
                    disabled={adding}
                    className="w-full sm:w-auto px-4 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium shrink-0 h-[38px]"
                >
                    {adding ? "Liberando..." : "Liberar acesso"}
                </button>
            </form>

            {loading ? (
                <div className="p-8 text-xs text-neutral-400">
                    Carregando...
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-6 p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                        <div className="border-b border-neutral-800 pb-3">
                            <h2 className="font-medium text-sm text-white">
                                Números liberados ({subscribers.length})
                            </h2>
                        </div>

                        {subscribers.length === 0 ? (
                            <p className="text-xs text-neutral-500 py-6 text-center">
                                Nenhum assinante cadastrado.
                            </p>
                        ) : (
                            <div className="divide-y divide-neutral-800 max-h-[480px] overflow-y-auto">
                                {subscribers.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="py-3 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <div className="font-medium text-xs text-white">
                                                +{sub.phone}
                                            </div>
                                            <div className="text-[11px] text-neutral-500">
                                                {sub.name || "Cliente"}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => copyMagicLink(sub.phone)}
                                                className="text-xs text-neutral-300 hover:text-white"
                                            >
                                                Copiar link
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubscriber(sub.id)}
                                                className="text-xs text-red-400 hover:text-red-300"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-6 p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-4">
                        <div className="border-b border-neutral-800 pb-3">
                            <h2 className="font-medium text-sm text-white">
                                Pedidos Pix ({orders.length})
                            </h2>
                        </div>

                        {orders.length === 0 ? (
                            <p className="text-xs text-neutral-500 py-6 text-center">
                                Nenhum pedido registrado.
                            </p>
                        ) : (
                            <div className="divide-y divide-neutral-800 max-h-[480px] overflow-y-auto">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="py-3 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="font-medium text-white">+{order.phone}</span>
                                                <span className="text-neutral-300">
                                                    R$ {order.amount.toFixed(2).replace(".", ",")}
                                                </span>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                                                        order.status === "PAID"
                                                            ? "bg-emerald-950 text-emerald-300"
                                                            : "bg-neutral-800 text-neutral-400"
                                                    }`}
                                                >
                                                    {order.status === "PAID" ? "Pago" : "Pendente"}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-neutral-500 mt-0.5">
                                                {order.customerName || "Cliente"} ·{" "}
                                                {new Date(order.createdAt).toLocaleString("pt-BR")}
                                            </div>
                                        </div>

                                        {order.status !== "PAID" && (
                                            <button
                                                type="button"
                                                disabled={approvingId === order.id}
                                                onClick={() => handleApproveOrder(order.id)}
                                                className="px-3 py-1.5 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium shrink-0"
                                            >
                                                {approvingId === order.id ? "Aprovando..." : "Aprovar"}
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
