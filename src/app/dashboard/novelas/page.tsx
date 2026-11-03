"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Film,
    Plus,
    Trash2,
    Edit3,
    Play,
    Star,
    ListVideo,
    ExternalLink,
    Save,
    X,
    Youtube,
    Lock,
    Unlock,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Episode {
    id: string;
    number: number;
    title: string;
    description?: string | null;
    youtubeUrl: string;
    videoUrl?: string | null;
    isFree: boolean;
}

interface Drama {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string | null;
    category: string;
    tags?: string | null;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isFeatured: boolean;
    isVertical: boolean;
    status: "PUBLISHED" | "DRAFT";
    episodes: Episode[];
}

export default function AdminNovelasPage() {
    const [dramas, setDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);

    // Modal Nova / Editar Novela
    const [showDramaForm, setShowDramaForm] = useState(false);
    const [editingDramaId, setEditingDramaId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [category, setCategory] = useState("CEO & Vingança");
    const [totalEpisodes, setTotalEpisodes] = useState(40);
    const [freeEpisodesCount, setFreeEpisodesCount] = useState(2);
    const [isFeatured, setIsFeatured] = useState(false);
    const [savingDrama, setSavingDrama] = useState(false);

    // Formulário de Episódio
    const [epNumber, setEpNumber] = useState(1);
    const [epTitle, setEpTitle] = useState("");
    const [epYoutubeUrl, setEpYoutubeUrl] = useState("");
    const [epDescription, setEpDescription] = useState("");
    const [epIsFree, setEpIsFree] = useState(false);
    const [savingEp, setSavingEp] = useState(false);

    const loadDramas = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/dramas?all=true");
            const data = await res.json();
            if (data?.dramas) {
                setDramas(data.dramas);
                if (selectedDrama) {
                    const updated = data.dramas.find((d: Drama) => d.id === selectedDrama.id);
                    if (updated) setSelectedDrama(updated);
                }
            }
        } catch {
            toast.error("Erro ao carregar novelas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDramas();
    }, []);

    const openNewDramaModal = () => {
        setEditingDramaId(null);
        setTitle("");
        setSynopsis("");
        setCoverUrl("https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80");
        setBannerUrl("");
        setCategory("CEO & Vingança");
        setTotalEpisodes(45);
        setFreeEpisodesCount(2);
        setIsFeatured(false);
        setShowDramaForm(true);
    };

    const openEditDramaModal = (d: Drama) => {
        setEditingDramaId(d.id);
        setTitle(d.title);
        setSynopsis(d.synopsis);
        setCoverUrl(d.coverUrl);
        setBannerUrl(d.bannerUrl || "");
        setCategory(d.category);
        setTotalEpisodes(d.totalEpisodes);
        setFreeEpisodesCount(d.freeEpisodesCount);
        setIsFeatured(d.isFeatured);
        setShowDramaForm(true);
    };

    const handleSaveDrama = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingDrama(true);
        try {
            const url = editingDramaId ? `/api/dramas/${editingDramaId}` : "/api/dramas";
            const method = editingDramaId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    synopsis,
                    coverUrl,
                    bannerUrl: bannerUrl || coverUrl,
                    category,
                    totalEpisodes,
                    freeEpisodesCount,
                    isFeatured
                })
            });

            if (!res.ok) throw new Error("Falha ao salvar");
            toast.success(editingDramaId ? "Novela atualizada!" : "Novela cadastrada com sucesso!");
            setShowDramaForm(false);
            await loadDramas();
        } catch {
            toast.error("Erro ao salvar novela");
        } finally {
            setSavingDrama(false);
        }
    };

    const handleDeleteDrama = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta novela e todos os seus episódios?")) return;
        try {
            await fetch(`/api/dramas/${id}`, { method: "DELETE" });
            toast.success("Novela excluída");
            if (selectedDrama?.id === id) setSelectedDrama(null);
            await loadDramas();
        } catch {
            toast.error("Erro ao excluir novela");
        }
    };

    const handleOpenEpisodes = (d: Drama) => {
        setSelectedDrama(d);
        const nextEp = (d.episodes?.length || 0) + 1;
        setEpNumber(nextEp);
        setEpTitle(`Ep. ${String(nextEp).padStart(2, "0")} — `);
        setEpYoutubeUrl("");
        setEpDescription("");
        setEpIsFree(nextEp <= d.freeEpisodesCount);
    };

    const handleSaveEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDrama) return;
        setSavingEp(true);
        try {
            const res = await fetch(`/api/dramas/${selectedDrama.id}/episodes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    number: epNumber,
                    title: epTitle || `Episódio ${epNumber}`,
                    youtubeUrl: epYoutubeUrl,
                    description: epDescription,
                    isFree: epIsFree
                })
            });
            if (!res.ok) throw new Error("Erro ao salvar episódio");
            toast.success(`Episódio ${epNumber} salvo!`);
            await loadDramas();
            const nextNum = epNumber + 1;
            setEpNumber(nextNum);
            setEpTitle(`Ep. ${String(nextNum).padStart(2, "0")} — `);
            setEpYoutubeUrl("");
            setEpDescription("");
            setEpIsFree(nextNum <= selectedDrama.freeEpisodesCount);
        } catch {
            toast.error("Erro ao adicionar episódio");
        } finally {
            setSavingEp(false);
        }
    };

    const handleDeleteEpisode = async (episodeId: string) => {
        if (!selectedDrama) return;
        try {
            await fetch(`/api/dramas/${selectedDrama.id}/episodes?episodeId=${episodeId}`, {
                method: "DELETE"
            });
            toast.success("Episódio removido");
            await loadDramas();
        } catch {
            toast.error("Erro ao remover episódio");
        }
    };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2.5">
                        <Film className="w-6 h-6 text-rose-500" />
                        Catálogo de Novelas & Episódios (YouTube)
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre suas novelas verticais e adicione os links dos vídeos do YouTube sem consumir espaço na VPS.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Ver Site ao Vivo
                    </Link>
                    <button
                        type="button"
                        onClick={openNewDramaModal}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Novela
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Lista de Novelas */}
                <div className="lg:col-span-7 space-y-4">
                    {loading ? (
                        <div className="p-12 rounded-2xl border border-border bg-card flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                        </div>
                    ) : (
                        dramas.map((drama) => (
                            <div
                                key={drama.id}
                                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row gap-4 ${
                                    selectedDrama?.id === drama.id
                                        ? "border-rose-500 bg-rose-500/5"
                                        : "border-border bg-card hover:border-rose-500/40"
                                }`}
                            >
                                <img
                                    src={drama.coverUrl}
                                    alt={drama.title}
                                    className="w-24 h-36 object-cover rounded-xl shrink-0 border border-white/10"
                                />

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[11px] font-bold">
                                                {drama.category}
                                            </span>
                                            {drama.isFeatured && (
                                                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[11px] font-bold flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-400" /> Destaque na Capa
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                • {drama.episodes?.length || 0} episódios cadastrados (Ep 1-{drama.freeEpisodesCount} grátis)
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base truncate">{drama.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {drama.synopsis}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEpisodes(drama)}
                                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                                        >
                                            <ListVideo className="w-3.5 h-3.5" />
                                            Gerenciar Episódios ({drama.episodes?.length || 0})
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openEditDramaModal(drama)}
                                            className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-xs font-medium flex items-center gap-1"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Editar
                                        </button>

                                        <Link
                                            href={`/assistir/${drama.slug}`}
                                            target="_blank"
                                            className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-xs font-medium flex items-center gap-1"
                                        >
                                            <Play className="w-3.5 h-3.5" /> Assistir
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDrama(drama.id)}
                                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 ml-auto"
                                            title="Excluir novela"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Painel Lateral: Gerenciador de Episódios do YouTube */}
                <div className="lg:col-span-5">
                    {selectedDrama ? (
                        <div className="p-5 rounded-2xl border border-border bg-card space-y-5 sticky top-4">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-rose-400 font-bold">
                                        Episódios da Novela
                                    </span>
                                    <h3 className="font-bold text-base leading-snug">
                                        {selectedDrama.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDrama(null)}
                                    className="p-1.5 rounded-lg hover:bg-accent"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Formulário para Adicionar / Atualizar Episódio */}
                            <form onSubmit={handleSaveEpisode} className="space-y-3 bg-accent/30 p-3.5 rounded-xl border border-border">
                                <div className="text-xs font-bold flex items-center gap-1.5 text-rose-400">
                                    <Youtube className="w-4 h-4" />
                                    Adicionar / Editar Episódio (Link do YouTube)
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[11px] text-muted-foreground mb-1">
                                            Nº Episódio
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            required
                                            value={epNumber}
                                            onChange={(e) => setEpNumber(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] text-muted-foreground mb-1">
                                            Título do Episódio
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ex: Ep. 01 — O Casamento"
                                            value={epTitle}
                                            onChange={(e) => setEpTitle(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] text-muted-foreground mb-1">
                                        Link do Vídeo no YouTube (Normal, Shorts ou Não Listado)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                                        value={epYoutubeUrl}
                                        onChange={(e) => setEpYoutubeUrl(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={epIsFree}
                                            onChange={(e) => setEpIsFree(e.target.checked)}
                                            className="rounded border-border"
                                        />
                                        <span>Episódio Grátis (Aberto para todos)</span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={savingEp}
                                        className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
                                    >
                                        {savingEp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                        Salvar Episódio
                                    </button>
                                </div>
                            </form>

                            {/* Lista de Episódios Cadastrados */}
                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {(selectedDrama.episodes || []).map((ep) => (
                                    <div
                                        key={ep.id}
                                        className="p-2.5 rounded-xl border border-border bg-background/60 flex items-center justify-between gap-2 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 font-bold flex items-center justify-center shrink-0">
                                                {ep.number}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="font-semibold truncate">{ep.title}</div>
                                                <div className="text-[11px] text-muted-foreground truncate">
                                                    {ep.youtubeUrl}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                                    ep.isFree || ep.number <= selectedDrama.freeEpisodesCount
                                                        ? "bg-emerald-500/15 text-emerald-400"
                                                        : "bg-amber-500/15 text-amber-400"
                                                }`}
                                            >
                                                {ep.isFree || ep.number <= selectedDrama.freeEpisodesCount ? (
                                                    <>
                                                        <Unlock className="w-3 h-3" /> Grátis
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-3 h-3" /> VIP
                                                    </>
                                                )}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEpNumber(ep.number);
                                                    setEpTitle(ep.title);
                                                    setEpYoutubeUrl(ep.youtubeUrl);
                                                    setEpDescription(ep.description || "");
                                                    setEpIsFree(ep.isFree);
                                                }}
                                                className="p-1.5 rounded hover:bg-accent text-muted-foreground"
                                                title="Editar episódio"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEpisode(ep.id)}
                                                className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                                                title="Remover episódio"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl border border-dashed border-border bg-card/50 text-center">
                            <ListVideo className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-60" />
                            <h3 className="font-semibold text-sm">Selecione uma Novela</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Clique em &ldquo;Gerenciar Episódios&rdquo; em qualquer novela ao lado para colar os links do YouTube de cada episódio.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Criar / Editar Novela */}
            {showDramaForm && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="font-bold text-lg">
                                {editingDramaId ? "Editar Novela" : "Cadastrar Nova Novela Vertical"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowDramaForm(false)}
                                className="p-1.5 rounded-lg hover:bg-accent"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDrama} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-medium mb-1">Título da Novela</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: O Bilionário Disfarçado e a Noiva Rejeitada"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">Sinopse Envolvente</label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Resumo dramático que deixa o público curioso..."
                                    value={synopsis}
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1">Categoria</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Ex: CEO & Vingança"
                                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        Episódios Grátis (Degustação)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={freeEpisodesCount}
                                        onChange={(e) => setFreeEpisodesCount(Number(e.target.value))}
                                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">URL da Imagem de Capa (Vertical)</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://..."
                                    value={coverUrl}
                                    onChange={(e) => setCoverUrl(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                    />
                                    <span>Destacar no Topo do Site (Banner Principal)</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowDramaForm(false)}
                                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingDrama}
                                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
                                >
                                    {savingDrama && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Salvar Novela
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

