import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const updateConfigSchema = z.object({
    enabled: z.boolean().default(true),
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().optional().nullable(),
    primaryColor: z.string().default("#2563eb"),
    welcomeMessage: z.string().optional().nullable(),
    requireEmail: z.boolean().default(false),
    requireName: z.boolean().default(true)
});

// GET: Public or Private config
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true, name: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada" }, { status: 404 });
        }

        let config = await prisma.webchatConfig.findUnique({
            where: { sessionId: session.id }
        });

        if (!config) {
            config = await prisma.webchatConfig.create({
                data: {
                    sessionId: session.id,
                    title: session.name || "Atendimento Online",
                    subtitle: "Fale com nossa equipe em tempo real",
                    primaryColor: "#2563eb",
                    welcomeMessage: "Olá! Como podemos ajudar você hoje?",
                    requireName: true,
                    requireEmail: false
                }
            });
        }

        return NextResponse.json({
            status: true,
            data: config
        });
    } catch (error: any) {
        console.error("Erro ao obter config do webchat:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

// POST: Authenticated update config
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
        const parsed = updateConfigSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const updated = await prisma.webchatConfig.upsert({
            where: { sessionId: session.id },
            update: parsed.data,
            create: {
                sessionId: session.id,
                ...parsed.data
            }
        });

        return NextResponse.json({
            status: true,
            message: "Configurações do Webchat salvas!",
            data: updated
        });
    } catch (error: any) {
        console.error("Erro ao salvar config do webchat:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
