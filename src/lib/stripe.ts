import { prisma } from "@/lib/prisma";
import { ensureFunnelConfig, getOfferPlans, normalizeBrPhone, OfferPlan } from "@/lib/segredos-defaults";
import { approvePixOrderAndGrantAccess } from "@/lib/mangofy";
import crypto from "crypto";

export interface CreateStripeCheckoutInput {
    phone: string;
    customerName?: string;
    customerEmail?: string;
    planKey: "monthly" | "quarterly" | "annual";
    dramaId?: string;
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

    const amountCents = Math.round(plan.price * 100);
    const customerEmail = input.customerEmail?.trim() || `${cleanPhone}@tvdramareels.com`;

    const successUrl = input.dramaId
        ? `${baseSiteUrl}/assistir/${encodeURIComponent(input.dramaId)}?phone=${cleanPhone}&stripe_session_id={CHECKOUT_SESSION_ID}`
        : `${baseSiteUrl}/?phone=${cleanPhone}&stripe_session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = input.dramaId
        ? `${baseSiteUrl}/assistir/${encodeURIComponent(input.dramaId)}`
        : `${baseSiteUrl}/`;

    const form = new URLSearchParams();
    form.append("mode", "subscription");
    form.append("success_url", successUrl);
    form.append("cancel_url", cancelUrl);
    form.append("client_reference_id", cleanPhone);
    form.append("customer_email", customerEmail);
    form.append("allow_promotion_codes", "true");

    if (plan.stripePriceId?.trim()) {
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
        form.append("line_items[0][price_data][recurring][interval]", plan.interval);
        form.append("line_items[0][price_data][recurring][interval_count]", String(plan.intervalCount));
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

