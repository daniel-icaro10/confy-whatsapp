import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { sendEmail } from "@/lib/email-service";
import { z } from "zod";

const campaignSchema = z.object({
    title: z.string().min(1, "Título da campanha é obrigatório"),
    subject: z.string().min(1, "Assunto do e-mail é obrigatório"),
    content: z.string().min(5, "Conteúdo do e-mail é obrigatório"),
    recipients: z.array(z.object({
        email: z.string().email(),
        name: z.string().optional()
    })).min(1, "Adicione pelo menos um destinatário")
});

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const campaigns = await prisma.emailCampaign.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { logs: true } }
            }
        });

        return NextResponse.json({
            status: true,
            data: campaigns
        });
    } catch (error: any) {
        console.error("Erro ao listar campanhas de email:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const smtpConfig = await prisma.smtpSetting.findUnique({
            where: { userId: user.id }
        });

        if (!smtpConfig) {
            return NextResponse.json({
                status: false,
                message: "Configure seu servidor SMTP antes de disparar campanhas de e-mail."
            }, { status: 400 });
        }

        const body = await request.json();
        const parsed = campaignSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                status: false,
                message: parsed.error.issues[0]?.message || "Dados inválidos"
            }, { status: 400 });
        }

        const { title, subject, content, recipients } = parsed.data;

        // 1. Create Campaign record
        const campaign = await prisma.emailCampaign.create({
            data: {
                userId: user.id,
                title,
                subject,
                content,
                status: "SENDING",
                targetCount: recipients.length,
                sentCount: 0,
                failedCount: 0
            }
        });

        // 2. Dispatch asynchronously (background loop)
        (async () => {
            let sentCount = 0;
            let failedCount = 0;

            for (const r of recipients) {
                // Personalize variables in content
                const personalizedHtml = content
                    .replace(/\{nome\}/gi, r.name || "Cliente")
                    .replace(/\{email\}/gi, r.email);

                try {
                    await sendEmail({
                        config: smtpConfig,
                        to: r.email,
                        subject: subject.replace(/\{nome\}/gi, r.name || "Cliente"),
                        html: personalizedHtml
                    });

                    sentCount++;
                    await prisma.emailCampaignLog.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: r.email,
                            recipientName: r.name || null,
                            status: "SENT",
                            sentAt: new Date()
                        }
                    });
                } catch (err: any) {
                    failedCount++;
                    await prisma.emailCampaignLog.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: r.email,
                            recipientName: r.name || null,
                            status: "FAILED",
                            error: err.message || "Erro desconhecido"
                        }
                    });
                }

                // Friendly delay between emails to avoid spam filtering
                await new Promise((res) => setTimeout(res, 500));
            }

            await prisma.emailCampaign.update({
                where: { id: campaign.id },
                data: {
                    status: "COMPLETED",
                    sentCount,
                    failedCount
                }
            });
        })();

        return NextResponse.json({
            status: true,
            message: "Campanha iniciada com sucesso!",
            data: campaign
        });
    } catch (error: any) {
        console.error("Erro ao iniciar campanha de e-mail:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
