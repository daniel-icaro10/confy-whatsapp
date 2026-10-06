import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string; id: string }> }
) {
    try {
        const { sessionId, id } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        await prisma.aiKnowledgeDocument.delete({
            where: { id }
        });

        return NextResponse.json({
            status: true,
            message: "Documento removido da base de conhecimento"
        });
    } catch (error: any) {
        console.error("Erro ao deletar documento:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
