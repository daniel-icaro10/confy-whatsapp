import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureInitialDramas } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialDramas(true);
        const { id } = await params;

        const drama = await prisma.drama.findFirst({
            where: {
                OR: [{ id }, { slug: id }]
            },
            include: {
                episodes: {
                    orderBy: { number: "asc" }
                }
            }
        });

        if (!drama) {
            const fallback = INITIAL_YOUTUBE_DRAMAS.find(
                (d) => d.slug === id || d.id === id
            );
            if (fallback) {
                return NextResponse.json({
                    drama: {
                        id: fallback.id,
                        title: fallback.title,
                        slug: fallback.slug,
                        synopsis: fallback.synopsis,
                        coverUrl: fallback.coverUrl,
                        bannerUrl: fallback.bannerUrl || fallback.coverUrl,
                        category: fallback.category,
                        totalEpisodes: fallback.totalEpisodes,
                        freeEpisodesCount: fallback.freeEpisodesCount,
                        isVertical: fallback.isVertical,
                        likesCount: fallback.likesCount,
                        episodes: fallback.episodes.map((ep) => ({
                            id: `${fallback.id}-ep-${ep.number}`,
                            number: ep.number,
                            title: ep.title,
                            description: ep.description,
                            youtubeUrl: ep.youtubeUrl,
                            videoUrl: ep.videoUrl || undefined,
                            durationSeconds: ep.durationSeconds || 900,
                            isFree: ep.isFree
                        }))
                    }
                });
            }
            return NextResponse.json({ error: "Novela não encontrada" }, { status: 404 });
        }

        return NextResponse.json({ drama });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao buscar novela", details: error?.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const drama = await prisma.drama.update({
            where: { id },
            data: {
                title: body.title,
                synopsis: body.synopsis,
                coverUrl: body.coverUrl,
                bannerUrl: body.bannerUrl ?? body.coverUrl,
                trailerYoutubeUrl: body.trailerYoutubeUrl,
                category: body.category,
                tags: body.tags,
                totalEpisodes: body.totalEpisodes !== undefined ? Number(body.totalEpisodes) : undefined,
                freeEpisodesCount: body.freeEpisodesCount !== undefined ? Number(body.freeEpisodesCount) : undefined,
                isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
                isVertical: body.isVertical !== undefined ? Boolean(body.isVertical) : undefined,
                status: body.status
            },
            include: {
                episodes: {
                    orderBy: { number: "asc" }
                }
            }
        });

        return NextResponse.json({ drama });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao atualizar novela", details: error?.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.drama.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao excluir novela", details: error?.message },
            { status: 500 }
        );
    }
}

