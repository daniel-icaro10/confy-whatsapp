import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { z } from "zod";

const updateDepartmentSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    description: z.string().optional().nullable(),
    colorHex: z.string().optional(),
    userIds: z.array(z.string()).optional()
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
        const validated = updateDepartmentSchema.parse(body);

        // If userIds provided, replace relationships
        if (validated.userIds !== undefined) {
            await prisma.userDepartment.deleteMany({
                where: { departmentId: id }
            });
            if (validated.userIds.length > 0) {
                await prisma.userDepartment.createMany({
                    data: validated.userIds.map(userId => ({
                        departmentId: id,
                        userId
                    }))
                });
            }
        }

        const department = await prisma.department.update({
            where: { id },
            data: {
                name: validated.name,
                description: validated.description,
                colorHex: validated.colorHex
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

        await prisma.department.delete({ where: { id } });
        return NextResponse.json({ status: true, message: "Setor excluído com sucesso" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 400 });
    }
}
