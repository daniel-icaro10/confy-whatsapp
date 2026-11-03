import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureFunnelConfig, ensureInitialDramas } from "@/lib/segredos-defaults";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    await Promise.all([ensureInitialDramas(), ensureFunnelConfig()]);

    const [
        dramas,
        episodesCount,
        subscribersCount,
        orders,
        waSessions,
        funnelConfig
    ] = await Promise.all([
        prisma.drama.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            include: {
                _count: { select: { episodes: true } }
            }
        }),
        prisma.episode.count(),
        prisma.viewerAccess.count({ where: { isVip: true } }),
        prisma.pixOrder.findMany({
            orderBy: { createdAt: "desc" },
            take: 8
        }),
        prisma.session.findMany({
            orderBy: { createdAt: "desc" }
        }),
        prisma.funnelConfig.findUnique({ where: { id: "default" } })
    ]);

    const pendingOrders = orders.filter((o) => o.status === "PENDING");

    const allPaidAggregate = await prisma.pixOrder.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
        _count: { id: true }
    });

    const totalRevenue = allPaidAggregate._sum.amount || 0;
    const totalPaidCount = allPaidAggregate._count.id || 0;
    const connectedWaCount = waSessions.filter((s) => s.status === "CONNECTED").length;

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Resumo da operação
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                        Acompanhamento de vendas, assinantes e catálogo.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/dashboard/novelas"
                        className="px-3.5 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium transition"
                    >
                        Gerenciar novelas
                    </Link>
                    <Link
                        href="/dashboard/funil"
                        className="px-3.5 py-2 rounded border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-neutral-200 transition"
                    >
                        Configurar funil
                    </Link>
                    <Link
                        href="/dashboard/sessions"
                        className="px-3.5 py-2 rounded border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-neutral-200 transition"
                    >
                        Conexões WhatsApp
                    </Link>
                </div>
            </div>

            {/* Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-neutral-800 bg-[#111111]">
                    <span className="text-xs text-neutral-400">Receita aprovada</span>
                    <div className="text-2xl font-semibold text-white mt-1">
                        R$ {totalRevenue.toFixed(2).replace(".", ",")}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                        {totalPaidCount} pagos · {pendingOrders.length} pendentes
                    </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-800 bg-[#111111]">
                    <span className="text-xs text-neutral-400">Assinantes ativos</span>
                    <div className="text-2xl font-semibold text-white mt-1">
                        {subscribersCount}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                        Liberados por telefone
                    </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-800 bg-[#111111]">
                    <span className="text-xs text-neutral-400">Catálogo</span>
                    <div className="text-2xl font-semibold text-white mt-1">
                        {dramas.length} novelas
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                        {episodesCount} episódios cadastrados
                    </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-800 bg-[#111111]">
                    <span className="text-xs text-neutral-400">WhatsApp e Funil</span>
                    <div className="text-2xl font-semibold text-white mt-1">
                        {connectedWaCount}/{waSessions.length} online
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                        {funnelConfig?.enabled ? "Atendimento automático ativo" : "Atendimento pausado"}
                    </p>
                </div>
            </div>

            {/* Tabelas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 rounded-lg border border-neutral-800 bg-[#111111] p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h2 className="font-medium text-sm text-white">
                            Últimos pedidos Pix
                        </h2>
                        <Link
                            href="/dashboard/assinantes"
                            className="text-xs text-neutral-400 hover:text-white"
                        >
                            Ver todos
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-neutral-500">
                            Nenhum pedido registrado.
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="py-2.5 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <div className="text-xs font-medium text-white">
                                            +{order.phone} · R$ {order.amount.toFixed(2).replace(".", ",")}
                                        </div>
                                        <div className="text-[11px] text-neutral-500">
                                            {order.customerName || "Cliente"}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                            order.status === "PAID"
                                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                                                : "bg-neutral-800 text-neutral-300"
                                        }`}
                                    >
                                        {order.status === "PAID" ? "Pago" : "Pendente"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-6 rounded-lg border border-neutral-800 bg-[#111111] p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h2 className="font-medium text-sm text-white">
                            Novelas cadastradas
                        </h2>
                        <Link
                            href="/dashboard/novelas"
                            className="text-xs text-neutral-400 hover:text-white"
                        >
                            Editar catálogo
                        </Link>
                    </div>

                    <div className="divide-y divide-neutral-800">
                        {dramas.map((drama) => (
                            <div
                                key={drama.id}
                                className="py-2.5 flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <div className="text-xs font-medium text-white truncate">
                                        {drama.title}
                                    </div>
                                    <div className="text-[11px] text-neutral-500">
                                        {drama.category} · {drama._count.episodes} episódios ({drama.freeEpisodesCount} grátis)
                                    </div>
                                </div>

                                <Link
                                    href={`/assistir/${drama.slug}`}
                                    target="_blank"
                                    className="px-2.5 py-1 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 hover:text-white shrink-0 transition"
                                >
                                    Abrir
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
