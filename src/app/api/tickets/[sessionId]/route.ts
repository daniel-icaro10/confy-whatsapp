import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { TicketService } from "@/modules/whatsapp/ticket.service";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status") || undefined;
        const departmentId = searchParams.get("departmentId") || undefined;
        const assignedUserId = searchParams.get("assignedUserId") || undefined;
        const unassignedOnly = searchParams.get("unassigned") === "true";
        const search = searchParams.get("search") || undefined;

        const tickets = await TicketService.listTickets(sessionId, {
            status,
            departmentId,
            assignedUserId,
            unassignedOnly,
            search
        });

        return NextResponse.json({ status: true, data: tickets });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const body = await request.json();
        const { action, jid, departmentId, userId, status } = body;

        if (!jid) {
            return NextResponse.json({ status: false, message: "JID é obrigatório" }, { status: 400 });
        }

        let result;
        if (action === "assign") {
            result = await TicketService.assignTicket(sessionId, jid, userId || user.id);
        } else if (action === "transfer") {
            result = await TicketService.transferTicket(sessionId, jid, { departmentId, userId });
        } else if (action === "status") {
            result = await TicketService.updateStatus(sessionId, jid, status);
        } else {
            return NextResponse.json({ status: false, message: "Ação inválida" }, { status: 400 });
        }

        return NextResponse.json({ status: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 400 });
    }
}
