"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
        setError("Credenciais inválidas.");
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Segredos do Coração
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Acesso restrito à administração
          </p>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-[#111111] p-6">
          {error && (
            <div className="mb-4 p-3 rounded border border-red-900/50 bg-red-950/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-neutral-800 bg-[#0a0a0a] text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-neutral-800 bg-[#0a0a0a] text-sm text-white focus:outline-none focus:border-neutral-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition"
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginForm />
    </Suspense>
  );
}
