import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Pages.aboutUs.pages.faq.sections.heroSection' });

    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: t('title_h1') + ' | ATTLAS',
        description: 'Encuentra respuestas a las preguntas mas frecuentes sobre nuestros servicios de insolvencia economica y conciliacion.',
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/about-us/frequently-asked-questions`,
            languages: {
                es: '/es/about-us/frequently-asked-questions',
                en: '/en/about-us/frequently-asked-questions',
            },
        },
        openGraph: {
            title: t('title_h1') + ' | ATTLAS',
            description: 'Encuentra respuestas a las preguntas mas frecuentes sobre nuestros servicios de insolvencia economica y conciliacion.',
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/about-us/frequently-asked-questions`,
            images: [{ url: '/assets/imgs/favicon/favicon.png', alt: 'ATTLAS FAQ' }],
            siteName: 'Fundacion ATTLAS',
            locale: locale === 'es' ? 'es_CO' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            site: '@attlas_legal',
            title: t('title_h1') + ' | ATTLAS',
            description: 'Encuentra respuestas a las preguntas mas frecuentes sobre nuestros servicios.',
        },
    };
}

// Enable ISR - revalidate every 30 minutes for FAQ content
export const revalidate = 1800;

export { default } from './FAQClient';
