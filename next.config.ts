import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignores ESLint errors during Vercel build
  },
};

export default nextConfig;