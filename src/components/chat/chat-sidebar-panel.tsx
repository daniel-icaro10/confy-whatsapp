"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    X,
    User,
    Mail,
    Phone,
    Building2,
    MapPin,
    Edit3,
    Copy,
    Check,
    Tag,
    Star,
    MessageSquare,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Minus,
    Plus,
    Trash2,
    Link as LinkIcon,
    Sparkles,
    Briefcase,
    Info,
    CheckCircle2,
    Zap,
    Twitter,
    Linkedin,
    Github,
    Instagram,
    UserCheck,
    UserX,
    Wrench,
    Headphones,
    Users
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    getContactDetails,
    updateContactDetails,
    updateTicketPriority,
    transferTicket,
    assignTicketToMe,
    resolveTicket
} from "@/app/dashboard/chat/actions";
import { LabelAssignPopover } from "./chat-list";

interface ChatSidebarPanelProps {
    sessionId: string;
    jid: string;
    ticket: any;
    transferOptions: {
        departments: Array<{ id: string; name: string; colorHex: string }>;
        attendants: Array<{ id: string; name: string | null; email: string }>;
        currentUserId?: string;
    };
    onClose: () => void;
    onTicketUpdated?: (ticket: any) => void;
}

interface ContactData {
    id: string;
    name: string | null;
    email: string | null;
    document: string | null;
    plan: string | null;
    planValue: string | null;
    notes: string | null;
    profilePic: string | null;
    notify: string | null;
    verifiedName: string | null;
    jid: string;
    customFields?: {
        company?: string;
        location?: string;
        bio?: string;
    } | null;
}

interface LabelData {
    id: string;
    name: string;
    colorHex: string;
}

/**
 * Signal Bars Component matching Chatwoot's priority indicator
 */
function PriorityBars({ priority }: { priority: string }) {
    const bars = priority === "URGENT" ? 4 : priority === "HIGH" ? 3 : priority === "MEDIUM" ? 2 : 1;
    const color = priority === "URGENT" 
        ? "bg-rose-500" 
        : priority === "HIGH" 
            ? "bg-amber-500" 
            : priority === "MEDIUM" 
                ? "bg-blue-400" 
                : "bg-emerald-500";

    return (
        <div className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0" title={`Prioridade ${priority}`}>
            <span className={cn("w-[2.5px] rounded-full transition-all", bars >= 1 ? color : "bg-[#2a3942]", "h-1.5")} />
            <span className={cn("w-[2.5px] rounded-full transition-all", bars >= 2 ? color : "bg-[#2a3942]", "h-2.5")} />
            <span className={cn("w-[2.5px] rounded-full transition-all", bars >= 3 ? color : "bg-[#2a3942]", "h-3.5")} />
            <span className={cn("w-[2.5px] rounded-full transition-all", bars >= 4 ? color : "bg-[#2a3942]", "h-4")} />
        </div>
    );
}

