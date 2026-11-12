import { NextResponse } from "next/server";
import { createStripeCheckoutSession, verifyStripeSessionAndUnlock } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, name, email, planKey, dramaId, amount, mode } = body;

        if (!phone) {
            return NextResponse.json(
                { error: "Informe seu número de WhatsApp com DDD." },
                { status: 400 }
            );
        }

        const result = await createStripeCheckoutSession({
            phone,
            customerName: name,
            customerEmail: email,
            planKey: planKey || "single_drama",
            dramaId,
            mode: mode || "payment",
            customAmount: amount ? Number(amount) : undefined
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao iniciar checkout recorrente" },
            { status: 400 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
            return NextResponse.json({ error: "session_id ausente" }, { status: 400 });
        }

        const result = await verifyStripeSessionAndUnlock(sessionId);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao verificar sessão Stripe" },
            { status: 400 }
        );
    }
}

