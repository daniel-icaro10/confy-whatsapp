import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, getOfferPlans, normalizeBrPhone, OfferPlan } from "@/lib/segredos-defaults";
import { approvePixOrderAndGrantAccess } from "@/lib/mangofy";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export interface CreateStripeCheckoutInput {
    phone: string;
    customerName?: string;
    customerEmail?: string;
    planKey: "monthly" | "quarterly" | "annual" | "single_drama" | (string & {});
    dramaId?: string;
    mode?: "subscription" | "payment";
    customAmount?: number;
}

export interface CreateStripePixInput {
    phone: string;
    jid?: string;
    sessionId?: string;
    customerName?: string;
    customerEmail?: string;
    customerCpf?: string;
    customAmount?: number;
    planKey?: "monthly" | "quarterly" | "annual" | "single_drama" | (string & {});
    dramaId?: string;
}

/**
 * Cria cobrança Pix nativa diretamente pela Stripe via PaymentIntent
 * Devolve o código Copia e Cola (EMV payload) para envio no WhatsApp
 */
export async function createStripePixCharge(input: CreateStripePixInput) {
    const config = await ensureFunnelConfig();
    const cleanPhone = normalizeBrPhone(input.phone);
    if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error("Telefone inválido para geração de Pix");
    }

    const plans = getOfferPlans(config);
    const selectedPlan = plans.find((p) => p.key === input.planKey);
    const amount = typeof input.customAmount === "number" && input.customAmount > 0
        ? input.customAmount
        : (selectedPlan ? selectedPlan.price : config.planPrice || 19.90);

    const planTitle = input.planKey === ("single_drama" as any)
        ? `${input.dramaId || "Série"} — Série Individual`
        : (selectedPlan ? `${selectedPlan.name} — TvDrama Reels` : config.planName || "Acesso 30 Dias — TvDrama Reels");
    const amountCents = Math.round(amount * 100);

    const customerName = input.customerName?.trim() || "Cliente TvDrama Reels";
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;

    const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || "";

    if (!stripeKey) {
        logger.warn("Stripe", "Aviso: Stripe sem chave secreta. Gerando cobrança Pix de teste para simulação.");
        const simulatedExternalId = `stripe_sim_${Date.now()}`;
        const simulatedCopyPaste = `00020126580014br.gov.bcb.pix0136${cleanPhone}520400005303986540${amount.toFixed(2)}5802BR5913TvDrama Reels6009Sao Paulo62070503***6304ABCD`;

        const order = await prisma.pixOrder.create({
            data: {
                externalId: simulatedExternalId,
                phone: cleanPhone,
                jid: input.jid || `${cleanPhone}@s.whatsapp.net`,
                sessionId: input.sessionId || config.sessionId || null,
                customerName,
                customerEmail,
                planName: planTitle,
                amount,
                status: "PENDING",
                pixCopyPaste: simulatedCopyPaste,
                pixQrCodeBase64: null,
                dramaId: input.dramaId || null
            }
        });

        return {
            orderId: order.id,
            externalId: simulatedExternalId,
            amount,
            planName: planTitle,
            pixCopyPaste: simulatedCopyPaste,
            pixQrCodeBase64: null,
            hostedInstructionsUrl: null,
            isSimulated: true
        };
    }

    // Criar PaymentIntent oficial da Stripe para Pix
    const form = new URLSearchParams();
    form.append("amount", String(amountCents));
    form.append("currency", "brl");
    form.append("payment_method_types[0]", "pix");
    form.append("payment_method_data[type]", "pix");
    form.append("confirm", "true");
    form.append("payment_method_options[pix][expires_after_seconds]", "86400"); // 24 horas de validade
    form.append("receipt_email", customerEmail);
    form.append("description", `Assinatura TvDrama Reels - ${planTitle}`);
    form.append("metadata[phone]", cleanPhone);
    form.append("metadata[customerName]", customerName);
    form.append("metadata[planName]", planTitle);
    form.append("metadata[durationDays]", "30");
    form.append("metadata[dramaId]", input.dramaId || "");

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
        logger.error("Stripe", "Erro ao criar PaymentIntent Pix:", data?.error?.message || res.statusText);
        throw new Error(data?.error?.message || `Erro ao gerar Pix na Stripe (HTTP ${res.status})`);
    }

    const pixAction = data?.next_action?.pix_display_qr_code;
    const pixCopyPaste = pixAction?.data || "";
    const hostedInstructionsUrl = pixAction?.hosted_instructions_url || null;
    const qrCodeUrl = pixAction?.image_url_png || pixAction?.image_url_svg || null;

    const order = await prisma.pixOrder.create({
        data: {
            externalId: data.id,
            phone: cleanPhone,
            jid: input.jid || `${cleanPhone}@s.whatsapp.net`,
            sessionId: input.sessionId || config.sessionId || null,
            customerName,
            customerEmail,
            planName: planTitle,
            amount,
            status: "PENDING",
            pixCopyPaste: pixCopyPaste || `pix_${data.id}`,
            pixQrCodeBase64: qrCodeUrl || hostedInstructionsUrl,
            dramaId: input.dramaId || null
        }
    });

    return {
        orderId: order.id,
        externalId: data.id,
        amount,
        planName: planTitle,
        pixCopyPaste,
        pixQrCodeBase64: qrCodeUrl,
        hostedInstructionsUrl,
        isSimulated: false
    };
}

