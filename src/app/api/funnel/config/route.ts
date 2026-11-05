import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, getFunnelNodes, getOfferPlans, normalizeBrPhone } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";
import { waManager } from "@/modules/whatsapp/manager";

async function resolveSessionPhone(sessionId?: string | null): Promise<string> {
    if (!sessionId) return "";
    try {
        const inst = waManager.getInstance(sessionId) as any;
        const rawUserId = inst?.sock?.user?.id || inst?.user?.id || "";
        if (rawUserId) {
            const jidPart = String(rawUserId).split(":")[0].split("@")[0];
            const clean = normalizeBrPhone(jidPart);
            if (clean) return clean;
        }
    } catch {
        // ignore
    }

    try {
        const creds = await prisma.authState.findFirst({
            where: {
                sessionId,
                key: "creds.json"
            }
        });
        const val = creds?.value as any;
        const meId = val?.me?.id || "";
        if (meId && typeof meId === "string") {
            const jidPart = meId.split(":")[0].split("@")[0];
            const clean = normalizeBrPhone(jidPart);
            if (clean) return clean;
        }
    } catch {
        // ignore
    }

    return "";
}

export async function GET() {
    try {
        const [config, sessions] = await Promise.all([
            ensureFunnelConfig(),
            prisma.session
                .findMany({
                    select: {
                        id: true,
                        name: true,
                        sessionId: true,
                        status: true
                    },
                    orderBy: { createdAt: "desc" }
                })
                .catch(() => [])
        ]);

        const plans = getOfferPlans(config);
        const nodes = getFunnelNodes(config);
        const manualPhone = normalizeBrPhone(config.whatsappNumber || "");
        const detectedPhone = manualPhone || (await resolveSessionPhone(config.sessionId));

        return NextResponse.json({
            config: {
                ...config,
                publicPlanName: config.planName,
                publicPlanPrice: config.planPrice,
                publicWhatsappNumber: detectedPhone,
                publicAdRedirectMessage:
                    config.adRedirectMessage ||
                    "Olá! Vi o anúncio e quero liberar meu acesso para assistir."
            },
            plans,
            nodes,
            sessions
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

        const cleanSessionId = body.sessionId?.trim() || null;

        const updated = await prisma.funnelConfig.update({
            where: { id: "default" },
            data: {
                enabled: body.enabled !== undefined ? Boolean(body.enabled && cleanSessionId) : undefined,
                sessionId: cleanSessionId,
                planName: body.planName,
                planPrice: body.planPrice !== undefined ? Number(body.planPrice) : undefined,
                siteUrl: body.siteUrl,
                whatsappNumber: body.whatsappNumber !== undefined ? String(body.whatsappNumber || "").trim() : undefined,
                adRedirectMessage: body.adRedirectMessage !== undefined ? String(body.adRedirectMessage || "") : undefined,
                mangofyApiUrl: body.mangofyApiUrl,
                mangofyApiKey: body.mangofyApiKey,
                mangofyStoreCode: body.mangofyStoreCode,
                mangofyWebhookSecret: body.mangofyWebhookSecret,
                stripeSecretKey: body.stripeSecretKey,
                stripePublishableKey: body.stripePublishableKey,
                stripeWebhookSecret: body.stripeWebhookSecret,
                plansJson: body.plansJson !== undefined ? (body.plansJson as any) : undefined,
                flowJson: body.flowJson !== undefined ? (body.flowJson as any) : undefined,
                step1Greeting: body.step1Greeting,
                step1MediaUrl: body.step1MediaUrl,
                step1MediaType: body.step1MediaType,
                step2OfferMessage: body.step2OfferMessage,
                pixTriggerKeywords: body.pixTriggerKeywords,
                pixGeneratedMessage: body.pixGeneratedMessage,
                paymentApprovedMessage: body.paymentApprovedMessage,
                pixAbandonRemarketingEnabled: body.pixAbandonRemarketingEnabled !== undefined ? Boolean(body.pixAbandonRemarketingEnabled) : undefined,
                pixAbandonMinutes: body.pixAbandonMinutes !== undefined ? Number(body.pixAbandonMinutes) : undefined,
                pixAbandonMessage: body.pixAbandonMessage,
                renewalReminderEnabled: body.renewalReminderEnabled !== undefined ? Boolean(body.renewalReminderEnabled) : undefined,
                renewalReminderDaysBefore: body.renewalReminderDaysBefore !== undefined ? Number(body.renewalReminderDaysBefore) : undefined,
                renewalReminderMessage: body.renewalReminderMessage,
                useAiSaleswoman: body.useAiSaleswoman !== undefined ? Boolean(body.useAiSaleswoman) : undefined,
                aiProvider: body.aiProvider,
                aiApiKey: body.aiApiKey,
                aiModel: body.aiModel,
                aiSystemPrompt: body.aiSystemPrompt
            }
        });

        return NextResponse.json({
            config: updated,
            plans: getOfferPlans(updated),
            nodes: getFunnelNodes(updated)
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao salvar configuração do funil", details: error?.message },
            { status: 500 }
        );
    }
}
