"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Heart,
    Plus,
    Check,
    Bookmark,
    Send,
    Layers,
    Download,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Globe,
    Search,
    Home,
    Compass,
    User,
    Lock,
    X,
    ChevronUp,
    ChevronDown,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { DEFAULT_OFFER_PLANS, extractYoutubeId, extractDailymotionId, OfferPlan } from "@/lib/segredos-defaults";
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

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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
    const [isFullVip, setIsFullVip] = useState(false);
    const [unlockedDramas, setUnlockedDramas] = useState<string[]>([]);
    const [plans, setPlans] = useState<OfferPlan[]>(DEFAULT_OFFER_PLANS);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");
    const [vipInitialPlan, setVipInitialPlan] = useState<"monthly" | "quarterly" | "annual">("annual");
    const [pwaModalOpen, setPwaModalOpen] = useState(false);

    // Lateral Reels Actions State
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(49200);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Video Player State
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(90);
    const [speed, setSpeed] = useState<number>(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [transitionBadge, setTransitionBadge] = useState<string | null>(null);

    // Toast feedback helper
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2200);
    };

    // Transition badge helper
    const showTransition = (msg: string) => {
        setTransitionBadge(msg);
        setTimeout(() => setTransitionBadge(null), 900);
    };

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
                    if (data.drama.likesCount) {
                        setLikesCount(data.drama.likesCount);
                    }
                    const epParam = Number(searchParams.get("ep"));
                    if (epParam && epParam > 0) {
                        setCurrentEpNumber(epParam);
                    } else if (data.drama.episodes?.length > 0) {
                        setCurrentEpNumber(data.drama.episodes[0].number);
                    }
                }
                const funnelData = await funnelRes.json();
                if (Array.isArray(funnelData?.plans) && funnelData.plans.length > 0) {
                    setPlans(funnelData.plans);
                }
            } catch {
                // Ignore network error; fallback handled gracefully by UI
            } finally {
                setLoading(false);
            }
        }
        if (dramaIdOrSlug) fetchDrama();
    }, [dramaIdOrSlug, searchParams]);

    // Local Storage preferences (Likes, Following, Saved)
    useEffect(() => {
        if (!drama) return;
        try {
            const savedFollow = localStorage.getItem(`sdc_follow_${drama.id}`);
            if (savedFollow === "true") setIsFollowing(true);

            const savedItem = localStorage.getItem(`sdc_saved_${drama.id}`);
            if (savedItem === "true") setIsSaved(true);

            const savedLiked = localStorage.getItem(`sdc_liked_${drama.id}_${currentEpNumber}`);
            if (savedLiked === "true") setIsLiked(true);
            else setIsLiked(false);
        } catch {
            // ignore
        }
    }, [drama, currentEpNumber]);

    // VIP and Session check
    useEffect(() => {
        // Leitura local imediata de cache
        try {
            const storedFullVip = localStorage.getItem("sdc_is_full_vip") === "true";
            if (storedFullVip) setIsFullVip(true);
            const storedDramas = localStorage.getItem("sdc_unlocked_dramas");
            if (storedDramas) {
                const list = JSON.parse(storedDramas);
                if (Array.isArray(list)) setUnlockedDramas(list);
            }
        } catch { }

        if (session?.user) {
            setIsVip(true);
            setIsFullVip(true);
            setUnlockedDramas(["*"]);
            setViewerPhone(session.user.name || session.user.email || "Admin");
            localStorage.setItem("sdc_viewer_vip", "true");
            localStorage.setItem("sdc_is_full_vip", "true");
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
                .catch(() => { });
        }

        const urlPhone = searchParams.get("phone");
        const storedPhone = localStorage.getItem("sdc_viewer_phone");
        const targetPhone = urlPhone || storedPhone || "";
        if (!targetPhone) return;

        async function checkAccess(phone: string) {
            try {
                const currentSlug = (drama?.slug || dramaIdOrSlug || "").toLowerCase();
                const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phone)}&slug=${encodeURIComponent(currentSlug)}`);
                const data = await res.json();
                if (data?.isVip) {
                    setViewerPhone(data.phone);
                    setIsVip(true);
                    setIsFullVip(Boolean(data.isFullVip));
                    if (Array.isArray(data.unlockedDramas)) {
                        setUnlockedDramas(data.unlockedDramas);
                        localStorage.setItem("sdc_unlocked_dramas", JSON.stringify(data.unlockedDramas));
                    }
                    localStorage.setItem("sdc_viewer_phone", data.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                    if (data.isFullVip) {
                        localStorage.setItem("sdc_is_full_vip", "true");
                    }
                }
            } catch {
                // ignore
            }
        }
        checkAccess(targetPhone);
    }, [searchParams, session, drama?.slug, dramaIdOrSlug]);

    const episodes = drama?.episodes || [];
    const currentEpisode =
        episodes.find((ep) => ep.number === currentEpNumber) || episodes[0];

    const isEpisodeUnlocked = (ep: Episode) => {
        if (isAdmin || isFullVip) return true;

        const currentSlug = (drama?.slug || dramaIdOrSlug || "").toLowerCase();
        const hasSpecificAccess =
            unlockedDramas.includes("*") ||
            unlockedDramas.includes(currentSlug) ||
            (typeof window !== "undefined" && localStorage.getItem(`sdc_unlocked_${currentSlug}`) === "true");

        if (hasSpecificAccess) return true;

        // Se não possui acesso liberado para esta série, apenas os episódios grátis de amostra são liberados
        if (ep.isFree) return true;
        const freeCount =
            typeof drama?.freeEpisodesCount === "number" && drama.freeEpisodesCount >= 0
                ? drama.freeEpisodesCount
                : 2;
        if (ep.number <= freeCount) return true;
        return false;
    };

    const currentUnlocked = currentEpisode ? isEpisodeUnlocked(currentEpisode) : false;
    const youtubeId = currentEpisode ? extractYoutubeId(currentEpisode.youtubeUrl) : null;
    const dailymotionId = currentEpisode ? extractDailymotionId(currentEpisode.youtubeUrl || currentEpisode.videoUrl) : null;

    const currentIndex = episodes.findIndex((e) => e.number === currentEpNumber);
    const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEp =
        currentIndex >= 0 && currentIndex < episodes.length - 1
            ? episodes[currentIndex + 1]
            : null;

    const handleSelectEpisode = (ep: Episode, showAnim = true) => {
        setCurrentEpNumber(ep.number);
        setCurrentTime(0);
        if (showAnim) {
            showTransition(`Episódio ${ep.number}`);
        }
        if (!isEpisodeUnlocked(ep)) {
            setVipInitialPlan("annual");
            setVipModalTab("pix");
            setVipModalOpen(true);
        }
    };

    const goToNextEpisode = () => {
        if (nextEp) {
            handleSelectEpisode(nextEp);
        } else {
            showToast("Você chegou ao último episódio!");
        }
    };

    const goToPrevEpisode = () => {
        if (prevEp) {
            handleSelectEpisode(prevEp);
        } else {
            showToast("Você já está no primeiro episódio!");
        }
    };

    // Wheel Scroll (Mouse/Trackpad Reels Navigation)
    const lastScrollTime = useRef(0);
    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 650) return;
        if (e.deltaY > 35) {
            lastScrollTime.current = now;
            goToNextEpisode();
        } else if (e.deltaY < -35) {
            lastScrollTime.current = now;
            goToPrevEpisode();
        }
    };

    // Touch Swipe (Mobile Reels Navigation)
    const touchStartY = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        touchStartY.current = null;
        if (Math.abs(deltaY) < 45) return;
        if (deltaY < -45) {
            // Swipe UP -> Next Episode
            goToNextEpisode();
        } else if (deltaY > 45) {
            // Swipe DOWN -> Previous Episode
            goToPrevEpisode();
        }
    };

    // Video Engine (HLS & MP4)
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !currentUnlocked || !currentEpisode?.videoUrl) return;

        const src = currentEpisode.videoUrl;
        const isHls = src.includes(".m3u8");

        let hlsInstance: any = null;

        if (isHls && !video.canPlayType("application/vnd.apple.mpegurl")) {
            const initHls = () => {
                const Hls = (window as any).Hls;
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({ enableWorker: true });
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play().catch(() => { });
                        setIsPlaying(true);
                    });
                }
            };

            if ((window as any).Hls) {
                initHls();
            } else {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js";
                script.async = true;
                script.onload = initHls;
                document.head.appendChild(script);
            }
        } else {
            video.src = src;
            video.play().catch(() => { });
            setIsPlaying(true);
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            if (video.duration && !isNaN(video.duration)) {
                setDuration(video.duration);
            }
        };

        const handleLoadedMetadata = () => {
            if (video.duration && !isNaN(video.duration)) {
                setDuration(video.duration);
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            if (nextEp) {
                handleSelectEpisode(nextEp);
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        };
    }, [currentEpisode?.videoUrl, currentEpNumber, currentUnlocked]);

    // Player Controls
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => { });
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const cycleSpeed = () => {
        const video = videoRef.current;
        const speeds = [1, 1.25, 1.5, 2];
        const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
        const nextSpeed = speeds[nextIdx];
        setSpeed(nextSpeed);
        if (video) video.playbackRate = nextSpeed;
        showToast(`Velocidade: ${nextSpeed}x`);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
        video.currentTime = newFraction * duration;
        setCurrentTime(video.currentTime);
    };

    // Lateral Actions
    const handleLike = () => {
        if (!drama) return;
        const next = !isLiked;
        setIsLiked(next);
        setLikesCount((prev) => (next ? prev + 1 : prev - 1));
        try {
            localStorage.setItem(`sdc_liked_${drama.id}_${currentEpNumber}`, String(next));
        } catch { }
        if (next) showToast("Você curtiu este episódio! ❤️");
    };

    const handleFollow = () => {
        if (!drama) return;
        const next = !isFollowing;
        setIsFollowing(next);
        try {
            localStorage.setItem(`sdc_follow_${drama.id}`, String(next));
        } catch { }
        showToast(next ? "Você começou a seguir esta série! ✨" : "Você deixou de seguir.");
    };

    const handleSave = () => {
        if (!drama) return;
        const next = !isSaved;
        setIsSaved(next);
        try {
            localStorage.setItem(`sdc_saved_${drama.id}`, String(next));
        } catch { }
        showToast(next ? "Série salva na sua lista! 🔖" : "Removida da sua lista.");
    };

    const handleShare = async () => {
        if (typeof window === "undefined" || !drama) return;
        const shareData = {
            title: `${drama.title} - Episódio ${currentEpNumber}`,
            text: `Assista ao episódio ${currentEpNumber} de ${drama.title} completo em HD!`,
            url: window.location.href
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch { }
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast("Link do episódio copiado! 📋");
        } catch {
            showToast("Link pronto para compartilhar!");
        }
    };

    const openPlanModal = (planKey: "monthly" | "quarterly" | "annual") => {
        setVipInitialPlan(planKey);
        setVipModalTab("pix");
        setVipModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-dvh bg-[#070709] text-white flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#e11d48] border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-zinc-400">Carregando série...</span>
            </div>
        );
    }

    if (!drama) {
        return (
            <div className="min-h-dvh bg-[#070709] text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-xl font-black text-white mb-4">Série não encontrada</h1>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm transition"
                >
                    ← Voltar ao catálogo
                </Link>
            </div>
        );
    }

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const annualPlan = plans.find((p) => p.key === "annual") || DEFAULT_OFFER_PLANS[1];

    return (
        <div className="min-h-dvh w-full bg-[#050507] text-white flex flex-col items-center justify-center overflow-hidden select-none relative font-sans">
            {/* AMBIENT BACKGROUND GLOW (DESKTOP) */}
            <div
                className="hidden md:block absolute inset-0 opacity-20 blur-3xl pointer-events-none scale-110"
                style={{
                    backgroundImage: `radial-gradient(circle at center, #e11d48 0%, #000 70%), url(${drama.coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />

            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 border border-white/20 text-white text-xs font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                    {toastMessage}
                </div>
            )}

            {/* REELS SWIPE / SCROLL TRANSITION BADGE */}
            {transitionBadge && (
                <div className="absolute inset-0 m-auto w-36 h-12 z-40 flex items-center justify-center rounded-2xl bg-black/85 border border-pink-500/40 text-pink-400 font-black text-sm tracking-wide shadow-2xl backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-90 duration-150">
                    {transitionBadge}
                </div>
            )}

            {/* MAIN MOBILE REELS FRAME (HOTPLOT STYLE) */}
            <div
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="w-full h-dvh md:max-w-[430px] md:h-[94vh] md:max-h-[890px] relative flex flex-col justify-between overflow-hidden md:rounded-[32px] md:border md:border-white/12 md:shadow-[0_24px_80px_rgba(0,0,0,0.95)] bg-black"
            >
                {/* 1. TOP HEADER OVERLAY (HOTPLOT STYLE) */}
                <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3.5 pt-3 pb-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                    {/* Globe / Language */}
                    <button
                        type="button"
                        onClick={() => showToast("Idioma: Português (Brasil) 🇧🇷")}
                        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-90 transition"
                        title="Idioma"
                    >
                        <Globe size={18} />
                    </button>

                    {/* Logo TvDrama Reels */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-sm active:scale-95 transition"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="TvDrama Reels"
                            className="h-6 w-auto object-contain"
                        />
                    </Link>

                    {/* Search / Catalog */}
                    <Link
                        href="/"
                        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-90 transition"
                        title="Buscar / Catálogo"
                    >
                        <Search size={18} />
                    </Link>
                </header>

                {/* 2. VIDEO STREAMING CONTAINER */}
                <div
                    onClick={togglePlay}
                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer bg-black overflow-hidden"
                >
                    {currentUnlocked && currentEpisode ? (
                        currentEpisode.videoUrl && !dailymotionId ? (
                            <video
                                ref={videoRef}
                                playsInline
                                autoPlay
                                className="w-full h-full object-cover bg-black"
                            />
                        ) : dailymotionId ? (
                            <div className="w-full h-full pointer-events-auto bg-black flex items-center justify-center">
                                <iframe
                                    key={currentEpisode.id || dailymotionId}
                                    src={`https://geo.dailymotion.com/player.html?video=${dailymotionId}`}
                                    className="w-full h-full border-0 object-cover"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : youtubeId ? (
                            <div className="w-full h-full pointer-events-auto">
                                <FramedYoutubePlayer
                                    key={currentEpisode.id}
                                    videoId={youtubeId}
                                    title={currentEpisode.title}
                                    episodeNumber={currentEpisode.number}
                                    isVertical={drama.isVertical}
                                    onEnded={goToNextEpisode}
                                />
                            </div>
                        ) : (
                            <div className="p-6 text-center text-zinc-500 text-xs">
                                Vídeo indisponível neste episódio.
                            </div>
                        )
                    ) : (
                        /* LOCKED EPISODE PAYWALL SCREEN */
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                            {/* Backdrop Image */}
                            <img
                                src={drama.coverUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60 pointer-events-none" />

                            <div className="relative z-10 w-full max-w-xs space-y-3.5">
                                <div className="w-14 h-14 mx-auto rounded-full bg-[#e11d48]/20 border border-[#e11d48]/40 flex items-center justify-center text-[#f43f5e] shadow-[0_0_24px_rgba(225,29,72,0.4)]">
                                    <Lock size={26} />
                                </div>

                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-black/70 border border-white/15 text-xs font-bold text-white mb-2">
                                        EP {currentEpNumber} Bloqueado
                                    </span>
                                    <h2 className="text-lg font-black uppercase text-white tracking-tight leading-snug">
                                        {drama.title}
                                    </h2>
                                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                        Assista a todos os {drama.totalEpisodes || episodes.length || "completos"} episódios desta série liberados no Pix agora:
                                    </p>
                                </div>

                                <div className="space-y-2 pt-1 text-left">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPlanModal("annual");
                                        }}
                                        className="relative w-full p-3.5 rounded-2xl border-2 border-[#e11d48] bg-[#e11d48]/20 hover:bg-[#e11d48]/30 transition block shadow-[0_8px_24px_rgba(225,29,72,0.35)]"
                                    >
                                        <span className="absolute -top-2 right-2.5 px-2 py-0.5 rounded-full bg-white text-[#e11d48] text-[9px] font-black uppercase tracking-wider">
                                            Liberação Imediata
                                        </span>
                                        <div className="flex items-center justify-between">
                                            <strong className="text-sm font-extrabold text-white">
                                                Acesso Completo (Anual)
                                            </strong>
                                            <strong className="text-sm font-black text-[#f43f5e]">
                                                R$ {annualPlan.price.toFixed(2).replace(".", ",")}
                                            </strong>
                                        </div>
                                        <span className="text-[11px] text-zinc-300 block mt-0.5">
                                            Episódios completos + Catálogo VIP Ilimitado
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVipModalTab("login");
                                            setVipModalOpen(true);
                                        }}
                                        className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-center text-xs font-bold text-white transition block"
                                    >
                                        Já pagou? Entrar com Telefone
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BIG CENTER PLAY BUTTON (WHEN PAUSED) */}
                    {currentUnlocked && !isPlaying && currentEpisode?.videoUrl && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                            }}
                            className="absolute inset-0 m-auto w-18 h-18 rounded-full bg-[#f43f5e]/85 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_35px_rgba(244,63,94,0.65)] hover:scale-105 active:scale-95 transition pointer-events-auto z-10"
                        >
                            <Play size={32} fill="white" className="ml-1" />
                        </button>
                    )}
                </div>

                {/* 3. RIGHT FLOATING ACTION BAR (EXACT HOTPLOT STYLE) */}
                <aside className="absolute right-3 bottom-28 flex flex-col items-center gap-3.5 z-20 pointer-events-auto">
                    {/* Curtir */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div
                            className={`w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center transition shadow-md ${isLiked ? "text-[#f43f5e] border-[#f43f5e]/40" : "text-white"
                                }`}
                        >
                            <Heart
                                size={22}
                                fill={isLiked ? "#f43f5e" : "transparent"}
                                className={isLiked ? "scale-110" : ""}
                            />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Curtir
                        </span>
                    </button>

                    {/* + Seguir */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFollow();
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div
                            className={`w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center transition shadow-md ${isFollowing ? "text-[#4ade8a] border-[#4ade8a]/40" : "text-white"
                                }`}
                        >
                            {isFollowing ? <Check size={20} /> : <Plus size={22} />}
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            {isFollowing ? "Seguindo" : "Seguir"}
                        </span>
                    </button>

                    {/* Salvar */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div
                            className={`w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center transition shadow-md ${isSaved ? "text-amber-400 border-amber-400/40" : "text-white"
                                }`}
                        >
                            <Bookmark size={22} fill={isSaved ? "#fbbf24" : "transparent"} />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Salvar
                        </span>
                    </button>

                    {/* Compartilhar */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div className="w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-md">
                            <Send size={20} className="-rotate-12 translate-x-0.5" />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Compartilhar
                        </span>
                    </button>

                    {/* EP Mostrador / Gaveta de Episódios */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDrawerOpen(true);
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div className="w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-md">
                            <Layers size={21} />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            EP {currentEpisode?.number || 1}
                        </span>
                    </button>

                    {/* Baixar App */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPwaModalOpen(true);
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.55)] flex items-center justify-center text-white">
                            <Download size={20} />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Baixar app
                        </span>
                    </button>
                </aside>

                {/* 4. BOTTOM VIDEO TITLE & CUSTOM CONTROLS OVERLAY */}
                <div className="absolute left-0 right-0 bottom-14 px-3.5 pb-2 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-auto">
                    {/* Drama Title & Episode Subtitle */}
                    <div className="mb-2 pr-16">
                        <h2 className="text-sm font-extrabold text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            {drama.title}
                        </h2>
                        <span className="text-xs font-bold text-white/70 block mt-0.5">
                            EP {currentEpisode?.number || 1}
                        </span>
                    </div>

                    {/* Pink Progress Scrubber & Controls (quando usando player de vídeo nativo) */}
                    {Boolean(currentEpisode?.videoUrl && !dailymotionId) && (
                        <>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSeek(e);
                                }}
                                className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer relative transition-all"
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-[#e11d48] to-[#f43f5e] rounded-full relative"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center justify-between mt-2 pt-0.5 text-white/90">
                                {/* Play / Pause mini */}
                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlay();
                                        }}
                                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                                    >
                                        {isPlaying ? (
                                            <Pause size={14} fill="white" />
                                        ) : (
                                            <Play size={14} fill="white" className="ml-0.5" />
                                        )}
                                    </button>

                                    {/* Time: 0:48 / 1:28 */}
                                    <span className="text-[11px] font-mono font-medium text-white/80 tabular-nums">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                {/* Speed & Volume */}
                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            cycleSpeed();
                                        }}
                                        className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white font-mono transition"
                                    >
                                        {speed}x
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMute();
                                        }}
                                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                                    >
                                        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 5. BOTTOM NAVIGATION BAR (EXACT HOTPLOT STYLE) */}
                <nav className="relative z-30 h-14 bg-[#070709] border-t border-white/[0.08] flex items-center justify-around px-2">
                    {/* Início */}
                    <Link
                        href="/"
                        className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition group py-1"
                    >
                        <Home size={19} />
                        <span className="text-[10px] font-medium">Início</span>
                    </Link>

                    {/* Descobrir */}
                    <Link
                        href="/"
                        className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition group py-1"
                    >
                        <Compass size={19} />
                        <span className="text-[10px] font-medium">Descobrir</span>
                    </Link>

                    {/* Para você (Pill Rosa Central) */}
                    <button
                        type="button"
                        onClick={() => showToast("Você já está no feed Para você!")}
                        className="flex flex-col items-center gap-0.5 group py-1"
                    >
                        <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-white flex items-center justify-center shadow-[0_2px_12px_rgba(225,29,72,0.45)]">
                            <Play size={13} fill="white" />
                        </div>
                        <span className="text-[10px] font-bold text-white">Para você</span>
                    </button>

                    {/* Minha lista */}
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition group py-1"
                    >
                        <Bookmark size={19} />
                        <span className="text-[10px] font-medium">Minha lista</span>
                    </button>

                    {/* Eu */}
                    <button
                        type="button"
                        onClick={() => {
                            if (isVip) {
                                showToast(`Assinatura VIP Ativa (${viewerPhone}) 👑`);
                            } else {
                                openPlanModal("annual");
                            }
                        }}
                        className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition group py-1"
                    >
                        <User size={19} />
                        <span className="text-[10px] font-medium">Eu</span>
                    </button>
                </nav>

                {/* 6. EPISODES BOTTOM SHEET DRAWER */}
                {drawerOpen && (
                    <div
                        onClick={() => setDrawerOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end animate-in fade-in duration-150"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-[#111116] border-t border-white/15 rounded-t-[28px] max-h-[75vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
                        >
                            {/* Drawer Drag Bar */}
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3" />

                            <div className="flex items-center justify-between mb-3 px-1">
                                <div>
                                    <h3 className="text-sm font-black text-white">{drama.title}</h3>
                                    <p className="text-[11px] text-zinc-400">
                                        Todos os {episodes.length} episódios ·{" "}
                                        {isVip ? "VIP Ativo" : "Ep. 01 e 02 Grátis"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Quick Number Grid */}
                            <div className="grid grid-cols-6 gap-1.5 mb-3 max-h-36 overflow-y-auto pr-1">
                                {episodes.map((ep) => {
                                    const unlocked = isEpisodeUnlocked(ep);
                                    const active = ep.number === currentEpNumber;
                                    return (
                                        <button
                                            key={ep.id}
                                            type="button"
                                            onClick={() => {
                                                handleSelectEpisode(ep);
                                                setDrawerOpen(false);
                                            }}
                                            className={`py-2 rounded-xl text-xs font-bold tabular-nums transition ${active
                                                    ? "bg-[#e11d48] text-white shadow-md"
                                                    : unlocked
                                                        ? "bg-white/10 text-white hover:bg-white/15"
                                                        : "bg-white/[0.04] text-zinc-500"
                                                }`}
                                        >
                                            {String(ep.number).padStart(2, "0")}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Detailed List */}
                            <div className="divide-y divide-white/[0.06] overflow-y-auto max-h-56 pr-1">
                                {episodes.map((ep) => {
                                    const unlocked = isEpisodeUnlocked(ep);
                                    const active = ep.number === currentEpNumber;
                                    return (
                                        <button
                                            key={ep.id}
                                            type="button"
                                            onClick={() => {
                                                handleSelectEpisode(ep);
                                                setDrawerOpen(false);
                                            }}
                                            className={`w-full py-2.5 px-2 flex items-center justify-between gap-3 text-left transition rounded-xl ${active ? "bg-white/[0.08]" : ""
                                                }`}
                                        >
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-white truncate">
                                                    Episódio {ep.number}
                                                </div>
                                                <div className="text-[11px] text-zinc-400 truncate">
                                                    {ep.title}
                                                </div>
                                            </div>

                                            <span
                                                className={`text-[11px] font-bold shrink-0 ${unlocked ? "text-[#4ade8a]" : "text-zinc-500"
                                                    }`}
                                            >
                                                {unlocked ? "Liberado" : "Bloqueado"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* VIP MODAL */}
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

            {/* PWA MODAL */}
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
        <Suspense fallback={<div className="min-h-dvh bg-[#070709]" />}>
            <WatchDramaContent />
        </Suspense>
    );
}
