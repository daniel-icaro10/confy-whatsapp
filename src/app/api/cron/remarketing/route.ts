import { NextResponse } from "next/server";
import { runPixAbandonRemarketing, runRenewalReminder } from "@/modules/whatsapp/remarketing-engine";

export async function GET() {
    try {
        const [abandonResult, renewalResult] = await Promise.all([
            runPixAbandonRemarketing(),
            runRenewalReminder()
        ]);

        return NextResponse.json({
            ok: true,
            timestamp: new Date().toISOString(),
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
