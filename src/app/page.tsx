"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";
import { PwaInstallModal } from "@/components/streaming/pwa-install-modal";

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

    const [viewerPhone, setViewerPhone] = useState<string>("");
    const [isVip, setIsVip] = useState<boolean>(false);
    const [planPrice, setPlanPrice] = useState<number>(19.9);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");
    const [pwaModalOpen, setPwaModalOpen] = useState(false);

    useEffect(() => {
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
        "Em Alta",
        ...Array.from(new Set(dramas.map((d) => d.category).filter(Boolean)))
    ];

    const filteredDramas = dramas.filter((d) => {
        const matchesCat =
            selectedCategory === "Todas"
                ? true
                : selectedCategory === "Em Alta"
                ? d.isFeatured || d.viewsCount >= 10000
                : d.category === selectedCategory;
        const matchesSearch =
            !search.trim() ||
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.synopsis.toLowerCase().includes(search.toLowerCase()) ||
            d.category.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const featuredDrama = dramas.find((d) => d.isFeatured) || dramas[0];
    const topDramas = [...dramas].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 6);
    const totalEpisodesCount = dramas.reduce((acc, d) => acc + (d.totalEpisodes || 0), 0);

    function formatViews(views: number) {
        if (!views || views < 1000) return `${views || 950} visualizações`;
        return `${(views / 1000).toFixed(1).replace(".", ",")} mil`;
    }

    return (
        <div className="min-h-dvh lg:h-dvh w-full lg:overflow-hidden bg-[#0e0d0c] text-[#efe9de] hd-theme flex flex-col lg:flex-row">
            {/* LEFT PANEL — HEYDAMIR.DESIGN EDITORIAL SIDEBAR */}
            <aside className="w-full lg:w-[clamp(26rem,28vw,32rem)] lg:h-full shrink-0 hd-sidebar border-b lg:border-b-0 border-[rgb(239_233_222/0.1)] z-20 flex flex-col justify-between px-6 py-6 lg:px-10 lg:py-9">
                {/* Top Identity Row */}
                <div className="hd-rise flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[#151413] text-[#efe9de] font-semibold text-xs tracking-tight flex items-center justify-center shadow-[0_0_0_1px_rgb(0_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.12)]">
                            TD
                        </div>
                        <div className="flex flex-col leading-[1.3]">
                            <span className="text-[15px] font-semibold text-[#efe9de]">
                                TvDrama Reels
                            </span>
                            <span className="text-xs text-[#efe9de]/55">
                                Novelas verticais · HD 1080p
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        {isVip ? (
                            <button
                                type="button"
                                onClick={() => setPwaModalOpen(true)}
                                className="hd-btn-sm hd-button-quiet text-xs tabular-nums"
                            >
                                VIP · {viewerPhone.slice(-4)}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setVipModalTab("login");
                                    setVipModalOpen(true);
                                }}
                                className="hd-btn-sm hd-button-quiet"
                            >
                                Entrar
                            </button>
                        )}
                    </div>
                </div>

                {/* Editorial Hero Copy */}
                <div className="my-8 lg:my-0 flex flex-col">
                    <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full hd-chip text-[11px] text-[#efe9de]/75 mb-4">
                        <span className="size-1.5 rounded-full bg-[#e2b383]" />
                        <span>Inspirado no formato DramaWave · 9:16</span>
                    </div>

                    <h1 className="hd-rise text-[1.95rem] sm:text-[2.25rem] lg:text-[clamp(2.15rem,2.35vw,2.55rem)] leading-[1.08] font-medium tracking-[-0.016em] text-balance text-[#efe9de]">
                        Histórias intensas feitas para maratonar no{" "}
                        <span className="hd-glow-text">celular</span>
                    </h1>

                    <p className="hd-rise mt-4 max-w-[25rem] text-[15px] leading-[1.55] text-[#efe9de]/64 font-normal">
                        Episódios rápidos de 1 a 3 minutos com tramas de romance proibido, vingança e segredos de família. Assista aos primeiros episódios gratuitamente.
                    </p>

                    <div className="hd-rise mt-7 flex flex-wrap items-center gap-3">
                        {isVip && featuredDrama ? (
                            <Link
                                href={`/assistir/${featuredDrama.slug}`}
                                className="hd-btn hd-button-cream gap-2.5"
                            >
                                <span>Assistir série em destaque</span>
                                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                                    <path
                                        d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setVipModalTab("pix");
                                    setVipModalOpen(true);
                                }}
                                className="hd-btn hd-button-cream gap-2.5"
                            >
                                <span>Liberar catálogo completo</span>
                                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                                    <path
                                        d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="hd-btn hd-button-quiet"
                        >
                            Baixar App (PWA)
                        </button>
                    </div>

                    {/* Structured Metrics Strip */}
                    <div className="mt-8 grid grid-cols-3 gap-2.5">
                        <div className="rounded-[14px] p-3 hd-surface">
                            <div className="text-base font-semibold text-[#efe9de] tabular-nums">
                                {totalEpisodesCount || 180}+
                            </div>
                            <div className="text-[11px] text-[#efe9de]/50 mt-0.5">
                                Episódios HD
                            </div>
                        </div>
                        <div className="rounded-[14px] p-3 hd-surface">
                            <div className="text-base font-semibold text-[#efe9de] tabular-nums">
                                1–3 min
                            </div>
                            <div className="text-[11px] text-[#efe9de]/50 mt-0.5">
                                Por episódio
                            </div>
                        </div>
                        <div
                            onClick={() => setPwaModalOpen(true)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") setPwaModalOpen(true);
                            }}
                            className="rounded-[14px] p-3 hd-surface hover:border-[rgb(239_233_222/0.25)] transition cursor-pointer"
                        >
                            <div className="text-base font-semibold text-[#e2b383]">
                                App PWA
                            </div>
                            <div className="text-[11px] text-[#efe9de]/50 mt-0.5">
                                Para assinantes
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Sidebar Footer */}
                <footer className="border-t border-[rgb(239_233_222/0.12)] pt-5 flex items-center justify-between gap-4 text-xs text-[#efe9de]/45">
                    <span className="tabular-nums">
                        Passe completo · R$ {planPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="hover:text-[#efe9de] transition"
                        >
                            Instalar App
                        </button>
                        <Link href="/dashboard" className="hover:text-[#efe9de] transition">
                            Admin
                        </Link>
                    </div>
                </footer>
            </aside>

            {/* RIGHT MAIN STAGE — DRAMAWAVE STREAMING SHOWCASE */}
            <main className="flex-1 lg:h-full lg:overflow-y-auto styled-scrollbar">
                {/* Sticky Top Bar */}
                <div className="sticky top-0 z-30 bg-[#0e0d0c]/90 backdrop-blur-md border-b border-[rgb(239_233_222/0.08)] px-4 sm:px-8 py-3.5">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map((cat) => {
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                                            active
                                                ? "hd-button-cream text-[#151413]"
                                                : "hd-chip text-[#efe9de]/75 hover:text-[#efe9de]"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="relative flex-1 sm:w-60">
                                <input
                                    type="text"
                                    placeholder="Buscar novela ou tema..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-1.5 rounded-full hd-pill-field text-xs text-[#efe9de] placeholder:text-[#efe9de]/40"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setPwaModalOpen(true)}
                                className="hd-btn-sm hd-button-quiet text-xs shrink-0 hidden sm:inline-flex"
                            >
                                App PWA
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-10">
                    {/* 1. FEATURED SPOTLIGHT CARD (DRAMAWAVE HERO) */}
                    {featuredDrama && !search.trim() && selectedCategory === "Todas" && (
                        <section className="rounded-[24px] hd-shell p-5 sm:p-7">
                            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-8">
                                <Link
                                    href={`/assistir/${featuredDrama.slug}`}
                                    className="w-44 sm:w-52 aspect-[9/14] rounded-[16px] overflow-hidden shrink-0 relative group shadow-[0_0_0_1px_rgb(0_0_0/0.6),0_24px_48px_-12px_rgb(0_0_0/0.85)]"
                                >
                                    <img
                                        src={featuredDrama.coverUrl}
                                        alt={featuredDrama.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#151413]/90 border border-[rgb(239_233_222/0.16)] text-[10px] font-medium text-[#e2b383]">
                                        Série em Destaque
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#efe9de]/90 tabular-nums">
                                        <span>{featuredDrama.totalEpisodes} episódios</span>
                                        <span>9:16 HD</span>
                                    </div>
                                </Link>

                                <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                                    <div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-[#efe9de]/55 tabular-nums mb-2.5">
                                            <span className="text-[#e2b383] font-medium">
                                                {featuredDrama.category}
                                            </span>
                                            <span>·</span>
                                            <span>{featuredDrama.totalEpisodes} episódios completos</span>
                                            <span>·</span>
                                            <span>
                                                Primeiros {featuredDrama.freeEpisodesCount} episódios grátis
                                            </span>
                                            <span>·</span>
                                            <span>{formatViews(featuredDrama.viewsCount)}</span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.015em] text-[#efe9de] mb-3">
                                            {featuredDrama.title}
                                        </h2>

                                        <p className="text-sm text-[#efe9de]/64 leading-relaxed max-w-2xl mb-5">
                                            {featuredDrama.synopsis}
                                        </p>

                                        {/* Quick Episode Preview Strip (DramaWave Style) */}
                                        <div className="mb-6">
                                            <div className="text-[11px] text-[#efe9de]/45 mb-2 font-medium">
                                                Acesso rápido aos episódios:
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                                {[1, 2, 3, 4, 5].map((epNum) => {
                                                    const isFreeEp =
                                                        epNum <= (featuredDrama.freeEpisodesCount || 3);
                                                    return (
                                                        <Link
                                                            key={epNum}
                                                            href={`/assistir/${featuredDrama.slug}?ep=${epNum}`}
                                                            className="px-3 py-1.5 rounded-full hd-surface hover:border-[rgb(239_233_222/0.25)] text-xs tabular-nums transition flex items-center gap-1.5"
                                                        >
                                                            <span className="text-[#efe9de] font-medium">
                                                                Ep. {String(epNum).padStart(2, "0")}
                                                            </span>
                                                            <span
                                                                className={`text-[10px] ${
                                                                    isFreeEp || isVip
                                                                        ? "text-[#e2b383]"
                                                                        : "text-[#efe9de]/40"
                                                                }`}
                                                            >
                                                                {isFreeEp || isVip ? "Livre" : "VIP"}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                        <Link
                                            href={`/assistir/${featuredDrama.slug}`}
                                            className="hd-btn hd-button-cream gap-2"
                                        >
                                            <span>Assistir Episódio 01</span>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                aria-hidden="true"
                                                className="size-4"
                                            >
                                                <path
                                                    d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Link>

                                        {!isVip && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVipModalTab("pix");
                                                    setVipModalOpen(true);
                                                }}
                                                className="hd-btn hd-button-quiet"
                                            >
                                                Desbloquear todos os episódios
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 2. TOP RANKING ROW (DRAMAWAVE TRENDING REELS) */}
                    {topDramas.length > 0 && !search.trim() && selectedCategory === "Todas" && (
                        <section className="space-y-4">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold tracking-[-0.012em] text-[#efe9de]">
                                        Top em alta na semana
                                    </h3>
                                    <p className="text-xs text-[#efe9de]/50 mt-0.5">
                                        As novelas verticais mais assistidas pelos assinantes
                                    </p>
                                </div>
                                <span className="text-xs text-[#efe9de]/45 tabular-nums">
                                    Ranking atualizado
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                {topDramas.slice(0, 3).map((drama, idx) => (
                                    <Link
                                        key={drama.id}
                                        href={`/assistir/${drama.slug}`}
                                        className="group rounded-[18px] p-3.5 hd-card hover:-translate-y-0.5 transition duration-200 flex items-center gap-3.5"
                                    >
                                        <div className="text-2xl font-semibold text-[#e2b383] tabular-nums w-7 shrink-0 text-center">
                                            0{idx + 1}
                                        </div>

                                        <div className="w-16 aspect-[9/13] rounded-[10px] overflow-hidden bg-black shrink-0 shadow-[0_0_0_1px_rgb(0_0_0/0.5)]">
                                            <img
                                                src={drama.coverUrl}
                                                alt={drama.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <span className="text-[11px] text-[#e2b383] font-medium block truncate">
                                                {drama.category}
                                            </span>
                                            <h4 className="text-sm font-medium text-[#efe9de] truncate mt-0.5">
                                                {drama.title}
                                            </h4>
                                            <div className="text-[11px] text-[#efe9de]/50 tabular-nums mt-1">
                                                {drama.totalEpisodes} eps · {formatViews(drama.viewsCount)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. FULL VERTICAL DRAMA CATALOG GRID */}
                    <section className="space-y-4">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold tracking-[-0.012em] text-[#efe9de]">
                                    {selectedCategory === "Todas"
                                        ? "Catálogo de Novelas Verticais"
                                        : selectedCategory}
                                </h3>
                                <p className="text-xs text-[#efe9de]/50 mt-0.5">
                                    Episódios gravados na proporção 9:16 para tela cheia no celular
                                </p>
                            </div>
                            <span className="text-xs text-[#efe9de]/45 tabular-nums">
                                {filteredDramas.length}{" "}
                                {filteredDramas.length === 1 ? "série" : "séries"}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                {[1, 2, 3, 4].map((n) => (
                                    <div
                                        key={n}
                                        className="aspect-[9/14] rounded-[18px] hd-card animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : filteredDramas.length === 0 ? (
                            <div className="rounded-[20px] p-12 hd-surface text-center">
                                <p className="text-sm text-[#efe9de]/64">
                                    Nenhuma novela encontrada para este filtro.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                {filteredDramas.map((drama) => (
                                    <Link
                                        key={drama.id}
                                        href={`/assistir/${drama.slug}`}
                                        className="group flex flex-col rounded-[18px] overflow-hidden hd-card hover:-translate-y-1 transition duration-200"
                                    >
                                        <div className="relative aspect-[9/13] w-full overflow-hidden bg-[#0a0908]">
                                            <img
                                                src={drama.coverUrl}
                                                alt={drama.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-transparent to-black/20 opacity-90" />

                                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#151413]/85 border border-[rgb(239_233_222/0.14)] text-[10px] font-medium text-[#efe9de]">
                                                {drama.category}
                                            </div>

                                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-[#efe9de]/85 tabular-nums">
                                                <span>{drama.totalEpisodes} eps</span>
                                                <span className="text-[#e2b383] font-medium">
                                                    {drama.freeEpisodesCount} grátis
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium text-sm text-[#efe9de] line-clamp-2 leading-snug">
                                                    {drama.title}
                                                </h4>
                                                <p className="text-xs text-[#efe9de]/55 line-clamp-2 mt-1.5 leading-relaxed">
                                                    {drama.synopsis}
                                                </p>
                                            </div>

                                            <div className="mt-3.5 pt-2.5 border-t border-[rgb(239_233_222/0.08)] flex items-center justify-between text-[11px]">
                                                <span className="text-[#efe9de]/45 tabular-nums">
                                                    {formatViews(drama.viewsCount)}
                                                </span>
                                                <span className="text-[#efe9de] font-medium group-hover:text-[#e2b383] transition">
                                                    Assistir →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 4. SUBSCRIBER PWA APP BANNER */}
                    <section className="rounded-[24px] p-6 sm:p-8 hd-plan">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="max-w-xl space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full hd-surface text-[11px] text-[#e2b383] font-medium">
                                    <span>Versão Aplicativo (PWA) · Exclusivo para Assinantes</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-[#efe9de]">
                                    Baixe o aplicativo no seu celular sem ocupar memória
                                </h3>
                                <p className="text-sm text-[#efe9de]/64 leading-relaxed">
                                    Assinantes podem instalar o aplicativo TvDrama Reels diretamente na tela inicial do iPhone (iOS) ou Android para assistir às novelas em tela cheia vertical, sem barras de navegador e com login salvo.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setPwaModalOpen(true)}
                                    className="hd-btn hd-button-cream"
                                >
                                    {isVip ? "Instalar Aplicativo Agora" : "Como baixar o App"}
                                </button>
                                {!isVip && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("pix");
                                            setVipModalOpen(true);
                                        }}
                                        className="hd-btn hd-button-quiet"
                                    >
                                        Tornar-se assinante
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

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

            <PwaInstallModal
                isOpen={pwaModalOpen}
                onClose={() => setPwaModalOpen(false)}
                isVip={isVip}
                viewerPhone={viewerPhone}
                onRequestVipModal={(tab) => {
                    setVipModalTab(tab);
                    setVipModalOpen(true);
                }}
            />
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-[#151413]" />}>
            <SegredosCatalogContent />
        </Suspense>
    );
}
