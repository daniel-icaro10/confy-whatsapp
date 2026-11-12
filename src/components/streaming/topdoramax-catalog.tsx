"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Compass,
    Flame,
    Crown,
    MessageCircle,
    Search,
    Bookmark,
    User,
    X,
    Check,
    Play,
    Sparkles,
    Globe
} from "lucide-react";
import { DEFAULT_OFFER_PLANS, OfferPlan } from "@/lib/segredos-defaults";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";
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
    isShowcaseOnly?: boolean;
}

const DEFAULT_CATALOG_DRAMAS: Drama[] = INITIAL_YOUTUBE_DRAMAS.map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    synopsis: d.synopsis,
    coverUrl: d.coverUrl,
    bannerUrl: d.bannerUrl || d.coverUrl,
    category: d.category,
    tags: d.tags,
    totalEpisodes: d.totalEpisodes,
    freeEpisodesCount: d.freeEpisodesCount,
    isFeatured: d.isFeatured,
    isVertical: d.isVertical,
    viewsCount: d.viewsCount,
    likesCount: d.likesCount,
    episodes: d.episodes.map((ep) => ({
        id: `${d.id}-ep-${ep.number}`,
        number: ep.number,
        title: ep.title,
        isFree: ep.isFree,
        durationSeconds: ep.durationSeconds || 900
    })),
    isShowcaseOnly: false
}));

