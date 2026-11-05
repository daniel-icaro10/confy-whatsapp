declare global {
    interface Window {
        fbq?: any;
        _fbq?: any;
        pixelId?: string;
    }
}

/**
 * Dispara eventos oficiais no Pixel da Meta (Facebook Pixel) no navegador
 */
export function trackMetaEvent(eventName: string, data?: Record<string, any>) {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
        try {
            window.fbq("track", eventName, data);
        } catch {
            // ignore
        }
    }
}
