import { prisma } from "@/lib/prisma";

export interface GenerateAiReplyParams {
    sessionId: string;
    userMessage: string;
    chatHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface AiReplyResult {
    reply: string;
    shouldTransfer: boolean;
    provider: string;
    model: string;
}

/**
 * Service to execute AI replies using configured LLM provider and RAG knowledge base.
 */
export async function generateAiReply({
    sessionId,
    userMessage,
    chatHistory = []
}: GenerateAiReplyParams): Promise<AiReplyResult> {
    // 1. Fetch Session and AI config
    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true }
    });

    if (!session) {
        throw new Error("Sessão não encontrada");
    }

    const config = await prisma.aiAgentConfig.findUnique({
        where: { sessionId: session.id }
    });

    if (!config || !config.enabled) {
        throw new Error("Agente de IA está desativado para esta sessão");
    }

    if (!config.apiKey) {
        throw new Error("Chave de API (API Key) não configurada no Agente de IA");
    }

    // 2. Fetch Active Knowledge Documents (RAG)
    const docs = await prisma.aiKnowledgeDocument.findMany({
        where: { sessionId: session.id, active: true },
        select: { title: true, content: true }
    });

    let knowledgeContext = "";
    if (docs.length > 0) {
        knowledgeContext = `\n\n[BASE DE CONHECIMENTO DA EMPRESA]:\n` +
            docs.map((d) => `### DOCUMENTO: ${d.title}\n${d.content}\n`).join("\n") +
            `\n[FIM DA BASE DE CONHECIMENTO]\n\n` +
            `IMPORTANTE: Responda as dúvidas do cliente baseando-se estritamente nas informações acima. Se você não souber a resposta ou o cliente pedir atendente humano, informe educadamente que você irá transferir para a equipe e inclua a tag [TRANSFERIR_HUMANO].`;
    }

    const systemPrompt = (config.systemPrompt || "Você é um assistente virtual prestativo, educado e ágil de atendimento ao cliente via WhatsApp.") + knowledgeContext;

    let replyText = "";
    const provider = config.provider || "OPENAI";
    const model = config.model || (provider === "GROQ" ? "llama-3.3-70b-versatile" : provider === "GEMINI" ? "gemini-1.5-flash" : "gpt-4o-mini");

    // 3. Call Provider
    if (provider === "OPENAI" || provider === "GROQ") {
        const endpoint = provider === "GROQ"
            ? "https://api.groq.com/openai/v1/chat/completions"
            : "https://api.openai.com/v1/chat/completions";

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage }
        ];

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apiKey.trim()}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: config.temperature ?? 0.7
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(`Erro do provedor ${provider}: ${errData?.error?.message || res.statusText}`);
        }

        const data = await res.json();
        replyText = data.choices?.[0]?.message?.content || "";
    } else if (provider === "GEMINI") {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;

        const contents = [
            {
                role: "user",
                parts: [{ text: `INSTRUÇÕES DO SISTEMA:\n${systemPrompt}\n\nMENSAGEM DO CLIENTE:\n${userMessage}` }]
            }
        ];

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: config.temperature ?? 0.7
                }
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(`Erro do Gemini: ${errData?.error?.message || res.statusText}`);
        }

        const data = await res.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
        throw new Error(`Provedor ${provider} não suportado`);
    }

    // 4. Check for human transfer intent or keywords
    const transferKeywords = (config.transferKeywords || "humano, atendente, suporte, pessoa, falar com atendente")
        .toLowerCase()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    const lowerUserMsg = userMessage.toLowerCase();
    const matchesUserTransfer = transferKeywords.some((k) => lowerUserMsg.includes(k));
    const matchesAiTag = replyText.includes("[TRANSFERIR_HUMANO]") || replyText.includes("[TRANSFERIR]");

    const shouldTransfer = matchesUserTransfer || matchesAiTag;

    // Clean up internal tags from customer view
    const cleanReply = replyText
        .replace(/\[TRANSFERIR_HUMANO\]/g, "")
        .replace(/\[TRANSFERIR\]/g, "")
        .trim();

    return {
        reply: cleanReply,
        shouldTransfer,
        provider,
        model
    };
}
