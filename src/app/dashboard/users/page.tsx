"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
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
    Trash2,
    Plus,
    Edit,
    User,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Users,
    QrCode,
    CheckCircle2,
    RefreshCw,
    Building2,
    ArrowRight,
    Key,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    role: "SUPERADMIN" | "OWNER" | "STAFF";
    createdAt: string;
    sessionAccesses?: Array<{
        sessionId: string;
        session: {
            id: string;
            name: string;
            sessionId: string;
            status: string;
        };
    }>;
}

interface SessionItem {
    id: string;
    name: string;
    sessionId: string;
    status: string;
}

export default function UsersPage() {
    const { data: authSession } = useSession();
    // @ts-ignore
    const userRole = authSession?.user?.role as string;
    const isSuperAdmin = userRole === "SUPERADMIN";

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [availableSessions, setAvailableSessions] = useState<SessionItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STAFF",
        sessionIds: [] as string[],
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const responseData = await res.json();
                setUsers(responseData?.data || []);
            } else if (res.status === 403) {
                toast.error("Sem permissão para listar usuários");
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await fetch("/api/sessions");
            if (res.ok) {
                const data = await res.json();
                setAvailableSessions(data?.data || []);
            }
        } catch {
            // silent catch
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchSessions();
    }, []);

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "STAFF",
            sessionIds: availableSessions.map((s) => s.id), // default to all sessions
        });
        setShowForm(true);
    };

    const handleOpenEdit = (user: UserProfile) => {
        setEditingUser(user);
        const assignedIds = (user.sessionAccesses || []).map((sa) => sa.session?.id || sa.sessionId);
        setFormData({
            name: user.name || "",
            email: user.email,
            password: "",
            role: user.role,
            sessionIds: assignedIds,
        });
        setShowForm(true);
    };

    const toggleSessionSelection = (sessionId: string) => {
        setFormData((prev) => {
            const exists = prev.sessionIds.includes(sessionId);
            return {
                ...prev,
                sessionIds: exists
                    ? prev.sessionIds.filter((id) => id !== sessionId)
                    : [...prev.sessionIds, sessionId],
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
            const method = editingUser ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingUser ? "Atendente atualizado!" : "Atendente cadastrado com sucesso!");
                setShowForm(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.message || "Falha na operação");
            }
        } catch (error) {
            toast.error("Falha ao salvar dados");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Usuário excluído com sucesso");
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.message || "Falha ao excluir");
            }
        } catch (error) {
            toast.error("Falha ao excluir usuário");
        } finally {
            setDeleteId(null);
        }
    };

    const roleLabels: Record<string, string> = {
        SUPERADMIN: "Super Admin",
        OWNER: "Proprietário",
        STAFF: "Atendente",
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "SUPERADMIN":
                return <ShieldAlert className="h-4 w-4 text-rose-500" />;
            case "OWNER":
                return <ShieldCheck className="h-4 w-4 text-blue-500" />;
            default:
                return <User className="h-4 w-4 text-emerald-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Super Admin Notice */}
            {isSuperAdmin && (
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                        <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>
                            Você está logado como <strong>Super Admin</strong>. Para gerenciar as empresas clientes da plataforma, utilize a área dedicada.
                        </span>
                    </div>
                    <Link href="/dashboard/companies">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-blue-500/30">
                            Ir para Empresas Cadastradas <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/50 pb-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" /> Atendentes & Equipe
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Gerencie os atendentes e operadores da sua empresa que terão acesso às conversas do WhatsApp.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" /> Atualizar
                    </Button>
                    <Button size="sm" onClick={handleOpenCreate} className="gap-1.5">
                        <Plus className="h-4 w-4" /> Novo Atendente
                    </Button>
                </div>
            </div>

            {/* Attendants List */}
            {loading ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Carregando atendentes da equipe...
                </div>
            ) : users.length === 0 ? (
                <Card className="glass-panel border-border/60 p-12 text-center">
                    <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-foreground">Nenhum atendente cadastrado</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cadastre os operadores para que eles possam atender clientes nas suas sessões de WhatsApp.
                    </p>
                    <div className="mt-4">
                        <Button size="sm" onClick={handleOpenCreate}>
                            <Plus className="h-4 w-4 mr-1" /> Cadastrar Primeiro Atendente
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => {
                        const assignedSessions = user.sessionAccesses || [];

                        return (
                            <Card key={user.id} className="glass-panel border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-sm text-foreground truncate">{user.name || "Sem nome"}</h3>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] flex items-center gap-1 font-semibold">
                                            {getRoleIcon(user.role)}
                                            {roleLabels[user.role] || user.role}
                                        </Badge>
                                    </div>

                                    {/* Assigned Sessions */}
                                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                                        <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                                            Acesso às Sessões:
                                        </span>
                                        {assignedSessions.length === 0 ? (
                                            <p className="text-muted-foreground italic text-[11px]">Nenhuma sessão atribuída</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {assignedSessions.map((sa) => (
                                                    <span
                                                        key={sa.sessionId}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-2 border border-border/50 text-[10px] font-medium text-foreground"
                                                    >
                                                        <QrCode className="h-3 w-3 text-emerald-500" />
                                                        {sa.session?.name || sa.sessionId}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <div className="p-3 bg-surface/30 border-t border-border/40 flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleOpenEdit(user)}>
                                        <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => setDeleteId(user.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Excluir
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create / Edit Modal */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> {editingUser ? "Editar Atendente" : "Novo Atendente"}
                        </DialogTitle>
                        <DialogDescription>
                            Defina os dados de login e as instâncias de WhatsApp que o atendente poderá operar.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nome do Atendente *</Label>
                            <Input
                                required
                                placeholder="Ex: Lucas Atendimento"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">E-mail de Acesso *</Label>
                            <Input
                                required
                                type="email"
                                placeholder="atendente@empresa.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">
                                {editingUser ? "Nova Senha (deixe em branco para manter a atual)" : "Senha Inicial *"}
                            </Label>
                            <Input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required={!editingUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Session Access Checkboxes */}
                        {availableSessions.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border/40">
                                <Label className="text-xs font-semibold">Liberar Acesso às Sessões do WhatsApp:</Label>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 rounded-lg bg-surface-2 border border-border/40 styled-scrollbar">
                                    {availableSessions.map((s) => {
                                        const isSelected = formData.sessionIds.includes(s.id);
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => toggleSessionSelection(s.id)}
                                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs ${
                                                    isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-surface-3"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <QrCode className="h-3.5 w-3.5 text-primary" />
                                                    <span className="font-medium text-foreground">{s.name}</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {}}
                                                    className="rounded border-border"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">{editingUser ? "Salvar Alterações" : "Cadastrar Atendente"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Atendente</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza de que deseja excluir este atendente? O acesso às conversas e ao sistema será cancelado imediatamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Sim, Excluir Atendente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
