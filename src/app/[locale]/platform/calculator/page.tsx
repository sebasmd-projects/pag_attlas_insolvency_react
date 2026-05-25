import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://fundacionattlas.org'),
    title: 'Calculadora de Insolvencia | ATTLAS',
    description: 'Calcula cuanto tiempo te tomara pagar tus deudas con nuestra calculadora de insolvencia economica. Herramienta gratuita de la Fundacion ATTLAS.',
    alternates: {
        canonical: 'https://fundacionattlas.org/platform/calculator',
    },
    openGraph: {
        title: 'Calculadora de Insolvencia | ATTLAS',
        description: 'Calcula cuanto tiempo te tomara pagar tus deudas con nuestra calculadora de insolvencia economica.',
        type: 'website',
        url: 'https://fundacionattlas.org/platform/calculator',
        images: [{ url: '/assets/imgs/favicon/favicon.png', alt: 'ATTLAS Calculadora' }],
        siteName: 'Fundacion ATTLAS',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@attlas_legal',
        title: 'Calculadora de Insolvencia | ATTLAS',
        description: 'Calcula cuanto tiempo te tomara pagar tus deudas con nuestra calculadora de insolvencia economica.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export { default } from './CalculatorClient';
