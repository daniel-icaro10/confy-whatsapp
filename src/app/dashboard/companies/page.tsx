"use client";

import { useState, useEffect } from "react";
import {
    Building2,
    Plus,
    Search,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    Shield,
    Users,
    QrCode,
    Phone,
    Mail,
    FileText,
    CheckCircle2,
    XCircle,
    Key,
    RefreshCw,
    MoreVertical,
    AlertTriangle,
} from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Company {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    document: string;
    plan: string;
    maxSessions: number;
    isActive: boolean;
    notes?: string;
    totalSessions: number;
    connectedSessions: number;
    staffCount: number;
    createdAt: string;
}

export default function CompaniesPage() {
    const { data: session } = useSession();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
    const [resettingPasswordCompany, setResettingPasswordCompany] = useState<Company | null>(null);

    // Form inputs for create / edit
    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        document: "",
        plan: "PRO",
        maxSessions: 5,
        notes: "",
    });

    const [newPassword, setNewPassword] = useState("");

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            if (res.ok) {
                const json = await res.json();
                setCompanies(json.data || []);
            } else if (res.status === 403) {
                toast.error("Acesso restrito ao Super Administrador");
            }
        } catch (error) {
            console.error("Fetch companies error:", error);
            toast.error("Erro ao carregar lista de empresas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Empresa cadastrada com sucesso!");
                setIsCreateOpen(false);
                setFormData({
                    companyName: "",
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    document: "",
                    plan: "PRO",
                    maxSessions: 5,
                    notes: "",
                });
                fetchCompanies();
            } else {
                toast.error(data.message || "Falha ao cadastrar empresa");
            }
        } catch {
            toast.error("Erro na comunicação com o servidor");
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCompany) return;

        try {
            const res = await fetch(`/api/companies/${editingCompany.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    document: formData.document,
                    plan: formData.plan,
                    maxSessions: formData.maxSessions,
                    notes: formData.notes,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Dados da empresa atualizados!");
                setEditingCompany(null);
                fetchCompanies();
            } else {
                toast.error(data.message || "Falha ao atualizar dados");
            }
        } catch {
            toast.error("Erro ao atualizar empresa");
        }
    };

    const handleToggleStatus = async (company: Company) => {
        try {
            const newStatus = !company.isActive;
            const res = await fetch(`/api/companies/${company.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (res.ok) {
                toast.success(newStatus ? "Empresa reativada com sucesso!" : "Empresa suspensa/bloqueada!");
                setCompanies((prev) =>
                    prev.map((c) => (c.id === company.id ? { ...c, isActive: newStatus } : c))
                );
            } else {
                toast.error("Falha ao alterar status da empresa");
            }
        } catch {
            toast.error("Erro ao atualizar status");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resettingPasswordCompany || !newPassword || newPassword.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        try {
            const res = await fetch(`/api/companies/${resettingPasswordCompany.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });

            if (res.ok) {
                toast.success("Senha da empresa redefinida com sucesso!");
                setResettingPasswordCompany(null);
                setNewPassword("");
            } else {
                toast.error("Falha ao redefinir senha");
            }
        } catch {
            toast.error("Erro ao redefinir senha");
        }
    };

    const handleDelete = async () => {
        if (!deletingCompany) return;

        try {
            const res = await fetch(`/api/companies/${deletingCompany.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Empresa excluída com sucesso!");
                setCompanies((prev) => prev.filter((c) => c.id !== deletingCompany.id));
                setDeletingCompany(null);
            } else {
                const data = await res.json();
                toast.error(data.message || "Falha ao excluir empresa");
            }
        } catch {
            toast.error("Erro ao excluir empresa");
        }
    };

    const openEditModal = (c: Company) => {
        setEditingCompany(c);
        setFormData({
            companyName: c.companyName || c.name || "",
            name: c.name || "",
            email: c.email || "",
            password: "",
            phone: c.phone || "",
            document: c.document || "",
            plan: c.plan || "PRO",
            maxSessions: c.maxSessions || 5,
            notes: c.notes || "",
        });
    };

    // Filter
    const filteredCompanies = companies.filter((c) => {
        const matchesSearch =
            (c.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.document || "").toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === "ACTIVE") return matchesSearch && c.isActive;
        if (statusFilter === "BLOCKED") return matchesSearch && !c.isActive;
        return matchesSearch;
    });

    const totalInstances = companies.reduce((acc, c) => acc + (c.totalSessions || 0), 0);
    const connectedInstances = companies.reduce((acc, c) => acc + (c.connectedSessions || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
                            Super Administrador
                        </Badge>
                        <span className="text-xs text-muted-foreground">· Gestão de Tenants</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-primary" /> Empresas Cadastradas
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Gerencie as contas corporativas, planos, limites de instâncias do WhatsApp e acessos.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={fetchCompanies} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" /> Atualizar
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            setFormData({
                                companyName: "",
                                name: "",
                                email: "",
                                password: "",
                                phone: "",
                                document: "",
                                plan: "PRO",
                                maxSessions: 5,
                                notes: "",
                            });
                            setIsCreateOpen(true);
                        }}
                        className="gap-1.5"
                    >
                        <Plus className="h-4 w-4" /> Cadastrar Empresa
                    </Button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="glass-panel border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Total de Empresas</p>
                        <p className="text-2xl font-extrabold text-foreground mt-1">{companies.length}</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Empresas Ativas</p>
                        <p className="text-2xl font-extrabold text-emerald-500 mt-1">
                            {companies.filter((c) => c.isActive).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Instâncias WhatsApp</p>
                        <p className="text-2xl font-extrabold text-foreground mt-1">
                            {connectedInstances} <span className="text-sm font-normal text-muted-foreground">/ {totalInstances}</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Empresas Suspensas</p>
                        <p className="text-2xl font-extrabold text-destructive mt-1">
                            {companies.filter((c) => !c.isActive).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por empresa, responsável, e-mail ou documento..."
                        className="pl-9 h-9 text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 text-xs w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos os status</SelectItem>
                            <SelectItem value="ACTIVE">Apenas Ativas</SelectItem>
                            <SelectItem value="BLOCKED">Apenas Bloqueadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Companies List */}
            {loading ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Carregando empresas cadastradas...
                </div>
            ) : filteredCompanies.length === 0 ? (
                <Card className="glass-panel border-border/60 p-12 text-center">
                    <Building2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-foreground">Nenhuma empresa encontrada</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {searchTerm ? "Tente alterar os termos de busca." : "Cadastre a primeira empresa cliente."}
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCompanies.map((c) => (
                        <Card
                            key={c.id}
                            className={`glass-panel border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between ${
                                !c.isActive ? "opacity-75 border-destructive/30" : ""
                            }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                {(c.companyName || c.name || "E").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-foreground truncate">
                                                    {c.companyName || c.name}
                                                </h3>
                                                <p className="text-[11px] text-muted-foreground truncate">
                                                    Resp: {c.name || c.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            c.isActive
                                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]"
                                                : "text-destructive bg-destructive/10 border-destructive/20 text-[10px]"
                                        }
                                    >
                                        {c.isActive ? "Ativa" : "Bloqueada"}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 pt-0 text-xs">
                                <div className="space-y-1 text-muted-foreground">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                                        <span className="text-foreground truncate">{c.email}</span>
                                    </div>
                                    {c.phone && (
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                                            <span>{c.phone}</span>
                                        </div>
                                    )}
                                    {c.document && (
                                        <div className="flex items-center gap-1.5 truncate">
                                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                                            <span>CNPJ/CPF: {c.document}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-2.5 rounded-lg bg-surface-2 border border-border/40 grid grid-cols-2 gap-2 text-[11px]">
                                    <div>
                                        <span className="text-muted-foreground">Plano Contratado:</span>
                                        <p className="font-bold text-foreground mt-0.5">{c.plan}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">WhatsApp Conectados:</span>
                                        <p className="font-bold text-foreground mt-0.5">
                                            <span className="text-emerald-500">{c.connectedSessions}</span> / {c.totalSessions} (limite {c.maxSessions})
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Actions Footer */}
                            <div className="p-3 border-t border-border/40 bg-surface/30 flex items-center justify-between gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleStatus(c)}
                                    className={`h-7 px-2 text-xs gap-1 ${
                                        c.isActive ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                                    }`}
                                    title={c.isActive ? "Suspender/Bloquear empresa" : "Ativar empresa"}
                                >
                                    {c.isActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                                    {c.isActive ? "Suspender" : "Ativar"}
                                </Button>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setResettingPasswordCompany(c);
                                            setNewPassword("");
                                        }}
                                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                        title="Redefinir senha de acesso"
                                    >
                                        <Key className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditModal(c)}
                                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                                        title="Editar dados da empresa"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeletingCompany(c)}
                                        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                                        title="Excluir empresa"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Company Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" /> Cadastrar Nova Empresa
                        </DialogTitle>
                        <DialogDescription>
                            Crie a conta corporativa para o cliente acessar a plataforma com suas instâncias e equipe.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-3.5 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Nome da Empresa / Razão Social *</Label>
                                <Input
                                    required
                                    placeholder="Ex: Confy Tecnologia"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Nome do Responsável</Label>
                                <Input
                                    placeholder="Ex: João da Silva"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">E-mail de Login *</Label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="admin@empresa.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Senha Inicial *</Label>
                                <Input
                                    required
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Plano da Empresa</Label>
                                <Select
                                    value={formData.plan}
                                    onValueChange={(val) => setFormData({ ...formData, plan: val })}
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="START">Starter (1 Instância)</SelectItem>
                                        <SelectItem value="PRO">Profissional (5 Instâncias)</SelectItem>
                                        <SelectItem value="ENTERPRISE">Enterprise (Ilimitado)</SelectItem>
                                        <SelectItem value="CUSTOM">Personalizado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Limite de Instâncias WhatsApp</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={formData.maxSessions}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maxSessions: parseInt(e.target.value) || 1 })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">WhatsApp / Telefone de Contato</Label>
                                <Input
                                    placeholder="(11) 99999-9999"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">CNPJ ou CPF</Label>
                                <Input
                                    placeholder="00.000.000/0000-00"
                                    value={formData.document}
                                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Cadastrar Empresa</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Company Modal */}
            <Dialog open={!!editingCompany} onOpenChange={(open) => !open && setEditingCompany(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit3 className="h-5 w-5 text-primary" /> Editar Empresa
                        </DialogTitle>
                        <DialogDescription>
                            Atualize as configurações e limites contratuais da empresa.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSave} className="space-y-3.5 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Nome da Empresa</Label>
                                <Input
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Responsável</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">E-mail de Login</Label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Plano</Label>
                                <Select
                                    value={formData.plan}
                                    onValueChange={(val) => setFormData({ ...formData, plan: val })}
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="START">Starter (1 Instância)</SelectItem>
                                        <SelectItem value="PRO">Profissional (5 Instâncias)</SelectItem>
                                        <SelectItem value="ENTERPRISE">Enterprise (Ilimitado)</SelectItem>
                                        <SelectItem value="CUSTOM">Personalizado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Limite de Instâncias</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={formData.maxSessions}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maxSessions: parseInt(e.target.value) || 1 })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Telefone / WhatsApp</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">CNPJ / CPF</Label>
                                <Input
                                    value={formData.document}
                                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditingCompany(null)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reset Password Modal */}
            <Dialog
                open={!!resettingPasswordCompany}
                onOpenChange={(open) => !open && setResettingPasswordCompany(null)}
            >
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-amber-500" /> Redefinir Senha
                        </DialogTitle>
                        <DialogDescription>
                            Defina uma nova senha para o login de{" "}
                            <strong>{resettingPasswordCompany?.companyName || resettingPasswordCompany?.email}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleResetPassword} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nova Senha</Label>
                            <Input
                                required
                                type="password"
                                placeholder="Digite no mínimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setResettingPasswordCompany(null)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">Confirmar Nova Senha</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingCompany} onOpenChange={(open) => !open && setDeletingCompany(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" /> Excluir Empresa
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza de que deseja excluir a empresa{" "}
                            <strong>{deletingCompany?.companyName || deletingCompany?.name}</strong>?
                            Esta ação removerá todos os dados, instâncias e acessos associados a esta conta.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingCompany(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Sim, Excluir Empresa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
