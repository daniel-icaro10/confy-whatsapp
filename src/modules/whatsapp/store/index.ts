import { prisma } from "@/lib/prisma";
import type { WASocket, WAMessage, Contact } from "@whiskeysockets/baileys";
import { normalizeMessageContent } from "@whiskeysockets/baileys";
import { onMessageReceived, onMessageSent, dispatchWebhook, downloadAndSaveMedia } from "@/lib/webhook";
import { handleBotCommand, setSessionStartTime } from "../bot/command-handler";
import { resolveToPhoneJid, isLidJid, normalizeJid } from "@/lib/jid-utils";
import { TicketService } from "../ticket.service";

import { Server } from "socket.io";
import { logger } from "@/lib/logger";

export const bindSessionStore = (sock: WASocket, sessionId: string, io: Server | null) => {
    // Set start time for uptime command
    setSessionStartTime(sessionId);

    // First, get the database Session ID (cuid)
    let dbSessionId: string | null = null;

    // Initialize by fetching the session ID
    (async () => {
        const session = await prisma.session.findUnique({
            where: { sessionId },
            select: { id: true }
        });
        if (session) {
            dbSessionId = session.id;
            logger.info("Store", `Message store initialized for session ${sessionId} (db: ${dbSessionId})`);
        } else {
            logger.error("Store", `Session ${sessionId} not found for message store`);
        }
    })();

    // Handle Messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        // Process all message types: notify, append, and history sync
        if (type !== 'notify' && type !== 'append') {
            // For history sync, we still want to save messages
            logger.debug("Store", `Received ${messages.length} messages of type: ${type}`);
        }

        // Emit to socket room for real-time frontend updates
        if (type === 'notify' || type === 'append') {
            io?.to(sessionId).emit('message.upsert', { messages, type });
        }

        // Ensure we have the database session ID
        if (!dbSessionId) {
            const session = await prisma.session.findUnique({ where: { sessionId }, select: { id: true } });
            if (!session) return;
            dbSessionId = session.id;
        }

        const processedMessages = [];

        // Fetch Bot Config for auto-read & welcome message
        const config = await prisma.botConfig.findUnique({
            where: { sessionId: dbSessionId }
        });

        for (const msg of messages) {
            try {
                // Auto Read Logic
                if (type === 'notify' && (config as any)?.autoRead && !msg.key.fromMe) {
                    await sock.readMessages([msg.key]);
                }

                const savedMessage = await processAndSaveMessage(msg, dbSessionId, sessionId, type === 'notify', sock, config, io);
                if (savedMessage) {
                    processedMessages.push(savedMessage);
                }

                // Execute Bot Commands (Only for Notify / New Messages)
                if (type === 'notify' && savedMessage) {
                    // Run in background, don't await strictly to not block saving
                    handleBotCommand(sock, sessionId, msg).catch(e => logger.error("Bot", "Bot Handler Error", e));
                }
            } catch (error) {
                logger.error("Store", "Error saving message", error);
            }
        }

        // Emit to socket room for real-time frontend updates
        if (processedMessages.length > 0) {
            // Serialize for frontend: convert Date to ISO string
            const serialized = processedMessages.map((m: any) => ({
                ...m,
                timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
            }));
            logger.debug("Socket", `Emitting message.update for ${serialized.length} messages in session ${sessionId}`);
            io?.to(sessionId).emit('message.update', serialized);
        }
    });

    // Handle Message History Sync (when connecting for the first time or syncing)
    sock.ev.on('messaging-history.set', async ({ messages, chats, contacts, isLatest }) => {
        logger.info("Store", `History sync: ${messages?.length || 0} messages, ${chats?.length || 0} chats, ${contacts?.length || 0} contacts, latest: ${isLatest}`);

        // Ensure we have the database session ID
        if (!dbSessionId) {
            const session = await prisma.session.findUnique({ where: { sessionId }, select: { id: true } });
            if (!session) return;
            dbSessionId = session.id;
        }

        // Save all historical messages
        if (messages && messages.length > 0) {
            logger.info("Store", `Syncing ${messages.length} historical messages...`);
            for (const msg of messages) {
                try {
                    await processAndSaveMessage(msg, dbSessionId, sessionId, false, sock, undefined, io);
                } catch (error) {
                    logger.error("Store", "Error saving historical message", error);
                }
            }
            logger.success("Store", `Finished syncing ${messages.length} historical messages`);
        }

        // If chats have unreadCount === 0 or read === true, sync them as read in DB
        if (chats && chats.length > 0) {
            for (const chat of chats) {
                if (chat.id && (chat.unreadCount === 0 || (chat as any).read === true || (typeof chat.unreadCount === 'number' && chat.unreadCount <= 0))) {
                    await prisma.message.updateMany({
                        where: {
                            sessionId: dbSessionId,
                            remoteJid: chat.id,
                            fromMe: false,
                            status: { not: 'READ' }
                        },
                        data: { status: 'READ' }
                    }).catch(() => {});
                }
            }
        }

        // Note: Contacts and Chats are synced by src/modules/whatsapp/store/contacts.ts
        // We only handle messages here to avoid P2002 Unique Constraint Race Conditions.
        logger.debug("Store", `Finished syncing messages`);
    });

    // Handle Contacts Upsert
    sock.ev.on('contacts.upsert', async (contacts) => {
        // Ensure we have the database session ID
        if (!dbSessionId) {
            const session = await prisma.session.findUnique({ where: { sessionId }, select: { id: true } });
            if (!session) return;
            dbSessionId = session.id;
        }

        for (const c of contacts) {
            try {
                if (!c.id) continue;
                await prisma.contact.upsert({
                    where: { sessionId_jid: { sessionId: dbSessionId, jid: c.id } },
                    create: {
                        sessionId: dbSessionId,
                        jid: c.id,
                        // @ts-ignore
                        lid: c.lid || undefined,
                        name: c.name || c.notify || c.verifiedName,
                        notify: c.notify,
                        // @ts-ignore
                        verifiedName: c.verifiedName,
                        profilePic: c.imgUrl || undefined,
                        data: c as any
                    },
                    update: {
                        // @ts-ignore
                        lid: c.lid || undefined,
                        name: c.name || undefined,
                        notify: c.notify || undefined,
                        // @ts-ignore
                        verifiedName: c.verifiedName || undefined,
                        profilePic: c.imgUrl || undefined,
                        data: c as any
                    }
                });

                // Dispatch webhook for contact update
                dispatchWebhook(sessionId, "contact.update", { jid: c.id, name: c.name, notify: c.notify });
            } catch (e) {
                logger.error("Store", "Error saving contact", e);
            }
        }
    });

    // Handle Message Status Updates
    sock.ev.on('messages.update', async (updates) => {
        if (!dbSessionId) return;

        const updatedMessagesForSocket: any[] = [];
        const affectedChatJids = new Set<string>();

        for (const update of updates) {
            try {
                const keyId = update.key?.id;
                if (!keyId) continue;

                // Baileys proto.WebMessageInfo.Status:
                // 0: ERROR -> FAILED
                // 1: PENDING -> PENDING
                // 2: SERVER_ACK -> SENT
                // 3: DELIVERY_ACK -> DELIVERED
                // 4: READ -> READ
                // 5: PLAYED -> READ
                let status: string = 'PENDING';
                const rawStatus = (update.update as any)?.status;

                if (typeof rawStatus === 'number') {
                    const statusMap: Record<number, string> = {
                        0: 'FAILED',
                        1: 'PENDING',
                        2: 'SENT',
                        3: 'DELIVERED',
                        4: 'READ',
                        5: 'READ', // Played
                    };
                    status = statusMap[rawStatus] || 'PENDING';
                } else if (typeof rawStatus === 'string') {
                    const upper = rawStatus.toUpperCase();
                    if (['READ', 'PLAYED'].includes(upper)) status = 'READ';
                    else if (['DELIVERY_ACK', 'DELIVERED'].includes(upper)) status = 'DELIVERED';
                    else if (['SERVER_ACK', 'SENT'].includes(upper)) status = 'SENT';
                    else if (['FAILED', 'ERROR'].includes(upper)) status = 'FAILED';
                    else status = upper;
                }

                // If receipt timestamp indicates read
                if ((update.update as any)?.receipt?.readTimestamp || (update.update as any)?.read) {
                    status = 'READ';
                }

                await prisma.message.updateMany({
                    where: { sessionId: dbSessionId, keyId },
                    data: { status: status as any }
                });

                const remoteJid = update.key?.remoteJid;
                if (remoteJid) {
                    affectedChatJids.add(remoteJid);
                }

                const existing = await prisma.message.findFirst({
                    where: { sessionId: dbSessionId, keyId }
                });

                if (existing) {
                    updatedMessagesForSocket.push({
                        ...existing,
                        timestamp: existing.timestamp instanceof Date ? existing.timestamp.toISOString() : existing.timestamp
                    });
                }

                // Dispatch webhook for message status update
                dispatchWebhook(sessionId, "message.status", {
                    keyId,
                    remoteJid,
                    status
                });
            } catch (e) {
                logger.error("Store", "Error updating message status", e);
            }
        }

        // Emit real-time message updates to frontend (so checkmarks change in real time!)
        if (updatedMessagesForSocket.length > 0) {
            io?.to(sessionId).emit("message.update", updatedMessagesForSocket);
        }

        // If any messages were marked as READ, broadcast chat.read with updated unread counts
        for (const jid of affectedChatJids) {
            try {
                const unreadCount = await prisma.message.count({
                    where: {
                        sessionId: dbSessionId,
                        remoteJid: jid,
                        fromMe: false,
                        status: { not: 'READ' }
                    }
                });
                io?.to(sessionId).emit("chat.read", { remoteJid: jid, unreadCount });
            } catch {}
        }
    });

    // Handle Message Receipt Updates (Read / Played / Delivered receipts)
    sock.ev.on('message-receipt.update', async (receipts) => {
        if (!dbSessionId) return;

        const updatedMessagesForSocket: any[] = [];
        const affectedChatJids = new Set<string>();

        for (const item of receipts) {
            try {
                const keyId = item.key?.id;
                if (!keyId) continue;

                const isRead = !!(item.receipt?.readTimestamp || (item.receipt as any)?.playedTimestamp);
                const isDelivered = !!item.receipt?.receiptTimestamp;

                const newStatus = isRead ? 'READ' : (isDelivered ? 'DELIVERED' : null);
                if (!newStatus) continue;

                await prisma.message.updateMany({
                    where: { sessionId: dbSessionId, keyId },
                    data: { status: newStatus as any }
                });

                const remoteJid = item.key?.remoteJid;
                if (remoteJid) affectedChatJids.add(remoteJid);

                const existing = await prisma.message.findFirst({
                    where: { sessionId: dbSessionId, keyId }
                });

                if (existing) {
                    updatedMessagesForSocket.push({
                        ...existing,
                        timestamp: existing.timestamp instanceof Date ? existing.timestamp.toISOString() : existing.timestamp
                    });
                }
            } catch (e) {
                logger.error("Store", "Error updating message receipt", e);
            }
        }

        if (updatedMessagesForSocket.length > 0) {
            io?.to(sessionId).emit("message.update", updatedMessagesForSocket);
        }

        for (const jid of affectedChatJids) {
            try {
                const unreadCount = await prisma.message.count({
                    where: {
                        sessionId: dbSessionId,
                        remoteJid: jid,
                        fromMe: false,
                        status: { not: 'READ' }
                    }
                });
                io?.to(sessionId).emit("chat.read", { remoteJid: jid, unreadCount });
            } catch {}
        }
    });

    // Handle Chat Updates (Synchronizes when someone visualizes the chat on WhatsApp mobile app)
    sock.ev.on('chats.update', async (updates) => {
        if (!dbSessionId) return;

        for (const update of updates) {
            try {
                const chatJid = update.id;
                if (!chatJid) continue;

                // When user reads the chat on WhatsApp phone: unreadCount is 0 or read is true
                const isMarkedRead = update.unreadCount === 0 || (update as any).read === true || (typeof update.unreadCount === 'number' && update.unreadCount <= 0);

                if (isMarkedRead) {
                    // Update all unread incoming messages for this chat in DB to READ
                    await prisma.message.updateMany({
                        where: {
                            sessionId: dbSessionId,
                            remoteJid: chatJid,
                            fromMe: false,
                            status: { not: 'READ' }
                        },
                        data: { status: 'READ' }
                    });

                    // Emit chat.read event so sidebar badge clears immediately
                    io?.to(sessionId).emit('chat.read', {
                        remoteJid: chatJid,
                        unreadCount: 0
                    });

                    // Re-emit message.update for recent messages in this chat so chat-window reflects READ in real time
                    const recentReadMessages = await prisma.message.findMany({
                        where: {
                            sessionId: dbSessionId,
                            remoteJid: chatJid
                        },
                        orderBy: { timestamp: 'desc' },
                        take: 20
                    });

                    if (recentReadMessages.length > 0) {
                        io?.to(sessionId).emit('message.update', recentReadMessages.map(m => ({
                            ...m,
                            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
                        })));
                    }
                }
            } catch (e) {
                logger.error("Store", "Error handling chats.update", e);
            }
        }
    });

    // Handle Group Updates
    sock.ev.on('groups.update', async (updates) => {
        if (!dbSessionId) return;

        for (const update of updates) {
            try {
                if (!update.id) continue;
                
                // Keep DB in sync
                const updateData: any = {};
                if (update.subject !== undefined) updateData.subject = update.subject;
                if (update.desc !== undefined) updateData.description = update.desc;
                if (update.restrict !== undefined) updateData.restrict = update.restrict;
                if (update.announce !== undefined) updateData.announce = update.announce;
                if (update.owner !== undefined) updateData.ownerJid = update.owner;
                if (update.linkedParent !== undefined) updateData.linkedParentJid = update.linkedParent;
                if (update.isCommunity !== undefined) updateData.isCommunity = update.isCommunity;

                if (Object.keys(updateData).length > 0) {
                    await prisma.group.updateMany({
                        where: { sessionId: dbSessionId, jid: update.id },
                        data: updateData
                    });
                }
                
                // Trigger webhook
                dispatchWebhook(sessionId, "group.update", {
                    jid: update.id,
                    ...update
                });
            } catch (e) {
                logger.error("Store", "Error in groups.update handling", e);
            }
        }
    });

    // Handle Group Participants Update
    sock.ev.on('group-participants.update', async (update) => {
        if (!dbSessionId || !update.id) return;

        try {
            // update.id is the group JID
            // update.participants is array of JIDs
            // update.action is 'add', 'remove', 'promote', 'demote'
            dispatchWebhook(sessionId, "group.participant", {
                jid: update.id,
                action: update.action,
                participants: update.participants
            });
            
            // To properly resync the group participants in DB, it's safer to re-fetch the entire group metadata
            // But we don't await strictly to not block the socket
            sock.groupMetadata(update.id).then(async (g) => {
                await prisma.group.updateMany({
                    where: { sessionId: dbSessionId as string, jid: update.id as string },
                    data: { participants: g.participants as any }
                });
            }).catch(e => {
                 logger.debug("Store", "Failed to refresh group participants metadata", e);
            });
        } catch (e) {
            logger.error("Store", "Error in group-participants.update handling", e);
        }
    });
};

