"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaInstallModalProps {
    isOpen: boolean;
    onClose: () => void;
    isVip: boolean;
    viewerPhone?: string;
    onRequestVipModal: (tab: "login" | "pix") => void;
}

export function PwaInstallModal({
    isOpen,
    onClose,
    isVip,
    viewerPhone,
    onRequestVipModal
}: PwaInstallModalProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [platformTab, setPlatformTab] = useState<"ios" | "android">("ios");
    const [installStatus, setInstallStatus] = useState<string>("");

    useEffect(() => {
        if (typeof window === "undefined") return;

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        }

        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as unknown as { standalone?: boolean }).standalone === true;
        setIsStandalone(standalone);

        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.includes("android")) {
            setPlatformTab("android");
        } else {
            setPlatformTab("ios");
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    if (!isOpen) return null;

    async function handleNativeInstall() {
        if (!deferredPrompt) return;
        try {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome === "accepted") {
                setInstallStatus("Aplicativo instalado com sucesso no seu aparelho.");
                setDeferredPrompt(null);
            }
        } catch {
            // ignore
        }
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[440px] rounded-t-[24px] sm:rounded-[22px] bg-[#101014] border border-white/12 text-[#f5f5f5] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden"
            >
                <div className="px-5 pt-5 pb-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0b0b0e]">
                    <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48] block">
                            TVDRAMA REELS · APLICATIVO OFICIAL
                        </span>
                        <h3 className="text-[19px] font-black tracking-tight text-white mt-0.5">
                            Baixar App (PWA)
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center text-white text-xs"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    <div className="rounded-xl p-4 bg-[#09090b] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#9a9a9a]">Formato de exibição</span>
                            <span className="text-white font-semibold tabular-nums">
                                Tela cheia 9:16 (Sem navegador)
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t border-white/[0.08] pt-2.5">
                            <span className="text-[#9a9a9a]">Compatibilidade</span>
                            <span className="text-white font-semibold">iPhone (iOS) & Android</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t border-white/[0.08] pt-2.5">
                            <span className="text-[#9a9a9a]">Disponibilidade</span>
                            <span className="text-[#4ade8a] font-bold">Exclusivo Assinantes</span>
                        </div>
                    </div>

                    {!isVip ? (
                        <div className="space-y-4">
                            <div className="rounded-xl p-4 bg-[#e11d48]/12 border border-[#e11d48]/35">
                                <p className="text-sm font-bold text-white mb-1">
                                    Download restrito a assinantes ativos
                                </p>
                                <p className="text-xs text-[#d4d4d8] leading-relaxed">
                                    O aplicativo PWA instala o player vertical direto na tela inicial do seu celular, sem ocupar memória e mantendo seu acesso sempre conectado.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onRequestVipModal("pix");
                                    }}
                                    className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                                >
                                    Liberar assinatura e baixar App
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onRequestVipModal("login");
                                    }}
                                    className="w-full min-h-[44px] rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition"
                                >
                                    Já paguei · Entrar na minha conta
                                </button>
                            </div>
                        </div>
                    ) : isStandalone ? (
                        <div className="rounded-xl p-4 bg-[#22b868]/15 border border-[#22b868]/35 text-center space-y-1">
                            <p className="text-sm font-bold text-[#4ade8a]">
                                Você já está utilizando a versão Aplicativo
                            </p>
                            <p className="text-xs text-[#d4d4d8]">
                                Acesso vinculado ao número {viewerPhone}.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-xl px-3.5 py-2.5 bg-[#09090b] border border-white/10 flex items-center justify-between text-xs">
                                <span className="text-[#9a9a9a]">Assinante verificado</span>
                                <span className="text-[#4ade8a] font-bold tabular-nums">
                                    {viewerPhone}
                                </span>
                            </div>

                            {deferredPrompt && (
                                <button
                                    type="button"
                                    onClick={handleNativeInstall}
                                    className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                                >
                                    Instalar Aplicativo Agora
                                </button>
                            )}

                            {installStatus && (
                                <p className="text-xs text-center font-semibold text-[#4ade8a]">
                                    {installStatus}
                                </p>
                            )}

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#09090b] border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setPlatformTab("ios")}
                                        className={`py-2 rounded-full text-xs font-bold transition ${
                                            platformTab === "ios"
                                                ? "bg-white text-black"
                                                : "text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        iPhone / iPad (iOS)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPlatformTab("android")}
                                        className={`py-2 rounded-full text-xs font-bold transition ${
                                            platformTab === "android"
                                                ? "bg-white text-black"
                                                : "text-[#9a9a9a] hover:text-white"
                                        }`}
                                    >
                                        Android (Chrome)
                                    </button>
                                </div>

                                {platformTab === "ios" ? (
                                    <div className="rounded-xl p-4 bg-[#09090b] border border-white/10 space-y-2.5 text-xs text-[#d4d4d8] leading-relaxed">
                                        <p className="font-bold text-white">
                                            Como instalar no iPhone (Safari):
                                        </p>
                                        <ol className="space-y-2 list-decimal list-inside text-[#9a9a9a]">
                                            <li>
                                                Toque no botão{" "}
                                                <strong className="text-white">Compartilhar</strong> na
                                                barra inferior do Safari.
                                            </li>
                                            <li>
                                                Role as opções para baixo e toque em{" "}
                                                <strong className="text-white">
                                                    Adicionar à Tela de Início
                                                </strong>
                                                .
                                            </li>
                                            <li>
                                                Confirme tocando em{" "}
                                                <strong className="text-white">Adicionar</strong> no
                                                canto superior direito.
                                            </li>
                                        </ol>
                                    </div>
                                ) : (
                                    <div className="rounded-xl p-4 bg-[#09090b] border border-white/10 space-y-2.5 text-xs text-[#d4d4d8] leading-relaxed">
                                        <p className="font-bold text-white">
                                            Como instalar no Android (Chrome):
                                        </p>
                                        <ol className="space-y-2 list-decimal list-inside text-[#9a9a9a]">
                                            <li>
                                                Toque no menu de{" "}
                                                <strong className="text-white">três pontos</strong> no
                                                canto superior direito do Chrome.
                                            </li>
                                            <li>
                                                Selecione{" "}
                                                <strong className="text-white">
                                                    Instalar aplicativo
                                                </strong>{" "}
                                                ou{" "}
                                                <strong className="text-white">
                                                    Adicionar à tela inicial
                                                </strong>
                                                .
                                            </li>
                                            <li>
                                                Confirme em{" "}
                                                <strong className="text-white">Instalar</strong> para
                                                abrir em tela cheia.
                                            </li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
