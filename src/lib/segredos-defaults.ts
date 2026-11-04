import { prisma } from "@/lib/prisma";

export interface OfferPlan {
    key: "monthly" | "quarterly" | "annual";
    name: string;
    subtitle: string;
    topTag: string;
    badge: string;
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

export async function ensureInitialDramas() {
    try {
        await prisma.drama.deleteMany({
            where: {
                slug: { in: LEGACY_MOCK_DRAMA_SLUGS }
            }
        });
    } catch {
        // Ignora caso a tabela ainda não exista
    }
}
