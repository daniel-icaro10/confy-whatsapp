import type { Metadata } from "next";
import { Suspense } from "react";
import { OfertaSalesPageClient, DramaOffer } from "./oferta-client";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";
import { prisma } from "@/lib/prisma";

interface OfertaPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: OfertaPageProps): Promise<Metadata> {
    const { slug } = await params;
    let title = "Oferta Especial — TvDrama Reels";
    let description = "Assista à novela completa em Full HD sem anúncios com liberação imediata via Pix.";
    let coverUrl = "https://tvdramareels.online/logo-banner.png";

    try {
        const drama = await prisma.drama.findFirst({
            where: {
                OR: [{ slug }, { id: slug }]
            },
            select: { title: true, synopsis: true, coverUrl: true, bannerUrl: true }
        });

        if (drama) {
            title = `${drama.title} — Assista Completa em HD | TvDrama Reels`;
            description = drama.synopsis?.slice(0, 160) || description;
            coverUrl = drama.bannerUrl || drama.coverUrl || coverUrl;
        } else {
            const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                (d) => d.slug === slug || d.id === slug
            );
            if (fallback) {
                title = `${fallback.title} — Assista Completa em HD | TvDrama Reels`;
                description = fallback.synopsis?.slice(0, 160) || description;
                coverUrl = fallback.bannerUrl || fallback.coverUrl || coverUrl;
            }
        }
    } catch {
        // fallback
    }

    const absoluteCoverUrl = coverUrl.startsWith("http")
        ? coverUrl
        : `https://tvdramareels.online${coverUrl.startsWith("/") ? "" : "/"}${coverUrl}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: absoluteCoverUrl, width: 1200, height: 630, alt: title }]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [absoluteCoverUrl]
        }
    };
}

export default async function OfertaPage({ params }: OfertaPageProps) {
    const { slug } = await params;

    let initialDrama: DramaOffer | null = null;
    try {
        const drama = await prisma.drama.findFirst({
            where: {
                OR: [{ slug }, { id: slug }]
            },
            include: {
                episodes: {
                    orderBy: { number: "asc" }
                }
            }
        });

        if (drama) {
            initialDrama = {
                id: drama.id,
                title: drama.title,
                slug: drama.slug,
                synopsis: drama.synopsis || "",
                coverUrl: drama.coverUrl,
                bannerUrl: drama.bannerUrl || drama.coverUrl,
                category: drama.category || "Romance",
                totalEpisodes: drama.totalEpisodes || drama.episodes.length,
                trailerYoutubeUrl: drama.trailerYoutubeUrl || drama.episodes[0]?.youtubeUrl || null,
                episodes: drama.episodes.map((ep) => ({
                    number: ep.number,
                    title: ep.title,
                    youtubeUrl: ep.youtubeUrl || (ep as any).videoUrl || "",
                    durationSeconds: ep.durationSeconds || 900,
                    isFree: ep.isFree
                }))
            };
        } else {
            const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                (d) => d.slug === slug || d.id === slug
            );
            if (fallback) {
                initialDrama = {
                    id: fallback.id,
                    title: fallback.title,
                    slug: fallback.slug,
                    synopsis: fallback.synopsis,
                    coverUrl: "/cover-ganhei-tres-namoradas.jpg",
                    bannerUrl: "/cover-ganhei-tres-namoradas.jpg",
                    category: fallback.category,
                    totalEpisodes: fallback.totalEpisodes || fallback.episodes.length,
                    trailerYoutubeUrl: fallback.episodes[0]?.youtubeUrl || null,
                    episodes: fallback.episodes.map((ep) => ({
                        number: ep.number,
                        title: ep.title,
                        youtubeUrl: ep.youtubeUrl || (ep as any).videoUrl || "",
                        durationSeconds: ep.durationSeconds || 900,
                        isFree: ep.isFree
                    }))
                };
            }
        }
    } catch {
        // fallback
    }

    return (
        <Suspense
            fallback={
                <div className="min-h-dvh bg-[#07060a] text-white flex flex-col items-center justify-center p-4">
                    <div className="size-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                        Carregando oferta exclusiva...
                    </p>
                </div>
            }
        >
            <OfertaSalesPageClient slug={slug} initialDrama={initialDrama} />
        </Suspense>
    );
}
