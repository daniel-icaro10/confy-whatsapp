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

    // Remove zeros à esquerda (ex: 011...)
    digits = digits.replace(/^0+/, "");

    // Se tiver 10 ou 11 dígitos (DDD + número sem 55), adiciona 55
    if (digits.length === 10 || digits.length === 11) {
        digits = "55" + digits;
    }
    return digits;
}

/**
 * Compara ou gera variações com e sem o 9º dígito para garantir que o cliente
 * consiga entrar no site mesmo que o WhatsApp salve sem o 9º dígito (comum em DDDs fora de SP/RJ).
 */
export function getPhoneVariants(rawPhone: string): string[] {
    const clean = normalizeBrPhone(rawPhone);
    if (!clean) return [];

    const variants = new Set<string>([clean]);

    // Se começa com 55 e tem 13 dígitos (55 + DDD(2) + 9 + 8 dígitos)
    if (clean.startsWith("55") && clean.length === 13 && clean[4] === "9") {
        const withoutNine = clean.slice(0, 4) + clean.slice(5);
        variants.add(withoutNine);
    }
    // Se começa com 55 e tem 12 dígitos (55 + DDD(2) + 8 dígitos)
    if (clean.startsWith("55") && clean.length === 12) {
        const withNine = clean.slice(0, 4) + "9" + clean.slice(4);
        variants.add(withNine);
    }

    return Array.from(variants);
}

