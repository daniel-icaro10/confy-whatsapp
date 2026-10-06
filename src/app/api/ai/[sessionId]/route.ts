import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const aiConfigSchema = z.object({
    enabled: z.boolean(),
    provider: z.enum(["OPENAI", "GEMINI", "GROQ"]).default("OPENAI"),
    apiKey: z.string().optional().nullable(),
    model: z.string().default("gpt-4o-mini"),
    systemPrompt: z.string().optional().nullable(),
    temperature: z.number().min(0).max(2).default(0.7),
    transferKeywords: z.string().optional().nullable(),
    outOfScopeMessage: z.string().optional().nullable()
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada" }, { status: 404 });
        }

        let config = await prisma.aiAgentConfig.findUnique({
            where: { sessionId: session.id }
        });

        if (!config) {
            config = await prisma.aiAgentConfig.create({
                data: {
                    sessionId: session.id,
                    enabled: false,
                    provider: "OPENAI",
                    model: "gpt-4o-mini",
                    systemPrompt: "Você é um assistente virtual atencioso da nossa empresa. Responda com clareza, empatia e brevidade.",
                    temperature: 0.7,
                    transferKeywords: "humano, atendente, suporte, pessoa, atendente humano"
                }
            });
        }

        const documents = await prisma.aiKnowledgeDocument.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({
            status: true,
            data: {
                config,
                documents
            }
        });
    } catch (error: any) {
        console.error("Erro ao carregar configurações de IA:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = aiConfigSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const updated = await prisma.aiAgentConfig.upsert({
            where: { sessionId: session.id },
            update: {
                enabled: parsed.data.enabled,
                provider: parsed.data.provider,
                ...(parsed.data.apiKey !== undefined && { apiKey: parsed.data.apiKey }),
                model: parsed.data.model,
                systemPrompt: parsed.data.systemPrompt,
                temperature: parsed.data.temperature,
                transferKeywords: parsed.data.transferKeywords,
                outOfScopeMessage: parsed.data.outOfScopeMessage
            },
            create: {
                sessionId: session.id,
                enabled: parsed.data.enabled,
                provider: parsed.data.provider,
                apiKey: parsed.data.apiKey,
                model: parsed.data.model,
                systemPrompt: parsed.data.systemPrompt,
                temperature: parsed.data.temperature,
                transferKeywords: parsed.data.transferKeywords,
                outOfScopeMessage: parsed.data.outOfScopeMessage
            }
        });

        return NextResponse.json({
            status: true,
            message: "Configurações da IA salvas com sucesso!",
            data: updated
        });
    } catch (error: any) {
        console.error("Erro ao salvar IA:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
