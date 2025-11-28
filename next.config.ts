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
        hostname: "i.imgur.com",
        pathname: "/**",
      },
    ],
    domains: [
      "images.unsplash.com",
      "sample.dev",
      "i.imgur.com",
      "imgur.com",
    ],
  },
};

export default nextConfig;
