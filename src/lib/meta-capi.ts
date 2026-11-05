import crypto from "crypto";
import { logger } from "@/lib/logger";

export const META_PIXEL_ID = process.env.META_PIXEL_ID || "2231662524359281";
export const META_CAPI_TOKEN =
    process.env.META_CAPI_TOKEN ||
    "EAAXZAGVM6fDYBS3tWIbbr99YIJeKZBTJC2cigJVaVwH1uLsN29PncA2PIg4ZCbhdGznQVQZA51dyNWrEQpt1QJLNLv2e2zjOLyuBP4tEiryLnXXJDCplanRvcHApcNvevHtlaYwWv4vQmrpfy6J65IboGP6H7nZAzk8qJTty1ejAipREsSBJYTXlkq46bQfFJQQZDZD";

function sha256(value: string): string {
    return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export interface MetaCapiEventInput {
    eventName: "Purchase" | "InitiateCheckout" | "AddPaymentInfo" | "PageView" | string;
    phone?: string;
    email?: string;
    name?: string;
    value?: number;
    currency?: string;
    orderId?: string;
    eventId?: string;
    url?: string;
    clientIp?: string;
    userAgent?: string;
}

/**
 * Envia evento oficial de conversão para a API de Conversões da Meta (Facebook CAPI v19.0)
 * Garante 100% de mensuração em compras e checkouts mesmo com bloqueadores de anúncios e iOS 14+.
 */
export async function sendMetaCapiEvent(input: MetaCapiEventInput): Promise<boolean> {
    try {
        if (!META_PIXEL_ID || !META_CAPI_TOKEN) return false;

        const userData: Record<string, any> = {};

        if (input.phone) {
            const digits = input.phone.replace(/\D/g, "");
            const withDdi = digits.startsWith("55") ? digits : `55${digits}`;
            userData.ph = [sha256(withDdi)];
        }

        if (input.email) {
            userData.em = [sha256(input.email)];
        }

        if (input.name) {
            const firstName = input.name.trim().split(" ")[0];
            userData.fn = [sha256(firstName)];
        }

        if (input.clientIp) {
            userData.client_ip_address = input.clientIp;
        }

        if (input.userAgent) {
            userData.client_user_agent = input.userAgent;
        } else {
            userData.client_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        }

        const customData: Record<string, any> = {};
        if (typeof input.value === "number") {
            customData.value = input.value;
            customData.currency = input.currency || "BRL";
        }
        if (input.orderId) {
            customData.order_id = input.orderId;
        }

        const eventPayload: Record<string, any> = {
            event_name: input.eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: input.url || "https://tvdramareels.online",
            user_data: userData
        };

        if (Object.keys(customData).length > 0) {
            eventPayload.custom_data = customData;
        }

        if (input.eventId) {
            eventPayload.event_id = input.eventId;
        }

        const res = await fetch(
            `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [eventPayload] })
            }
        );

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.error) {
            logger.warn("MetaCAPI", `Aviso Meta CAPI (${input.eventName}):`, data?.error?.message || res.status);
            return false;
        }

        logger.info("MetaCAPI", `Evento ${input.eventName} entregue com sucesso à Meta (fbtrace: ${data?.fbtrace_id})`);
        return true;
    } catch (err: any) {
        logger.error("MetaCAPI", `Erro ao despachar evento ${input.eventName}:`, err?.message);
        return false;
    }
}
