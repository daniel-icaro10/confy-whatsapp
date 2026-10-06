import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const createDocSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    content: z.string().min(5, "Conteúdo deve ter ao menos 5 caracteres"),
    category: z.string().default("Geral")
});

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
        const parsed = createDocSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const doc = await prisma.aiKnowledgeDocument.create({
            data: {
                sessionId: session.id,
                title: parsed.data.title,
                content: parsed.data.content,
                category: parsed.data.category,
                active: true
            }
        });

        return NextResponse.json({
            status: true,
            message: "Documento adicionado à base de conhecimento!",
            data: doc
        });
    } catch (error: any) {
        console.error("Erro ao adicionar documento:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
