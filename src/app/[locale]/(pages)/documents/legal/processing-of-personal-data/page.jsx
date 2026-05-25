export async function generateMetadata({ params }) {
    const { locale } = await params;
    
    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: locale === 'es' ? 'Procesamiento de Datos Personales | ATTLAS' : 'Processing of Personal Data | ATTLAS',
        description: locale === 'es' ? 'Conozca nuestra politica de procesamiento de datos personales y como utilizamos esta información.' : 'Learn about our policy for processing personal data and how we use this information.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/processing-of-personal-data`,
            languages: {
                es: '/es/documents/legal/processing-of-personal-data',
                en: '/en/documents/legal/processing-of-personal-data',
            },
        },
        openGraph: {
            title: locale === 'es' ? 'Procesamiento de Datos Personales | ATTLAS' : 'Processing of Personal Data | ATTLAS',
            description: locale === 'es' ? 'Conozca nuestra politica de procesamiento de datos personales y como utilizamos esta información.' : 'Learn about our policy for processing personal data and how we use this information.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/documents/legal/processing-of-personal-data`,
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

export { default } from './ProcessingOfPersonalDataClient';
