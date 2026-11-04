import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, normalizeBrPhone } from "@/lib/segredos-defaults";
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
    customAmount?: number;
}

export interface CreatePixChargeResult {
    orderId: string;
    externalId: string;
    amount: number;
    pixCopyPaste: string;
    pixQrCodeBase64?: string | null;
    isSimulated: boolean;
}

/**
 * Cria uma cobrança Pix na Mangofy (ou gera um Pix de teste caso a API Key ainda não esteja preenchida)
 * e registra no banco de dados (PixOrder) para liberação automática via Webhook.
 */
export async function createMangofyPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeResult> {
    const config = await ensureFunnelConfig();
    const cleanPhone = normalizeBrPhone(input.phone);
    const amount = input.customAmount ?? config.planPrice ?? 19.90;
    const amountCents = Math.round(amount * 100);

    const customerName = input.customerName?.trim() || "Cliente TvDrama Reels";
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;
    const customerCpf = (input.customerCpf || "11144477735").replace(/\D/g, "");

    let externalId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let pixCopyPaste = "";
    let pixQrCodeBase64: string | null = null;
    let isSimulated = false;

    const apiKey = config.mangofyApiKey?.trim();
    const apiUrl = (config.mangofyApiUrl || "https://checkout.mangofy.com.br/api/v1").replace(/\/+$/, "");

    if (apiKey) {
        try {
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
                        code: "vip-tvdrama",
                        title: config.planName || "Acesso VIP TvDrama Reels",
                        name: config.planName || "Acesso VIP TvDrama Reels",
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
                    dramaId: input.dramaId || ""
                }
            };

            // Tenta rota padrão /payment da Mangofy
            const endpoint = apiUrl.endsWith("/payment") || apiUrl.endsWith("/pix") || apiUrl.endsWith("/transactions")
                ? apiUrl
                : `${apiUrl}/payment`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
            }

            // Extrai de forma compatível com diferentes versões do payload da Mangofy
            externalId = String(
                data?.payment_code ||
                data?.id ||
                data?.transaction_id ||
                data?.data?.payment_code ||
                data?.data?.id ||
                externalId
            );

            pixCopyPaste = String(
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

            pixQrCodeBase64 =
                data?.pix?.pix_qrcode_base64 ||
                data?.pix?.qr_code_base64 ||
                data?.pix?.qrcode_base64 ||
                data?.data?.pix?.qr_code_base64 ||
                null;

            if (!pixCopyPaste) {
                throw new Error("A resposta da API Mangofy não retornou o código Pix Copia e Cola.");
            }
        } catch (err: any) {
            logger.error("Mangofy", "Erro ao gerar Pix na API Mangofy, gerando código de contingência/teste:", err?.message);
            isSimulated = true;
        }
    } else {
        isSimulated = true;
    }

    if (!pixCopyPaste) {
        // Código EMV Pix demonstrativo para testes antes de inserir a chave da Mangofy
        pixCopyPaste = `00020126580014BR.GOV.BCB.PIX0136segredos-do-coracao-${externalId}5204000053039865405${amount.toFixed(2)}5802BR5920SEGREDOS DO CORACAO6009SAO PAULO62070503***6304ABCD`;
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
            planName: config.planName,
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
        pixCopyPaste,
        pixQrCodeBase64,
        isSimulated
    };
}

/**
 * Aprova um pedido Pix, libera o telefone do cliente na tabela ViewerAccess
 * e envia automaticamente a mensagem no WhatsApp com o link mágico já autenticado!
 */
export async function approvePixOrderAndGrantAccess(orderIdentifier: {
    orderId?: string;
    externalId?: string;
}) {
    const config = await ensureFunnelConfig();

    const order = await prisma.pixOrder.findFirst({
        where: orderIdentifier.orderId
            ? { id: orderIdentifier.orderId }
            : { externalId: orderIdentifier.externalId }
    });

    if (!order) {
        throw new Error("Pedido Pix não encontrado");
    }

    const cleanPhone = normalizeBrPhone(order.phone);

    // 1. Atualiza o status do pedido para PAID
    const updatedOrder = await prisma.pixOrder.update({
        where: { id: order.id },
        data: {
            status: "PAID",
            paidAt: new Date()
        }
    });

    // 2. Libera o acesso VIP para o número de WhatsApp do cliente no site
    const viewer = await prisma.viewerAccess.upsert({
        where: { phone: cleanPhone },
        create: {
            phone: cleanPhone,
            name: order.customerName || "Assinante VIP",
            email: order.customerEmail,
            cpf: order.customerCpf,
            planName: order.planName || config.planName,
            isVip: true,
            lastWatchedDramaId: order.dramaId || null
        },
        update: {
            isVip: true,
            planName: order.planName || config.planName,
            updatedAt: new Date()
        }
    });

    // 3. Dispara mensagem automática no WhatsApp entregando o link de acesso imediato
    const baseSiteUrl = (config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const magicLink = order.dramaId
        ? `${baseSiteUrl}/assistir/${order.dramaId}?phone=${cleanPhone}`
        : `${baseSiteUrl}/?phone=${cleanPhone}`;

    const messageTemplate = config.paymentApprovedMessage ||
        "🎉 *PAGAMENTO CONFIRMADO COM SUCESSO!* ❤️🍿\n\n" +
        "Seu número *{{TELEFONE}}* já está 100% liberado no *TvDrama Reels*!\n\n" +
        "👉 *Clique no link abaixo para entrar e assistir agora mesmo:*\n{{LINK_ACESSO}}";

    const finalMessage = messageTemplate
        .replace(/\{\{TELEFONE\}\}/g, cleanPhone)
        .replace(/\{\{LINK_ACESSO\}\}/g, magicLink)
        .replace(/\{\{VALOR\}\}/g, order.amount.toFixed(2).replace(".", ","));

    try {
        // Procura a sessão do pedido ou a primeira sessão conectada no Baileys
        let targetSessionId = order.sessionId || config.sessionId;
        if (!targetSessionId) {
            const connectedSession = await prisma.session.findFirst({
                where: { status: "CONNECTED" },
                select: { sessionId: true }
            });
            targetSessionId = connectedSession?.sessionId || null;
        }

        if (targetSessionId) {
            const instance = waManager.getInstance(targetSessionId);
            const targetJid = order.jid || `${cleanPhone}@s.whatsapp.net`;

            if (instance?.socket) {
                await instance.socket.sendMessage(targetJid, { text: finalMessage });
                logger.info("Funnel", `Acesso VIP entregue via WhatsApp para ${targetJid}`);
            }
        }
    } catch (err) {
        logger.error("Funnel", "Erro ao enviar mensagem de confirmação no WhatsApp:", err);
    }

    return { order: updatedOrder, viewer, magicLink };
}

