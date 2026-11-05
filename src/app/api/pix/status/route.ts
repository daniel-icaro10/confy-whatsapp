import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig } from "@/lib/segredos-defaults";
import { approvePixOrderAndGrantAccess } from "@/lib/mangofy";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ error: "orderId obrigatório" }, { status: 400 });
        }

        const order = await prisma.pixOrder.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
        }

        // Se o pedido ainda está pendente mas é um PaymentIntent da Stripe, faz checagem em tempo real na Stripe
        if (order.status !== "PAID" && order.externalId?.startsWith("pi_")) {
            const config = await ensureFunnelConfig();
            const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim();
            if (stripeKey) {
                try {
                    const stripeRes = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(order.externalId)}`, {
                        headers: { Authorization: `Bearer ${stripeKey}` }
                    });
                    const pi = await stripeRes.json().catch(() => null);
                    if (pi?.status === "succeeded") {
                        await approvePixOrderAndGrantAccess({
                            externalId: order.externalId,
                            durationDays: 30
                        });
                        return NextResponse.json({
                            orderId: order.id,
                            status: "PAID",
                            isPaid: true,
                            phone: order.phone,
                            paidAt: new Date()
                        });
                    }
                } catch {
                    // ignore
                }
            }
        }

        return NextResponse.json({
            orderId: order.id,
            status: order.status,
            isPaid: order.status === "PAID",
            phone: order.phone,
            paidAt: order.paidAt
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao consultar pedido", details: error?.message },
            { status: 500 }
        );
    }
}

