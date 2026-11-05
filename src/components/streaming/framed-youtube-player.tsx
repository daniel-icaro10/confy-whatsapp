"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface FramedYoutubePlayerProps {
    videoId: string;
    title: string;
    episodeNumber: number;
    isVertical?: boolean;
    onEnded?: () => void;
}

function formatSeconds(sec: number): string {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const total = Math.floor(sec);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function FramedYoutubePlayer({
    videoId,
    title,
    episodeNumber,
    isVertical = true,
    onEnded
}: FramedYoutubePlayerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState<number>(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const [cropMode, setCropMode] = useState<"fit" | "crop" | "zoom">(
        isVertical ? "crop" : "fit"
    );
    const [controlsVisible, setControlsVisible] = useState(true);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sendCommand = useCallback((func: string, args: unknown[] = []) => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        win.postMessage(
            JSON.stringify({
                event: "command",
                func,
                args
            }),
            "*"
        );
    }, []);

    const scheduleHideControls = useCallback(() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        setControlsVisible(true);
        hideTimerRef.current = setTimeout(() => {
            setControlsVisible(false);
        }, 3200);
    }, []);

    useEffect(() => {
        setIsPlaying(true);
        setHasEnded(false);
        setCurrentTime(0);
        setDuration(0);
        setIsReady(false);
        scheduleHideControls();
    }, [videoId, scheduleHideControls]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (
                typeof event.origin === "string" &&
                !event.origin.includes("youtube.com") &&
                !event.origin.includes("youtube-nocookie.com")
            ) {
                return;
            }

            if (typeof event.data !== "string") return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === "onReady") {
                    setIsReady(true);
                    sendCommand("playVideo");
                }
                if (data.event === "infoDelivery" && data.info) {
                    if (typeof data.info.currentTime === "number") {
                        setCurrentTime(data.info.currentTime);
                    }
                    if (typeof data.info.duration === "number" && data.info.duration > 0) {
                        setDuration(data.info.duration);
                    }
                    if (typeof data.info.muted === "boolean") {
                        setIsMuted(data.info.muted);
                    }
                    if (typeof data.info.volume === "number") {
                        setVolume(data.info.volume);
                    }
                    if (typeof data.info.playerState === "number") {
                        const state = data.info.playerState;
                        if (state === 1) {
                            setIsPlaying(true);
                            setHasEnded(false);
                            setIsReady(true);
                        } else if (state === 2) {
                            setIsPlaying(false);
                        } else if (state === 0) {
                            setIsPlaying(false);
                            setHasEnded(true);
                            if (onEnded) onEnded();
                        }
                    }
                }
            } catch {
                // ignore non-JSON messages
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [onEnded, sendCommand]);

    const handleIframeLoad = () => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        // Registra escuta da API de IFrame do YouTube
        win.postMessage(JSON.stringify({ event: "listening", id: 1 }), "*");
        sendCommand("playVideo");
        setTimeout(() => {
            setIsReady(true);
        }, 550);
    };

    const togglePlay = () => {
        scheduleHideControls();
        if (hasEnded) {
            sendCommand("seekTo", [0, true]);
            sendCommand("playVideo");
            setHasEnded(false);
            setIsPlaying(true);
            return;
        }
        if (isPlaying) {
            sendCommand("pauseVideo");
            setIsPlaying(false);
        } else {
            sendCommand("playVideo");
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        scheduleHideControls();
        const nextVol = Number(e.target.value);
        setVolume(nextVol);
        if (nextVol === 0) {
            setIsMuted(true);
            sendCommand("mute");
        } else {
            if (isMuted) {
                setIsMuted(false);
                sendCommand("unMute");
            }
            sendCommand("setVolume", [nextVol]);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        scheduleHideControls();
        if (isMuted || volume === 0) {
            sendCommand("unMute");
            const restoreVol = volume === 0 ? 80 : volume;
            setVolume(restoreVol);
            sendCommand("setVolume", [restoreVol]);
            setIsMuted(false);
        } else {
            sendCommand("mute");
            setIsMuted(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        scheduleHideControls();
        const nextTime = Number(e.target.value);
        setCurrentTime(nextTime);
        sendCommand("seekTo", [nextTime, true]);
    };

    const cycleCropMode = (e: React.MouseEvent) => {
        e.stopPropagation();
        scheduleHideControls();
        setCropMode((prev) =>
            prev === "fit" ? "crop" : prev === "crop" ? "zoom" : "fit"
        );
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        scheduleHideControls();
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.().catch(() => { });
        } else {
            document.exitFullscreen?.().catch(() => { });
        }
    };

    const scaleClass =
        cropMode === "zoom"
            ? "scale-[1.28]"
            : cropMode === "crop"
                ? "scale-[1.14]"
                : "scale-[1.03]";

    const originParam =
        typeof window !== "undefined"
            ? `&origin=${encodeURIComponent(window.location.origin)}`
            : "";

    const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&enablejsapi=1${originParam}`;

    return (
        <div
            ref={containerRef}
            onMouseMove={scheduleHideControls}
            onTouchStart={scheduleHideControls}
            className="relative w-full h-full bg-black overflow-hidden select-none group"
        >
            {/* Iframe isolado sem cliques diretos para impedir redirecionamento pro YouTube */}
            <div className={`w-full h-full transition-transform duration-300 ${scaleClass}`}>
                <iframe
                    ref={iframeRef}
                    key={videoId}
                    src={embedSrc}
                    title={title}
                    onLoad={handleIframeLoad}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-full border-0 pointer-events-none select-none"
                />
            </div>

            {/* Cortina anti-recomendações quando pausado ou finalizado */}
            {(!isPlaying || hasEnded) && (
                <div
                    onClick={togglePlay}
                    className="absolute inset-0 z-10 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-opacity"
                >
                    <span className="px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-white text-[11px] font-bold mb-2 tabular-nums">
                        Episódio {String(episodeNumber).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-bold text-white max-w-xs mb-4">
                        {title}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="px-6 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-xs shadow-[0_6px_20px_rgba(225,29,72,0.4)] transition"
                    >
                        {hasEnded ? "Assistir novamente" : "Continuar episódio"}
                    </button>
                </div>
            )}

            {/* Escudo invisível de clique sobre todo o vídeo para Play/Pause nativo */}
            <div
                onClick={togglePlay}
                className="absolute inset-0 z-20 cursor-pointer flex flex-col justify-between"
            >
                {/* Topo sutil da moldura TvDrama Reels */}
                <div
                    className={`p-3.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div className="min-w-0">
                        <span className="text-[11px] font-bold text-white/90 truncate block">
                            Ep. {String(episodeNumber).padStart(2, "0")} · {title}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={cycleCropMode}
                        className="px-2.5 py-1 rounded-full bg-black/70 border border-white/15 text-[10px] text-white/80 hover:text-white transition"
                    >
                        Enquadramento:{" "}
                        {cropMode === "fit"
                            ? "Padrão"
                            : cropMode === "crop"
                                ? "Reels"
                                : "Zoom"}
                    </button>
                </div>

                {/* Barra de controles inferior própria do TvDrama Reels */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2 transition-opacity duration-300 ${controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {duration > 0 && (
                        <input
                            type="range"
                            min={0}
                            max={Math.max(duration, 1)}
                            step={0.5}
                            value={Math.min(currentTime, duration)}
                            onChange={handleSeek}
                            className="w-full h-1 accent-[#e11d48] bg-white/20 rounded-full cursor-pointer"
                        />
                    )}

                    <div className="flex items-center justify-between gap-2 text-[11px] text-white/90 tabular-nums">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="px-2.5 py-1 rounded-full bg-black/70 border border-white/15 hover:border-white/35 text-white font-semibold transition"
                            >
                                {isPlaying ? "Pausar" : "Reproduzir"}
                            </button>

                            {/* Controle de Volume com Slider Deslizante e Mute */}
                            <div className="flex items-center gap-1.5 bg-black/70 border border-white/15 rounded-full px-2.5 py-1">
                                <button
                                    type="button"
                                    onClick={toggleMute}
                                    title={isMuted || volume === 0 ? "Ativar som" : "Mutar som"}
                                    aria-label={isMuted || volume === 0 ? "Ativar som" : "Mutar som"}
                                    className="text-white hover:text-[#f43f5e] transition shrink-0"
                                >
                                    {isMuted || volume === 0 ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                            <line x1="23" y1="9" x2="17" y2="15" />
                                            <line x1="17" y1="9" x2="23" y2="15" />
                                        </svg>
                                    ) : volume < 50 ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    aria-label="Controle de volume"
                                    className="w-14 sm:w-20 h-1 accent-[#e11d48] bg-white/20 rounded-full cursor-pointer"
                                />
                                <span className="text-[9.5px] font-mono text-white/80 min-w-[24px] text-right">
                                    {isMuted ? "0%" : `${volume}%`}
                                </span>
                            </div>

                            {duration > 0 && (
                                <span className="hidden sm:inline-block text-[10px] text-[#9a9a9a] ml-1">
                                    {formatSeconds(currentTime)} / {formatSeconds(duration)}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="px-2.5 py-1 rounded-full bg-black/70 border border-white/15 hover:border-white/35 text-white transition"
                        >
                            Tela cheia
                        </button>
                    </div>
                </div>
            </div>

            {!isReady && (
                <div className="absolute inset-0 z-5 bg-black flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-[#9a9a9a]">Carregando player...</span>
                </div>
            )}
        </div>
    );
}

