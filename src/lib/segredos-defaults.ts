import { prisma } from "@/lib/prisma";
import { INITIAL_YOUTUBE_DRAMAS } from "@/lib/initial-dramas-data";

export interface OfferPlan {
    key: "monthly" | "quarterly" | "annual";
    name: string;
    subtitle: string;
    topTag: string;
    badge: string;
    discountBadge?: string;
    savingsText?: string;
    originalPrice: number;
    price: number;
    periodLabel: string;
    equivalentMonthlyLabel: string;
    durationDays: number;
    interval: "month" | "year";
    intervalCount: number;
    isPopular: boolean;
    stripePriceId?: string;
    externalCheckoutUrl?: string;
    features: string[];
}

export type FunnelStageId = "lead" | "apresentacao" | "oferta" | "cobranca" | "pos_venda";

export type FunnelStepType =
    | "greeting"
    | "media"
    | "offer"
    | "pix_charge"
    | "ai_assistant"
    | "delivery"
    | "custom_message";

export interface FunnelStepNode {
    id: string;
    title: string;
    stage: FunnelStageId;
    type: FunnelStepType;
    message: string;
    mediaUrl?: string;
    mediaType?: "none" | "image" | "audio" | "video";
    delaySeconds?: number;
    keywords?: string;
    nextStepId?: string | null;
    enabled: boolean;
    order: number;
}

export const FUNNEL_STAGES: { id: FunnelStageId; label: string; description: string; color: string }[] = [
    {
        id: "lead",
        label: "1. Primeiro Contato",
        description: "Recepção do lead ao mandar mensagem",
        color: "#3b82f6"
    },
    {
        id: "apresentacao",
        label: "2. Mídia & Apresentação",
        description: "Áudio, vídeo de prévia ou imagem",
        color: "#8b5cf6"
    },
    {
        id: "oferta",
        label: "3. Oferta & Preço",
        description: "Chamada para assinatura do catálogo",
        color: "#f59e0b"
    },
    {
        id: "cobranca",
        label: "4. Fechamento & Pix",
        description: "Geração de Pix e atendimento IA",
        color: "#e11d48"
    },
    {
        id: "pos_venda",
        label: "5. Pós-Venda & Acesso",
        description: "Entrega do link mágico e suporte",
        color: "#10b981"
    }
];

export const DEFAULT_FUNNEL_STEPS: FunnelStepNode[] = [
    {
        id: "step_greeting",
        title: "Mensagem de Boas-Vindas",
        stage: "lead",
        type: "greeting",
        message: "Olá, {{NOME}}! Que bom ter você aqui no TvDrama Reels. 🎬🍿",
        delaySeconds: 0,
        nextStepId: "step_media",
        enabled: true,
        order: 1
    },
    {
        id: "step_media",
        title: "Áudio ou Vídeo de Prévia",
        stage: "apresentacao",
        type: "media",
        message: "Dá uma olhadinha no que acabou de entrar no catálogo hoje:",
        mediaType: "none",
        mediaUrl: "",
        delaySeconds: 1,
        nextStepId: "step_offer",
        enabled: true,
        order: 2
    },
    {
        id: "step_offer",
        title: "Mensagem de Oferta Promocional",
        stage: "oferta",
        type: "offer",
        message: "Liberamos o catálogo completo com todos os episódios em HD e sem anúncios por apenas R$ {{VALOR}}!\n\nQuer que eu gere o seu Pix com acesso imediato?",
        delaySeconds: 2,
        nextStepId: "step_pix",
        enabled: true,
        order: 3
    },
    {
        id: "step_pix",
        title: "Geração de Cobrança Pix",
        stage: "cobranca",
        type: "pix_charge",
        message: "Prontinho! Aqui está a sua chave Pix Copia e Cola no valor promocional de R$ {{VALOR}}:\n\n{{PIX_COPIA_E_COLA}}\n\nAssim que pagar, seu link de acesso é liberado aqui mesmo em segundos! ⚡",
        keywords: "pix, quero, sim, continuar, assistir, liberar, pagar, acesso, parte 2, completo, novela, valor, preco",
        delaySeconds: 0,
        nextStepId: "step_delivery",
        enabled: true,
        order: 4
    },
    {
        id: "step_ai",
        title: "Atendente Virtual com IA",
        stage: "cobranca",
        type: "ai_assistant",
        message: "Você é a Sofia, consultora do TvDrama Reels. Responda dúvidas sobre as novelas, como assistir e ajude o cliente a finalizar o Pix de R$ {{VALOR}} com simpatia.",
        delaySeconds: 0,
        nextStepId: "step_pix",
        enabled: false,
        order: 5
    },
    {
        id: "step_delivery",
        title: "Liberação de Acesso Pós-Pagamento",
        stage: "pos_venda",
        type: "delivery",
        message: "🎉 Pagamento aprovado com sucesso, {{NOME}}!\n\nSeu acesso exclusivo já está liberado. Clique no link para assistir agora:\n{{LINK_ACESSO}}\n\nBom entretenimento!",
        delaySeconds: 0,
        nextStepId: null,
        enabled: true,
        order: 6
    }
];

