"use server";

import { prisma } from "@/lib/prisma";
import { ChatService } from "@/modules/whatsapp/chat.service";
import { TicketService } from "@/modules/whatsapp/ticket.service";
import { getAuthenticatedUserForAction } from "@/lib/server-action-auth";
import { canAccessSession } from "@/lib/api-auth";

const CHAT_PAGE_SIZE = parseInt(process.env.NEXT_PUBLIC_CHAT_PAGE_SIZE || "50", 10);

// Fetch chat list with cursor-based pagination & search
export async function getChatsStatus(
    sessionId: string,
    limit = CHAT_PAGE_SIZE,
    before?: string,
    search?: string
) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true }
    });

    if (!session) throw new Error("Session not found");

    return await ChatService.getChatsList(session.id, limit, before, search);
}

// Fetch messages for a specific chat with cursor pagination
export async function getChatMessages(
    sessionId: string,
    jid: string,
    limit = 50,
    before?: string
) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true }
    });

    if (!session) throw new Error("Session not found");

    const { messages, hasMore } = await ChatService.getMessages(session.id, jid, limit, before);

    return {
        messages: messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date
                ? msg.timestamp.toISOString()
                : String(msg.timestamp)
        })),
        hasMore
    };
}

// Send a basic text message
export async function sendChatMessage(sessionId: string, jid: string, text: string, quotedMessageId?: string, withSignature = false) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    try {
        let finalMessage = text;
        if (withSignature) {
            const senderName = user.name || "Atendente";
            finalMessage = `*${senderName}:*\n${text}`;
        }

        await ChatService.sendTextMessage(sessionId, jid, { text: finalMessage }, undefined, quotedMessageId);

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });
        if (session) {
            TicketService.handleOutgoingMessage(sessionId, session.id, jid, user.id).catch(console.error);
        }

        return { success: true };
    } catch (error: any) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
}

// Upload and Send Media
export async function sendMediaMessage(formData: FormData) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const sessionId = formData.get("sessionId") as string;
    const jid = formData.get("jid") as string;
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const caption = formData.get("caption") as string || "";

    if (!sessionId || !jid || !file || !type) {
        throw new Error("Missing required fields");
    }

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        await ChatService.sendMediaMessage(
            sessionId,
            jid,
            buffer,
            type,
            file.type,
            file.name,
            caption
        );

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });
        if (session) {
            TicketService.handleOutgoingMessage(sessionId, session.id, jid, user.id).catch(console.error);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Media send error:", error);
        throw new Error(`Failed to send media: ${error.message}`);
    }
}

// ─── Customer Service Actions ───────────────────────────────────

export async function getTicketDetails(sessionId: string, jid: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.getOrCreateTicket(sessionId, jid);
}

export async function assignTicketToMe(sessionId: string, jid: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.assignTicket(sessionId, jid, user.id);
}

export async function transferTicket(sessionId: string, jid: string, target: { departmentId?: string | null; userId?: string | null }) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.transferTicket(sessionId, jid, target);
}

export async function updateTicketStatus(sessionId: string, jid: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED") {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.updateStatus(sessionId, jid, status as any);
}

export async function getTransferOptions(sessionId: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true, userId: true }
    });
    if (!session) throw new Error("Session not found");

    const [departments, attendants] = await Promise.all([
        prisma.department.findMany({
            where: { sessionId: session.id },
            select: { id: true, name: true, colorHex: true },
            orderBy: { name: "asc" }
        }),
        prisma.user.findMany({
            where: {
                OR: [
                    { id: session.userId },
                    { sessionAccesses: { some: { sessionId: session.id } } },
                    { role: "SUPERADMIN" }
                ]
            },
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" }
        })
    ]);

    return { departments, attendants, currentUserId: user.id };
}

export async function getQuickReplies(sessionId: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true }
    });
    if (!session) return [];

    return await prisma.quickReply.findMany({
        where: { sessionId: session.id },
        orderBy: { shortcut: "asc" }
    });
}

export async function addTicketNote(sessionId: string, jid: string, content: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.addNote(sessionId, jid, user.id, content);
}

export async function getTicketNotes(sessionId: string, jid: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.listNotes(sessionId, jid);
}


