// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        '192.168.101.29',
        'localhost',
    ],

    images: {
        remotePatterns: [
            { 
                protocol: 'https', 
                hostname: 'propensionesabogados.com' 
            },
            { 
                protocol: 'https', 
                hostname: 'fundacionattlas.com' 
            },
            { 
                protocol: 'https', 
                hostname: 'fundacionattlas.org' 
            },
        ],
    },

    // Security Headers Configuration
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "img-src 'self' data: blob: https: http:",
                            "connect-src 'self' https://propensionesabogados.com https://fundacionattlas.org https://fundacionattlas.com https://vercel.live wss://ws-us3.pusher.com https://va.vercel-scripts.com",
                            "frame-src 'self' https://vercel.live https://fundacionattlas.org https://fundacionattlas.com https://propensionesabogados.com",
                            "frame-ancestors 'self'",
                            "form-action 'self'",
                            "base-uri 'self'",
                            "object-src 'self' https://fundacionattlas.org",
                            "media-src 'self' blob:",
                            "worker-src 'self' blob:",
                        ].join('; '),
                    },
                    // Prevent XSS attacks
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Prevent MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Prevent clickjacking
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    // Control referrer information
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // Permissions Policy (Feature Policy replacement)
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
                    },
                    // Strict Transport Security
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                ],
            },
            // Additional headers for API routes
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                ],
            },
        ];
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

module.exports = withNextIntl(nextConfig);
