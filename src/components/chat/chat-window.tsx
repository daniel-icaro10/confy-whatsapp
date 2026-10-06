"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Send, Paperclip, ArrowLeft, FileText, Image as ImageIcon, Music, Video,
    Download, ArrowDown, CornerUpLeft, Copy, Trash2, Info, X,
    UserCheck, ArrowRightLeft, CheckCircle2, RotateCcw, Zap, Tag, Lock,
    PanelRight, User, AlertCircle, Star, Check, CheckCheck, Clock
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
    getChatMessages,
    sendChatMessage,
    sendMediaMessage,
    getTicketDetails,
    assignTicketToMe,
    transferTicket,
    updateTicketStatus,
    getTransferOptions,
    getQuickReplies,
    addTicketNote,
    getTicketNotes,
    getTicketActivities
} from "@/app/dashboard/chat/actions";
import { useSocket } from "./socket-context";
import { LabelAssignPopover } from "./chat-list";
import { ChatSidebarPanel } from "./chat-sidebar-panel";

interface Message {
    id: string;
    keyId: string;
    content: string;
    fromMe: boolean;
    timestamp: string;
    type: string;
    status: string;
    pushName?: string;
    mediaUrl?: string;
    remoteJid?: string;
    quoteId?: string | null;
    quoted?: {
        keyId: string;
        content: string | null;
        fromMe: boolean;
        senderJid: string | null;
        pushName: string | null;
    } | null;
}

