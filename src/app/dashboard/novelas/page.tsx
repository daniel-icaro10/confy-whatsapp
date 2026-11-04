"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

    const [showDramaForm, setShowDramaForm] = useState(false);
    const [editingDramaId, setEditingDramaId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [category, setCategory] = useState("Drama");
    const [totalEpisodes, setTotalEpisodes] = useState(40);
    const [freeEpisodesCount, setFreeEpisodesCount] = useState(2);
    const [isFeatured, setIsFeatured] = useState(false);
    const [savingDrama, setSavingDrama] = useState(false);

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
        setCoverUrl("");
        setBannerUrl("");
        setCategory("Drama");
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
            toast.success(editingDramaId ? "Novela atualizada" : "Novela cadastrada");
            setShowDramaForm(false);
            await loadDramas();
        } catch {
            toast.error("Erro ao salvar novela");
        } finally {
            setSavingDrama(false);
        }
    };

    const handleDeleteDrama = async (id: string) => {
        if (!confirm("Deseja excluir esta novela e todos os episódios?")) return;
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
        setEpTitle(`Episódio ${nextEp}`);
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
            toast.success(`Episódio ${epNumber} salvo`);
            await loadDramas();
            const nextNum = epNumber + 1;
            setEpNumber(nextNum);
            setEpTitle(`Episódio ${nextNum}`);
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
        <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        Novelas e episódios
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                        Gerencie o catálogo e os links de vídeo do YouTube.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={openNewDramaModal}
                        className="px-4 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium transition"
                    >
                        Nova novela
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-3">
                    {loading ? (
                        <div className="p-8 rounded-lg border border-neutral-800 bg-[#111111] text-center text-xs text-neutral-400">
                            Carregando...
                        </div>
                    ) : dramas.length === 0 ? (
                        <div className="p-8 rounded-lg border border-neutral-800 bg-[#111111] text-center text-xs text-neutral-400">
                            Nenhuma novela cadastrada. Clique em &quot;Nova novela&quot; acima para adicionar a primeira.
                        </div>
                    ) : (
                        dramas.map((drama) => (
                            <div
                                key={drama.id}
                                className={`p-4 rounded-lg border transition flex flex-col sm:flex-row gap-4 ${
                                    selectedDrama?.id === drama.id
                                        ? "border-neutral-500 bg-[#161616]"
                                        : "border-neutral-800 bg-[#111111]"
                                }`}
                            >
                                <img
                                    src={drama.coverUrl}
                                    alt={drama.title}
                                    className="w-20 h-28 object-cover rounded shrink-0 border border-neutral-800"
                                />

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1 text-[11px] text-neutral-400">
                                            <span>{drama.category}</span>
                                            <span>·</span>
                                            <span>{drama.episodes?.length || 0} episódios ({drama.freeEpisodesCount} grátis)</span>
                                            {drama.isFeatured && (
                                                <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-white text-[10px]">
                                                    Destaque
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-sm text-white truncate">{drama.title}</h3>
                                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                                            {drama.synopsis}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEpisodes(drama)}
                                            className="px-3 py-1.5 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium transition"
                                        >
                                            Episódios ({drama.episodes?.length || 0})
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openEditDramaModal(drama)}
                                            className="px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200"
                                        >
                                            Editar
                                        </button>

                                        <Link
                                            href={`/assistir/${drama.slug}`}
                                            target="_blank"
                                            className="px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200"
                                        >
                                            Visualizar
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDrama(drama.id)}
                                            className="px-2.5 py-1.5 rounded text-xs text-red-400 hover:bg-red-950/30 ml-auto"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="lg:col-span-5">
                    {selectedDrama ? (
                        <div className="p-5 rounded-lg border border-neutral-800 bg-[#111111] space-y-5 sticky top-4">
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                                <div>
                                    <span className="text-[11px] text-neutral-400">
                                        Gerenciar episódios
                                    </span>
                                    <h3 className="font-medium text-sm text-white">
                                        {selectedDrama.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDrama(null)}
                                    className="text-xs text-neutral-400 hover:text-white"
                                >
                                    Fechar
                                </button>
                            </div>

                            <form onSubmit={handleSaveEpisode} className="space-y-3 bg-[#0a0a0a] p-3.5 rounded border border-neutral-800">
                                <div className="text-xs font-medium text-white">
                                    Adicionar ou atualizar episódio
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            Número
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            required
                                            value={epNumber}
                                            onChange={(e) => setEpNumber(Number(e.target.value))}
                                            className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] text-neutral-400 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={epTitle}
                                            onChange={(e) => setEpTitle(e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] text-neutral-400 mb-1">
                                        URL do vídeo no YouTube
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={epYoutubeUrl}
                                        onChange={(e) => setEpYoutubeUrl(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded bg-[#111111] border border-neutral-800 text-xs text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={epIsFree}
                                            onChange={(e) => setEpIsFree(e.target.checked)}
                                        />
                                        <span>Episódio gratuito</span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={savingEp}
                                        className="px-3.5 py-1.5 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium"
                                    >
                                        {savingEp ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </form>

                            <div className="divide-y divide-neutral-800 max-h-80 overflow-y-auto">
                                {(selectedDrama.episodes || []).map((ep) => (
                                    <div
                                        key={ep.id}
                                        className="py-2.5 flex items-center justify-between gap-2 text-xs"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-medium text-white truncate">
                                                {ep.number}. {ep.title}
                                            </div>
                                            <div className="text-[11px] text-neutral-500 truncate">
                                                {ep.youtubeUrl}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] text-neutral-400">
                                                {ep.isFree || ep.number <= selectedDrama.freeEpisodesCount
                                                    ? "Grátis"
                                                    : "Pago"}
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
                                                className="text-xs text-neutral-400 hover:text-white"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEpisode(ep.id)}
                                                className="text-xs text-red-400 hover:text-red-300"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-lg border border-neutral-800 bg-[#111111] text-center">
                            <p className="text-xs text-neutral-400">
                                Selecione uma novela ao lado para cadastrar ou editar os episódios.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showDramaForm && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-[#111111] p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <h3 className="font-semibold text-base text-white">
                                {editingDramaId ? "Editar novela" : "Nova novela"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowDramaForm(false)}
                                className="text-xs text-neutral-400 hover:text-white"
                            >
                                Fechar
                            </button>
                        </div>

                        <form onSubmit={handleSaveDrama} className="space-y-3.5">
                            <div>
                                <label className="block text-xs text-neutral-300 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-300 mb-1">Sinopse</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={synopsis}
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-neutral-300 mb-1">Categoria</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-neutral-300 mb-1">
                                        Episódios gratuitos
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={freeEpisodesCount}
                                        onChange={(e) => setFreeEpisodesCount(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-300 mb-1">URL da capa</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://..."
                                    value={coverUrl}
                                    onChange={(e) => setCoverUrl(e.target.value)}
                                    className="w-full px-3 py-2 rounded bg-[#0a0a0a] border border-neutral-800 text-sm text-white"
                                />
                            </div>

                            <div className="pt-1">
                                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                    />
                                    <span>Exibir como destaque principal</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setShowDramaForm(false)}
                                    className="px-4 py-2 rounded border border-neutral-700 text-xs text-neutral-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingDrama}
                                    className="px-4 py-2 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium"
                                >
                                    {savingDrama ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
