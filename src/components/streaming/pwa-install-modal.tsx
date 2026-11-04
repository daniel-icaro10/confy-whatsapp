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
    onRequestVipModal,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hd-theme">
            <div className="relative w-full max-w-md rounded-[22px] hd-shell overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[rgb(239_233_222/0.12)] flex items-center justify-between">
                    <div>
                        <span className="text-[11px] uppercase tracking-[0.06em] text-[#efe9de]/45 font-medium block">
                            Versão Aplicativo · PWA
                        </span>
                        <h3 className="text-[19px] font-semibold tracking-[-0.012em] text-[#efe9de] mt-0.5">
                            App TvDrama Reels
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="hd-btn-sm hd-button-quiet text-xs"
                    >
                        Fechar
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="rounded-[16px] p-4 hd-surface space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#efe9de]/64">Formato de exibição</span>
                            <span className="text-[#efe9de] font-medium tabular-nums">Tela cheia 9:16 (Sem navegador)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t border-[rgb(239_233_222/0.08)] pt-2.5">
                            <span className="text-[#efe9de]/64">Compatibilidade</span>
                            <span className="text-[#efe9de] font-medium">iPhone (iOS) & Android</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t border-[rgb(239_233_222/0.08)] pt-2.5">
                            <span className="text-[#efe9de]/64">Disponibilidade</span>
                            <span className="text-[#e2b383] font-medium">Exclusivo para assinantes</span>
                        </div>
                    </div>

                    {!isVip ? (
                        <div className="space-y-4">
                            <div className="rounded-[16px] p-4 hd-plan">
                                <p className="text-sm font-medium text-[#efe9de] mb-1">
                                    Download restrito a assinantes ativos
                                </p>
                                <p className="text-xs text-[#efe9de]/64 leading-relaxed">
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
                                    className="w-full hd-btn hd-button-cream"
                                >
                                    Liberar assinatura e baixar App
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onRequestVipModal("login");
                                    }}
                                    className="w-full hd-btn hd-button-quiet"
                                >
                                    Já sou assinante · Validar WhatsApp
                                </button>
                            </div>
                        </div>
                    ) : isStandalone ? (
                        <div className="rounded-[16px] p-4 hd-plan text-center space-y-1">
                            <p className="text-sm font-medium text-[#efe9de]">
                                Você já está utilizando a versão Aplicativo
                            </p>
                            <p className="text-xs text-[#efe9de]/64">
                                Acesso vinculado ao número {viewerPhone}.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-[14px] px-3.5 py-2.5 hd-surface flex items-center justify-between text-xs">
                                <span className="text-[#efe9de]/64">Assinante verificado</span>
                                <span className="text-[#e2b383] font-medium tabular-nums">{viewerPhone}</span>
                            </div>

                            {deferredPrompt && (
                                <button
                                    type="button"
                                    onClick={handleNativeInstall}
                                    className="w-full hd-btn hd-button-cream"
                                >
                                    Instalar Aplicativo Agora
                                </button>
                            )}

                            {installStatus && (
                                <p className="text-xs text-center text-[#e2b383]">{installStatus}</p>
                            )}

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2 p-1 rounded-full hd-surface">
                                    <button
                                        type="button"
                                        onClick={() => setPlatformTab("ios")}
                                        className={`py-1.5 rounded-full text-xs font-medium transition ${
                                            platformTab === "ios"
                                                ? "bg-[#efe9de] text-[#151413]"
                                                : "text-[#efe9de]/64 hover:text-[#efe9de]"
                                        }`}
                                    >
                                        iPhone / iPad (iOS)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPlatformTab("android")}
                                        className={`py-1.5 rounded-full text-xs font-medium transition ${
                                            platformTab === "android"
                                                ? "bg-[#efe9de] text-[#151413]"
                                                : "text-[#efe9de]/64 hover:text-[#efe9de]"
                                        }`}
                                    >
                                        Android (Chrome)
                                    </button>
                                </div>

                                {platformTab === "ios" ? (
                                    <div className="rounded-[16px] p-4 hd-card space-y-2.5 text-xs text-[#efe9de]/80 leading-relaxed">
                                        <p className="font-medium text-[#efe9de]">
                                            Como instalar no iPhone (Safari):
                                        </p>
                                        <ol className="space-y-2 list-decimal list-inside text-[#efe9de]/64">
                                            <li>
                                                Toque no botão <strong className="text-[#efe9de]">Compartilhar</strong> na barra inferior do Safari.
                                            </li>
                                            <li>
                                                Role as opções para baixo e toque em <strong className="text-[#efe9de]">Adicionar à Tela de Início</strong>.
                                            </li>
                                            <li>
                                                Confirme tocando em <strong className="text-[#efe9de]">Adicionar</strong> no canto superior direito.
                                            </li>
                                        </ol>
                                    </div>
                                ) : (
                                    <div className="rounded-[16px] p-4 hd-card space-y-2.5 text-xs text-[#efe9de]/80 leading-relaxed">
                                        <p className="font-medium text-[#efe9de]">
                                            Como instalar no Android (Chrome):
                                        </p>
                                        <ol className="space-y-2 list-decimal list-inside text-[#efe9de]/64">
                                            <li>
                                                Toque no menu de <strong className="text-[#efe9de]">três pontos</strong> no canto superior direito do Chrome.
                                            </li>
                                            <li>
                                                Selecione <strong className="text-[#efe9de]">Instalar aplicativo</strong> ou <strong className="text-[#efe9de]">Adicionar à tela inicial</strong>.
                                            </li>
                                            <li>
                                                Confirme em <strong className="text-[#efe9de]">Instalar</strong> para abrir em tela cheia.
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

