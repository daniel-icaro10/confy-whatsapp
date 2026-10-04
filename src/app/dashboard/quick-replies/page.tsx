"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/components/dashboard/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Zap, Loader2, Plus, Pencil, Trash2, Copy, Search } from "lucide-react";
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

interface QuickReply {
    id: string;
    shortcut: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function QuickRepliesPage() {
    return (
        <SessionGuard>
            <QuickRepliesContent />
        </SessionGuard>
    );
}

function QuickRepliesContent() {
    const { sessionId } = useSession();
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Create/Edit Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingReply, setEditingReply] = useState<QuickReply | null>(null);
    const [shortcut, setShortcut] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Delete Dialog State
    const [deleteReply, setDeleteReply] = useState<QuickReply | null>(null);

    const loadData = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/quick-replies/${sessionId}`);
            const data = await res.json();
            if (res.ok) {
                setQuickReplies(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load quick replies", error);
            toast.error("Falha ao carregar respostas rápidas");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenCreate = () => {
        setEditingReply(null);
        setShortcut("");
        setTitle("");
        setContent("");
        setDialogOpen(true);
    };

    const handleOpenEdit = (qr: QuickReply) => {
        setEditingReply(qr);
        setShortcut(qr.shortcut);
        setTitle(qr.title);
        setContent(qr.content);
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shortcut.trim() || !title.trim() || !content.trim()) {
            toast.error("Todos os campos são obrigatórios");
            return;
        }

        setSubmitting(true);
        try {
            const url = editingReply
                ? `/api/quick-replies/${sessionId}/${editingReply.id}`
                : `/api/quick-replies/${sessionId}`;
            const method = editingReply ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shortcut: shortcut.replace(/^\//, "").toLowerCase().trim(),
                    title: title.trim(),
                    content: content.trim()
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao salvar resposta rápida");

            toast.success(editingReply ? "Resposta rápida atualizada!" : "Resposta rápida criada!");
            setDialogOpen(false);
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteReply) return;
        try {
            const res = await fetch(`/api/quick-replies/${sessionId}/${deleteReply.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Erro ao excluir");
            toast.success("Resposta rápida excluída!");
            setDeleteReply(null);
            loadData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const copyContent = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Mensagem copiada para a área de transferência!");
    };

    const filtered = quickReplies.filter(qr =>
        qr.shortcut.toLowerCase().includes(search.toLowerCase()) ||
        qr.title.toLowerCase().includes(search.toLowerCase()) ||
        qr.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Zap className="h-6 w-6 text-amber-500" />
                        Respostas Rápidas & Atalhos
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre mensagens prontas que seus atendentes podem acionar digitando uma barra (<code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">/atalho</code>) direto na tela do chat.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
                    <Plus className="h-4 w-4" /> Nova Resposta
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por atalho, título ou texto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filtered.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-amber-500" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">Nenhuma resposta rápida encontrada</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            Crie respostas prontas para perguntas frequentes como dados do Pix, horários de atendimento ou mensagens de saudação.
                        </p>
                        <Button onClick={handleOpenCreate} className="mt-4 gap-2">
                            <Plus className="h-4 w-4" /> Criar Primeira Resposta
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(qr => (
                        <Card key={qr.id} className="hover:shadow-md transition-shadow relative flex flex-col justify-between">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                            {qr.title}
                                        </CardTitle>
                                        <Badge variant="outline" className="font-mono text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                                            /{qr.shortcut}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyContent(qr.content)} title="Copiar texto">
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(qr)} title="Editar">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setDeleteReply(qr)} title="Excluir">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4 font-sans">
                                    {qr.content}
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
                        <DialogTitle>{editingReply ? "Editar Resposta Rápida" : "Nova Resposta Rápida"}</DialogTitle>
                        <DialogDescription>
                            Defina o atalho e a mensagem completa que será preenchida automaticamente no chat.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="qr-shortcut">Atalho de Teclado *</Label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">/</span>
                                    <Input
                                        id="qr-shortcut"
                                        placeholder="pix, ola, horario..."
                                        value={shortcut}
                                        onChange={(e) => setShortcut(e.target.value.replace(/[^a-zA-Z0-9_\-]/g, ""))}
                                        className="pl-6 font-mono text-sm"
                                        required
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground">Ex: digite "pix" para usar <code className="font-mono">/pix</code></span>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="qr-title">Título Identificador *</Label>
                                <Input
                                    id="qr-title"
                                    placeholder="Ex: Chave Pix CNPJ, Saudação Inicial"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="qr-content">Conteúdo da Mensagem *</Label>
                            <Textarea
                                id="qr-content"
                                placeholder="Digite a mensagem completa com quebras de linha se necessário..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                required
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Salvando..." : editingReply ? "Salvar Alterações" : "Criar Resposta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteReply} onOpenChange={(open) => !open && setDeleteReply(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir resposta rápida?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deseja realmente remover o atalho <strong>/{deleteReply?.shortcut}</strong>? Os atendentes não poderão mais usá-lo pelo chat.
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
