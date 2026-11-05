import { NextResponse } from "next/server";
import { runPixAbandonRemarketing, runRenewalReminder } from "@/modules/whatsapp/remarketing-engine";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
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

export async function POST() {
    return GET();
}

