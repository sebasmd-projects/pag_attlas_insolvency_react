export async function generateMetadata({ params }) {
    const { locale } = await params;
    
    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: locale === 'es' ? 'Aviso de Privacidad | ATTLAS' : 'Privacy Notice | ATTLAS',
        description: locale === 'es' ? 'Aviso de privacidad de la Fundacion ATTLAS. Conozca como protegemos sus datos personales.' : 'Privacy notice of the ATTLAS Foundation. Learn how we protect your personal data.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/privacy-notice`,
            languages: {
                es: '/es/documents/legal/privacy-notice',
                en: '/en/documents/legal/privacy-notice',
            },
        },
        openGraph: {
            title: locale === 'es' ? 'Aviso de Privacidad | ATTLAS' : 'Privacy Notice | ATTLAS',
            description: locale === 'es' ? 'Aviso de privacidad de la Fundacion ATTLAS. Conozca como protegemos sus datos personales.' : 'Privacy notice of the ATTLAS Foundation. Learn how we protect your personal data.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/documents/legal/privacy-notice`,
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

export { default } from './PrivacyClient';
