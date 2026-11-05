import { NextResponse } from "next/server";
import { confirmStripePaymentIntent } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentIntentId, phone } = body;

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: "paymentIntentId é obrigatório." },
                { status: 400 }
            );
        }

        const result = await confirmStripePaymentIntent(paymentIntentId, phone);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao confirmar pagamento no cartão." },
            { status: 400 }
        );
    }
}