export function ChatSidebarPanel({
    sessionId,
    jid,
    ticket,
    transferOptions,
    onClose,
    onTicketUpdated
}: ChatSidebarPanelProps) {
    const [contact, setContact] = useState<ContactData | null>(null);
    const [loadingContact, setLoadingContact] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Collapsible sections state
    const [isActionsOpen, setIsActionsOpen] = useState(true);
    const [isMacrosOpen, setIsMacrosOpen] = useState(false);
    const [isCrmOpen, setIsCrmOpen] = useState(true);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        document: "",
        plan: "",
        planValue: "",
        notes: "",
        company: "",
        location: "",
        bio: ""
    });
    const [savingContact, setSavingContact] = useState(false);

    // Labels
    const [assignedLabels, setAssignedLabels] = useState<LabelData[]>([]);
    const [loadingLabels, setLoadingLabels] = useState(false);

    // Load contact details
    const loadContact = useCallback(async () => {
        setLoadingContact(true);
        try {
            const data: any = await getContactDetails(sessionId, jid);
            setContact(data);
            if (data) {
                const custom = data.customFields || {};
                setEditForm({
                    name: data.name || "",
                    email: data.email || "",
                    document: data.document || "",
                    plan: data.plan || "",
                    planValue: data.planValue || "",
                    notes: data.notes || "",
                    company: custom.company || "",
                    location: custom.location || "",
                    bio: custom.bio || ""
                });
            }
        } catch (error) {
            console.error("Failed to load contact details", error);
        } finally {
            setLoadingContact(false);
        }
    }, [sessionId, jid]);

    // Load conversation labels
    const loadLabels = useCallback(async () => {
        setLoadingLabels(true);
        try {
            const [allLabelsRes, assignedRes] = await Promise.all([
                fetch(`/api/labels/${sessionId}`),
                fetch(`/api/labels/${sessionId}/chats?jid=${encodeURIComponent(jid)}`)
            ]);
            const allData = await allLabelsRes.json();
            const assignedData = await assignedRes.json();

            if (allData.status && assignedData.status) {
                const assignedIds = new Set((assignedData.data || []).map((cl: any) => cl.labelId));
                const filtered = (allData.data || []).filter((l: any) => assignedIds.has(l.id));
                setAssignedLabels(filtered);
            }
        } catch (error) {
            console.error("Failed to load labels", error);
        } finally {
            setLoadingLabels(false);
        }
    }, [sessionId, jid]);

    useEffect(() => {
        loadContact();
        loadLabels();
    }, [loadContact, loadLabels]);

    const handleCopy = (value: string, fieldName: string) => {
        navigator.clipboard.writeText(value);
        setCopiedField(fieldName);
        toast.success(`${fieldName} copiado!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSaveContact = async () => {
        setSavingContact(true);
        try {
            await updateContactDetails(sessionId, jid, {
                name: editForm.name,
                email: editForm.email,
                document: editForm.document,
                plan: editForm.plan,
                planValue: editForm.planValue,
                notes: editForm.notes,
                customFields: {
                    company: editForm.company,
                    location: editForm.location,
                    bio: editForm.bio
                }
            });
            toast.success("Cadastro do cliente atualizado");
            setIsEditDialogOpen(false);
            loadContact();
        } catch (error) {
            toast.error("Erro ao salvar cadastro do cliente");
        } finally {
            setSavingContact(false);
        }
    };

    const handlePriorityChange = async (newPriority: string) => {
        try {
            const updated = await updateTicketPriority(sessionId, jid, newPriority as any);
            onTicketUpdated?.(updated);
            toast.success("Prioridade atualizada com sucesso");
        } catch (error) {
            toast.error("Falha ao atualizar prioridade");
        }
    };

    const handleDepartmentChange = async (deptId: string) => {
        try {
            const target = deptId === "none" ? null : deptId;
            const updated = await transferTicket(sessionId, jid, { departmentId: target });
            onTicketUpdated?.(updated);
            toast.success("Setor atualizado com sucesso");
        } catch (error) {
            toast.error("Falha ao atualizar setor");
        }
    };

    const handleAttendantChange = async (userId: string) => {
        try {
            if (userId === "unassigned") {
                const updated = await transferTicket(sessionId, jid, { userId: null });
                onTicketUpdated?.(updated);
                toast.success("Conversa enviada para a fila geral");
            } else if (userId === transferOptions.currentUserId) {
                const updated = await assignTicketToMe(sessionId, jid);
                onTicketUpdated?.(updated);
                toast.success("Conversa atribuída a você");
            } else {
                const updated = await transferTicket(sessionId, jid, { userId });
                onTicketUpdated?.(updated);
                toast.success("Conversa transferida para o atendente");
            }
        } catch (error) {
            toast.error("Falha ao atribuir atendente");
        }
    };

    const handleRemoveLabel = async (labelId: string) => {
        try {
            const res = await fetch(`/api/labels/${sessionId}/assign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ labelId, chatJid: jid, action: "unassign" })
            });
            if (res.ok) {
                setAssignedLabels(prev => prev.filter(l => l.id !== labelId));
                toast.success("Etiqueta removida");
            }
        } catch (error) {
            toast.error("Falha ao remover etiqueta");
        }
    };

    // Quick Macros
    const handleRunMacro = async (type: "high_priority" | "transfer_support" | "resolve") => {
        if (type === "high_priority") {
            await handlePriorityChange("HIGH");
        } else if (type === "transfer_support") {
            const supportDept = transferOptions.departments.find(d => 
                d.name.toLowerCase().includes("suporte") || d.name.toLowerCase().includes("técnico")
            ) || transferOptions.departments[0];
            if (supportDept) {
                await handleDepartmentChange(supportDept.id);
            } else {
                toast.info("Nenhum setor de suporte cadastrado");
            }
        } else if (type === "resolve") {
            try {
                const updated = await resolveTicket(sessionId, jid);
                onTicketUpdated?.(updated);
                toast.success("Conversa resolvida com sucesso");
            } catch {
                toast.error("Falha ao resolver conversa");
            }
        }
    };

    const formatPhoneNumber = (rawJid: string) => {
        const phone = rawJid.split("@")[0].replace(/\D/g, "");
        if (phone.length === 13 && phone.startsWith("55")) {
            return `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`;
        }
        if (phone.length === 12 && phone.startsWith("55")) {
            return `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 8)}-${phone.slice(8)}`;
        }
        return `+${phone}`;
    };

    const displayName = contact?.name || contact?.verifiedName || contact?.notify || jid.split("@")[0];
    const rawPhone = jid.split("@")[0];
    const customFields = contact?.customFields || {};
    const bioText = customFields.bio || contact?.notes || "Cliente WhatsApp conectado.";
    const companyText = customFields.company || (contact?.plan ? `Cliente Plano ${contact.plan}` : null);
    const locationText = customFields.location || "Brasil 🇧🇷";

    // Current assigned attendant & department
    const currentAttendant = useMemo(() => {
        if (!ticket?.assignedUserId) return null;
        return transferOptions.attendants.find(a => a.id === ticket.assignedUserId) || {
            id: ticket.assignedUserId,
            name: ticket.assignedUser?.name || "Atendente",
            email: ticket.assignedUser?.email || ""
        };
    }, [ticket, transferOptions.attendants]);

    const currentDepartment = useMemo(() => {
        if (!ticket?.departmentId) return null;
        return transferOptions.departments.find(d => d.id === ticket.departmentId) || ticket.department;
    }, [ticket, transferOptions.departments]);

    return (
        <aside className="w-80 lg:w-[340px] border-l border-border/20 bg-background flex flex-col h-full overflow-hidden shrink-0 select-none animate-in slide-in-from-right duration-200">
            {/* Header: clean title matching Chatwoot "Contatos" */}
            <div className="h-14 px-4 border-b border-border/10 flex items-center justify-between shrink-0 bg-background">
                <span className="text-sm font-semibold text-foreground tracking-tight">
                    Contatos
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                    title="Fechar painel"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs styled-scrollbar">
                {/* 1. Contact Profile Card (left-aligned squircle avatar like Chatwoot) */}
                <div className="p-3.5 rounded-2xl border border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors space-y-3">
                    {/* Top Row: Squircle Avatar + Actions */}
                    <div className="flex items-start justify-between">
                        <Avatar className="h-14 w-14 rounded-2xl border border-border/40 shadow-xs shrink-0">
                            <AvatarImage 
                                src={`/api/chat/${sessionId}/${encodeURIComponent(jid)}/avatar`} 
                                alt={displayName} 
                                className="object-cover rounded-2xl"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary font-bold text-base rounded-2xl">
                                {displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleCopy(rawPhone, "Telefone")}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                title="Informações do contato"
                            >
                                <Info className="h-3.5 w-3.5" />
                            </button>
                            <a
                                href={`https://wa.me/${rawPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                title="Abrir conversa no WhatsApp Web"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-foreground leading-tight flex items-center gap-1.5">
                            <span className="truncate">{displayName}</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {bioText}
                        </p>
                    </div>

                    {/* Contact Detail Rows with Clean Icons & Copy */}
                    <div className="pt-2 border-t border-border/20 space-y-2">
                        {/* Email */}
                        <div className="flex items-center justify-between text-muted-foreground group/row hover:text-foreground transition-colors">
                            <div className="flex items-center gap-2 truncate">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="text-[11px] text-foreground truncate">
                                    {contact?.email || <span className="text-muted-foreground/60 italic">Sem e-mail cadastrado</span>}
                                </span>
                            </div>
                            {contact?.email && (
                                <button
                                    onClick={() => handleCopy(contact.email!, "E-mail")}
                                    className="p-1 text-muted-foreground hover:text-primary opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                                    title="Copiar e-mail"
                                >
                                    {copiedField === "E-mail" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                                </button>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex items-center justify-between text-muted-foreground group/row hover:text-foreground transition-colors">
                            <div className="flex items-center gap-2 truncate">
                                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="font-mono text-[11px] text-foreground truncate">
                                    {formatPhoneNumber(jid)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopy(rawPhone, "Telefone")}
                                className="p-1 text-muted-foreground hover:text-primary opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
                                title="Copiar telefone"
                            >
                                {copiedField === "Telefone" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                            </button>
                        </div>

                        {/* Company */}
                        {companyText && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="text-[11px] text-foreground truncate">{companyText}</span>
                            </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-[11px] text-foreground truncate">{locationText}</span>
                        </div>
                    </div>

                    {/* Social Media Row (Twitter/X, LinkedIn, GitHub, Instagram) */}
                    <div className="pt-2 border-t border-border/20 flex items-center gap-3 text-muted-foreground">
                        <button className="hover:text-primary transition-colors cursor-pointer" title="Twitter / X">
                            <Twitter className="h-3.5 w-3.5" />
                        </button>
                        <button className="hover:text-primary transition-colors cursor-pointer" title="LinkedIn">
                            <Linkedin className="h-3.5 w-3.5" />
                        </button>
                        <button className="hover:text-primary transition-colors cursor-pointer" title="GitHub">
                            <Github className="h-3.5 w-3.5" />
                        </button>
                        <button className="hover:text-primary transition-colors cursor-pointer" title="Instagram">
                            <Instagram className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* 4 Quick Action Buttons (Message, Edit, Link, Delete) */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/20">
                        <button
                            onClick={() => {
                                const input = document.querySelector("textarea") as HTMLTextAreaElement | null;
                                input?.focus();
                            }}
                            className="h-8 rounded-lg bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-colors border border-border/30 cursor-pointer"
                            title="Conversar / Focar mensagem"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setIsEditDialogOpen(true)}
                            className="h-8 rounded-lg bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-colors border border-border/30 cursor-pointer"
                            title="Editar cadastro do contato"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => handleCopy(jid, "JID do Contato")}
                            className="h-8 rounded-lg bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-colors border border-border/30 cursor-pointer"
                            title="Copiar JID do contato"
                        >
                            <LinkIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => toast.info("Histórico protegido")}
                            className="h-8 rounded-lg bg-muted/40 hover:bg-red-500/15 text-muted-foreground hover:text-red-400 flex items-center justify-center transition-colors border border-border/30 cursor-pointer"
                            title="Opções de exclusão"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* 2. Section: Ações da conversa (Chatwoot style) */}
                <div className="rounded-2xl border border-border/30 bg-muted/20 overflow-hidden">
                    <button
                        onClick={() => setIsActionsOpen(prev => !prev)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                        <span className="font-semibold text-xs text-foreground tracking-tight">
                            Ações da conversa
                        </span>
                        <span className="text-muted-foreground">
                            {isActionsOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                    </button>

                    {isActionsOpen && (
                        <div className="p-3.5 pt-1 border-t border-border/20 space-y-3">
                            {/* Agente atribuído */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Agente atribuído
                                </label>
                                <Select
                                    value={ticket?.assignedUserId || "unassigned"}
                                    onValueChange={handleAttendantChange}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-muted/50 hover:bg-muted border border-border/40 text-foreground rounded-lg focus:ring-0">
                                        <SelectValue>
                                            {currentAttendant ? (
                                                <div className="flex items-center gap-2 truncate">
                                                    <div className="relative">
                                                        <div className="h-4.5 w-4.5 rounded-full bg-primary/20 text-primary font-bold text-[9px] flex items-center justify-center border border-primary/30">
                                                            {(currentAttendant.name || currentAttendant.email).charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-background" />
                                                    </div>
                                                    <span className="truncate">{currentAttendant.name || currentAttendant.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Não atribuído</span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border border-border text-popover-foreground text-xs shadow-md">
                                        <SelectItem value="unassigned" className="text-muted-foreground focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4.5 w-4.5 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                                    <UserX className="h-3 w-3" />
                                                </div>
                                                <span>Não atribuído (Fila geral)</span>
                                            </div>
                                        </SelectItem>
                                        {transferOptions.attendants.map(att => (
                                            <SelectItem key={att.id} value={att.id} className="focus:bg-muted focus:text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <div className="h-4.5 w-4.5 rounded-full bg-primary/20 text-primary font-bold text-[9px] flex items-center justify-center border border-primary/30">
                                                            {(att.name || att.email).charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-background" />
                                                    </div>
                                                    <span>{att.name || att.email}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Time atribuído */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Time atribuído
                                </label>
                                <Select
                                    value={ticket?.departmentId || "none"}
                                    onValueChange={handleDepartmentChange}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-muted/50 hover:bg-muted border border-border/40 text-foreground rounded-lg focus:ring-0">
                                        <SelectValue>
                                            {currentDepartment ? (
                                                <div className="flex items-center gap-2 truncate">
                                                    <div
                                                        className="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                                        style={{
                                                            backgroundColor: `${currentDepartment.colorHex}25`,
                                                            color: currentDepartment.colorHex,
                                                            borderColor: `${currentDepartment.colorHex}50`,
                                                            borderWidth: 1
                                                        }}
                                                    >
                                                        {currentDepartment.name.charAt(0).toLowerCase()}
                                                    </div>
                                                    <span className="truncate">{currentDepartment.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Sem time definido</span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border border-border text-popover-foreground text-xs shadow-md">
                                        <SelectItem value="none" className="text-muted-foreground focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4.5 w-4.5 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                                    <Building2 className="h-3 w-3" />
                                                </div>
                                                <span>Sem time atribuído</span>
                                            </div>
                                        </SelectItem>
                                        {transferOptions.departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id} className="focus:bg-muted focus:text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                                        style={{
                                                            backgroundColor: `${dept.colorHex}25`,
                                                            color: dept.colorHex,
                                                            borderColor: `${dept.colorHex}50`,
                                                            borderWidth: 1
                                                        }}
                                                    >
                                                        {dept.name.charAt(0).toLowerCase()}
                                                    </div>
                                                    <span>{dept.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Prioridade */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Prioridade
                                </label>
                                <Select
                                    value={ticket?.priority || "MEDIUM"}
                                    onValueChange={handlePriorityChange}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-muted/50 hover:bg-muted border border-border/40 text-foreground rounded-lg focus:ring-0">
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                <PriorityBars priority={ticket?.priority || "MEDIUM"} />
                                                <span className="font-medium">
                                                    {ticket?.priority === "URGENT" ? "Urgente" : ticket?.priority === "HIGH" ? "Alta" : ticket?.priority === "MEDIUM" ? "Média" : "Baixa"}
                                                </span>
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border border-border text-popover-foreground text-xs shadow-md">
                                        <SelectItem value="LOW" className="focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <PriorityBars priority="LOW" />
                                                <span>Baixa</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="MEDIUM" className="focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <PriorityBars priority="MEDIUM" />
                                                <span>Média</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="HIGH" className="focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <PriorityBars priority="HIGH" />
                                                <span>Alta</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="URGENT" className="focus:bg-muted focus:text-foreground">
                                            <div className="flex items-center gap-2">
                                                <PriorityBars priority="URGENT" />
                                                <span className="text-red-500 font-semibold">Urgente</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Etiquetas da conversa */}
                            <div className="space-y-2 pt-1">
                                <label className="text-[11px] font-medium text-muted-foreground block">
                                    Etiquetas da conversa
                                </label>

                                <LabelAssignPopover sessionId={sessionId} jid={jid}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 border-primary/25 rounded-lg w-full justify-center gap-1.5 cursor-pointer"
                                        onClick={() => setTimeout(loadLabels, 600)}
                                    >
                                        <Plus className="h-3 w-3" />
                                        <span>Adicionar etiquetas</span>
                                    </Button>
                                </LabelAssignPopover>

                                <div className="flex flex-wrap gap-1.5 min-h-6 pt-1">
                                    {assignedLabels.map(label => (
                                        <span
                                            key={label.id}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium border transition-colors shadow-2xs"
                                            style={{
                                                backgroundColor: `${label.colorHex}15`,
                                                borderColor: `${label.colorHex}40`,
                                                color: label.colorHex
                                            }}
                                        >
                                            <span
                                                className="h-1.5 w-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: label.colorHex }}
                                            />
                                            <span className="truncate max-w-[120px]">{label.name}</span>
                                            <button
                                                onClick={() => handleRemoveLabel(label.id)}
                                                className="ml-0.5 hover:opacity-80 p-0.5 rounded-full cursor-pointer"
                                                title="Remover etiqueta"
                                            >
                                                <X className="h-2.5 w-2.5" />
                                            </button>
                                        </span>
                                    ))}
                                    {assignedLabels.length === 0 && !loadingLabels && (
                                        <p className="text-[10px] text-muted-foreground italic py-0.5">
                                            Nenhuma etiqueta adicionada.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Section: Macros (collapsible with +) */}
                <div className="rounded-2xl border border-border/30 bg-muted/20 overflow-hidden">
                    <button
                        onClick={() => setIsMacrosOpen(prev => !prev)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                        <span className="font-semibold text-xs text-foreground tracking-tight flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            Macros
                        </span>
                        <span className="text-muted-foreground">
                            {isMacrosOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                    </button>

                    {isMacrosOpen && (
                        <div className="p-3.5 pt-1 border-t border-border/20 space-y-2">
                            <button
                                onClick={() => handleRunMacro("high_priority")}
                                className="w-full text-left p-2 rounded-lg bg-muted/40 hover:bg-muted text-foreground text-xs transition-colors flex items-center justify-between border border-border/30 cursor-pointer"
                            >
                                <span className="font-medium">Definir como Prioridade Alta</span>
                                <PriorityBars priority="HIGH" />
                            </button>
                            <button
                                onClick={() => handleRunMacro("transfer_support")}
                                className="w-full text-left p-2 rounded-lg bg-muted/40 hover:bg-muted text-foreground text-xs transition-colors flex items-center justify-between border border-border/30 cursor-pointer"
                            >
                                <span className="font-medium">Transferir p/ Suporte Técnico</span>
                                <Wrench className="h-3.5 w-3.5 text-blue-500" />
                            </button>
                            <button
                                onClick={() => handleRunMacro("resolve")}
                                className="w-full text-left p-2 rounded-lg bg-muted/40 hover:bg-emerald-500/15 hover:text-emerald-500 text-foreground text-xs transition-colors flex items-center justify-between border border-border/30 cursor-pointer"
                            >
                                <span className="font-medium">Resolver e Enviar CSAT</span>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Section: Mini-CRM & Dados Comerciais */}
                <div className="rounded-2xl border border-border/30 bg-muted/20 overflow-hidden">
                    <button
                        onClick={() => setIsCrmOpen(prev => !prev)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                        <span className="font-semibold text-xs text-foreground tracking-tight flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            Dados Contratuais & CRM
                        </span>
                        <span className="text-muted-foreground">
                            {isCrmOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                    </button>

                    {isCrmOpen && (
                        <div className="p-3.5 pt-1 border-t border-border/20 space-y-2.5">
                            <div className="flex items-center justify-between py-1 border-b border-border/15">
                                <span className="text-muted-foreground text-[11px]">CPF / CNPJ:</span>
                                <span className="font-mono text-[11px] text-foreground">
                                    {contact?.document || <span className="text-muted-foreground/50 italic">Não informado</span>}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-border/15">
                                <span className="text-muted-foreground text-[11px]">Plano / Contrato:</span>
                                <span className="font-semibold text-[11px] text-primary">
                                    {contact?.plan || <span className="text-muted-foreground/50 italic font-normal">Nenhum</span>}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-border/15">
                                <span className="text-muted-foreground text-[11px]">Mensalidade:</span>
                                <span className="font-medium text-[11px] text-foreground">
                                    {contact?.planValue || <span className="text-muted-foreground/50 italic">--</span>}
                                </span>
                            </div>

                            <div className="space-y-1 pt-1">
                                <span className="text-muted-foreground text-[11px] block">Observações do Cliente:</span>
                                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/30 text-[11px] text-foreground whitespace-pre-wrap min-h-12 max-h-28 overflow-y-auto styled-scrollbar">
                                    {contact?.notes || <span className="text-muted-foreground/50 italic">Nenhuma anotação privada cadastrada.</span>}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditDialogOpen(true)}
                                className="w-full h-8 text-xs font-medium bg-muted/50 hover:bg-muted text-foreground border border-border/40 rounded-lg mt-2 cursor-pointer"
                            >
                                <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Editar Cadastro
                            </Button>
                        </div>
                    )}
                </div>

                {/* CSAT Rating Preview (se houver avaliação do cliente) */}
                {ticket?.csatScore && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-foreground space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-500">
                            <span className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                Avaliação de Atendimento
                            </span>
                            <span>{ticket.csatScore}/5</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        star <= ticket.csatScore
                                            ? "fill-amber-500 text-amber-500"
                                            : "text-muted-foreground/30"
                                    )}
                                />
                            ))}
                        </div>
                        {ticket.csatComment && (
                            <p className="text-[11px] italic text-muted-foreground pt-1">
                                &ldquo;{ticket.csatComment}&rdquo;
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Contact Modal */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Editar Contato & Mini-CRM
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Atualize os dados comerciais, profissionais e de localização do contato.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-muted-foreground">Nome Completo</label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Nome do cliente"
                                className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">Empresa</label>
                                <Input
                                    value={editForm.company}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                                    placeholder="Ex: Aurora Comércio Ltda."
                                    className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">Localização</label>
                                <Input
                                    value={editForm.location}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="Ex: São Paulo, Brasil 🇧🇷"
                                    className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-muted-foreground">Bio / Cargo / Descrição</label>
                            <Input
                                value={editForm.bio}
                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Ex: Chefe de Operações. Cliente desde 2023."
                                className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">E-mail</label>
                                <Input
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="cliente@empresa.com"
                                    type="email"
                                    className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">CPF / CNPJ</label>
                                <Input
                                    value={editForm.document}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, document: e.target.value }))}
                                    placeholder="000.000.000-00"
                                    className="h-8 text-xs font-mono bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">Plano / Contrato</label>
                                <Input
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, plan: e.target.value }))}
                                    placeholder="Ex: Essencial, Pro, VIP"
                                    className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-muted-foreground">Valor Mensal</label>
                                <Input
                                    value={editForm.planValue}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, planValue: e.target.value }))}
                                    placeholder="Ex: R$ 197,00/mês"
                                    className="h-8 text-xs bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-muted-foreground">Anotações Privadas</label>
                            <Textarea
                                value={editForm.notes}
                                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Informações comerciais, preferências ou notas internas da equipe..."
                                rows={2}
                                className="text-xs resize-none bg-muted/50 border border-border/40 text-foreground rounded-lg focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="text-xs h-8 bg-muted/50 hover:bg-muted text-foreground border border-border/40 rounded-lg cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSaveContact}
                            disabled={savingContact}
                            className="text-xs h-8 font-medium rounded-lg shadow-sm cursor-pointer"
                        >
                            {savingContact ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
