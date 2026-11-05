import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter_Tight, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopLoader } from "@/components/ui/top-loader";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const APP_DESCRIPTION = "Novelas verticais, romances proibidos e séries curtas em alta definição feitas para assistir no celular.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://segredosdocoracao.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  let appName = "TvDrama Reels";
  try {
    // @ts-ignore
    const config = await prisma.systemConfig.findUnique({ where: { id: "default" } });
    if (
      config?.appName &&
      config.appName !== "WA-AKG" &&
      config.appName !== "Confy WhatsApp" &&
      config.appName !== "Segredos do Coração"
    ) {
      appName = config.appName;
    }
  } catch {
    // fallback
  }

  const appDefaultTitle = `${appName} — Novelas Verticais & Séries Curtas`;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: appDefaultTitle,
      template: `%s | ${appName}`,
    },
    description: APP_DESCRIPTION,
    applicationName: appName,
    manifest: "/manifest.json",
    generator: "Next.js",
    keywords: [
      "novelas verticais", "dramas", "doramas", "segredos do coracao",
      "series curtas", "romance", "novela completa", "dramawave"
    ],
    referrer: "origin-when-cross-origin",
    authors: [{ name: appName }],
    creator: appName,
    publisher: appName,
    formatDetection: { telephone: false },
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: appName,
      title: appDefaultTitle,
      description: APP_DESCRIPTION,
      url: APP_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: appDefaultTitle,
      description: APP_DESCRIPTION,
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": appName,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <link rel="dns-prefetch" href={APP_URL} />
        <link rel="preconnect" href={APP_URL} crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} ${sora.variable} font-sans antialiased text-[#f5f5f5] bg-[#0c0d0e] min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <TopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
