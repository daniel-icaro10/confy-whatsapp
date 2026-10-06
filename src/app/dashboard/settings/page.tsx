"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Save, KeyRound, User, Building2, Shield, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: authSession } = useSession();
    // @ts-ignore
    const userRole = authSession?.user?.role;
    const isSuperAdmin = userRole === "SUPERADMIN";

    // Global system config state (Superadmin)
    const [systemConfig, setSystemConfig] = useState({
        appName: "Confy WhatsApp",
        logoUrl: "",
        faviconUrl: "/favicon.ico",
        timezone: "America/Sao_Paulo",
        enableRegistration: true
    });
    const [systemLoading, setSystemLoading] = useState(false);
    const [timezones, setTimezones] = useState<string[]>([
        "UTC", "America/Sao_Paulo", "America/Manaus", "America/Fortaleza", "America/Recife", "America/Noronha"
    ]);

    // User profile state (All users)
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        role: "",
        plan: "PRO",
        maxSessions: 5
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Active tab for SuperAdmin
    const [activeTab, setActiveTab] = useState<"platform" | "profile">("platform");

    useEffect(() => {
        try {
            if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
                const list = Intl.supportedValuesOf("timeZone");
                if (!list.includes("UTC")) list.push("UTC");
                list.sort();
                setTimezones(list);
            }
        } catch (e) {
            console.error("Failed to load timezones dynamically", e);
        }
    }, []);

    // Load system settings (for SuperAdmin)
    useEffect(() => {
        if (isSuperAdmin) {
            fetch('/api/settings/system')
                .then(r => { if (!r.ok) throw new Error(); return r.json(); })
                .then(responseData => {
                    const data = responseData?.data;
                    if (data && !responseData.error) {
                        setSystemConfig({
                            appName: data.appName || "Confy WhatsApp",
                            logoUrl: data.logoUrl || "",
                            faviconUrl: data.faviconUrl || "/favicon.ico",
                            timezone: data.timezone || "America/Sao_Paulo",
                            enableRegistration: data.enableRegistration !== undefined ? data.enableRegistration : true
                        });
                    }
                })
                .catch(() => { });
        }
    }, [isSuperAdmin]);

    // Load user personal profile
    useEffect(() => {
        fetch('/api/user/profile')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(res => {
                if (res.status && res.data) {
                    setProfile({
                        name: res.data.name || "",
                        email: res.data.email || "",
                        phone: res.data.phone || "",
                        companyName: res.data.companyName || "",
                        role: res.data.role || "",
                        plan: res.data.plan || "PRO",
                        maxSessions: res.data.maxSessions || 5
                    });
                }
            })
            .catch(() => { });
    }, []);

    const handleSaveSystem = async () => {
        setSystemLoading(true);
        try {
            const res = await fetch('/api/settings/system', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(systemConfig)
            });

            if (res.ok) {
                toast.success("Configurações do sistema atualizadas. Atualize a página para ver as alterações.");
            } else {
                toast.error("Falha ao atualizar as configurações do sistema");
            }
        } catch (e) {
            console.error(e);
            toast.error("Erro ao salvar as configurações do sistema");
        } finally {
            setSystemLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    companyName: profile.companyName
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Dados do perfil atualizados com sucesso!");
            } else {
                toast.error(data.message || "Erro ao atualizar perfil");
            }
        } catch (e) {
            console.error(e);
            toast.error("Erro ao salvar dados do perfil");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword) {
            toast.error("Informe sua senha atual");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("A nova senha deve ter no mínimo 6 caracteres");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("A confirmação de senha não confere");
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Senha alterada com sucesso!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.message || "Falha ao alterar senha");
            }
        } catch (e) {
            console.error(e);
            toast.error("Erro ao alterar senha");
        } finally {
            setPasswordLoading(false);
        }
    };

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
                    {isSuperAdmin ? "Configurações da Plataforma" : "Minha Conta & Configurações"}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                    {isSuperAdmin
                        ? "Gerenciamento global de white-label, branding e parâmetros do sistema."
                        : "Gerencie seus dados pessoais, informações da empresa e credenciais de acesso."}
                </p>
            </div>

            {/* Abas se for Superadmin */}
            {isSuperAdmin && (
                <div className="flex gap-2 border-b pb-2">
                    <Button
                        variant={activeTab === "platform" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("platform")}
                        className="gap-2"
                    >
                        <Globe size={14} /> White-label & Plataforma
                    </Button>
                    <Button
                        variant={activeTab === "profile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                        className="gap-2"
                    >
                        <User size={14} /> Perfil & Senha Master
                    </Button>
                </div>
            )}

            {/* PAINEL SUPERADMIN - PLATAFORMA */}
            {isSuperAdmin && activeTab === "platform" && (
                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" /> Configuração White-label
                            </CardTitle>
                            <CardDescription>Defina a identidade visual da plataforma para todos os clientes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Nome do aplicativo</Label>
                                    <Input
                                        placeholder="Confy WhatsApp"
                                        value={systemConfig.appName}
                                        onChange={(e) => setSystemConfig(prev => ({ ...prev, appName: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">Exibido na barra lateral e título do navegador.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Fuso horário padrão</Label>
                                    <select
                                        className={inputClass}
                                        value={systemConfig.timezone}
                                        onChange={(e) => setSystemConfig(prev => ({ ...prev, timezone: e.target.value }))}
                                    >
                                        {timezones.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-muted-foreground">Fuso horário padrão para disparos e relatórios.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>URL do Logo</Label>
                                    <Input
                                        placeholder="https://suaempresa.com/logo.png"
                                        value={systemConfig.logoUrl}
                                        onChange={(e) => setSystemConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">Logo exibido no menu e topo.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label>URL do Favicon</Label>
                                    <Input
                                        placeholder="/favicon.ico"
                                        value={systemConfig.faviconUrl}
                                        onChange={(e) => setSystemConfig(prev => ({ ...prev, faviconUrl: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">Ícone na aba do navegador.</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between space-x-2 pt-2 border-t border-border/50">
                                <Label htmlFor="enable-registration" className="flex flex-col space-y-1">
                                    <span>Permitir cadastro público de usuários</span>
                                    <span className="font-normal text-xs text-muted-foreground">Se desativado, apenas o Superadmin cria novas empresas.</span>
                                </Label>
                                <Switch
                                    id="enable-registration"
                                    checked={systemConfig.enableRegistration}
                                    onCheckedChange={c => setSystemConfig(prev => ({ ...prev, enableRegistration: c }))}
                                />
                            </div>

                            <div className="pt-2">
                                <Button onClick={handleSaveSystem} disabled={systemLoading} className="gap-2">
                                    {systemLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Salvar Configuração Master
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Atualizações da Plataforma</CardTitle>
                            <CardDescription>Verifique se há novas versões disponíveis no repositório.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={async () => {
                                    setSystemLoading(true);
                                    try {
                                        const res = await fetch("/api/system/check-updates", { method: "POST" });
                                        const data = await res.json();
                                        if (data.status) {
                                            toast.success(data.message || "Verificação concluída!");
                                        } else {
                                            toast.error(data.message || "Falha ao verificar atualizações");
                                        }
                                    } catch (e) {
                                        toast.error("Erro ao verificar atualizações");
                                    } finally {
                                        setSystemLoading(false);
                                    }
                                }}
                                disabled={systemLoading}
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${systemLoading ? 'animate-spin' : ''}`} />
                                Verificar atualizações no GitHub
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* PAINEL PESSOAL & EMPRESA (Disponível para todos os usuários) */}
            {(!isSuperAdmin || activeTab === "profile") && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Dados Cadastrais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" /> Perfil & Dados
                                </span>
                                <Badge variant="outline" className="uppercase font-mono text-[10px]">
                                    {profile.role || userRole}
                                </Badge>
                            </CardTitle>
                            <CardDescription>Seus dados de identificação na plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input
                                    value={profile.name}
                                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>E-mail (Login)</Label>
                                <Input
                                    value={profile.email}
                                    disabled
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                                <p className="text-[11px] text-muted-foreground">O e-mail de acesso não pode ser alterado diretamente.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Telefone / WhatsApp</Label>
                                <Input
                                    value={profile.phone}
                                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="(11) 99999-9999"
                                />
                            </div>

                            {userRole !== "STAFF" && (
                                <div className="space-y-2">
                                    <Label>Nome da Empresa</Label>
                                    <Input
                                        value={profile.companyName}
                                        onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                                        placeholder="Minha Empresa Ltda"
                                    />
                                </div>
                            )}

                            {userRole === "OWNER" && (
                                <div className="p-3 bg-muted/30 rounded-lg border text-xs space-y-1">
                                    <div className="flex justify-between font-medium">
                                        <span>Plano Contratado:</span>
                                        <span className="text-primary font-bold">{profile.plan}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Limite de Conexões WhatsApp:</span>
                                        <span>{profile.maxSessions} instâncias</span>
                                    </div>
                                </div>
                            )}

                            <Button onClick={handleSaveProfile} disabled={profileLoading} className="w-full gap-2">
                                {profileLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Alterar Senha */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-amber-500" /> Segurança & Senha
                            </CardTitle>
                            <CardDescription>Altere sua senha de acesso periodicamente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Senha Atual</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        placeholder="Digite sua senha atual"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nova Senha</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        placeholder="Mínimo de 6 caracteres"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirmar Nova Senha</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Repita a nova senha"
                                    />
                                </div>

                                <Button type="submit" variant="outline" disabled={passwordLoading} className="w-full gap-2">
                                    {passwordLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                    Atualizar Senha
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
