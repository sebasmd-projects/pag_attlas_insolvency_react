import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import PageLayout from '@/components/PageLayout';

type Props = { params: { locale: string }; };

export default function LoginPage({ params: { locale } }: Props) {

  setRequestLocale(locale);

  const t = useTranslations('AuthPages.LoginPage');

  return (
    <PageLayout title={t('title')}>
      <div className="flex justify-center">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          {t('title')}
        </h1>
      </div>
    </PageLayout>
  );
}
