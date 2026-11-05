import { NextRequest, NextResponse } from "next/server";
import { runPixAbandonRemarketing, runRenewalReminder } from "@/modules/whatsapp/remarketing-engine";
import { prisma } from "@/lib/prisma";
import { WhatsAppManager } from "@/modules/whatsapp/manager";
import { normalizeBrPhone } from "@/lib/segredos-defaults";
import {
    sendOfferSelectionMessage,
    sendPixPaymentMessage,
    sendAbandonedPixRemarketing
} from "@/modules/whatsapp/interactive-buttons";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const testPhone = searchParams.get("testPhone");
        const testType = searchParams.get("testType") || "offer";

        let testSendResult: any = null;

        if (testPhone) {
            const cleanPhone = normalizeBrPhone(testPhone);
            const targetJid = `${cleanPhone}@s.whatsapp.net`;
            const funnelConfig = await prisma.funnelConfig.findUnique({ where: { id: "default" } });
            const sessionResult = WhatsAppManager.getInstance().getSessionOrAnyActive(funnelConfig?.sessionId);

            if (sessionResult && sessionResult.instance.socket) {
                const sock = sessionResult.instance.socket;
                if (testType === "offer") {
                    await sendOfferSelectionMessage(sock, targetJid);
                    testSendResult = { sent: true, type: "offer", to: targetJid };
                } else if (testType === "pix") {
                    await sendPixPaymentMessage(sock, targetJid, {
                        planType: "option2",
                        priceTxt: "20,00",
                        pixCode: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540520.005802BR5913TvDrama Reels6009Sao Paulo62070503***6304ABCD"
                    });
                    testSendResult = { sent: true, type: "pix", to: targetJid };
                } else if (testType === "remarketing") {
                    await sendAbandonedPixRemarketing(sock, targetJid);
                    testSendResult = { sent: true, type: "remarketing", to: targetJid };
                }
            } else {
                testSendResult = { sent: false, error: "Nenhuma sessão ativa conectada no WhatsAppManager" };
            }
        }

        const [abandonResult, renewalResult, recentMessages, sessions, funnelConfig] = await Promise.all([
            runPixAbandonRemarketing(),
            runRenewalReminder(),
            prisma.message.findMany({
                take: 10,
                orderBy: { timestamp: "desc" },
                select: { keyId: true, remoteJid: true, fromMe: true, content: true, status: true, timestamp: true }
            }).catch(() => []),
            prisma.session.findMany({
                select: { sessionId: true, status: true, name: true, updatedAt: true }
            }).catch(() => []),
            prisma.funnelConfig.findUnique({
                where: { id: "default" },
                select: { enabled: true, sessionId: true, siteUrl: true, step1Greeting: true }
            }).catch(() => null)
        ]);

        return NextResponse.json({
            ok: true,
            timestamp: new Date().toISOString(),
            testSendResult,
            sessions,
            funnelConfig,
            recentMessages,
            pixAbandonRemarketing: abandonResult,
            renewalReminder: renewalResult
        });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err?.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    return GET(req);
}
