"use client";

import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
    FileText,
    CreditCard,
    DollarSign,
    Edit3,
    Copy,
    Check,
    Tag,
    UserCheck,
    Users,
    AlertCircle,
    Star,
    MessageSquare,
    ExternalLink,
    ChevronDown,
    ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    getContactDetails,
    updateContactDetails,
    updateTicketPriority,
    transferTicket,
    assignTicketToMe
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
}

interface LabelData {
    id: string;
    name: string;
    colorHex: string;
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

    // Form state for contact editing
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        document: "",
        plan: "",
        planValue: "",
        notes: ""
    });
    const [savingContact, setSavingContact] = useState(false);

    // Labels
    const [assignedLabels, setAssignedLabels] = useState<LabelData[]>([]);
    const [loadingLabels, setLoadingLabels] = useState(false);

    // Load contact details
    const loadContact = useCallback(async () => {
        setLoadingContact(true);
        try {
            const data = await getContactDetails(sessionId, jid);
            setContact(data as any);
            if (data) {
                setEditForm({
                    name: data.name || "",
                    email: data.email || "",
                    document: data.document || "",
                    plan: data.plan || "",
                    planValue: data.planValue || "",
                    notes: data.notes || ""
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

            if (allLabelsRes.ok && assignedRes.ok) {
                const allLabels: LabelData[] = allData.data?.labels || [];
                const assignedIds = new Set((assignedData.data || []).map((cl: any) => cl.labelId));
                setAssignedLabels(allLabels.filter(l => assignedIds.has(l.id)));
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

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        toast.success(`${fieldName} copiado com sucesso!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSaveContact = async () => {
        setSavingContact(true);
        try {
            const updated = await updateContactDetails(sessionId, jid, editForm);
            setContact(updated as any);
            setIsEditDialogOpen(false);
            toast.success("Dados do contato atualizados com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar dados do contato");
        } finally {
            setSavingContact(false);
        }
    };

    const handlePriorityChange = async (newPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => {
        try {
            const updated = await updateTicketPriority(sessionId, jid, newPriority);
            if (onTicketUpdated) onTicketUpdated(updated);
            toast.success(`Prioridade alterada para ${getPriorityLabel(newPriority)}`);
        } catch (error: any) {
            toast.error(error.message || "Erro ao alterar prioridade");
        }
    };

    const handleAttendantChange = async (userId: string) => {
        try {
            const updated = await transferTicket(sessionId, jid, {
                userId: userId === "unassigned" ? null : userId
            });
            if (onTicketUpdated) onTicketUpdated(updated);
            toast.success("Atendente responsável atualizado!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao transferir ticket");
        }
    };

    const handleDepartmentChange = async (deptId: string) => {
        try {
            const updated = await transferTicket(sessionId, jid, {
                departmentId: deptId === "none" ? null : deptId
            });
            if (onTicketUpdated) onTicketUpdated(updated);
            toast.success("Departamento atualizado!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao alterar setor");
        }
    };

    const handleRemoveLabel = async (labelId: string) => {
        try {
            const res = await fetch(`/api/labels/${sessionId}/chat/${encodeURIComponent(jid)}/labels`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ labelIds: [labelId], action: "remove" })
            });
            if (res.ok) {
                setAssignedLabels(prev => prev.filter(l => l.id !== labelId));
                toast.success("Etiqueta removida");
            }
        } catch (error) {
            toast.error("Erro ao remover etiqueta");
        }
    };

    const getPriorityLabel = (priority?: string) => {
        switch (priority) {
            case "LOW": return "Baixa";
            case "MEDIUM": return "Média";
            case "HIGH": return "Alta";
            case "URGENT": return "Urgente";
            default: return "Média";
        }
    };

    const getPriorityBadgeClass = (priority?: string) => {
        switch (priority) {
            case "LOW": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
            case "MEDIUM": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
            case "HIGH": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
            case "URGENT": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse";
            default: return "bg-amber-500/10 text-amber-600 border-amber-500/20";
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

    return (
        <aside className="w-80 lg:w-88 border-l border-border bg-card/60 backdrop-blur-md flex flex-col h-full overflow-hidden shrink-0 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-14 px-4 border-b border-border/60 flex items-center justify-between shrink-0 bg-background/50">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Detalhes do Contato
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    title="Fechar painel"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* Contact Profile Card */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border/50 bg-background/80 shadow-xs relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditDialogOpen(true)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100 transition-opacity"
                        title="Editar cadastro do cliente"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>

                    <div className="relative mb-2.5">
                        <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                            <AvatarImage src={`/api/chat/${sessionId}/${encodeURIComponent(jid)}/avatar`} alt={displayName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {ticket?.status && (
                            <span className={cn(
                                "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
                                ticket.status === "OPEN" ? "bg-amber-500" :
                                ticket.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-emerald-500"
                            )} />
                        )}
                    </div>

                    <h3 className="font-semibold text-sm text-foreground max-w-full truncate px-2">
                        {displayName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                        Cliente WhatsApp
                    </p>

                    {/* Quick copy fields */}
                    <div className="w-full mt-3 pt-3 border-t border-border/40 space-y-1.5 text-left">
                        {/* Phone */}
                        <div className="flex items-center justify-between group/row hover:bg-muted/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-2 text-muted-foreground truncate">
                                <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span className="font-mono text-[11px] text-foreground truncate">
                                    {formatPhoneNumber(jid)}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopy(rawPhone, "Telefone")}
                                className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                            >
                                {copiedField === "Telefone" ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </Button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between group/row hover:bg-muted/50 p-1.5 rounded-lg transition-colors">
                            <div className="flex items-center gap-2 text-muted-foreground truncate">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                <span className="text-[11px] text-foreground truncate">
                                    {contact?.email || <span className="text-muted-foreground italic">Sem e-mail</span>}
                                </span>
                            </div>
                            {contact?.email && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopy(contact.email!, "E-mail")}
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                                >
                                    {copiedField === "E-mail" ? (
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Conversation Actions Card (Inspiração direta Chatwoot) */}
                <div className="p-3.5 rounded-xl border border-border/50 bg-background/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            Ações da Conversa
                        </span>
                        {ticket?.priority && (
                            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", getPriorityBadgeClass(ticket.priority))}>
                                {getPriorityLabel(ticket.priority)}
                            </Badge>
                        )}
                    </div>

                    {/* Assigned Agent */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                            Atendente Responsável
                        </label>
                        <Select
                            value={ticket?.assignedUserId || "unassigned"}
                            onValueChange={handleAttendantChange}
                        >
                            <SelectTrigger className="h-8 text-xs bg-muted/30">
                                <SelectValue placeholder="Selecione um atendente" />
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                                <SelectItem value="unassigned" className="text-muted-foreground">
                                    ⭕ Não atribuído (Fila geral)
                                </SelectItem>
                                {transferOptions.attendants.map(att => (
                                    <SelectItem key={att.id} value={att.id}>
                                        👤 {att.name || att.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Assigned Team / Department */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                            Setor / Departamento
                        </label>
                        <Select
                            value={ticket?.departmentId || "none"}
                            onValueChange={handleDepartmentChange}
                        >
                            <SelectTrigger className="h-8 text-xs bg-muted/30">
                                <SelectValue placeholder="Selecione um setor" />
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                                <SelectItem value="none" className="text-muted-foreground">
                                    🏢 Sem setor atribuído
                                </SelectItem>
                                {transferOptions.departments.map(dept => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="h-2 w-2 rounded-full shrink-0"
                                                style={{ backgroundColor: dept.colorHex }}
                                            />
                                            <span>{dept.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority Selector */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                            Prioridade do Atendimento
                        </label>
                        <Select
                            value={ticket?.priority || "MEDIUM"}
                            onValueChange={handlePriorityChange}
                        >
                            <SelectTrigger className="h-8 text-xs bg-muted/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                                <SelectItem value="LOW">
                                    <span className="flex items-center gap-1.5 text-emerald-600">
                                        🟢 Baixa
                                    </span>
                                </SelectItem>
                                <SelectItem value="MEDIUM">
                                    <span className="flex items-center gap-1.5 text-amber-600">
                                        🟡 Média
                                    </span>
                                </SelectItem>
                                <SelectItem value="HIGH">
                                    <span className="flex items-center gap-1.5 text-orange-600">
                                        🟠 Alta
                                    </span>
                                </SelectItem>
                                <SelectItem value="URGENT">
                                    <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                                        🔴 Urgente
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Labels Section */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Etiquetas da Conversa
                            </label>
                            <LabelAssignPopover sessionId={sessionId} jid={jid}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] font-medium text-primary hover:text-primary hover:bg-primary/10"
                                    onClick={() => setTimeout(loadLabels, 600)}
                                >
                                    + Adicionar
                                </Button>
                            </LabelAssignPopover>
                        </div>

                        <div className="flex flex-wrap gap-1.5 min-h-6">
                            {assignedLabels.map(label => (
                                <span
                                    key={label.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors shadow-2xs"
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
                                    {label.name}
                                    <button
                                        onClick={() => handleRemoveLabel(label.id)}
                                        className="ml-0.5 hover:opacity-75 p-0.5 rounded-full"
                                        title="Remover etiqueta"
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </button>
                                </span>
                            ))}
                            {assignedLabels.length === 0 && !loadingLabels && (
                                <p className="text-[10px] text-muted-foreground italic py-0.5">
                                    Nenhuma etiqueta atribuída.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CSAT Rating Preview (se houver avaliação) */}
                    {ticket?.csatScore && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                    Avaliação CSAT
                                </span>
                                <span>{ticket.csatScore}/5</span>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "h-3 w-3",
                                            star <= ticket.csatScore
                                                ? "fill-amber-500 text-amber-500"
                                                : "text-muted-foreground/30"
                                        )}
                                    />
                                ))}
                            </div>
                            {ticket.csatComment && (
                                <p className="text-[10px] italic text-muted-foreground pt-1">
                                    &ldquo;{ticket.csatComment}&rdquo;
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Mini-CRM Custom Attributes Card */}
                <div className="p-3.5 rounded-xl border border-border/50 bg-background/80 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                            <CreditCard className="h-3.5 w-3.5 text-primary" />
                            Mini-CRM & Contrato
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="h-6 px-1.5 text-[10px] text-primary hover:text-primary hover:bg-primary/10"
                        >
                            <Edit3 className="h-3 w-3 mr-1" /> Editar
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {/* CPF / CNPJ */}
                        <div className="flex items-center justify-between py-1 border-b border-border/20">
                            <span className="text-muted-foreground text-[11px]">CPF / CNPJ:</span>
                            <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                                <span>{contact?.document || <span className="text-muted-foreground/60 italic font-sans">Não inf.</span>}</span>
                                {contact?.document && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopy(contact.document!, "Documento")}
                                        className="h-5 w-5 text-muted-foreground"
                                    >
                                        <Copy className="h-2.5 w-2.5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Plano */}
                        <div className="flex items-center justify-between py-1 border-b border-border/20">
                            <span className="text-muted-foreground text-[11px]">Plano:</span>
                            <span className="font-medium text-[11px] text-foreground">
                                {contact?.plan ? (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {contact.plan}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground/60 italic">Nenhum</span>
                                )}
                            </span>
                        </div>

                        {/* Valor Contrato */}
                        <div className="flex items-center justify-between py-1 border-b border-border/20">
                            <span className="text-muted-foreground text-[11px]">Mensalidade:</span>
                            <span className="font-medium text-[11px] text-foreground">
                                {contact?.planValue || <span className="text-muted-foreground/60 italic">--</span>}
                            </span>
                        </div>

                        {/* Observações / Notas do Contato */}
                        <div className="space-y-1 pt-1">
                            <span className="text-muted-foreground text-[11px] block">Anotações do Contato:</span>
                            <div className="p-2 rounded-lg bg-muted/40 border border-border/30 text-[11px] text-foreground whitespace-pre-wrap min-h-12 max-h-28 overflow-y-auto">
                                {contact?.notes || <span className="text-muted-foreground/60 italic">Nenhuma anotação cadastrada. Clique em editar para adicionar observações sobre o cliente.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Contact Modal */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Editar Cadastro & Mini-CRM
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Atualize os dados comerciais e de identificação deste contato.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-foreground">Nome Completo</label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Nome do cliente"
                                className="h-8 text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-foreground">E-mail</label>
                                <Input
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="cliente@empresa.com"
                                    type="email"
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-foreground">CPF / CNPJ</label>
                                <Input
                                    value={editForm.document}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, document: e.target.value }))}
                                    placeholder="000.000.000-00"
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-foreground">Plano / Contrato</label>
                                <Input
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, plan: e.target.value }))}
                                    placeholder="Ex: Essencial, Pro, VIP"
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-foreground">Valor Mensal</label>
                                <Input
                                    value={editForm.planValue}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, planValue: e.target.value }))}
                                    placeholder="Ex: R$ 197,00/mês"
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-foreground">Anotações Internas do Cliente</label>
                            <Textarea
                                value={editForm.notes}
                                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Informações comerciais, preferências, histórico ou observações sobre o cliente..."
                                rows={3}
                                className="text-xs resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="text-xs h-8"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSaveContact}
                            disabled={savingContact}
                            className="text-xs h-8"
                        >
                            {savingContact ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