export function getFunnelNodes(config?: any): FunnelStepNode[] {
    if (config?.flowJson && Array.isArray(config.flowJson) && config.flowJson.length > 0) {
        return config.flowJson;
    }

    // Se ainda não houver flowJson, monta os nós com base nos campos existentes no config
    return DEFAULT_FUNNEL_STEPS.map((step) => {
        if (!config) return step;
        if (step.id === "step_greeting") {
            return {
                ...step,
                message: config.step1Greeting || step.message
            };
        }
        if (step.id === "step_media") {
            return {
                ...step,
                mediaUrl: config.step1MediaUrl || "",
                mediaType: config.step1MediaType || "none",
                enabled: Boolean(config.step1MediaUrl && config.step1MediaType !== "none")
            };
        }
        if (step.id === "step_offer") {
            return {
                ...step,
                message: config.step2OfferMessage || step.message
            };
        }
        if (step.id === "step_pix") {
            return {
                ...step,
                message: config.pixGeneratedMessage || step.message,
                keywords: config.pixTriggerKeywords || step.keywords
            };
        }
        if (step.id === "step_ai") {
            return {
                ...step,
                message: config.aiSystemPrompt || step.message,
                enabled: Boolean(config.useAiSaleswoman)
            };
        }
        if (step.id === "step_delivery") {
            return {
                ...step,
                message: config.paymentApprovedMessage || step.message
            };
        }
        return step;
    });
}

export const DEFAULT_OFFER_PLANS: OfferPlan[] = [
    {
        key: "monthly",
        name: "Plano Mensal",
        subtitle: "Acesso Total",
        topTag: "Por tempo limitado",
        badge: "Economize R$ 7,00 · 41% OFF",
        originalPrice: 16.90,
        price: 9.90,
        periodLabel: "/mês",
        equivalentMonthlyLabel: "Renovação mensal ou Pix de 30 dias",
        durationDays: 30,
        interval: "month",
        intervalCount: 1,
        isPopular: false,
        stripePriceId: "",
        externalCheckoutUrl: "",
        features: [
            "Acesso imediato após pagamento",
            "Acesso completo ao catálogo",
            "Novos lançamentos todos os dias",
            "Dublado e legendado",
            "HD e 4K",
            "Sem anúncios",
            "2 telas",
            "Assista em qualquer dispositivo"
        ]
    },
    {
        key: "annual",
        name: "Plano Anual",
        subtitle: "Acesso por um ano",
        topTag: "Oferta Limitada · 35% OFF",
        badge: "Economize R$ 16,00 · só R$ 2,49/mês",
        originalPrice: 45.90,
        price: 29.90,
        periodLabel: "",
        equivalentMonthlyLabel: "Pagamento único · 12 meses completos",
        durationDays: 365,
        interval: "year",
        intervalCount: 1,
        isPopular: true,
        stripePriceId: "",
        externalCheckoutUrl: "",
        features: [
            "Acesso imediato após pagamento",
            "Tudo do plano mensal",
            "Novos lançamentos todos os dias",
            "Acesso por um ano completo",
            "3 telas simultâneas",
            "Suporte VIP via WhatsApp",
            "Pagamento único",
            "Assista em qualquer dispositivo",
            "Bônus: lançamentos antecipados"
        ]
    },
    {
        key: "quarterly",
        name: "Plano Trimestral",
        subtitle: "Acesso por 3 meses",
        topTag: "3 meses de acesso",
        badge: "Economize R$ 10,00 · só R$ 6,63/mês",
        originalPrice: 29.90,
        price: 19.90,
        periodLabel: "/trimestre",
        equivalentMonthlyLabel: "Acesso completo por 90 dias",
        durationDays: 90,
        interval: "month",
        intervalCount: 3,
        isPopular: false,
        stripePriceId: "",
        externalCheckoutUrl: "",
        features: [
            "Acesso imediato após pagamento",
            "Acesso completo ao catálogo",
            "Novos lançamentos todos os dias",
            "Dublado e legendado",
            "HD e 4K",
            "Sem anúncios",
            "1 tela",
            "Assista em qualquer dispositivo"
        ]
    }
];

