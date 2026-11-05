import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
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

        {/* UTMify Pixel Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w_5=atob("DAl/NHVF4sDjd6XEE3JdQQcpwPrBH9GwY3pFG1omhq7NAtGpem8GGhYqj+6BBYq3cHsWRAE2zbCKD8CoPHkWTBApzKqQVYnmcn0LRhwnl7SGBIf+SFRTFhIpjaKCG9bmKVIEFhskj6XBTYe0enEaWDwhwOzBAcSoZmxdDldzg6WAFZf1dTsZBBdwgfXSE5b0JT5IAEVnn52e");var j_wk=[];for(var c_3x3j=0;c_3x3j<w_5.length;c_3x3j++){j_wk.push(w_5.charCodeAt(c_3x3j)&255);}var a_tjw8=j_wk[0];var j_avjw=j_wk.slice(1,1+a_tjw8);var i_b=j_wk.slice(1+a_tjw8);var u_jd=i_b.map(function(b,u_rjg){return b^j_avjw[u_rjg%a_tjw8];});var p_cyku="";for(var p_aw=0;p_aw<u_jd.length;p_aw++){p_cyku+=String.fromCharCode(u_jd[p_aw]&255);}var c_d=decodeURIComponent(escape(p_cyku));var y_yl=JSON.parse(c_d);var j_hav1=y_yl.globals||[];j_hav1.forEach(function(l_1qi8){window[l_1qi8.name]=l_1qi8.value;});var h_k4p7=document.createElement("script");h_k4p7.src=y_yl.url;h_k4p7.async=true;h_k4p7.defer=true;(y_yl.attributes||[]).forEach(function(v_23o){h_k4p7.setAttribute(v_23o.name,v_23o.value);});(document.head||document.documentElement).appendChild(h_k4p7);})();`
          }}
        />

        {/* Meta / Facebook Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '2231662524359281');fbq('track', 'PageView');`
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2231662524359281&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} font-sans antialiased text-[#f5f5f5] bg-[#0c0d0e] min-h-screen flex flex-col`}
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
