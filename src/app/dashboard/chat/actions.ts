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

export async function resolveTicket(sessionId: string, jid: string) {
    return await updateTicketStatus(sessionId, jid, "RESOLVED");
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

export async function getTicketActivities(sessionId: string, jid: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const activities = await TicketService.listActivities(sessionId, jid);
    return activities.map((a: any) => ({
        ...a,
        createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt)
    }));
}

export async function updateTicketPriority(
    sessionId: string,
    jid: string,
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    return await TicketService.updatePriority(sessionId, jid, priority as any);
}

export async function getContactDetails(sessionId: string, jid: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        select: { id: true }
    });
    if (!session) throw new Error("Session not found");

    const normalizedJid = jid.replace(/:\d+@/, '@');

    const contact = await prisma.contact.findFirst({
        where: {
            sessionId: session.id,
            OR: [
                { jid },
                { lid: jid },
                { remoteJidAlt: jid },
                { jid: normalizedJid }
            ]
        }
    });

    if (contact) return contact;

    // Return or create a contact entry
    return await prisma.contact.create({
        data: {
            sessionId: session.id,
            jid: normalizedJid,
            name: normalizedJid.split('@')[0]
        }
    });
}

export async function updateContactDetails(
    sessionId: string,
    jid: string,
    data: {
        name?: string;
        email?: string;
        document?: string;
        plan?: string;
        planValue?: string;
        notes?: string;
        customFields?: Record<string, any>;
    }
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

    const normalizedJid = jid.replace(/:\d+@/, '@');

    const existing = await prisma.contact.findFirst({
        where: {
            sessionId: session.id,
            OR: [
                { jid },
                { lid: jid },
                { remoteJidAlt: jid },
                { jid: normalizedJid }
            ]
        }
    });

    if (existing) {
        return await prisma.contact.update({
            where: { id: existing.id },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.email !== undefined ? { email: data.email } : {}),
                ...(data.document !== undefined ? { document: data.document } : {}),
                ...(data.plan !== undefined ? { plan: data.plan } : {}),
                ...(data.planValue !== undefined ? { planValue: data.planValue } : {}),
                ...(data.notes !== undefined ? { notes: data.notes } : {}),
                ...(data.customFields !== undefined ? { customFields: data.customFields } : {}),
            }
        });
    }

    return await prisma.contact.create({
        data: {
            sessionId: session.id,
            jid: normalizedJid,
            name: data.name || normalizedJid.split('@')[0],
            email: data.email,
            document: data.document,
            plan: data.plan,
            planValue: data.planValue,
            notes: data.notes,
        }
    });
}

export async function getAttendanceSettings(sessionId: string) {
    const user = await getAuthenticatedUserForAction();
    if (!user) throw new Error("Unauthorized");

    const canAccess = await canAccessSession(user.id, user.role, sessionId);
    if (!canAccess) throw new Error("Forbidden");

    const session = await prisma.session.findUnique({
        where: { sessionId },
        include: {
            businessHours: {
                orderBy: { dayOfWeek: "asc" }
            }
        }
    });

    if (!session) throw new Error("Session not found");

    // Default 7 days of business hours if none configured yet
    const existingDays = new Map(session.businessHours.map(b => [b.dayOfWeek, b]));
    const completeHours = [];
    for (let day = 0; day <= 6; day++) {
        if (existingDays.has(day)) {
            completeHours.push(existingDays.get(day)!);
        } else {
            // Default: Mon-Fri open 08:00 - 18:00, Sat-Sun closed
            completeHours.push({
                id: `default-${day}`,
                sessionId: session.id,
                dayOfWeek: day,
                isOpen: day >= 1 && day <= 5,
                openTime: "08:00",
                closeTime: "18:00"
            });
        }
    }

    return {
        csatEnabled: session.csatEnabled,
        csatMessage: session.csatMessage || "⭐ *Pesquisa de Satisfação*\n\nComo você avalia nosso atendimento?\n\n1️⃣ Muito insatisfeito\n2️⃣ Insatisfeito\n3️⃣ Regular\n4️⃣ Bom\n5️⃣ Excelente\n\n_Por favor, responda digitando a nota de 1 a 5._",
        businessHoursEnabled: session.businessHoursEnabled,
        outOfOfficeMessage: session.outOfOfficeMessage || "⏰ *Estamos fora do nosso horário de atendimento no momento.*\n\nRecebemos sua mensagem e responderemos assim que retornarmos nosso expediente!",
        timezone: session.timezone || "America/Sao_Paulo",
        businessHours: completeHours
    };
}

export async function updateAttendanceSettings(
    sessionId: string,
    data: {
        csatEnabled?: boolean;
        csatMessage?: string;
        businessHoursEnabled?: boolean;
        outOfOfficeMessage?: string;
        timezone?: string;
        businessHours?: Array<{
            dayOfWeek: number;
            isOpen: boolean;
            openTime: string;
            closeTime: string;
        }>;
    }
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

    // Update Session scalar fields
    await prisma.session.update({
        where: { id: session.id },
        data: {
            ...(data.csatEnabled !== undefined ? { csatEnabled: data.csatEnabled } : {}),
            ...(data.csatMessage !== undefined ? { csatMessage: data.csatMessage } : {}),
            ...(data.businessHoursEnabled !== undefined ? { businessHoursEnabled: data.businessHoursEnabled } : {}),
            ...(data.outOfOfficeMessage !== undefined ? { outOfOfficeMessage: data.outOfOfficeMessage } : {}),
            ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
        }
    });

    // Update BusinessHours if provided
    if (data.businessHours && Array.isArray(data.businessHours)) {
        for (const hour of data.businessHours) {
            await prisma.businessHour.upsert({
                where: {
                    sessionId_dayOfWeek: {
                        sessionId: session.id,
                        dayOfWeek: hour.dayOfWeek
                    }
                },
                create: {
                    sessionId: session.id,
                    dayOfWeek: hour.dayOfWeek,
                    isOpen: hour.isOpen,
                    openTime: hour.openTime,
                    closeTime: hour.closeTime
                },
                update: {
                    isOpen: hour.isOpen,
                    openTime: hour.openTime,
                    closeTime: hour.closeTime
                }
            });
        }
    }

    return { success: true };
}



