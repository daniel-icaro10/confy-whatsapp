"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const defaultMode = searchParams.get("modo") === "assinante" ? "subscriber" : "admin";

    const [mode, setMode] = useState<"subscriber" | "admin">(defaultMode);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubscriberSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/viewer/access?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();
            if (data?.isVip && data?.phone) {
                localStorage.setItem("sdc_viewer_phone", data.phone);
                localStorage.setItem("sdc_viewer_vip", "true");
                window.location.href = `/?phone=${encodeURIComponent(data.phone)}`;
            } else {
                setError("Nenhuma assinatura ativa encontrada para este número de WhatsApp.");
            }
        } catch {
            setError("Erro ao verificar seu acesso. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAdminSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: email.trim(),
                password
            });

            if (result?.error) {
                setError("E-mail ou senha inválidos.");
            } else {
                window.location.href = callbackUrl;
                router.refresh();
            }
        } catch {
            setError("Erro ao conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col select-none">
            {/* TOPO FIXO PADRÃO TOPDORAMAX */}
            <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-10 h-[66px] bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.06]">
                <Link
                    href="/"
                    className="font-black text-[20px] sm:text-[22px] tracking-[0.06em] uppercase text-[#e11d48]"
                >
                    TVDRAMA REELS
                </Link>
                <Link
                    href="/"
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold transition"
                >
                    ← Voltar ao catálogo
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12 relative overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[#e11d48]/12 blur-[110px] pointer-events-none"
                />

                <div className="relative z-10 w-full max-w-[420px]">
                    <div className="text-center mb-5">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48] block">
                            TVDRAMA REELS · ACESSO OFICIAL
                        </span>
                        <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                            Entrar na sua conta
                        </h1>
                        <p className="text-xs text-[#9a9a9a] mt-1">
                            {mode === "subscriber"
                                ? "Use seu WhatsApp cadastrado para liberar todas as séries"
                                : "Acesso restrito ao painel administrativo"}
                        </p>
                    </div>

                    <div className="rounded-[22px] border border-white/12 bg-[#101014] p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
                        {/* Abas Assinante vs Administração */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#09090b] border border-white/10 mb-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("subscriber");
                                    setError(null);
                                }}
                                className={`py-2 px-3 rounded-full text-xs font-bold transition ${
                                    mode === "subscriber"
                                        ? "bg-white text-black"
                                        : "text-[#9a9a9a] hover:text-white"
                                }`}
                            >
                                Sou Assinante
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("admin");
                                    setError(null);
                                }}
                                className={`py-2 px-3 rounded-full text-xs font-bold transition ${
                                    mode === "admin"
                                        ? "bg-white text-black"
                                        : "text-[#9a9a9a] hover:text-white"
                                }`}
                            >
                                Administração
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3.5 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/35 text-xs font-medium text-[#fda4af]">
                                {error}
                            </div>
                        )}

                        {mode === "subscriber" ? (
                            <form onSubmit={handleSubscriberSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        WhatsApp cadastrado (com DDD)
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(11) 99999-9999"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50"
                                >
                                    {loading ? "Verificando..." : "Liberar Catálogo"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAdminSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        E-mail administrativo
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin@tvdramareels.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full min-h-[48px] rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50"
                                >
                                    {loading ? "Entrando..." : "Entrar no Painel"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-5 text-center">
                        <Link
                            href="/"
                            className="text-xs font-semibold text-[#9a9a9a] hover:text-white transition"
                        >
                            ← Voltar para a Página Inicial
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <LoginForm />
        </Suspense>
    );
}
