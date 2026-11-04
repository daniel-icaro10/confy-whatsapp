"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AnuncioRedirectContent() {
    const searchParams = useSearchParams();
    const [waUrl, setWaUrl] = useState("");
    const [missingNumber, setMissingNumber] = useState(false);

    useEffect(() => {
        async function redirectFromAd() {
            try {
                const serieSlug = searchParams.get("serie") || searchParams.get("drama") || "";
                const [funnelRes, dramasRes] = await Promise.all([
                    fetch("/api/funnel/config"),
                    serieSlug ? fetch("/api/dramas") : Promise.resolve(null)
                ]);
                const funnelData = await funnelRes.json();
                const phone = funnelData?.config?.publicWhatsappNumber || "";
                const baseMsg =
                    funnelData?.config?.publicAdRedirectMessage ||
                    "Olá! Vi o anúncio e quero liberar meu acesso para assistir.";

                let finalMsg = baseMsg;
                if (dramasRes) {
                    const dramasData = await dramasRes.json();
                    const found = Array.isArray(dramasData?.dramas)
                        ? dramasData.dramas.find(
                              (d: any) => d.slug === serieSlug || d.id === serieSlug
                          )
                        : null;
                    if (found?.title) {
                        finalMsg = `${baseMsg} (${found.title})`;
                    }
                }

                if (!phone) {
                    setMissingNumber(true);
                    return;
                }

                const target = `https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`;
                setWaUrl(target);
                window.location.href = target;
            } catch {
                setMissingNumber(true);
            }
        }
        redirectFromAd();
    }, [searchParams]);

    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
            <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase text-[#e11d48] mb-2">
                TVDRAMA REELS · ATENDIMENTO AUTOMÁTICO
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white mb-2 max-w-md">
                {missingNumber
                    ? "Atendimento via WhatsApp"
                    : "Abrindo seu atendimento no WhatsApp..."}
            </h1>
            <p className="text-sm text-[#9a9a9a] max-w-sm mb-6 leading-relaxed">
                {missingNumber
                    ? "Conecte a sessão do funil em /dashboard/funil ou acesse o catálogo abaixo."
                    : "Você será atendido automaticamente no nosso WhatsApp para liberar o acesso imediato ao catálogo completo."}
            </p>
            {waUrl ? (
                <a
                    href={waUrl}
                    className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold text-sm shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition"
                >
                    Continuar para o WhatsApp
                </a>
            ) : (
                <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-white text-black font-bold text-sm transition"
                >
                    Ver Catálogo
                </Link>
            )}
        </div>
    );
}

export default function AnuncioPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <AnuncioRedirectContent />
        </Suspense>
    );
}
