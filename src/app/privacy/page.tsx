import Link from "next/link";

export const metadata = {
    title: "Política de Privacidade | TvDrama Reels",
    description: "Política de Privacidade e proteção de dados da plataforma TvDrama Reels."
};

export default function PrivacyPage() {
    return (
        <div className="min-h-dvh bg-black text-[#f5f5f5] pb-16">
            <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-10 h-[66px] bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.06]">
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

            <main className="max-w-3xl mx-auto px-4 sm:px-8 pt-10">
                <div className="rounded-[22px] border border-white/12 bg-[#101014] p-6 sm:p-10 space-y-6">
                    <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#e11d48]">
                            TVDRAMA REELS · PRIVACIDADE
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                            Política de Privacidade
                        </h1>
                    </div>

                    <div className="space-y-4 text-sm text-[#c9c9d1] leading-relaxed">
                        <p>
                            O <strong className="text-white">TvDrama Reels</strong> respeita a sua privacidade e coleta apenas as informações estritamente necessárias para identificar e liberar o seu acesso ao catálogo.
                        </p>
                        <h2 className="text-base font-bold text-white pt-2">
                            1. Dados Coletados
                        </h2>
                        <p>
                            Utilizamos o seu número de WhatsApp (com DDD) e nome básico exclusivamente para vincular sua assinatura ativa, enviar o link automático de desbloqueio após o pagamento e permitir o login rápido em qualquer dispositivo.
                        </p>
                        <h2 className="text-base font-bold text-white pt-2">
                            2. Processamento Seguro de Pagamentos
                        </h2>
                        <p>
                            Os pagamentos via Pix e Cartão são processados por gateways certificados (Mangofy e Stripe). Não armazenamos dados completos de cartão de crédito em nossos servidores.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
