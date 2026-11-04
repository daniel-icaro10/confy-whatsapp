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

export const DEFAULT_FUNNEL_CONFIG = {
    id: "default",
    enabled: false,
    sessionId: null as string | null,
    planName: "Plano Mensal — TvDrama Reels",
    planPrice: 9.90,
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
    mangofyApiKey: "",
    mangofyStoreCode: "",
    mangofyWebhookSecret: "",
    stripeSecretKey: "",
    stripePublishableKey: "",
    stripeWebhookSecret: "",
    plansJson: DEFAULT_OFFER_PLANS as unknown as any,
    whatsappNumber: "",
    adRedirectMessage: "Olá! Vi o anúncio e quero liberar meu acesso para assistir.",
    step1Greeting: "",
    step1MediaUrl: "",
    step1MediaType: "none",
    step2OfferMessage: "",
    pixTriggerKeywords: "",
    pixGeneratedMessage: "",
    paymentApprovedMessage: "",
    useAiSaleswoman: false,
    aiProvider: "GROQ" as const,
    aiApiKey: "",
    aiModel: "llama-3.3-70b-versatile",
    aiSystemPrompt: ""
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

        if (
            config.step1Greeting?.includes("Oiê, meu amor!") ||
            config.aiSystemPrompt?.includes("Você é a Sofia, atendente")
        ) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    enabled: false,
                    planName: "Plano Mensal — TvDrama Reels",
                    planPrice: 9.90,
                    step1Greeting: "",
                    step2OfferMessage: "",
                    pixTriggerKeywords: "",
                    pixGeneratedMessage: "",
                    paymentApprovedMessage: "",
                    useAiSaleswoman: false,
                    aiSystemPrompt: ""
                }
            });
        }

        return config;
    } catch {
        return DEFAULT_FUNNEL_CONFIG;
    }
}

let dramasEnsured = false;

export async function ensureInitialDramas() {
    if (dramasEnsured) return;
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
            } else if (existing.episodes.length === 0 && item.episodes.length > 0) {
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
