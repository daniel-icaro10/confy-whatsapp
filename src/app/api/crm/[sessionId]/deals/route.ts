import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const createDealSchema = z.object({
    stageId: z.string().min(1, "Estágio é obrigatório"),
    title: z.string().min(1, "Título da oportunidade é obrigatório"),
    value: z.number().default(0),
    contactId: z.string().optional().nullable(),
    assignedUserId: z.string().optional().nullable(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    notes: z.string().optional().nullable()
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
        const parsed = createDealSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const deal = await prisma.deal.create({
            data: {
                sessionId: session.id,
                stageId: parsed.data.stageId,
                title: parsed.data.title,
                value: parsed.data.value,
                contactId: parsed.data.contactId || null,
                assignedUserId: parsed.data.assignedUserId || user.id,
                priority: parsed.data.priority,
                notes: parsed.data.notes || null,
                status: "OPEN"
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
            message: "Oportunidade criada com sucesso",
            data: deal
        });
    } catch (error: any) {
        console.error("Erro ao criar negócio:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