/**
 * Extrai o ID de 11 caracteres do YouTube a partir de qualquer formato de link
 * (watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/ ou o próprio ID).
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
    enabled: true,
    sessionId: null as string | null,
    planName: "Acesso VIP Completo — Segredos do Coração",
    planPrice: 19.90,
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    mangofyApiUrl: "https://checkout.mangofy.com.br/api/v1",
    mangofyApiKey: "",
    mangofyStoreCode: "",
    mangofyWebhookSecret: "",
    step1Greeting:
        "Oiê, meu amor! ❤️ Que bom que você chamou!\n\n" +
        "Aquela cena do anúncio dá um aperto no coração, né?! 😱 Quando ela descobre a traição no altar e o verdadeiro dono da empresa aparece... todo mundo fica em choque!\n\n" +
        "Olha só: todos os episódios completos e dublados/legendados já estão liberados na nossa plataforma exclusiva *Segredos do Coração* 🎬✨",
    step1MediaUrl: "",
    step1MediaType: "none",
    step2OfferMessage:
        "Para você assistir essa novela inteira sem cortes + ter acesso liberado a *TODAS as novelas verticais do nosso catálogo* direto no seu celular, a taxa única de liberação hoje está apenas *R$ {{VALOR}}* no Pix! 🍿❤️\n\n" +
        "Assim que confirmar, o sistema já libera o seu número de WhatsApp na hora para assistir tudo!\n\n" +
        "Posso gerar o seu Pix Copia e Cola agora? Digite *QUERO* ou *PIX* 👇",
    pixTriggerKeywords:
        "pix, quero, sim, continuar, assistir, liberar, pagar, acesso, parte 2, completo, novela, valor, preco, manda, enviar, chave",
    pixGeneratedMessage:
        "✨ *Prontinho, meu amor! Seu acesso VIP já está reservado!*\n\n" +
        "Valor promocional: *R$ {{VALOR}}*\n\n" +
        "Copie o código *Pix Copia e Cola* abaixo e pague no aplicativo do seu banco:\n\n" +
        "`{{PIX_COPIA_E_COLA}}`\n\n" +
        "⚡ *Assim que você pagar, eu mesma já te mando aqui no WhatsApp o link liberado com o seu número para você maratonar todos os episódios sem esperar nada!* ❤️🎬",
    paymentApprovedMessage:
        "🎉 *PAGAMENTO CONFIRMADO COM SUCESSO!* ❤️🍿\n\n" +
        "Seu número *{{TELEFONE}}* já está 100% liberado como *Assinante VIP* no *Segredos do Coração*!\n\n" +
        "👉 *Clique no link abaixo para entrar e assistir agora mesmo:*\n" +
        "{{LINK_ACESSO}}\n\n" +
        "*(Dica: Se pedir seu acesso na tela, basta digitar o seu número de WhatsApp!). Bom divertimento e prepara o lencinho!* 😭❤️",
    useAiSaleswoman: true,
    aiProvider: "GROQ" as const,
    aiApiKey: "",
    aiModel: "llama-3.3-70b-versatile",
    aiSystemPrompt:
        "Você é a Sofia, atendente e consultora apaixonada por novelas e doramas verticais da plataforma 'Segredos do Coração'. " +
        "A cliente acabou de vir de um anúncio de 3 minutos de uma novela dramática emocionante e quer assistir o restante da história. " +
        "Fale como uma amiga brasileira carismática, acolhedora, fofoqueira do bem (use emojis com moderação como ❤️, 😱, 🍿, ✨). " +
        "Seu único objetivo é aumentar a curiosidade dela sobre os próximos episódios e levá-la a pedir a geração do Pix de acesso VIP (que custa R$ {{VALOR}} com liberação imediata pelo número de WhatsApp). " +
        "Responda de forma curta (máximo 2 parágrafos curtos de WhatsApp) e sempre termine incentivando ela a digitar 'QUERO' ou 'PIX' para gerar o código Pix na hora."
};

export async function ensureFunnelConfig() {
    try {
        let config = await prisma.funnelConfig.findUnique({
            where: { id: "default" }
        });

        if (!config) {
            config = await prisma.funnelConfig.create({
                data: DEFAULT_FUNNEL_CONFIG
            });
        }
        return config;
    } catch {
        return DEFAULT_FUNNEL_CONFIG;
    }
}

export async function ensureInitialDramas() {
    try {
        const count = await prisma.drama.count();
        if (count > 0) return;

        // Cria 4 novelas verticais de exemplo para deixar o catálogo lindo desde o primeiro acesso
        const sampleDramas = [
            {
                title: "O Bilionário Disfarçado e a Noiva Rejeitada",
                slug: "o-bilionario-disfarcado-e-a-noiva-rejeitada",
                synopsis:
                    "Humilhada no altar pelo noivo ambicioso e pela própria irmã adotiva, Helena aceita se casar no mesmo dia com um entregador misterioso — sem imaginar que ele é o verdadeiro herdeiro do maior império financeiro do país.",
                coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
                bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
                trailerYoutubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                category: "CEO & Vingança",
                tags: "Vertical, Casamento por Contrato, Reviravolta, Bilionário",
                totalEpisodes: 45,
                freeEpisodesCount: 2,
                isFeatured: true,
                isVertical: true,
                viewsCount: 48920,
                likesCount: 14300,
                episodes: [
                    {
                        number: 1,
                        title: "Ep. 01 — Traição no Altar (Parte 1 do Anúncio)",
                        description: "No dia do seu casamento, Helena descobre o plano cruel da sua própria família.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 185,
                        isFree: true,
                        viewsCount: 48920
                    },
                    {
                        number: 2,
                        title: "Ep. 02 — A Proposta do Desconhecido",
                        description: "Um homem misterioso entra na igreja e faz uma proposta que muda o destino de todos.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 170,
                        isFree: true,
                        viewsCount: 39100
                    },
                    {
                        number: 3,
                        title: "Ep. 03 — A Verdadeira Identidade do Marido",
                        description: "Na manhã seguinte, carros blindados cercam a mansão da família.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 195,
                        isFree: false,
                        viewsCount: 31200
                    },
                    {
                        number: 4,
                        title: "Ep. 04 — DeJoelhos no Banquete de Gala",
                        description: "O ex-noivo tenta humilhar Helena no jantar da empresa, mas leva o choque da sua vida.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 210,
                        isFree: false,
                        viewsCount: 28900
                    },
                    {
                        number: 5,
                        title: "Ep. 05 — O Segredo do Colar de Esmeraldas",
                        description: "A matriarca reconhece a joia e percebe quem é a nova esposa do presidente.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 180,
                        isFree: false,
                        viewsCount: 26400
                    }
                ]
            },
            {
                title: "A Vingança da Herdeira Esquecida",
                slug: "a-vinganca-da-herdeira-esquecida",
                synopsis:
                    "Após passar cinco anos injustamente presa no lugar da madrasta, Clara retorna com uma nova identidade e o apoio de um promotor implacável para recuperar sua filha e destruir quem tirou tudo dela.",
                coverUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
                trailerYoutubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                category: "Vingança & Drama",
                tags: "Vertical, Maternidade, Justiça, Emoção",
                totalEpisodes: 60,
                freeEpisodesCount: 2,
                isFeatured: false,
                isVertical: true,
                viewsCount: 36400,
                likesCount: 11200,
                episodes: [
                    {
                        number: 1,
                        title: "Ep. 01 — O Retorno Cinco Anos Depois",
                        description: "Os portões se abrem e Clara jura nunca mais derramar uma lágrima em vão.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 180,
                        isFree: true,
                        viewsCount: 36400
                    },
                    {
                        number: 2,
                        title: "Ep. 02 — O Reencontro com a Filha",
                        description: "Disfarçada na festa da alta sociedade, ela vê sua pequena Sofia pela primeira vez.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 190,
                        isFree: true,
                        viewsCount: 29800
                    },
                    {
                        number: 3,
                        title: "Ep. 03 — A Máscara Cai no Leilão",
                        description: "Clara compra a mansão da própria família diante dos olhos incrédulos do ex-marido.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 200,
                        isFree: false,
                        viewsCount: 24500
                    }
                ]
            },
            {
                title: "Grávida do CEO: Amor Além do Contrato",
                slug: "gravida-do-ceo-amor-alem-do-contrato",
                synopsis:
                    "Uma noite inesperada conecta a jovem médica Sofia ao homem mais frio e poderoso de São Paulo. Quando o teste dá positivo para gêmeos, o destino une dois corações feridos.",
                coverUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
                bannerUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80",
                trailerYoutubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                category: "Romance Proibido",
                tags: "Vertical, Bebê Secreto, Romance, CEO",
                totalEpisodes: 50,
                freeEpisodesCount: 2,
                isFeatured: false,
                isVertical: true,
                viewsCount: 52100,
                likesCount: 18900,
                episodes: [
                    {
                        number: 1,
                        title: "Ep. 01 — Duas Linhas no Teste",
                        description: "Sofia descobre que sua vida nunca mais será a mesma após o plantão no hospital.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 175,
                        isFree: true,
                        viewsCount: 52100
                    },
                    {
                        number: 2,
                        title: "Ep. 02 — O Novo Dono do Hospital",
                        description: "O homem misterioso reaparece como o novo presidente do conselho médico.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 185,
                        isFree: true,
                        viewsCount: 41200
                    },
                    {
                        number: 3,
                        title: "Ep. 03 — O Exame de DNA Revelado",
                        description: "A rival tenta falsificar o laudo, mas o próprio CEO exige a verdade.",
                        youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                        durationSeconds: 195,
                        isFree: false,
                        viewsCount: 35600
                    }
                ]
            }
        ];

        for (const d of sampleDramas) {
            const { episodes, ...dramaData } = d;
            await prisma.drama.create({
                data: {
                    ...dramaData,
                    episodes: {
                        create: episodes
                    }
                }
            });
        }
    } catch {
        // Ignora caso a tabela ainda não tenha sido migrada no banco
    }
}

