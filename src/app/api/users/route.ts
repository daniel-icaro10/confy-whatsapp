import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/lib/api-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createUserSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    role: z.enum(["SUPERADMIN", "OWNER", "STAFF"]).default("STAFF"),
    sessionIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPERADMIN and OWNER can list users
    if (user.role === "STAFF") {
        return NextResponse.json({ status: false, message: "Acesso negado para atendentes", error: "Forbidden" }, { status: 403 });
    }

    try {
        let whereClause: any = {};

        if (user.role === "OWNER") {
            // Owner sees their attendants
            whereClause = {
                OR: [
                    { ownerId: user.id },
                    { sessionAccesses: { some: { session: { userId: user.id } } } }
                ]
            };
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                ownerId: true,
                sessionAccesses: {
                    select: {
                        sessionId: true,
                        session: {
                            select: {
                                id: true,
                                name: true,
                                sessionId: true,
                                status: true
                            }
                        }
                    }
                },
                _count: {
                    select: { sessions: true }
                }
            }
        });

        return NextResponse.json({ status: true, message: "Users fetched successfully", data: users });
    } catch (error) {
        console.error("List users error:", error);
        return NextResponse.json({ status: false, message: "Failed to fetch users", error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user) {
        return NextResponse.json({ status: false, message: "Não autorizado", error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "STAFF") {
        return NextResponse.json({ status: false, message: "Atendentes não podem cadastrar usuários", error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const parseResult = createUserSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ status: false, message: "Dados inválidos", error: parseResult.error.flatten() }, { status: 400 });
        }

        const { name, email, password, role, sessionIds } = parseResult.data;

        // An OWNER can ONLY create STAFF users
        const assignedRole = user.role === "OWNER" ? "STAFF" : role;
        const ownerId = user.role === "OWNER" ? user.id : undefined;

        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ status: false, message: "Já existe um usuário com este e-mail", error: "Email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: assignedRole as any,
                ownerId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        // If sessionIds provided, link SessionAccess
        if (sessionIds && sessionIds.length > 0) {
            // For OWNER, ensure sessions belong to them
            const allowedSessions = await prisma.session.findMany({
                where: {
                    id: { in: sessionIds },
                    ...(user.role === "OWNER" ? { userId: user.id } : {})
                },
                select: { id: true }
            });

            for (const sess of allowedSessions) {
                await prisma.sessionAccess.upsert({
                    where: {
                        sessionId_userId: {
                            sessionId: sess.id,
                            userId: newUser.id
                        }
                    },
                    create: {
                        sessionId: sess.id,
                        userId: newUser.id
                    },
                    update: {}
                });
            }
        }

        return NextResponse.json({ status: true, message: "Atendente cadastrado com sucesso", data: newUser }, { status: 201 });

    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ status: false, message: "Falha ao cadastrar usuário", error: "Failed to create user" }, { status: 500 });
    }
}
