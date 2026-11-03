import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Film,
    Zap,
    Crown,
    QrCode,
    MessageSquare,
    CreditCard,
    CheckCircle2,
    Clock,
    Play,
    Sparkles,
    ArrowRight,
    ExternalLink,
    Wifi,
    Bot
} from "lucide-react";
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
            take: 5,
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

    const paidOrders = orders.filter((o) => o.status === "PAID");
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
        <div className="space-y-6 pb-10">
            {/* Banner Principal do Painel */}
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/25 bg-gradient-to-r from-[#170b1c] via-[#120918] to-[#0d0712] p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Operação Segredos do Coração
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Olá, {session.user.name || "Daniel"}! 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-white/65 mt-1 max-w-2xl">
                            Gerencie o seu catálogo de novelas verticais (YouTube), acompanhe os leads que chegam dos anúncios de 3 minutos no WhatsApp e veja os pagamentos Pix da Mangofy em tempo real.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <Link
                            href="/dashboard/novelas"
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/25 transition"
                        >
                            <Film className="w-4 h-4" />
                            Gerenciar Novelas
                        </Link>
                        <Link
                            href="/dashboard/funil"
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                        >
                            <Zap className="w-4 h-4" />
                            Funil X1 & Mangofy
                        </Link>
                        <Link
                            href="/dashboard/sessions"
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-2 transition"
                        >
                            <QrCode className="w-4 h-4 text-rose-400" />
                            Conectar WhatsApp
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4 Cards de Métricas Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Faturamento Pix */}
                <div className="p-5 rounded-2xl border border-white/10 bg-[#110a17] flex items-start justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                            Vendas Aprovadas (Pix)
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                            R$ {totalRevenue.toFixed(2).replace(".", ",")}
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                            {totalPaidCount} pagos • {pendingOrders.length} aguardando
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                </div>

                {/* Assinantes VIP */}
                <div className="p-5 rounded-2xl border border-white/10 bg-[#110a17] flex items-start justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                            Assinantes VIP Ativos
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {subscribersCount}
                        </div>
                        <p className="text-xs text-amber-400/90 mt-1">
                            Liberados pelo número de WhatsApp
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Crown className="w-5 h-5" />
                    </div>
                </div>

                {/* Catálogo de Novelas */}
                <div className="p-5 rounded-2xl border border-white/10 bg-[#110a17] flex items-start justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                            Catálogo no Ar
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {dramas.length} Novelas
                        </div>
                        <p className="text-xs text-rose-400 mt-1">
                            {episodesCount} episódios do YouTube
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <Film className="w-5 h-5" />
                    </div>
                </div>

                {/* Status WhatsApp + Funil */}
                <div className="p-5 rounded-2xl border border-white/10 bg-[#110a17] flex items-start justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                            WhatsApp & Funil X1
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {connectedWaCount}/{waSessions.length} Online
                        </div>
                        <p className="text-xs text-emerald-400 mt-1">
                            {funnelConfig?.enabled ? "Funil Automático Ativo" : "Funil Pausado"}
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Wifi className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Grade de Módulos Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/novelas"
                    className="group p-5 rounded-2xl border border-white/10 hover:border-rose-500/50 bg-[#110a17] transition flex flex-col justify-between"
                >
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3">
                            <Film className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition">
                            1. Catálogo de Novelas & YouTube
                        </h3>
                        <p className="text-xs text-white/55 mt-1 leading-relaxed">
                            Cadastre novelas verticais, escolha quantos episódios são grátis e adicione os links dos vídeos do YouTube.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-rose-400">
                        <span>Abrir Gerenciador de Novelas</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>

                <Link
                    href="/dashboard/funil"
                    className="group p-5 rounded-2xl border border-white/10 hover:border-emerald-500/50 bg-[#110a17] transition flex flex-col justify-between"
                >
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                            <Bot className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition">
                            2. Funil X1 + Mangofy + IA Sofia
                        </h3>
                        <p className="text-xs text-white/55 mt-1 leading-relaxed">
                            Configure as mensagens automáticas para quem vem do anúncio de 3 min, chave da Mangofy e a IA Vendedora.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span>Configurar Funil e Pix</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>

                <Link
                    href="/dashboard/assinantes"
                    className="group p-5 rounded-2xl border border-white/10 hover:border-amber-500/50 bg-[#110a17] transition flex flex-col justify-between"
                >
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                            <Crown className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition">
                            3. Assinantes VIP & Pedidos Pix
                        </h3>
                        <p className="text-xs text-white/55 mt-1 leading-relaxed">
                            Veja todos os clientes liberados, aprove pedidos Pix manualmente em 1 clique ou libere números de WhatsApp.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
                        <span>Ver Assinantes e Vendas</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>
            </div>

            {/* Duas Colunas: Últimos Pedidos Pix + Novelas Publicadas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Últimos Pedidos Pix */}
                <div className="lg:col-span-6 p-5 rounded-2xl border border-white/10 bg-[#110a17] space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-400" />
                            Últimos Pedidos Pix (Funil & Site)
                        </h2>
                        <Link
                            href="/dashboard/assinantes"
                            className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                        >
                            Ver todos
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-white/45">
                            Nenhum pedido Pix gerado ainda.
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-2">
                                            <span>+{order.phone}</span>
                                            <span className="text-emerald-400">
                                                R$ {order.amount.toFixed(2).replace(".", ",")}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-white/45">
                                            {order.customerName || "Cliente WhatsApp"}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                            order.status === "PAID"
                                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                        }`}
                                    >
                                        {order.status === "PAID" ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3" /> PAGO
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" /> PENDENTE
                                            </>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Novelas Ativas */}
                <div className="lg:col-span-6 p-5 rounded-2xl border border-white/10 bg-[#110a17] space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                            <Film className="w-4 h-4 text-rose-400" />
                            Novelas Publicadas no Catálogo
                        </h2>
                        <Link
                            href="/dashboard/novelas"
                            className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                        >
                            Gerenciar
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {dramas.map((drama) => (
                            <div
                                key={drama.id}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={drama.coverUrl}
                                        alt={drama.title}
                                        className="w-10 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-white truncate">
                                            {drama.title}
                                        </div>
                                        <div className="text-[11px] text-white/50">
                                            {drama.category} • {drama._count.episodes} episódios (Ep 1-{drama.freeEpisodesCount} grátis)
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/assistir/${drama.slug}`}
                                    target="_blank"
                                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                                >
                                    <Play className="w-3 h-3 fill-current" /> Ver
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
