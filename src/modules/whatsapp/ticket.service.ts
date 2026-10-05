import { prisma } from "@/lib/prisma";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { logger } from "@/lib/logger";
import { ChatService } from "./chat.service";

export class TicketService {
    /**
     * Resolve database cuid from string sessionId
     */
    private static async getDbSessionId(sessionId: string): Promise<string | null> {
        const session = await prisma.session.findFirst({
            where: {
                OR: [
                    { id: sessionId },
                    { sessionId: sessionId }
                ]
            },
            select: { id: true }
        });
        return session?.id || null;
    }

    /**
     * Get or create a ticket for a contact in a session
     */
    static async getOrCreateTicket(sessionId: string, jid: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) return null;

        let ticket = await prisma.ticket.findUnique({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            }
        });

        if (!ticket) {
            ticket = await prisma.ticket.create({
                data: {
                    sessionId: dbSessionId,
                    jid,
                    status: TicketStatus.OPEN,
                    openedAt: new Date()
                },
                include: {
                    assignedUser: { select: { id: true, name: true, email: true, role: true } },
                    department: { select: { id: true, name: true, colorHex: true } }
                }
            });
        }

        return ticket;
    }

    /**
     * List tickets for a session with optional filters
     */
    static async listTickets(sessionId: string, filters: {
        status?: string;
        departmentId?: string;
        assignedUserId?: string;
        unassignedOnly?: boolean;
        search?: string;
    } = {}) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) return [];

        const where: any = { sessionId: dbSessionId };

        if (filters.status && filters.status !== "ALL") {
            where.status = filters.status as TicketStatus;
        }

        if (filters.departmentId) {
            where.departmentId = filters.departmentId;
        }

        if (filters.unassignedOnly) {
            where.assignedUserId = null;
        } else if (filters.assignedUserId) {
            where.assignedUserId = filters.assignedUserId;
        }

        if (filters.search) {
            where.jid = { contains: filters.search };
        }

        return await prisma.ticket.findMany({
            where,
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            },
            orderBy: { updatedAt: "desc" }
        });
    }

    /**
     * Attendant takes a ticket (Assumir conversa)
     */
    static async assignTicket(sessionId: string, jid: string, userId: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) throw new Error("Sessão não encontrada");

        const ticket = await prisma.ticket.upsert({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            create: {
                sessionId: dbSessionId,
                jid,
                status: TicketStatus.IN_PROGRESS,
                assignedUserId: userId,
                openedAt: new Date()
            },
            update: {
                status: TicketStatus.IN_PROGRESS,
                assignedUserId: userId
            },
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            }
        });

        // Emit socket event for real-time sync across attendants
        (global as any).io?.to(sessionId).emit("ticket.updated", ticket);

        const userName = ticket.assignedUser?.name || ticket.assignedUser?.email || "Um atendente";
        this.logActivity(sessionId, ticket.id, jid, "ASSIGNED", `${userName} assumiu o atendimento`, userId).catch(() => {});

        return ticket;
    }

    /**
     * Transfer ticket to a department and/or attendant
     */
    static async transferTicket(sessionId: string, jid: string, target: {
        departmentId?: string | null;
        userId?: string | null;
    }) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) throw new Error("Sessão não encontrada");

        const updateData: any = {};
        if (target.departmentId !== undefined) {
            updateData.departmentId = target.departmentId;
        }
        if (target.userId !== undefined) {
            updateData.assignedUserId = target.userId;
            if (target.userId) {
                updateData.status = TicketStatus.IN_PROGRESS;
            } else {
                updateData.status = TicketStatus.OPEN;
            }
        }

        const ticket = await prisma.ticket.update({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            data: updateData,
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            }
        });

        (global as any).io?.to(sessionId).emit("ticket.updated", ticket);

        let transferMsg = "";
        if (ticket.department && ticket.assignedUser) {
            transferMsg = `Transferido para o setor ${ticket.department.name} (${ticket.assignedUser.name || ticket.assignedUser.email})`;
        } else if (ticket.department) {
            transferMsg = `Transferido para o setor ${ticket.department.name}`;
        } else if (ticket.assignedUser) {
            transferMsg = `Transferido para ${ticket.assignedUser.name || ticket.assignedUser.email}`;
        } else {
            transferMsg = `Atendimento movido para a fila geral`;
        }
        this.logActivity(sessionId, ticket.id, jid, "TRANSFERRED", transferMsg, target.userId || null).catch(() => {});

        return ticket;
    }

    /**
     * Update ticket status (e.g. Finalizar atendimento -> RESOLVED)
     */
    static async updateStatus(sessionId: string, jid: string, status: TicketStatus) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) throw new Error("Sessão não encontrada");

        const updateData: any = { status };
        if (status === TicketStatus.RESOLVED) {
            updateData.closedAt = new Date();
        } else if (status === TicketStatus.OPEN) {
            updateData.closedAt = null;
        }

        const ticket = await prisma.ticket.update({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            data: updateData,
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            }
        });

        if (status === TicketStatus.RESOLVED) {
            this.triggerCsatSurvey(sessionId, dbSessionId, jid, ticket.id).catch(e => {
                logger.error("TicketService", "Failed to trigger CSAT survey", e);
            });
        }

        const statusMsg = status === TicketStatus.RESOLVED ? "Atendimento finalizado" : "Atendimento reaberto";
        this.logActivity(sessionId, ticket.id, jid, "STATUS_CHANGED", statusMsg).catch(() => {});

        (global as any).io?.to(sessionId).emit("ticket.updated", ticket);
        return ticket;
    }

    /**
     * Update ticket priority (LOW, MEDIUM, HIGH, URGENT)
     */
    static async updatePriority(sessionId: string, jid: string, priority: TicketPriority) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) throw new Error("Sessão não encontrada");

        const ticket = await prisma.ticket.upsert({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            create: {
                sessionId: dbSessionId,
                jid,
                status: TicketStatus.OPEN,
                priority,
                openedAt: new Date()
            },
            update: {
                priority
            },
            include: {
                assignedUser: { select: { id: true, name: true, email: true, role: true } },
                department: { select: { id: true, name: true, colorHex: true } }
            }
        });

        const prioNames: Record<string, string> = {
            LOW: "Baixa",
            MEDIUM: "Média",
            HIGH: "Alta",
            URGENT: "Urgente"
        };
        this.logActivity(sessionId, ticket.id, jid, "PRIORITY_CHANGED", `Prioridade alterada para ${prioNames[priority] || priority}`).catch(() => {});

        (global as any).io?.to(sessionId).emit("ticket.updated", ticket);
        return ticket;
    }

    /**
     * Triggered when an incoming message is received from a customer
     */
    static async handleIncomingMessage(sessionId: string, dbSessionId: string, jid: string, text?: string) {
        try {
            const existing = await prisma.ticket.findUnique({
                where: {
                    sessionId_jid: { sessionId: dbSessionId, jid }
                }
            });

            // Check if ticket was resolved and awaiting CSAT response
            if (existing?.status === TicketStatus.RESOLVED && existing.csatRequestedAt && existing.csatScore === null) {
                const trimmed = text?.trim() || "";
                const match = trimmed.match(/^([1-5])(\D|$)/) || trimmed.match(/nota\s*([1-5])/i);
                if (match) {
                    const score = parseInt(match[1], 10);
                    const updated = await prisma.ticket.update({
                        where: { id: existing.id },
                        data: {
                            csatScore: score,
                            csatComment: trimmed.length > 2 ? trimmed : null,
                            csatAnsweredAt: new Date()
                        },
                        include: {
                            assignedUser: { select: { id: true, name: true, email: true, role: true } },
                            department: { select: { id: true, name: true, colorHex: true } }
                        }
                    });

                    (global as any).io?.to(sessionId).emit("ticket.updated", updated);
                    this.logActivity(sessionId, existing.id, jid, "CSAT_ANSWERED", `Cliente avaliou o atendimento com ⭐ ${score}/5 estrelas`).catch(() => {});

                    const thankYou = `⭐ *Obrigado pela sua avaliação!*\nRegistramos sua nota ${score}/5 com sucesso. Seu feedback é fundamental para continuarmos evoluindo nosso atendimento! 🙏`;
                    setTimeout(async () => {
                        try {
                            await ChatService.sendTextMessage(sessionId, jid, { text: thankYou });
                        } catch (e) {
                            logger.error("TicketService", "Failed to send CSAT thank you", e);
                        }
                    }, 500);

                    return; // Retorna sem reabrir o ticket!
                }
            }

            const isNewOrReopened = !existing || existing.status === TicketStatus.RESOLVED;
            let ticket;

            // Check Business Hours outside schedule notification
            if (isNewOrReopened) {
                this.checkBusinessHours(sessionId, dbSessionId, jid).catch(e => {
                    logger.error("TicketService", "Error checking business hours", e);
                });
            }

            if (!existing) {
                ticket = await prisma.ticket.create({
                    data: {
                        sessionId: dbSessionId,
                        jid,
                        status: TicketStatus.OPEN,
                        openedAt: new Date()
                    },
                    include: {
                        assignedUser: { select: { id: true, name: true, email: true, role: true } },
                        department: { select: { id: true, name: true, colorHex: true } }
                    }
                });
            } else if (existing.status === TicketStatus.RESOLVED) {
                // Customer returned after ticket was resolved -> Reopen cycle!
                ticket = await prisma.ticket.update({
                    where: { id: existing.id },
                    data: {
                        status: TicketStatus.OPEN,
                        openedAt: new Date(),
                        firstResponseAt: null,
                        firstResponseMs: null,
                        closedAt: null,
                        departmentId: null // Reset department so URA can route again
                    },
                    include: {
                        assignedUser: { select: { id: true, name: true, email: true, role: true } },
                        department: { select: { id: true, name: true, colorHex: true } }
                    }
                });
            } else {
                // Update timestamp for active ticket
                ticket = await prisma.ticket.update({
                    where: { id: existing.id },
                    data: { updatedAt: new Date() },
                    include: {
                        assignedUser: { select: { id: true, name: true, email: true, role: true } },
                        department: { select: { id: true, name: true, colorHex: true } }
                    }
                });
            }

            // URA Menu evaluation: if ticket has no department
            if (ticket && !ticket.departmentId) {
                const routed = text ? await this.evaluateUraRouting(sessionId, dbSessionId, ticket.id, jid, text.trim()) : false;

                // If not routed yet, and this is first contact (or reopened), send the welcome menu!
                if (!routed && isNewOrReopened) {
                    await this.sendUraWelcomeMenu(sessionId, dbSessionId, jid);
                }
            }

            // Re-fetch ticket to get updated department if routed
            const finalTicket = await prisma.ticket.findUnique({
                where: { id: ticket.id },
                include: {
                    assignedUser: { select: { id: true, name: true, email: true, role: true } },
                    department: { select: { id: true, name: true, colorHex: true } }
                }
            });

            (global as any).io?.to(sessionId).emit("ticket.updated", finalTicket || ticket);
        } catch (error) {
            logger.error("TicketService", "Error handling incoming message", error);
        }
    }

    // In-memory throttle for out-of-office notifications (jid -> timestamp)
    private static outOfOfficeThrottle = new Map<string, number>();

    /**
     * Send CSAT evaluation survey when ticket is resolved
     */
    private static async triggerCsatSurvey(sessionId: string, dbSessionId: string, jid: string, ticketId: string) {
        try {
            const session = await prisma.session.findUnique({
                where: { id: dbSessionId },
                select: { csatEnabled: true, csatMessage: true }
            });

            if (!session || !session.csatEnabled) return;

            const csatText = session.csatMessage?.trim() ||
                "⭐ *Pesquisa de Satisfação*\n\nComo você avalia nosso atendimento?\n\n1️⃣ Muito insatisfeito\n2️⃣ Insatisfeito\n3️⃣ Regular\n4️⃣ Bom\n5️⃣ Excelente\n\n_Por favor, responda digitando a nota de 1 a 5._";

            // Mark ticket as CSAT requested
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { csatRequestedAt: new Date() }
            });

            // Send survey after 1.5 seconds
            setTimeout(async () => {
                try {
                    await ChatService.sendTextMessage(sessionId, jid, { text: csatText });
                } catch (e) {
                    logger.error("TicketService", "Error sending CSAT survey message", e);
                }
            }, 1500);
        } catch (error) {
            logger.error("TicketService", "Error in triggerCsatSurvey", error);
        }
    }

    /**
     * Check if customer is contacting outside defined business hours
     */
    private static async checkBusinessHours(sessionId: string, dbSessionId: string, jid: string): Promise<boolean> {
        try {
            const session = await prisma.session.findUnique({
                where: { id: dbSessionId },
                include: { businessHours: true }
            });

            if (!session || !session.businessHoursEnabled || !session.businessHours || session.businessHours.length === 0) {
                return false;
            }

            const timezone = session.timezone || "America/Sao_Paulo";
            const now = new Date();

            // Time in HH:mm
            const timeInTz = now.toLocaleTimeString("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit" });

            // Day of week: 0 = Sun, 1 = Mon ...
            const dayOfWeek = new Date(now.toLocaleString("en-US", { timeZone: timezone })).getDay();

            const todaySchedule = session.businessHours.find(b => b.dayOfWeek === dayOfWeek);

            let isOutside = false;
            if (!todaySchedule || !todaySchedule.isOpen) {
                isOutside = true;
            } else if (timeInTz < todaySchedule.openTime || timeInTz > todaySchedule.closeTime) {
                isOutside = true;
            }

            if (isOutside) {
                const throttleKey = `${dbSessionId}:${jid}`;
                const lastSent = this.outOfOfficeThrottle.get(throttleKey) || 0;
                const fourHoursMs = 4 * 60 * 60 * 1000;

                if (Date.now() - lastSent > fourHoursMs) {
                    this.outOfOfficeThrottle.set(throttleKey, Date.now());
                    const msg = session.outOfOfficeMessage?.trim() ||
                        "⏰ *Estamos fora do nosso horário de atendimento no momento.*\n\nRecebemos sua mensagem e entraremos em contato assim que iniciarmos nosso expediente!";

                    setTimeout(async () => {
                        try {
                            await ChatService.sendTextMessage(sessionId, jid, { text: msg });
                        } catch (e) {
                            logger.error("TicketService", "Failed to send out-of-office message", e);
                        }
                    }, 800);
                }
                return true;
            }
        } catch (e) {
            logger.error("TicketService", "Error in checkBusinessHours", e);
        }
        return false;
    }

    /**
     * Send URA welcome menu listing available departments
     */
    private static async sendUraWelcomeMenu(sessionId: string, dbSessionId: string, jid: string) {
        try {
            const departments = await prisma.department.findMany({
                where: { sessionId: dbSessionId },
                orderBy: { createdAt: "asc" }
            });

            if (departments.length === 0) return;

            const optionsList = departments
                .map((dept, idx) => `${idx + 1}️⃣ *${dept.name}*`)
                .join("\n");

            const menuText = `👋 *Olá! Seja bem-vindo ao nosso atendimento.*\n\nPor favor, escolha uma das opções abaixo:\n\n${optionsList}\n\n_Digite o *número* da opção correspondente para falar com o setor._`;

            // Wait 500ms before sending to feel natural
            setTimeout(async () => {
                try {
                    await ChatService.sendTextMessage(sessionId, jid, { text: menuText });
                } catch (e) {
                    logger.error("TicketService", "Failed to send URA welcome menu", e);
                }
            }, 600);
        } catch (error) {
            logger.error("TicketService", "Error in sendUraWelcomeMenu", error);
        }
    }

    /**
     * Check if customer input matches a department option for automated routing
     */
    private static async evaluateUraRouting(sessionId: string, dbSessionId: string, ticketId: string, jid: string, input: string): Promise<boolean> {
        const departments = await prisma.department.findMany({
            where: { sessionId: dbSessionId },
            orderBy: { createdAt: "asc" }
        });

        if (departments.length === 0) return false;

        let matchedDept = null;

        // Check numeric index: "1", "2", "3"
        const numIndex = parseInt(input, 10);
        if (!isNaN(numIndex) && numIndex >= 1 && numIndex <= departments.length) {
            matchedDept = departments[numIndex - 1];
        } else {
            // Check by department name exact or prefix
            const lowerInput = input.toLowerCase();
            matchedDept = departments.find(d =>
                d.name.toLowerCase() === lowerInput ||
                lowerInput.includes(d.name.toLowerCase()) ||
                d.name.toLowerCase().startsWith(lowerInput)
            );
        }

        if (matchedDept) {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { departmentId: matchedDept.id }
            });

            logger.info("TicketService", `Ticket ${ticketId} routed to department ${matchedDept.name}`);

            const confirmText = `✅ *Você foi direcionado para o setor ${matchedDept.name}.*\nUm de nossos atendentes irá te atender em breve! ⏳`;
            setTimeout(async () => {
                try {
                    await ChatService.sendTextMessage(sessionId, jid, { text: confirmText });
                } catch (e) {
                    logger.error("TicketService", "Failed to send URA transfer confirmation", e);
                }
            }, 400);

            return true;
        }

        return false;
    }

    /**
     * Triggered when an attendant sends an outgoing message
     */
    static async handleOutgoingMessage(sessionId: string, dbSessionId: string, jid: string, userId?: string) {
        try {
            const ticket = await prisma.ticket.findUnique({
                where: {
                    sessionId_jid: { sessionId: dbSessionId, jid }
                }
            });

            if (!ticket) return;

            const updateData: any = { updatedAt: new Date() };

            // Calculate First Response Time (TMR) if not recorded yet
            if (!ticket.firstResponseAt && ticket.openedAt) {
                const now = new Date();
                const diffMs = Math.max(0, now.getTime() - new Date(ticket.openedAt).getTime());
                updateData.firstResponseAt = now;
                updateData.firstResponseMs = diffMs;
            }

            // Automatically move from OPEN to IN_PROGRESS when replied
            if (ticket.status === TicketStatus.OPEN) {
                updateData.status = TicketStatus.IN_PROGRESS;
                if (!ticket.assignedUserId && userId) {
                    updateData.assignedUserId = userId;
                }
            }

            const updatedTicket = await prisma.ticket.update({
                where: { id: ticket.id },
                data: updateData,
                include: {
                    assignedUser: { select: { id: true, name: true, email: true, role: true } },
                    department: { select: { id: true, name: true, colorHex: true } }
                }
            });

            (global as any).io?.to(sessionId).emit("ticket.updated", updatedTicket);
        } catch (error) {
            logger.error("TicketService", "Error handling outgoing message", error);
        }
    }

    /**
     * Get attendance metrics & reports for a session
     */
    static async getMetrics(sessionId: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) return null;

        const [tickets, departments, users] = await Promise.all([
            prisma.ticket.findMany({
                where: { sessionId: dbSessionId },
                include: {
                    assignedUser: { select: { id: true, name: true, email: true } },
                    department: { select: { id: true, name: true, colorHex: true } }
                }
            }),
            prisma.department.findMany({
                where: { sessionId: dbSessionId },
                include: {
                    _count: { select: { tickets: true, users: true } }
                }
            }),
            prisma.user.findMany({
                where: {
                    OR: [
                        { sessions: { some: { id: dbSessionId } } },
                        { sessionAccesses: { some: { sessionId: dbSessionId } } }
                    ]
                },
                select: { id: true, name: true, email: true, role: true }
            })
        ]);

        // General Counts
        const openCount = tickets.filter(t => t.status === TicketStatus.OPEN).length;
        const inProgressCount = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
        const resolvedCount = tickets.filter(t => t.status === TicketStatus.RESOLVED).length;
        const totalCount = tickets.length;

        // Average TMR calculation (Tempo Médio de Resposta)
        const ticketsWithResponse = tickets.filter(t => t.firstResponseMs && t.firstResponseMs > 0);
        const avgTmrMs = ticketsWithResponse.length > 0
            ? Math.round(ticketsWithResponse.reduce((acc, t) => acc + (t.firstResponseMs || 0), 0) / ticketsWithResponse.length)
            : 0;

        // CSAT calculation
        const ticketsWithCsat = tickets.filter(t => t.csatScore && t.csatScore > 0);
        const avgCsat = ticketsWithCsat.length > 0
            ? Number((ticketsWithCsat.reduce((acc, t) => acc + (t.csatScore || 0), 0) / ticketsWithCsat.length).toFixed(1))
            : null;

        // Attendant Ranking
        const attendantMetrics = users.map(user => {
            const userTickets = tickets.filter(t => t.assignedUserId === user.id);
            const userResolved = userTickets.filter(t => t.status === TicketStatus.RESOLVED).length;
            const userActive = userTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
            const userResponded = userTickets.filter(t => t.firstResponseMs && t.firstResponseMs > 0);
            const userAvgTmrMs = userResponded.length > 0
                ? Math.round(userResponded.reduce((acc, t) => acc + (t.firstResponseMs || 0), 0) / userResponded.length)
                : 0;
            const userCsat = userTickets.filter(t => t.csatScore && t.csatScore > 0);
            const userAvgCsat = userCsat.length > 0
                ? Number((userCsat.reduce((acc, t) => acc + (t.csatScore || 0), 0) / userCsat.length).toFixed(1))
                : null;

            return {
                id: user.id,
                name: user.name || user.email,
                email: user.email,
                role: user.role,
                assignedTotal: userTickets.length,
                resolvedCount: userResolved,
                activeCount: userActive,
                avgTmrSeconds: Math.round(userAvgTmrMs / 1000),
                avgCsat: userAvgCsat,
                csatCount: userCsat.length
            };
        }).sort((a, b) => b.resolvedCount - a.resolvedCount);

        // Department breakdown
        const departmentMetrics = departments.map(dept => {
            const deptTickets = tickets.filter(t => t.departmentId === dept.id);
            return {
                id: dept.id,
                name: dept.name,
                colorHex: dept.colorHex,
                ticketsCount: deptTickets.length,
                openCount: deptTickets.filter(t => t.status === TicketStatus.OPEN).length,
                inProgressCount: deptTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
                resolvedCount: deptTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
                attendantsCount: dept._count.users
            };
        });

        return {
            summary: {
                totalTickets: totalCount,
                openTickets: openCount,
                inProgressTickets: inProgressCount,
                resolvedTickets: resolvedCount,
                avgTmrSeconds: Math.round(avgTmrMs / 1000),
                avgTmrFormatted: this.formatDuration(avgTmrMs),
                avgCsat,
                csatCount: ticketsWithCsat.length
            },
            departments: departmentMetrics,
            attendants: attendantMetrics
        };
    }

    private static formatDuration(ms: number): string {
        if (!ms || ms <= 0) return "--";
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    /**
     * Add an internal note to a ticket
     */
    static async addNote(sessionId: string, jid: string, userId: string, content: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) throw new Error("Sessão não encontrada");

        const ticket = await this.getOrCreateTicket(sessionId, jid);
        if (!ticket) throw new Error("Ticket não encontrado");

        const note = await prisma.ticketNote.create({
            data: {
                ticketId: ticket.id,
                userId,
                content
            },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } }
            }
        });

        // Real-time emit to attendant room
        (global as any).io?.to(sessionId).emit("ticket.note_added", {
            jid,
            note
        });

        return note;
    }

    /**
     * List internal notes for a ticket
     */
    static async listNotes(sessionId: string, jid: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) return [];

        const ticket = await prisma.ticket.findUnique({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            select: { id: true }
        });

        if (!ticket) return [];

        return await prisma.ticketNote.findMany({
            where: { ticketId: ticket.id },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } }
            },
            orderBy: { createdAt: "asc" }
        });
    }

    /**
     * Record a system activity event on a ticket and broadcast it
     */
    static async logActivity(sessionId: string, ticketId: string, jid: string, type: string, content: string, userId?: string | null) {
        try {
            const activity = await prisma.ticketActivity.create({
                data: {
                    ticketId,
                    userId: userId || null,
                    type,
                    content
                },
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            });

            (global as any).io?.to(sessionId).emit("ticket.activity_added", {
                jid,
                activity
            });

            return activity;
        } catch (e) {
            logger.error("TicketService", "Error logging ticket activity", e);
        }
    }

    /**
     * List all activity events for a ticket
     */
    static async listActivities(sessionId: string, jid: string) {
        const dbSessionId = await this.getDbSessionId(sessionId);
        if (!dbSessionId) return [];

        const ticket = await prisma.ticket.findUnique({
            where: {
                sessionId_jid: { sessionId: dbSessionId, jid }
            },
            select: { id: true }
        });

        if (!ticket) return [];

        return await prisma.ticketActivity.findMany({
            where: { ticketId: ticket.id },
            include: {
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: "asc" }
        });
    }
}

