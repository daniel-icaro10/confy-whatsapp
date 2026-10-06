import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    try {
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyName: true,
                phone: true,
                document: true,
                plan: true,
                maxSessions: true,
                isActive: true,
                createdAt: true,
            }
        });

        if (!fullUser) {
            return NextResponse.json({ status: false, message: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ status: true, data: fullUser });
    } catch (error) {
        console.error("GET profile error:", error);
        return NextResponse.json({ status: false, message: "Erro ao obter perfil" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, phone, companyName, currentPassword, newPassword } = body;

        const currentUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!currentUser) {
            return NextResponse.json({ status: false, message: "Usuário não encontrado" }, { status: 404 });
        }

        const updateData: any = {};

        if (name && typeof name === "string") {
            updateData.name = name.trim();
        }

        if (phone !== undefined) {
            updateData.phone = typeof phone === "string" ? phone.trim() : null;
        }

        // Only OWNER or SUPERADMIN can update companyName
        if (companyName !== undefined && (user.role === "OWNER" || user.role === "SUPERADMIN")) {
            updateData.companyName = typeof companyName === "string" ? companyName.trim() : null;
        }

        // Password change logic
        if (newPassword) {
            if (typeof newPassword !== "string" || newPassword.length < 6) {
                return NextResponse.json({ status: false, message: "A nova senha deve ter no mínimo 6 caracteres" }, { status: 400 });
            }

            if (currentPassword) {
                const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
                if (!isMatch) {
                    return NextResponse.json({ status: false, message: "Senha atual incorreta" }, { status: 400 });
                }
            } else {
                return NextResponse.json({ status: false, message: "Informe a senha atual para confirmar a alteração" }, { status: 400 });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyName: true,
                phone: true,
                document: true,
                plan: true,
                maxSessions: true,
                updatedAt: true
            }
        });

        return NextResponse.json({
            status: true,
            message: "Perfil atualizado com sucesso",
            data: updated
        });
    } catch (error) {
        console.error("PATCH profile error:", error);
        return NextResponse.json({ status: false, message: "Falha ao atualizar perfil" }, { status: 500 });
    }
}
