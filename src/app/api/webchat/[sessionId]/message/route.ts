import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiReply } from "@/lib/ai-agent";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const url = new URL(request.url);
        const visitorId = url.searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json({ status: false, message: "visitorId obrigatório" }, { status: 400 });
        }

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada" }, { status: 404 });
        }

        const jid = `webchat_${visitorId}@webchat`;

        const messages = await prisma.message.findMany({
            where: {
                sessionId: session.id,
                remoteJid: jid
            },
            orderBy: { timestamp: "asc" },
            take: 50
        });

        return NextResponse.json({
            status: true,
            data: messages.map((m) => ({
                id: m.id,
                sender: m.fromMe ? "attendant" : "visitor",
                text: m.content || "",
                timestamp: m.timestamp
            }))
        });
    } catch (error: any) {
        console.error("Erro ao buscar histórico do webchat:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const body = await request.json();
        const { visitorId, visitorName, visitorEmail, message } = body;

        if (!visitorId || !message) {
            return NextResponse.json({ status: false, message: "visitorId e message são obrigatórios" }, { status: 400 });
        }

        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada" }, { status: 404 });
        }

        const jid = `webchat_${visitorId}@webchat`;

        // 1. Ensure Contact exists
        const contact = await prisma.contact.upsert({
            where: {
                sessionId_jid: {
                    sessionId: session.id,
                    jid
                }
            },
            update: {
                name: visitorName || undefined,
                email: visitorEmail || undefined
            },
            create: {
                sessionId: session.id,
                jid,
                name: visitorName || `Visitante Web #${visitorId.slice(0, 5)}`,
                notify: visitorName || "Visitante do Site",
                email: visitorEmail || null
            }
        });

        // 2. Save visitor message
        const userMsg = await prisma.message.create({
            data: {
                sessionId: session.id,
                remoteJid: jid,
                keyId: `web_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                fromMe: false,
                content: message,
                type: "TEXT",
                status: "READ",
                contactId: contact.id,
                timestamp: new Date()
            }
        });

        // 3. Ensure Ticket exists in Open status
        await prisma.ticket.upsert({
            where: {
                sessionId_jid: {
                    sessionId: session.id,
                    jid
                }
            },
            update: {
                status: "OPEN",
                updatedAt: new Date()
            },
            create: {
                sessionId: session.id,
                jid,
                status: "OPEN",
                priority: "MEDIUM"
            }
        });

        // 4. Try AI auto-reply if enabled
        let aiReplyText: string | null = null;
        try {
            const aiResult = await generateAiReply({
                sessionId,
                userMessage: message
            });

            if (aiResult?.reply) {
                aiReplyText = aiResult.reply;

                // Save AI message to DB
                await prisma.message.create({
                    data: {
                        sessionId: session.id,
                        remoteJid: jid,
                        keyId: `ai_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                        fromMe: true,
                        content: aiReplyText,
                        type: "TEXT",
                        status: "SENT",
                        contactId: contact.id,
                        timestamp: new Date()
                    }
                });
            }
        } catch {
            // AI is not configured or disabled, message stays in human attendant queue
        }

        return NextResponse.json({
            status: true,
            data: {
                userMessageId: userMsg.id,
                aiReply: aiReplyText
            }
        });
    } catch (error: any) {
        console.error("Erro no envio do webchat:", error);
        return NextResponse.json({ status: false, message: error.message || "Erro interno" }, { status: 500 });
    }
}
