"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
    Check,
    Copy,
    Volume2,
    VolumeX,
    Lock,
    Zap,
    ShieldCheck,
    Clock,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Star,
    MessageCircle,
    Play,
    Loader2,
    Tv,
    Smartphone,
    Film,
    X
} from "lucide-react";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";

interface Episode {
    number: number;
    title: string;
    youtubeUrl: string;
    durationSeconds?: number;
    isFree: boolean;
}

interface DramaOffer {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string | null;
    category: string;
    totalEpisodes: number;
    trailerYoutubeUrl?: string | null;
    episodes: Episode[];
}

interface OrderBump {
    id: string;
    title: string;
    description: string;
    price: number;
    iconUrl: string;
}

const ORDER_BUMPS: OrderBump[] = [
    {
        id: "bump-whatsapp",
        title: "Entrega Imediata via WhatsApp!",
        description: "Receba o link de acesso na hora, direto no seu WhatsApp.",
        price: 5.0,
        iconUrl: "/bump-whatsapp.jpg"
    },
    {
        id: "bump-18",
        title: "Novelinhas Com Cenas +18",
        description: "Libere todas as novelinhas com as cenas mais picantes e sem censura.",
        price: 5.0,
        iconUrl: "/bump-18.webp"
    }
];

const TESTIMONIALS_ROW_1 = [
    {
        name: "Patrícia Rodrigues",
        city: "São Paulo, SP",
        text: "Acesso liberado na mesma hora que paguei o Pix! Super prático de assistir no celular ou na TV. A história dessa novela é viciante demais!",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Fernanda Lima",
        city: "Belo Horizonte, MG",
        text: "Melhor investimento que fiz. Assistir os episódios completos sem aqueles anúncios chatos cortando a melhor cena não tem preço.",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Tatiane Mello",
        city: "Curitiba, PR",
        text: "Super seguro e confiável. Fiquei com medo de pagar e não receber, mas abriu na hora na tela com todos os episódios liberados. Amei!",
        photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Camila Teixeira",
        city: "Salvador, BA",
        text: "Qualidade de imagem maravilhosa em Full HD e o áudio é super limpo. Já maratonei mais da metade hoje!",
        photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80"
    }
];

const TESTIMONIALS_ROW_2 = [
    {
        name: "Eduarda Rocha",
        city: "Rio de Janeiro, RJ",
        text: "Finalmente consegui assistir a série completa sem cortes! Vi o trecho no TikTok e precisava saber o final. Vale cada centavo.",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Beatriz Costa",
        city: "Goiânia, GO",
        text: "Abri no meu celular e espelhei na Smart TV da sala em 2 minutos. Minha mãe e eu estamos maratonando juntas!",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Mariana Souza",
        city: "Porto Alegre, RS",
        text: "Por esse valor ter a novela completa liberada é praticamente de graça. O suporte no WhatsApp também me atendeu super rápido.",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
        name: "Juliana Azevedo",
        city: "Recife, PE",
        text: "O player roda liso no celular, sem travar nada. Muito melhor do que ficar baixando aplicativo cheio de moedas.",
        photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&h=120&q=80"
    }
];