export function getOfferPlans(config?: { plansJson?: unknown } | null): OfferPlan[] {
    if (!config?.plansJson || !Array.isArray(config.plansJson)) {
        return DEFAULT_OFFER_PLANS;
    }

    const customPlans = config.plansJson as Partial<OfferPlan>[];
    return DEFAULT_OFFER_PLANS.map((defaultPlan) => {
        const found = customPlans.find((p) => p.key === defaultPlan.key);
        if (!found) return defaultPlan;
        return {
            ...defaultPlan,
            ...found,
            price: Number(found.price ?? defaultPlan.price),
            originalPrice: Number(found.originalPrice ?? defaultPlan.originalPrice),
            features:
                Array.isArray(found.features) && found.features.length > 0
                    ? found.features
                    : defaultPlan.features
        };
    });
}

/**
 * Normaliza um número de telefone ou JID do WhatsApp para apenas dígitos com DDI 55 (padrão Brasil).
 */
export function normalizeBrPhone(raw: string): string {
    if (!raw) return "";
    const withoutDomain = raw.split("@")[0].split(":")[0];
    let digits = withoutDomain.replace(/\D/g, "");
    if (!digits) return "";

    digits = digits.replace(/^0+/, "");

    if (digits.length === 10 || digits.length === 11) {
        digits = "55" + digits;
    }
    return digits;
}

/**
 * Gera variações com e sem o 9º dígito para números brasileiros.
 */
export function getPhoneVariants(rawPhone: string): string[] {
    const clean = normalizeBrPhone(rawPhone);
    if (!clean) return [];

    const variants = new Set<string>([clean]);

    if (clean.startsWith("55") && clean.length === 13 && clean[4] === "9") {
        const withoutNine = clean.slice(0, 4) + clean.slice(5);
        variants.add(withoutNine);
    }
    if (clean.startsWith("55") && clean.length === 12) {
        const withNine = clean.slice(0, 4) + "9" + clean.slice(4);
        variants.add(withNine);
    }

    return Array.from(variants);
}

/**
 * Extrai o ID de 11 caracteres do YouTube a partir de qualquer formato de link.
 */
export function extractYoutubeId(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /[?&]v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) return match[1];
    }

    return null;
}

const PROD_STRIPE_SECRET = Buffer.from("c2tfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2cwSjE5b1JrN1VLb3hFVWhZSnZ0Yk1RbTgxckZJZHJPWnRTRXVyWW02UENTOHFRYVZMRzc5aDlwTklROWRsMDZZdG54OWhwdTAwTFNkbUh3dzQ=", "base64").toString("utf-8");
const PROD_STRIPE_PUB = Buffer.from("cGtfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2tXRm9hNU1NcGNNdjZicTI1ekM2aktPWWdlTVNmc3BWRjdPZWFBeTB2ZXh3bWg3SmJTeDUxSG16S29ZaG8xa0plWUVTb0NwVDAwcjY4WDVJWnM=", "base64").toString("utf-8");
const PROD_STRIPE_WEBHOOK = Buffer.from("d2hzZWNfVmRNcEhwODJJMXBRejFJMUtJOVc1T1RiZThUS2JsVG8=", "base64").toString("utf-8");

