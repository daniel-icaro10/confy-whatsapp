import { NextResponse } from "next/server";
import { approvePixOrderAndGrantAccess } from "@/lib/mangofy";
import { logger } from "@/lib/logger";

/**
 * POST /api/webhooks/mangofy
 * Recebe a notificação automática de pagamento Pix aprovado da Mangofy
 * (ou aprovação manual do painel admin) e libera o acesso + envia WhatsApp na hora!
 */
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        logger.info("MangofyWebhook", "Payload recebido:", JSON.stringify(body));

        // 1. Aprovação direta pelo orderId interno (ex: botão "Aprovar/Simular Pagamento" no painel ou teste)
        if (body.orderId && (body.forceApprove === true || body.status === "PAID" || body.payment_status === "approved")) {
            const result = await approvePixOrderAndGrantAccess({ orderId: String(body.orderId) });
            return NextResponse.json({
                success: true,
                message: "Pedido aprovado e acesso liberado com sucesso!",
                phone: result.viewer.phone,
                magicLink: result.magicLink
            });
        }

        // 2. Webhook real da Mangofy (v1 / v2)
        const externalId = String(
            body.payment_code ||
            body.id ||
            body.transaction_id ||
            body.data?.payment_code ||
            body.data?.id ||
            body.order_id ||
            ""
        );

        const rawStatus = String(
            body.payment_status ||
            body.status ||
            body.data?.payment_status ||
            body.data?.status ||
            body.event ||
            ""
        ).toLowerCase();

        const isApproved = [
            "approved",
            "paid",
            "completed",
            "settled",
            "confirmed",
            "pago",
            "aprovado",
            "payment.approved",
            "pix.paid"
        ].some((s) => rawStatus.includes(s));

        if (!externalId) {
            return NextResponse.json(
                { received: true, ignored: true, reason: "Nenhum payment_code / id identificado no payload" },
                { status: 200 }
            );
        }

        if (!isApproved) {
            return NextResponse.json(
                { received: true, status: rawStatus, action: "waiting_approval" },
                { status: 200 }
            );
        }

        const result = await approvePixOrderAndGrantAccess({ externalId });

        return NextResponse.json({
            success: true,
            externalId,
            phone: result.viewer.phone,
            magicLink: result.magicLink
        });
    } catch (error: any) {
        logger.error("MangofyWebhook", "Erro ao processar webhook Mangofy:", error?.message);
        return NextResponse.json(
            { error: "Erro ao processar webhook", details: error?.message },
            { status: 500 }
        );
    }
}

