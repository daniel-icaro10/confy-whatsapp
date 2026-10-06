import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const updateStageSchema = z.object({
    name: z.string().optional(),
    color: z.string().optional(),
    order: z.number().optional()
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string; stageId: string }> }
) {
    try {
        const { sessionId, stageId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = updateStageSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const updated = await prisma.stage.update({
            where: { id: stageId },
            data: parsed.data
        });

        return NextResponse.json({
            status: true,
            data: updated
        });
    } catch (error: any) {
        console.error("Erro ao atualizar etapa:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string; stageId: string }> }
) {
    try {
        const { sessionId, stageId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        // Check if stage has deals
        const dealsCount = await prisma.deal.count({
            where: { stageId }
        });

        if (dealsCount > 0) {
            return NextResponse.json({
                status: false,
                message: "Não é possível excluir uma coluna que contém oportunidades. Mova os cards antes."
            }, { status: 400 });
        }

        await prisma.stage.delete({
            where: { id: stageId }
        });

        return NextResponse.json({
            status: true,
            message: "Coluna excluída com sucesso"
        });
    } catch (error: any) {
        console.error("Erro ao excluir etapa:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