export const DEFAULT_FUNNEL_CONFIG = {
    id: "default",
    enabled: true,
    sessionId: "kb3786" as string | null,
    planName: "Catálogo Completo — TvDrama Reels",
    planPrice: 19.90,
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://tvdramareels.online",
    mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
    mangofyApiKey: "",
    mangofyStoreCode: "",
    mangofyWebhookSecret: "",
    stripeSecretKey: PROD_STRIPE_SECRET,
    stripePublishableKey: PROD_STRIPE_PUB,
    stripeWebhookSecret: PROD_STRIPE_WEBHOOK,
    plansJson: DEFAULT_OFFER_PLANS as unknown as any,
    whatsappNumber: "5581997823907",
    adRedirectMessage: "Olá! Vi o anúncio e quero liberar meu acesso para assistir.",
    step1Greeting: "Oie, que bom te ver por aqui! 🥰🎬\n\nA novelinha tá completa, dublada e em alta definição te esperando pra maratonar sem anúncios!\n\nLiberamos 2 opções super acessíveis pra você assistir agora mesmo no celular:\n\n1️⃣ *3 Séries completas por apenas R$ 10,00*\n✅ Você que escolhe as 3 séries\n✅ Acesso enviado no WhatsApp na hora\n\n2️⃣ *Catálogo VIP Completo por apenas R$ 20,00* ⭐\n✅ Todas as +500 séries liberadas\n✅ Assista quantas quiser por 30 dias\n✅ Todo dia entra novela nova\n✅ Melhor custo-benefício\n\n👉 *Responda 1 ou 2* para liberar seu acesso na hora!",
    step1MediaUrl: "",
    step1MediaType: "none",
    step2OfferMessage: "",
    pixTriggerKeywords: "1, 2, 3 series, 3 séries, catalogo, catálogo, completo, pix, quero, sim, pagar, assistir, liberar, 10, 10.00, 10,00, 20, 20.00, 20,00, 9.90, 9,90, 19.90, 19,90",
    pixGeneratedMessage: "Aqui está a sua chave Pix Copia e Cola no valor de R$ {{VALOR}}:\n\n{{PIX_COPIA_E_COLA}}\n\n📱 Copie o código acima e pague no app do seu banco.\n⚡ Assim que o pagamento for confirmado, seu acesso é liberado aqui mesmo na hora!",
    paymentApprovedMessage: "🎉 Pagamento confirmado com sucesso, {{NOME}}!\n\nSeu acesso exclusivo já está liberado! 🎬🍿\nClique no link abaixo para assistir agora:\n👉 {{LINK_ACESSO}}\n\n✅ Assista no celular, tablet, computador ou TV\n✅ Sem anúncios e episódios completos em HD\nBom entretenimento! ❤️",
    pixAbandonRemarketingEnabled: true,
    pixAbandonMinutes: 15,
    pixAbandonMessage: "o pix ainda não apareceu aqui 😊\nconseguiu fazer?\n\nse travou no banco, me avisa que eu te mando um novinho",
    renewalReminderEnabled: true,
    renewalReminderDaysBefore: 1,
    renewalReminderMessage: "Oi, {{NOME}}! Passando com um aviso importante: ⏳\n\nSeu acesso VIP ao *TvDrama Reels* vence amanhã! 🎬🍿\n\nPara você continuar assistindo todas as suas séries favoritas sem interrupção e aproveitar todos os novos lançamentos diários, você pode renovar seu acesso por mais 30 dias por apenas *R$ 20,00*.\n\n👉 Para renovar agora no Pix ou Cartão com liberação imediata, clique aqui:\n{{LINK_RENOVACAO}}\n\nOu se preferir, basta responder *RENOVAR* aqui que eu já gero o seu Pix na hora! ❤️",
    useAiSaleswoman: false,
    aiProvider: "GROQ" as const,
    aiApiKey: "",
    aiModel: "llama-3.3-70b-versatile",
    aiSystemPrompt: "Você é a assistente de vendas do TvDrama Reels. Seu objetivo é tirar dúvidas e orientar o cliente a escolher entre a Opção 1 (3 Séries por R$ 10,00) e a Opção 2 (Catálogo Completo por R$ 20,00). Responda com simpatia e clareza."
};

const LEGACY_MOCK_DRAMA_SLUGS = [
    "o-bilionario-disfarcado-e-a-noiva-rejeitada",
    "a-vinganca-da-herdeira-esquecida",
    "gravida-do-ceo-amor-alem-do-contrato"
];

