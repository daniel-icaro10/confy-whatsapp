"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, ArrowRight, Loader2, Lock, Mail, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos. Verifique seus dados.");
      } else {
        window.location.href = callbackUrl;
        router.refresh();
      }
    } catch {
      setError("Ocorreu um erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08050a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glows de fundo */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[38rem] h-[24rem] bg-rose-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Identidade Segredos do Coração */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-rose-600/40 mb-4 border border-white/15">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 mb-2">
            <Sparkles className="w-3 h-3" /> Central de Controle
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Segredos do Coração
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Gerencie suas novelas verticais, funil X1 no WhatsApp e vendas Pix.
          </p>
        </div>

        {/* Card de Login */}
        <div className="rounded-3xl border border-white/10 bg-[#120b17]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="danelicarocontato@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entrando no Painel...
                </>
              ) : (
                <>
                  Acessar Painel Admin <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-rose-300 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Voltar para o site público de novelas
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#08050a]">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
