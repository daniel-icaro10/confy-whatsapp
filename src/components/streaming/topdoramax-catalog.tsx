"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_OFFER_PLANS, OfferPlan } from "@/lib/segredos-defaults";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";
import { PwaInstallModal } from "@/components/streaming/pwa-install-modal";

export interface Episode {
    id: string;
    number: number;
    title: string;
    isFree: boolean;
    durationSeconds: number;
}

export interface Drama {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string | null;
    category: string;
    tags?: string | null;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isFeatured: boolean;
    isVertical: boolean;
    viewsCount: number;
    likesCount: number;
    episodes: Episode[];
}

function semAcento(t: string): string {
    return (t || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function detectLanguageTag(drama: Drama): "Dublado" | "Legendado" | "Brasileira" {
    const combined = semAcento(`${drama.title} ${drama.category} ${drama.tags || ""}`);
    if (combined.includes("brasileir") || combined.includes("nacional")) return "Brasileira";
    if (combined.includes("legendad")) return "Legendado";
    return "Dublado";
}

function matchesFilterCategory(drama: Drama, filter: string): boolean {
    if (filter === "todos") return true;
    const combined = semAcento(`${drama.title} ${drama.category} ${drama.tags || ""}`);
    if (filter === "dublado") return detectLanguageTag(drama) === "Dublado";
    if (filter === "legendado") return detectLanguageTag(drama) === "Legendado";
    if (filter === "brasileiro") return detectLanguageTag(drama) === "Brasileira" || combined.includes("brasileir");
    if (filter === "lgbt") return combined.includes("lgbt") || combined.includes("bl") || combined.includes("gl");
    return semAcento(drama.category) === semAcento(filter);
}

interface TopDoramaxCatalogProps {
    forceCatalogView?: boolean;
}

export function TopDoramaxCatalog({ forceCatalogView = false }: TopDoramaxCatalogProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [dramas, setDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("todos");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [bannerIndex, setBannerIndex] = useState(0);
    const [activeOverlay, setActiveOverlay] = useState<"none" | "buscar" | "anuncio" | "conta">("none");
    const [expandedRow, setExpandedRow] = useState<{ title: string; items: Drama[] } | null>(null);
    const [lockedSerieModal, setLockedSerieModal] = useState<Drama | null>(null);

    const [viewerPhone, setViewerPhone] = useState("");
    const [isVip, setIsVip] = useState(false);
    const [viewerPlanName, setViewerPlanName] = useState("Acesso Completo");
    const [viewerExpiresAt, setViewerExpiresAt] = useState<string | null>(null);

    const [plans, setPlans] = useState<OfferPlan[]>(DEFAULT_OFFER_PLANS);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [adRedirectMessage, setAdRedirectMessage] = useState(
        "Olá! Vi o anúncio e quero liberar meu acesso para assistir."
    );
    const [isRedirectingToWhatsapp, setIsRedirectingToWhatsapp] = useState(false);
    const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState("");

    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");
    const [vipInitialPlan, setVipInitialPlan] = useState<"monthly" | "quarterly" | "annual">("annual");
    const [pwaModalOpen, setPwaModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 16);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Busca inicial de novelas e configurações do funil
    useEffect(() => {
        async function loadData() {
            try {
                const [dramasRes, funnelRes] = await Promise.all([
                    fetch("/api/dramas"),
                    fetch("/api/funnel/config")
                ]);
                const dramasData = await dramasRes.json();
                const funnelData = await funnelRes.json();

                if (Array.isArray(dramasData?.dramas)) {
                    setDramas(dramasData.dramas);
                }
                if (Array.isArray(funnelData?.plans) && funnelData.plans.length > 0) {
                    setPlans(funnelData.plans);
                }
                const pubPhone = funnelData?.config?.publicWhatsappNumber || "";
                const pubMsg =
                    funnelData?.config?.publicAdRedirectMessage ||
                    "Olá! Vi o anúncio e quero liberar meu acesso para assistir.";
                setWhatsappNumber(pubPhone);
                setAdRedirectMessage(pubMsg);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Verifica acesso VIP (retorno Stripe, parâmetro ?phone= do robô do WhatsApp ou localStorage)
    useEffect(() => {
        const qBusca = searchParams.get("busca");
        if (qBusca !== null) {
            setSearchQuery(qBusca);
        }

        const stripeSessionId = searchParams.get("stripe_session_id");
        if (stripeSessionId) {
            fetch(`/api/stripe/checkout?session_id=${encodeURIComponent(stripeSessionId)}`)
                .then((r) => r.json())
                .then((data) => {
                    if (data?.isPaid && data?.phone) {
                        setViewerPhone(data.phone);
                        setIsVip(true);
                        if (data.planName) setViewerPlanName(data.planName);
                        localStorage.setItem("sdc_viewer_phone", data.phone);
                        localStorage.setItem("sdc_viewer_vip", "true");
                        setLockedSerieModal(null);
                    }
                })
                .catch(() => {});
        }

        const urlPhone = searchParams.get("phone");
        const storedPhone = localStorage.getItem("sdc_viewer_phone");
        const targetPhone = urlPhone || storedPhone || "";

        if (!targetPhone) return;

        async function verifyViewer(phone: string) {
            try {
                const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phone)}`);
                const data = await res.json();
                if (data?.isVip) {
                    setViewerPhone(data.phone);
                    setIsVip(true);
                    if (data.planName) setViewerPlanName(data.planName);
                    if (data.expiresAt) setViewerExpiresAt(data.expiresAt);
                    localStorage.setItem("sdc_viewer_phone", data.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                } else {
                    setIsVip(false);
                    localStorage.removeItem("sdc_viewer_vip");
                }
            } catch {
                // ignore
            }
        }
        verifyViewer(targetPhone);
    }, [searchParams]);

    // Detecta se a visita veio de Tráfego Pago / Anúncio e redireciona para o Funil Automático do WhatsApp
    useEffect(() => {
        if (forceCatalogView) return;
        if (loading) return;

        // Se o cliente veio pelo link liberado do WhatsApp (?phone=) ou retorno da Stripe ou pediu ?catalogo=1, mantém no catálogo
        if (
            searchParams.get("phone") ||
            searchParams.get("stripe_session_id") ||
            searchParams.get("catalogo") === "1" ||
            localStorage.getItem("sdc_viewer_vip") === "true"
        ) {
            return;
        }

        const isFromAdTraffic = Boolean(
            searchParams.get("anuncio") === "1" ||
                searchParams.get("origem") === "anuncio" ||
                searchParams.get("ref") === "ads" ||
                searchParams.get("fbclid") ||
                searchParams.get("ttclid") ||
                searchParams.get("gclid") ||
                searchParams.get("utm_source") ||
                searchParams.get("utm_campaign") ||
                searchParams.get("utm_medium")
        );

        if (isFromAdTraffic && whatsappNumber) {
            const serieParam = searchParams.get("serie") || searchParams.get("drama") || "";
            const matchedDrama = serieParam
                ? dramas.find((d) => d.slug === serieParam || d.id === serieParam)
                : null;

            const finalMessage = matchedDrama
                ? `${adRedirectMessage} (${matchedDrama.title})`
                : adRedirectMessage;

            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
            setWhatsappRedirectUrl(waUrl);
            setIsRedirectingToWhatsapp(true);
            window.location.href = waUrl;
        }
    }, [
        forceCatalogView,
        loading,
        searchParams,
        whatsappNumber,
        adRedirectMessage,
        dramas
    ]);

    const featuredDramas = useMemo(() => {
        const list = dramas.filter((d) => d.isFeatured);
        const base = list.length > 0 ? list : dramas;
        return base.slice(0, 5);
    }, [dramas]);

    // Carrossel automático de 5 segundos igual ao topdoramax.pro/catalogo
    useEffect(() => {
        if (featuredDramas.length <= 1) return;
        const timer = setInterval(() => {
            setBannerIndex((prev) => (prev + 1) % featuredDramas.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredDramas.length]);

    const filteredCatalog = useMemo(() => {
        return dramas.filter((d) => matchesFilterCategory(d, activeCategory));
    }, [dramas, activeCategory]);

    const searchResults = useMemo(() => {
        const q = semAcento(searchQuery);
        if (!q) return [];
        return dramas.filter(
            (d) =>
                semAcento(d.title).includes(q) ||
                semAcento(d.category).includes(q) ||
                semAcento(d.synopsis).includes(q) ||
                semAcento(d.tags || "").includes(q)
        );
    }, [dramas, searchQuery]);

    const top10Dramas = useMemo(() => {
        return [...dramas]
            .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
            .slice(0, 10);
    }, [dramas]);

    const dubladosDramas = useMemo(
        () => dramas.filter((d) => detectLanguageTag(d) === "Dublado"),
        [dramas]
    );

    const legendadosDramas = useMemo(
        () => dramas.filter((d) => detectLanguageTag(d) === "Legendado"),
        [dramas]
    );

    const annualPlan = plans.find((p) => p.key === "annual") || DEFAULT_OFFER_PLANS[1];
    const monthlyPlan = plans.find((p) => p.key === "monthly") || DEFAULT_OFFER_PLANS[0];
    const quarterlyPlan = plans.find((p) => p.key === "quarterly") || DEFAULT_OFFER_PLANS[2];

    const daysRemaining = useMemo(() => {
        if (!viewerExpiresAt) return null;
        const diffMs = new Date(viewerExpiresAt).getTime() - Date.now();
        if (diffMs <= 0) return 0;
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }, [viewerExpiresAt]);

    const handleSelectDrama = (drama: Drama) => {
        if (isVip) {
            router.push(`/assistir/${drama.slug}`);
            return;
        }
        // Visitante fora do tráfego: abre a tela de Série Bloqueada estilo TopDoramax com opção de liberar o display após o pagamento
        setLockedSerieModal(drama);
    };

    const handleOpenPlanCheckout = (
        planKey: "monthly" | "quarterly" | "annual",
        drama?: Drama | null
    ) => {
        setVipInitialPlan(planKey);
        setVipModalTab("pix");
        if (drama) {
            setLockedSerieModal(drama);
        }
        setVipModalOpen(true);
    };

    // Tela de redirecionamento automático quando o clique vem do Anúncio -> Funil WhatsApp
    if (isRedirectingToWhatsapp) {
        return (
            <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase text-[#e11d48] mb-2">
                    TVDRAMA REELS · ATENDIMENTO OFICIAL
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white mb-2 max-w-md">
                    Abrindo seu atendimento no WhatsApp...
                </h1>
                <p className="text-sm text-[#9a9a9a] max-w-sm mb-6 leading-relaxed">
                    Você será atendido automaticamente no nosso WhatsApp para liberar seu acesso imediato ao catálogo completo.
                </p>
                <a
                    href={whatsappRedirectUrl}
                    className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                >
                    Continuar para o WhatsApp
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] pb-28 select-none">
            {/* CABEÇALHO FIXO ESTILO TOPDORAMAX (.topo) */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 sm:px-10 h-[66px] transition-all ${
                    scrolled
                        ? "bg-[#060606]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
                        : "bg-[#060606]/85 sm:bg-gradient-to-b sm:from-black/80 sm:to-transparent backdrop-blur-md sm:backdrop-blur-none"
                }`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveCategory("todos");
                            setSearchQuery("");
                            setActiveOverlay("none");
                            setLockedSerieModal(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-left focus:outline-none"
                    >
                        <span className="font-black text-[20px] sm:text-[22px] tracking-[0.06em] uppercase text-[#e11d48] whitespace-nowrap">
                            TVDRAMA REELS
                        </span>
                    </button>

                    {isVip && (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#22b868]/15 border border-[#22b868]/30 text-[#4ade8a] text-[11px] font-bold">
                            Display Liberado{daysRemaining !== null ? ` · ${daysRemaining}d` : ""}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {isVip ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setPwaModalOpen(true)}
                                className="px-3.5 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                            >
                                Baixar App
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("conta")}
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold tabular-nums transition"
                            >
                                Conta · {viewerPhone.slice(-4)}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setVipModalTab("login");
                                    setVipModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold transition"
                            >
                                Já paguei
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOpenPlanCheckout("annual")}
                                className="px-3.5 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                            >
                                Liberar Catálogo
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => setActiveOverlay("buscar")}
                        aria-label="Buscar séries"
                        className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] grid place-items-center text-white transition"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-4 h-4"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (.conteudo) */}
            <main className="pt-[74px] max-w-[1440px] mx-auto">
                {/* FAIXA DE AVISO DE DISPLAY LIBERADO OU OFERTA DE DESBLOQUEIO */}
                {isVip ? (
                    <div className="mx-4 sm:mx-10 mb-3 px-4 py-2.5 rounded-xl bg-[#22b868]/12 border border-[#22b868]/30 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-[#e6e6eb]">
                            <strong className="text-[#4ade8a] font-bold">Catálogo completo liberado!</strong>{" "}
                            Toque em qualquer série abaixo para assistir todos os episódios sem limites.
                        </div>
                        <button
                            type="button"
                            onClick={() => setPwaModalOpen(true)}
                            className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-bold"
                        >
                            Instalar Aplicativo (PWA)
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => handleOpenPlanCheckout("annual")}
                        className="mx-4 sm:mx-10 mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48]/20 via-[#e11d48]/10 to-[#0e0e11] border border-[#e11d48]/35 flex items-center justify-between gap-3 cursor-pointer hover:border-[#e11d48]/60 transition"
                    >
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                                Libere o display com todas as séries + Aplicativo PWA
                            </div>
                            <div className="text-[11px] text-[#9a9a9a] truncate">
                                Planos a partir de R$ {monthlyPlan.price.toFixed(2).replace(".", ",")}/mês no Pix ou Cartão · Liberação imediata
                            </div>
                        </div>
                        <span className="shrink-0 px-3 py-1 rounded-full bg-[#e11d48] text-white text-[11px] font-bold">
                            Liberar ›
                        </span>
                    </div>
                )}

                {/* 1. PÍLULAS DE FILTRO (.filtros) */}
                <nav
                    aria-label="Categorias do catálogo"
                    className="flex gap-2 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-1"
                >
                    {[
                        { id: "todos", label: "Todos" },
                        { id: "dublado", label: "Dublados" },
                        { id: "legendado", label: "Legendados" },
                        { id: "brasileiro", label: "Brasileiros" },
                        { id: "lgbt", label: "LGBT" }
                    ].map((cat) => {
                        const active = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex-none px-[18px] py-[8px] rounded-full text-[14px] transition ${
                                    active
                                        ? "bg-white text-black font-bold border border-white"
                                        : "bg-[#0d0d0d] text-[#f5f5f5] font-semibold border border-white/22 hover:border-white/40"
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </nav>

                {/* 2. CARROSSEL DE DESTAQUES (.banners / .banner-destaque) */}
                {activeCategory === "todos" && featuredDramas.length > 0 && (
                    <div className="relative mx-4 sm:mx-10 mt-3 mb-2 rounded-[18px] sm:rounded-[24px] overflow-hidden bg-black border border-white/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                        {(() => {
                            const currentBanner =
                                featuredDramas[bannerIndex % featuredDramas.length] ||
                                featuredDramas[0];
                            const langTag = detectLanguageTag(currentBanner);
                            return (
                                <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 min-h-[410px] sm:min-h-[450px] p-5 sm:p-10 pb-11 overflow-hidden bg-black">
                                    {/* Fundo desfocado (.destaque-fundo) */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute -inset-10 blur-[38px] saturate-[1.3] opacity-55 pointer-events-none"
                                    >
                                        <img
                                            src={currentBanner.bannerUrl || currentBanner.coverUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-black/85 to-black/55"
                                    />
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent"
                                    />

                                    {/* Informações do destaque (.destaque-info) */}
                                    <div className="relative z-10 max-w-[620px] grid gap-3.5 text-center md:text-left justify-items-center md:justify-items-start order-2 md:order-1">
                                        <p className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-[#f43f5e]">
                                            Bombando · Nº {(bannerIndex % featuredDramas.length) + 1} hoje
                                        </p>
                                        <h2 className="font-black text-[30px] sm:text-[48px] leading-[0.98] tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] line-clamp-3">
                                            {currentBanner.title}
                                        </h2>
                                        <p className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[14px] font-semibold text-[#f5f5f5]">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[12px] font-extrabold uppercase tracking-[0.03em] ${
                                                    langTag === "Dublado"
                                                        ? "bg-[#e11d48] text-white"
                                                        : "bg-white/90 text-black"
                                                }`}
                                            >
                                                {langTag}
                                            </span>
                                            <span className="text-[#9a9a9a]">•</span>
                                            <span>Minissérie</span>
                                            <span className="text-[#9a9a9a]">•</span>
                                            <span>
                                                {currentBanner.episodes?.length ||
                                                    currentBanner.totalEpisodes}{" "}
                                                episódios
                                            </span>
                                        </p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleSelectDrama(currentBanner)}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#e8e8e8] text-black font-semibold text-[16px] transition transform hover:scale-[1.03]"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="w-5 h-5 fill-current"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M7 4.5v15l12.5-7.5z" />
                                                </svg>
                                                {isVip ? "Assistir" : "Assistir agora"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setLockedSerieModal(currentBanner)}
                                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#8c91a0]/35 hover:bg-[#8c91a0]/50 backdrop-blur-md text-white font-semibold text-[16px] transition transform hover:scale-[1.03]"
                                            >
                                                Mais informações
                                            </button>
                                        </div>
                                    </div>

                                    {/* Capa inclinada à direita/topo (.destaque-capa) */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDrama(currentBanner)}
                                        className="relative z-10 order-1 md:order-2 justify-self-center w-[44vw] max-w-[200px] md:w-[220px] md:max-w-none aspect-[2/3] rounded-[14px] overflow-hidden bg-[#121212] shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] rotate-[2deg] hover:rotate-0 hover:scale-[1.03] transition duration-300"
                                    >
                                        <img
                                            src={currentBanner.coverUrl}
                                            alt={currentBanner.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider">
                                            {langTag}
                                        </span>
                                        <span className="absolute left-2 right-2 bottom-2 z-20 py-1.5 px-2.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold text-center">
                                            {isVip ? "Liberado para você" : "Em alta agora"}
                                        </span>
                                    </button>
                                </div>
                            );
                        })()}

                        {/* Barrinhas animadas do carrossel (.banners-pontos) */}
                        {featuredDramas.length > 1 && (
                            <div className="absolute left-0 right-0 bottom-4 z-20 flex justify-center md:justify-start md:left-10 gap-1.5">
                                {featuredDramas.map((d, idx) => {
                                    const active = idx === bannerIndex % featuredDramas.length;
                                    return (
                                        <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => setBannerIndex(idx)}
                                            aria-label={`Slide ${idx + 1}`}
                                            className={`relative h-1 rounded-sm overflow-hidden transition-all ${
                                                active
                                                    ? "w-11 bg-white/45"
                                                    : "w-6 bg-white/30 hover:bg-white/50"
                                            }`}
                                        >
                                            {active && (
                                                <span className="absolute inset-0 bg-white origin-left animate-[pulse_5s_linear_infinite]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. CAMPO DE BUSCA RÁPIDA (.busca) */}
                <div className="mx-4 sm:mx-10 mt-4 mb-2 flex items-center gap-2.5 px-4 py-3.5 rounded-[12px] bg-[#0f0f10] border border-white/12 focus-within:border-white/30 text-[#9a9a9a] focus-within:text-white transition">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 shrink-0"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="m21 21-4.35-4.35"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    <input
                        id="busca"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar séries..."
                        autoComplete="off"
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] text-white placeholder-[#9a9a9a]"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-[#9a9a9a] hover:text-white px-2"
                        >
                            Limpar
                        </button>
                    )}
                </div>

                {/* RESULTADOS DA BUSCA INLINE */}
                {searchQuery.trim() !== "" && (
                    <section className="px-4 sm:px-10 py-4">
                        <p className="text-sm text-[#9a9a9a] mb-3">
                            {searchResults.length > 0
                                ? `Achamos ${searchResults.length} ${
                                      searchResults.length === 1 ? "série" : "séries"
                                  } para "${searchQuery}"`
                                : `Nenhuma série encontrada para "${searchQuery}"`}
                        </p>
                        {searchResults.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                                {searchResults.map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={handleSelectDrama}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* 4. FILEIRAS HORIZONTAIS (.faixa) QUANDO FILTRO = TODOS */}
                {activeCategory === "todos" && searchQuery.trim() === "" && dramas.length > 0 && (
                    <div className="mt-4 space-y-6">
                        {/* Fileira: Do anúncio */}
                        <section className="relative">
                            <div className="flex items-baseline justify-between px-4 sm:px-10 mb-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedRow({
                                            title: "Do anúncio",
                                            items: dramas
                                        })
                                    }
                                    className="inline-flex items-baseline gap-3 text-left group"
                                >
                                    <span className="font-bold text-[18px] sm:text-[21px] text-[#f5f5f5]">
                                        Do anúncio
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#9a9a9a] group-hover:text-white">
                                        Ver tudo ›
                                    </span>
                                </button>
                            </div>

                            <div className="grid grid-flow-col auto-cols-[calc((100%-32px-20px)/3.3)] sm:auto-cols-[calc((100%-80px-40px)/5)] lg:auto-cols-[calc((100%-80px-60px)/7)] gap-2.5 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-2 snap-x snap-mandatory">
                                {dramas.map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={handleSelectDrama}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Fileira Ranking Top 10 (.faixa-ranking estilo Netflix/TopDoramax) */}
                        {top10Dramas.length > 0 && (
                            <section className="relative">
                                <div className="flex items-baseline justify-between px-4 sm:px-10 mb-2">
                                    <h2 className="font-bold text-[18px] sm:text-[21px] text-[#f5f5f5]">
                                        Top 10 · Bombando hoje
                                    </h2>
                                </div>

                                <div className="grid grid-flow-col auto-cols-[calc((100%-32px-20px)/2.3)] sm:auto-cols-[calc((100%-80px-30px)/4)] lg:auto-cols-[calc((100%-80px-40px)/5)] gap-2.5 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-3 snap-x snap-mandatory">
                                    {top10Dramas.map((drama, idx) => {
                                        const langTag = detectLanguageTag(drama);
                                        return (
                                            <button
                                                key={drama.id}
                                                type="button"
                                                onClick={() => handleSelectDrama(drama)}
                                                className="relative pl-[32%] text-left snap-start group focus:outline-none"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    style={{
                                                        WebkitTextStroke:
                                                            "2px rgba(255,255,255,0.82)"
                                                    }}
                                                    className="absolute left-0 bottom-0 z-10 font-black text-[96px] sm:text-[122px] leading-[0.74] tracking-[-0.06em] text-black select-none pointer-events-none"
                                                >
                                                    {idx + 1}
                                                </span>
                                                <div className="relative z-20 aspect-[2/3] rounded-[8px] overflow-hidden bg-[#121212] shadow-[-8px_0_16px_rgba(0,0,0,0.75)] group-hover:scale-[1.04] transition">
                                                    <img
                                                        src={drama.coverUrl}
                                                        alt={drama.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute left-1.5 bottom-1.5 z-20 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[8.5px] font-extrabold uppercase tracking-wider">
                                                        {langTag}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Fileira: Dublados */}
                        {dubladosDramas.length > 0 && (
                            <section className="relative">
                                <div className="flex items-baseline justify-between px-4 sm:px-10 mb-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedRow({
                                                title: "Dublados",
                                                items: dubladosDramas
                                            })
                                        }
                                        className="inline-flex items-baseline gap-3 text-left group"
                                    >
                                        <span className="font-bold text-[18px] sm:text-[21px] text-[#f5f5f5]">
                                            Dublados
                                        </span>
                                        <span className="text-[13px] font-semibold text-[#9a9a9a] group-hover:text-white">
                                            Ver tudo ›
                                        </span>
                                    </button>
                                </div>

                                <div className="grid grid-flow-col auto-cols-[calc((100%-32px-20px)/3.3)] sm:auto-cols-[calc((100%-80px-40px)/5)] lg:auto-cols-[calc((100%-80px-60px)/7)] gap-2.5 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-2 snap-x snap-mandatory">
                                    {dubladosDramas.map((drama) => (
                                        <CatalogPosterCard
                                            key={drama.id}
                                            drama={drama}
                                            isVip={isVip}
                                            onSelect={handleSelectDrama}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Fileira: Legendados */}
                        {legendadosDramas.length > 0 && (
                            <section className="relative">
                                <div className="flex items-baseline justify-between px-4 sm:px-10 mb-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedRow({
                                                title: "Legendados",
                                                items: legendadosDramas
                                            })
                                        }
                                        className="inline-flex items-baseline gap-3 text-left group"
                                    >
                                        <span className="font-bold text-[18px] sm:text-[21px] text-[#f5f5f5]">
                                            Legendados
                                        </span>
                                        <span className="text-[13px] font-semibold text-[#9a9a9a] group-hover:text-white">
                                            Ver tudo ›
                                        </span>
                                    </button>
                                </div>

                                <div className="grid grid-flow-col auto-cols-[calc((100%-32px-20px)/3.3)] sm:auto-cols-[calc((100%-80px-40px)/5)] lg:auto-cols-[calc((100%-80px-60px)/7)] gap-2.5 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-2 snap-x snap-mandatory">
                                    {legendadosDramas.map((drama) => (
                                        <CatalogPosterCard
                                            key={drama.id}
                                            drama={drama}
                                            isVip={isVip}
                                            onSelect={handleSelectDrama}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* 5. GRADE COMPLETA DO CATÁLOGO (#catalogo) */}
                <section id="catalogo" className="px-4 sm:px-10 pt-6 pb-8">
                    <div className="flex items-baseline justify-between mb-1">
                        <h2 className="font-bold text-[22px] text-[#f5f5f5]">Catálogo</h2>
                    </div>
                    <p className="text-[14px] text-[#9a9a9a] mb-3.5">
                        {loading
                            ? "Carregando catálogo..."
                            : `${filteredCatalog.length} ${
                                  filteredCatalog.length === 1
                                      ? "série disponível"
                                      : "séries disponíveis"
                              }`}
                    </p>

                    {!loading && filteredCatalog.length === 0 ? (
                        <div className="p-10 rounded-2xl bg-[#0e0e11] border border-white/10 text-center">
                            <p className="text-sm text-[#9a9a9a]">
                                Nenhuma série cadastrada nesta categoria ainda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                            {filteredCatalog.map((drama) => (
                                <CatalogPosterCard
                                    key={drama.id}
                                    drama={drama}
                                    isVip={isVip}
                                    onSelect={handleSelectDrama}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* BARRA INFERIOR FLUTUANTE DE VIDRO (.barra do TopDoramax) */}
            <nav
                aria-label="Menu"
                className="fixed left-1/2 bottom-[max(10px,env(safe-area-inset-bottom))] -translate-x-1/2 z-40 flex gap-0.5 w-[min(calc(100%-20px),440px)] p-1.5 rounded-full border border-white/[0.08] bg-[#141418]/75 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
            >
                <button
                    type="button"
                    onClick={() => {
                        setActiveOverlay("none");
                        setLockedSerieModal(null);
                        setExpandedRow(null);
                        setActiveCategory("todos");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex-1 min-h-[50px] py-1 px-1 rounded-full flex flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition ${
                        activeOverlay === "none" && !lockedSerieModal
                            ? "text-white bg-white/12"
                            : "text-[#a3a3ad] hover:text-white"
                    }`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-[21px] h-[21px] fill-none stroke-[1.7] ${
                            activeOverlay === "none" && !lockedSerieModal
                                ? "stroke-[#e11d48]"
                                : "stroke-current"
                        }`}
                    >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <span>Início</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setLockedSerieModal(null);
                        setExpandedRow(null);
                        setActiveOverlay((prev) => (prev === "buscar" ? "none" : "buscar"));
                    }}
                    className={`flex-1 min-h-[50px] py-1 px-1 rounded-full flex flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition ${
                        activeOverlay === "buscar"
                            ? "text-white bg-white/12"
                            : "text-[#a3a3ad] hover:text-white"
                    }`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-[21px] h-[21px] fill-none stroke-[1.7] ${
                            activeOverlay === "buscar" ? "stroke-[#e11d48]" : "stroke-current"
                        }`}
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    <span>Buscar</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setLockedSerieModal(null);
                        setExpandedRow(null);
                        setActiveOverlay((prev) => (prev === "anuncio" ? "none" : "anuncio"));
                    }}
                    className={`flex-1 min-h-[50px] py-1 px-1 rounded-full flex flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition ${
                        activeOverlay === "anuncio"
                            ? "text-white bg-white/12"
                            : "text-[#a3a3ad] hover:text-white"
                    }`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-[21px] h-[21px] fill-none stroke-[1.7] ${
                            activeOverlay === "anuncio" ? "stroke-[#e11d48]" : "stroke-current"
                        }`}
                    >
                        <path d="m3 11 18-5v12L3 14v-3z" />
                        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                    </svg>
                    <span>Do anúncio</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (isVip) {
                            setActiveOverlay((prev) => (prev === "conta" ? "none" : "conta"));
                        } else {
                            handleOpenPlanCheckout("annual");
                        }
                    }}
                    className={`relative flex-1 min-h-[50px] py-1 px-1 rounded-full flex flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition ${
                        activeOverlay === "conta"
                            ? "text-white bg-white/12"
                            : "text-[#a3a3ad] hover:text-white"
                    }`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-[21px] h-[21px] fill-none stroke-[1.7] ${
                            activeOverlay === "conta" ? "stroke-[#e11d48]" : "stroke-current"
                        }`}
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                    <span>{isVip ? "Minha Conta" : "Liberar"}</span>
                    {!isVip && (
                        <span className="absolute top-1.5 right-[calc(50%-16px)] w-2 h-2 rounded-full bg-[#e11d48]" />
                    )}
                </button>
            </nav>

            {/* TELA "VER TUDO" DE UMA FILEIRA (.fileira-toda) */}
            {expandedRow && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black pb-28">
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-10 py-3.5 bg-[#060606]/90 backdrop-blur-md border-b border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setExpandedRow(null)}
                            className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white"
                        >
                            ← Voltar
                        </button>
                        <h2 className="font-bold text-lg text-white truncate">
                            {expandedRow.title}
                        </h2>
                        <span className="text-xs text-[#9a9a9a]">
                            {expandedRow.items.length} séries
                        </span>
                    </div>
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-10 py-5">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                            {expandedRow.items.map((drama) => (
                                <CatalogPosterCard
                                    key={drama.id}
                                    drama={drama}
                                    isVip={isVip}
                                    onSelect={(d) => {
                                        setExpandedRow(null);
                                        handleSelectDrama(d);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ABA "BUSCAR" EM TELA CHEIA (.tela-buscar do TopDoramax) */}
            {activeOverlay === "buscar" && (
                <section className="fixed inset-0 z-30 overflow-y-auto bg-black pb-28">
                    <div className="max-w-[960px] mx-auto pt-4 px-3.5">
                        <div className="flex items-center justify-between min-h-[48px] px-1">
                            <h2 className="font-extrabold text-[28px] text-white tracking-tight">
                                Buscar
                            </h2>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("none")}
                                aria-label="Fechar"
                                className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex items-center gap-2.5 mt-2.5 px-3.5 min-h-[46px] rounded-[8px] bg-[#2f2f2f] text-[#b3b3b3]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-5 h-5 shrink-0"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="m20 20-3.5-3.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Digite o nome da série..."
                                autoFocus
                                className="flex-1 h-[46px] bg-transparent border-0 outline-none text-[16px] text-white placeholder-[#a3a3a3]"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs text-[#b3b3b3] hover:text-white"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>

                        <div className="mt-5">
                            <h3 className="font-bold text-[18px] text-white px-1 mb-2.5">
                                {searchQuery.trim()
                                    ? `Resultados (${searchResults.length})`
                                    : "Em alta no catálogo"}
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {(searchQuery.trim() ? searchResults : dramas).map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={(d) => {
                                            setActiveOverlay("none");
                                            handleSelectDrama(d);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ABA "DO ANÚNCIO" EM TELA CHEIA (.tela-anuncio do TopDoramax) */}
            {activeOverlay === "anuncio" && (
                <section className="fixed inset-0 z-30 overflow-y-auto bg-black pb-28">
                    <div className="max-w-[960px] mx-auto pt-4 px-3.5">
                        <div className="flex items-center justify-between min-h-[48px] px-1">
                            <h2 className="font-extrabold text-[28px] text-white tracking-tight">
                                Do anúncio
                            </h2>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("none")}
                                aria-label="Fechar"
                                className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-bold text-[19px] text-white px-1">
                                As séries do anúncio
                            </h3>
                            <p className="text-[13px] text-[#9a9a9a] px-1 mt-0.5 mb-3">
                                As que você viu no vídeo. Toque na série para assistir.
                            </p>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {dramas.map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={(d) => {
                                            setActiveOverlay("none");
                                            handleSelectDrama(d);
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="mt-8 p-6 rounded-2xl bg-[#0e0e11] border border-white/10 text-center">
                                <h3 className="font-bold text-[19px] text-white mb-1.5">
                                    Não achou a do seu anúncio?
                                </h3>
                                <p className="text-sm text-[#9a9a9a] max-w-md mx-auto mb-4">
                                    Busque pelo nome ou chame nosso atendimento no WhatsApp para conferirmos na hora.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOverlay("buscar")}
                                        className="px-6 min-h-[44px] rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm"
                                    >
                                        Buscar pelo nome
                                    </button>
                                    {whatsappNumber && (
                                        <a
                                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                                adRedirectMessage
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm"
                                        >
                                            Chamar no WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* JANELA "MINHA CONTA" (Quando o cliente está com o display liberado) */}
            {activeOverlay === "conta" && (
                <div
                    onClick={() => setActiveOverlay("none")}
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[460px] rounded-t-[24px] sm:rounded-[22px] bg-[#141418] border border-white/12 p-5 pb-8 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-white">Minha Conta</h3>
                                <p className="text-xs text-[#9a9a9a] font-mono">
                                    WhatsApp: {viewerPhone || "Conectado"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("none")}
                                className="w-8 h-8 rounded-full bg-white/10 text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e11d48]/22 to-[#e11d48]/5 border border-[#e11d48]/35 space-y-1.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[11px] font-bold">
                                DISPLAY LIBERADO · VIP
                            </span>
                            <div className="text-sm font-bold text-white">{viewerPlanName}</div>
                            <div className="text-xs text-[#c9c9d1]">
                                {daysRemaining !== null
                                    ? `Acesso válido por mais ${daysRemaining} dias`
                                    : "Acesso ativo a todas as séries do catálogo"}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveOverlay("none");
                                setPwaModalOpen(true);
                            }}
                            className="w-full min-h-[46px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm"
                        >
                            Baixar Aplicativo (PWA)
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("sdc_viewer_phone");
                                localStorage.removeItem("sdc_viewer_vip");
                                setViewerPhone("");
                                setIsVip(false);
                                setActiveOverlay("none");
                            }}
                            className="w-full py-2.5 text-xs text-[#9a9a9a] hover:text-white underline"
                        >
                            Sair desta conta / Trocar número
                        </button>
                    </div>
                </div>
            )}

            {/* TELA DE SÉRIE BLOQUEADA / LIBERAÇÃO DO DISPLAY (Idêntica a https://topdoramax.pro/catalogo/serie/...) */}
            {lockedSerieModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-[#f5f5f5] pb-16">
                    <header className="sticky top-0 z-20 flex items-center justify-center h-14 bg-black/85 backdrop-blur-md border-b border-white/[0.06]">
                        <span className="font-black text-[19px] tracking-[0.06em] uppercase text-[#e11d48]">
                            TVDRAMA REELS
                        </span>
                    </header>

                    <div className="max-w-[520px] mx-auto px-4 pt-3">
                        {/* Player / Capa Bloqueada (.bloqueada-player) */}
                        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#111114] border border-white/10 mb-4">
                            <button
                                type="button"
                                onClick={() => setLockedSerieModal(null)}
                                aria-label="Voltar ao catálogo"
                                className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-white/15 grid place-items-center text-white"
                            >
                                ←
                            </button>

                            <img
                                src={lockedSerieModal.bannerUrl || lockedSerieModal.coverUrl}
                                alt={lockedSerieModal.title}
                                className="w-full h-full object-cover opacity-45 blur-[2px] scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                <div className="px-4 py-2 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-white text-sm font-bold mb-2">
                                    Série bloqueada
                                </div>
                                {lockedSerieModal.freeEpisodesCount > 0 && (
                                    <Link
                                        href={`/assistir/${lockedSerieModal.slug}?ep=1`}
                                        className="mt-1 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition"
                                    >
                                        Assistir prévia grátis (Ep. 01 a 0
                                        {lockedSerieModal.freeEpisodesCount}) ›
                                    </Link>
                                )}
                            </div>
                        </div>

                        <h1 className="font-black text-[22px] sm:text-[26px] leading-tight uppercase text-white text-center">
                            {lockedSerieModal.title}
                        </h1>
                        <p className="text-xs font-semibold text-[#9a9a9a] text-center mt-1 mb-5">
                            {detectLanguageTag(lockedSerieModal)} · Todos os{" "}
                            {lockedSerieModal.episodes?.length || lockedSerieModal.totalEpisodes}{" "}
                            episódios completos
                        </p>

                        <p className="text-sm font-bold text-white mb-3">
                            Desbloqueie o display para assistir agora:
                        </p>

                        {/* 3 BOTÕES DE PLANOS ESTILO TICKET.CSS DO TOPDORAMAX */}
                        <div className="space-y-2.5">
                            {/* Botão Principal em Destaque (Plano Anual) */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenPlanCheckout("annual", lockedSerieModal)
                                }
                                className="relative w-full text-left p-4 rounded-2xl border-2 border-[#e11d48] bg-[#e11d48]/14 hover:bg-[#e11d48]/22 shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition block"
                            >
                                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-white text-[#e11d48] text-[11px] font-extrabold uppercase">
                                    Mais escolhido · {annualPlan.discountBadge}
                                </span>
                                <strong className="block text-[17px] font-extrabold text-white">
                                    Catálogo Completo (1 Ano) · R${" "}
                                    {annualPlan.price.toFixed(2).replace(".", ",")}
                                </strong>
                                <span className="block text-xs text-[#e6e6eb] mt-0.5">
                                    365 dias · Todas as séries liberadas + App PWA ·{" "}
                                    {annualPlan.savingsText}
                                </span>
                            </button>

                            {/* Botão Menor 1 (Plano Mensal) */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenPlanCheckout("monthly", lockedSerieModal)
                                }
                                className="w-full text-left px-4 py-3 rounded-xl border border-white/15 bg-[#0e0e11] hover:bg-[#16161a] transition block"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <strong className="text-[14.5px] font-bold text-white">
                                        {monthlyPlan.name} · R${" "}
                                        {monthlyPlan.price.toFixed(2).replace(".", ",")}/mês
                                    </strong>
                                    <span className="text-[11px] font-bold text-[#f43f5e]">
                                        {monthlyPlan.discountBadge}
                                    </span>
                                </div>
                                <span className="block text-xs text-[#9a9a9a] mt-0.5">
                                    30 dias · Libera todas as séries na hora · Pix ou Cartão
                                </span>
                            </button>

                            {/* Botão Menor 2 (Plano Trimestral) */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenPlanCheckout("quarterly", lockedSerieModal)
                                }
                                className="w-full text-left px-4 py-3 rounded-xl border border-white/15 bg-[#0e0e11] hover:bg-[#16161a] transition block"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <strong className="text-[14.5px] font-bold text-white">
                                        {quarterlyPlan.name} · R${" "}
                                        {quarterlyPlan.price.toFixed(2).replace(".", ",")}
                                    </strong>
                                    <span className="text-[11px] font-bold text-[#4ade8a]">
                                        3 meses de acesso
                                    </span>
                                </div>
                                <span className="block text-xs text-[#9a9a9a] mt-0.5">
                                    90 dias · Catálogo completo · {quarterlyPlan.savingsText}
                                </span>
                            </button>
                        </div>

                        <p className="text-center text-xs text-[#9a9a9a] mt-4">
                            Já pagou no WhatsApp ou Pix?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setVipModalTab("login");
                                    setVipModalOpen(true);
                                }}
                                className="text-white font-bold underline"
                            >
                                Entre na sua conta
                            </button>{" "}
                            — não precisa pagar de novo.
                        </p>

                        {/* Quem viu também assiste (.bloqueada-outras) */}
                        {dramas.length > 1 && (
                            <div className="mt-7">
                                <p className="font-bold text-sm text-white mb-2.5">
                                    Quem viu também assiste
                                </p>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {dramas
                                        .filter((d) => d.id !== lockedSerieModal.id)
                                        .slice(0, 3)
                                        .map((other) => (
                                            <CatalogPosterCard
                                                key={other.id}
                                                drama={other}
                                                isVip={isVip}
                                                onSelect={(d) => setLockedSerieModal(d)}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL DE PAGAMENTO PIX / STRIPE E LOGIN POR WHATSAPP */}
            <VipAccessModal
                isOpen={vipModalOpen}
                onClose={() => setVipModalOpen(false)}
                onUnlocked={(phone) => {
                    setViewerPhone(phone);
                    setIsVip(true);
                    setVipModalOpen(false);
                    if (lockedSerieModal) {
                        const targetSlug = lockedSerieModal.slug;
                        setLockedSerieModal(null);
                        router.push(`/assistir/${targetSlug}`);
                    }
                }}
                dramaId={lockedSerieModal?.slug}
                dramaTitle={lockedSerieModal?.title}
                defaultTab={vipModalTab}
                initialPlanKey={vipInitialPlan}
                plans={plans}
            />

            {/* MODAL DE INSTALAÇÃO DO APP PWA */}
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

function CatalogPosterCard({
    drama,
    isVip,
    onSelect
}: {
    drama: Drama;
    isVip: boolean;
    onSelect: (drama: Drama) => void;
}) {
    const langTag = detectLanguageTag(drama);
    return (
        <button
            type="button"
            onClick={() => onSelect(drama)}
            className="relative block w-full aspect-[2/3] rounded-[8px] overflow-hidden bg-[#121212] text-left snap-start group focus:outline-none transition duration-200 sm:hover:scale-[1.05] sm:hover:z-10 sm:hover:shadow-[0_16px_34px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.85)]"
        >
            <img
                src={drama.coverUrl}
                alt={drama.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-[65%] bottom-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />

            {/* Etiqueta de status no topo direito */}
            {isVip && (
                <span className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded bg-[#22b868] text-black text-[8px] font-extrabold uppercase">
                    Liberado
                </span>
            )}

            {/* Hover de computador com botão Play + Nome */}
            <div className="hidden sm:flex absolute inset-0 z-10 p-2.5 pb-7 flex-col justify-end items-start gap-1.5 bg-gradient-to-t from-black/95 via-black/70 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-8 h-8 rounded-full bg-white text-black grid place-items-center text-xs font-bold pl-0.5">
                    ▶
                </span>
                <span className="font-bold text-xs text-white leading-tight line-clamp-2">
                    {drama.title}
                </span>
            </div>

            {/* Etiqueta de idioma embaixo à esquerda (.card-idioma do TopDoramax) */}
            <span className="absolute left-1.5 bottom-1.5 z-20 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[8.5px] font-extrabold uppercase tracking-[0.04em]">
                {langTag}
            </span>
        </button>
    );
}
