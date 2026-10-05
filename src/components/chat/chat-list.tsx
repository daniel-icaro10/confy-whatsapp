"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, Search, MessageCircle, X, Tag, MoreHorizontal, CornerUpLeft, Trash2, Info, Check, Volume2, VolumeX, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getChatsStatus } from "@/app/dashboard/chat/actions";
import { useSocket } from "./socket-context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatToWhatsAppJid } from "@/lib/phone-utils";

interface ChatContact {
    jid: string;
    name: string | null;
    notify: string | null;
    profilePic: string | null;
    unreadCount?: number;
    ticket?: {
        id: string;
        status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        assignedUser?: { id: string; name: string | null; email: string } | null;
        department?: { id: string; name: string; colorHex: string } | null;
    } | null;
    lastMessage?: {
        content: string | null;
        timestamp: string;
        type: string;
    };
}

interface LabelData {
    id: string;
    name: string;
    colorHex: string;
}

interface ChatListProps {
    sessionId: string;
    onSelectChat: (jid: string, name?: string) => void;
    selectedJid?: string;
}

const PAGE_SIZE = parseInt(process.env.NEXT_PUBLIC_CHAT_PAGE_SIZE || "50", 10);

function getDisplayName(chat: ChatContact): string {
    return chat.name || chat.notify || chat.jid.split('@')[0];
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
    IMAGE: "Imagem",
    VIDEO: "Vídeo",
    AUDIO: "Áudio",
    STICKER: "Figurinha",
    DOCUMENT: "Documento",
    LOCATION: "Localização",
    CONTACT: "Contato",
    POLL: "Enquete",
};

function getMessagePreview(chat: ChatContact): string {
    if (!chat.lastMessage?.content) return "Nenhuma mensagem ainda";
    const content = chat.lastMessage.content;
    if (chat.lastMessage.type !== "TEXT") {
        return `📎 ${MEDIA_TYPE_LABELS[chat.lastMessage.type] || chat.lastMessage.type.charAt(0) + chat.lastMessage.type.slice(1).toLowerCase()}`;
    }
    return content.length > 40 ? content.slice(0, 40) + "…" : content;
}

function getTimeLabel(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return date.toLocaleDateString("pt-BR", { weekday: 'short' });
    return date.toLocaleDateString("pt-BR", { month: 'short', day: 'numeric' });
}

