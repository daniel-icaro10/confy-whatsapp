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

    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ status: false, message: "Apenas Super Admin pode editar empresas" }, { status: 403 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const { companyName, name, email, phone, document, plan, maxSessions, isActive, notes, password } = body;

        const updateData: any = {};
        if (companyName !== undefined) updateData.companyName = companyName;
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (document !== undefined) updateData.document = document;
        if (plan !== undefined) updateData.plan = plan;
        if (maxSessions !== undefined) updateData.maxSessions = Number(maxSessions);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (notes !== undefined) updateData.notes = notes;
        if (password && password.trim().length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                companyName: true,
                email: true,
                phone: true,
                document: true,
                plan: true,
                maxSessions: true,
                isActive: true,
                notes: true,
                updatedAt: true
            }
        });

        return NextResponse.json({
            status: true,
            message: "Empresa atualizada com sucesso",
            data: updated
        });

    } catch (error: any) {
        console.error("Update company error:", error);
        return NextResponse.json({ status: false, message: error.message || "Falha ao atualizar empresa" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAuthenticatedUser(request);

    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ status: false, message: "Apenas Super Admin pode excluir empresas" }, { status: 403 });
    }

    const { id } = await params;

    if (id === user.id) {
        return NextResponse.json({ status: false, message: "Você não pode excluir sua própria conta de Super Admin" }, { status: 400 });
    }

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ status: true, message: "Empresa excluída com sucesso" });
    } catch (error: any) {
        console.error("Delete company error:", error);
        return NextResponse.json({ status: false, message: error.message || "Falha ao excluir empresa" }, { status: 500 });
    }
}
