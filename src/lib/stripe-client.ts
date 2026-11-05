let stripePromise: Promise<any> | null = null;

/**
 * Carrega dinamicamente a biblioteca oficial Stripe.js no navegador
 * sem dependências externas, garantindo checkout 100% seguro e PCI-compliant.
 */
export function loadStripeClient(publishableKey: string): Promise<any> {
    if (typeof window === "undefined") return Promise.resolve(null);
    if ((window as any).Stripe) {
        return Promise.resolve((window as any).Stripe(publishableKey));
    }
    if (!stripePromise) {
        stripePromise = new Promise((resolve, reject) => {
            // Verifica se o script já existe no DOM
            const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]');
            if (existing) {
                existing.addEventListener("load", () => {
                    if ((window as any).Stripe) {
                        resolve((window as any).Stripe(publishableKey));
                    }
                });
                return;
            }

            const script = document.createElement("script");
            script.src = "https://js.stripe.com/v3/";
            script.async = true;
            script.onload = () => {
                if ((window as any).Stripe) {
                    resolve((window as any).Stripe(publishableKey));
                } else {
                    reject(new Error("Stripe.js não pôde ser carregado"));
                }
            };
            script.onerror = () => {
                stripePromise = null;
                reject(new Error("Falha de conexão com a infraestrutura segura de pagamentos"));
            };
            document.head.appendChild(script);
        });
    }
    return stripePromise;
}
