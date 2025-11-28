import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "sample.dev",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",  // dokładnie ta domena
        pathname: "/**",          // pozwól na wszystkie ścieżki
      },
    ],
  },
};

export default nextConfig;
