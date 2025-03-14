// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'attlasconciliacion.propensionesabogados.com',
            },
            {
                protocol: 'https',
                hostname: 'propensionesabogados.com',
            }
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
