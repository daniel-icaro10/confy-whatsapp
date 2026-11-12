import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureInitialDramas } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";

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

