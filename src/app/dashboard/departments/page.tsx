"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building2, Loader2, Plus, Pencil, Trash2, Users, Ticket, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import { SessionGuard } from "@/components/dashboard/session-guard";
import { getTransferOptions } from "@/app/dashboard/chat/actions";
import { cn } from "@/lib/utils";

const DEPARTMENT_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#6366f1", // Indigo
];

interface Department {
    id: string;
    name: string;
    description?: string;
    colorHex: string;
    ticketsCount: number;
    users: { id: string; name: string | null; email: string }[];
    createdAt: string;
}

export default function DepartmentsPage() {
    return (
        <SessionGuard>
            <DepartmentsContent />
        </SessionGuard>
    );
}

function DepartmentsContent() {
    const { sessionId } = useSession();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [attendants, setAttendants] = useState<{ id: string; name: string | null; email: string }[]>([]);
    const [loading, setLoading] = useState(true);

    // Create/Edit Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [colorHex, setColorHex] = useState(DEPARTMENT_COLORS[0]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Delete Dialog State
    const [deleteDept, setDeleteDept] = useState<Department | null>(null);

    const loadData = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const [deptRes, transferOpts] = await Promise.all([
                fetch(`/api/departments/${sessionId}`),
                getTransferOptions(sessionId)
            ]);
            const deptData = await deptRes.json();
            if (deptRes.ok) {
                setDepartments(deptData.data || []);
            }
            if (transferOpts?.attendants) {
                setAttendants(transferOpts.attendants);
            }
        } catch (error) {
            console.error("Failed to load departments", error);
            toast.error("Falha ao carregar setores");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenCreate = () => {
        setEditingDept(null);
        setName("");
        setDescription("");
        setColorHex(DEPARTMENT_COLORS[0]);
        setSelectedUserIds([]);
        setDialogOpen(true);
    };

    const handleOpenEdit = (dept: Department) => {
        setEditingDept(dept);
        setName(dept.name);
        setDescription(dept.description || "");
        setColorHex(dept.colorHex);
        setSelectedUserIds(dept.users.map(u => u.id));
        setDialogOpen(true);
    };

    const toggleAttendant = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("O nome do setor é obrigatório");
            return;
        }

        setSubmitting(true);
        try {
            const url = editingDept
                ? `/api/departments/${sessionId}/${editingDept.id}`
                : `/api/departments/${sessionId}`;
            const method = editingDept ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    colorHex,
                    userIds: selectedUserIds
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao salvar setor");

            toast.success(editingDept ? "Setor atualizado!" : "Setor criado com sucesso!");
            setDialogOpen(false);
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDept) return;
        try {
            const res = await fetch(`/api/departments/${sessionId}/${deleteDept.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Erro ao excluir setor");
            toast.success("Setor excluído!");
            setDeleteDept(null);
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-primary" />
                        Setores & Filas de Atendimento
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Crie departamentos (ex: Vendas, Suporte, Financeiro) e organize quais operadores atendem cada fila.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
                    <Plus className="h-4 w-4" /> Novo Setor
                </Button>
            </div>

            {/* List / Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : departments.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Nenhum setor criado</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            Organize o atendimento da sua empresa dividindo as conversas por áreas como Vendas e Suporte.
                        </p>
                        <Button onClick={handleOpenCreate} className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Criar Primeiro Setor
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map(dept => (
                        <Card key={dept.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
                            {/* Color indicator top bar */}
                            <div className="h-1.5 w-full" style={{ backgroundColor: dept.colorHex }} />
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: dept.colorHex }} />
                                        <CardTitle className="text-lg font-semibold">{dept.name}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(dept)}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setDeleteDept(dept)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                {dept.description && (
                                    <CardDescription className="text-xs line-clamp-2 mt-1">{dept.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                    <span className="flex items-center gap-1">
                                        <Ticket className="h-3.5 w-3.5" />
                                        {dept.ticketsCount} atendimentos vinculados
                                    </span>
                                    <span className="flex items-center gap-1 font-medium">
                                        <Users className="h-3.5 w-3.5" />
                                        {dept.users.length} atendentes
                                    </span>
                                </div>

                                {/* Attendants list tags */}
                                <div className="flex flex-wrap gap-1">
                                    {dept.users.map(u => (
                                        <Badge key={u.id} variant="secondary" className="text-[10px] font-normal">
                                            {u.name || u.email.split('@')[0]}
                                        </Badge>
                                    ))}
                                    {dept.users.length === 0 && (
                                        <span className="text-[11px] text-muted-foreground italic">Nenhum operador atribuído</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingDept ? "Editar Setor" : "Novo Setor de Atendimento"}</DialogTitle>
                        <DialogDescription>
                            Configure o departamento e marque os atendentes que terão acesso a esta fila de clientes.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dept-name">Nome do Setor *</Label>
                            <Input
                                id="dept-name"
                                placeholder="Ex: Vendas, Suporte, Financeiro, Recepção"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="dept-desc">Descrição (Opcional)</Label>
                            <Input
                                id="dept-desc"
                                placeholder="Breve explicação da finalidade deste setor"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Cor de Identificação</Label>
                            <div className="flex items-center gap-2 pt-1">
                                {DEPARTMENT_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColorHex(c)}
                                        className={cn(
                                            "h-7 w-7 rounded-full transition-transform flex items-center justify-center cursor-pointer",
                                            colorHex === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-105 opacity-80"
                                        )}
                                        style={{ backgroundColor: c }}
                                    >
                                        {colorHex === c && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t">
                            <Label>Atendentes que fazem parte deste setor</Label>
                            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border rounded-lg p-2 bg-muted/20">
                                {attendants.map(attendant => {
                                    const isSelected = selectedUserIds.includes(attendant.id);
                                    return (
                                        <button
                                            key={attendant.id}
                                            type="button"
                                            onClick={() => toggleAttendant(attendant.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors text-left cursor-pointer",
                                                isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{attendant.name || "Sem nome"}</span>
                                                <span className="text-[10px] text-muted-foreground">{attendant.email}</span>
                                            </div>
                                            <div className={cn(
                                                "h-4 w-4 rounded-md border flex items-center justify-center transition-colors",
                                                isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                                {attendants.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-3">Nenhum atendente cadastrado no sistema.</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Salvando..." : editingDept ? "Salvar Alterações" : "Criar Setor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteDept} onOpenChange={(open) => !open && setDeleteDept(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir setor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá o setor <strong>{deleteDept?.name}</strong>. Os atendimentos já existentes não serão apagados, mas ficarão sem setor definido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
