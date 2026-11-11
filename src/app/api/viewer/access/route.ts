import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPhoneVariants, normalizeBrPhone } from "@/lib/segredos-defaults";
import { auth } from "@/lib/auth";

/**
 * GET /api/viewer/access?phone=5511999999999 -> Verifica se o cliente tem acesso VIP
 * GET /api/viewer/access?list=true -> (Admin) Lista todos os assinantes e pedidos Pix
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isList = searchParams.get("list") === "true";

        if (isList) {
            const session = await auth();
            if (!session?.user) {
                return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
            }

            const [subscribers, orders] = await Promise.all([
                prisma.viewerAccess.findMany({
                    orderBy: { createdAt: "desc" }
                }),
                prisma.pixOrder.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 100
                })
            ]);

            return NextResponse.json({ subscribers, orders });
        }

        const rawPhone = searchParams.get("phone") || "";
        const variants = getPhoneVariants(rawPhone);

        if (variants.length === 0) {
            return NextResponse.json({ isVip: false, viewer: null });
        }

        const viewer = await prisma.viewerAccess.findFirst({
            where: {
                phone: { in: variants },
                isVip: true
            }
        });

        if (!viewer) {
            return NextResponse.json({
                isVip: false,
                phone: normalizeBrPhone(rawPhone),
                viewer: null
            });
        }

        // Verifica expiração se houver
        if (viewer.expiresAt && new Date(viewer.expiresAt) < new Date()) {
            return NextResponse.json({
                isVip: false,
                expired: true,
                phone: viewer.phone,
                viewer
            });
        }

        const dramaParam = (searchParams.get("dramaId") || searchParams.get("slug") || "").trim().toLowerCase();
        const rawUnlocked = (viewer as any).unlockedDramas || "";
        const isFullVip = rawUnlocked === "*" ||
            rawUnlocked.includes("*") ||
            (viewer.planName?.toLowerCase().includes("vip") && !viewer.planName?.toLowerCase().includes("individual")) ||
            viewer.planName?.toLowerCase().includes("todas") ||
            viewer.planName?.toLowerCase().includes("catálogo") ||
            viewer.planName?.toLowerCase().includes("anual");

        const unlockedList = isFullVip
            ? ["*"]
            : rawUnlocked
                .split(",")
                .map((s: string) => s.trim().toLowerCase())
                .filter(Boolean);

        // Se o viewer comprou série avulsa antes mas não tinha unlockedDramas preenchido, usa lastWatchedDramaId
        if (!isFullVip && unlockedList.length === 0 && viewer.lastWatchedDramaId) {
            unlockedList.push(viewer.lastWatchedDramaId.trim().toLowerCase());
        }

        const hasDramaAccess = isFullVip || (dramaParam ? unlockedList.includes(dramaParam) : true);

        return NextResponse.json({
            isVip: true,
            isFullVip,
            unlockedDramas: unlockedList,
            hasDramaAccess,
            phone: viewer.phone,
            viewer
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao verificar acesso", details: error?.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/viewer/access -> (Admin) Libera manualmente um número de WhatsApp como VIP
 */
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const cleanPhone = normalizeBrPhone(body.phone || "");

        if (!cleanPhone) {
            return NextResponse.json({ error: "Número de WhatsApp inválido" }, { status: 400 });
        }

        const viewer = await prisma.viewerAccess.upsert({
            where: { phone: cleanPhone },
            create: {
                phone: cleanPhone,
                name: body.name || "Assinante VIP",
                planName: body.planName || "Acesso VIP Vitalício",
                isVip: body.isVip !== false,
                notes: body.notes || "Liberado manualmente no painel"
            },
            update: {
                name: body.name || undefined,
                planName: body.planName || undefined,
                isVip: body.isVip !== false,
                notes: body.notes || undefined
            }
        });

        return NextResponse.json({ viewer });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao liberar acesso", details: error?.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
        }

        await prisma.viewerAccess.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Erro ao remover assinante", details: error?.message },
            { status: 500 }
        );
    }
}

