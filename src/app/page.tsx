import { Suspense } from "react";
import { TopDoramaxCatalog } from "@/components/streaming/topdoramax-catalog";
import { prisma } from "@/lib/prisma";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";

export default async function HomePage() {
    let initialDramas: any[] = [];
    try {
        const dramas = await prisma.drama.findMany({
            where: { status: "PUBLISHED" },
            include: {
                episodes: {
                    orderBy: { number: "asc" }
                }
            },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ]
        });

        if (dramas && dramas.length > 0) {
            initialDramas = dramas.map((d) => ({
                id: d.id,
                title: d.title,
                slug: d.slug,
                synopsis: d.synopsis || "",
                coverUrl: d.coverUrl,
                bannerUrl: d.bannerUrl || d.coverUrl,
                category: d.category || "Romance",
                tags: d.tags || "",
                totalEpisodes: d.totalEpisodes || d.episodes.length,
                freeEpisodesCount: d.freeEpisodesCount || 1,
                isFeatured: d.isFeatured,
                isVertical: d.isVertical,
                viewsCount: d.viewsCount,
                likesCount: d.likesCount,
                episodes: d.episodes.map((ep) => ({
                    id: ep.id,
                    number: ep.number,
                    title: ep.title,
                    isFree: ep.isFree,
                    durationSeconds: ep.durationSeconds || 900
                })),
                isShowcaseOnly: false
            }));
        } else {
            initialDramas = INITIAL_YOUTUBE_DRAMAS.map((d) => ({
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
        }
    } catch {
        initialDramas = INITIAL_YOUTUBE_DRAMAS.map((d) => ({
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
    }

    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <TopDoramaxCatalog initialDramas={initialDramas} />
        </Suspense>
    );
}
