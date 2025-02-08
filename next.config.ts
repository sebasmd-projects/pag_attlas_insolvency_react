import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fundacionlm.org',
            },
        ],
    },
};



export default nextConfig;
