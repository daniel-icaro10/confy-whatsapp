import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/lib/api-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check permissions
    if (user.role !== "SUPERADMIN") {
        if (user.role === "OWNER") {
            const targetUser = await prisma.user.findUnique({ where: { id } });
            if (!targetUser || (targetUser.ownerId !== user.id && targetUser.role !== "STAFF")) {
                return NextResponse.json({ status: false, message: "Apenas o proprietário deste atendente pode editá-lo", error: "Forbidden" }, { status: 403 });
            }
        } else {
            return NextResponse.json({ status: false, message: "Acesso negado", error: "Forbidden" }, { status: 403 });
        }
    }

    try {
        const body = await request.json();
        const { name, email, password, role, sessionIds } = body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (user.role === "SUPERADMIN" && role) updateData.role = role;
        if (password && password.trim().length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true
            }
        });

        // Update session accesses if sessionIds provided
        if (Array.isArray(sessionIds)) {
            // Remove existing session accesses owned by this owner
            const ownerSessions = await prisma.session.findMany({
                where: user.role === "OWNER" ? { userId: user.id } : {},
                select: { id: true }
            });
            const ownerSessionIds = ownerSessions.map(s => s.id);

            await prisma.sessionAccess.deleteMany({
                where: {
                    userId: id,
                    sessionId: { in: ownerSessionIds }
                }
            });

            // Create new accesses
            const validSessionsToAssign = sessionIds.filter(sid => ownerSessionIds.includes(sid));
            for (const sid of validSessionsToAssign) {
                await prisma.sessionAccess.create({
                    data: {
                        sessionId: sid,
                        userId: id
                    }
                });
            }
        }

        return NextResponse.json({ status: true, message: "Usuário atualizado com sucesso", data: updatedUser });

    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ status: false, message: "Falha ao atualizar usuário", error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (id === user.id) {
        return NextResponse.json({ status: false, message: "Você não pode excluir sua própria conta", error: "Cannot delete yourself" }, { status: 400 });
    }

    // Check permissions
    if (user.role !== "SUPERADMIN") {
        if (user.role === "OWNER") {
            const targetUser = await prisma.user.findUnique({ where: { id } });
            if (!targetUser || (targetUser.ownerId !== user.id && targetUser.role !== "STAFF")) {
                return NextResponse.json({ status: false, message: "Apenas o proprietário deste atendente pode excluí-lo", error: "Forbidden" }, { status: 403 });
            }
        } else {
            return NextResponse.json({ status: false, message: "Acesso negado", error: "Forbidden" }, { status: 403 });
        }
    }

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ status: true, message: "Atendente excluído com sucesso" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ status: false, message: "Falha ao excluir usuário", error: "Failed to delete user" }, { status: 500 });
    }
}
