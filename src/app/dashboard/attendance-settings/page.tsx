"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Clock,
    Star,
    Save,
    Calendar,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Globe,
    Sparkles,
    Shield
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/components/dashboard/session-provider";
import { SessionGuard } from "@/components/dashboard/session-guard";
import { getAttendanceSettings, updateAttendanceSettings } from "@/app/dashboard/chat/actions";
import { cn } from "@/lib/utils";

const DAYS_NAMES = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

interface BusinessHourItem {
    dayOfWeek: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}

export default function AttendanceSettingsPage() {
    return (
        <SessionGuard>
            <AttendanceSettingsContent />
        </SessionGuard>
    );
}

function AttendanceSettingsContent() {
    const { sessionId } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Settings state
    const [csatEnabled, setCsatEnabled] = useState(true);
    const [csatMessage, setCsatMessage] = useState("");
    const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false);
    const [outOfOfficeMessage, setOutOfOfficeMessage] = useState("");
    const [timezone, setTimezone] = useState("America/Sao_Paulo");
    const [businessHours, setBusinessHours] = useState<BusinessHourItem[]>([]);

    const loadSettings = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const data = await getAttendanceSettings(sessionId);
            setCsatEnabled(data.csatEnabled);
            setCsatMessage(data.csatMessage);
            setBusinessHoursEnabled(data.businessHoursEnabled);
            setOutOfOfficeMessage(data.outOfOfficeMessage);
            setTimezone(data.timezone);
            setBusinessHours(data.businessHours);
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar configurações de atendimento");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        if (sessionId) {
            loadSettings();
        }
    }, [sessionId, loadSettings]);

    const handleSave = async () => {
        if (!sessionId) return;
        setSaving(true);
        try {
            await updateAttendanceSettings(sessionId, {
                csatEnabled,
                csatMessage,
                businessHoursEnabled,
                outOfOfficeMessage,
                timezone,
                businessHours
            });
            toast.success("Configurações de atendimento salvas com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    const handleHourChange = (dayIndex: number, field: "isOpen" | "openTime" | "closeTime", value: any) => {
        setBusinessHours(prev => {
            const next = [...prev];
            const item = next.find(h => h.dayOfWeek === dayIndex);
            if (item) {
                (item as any)[field] = value;
            }
            return next;
        });
    };

    if (!sessionId) {
        return (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">Nenhuma sessão selecionada</h2>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                    Conecte ou selecione uma sessão de WhatsApp para gerenciar os horários e CSAT.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                        <Clock className="h-6 w-6 text-primary" />
                        Horários & Pesquisa de Satisfação (CSAT)
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure o expediente de atendimento automático e avalie a satisfação dos clientes ao encerrar conversas.
                    </p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="gap-2 shadow-sm font-medium"
                >
                    {saving ? (
                        <>
                            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            <span>Salvando...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            <span>Salvar Alterações</span>
                        </>
                    )}
                </Button>
            </div>

            {loading ? (
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Card 1: Horário de Funcionamento */}
                    <Card className="border-border/60 shadow-xs">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Calendar className="h-4.5 w-4.5 text-primary" />
                                        Horário de Expediente (Business Hours)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Defina os dias e horas em que sua equipe está ativa. Clientes fora do horário receberão aviso automático.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {businessHoursEnabled ? "Ativado" : "Desativado"}
                                    </span>
                                    <Switch
                                        checked={businessHoursEnabled}
                                        onCheckedChange={setBusinessHoursEnabled}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Timezone */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Fuso Horário de Referência:</span>
                                </div>
                                <Select value={timezone} onValueChange={setTimezone}>
                                    <SelectTrigger className="w-56 h-8 text-xs bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="text-xs">
                                        <SelectItem value="America/Sao_Paulo">América/São Paulo (GMT-3 Brasília)</SelectItem>
                                        <SelectItem value="America/Manaus">América/Manaus (GMT-4)</SelectItem>
                                        <SelectItem value="America/Belem">América/Belém (GMT-3)</SelectItem>
                                        <SelectItem value="America/Fortaleza">América/Fortaleza (GMT-3)</SelectItem>
                                        <SelectItem value="America/Recife">América/Recife (GMT-3)</SelectItem>
                                        <SelectItem value="America/Cuiaba">América/Cuiabá (GMT-4)</SelectItem>
                                        <SelectItem value="America/Campo_Grande">América/Campo Grande (GMT-4)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Weekly schedule */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground block">
                                    Grade de Horários da Semana
                                </label>
                                <div className="divide-y divide-border/40 border border-border/50 rounded-xl overflow-hidden bg-background">
                                    {businessHours.map((hour) => (
                                        <div
                                            key={hour.dayOfWeek}
                                            className={cn(
                                                "p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors",
                                                hour.isOpen ? "bg-background" : "bg-muted/30 opacity-75"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 w-40">
                                                <Switch
                                                    checked={hour.isOpen}
                                                    onCheckedChange={(val) => handleHourChange(hour.dayOfWeek, "isOpen", val)}
                                                />
                                                <span className={cn("font-medium", hour.isOpen ? "text-foreground" : "text-muted-foreground")}>
                                                    {DAYS_NAMES[hour.dayOfWeek]}
                                                </span>
                                            </div>

                                            {hour.isOpen ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground text-[11px]">Das</span>
                                                    <Input
                                                        type="time"
                                                        value={hour.openTime}
                                                        onChange={(e) => handleHourChange(hour.dayOfWeek, "openTime", e.target.value)}
                                                        className="h-8 w-28 text-xs font-mono"
                                                    />
                                                    <span className="text-muted-foreground text-[11px]">às</span>
                                                    <Input
                                                        type="time"
                                                        value={hour.closeTime}
                                                        onChange={(e) => handleHourChange(hour.dayOfWeek, "closeTime", e.target.value)}
                                                        className="h-8 w-28 text-xs font-mono"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">
                                                    Fechado durante todo o dia
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Out of Office Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                                    <span>Mensagem Automática de Ausência</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">
                                        Disparada apenas 1 vez a cada 4 horas por contato
                                    </span>
                                </label>
                                <Textarea
                                    value={outOfOfficeMessage}
                                    onChange={(e) => setOutOfOfficeMessage(e.target.value)}
                                    placeholder="Ex: Olá! Nosso atendimento funciona de Seg a Sex das 08h às 18h..."
                                    rows={3}
                                    className="text-xs resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Pesquisa de Satisfação (CSAT) */}
                    <Card className="border-border/60 shadow-xs">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                                        Pesquisa de Satisfação (CSAT - Customer Satisfaction)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Ao clicar em &quot;Finalizar Atendimento&quot;, uma pesquisa de 1 a 5 estrelas é disparada para o cliente avaliar a conversa.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {csatEnabled ? "Ativado" : "Desativado"}
                                    </span>
                                    <Switch
                                        checked={csatEnabled}
                                        onCheckedChange={setCsatEnabled}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground block">
                                    Texto da Mensagem de Pesquisa
                                </label>
                                <Textarea
                                    value={csatMessage}
                                    onChange={(e) => setCsatMessage(e.target.value)}
                                    placeholder="⭐ Pesquisa de Satisfação..."
                                    rows={6}
                                    className="text-xs font-mono resize-none leading-relaxed"
                                />
                            </div>

                            {/* Explanatory callout */}
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground flex items-start gap-3">
                                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-amber-700 dark:text-amber-400">
                                        Como funciona a captura automática de nota:
                                    </p>
                                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                                        Quando o cliente responde com qualquer número de 1 a 5 (ex: &quot;5&quot; ou &quot;nota 4&quot;), o sistema reconhece a avaliação, atualiza o ticket com a nota, vincula a pontuação ao atendente que realizou o chamado e envia automaticamente uma mensagem calorosa de agradecimento sem reabrir a fila!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
