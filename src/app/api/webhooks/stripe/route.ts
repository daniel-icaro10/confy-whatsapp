import { NextResponse } from "next/server";
import { ensureFunnelConfig, normalizeBrPhone } from "@/lib/segredos-defaults";
import { approvePixOrderAndGrantAccess } from "@/lib/mangofy";
import { verifyStripeWebhookSignature } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const sig = request.headers.get("stripe-signature");
        const config = await ensureFunnelConfig();
        const webhookSecret = (config as any).stripeWebhookSecret?.trim() || process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";

        if (webhookSecret) {
            const valid = verifyStripeWebhookSignature(rawBody, sig, webhookSecret);
            if (!valid) {
                return NextResponse.json({ error: "Assinatura de webhook Stripe inválida" }, { status: 400 });
            }
        }

        const event = JSON.parse(rawBody);
        const type = event?.type;
        const obj = event?.data?.object;

        if (
            type === "checkout.session.completed" ||
            type === "checkout.session.async_payment_succeeded" ||
            type === "payment_intent.succeeded"
        ) {
            const externalId = obj?.id;
            const durationDays = Number(obj?.metadata?.durationDays || 30);
            const phone = normalizeBrPhone(obj?.metadata?.phone || obj?.client_reference_id || "");
            const planName = obj?.metadata?.planName || "Assinatura TvDrama Reels";

            if (externalId) {
                try {
                    await approvePixOrderAndGrantAccess({
                        externalId: String(externalId),
                        durationDays
                    });
                } catch {
                    if (phone) {
                        const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
                        await prisma.viewerAccess.upsert({
                            where: { phone },
                            create: {
                                phone,
                                name: obj?.customer_details?.name || obj?.metadata?.customerName || "Assinante Stripe",
                                email: obj?.customer_details?.email || obj?.receipt_email || null,
                                planName,
                                isVip: true,
                                expiresAt
                            },
                            update: {
                                isVip: true,
                                planName,
                                expiresAt
                            }
                        });
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao processar webhook Stripe", details: error?.message },
            { status: 400 }
        );
    }
}

