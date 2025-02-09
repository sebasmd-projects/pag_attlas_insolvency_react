import Image from 'next/image';
// import {useTranslations} from 'next-intl';
// import {setRequestLocale} from 'next-intl/server';
import PageLayout from '@/components/PageLayout';

// type Props = {
//   params: {locale: string};
// };

// export default function TeamPage({params: {locale}}: Props) {
export default function TeamPage() {
  // // Enable static rendering
  // setRequestLocale(locale);

  // const t = useTranslations('PathnamesPage');

  return (
    <PageLayout title="Equipo">
      <div className="flex justify-center">
        <Image
          alt="Equipo"
          className='img-fluid'
          height={750}
          src="/assets/imgs/page/equipo.png"
          width={1920}
        />
      </div>
    </PageLayout>
  );
}
