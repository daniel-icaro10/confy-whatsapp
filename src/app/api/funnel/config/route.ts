import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const config = await ensureFunnelConfig();
        return NextResponse.json({
            config: {
                ...config,
                // Para o site público poder saber o valor do plano sem expor as chaves privadas
                publicPlanName: config.planName,
                publicPlanPrice: config.planPrice
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao carregar configuração do funil", details: error?.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await request.json();
        await ensureFunnelConfig();

        const updated = await prisma.funnelConfig.update({
            where: { id: "default" },
            data: {
                enabled: body.enabled !== undefined ? Boolean(body.enabled) : undefined,
                sessionId: body.sessionId ?? null,
                planName: body.planName,
                planPrice: body.planPrice !== undefined ? Number(body.planPrice) : undefined,
                siteUrl: body.siteUrl,
                mangofyApiUrl: body.mangofyApiUrl,
                mangofyApiKey: body.mangofyApiKey,
                mangofyStoreCode: body.mangofyStoreCode,
                mangofyWebhookSecret: body.mangofyWebhookSecret,
                step1Greeting: body.step1Greeting,
                step1MediaUrl: body.step1MediaUrl,
                step1MediaType: body.step1MediaType,
                step2OfferMessage: body.step2OfferMessage,
                pixTriggerKeywords: body.pixTriggerKeywords,
                pixGeneratedMessage: body.pixGeneratedMessage,
                paymentApprovedMessage: body.paymentApprovedMessage,
                useAiSaleswoman: body.useAiSaleswoman !== undefined ? Boolean(body.useAiSaleswoman) : undefined,
                aiProvider: body.aiProvider,
                aiApiKey: body.aiApiKey,
                aiModel: body.aiModel,
                aiSystemPrompt: body.aiSystemPrompt
            }
        });

        return NextResponse.json({ config: updated });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao salvar configuração do funil", details: error?.message },
            { status: 500 }
        );
    }
}

