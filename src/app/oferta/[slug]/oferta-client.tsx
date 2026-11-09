"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
    Star,
    MessageCircle,
    Play,
    Loader2,
    Tv,
    Smartphone,
    Film,
    HeartHandshake
} from "lucide-react";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";
import { extractYoutubeId } from "@/lib/segredos-defaults";

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
        photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&h=120&q=80"
    }
];

export function OfertaSalesPageClient({ slug }: { slug: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [drama, setDrama] = useState<DramaOffer | null>(null);
    const [loadingDrama, setLoadingDrama] = useState(true);

    // Audio & Teaser
    const [isMuted, setIsMuted] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    // Sticky mobile bar
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Checkout State
    const [includeBump, setIncludeBump] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [generatingPix, setGeneratingPix] = useState(false);

    // Pix Screen State
    const [pixOrder, setPixOrder] = useState<{
        orderId: string;
        pixCopyPaste: string;
        amount: number;
    } | null>(null);
    const [copiedPix, setCopiedPix] = useState(false);
    const [pixTimeRemaining, setPixTimeRemaining] = useState(24 * 60); // 24 minutos
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

    // Preços
    const basePrice = 9.90;
    const bumpPrice = 10.00;
    const totalPrice = includeBump ? basePrice + bumpPrice : basePrice;

    // Preserva parâmetros UTM
    const utmParams = useMemo(() => {
        const params = new URLSearchParams();
        searchParams.forEach((val, key) => {
            params.set(key, val);
        });
        return params.toString();
    }, [searchParams]);

    // Busca dados da novela
    useEffect(() => {
        async function loadDrama() {
            try {
                const res = await fetch(`/api/dramas/${encodeURIComponent(slug)}`);
                const data = await res.json();
                if (data?.drama) {
                    setDrama({
                        id: data.drama.id,
                        title: data.drama.title,
                        slug: data.drama.slug,
                        synopsis: data.drama.synopsis,
                        coverUrl: data.drama.coverUrl,
                        bannerUrl: data.drama.bannerUrl,
                        category: data.drama.category,
                        totalEpisodes: data.drama.totalEpisodes || data.drama.episodes?.length || 60,
                        trailerYoutubeUrl: data.drama.trailerYoutubeUrl || data.drama.episodes?.[0]?.youtubeUrl,
                        episodes: data.drama.episodes || []
                    });
                } else {
                    const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                        (d) => d.slug === slug || d.id === slug
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
                            totalEpisodes: fallback.totalEpisodes || fallback.episodes.length,
                            trailerYoutubeUrl: fallback.episodes?.[0]?.youtubeUrl,
                            episodes: fallback.episodes
                        });
                    }
                }
            } catch {
                const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                    (d) => d.slug === slug || d.id === slug
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
                        totalEpisodes: fallback.totalEpisodes || fallback.episodes.length,
                        trailerYoutubeUrl: fallback.episodes?.[0]?.youtubeUrl,
                        episodes: fallback.episodes
                    });
                }
            } finally {
                setLoadingDrama(false);
            }
        }
        loadDrama();
    }, [slug]);

    // Scroll listener para a barra fixa mobile
    useEffect(() => {
        const handleScroll = () => {
            setShowStickyBar(window.scrollY > 380);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Meta Pixel: ViewContent
    useEffect(() => {
        if (drama && typeof window !== "undefined" && (window as any).fbq) {
            try {
                (window as any).fbq("track", "ViewContent", {
                    content_name: drama.title,
                    content_category: drama.category,
                    value: basePrice,
                    currency: "BRL"
                });
            } catch {}
        }
    }, [drama]);

    // Extrai o ID do vídeo para a prévia
    const previewVideoId = useMemo(() => {
        if (!drama) return "K5aKv-9gR28";
        if (drama.trailerYoutubeUrl) {
            const id = extractYoutubeId(drama.trailerYoutubeUrl);
            if (id) return id;
        }
        if (drama.episodes?.[0]?.youtubeUrl) {
            const id = extractYoutubeId(drama.episodes[0].youtubeUrl);
            if (id) return id;
        }
        return "K5aKv-9gR28";
    }, [drama]);

    // Controle de áudio via postMessage para o player do YouTube
    const toggleSound = () => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;

        if (isMuted) {
            win.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
            win.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
            win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
            setIsMuted(false);
        } else {
            win.postMessage(JSON.stringify({ event: "command", func: "mute", args: [] }), "*");
            setIsMuted(true);
        }
    };

    // Formata o input de celular/WhatsApp
    const handlePhoneChange = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 2) {
            setPhone(digits);
        } else if (digits.length <= 7) {
            setPhone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
        } else {
            setPhone(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
        }
    };

    // Rolar até o checkout
    const scrollToCheckout = () => {
        const el = document.getElementById("checkout-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Gera cobrança Pix
    const handleGeneratePix = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const cleanDigits = phone.replace(/\D/g, "");
        if (cleanDigits.length < 10) {
            setFormError("Informe um número de WhatsApp válido com DDD.");
            return;
        }

        if (name.trim().length < 3) {
            setFormError("Informe seu nome completo.");
            return;
        }

        if (email.trim().length < 5 || !email.includes("@")) {
            setFormError("Informe um e-mail válido para receber o acesso.");
            return;
        }

        setGeneratingPix(true);

        try {
            // Meta Pixel: InitiateCheckout
            if (typeof window !== "undefined" && (window as any).fbq) {
                try {
                    (window as any).fbq("track", "InitiateCheckout", {
                        content_name: drama?.title,
                        value: totalPrice,
                        currency: "BRL"
                    });
                } catch {}
            }

            const res = await fetch("/api/pix/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: cleanDigits,
                    name: name.trim(),
                    email: email.trim(),
                    dramaId: drama?.id || slug,
                    planKey: includeBump ? "quarterly" : "monthly",
                    amount: totalPrice
                })
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                throw new Error(data.error || "Não foi possível gerar a chave Pix.");
            }

            setPixOrder({
                orderId: data.orderId,
                pixCopyPaste: data.pixCopyPaste,
                amount: data.amount || totalPrice
            });

            // Rola até o card do Pix
            setTimeout(() => {
                const pixCard = document.getElementById("pix-display-card");
                if (pixCard) pixCard.scrollIntoView({ behavior: "smooth" });
            }, 150);
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

    // Contagem regressiva do Pix (24 minutos)
    useEffect(() => {
        if (!pixOrder || isPaymentConfirmed) return;
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
    }, [pixOrder, isPaymentConfirmed]);

    // Polling de checagem do Pix a cada 3 segundos
    useEffect(() => {
        if (!pixOrder?.orderId || isPaymentConfirmed) return;

        let active = true;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/pix/status?orderId=${encodeURIComponent(pixOrder.orderId)}`);
                const data = await res.json();

                if (data?.isPaid && active) {
                    setIsPaymentConfirmed(true);

                    // Meta Pixel: Purchase
                    if (typeof window !== "undefined" && (window as any).fbq) {
                        try {
                            (window as any).fbq("track", "Purchase", {
                                content_name: drama?.title,
                                value: pixOrder.amount,
                                currency: "BRL"
                            });
                        } catch {}
                    }

                    // Salva no localStorage para liberar acesso VIP instantâneo
                    if (data.phone) {
                        localStorage.setItem("sdc_viewer_phone", data.phone);
                        localStorage.setItem("sdc_viewer_vip", "true");
                    }

                    // Redireciona para a página de assistir após 1.8s
                    setTimeout(() => {
                        const targetUrl = `/assistir/${slug}?phone=${encodeURIComponent(data.phone || phone.replace(/\D/g, ""))}`;
                        router.push(targetUrl);
                    }, 1800);
                }
            } catch {
                // ignore
            }
        };

        const interval = setInterval(checkStatus, 3000);
        checkStatus(); // Executa a primeira checagem imediata

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [pixOrder, isPaymentConfirmed, slug, phone, router, drama]);

    const formattedMinutes = String(Math.floor(pixTimeRemaining / 60)).padStart(2, "0");
    const formattedSeconds = String(pixTimeRemaining % 60).padStart(2, "0");

    if (loadingDrama) {
        return (
            <div className="min-h-dvh bg-[#07060a] text-white flex flex-col items-center justify-center p-4">
                <Loader2 className="size-10 animate-spin text-rose-500 mb-3" />
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                    Carregando oferta exclusiva...
                </p>
            </div>
        );
    }

    const currentDramaTitle = drama?.title || "Ganhei Três Namoradas";
    const currentDramaCover = drama?.coverUrl || "https://i.ytimg.com/vi/K5aKv-9gR28/hqdefault.jpg";
    const currentDramaSynopsis = drama?.synopsis ||
        "Jason era um pária na antiga Esparta até se unir a três jovens rejeitadas e despertar um sistema misterioso que lhe concede armas modernas. Agora, eles são imparáveis.";

    return (
        <div className="min-h-dvh bg-[#07060a] text-stone-100 flex flex-col selection:bg-rose-500 selection:text-white pb-24 sm:pb-16 font-sans">
            {/* 1. TOPO: HEADER LIMPO COM LOGO E SELO DE SEGURANÇA */}
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
                {/* 2. BADGE EM ALTA NO BRASIL */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                    <Sparkles className="size-3.5" />
                    <span>🔥 Mais assistida no Brasil hoje</span>
                </div>

                {/* 3. TÍTULO E GANCHO EMOCIONAL */}
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight mb-3">
                    {currentDramaTitle}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md mb-6">
                    {currentDramaSynopsis}
                </p>

                {/* 4. PLAYER DE PRÉVIA VERTICAL 9:16 COM ATIVADOR DE SOM */}
                <div className="w-full max-w-[320px] sm:max-w-[340px] mb-6">
                    <div className="relative aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(225,29,72,0.25)] bg-black">
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube-nocookie.com/embed/${previewVideoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${previewVideoId}`}
                            title={currentDramaTitle}
                            allow="autoplay; fullscreen; picture-in-picture"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105"
                        />

                        {/* Overlay clicável para ativar/mutar som */}
                        <div
                            onClick={toggleSound}
                            className="absolute inset-0 z-20 cursor-pointer flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/40"
                        >
                            {/* Tag superior */}
                            <div className="flex items-center justify-between">
                                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                                    <Film className="size-3 text-rose-500" />
                                    <span>PRÉVIA EXCLUSIVA</span>
                                </span>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSound();
                                    }}
                                    className="bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-95"
                                >
                                    {isMuted ? (
                                        <VolumeX className="size-4 text-rose-400 animate-pulse" />
                                    ) : (
                                        <Volume2 className="size-4 text-emerald-400" />
                                    )}
                                </button>
                            </div>

                            {/* Botão de aviso de som piscando */}
                            <div className="w-full text-center">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all ${
                                    isMuted
                                        ? "bg-rose-600/90 text-white animate-pulse shadow-lg shadow-rose-600/40"
                                        : "bg-emerald-600/90 text-white"
                                }`}>
                                    {isMuted ? "🔊 Toque para ativar o som 🔊" : "Som Ativado ✓"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botão abaixo do player com pulso forte */}
                    <button
                        type="button"
                        onClick={scrollToCheckout}
                        className="mt-4 w-full relative flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(225,29,72,0.6)] animate-pulse-glow transition-all active:scale-95 overflow-hidden"
                    >
                        <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep pointer-events-none" />
                        <Play className="size-4 fill-white" />
                        <span>Assistir novela completa agora</span>
                    </button>
                </div>

                {/* 5. CARD DE OFERTA PRINCIPAL */}
                <div id="checkout-section" className="w-full mt-4 scroll-mt-20">
                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#14101e] to-[#0c0a13] p-5 sm:p-7 shadow-2xl text-left">
                        {/* Selo superior do card */}
                        <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                            Apenas Esta Novela · Vitalício
                        </div>

                        {/* Dados da minissérie */}
                        <div className="flex items-center gap-3.5 mb-5 mt-2 bg-white/5 border border-white/5 p-3.5 rounded-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentDramaCover}
                                alt={currentDramaTitle}
                                className="size-16 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                                <h3 className="text-base font-extrabold text-white leading-tight truncate">
                                    {currentDramaTitle}
                                </h3>
                                <p className="text-xs text-rose-400 font-semibold mt-0.5">
                                    {drama?.totalEpisodes || 60} Episódios Completos · Full HD
                                </p>
                                <span className="inline-block mt-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                    Áudio dublado & legendado
                                </span>
                            </div>
                        </div>

                        {/* Checklist de Benefícios */}
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2.5 text-xs text-stone-200">
                                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="size-3 stroke-[3]" />
                                </div>
                                <span>
                                    <strong className="text-white">Temporada completa liberada:</strong> Assista até o último episódio sem cortes ou interrupções.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5 text-xs text-stone-200">
                                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="size-3 stroke-[3]" />
                                </div>
                                <span>
                                    <strong className="text-white">Zero Anúncios:</strong> Sem comerciais chatos te interrompendo a cada minuto.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5 text-xs text-stone-200">
                                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="size-3 stroke-[3]" />
                                </div>
                                <span>
                                    <strong className="text-white">Assista no Celular e Smart TV:</strong> Compatível com iPhone, Android, Tablet e TV.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5 text-xs text-stone-200">
                                <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="size-3 stroke-[3]" />
                                </div>
                                <span>
                                    <strong className="text-white">Pagamento Único:</strong> Sem mensalidades surpresa ou assinaturas automáticas.
                                </span>
                            </li>
                        </ul>

                        {/* Order Bump Opcional (Catálogo Completo VIP) */}
                        <div
                            onClick={() => setIncludeBump(!includeBump)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all mb-6 flex items-start gap-3 select-none ${
                                includeBump
                                    ? "bg-rose-950/30 border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.25)]"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={includeBump}
                                onChange={(e) => setIncludeBump(e.target.checked)}
                                className="mt-1 size-4 rounded accent-rose-600 cursor-pointer shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="text-[11px] font-black uppercase text-rose-400 flex items-center gap-1">
                                    <Sparkles className="size-3" />
                                    <span>OPORTUNIDADE ÚNICA (+ R$ 10,00)</span>
                                </span>
                                <p className="text-xs font-bold text-white mt-0.5">
                                    Levar também o Catálogo Completo (+500 séries)
                                </p>
                                <p className="text-[11px] text-stone-300 leading-tight mt-0.5">
                                    Tenha acesso liberado a todas as novelas do site por 30 dias com lançamentos diários.
                                </p>
                            </div>
                        </div>

                        {/* Caixa de Preço */}
                        <div className="bg-black/60 border border-white/10 p-4 rounded-2xl text-center mb-6">
                            <span className="text-xs text-stone-400 line-through">
                                De R$ {includeBump ? "49,90" : "29,90"} por apenas:
                            </span>
                            <div className="flex items-baseline justify-center gap-1 text-white mt-0.5">
                                <span className="text-sm font-bold text-stone-400">R$</span>
                                <span className="text-3xl sm:text-4xl font-black text-rose-500 tracking-tight">
                                    {totalPrice.toFixed(2).replace(".", ",")}
                                </span>
                                <span className="text-xs text-stone-400 font-semibold">à vista</span>
                            </div>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                ⚡ Liberação imediata após o pagamento
                            </span>
                        </div>

                        {/* SE JÁ GEROU O PIX: MOSTRA A TELA DE PAGAMENTO */}
                        {pixOrder ? (
                            <div id="pix-display-card" className="bg-[#100c1b] border border-rose-500/40 p-5 rounded-2xl text-center animate-fade">
                                {isPaymentConfirmed ? (
                                    <div className="py-6 flex flex-col items-center">
                                        <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3 animate-bounce">
                                            <Check className="size-8 stroke-[3]" />
                                        </div>
                                        <h4 className="text-lg font-black text-white">Pagamento Confirmado! 🎉</h4>
                                        <p className="text-xs text-stone-300 mt-1">
                                            Seu acesso foi liberado! Redirecionando para os episódios...
                                        </p>
                                        <Loader2 className="size-5 animate-spin text-emerald-400 mt-4" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-3">
                                            <Clock className="size-3.5" />
                                            <span>Expira em {formattedMinutes}:{formattedSeconds}</span>
                                        </div>

                                        <h4 className="text-base font-extrabold text-white mb-1">
                                            Pague via Pix para liberar na hora
                                        </h4>
                                        <p className="text-xs text-stone-300 mb-4">
                                            Abra o app do seu banco ➔ Pix Copia e Cola ➔ Cole o código e pague.
                                        </p>

                                        {/* QR Code visual */}
                                        <div className="bg-white p-3.5 rounded-2xl inline-block mb-4 shadow-xl">
                                            <QRCodeSVG value={pixOrder.pixCopyPaste} size={180} />
                                        </div>

                                        {/* Código Pix Copia e Cola */}
                                        <div className="w-full mb-3">
                                            <div className="bg-black/80 border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-stone-400 break-all select-all mb-2 max-h-16 overflow-y-auto">
                                                {pixOrder.pixCopyPaste}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleCopyPix}
                                                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                                    copiedPix
                                                        ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                }`}
                                            >
                                                {copiedPix ? (
                                                    <>
                                                        <Check className="size-4 stroke-[3]" />
                                                        <span>Código Copiado com Sucesso!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="size-4" />
                                                        <span>Copiar Código Pix</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Status em tempo real */}
                                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2.5 px-3 rounded-xl mt-3">
                                            <Loader2 className="size-3.5 animate-spin" />
                                            <span>Aguardando confirmação do banco...</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* FORMULÁRIO DE CHECKOUT */
                            <form onSubmit={handleGeneratePix} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Maria Silva"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                                        Seu E-mail <span className="text-stone-500 normal-case">(para envio do comprovante)</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="seuemail@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                                        WhatsApp / Celular com DDD <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 outline-none transition-colors font-mono"
                                    />
                                </div>

                                {formError && (
                                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                                        {formError}
                                    </div>
                                )}

                                {/* Abas de Pagamento: Pix ou Cartão */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("pix")}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                            paymentMethod === "pix"
                                                ? "bg-rose-600 text-white border-rose-500 shadow-md"
                                                : "bg-white/5 border-white/10 text-stone-400 hover:text-white"
                                        }`}
                                    >
                                        <Zap className="size-3.5 fill-current" />
                                        <span>Pix Instantâneo</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("card")}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                            paymentMethod === "card"
                                                ? "bg-rose-600 text-white border-rose-500 shadow-md"
                                                : "bg-white/5 border-white/10 text-stone-400 hover:text-white"
                                        }`}
                                    >
                                        <span>Cartão de Crédito</span>
                                    </button>
                                </div>

                                {paymentMethod === "pix" ? (
                                    <button
                                        type="submit"
                                        disabled={generatingPix}
                                        className="w-full relative flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all active:scale-95 disabled:opacity-60 overflow-hidden"
                                    >
                                        <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep pointer-events-none" />
                                        {generatingPix ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Gerando seu Pix...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="size-4 fill-white" />
                                                <span>Pagar R$ {totalPrice.toFixed(2).replace(".", ",")} no Pix</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <a
                                        href={`https://buy.stripe.com/test?client_reference_id=${encodeURIComponent(phone)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all text-center"
                                    >
                                        <span>Pagar com Cartão de Crédito →</span>
                                    </a>
                                )}

                                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-2 pt-1">
                                    <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
                                    <span>Seus dados estão protegidos com criptografia ponta a ponta.</span>
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                {/* 6. GARANTIA BLINDADA DE 7 DIAS */}
                <div className="w-full max-w-xl my-10 p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 text-center flex flex-col items-center">
                    <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/20">
                        <HeartHandshake className="size-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
                        Garantia Incondicional de 7 Dias
                    </span>
                    <h4 className="text-base font-extrabold text-white mb-2">
                        Risco 100% nosso, zero risco para você
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                        Comece a assistir agora mesmo. Se por qualquer motivo você não amar a novela, basta nos enviar uma mensagem no WhatsApp em até 7 dias que devolvemos 100% do seu dinheiro, sem burocracia.
                    </p>
                </div>

                {/* 7. DEPOIMENTOS EM CARROSSEL MARQUEE */}
                <div className="w-full my-6 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        Avaliações Verificadas
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2">
                        O que nossos assinantes estão dizendo
                    </h3>
                    <p className="text-xs text-stone-400 mb-6">
                        Mais de 10.000 pessoas já maratonaram essa novela completa no TvDrama Reels.
                    </p>

                    {/* Marquee Row 1 */}
                    <div className="relative w-full overflow-hidden py-2 mb-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#07060a] to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#07060a] to-transparent" />

                        <div className="flex w-max animate-marquee-left gap-3.5">
                            {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="w-[260px] sm:w-[290px] shrink-0 rounded-2xl border border-white/10 bg-[#120e1c] p-4 text-left shadow-lg"
                                >
                                    <div className="flex items-center gap-3 mb-2.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.photo}
                                            alt={item.name}
                                            className="size-9 rounded-full object-cover border border-rose-500/20"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                                            <p className="text-[10px] text-stone-400">{item.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 text-amber-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="size-3 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-stone-300 italic leading-snug">
                                        &ldquo;{item.text}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Marquee Row 2 */}
                    <div className="relative w-full overflow-hidden py-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#07060a] to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#07060a] to-transparent" />

                        <div className="flex w-max animate-marquee-right gap-3.5">
                            {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="w-[260px] sm:w-[290px] shrink-0 rounded-2xl border border-white/10 bg-[#120e1c] p-4 text-left shadow-lg"
                                >
                                    <div className="flex items-center gap-3 mb-2.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.photo}
                                            alt={item.name}
                                            className="size-9 rounded-full object-cover border border-rose-500/20"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                                            <p className="text-[10px] text-stone-400">{item.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 text-amber-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="size-3 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-stone-300 italic leading-snug">
                                        &ldquo;{item.text}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 8. DISPOSITIVOS SUPORTADOS */}
                <div className="w-full my-8 p-5 rounded-3xl border border-white/10 bg-white/5 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">
                        Assista onde e quando quiser
                    </span>
                    <div className="flex items-center justify-center gap-8 text-stone-300">
                        <div className="flex flex-col items-center gap-1.5">
                            <Smartphone className="size-6 text-rose-400" />
                            <span className="text-[11px] font-semibold">Celular</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Tv className="size-6 text-rose-400" />
                            <span className="text-[11px] font-semibold">Smart TV</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Film className="size-6 text-rose-400" />
                            <span className="text-[11px] font-semibold">Tablet / PC</span>
                        </div>
                    </div>
                </div>

                {/* 9. RODAPÉ */}
                <footer className="w-full pt-8 text-center text-[11px] text-stone-500 border-t border-white/5">
                    <p className="mb-1">
                        © {new Date().getFullYear()} TvDrama Reels. Todos os direitos reservados.
                    </p>
                    <p className="text-[10px] text-stone-600">
                        Plataforma oficial de streaming de novelas verticais e minisséries curtas em alta definição.
                    </p>
                </footer>
            </main>

            {/* 10. BARRA FLUTUANTE INFERIOR NO MOBILE (STICKY FOOTER) */}
            {showStickyBar && (
                <div className="fixed inset-x-0 bottom-0 z-40 bg-[#0d0917]/95 border-t border-white/10 backdrop-blur-lg px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] animate-slide-up sm:hidden">
                    <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentDramaCover}
                                alt={currentDramaTitle}
                                className="size-10 rounded-lg object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate leading-tight">
                                    {currentDramaTitle}
                                </p>
                                <p className="text-[11px] text-emerald-400 font-bold">
                                    Completa por R$ {totalPrice.toFixed(2).replace(".", ",")}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={scrollToCheckout}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/40 shrink-0 active:scale-95 transition-all"
                        >
                            Adquirir já
                        </button>
                    </div>
                </div>
            )}

            {/* 11. BOTÃO FLUTUANTE DE SUPORTE WHATSAPP */}
            <a
                href={`https://wa.me/5581997823907?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre a novela ${currentDramaTitle}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-20 sm:bottom-6 right-4 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.5)] transition-transform hover:scale-110 active:scale-95 flex items-center gap-2 group"
                title="Tirar dúvidas no WhatsApp"
            >
                <MessageCircle className="size-5 fill-current" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold group-hover:max-w-xs transition-all duration-300">
                    Dúvidas? Fale conosco
                </span>
            </a>
        </div>
    );
}