async function processAndSaveMessage(
    msg: WAMessage,
    dbSessionId: string,
    sessionId: string,
    triggerWebhook: boolean,
    sock?: WASocket,
    config?: any,
    io?: Server | null
) {
    const keyId = msg.key.id;
    const remoteJid = msg.key.remoteJid;
    const fromMe = msg.key.fromMe;
    const pushName = msg.pushName;
    const timestamp = msg.messageTimestamp
        ? new Date((typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp : Number(msg.messageTimestamp)) * 1000)
        : new Date();

    // Filter out Protocol & Empty Messages
    if (!msg.message) return false;
    if (!keyId || !remoteJid) return false;

    // Ignore specific technical message types
    const messageKeys = Object.keys(msg.message);

    // Check for message edit/revoke protocol messages FIRST
    if (messageKeys.includes('protocolMessage')) {
        const pMessage = msg.message.protocolMessage;
        const targetKeyId = pMessage?.key?.id;

        // Message Edit (Type 14)
        if (pMessage?.type === 14 && targetKeyId) {
            const editContent = pMessage?.editedMessage;
            if (editContent) {
                // Determine new text
                const normalizedEdit = normalizeMessageContent(editContent);
                let newText = "";
                if (normalizedEdit?.conversation) newText = normalizedEdit.conversation;
                else if (normalizedEdit?.extendedTextMessage?.text) newText = normalizedEdit.extendedTextMessage.text;

                // Update DB safely
                await prisma.message.updateMany({
                    where: { sessionId: dbSessionId, keyId: targetKeyId },
                    data: { content: newText } // Note: we don't update timestamp of original
                });

                // Trigger Webhook
                if (triggerWebhook) {
                    dispatchWebhook(sessionId, "message.edited", {
                        keyId: targetKeyId,
                        newContent: newText,
                        remoteJid,
                        fromMe
                    });
                }
            }
            return null; // Stop processing as new message
        }

        // Message Revoke/Deleted (Type 0)
        if (pMessage?.type === 0 && targetKeyId) {
            // Check anti-delete config
            let antiDeleteEnabled = false;
            try {
                const s = await prisma.session.findUnique({
                    where: { sessionId },
                    select: { config: true }
                });
                antiDeleteEnabled = !!(s?.config as any)?.antiDelete;
            } catch {}

            if (antiDeleteEnabled) {
                // Anti-delete: read original, keep content, append marker
                const orig = await prisma.message.findFirst({
                    where: { sessionId: dbSessionId, keyId: targetKeyId },
                    select: { content: true }
                });
                const preserved = (orig?.content || "") + "\n\n🛡️ [Deleted by sender — preserved]";
                await prisma.message.updateMany({
                    where: { sessionId: dbSessionId, keyId: targetKeyId },
                    data: { content: preserved }
                });
                // Re-fetch & re-emit so frontend updates
                const updated = await prisma.message.findFirst({
                    where: { sessionId: dbSessionId, keyId: targetKeyId }
                });
                if (updated) {
                    io?.to(sessionId).emit("message.update", [{
                        ...updated,
                        timestamp: updated.timestamp instanceof Date ? updated.timestamp.toISOString() : updated.timestamp
                    }]);
                }
            } else {
                // Normal: mark as deleted
                await prisma.message.updateMany({
                    where: { sessionId: dbSessionId, keyId: targetKeyId },
                    data: { content: "[This message was deleted]", status: "FAILED" }
                });
            }

            // Trigger Webhook
            if (triggerWebhook) {
                dispatchWebhook(sessionId, "message.deleted", {
                    keyId: targetKeyId,
                    remoteJid,
                    fromMe
                });
            }
            return null;
        }
    }

    const ignoredTypes = [
        'protocolMessage',
        'senderKeyDistributionMessage',
        'reactionMessage', // Optional: User might want reactions, but usually "kosong" means junk
        'keepInChatMessage'
    ];

    // If message only contains ignored types, skip (since edit and revoke handled above)
    if (messageKeys.every(k => ignoredTypes.includes(k))) {
        logger.debug("Store", `Skipping technical message: ${keyId} (${messageKeys.join(', ')})`);
        return null;
    }

    // Check if message already exists to avoid duplicates
    // Baileys 'notify' event can sometimes trigger multiple times or for history
    // Baileys 'notify' event can sometimes trigger multiple times or for history
    const existingMessage = await prisma.message.findUnique({
        where: { sessionId_keyId: { sessionId: dbSessionId, keyId: keyId! } },
        select: { id: true, status: true }
    });

    if (existingMessage) {
        // Message exists! Update status if changed, but DO NOT re-trigger webhooks/bot
        if (fromMe && existingMessage.status !== 'SENT') {
            await prisma.message.update({
                where: { id: existingMessage.id },
                data: { status: 'SENT' }
            });
        }
        // Return null to indicate "Not New"
        return null;
    }

    // Debug fromMe issue (Keep this for a while)
    if (fromMe === undefined || fromMe === null) {
        logger.warn("Store", `[DEBUG] Message ${keyId} has fromMe=${fromMe}. Key:`, msg.key);
    }

    const messageContent = normalizeMessageContent(msg.message);
    let text = "";
    let messageType = "TEXT";

    // Extract content based on message type
    if (messageContent?.conversation) {
        text = messageContent.conversation;
    } else if (messageContent?.extendedTextMessage?.text) {
        text = messageContent.extendedTextMessage.text;
    } else if (messageContent?.imageMessage) {
        messageType = "IMAGE";
        text = messageContent.imageMessage.caption || "";
    } else if (messageContent?.videoMessage) {
        messageType = "VIDEO";
        text = messageContent.videoMessage.caption || "";
    } else if (messageContent?.audioMessage) {
        messageType = "AUDIO";
    } else if (messageContent?.documentMessage) {
        messageType = "DOCUMENT";
        text = messageContent.documentMessage.fileName || "";
    } else if (messageContent?.stickerMessage) {
        messageType = "STICKER";
    } else if (messageContent?.locationMessage) {
        messageType = "LOCATION";
        text = `${messageContent.locationMessage.degreesLatitude},${messageContent.locationMessage.degreesLongitude}`;
    } else if (messageContent?.contactMessage) {
        messageType = "CONTACT";
        text = messageContent.contactMessage.displayName || "";
    }

    // Determine effective participant for groups
    // Determine effective participant for groups with standard logic
    const isGroup = remoteJid.endsWith("@g.us");
    const remoteJidAlt = msg.key.remoteJidAlt; // LID/Phone JID handling
    let senderJid = fromMe ? undefined : (isGroup ? (msg.key.participant || msg.participant) : remoteJid);

    // Prefer remoteJidAlt for DMs if available (matches webhook logic)
    if (!fromMe && !isGroup && remoteJidAlt) {
        senderJid = remoteJidAlt;
    }

    // --- Normalize LID JIDs to @s.whatsapp.net ---
    let normalizedRemoteJid = remoteJid;
    if (isLidJid(remoteJid)) {
        normalizedRemoteJid = await resolveToPhoneJid(remoteJid, dbSessionId, remoteJidAlt);
    }
    if (senderJid && isLidJid(senderJid)) {
        senderJid = await resolveToPhoneJid(senderJid, dbSessionId, remoteJidAlt);
    }


    // Download Media First (to save URL to DB)
    let fileUrl: string | null = null;
    try {
        fileUrl = await downloadAndSaveMedia(msg, sessionId);
    } catch (e) {
        logger.error("Store", "Error downloading media in store", e);
    }

    // Extract contextInfo (quoted message ID)
    let quoteId: string | null = null;
    if (msg.message) {
        const msgObj = msg.message as any;
        for (const key of Object.keys(msgObj)) {
            const inner = msgObj[key];
            if (inner && typeof inner === 'object' && inner !== null && 'contextInfo' in inner) {
                const contextInfo = (inner as any).contextInfo;
                if (contextInfo?.stanzaId) {
                    quoteId = contextInfo.stanzaId;
                    break;
                }
            }
        }
    }

    try {
        let initialStatus: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" = fromMe ? "SENT" : "PENDING";
        const rawMsgStatus = (msg as any)?.status;
        if (typeof rawMsgStatus === 'number') {
            if (rawMsgStatus === 4 || rawMsgStatus === 5) initialStatus = "READ";
            else if (rawMsgStatus === 3) initialStatus = "DELIVERED";
            else if (rawMsgStatus === 2) initialStatus = "SENT";
            else if (rawMsgStatus === 0) initialStatus = "FAILED";
        } else if (typeof rawMsgStatus === 'string') {
            const s = rawMsgStatus.toUpperCase();
            if (['READ', 'PLAYED'].includes(s)) initialStatus = "READ";
            else if (['DELIVERED', 'DELIVERY_ACK'].includes(s)) initialStatus = "DELIVERED";
            else if (['SENT', 'SERVER_ACK'].includes(s)) initialStatus = "SENT";
            else if (['FAILED', 'ERROR'].includes(s)) initialStatus = "FAILED";
        }

        const newMessage = await prisma.message.create({
            data: {
                sessionId: dbSessionId,
                remoteJid: normalizeJid(normalizedRemoteJid),
                senderJid,
                fromMe: fromMe || false,
                keyId,
                pushName,
                type: messageType as any,
                content: text,
                mediaUrl: fileUrl, // Save Media URL
                status: initialStatus,
                timestamp,
                quoteId
            }
        });
        
        // Ensure contact exists (Upsert Contact)
        const finalRemoteJid = normalizeJid(normalizedRemoteJid);
        if (remoteJid && !remoteJid.includes('@g.us') && !remoteJid.includes('status@broadcast')) {
            const contactJid = finalRemoteJid; // Use fully normalized JID
            const contactData: any = {
                sessionId: dbSessionId,
                jid: contactJid
            };

            // Only update name/notify if message is FROM the contact (not from me)
            if (!fromMe) {
                if (pushName) contactData.notify = pushName;
                if (pushName) contactData.name = pushName;
            }

            const contact = await prisma.contact.upsert({
                where: { sessionId_jid: { sessionId: dbSessionId, jid: contactJid } },
                create: {
                    sessionId: dbSessionId,
                    jid: contactJid,
                    notify: !fromMe ? pushName : undefined,
                    name: !fromMe ? pushName : undefined,
                    // @ts-ignore
                    remoteJidAlt: remoteJidAlt || undefined
                },
                update: !fromMe ? {
                    notify: pushName,
                    // @ts-ignore
                    remoteJidAlt: remoteJidAlt || undefined
                } : {}
            });

            // Welcome Message Logic
            if (!fromMe && triggerWebhook && config?.welcomeMessage && sock) {
                // Let's check if message count for this contact is exactly 1 (the one we just saved)
                const msgCount = await prisma.message.count({
                    where: { sessionId: dbSessionId, remoteJid: finalRemoteJid }
                });

                if (msgCount === 1) {
                    logger.info("Store", `Sending welcome message to ${finalRemoteJid}`);
                    await sock.sendMessage(finalRemoteJid, { text: config.welcomeMessage });
                }
            }
        }

        // Customer Service Ticket Lifecycle (Queue, TMR, Department Routing)
        if (triggerWebhook && remoteJid && !remoteJid.includes('@g.us') && !remoteJid.includes('status@broadcast')) {
            const normalizedTargetJid = normalizeJid(normalizedRemoteJid);
            if (!fromMe) {
                TicketService.handleIncomingMessage(sessionId, dbSessionId, normalizedTargetJid, text).catch((e: any) =>
                    logger.error("Store", "Error updating ticket for incoming message", e)
                );
            } else {
                TicketService.handleOutgoingMessage(sessionId, dbSessionId, normalizedTargetJid).catch((e: any) =>
                    logger.error("Store", "Error updating ticket for outgoing message", e)
                );
            }
        }

        // Trigger webhook for new messages only (not history sync)
        if (triggerWebhook) {
            if (fromMe) {
                onMessageSent(sessionId, msg, fileUrl).catch(e => logger.error("Webhook", "Error in onMessageSent", e));
            } else {
                onMessageReceived(sessionId, msg, fileUrl).catch(e => logger.error("Webhook", "Error in onMessageReceived", e));
            }
        }

        return newMessage;
    } catch (e: any) {
        logger.error("Store", "Error saving message query", e);
        throw e;
    }
}
// Placeholder - verified that I need to find the logic first
