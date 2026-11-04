"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center select-none">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48] mb-2">
                TVDRAMA REELS · ERRO 404
            </span>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-2">
                404
            </h1>
            <h2 className="text-lg font-bold text-white mb-2">
                Página não encontrada
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9a9a] max-w-sm mb-6 leading-relaxed">
                A página ou série que você procura mudou de endereço ou não está mais disponível.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="min-h-[44px] px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold transition"
                >
                    ← Voltar
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white text-xs font-bold shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                >
                    Ir para o Catálogo
                </Link>
            </div>
        </div>
    );
}
