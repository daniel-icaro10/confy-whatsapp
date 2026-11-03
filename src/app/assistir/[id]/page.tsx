"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { extractYoutubeId } from "@/lib/segredos-defaults";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";
import { PwaInstallModal } from "@/components/streaming/pwa-install-modal";

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

    const [drama, setDrama] = useState<Drama | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentEpNumber, setCurrentEpNumber] = useState<number>(1);

    const [viewerPhone, setViewerPhone] = useState("");
    const [isVip, setIsVip] = useState(false);
    const [planPrice, setPlanPrice] = useState(19.9);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");
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
                }
                const funnelData = await funnelRes.json();
                if (funnelData?.config?.planPrice) {
                    setPlanPrice(Number(funnelData.config.planPrice));
                }
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        }
        if (dramaIdOrSlug) fetchDrama();
    }, [dramaIdOrSlug, searchParams]);

    useEffect(() => {
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
            <div className="min-h-dvh bg-[#151413] text-[#efe9de] hd-theme flex items-center justify-center">
                <span className="text-xs text-[#efe9de]/55">Carregando episódio...</span>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-dvh bg-[#151413] text-[#efe9de] hd-theme flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-lg font-semibold mb-3">Novela não encontrada</h1>
                <Link href="/" className="hd-btn-sm hd-button-cream">
                    Voltar ao catálogo
                </Link>
            </div>
        );
    }

    const episodes = drama.episodes || [];
    const currentEpisode =
        episodes.find((ep) => ep.number === currentEpNumber) || episodes[0];

    const isEpisodeUnlocked = (ep: Episode) => {
        if (isVip) return true;
        if (ep.isFree) return true;
        if (ep.number <= (drama.freeEpisodesCount || 2)) return true;
        return false;
    };

    const currentUnlocked = currentEpisode ? isEpisodeUnlocked(currentEpisode) : false;
    const youtubeId = currentEpisode ? extractYoutubeId(currentEpisode.youtubeUrl) : null;

    const handleSelectEpisode = (ep: Episode) => {
        setCurrentEpNumber(ep.number);
        if (!isEpisodeUnlocked(ep)) {
            setVipModalTab("pix");
            setVipModalOpen(true);
        }
    };

    const currentIndex = episodes.findIndex((e) => e.number === currentEpNumber);
    const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEp =
        currentIndex >= 0 && currentIndex < episodes.length - 1
            ? episodes[currentIndex + 1]
            : null;

    return (
        <div className="min-h-dvh bg-[#0e0d0c] text-[#efe9de] hd-theme flex flex-col">
            <header className="sticky top-0 z-30 border-b border-[rgb(239_233_222/0.08)] bg-[#151413]/92 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/"
                            className="hd-btn-sm hd-button-quiet text-xs shrink-0"
                        >
                            ← Catálogo
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-semibold text-[#efe9de] truncate">
                                {drama.title}
                            </h1>
                            <p className="text-[11px] text-[#efe9de]/55 tabular-nums">
                                Episódio {String(currentEpisode?.number || 1).padStart(2, "0")} de{" "}
                                {episodes.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="hd-btn-sm hd-button-quiet text-xs hidden sm:inline-flex"
                        >
                            Baixar App (PWA)
                        </button>

                        {isVip ? (
                            <span className="px-3 py-1.5 rounded-full hd-surface text-[#e2b383] text-xs tabular-nums">
                                VIP · {viewerPhone.slice(-4)}
                            </span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="hd-btn-sm hd-button-quiet text-xs"
                                >
                                    Entrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="hd-btn-sm hd-button-cream text-xs"
                                >
                                    Liberar episódios
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto w-full px-0 sm:px-4 py-0 sm:py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div
                        className={`relative w-full ${
                            drama.isVertical
                                ? "max-w-[410px] aspect-[9/16]"
                                : "aspect-video"
                        } bg-black sm:rounded-[22px] overflow-hidden sm:hd-shell`}
                    >
                        {currentUnlocked && currentEpisode ? (
                            currentEpisode.videoUrl ? (
                                <video
                                    key={currentEpisode.id}
                                    src={currentEpisode.videoUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain bg-black"
                                />
                            ) : youtubeId ? (
                                <iframe
                                    key={currentEpisode.id}
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                    title={currentEpisode.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                                    <p className="text-xs text-[#efe9de]/55">
                                        Vídeo indisponível.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-[#151413]">
                                <div className="max-w-xs">
                                    <span className="inline-block px-3 py-1 rounded-full hd-surface text-[#e2b383] text-[11px] font-medium mb-3 tabular-nums">
                                        Episódio {String(currentEpisode?.number || 1).padStart(2, "0")} · Exclusivo Assinantes
                                    </span>
                                    <h2 className="text-xl font-semibold tracking-[-0.015em] text-[#efe9de] mb-2">
                                        Continue assistindo sem limites
                                    </h2>
                                    <p className="text-xs text-[#efe9de]/64 mb-6 leading-relaxed">
                                        Desbloqueie todos os episódios de {drama.title}, todo o catálogo e o aplicativo PWA por R$ {planPrice.toFixed(2).replace(".", ",")}.
                                    </p>

                                    <div className="space-y-2.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVipModalTab("pix");
                                                setVipModalOpen(true);
                                            }}
                                            className="w-full hd-btn hd-button-cream text-xs"
                                        >
                                            Liberar com Pix
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVipModalTab("login");
                                                setVipModalOpen(true);
                                            }}
                                            className="w-full hd-btn hd-button-quiet text-xs"
                                        >
                                            Já sou assinante
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-[410px] px-4 sm:px-0 mt-3.5 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            disabled={!prevEp}
                            onClick={() => prevEp && handleSelectEpisode(prevEp)}
                            className="hd-btn-sm hd-button-quiet disabled:opacity-35"
                        >
                            ← Episódio anterior
                        </button>

                        <button
                            type="button"
                            disabled={!nextEp}
                            onClick={() => nextEp && handleSelectEpisode(nextEp)}
                            className="hd-btn-sm hd-button-cream disabled:opacity-35"
                        >
                            Próximo episódio →
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-5 px-4 sm:px-0 pb-12 space-y-5">
                    <div className="p-5 rounded-[20px] hd-card">
                        <div className="text-[11px] text-[#e2b383] font-medium mb-1">
                            {drama.category}
                        </div>
                        <h2 className="text-lg font-semibold tracking-[-0.012em] text-[#efe9de] mb-1.5">
                            {drama.title}
                        </h2>
                        <p className="text-xs text-[#efe9de]/64 leading-relaxed">
                            {drama.synopsis}
                        </p>
                    </div>

                    <div className="p-5 rounded-[20px] hd-card">
                        <div className="flex items-center justify-between mb-3.5">
                            <h3 className="text-sm font-semibold text-[#efe9de]">
                                Episódios ({episodes.length})
                            </h3>
                            <span className="text-[11px] text-[#e2b383] tabular-nums">
                                Ep. 01 a 0{drama.freeEpisodesCount} grátis
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
                                        className={`py-2 rounded-[12px] text-xs font-medium tabular-nums transition ${
                                            active
                                                ? "hd-button-cream text-[#151413]"
                                                : unlocked
                                                ? "hd-surface text-[#efe9de] hover:border-[rgb(239_233_222/0.25)]"
                                                : "bg-[#151413]/60 border border-[rgb(239_233_222/0.06)] text-[#efe9de]/35"
                                        }`}
                                    >
                                        {String(ep.number).padStart(2, "0")}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="divide-y divide-[rgb(239_233_222/0.08)] max-h-72 overflow-y-auto styled-scrollbar">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`w-full text-left py-2.5 px-2.5 flex items-center justify-between gap-3 transition ${
                                            active ? "bg-[#efe9de]/[0.06] rounded-[10px]" : ""
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="text-xs font-medium text-[#efe9de] truncate">
                                                {ep.title}
                                            </div>
                                            {ep.description && (
                                                <div className="text-[11px] text-[#efe9de]/45 truncate">
                                                    {ep.description}
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className={`text-[11px] shrink-0 tabular-nums ${
                                                unlocked ? "text-[#e2b383]" : "text-[#efe9de]/40"
                                            }`}
                                        >
                                            {unlocked ? "Liberado" : "Assinantes"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 rounded-[18px] hd-plan flex items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-semibold text-[#efe9de]">
                                Versão Aplicativo (PWA)
                            </div>
                            <div className="text-[11px] text-[#efe9de]/60">
                                Assista em tela cheia direto da tela inicial
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="hd-btn-sm hd-button-quiet text-xs shrink-0"
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

export default function WatchDramaPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-[#151413]" />}>
            <WatchDramaContent />
        </Suspense>
    );
}
