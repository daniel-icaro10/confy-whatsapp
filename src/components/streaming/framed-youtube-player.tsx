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

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        scheduleHideControls();
        if (isMuted) {
            sendCommand("unMute");
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
            el.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
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
                    className="absolute inset-0 z-10 bg-[#0e0d0c]/88 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-opacity"
                >
                    <span className="px-3 py-1 rounded-full hd-surface text-[#e2b383] text-[11px] font-medium mb-2 tabular-nums">
                        Episódio {String(episodeNumber).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-semibold text-[#efe9de] max-w-xs mb-4">
                        {title}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="hd-btn hd-button-cream text-xs px-6"
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
                    className={`p-3.5 bg-gradient-to-b from-black/75 via-black/25 to-transparent flex items-center justify-between transition-opacity duration-300 ${
                        controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="min-w-0">
                        <span className="text-[11px] font-medium text-[#efe9de]/85 truncate block">
                            Ep. {String(episodeNumber).padStart(2, "0")} · {title}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={cycleCropMode}
                        className="px-2.5 py-1 rounded-full bg-black/55 border border-[rgb(239_233_222/0.14)] text-[10px] text-[#efe9de]/85 hover:text-[#efe9de]"
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
                    className={`p-3.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent space-y-2 transition-opacity duration-300 ${
                        controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
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
                            className="w-full h-1 accent-[#efe9de] bg-[rgb(239_233_222/0.22)] rounded-full cursor-pointer"
                        />
                    )}

                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#efe9de]/85 tabular-nums">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="px-2.5 py-1 rounded-full bg-black/60 border border-[rgb(239_233_222/0.14)] hover:border-[rgb(239_233_222/0.35)] text-[#efe9de] font-medium"
                            >
                                {isPlaying ? "Pausar" : "Reproduzir"}
                            </button>

                            <button
                                type="button"
                                onClick={toggleMute}
                                className="px-2.5 py-1 rounded-full bg-black/60 border border-[rgb(239_233_222/0.14)] hover:border-[rgb(239_233_222/0.35)] text-[#efe9de]"
                            >
                                {isMuted ? "Ativar som" : "Som ativo"}
                            </button>

                            {duration > 0 && (
                                <span className="text-[10px] text-[#efe9de]/65 ml-1">
                                    {formatSeconds(currentTime)} / {formatSeconds(duration)}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="px-2.5 py-1 rounded-full bg-black/60 border border-[rgb(239_233_222/0.14)] hover:border-[rgb(239_233_222/0.35)] text-[#efe9de]"
                        >
                            Tela cheia
                        </button>
                    </div>
                </div>
            </div>

            {!isReady && (
                <div className="absolute inset-0 z-5 bg-[#0e0d0c] flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-[#efe9de]/55">Carregando player...</span>
                </div>
            )}
        </div>
    );
}