// ─── Label Assignment Popover ──────
export function LabelAssignPopover({ sessionId, jid, children }: { sessionId: string; jid: string; children: React.ReactNode }) {
    const [labels, setLabels] = useState<LabelData[]>([]);
    const [assigned, setAssigned] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const openRef = useRef(false);

    const fetchLabels = useCallback(async () => {
        setLoading(true);
        try {
            const [labelRes, assignedRes] = await Promise.all([
                fetch(`/api/labels/${sessionId}`),
                fetch(`/api/labels/${sessionId}/chats?jid=${encodeURIComponent(jid)}`)
            ]);
            const labelData = await labelRes.json();
            const assignedData = await assignedRes.json();

            if (labelRes.ok) setLabels(labelData.data?.labels || []);
            if (assignedRes.ok) {
                setAssigned(new Set((assignedData.data || []).map((cl: any) => cl.labelId)));
            }
        } catch (e) {
            console.error("Failed to fetch labels", e);
        } finally {
            setLoading(false);
        }
    }, [sessionId, jid]);

    useEffect(() => {
        if (openRef.current) fetchLabels();
    }, [fetchLabels]);

    const toggleLabel = async (labelId: string) => {
        const isAssigned = assigned.has(labelId);
        try {
            const res = await fetch(`/api/labels/${sessionId}/chat/${encodeURIComponent(jid)}/labels`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ labelIds: [labelId], action: isAssigned ? "remove" : "add" })
            });
            if (res.ok) {
                setAssigned(prev => {
                    const next = new Set(prev);
                    isAssigned ? next.delete(labelId) : next.add(labelId);
                    return next;
                });
                toast.success(isAssigned ? "Etiqueta removida" : "Etiqueta atribuída");
            }
        } catch (e) {
            toast.error("Falha ao atualizar etiqueta");
        }
    };

    return (
        <Popover onOpenChange={(open) => { openRef.current = open; if (open) fetchLabels(); }}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-56 p-1.5" side="right" align="start">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Atribuir etiquetas</div>
                {loading ? (
                    <div className="flex items-center justify-center py-4"><Skeleton className="h-4 w-24" /></div>
                ) : labels.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-2 py-2">Nenhuma etiqueta. Crie uma na página Etiquetas.</p>
                ) : (
                    <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                        {labels.map(label => (
                            <button key={label.id} onClick={() => toggleLabel(label.id)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors cursor-pointer text-left">
                                <div className={cn(
                                    "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                    assigned.has(label.id) ? "border-foreground" : "border-muted-foreground/30"
                                )}>
                                    {assigned.has(label.id) && <Check className="h-2.5 w-2.5" />}
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: label.colorHex }} />
                                <span className="truncate text-xs font-medium">{label.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

// ─── Context Menu ──────────────────
interface CtxMenuState { x: number; y: number; jid: string; name: string; }
function ChatContextMenu({ state, onClose, sessionId, onSelect }: { state: CtxMenuState; onClose: () => void; sessionId: string; onSelect: (jid: string, name?: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [onClose]);

    const items = [
        { label: "Abrir conversa", icon: MessageCircle, action: () => { onSelect(state.jid, state.name); onClose(); } },
        { label: "Copiar JID", icon: Info, action: () => { navigator.clipboard.writeText(state.jid).then(() => toast.success("JID copiado!")); onClose(); } },
    ];

    const style: React.CSSProperties = { position: "fixed", top: state.y, left: state.x, zIndex: 9999 };
    if (state.x > window.innerWidth - 180) style.left = state.x - 180;
    if (state.y > window.innerHeight - 120) style.top = state.y - 120;

    return (
        <div ref={ref} style={style} className="w-44 rounded-xl bg-popover border shadow-xl py-1 animate-in fade-in zoom-in-95 origin-top-left">
            {items.map((item, i) => (
                <button key={i} onClick={item.action} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer text-foreground hover:bg-muted">
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                </button>
            ))}
        </div>
    );
}

// ─── Chat Row ──────────────────────
function ChatRow({
    chat, isSelected, onSelect, sessionId, labelDots
}: {
    chat: ChatContact; isSelected: boolean; onSelect: (jid: string, name?: string) => void; sessionId: string;
    labelDots: { colorHex: string }[];
}) {
    const displayName = getDisplayName(chat);
    const [ctxMenu, setCtxMenu] = useState<CtxMenuState | null>(null);
    const isUnread = (chat.unreadCount ?? 0) > 0;

    return (
        <>
            {ctxMenu && (
                <ChatContextMenu state={ctxMenu} onClose={() => setCtxMenu(null)} sessionId={sessionId} onSelect={onSelect} />
            )}
            <div
                className={cn(
                    "relative w-full flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 border-b border-border/10 group overflow-hidden cursor-pointer",
                    isSelected
                        ? "bg-primary/8 border-l-2 border-l-primary"
                        : (isUnread ? "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07] border-l-2 border-l-emerald-500" : "hover:bg-muted/40 border-l-2 border-l-transparent")
                )}
                onClick={() => onSelect(chat.jid, displayName)}
                onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, jid: chat.jid, name: displayName }); }}
            >
                <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={`/api/chat/${sessionId}/${encodeURIComponent(chat.jid)}/avatar`} />
                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary">
                            {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isUnread && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
                    )}
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex justify-between items-baseline gap-2 overflow-hidden">
                        <h4 className={cn("text-sm truncate flex items-center gap-1.5", 
                            isSelected ? "font-semibold text-primary" : (isUnread ? "font-bold text-foreground" : "font-medium text-foreground")
                        )}>
                            {displayName}
                            {/* Label dots — always visible */}
                            {labelDots.length > 0 && (
                                <span className="flex items-center gap-[2px] shrink-0">
                                    {labelDots.map((d, i) => (
                                        <span key={i} className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: d.colorHex }} title={d.colorHex} />
                                    ))}
                                </span>
                            )}
                        </h4>
                        {chat.lastMessage && (
                            <span className={cn(
                                "text-[10px] flex-shrink-0",
                                isUnread ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground"
                            )}>
                                {getTimeLabel(chat.lastMessage.timestamp)}
                            </span>
                        )}
                    </div>

                    {/* Middle preview line + Priority tag + WhatsApp Unread badge */}
                    <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <p className={cn(
                            "text-xs truncate flex-1",
                            isUnread ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            {getMessagePreview(chat)}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                            {chat.ticket?.priority === "URGENT" && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 font-bold border border-red-500/25 shrink-0">
                                    Urgente
                                </span>
                            )}
                            {chat.ticket?.priority === "HIGH" && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/25 shrink-0">
                                    Alta
                                </span>
                            )}
                            {isUnread && (
                                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm animate-in zoom-in-75">
                                    {(chat.unreadCount ?? 0) > 99 ? '99+' : chat.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {/* Assigned Attendant Badge */}
                        {chat.ticket?.assignedUser ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/80 text-foreground/80 font-medium flex items-center gap-1 shrink-0">
                                <User className="h-2.5 w-2.5 text-primary" />
                                <span className="truncate max-w-[90px]">{chat.ticket.assignedUser.name?.split(' ')[0] || chat.ticket.assignedUser.email.split('@')[0]}</span>
                            </span>
                        ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium shrink-0 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Não atribuído
                            </span>
                        )}

                        {/* Department Badge */}
                        {chat.ticket?.department && (
                            <span
                                className="text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 truncate max-w-[90px]"
                                style={{
                                    backgroundColor: `${chat.ticket.department.colorHex}20`,
                                    color: chat.ticket.department.colorHex
                                }}
                            >
                                {chat.ticket.department.name}
                            </span>
                        )}

                        {/* Resolved Badge */}
                        {chat.ticket?.status === "RESOLVED" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium shrink-0 flex items-center gap-0.5">
                                <Check className="h-2.5 w-2.5" />
                                Resolvido
                            </span>
                        )}
                    </div>
                </div>

                {/* Label button on hover */}
                <LabelAssignPopover sessionId={sessionId} jid={chat.jid}>
                    <Button variant="ghost" size="icon"
                        className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
                        onClick={(e) => e.stopPropagation()}>
                        <Tag className="h-3.5 w-3.5" />
                    </Button>
                </LabelAssignPopover>
            </div>
        </>
    );
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
            </div>
        </div>
    );
}

