import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id: dramaId } = await params;
        const body = await request.json();

        const number = Number(body.number || 1);
        const title = body.title || `Episódio ${number}`;
        const youtubeUrl = body.youtubeUrl || "";

        if (!youtubeUrl) {
            return NextResponse.json(
                { error: "Informe o link do YouTube do episódio" },
                { status: 400 }
            );
        }

        const episode = await prisma.episode.upsert({
            where: {
                dramaId_number: { dramaId, number }
            },
            create: {
                dramaId,
                number,
                title,
                description: body.description || "",
                youtubeUrl,
                videoUrl: body.videoUrl || null,
                thumbnailUrl: body.thumbnailUrl || null,
                durationSeconds: Number(body.durationSeconds || 180),
                isFree: Boolean(body.isFree)
            },
            update: {
                title,
                description: body.description || "",
                youtubeUrl,
                videoUrl: body.videoUrl || null,
                thumbnailUrl: body.thumbnailUrl || null,
                durationSeconds: Number(body.durationSeconds || 180),
                isFree: Boolean(body.isFree)
            }
        });

        return NextResponse.json({ episode });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao salvar episódio", details: error?.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        await params;
        const { searchParams } = new URL(request.url);
        const episodeId = searchParams.get("episodeId");

        if (!episodeId) {
            return NextResponse.json({ error: "episodeId obrigatório" }, { status: 400 });
        }

        await prisma.episode.delete({ where: { id: episodeId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao remover episódio", details: error?.message },
            { status: 500 }
        );
    }
}

