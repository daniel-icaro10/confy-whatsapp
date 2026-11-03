"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Heart,
    Lock,
    Play,
    SkipForward,
    SkipBack,
    CheckCircle2,
    Crown,
    Sparkles,
    ListVideo,
    Share2
} from "lucide-react";
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
    const [liked, setLiked] = useState(false);

    // Controle de acesso VIP
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

    // Auto-verificação de VIP via ?phone= ou localStorage
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
            <div className="min-h-screen bg-[#070409] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-white/60">Carregando episódios...</span>
                </div>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-screen bg-[#070409] text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-xl font-bold mb-2">Novela não encontrada</h1>
                <Link
                    href="/"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold mt-2"
                >
                    Voltar ao Catálogo
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
        <div className="min-h-screen bg-[#070409] text-white flex flex-col">
            {/* Barra Superior */}
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070409]/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/"
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center shrink-0 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold truncate">
                                {drama.title}
                            </h1>
                            <p className="text-[11px] text-rose-400 font-medium">
                                Episódio {currentEpisode?.number || 1} de {episodes.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {isVip ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                VIP Ativo
                            </span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold"
                                >
                                    Já Paguei
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-bold flex items-center gap-1 shadow-lg shadow-rose-600/30"
                                >
                                    <Crown className="w-3.5 h-3.5" />
                                    Destravar VIP
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Área Principal: Player Vertical 9:16 + Lista de Episódios */}
            <main className="max-w-7xl mx-auto w-full px-0 sm:px-4 py-0 sm:py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Coluna do Player Vertical (Estilo ReelShort / TikTok) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div
                        className={`relative w-full ${
                            drama.isVertical
                                ? "max-w-[420px] aspect-[9/16]"
                                : "aspect-video"
                        } bg-black sm:rounded-3xl overflow-hidden border-y sm:border border-white/15 shadow-2xl shadow-rose-950/50`}
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
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                    <p className="text-sm text-white/70">
                                        Link de vídeo inválido para este episódio.
                                    </p>
                                </div>
                            )
                        ) : (
                            /* Tela de Episódio Bloqueado (VIP) */
                            <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center">
                                <img
                                    src={drama.coverUrl}
                                    alt={drama.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />

                                <div className="relative z-10 flex flex-col items-center max-w-xs">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-600/40 mb-4">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        Episódio {currentEpisode?.number} Exclusivo VIP
                                    </span>
                                    <h2 className="text-xl font-extrabold mb-2">
                                        O melhor da história acontece agora! 😱
                                    </h2>
                                    <p className="text-xs text-white/70 mb-6 leading-relaxed">
                                        Libere agora todos os episódios de{" "}
                                        <strong className="text-white">{drama.title}</strong> + todo o nosso catálogo de novelas verticais no seu celular.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("pix");
                                            setVipModalOpen(true);
                                        }}
                                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 mb-3 transition"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Destravar Agora por R$ {planPrice.toFixed(2).replace(".", ",")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("login");
                                            setVipModalOpen(true);
                                        }}
                                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white/85 transition"
                                    >
                                        Já paguei no WhatsApp (Digitar meu número)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Barra de Controles Abaixo do Player (Anterior / Próximo Episódio / Curtir) */}
                    <div className="w-full max-w-[420px] px-4 sm:px-0 mt-4 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            disabled={!prevEp}
                            onClick={() => prevEp && handleSelectEpisode(prevEp)}
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-35 transition"
                        >
                            <SkipBack className="w-4 h-4" /> Anterior
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setLiked(!liked)}
                                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                                    liked
                                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                                        : "bg-white/5 border-white/10 text-white/75"
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
                                {(drama.likesCount + (liked ? 1 : 0)).toLocaleString("pt-BR")}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: drama.title,
                                            url: window.location.href
                                        }).catch(() => {});
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                    }
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/75"
                                title="Compartilhar"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            disabled={!nextEp}
                            onClick={() => nextEp && handleSelectEpisode(nextEp)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-xs font-bold flex items-center gap-1.5 disabled:opacity-35 shadow-lg shadow-rose-600/25 transition"
                        >
                            Próximo Ep. <SkipForward className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Coluna Lateral: Detalhes da Novela e Grade de Episódios */}
                <div className="lg:col-span-5 px-4 sm:px-0 pb-12 space-y-6">
                    {/* Card da Novela */}
                    <div className="p-5 rounded-3xl bg-[#120c18] border border-white/10">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 text-[11px] font-bold mb-2">
                            {drama.category}
                        </span>
                        <h2 className="text-lg font-bold mb-1.5">{drama.title}</h2>
                        <p className="text-xs text-white/65 leading-relaxed">{drama.synopsis}</p>
                    </div>

                    {/* Lista / Seletor de Episódios */}
                    <div className="p-5 rounded-3xl bg-[#120c18] border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <ListVideo className="w-4 h-4 text-rose-400" />
                                Episódios ({episodes.length})
                            </h3>
                            <span className="text-[11px] text-emerald-400 font-semibold">
                                Ep. 1 a {drama.freeEpisodesCount} Grátis
                            </span>
                        </div>

                        {/* Grade Rápida de Botões de Episódio */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-5">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`relative py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition ${
                                            active
                                                ? "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30"
                                                : unlocked
                                                ? "bg-white/5 hover:bg-white/10 border-white/10 text-white/90"
                                                : "bg-black/40 hover:bg-rose-950/30 border-rose-500/20 text-white/50"
                                        }`}
                                    >
                                        <span>{ep.number}</span>
                                        {!unlocked && (
                                            <Lock className="w-3 h-3 text-amber-400 absolute top-1 right-1" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Lista Detalhada de Episódios */}
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                            {episodes.map((ep) => {
                                const unlocked = isEpisodeUnlocked(ep);
                                const active = ep.number === currentEpNumber;
                                return (
                                    <button
                                        key={ep.id}
                                        type="button"
                                        onClick={() => handleSelectEpisode(ep)}
                                        className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                                            active
                                                ? "bg-rose-500/15 border-rose-500/40"
                                                : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                                                    active
                                                        ? "bg-rose-600 text-white"
                                                        : unlocked
                                                        ? "bg-white/10 text-white"
                                                        : "bg-amber-500/15 text-amber-400"
                                                }`}
                                            >
                                                {unlocked ? <Play className="w-3.5 h-3.5 fill-current" /> : <Lock className="w-3.5 h-3.5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold truncate">
                                                    {ep.title}
                                                </div>
                                                {ep.description && (
                                                    <div className="text-[11px] text-white/50 truncate">
                                                        {ep.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                                unlocked
                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                    : "bg-amber-500/15 text-amber-300"
                                            }`}
                                        >
                                            {unlocked ? "Liberado" : "VIP"}
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
        <Suspense fallback={<div className="min-h-screen bg-[#070409]" />}>
            <WatchDramaContent />
        </Suspense>
    );
}

