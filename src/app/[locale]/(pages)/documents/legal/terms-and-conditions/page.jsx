export async function generateMetadata({ params }) {
    const { locale } = await params;

    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: 'Terminos y Condiciones | ATTLAS',
        description: 'Lea nuestros terminos y condiciones de uso de los servicios de la Fundacion ATTLAS.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/terms-and-conditions`,
            languages: {
                es: '/es/documents/legal/terms-and-conditions',
                en: '/en/documents/legal/terms-and-conditions',
            },
        },
        openGraph: {
            title: 'Terminos y Condiciones | ATTLAS',
            description: 'Lea nuestros terminos y condiciones de uso de los servicios de la Fundacion ATTLAS.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/documents/legal/terms-and-conditions`,
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

export { default } from './TermsClient';
