import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const APP_DESCRIPTION = "Assista às melhores novelas verticais, romances proibidos e dramas intensos direto no seu celular.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://segredosdocoracao.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#09060a" },
    { media: "(prefers-color-scheme: dark)", color: "#09060a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  let appName = "Segredos do Coração";
  try {
    // @ts-ignore
    const config = await prisma.systemConfig.findUnique({ where: { id: "default" } });
    if (config?.appName && config.appName !== "WA-AKG" && config.appName !== "Confy WhatsApp") {
      appName = config.appName;
    }
  } catch {
    // fallback
  }

  const appDefaultTitle = `${appName} | Novelas Verticais & Dramas Exclusivos`;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: appDefaultTitle,
      template: `%s | ${appName}`,
    },
    description: APP_DESCRIPTION,
    applicationName: appName,
    generator: "Next.js",
    keywords: [
      "novelas verticais", "dramas", "doramas", "segredos do coracao",
      "series curtas", "romance", "novela completa"
    ],
    referrer: "origin-when-cross-origin",
    authors: [{ name: appName }],
    creator: appName,
    publisher: appName,
    formatDetection: { telephone: false },
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-foreground bg-background selection:bg-rose-500/30 selection:text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 -z-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-background to-background pointer-events-none" suppressHydrationWarning={true} />
        <Providers>
          <TopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
