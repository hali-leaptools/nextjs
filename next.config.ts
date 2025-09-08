import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: { remotePatterns: [new URL("https://cdn.pixabay.com/photo/**")] },
};

export default nextConfig;
