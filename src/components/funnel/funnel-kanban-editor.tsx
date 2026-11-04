"use client";

import { useState } from "react";
import {
    FunnelStepNode,
    FunnelStageId,
    FunnelStepType,
    FUNNEL_STAGES,
    DEFAULT_FUNNEL_STEPS
} from "@/lib/segredos-defaults";
import {
    Plus,
    MessageSquare,
    Mic,
    Video,
    Image as ImageIcon,
    Zap,
    Bot,
    CheckCircle2,
    ArrowRight,
    Trash2,
    Copy,
    Edit3,
    Clock,
    Sparkles,
    Eye,
    Link2,
    GripVertical
} from "lucide-react";
import { toast } from "sonner";

interface FunnelKanbanEditorProps {
    nodes: FunnelStepNode[];
    onChange: (nodes: FunnelStepNode[]) => void;
    planPrice: number;
    siteUrl: string;
}

const STEP_TYPE_CONFIG: Record<
    FunnelStepType,
    { label: string; icon: any; color: string; badgeBg: string }
> = {
    greeting: {
        label: "Boas-Vindas",
        icon: MessageSquare,
        color: "#3b82f6",
        badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30"
    },
    media: {
        label: "Envio de Mídia",
        icon: Video,
        color: "#8b5cf6",
        badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30"
    },
    offer: {
        label: "Oferta & Preço",
        icon: Sparkles,
        color: "#f59e0b",
        badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30"
    },
    pix_charge: {
        label: "Geração de Pix",
        icon: Zap,
        color: "#e11d48",
        badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30"
    },
    ai_assistant: {
        label: "Atendente com IA",
        icon: Bot,
        color: "#06b6d4",
        badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
    },
    delivery: {
        label: "Pós-Venda / Liberação",
        icon: CheckCircle2,
        color: "#10b981",
        badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    },
    custom_message: {
        label: "Mensagem Livre",
        icon: MessageSquare,
        color: "#6b7280",
        badgeBg: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30"
    }
};

