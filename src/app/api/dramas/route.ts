import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureInitialDramas } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await ensureInitialDramas();

        const { searchParams } = new URL(request.url);
        const includeDrafts = searchParams.get("all") === "true";

        const dramas = await prisma.drama.findMany({
            where: includeDrafts ? {} : { status: "PUBLISHED" },
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

        return NextResponse.json({ dramas });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao carregar catálogo de novelas", details: error?.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            synopsis,
            coverUrl,
            bannerUrl,
            trailerYoutubeUrl,
            category,
            tags,
            totalEpisodes,
            freeEpisodesCount,
            isFeatured,
            isVertical,
            status
        } = body;

        if (!title || !coverUrl) {
            return NextResponse.json(
                { error: "Título e URL da capa são obrigatórios" },
                { status: 400 }
            );
        }

        const baseSlug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

        const drama = await prisma.drama.create({
            data: {
                title,
                slug,
                synopsis: synopsis || "",
                coverUrl,
                bannerUrl: bannerUrl || coverUrl,
                trailerYoutubeUrl: trailerYoutubeUrl || null,
                category: category || "Drama",
                tags: tags || "",
                totalEpisodes: Number(totalEpisodes) || 1,
                freeEpisodesCount: Number(freeEpisodesCount ?? 2),
                isFeatured: Boolean(isFeatured),
                isVertical: isVertical !== false,
                viewsCount: 0,
                likesCount: 0,
                status: status === "DRAFT" ? "DRAFT" : "PUBLISHED"
            },
            include: {
                episodes: true
            }
        });

        return NextResponse.json({ drama });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao criar novela", details: error?.message },
            { status: 500 }
        );
    }
}

