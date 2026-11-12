import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "bcryptjs"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/termos",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacidade",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
