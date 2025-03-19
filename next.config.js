// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'propensionesabogados.com',
            },
            {
                protocol: 'https',
                hostname: 'fundacionattlas.com',
            },
            {
                protocol: 'https',
                hostname: 'fundacionattlas.org',
            },
        ]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    }
};

module.exports = withNextIntl(nextConfig);
