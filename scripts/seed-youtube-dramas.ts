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

    // Atualiza a configuração do funil para o texto oficial e ativa a sessão
    const funnelGreeting = `Qual das duas vc prefere? 😊\n\n🎬 *3 Séries por R$ 9,90*\n✅ Você que escolhe as séries\n✅ Acesso enviado no WhatsApp após o pagamento\n\n🚀 *Catálogo Completo por R$ 19,90* ⭐\n✅ Todas as +501 séries liberadas\n✅ Assista quantas quiser por 30 dias\n✅ TODO DIA entra série nova\n✅ Melhor custo-benefício\n\n📌 Catálogo:\n{{LINK_CATALOGO}}\n\n✅ Depois do pagamento a série chega aqui na hora`;

    const funnelPixMsg = `Aqui está a sua chave Pix Copia e Cola no valor de R$ {{VALOR}}:\n\n{{PIX_COPIA_E_COLA}}\n\n📱 Copie o código acima e pague no app do seu banco.\n⚡ Assim que o pagamento for confirmado, seu acesso é liberado aqui mesmo na hora!`;

    const funnelApprovedMsg = `🎉 Pagamento confirmado com sucesso, {{NOME}}!\n\nSeu acesso exclusivo já está liberado! 🎬🍿\nClique no link abaixo para assistir agora:\n👉 {{LINK_ACESSO}}\n\n✅ Assista no celular, tablet, computador ou TV\n✅ Sem anúncios e episódios completos em HD\nBom entretenimento! ❤️`;

    await prisma.funnelConfig.upsert({
        where: { id: "default" },
        create: {
            id: "default",
            enabled: true,
            sessionId: "kb3786",
            planName: "Catálogo Completo — TvDrama Reels",
            planPrice: 19.90,
            siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://2.24.89.184:3000",
            step1Greeting: funnelGreeting,
            pixTriggerKeywords: "1, 2, 3 series, 3 séries, catalogo, catálogo, completo, pix, quero, sim, pagar, assistir, liberar, 9.90, 9,90, 19.90, 19,90",
            pixGeneratedMessage: funnelPixMsg,
            paymentApprovedMessage: funnelApprovedMsg
        },
        update: {
            enabled: true,
            sessionId: "kb3786",
            siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://2.24.89.184:3000",
            step1Greeting: funnelGreeting,
            pixTriggerKeywords: "1, 2, 3 series, 3 séries, catalogo, catálogo, completo, pix, quero, sim, pagar, assistir, liberar, 9.90, 9,90, 19.90, 19,90",
            pixGeneratedMessage: funnelPixMsg,
            paymentApprovedMessage: funnelApprovedMsg
        }
    });
    console.log("⚡ Configuração do funil de vendas atualizada e ativada!");
}

main()
    .catch((err) => {
        console.error("❌ Erro ao popular novelas:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

