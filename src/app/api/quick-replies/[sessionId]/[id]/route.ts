import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const updateQuickReplySchema = z.object({
    shortcut: z.string().min(1, "Atalho é obrigatório").transform(s => s.replace(/^\//, '').toLowerCase()).optional(),
    title: z.string().min(1, "Título é obrigatório").optional(),
    content: z.string().min(1, "Conteúdo é obrigatório").optional()
});

export async function PUT(
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

        const body = await request.json();
        const validated = updateQuickReplySchema.parse(body);

        const quickReply = await prisma.quickReply.update({
            where: { id },
            data: validated
        });

        return NextResponse.json({ status: true, data: quickReply });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 400 });
    }
}

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

        await prisma.quickReply.delete({ where: { id } });
        return NextResponse.json({ status: true, message: "Resposta rápida excluída com sucesso" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 400 });
    }
}
