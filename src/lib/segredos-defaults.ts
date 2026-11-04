import { prisma } from "@/lib/prisma";

/**
 * Normaliza um número de telefone ou JID do WhatsApp para apenas dígitos com DDI 55 (padrão Brasil).
 * Ex: "(11) 98765-4321" -> "5511987654321"
 * Ex: "551187654321@s.whatsapp.net" -> "551187654321"
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
    planName: "Acesso Completo — TvDrama Reels",
    planPrice: 19.90,
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
    mangofyApiKey: "",
    mangofyStoreCode: "",
    mangofyWebhookSecret: "",
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

        // Se o registro ainda estiver com as mensagens prontas antigas de exemplo, limpa automaticamente
        if (
            config.step1Greeting?.includes("Oiê, meu amor!") ||
            config.aiSystemPrompt?.includes("Você é a Sofia, atendente")
        ) {
            config = await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    enabled: false,
                    planName: "Acesso Completo — TvDrama Reels",
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
        // Remove qualquer novela mockada que tenha sido criada anteriormente
        await prisma.drama.deleteMany({
            where: {
                slug: { in: LEGACY_MOCK_DRAMA_SLUGS }
            }
        });
    } catch {
        // Ignora caso a tabela ainda não exista
    }
}
