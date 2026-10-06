import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/lib/api-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCompanySchema = z.object({
    companyName: z.string().min(2, "Nome da empresa é obrigatório"),
    name: z.string().optional().default(""),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    phone: z.string().optional().default(""),
    document: z.string().optional().default(""),
    plan: z.string().optional().default("PRO"),
    maxSessions: z.number().int().min(1).optional().default(5),
    notes: z.string().optional().default(""),
});

// GET: List all companies (Superadmin only)
export async function GET(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ status: false, message: "Apenas Super Admin pode listar as empresas" }, { status: 403 });
    }

    try {
        const companies = await prisma.user.findMany({
            where: {
                role: "OWNER"
            },
            orderBy: { createdAt: "desc" },
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
                createdAt: true,
                sessions: {
                    select: {
                        id: true,
                        sessionId: true,
                        status: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        sessions: true,
                        assignedTickets: true,
                        userDepartments: true,
                    }
                }
            }
        });

        // Also count staff members for each company
        const enriched = companies.map(c => {
            const connectedSessions = c.sessions.filter(s => s.status === "CONNECTED").length;
            return {
                id: c.id,
                name: c.name || c.companyName || "Empresa sem nome",
                companyName: c.companyName || c.name || "Empresa sem nome",
                email: c.email,
                phone: c.phone || "",
                document: c.document || "",
                plan: c.plan || "PRO",
                maxSessions: c.maxSessions || 5,
                isActive: c.isActive !== false,
                notes: c.notes || "",
                createdAt: c.createdAt,
                totalSessions: c.sessions.length,
                connectedSessions,
                sessions: c.sessions,
                staffCount: c._count.userDepartments || 0
            };
        });

        return NextResponse.json({
            status: true,
            data: enriched
        });
    } catch (error: any) {
        console.error("List companies error:", error);
        return NextResponse.json({ status: false, message: error.message || "Failed to list companies" }, { status: 500 });
    }
}

// POST: Create a new company
export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);

    if (!user || !isAdmin(user.role)) {
        return NextResponse.json({ status: false, message: "Apenas Super Admin pode cadastrar empresas" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const parsed = createCompanySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ status: false, message: "Dados inválidos", error: parsed.error.flatten() }, { status: 400 });
        }

        const { companyName, name, email, password, phone, document, plan, maxSessions, notes } = parsed.data;

        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ status: false, message: "Já existe uma empresa ou usuário com este e-mail." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCompany = await prisma.user.create({
            data: {
                companyName,
                name: name || companyName,
                email,
                password: hashedPassword,
                role: "OWNER",
                phone,
                document,
                plan,
                maxSessions,
                isActive: true,
                notes,
            },
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
                createdAt: true
            }
        });

        return NextResponse.json({
            status: true,
            message: "Empresa cadastrada com sucesso",
            data: newCompany
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create company error:", error);
        return NextResponse.json({ status: false, message: error.message || "Falha ao cadastrar empresa" }, { status: 500 });
    }
}
