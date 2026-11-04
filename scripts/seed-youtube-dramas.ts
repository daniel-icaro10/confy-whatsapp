import { PrismaClient } from "@prisma/client";
import { INITIAL_YOUTUBE_DRAMAS } from "../src/lib/initial-dramas-data";

const prisma = new PrismaClient();

const LEGACY_MOCK_DRAMA_SLUGS = [
    "o-bilionario-disfarcado-e-a-noiva-rejeitada",
    "a-vinganca-da-herdeira-esquecida",
    "gravida-do-ceo-amor-alem-do-contrato"
];

async function main() {
    console.log("🎬 Iniciando cadastro e atualização do catálogo com os 36 vídeos...");

    // Limpar slugs de exemplo antigos
    const deleted = await prisma.drama.deleteMany({
        where: {
            slug: { in: LEGACY_MOCK_DRAMA_SLUGS }
        }
    });
    if (deleted.count > 0) {
        console.log(`🧹 Removidas ${deleted.count} novelas legadas de teste.`);
    }

    let createdCount = 0;
    let updatedCount = 0;
    let totalEpisodes = 0;

    for (const item of INITIAL_YOUTUBE_DRAMAS) {
        const existing = await prisma.drama.findUnique({
            where: { slug: item.slug },
            include: { episodes: true }
        });

        if (!existing) {
            await prisma.drama.create({
                data: {
                    title: item.title,
                    slug: item.slug,
                    synopsis: item.synopsis,
                    coverUrl: item.coverUrl,
                    bannerUrl: item.bannerUrl || item.coverUrl,
                    category: item.category,
                    tags: item.tags,
                    totalEpisodes: item.totalEpisodes,
                    freeEpisodesCount: item.freeEpisodesCount,
                    isFeatured: item.isFeatured,
                    isVertical: item.isVertical,
                    viewsCount: item.viewsCount,
                    likesCount: item.likesCount,
                    status: "PUBLISHED",
                    episodes: {
                        create: item.episodes.map((ep) => ({
                            number: ep.number,
                            title: ep.title,
                            description: ep.description,
                            youtubeUrl: ep.youtubeUrl,
                            thumbnailUrl: item.coverUrl,
                            durationSeconds: ep.durationSeconds || 900,
                            isFree: ep.isFree,
                            viewsCount: 0
                        }))
                    }
                }
            });
            createdCount++;
            totalEpisodes += item.episodes.length;
            console.log(`✨ Criada série: "${item.title}" com ${item.episodes.length} episódios.`);
        } else {
            // Atualizar metadados se necessário
            await prisma.drama.update({
                where: { id: existing.id },
                data: {
                    title: item.title,
                    synopsis: item.synopsis,
                    coverUrl: item.coverUrl,
                    bannerUrl: item.bannerUrl || item.coverUrl,
                    category: item.category,
                    tags: item.tags,
                    totalEpisodes: item.totalEpisodes,
                    freeEpisodesCount: item.freeEpisodesCount,
                    isFeatured: item.isFeatured,
                    isVertical: item.isVertical,
                    status: "PUBLISHED"
                }
            });

            // Recriar episódios se a contagem divergir
            if (existing.episodes.length !== item.episodes.length) {
                await prisma.episode.deleteMany({
                    where: { dramaId: existing.id }
                });
                await prisma.episode.createMany({
                    data: item.episodes.map((ep) => ({
                        dramaId: existing.id,
                        number: ep.number,
                        title: ep.title,
                        description: ep.description,
                        youtubeUrl: ep.youtubeUrl,
                        thumbnailUrl: item.coverUrl,
                        durationSeconds: ep.durationSeconds || 900,
                        isFree: ep.isFree,
                        viewsCount: 0
                    }))
                });
                console.log(`🔄 Episódios atualizados para série "${item.title}" (${item.episodes.length} eps).`);
            } else {
                console.log(`✔️ Série "${item.title}" já está em dia.`);
            }
            updatedCount++;
            totalEpisodes += item.episodes.length;
        }
    }

    console.log(`\n🎉 Finalizado com sucesso!`);
    console.log(`📊 Novelas criadas: ${createdCount}`);
    console.log(`📊 Novelas atualizadas/verificadas: ${updatedCount}`);
    console.log(`📊 Total de episódios no catálogo: ${totalEpisodes}`);
}

main()
    .catch((err) => {
        console.error("❌ Erro ao popular novelas:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
