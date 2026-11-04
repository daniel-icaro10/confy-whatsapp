import Link from "next/link";

export const metadata = {
    title: "Termos de Uso | TvDrama Reels",
    description: "Termos de Uso e Condições de Assinatura da plataforma TvDrama Reels."
};

export default function TermsPage() {
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
                            TVDRAMA REELS · DOCUMENTO OFICIAL
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                            Termos de Uso
                        </h1>
                    </div>

                    <div className="space-y-4 text-sm text-[#c9c9d1] leading-relaxed">
                        <p>
                            Bem-vindo ao <strong className="text-white">TvDrama Reels</strong>. Ao acessar nosso catálogo ou adquirir um dos planos de acesso (Mensal, Trimestral ou Anual), você concorda integralmente com estes Termos de Uso.
                        </p>
                        <h2 className="text-base font-bold text-white pt-2">
                            1. Liberação e Acesso ao Catálogo
                        </h2>
                        <p>
                            A liberação do catálogo é vinculada ao número de WhatsApp informado no momento do pagamento via Pix ou Cartão. Assim que o pagamento é confirmado, todos os episódios e o aplicativo PWA ficam disponíveis imediatamente pelo período contratado.
                        </p>
                        <h2 className="text-base font-bold text-white pt-2">
                            2. Uso Pessoal e Intransferível
                        </h2>
                        <p>
                            O acesso concedido é destinado exclusivamente ao uso pessoal do assinante, respeitando o limite de telas simultâneas previsto em cada plano. É vedada a redistribuição ou comercialização dos conteúdos exibidos na plataforma.
                        </p>
                        <h2 className="text-base font-bold text-white pt-2">
                            3. Suporte ao Assinante
                        </h2>
                        <p>
                            Caso troque de aparelho, basta clicar em <strong className="text-white">Já paguei</strong> no topo da página inicial e informar o mesmo número de WhatsApp cadastrado para restaurar seu acesso sem custo adicional.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
