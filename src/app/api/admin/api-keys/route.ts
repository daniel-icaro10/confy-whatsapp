import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin, generateApiKey } from "@/lib/api-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createApiKeySchema = z.object({
    name: z.string().min(2, "O nome da chave deve ter pelo menos 2 caracteres"),
});

// GET: List all API Keys for the superadmin or user
export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json({ status: false, message: "Unauthorized", error: "Unauthorized" }, { status: 401 });
    }

    try {
        const whereClause = user.role === "SUPERADMIN" ? {} : { userId: user.id };

        const apiKeys = await prisma.apiKey.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });

        // Also check legacy user apiKey if empty
        const legacyKeys = [];
        if (user.role === "SUPERADMIN") {
            const usersWithLegacy = await prisma.user.findMany({
                where: { apiKey: { not: null } },
                select: { id: true, name: true, companyName: true, email: true, apiKey: true, role: true, createdAt: true }
            });

            for (const u of usersWithLegacy) {
                // If not already in apiKeys
                const exists = apiKeys.some(k => k.key === u.apiKey);
                if (!exists && u.apiKey) {
                    legacyKeys.push({
                        id: `legacy-${u.id}`,
                        name: `Chave Padrão (${u.name || u.email})`,
                        key: u.apiKey,
                        userId: u.id,
                        isActive: true,
                        lastUsedAt: null,
                        createdAt: u.createdAt,
                        user: {
                            id: u.id,
                            name: u.name,
                            companyName: u.companyName,
                            email: u.email,
                            role: u.role
                        }
                    });
                }
            }
        }

        return NextResponse.json({
            status: true,
            data: [...apiKeys, ...legacyKeys]
        });
    } catch (error: any) {
        console.error("List API Keys error:", error);
        return NextResponse.json({ status: false, message: error.message || "Failed to list API keys" }, { status: 500 });
    }
}

// POST: Create a new API Key
export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json({ status: false, message: "Unauthorized", error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = createApiKeySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ status: false, message: "Nome inválido", error: parsed.error.flatten() }, { status: 400 });
        }

        const newKeyString = generateApiKey();

        const created = await prisma.apiKey.create({
            data: {
                name: parsed.data.name,
                key: newKeyString,
                userId: user.id,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            status: true,
            message: "Chave de API criada com sucesso",
            data: created
        }, { status: 201 });
    } catch (error: any) {
        console.error("Create API Key error:", error);
        return NextResponse.json({ status: false, message: error.message || "Failed to create API key" }, { status: 500 });
    }
}

// DELETE: Revoke/delete an API Key
export async function DELETE(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) {
        return NextResponse.json({ status: false, message: "Unauthorized", error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ status: false, message: "ID é obrigatório" }, { status: 400 });
        }

        // Handle legacy
        if (id.startsWith("legacy-")) {
            const targetUserId = id.replace("legacy-", "");
            if (user.role !== "SUPERADMIN" && user.id !== targetUserId) {
                return NextResponse.json({ status: false, message: "Forbidden" }, { status: 403 });
            }
            await prisma.user.update({
                where: { id: targetUserId },
                data: { apiKey: null }
            });
            return NextResponse.json({ status: true, message: "Chave revogada com sucesso" });
        }

        const existing = await prisma.apiKey.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ status: false, message: "Chave não encontrada" }, { status: 404 });
        }

        if (user.role !== "SUPERADMIN" && existing.userId !== user.id) {
            return NextResponse.json({ status: false, message: "Forbidden" }, { status: 403 });
        }

        await prisma.apiKey.delete({ where: { id } });

        return NextResponse.json({ status: true, message: "Chave de API excluída com sucesso" });
    } catch (error: any) {
        console.error("Delete API Key error:", error);
        return NextResponse.json({ status: false, message: error.message || "Failed to delete API key" }, { status: 500 });
    }
}
