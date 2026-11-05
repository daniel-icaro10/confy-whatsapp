import { NextResponse } from "next/server";
import { createStripePaymentIntent } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, name, email, planKey, dramaId } = body;

        if (!phone) {
            return NextResponse.json(
                { error: "Informe seu número de WhatsApp com DDD." },
                { status: 400 }
            );
        }

        const result = await createStripePaymentIntent({
            phone,
            customerName: name,
            customerEmail: email,
            planKey: planKey || "monthly",
            dramaId
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao preparar cobrança no cartão." },
            { status: 400 }
        );
    }
}
