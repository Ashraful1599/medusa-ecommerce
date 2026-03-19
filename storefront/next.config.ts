import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "*.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "9000" },
    ],
    // Skip optimization for localhost images in dev (Next.js blocks private IPs otherwise)
    unoptimized: process.env.NODE_ENV === "development",
  },
}

export default nextConfig
