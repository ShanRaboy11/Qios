import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // warning: allows production builds to successfully complete despite eslint errors
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
