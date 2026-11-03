"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { extractYoutubeId } from "@/lib/segredos-defaults";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";

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
                    if (data.drama.episodes?.length > 0) {
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
    }, [dramaIdOrSlug]);

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
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <span className="text-xs text-neutral-400">Carregando...</span>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-lg font-semibold mb-3">Novela não encontrada</h1>
                <Link
                    href="/"
                    className="px-4 py-2 rounded bg-white text-black text-xs font-medium"
                >
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
    const nextEp = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <header className="sticky top-0 z-30 border-b border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/"
                            className="px-2.5 py-1 rounded border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-300 shrink-0"
                        >
                            Voltar
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm font-medium truncate">
                                {drama.title}
                            </h1>
                            <p className="text-[11px] text-neutral-400">
                                Episódio {currentEpisode?.number || 1} de {episodes.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {isVip ? (
                            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
                                Acesso ativo ({viewerPhone})
                            </span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-300"
                                >
                                    Entrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded bg-white text-black text-xs font-medium"
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
                                ? "max-w-[400px] aspect-[9/16]"
                                : "aspect-video"
                        } bg-black sm:rounded-lg overflow-hidden border-y sm:border border-neutral-800`}
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
                                    <p className="text-xs text-neutral-400">
                                        Vídeo indisponível.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-[#111111]">
                                <div className="max-w-xs">
                                    <span className="inline-block px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px] mb-3">
                                        Episódio {currentEpisode?.number} bloqueado
                                    </span>
                                    <h2 className="text-lg font-semibold mb-2">
                                        Libere o acesso para continuar assistindo
                                    </h2>
                                    <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                                        Desbloqueie todos os episódios de {drama.title} e todo o catálogo por R$ {planPrice.toFixed(2).replace(".", ",")}.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("pix");
                                            setVipModalOpen(true);
                                        }}
                                        className="w-full py-2.5 px-4 rounded bg-white hover:bg-neutral-200 text-black font-medium text-xs mb-2.5 transition"
                                    >
                                        Liberar com Pix
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("login");
                                            setVipModalOpen(true);
                                        }}
                                        className="w-full py-2 px-4 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 transition"
                                    >
                                        Já tenho acesso
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-[400px] px-4 sm:px-0 mt-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            disabled={!prevEp}
                            onClick={() => prevEp && handleSelectEpisode(prevEp)}
                            className="px-3.5 py-2 rounded border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-300 disabled:opacity-30 transition"
                        >
                            Episódio anterior
                        </button>

                        <button
                            type="button"
                            disabled={!nextEp}
                            onClick={() => nextEp && handleSelectEpisode(nextEp)}
                            className="px-3.5 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium disabled:opacity-30 transition"
                        >
                            Próximo episódio
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-5 px-4 sm:px-0 pb-12 space-y-5">
                    <div className="p-4 rounded-lg bg-[#121212] border border-neutral-800">
                        <div className="text-[11px] text-neutral-400 mb-1">
                            {drama.category}
                        </div>
                        <h2 className="text-base font-semibold mb-1.5">{drama.title}</h2>
                        <p className="text-xs text-neutral-400 leading-relaxed">{drama.synopsis}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#121212] border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium">
                                Episódios ({episodes.length})
                            </h3>
                            <span className="text-[11px] text-neutral-400">
                                1 a {drama.freeEpisodesCount} gratuitos
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 mb-4">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`py-2 rounded text-xs font-medium border transition ${
                                            active
                                                ? "bg-white border-white text-black"
                                                : unlocked
                                                ? "bg-[#0a0a0a] hover:bg-neutral-800 border-neutral-800 text-neutral-200"
                                                : "bg-[#0a0a0a] border-neutral-900 text-neutral-500"
                                        }`}
                                    >
                                        {ep.number}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="divide-y divide-neutral-800 max-h-80 overflow-y-auto">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`w-full text-left py-2.5 px-2 flex items-center justify-between gap-3 transition ${
                                            active ? "bg-neutral-800/50 rounded" : ""
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="text-xs font-medium text-white truncate">
                                                {ep.title}
                                            </div>
                                            {ep.description && (
                                                <div className="text-[11px] text-neutral-500 truncate">
                                                    {ep.description}
                                                </div>
                                            )}
                                        </div>

                                        <span className="text-[11px] text-neutral-400 shrink-0">
                                            {unlocked ? "Liberado" : "Bloqueado"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
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
        </div>
    );
}

export default function WatchDramaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
            <WatchDramaContent />
        </Suspense>
    );
}
