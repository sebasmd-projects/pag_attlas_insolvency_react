// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const config = {
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
    }
};

module.exports = withNextIntl(config);
