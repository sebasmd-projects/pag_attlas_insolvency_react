import { useTranslations } from 'next-intl';

export default function PrivacyNoticePage() {

  const t = useTranslations('Pages.documents.legal');

  return (
    <div className="container">
      <embed src={t('termsAndConditions')} type="application/pdf" className="vh-100 d-inline-block w-100" />
    </div>
  );
}