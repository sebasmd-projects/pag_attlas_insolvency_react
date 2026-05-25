import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    
    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: 'Politica de Cookies | ATTLAS',
        description: 'Conozca nuestra politica de cookies y como utilizamos las cookies en nuestro sitio web.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/cookies`,
            languages: {
                es: '/es/documents/legal/cookies',
                en: '/en/documents/legal/cookies',
            },
        },
        openGraph: {
            title: 'Politica de Cookies | ATTLAS',
            description: 'Conozca nuestra politica de cookies y como utilizamos las cookies en nuestro sitio web.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/documents/legal/cookies`,
            siteName: 'Fundacion ATTLAS',
            locale: locale === 'es' ? 'es_CO' : 'en_US',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Static page - rarely changes
export const revalidate = false;

export { default } from './CookiesClient';
