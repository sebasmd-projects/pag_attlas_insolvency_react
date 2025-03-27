
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeroSection from './components/sections/HeroSection/HeroSection';
import MainTeamSection from './components/sections/MainTeamSection';
import SolutionsSection from './components/sections/SolutionsSection';
import StepByStepSection from './components/sections/StepByStepSection';
import WhyUsSection from './components/sections/WhyUsSection';
import ContactSection from './components/sections/ContactSection';


export async function generateMetadata({ params: { locale } }) {

  const t = await getTranslations({ locale, namespace: 'Pages.homePage.metaData' });

  return {
    title: t('title'),
    description: t('description'),
    canonical: t('canonical'),
    openGraph: {
      title: t('openGraph.title'),
      description: t('openGraph.description'),
      type: t('openGraph.type'),
      url: t('openGraph.url'),
      images: [
        { url: t('openGraph.images.0.url'), alt: t('openGraph.images.0.alt') }
      ],
    },
    twitter: {
      cardType: t('twitter.card'),
      site: t('twitter.site'),
      title: t('twitter.title'),
      description: t('twitter.description'),
      image: t('twitter.images'),
    },
    structuredData: {
      '@context': t('structuredData.context'),
      '@type': t('structuredData.type'),
      name: t('structuredData.name'),
      telephone: t('structuredData.telephone'),
      address: {
        '@type': t('structuredData.address.type'),
        streetAddress: t('structuredData.address.streetAddress'),
        addressLocality: t('structuredData.address.addressLocality'),
        addressRegion: t('structuredData.address.addressRegion'),
        postalCode: t('structuredData.address.postalCode'),
        addressCountry: t('structuredData.address.addressCountry'),
      },
      serviceArea: {
        '@type': t('structuredData.serviceArea.type'),
        name: t('structuredData.serviceArea.name'),
      },
      sameAs: [
        t('structuredData.sameAs.0'),
        t('structuredData.sameAs.1'),
      ],
    }
  }
}

export default function HomePage({ params: { locale } }) {

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SolutionsSection />
      <MainTeamSection />
      <WhyUsSection />
      <StepByStepSection />
      <ContactSection params={{ locale }} />
    </>
  );
}
