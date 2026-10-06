import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const updateDealSchema = z.object({
    stageId: z.string().optional(),
    title: z.string().optional(),
    value: z.number().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    status: z.enum(["OPEN", "WON", "LOST"]).optional(),
    notes: z.string().optional().nullable(),
    assignedUserId: z.string().optional().nullable()
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string; dealId: string }> }
) {
    try {
        const { sessionId, dealId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = updateDealSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const updated = await prisma.deal.update({
            where: { id: dealId },
            data: {
                ...(parsed.data.stageId && { stageId: parsed.data.stageId }),
                ...(parsed.data.title && { title: parsed.data.title }),
                ...(parsed.data.value !== undefined && { value: parsed.data.value }),
                ...(parsed.data.priority && { priority: parsed.data.priority }),
                ...(parsed.data.status && { status: parsed.data.status }),
                ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
                ...(parsed.data.assignedUserId !== undefined && { assignedUserId: parsed.data.assignedUserId }),
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        jid: true,
                        name: true,
                        notify: true,
                        profilePic: true,
                        email: true
                    }
                },
                assignedUser: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return NextResponse.json({
            status: true,
            data: updated
        });
    } catch (error: any) {
        console.error("Erro ao atualizar negócio:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string; dealId: string }> }
) {
    try {
        const { sessionId, dealId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        await prisma.deal.delete({
            where: { id: dealId }
        });

        return NextResponse.json({
            status: true,
            message: "Oportunidade excluída com sucesso"
        });
    } catch (error: any) {
        console.error("Erro ao excluir negócio:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
