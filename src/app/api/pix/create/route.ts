import { NextResponse } from "next/server";
import { createMangofyPixCharge } from "@/lib/mangofy";
import { createStripePixCharge } from "@/lib/stripe";
import { ensureFunnelConfig, normalizeBrPhone } from "@/lib/segredos-defaults";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const cleanPhone = normalizeBrPhone(body.phone || "");

        if (!cleanPhone || cleanPhone.length < 10) {
            return NextResponse.json(
                { error: "Digite seu número de WhatsApp com DDD para vincular seu acesso." },
                { status: 400 }
            );
        }

        const config = await ensureFunnelConfig();
        const useStripe = Boolean((config as any).stripeSecretKey?.trim()) || !Boolean(config.mangofyApiKey?.trim());

        const charge = useStripe
            ? await createStripePixCharge({
                phone: cleanPhone,
                customerName: body.name || "Assinante Site",
                customerCpf: body.cpf || undefined,
                customerEmail: body.email || undefined,
                dramaId: body.dramaId || undefined,
                planKey: body.planKey || "monthly",
                customAmount: body.amount ? Number(body.amount) : undefined
            })
            : await createMangofyPixCharge({
                phone: cleanPhone,
                customerName: body.name || "Assinante Site",
                customerCpf: body.cpf || undefined,
                customerEmail: body.email || undefined,
                dramaId: body.dramaId || undefined,
                planKey: body.planKey || "monthly",
                customAmount: body.amount ? Number(body.amount) : undefined
            });

        // Envia evento oficial InitiateCheckout para a Meta Conversions API (CAPI)
        sendMetaCapiEvent({
            eventName: "InitiateCheckout",
            phone: cleanPhone,
            name: body.name || undefined,
            value: charge.amount,
            currency: "BRL",
            orderId: charge.externalId || charge.orderId
        }).catch(() => {});

        return NextResponse.json({
            orderId: charge.orderId,
            externalId: charge.externalId,
            amount: charge.amount,
            planName: charge.planName,
            pixCopyPaste: charge.pixCopyPaste,
            pixQrCodeBase64: charge.pixQrCodeBase64,
            isSimulated: charge.isSimulated,
            phone: cleanPhone
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Erro ao gerar Pix", details: error?.message },
            { status: 400 }
        );
    }
}
