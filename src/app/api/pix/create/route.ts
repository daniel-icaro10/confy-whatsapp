import { NextResponse } from "next/server";
import { createMangofyPixCharge } from "@/lib/mangofy";
import { normalizeBrPhone } from "@/lib/segredos-defaults";

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

        const charge = await createMangofyPixCharge({
            phone: cleanPhone,
            customerName: body.name || "Assinante Site",
            customerCpf: body.cpf || undefined,
            dramaId: body.dramaId || undefined
        });

        return NextResponse.json({
            orderId: charge.orderId,
            externalId: charge.externalId,
            amount: charge.amount,
            pixCopyPaste: charge.pixCopyPaste,
            pixQrCodeBase64: charge.pixQrCodeBase64,
            isSimulated: charge.isSimulated,
            phone: cleanPhone
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao gerar Pix", details: error?.message },
            { status: 500 }
        );
    }
}

