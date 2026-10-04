import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const createDepartmentSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    colorHex: z.string().default("#3b82f6"),
    userIds: z.array(z.string()).optional()
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

        const departments = await prisma.department.findMany({
            where: { sessionId: session.id },
            include: {
                users: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                },
                _count: { select: { tickets: true } }
            },
            orderBy: { name: "asc" }
        });

        return NextResponse.json({
            status: true,
            data: departments.map(d => ({
                id: d.id,
                name: d.name,
                description: d.description,
                colorHex: d.colorHex,
                users: d.users.map(u => u.user),
                ticketsCount: d._count.tickets,
                createdAt: d.createdAt
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
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
        const validated = createDepartmentSchema.parse(body);

        const department = await prisma.department.create({
            data: {
                sessionId: session.id,
                name: validated.name,
                description: validated.description,
                colorHex: validated.colorHex,
                users: validated.userIds && validated.userIds.length > 0 ? {
                    create: validated.userIds.map(userId => ({ userId }))
                } : undefined
            },
            include: {
                users: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        });

        return NextResponse.json({ status: true, data: department });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 400 });
    }
}
