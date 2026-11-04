"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao cadastrar");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 1800);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col select-none">
            <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-10 h-[66px] bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.06]">
                <Link
                    href="/"
                    className="font-black text-[20px] sm:text-[22px] tracking-[0.06em] uppercase text-[#e11d48]"
                >
                    TVDRAMA REELS
                </Link>
                <Link
                    href="/auth/login"
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold transition"
                >
                    Já tenho conta
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
                            TVDRAMA REELS · CADASTRO
                        </span>
                        <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                            Criar conta
                        </h1>
                        <p className="text-xs text-[#9a9a9a] mt-1">
                            Preencha os dados abaixo para criar seu acesso
                        </p>
                    </div>

                    <div className="rounded-[22px] border border-white/12 bg-[#101014] p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
                        {success ? (
                            <div className="py-6 text-center space-y-2">
                                <div className="inline-flex px-3 py-1 rounded-full bg-[#22b868]/15 border border-[#22b868]/30 text-[#4ade8a] text-xs font-bold">
                                    Conta criada com sucesso!
                                </div>
                                <p className="text-xs text-[#9a9a9a]">
                                    Redirecionando para a tela de login...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {error && (
                                    <div className="p-3.5 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/35 text-xs font-medium text-[#fda4af]">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        Nome completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nome@exemplo.com"
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

                                <div>
                                    <label className="block text-xs font-semibold text-[#e6e6eb] mb-1.5">
                                        Confirmar senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-[#6e6e77] transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full min-h-[48px] mt-2 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition disabled:opacity-50"
                                >
                                    {loading ? "Criando conta..." : "Cadastrar"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-5 text-center text-xs text-[#9a9a9a]">
                        Já possui conta?{" "}
                        <Link href="/auth/login" className="text-white font-bold underline">
                            Entrar agora
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
