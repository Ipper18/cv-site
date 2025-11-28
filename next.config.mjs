/** @type {import('next').NextConfig} */
const nextConfig = {
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
            },
        ],
    },
};

export default nextConfig;
