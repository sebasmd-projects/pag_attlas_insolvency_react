import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageLayout from '@/components/PageLayout';
import TestComponents from './components/testComponent'

type Props = {
  params: {locale: string};
};

export default function HomePage({params: {locale}}: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('IndexPage');

  return (
    <PageLayout title={t('title')}>
      <p className="max-w-[590px]">
        {t.rich('description', {
          code: (chunks) => (
            <code className="font-mono text-white">{chunks}</code>
          )
        })}
      </p>
      <small>{t('timeUntil')}</small>

      <br />

      <TestComponents />
      
    </PageLayout>
  );
}
