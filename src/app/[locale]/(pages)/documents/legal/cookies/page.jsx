export async function generateMetadata({ params }) {
    const { locale } = await params;
    
    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: locale === 'es' ? 'Politica de Cookies | ATTLAS' : 'Cookie Policy | ATTLAS',
        description: locale === 'es' ? 'Conozca nuestra politica de cookies y como utilizamos las cookies en nuestro sitio web.' : 'Learn about our cookie policy and how we use cookies on our website.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/cookies`,
            languages: {
                es: '/es/documents/legal/cookies',
                en: '/en/documents/legal/cookies',
            },
        },
        openGraph: {
            title: locale === 'es' ? 'Politica de Cookies | ATTLAS' : 'Cookie Policy | ATTLAS',
            description: locale === 'es' ? 'Conozca nuestra politica de cookies y como utilizamos las cookies en nuestro sitio web.' : 'Learn about our cookie policy and how we use cookies on our website.',
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