export function FunnelKanbanEditor({
    nodes,
    onChange,
    planPrice,
    siteUrl
}: FunnelKanbanEditorProps) {
    const [viewMode, setViewMode] = useState<"kanban" | "flow">("kanban");
    const [editingNode, setEditingNode] = useState<FunnelStepNode | null>(null);
    const [previewNode, setPreviewNode] = useState<FunnelStepNode | null>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

    // Form modal state for editing/adding
    const [formTitle, setFormTitle] = useState("");
    const [formStage, setFormStage] = useState<FunnelStageId>("lead");
    const [formType, setFormType] = useState<FunnelStepType>("greeting");
    const [formMessage, setFormMessage] = useState("");
    const [formMediaType, setFormMediaType] = useState<"none" | "image" | "audio" | "video">("none");
    const [formMediaUrl, setFormMediaUrl] = useState("");
    const [formDelay, setFormDelay] = useState<number>(0);
    const [formKeywords, setFormKeywords] = useState("");
    const [formNextStepId, setFormNextStepId] = useState<string | null>(null);
    const [formEnabled, setFormEnabled] = useState(true);

    const openEditModal = (node: FunnelStepNode) => {
        setEditingNode(node);
        setFormTitle(node.title);
        setFormStage(node.stage);
        setFormType(node.type);
        setFormMessage(node.message || "");
        setFormMediaType(node.mediaType || "none");
        setFormMediaUrl(node.mediaUrl || "");
        setFormDelay(node.delaySeconds || 0);
        setFormKeywords(node.keywords || "");
        setFormNextStepId(node.nextStepId || null);
        setFormEnabled(node.enabled !== false);
    };

    const openCreateModal = (defaultStage: FunnelStageId = "lead") => {
        const newId = `step_${Date.now()}`;
        const newNode: FunnelStepNode = {
            id: newId,
            title: "Novo Passo do Bot",
            stage: defaultStage,
            type: "custom_message",
            message: "Olá! Digite sua mensagem aqui.",
            delaySeconds: 1,
            nextStepId: null,
            enabled: true,
            order: nodes.length + 1
        };
        setEditingNode(newNode);
        setFormTitle(newNode.title);
        setFormStage(newNode.stage);
        setFormType(newNode.type);
        setFormMessage(newNode.message);
        setFormMediaType("none");
        setFormMediaUrl("");
        setFormDelay(newNode.delaySeconds || 1);
        setFormKeywords("");
        setFormNextStepId(null);
        setFormEnabled(true);
    };

    const handleSaveNode = () => {
        if (!editingNode) return;
        const updatedNode: FunnelStepNode = {
            ...editingNode,
            title: formTitle.trim() || "Passo do Funil",
            stage: formStage,
            type: formType,
            message: formMessage,
            mediaType: formMediaType,
            mediaUrl: formMediaUrl.trim(),
            delaySeconds: Number(formDelay) || 0,
            keywords: formKeywords.trim(),
            nextStepId: formNextStepId || null,
            enabled: formEnabled
        };

        const exists = nodes.some((n) => n.id === updatedNode.id);
        let updatedList: FunnelStepNode[];
        if (exists) {
            updatedList = nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
        } else {
            updatedList = [...nodes, updatedNode];
        }
        onChange(updatedList);
        setEditingNode(null);
        toast.success("Passo atualizado no funil");
    };

    const handleDeleteNode = (id: string) => {
        if (nodes.length <= 1) {
            toast.error("O funil precisa de pelo menos 1 passo.");
            return;
        }
        const updated = nodes
            .filter((n) => n.id !== id)
            .map((n) => (n.nextStepId === id ? { ...n, nextStepId: null } : n));
        onChange(updated);
        toast.success("Passo removido");
    };

    const handleDuplicateNode = (node: FunnelStepNode) => {
        const copyId = `step_${Date.now()}`;
        const copyNode: FunnelStepNode = {
            ...node,
            id: copyId,
            title: `${node.title} (Cópia)`,
            order: node.order + 1
        };
        onChange([...nodes, copyNode]);
        toast.success("Passo duplicado");
    };

    const handleToggleEnabled = (id: string) => {
        const updated = nodes.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n));
        onChange(updated);
    };

    const handleConnectNext = (sourceId: string, targetId: string | null) => {
        const updated = nodes.map((n) => (n.id === sourceId ? { ...n, nextStepId: targetId } : n));
        onChange(updated);
        toast.success("Ligação entre passos atualizada");
    };

    // Drag and Drop between stages
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("text/plain", id);
        setDraggedNodeId(id);
    };

    const handleDropOnStage = (e: React.DragEvent, targetStage: FunnelStageId) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain") || draggedNodeId;
        if (!id) return;
        const updated = nodes.map((n) => (n.id === id ? { ...n, stage: targetStage } : n));
        onChange(updated);
        setDraggedNodeId(null);
    };

    const insertVariable = (variable: string) => {
        setFormMessage((prev) => prev + variable);
    };

    // Render formatted preview message with mock variables
    const getFormattedPreview = (msg: string) => {
        const priceStr = planPrice.toFixed(2).replace(".", ",");
        const origin = siteUrl || "https://tvdramareels.com";
        return msg
            .replace(/\{\{VALOR\}\}/g, priceStr)
            .replace(/\{\{NOME\}\}/g, "Maria")
            .replace(/\{\{TELEFONE\}\}/g, "5511999998888")
            .replace(/\{\{LINK_ACESSO\}\}/g, `${origin}/?phone=5511999998888`)
            .replace(
                /\{\{PIX_COPIA_E_COLA\}\}/g,
                "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400052040000530398654049.905802BR5913TVDRAMA REELS6009SAO PAULO62070503***6304ABCD"
            );
    };

    return (
        <div className="space-y-6">
            {/* Header com Modos de Visualização e Ações */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111114] p-4 rounded-xl border border-neutral-800">
                <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#e11d48]" />
                        Estrutura do Funil &amp; Automação do Bot
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Puxe, organize em colunas e ligue cada quadrado com a frase que o bot vai
                        mandar em cada etapa.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#09090b] border border-neutral-800 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("kanban")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                                viewMode === "kanban"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Quadro Kanban
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("flow")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                                viewMode === "flow"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Fluxo Sequencial
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => openCreateModal("lead")}
                        className="px-3.5 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(225,29,72,0.35)] transition"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Novo Passo
                    </button>
                </div>
            </div>

            {/* MODO 1: QUADRO KANBAN POR ESTÁGIOS */}
            {viewMode === "kanban" && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                    {FUNNEL_STAGES.map((stage) => {
                        const stageNodes = nodes.filter((n) => n.stage === stage.id);
                        return (
                            <div
                                key={stage.id}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDropOnStage(e, stage.id)}
                                className="flex flex-col bg-[#0b0b0e] border border-neutral-800/80 rounded-xl p-3 min-w-[260px] min-h-[520px]"
                            >
                                {/* Topo da Coluna */}
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: stage.color }}
                                        />
                                        <h3 className="font-bold text-xs text-white">
                                            {stage.label}
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                                        {stageNodes.length}
                                    </span>
                                </div>

                                <p className="text-[11px] text-neutral-500 mb-3 leading-tight">
                                    {stage.description}
                                </p>

                                {/* Lista de Cards / Quadrados nesta coluna */}
                                <div className="space-y-3 flex-1">
                                    {stageNodes.map((node) => {
                                        const typeCfg =
                                            STEP_TYPE_CONFIG[node.type] ||
                                            STEP_TYPE_CONFIG.custom_message;
                                        const TypeIcon = typeCfg.icon;
                                        const nextNode = nodes.find(
                                            (n) => n.id === node.nextStepId
                                        );

                                        return (
                                            <div
                                                key={node.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, node.id)}
                                                className={`relative p-3.5 rounded-xl border transition group cursor-grab active:cursor-grabbing ${
                                                    node.enabled
                                                        ? "bg-[#141418] border-neutral-700/80 hover:border-neutral-500 shadow-md"
                                                        : "bg-[#0f0f12] border-neutral-800/60 opacity-60"
                                                }`}
                                            >
                                                {/* Cabeçalho do Card */}
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <GripVertical className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeCfg.badgeBg}`}
                                                        >
                                                            <TypeIcon className="w-3 h-3" />
                                                            {typeCfg.label}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleEnabled(node.id)}
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                                                            node.enabled
                                                                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                                                                : "bg-neutral-800 text-neutral-500 hover:text-neutral-300"
                                                        }`}
                                                    >
                                                        {node.enabled ? "Ativo" : "Pausado"}
                                                    </button>
                                                </div>

                                                <h4 className="font-bold text-xs text-white mb-1.5 line-clamp-1">
                                                    {node.title}
                                                </h4>

                                                {/* Frase do Bot (Preview) */}
                                                <div className="p-2.5 rounded-lg bg-[#09090b] border border-neutral-800/80 text-[11px] text-neutral-300 line-clamp-3 mb-2.5 font-sans leading-relaxed">
                                                    {node.message || (
                                                        <span className="italic text-neutral-600">
                                                            Nenhuma mensagem configurada.
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Mídia anexada */}
                                                {node.mediaType && node.mediaType !== "none" && (
                                                    <div className="mb-2 text-[10px] font-semibold text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                                                        <Video className="w-3 h-3" />
                                                        Mídia ({node.mediaType}):{" "}
                                                        <span className="truncate max-w-[140px] text-neutral-300">
                                                            {node.mediaUrl || "Sem URL"}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Palavras-chave do Pix */}
                                                {node.keywords && (
                                                    <div className="mb-2 text-[10px] text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 truncate">
                                                        <Zap className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">
                                                            Gatilhos: {node.keywords}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* LIGAÇÃO / CONECTOR COM O PRÓXIMO PASSO */}
                                                <div className="pt-2 border-t border-neutral-800 flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-neutral-500 flex items-center gap-1">
                                                            <Link2 className="w-3 h-3 text-[#e11d48]" />
                                                            Ligar para:
                                                        </span>
                                                        <select
                                                            value={node.nextStepId || ""}
                                                            onChange={(e) =>
                                                                handleConnectNext(
                                                                    node.id,
                                                                    e.target.value || null
                                                                )
                                                            }
                                                            className="text-[10px] font-bold bg-[#0a0a0d] border border-neutral-800 text-neutral-200 rounded px-2 py-0.5 max-w-[130px] truncate outline-none focus:border-neutral-500"
                                                        >
                                                            <option value="">
                                                                — Fim do fluxo —
                                                            </option>
                                                            {nodes
                                                                .filter((n) => n.id !== node.id)
                                                                .map((other) => (
                                                                    <option
                                                                        key={other.id}
                                                                        value={other.id}
                                                                    >
                                                                        → {other.title}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    {nextNode && (
                                                        <div className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded truncate">
                                                            <ArrowRight className="w-3 h-3 text-[#e11d48]" />
                                                            <span>
                                                                Dispara: {nextNode.title}{" "}
                                                                {node.delaySeconds
                                                                    ? `(após ${node.delaySeconds}s)`
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Ações do Card */}
                                                <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-neutral-800/80">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewNode(node)}
                                                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-800/60 transition"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Ver balão
                                                    </button>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(node)}
                                                            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                                                            title="Editar Frase e Ação"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDuplicateNode(node)}
                                                            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                                                            title="Duplicar Passo"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNode(node.id)}
                                                            className="p-1 rounded hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Botão rápido para adicionar neste estágio */}
                                    <button
                                        type="button"
                                        onClick={() => openCreateModal(stage.id)}
                                        className="w-full py-2.5 rounded-xl border border-dashed border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Novo nesta coluna
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODO 2: FLUXO SEQUENCIAL DE NÓS COM SETAS VISUAIS */}
            {viewMode === "flow" && (
                <div className="bg-[#0b0b0e] border border-neutral-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <span className="text-xs text-neutral-400">
                            Sequência de mensagens e gatilhos disparados pelo bot:
                        </span>
                        <span className="text-xs font-bold text-neutral-300">
                            {nodes.length} passos configurados
                        </span>
                    </div>

                    <div className="space-y-4">
                        {nodes.map((node, index) => {
                            const typeCfg =
                                STEP_TYPE_CONFIG[node.type] || STEP_TYPE_CONFIG.custom_message;
                            const TypeIcon = typeCfg.icon;
                            const nextNode = nodes.find((n) => n.id === node.nextStepId);

                            return (
                                <div key={node.id} className="relative">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-[#141418] hover:border-neutral-700 transition">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <span className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono font-bold text-white grid place-items-center shrink-0">
                                                {index + 1}
                                            </span>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeCfg.badgeBg}`}
                                                    >
                                                        <TypeIcon className="w-3 h-3 inline mr-1" />
                                                        {typeCfg.label}
                                                    </span>
                                                    <h4 className="font-bold text-sm text-white truncate">
                                                        {node.title}
                                                    </h4>
                                                </div>
                                                <p className="text-xs text-neutral-400 line-clamp-2 max-w-xl">
                                                    {node.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                            {nextNode ? (
                                                <span className="text-[11px] font-semibold text-neutral-300 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1">
                                                    <ArrowRight className="w-3.5 h-3.5 text-[#e11d48]" />
                                                    Leva para: {nextNode.title}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
                                                    Fim do fluxo
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => openEditModal(node)}
                                                className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-neutral-500 text-xs font-semibold text-white transition"
                                            >
                                                Editar Frase
                                            </button>
                                        </div>
                                    </div>

                                    {index < nodes.length - 1 && (
                                        <div className="w-0.5 h-4 bg-neutral-800 mx-auto my-1" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* MODAL / DRAWER DE EDIÇÃO DE PASSO & FRASE DO BOT */}
            {editingNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                    <div className="relative w-full max-w-2xl rounded-2xl bg-[#111114] border border-neutral-800 text-[#f5f5f5] shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-5 my-8">
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
                            <div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e11d48] block">
                                    CONFIGURAR PASSO DO FUNIL
                                </span>
                                <h3 className="text-lg font-bold text-white mt-0.5">
                                    {formTitle || "Editar Passo"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingNode(null)}
                                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 grid place-items-center text-xs text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Configurações básicas */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    Título do Passo
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="Ex: Mensagem de Boas-Vindas"
                                    className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-neutral-800 text-sm text-white focus:border-neutral-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    Coluna no Kanban
                                </label>
                                <select
                                    value={formStage}
                                    onChange={(e) => setFormStage(e.target.value as FunnelStageId)}
                                    className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-neutral-800 text-xs text-white focus:border-neutral-500 outline-none"
                                >
                                    {FUNNEL_STAGES.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tipo de Função */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    Função deste passo
                                </label>
                                <select
                                    value={formType}
                                    onChange={(e) =>
                                        setFormType(e.target.value as FunnelStepType)
                                    }
                                    className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-neutral-800 text-xs text-white focus:border-neutral-500 outline-none"
                                >
                                    <option value="greeting">💬 Boas-Vindas</option>
                                    <option value="media">🎬 Envio de Mídia</option>
                                    <option value="offer">⭐ Oferta &amp; Preço</option>
                                    <option value="pix_charge">⚡ Geração de Pix</option>
                                    <option value="ai_assistant">🤖 Atendente com IA</option>
                                    <option value="delivery">🔓 Liberação / Pós-Venda</option>
                                    <option value="custom_message">📝 Mensagem Livre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    Ligar para o próximo passo
                                </label>
                                <select
                                    value={formNextStepId || ""}
                                    onChange={(e) => setFormNextStepId(e.target.value || null)}
                                    className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-neutral-800 text-xs text-white focus:border-neutral-500 outline-none"
                                >
                                    <option value="">— Finalizar fluxo aqui —</option>
                                    {nodes
                                        .filter((n) => n.id !== editingNode.id)
                                        .map((other) => (
                                            <option key={other.id} value={other.id}>
                                                → {other.title}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    Delay de envio (segundos)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={60}
                                    value={formDelay}
                                    onChange={(e) => setFormDelay(Number(e.target.value))}
                                    className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-neutral-800 text-xs text-white focus:border-neutral-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Mídia (se aplicável) */}
                        {(formType === "media" || formMediaType !== "none") && (
                            <div className="p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 space-y-3">
                                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                                    <Video className="w-3.5 h-3.5" />
                                    Configuração de Mídia do Passo
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            Tipo
                                        </label>
                                        <select
                                            value={formMediaType}
                                            onChange={(e) =>
                                                setFormMediaType(e.target.value as any)
                                            }
                                            className="w-full px-2.5 py-1.5 rounded bg-[#111114] border border-neutral-800 text-xs text-white"
                                        >
                                            <option value="none">Sem mídia</option>
                                            <option value="audio">🎙️ Áudio de Voz (PTT)</option>
                                            <option value="video">🎬 Vídeo MP4</option>
                                            <option value="image">🖼️ Imagem JPG/PNG</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            URL direta do arquivo de mídia
                                        </label>
                                        <input
                                            type="url"
                                            value={formMediaUrl}
                                            onChange={(e) => setFormMediaUrl(e.target.value)}
                                            placeholder="https://meusite.com/audio.mp3 ou video.mp4"
                                            className="w-full px-2.5 py-1.5 rounded bg-[#111114] border border-neutral-800 text-xs text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Palavras-chave do Pix (se aplicável) */}
                        {formType === "pix_charge" && (
                            <div className="p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 space-y-2">
                                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5" />
                                    Palavras-chave que ativam a geração do Pix
                                </span>
                                <input
                                    type="text"
                                    value={formKeywords}
                                    onChange={(e) => setFormKeywords(e.target.value)}
                                    placeholder="pix, quero, sim, liberar, assistir, comprar, pagar"
                                    className="w-full px-3 py-2 rounded bg-[#111114] border border-neutral-800 text-xs text-white"
                                />
                                <p className="text-[11px] text-neutral-500">
                                    Separe por vírgulas. Quando o lead digitar qualquer uma dessas
                                    palavras, o Pix Copia e Cola é gerado na hora via Mangofy.
                                </p>
                            </div>
                        )}

                        {/* FRASE DO BOT (MENSAGEM) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-neutral-300">
                                    Frase / Mensagem enviada pelo Bot no WhatsApp
                                </label>
                                <span className="text-[11px] text-neutral-500">
                                    {formMessage.length} caracteres
                                </span>
                            </div>

                            {/* Botões de variáveis com 1 clique */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="text-neutral-500 text-[10px]">Variáveis:</span>
                                <button
                                    type="button"
                                    onClick={() => insertVariable("{{NOME}}")}
                                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[10px]"
                                >
                                    + {"{{NOME}}"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertVariable("{{VALOR}}")}
                                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[10px]"
                                >
                                    + {"{{VALOR}}"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertVariable("{{PIX_COPIA_E_COLA}}")}
                                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[10px]"
                                >
                                    + {"{{PIX_COPIA_E_COLA}}"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertVariable("{{LINK_ACESSO}}")}
                                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[10px]"
                                >
                                    + {"{{LINK_ACESSO}}"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertVariable("{{TELEFONE}}")}
                                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[10px]"
                                >
                                    + {"{{TELEFONE}}"}
                                </button>
                            </div>

                            <textarea
                                rows={4}
                                value={formMessage}
                                onChange={(e) => setFormMessage(e.target.value)}
                                placeholder="Digite a mensagem do bot..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-neutral-800 text-sm text-white focus:border-neutral-500 outline-none font-sans leading-relaxed"
                            />
                        </div>

                        {/* SIMULADOR WHATSAPP AO VIVO */}
                        <div className="p-4 rounded-xl bg-[#06140e] border border-emerald-950/60 space-y-2">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                                <Eye className="w-3.5 h-3.5" />
                                Como o cliente vai ver no WhatsApp:
                            </span>

                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-[#005c4b] text-white text-xs leading-relaxed shadow-md whitespace-pre-wrap">
                                    {getFormattedPreview(formMessage) || "Mensagem em branco"}
                                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/70 mt-1">
                                        <span>12:00</span>
                                        <span>✓✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botões do Modal */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formEnabled}
                                    onChange={(e) => setFormEnabled(e.target.checked)}
                                />
                                <span>Passo ativo no atendimento</span>
                            </label>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingNode(null)}
                                    className="px-4 py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 text-xs font-semibold text-neutral-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveNode}
                                    className="px-5 py-2 rounded-lg bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold transition shadow-[0_4px_16px_rgba(225,29,72,0.3)]"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PREVIEW RÁPIDO DO BALÃO WHATSAPP */}
            {previewNode && (
                <div
                    onClick={() => setPreviewNode(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl bg-[#111114] border border-neutral-800 p-5 space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                            <span className="font-bold text-xs text-white">
                                {previewNode.title}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewNode(null)}
                                className="text-xs text-neutral-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0b1c14] border border-emerald-950/60 flex justify-start">
                            <div className="max-w-[95%] rounded-2xl rounded-tl-sm px-4 py-3 bg-[#005c4b] text-white text-xs leading-relaxed shadow whitespace-pre-wrap">
                                {getFormattedPreview(previewNode.message)}
                                <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/70 mt-1">
                                    <span>Agora</span>
                                    <span>✓✓</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                const n = previewNode;
                                setPreviewNode(null);
                                openEditModal(n);
                            }}
                            className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition"
                        >
                            Editar esta mensagem
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

