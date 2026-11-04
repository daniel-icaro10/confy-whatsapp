"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DEFAULT_OFFER_PLANS, extractYoutubeId, OfferPlan } from "@/lib/segredos-defaults";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";
import { PwaInstallModal } from "@/components/streaming/pwa-install-modal";
import { FramedYoutubePlayer } from "@/components/streaming/framed-youtube-player";

interface Episode {
    id: string;
    number: number;
    title: string;
    description?: string | null;
    youtubeUrl: string;
    videoUrl?: string | null;
    durationSeconds: number;
    isFree: boolean;
}

interface Drama {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string | null;
    category: string;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isVertical: boolean;
    likesCount: number;
    episodes: Episode[];
}

function WatchDramaContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const dramaIdOrSlug = String(params?.id || "");
    const { data: session } = useSession();
    const isAdmin = Boolean(session?.user);

    const [drama, setDrama] = useState<Drama | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentEpNumber, setCurrentEpNumber] = useState<number>(1);

    const [viewerPhone, setViewerPhone] = useState("");
    const [isVip, setIsVip] = useState(false);
    const [plans, setPlans] = useState<OfferPlan[]>(DEFAULT_OFFER_PLANS);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");
    const [vipInitialPlan, setVipInitialPlan] = useState<"monthly" | "quarterly" | "annual">("annual");
    const [pwaModalOpen, setPwaModalOpen] = useState(false);

    useEffect(() => {
        async function fetchDrama() {
            try {
                const [dramaRes, funnelRes] = await Promise.all([
                    fetch(`/api/dramas/${encodeURIComponent(dramaIdOrSlug)}`),
                    fetch("/api/funnel/config")
                ]);
                const data = await dramaRes.json();
                if (data?.drama) {
                    setDrama(data.drama);
                    const epParam = Number(searchParams.get("ep"));
                    if (epParam && epParam > 0) {
                        setCurrentEpNumber(epParam);
                    } else if (data.drama.episodes?.length > 0) {
                        setCurrentEpNumber(data.drama.episodes[0].number);
                    }
                } else {
                    const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                        (d) => d.slug === dramaIdOrSlug || d.id === dramaIdOrSlug
                    );
                    if (fallback) {
                        setDrama({
                            id: fallback.id,
                            title: fallback.title,
                            slug: fallback.slug,
                            synopsis: fallback.synopsis,
                            coverUrl: fallback.coverUrl,
                            bannerUrl: fallback.bannerUrl || fallback.coverUrl,
                            category: fallback.category,
                            totalEpisodes: fallback.totalEpisodes,
                            freeEpisodesCount: fallback.freeEpisodesCount,
                            isVertical: fallback.isVertical,
                            likesCount: fallback.likesCount,
                            episodes: fallback.episodes.map((ep) => ({
                                id: `${fallback.id}-ep-${ep.number}`,
                                number: ep.number,
                                title: ep.title,
                                description: ep.description,
                                youtubeUrl: ep.youtubeUrl,
                                durationSeconds: ep.durationSeconds || 900,
                                isFree: ep.isFree
                            }))
                        });
                        const epParam = Number(searchParams.get("ep"));
                        if (epParam && epParam > 0) {
                            setCurrentEpNumber(epParam);
                        }
                    }
                }
                const funnelData = await funnelRes.json();
                if (Array.isArray(funnelData?.plans) && funnelData.plans.length > 0) {
                    setPlans(funnelData.plans);
                }
            } catch {
                const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                    (d) => d.slug === dramaIdOrSlug || d.id === dramaIdOrSlug
                );
                if (fallback) {
                    setDrama({
                        id: fallback.id,
                        title: fallback.title,
                        slug: fallback.slug,
                        synopsis: fallback.synopsis,
                        coverUrl: fallback.coverUrl,
                        bannerUrl: fallback.bannerUrl || fallback.coverUrl,
                        category: fallback.category,
                        totalEpisodes: fallback.totalEpisodes,
                        freeEpisodesCount: fallback.freeEpisodesCount,
                        isVertical: fallback.isVertical,
                        likesCount: fallback.likesCount,
                        episodes: fallback.episodes.map((ep) => ({
                            id: `${fallback.id}-ep-${ep.number}`,
                            number: ep.number,
                            title: ep.title,
                            description: ep.description,
                            youtubeUrl: ep.youtubeUrl,
                            durationSeconds: ep.durationSeconds || 900,
                            isFree: ep.isFree
                        }))
                    });
                }
            } finally {
                setLoading(false);
            }
        }
        if (dramaIdOrSlug) fetchDrama();
    }, [dramaIdOrSlug, searchParams]);

    useEffect(() => {
        if (session?.user) {
            setIsVip(true);
            setViewerPhone(session.user.name || session.user.email || "Admin");
            localStorage.setItem("sdc_viewer_vip", "true");
            return;
        }

        const stripeSessionId = searchParams.get("stripe_session_id");
        if (stripeSessionId) {
            fetch(`/api/stripe/checkout?session_id=${encodeURIComponent(stripeSessionId)}`)
                .then((r) => r.json())
                .then((data) => {
                    if (data?.isPaid && data?.phone) {
                        setViewerPhone(data.phone);
                        setIsVip(true);
                        localStorage.setItem("sdc_viewer_phone", data.phone);
                        localStorage.setItem("sdc_viewer_vip", "true");
                    }
                })
                .catch(() => {});
        }

        const urlPhone = searchParams.get("phone");
        const storedPhone = localStorage.getItem("sdc_viewer_phone");
        const targetPhone = urlPhone || storedPhone || "";
        if (!targetPhone) return;

        async function checkAccess(phone: string) {
            try {
                const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phone)}`);
                const data = await res.json();
                if (data?.isVip) {
                    setViewerPhone(data.phone);
                    setIsVip(true);
                    localStorage.setItem("sdc_viewer_phone", data.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                }
            } catch {
                // ignore
            }
        }
        checkAccess(targetPhone);
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-dvh bg-black text-[#f5f5f5] flex items-center justify-center">
                <span className="text-xs font-semibold text-[#9a9a9a]">
                    Carregando episódio...
                </span>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48] mb-2">
                    TVDRAMA REELS
                </span>
                <h1 className="text-xl font-black text-white mb-4">
                    Série não encontrada
                </h1>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm transition"
                >
                    ← Voltar ao catálogo
                </Link>
            </div>
        );
    }

    const episodes = drama.episodes || [];
    const currentEpisode =
        episodes.find((ep) => ep.number === currentEpNumber) || episodes[0];

    const isEpisodeUnlocked = (ep: Episode) => {
        if (isAdmin || isVip) return true;
        if (ep.isFree) return true;
        if (ep.number <= (drama.freeEpisodesCount || 2)) return true;
        return false;
    };

    const currentUnlocked = currentEpisode ? isEpisodeUnlocked(currentEpisode) : false;
    const youtubeId = currentEpisode ? extractYoutubeId(currentEpisode.youtubeUrl) : null;

    const handleSelectEpisode = (ep: Episode) => {
        setCurrentEpNumber(ep.number);
        if (!isEpisodeUnlocked(ep)) {
            setVipInitialPlan("annual");
            setVipModalTab("pix");
            setVipModalOpen(true);
        }
    };

    const openPlanModal = (planKey: "monthly" | "quarterly" | "annual") => {
        setVipInitialPlan(planKey);
        setVipModalTab("pix");
        setVipModalOpen(true);
    };

    const currentIndex = episodes.findIndex((e) => e.number === currentEpNumber);
    const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEp =
        currentIndex >= 0 && currentIndex < episodes.length - 1
            ? episodes[currentIndex + 1]
            : null;

    const annualPlan = plans.find((p) => p.key === "annual") || DEFAULT_OFFER_PLANS[1];
    const monthlyPlan = plans.find((p) => p.key === "monthly") || DEFAULT_OFFER_PLANS[0];
    const quarterlyPlan = plans.find((p) => p.key === "quarterly") || DEFAULT_OFFER_PLANS[2];

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col select-none">
            {/* CABEÇALHO FIXO PADRÃO TOPDORAMAX */}
            <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#060606]/92 backdrop-blur-xl">
                <div className="max-w-[1280px] mx-auto px-3 sm:px-8 h-[60px] sm:h-[64px] flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Link
                            href="/"
                            className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold shrink-0 transition"
                        >
                            ← Catálogo
                        </Link>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline font-black text-xs tracking-[0.06em] uppercase text-[#e11d48]">
                                    TVDRAMA REELS
                                </span>
                                <span className="hidden sm:inline text-white/25">·</span>
                                <h1 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {drama.title}
                                </h1>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[#9a9a9a] tabular-nums">
                                Episódio {String(currentEpisode?.number || 1).padStart(2, "0")} de{" "}
                                {episodes.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold transition"
                        >
                            Baixar App
                        </button>

                        {isAdmin ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-[11px] sm:text-xs font-bold">
                                    👑 Admin Master · Liberado
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] sm:text-xs font-semibold transition"
                                >
                                    Painel Admin
                                </Link>
                            </div>
                        ) : isVip ? (
                            <span className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#22b868]/15 border border-[#22b868]/30 text-[#4ade8a] text-[11px] sm:text-xs font-bold tabular-nums">
                                Display Liberado{viewerPhone ? ` · ${viewerPhone.slice(-4)}` : ""}
                            </span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-[11px] sm:text-xs font-semibold transition"
                                >
                                    Já paguei
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openPlanModal("annual")}
                                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-[11px] sm:text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                                >
                                    Liberar Catálogo
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1280px] mx-auto w-full px-0 sm:px-8 py-0 sm:py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* COLUNA DO PLAYER */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div
                        className={`relative w-full ${
                            drama.isVertical
                                ? "max-w-[410px] aspect-[9/16]"
                                : "aspect-video"
                        } bg-[#09090b] sm:rounded-[20px] overflow-hidden sm:border sm:border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.85)]`}
                    >
                        {currentUnlocked && currentEpisode ? (
                            currentEpisode.videoUrl ? (
                                <video
                                    key={currentEpisode.id}
                                    src={currentEpisode.videoUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    onEnded={() => nextEp && handleSelectEpisode(nextEp)}
                                    className="w-full h-full object-contain bg-black"
                                />
                            ) : youtubeId ? (
                                <FramedYoutubePlayer
                                    key={currentEpisode.id}
                                    videoId={youtubeId}
                                    title={currentEpisode.title}
                                    episodeNumber={currentEpisode.number}
                                    isVertical={drama.isVertical}
                                    onEnded={() => nextEp && handleSelectEpisode(nextEp)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                                    <p className="text-xs text-[#9a9a9a]">
                                        Vídeo indisponível neste episódio.
                                    </p>
                                </div>
                            )
                        ) : (
                            /* TELA DE EPISÓDIO BLOQUEADO PADRÃO TOPDORAMAX */
                            <div className="w-full h-full relative flex flex-col items-center justify-center p-5 text-center bg-black overflow-y-auto">
                                <img
                                    src={drama.bannerUrl || drama.coverUrl}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-25 blur-sm pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60 pointer-events-none" />

                                <div className="relative z-10 w-full max-w-sm space-y-3">
                                    <span className="inline-block px-3.5 py-1 rounded-full bg-black/80 border border-white/15 text-white text-xs font-bold tabular-nums">
                                        Episódio {String(currentEpisode?.number || 1).padStart(2, "0")} bloqueado
                                    </span>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                                        {drama.title}
                                    </h2>
                                    <p className="text-xs text-[#9a9a9a] leading-relaxed">
                                        Desbloqueie agora para assistir a todos os episódios desta série e liberar todo o catálogo:
                                    </p>

                                    <div className="space-y-2 text-left pt-1">
                                        <button
                                            type="button"
                                            onClick={() => openPlanModal("annual")}
                                            className="relative w-full p-3.5 rounded-2xl border-2 border-[#e11d48] bg-[#e11d48]/15 hover:bg-[#e11d48]/25 shadow-[0_6px_20px_rgba(225,29,72,0.3)] transition block"
                                        >
                                            <span className="absolute -top-2 right-2.5 px-2 py-0.5 rounded-full bg-white text-[#e11d48] text-[10px] font-extrabold uppercase">
                                                Mais escolhido · {annualPlan.topTag}
                                            </span>
                                            <strong className="block text-sm font-extrabold text-white">
                                                Todas as séries (Anual) · R${" "}
                                                {annualPlan.price.toFixed(2).replace(".", ",")}
                                            </strong>
                                            <span className="block text-[11px] text-[#d4d4d8] mt-0.5">
                                                365 dias · Catálogo completo · {annualPlan.badge}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openPlanModal("monthly")}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#0e0e11] hover:bg-[#16161a] transition block"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <strong className="text-xs font-bold text-white">
                                                    {monthlyPlan.name} · R${" "}
                                                    {monthlyPlan.price.toFixed(2).replace(".", ",")}/mês
                                                </strong>
                                                <span className="text-[10px] font-bold text-[#f43f5e]">
                                                    {monthlyPlan.topTag}
                                                </span>
                                            </div>
                                            <span className="block text-[11px] text-[#9a9a9a] mt-0.5">
                                                30 dias · {monthlyPlan.badge}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openPlanModal("quarterly")}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#0e0e11] hover:bg-[#16161a] transition block"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <strong className="text-xs font-bold text-white">
                                                    {quarterlyPlan.name} · R${" "}
                                                    {quarterlyPlan.price.toFixed(2).replace(".", ",")}
                                                </strong>
                                                <span className="text-[10px] font-bold text-[#4ade8a]">
                                                    3 meses
                                                </span>
                                            </div>
                                            <span className="block text-[11px] text-[#9a9a9a] mt-0.5">
                                                90 dias · {quarterlyPlan.badge}
                                            </span>
                                        </button>
                                    </div>

                                    <p className="text-center text-xs text-[#9a9a9a] pt-1">
                                        Já pagou?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVipModalTab("login");
                                                setVipModalOpen(true);
                                            }}
                                            className="text-white font-bold underline"
                                        >
                                            Entre na sua conta
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botões Anterior / Próximo */}
                    <div className="w-full max-w-[410px] px-3 sm:px-0 mt-3.5 flex items-center justify-center gap-2.5 mx-auto">
                        <button
                            type="button"
                            disabled={!prevEp}
                            onClick={() => prevEp && handleSelectEpisode(prevEp)}
                            className="flex-1 py-2 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold text-center transition disabled:opacity-35"
                        >
                            ← Anterior
                        </button>

                        <button
                            type="button"
                            disabled={!nextEp}
                            onClick={() => nextEp && handleSelectEpisode(nextEp)}
                            className="flex-1 py-2 px-3 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.3)] text-center transition disabled:opacity-35"
                        >
                            Próximo →
                        </button>
                    </div>
                </div>

                {/* COLUNA LATERAL DE INFORMAÇÕES E LISTA DE EPISÓDIOS */}
                <div className="lg:col-span-5 w-full max-w-[410px] lg:max-w-none mx-auto px-3 sm:px-0 pb-12 space-y-4">
                    <div className="p-5 rounded-2xl bg-[#0e0e11] border border-white/10">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#e11d48] mb-1">
                            {drama.category}
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-white mb-1.5">
                            {drama.title}
                        </h2>
                        <p className="text-xs text-[#9a9a9a] leading-relaxed">
                            {drama.synopsis}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0e0e11] border border-white/10">
                        <div className="flex items-center justify-between mb-3.5">
                            <h3 className="text-sm font-bold text-white">
                                Episódios ({episodes.length})
                            </h3>
                            <span className="text-[11px] font-semibold text-[#4ade8a] tabular-nums">
                                {isVip
                                    ? "Todos os episódios liberados"
                                    : drama.freeEpisodesCount > 0
                                    ? `Ep. 01 a 0${drama.freeEpisodesCount} grátis`
                                    : "Acesso mediante desbloqueio"}
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-2 mb-5">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`py-2 rounded-xl text-xs font-bold tabular-nums transition ${
                                            active
                                                ? "bg-[#e11d48] text-white shadow-[0_4px_14px_rgba(225,29,72,0.35)]"
                                                : unlocked
                                                ? "bg-[#16161b] border border-white/15 text-white hover:border-white/35"
                                                : "bg-[#09090b] border border-white/[0.06] text-[#6e6e77]"
                                        }`}
                                    >
                                        {String(ep.number).padStart(2, "0")}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto styled-scrollbar">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`w-full text-left py-2.5 px-2.5 flex items-center justify-between gap-3 transition ${
                                            active ? "bg-white/[0.06] rounded-xl" : ""
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-white truncate">
                                                {ep.title}
                                            </div>
                                            {ep.description && (
                                                <div className="text-[11px] text-[#9a9a9a] truncate">
                                                    {ep.description}
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className={`text-[11px] font-bold shrink-0 tabular-nums ${
                                                unlocked ? "text-[#4ade8a]" : "text-[#9a9a9a]"
                                            }`}
                                        >
                                            {unlocked ? "Liberado" : "Bloqueado"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0e0e11] border border-white/10 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-bold text-white">
                                Aplicativo TvDrama Reels (PWA)
                            </div>
                            <div className="text-[11px] text-[#9a9a9a]">
                                Instale na tela inicial para assistir em tela cheia
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold shrink-0 transition"
                        >
                            Baixar App
                        </button>
                    </div>
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
                dramaId={drama.slug}
                dramaTitle={drama.title}
                defaultTab={vipModalTab}
                initialPlanKey={vipInitialPlan}
                plans={plans}
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

export default function WatchDramaPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <WatchDramaContent />
        </Suspense>
    );
}
