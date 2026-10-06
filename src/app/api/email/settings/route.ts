import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { testSmtpConnection } from "@/lib/email-service";
import { z } from "zod";

const smtpSchema = z.object({
    host: z.string().min(1, "Host SMTP é obrigatório"),
    port: z.number().default(587),
    secure: z.boolean().default(false),
    user: z.string().min(1, "Usuário SMTP é obrigatório"),
    pass: z.string().min(1, "Senha SMTP é obrigatória"),
    fromEmail: z.string().email("E-mail de remetente inválido"),
    fromName: z.string().optional().nullable()
});

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const setting = await prisma.smtpSetting.findUnique({
            where: { userId: user.id }
        });

        return NextResponse.json({
            status: true,
            data: setting ? {
                ...setting,
                pass: setting.pass ? "••••••••" : ""
            } : null
        });
    } catch (error: any) {
        console.error("Erro ao buscar configurações SMTP:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = smtpSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        // Test SMTP connection first
        const test = await testSmtpConnection(parsed.data);
        if (!test.success) {
            return NextResponse.json({
                status: false,
                message: test.message
            }, { status: 400 });
        }

        const saved = await prisma.smtpSetting.upsert({
            where: { userId: user.id },
            update: parsed.data,
            create: {
                userId: user.id,
                ...parsed.data
            }
        });

        return NextResponse.json({
            status: true,
            message: "Configurações SMTP testadas e salvas com sucesso!",
            data: {
                ...saved,
                pass: "••••••••"
            }
        });
    } catch (error: any) {
        console.error("Erro ao salvar SMTP:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
