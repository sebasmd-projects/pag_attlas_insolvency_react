export async function generateMetadata({ params }) {
    const { locale } = await params;
    
    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: locale === 'es' ? 'Politica de tratamiento de la información | ATTLAS' : 'Information Treatment Policy | ATTLAS',
        description: locale === 'es' ? 'Conozca nuestra politica de tratamiento de la información y como utilizamos la información en nuestro sitio web.' : 'Learn about our information treatment policy and how we use information on our website.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/documents/legal/policies-for-the-treatment-of-information`,
            languages: {
                es: '/es/documents/legal/policies-for-the-treatment-of-information',
                en: '/en/documents/legal/policies-for-the-treatment-of-information',
            },
        },
        openGraph: {
            title: locale === 'es' ? 'Politica de tratamiento de la información | ATTLAS' : 'Information Treatment Policy | ATTLAS',
            description: locale === 'es' ? 'Conozca nuestra politica de tratamiento de la información y como utilizamos la información en nuestro sitio web.' : 'Learn about our information treatment policy and how we use information on our website.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/documents/legal/policies-for-the-treatment-of-information`,
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

export { default } from './PoliciesForTheTreatmentClient';
