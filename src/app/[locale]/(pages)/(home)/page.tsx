import { setRequestLocale } from 'next-intl/server';
import HeroSection from './components/sections/HeroSection/HeroSection';
import MainTeamSection from './components/sections/MainTeamSection';
import SolutionsSection from './components/sections/SolutionsSection';
import StepByStepSection from './components/sections/StepByStepSection';
import WhyUsSection from './components/sections/WhyUsSection';

type Props = { params: { locale: string }; };

export default function HomePage({ params: { locale } }: Props) {

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <SolutionsSection />
      <MainTeamSection />
      <WhyUsSection />
      <StepByStepSection />
    </>
  );
}
