"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Heart,
    Play,
    Sparkles,
    Flame,
    Lock,
    CheckCircle2,
    Search,
    Film,
    Crown,
    ChevronRight,
    Eye,
    Smartphone,
    ShieldCheck
} from "lucide-react";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";

interface EpisodeItem {
    id: string;
    number: number;
    title: string;
    isFree: boolean;
}

interface DramaItem {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string | null;
    category: string;
    tags?: string | null;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isFeatured: boolean;
    isVertical: boolean;
    viewsCount: number;
    likesCount: number;
    episodes: EpisodeItem[];
}

function SegredosCatalogContent() {
    const searchParams = useSearchParams();
    const [dramas, setDramas] = useState<DramaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [search, setSearch] = useState("");

    // Estado do assinante VIP (vinculado pelo número do WhatsApp)
    const [viewerPhone, setViewerPhone] = useState<string>("");
    const [isVip, setIsVip] = useState<boolean>(false);
    const [planPrice, setPlanPrice] = useState<number>(19.9);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");

    useEffect(() => {
        // Carrega catálogo e preço do plano
        async function loadData() {
            try {
                const [dramasRes, funnelRes] = await Promise.all([
                    fetch("/api/dramas"),
                    fetch("/api/funnel/config")
                ]);
                const dramasData = await dramasRes.json();
                if (dramasData?.dramas) {
                    setDramas(dramasData.dramas);
                }
                const funnelData = await funnelRes.json();
                if (funnelData?.config?.planPrice) {
                    setPlanPrice(Number(funnelData.config.planPrice));
                }
            } catch {
                // fallback
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Verifica acesso VIP via ?phone= na URL (link mágico enviado pelo bot no WhatsApp) ou localStorage
    useEffect(() => {
        const urlPhone = searchParams.get("phone");
        const storedPhone = localStorage.getItem("sdc_viewer_phone");
        const targetPhone = urlPhone || storedPhone || "";

        if (!targetPhone) return;

        async function verifyPhone(phoneToCheck: string) {
            try {
                const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phoneToCheck)}`);
                const data = await res.json();
                if (data?.isVip) {
                    setViewerPhone(data.phone);
                    setIsVip(true);
                    localStorage.setItem("sdc_viewer_phone", data.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                } else if (urlPhone) {
                    setViewerPhone(urlPhone);
                }
            } catch {
                // ignore
            }
        }

        verifyPhone(targetPhone);
    }, [searchParams]);

    const categories = [
        "Todas",
        ...Array.from(new Set(dramas.map((d) => d.category).filter(Boolean)))
    ];

    const filteredDramas = dramas.filter((d) => {
        const matchesCat = selectedCategory === "Todas" || d.category === selectedCategory;
        const matchesSearch =
            !search.trim() ||
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.synopsis.toLowerCase().includes(search.toLowerCase()) ||
            (d.tags || "").toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const featuredDrama = dramas.find((d) => d.isFeatured) || dramas[0];

    return (
        <div className="min-h-screen bg-[#08050a] text-white flex flex-col selection:bg-rose-500 selection:text-white">
            {/* Header Fixo Mobile-First */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08050a]/85 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center shadow-lg shadow-rose-600/30">
                            <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-300 bg-clip-text text-transparent block leading-none">
                                Segredos do Coração
                            </span>
                            <span className="text-[10px] text-rose-400/90 font-medium tracking-widest uppercase">
                                Novelas Verticais & Dramas
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isVip ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden sm:inline">VIP Liberado:</span> {viewerPhone}
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white/90 transition"
                                >
                                    Já Paguei / Entrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition"
                                >
                                    <Crown className="w-3.5 h-3.5" />
                                    <span>Liberar Tudo</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Banner (Novela em Destaque) */}
            {featuredDrama && (
                <section className="relative overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0">
                        <img
                            src={featuredDrama.bannerUrl || featuredDrama.coverUrl}
                            alt={featuredDrama.title}
                            className="w-full h-full object-cover opacity-35 scale-105 blur-[2px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08050a] via-[#08050a]/75 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#08050a] via-[#08050a]/60 to-transparent" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-14 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                        {/* Poster Vertical 9:16 */}
                        <Link
                            href={`/assistir/${featuredDrama.slug}`}
                            className="relative w-44 sm:w-56 aspect-[9/14] rounded-2xl overflow-hidden border-2 border-rose-500/40 shadow-2xl shadow-rose-950/80 shrink-0 group"
                        >
                            <img
                                src={featuredDrama.coverUrl}
                                alt={featuredDrama.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-extrabold uppercase tracking-wider shadow">
                                Top #1 Hoje
                            </div>
                            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                                    <Play className="w-5 h-5 fill-white ml-0.5" />
                                </div>
                            </div>
                        </Link>

                        {/* Informações do Destaque */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                                    <Flame className="w-3.5 h-3.5 text-rose-400" /> Em Alta no Brasil
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/75 text-xs">
                                    <Smartphone className="w-3.5 h-3.5 text-pink-400" /> Novela Vertical 9:16
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/75 text-xs">
                                    {featuredDrama.totalEpisodes} Episódios
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3">
                                {featuredDrama.title}
                            </h1>

                            <p className="text-sm sm:text-base text-white/70 max-w-2xl mb-6 leading-relaxed">
                                {featuredDrama.synopsis}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <Link
                                    href={`/assistir/${featuredDrama.slug}`}
                                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-600/30 flex items-center gap-2 transition"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Assistir Episódio 1 Grátis
                                </Link>

                                {!isVip && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("pix");
                                            setVipModalOpen(true);
                                        }}
                                        className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition"
                                    >
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        Desbloquear Catálogo Completo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Barra de Busca e Categorias */}
            <section className="max-w-7xl mx-auto w-full px-4 pt-6 pb-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Categorias */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                                    selectedCategory === cat
                                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
                                        : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Busca */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar novela ou tema..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>
            </section>

            {/* Grade de Novelas Verticais */}
            <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <Film className="w-5 h-5 text-rose-500" />
                        Catálogo de Novelas & Dramas
                    </h2>
                    <span className="text-xs text-white/50">
                        {filteredDramas.length} {filteredDramas.length === 1 ? "novela disponível" : "novelas disponíveis"}
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="aspect-[9/14] rounded-2xl bg-white/5 animate-pulse border border-white/10"
                            />
                        ))}
                    </div>
                ) : filteredDramas.length === 0 ? (
                    <div className="text-center py-16 bg-white/[0.02] rounded-3xl border border-white/10">
                        <p className="text-white/60 text-sm">Nenhuma novela encontrada para esta busca.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredDramas.map((drama) => (
                            <Link
                                key={drama.id}
                                href={`/assistir/${drama.slug}`}
                                className="group flex flex-col rounded-2xl overflow-hidden bg-[#120c17] border border-white/10 hover:border-rose-500/50 transition shadow-lg hover:shadow-rose-950/40"
                            >
                                {/* Capa 9:14 */}
                                <div className="relative aspect-[9/13] w-full overflow-hidden bg-black">
                                    <img
                                        src={drama.coverUrl}
                                        alt={drama.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#120c17] via-transparent to-black/30" />

                                    {/* Badges */}
                                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-rose-300 border border-rose-500/30">
                                            {drama.category}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-black text-[10px] font-extrabold">
                                            EP 1-{drama.freeEpisodesCount} GRÁTIS
                                        </span>
                                    </div>

                                    {/* Botão Play Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                                        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                            <Play className="w-5 h-5 fill-white ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Rodapé da Imagem */}
                                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/80">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5 text-rose-400" />
                                            {(drama.viewsCount / 1000).toFixed(1)}k
                                        </span>
                                        <span className="font-semibold">
                                            {drama.totalEpisodes} eps
                                        </span>
                                    </div>
                                </div>

                                {/* Texto */}
                                <div className="p-3.5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 group-hover:text-rose-300 transition leading-snug">
                                            {drama.title}
                                        </h3>
                                        <p className="text-xs text-white/55 line-clamp-2 mt-1.5 leading-relaxed">
                                            {drama.synopsis}
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-rose-400">
                                        <span>Assistir agora</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Rodapé */}
            <footer className="border-t border-white/10 bg-[#060308] py-8 px-4 mt-12">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span className="font-bold text-white/80">Segredos do Coração</span>
                        <span>• Todos os direitos reservados.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pagamento e Liberação Automática via Pix
                        </span>
                        <Link href="/dashboard" className="hover:text-white/80 transition">
                            Painel Admin
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Modal de Login com WhatsApp / Desbloqueio Pix Mangofy */}
            <VipAccessModal
                isOpen={vipModalOpen}
                onClose={() => setVipModalOpen(false)}
                onUnlocked={(phone) => {
                    setViewerPhone(phone);
                    setIsVip(true);
                    setVipModalOpen(false);
                }}
                defaultTab={vipModalTab}
                planPrice={planPrice}
            />
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#08050a]" />}>
            <SegredosCatalogContent />
        </Suspense>
    );
}