// ─── Main ──────────────────────────
export function ChatList({ sessionId, onSelectChat, selectedJid }: ChatListProps) {
    const [chats, setChats] = useState<ChatContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [newChatNumber, setNewChatNumber] = useState("");
    const [hasMore, setHasMore] = useState(true);
    // Label dots per JID — {colorHex}[]
    const { data: authSession } = useSession();
    const currentUserId = authSession?.user?.id;
    const [statusFilter, setStatusFilter] = useState<"OPEN" | "RESOLVED" | "ALL">("OPEN");
    const [triageTab, setTriageTab] = useState<"MINE" | "UNASSIGNED" | "ALL">("MINE");

    const [chatLabelMap, setChatLabelMap] = useState<Map<string, { colorHex: string }[]>>(new Map());
    const [soundEnabled, setSoundEnabled] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("confy_chat_sound") !== "false";
        }
        return true;
    });

    const selectedJidRef = useRef(selectedJid);
    selectedJidRef.current = selectedJid;

    useEffect(() => {
        if (selectedJid) {
            setChats(prev => prev.map(c => c.jid === selectedJid ? { ...c, unreadCount: 0 } : c));
        }
    }, [selectedJid]);

    const playSoundNotification = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtxClass) return;
            const audioCtx = new AudioCtxClass();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now);
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.18);

            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.1);
            gain2.gain.setValueAtTime(0.15, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.32);
        } catch (e) {
            // Audio context failed or blocked by policy
        }
    }, [soundEnabled]);

    const { getSocket, joinSession } = useSocket();
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cursorRef = useRef<string | undefined>(undefined);
    const chatsRef = useRef<ChatContact[]>(chats);
    chatsRef.current = chats;
    const fetchingRef = useRef(false);

    const fetchChats = useCallback(async (cursor?: string, append = false) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        try {
            if (!cursor) setLoading(true);
            const rawChats: any = await getChatsStatus(sessionId, PAGE_SIZE, cursor || undefined, searchQuery || undefined);
            
            const processChats = (newChatsList: ChatContact[], existingChatsList: ChatContact[] = []) => {
                const merged = new Map(existingChatsList.map(c => [c.jid, c]));
                (newChatsList || []).forEach((c: any) => {
                    const existing = merged.get(c.jid);
                    if (!existing || (c.lastMessage?.timestamp && (!existing.lastMessage?.timestamp || new Date(c.lastMessage.timestamp) > new Date(existing.lastMessage.timestamp)))) {
                        merged.set(c.jid, c);
                    }
                });
                return Array.from(merged.values());
            };

            if (append) {
                setChats(prev => processChats(rawChats, prev));
            } else {
                setChats(processChats(rawChats));
            }
            setHasMore((rawChats || []).length >= PAGE_SIZE);
        } catch (error) {
            console.error("Failed to load chats", error);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [sessionId, searchQuery]);

    useEffect(() => { setChats([]); setHasMore(true); fetchChats(); }, [fetchChats]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const onConnect = () => joinSession(sessionId);
        if (socket.connected) joinSession(sessionId);
        socket.on("connect", onConnect);

        const handler = async (newMessages: any[]) => {
            let needsReload = false;
            const hasIncoming = newMessages.some(m => !m.fromMe);
            if (hasIncoming) {
                playSoundNotification();
                if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.hidden) {
                    const first = newMessages.find(m => !m.fromMe);
                    new Notification("Nova mensagem recebida", {
                        body: first?.content || "Nova mensagem no WhatsApp",
                        icon: "/favicon.ico"
                    });
                }
            }

            setChats(prev => {
                const updated = [...prev];
                newMessages.forEach(msg => {
                    const jid = msg.remoteJid;
                    const idx = updated.findIndex(c => c.jid === jid);
                    if (idx !== -1) {
                        const isCurrent = jid === selectedJidRef.current;
                        const prevUnread = updated[idx].unreadCount || 0;
                        const newUnread = isCurrent ? 0 : (!msg.fromMe ? prevUnread + 1 : prevUnread);
                        updated[idx] = { 
                            ...updated[idx], 
                            lastMessage: { content: msg.content, timestamp: msg.timestamp, type: msg.type },
                            unreadCount: newUnread
                        };
                    } else { needsReload = true; }
                });
                updated.sort((a, b) => {
                    const tA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
                    const tB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
                    return tB - tA;
                });
                return updated;
            });
            if (needsReload) fetchChats();
        };

        const ticketHandler = (ticket: any) => {
            if (!ticket?.jid) return;
            if (ticket.status === "OPEN" && !ticket.assignedUserId) {
                playSoundNotification();
            }
            setChats(prev => {
                return prev.map(c => {
                    if (c.jid === ticket.jid) {
                        return { ...c, ticket };
                    }
                    return c;
                });
            });
        };

        socket.on("message.update", handler);
        socket.on("ticket.updated", ticketHandler);

        return () => {
            socket.off("connect", onConnect);
            socket.off("message.update", handler);
            socket.off("ticket.updated", ticketHandler);
        };
    }, [sessionId, getSocket, joinSession, fetchChats, playSoundNotification]);

    // Fetch label assignments for all chats
    useEffect(() => {
        if (!sessionId) return;
        (async () => {
            try {
                // Batch fetch all chat-label assignments in 1 call
                const res = await fetch(`/api/labels/${sessionId}/chats`);
                if (!res.ok) return;
                const data = await res.json();
                const map = new Map<string, { colorHex: string }[]>();
                for (const cl of (data.data || [])) {
                    const jid = cl.chatJid;
                    if (!map.has(jid)) map.set(jid, []);
                    map.get(jid)!.push({ colorHex: cl.colorHex });
                }
                setChatLabelMap(map);
            } catch (e) {
                console.error("Failed to load label assignments", e);
            }
        })();
    }, [sessionId]);

    const handleSearchChange = (val: string) => {
        setSearchInput(val);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setSearchQuery(val);
        }, 300);
    };

    const isChatMatchingStatus = useCallback((chat: ChatContact, status: "OPEN" | "RESOLVED" | "ALL") => {
        if (status === "OPEN") {
            return !chat.ticket || chat.ticket.status !== "RESOLVED";
        }
        if (status === "RESOLVED") {
            return chat.ticket?.status === "RESOLVED";
        }
        return true;
    }, []);

    const statusFilteredChats = useMemo(() => {
        return chats.filter(c => isChatMatchingStatus(c, statusFilter));
    }, [chats, statusFilter, isChatMatchingStatus]);

    const mineCount = useMemo(() => {
        return statusFilteredChats.filter(c => c.ticket?.assignedUser?.id === currentUserId).length;
    }, [statusFilteredChats, currentUserId]);

    const unassignedCount = useMemo(() => {
        return statusFilteredChats.filter(c => !c.ticket?.assignedUser?.id).length;
    }, [statusFilteredChats]);

    const allCount = statusFilteredChats.length;

    const filteredChats = useMemo(() => {
        let result = statusFilteredChats;

        if (triageTab === "MINE") {
            result = result.filter(c => c.ticket?.assignedUser?.id === currentUserId);
        } else if (triageTab === "UNASSIGNED") {
            result = result.filter(c => !c.ticket?.assignedUser?.id);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(chat => {
                const name = (chat.name || chat.notify || "").toLowerCase();
                const jid = chat.jid.toLowerCase();
                return name.includes(q) || jid.includes(q);
            });
        }
        return result;
    }, [statusFilteredChats, triageTab, searchQuery, currentUserId]);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loading && !searchQuery.trim()) {
            const last = chatsRef.current[chatsRef.current.length - 1];
            const c = last?.lastMessage?.timestamp;
            if (c) fetchChats(c, true);
        }
    }, [hasMore, loading, searchQuery, fetchChats]);

    const handleSelectChat = useCallback((jid: string, name?: string) => {
        setChats(prev => prev.map(c => c.jid === jid ? { ...c, unreadCount: 0 } : c));
        onSelectChat(jid, name);
    }, [onSelectChat]);

    const itemContent = useCallback(
        (_: number, chat: ChatContact) => <ChatRow key={chat.jid} chat={chat} isSelected={selectedJid === chat.jid} onSelect={handleSelectChat} sessionId={sessionId} labelDots={chatLabelMap.get(chat.jid) || []} />,
        [selectedJid, handleSelectChat, sessionId, chatLabelMap]
    );

    const handleStartNewChat = () => {
        if (!newChatNumber) return;
        const jid = formatToWhatsAppJid(newChatNumber);
        if (jid) {
            onSelectChat(jid);
            setIsNewChatOpen(false);
            setNewChatNumber("");
        } else {
            toast.error("Número de telefone inválido");
        }
    };

    if (loading && chats.length === 0) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-3 space-y-3">
                    <Skeleton className="h-9 w-full rounded-lg" />
                    {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Header */}
            <div className="shrink-0 px-3 pt-3 pb-2 space-y-2 border-b border-border/10">
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-semibold text-base text-foreground shrink-0">
                            Conversas
                        </h3>
                        {/* Status Filter Dropdown */}
                        <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                            <SelectTrigger className="h-7 text-xs font-medium bg-muted/60 hover:bg-muted border border-border/40 rounded-lg px-2 gap-1 focus:ring-0 shadow-none cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPEN" className="text-xs cursor-pointer">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>Abertas</span>
                                    </span>
                                </SelectItem>
                                <SelectItem value="RESOLVED" className="text-xs cursor-pointer">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                                        <span>Resolvidas</span>
                                    </span>
                                </SelectItem>
                                <SelectItem value="ALL" className="text-xs cursor-pointer">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Todas</span>
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                const next = !soundEnabled;
                                setSoundEnabled(next);
                                if (typeof window !== "undefined") {
                                    localStorage.setItem("confy_chat_sound", String(next));
                                }
                                if (next && typeof Notification !== "undefined" && Notification.permission === "default") {
                                    Notification.requestPermission();
                                }
                                toast.info(next ? "Sons de notificação ativados" : "Sons de notificação silenciados");
                            }}
                            title={soundEnabled ? "Silenciar notificações sonoras" : "Ativar notificações sonoras"}
                        >
                            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4 text-muted-foreground/50" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                            onClick={() => setIsNewChatOpen(!isNewChatOpen)}>
                            {isNewChatOpen ? <X className="h-4 w-4" /> : <MessageSquarePlus className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Buscar conversas..." value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="h-8 pl-8 text-sm bg-muted/50 border-0 rounded-lg focus-visible:ring-1" />
                </div>

                {/* Triaging Tabs (Chatwoot style: Minhas, Não atribuídas, Todas) */}
                <div className="flex items-center gap-1 p-0.5 bg-muted/40 rounded-lg text-xs">
                    <button
                        onClick={() => setTriageTab("MINE")}
                        className={cn(
                            "flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer",
                            triageTab === "MINE"
                                ? "bg-background text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <span>Minhas</span>
                        <span className={cn(
                            "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                            triageTab === "MINE"
                                ? "bg-primary/15 text-primary"
                                : "bg-muted-foreground/15 text-muted-foreground"
                        )}>
                            {mineCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setTriageTab("UNASSIGNED")}
                        className={cn(
                            "flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer",
                            triageTab === "UNASSIGNED"
                                ? "bg-background text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <span className="truncate">Não atribuídas</span>
                        <span className={cn(
                            "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                            unassignedCount > 0
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                : "bg-muted-foreground/15 text-muted-foreground"
                        )}>
                            {unassignedCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setTriageTab("ALL")}
                        className={cn(
                            "flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer",
                            triageTab === "ALL"
                                ? "bg-background text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <span>Todas</span>
                        <span className={cn(
                            "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                            triageTab === "ALL"
                                ? "bg-primary/15 text-primary"
                                : "bg-muted-foreground/15 text-muted-foreground"
                        )}>
                            {allCount}
                        </span>
                    </button>
                </div>

                {isNewChatOpen && (
                    <div className="p-2.5 bg-muted/30 rounded-lg space-y-2 border border-border/40">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Número de telefone</Label>
                        <div className="flex gap-1.5">
                            <Input placeholder="5511987654321" value={newChatNumber}
                                onChange={(e) => setNewChatNumber(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleStartNewChat()}
                                className="h-8 text-sm" />
                            <Button size="sm" className="h-8 px-3" onClick={handleStartNewChat}>Ir</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat list */}
            <div className="flex-1 min-h-0">
                {filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                            <MessageCircle className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">{searchQuery ? "Nenhuma conversa corresponde à sua busca" : "Nenhuma conversa ainda"}</p>
                    </div>
                ) : (
                    <Virtuoso style={{ height: "100%" }} data={filteredChats}
                        computeItemKey={(_: number, chat: ChatContact) => chat.jid} itemContent={itemContent}
                        endReached={handleEndReached} increaseViewportBy={200}
                        components={{ Footer: () => hasMore && !loading ? (
                            <div className="py-4 text-center">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Role para ver mais</span>
                            </div>
                        ) : null }} />
                )}
            </div>
        </div>
    );
}