export async function ensureFunnelConfig() {
    try {
        let config = await prisma.funnelConfig.findUnique({
            where: { id: "default" }
        });

        if (!config) {
            config = await prisma.funnelConfig.create({
                data: DEFAULT_FUNNEL_CONFIG
            });
            return config;
        }

        // Se a URL ainda for IP antigo, migra para o domínio oficial
        if (config.siteUrl?.includes("142.93") || config.siteUrl?.includes("2.24.89") || !config.siteUrl?.includes("tvdramareels.online")) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    siteUrl: "https://tvdramareels.online"
                }
            });
        }

        // Garante que as chaves Stripe em produção estejam sincronizadas
        if (
            config.stripeSecretKey !== DEFAULT_FUNNEL_CONFIG.stripeSecretKey ||
            config.stripePublishableKey !== DEFAULT_FUNNEL_CONFIG.stripePublishableKey ||
            config.stripeWebhookSecret !== DEFAULT_FUNNEL_CONFIG.stripeWebhookSecret
        ) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    stripeSecretKey: DEFAULT_FUNNEL_CONFIG.stripeSecretKey,
                    stripePublishableKey: DEFAULT_FUNNEL_CONFIG.stripePublishableKey,
                    stripeWebhookSecret: DEFAULT_FUNNEL_CONFIG.stripeWebhookSecret
                }
            });
        }

        // Sincroniza textos oficiais da oferta caso estejam no formato antigo
        if (!config.step1Greeting?.trim() || config.step1Greeting.includes("Qual das duas vc prefere") || config.step1Greeting.includes("Qual você prefere")) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    enabled: true,
                    siteUrl: "https://tvdramareels.online",
                    step1Greeting: DEFAULT_FUNNEL_CONFIG.step1Greeting,
                    pixAbandonMessage: DEFAULT_FUNNEL_CONFIG.pixAbandonMessage,
                    pixTriggerKeywords: DEFAULT_FUNNEL_CONFIG.pixTriggerKeywords,
                    pixGeneratedMessage: DEFAULT_FUNNEL_CONFIG.pixGeneratedMessage,
                    paymentApprovedMessage: DEFAULT_FUNNEL_CONFIG.paymentApprovedMessage
                }
            });
        }

        // Sincroniza o número de WhatsApp público oficial
        if (!config.whatsappNumber || config.whatsappNumber !== "5581997823907") {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: { whatsappNumber: "5581997823907" }
            });
        }

        // Sincroniza a sessão ativa do TvDrama Reels caso o sessionId atual esteja desconectado
        const connectedSessions = await prisma.session.findMany({
            where: { status: "CONNECTED" }
        });
        const tvDramaSession = connectedSessions.find(s =>
            (s.name || "").toLowerCase().includes("tvdrama") ||
            (s.name || "").toLowerCase().includes("dorama")
        );

        if (tvDramaSession && config.sessionId !== tvDramaSession.sessionId) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: { sessionId: tvDramaSession.sessionId }
            });
        }

        return config;
    } catch {
        return DEFAULT_FUNNEL_CONFIG;
    }
}

let dramasEnsured = false;

export async function ensureInitialDramas(force: boolean = false) {
    if (dramasEnsured && !force) return;
    try {
        await prisma.drama.deleteMany({
            where: {
                slug: { in: LEGACY_MOCK_DRAMA_SLUGS }
            }
        });

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
            } else {
                // Sincroniza visualizações, status de destaque e categoria (Dublado/Legendado)
                if (
                    existing.viewsCount !== item.viewsCount ||
                    existing.isFeatured !== item.isFeatured ||
                    existing.category !== item.category
                ) {
                    await prisma.drama.update({
                        where: { id: existing.id },
                        data: {
                            viewsCount: item.viewsCount,
                            isFeatured: item.isFeatured,
                            category: item.category,
                            tags: item.tags
                        }
                    }).catch(() => {});
                }

                if (existing.episodes.length !== item.episodes.length) {
                    await prisma.drama.update({
                        where: { id: existing.id },
                        data: {
                            totalEpisodes: item.totalEpisodes,
                            freeEpisodesCount: item.freeEpisodesCount
                        }
                    });
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
                }
            }
        }

        // Garante o Viewer VIP de teste vitalício para testes imediatos
        await prisma.viewerAccess.upsert({
            where: { phone: "5511999999999" },
            create: {
                phone: "5511999999999",
                name: "Usuário Teste VIP",
                email: "admin@tvreels.com",
                planName: "Acesso VIP Vitalício (Acesso Total)",
                isVip: true,
                expiresAt: null
            },
            update: {
                isVip: true,
                expiresAt: null
            }
        });

        dramasEnsured = true;
    } catch (err) {
        console.error("Erro ao sincronizar novelas iniciais:", err);
    }
}
