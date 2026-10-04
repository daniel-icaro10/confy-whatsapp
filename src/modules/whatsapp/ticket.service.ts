import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

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

            let ticket;
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
                        closedAt: null
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

            // URA Menu evaluation: if ticket has no department and customer typed 1, 2, 3...
            if (ticket && !ticket.departmentId && text) {
                await this.evaluateUraRouting(sessionId, dbSessionId, ticket.id, text.trim());
            }

            (global as any).io?.to(sessionId).emit("ticket.updated", ticket);
        } catch (error) {
            logger.error("TicketService", "Error handling incoming message", error);
        }
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
     * Check if customer input matches a department option for automated routing
     */
    private static async evaluateUraRouting(sessionId: string, dbSessionId: string, ticketId: string, input: string) {
        const departments = await prisma.department.findMany({
            where: { sessionId: dbSessionId },
            orderBy: { createdAt: "asc" }
        });

        if (departments.length === 0) return;

        let matchedDept = null;

        // Check numeric index: "1", "2", "3"
        const numIndex = parseInt(input, 10);
        if (!isNaN(numIndex) && numIndex >= 1 && numIndex <= departments.length) {
            matchedDept = departments[numIndex - 1];
        } else {
            // Check by department name exact or prefix
            const lowerInput = input.toLowerCase();
            matchedDept = departments.find(d => d.name.toLowerCase() === lowerInput || d.name.toLowerCase().startsWith(lowerInput));
        }

        if (matchedDept) {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { departmentId: matchedDept.id }
            });
            logger.info("TicketService", `Ticket ${ticketId} routed to department ${matchedDept.name}`);
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

        // Attendant Ranking
        const attendantMetrics = users.map(user => {
            const userTickets = tickets.filter(t => t.assignedUserId === user.id);
            const userResolved = userTickets.filter(t => t.status === TicketStatus.RESOLVED).length;
            const userActive = userTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
            const userResponded = userTickets.filter(t => t.firstResponseMs && t.firstResponseMs > 0);
            const userAvgTmrMs = userResponded.length > 0
                ? Math.round(userResponded.reduce((acc, t) => acc + (t.firstResponseMs || 0), 0) / userResponded.length)
                : 0;

            return {
                id: user.id,
                name: user.name || user.email,
                email: user.email,
                role: user.role,
                assignedTotal: userTickets.length,
                resolvedCount: userResolved,
                activeCount: userActive,
                avgTmrSeconds: Math.round(userAvgTmrMs / 1000)
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
                avgTmrFormatted: this.formatDuration(avgTmrMs)
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
}
