"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VipAccessModal } from "@/components/streaming/vip-access-modal";

interface EpisodeItem {
    id: string;
    number: number;
    title: string;
    isFree: boolean;
}

interface DramaItem {
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
    episodes: EpisodeItem[];
}

function SegredosCatalogContent() {
    const searchParams = useSearchParams();
    const [dramas, setDramas] = useState<DramaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [search, setSearch] = useState("");

    const [viewerPhone, setViewerPhone] = useState<string>("");
    const [isVip, setIsVip] = useState<boolean>(false);
    const [planPrice, setPlanPrice] = useState<number>(19.9);
    const [vipModalOpen, setVipModalOpen] = useState(false);
    const [vipModalTab, setVipModalTab] = useState<"login" | "pix">("pix");

    useEffect(() => {
        async function loadData() {
            try {
                const [dramasRes, funnelRes] = await Promise.all([
                    fetch("/api/dramas"),
                    fetch("/api/funnel/config")
                ]);
                const dramasData = await dramasRes.json();
                if (dramasData?.dramas) {
                    setDramas(dramasData.dramas);
                }
                const funnelData = await funnelRes.json();
                if (funnelData?.config?.planPrice) {
                    setPlanPrice(Number(funnelData.config.planPrice));
                }
            } catch {
                // fallback
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        const urlPhone = searchParams.get("phone");
        const storedPhone = localStorage.getItem("sdc_viewer_phone");
        const targetPhone = urlPhone || storedPhone || "";

        if (!targetPhone) return;

        async function verifyPhone(phoneToCheck: string) {
            try {
                const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phoneToCheck)}`);
                const data = await res.json();
                if (data?.isVip) {
                    setViewerPhone(data.phone);
                    setIsVip(true);
                    localStorage.setItem("sdc_viewer_phone", data.phone);
                    localStorage.setItem("sdc_viewer_vip", "true");
                } else if (urlPhone) {
                    setViewerPhone(urlPhone);
                }
            } catch {
                // ignore
            }
        }

        verifyPhone(targetPhone);
    }, [searchParams]);

    const categories = [
        "Todas",
        ...Array.from(new Set(dramas.map((d) => d.category).filter(Boolean)))
    ];

    const filteredDramas = dramas.filter((d) => {
        const matchesCat = selectedCategory === "Todas" || d.category === selectedCategory;
        const matchesSearch =
            !search.trim() ||
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.synopsis.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const featuredDrama = dramas.find((d) => d.isFeatured) || dramas[0];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    <Link href="/" className="font-semibold text-base tracking-tight text-white">
                        Segredos do Coração
                    </Link>

                    <div className="flex items-center gap-2">
                        {isVip ? (
                            <span className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
                                Acesso ativo · {viewerPhone}
                            </span>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("login");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-300 transition"
                                >
                                    Entrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVipModalTab("pix");
                                        setVipModalOpen(true);
                                    }}
                                    className="px-3.5 py-1.5 rounded bg-white hover:bg-neutral-200 text-xs font-medium text-black transition"
                                >
                                    Liberar acesso
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {featuredDrama && (
                <section className="relative border-b border-neutral-800 bg-[#111111]">
                    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                        <Link
                            href={`/assistir/${featuredDrama.slug}`}
                            className="w-40 sm:w-48 aspect-[9/14] rounded-lg overflow-hidden border border-neutral-800 shrink-0"
                        >
                            <img
                                src={featuredDrama.coverUrl}
                                alt={featuredDrama.title}
                                className="w-full h-full object-cover"
                            />
                        </Link>

                        <div className="flex-1 text-center md:text-left">
                            <div className="text-xs text-neutral-400 mb-2">
                                {featuredDrama.category} · {featuredDrama.totalEpisodes} episódios
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                                {featuredDrama.title}
                            </h1>

                            <p className="text-sm text-neutral-400 max-w-2xl mb-6 leading-relaxed">
                                {featuredDrama.synopsis}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <Link
                                    href={`/assistir/${featuredDrama.slug}`}
                                    className="px-5 py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-medium text-sm transition"
                                >
                                    Assistir agora
                                </Link>

                                {!isVip && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVipModalTab("pix");
                                            setVipModalOpen(true);
                                        }}
                                        className="px-5 py-2.5 rounded border border-neutral-700 hover:border-neutral-500 text-white text-sm transition"
                                    >
                                        Liberar catálogo completo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="max-w-6xl mx-auto w-full px-4 pt-6 pb-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition ${
                                    selectedCategory === cat
                                        ? "bg-white text-black"
                                        : "bg-[#141414] hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Buscar novela..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3.5 py-1.5 rounded bg-[#141414] border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
                        />
                    </div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="aspect-[9/14] rounded-lg bg-[#141414] animate-pulse border border-neutral-800"
                            />
                        ))}
                    </div>
                ) : filteredDramas.length === 0 ? (
                    <div className="text-center py-16 rounded-lg border border-neutral-800 bg-[#111111]">
                        <p className="text-neutral-400 text-sm">Nenhuma novela encontrada.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {filteredDramas.map((drama) => (
                            <Link
                                key={drama.id}
                                href={`/assistir/${drama.slug}`}
                                className="group flex flex-col rounded-lg overflow-hidden bg-[#121212] border border-neutral-800 hover:border-neutral-600 transition"
                            >
                                <div className="relative aspect-[9/13] w-full overflow-hidden bg-black">
                                    <img
                                        src={drama.coverUrl}
                                        alt={drama.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-neutral-200">
                                        {drama.category}
                                    </div>
                                </div>

                                <div className="p-3.5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-sm text-white line-clamp-2 leading-snug">
                                            {drama.title}
                                        </h3>
                                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                                            {drama.synopsis}
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                                        <span>{drama.totalEpisodes} episódios</span>
                                        <span className="text-white font-medium">Assistir</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="border-t border-neutral-800 bg-[#0a0a0a] py-6 px-4 mt-12">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <span>Segredos do Coração</span>
                    <Link href="/dashboard" className="hover:text-neutral-300 transition">
                        Administração
                    </Link>
                </div>
            </footer>

            <VipAccessModal
                isOpen={vipModalOpen}
                onClose={() => setVipModalOpen(false)}
                onUnlocked={(phone) => {
                    setViewerPhone(phone);
                    setIsVip(true);
                    setVipModalOpen(false);
                }}
                defaultTab={vipModalTab}
                planPrice={planPrice}
            />
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
            <SegredosCatalogContent />
        </Suspense>
    );
}