export async function createStripeCheckoutSession(input: CreateStripeCheckoutInput) {
    const config = await ensureFunnelConfig();
    const plans = getOfferPlans(config);
    const plan: OfferPlan = plans.find((p) => p.key === input.planKey) || plans[0];

    const cleanPhone = normalizeBrPhone(input.phone);
    if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error("Informe um número de WhatsApp válido com DDD.");
    }

    const baseSiteUrl = (config.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || "";

    // Se houver um link externo direto configurado no plano (ex: Payment Link ou Checkout externo) e não houver chave Stripe
    if (!stripeKey && plan.externalCheckoutUrl?.trim()) {
        const externalId = `ext_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const order = await prisma.pixOrder.create({
            data: {
                externalId,
                phone: cleanPhone,
                sessionId: config.sessionId || null,
                customerName: input.customerName?.trim() || "Assinante",
                customerEmail: input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`,
                planName: `${plan.name} — TvDrama Reels`,
                amount: plan.price,
                status: "PENDING",
                dramaId: input.dramaId || null
            }
        });

        return {
            checkoutUrl: plan.externalCheckoutUrl.trim(),
            sessionId: externalId,
            orderId: order.id
        };
    }

    if (!stripeKey) {
        throw new Error("A chave secreta da Stripe ainda não foi configurada no painel administrativo.");
    }

    const finalAmount = typeof input.customAmount === "number" && input.customAmount > 0
        ? input.customAmount
        : plan.price;
    const amountCents = Math.round(finalAmount * 100);
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;

    const successUrl = input.dramaId
        ? `${baseSiteUrl}/assistir/${encodeURIComponent(input.dramaId)}?phone=${cleanPhone}&stripe_session_id={CHECKOUT_SESSION_ID}`
        : `${baseSiteUrl}/?phone=${cleanPhone}&stripe_session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = input.dramaId
        ? `${baseSiteUrl}/assistir/${encodeURIComponent(input.dramaId)}`
        : `${baseSiteUrl}/`;

    const isPayment = input.mode === "payment";
    const checkoutMode = isPayment ? "payment" : "subscription";

    const form = new URLSearchParams();
    form.append("mode", checkoutMode);
    form.append("success_url", successUrl);
    form.append("cancel_url", cancelUrl);
    form.append("client_reference_id", cleanPhone);
    form.append("customer_email", customerEmail);
    form.append("allow_promotion_codes", "true");

    if (isPayment) {
        form.append("payment_method_types[0]", "card");
        form.append("payment_method_types[1]", "pix");
    }

    if (plan.stripePriceId?.trim() && !input.customAmount) {
        form.append("line_items[0][price]", plan.stripePriceId.trim());
        form.append("line_items[0][quantity]", "1");
    } else {
        form.append("line_items[0][price_data][currency]", "brl");
        form.append("line_items[0][price_data][unit_amount]", String(amountCents));
        form.append("line_items[0][price_data][product_data][name]", `TvDrama Reels — ${plan.name}`);
        form.append(
            "line_items[0][price_data][product_data][description]",
            `${plan.subtitle} (${plan.badge})`
        );
        if (!isPayment) {
            form.append("line_items[0][price_data][recurring][interval]", plan.interval);
            form.append("line_items[0][price_data][recurring][interval_count]", String(plan.intervalCount));
        }
        form.append("line_items[0][quantity]", "1");
    }

    form.append("metadata[phone]", cleanPhone);
    form.append("metadata[planKey]", plan.key);
    form.append("metadata[planName]", `${plan.name} — TvDrama Reels`);
    form.append("metadata[durationDays]", String(plan.durationDays));
    form.append("metadata[dramaId]", input.dramaId || "");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.url) {
        throw new Error(data?.error?.message || `Erro ao iniciar checkout Stripe (HTTP ${res.status})`);
    }

    const order = await prisma.pixOrder.create({
        data: {
            externalId: data.id,
            phone: cleanPhone,
            sessionId: config.sessionId || null,
            customerName: input.customerName?.trim() || "Assinante Stripe",
            customerEmail,
            planName: `${plan.name} — TvDrama Reels`,
            amount: plan.price,
            status: "PENDING",
            dramaId: input.dramaId || null
        }
    });

    return {
        checkoutUrl: data.url as string,
        sessionId: data.id as string,
        orderId: order.id
    };
}

export async function verifyStripeSessionAndUnlock(stripeSessionId: string) {
    const config = await ensureFunnelConfig();
    const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || "";
    if (!stripeKey) {
        throw new Error("Stripe não configurada.");
    }

    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(stripeSessionId)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${stripeKey}`
        }
    });

    const session = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(session?.error?.message || "Sessão Stripe inválida");
    }

    const isPaid = session.payment_status === "paid" || session.status === "complete";
    if (!isPaid) {
        return { isPaid: false };
    }

    const durationDays = Number(session.metadata?.durationDays || 30);
    const result = await approvePixOrderAndGrantAccess({
        externalId: stripeSessionId,
        durationDays
    });

    return {
        isPaid: true,
        phone: result.viewer.phone,
        planName: result.viewer.planName
    };
}