interface ChatWindowProps {
    sessionId: string;
    jid: string;
    name?: string;
    onBack?: () => void;
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

const PAGE_LIMIT = 50;

// ─── Lazy media (unchanged) ────────
function LazyMedia({ src, alt }: { src: string; alt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "200px" });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className="mb-1.5 overflow-hidden rounded-xl">
            {visible ? <img src={src} alt={alt} className={`max-w-full max-h-60 object-cover rounded-xl transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} loading="lazy" />
                : <div className="h-40 bg-muted/30 rounded-xl animate-pulse" />}
        </div>
    );
}
function LazyVideo({ src }: { src: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "200px" });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className="mb-1.5 overflow-hidden rounded-xl">
            {visible ? <video src={src} controls className="max-w-full max-h-60 rounded-xl" preload="none" />
                : <div className="h-32 bg-muted/30 rounded-xl animate-pulse flex items-center justify-center"><Video className="h-6 w-6 text-muted-foreground/50" /></div>}
        </div>
    );
}

function useDateLabel() {
    const cache = useRef(new Map<string, string>());
    return (timestamp: string): string => {
        const cached = cache.current.get(timestamp);
        if (cached) return cached;
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        let label: string;
        if (diffDays === 0) label = "Hoje";
        else if (diffDays === 1) label = "Ontem";
        else label = date.toLocaleDateString("pt-BR", { year: 'numeric', month: 'long', day: 'numeric' });
        cache.current.set(timestamp, label);
        return label;
    };
}

function handleDownload(url: string, fileName: string) {
    toast.info("Baixando...");
    fetch(url).then(res => { if (!res.ok) throw new Error(); return res.blob(); }).then(blob => {
        const dlUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = dlUrl; link.download = fileName;
        document.body.appendChild(link);
        link.click(); link.remove();
        window.URL.revokeObjectURL(dlUrl);
    }).catch(() => toast.error("Falha ao baixar!"));
}

// ─── Context Menu ──────────────────
interface ContextMenuState {
    x: number;
    y: number;
    msg: Message;
}
function ContextMenu({ state, onClose, onReply, onDelete }: { state: ContextMenuState; onClose: () => void; onReply: (msg: Message) => void; onDelete: (msg: Message) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const items = [
        { label: "Responder", icon: CornerUpLeft, action: () => { onReply(state.msg); onClose(); } },
        { label: "Copiar", icon: Copy, action: () => { navigator.clipboard.writeText(state.msg.content || "").then(() => toast.success("Copiado!")).catch(() => {}); onClose(); } },
        { label: "Excluir", icon: Trash2, action: () => { onDelete(state.msg); onClose(); }, dangerous: true },
        { label: "Informações", icon: Info, action: () => { toast.info(`ID: ${state.msg.keyId}\nStatus: ${state.msg.status}\nHorário: ${new Date(state.msg.timestamp).toLocaleString("pt-BR")}`); onClose(); } },
    ];

    // Adjust position to not overflow viewport
    const style: React.CSSProperties = { position: "fixed", top: state.y, left: state.x, zIndex: 9999 };
    if (state.x > window.innerWidth - 180) style.left = state.x - 180;
    if (state.y > window.innerHeight - 200) style.top = state.y - 180;

    return (
        <div ref={ref} style={style} className="w-44 rounded-xl bg-popover border shadow-xl py-1 animate-in fade-in zoom-in-95 origin-top-left">
            {items.map((item, i) => (
                <button key={i} onClick={item.action} className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer",
                    item.dangerous ? "text-red-500 hover:bg-red-500/10" : "text-foreground hover:bg-muted"
                )}>
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                </button>
            ))}
        </div>
    );
}

// ─── Main Component ─────────────────
export function ChatWindow({ sessionId, jid, name, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [uploadType, setUploadType] = useState<string>("image");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [oldestTimestamp, setOldestTimestamp] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [newMsgBadge, setNewMsgBadge] = useState(false);

    // Delete confirmation
    const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<Message | null>(null);

    // Reply state
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    // Context menu state
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Auth & Attendant session info
    const { data: authSession } = useSession();

    // Ticket & Customer Service state
    const [ticket, setTicket] = useState<any>(null);
    const [transferOpen, setTransferOpen] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferOptions, setTransferOptions] = useState<{ departments: any[]; attendants: any[]; currentUserId: string } | null>(null);
    const [targetDeptId, setTargetDeptId] = useState<string>("none");
    const [targetUserId, setTargetUserId] = useState<string>("none");

    // Quick replies state
    const [quickReplies, setQuickReplies] = useState<any[]>([]);
    const [quickReplyOpen, setQuickReplyOpen] = useState(false);
    const [quickReplySearch, setQuickReplySearch] = useState("");

    // Internal Notes state
    const [notes, setNotes] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [inputMode, setInputMode] = useState<"message" | "note">("message");
    const [showRightPanel, setShowRightPanel] = useState(true);

    // Attendant Signature state
    const [useSignature, setUseSignature] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("confy_use_signature") === "true";
        }
        return false;
    });

    const toggleSignature = () => {
        const next = !useSignature;
        setUseSignature(next);
        if (typeof window !== "undefined") {
            localStorage.setItem("confy_use_signature", String(next));
        }
        toast.info(next ? "Assinatura do atendente ativada" : "Assinatura do atendente desativada");
    };

    const { getSocket, joinSession } = useSocket();
    const getDateLabel = useDateLabel();

    // Fetch Ticket details, Quick Replies, Internal Notes, and Activities
    useEffect(() => {
        let mounted = true;
        setActivities([]);
        setNotes([]);

        getTicketDetails(sessionId, jid).then(t => {
            if (mounted) setTicket(t);
        }).catch(console.error);

        getQuickReplies(sessionId).then(qr => {
            if (mounted) setQuickReplies(qr || []);
        }).catch(console.error);

        getTicketNotes(sessionId, jid).then(n => {
            if (mounted) setNotes(n || []);
        }).catch(console.error);

        getTicketActivities(sessionId, jid).then(act => {
            if (mounted) setActivities(act || []);
        }).catch(console.error);

        return () => { mounted = false; };
    }, [sessionId, jid]);

    // Real-time Ticket updates, Notes & Activities
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const handler = (updatedTicket: any) => {
            if (updatedTicket?.jid === jid) {
                setTicket(updatedTicket);
            }
        };
        const noteHandler = (data: any) => {
            if (data?.jid === jid && data?.note) {
                setNotes(prev => {
                    if (prev.some(n => n.id === data.note.id)) return prev;
                    return [...prev, data.note];
                });
            }
        };
        const activityHandler = (data: any) => {
            if (data?.jid === jid && data?.activity) {
                setActivities(prev => {
                    if (prev.some(a => a.id === data.activity.id)) return prev;
                    return [...prev, data.activity];
                });
            }
        };

        socket.on("ticket.updated", handler);
        socket.on("ticket.note_added", noteHandler);
        socket.on("ticket.activity_added", activityHandler);
        return () => {
            socket.off("ticket.updated", handler);
            socket.off("ticket.note_added", noteHandler);
            socket.off("ticket.activity_added", activityHandler);
        };
    }, [jid, getSocket]);

    const handleAssignToMe = async () => {
        try {
            const updated = await assignTicketToMe(sessionId, jid);
            setTicket(updated);
            toast.success("Você assumiu este atendimento!");
        } catch (e: any) {
            toast.error(e.message || "Falha ao assumir atendimento");
        }
    };

    const handleOpenTransfer = async () => {
        try {
            const options = await getTransferOptions(sessionId);
            setTransferOptions(options);
            setTargetDeptId(ticket?.departmentId || "none");
            setTargetUserId(ticket?.assignedUserId || "none");
            setTransferOpen(true);
        } catch (e: any) {
            toast.error("Falha ao carregar opções de transferência");
        }
    };

    const handleConfirmTransfer = async () => {
        setTransferLoading(true);
        try {
            const deptId = targetDeptId === "none" ? null : targetDeptId;
            const userId = targetUserId === "none" ? null : targetUserId;
            const updated = await transferTicket(sessionId, jid, { departmentId: deptId, userId });
            setTicket(updated);
            setTransferOpen(false);
            toast.success("Atendimento transferido com sucesso!");
        } catch (e: any) {
            toast.error(e.message || "Falha ao transferir");
        } finally {
            setTransferLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const newStatus = ticket?.status === "RESOLVED" ? "IN_PROGRESS" : "RESOLVED";
            const updated = await updateTicketStatus(sessionId, jid, newStatus);
            setTicket(updated);
            if (newStatus === "RESOLVED") {
                toast.success("Atendimento finalizado!");
            } else {
                toast.success("Atendimento reaberto!");
            }
        } catch (e: any) {
            toast.error(e.message || "Falha ao alterar status");
        }
    };

    const handleSelectQuickReply = (qr: any) => {
        setInput(prev => {
            const match = prev.match(/\/([a-zA-Z0-9_\-]*)$/);
            if (match) {
                return prev.substring(0, match.index) + qr.content;
            }
            return prev ? `${prev} ${qr.content}` : qr.content;
        });
        setQuickReplyOpen(false);
        inputRef.current?.focus();
    };

    const slashMatch = input.match(/\/([a-zA-Z0-9_\-]*)$/);
    const slashQuery = slashMatch ? slashMatch[1].toLowerCase() : null;
    const matchingQuickReplies = slashQuery !== null
        ? quickReplies.filter(qr => qr.shortcut.toLowerCase().includes(slashQuery) || qr.title.toLowerCase().includes(slashQuery))
        : [];

    const scrollToBottom = useCallback((smooth = true) => {
        bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    }, []);

    const fetchMessages = useCallback(async (before?: string) => {
        try {
            if (!before) setLoading(true);
            else setLoadingMore(true);
            const data: any = await getChatMessages(sessionId, jid, PAGE_LIMIT, before);
            if (!before) { setMessages(data.messages || []); setAutoScroll(true); }
            else if (data.messages?.length > 0) setMessages(prev => [...(data.messages || []), ...prev]);
            setHasMore(data.hasMore);
            if (data.messages?.length > 0) setOldestTimestamp(data.messages[0].timestamp);
        } catch (e) { console.error("Failed to load messages", e); }
        finally { setLoading(false); setLoadingMore(false); }
    }, [sessionId, jid]);

    useEffect(() => { 
        setMessages([]); 
        setOldestTimestamp(null); 
        setHasMore(false); 
        fetchMessages(); 
        if (sessionId && jid) {
            fetch(`/api/chat/${sessionId}/${encodeURIComponent(jid)}/read`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            }).catch(() => {});
        }
    }, [fetchMessages, sessionId, jid]);

    // Auto focus input when chat changes and finished loading
    useEffect(() => {
        if (!loading && inputRef.current) {
            // A tiny delay ensures React has fully flushed the DOM for the new chat
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [jid, loading]);

    // Socket real-time
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const onConnect = () => joinSession(sessionId);
        if (socket.connected) joinSession(sessionId);
        socket.on("connect", onConnect);
        const normalizedJid = jid.endsWith("@c.us") ? jid.replace("@c.us", "@s.whatsapp.net") : jid;
        const handler = (newMessages: Message[]) => {
            setMessages(prev => {
                const relevant = newMessages.filter(m => m.remoteJid === normalizedJid || prev.some(p => p.remoteJid === m.remoteJid));
                if (relevant.length === 0) return prev;
                const combined = [...prev, ...relevant];
                const unique = Array.from(new Map(combined.map(m => [m.keyId, m])).values());
                return unique.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            });
        };
        const onChatRead = (data: { remoteJid: string }) => {
            if (data?.remoteJid === normalizedJid || data?.remoteJid === jid) {
                setMessages(prev => prev.map(m => (!m.fromMe && m.status !== "READ" ? { ...m, status: "READ" } : m)));
            }
        };
        socket.on("message.update", handler);
        socket.on("chat.read", onChatRead);
        return () => { 
            socket.off("connect", onConnect); 
            socket.off("message.update", handler); 
            socket.off("chat.read", onChatRead);
        };
    }, [sessionId, jid, getSocket, joinSession]);

    useEffect(() => { if (autoScroll) scrollToBottom(false); }, [messages, autoScroll, scrollToBottom]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        setAutoScroll(atBottom);
        if (atBottom) setNewMsgBadge(false);
        if (el.scrollTop < 100 && hasMore && !loadingMore && oldestTimestamp) {
            const prevHeight = el.scrollHeight;
            fetchMessages(oldestTimestamp).then(() => {
                requestAnimationFrame(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevHeight; });
            });
        }
    }, [hasMore, loadingMore, oldestTimestamp, fetchMessages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        if (inputMode === "note") {
            const noteText = input.trim();
            setInput("");
            try {
                const newNote = await addTicketNote(sessionId, jid, noteText);
                setNotes(prev => [...prev, newNote]);
                toast.success("Nota interna salva com sucesso!");
                scrollToBottom(true);
            } catch (e: any) {
                toast.error(e.message || "Falha ao salvar nota interna");
            }
            return;
        }

        try {
            await sendChatMessage(sessionId, jid, input, replyingTo?.keyId, useSignature);
            setInput("");
            setReplyingTo(null);
            setTimeout(() => fetchMessages(), 800);
        } catch (e: any) { toast.error(e.message || "Falha ao enviar"); }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // Focus input when replying
    useEffect(() => {
        if (replyingTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingTo]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Escape: cancel reply
            if (e.key === "Escape" && replyingTo) {
                e.preventDefault();
                setReplyingTo(null);
                return;
            }
            // ? : show shortcuts
            if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                toast.success("Atalhos", {
                    description: "Enter: Enviar\nShift+Enter: Nova linha\nEsc: Cancelar resposta\n?: Mostrar esta ajuda"
                });
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [replyingTo]);

    const processFileUpload = async (file: File, explicitType?: string) => {
        const formData = new FormData();
        formData.append("file", file);
        let type = explicitType;
        if (!type || type === '*') {
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';
            else type = 'document';
        }
        formData.append("type", type);
        formData.append("sessionId", sessionId);
        formData.append("jid", jid);
        try {
            toast.info(`Enviando ${file.name}...`);
            await sendMediaMessage(formData);
            toast.success("Enviado!");
            setTimeout(() => fetchMessages(), 800);
        } catch (error: any) { toast.error(error.message || "Falha ao enviar mídia"); }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFileUpload(file, uploadType);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const triggerUpload = (type: string) => {
        setUploadType(type);
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'image' ? "image/*" : type === 'video' ? "video/*" : type === 'audio' ? "audio/*" : "*/*";
            fileInputRef.current.click();
        }
    };

    // Right-click handler
    const handleContextMenu = useCallback((e: React.MouseEvent, msg: Message) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, msg });
    }, []);

    const timelineItems = useMemo(() => {
        const items: Array<
            | { kind: "message"; data: Message; time: number }
            | { kind: "note"; data: any; time: number }
            | { kind: "activity"; data: any; time: number }
        > = [];
        messages.forEach(m => items.push({ kind: "message", data: m, time: new Date(m.timestamp).getTime() }));
        notes.forEach(n => items.push({ kind: "note", data: n, time: new Date(n.createdAt).getTime() }));
        activities.forEach(a => items.push({ kind: "activity", data: a, time: new Date(a.createdAt).getTime() }));
        items.sort((a, b) => a.time - b.time);
        return items;
    }, [messages, notes, activities]);

    const displayName = name || jid.split('@')[0];

    // Loading is now handled gracefully inside the message list to prevent unmounting the layout

    return (
        <div
            className="flex-1 flex flex-row bg-muted/20 min-w-0 min-h-0 relative overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) processFileUpload(f);
            }}
        >
            <div className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden h-full">
            {/* Context menu */}
            {contextMenu && (
                <ContextMenu
                    state={contextMenu}
                    onClose={() => setContextMenu(null)}
                    onReply={(msg) => { setReplyingTo(msg); scrollToBottom(true); }}
                    onDelete={(msg) => {
                        setDeleteConfirmMsg(msg);
                    }}
                />
            )}

            {/* Drag overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary flex items-center justify-center flex-col gap-3 rounded-lg m-2">
                    <Paperclip className="h-8 w-8 text-primary" />
                    <p className="text-lg font-semibold text-primary">Solte os arquivos aqui</p>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={!!deleteConfirmMsg} onOpenChange={(open) => { if (!open) setDeleteConfirmMsg(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir mensagem?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A mensagem será excluída para todos. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                const msg = deleteConfirmMsg;
                                if (!msg) return;
                                fetch(`/api/messages/${sessionId}/${jid}/${msg.keyId}`, { method: "DELETE" })
                                    .then(() => { setMessages(p => p.filter(m => m.keyId !== msg.keyId)); toast.success("Mensagem excluída"); })
                                    .catch(() => toast.error("Falha ao excluir"));
                                setDeleteConfirmMsg(null);
                            }}
                        >Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Loading older indicator */}
            {loadingMore && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border text-xs flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Carregando mensagens anteriores...
                </div>
            )}

            {/* Header */}
            <div className="shrink-0 px-3 py-2 border-b border-border/20 bg-background/95 backdrop-blur-sm flex items-center justify-between gap-2 sm:gap-3 z-10">
                <div 
                    className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowRightPanel(prev => !prev)}
                    title="Ver detalhes e CRM do contato"
                >
                    {onBack && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 md:hidden shrink-0 text-muted-foreground hover:text-foreground" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onBack();
                            }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={`/api/chat/${sessionId}/${encodeURIComponent(jid)}/avatar`} />
                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary">
                            {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-semibold text-foreground truncate">{displayName}</h3>
                            {/* Status Badge */}
                            {ticket?.status === "IN_PROGRESS" ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium shrink-0 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    {ticket.assignedUser?.name?.split(' ')[0] || "Em atendimento"}
                                </span>
                            ) : ticket?.status === "RESOLVED" ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                                    Resolvido
                                </span>
                            ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium shrink-0">
                                    Na fila
                                </span>
                            )}
                            {/* Department Badge */}
                            {ticket?.department && (
                                <span
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                                    style={{
                                        backgroundColor: `${ticket.department.colorHex}20`,
                                        color: ticket.department.colorHex
                                    }}
                                >
                                    {ticket.department.name}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{jid}</p>
                    </div>
                </div>

                {/* Customer Service Header Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    {/* Assumir atendimento */}
                    {ticket?.status !== "RESOLVED" && (
                        <Button
                            variant={ticket?.status === "OPEN" ? "default" : "outline"}
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1 rounded-lg"
                            onClick={handleAssignToMe}
                            title="Assumir esta conversa"
                        >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Assumir</span>
                        </Button>
                    )}

                    {/* Transferir */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1 rounded-lg"
                        onClick={handleOpenTransfer}
                        title="Transferir para setor ou atendente"
                    >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Transferir</span>
                    </Button>

                    {/* Finalizar / Reabrir */}
                    <Button
                        variant={ticket?.status === "RESOLVED" ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                            "h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1 rounded-lg",
                            ticket?.status !== "RESOLVED" && "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                        )}
                        onClick={handleToggleStatus}
                        title={ticket?.status === "RESOLVED" ? "Reabrir atendimento" : "Finalizar atendimento"}
                    >
                        {ticket?.status === "RESOLVED" ? (
                            <>
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Reabrir</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Finalizar</span>
                            </>
                        )}
                    </Button>

                    {/* Etiquetas */}
                    <LabelAssignPopover sessionId={sessionId} jid={jid}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1 rounded-lg"
                            title="Gerenciar etiquetas desta conversa"
                        >
                            <Tag className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Etiquetas</span>
                        </Button>
                    </LabelAssignPopover>

                    {/* Painel Lateral / Mini-CRM */}
                    <Button
                        variant={showRightPanel ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1.5 rounded-lg transition-colors",
                            showRightPanel && "bg-primary text-primary-foreground shadow-xs"
                        )}
                        onClick={() => setShowRightPanel(prev => !prev)}
                        title={showRightPanel ? "Recolher painel de contato" : "Exibir dados do contato e mini-CRM"}
                    >
                        <PanelRight className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Contato</span>
                    </Button>
                </div>
            </div>

            {/* Transfer Dialog */}
            <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Transferir atendimento</DialogTitle>
                        <DialogDescription>
                            Transfira esta conversa para outro setor da empresa ou diretamente para outro colega atendente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Setor de destino</label>
                            <Select value={targetDeptId} onValueChange={setTargetDeptId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um setor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sem setor definido</SelectItem>
                                    {transferOptions?.departments.map(d => (
                                        <SelectItem key={d.id} value={d.id}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Atendente responsável</label>
                            <Select value={targetUserId} onValueChange={setTargetUserId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um atendente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum (Deixar na fila aberta do setor)</SelectItem>
                                    {transferOptions?.attendants.map(a => (
                                        <SelectItem key={a.id} value={a.id}>
                                            {a.name || a.email} {a.id === transferOptions.currentUserId ? "(Você)" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTransferOpen(false)}>Cancelar</Button>
                        <Button onClick={handleConfirmTransfer} disabled={transferLoading}>
                            {transferLoading ? "Transferindo..." : "Confirmar transferência"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Messages Container with WhatsApp Web Doodle Wallpaper */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 py-3 min-h-0 styled-scrollbar whatsapp-chat-wallpaper" onScroll={handleScroll}>
                <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                    {loading && messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center py-32">
                            <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    )}
                    {!hasMore && timelineItems.length > 0 && (
                        <div className="text-center py-4">
                            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full border border-border/30">Início da conversa</span>
                        </div>
                    )}
                    {timelineItems.length === 0 && !loading && (
                        <div className="flex-1 flex items-center justify-center py-16"><p className="text-sm text-muted-foreground">Nenhuma mensagem ainda</p></div>
                    )}
                    {timelineItems.map((item, idx) => {
                        const itemTimeStr = item.kind === "message" ? item.data.timestamp : item.data.createdAt;
                        const prevTimeStr = idx > 0 
                            ? (timelineItems[idx - 1].kind === "message" ? (timelineItems[idx - 1].data as Message).timestamp : (timelineItems[idx - 1].data as any).createdAt)
                            : null;
                        const showDate = idx === 0 || (prevTimeStr ? getDateLabel(itemTimeStr) !== getDateLabel(prevTimeStr) : true);

                        if (item.kind === "activity") {
                            const act = item.data;
                            return (
                                <div key={`activity-${act.id}`} className="my-2.5 flex flex-col items-center">
                                    {showDate && (
                                        <div className="flex justify-center mb-2.5">
                                            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs border border-border/30">
                                                {getDateLabel(act.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/80 hover:bg-muted border border-border/50 text-xs text-muted-foreground shadow-xs max-w-[90%] sm:max-w-md text-center transition-colors">
                                        {act.type === "ASSIGNED" && <UserCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                                        {act.type === "TRANSFERRED" && <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-500 shrink-0" />}
                                        {act.type === "STATUS_CHANGED" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                        {act.type === "PRIORITY_CHANGED" && <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                        {act.type === "CSAT_ANSWERED" && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                                        {!["ASSIGNED", "TRANSFERRED", "STATUS_CHANGED", "PRIORITY_CHANGED", "CSAT_ANSWERED"].includes(act.type) && (
                                            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                                        )}
                                        <span className="text-foreground/90 font-medium">{act.content}</span>
                                        <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-1">
                                            {new Date(act.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            );
                        }

                        if (item.kind === "note") {
                            const note = item.data;
                            return (
                                <div key={`note-${note.id}`} className="my-2">
                                    {showDate && (
                                        <div className="flex justify-center my-3">
                                            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-border/30">
                                                {getDateLabel(note.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mx-auto max-w-lg w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs shadow-xs space-y-1.5 animate-in fade-in-50">
                                        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                                            <div className="flex items-center gap-1.5">
                                                <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                <span>Nota Interna</span>
                                                <span className="text-muted-foreground font-normal">• {note.user?.name || "Atendente"}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-normal">
                                                {new Date(note.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                        <p className="text-foreground whitespace-pre-wrap leading-relaxed select-text">{note.content}</p>
                                        <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block italic">
                                            Visível apenas internamente para a equipe (não enviada ao cliente)
                                        </span>
                                    </div>
                                </div>
                            );
                        }

                        const msg = item.data;
                        return (
                            <div key={msg.keyId} id={`msg-${msg.keyId}`}>
                                {showDate && (
                                    <div className="flex justify-center my-3">
                                        <span className="text-[10px] font-semibold text-[#8696a0] bg-[#182229]/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-xs border border-white/[0.06]">
                                            {getDateLabel(msg.timestamp)}
                                        </span>
                                    </div>
                                )}
                                <div className={cn("flex gap-1 group", msg.fromMe ? "justify-end" : "justify-start")}>
                                    {/* Reply button: my msg on left */}
                                    {msg.fromMe && (
                                        <button onClick={() => { setReplyingTo(msg); scrollToBottom(true); }}
                                            className="self-center p-1.5 text-muted-foreground/40 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 order-first"
                                            title="Responder">
                                            <CornerUpLeft className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    <div className={cn(
                                        "flex flex-col max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 shadow-xs overflow-hidden cursor-context-menu relative select-text",
                                        msg.fromMe 
                                            ? "bg-[#005c4b] text-[#e9edef] rounded-tr-xs" 
                                            : "bg-[#202c33] text-[#e9edef] border border-white/[0.05] rounded-tl-xs"
                                    )} onContextMenu={(e) => handleContextMenu(e, msg)}>
                                        {!msg.fromMe && jid.endsWith("@g.us") && msg.pushName && (
                                            <span className="text-[10px] font-semibold text-primary block mb-0.5">{msg.pushName}</span>
                                        )}
                                        {msg.quoted && (
                                            <div 
                                                className={cn(
                                                    "mb-1.5 px-2 py-1 rounded-lg border-l-4 text-xs select-none cursor-pointer text-left",
                                                    msg.fromMe 
                                                        ? "border-emerald-300 bg-black/20 text-[#e9edef]/90 hover:bg-black/25" 
                                                        : "border-[#00a884] bg-black/20 text-[#e9edef]/90 hover:bg-black/25"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const target = document.getElementById(`msg-${msg.quoted?.keyId}`);
                                                    if (target) {
                                                        target.scrollIntoView({ behavior: "smooth", block: "center" });
                                                        target.classList.add("bg-primary/10", "transition-colors", "duration-500");
                                                        setTimeout(() => {
                                                            target.classList.remove("bg-primary/10");
                                                        }, 1500);
                                                    } else {
                                                        toast.info("A mensagem original não está carregada na tela");
                                                    }
                                                }}
                                            >
                                                <span className="font-semibold block text-[10px]">
                                                    {msg.quoted.fromMe ? "Você" : (msg.quoted.pushName || msg.quoted.senderJid?.split('@')[0] || "Contato")}
                                                </span>
                                                <span className="line-clamp-2 block break-all text-xs">
                                                    {msg.quoted.content || "Mídia"}
                                                </span>
                                            </div>
                                        )}
                                        {/* IMAGE */}
                                        {msg.type === 'IMAGE' && msg.mediaUrl && (
                                            <div className="relative group/media">
                                                <LazyMedia src={msg.mediaUrl} alt="Imagem" />
                                                <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                                                    onClick={() => handleDownload(msg.mediaUrl!, `IMAGE-${msg.keyId}.jpg`)}><Download className="h-4 w-4" /></Button>
                                            </div>
                                        )}
                                        {/* VIDEO */}
                                        {msg.type === 'VIDEO' && msg.mediaUrl && (
                                            <div className="relative group/media">
                                                <LazyVideo src={msg.mediaUrl} />
                                                <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10"
                                                    onClick={() => handleDownload(msg.mediaUrl!, `VIDEO-${msg.keyId}.mp4`)}><Download className="h-4 w-4" /></Button>
                                            </div>
                                        )}
                                        {/* AUDIO */}
                                        {msg.type === 'AUDIO' && msg.mediaUrl && (
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <audio src={msg.mediaUrl} controls className="h-8 max-w-[200px]" preload="none" />
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => handleDownload(msg.mediaUrl!, `AUDIO-${msg.keyId}.mp3`)}><Download className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        )}
                                        {/* STICKER */}
                                        {msg.type === 'STICKER' && msg.mediaUrl && (
                                            <div className="relative group/media mb-1">
                                                <img src={msg.mediaUrl} alt="Figurinha" className="max-h-32 object-contain rounded-lg" loading="lazy" />
                                                <Button size="icon" variant="secondary" className="absolute -top-1 -right-1 h-6 w-6 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                                                    onClick={() => handleDownload(msg.mediaUrl!, `STICKER-${msg.keyId}.webp`)}><Download className="h-3 w-3" /></Button>
                                            </div>
                                        )}
                                        {/* DOCUMENT */}
                                        {msg.type !== 'TEXT' && msg.type !== 'IMAGE' && msg.type !== 'STICKER' && msg.type !== 'VIDEO' && msg.type !== 'AUDIO' && (
                                            <div className={cn("flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg mb-1", msg.fromMe ? "bg-white/15" : "bg-muted/50")}>
                                                <div className="flex items-center gap-2 truncate min-w-0">
                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="text-xs font-medium truncate">{MEDIA_TYPE_LABELS[msg.type] || `Mensagem ${msg.type}`}</span>
                                                </div>
                                                {msg.mediaUrl && <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full shrink-0" onClick={() => handleDownload(msg.mediaUrl!, `${msg.type}-${msg.keyId}`)}><Download className="h-3.5 w-3.5" /></Button>}
                                            </div>
                                        )}
                                        {/* Text and Timestamp */}
                                        <div className="flex items-end justify-between gap-3">
                                            <span className="flex-1 text-sm break-all whitespace-pre-wrap leading-relaxed">{msg.content}</span>
                                            <div className="flex items-center gap-1 shrink-0 self-end select-none pt-0.5">
                                                <span className="text-[10px] text-[#8696a0] leading-none">
                                                    {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.fromMe && (
                                                    <span className="inline-flex items-center ml-0.5">
                                                        {msg.status === "READ" ? (
                                                            <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                                                        ) : msg.status === "DELIVERED" ? (
                                                            <CheckCheck className="h-3.5 w-3.5 text-[#8696a0]" />
                                                        ) : msg.status === "SENT" ? (
                                                            <Check className="h-3.5 w-3.5 text-[#8696a0]" />
                                                        ) : (
                                                            <Clock className="h-3 w-3 text-[#8696a0]" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Reply button: other msg on right */}
                                    {!msg.fromMe && (
                                        <button onClick={() => { setReplyingTo(msg); scrollToBottom(true); }}
                                            className="self-center p-1.5 text-muted-foreground/40 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                                            title="Responder">
                                            <CornerUpLeft className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* New message badge */}
            {newMsgBadge && (
                <button onClick={() => { scrollToBottom(true); setNewMsgBadge(false); }}
                    className="absolute bottom-[90px] right-6 z-20 flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all animate-bounce">
                    <ArrowDown className="h-4 w-4" /> Novas mensagens
                </button>
            )}

            {/* Input */}
            <div className="shrink-0 px-3 py-2 bg-background/95 backdrop-blur-sm border-t border-border/20 space-y-1.5">
                {/* Mode Switcher & Tools Bar */}
                <div className="flex items-center justify-between max-w-3xl mx-auto px-1">
                    <div className="flex items-center gap-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setInputMode(prev => prev === "note" ? "message" : "note")}
                            className={cn(
                                "px-2.5 py-1 rounded-md font-medium transition-all text-xs flex items-center gap-1.5 cursor-pointer border",
                                inputMode === "note" 
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-xs font-semibold" 
                                    : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                            title="Alternar para nota interna visível apenas para a equipe"
                        >
                            <Lock className={cn("h-3 w-3", inputMode === "note" ? "text-amber-500" : "text-muted-foreground")} />
                            <span>Nota Interna</span>
                            {inputMode === "note" && (
                                <span className="text-[9px] px-1 rounded bg-amber-500 text-white font-bold">ATIVA</span>
                            )}
                        </button>
                    </div>

                    {inputMode === "message" ? (
                        <button
                            type="button"
                            onClick={toggleSignature}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors border cursor-pointer",
                                useSignature
                                    ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                                    : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                            title="Ao ativar, cada mensagem enviada começará com seu nome (Ex: *Lucas:* Olá...)"
                        >
                            <span>✍️ Assinatura</span>
                            <span className={cn("text-[9px] px-1 rounded font-bold", useSignature ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                {useSignature ? "ON" : "OFF"}
                            </span>
                        </button>
                    ) : (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Visível apenas internamente
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    {inputMode === "message" && (
                        <>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-foreground"><Paperclip className="h-4.5 w-4.5" /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-44 p-1.5" side="top" align="start">
                                    <div className="flex flex-col gap-0.5">
                                        <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-xs" onClick={() => triggerUpload('image')}><ImageIcon className="h-3.5 w-3.5 text-blue-500" /> Imagem</Button>
                                        <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-xs" onClick={() => triggerUpload('video')}><Video className="h-3.5 w-3.5 text-purple-500" /> Vídeo</Button>
                                        <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-xs" onClick={() => triggerUpload('audio')}><Music className="h-3.5 w-3.5 text-orange-500" /> Áudio</Button>
                                        <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-xs" onClick={() => triggerUpload('document')}><FileText className="h-3.5 w-3.5 text-emerald-500" /> Documento</Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Quick Replies Button */}
                            <Popover open={quickReplyOpen} onOpenChange={setQuickReplyOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full shrink-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                                        title="Respostas rápidas (atalho: digite / na mensagem)"
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-2 shadow-xl" side="top" align="start">
                                    <div className="flex items-center justify-between px-1.5 py-1 mb-1 border-b pb-1.5">
                                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                                            Respostas Rápidas
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">atalho: /</span>
                                    </div>
                                    <Input
                                        placeholder="Filtrar por atalho..."
                                        value={quickReplySearch}
                                        onChange={(e) => setQuickReplySearch(e.target.value)}
                                        className="h-7 text-xs mb-2 bg-muted/40"
                                    />
                                    <div className="max-h-52 overflow-y-auto space-y-1">
                                        {quickReplies
                                            .filter(qr => qr.shortcut.toLowerCase().includes(quickReplySearch.toLowerCase()) || qr.title.toLowerCase().includes(quickReplySearch.toLowerCase()))
                                            .map(qr => (
                                                <button
                                                    key={qr.id}
                                                    onClick={() => handleSelectQuickReply(qr)}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-muted/70 transition-colors flex flex-col gap-0.5 cursor-pointer border border-transparent hover:border-border/60"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-foreground">{qr.title}</span>
                                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">/{qr.shortcut}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-2">{qr.content}</p>
                                                </button>
                                            ))}
                                        {quickReplies.length === 0 && (
                                            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma resposta cadastrada ainda.</p>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    )}

                    <div className="flex-1 relative">
                        {/* Slash autocomplete floating bar */}
                        {inputMode === "message" && slashQuery !== null && matchingQuickReplies.length > 0 && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl space-y-1 z-30 animate-in slide-in-from-bottom-2">
                                <div className="text-[10px] font-semibold text-muted-foreground px-1.5 flex items-center justify-between">
                                    <span>Respostas Rápidas Sugeridas:</span>
                                    <span>Pressione Tab para inserir</span>
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-0.5">
                                    {matchingQuickReplies.slice(0, 5).map(qr => (
                                        <button
                                            key={qr.id}
                                            onClick={() => handleSelectQuickReply(qr)}
                                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">/{qr.shortcut}</span>
                                                <span className="text-muted-foreground truncate">{qr.title}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground/60 group-hover:text-foreground shrink-0 font-medium">Inserir</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reply preview bar */}
                        {inputMode === "message" && replyingTo && (
                            <div className="mb-2 flex items-start gap-2 px-2 py-1.5 rounded-lg bg-muted/50 border-l-2 border-amber-500 text-xs animate-in slide-in-from-bottom-1 overflow-hidden">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <span className="font-semibold text-amber-500 block text-[10px]">Respondendo a {replyingTo.fromMe ? "você" : (replyingTo.pushName || jid.split('@')[0])}</span>
                                    <span className="text-muted-foreground truncate block w-full">{replyingTo.content || `[${MEDIA_TYPE_LABELS[replyingTo.type] || replyingTo.type}]`}</span>
                                </div>
                                <button onClick={() => setReplyingTo(null)} className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"><X className="h-3 w-3" /></button>
                            </div>
                        )}
                        <div className={cn(
                            "flex items-end gap-2 p-1 rounded-2xl border transition-colors",
                            inputMode === "note" 
                                ? "border-amber-500/50 bg-amber-500/5 focus-within:ring-1 focus-within:ring-amber-500" 
                                : "border-border/30 bg-background"
                        )}>
                            <textarea ref={inputRef} value={input} onChange={(e) => { setInput(e.target.value); const el = e.target; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
                                onKeyDown={(e) => {
                                    if (inputMode === "message" && e.key === "Tab" && slashQuery !== null && matchingQuickReplies.length > 0) {
                                        e.preventDefault();
                                        handleSelectQuickReply(matchingQuickReplies[0]);
                                        return;
                                    }
                                    handleKeyDown(e);
                                }}
                                placeholder={inputMode === "note" ? "Escrever nota interna privada (apenas a equipe verá, não vai para o WhatsApp)..." : "Digite uma mensagem... (ou digite / para respostas rápidas)"}
                                rows={1} style={{ minHeight: "36px", maxHeight: "120px" }}
                                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none leading-normal" />
                        </div>
                    </div>

                    {inputMode === "note" ? (
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="h-9 px-3 rounded-full shrink-0 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm cursor-pointer"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            <span>Salvar Nota</span>
                        </Button>
                    ) : (
                        <Button onClick={handleSend} disabled={!input.trim()} size="icon" className="h-9 w-9 rounded-full shrink-0 cursor-pointer">
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            </div>

            {/* Right-Side Panel: Mini-CRM & Conversation Actions (Chatwoot style) */}
            {showRightPanel && (
                <ChatSidebarPanel
                    sessionId={sessionId}
                    jid={jid}
                    ticket={ticket}
                    transferOptions={transferOptions || { departments: [], attendants: [] }}
                    onClose={() => setShowRightPanel(false)}
                    onTicketUpdated={(updated) => setTicket(updated)}
                />
            )}
        </div>
    );
}
