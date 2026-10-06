import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const createStageSchema = z.object({
    pipelineId: z.string().min(1, "Pipeline é obrigatório"),
    name: z.string().min(1, "Nome da coluna é obrigatório"),
    color: z.string().default("#3b82f6")
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

        const body = await request.json();
        const parsed = createStageSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const count = await prisma.stage.count({
            where: { pipelineId: parsed.data.pipelineId }
        });

        const stage = await prisma.stage.create({
            data: {
                pipelineId: parsed.data.pipelineId,
                name: parsed.data.name,
                color: parsed.data.color,
                order: count
            }
        });

        return NextResponse.json({
            status: true,
            message: "Etapa criada com sucesso",
            data: stage
        });
    } catch (error: any) {
        console.error("Erro ao criar etapa:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
