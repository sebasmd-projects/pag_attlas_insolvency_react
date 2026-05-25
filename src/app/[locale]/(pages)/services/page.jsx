import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServicesHeroSection from './components/sections/HeroSection';
import RequirementsSection from './components/sections/RequirementsSection';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Pages.servicesPage' });

    return {
        metadataBase: new URL('https://fundacionattlas.org'),
        title: t('sections.heroSection.title_h1') + ' | ATTLAS',
        description: t('sections.heroSection.description_p').substring(0, 160),
        alternates: {
            canonical: `https://fundacionattlas.org/${locale}/services`,
            languages: {
                es: '/es/services',
                en: '/en/services',
            },
        },
        openGraph: {
            title: t('sections.heroSection.title_h1') + ' | ATTLAS',
            description: t('sections.heroSection.description_p').substring(0, 160),
            type: 'website',
            url: `https://fundacionattlas.org/${locale}/services`,
            images: [{ url: '/assets/imgs/favicon/favicon.png', alt: 'ATTLAS Servicios' }],
            siteName: 'Fundacion ATTLAS',
            locale: locale === 'es' ? 'es_CO' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            site: '@attlas_legal',
            title: t('sections.heroSection.title_h1') + ' | ATTLAS',
            description: t('sections.heroSection.description_p').substring(0, 160),
        },
    };
}

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export default async function ServicesPage({ params }) {
    const { locale } = await params;
    setRequestLocale(locale);
    
    return (
        <>
            <ServicesHeroSection />
            <RequirementsSection />
        </>
    );
}