/**
 * Cria um PaymentIntent para checkout de cartão transparente (in-page, sem sair da página)
 */
export async function createStripePaymentIntent(input: CreateStripeCheckoutInput) {
    const config = await ensureFunnelConfig();
    const plans = getOfferPlans(config);
    const plan: OfferPlan = plans.find((p) => p.key === input.planKey) || plans[0];

    const cleanPhone = normalizeBrPhone(input.phone);
    if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error("Informe um número de WhatsApp válido com DDD.");
    }

    const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || "";
    if (!stripeKey) {
        throw new Error("Chave secreta da Stripe não configurada.");
    }

    const finalAmount = typeof input.customAmount === "number" && input.customAmount > 0
        ? input.customAmount
        : plan.price;
    const amountCents = Math.round(finalAmount * 100);
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;
    const customerName = input.customerName?.trim() || "Assinante TvDrama Reels";

    const form = new URLSearchParams();
    form.append("amount", String(amountCents));
    form.append("currency", "brl");
    form.append("payment_method_types[0]", "card");
    form.append("receipt_email", customerEmail);
    form.append("description", `TvDrama Reels — ${plan.name} (${cleanPhone})`);
    form.append("metadata[phone]", cleanPhone);
    form.append("metadata[customerName]", customerName);
    form.append("metadata[planKey]", plan.key);
    form.append("metadata[planName]", `${plan.name} — TvDrama Reels`);
    form.append("metadata[durationDays]", String(plan.durationDays));
    form.append("metadata[dramaId]", input.dramaId || "");

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.client_secret) {
        throw new Error(data?.error?.message || `Erro ao gerar cobrança no cartão (HTTP ${res.status})`);
    }

    const order = await prisma.pixOrder.create({
        data: {
            externalId: data.id,
            phone: cleanPhone,
            sessionId: config.sessionId || null,
            customerName,
            customerEmail,
            planName: `${plan.name} — TvDrama Reels`,
            amount: finalAmount,
            status: "PENDING",
            dramaId: input.dramaId || null
        }
    });

    return {
        clientSecret: data.client_secret as string,
        paymentIntentId: data.id as string,
        orderId: order.id,
        amount: finalAmount,
        planName: plan.name,
        publishableKey: (config as any).stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
    };
}

/**
 * Confirma o status do PaymentIntent da Stripe e libera o acesso do usuário imediatamente
 */
export async function confirmStripePaymentIntent(paymentIntentId: string, phoneInput?: string) {
    const config = await ensureFunnelConfig();
    const stripeKey = (config as any).stripeSecretKey?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || "";
    if (!stripeKey) {
        throw new Error("Stripe não configurada.");
    }

    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntentId)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${stripeKey}`
        }
    });

    const pi = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(pi?.error?.message || "Cobrança Stripe inválida");
    }

    const isPaid = pi.status === "succeeded";
    if (!isPaid) {
        return { isPaid: false, status: pi.status };
    }

    const durationDays = Number(pi.metadata?.durationDays || 30);
    const phone = normalizeBrPhone(pi.metadata?.phone || phoneInput || "");

    const result = await approvePixOrderAndGrantAccess({
        externalId: paymentIntentId,
        durationDays
    }).catch(async () => {
        if (!phone) throw new Error("Telefone não identificado no pagamento.");
        const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
        const viewer = await prisma.viewerAccess.upsert({
            where: { phone },
            create: {
                phone,
                name: pi.metadata?.customerName || "Assinante TvDrama Reels",
                email: pi.receipt_email,
                planName: pi.metadata?.planName || "Assinatura VIP",
                isVip: true,
                expiresAt,
                renewalReminderSentAt: null
            },
            update: {
                isVip: true,
                planName: pi.metadata?.planName || "Assinatura VIP",
                expiresAt,
                renewalReminderSentAt: null
            }
        });
        return { viewer };
    });

    return {
        isPaid: true,
        phone: result.viewer.phone,
        planName: result.viewer.planName
    };
}

export function verifyStripeWebhookSignature(
    rawBody: string,
    signatureHeader: string | null,
    webhookSecret: string
): boolean {
    if (!signatureHeader || !webhookSecret) return false;

    const parts = signatureHeader.split(",");
    let timestamp = "";
    const signatures: string[] = [];

    for (const part of parts) {
        const [k, v] = part.split("=");
        if (k?.trim() === "t") timestamp = v?.trim() || "";
        if (k?.trim() === "v1" && v) signatures.push(v.trim());
    }

    if (!timestamp || signatures.length === 0) return false;

    const signedPayload = `${timestamp}.${rawBody}`;
    const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(signedPayload, "utf8")
        .digest("hex");

    return signatures.some((sig) => {
        try {
            return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"));
        } catch {
            return false;
        }
    });
}

