import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

