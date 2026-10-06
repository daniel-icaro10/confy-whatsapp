import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const DEFAULT_STAGES = [
    { name: "Novos Leads", color: "#3b82f6", order: 0 },
    { name: "Qualificação", color: "#6366f1", order: 1 },
    { name: "Proposta Enviada", color: "#f59e0b", order: 2 },
    { name: "Negociação", color: "#8b5cf6", order: 3 },
    { name: "Venda Fechada", color: "#10b981", order: 4 },
    { name: "Perdido", color: "#ef4444", order: 5 },
];

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

        // Check if a pipeline exists, if not create default
        let pipeline = await prisma.pipeline.findFirst({
            where: { sessionId: session.id },
            include: {
                stages: {
                    orderBy: { order: "asc" },
                    include: {
                        deals: {
                            include: {
                                contact: {
                                    select: {
                                        id: true,
                                        jid: true,
                                        name: true,
                                        notify: true,
                                        profilePic: true,
                                        email: true,
                                        plan: true,
                                        planValue: true
                                    }
                                },
                                assignedUser: {
                                    select: { id: true, name: true, email: true }
                                }
                            },
                            orderBy: { createdAt: "desc" }
                        }
                    }
                }
            }
        });

        if (!pipeline) {
            pipeline = await prisma.pipeline.create({
                data: {
                    sessionId: session.id,
                    name: "Funil Padrão de Vendas",
                    isDefault: true,
                    stages: {
                        create: DEFAULT_STAGES.map((s) => ({
                            name: s.name,
                            color: s.color,
                            order: s.order
                        }))
                    }
                },
                include: {
                    stages: {
                        orderBy: { order: "asc" },
                        include: {
                            deals: {
                                include: {
                                    contact: true,
                                    assignedUser: true
                                }
                            }
                        }
                    }
                }
            });
        }

        return NextResponse.json({
            status: true,
            data: pipeline
        });
    } catch (error: any) {
        console.error("Erro ao carregar CRM:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
