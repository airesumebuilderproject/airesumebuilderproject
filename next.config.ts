import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "psbyqmkizkqkrzxa.public.blob.vercel-storage.com",
      },
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // ✅ Environment variable ko sahi jagah rakha
  },
};

export default nextConfig; // ✅ Yehi sahi tarika hai TypeScript me export karne ka
