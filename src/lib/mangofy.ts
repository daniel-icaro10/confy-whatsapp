import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, getOfferPlans, normalizeBrPhone } from "@/lib/segredos-defaults";
import { waManager } from "@/modules/whatsapp/manager";
import { logger } from "@/lib/logger";

export interface CreatePixChargeInput {
    phone: string;
    jid?: string;
    sessionId?: string;
    customerName?: string;
    customerCpf?: string;
    customerEmail?: string;
    dramaId?: string;
    planKey?: "monthly" | "quarterly" | "annual";
    customAmount?: number;
}

export interface CreatePixChargeResult {
    orderId: string;
    externalId: string;
    amount: number;
    planName: string;
    pixCopyPaste: string;
    pixQrCodeBase64?: string | null;
    isSimulated: boolean;
}

/**
 * Cria uma cobrança Pix real na Mangofy e registra no banco de dados (PixOrder).
 */
export async function createMangofyPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeResult> {
    const config = await ensureFunnelConfig();
    const plans = getOfferPlans(config);
    const selectedPlan = input.planKey
        ? plans.find((p) => p.key === input.planKey)
        : plans.find((p) => p.key === "monthly") || plans[0];

    const cleanPhone = normalizeBrPhone(input.phone);
    const amount = input.customAmount ?? selectedPlan?.price ?? config.planPrice ?? 9.90;
    const planTitle = selectedPlan ? `${selectedPlan.name} — TvDrama Reels` : config.planName || "Plano Mensal — TvDrama Reels";
    const amountCents = Math.round(amount * 100);

    const customerName = input.customerName?.trim() || "Cliente TvDrama Reels";
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;
    const customerCpf = (input.customerCpf || "11144477735").replace(/\D/g, "");

    const apiKey = config.mangofyApiKey?.trim();
    const apiUrl = (config.mangofyApiUrl || "https://checkout.mangofy.com.br/api/v1").replace(/\/+$/, "");

    if (!apiKey) {
        throw new Error("A chave de API da Mangofy ainda não foi configurada no painel administrativo.");
    }

    const postbackUrl = `${(config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")}/api/webhooks/mangofy`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`,
        "x-api-key": apiKey
    };

    if (config.mangofyStoreCode?.trim()) {
        headers["Store-Code"] = config.mangofyStoreCode.trim();
    }

    const payload = {
        store_code: config.mangofyStoreCode?.trim() || undefined,
        payment_method: "pix",
        payment_format: "regular",
        payment_amount: amountCents,
        amount: amountCents,
        value: amount,
        postback_url: postbackUrl,
        webhook_url: postbackUrl,
        customer: {
            name: customerName,
            email: customerEmail,
            document: customerCpf,
            cpf: customerCpf,
            phone: cleanPhone
        },
        items: [
            {
                code: `tvdrama-${selectedPlan?.key || "monthly"}`,
                title: planTitle,
                name: planTitle,
                amount: 1,
                quantity: 1,
                unit_price: amountCents,
                total: amountCents
            }
        ],
        metadata: {
            phone: cleanPhone,
            jid: input.jid || "",
            sessionId: input.sessionId || config.sessionId || "",
            dramaId: input.dramaId || "",
            planKey: selectedPlan?.key || "monthly",
            durationDays: String(selectedPlan?.durationDays || 30)
        }
    };

    const endpoint =
        apiUrl.endsWith("/payment") || apiUrl.endsWith("/pix") || apiUrl.endsWith("/transactions")
            ? apiUrl
            : `${apiUrl}/payment`;

    const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || data?.error || `Erro na API Mangofy (HTTP ${res.status})`);
    }

    const externalId = String(
        data?.payment_code ||
        data?.id ||
        data?.transaction_id ||
        data?.data?.payment_code ||
        data?.data?.id ||
        `mgf_${Date.now()}`
    );

    const pixCopyPaste = String(
        data?.pix?.pix_qrcode_text ||
        data?.pix?.qr_code ||
        data?.pix?.qrcode ||
        data?.pix?.emv ||
        data?.pix?.copy_paste ||
        data?.pix_qrcode_text ||
        data?.qr_code ||
        data?.emv ||
        data?.data?.pix?.pix_qrcode_text ||
        data?.data?.pix?.qr_code ||
        ""
    );

    const pixQrCodeBase64 =
        data?.pix?.pix_qrcode_base64 ||
        data?.pix?.qr_code_base64 ||
        data?.pix?.qrcode_base64 ||
        data?.data?.pix?.qr_code_base64 ||
        null;

    if (!pixCopyPaste) {
        throw new Error("A resposta da API Mangofy não retornou o código Pix Copia e Cola.");
    }

    const order = await prisma.pixOrder.create({
        data: {
            externalId,
            phone: cleanPhone,
            jid: input.jid || `${cleanPhone}@s.whatsapp.net`,
            sessionId: input.sessionId || config.sessionId || null,
            customerName,
            customerEmail,
            customerCpf,
            planName: planTitle,
            amount,
            status: "PENDING",
            pixCopyPaste,
            pixQrCodeBase64,
            dramaId: input.dramaId || null
        }
    });

    return {
        orderId: order.id,
        externalId,
        amount,
        planName: planTitle,
        pixCopyPaste,
        pixQrCodeBase64,
        isSimulated: false
    };
}

/**
 * Aprova um pedido Pix ou Stripe, libera o telefone do cliente na tabela ViewerAccess
 * e envia a mensagem de confirmação no WhatsApp (caso configurada pelo administrador).
 */
export async function approvePixOrderAndGrantAccess(orderIdentifier: {
    orderId?: string;
    externalId?: string;
    durationDays?: number;
}) {
    const config = await ensureFunnelConfig();

    const order = await prisma.pixOrder.findFirst({
        where: orderIdentifier.orderId
            ? { id: orderIdentifier.orderId }
            : { externalId: orderIdentifier.externalId }
    });

    if (!order) {
        throw new Error("Pedido não encontrado");
    }

    const cleanPhone = normalizeBrPhone(order.phone);

    const updatedOrder = await prisma.pixOrder.update({
        where: { id: order.id },
        data: {
            status: "PAID",
            paidAt: new Date()
        }
    });

    // Calcula validade de acordo com o plano (Mensal 30d, Trimestral 90d, Anual 365d)
    let days = orderIdentifier.durationDays || 30;
    const lowerPlan = (order.planName || "").toLowerCase();
    if (!orderIdentifier.durationDays) {
        if (lowerPlan.includes("anual")) days = 365;
        else if (lowerPlan.includes("trimestral")) days = 90;
        else days = 30;
    }
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const viewer = await prisma.viewerAccess.upsert({
        where: { phone: cleanPhone },
        create: {
            phone: cleanPhone,
            name: order.customerName || "Assinante",
            email: order.customerEmail,
            cpf: order.customerCpf,
            planName: order.planName || config.planName,
            isVip: true,
            expiresAt,
            lastWatchedDramaId: order.dramaId || null
        },
        update: {
            isVip: true,
            planName: order.planName || config.planName,
            expiresAt,
            updatedAt: new Date()
        }
    });

    const baseSiteUrl = (config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const magicLink = order.dramaId
        ? `${baseSiteUrl}/assistir/${order.dramaId}?phone=${cleanPhone}`
        : `${baseSiteUrl}/?phone=${cleanPhone}`;

    if (config.paymentApprovedMessage?.trim()) {
        const finalMessage = config.paymentApprovedMessage
            .replace(/\{\{TELEFONE\}\}/g, cleanPhone)
            .replace(/\{\{LINK_ACESSO\}\}/g, magicLink)
            .replace(/\{\{VALOR\}\}/g, order.amount.toFixed(2).replace(".", ","))
            .replace(/\{\{NOME\}\}/g, order.customerName || "");

        try {
            const targetSessionId = (order.sessionId || config.sessionId || "").trim();

            if (targetSessionId) {
                const instance = waManager.getInstance(targetSessionId);
                const targetJid = order.jid || `${cleanPhone}@s.whatsapp.net`;

                if (instance?.socket) {
                    await instance.socket.sendMessage(targetJid, { text: finalMessage });
                    logger.info("Funnel", `Acesso entregue via WhatsApp (${targetSessionId}) para ${targetJid}`);
                }
            }
        } catch (err) {
            logger.error("Funnel", "Erro ao enviar mensagem de confirmação no WhatsApp:", err);
        }
    }

    return { order: updatedOrder, viewer, magicLink };
}