function semAcento(t: string): string {
    return (t || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export type GenreKey = "alfa" | "bilionario" | "mafia" | "vinganca" | "romance" | "lgbt";

export function detectDramaGenre(drama: Drama): GenreKey {
    const text = semAcento(`${drama.title} ${drama.category || ""} ${drama.tags || ""} ${drama.synopsis || ""}`);

    // LGBT / BL / GL
    if (
        /\b(bl|gl|lgbt|gay|lesbica|lésbica|boys love|girls love)\b/.test(text) ||
        text.includes("do peso a gloria") ||
        text.includes("amor entre rapazes")
    ) {
        return "lgbt";
    }

    // Alfas / Lobos / Dragões / Fantasia Sobrenatural
    if (
        text.includes("lobo") ||
        text.includes("alfa") ||
        text.includes("dragao") ||
        text.includes("dragão") ||
        text.includes("matilha") ||
        text.includes("luna") ||
        text.includes("vampiro") ||
        text.includes("bruxa") ||
        text.includes("imortal") ||
        text.includes("hades") ||
        text.includes("bestiais")
    ) {
        return "alfa";
    }

    // Bilionários / CEOs / Herdeiras / Contratos
    if (
        text.includes("bilionari") ||
        text.includes("ceo") ||
        text.includes("herdeir") ||
        text.includes("magnata") ||
        text.includes("contrato") ||
        text.includes("patrao") ||
        text.includes("patrão") ||
        text.includes("riqueza") ||
        text.includes("fortuna") ||
        text.includes("prefeito") ||
        text.includes("dinheiro")
    ) {
        return "bilionario";
    }

    // Máfia / Chefes / Guarda-Costas / Poder
    if (
        text.includes("mafia") ||
        text.includes("máfia") ||
        text.includes("guarda-costas") ||
        text.includes("chefe") ||
        text.includes("refugio") ||
        text.includes("refúgio") ||
        text.includes("assassino") ||
        text.includes("sabio") ||
        text.includes("sábio") ||
        text.includes("rei das pistas") ||
        text.includes("esparta")
    ) {
        return "mafia";
    }

    // Vingança / Retorno / Traição
    if (
        text.includes("vinganca") ||
        text.includes("vingança") ||
        text.includes("retorno") ||
        text.includes("renasc") ||
        text.includes("traid") ||
        text.includes("traicao") ||
        text.includes("traição") ||
        text.includes("arrependid") ||
        text.includes("humilhad") ||
        text.includes("implacavel") ||
        text.includes("odio") ||
        text.includes("ódio") ||
        text.includes("inimig")
    ) {
        return "vinganca";
    }

    return "romance";
}

function getDramaScore(drama: Drama): number {
    const epCount = drama.episodes?.length || drama.totalEpisodes || 0;
    const views = drama.viewsCount || 0;
    const isFeaturedBonus = drama.isFeatured ? 4000 : 0;
    // Multi-episódios ganham peso para dominar o topo e maximizar retenção
    return (epCount * 1200) + views + isFeaturedBonus;
}

function detectLanguageTag(drama: Drama): "Dublado" | "Legendado" | "Brasileira" {
    const combined = semAcento(`${drama.title} ${drama.category} ${drama.tags || ""}`);
    if (combined.includes("brasileir") || combined.includes("nacional")) return "Brasileira";
    if (combined.includes("legendad")) return "Legendado";
    return "Dublado";
}

export const DISCOVER_CATEGORIES = [
    { id: "populares", label: "🔥 Populares", badge: "Mais assistidos" },
    { id: "dublado", label: "🇧🇷 Dublados", badge: "Áudio em português" },
    { id: "legendado", label: "💬 Legendados", badge: "Com legendas" },
    { id: "novos", label: "✨ Novidades", badge: "Recém adicionados" },
    { id: "drama", label: "🎭 Dramas & Romance", badge: "Amor & Emoção" },
    { id: "bilionario", label: "💎 Bilionários", badge: "CEOs & Contratos" },
    { id: "alfa", label: "🐺 Alfas & Lobos", badge: "Fantasia & Sobrenatural" },
    { id: "mafia", label: "🕶️ Máfia", badge: "Crime & Poder" },
    { id: "vinganca", label: "⚔️ Vingança", badge: "Reviravoltas" },
    { id: "lgbt", label: "🌈 LGBT (BL)", badge: "Diversidade" },
    { id: "todos", label: "🌐 Todos", badge: "Catálogo completo" }
];

function matchesFilterCategory(drama: Drama, filter: string): boolean {
    if (filter === "todos") return true;
    if (filter === "dublado" || filter === "dublados") return detectLanguageTag(drama) === "Dublado";
    if (filter === "legendado" || filter === "legendados") return detectLanguageTag(drama) === "Legendado";
    if (filter === "brasileiro") return detectLanguageTag(drama) === "Brasileira" || semAcento(drama.title + drama.category).includes("brasileir");
    if (filter === "alfa") return detectDramaGenre(drama) === "alfa";
    if (filter === "bilionario") return detectDramaGenre(drama) === "bilionario";
    if (filter === "mafia") return detectDramaGenre(drama) === "mafia";
    if (filter === "vinganca") return detectDramaGenre(drama) === "vinganca";
    if (filter === "romance" || filter === "drama") {
        return detectDramaGenre(drama) === "romance" || semAcento(drama.title + drama.synopsis + (drama.tags || "")).includes("amor") || semAcento(drama.title + drama.synopsis).includes("romance");
    }
    if (filter === "lgbt") return detectDramaGenre(drama) === "lgbt";
    return semAcento(drama.category) === semAcento(filter);
}

interface TopDoramaxCatalogProps {
    forceCatalogView?: boolean;
}

export function TopDoramaxCatalog({ forceCatalogView = false }: TopDoramaxCatalogProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const isAdmin = Boolean(session?.user);

    const [dbDramas, setDbDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"inicio" | "descobrir" | "emalta" | "minhalista">("inicio");
    const [activeCategory, setActiveCategory] = useState<string>("todos");
    const [discoverCategory, setDiscoverCategory] = useState<string>("populares");
    const [myListIds, setMyListIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [bannerIndex, setBannerIndex] = useState(0);
    const [activeOverlay, setActiveOverlay] = useState<"none" | "buscar" | "anuncio" | "conta" | "perfil">("none");
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

    // Sincroniza Minha Lista com o localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("tvdrama_my_list");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setMyListIds(parsed);
            }
        } catch {}
    }, []);

    const toggleMyList = (dramaId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setMyListIds((prev) => {
            const next = prev.includes(dramaId)
                ? prev.filter((id) => id !== dramaId)
                : [...prev, dramaId];
            try {
                localStorage.setItem("tvdrama_my_list", JSON.stringify(next));
            } catch {}
            return next;
        });
    };

    // Busca inicial de novelas do banco e configurações do funil
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
                    setDbDramas(dramasData.dramas);
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

    // Exibe apenas as novelas reais disponíveis no sistema (banco de dados ou catálogo inicial)
    // Filtra rigorosamente qualquer série que possua link de iframe do dailymotion que esteja bloqueado
    const dramas = useMemo(() => {
        const source = dbDramas.length > 0 ? dbDramas : DEFAULT_CATALOG_DRAMAS;
        return source.filter((d) => {
            if (d.slug === "wall-street-nao-negocia-o-amor") return false;
            const hasBlockedIframe = d.episodes?.some(
                (ep: any) =>
                    (ep.youtubeUrl && ep.youtubeUrl.includes("dailymotion.com")) ||
                    (ep.videoUrl && ep.videoUrl.includes("dailymotion.com"))
            );
            return !hasBlockedIframe;
        });
    }, [dbDramas]);

    // Verifica acesso VIP (sessão Admin, retorno Stripe, parâmetro ?phone= do robô do WhatsApp ou localStorage)
    useEffect(() => {
        if (session?.user) {
            setIsVip(true);
            setViewerPhone(session.user.name || session.user.email || "Admin");
            setViewerPlanName("Acesso Administrador Master");
            localStorage.setItem("sdc_viewer_vip", "true");
            setLockedSerieModal(null);
            return;
        }

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
                .catch(() => { });
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

    // Ordena o catálogo priorizando séries de alta retenção (mais episódios, mais visualizações e pôsteres marcantes)
    const sortedDramas = useMemo(() => {
        return [...dramas].sort((a, b) => getDramaScore(b) - getDramaScore(a));
    }, [dramas]);

    const featuredDramas = useMemo(() => {
        return sortedDramas.slice(0, 7);
    }, [sortedDramas]);

    // Carrossel automático de 5 segundos igual ao topdoramax.pro/catalogo
    useEffect(() => {
        if (featuredDramas.length <= 1) return;
        const timer = setInterval(() => {
            setBannerIndex((prev) => (prev + 1) % featuredDramas.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredDramas.length]);

    const handleNextBanner = () => {
        if (featuredDramas.length <= 1) return;
        setBannerIndex((prev) => (prev + 1) % featuredDramas.length);
    };

    const handlePrevBanner = () => {
        if (featuredDramas.length <= 1) return;
        setBannerIndex((prev) => (prev - 1 + featuredDramas.length) % featuredDramas.length);
    };

    // Touch swipe gestures para navegar as capas no mobile com o dedo
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = touchStartY.current ? Math.abs(touchStartY.current - touchEndY) : 0;

        // Se o gesto for horizontal e tiver pelo menos 35px
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                handleNextBanner();
            } else {
                handlePrevBanner();
            }
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    const filteredCatalog = useMemo(() => {
        return sortedDramas.filter((d) => matchesFilterCategory(d, activeCategory));
    }, [sortedDramas, activeCategory]);

    const searchResults = useMemo(() => {
        const q = semAcento(searchQuery);
        if (!q) return [];
        return sortedDramas.filter(
            (d) =>
                semAcento(d.title).includes(q) ||
                semAcento(d.category).includes(q) ||
                semAcento(d.synopsis).includes(q) ||
                semAcento(d.tags || "").includes(q)
        );
    }, [sortedDramas, searchQuery]);

    const top10Dramas = useMemo(() => {
        return sortedDramas.slice(0, 10);
    }, [sortedDramas]);

    const discoverDramas = useMemo(() => {
        let list = sortedDramas;
        if (discoverCategory === "populares") {
            list = sortedDramas.slice(0, 80);
        } else if (discoverCategory === "novos") {
            list = [...dramas].reverse().slice(0, 80);
        } else {
            list = sortedDramas.filter((d) => matchesFilterCategory(d, discoverCategory));
        }

        if (searchQuery.trim()) {
            const q = semAcento(searchQuery);
            return list.filter((d) =>
                semAcento(d.title).includes(q) ||
                semAcento(d.synopsis).includes(q) ||
                semAcento(d.category).includes(q) ||
                semAcento(d.tags || "").includes(q)
            );
        }
        return list;
    }, [sortedDramas, dramas, discoverCategory, searchQuery]);

    const myListDramas = useMemo(() => {
        return sortedDramas.filter((d) => myListIds.includes(d.id) || myListIds.includes(d.slug));
    }, [sortedDramas, myListIds]);

    const reelShortDramas = useMemo(
        () => sortedDramas.slice(0, 18),
        [sortedDramas]
    );

    const dramaBoxDramas = useMemo(
        () => sortedDramas.slice(18, 36),
        [sortedDramas]
    );

    const dubladoDramas = useMemo(
        () => sortedDramas.filter((d) => detectLanguageTag(d) === "Dublado"),
        [sortedDramas]
    );

    const bombandoDramas = useMemo(
        () => sortedDramas.slice(10, 26),
        [sortedDramas]
    );

    const alfasDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "alfa"),
        [sortedDramas]
    );

    const bilionariosDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "bilionario"),
        [sortedDramas]
    );

    const mafiaDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "mafia"),
        [sortedDramas]
    );

    const vingancaDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "vinganca"),
        [sortedDramas]
    );

    const romanceDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "romance"),
        [sortedDramas]
    );

    const lgbtDramas = useMemo(
        () => sortedDramas.filter((d) => detectDramaGenre(d) === "lgbt"),
        [sortedDramas]
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

    const handleSelectDrama = (drama: Drama, forceWatch = false) => {
        if (isVip || isAdmin) {
            router.push(`/assistir/${drama.slug}`);
            return;
        }
        if (forceWatch) {
            router.push(`/assistir/${drama.slug}?ep=1`);
            return;
        }
        // Abre a tela de Série Bloqueada com opção de assistir ep 1 grátis e planos VIP
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

    const handleRedirectWhatsapp = () => {
        if (whatsappNumber) {
            const cleanNumber = whatsappNumber.replace(/\D/g, "");
            const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Olá! Vim pelo TvDrama Reels e quero liberar meu acesso VIP.")}`;
            window.open(url, "_blank");
        } else {
            setVipModalTab("pix");
            setVipModalOpen(true);
        }
    };

    const handleRedirectWhatsappSupport = () => {
        const cleanNumber = (whatsappNumber || "").replace(/\D/g, "");
        const msg = isVip
            ? `Olá! Estou logado no TvDrama Reels e preciso de suporte com meu acesso VIP. (Telefone: ${viewerPhone || "cadastrado"})`
            : "Olá! Vim pelo TvDrama Reels e preciso de suporte com o catálogo de séries.";
        if (cleanNumber) {
            const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");
        } else {
            handleRedirectWhatsapp();
        }
    };

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
        <div className="min-h-dvh bg-[#0c0d0e] font-sans text-[#f5f5f5] pb-32 sm:pb-24 select-none">
            {/* CABEÇALHO FIXO ESTILO HOTPLOT.AI */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-2 px-3 sm:px-10 h-[58px] sm:h-[66px] transition-all ${
                    scrolled
                        ? "bg-[#0c0d0e]/95 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                        : "bg-[#0c0d0e]/90 sm:bg-gradient-to-b sm:from-black/80 sm:to-transparent backdrop-blur-md sm:backdrop-blur-none"
                }`}
            >
                {/* Mobile: Botão Globo à esquerda (estilo HotPlot.ai) */}
                <div className="flex items-center gap-2 sm:hidden shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("descobrir");
                            setActiveOverlay("none");
                        }}
                        aria-label="Descobrir e categorias"
                        className="size-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white/90 active:scale-95 transition cursor-pointer"
                    >
                        <Globe className="size-4" />
                    </button>
                </div>

                {/* Centro no Mobile / Esquerda no Desktop: Logo */}
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-6 min-w-0 flex-1 sm:flex-initial">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveCategory("todos");
                            setActiveTab("inicio");
                            setSearchQuery("");
                            setActiveOverlay("none");
                            setLockedSerieModal(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-left focus:outline-none flex items-center gap-2 group cursor-pointer"
                        aria-label="Ir para a página inicial"
                    >
                        {/* Mobile: Pill centralizada idêntica à referência HotPlot.ai */}
                        <div className="flex sm:hidden items-center gap-2 px-2 py-1 rounded-2xl">
                            <div className="size-7 rounded-xl bg-gradient-to-tr from-[#f43f5e] via-rose-500 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-600/40">
                                H
                            </div>
                            <span className="font-extrabold text-[16px] text-white tracking-tight">
                                HotPlot<span className="text-[#f43f5e]">.ai</span>
                            </span>
                        </div>

                        {/* Desktop: Logo oficial TvDrama Reels */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="TvDrama Reels"
                            className="hidden sm:block h-[34px] sm:h-[40px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                    </button>

                    {/* Navegação Desktop: Início, Descobrir, Em Alta, Minha Lista */}
                    <nav className="hidden md:flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("inicio");
                                setActiveOverlay("none");
                                setSearchQuery("");
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                activeTab === "inicio" && activeOverlay === "none"
                                    ? "bg-white/15 text-white font-bold"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Início</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("descobrir");
                                setActiveOverlay("none");
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                activeTab === "descobrir" && activeOverlay === "none"
                                    ? "bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Descobrir</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("emalta");
                                setActiveOverlay("none");
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                activeTab === "emalta" && activeOverlay === "none"
                                    ? "bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Flame className="w-3.5 h-3.5 text-rose-500" />
                            <span>Em Alta</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("minhalista");
                                setActiveOverlay("none");
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                activeTab === "minhalista" && activeOverlay === "none"
                                    ? "bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Minha Lista</span>
                        </button>
                    </nav>

                    {isAdmin ? (
                        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-[11px] font-bold">
                            👑 Admin Master · Liberado
                        </span>
                    ) : isVip ? (
                        <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-full bg-[#1dcc99]/15 border border-[#1dcc99]/30 text-[#1dcc99] text-[11px] font-bold">
                            Acesso Liberado{daysRemaining !== null ? ` · ${daysRemaining}d` : ""}
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Mobile: Perfil / VIP rápido */}
                    <button
                        type="button"
                        onClick={() => setActiveOverlay("perfil")}
                        className="sm:hidden size-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white/90 active:scale-95 transition cursor-pointer"
                        aria-label="Meu Perfil"
                    >
                        <User className="size-4" />
                    </button>

                    {isAdmin ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex px-3 sm:px-3.5 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-[11px] sm:text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                            >
                                ⚙️ Painel Admin
                            </Link>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("perfil")}
                                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] sm:text-xs font-semibold tabular-nums transition items-center gap-1.5 cursor-pointer"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Perfil</span>
                            </button>
                        </>
                    ) : isVip ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setPwaModalOpen(true)}
                                className="hidden sm:inline-flex px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] sm:text-xs font-bold transition cursor-pointer"
                            >
                                Baixar App
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("perfil")}
                                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1dcc99]/15 hover:bg-[#1dcc99]/25 border border-[#1dcc99]/30 text-[#1dcc99] text-[11px] sm:text-xs font-semibold tabular-nums transition items-center gap-1.5 cursor-pointer"
                            >
                                <Crown className="w-3.5 h-3.5" />
                                <span>VIP ({daysRemaining !== null ? `${daysRemaining}d` : "Ativo"})</span>
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
                                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-[11px] sm:text-xs font-semibold transition cursor-pointer"
                            >
                                Já paguei
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setVipModalTab("pix");
                                    setVipModalOpen(true);
                                }}
                                className="hidden sm:inline-flex px-3 sm:px-3.5 py-1.5 rounded-full grad-gold text-black text-[11px] sm:text-xs font-black shadow-[0_2px_14px_rgba(251,191,36,0.4)] transition transform active:scale-95 items-center gap-1.5 cursor-pointer"
                            >
                                <Crown className="w-3.5 h-3.5 text-black" />
                                <span>Seja VIP</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("perfil")}
                                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] sm:text-xs font-semibold transition items-center gap-1 cursor-pointer"
                                aria-label="Abrir Perfil"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Perfil</span>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (.conteudo) */}
            <main className="pt-[64px] sm:pt-[76px] max-w-[1440px] mx-auto">
                {/* BARRA DE PESQUISA ESTILO HOTPLOT.AI */}
                <div className="px-3 sm:px-10 pt-2 sm:pt-3 pb-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchQuery.trim()) {
                                const el = document.getElementById("search-results-section");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="relative flex items-center w-full bg-[#151419] hover:bg-[#1a1920] focus-within:bg-[#1a1920] border border-white/[0.1] focus-within:border-rose-500/60 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 transition shadow-inner"
                    >
                        <Search className="w-4 h-4 text-white/50 shrink-0 mr-2.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (activeTab !== "inicio" && activeTab !== "descobrir") {
                                    setActiveTab("inicio");
                                }
                            }}
                            placeholder="Buscar séries..."
                            className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-white/40 hover:text-white mr-2.5 p-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-full bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-bold shrink-0 shadow-[0_2px_12px_rgba(244,63,94,0.35)] transition transform active:scale-95 cursor-pointer"
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                {/* 2. CARROSSEL DE DESTAQUES (.banners / .banner-destaque) */}
                {activeTab === "inicio" && searchQuery.trim() === "" && featuredDramas.length > 0 && (
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className="relative mx-3 sm:mx-10 mt-2 sm:mt-3 mb-2 rounded-[18px] sm:rounded-[24px] overflow-hidden bg-black border border-white/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.7)] select-none"
                    >
                        {(() => {
                            const currentBanner =
                                featuredDramas[bannerIndex % featuredDramas.length] ||
                                featuredDramas[0];
                            const langTag = detectLanguageTag(currentBanner);
                            return (
                                <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-5 sm:gap-6 min-h-[380px] sm:min-h-[460px] p-4 sm:p-10 pb-14 overflow-hidden bg-black">
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
                                    <div className="relative z-10 max-w-[620px] w-full grid gap-3 text-center md:text-left justify-items-center md:justify-items-start order-2 md:order-1 mx-auto md:mx-0">
                                        <p className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.08em] uppercase text-[#f43f5e]">
                                            Bombando · Nº {(bannerIndex % featuredDramas.length) + 1} hoje
                                        </p>
                                        <h2 className="font-black text-[24px] sm:text-[40px] md:text-[52px] leading-[1.05] sm:leading-[0.96] tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] line-clamp-3">
                                            {currentBanner.title}
                                        </h2>
                                        <p className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[13px] sm:text-[15px] font-semibold text-[#f5f5f5]">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.03em] ${langTag === "Dublado"
                                                        ? "bg-[#e11d48] text-white"
                                                        : "bg-white/90 text-black"
                                                    }`}
                                            >
                                                {langTag}
                                            </span>
                                            <span className="text-[#9a9a9a]">•</span>
                                            <span>Minissérie</span>
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 w-full mt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleSelectDrama(currentBanner, true)}
                                                className="min-w-[130px] sm:min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-[#e8e8e8] text-black font-bold text-sm sm:text-base transition transform active:scale-95 cursor-pointer shadow-md"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M7 4.5v15l12.5-7.5z" />
                                                </svg>
                                                Assistir
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setLockedSerieModal(currentBanner)}
                                                className="min-w-[130px] sm:min-w-[140px] inline-flex items-center justify-center px-5 py-2.5 sm:py-3 rounded-full bg-[#8c91a0]/35 hover:bg-[#8c91a0]/50 border border-white/10 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition transform active:scale-95 cursor-pointer shadow-md"
                                            >
                                                Mais informações
                                            </button>
                                        </div>
                                    </div>

                                    {/* Capa com botões laterais para passar capa no mobile (.destaque-capa) */}
                                    <div className="relative z-10 order-1 md:order-2 justify-self-center mx-auto flex items-center justify-center">
                                        {/* Botão lateral esquerdo para passar capa */}
                                        {featuredDramas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePrevBanner();
                                                }}
                                                aria-label="Capa anterior"
                                                className="absolute -left-3 sm:-left-5 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/95 active:scale-90 border border-white/20 backdrop-blur-md text-white grid place-items-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition cursor-pointer"
                                            >
                                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleSelectDrama(currentBanner)}
                                            className="relative w-[44vw] max-w-[185px] md:w-[220px] md:max-w-none aspect-[2/3] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] sm:rotate-[2deg] sm:hover:rotate-0 hover:scale-[1.03] transition duration-300 cursor-pointer"
                                        >
                                            <img
                                                src={currentBanner.bannerUrl || currentBanner.coverUrl}
                                                alt={currentBanner.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[8.5px] font-extrabold uppercase tracking-wider">
                                                {langTag}
                                            </span>
                                            <span className="absolute left-2 right-2 bottom-2 z-20 py-1.5 px-2.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold text-center">
                                                Em alta agora
                                            </span>
                                        </button>

                                        {/* Botão lateral direito para passar capa */}
                                        {featuredDramas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNextBanner();
                                                }}
                                                aria-label="Próxima capa"
                                                className="absolute -right-3 sm:-right-5 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/95 active:scale-90 border border-white/20 backdrop-blur-md text-white grid place-items-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition cursor-pointer"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Barra de controle inferior do carrossel (.banners-pontos) */}
                        {featuredDramas.length > 1 && (
                            <div className="absolute left-0 right-0 bottom-3 z-20 flex items-center justify-center md:justify-start md:left-10 gap-2 sm:gap-3">
                                {/* Botão Seta Anterior */}
                                <button
                                    type="button"
                                    onClick={handlePrevBanner}
                                    aria-label="Capa anterior"
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 border border-white/15 backdrop-blur-md text-white grid place-items-center transition cursor-pointer shadow-md"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {/* Cápsula com os marcadores de capa */}
                                <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 shadow-lg">
                                    {featuredDramas.map((d, idx) => {
                                        const active = idx === bannerIndex % featuredDramas.length;
                                        return (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => setBannerIndex(idx)}
                                                aria-label={`Ir para capa ${idx + 1}`}
                                                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                                                    active
                                                        ? "w-8 sm:w-10 bg-[#e11d48] shadow-[0_0_12px_rgba(225,29,72,0.9)]"
                                                        : "w-2.5 sm:w-3 bg-white/35 hover:bg-white/60"
                                                }`}
                                            >
                                                {active && (
                                                    <span className="absolute inset-0 bg-white/30 animate-[pulse_2s_ease-in-out_infinite]" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Botão Seta Próximo */}
                                <button
                                    type="button"
                                    onClick={handleNextBanner}
                                    aria-label="Próxima capa"
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 border border-white/15 backdrop-blur-md text-white grid place-items-center transition cursor-pointer shadow-md"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <span className="hidden md:inline-block text-[11px] font-mono text-neutral-400 ml-1">
                                    {(bannerIndex % featuredDramas.length) + 1} / {featuredDramas.length}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* RESULTADOS DA BUSCA INLINE */}
                {searchQuery.trim() !== "" && (
                    <section id="search-results-section" className="px-4 sm:px-10 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-[#9a9a9a]">
                                {searchResults.length > 0
                                    ? `Achamos ${searchResults.length} ${searchResults.length === 1 ? "série" : "séries"} para "${searchQuery}"`
                                    : `Nenhuma série encontrada para "${searchQuery}"`}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                            >
                                Limpar busca ✕
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                                {searchResults.map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={handleSelectDrama}
                                        isBookmarked={myListIds.includes(drama.id)}
                                        onToggleBookmark={(e) => toggleMyList(drama.id, e)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* 4. FILEIRAS HORIZONTAIS (.faixa) ESTILO HOTPLOT.AI */}
                {activeTab === "inicio" && searchQuery.trim() === "" && dramas.length > 0 && (
                    <div id="principal" className="mt-4 space-y-6 sm:space-y-8">
                        {/* Fileira 1: ReelShort (3 colunas com 6 séries estilo HotPlot.ai) */}
                        <HorizontalRowSection
                            title="ReelShort"
                            items={reelShortDramas}
                            isVip={isVip}
                            onSelect={handleSelectDrama}
                            onExpand={() =>
                                setExpandedRow({ title: "ReelShort", items: reelShortDramas })
                            }
                            myListIds={myListIds}
                            onToggleBookmark={toggleMyList}
                        />

                        {/* Fileira 2: DramaBox (3 colunas com 6 séries estilo HotPlot.ai) */}
                        <HorizontalRowSection
                            title="DramaBox"
                            items={dramaBoxDramas}
                            isVip={isVip}
                            onSelect={handleSelectDrama}
                            onExpand={() =>
                                setExpandedRow({ title: "DramaBox", items: dramaBoxDramas })
                            }
                            myListIds={myListIds}
                            onToggleBookmark={toggleMyList}
                        />

                        {/* Fileira 3: Novelas Dubladas */}
                        {dubladoDramas.length > 0 && (
                            <HorizontalRowSection
                                title="🇧🇷 Novelas Dubladas"
                                items={dubladoDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({ title: "🇧🇷 Novelas Dubladas", items: dubladoDramas })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 4: Tendências — Top 10 (.faixa-ranking com número gigante vazado atrás da capa) */}
                        {top10Dramas.length > 0 && (
                            <section className="relative">
                                <div className="flex items-baseline justify-between px-4 sm:px-10 mb-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedRow({
                                                title: "Tendências",
                                                items: top10Dramas
                                            })
                                        }
                                        className="inline-flex items-baseline gap-3.5 text-left group"
                                    >
                                        <span className="font-bold text-[17px] sm:text-[21px] text-[#f5f5f5]">
                                            Tendências
                                        </span>
                                        <span className="text-[14px] font-semibold text-[#9a9a9a] group-hover:text-white">
                                            Ver tudo ›
                                        </span>
                                    </button>
                                </div>

                                <div className="grid grid-flow-col auto-cols-[calc((100%-32px-16px)/2.1)] sm:auto-cols-[calc((100%-80px-30px)/3.8)] lg:auto-cols-[calc((100%-80px-40px)/5.2)] gap-3 overflow-x-auto no-scrollbar px-4 sm:px-10 pb-4 snap-x snap-mandatory">
                                    {top10Dramas.map((drama, idx) => {
                                        const langTag = detectLanguageTag(drama);
                                        const epCount = drama.episodes?.length || drama.totalEpisodes || 1;
                                        const isBookmarked = myListIds.includes(drama.id) || myListIds.includes(drama.slug);
                                        return (
                                            <div
                                                key={drama.id}
                                                className="group flex flex-col text-left pl-[26%] relative snap-start focus:outline-none transition duration-200"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    style={{
                                                        WebkitTextStroke:
                                                            "2px rgba(255,255,255,0.45)"
                                                    }}
                                                    className="absolute left-0 bottom-8 z-10 font-black text-[92px] sm:text-[124px] leading-[0.74] tracking-[-0.06em] text-transparent select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                                                >
                                                    {idx + 1}
                                                </span>
                                                <div 
                                                    onClick={() => handleSelectDrama(drama)}
                                                    className="relative z-20 w-full aspect-[9/13] rounded-2xl overflow-hidden bg-[#151619] border border-white/[0.08] shadow-[-8px_4px_20px_rgba(0,0,0,0.85)] group-hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                                                >
                                                    <img
                                                        src={drama.coverUrl}
                                                        alt={drama.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                                    <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider">
                                                        {langTag}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => toggleMyList(drama.id, e)}
                                                        aria-label="Salvar na Minha Lista"
                                                        className={`absolute top-2 right-2 z-30 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
                                                            isBookmarked
                                                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/50"
                                                                : "bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/15"
                                                        }`}
                                                    >
                                                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-white" : ""}`} />
                                                    </button>
                                                    <span className="absolute right-2 bottom-2 z-20 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tabular-nums">
                                                        {epCount} EP
                                                    </span>
                                                </div>
                                                <div 
                                                    onClick={() => handleSelectDrama(drama)}
                                                    className="relative z-20 mt-2 px-0.5 min-w-0 cursor-pointer"
                                                >
                                                    <h3 className="font-semibold text-[13px] leading-[17px] text-white line-clamp-2 group-hover:text-rose-400 transition-colors">
                                                        {drama.title}
                                                    </h3>
                                                    <p className="mt-0.5 text-[11px] text-white/50 line-clamp-1">
                                                        {epCount} episódios · {langTag}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Fileira 4: Alfas, Lobos & Fantasia */}
                        {alfasDramas.length > 0 && (
                            <HorizontalRowSection
                                title="🐺 Alfas, Lobos & Fantasia"
                                items={alfasDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({
                                        title: "🐺 Alfas, Lobos & Fantasia",
                                        items: alfasDramas
                                    })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 5: Bilionários & CEOs */}
                        {bilionariosDramas.length > 0 && (
                            <HorizontalRowSection
                                title="💎 Bilionários & Casamentos de Contrato"
                                items={bilionariosDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({
                                        title: "💎 Bilionários & Casamentos de Contrato",
                                        items: bilionariosDramas
                                    })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 6: Máfia & Protetores */}
                        {mafiaDramas.length > 0 && (
                            <HorizontalRowSection
                                title="🕶️ Máfia & Protetores"
                                items={mafiaDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({
                                        title: "🕶️ Máfia & Protetores",
                                        items: mafiaDramas
                                    })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 7: Vingança & Reviravolta */}
                        {vingancaDramas.length > 0 && (
                            <HorizontalRowSection
                                title="⚔️ Vingança & Reviravolta"
                                items={vingancaDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({
                                        title: "⚔️ Vingança & Reviravolta",
                                        items: vingancaDramas
                                    })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 8: Romances & Paixões */}
                        {romanceDramas.length > 0 && (
                            <HorizontalRowSection
                                title="❤️ Romances & Paixões"
                                items={romanceDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({
                                        title: "❤️ Romances & Paixões",
                                        items: romanceDramas
                                    })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}

                        {/* Fileira 9: LGBT (BL & GL) */}
                        {lgbtDramas.length > 0 && (
                            <HorizontalRowSection
                                title="🌈 LGBT (BL & GL)"
                                items={lgbtDramas}
                                isVip={isVip}
                                onSelect={handleSelectDrama}
                                onExpand={() =>
                                    setExpandedRow({ title: "🌈 LGBT (BL & GL)", items: lgbtDramas })
                                }
                                myListIds={myListIds}
                                onToggleBookmark={toggleMyList}
                            />
                        )}
                    </div>
                )}

                {/* 5. GRADE COMPLETA DO CATÁLOGO (#catalogo) NA ABA INÍCIO */}
                {activeTab === "inicio" && searchQuery.trim() === "" && (
                    <section id="catalogo" className="px-4 sm:px-10 pt-6 pb-8">
                        <div className="flex items-baseline justify-between mb-1">
                            <h2 className="font-bold text-[22px] text-[#f5f5f5]">Catálogo Completo</h2>
                        </div>
                        <p className="text-[14px] text-[#9a9a9a] mb-3.5">
                            {filteredCatalog.length}{" "}
                            {filteredCatalog.length === 1 ? "série" : "séries"}
                        </p>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                            {filteredCatalog.map((drama) => (
                                <CatalogPosterCard
                                    key={drama.id}
                                    drama={drama}
                                    isVip={isVip}
                                    onSelect={handleSelectDrama}
                                    isBookmarked={myListIds.includes(drama.id)}
                                    onToggleBookmark={(e) => toggleMyList(drama.id, e)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ABA 2: DESCOBRIR (GÊNEROS E CATEGORIAS REFINADAS) */}
                {activeTab === "descobrir" && (
                    <section className="px-3 sm:px-10 py-3 sm:py-5">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Compass className="size-6 text-rose-500" />
                                <h2 className="text-2xl font-black text-white tracking-tight">Descobrir</h2>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-400">
                                Explore mais de 500 séries organizadas por gênero, dublagem e estilo
                            </p>
                        </div>

                        {/* Pílulas de Categorias Aprimoradas e Fáceis para o Cliente */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-5 scroll-smooth">
                            {DISCOVER_CATEGORIES.map((cat) => {
                                const active = discoverCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setDiscoverCategory(cat.id);
                                            setSearchQuery("");
                                        }}
                                        className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                            active
                                                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-[1.03]"
                                                : "bg-[#141518]/90 text-stone-300 hover:text-white border border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Informações da categoria selecionada */}
                        <div className="flex items-center justify-between mb-4 text-xs text-stone-400 px-1">
                            <span>
                                Mostrando <b className="text-white">{discoverDramas.length}</b> séries
                            </span>
                            <span className="text-[11px] text-rose-400 font-semibold">
                                {DISCOVER_CATEGORIES.find((c) => c.id === discoverCategory)?.badge}
                            </span>
                        </div>

                        {/* Grade de Séries da Categoria */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                            {discoverDramas.map((drama) => (
                                <CatalogPosterCard
                                    key={drama.id}
                                    drama={drama}
                                    isVip={isVip}
                                    onSelect={handleSelectDrama}
                                    isBookmarked={myListIds.includes(drama.id)}
                                    onToggleBookmark={(e) => toggleMyList(drama.id, e)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ABA 3: EM ALTA */}
                {activeTab === "emalta" && (
                    <section className="px-3 sm:px-10 py-3 sm:py-5">
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="size-6 text-rose-500 fill-rose-500" />
                                <h2 className="text-2xl font-black text-white tracking-tight">Em Alta no Brasil</h2>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-400">
                                As séries e episódios mais assistidos e comentados da semana
                            </p>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                            {sortedDramas.slice(0, 48).map((drama, idx) => (
                                <div key={drama.id} className="relative">
                                    {idx < 10 && (
                                        <div className="absolute -top-1.5 -left-1.5 z-20 size-6 rounded-full bg-rose-600 text-white font-black text-[11px] flex items-center justify-center shadow-lg border border-white/20 pointer-events-none">
                                            {idx + 1}
                                        </div>
                                    )}
                                    <CatalogPosterCard
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={handleSelectDrama}
                                        isBookmarked={myListIds.includes(drama.id)}
                                        onToggleBookmark={(e) => toggleMyList(drama.id, e)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ABA 4: MINHA LISTA */}
                {activeTab === "minhalista" && (
                    <section className="px-3 sm:px-10 py-3 sm:py-5">
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Bookmark className="size-6 text-rose-400 fill-rose-400" />
                                <h2 className="text-2xl font-black text-white tracking-tight">Minha Lista</h2>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-400">
                                {myListDramas.length > 0
                                    ? `${myListDramas.length} ${myListDramas.length === 1 ? "série salva" : "séries salvas"} para você assistir`
                                    : "Suas séries salvas para assistir quando quiser"}
                            </p>
                        </div>

                        {myListDramas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="size-16 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
                                    <Bookmark className="size-8 stroke-[1.5]" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Sua lista está vazia</h3>
                                <p className="text-xs text-stone-400 max-w-sm mb-6 leading-relaxed">
                                    Toque no ícone de salvar em qualquer série para adicioná-la aos seus favoritos e continuar assistindo quando quiser.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("inicio")}
                                    className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition cursor-pointer"
                                >
                                    Explorar Catálogo
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
                                {myListDramas.map((drama) => (
                                    <CatalogPosterCard
                                        key={drama.id}
                                        drama={drama}
                                        isVip={isVip}
                                        onSelect={handleSelectDrama}
                                        isBookmarked={true}
                                        onToggleBookmark={(e) => toggleMyList(drama.id, e)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                            {expandedRow.items.map((drama) => (
                                <CatalogPosterCard
                                    key={drama.id}
                                    drama={drama}
                                    isVip={isVip}
                                    onSelect={(d) => {
                                        setExpandedRow(null);
                                        handleSelectDrama(d);
                                    }}
                                    isBookmarked={myListIds.includes(drama.id) || myListIds.includes(drama.slug)}
                                    onToggleBookmark={(e) => toggleMyList(drama.id, e)}
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

            {/* JANELA "MEU PERFIL / MINHA CONTA" */}
            {(activeOverlay === "conta" || activeOverlay === "perfil") && (
                <div
                    onClick={() => setActiveOverlay("none")}
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[440px] rounded-[24px] bg-[#121316] border border-white/10 p-5 sm:p-6 space-y-4 my-auto shadow-2xl"
                    >
                        {/* Topo do Perfil com Avatar */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-white">Meu Perfil</h3>
                                    <p className="text-xs text-stone-400 font-mono">
                                        {viewerPhone ? `WhatsApp: ${viewerPhone}` : "Usuário Convidado"}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveOverlay("none")}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Detalhes do VIP e Dias Restantes */}
                        {isVip ? (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 via-rose-900/20 to-black border border-rose-500/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-black tracking-wide uppercase shadow">
                                        <Crown className="w-3 h-3" /> VIP Ativo
                                    </span>
                                    {daysRemaining !== null && (
                                        <span className="text-xs font-bold text-rose-300">
                                            {daysRemaining} {daysRemaining === 1 ? "dia restante" : "dias restantes"}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-bold text-white">{viewerPlanName}</div>
                                <p className="text-xs text-stone-300 leading-relaxed">
                                    {daysRemaining !== null
                                        ? `Seu acesso VIP está garantido por mais ${daysRemaining} dias com todas as séries e episódios liberados sem cortes.`
                                        : "Acesso total liberado a todas as séries e lançamentos do catálogo."}
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-[#18191e] border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px] font-bold">
                                        CONTA GRATUITA
                                    </span>
                                    <span className="text-[11px] text-stone-400 font-semibold">
                                        Prévias Liberadas
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Desbloqueie o Catálogo Completo</h4>
                                    <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                                        Assine o VIP para assistir todos os episódios de mais de 500 séries dubladas em alta qualidade.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveOverlay("none");
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg transition transform active:scale-95 cursor-pointer"
                                >
                                    Liberar Acesso VIP Agora
                                </button>
                            </div>
                        )}

                        {/* Botão de Suporte pelo WhatsApp */}
                        <div className="space-y-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => handleRedirectWhatsappSupport()}
                                className="w-full min-h-[46px] rounded-full bg-[#25D366] hover:bg-[#22bf5b] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.25)] transition transform active:scale-95 cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 fill-black" />
                                <span>Suporte no WhatsApp</span>
                            </button>
                            <p className="text-[11px] text-center text-stone-400">
                                Precisa de ajuda com seu acesso ou quer tirar dúvidas? Fale conosco!
                            </p>
                        </div>

                        {/* Botão Aplicativo PWA */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveOverlay("none");
                                setPwaModalOpen(true);
                            }}
                            className="w-full min-h-[42px] rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <span>Baixar Aplicativo no Celular</span>
                        </button>

                        {/* Login / Trocar conta */}
                        <div className="text-center pt-1">
                            {isVip || viewerPhone ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.removeItem("sdc_viewer_phone");
                                        localStorage.removeItem("sdc_viewer_vip");
                                        setViewerPhone("");
                                        setIsVip(false);
                                        setActiveOverlay("none");
                                    }}
                                    className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                                >
                                    Sair desta conta / Trocar número
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveOverlay("none");
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                                >
                                    Já assinou em outro aparelho? Entrar com WhatsApp
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TELA DE SÉRIE BLOQUEADA / LIBERAÇÃO DO DISPLAY (Idêntica a https://topdoramax.pro/catalogo/serie/...) */}
            {lockedSerieModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-[#f5f5f5] pb-24">
                    <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 h-14 bg-black/90 backdrop-blur-md border-b border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setLockedSerieModal(null)}
                            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition"
                        >
                            ← Voltar
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="TvDrama Reels"
                            className="h-[28px] sm:h-[34px] w-auto object-contain"
                        />
                        <div className="w-14" />
                    </header>

                    <div className="max-w-[480px] mx-auto px-4 pt-3 flex flex-col items-center text-center">
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

                        <h1 className="font-black text-[20px] sm:text-[24px] leading-tight uppercase text-white text-center">
                            {lockedSerieModal.title}
                        </h1>
                        <p className="text-xs font-semibold text-[#9a9a9a] text-center mt-1 mb-5">
                            {detectLanguageTag(lockedSerieModal)} · Todos os episódios completos
                        </p>

                        <p className="text-sm font-bold text-white mb-3 text-center">
                            Desbloqueie para assistir agora:
                        </p>

                        {/* 3 BOTÕES DE PLANOS ESTILO TICKET.CSS DO TOPDORAMAX */}
                        <div className="space-y-2.5 w-full">
                            {/* Botão Principal em Destaque (Plano Anual) */}
                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenPlanCheckout("annual", lockedSerieModal)
                                }
                                className="relative w-full text-left p-4 rounded-2xl border-2 border-[#e11d48] bg-[#e11d48]/14 hover:bg-[#e11d48]/22 shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition block"
                            >
                                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-white text-[#e11d48] text-[11px] font-extrabold uppercase">
                                    Mais escolhido · {annualPlan.topTag}
                                </span>
                                <strong className="block text-[17px] font-extrabold text-white">
                                    Todas as séries (Plano Anual) · R${" "}
                                    {annualPlan.price.toFixed(2).replace(".", ",")}
                                </strong>
                                <span className="block text-xs text-[#e6e6eb] mt-0.5">
                                    365 dias · O catálogo completo + App PWA ·{" "}
                                    {annualPlan.badge}
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
                                        {monthlyPlan.topTag}
                                    </span>
                                </div>
                                <span className="block text-xs text-[#9a9a9a] mt-0.5">
                                    30 dias · Catálogo completo liberado · Pix ou Cartão
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
                                    90 dias · Catálogo completo · {quarterlyPlan.badge}
                                </span>
                            </button>
                        </div>

                        <p className="text-center text-xs text-[#9a9a9a] mt-4">
                            Já pagou?{" "}
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
                    } else {
                        setLockedSerieModal(null);
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

            {/* BARRA DE NAVEGAÇÃO INFERIOR MOBILE ESTILO HOTPLOT.AI */}
            <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0e0f12]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 pb-[max(8px,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
                {/* 1. Início */}
                <button
                    type="button"
                    onClick={() => {
                        setActiveCategory("todos");
                        setActiveTab("inicio");
                        setSearchQuery("");
                        setActiveOverlay("none");
                        setLockedSerieModal(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                        activeTab === "inicio" && activeOverlay === "none"
                            ? "text-white"
                            : "text-white/45 hover:text-white/80"
                    }`}
                >
                    <Home className={`w-5 h-5 mb-0.5 ${activeTab === "inicio" && activeOverlay === "none" ? "stroke-[2.5]" : ""}`} />
                    <span className="text-[10px] font-semibold">Início</span>
                </button>

                {/* 2. Descobrir */}
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("descobrir");
                        setActiveOverlay("none");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                        activeTab === "descobrir" && activeOverlay === "none"
                            ? "text-rose-400 font-bold"
                            : "text-white/45 hover:text-white/80"
                    }`}
                >
                    <Compass className={`w-5 h-5 mb-0.5 ${activeTab === "descobrir" && activeOverlay === "none" ? "stroke-[2.5]" : ""}`} />
                    <span className="text-[10px] font-semibold">Descobrir</span>
                </button>

                {/* 3. Em Alta (Pílula Rosa Central Estilo HotPlot.ai) */}
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("emalta");
                        setActiveOverlay("none");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex flex-col items-center justify-center py-0.5 px-2 rounded-xl transition cursor-pointer group"
                >
                    <div className={`w-12 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-90 ${
                        activeTab === "emalta" && activeOverlay === "none"
                            ? "bg-[#f43f5e] shadow-[0_0_16px_rgba(244,63,94,0.6)]"
                            : "bg-[#f43f5e]/85 hover:bg-[#f43f5e]"
                    }`}>
                        <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                    <span className={`text-[10px] font-semibold mt-0.5 ${
                        activeTab === "emalta" && activeOverlay === "none"
                            ? "text-rose-400 font-bold"
                            : "text-white/60"
                    }`}>
                        Em Alta
                    </span>
                </button>

                {/* 4. Minha lista */}
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("minhalista");
                        setActiveOverlay("none");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                        activeTab === "minhalista" && activeOverlay === "none"
                            ? "text-rose-400 font-bold"
                            : "text-white/45 hover:text-white/80"
                    }`}
                >
                    <Bookmark className={`w-5 h-5 mb-0.5 ${activeTab === "minhalista" && activeOverlay === "none" ? "stroke-[2.5] fill-rose-400" : ""}`} />
                    <span className="text-[10px] font-semibold">Minha lista</span>
                </button>

                {/* 5. Eu / Perfil */}
                <button
                    type="button"
                    onClick={() => {
                        setActiveOverlay("perfil");
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                        activeOverlay === "perfil" || activeOverlay === "conta"
                            ? "text-rose-400 font-bold"
                            : "text-white/45 hover:text-white/80"
                    }`}
                >
                    <User className={`w-5 h-5 mb-0.5 ${activeOverlay === "perfil" || activeOverlay === "conta" ? "stroke-[2.5]" : ""}`} />
                    <span className="text-[10px] font-semibold">Eu</span>
                </button>
            </nav>
        </div>
    );
}

function HorizontalRowSection({
    title,
    items,
    isVip,
    onSelect,
    onExpand,
    myListIds,
    onToggleBookmark
}: {
    title: string;
    items: Drama[];
    isVip: boolean;
    onSelect: (drama: Drama) => void;
    onExpand: () => void;
    myListIds?: string[];
    onToggleBookmark?: (dramaId: string, e: React.MouseEvent) => void;
}) {
    if (items.length === 0) return null;
    const displayItems = items.slice(0, 6);

    return (
        <section className="relative px-3 sm:px-10">
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <h2 className="font-extrabold text-[17px] sm:text-[21px] text-white tracking-tight">
                    {title}
                </h2>
                <button
                    type="button"
                    onClick={onExpand}
                    className="inline-flex items-center gap-0.5 text-xs sm:text-[13px] font-bold text-white/50 hover:text-white transition-colors cursor-pointer group"
                >
                    <span>Tudo</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3.5">
                {displayItems.map((drama) => (
                    <CatalogPosterCard
                        key={drama.id}
                        drama={drama}
                        isVip={isVip}
                        onSelect={onSelect}
                        isBookmarked={myListIds ? (myListIds.includes(drama.id) || myListIds.includes(drama.slug)) : false}
                        onToggleBookmark={onToggleBookmark ? (e) => onToggleBookmark(drama.id, e) : undefined}
                    />
                ))}
            </div>
        </section>
    );
}

function CatalogPosterCard({
    drama,
    isVip,
    onSelect,
    isBookmarked,
    onToggleBookmark
}: {
    drama: Drama;
    isVip: boolean;
    onSelect: (drama: Drama) => void;
    isBookmarked?: boolean;
    onToggleBookmark?: (e: React.MouseEvent) => void;
}) {
    const langTag = detectLanguageTag(drama);
    const epCount = drama.episodes?.length || drama.totalEpisodes || 1;
    return (
        <div className="group relative flex flex-col text-left w-full">
            {/* Capa com proporção 9:13 e cantos arredondados padrão Hotplot / ReelShort */}
            <div 
                onClick={() => onSelect(drama)}
                className="relative w-full aspect-[9/13] rounded-xl sm:rounded-2xl overflow-hidden bg-[#151619] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:border-rose-500/50 group-hover:shadow-[0_8px_24px_rgba(244,63,94,0.3)] transition-all duration-300 cursor-pointer"
            >
                <img
                    src={drama.coverUrl}
                    alt={drama.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Badge Dublado / Legendado */}
                <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider pointer-events-none">
                    {langTag}
                </span>

                {/* Botão Salvar / Bookmark */}
                {onToggleBookmark && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(e);
                        }}
                        aria-label={isBookmarked ? "Remover da Minha Lista" : "Salvar na Minha Lista"}
                        className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-30 size-6 sm:size-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
                            isBookmarked
                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/50"
                                : "bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15"
                        }`}
                    >
                        <Bookmark className={`size-3 sm:size-3.5 ${isBookmarked ? "fill-white" : ""}`} />
                    </button>
                )}

                {/* Badge VIP Liberado */}
                {isVip && (
                    <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-20 px-1.5 py-0.5 rounded bg-[#1dcc99] text-black text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md pointer-events-none">
                        VIP
                    </span>
                )}
            </div>

            {/* Metadados abaixo do card - Padrão Hotplot.ai */}
            <div 
                onClick={() => onSelect(drama)}
                className="mt-1.5 sm:mt-2 px-0.5 min-w-0 cursor-pointer"
            >
                <h3 className="font-semibold text-xs sm:text-[13px] leading-[15px] sm:leading-[17px] text-white line-clamp-2 group-hover:text-rose-400 transition-colors">
                    {drama.title}
                </h3>
                <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-stone-400 line-clamp-1">
                    {epCount} EP
                </p>
            </div>
        </div>
    );
}