// Formatação monetária em Real (BRL)
const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Máscara de telefone brasileira
const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export function OfertaSalesPageClient({ slug }: { slug: string }) {
    const router = useRouter();

    // Estado da Novela
    const [drama, setDrama] = useState<DramaOffer | null>(null);
    const [loadingDrama, setLoadingDrama] = useState(true);

    // Controle de Telas (view): 'offer' (página inicial) | 'checkout' (dados e pagamento) | 'pix' (código gerado)
    const [currentView, setCurrentView] = useState<"offer" | "checkout" | "pix">("offer");

    // Controle do Modal de Upsell
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);

    // Pacote Escolhido: 'basica' (R$ 7,90) ou 'upsell' (Catálogo VIP - R$ 10,00)
    const [selectedPackage, setSelectedPackage] = useState<"basica" | "upsell">("basica");

    // Order bumps selecionados
    const [selectedBumps, setSelectedBumps] = useState<string[]>([]);

    // Player de Vídeo Nativo de Prévia (Ganhei Três Namoradas)
    const [isMuted, setIsMuted] = useState(true);
    const [currentPreviewEp, setCurrentPreviewEp] = useState<number>(1);
    const [showEndedOverlay, setShowEndedOverlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentProgress, setCurrentProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Formulário de Checkout
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [formError, setFormError] = useState("");
    const [generatingPix, setGeneratingPix] = useState(false);

    // Pedido Pix Gerado
    const [pixOrder, setPixOrder] = useState<{
        orderId: string;
        amount: number;
        pixCopyPaste: string;
        pixQrCodeBase64?: string;
    } | null>(null);
    const [copiedPix, setCopiedPix] = useState(false);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [pixTimeRemaining, setPixTimeRemaining] = useState(24 * 60);


    // 0. Captura parâmetros de anúncios (UTMs e fbclid) para atribuição
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "utm_id"];
        const foundUtms: Record<string, string> = {};

        utmKeys.forEach((key) => {
            const val = params.get(key);
            if (val) foundUtms[key] = val;
        });

        if (Object.keys(foundUtms).length > 0) {
            sessionStorage.setItem("sdc_utm_params", JSON.stringify(foundUtms));
        }
    }, []);

    // 1. Carrega dados do drama
    useEffect(() => {
        let isMounted = true;

        async function fetchDrama() {
            try {
                const res = await fetch(`/api/dramas/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.drama && isMounted) {
                        setDrama(data.drama);
                        setLoadingDrama(false);
                        return;
                    }
                }
            } catch {}

            const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                (d) => d.slug === slug || d.id === slug
            );

            if (fallback && isMounted) {
                setDrama({
                    id: fallback.id,
                    title: fallback.title,
                    slug: fallback.slug,
                    synopsis: fallback.synopsis,
                    coverUrl: "/cover-ganhei-tres-namoradas.jpg",
                    bannerUrl: "/cover-ganhei-tres-namoradas.jpg",
                    category: fallback.category,
                    totalEpisodes: fallback.totalEpisodes || fallback.episodes.length,
                    trailerYoutubeUrl: fallback.episodes[0]?.youtubeUrl || null,
                    episodes: fallback.episodes
                });
            }
            if (isMounted) setLoadingDrama(false);
        }

        fetchDrama();
        return () => { isMounted = false; };
    }, [slug]);

    // Dispara ViewContent no Meta Pixel assim que a oferta é visualizada
    useEffect(() => {
        if (!drama) return;
        if (typeof window !== "undefined" && (window as any).fbq) {
            try {
                (window as any).fbq("track", "ViewContent", {
                    content_name: drama.title || "Ganhei Três Namoradas (Dublada)",
                    content_ids: [slug],
                    content_type: "product",
                    value: PRICE_BASICA,
                    currency: "BRL"
                });
            } catch {}
        }
    }, [drama, slug]);

    // 2. Sincroniza reprodução ao trocar de episódio de prévia
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(() => {});
            }
        }
    }, [currentPreviewEp]);

    // Desmuta áudio do vídeo nativo
    const unmuteVideo = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1;
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                    setIsMuted(false);
                }).catch(() => {
                    setIsMuted(false);
                });
            } else {
                setIsMuted(false);
            }
        } else {
            setIsMuted(false);
        }
    };

    // Alterna som do vídeo nativo
    const toggleVideoSound = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (isMuted) {
                unmuteVideo();
            } else {
                videoRef.current.muted = true;
                setIsMuted(true);
            }
        } else {
            setIsMuted(!isMuted);
        }
    };

    // Alterna play/pause ao clicar no vídeo quando já com som
    const handleVideoClick = () => {
        if (showEndedOverlay) return;
        if (isMuted) {
            unmuteVideo();
        } else if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // Preços
    const PRICE_BASICA = 7.9; // R$ 7,90
    const PRICE_UPSELL = 10.0; // R$ 10,00

    const currentTotalAmount = useMemo(() => {
        const base = selectedPackage === "upsell" ? PRICE_UPSELL : PRICE_BASICA;
        const bumpsTotal = selectedBumps.reduce((acc, bumpId) => {
            const b = ORDER_BUMPS.find((item) => item.id === bumpId);
            return acc + (b ? b.price : 0);
        }, 0);
        return base + bumpsTotal;
    }, [selectedPackage, selectedBumps]);

    // Inicia fluxo de compra: abre Modal de Upsell
    const handleStartCheckout = () => {
        // Dispara InitiateCheckout no Pixel
        if (typeof window !== "undefined" && (window as any).fbq) {
            try {
                (window as any).fbq("track", "InitiateCheckout", {
                    content_name: drama?.title || "Ganhei Três Namoradas (Dublada)",
                    currency: "BRL",
                    value: PRICE_BASICA
                });
            } catch {}
        }
        setIsUpsellModalOpen(true);
    };

    // Aceita o Upsell (Catálogo VIP - R$ 10,00)
    const handleAcceptUpsell = () => {
        setSelectedPackage("upsell");
        setIsUpsellModalOpen(false);
        setCurrentView("checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Recusa o Upsell e mantém Opção Básica (R$ 7,90)
    const handleDeclineUpsell = () => {
        setSelectedPackage("basica");
        setIsUpsellModalOpen(false);
        setCurrentView("checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Alterna seleção de order bump
    const toggleBump = (bumpId: string) => {
        setSelectedBumps((prev) =>
            prev.includes(bumpId) ? prev.filter((id) => id !== bumpId) : [...prev, bumpId]
        );
    };

    // Submete checkout e gera Pix
    const handleGeneratePix = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (name.trim().length < 3) {
            setFormError("Informe seu nome completo para emissão do acesso.");
            return;
        }

        const emailClean = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailClean)) {
            setFormError("Informe um endereço de e-mail válido.");
            return;
        }

        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
            setFormError("Informe um número de WhatsApp válido com DDD.");
            return;
        }

        setGeneratingPix(true);

        // Dispara evento AddPaymentInfo no Meta Pixel
        if (typeof window !== "undefined" && (window as any).fbq) {
            try {
                (window as any).fbq("track", "AddPaymentInfo", {
                    content_name: drama?.title || "Ganhei Três Namoradas (Dublada)",
                    content_ids: [slug],
                    currency: "BRL",
                    value: currentTotalAmount
                });
            } catch {}
        }

        try {
            // Recupera UTMs salvas
            let utms: Record<string, string> = {};
            try {
                const raw = sessionStorage.getItem("sdc_utm_params");
                if (raw) utms = JSON.parse(raw);
            } catch {}

            const planKey = selectedPackage === "upsell" ? "monthly" : "single_drama";
            const res = await fetch("/api/pix/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: emailClean,
                    phone: phoneDigits,
                    amount: currentTotalAmount,
                    dramaId: slug,
                    planKey,
                    url: typeof window !== "undefined" ? window.location.href : undefined,
                    ...utms
                })
            });

            const data = await res.json();
            if (!res.ok || !data.orderId) {
                throw new Error(data.error || "Não foi possível gerar a cobrança Pix. Tente novamente.");
            }

            setPixOrder({
                orderId: data.orderId,
                amount: data.amount || currentTotalAmount,
                pixCopyPaste: data.pixCopyPaste,
                pixQrCodeBase64: data.pixQrCodeBase64
            });

            setCurrentView("pix");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            setFormError(err.message || "Ocorreu um erro ao gerar o Pix. Tente novamente.");
        } finally {
            setGeneratingPix(false);
        }
    };

    // Copia código Pix
    const handleCopyPix = () => {
        if (!pixOrder?.pixCopyPaste) return;
        navigator.clipboard.writeText(pixOrder.pixCopyPaste);
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 3500);
    };

    // Timer regressivo do Pix (24 minutos)
    useEffect(() => {
        if (currentView !== "pix" || isPaymentConfirmed) return;
        const timer = setInterval(() => {
            setPixTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentView, isPaymentConfirmed]);

    // Polling de verificação de pagamento Pix a cada 3 segundos
    useEffect(() => {
        if (currentView !== "pix" || !pixOrder?.orderId || isPaymentConfirmed) return;

        let active = true;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/pix/status?orderId=${encodeURIComponent(pixOrder.orderId)}`);
                const data = await res.json();

                if (data?.isPaid && active) {
                    setIsPaymentConfirmed(true);

                    // Dispara evento Purchase no Meta Pixel
                    if (typeof window !== "undefined" && (window as any).fbq) {
                        try {
                            (window as any).fbq("track", "Purchase", {
                                content_name: drama?.title,
                                value: pixOrder.amount,
                                currency: "BRL"
                            });
                        } catch {}
                    }

                    // Salva status de acesso no localStorage (Série única vs VIP Completo)
                    if (data.phone) {
                        localStorage.setItem("sdc_viewer_phone", data.phone);
                        localStorage.setItem("sdc_viewer_vip", "true");
                        if (selectedPackage === "upsell") {
                            localStorage.setItem("sdc_is_full_vip", "true");
                            localStorage.setItem("sdc_unlocked_dramas", JSON.stringify(["*"]));
                        } else {
                            localStorage.setItem("sdc_is_full_vip", "false");
                            localStorage.setItem(`sdc_unlocked_${slug}`, "true");
                            try {
                                const raw = localStorage.getItem("sdc_unlocked_dramas");
                                const list = raw ? JSON.parse(raw) : [];
                                if (!list.includes(slug)) list.push(slug);
                                localStorage.setItem("sdc_unlocked_dramas", JSON.stringify(list));
                            } catch {}
                        }
                    }

                    // Redireciona para a página de assistir após 1.8s
                    setTimeout(() => {
                        const targetUrl = `/assistir/${slug}?phone=${encodeURIComponent(data.phone || phone.replace(/\D/g, ""))}`;
                        router.push(targetUrl);
                    }, 1800);
                }
            } catch {}
        };

        const interval = setInterval(checkStatus, 3000);
        checkStatus();

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [currentView, pixOrder, isPaymentConfirmed, slug, phone, router, drama]);

    const formattedMinutes = String(Math.floor(pixTimeRemaining / 60)).padStart(2, "0");
    const formattedSeconds = String(pixTimeRemaining % 60).padStart(2, "0");

    if (loadingDrama) {
        return (
            <div className="min-h-dvh bg-[#07060a] text-white flex flex-col items-center justify-center p-4">
                <Loader2 className="size-10 animate-spin text-rose-500 mb-3" />
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                    Carregando oferta especial...
                </p>
            </div>
        );
    }

    const currentTitle = drama?.title || "Ganhei Três Namoradas (Dublada)";
    const currentCover = "/cover-ganhei-tres-namoradas.jpg";

    return (
        <div className="min-h-dvh bg-[#07060a] text-stone-100 flex flex-col selection:bg-rose-500/40 selection:text-white pb-24 sm:pb-16 font-sans">
            {/* =========================================================================
                TELA 1: PÁGINA DE VENDAS COM O PLAYER NATIVO VERTICAL HD
                ========================================================================= */}
            {currentView === "offer" && (
                <>
                    {/* Header Limpo com Logotipo */}
                    <header className="w-full border-b border-white/5 bg-[#0a0812]/90 backdrop-blur-md sticky top-0 z-40">
                        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.png"
                                    alt="TvDrama Reels"
                                    className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                                />
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                <Lock className="size-3" />
                                <span>Ambiente 100% Seguro</span>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center">
                        {/* 1. Badge Em Alta no Brasil */}
                        <div className="mb-4 inline-block rounded-full border border-rose-500/25 bg-[#14101e] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-rose-400 sm:text-xs">
                            🔥 Em alta no Brasil
                        </div>

                        {/* 2. Título da Minissérie */}
                        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg leading-[1.08] mb-8">
                            {currentTitle}
                        </h1>

                        {/* 3. Imagem de Capa com Borda Degradê */}
                        <div className="mb-8 w-full max-w-[180px]">
                            <div className="rounded-2xl bg-gradient-to-r from-rose-500/40 via-purple-500/30 to-rose-500/20 p-[2px] shadow-[0_0_40px_rgba(225,29,72,0.22)]">
                                <div className="overflow-hidden rounded-[14px] bg-black">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentCover}
                                        alt={currentTitle}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Título da Seção do Vídeo e Seletor de Episódio */}
                        <h2 className="mb-3 text-center text-lg sm:text-2xl font-black uppercase tracking-wider text-white">
                            Assista a uma prévia
                        </h2>

                        {/* Seletor de Episódios de Prévia (Ep. 1 e Ep. 2 liberados para teste) */}
                        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPreviewEp(1);
                                    setShowEndedOverlay(false);
                                }}
                                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    currentPreviewEp === 1 && !showEndedOverlay
                                        ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] border border-rose-400/40"
                                        : "bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10"
                                }`}
                            >
                                <Play className="size-3 fill-current" />
                                <span>Episódio 1</span>
                                <span className="text-[10px] opacity-75">(43s)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPreviewEp(2);
                                    setShowEndedOverlay(false);
                                }}
                                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    currentPreviewEp === 2 && !showEndedOverlay
                                        ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] border border-rose-400/40"
                                        : "bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10"
                                }`}
                            >
                                <Play className="size-3 fill-current" />
                                <span>Episódio 2</span>
                                <span className="text-[10px] opacity-75">(43s)</span>
                            </button>

                            <a
                                href="#oferta-cards"
                                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
                            >
                                <Lock className="size-3 text-amber-400" />
                                <span>Ep. 3 ao 60</span>
                            </a>
                        </div>

                        {/* 5. Player de Vídeo Vertical Nativo HD (9:16) */}
                        <div className="relative mx-auto mb-10 flex aspect-[9/16] w-full max-w-[260px] sm:max-w-[270px] select-none items-center justify-center overflow-hidden rounded-3xl border-2 border-rose-500/30 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
                            <video
                                ref={videoRef}
                                src={`/dramas/ganhei-tres-namoradas/ep-${currentPreviewEp}.mp4`}
                                poster={currentCover}
                                playsInline
                                autoPlay
                                muted={isMuted}
                                preload="auto"
                                onTimeUpdate={(e) => {
                                    const v = e.currentTarget;
                                    if (v.duration) {
                                        setCurrentProgress((v.currentTime / v.duration) * 100);
                                    }
                                }}
                                onEnded={() => {
                                    if (currentPreviewEp === 1) {
                                        setCurrentPreviewEp(2);
                                        setShowEndedOverlay(false);
                                    } else {
                                        setShowEndedOverlay(true);
                                    }
                                }}
                                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                            />

                            {/* Overlay transparente clicável para ativar som ou pausar */}
                            <div
                                className="absolute inset-0 z-10 cursor-pointer"
                                onClick={handleVideoClick}
                            />

                            {/* Badge do Episódio Atual */}
                            <div className="absolute left-3.5 top-3.5 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-stone-200 pointer-events-none">
                                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                                <span>Ep. {currentPreviewEp} de 60 • HD</span>
                            </div>

                            {/* Botão de status de áudio no canto superior direito */}
                            <button
                                type="button"
                                onClick={toggleVideoSound}
                                className="absolute right-3.5 top-3.5 z-20 flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-black/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300 hover:bg-black transition-all"
                            >
                                {isMuted ? (
                                    <>
                                        <VolumeX className="size-3.5 animate-pulse text-rose-500" />
                                        <span>Ativar som</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="size-3.5 text-emerald-400" />
                                        <span>Som ativo</span>
                                    </>
                                )}
                            </button>

                            {/* Indicador de Pausa no Centro */}
                            {!isPlaying && !isMuted && !showEndedOverlay && (
                                <div
                                    onClick={handleVideoClick}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer"
                                >
                                    <div className="flex size-14 items-center justify-center rounded-full bg-rose-600/90 text-white shadow-lg">
                                        <Play className="size-7 fill-white translate-x-0.5" />
                                    </div>
                                </div>
                            )}

                            {/* Botão central/inferior piscando quando mutado */}
                            {isMuted && !showEndedOverlay && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unmuteVideo();
                                    }}
                                    className="absolute inset-x-3.5 bottom-8 z-20 flex animate-bounce cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-rose-600 px-4 py-3 text-center text-xs font-black text-white shadow-[0_8px_30px_rgba(225,29,72,0.6)] select-none"
                                >
                                    🔊 Toque para ativar o som 🔊
                                </div>
                            )}

                            {/* Overlay de Bloqueio ao fim da prévia gratuita */}
                            {showEndedOverlay && (
                                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/92 p-5 text-center backdrop-blur-md">
                                    <div className="mb-2.5 flex size-12 items-center justify-center rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-400">
                                        <Lock className="size-6" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">
                                        Fim da prévia gratuita
                                    </p>
                                    <h3 className="text-base font-black text-white leading-tight mb-1.5">
                                        Assista aos 60 Episódios
                                    </h3>
                                    <p className="text-[11px] text-stone-300 mb-3 max-w-[210px] leading-snug">
                                        Libere o desfecho completo agora mesmo sem cortes em alta definição.
                                    </p>
                                    <a
                                        href="#oferta-cards"
                                        className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(225,29,72,0.6)] hover:brightness-110 active:scale-95 transition-all text-center"
                                    >
                                        Liberar Acesso (R$ 7,90)
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentPreviewEp(1);
                                            setShowEndedOverlay(false);
                                        }}
                                        className="mt-2.5 text-[10px] font-bold text-stone-400 hover:text-white underline underline-offset-4"
                                    >
                                        Assistir prévia novamente ↺
                                    </button>
                                </div>
                            )}

                            {/* Barra de progresso sutil na base */}
                            <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/20 pointer-events-none">
                                <div
                                    className="h-full bg-rose-500 transition-all duration-100 ease-linear"
                                    style={{ width: `${currentProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* 6. Card da Oferta: Opção Básica */}
                        <div id="oferta-cards" className="w-full mb-12 scroll-mt-20">
                            <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#120e1c]/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-left">
                                {/* Tag Opção Básica */}
                                <div className="absolute -top-3.5 left-6 rounded-full border border-white/10 bg-[#1b152b] px-3.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-300 shadow">
                                    Opção básica
                                </div>

                                {/* Miniatura da Série */}
                                <div className="mb-6 mt-1 flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentCover}
                                        alt={currentTitle}
                                        className="size-12 shrink-0 rounded-lg border border-white/10 object-cover"
                                    />
                                    <div className="min-w-0 flex-1 text-left">
                                        <span className="mb-0.5 inline-block rounded bg-rose-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-300">
                                            Esta série
                                        </span>
                                        <h4 className="truncate text-sm sm:text-base font-black uppercase tracking-tight text-stone-100">
                                            Apenas esta novela
                                        </h4>
                                        <p className="mt-0.5 text-[10px] sm:text-xs text-stone-400">
                                            Acesso exclusivo à série.
                                        </p>
                                    </div>
                                </div>

                                {/* Checklist de Benefícios */}
                                <ul className="mb-6 space-y-3.5 text-xs text-stone-300">
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <span>
                                            <b className="text-white">Temporada completa em HD</b>
                                            <br />
                                            Todos os 60 episódios desta novela sem cortes.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <span>
                                            <b className="text-white">Áudio dublado & legendas</b>
                                            <br />
                                            Assista com áudio limpo em português ou legendas.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <span>
                                            <b className="text-white">Assista completa e sem anúncios</b>
                                            <br />
                                            Todos os episódios, sem interrupções.
                                        </span>
                                    </li>
                                </ul>

                                {/* Preço e Botão */}
                                <div>
                                    <div className="mb-4 rounded-xl border border-white/5 bg-black/40 p-3.5 text-center">
                                        <span className="text-[11px] font-semibold text-stone-500 line-through">
                                            De R$ 19,90 por apenas
                                        </span>
                                        <div className="mt-0.5 flex items-baseline justify-center gap-1">
                                            <span className="text-sm font-bold text-stone-300">R$</span>
                                            <span className="text-3xl sm:text-4xl font-black text-rose-500">
                                                {formatMoney(PRICE_BASICA)}
                                            </span>
                                        </div>
                                        <span className="mt-1 block text-[9px] font-semibold uppercase text-stone-400 tracking-wider">
                                            Pagamento único · Acesso vitalício
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleStartCheckout}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-b-2 border-black/40 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
                                    >
                                        <span>Adquirir série →</span>
                                    </button>
                                </div>
                            </div>

                            {/* Selos de Confiança */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-semibold text-stone-400">
                                <span>🔒 Ambiente criptografado</span>
                                <span className="text-stone-700">•</span>
                                <span className="text-rose-400">⚡ Liberação imediata</span>
                                <span className="text-stone-700">•</span>
                                <span className="text-emerald-400">🛡️ Risco zero garantido</span>
                            </div>
                        </div>

                        {/* 7. Card da Garantia de 7 Dias */}
                        <div className="mb-12 flex w-full max-w-xl flex-col items-center rounded-3xl border border-amber-500/30 bg-[#161220]/80 p-6 sm:p-8 text-center shadow-xl">
                            <ShieldCheck className="mb-3 size-10 text-amber-400" />
                            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-400 sm:text-sm">
                                Garantia blindada de 7 dias
                            </span>
                            <h4 className="text-base sm:text-lg font-extrabold uppercase text-white mb-2">
                                Satisfação total ou seu dinheiro de volta
                            </h4>
                            <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                                Assista à série completa. Se por qualquer motivo você não gostar da história ou do player, basta nos enviar uma mensagem no WhatsApp que devolvemos 100% do seu valor. Sem perguntas.
                            </p>
                        </div>

                        {/* 8. Prova Social: Marquee de Avaliações */}
                        <div className="w-full mb-12 overflow-hidden">
                            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center justify-center gap-2">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                <span>Quem já comprou recomenda (+24.000 clientes)</span>
                            </h3>

                            {/* Linha 1 do Marquee */}
                            <div className="flex gap-4 overflow-hidden py-2 select-none">
                                <div className="flex gap-4 animate-marquee-left shrink-0">
                                    {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((t, idx) => (
                                        <div
                                            key={`m1-${idx}`}
                                            className="w-[270px] shrink-0 rounded-2xl border border-white/5 bg-[#120e1a] p-4 text-left shadow-lg"
                                        >
                                            <div className="flex items-center gap-2.5 mb-2.5">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={t.photo}
                                                    alt={t.name}
                                                    className="size-8 rounded-full object-cover border border-white/10"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-white">{t.name}</p>
                                                    <p className="text-[10px] text-stone-400">{t.city}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                            <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                                                &quot;{t.text}&quot;
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Linha 2 do Marquee */}
                            <div className="flex gap-4 overflow-hidden py-2 select-none">
                                <div className="flex gap-4 animate-marquee-right shrink-0">
                                    {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((t, idx) => (
                                        <div
                                            key={`m2-${idx}`}
                                            className="w-[270px] shrink-0 rounded-2xl border border-white/5 bg-[#120e1a] p-4 text-left shadow-lg"
                                        >
                                            <div className="flex items-center gap-2.5 mb-2.5">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={t.photo}
                                                    alt={t.name}
                                                    className="size-8 rounded-full object-cover border border-white/10"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-white">{t.name}</p>
                                                    <p className="text-[10px] text-stone-400">{t.city}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                            <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                                                &quot;{t.text}&quot;
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Barra Fixa Mobile no Rodapé */}
                    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-t-2xl border-t border-rose-500/20 bg-[#0e0a17]/95 px-4 py-3 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md sm:px-6">
                        <div className="flex min-w-0 items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentCover}
                                alt={currentTitle}
                                className="size-10 shrink-0 rounded-lg border border-rose-500/15 object-cover"
                            />
                            <div className="min-w-0 text-left leading-tight">
                                <span className="block text-[9px] font-extrabold uppercase tracking-wide text-rose-400">
                                    Acesso imediato
                                </span>
                                <span className="block truncate font-black text-xs uppercase text-white">
                                    {currentTitle}
                                </span>
                                <span className="block truncate text-[10px] font-medium text-stone-400">
                                    Série completa por{" "}
                                    <strong className="font-bold text-rose-400">
                                        R$ {formatMoney(PRICE_BASICA)}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleStartCheckout}
                            className="shrink-0 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-rose-600/40 active:scale-95"
                        >
                            Adquirir
                        </button>
                    </div>

                    {/* =========================================================================
                        MODAL DE UPSELL (CATÁLOGO VIP COMPLETO)
                        ========================================================================= */}
                    {isUpsellModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                onClick={() => setIsUpsellModalOpen(false)}
                            />

                            <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center rounded-3xl border-2 border-rose-500 bg-[#120e1c] p-6 text-center shadow-[0_25px_60px_rgba(225,29,72,0.25)] animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    type="button"
                                    onClick={() => setIsUpsellModalOpen(false)}
                                    className="absolute right-5 top-4 text-stone-400 hover:text-white"
                                    aria-label="Fechar"
                                >
                                    <X className="size-5" />
                                </button>

                                {/* Logo / Imagem da Promoção */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.png"
                                    alt="TvDrama Reels"
                                    className="mt-2 h-10 w-auto object-contain"
                                />

                                <span className="mb-4 mt-3 animate-pulse rounded-full bg-rose-600 px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white sm:text-xs">
                                    🔥 Super Promoção
                                </span>

                                <h3 className="text-xl sm:text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
                                    Acesso a todo o catálogo!
                                </h3>

                                <p className="mt-3 max-w-sm text-xs leading-relaxed text-stone-300 mb-4">
                                    Por que levar só uma novela se você pode levar TODAS as séries do catálogo completo com lançamentos diários por apenas R$ 10,00?
                                </p>

                                {/* Benefícios do Upsell */}
                                <div className="mb-5 w-full space-y-3 rounded-2xl border border-rose-500/15 bg-white/[0.03] p-4 text-left">
                                    <div className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-stone-100">
                                                Mais de 15.000 Episódios Liberados
                                            </span>
                                            <span className="text-[10px] text-stone-300">
                                                Acesso imediato e lançamentos diários.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-stone-100">
                                                Áudio dublado & sem anúncios
                                            </span>
                                            <span className="text-[10px] text-stone-300">
                                                Resolução HD em alta velocidade.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <span className="mt-0.5 size-4 shrink-0 rounded bg-rose-500/20 p-0.5 text-rose-400 flex items-center justify-center">
                                            <Check className="size-3 stroke-[3]" />
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-stone-100">
                                                Acesso em Smart TV & Suporte VIP
                                            </span>
                                            <span className="text-[10px] text-stone-300">
                                                Bônus exclusivos inclusos.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preço em Destaque */}
                                <div className="mb-5 flex w-full flex-col items-center justify-center rounded-2xl border border-rose-500/25 bg-black/40 p-3 text-center">
                                    <span className="text-[10px] font-semibold text-stone-500 line-through">
                                        De R$ 39,90 por apenas
                                    </span>
                                    <div className="mt-0.5 flex items-baseline gap-1 text-white">
                                        <span className="text-sm font-bold">R$</span>
                                        <span className="text-4xl font-extrabold tracking-tight text-rose-500">
                                            {formatMoney(PRICE_UPSELL)}
                                        </span>
                                    </div>
                                    <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                                        ⚠️ Oportunidade única
                                    </span>
                                </div>

                                {/* Botões de Ação */}
                                <div className="w-full space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleAcceptUpsell}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/40 hover:from-rose-500 hover:to-rose-500 transition-all active:scale-[0.98]"
                                    >
                                        <span>Quero todo o catálogo por R$ {formatMoney(PRICE_UPSELL)}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeclineUpsell}
                                        className="w-full text-center py-2 text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
                                    >
                                        Não, prefiro o acesso simples por R$ {formatMoney(PRICE_BASICA)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* =========================================================================
                TELA 2: CHECKOUT COM IDENTIFICAÇÃO E ORDER BUMPS
                ========================================================================= */}
            {currentView === "checkout" && (
                <div className="max-w-xl mx-auto px-4 py-6 sm:py-10 w-full">
                    {/* Topo do Checkout */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <button
                            type="button"
                            onClick={() => setCurrentView("offer")}
                            className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Voltar à oferta</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <Lock className="size-3" />
                            <span>Ambiente 100% Seguro</span>
                        </div>
                    </div>

                    {/* Resumo do Pacote Selecionado */}
                    <div className="mb-6 rounded-2xl border border-rose-500/30 bg-[#161022] p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentCover}
                                alt={currentTitle}
                                className="size-12 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-400">
                                    {selectedPackage === "upsell" ? "⭐ Pacote VIP Selecionado" : "🎬 Novela Selecionada"}
                                </span>
                                <h3 className="text-sm font-bold text-white truncate">
                                    {selectedPackage === "upsell" ? "Catálogo VIP Completo (Acesso Ilimitado)" : currentTitle}
                                </h3>
                                <p className="text-xs text-stone-400">
                                    {selectedPackage === "upsell"
                                        ? "Acesso total a todas as novelinhas"
                                        : "Temporada completa em Full HD"}
                                </p>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <span className="block text-base font-extrabold text-rose-400">
                                R$ {formatMoney(selectedPackage === "upsell" ? PRICE_UPSELL : PRICE_BASICA)}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsUpsellModalOpen(true)}
                                className="text-[10px] text-stone-400 underline hover:text-white"
                            >
                                Alterar pacote
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleGeneratePix} className="space-y-6">
                        {/* 1. SEÇÃO DE IDENTIFICAÇÃO */}
                        <section className="rounded-2xl border border-white/10 bg-[#120e1a] p-5 text-left">
                            <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
                                Identificação
                            </h2>

                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-stone-300 mb-1.5" htmlFor="of-name">
                                        Nome completo
                                    </label>
                                    <input
                                        id="of-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value.slice(0, 100))}
                                        placeholder="Digite seu nome completo"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none focus:border-rose-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-300 mb-1.5" htmlFor="of-email">
                                        E-mail{" "}
                                        <span className="font-bold text-amber-400">
                                            (VERIFIQUE SE SEU EMAIL ESTÁ CORRETO)
                                        </span>
                                    </label>
                                    <input
                                        id="of-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.slice(0, 160))}
                                        placeholder="seuemail@exemplo.com"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none focus:border-rose-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-stone-300 mb-1.5" htmlFor="of-phone">
                                        Celular / WhatsApp{" "}
                                        <span className="font-bold text-amber-400">
                                            (VERIFIQUE SE SEU NÚMERO ESTÁ CORRETO)
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-xl border border-white/10 bg-black/50 px-3.5 py-3 text-sm font-semibold text-stone-400">
                                            +55
                                        </span>
                                        <input
                                            id="of-phone"
                                            type="tel"
                                            inputMode="numeric"
                                            value={phone}
                                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                                            placeholder="(11) 99999-9999"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-stone-500 outline-none focus:border-rose-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. SEÇÃO DE ORDER BUMPS */}
                        <section className="space-y-3">
                            {ORDER_BUMPS.map((bump) => {
                                const isChecked = selectedBumps.includes(bump.id);
                                return (
                                    <button
                                        key={bump.id}
                                        type="button"
                                        onClick={() => toggleBump(bump.id)}
                                        className={`flex w-full items-start gap-3.5 rounded-2xl border-2 border-dashed p-4 text-left transition-all ${
                                            isChecked
                                                ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10"
                                                : "border-white/15 bg-[#120e1a] hover:border-rose-500/40"
                                        }`}
                                    >
                                        <span
                                            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                                                isChecked
                                                    ? "border-rose-500 bg-rose-500 text-white"
                                                    : "border-stone-500 bg-black/40"
                                            }`}
                                        >
                                            {isChecked && <Check className="size-3.5 stroke-[3]" />}
                                        </span>

                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={bump.iconUrl}
                                            alt=""
                                            className="mt-0.5 size-10 shrink-0 rounded-lg object-cover border border-white/10"
                                        />

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-extrabold text-white">
                                                {bump.title}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-stone-400">
                                                {bump.description}
                                            </span>
                                            <span className="mt-1 block text-sm font-black text-rose-400">
                                                + R$ {formatMoney(bump.price)}
                                            </span>
                                        </span>

                                        <span
                                            className={`mt-0.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                                isChecked
                                                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                                                    : "border border-rose-500 text-rose-400"
                                            }`}
                                        >
                                            {isChecked ? "Adicionado" : "+ Eu quero"}
                                        </span>
                                    </button>
                                );
                            })}
                        </section>

                        {/* 3. SEÇÃO FORMA DE PAGAMENTO */}
                        <section className="rounded-2xl border border-white/10 bg-[#120e1a] p-5 text-left">
                            <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
                                Forma de pagamento
                            </h2>

                            <div className="mt-4">
                                <div className="flex items-center gap-3 rounded-xl border border-rose-500 bg-rose-500/10 p-4">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rose-500/20 text-rose-400">
                                        <Zap className="size-4" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white">Pix</p>
                                        <p className="text-[11px] text-emerald-400 font-semibold">
                                            Aprovação em segundos
                                        </p>
                                    </div>
                                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-rose-500 bg-rose-500 text-white">
                                        <Check className="size-4 stroke-[3]" />
                                    </span>
                                </div>

                                <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-4 text-xs leading-relaxed text-stone-400">
                                    O pagamento via Pix é instantâneo. Assim que a confirmação chegar, seu acesso é liberado automaticamente — sem precisar enviar comprovante.
                                </div>

                                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                                    <span className="text-xs text-stone-400">Valor à vista</span>
                                    <span className="text-2xl font-black text-rose-400">
                                        R$ {formatMoney(currentTotalAmount)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {formError && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-center text-xs font-semibold text-red-400">
                                {formError}
                            </div>
                        )}

                        {/* Botão de Finalizar Compra com Animação Shine Sweep */}
                        <button
                            type="submit"
                            disabled={generatingPix}
                            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 px-6 py-4 text-base font-black uppercase tracking-wider text-white shadow-xl shadow-rose-600/40 disabled:opacity-60 transition-all active:scale-[0.98]"
                        >
                            {generatingPix ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Gerando Pix seguro...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="size-5" />
                                    <span>Finalizar compra</span>
                                </>
                            )}
                            <span
                                className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                                aria-hidden="true"
                            >
                                <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shine-sweep" />
                            </span>
                        </button>

                        <p className="flex items-center justify-center gap-2 text-center text-[11px] text-stone-400">
                            <ShieldCheck className="size-4 text-emerald-400" />
                            <span>Pagamento 100% seguro · Acesso imediato</span>
                        </p>
                    </form>
                </div>
            )}

            {/* =========================================================================
                TELA 3: TELA DO PIX GERADO COM AVISO VERMELHO
                ========================================================================= */}
            {currentView === "pix" && pixOrder && (
                <div className="max-w-md mx-auto px-4 py-8 sm:py-12 w-full text-center">
                    {/* Botão de Voltar */}
                    <div className="flex justify-start mb-4">
                        <button
                            type="button"
                            onClick={() => setCurrentView("checkout")}
                            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Alterar dados / Voltar</span>
                        </button>
                    </div>

                    <section className="rounded-3xl border border-white/10 bg-[#120e1a] p-6 shadow-2xl text-center">
                        <h2 className="text-base sm:text-lg font-extrabold text-white mb-1">
                            Pague com Pix para liberar o acesso
                        </h2>
                        <p className="text-xs text-stone-400 mb-4">
                            Valor total:{" "}
                            <strong className="text-rose-400 font-extrabold text-sm">
                                R$ {formatMoney(pixOrder.amount)}
                            </strong>
                        </p>

                        {/* QR Code SVG */}
                        <div className="mx-auto size-60 rounded-2xl border border-white/10 bg-white p-3 shadow-inner flex items-center justify-center">
                            <QRCodeSVG
                                value={pixOrder.pixCopyPaste}
                                size={216}
                                level="M"
                                includeMargin={false}
                            />
                        </div>

                        <p className="mt-4 text-center text-xs text-stone-400">
                            Escaneie o QR Code ou use o código copia-e-cola. Expira em{" "}
                            <span className="font-bold text-white font-mono">
                                {formattedMinutes}:{formattedSeconds}
                            </span>
                        </p>

                        {/* CAIXA VERMELHA DE ATENÇÃO MÁXIMA COM TEXTO BRILHANTE (GLOW RED) */}
                        <div className="mt-5 rounded-xl border-2 border-red-600 bg-black/90 p-4 text-center shadow-lg shadow-red-950/40">
                            <p className="text-sm font-black uppercase leading-snug text-red-500 animate-glow-red">
                                ⚠️ ATENÇÃO: NÃO FECHE ESTA PÁGINA
                            </p>
                            <p className="mt-2 text-xs font-semibold leading-relaxed text-red-400">
                                Depois de pagar o Pix no app do seu banco, volte para esta tela e aguarde a confirmação. Seu acesso só é liberado automaticamente enquanto ela estiver aberta.
                            </p>
                        </div>

                        {/* Código Pix Copia e Cola */}
                        <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3 text-left">
                            <p className="break-all font-mono text-[11px] leading-relaxed text-stone-300 max-h-24 overflow-y-auto">
                                {pixOrder.pixCopyPaste}
                            </p>
                        </div>

                        {/* Botão Copiar Código Pix */}
                        <button
                            type="button"
                            onClick={handleCopyPix}
                            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all ${
                                copiedPix
                                    ? "bg-emerald-600 text-white"
                                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                            }`}
                        >
                            {copiedPix ? (
                                <>
                                    <Check className="size-4 stroke-[3]" />
                                    <span>Código copiado com sucesso!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4" />
                                    <span>Copiar código Pix</span>
                                </>
                            )}
                        </button>

                        {/* Status de Aguardo com Spinner */}
                        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-stone-400">
                            <Loader2 className="size-3.5 animate-spin text-rose-500" />
                            <span>Aguardando confirmação do pagamento no banco…</span>
                        </div>
                    </section>

                    {/* Tela de Celebração de Pagamento Confirmado */}
                    {isPaymentConfirmed && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="max-w-sm w-full bg-[#14101e] border-2 border-emerald-500 rounded-3xl p-6 text-center shadow-2xl">
                                <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <Check className="size-8 stroke-[3]" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                    Pagamento Confirmado! 🎉
                                </h3>
                                <p className="text-xs text-stone-300 mb-4">
                                    Seu acesso aos 60 episódios de{" "}
                                    <strong className="text-white">{currentTitle}</strong> foi liberado com sucesso.
                                </p>
                                <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                                    Redirecionando para o player agora...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* RODAPÉ LEGAL DE CONFORMIDADE COM META / FACEBOOK ADS */}
            <footer className="w-full mt-auto border-t border-white/10 bg-[#06050a] py-8 px-4 text-center text-xs text-stone-500">
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="TvDrama Reels" className="h-6 w-auto object-contain opacity-75" />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-stone-400 font-medium">
                        <Link href="/termos" target="_blank" className="hover:text-white transition-colors">
                            Termos de Uso
                        </Link>
                        <span>•</span>
                        <Link href="/privacidade" target="_blank" className="hover:text-white transition-colors">
                            Políticas de Privacidade
                        </Link>
                        <span>•</span>
                        <a
                            href={`https://wa.me/5581997823907?text=${encodeURIComponent("Olá! Estou na página da novela e gostaria de tirar uma dúvida sobre meu acesso.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            Suporte ao Cliente
                        </a>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-relaxed max-w-lg mx-auto">
                        Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site. Fazemos todos os esforços para indicar claramente e apresentar a plataforma com transparência.
                    </p>

                    <p className="text-[10px] text-stone-600">
                        TvDrama Reels © 2026 – Todos os direitos reservados.
                    </p>
                </div>
            </footer>

            {/* WIDGET FLUTUANTE DE SUPORTE WHATSAPP */}
            <a
                href={`https://wa.me/5581997823907?text=${encodeURIComponent("Olá! Vi a oferta da novela Ganhei Três Namoradas (Dublada) no site e gostaria de tirar uma dúvida.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-white text-xs font-bold shadow-[0_4px_20px_rgba(16,185,129,0.45)] transition-all active:scale-95 group"
                aria-label="Falar com suporte no WhatsApp"
            >
                <MessageCircle className="size-4 fill-white text-emerald-600" />
                <span className="hidden sm:inline">Dúvidas? Fale Conosco</span>
                <span className="sm:hidden">Ajuda</span>
            </a>
        </div>
    );
}
