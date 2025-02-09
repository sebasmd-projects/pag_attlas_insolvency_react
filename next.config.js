// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fundacionlm.org',
            },
        ],
    },
};

module.exports = withNextIntl(config);
