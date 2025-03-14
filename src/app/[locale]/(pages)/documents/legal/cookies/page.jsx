import { useTranslations } from 'next-intl';

export default function CookiesPage() {

    const t = useTranslations('Pages.documents.legal');

    return (
        <div className="container py-5">
            <embed src={t('cookies')} type="application/pdf" className="vh-100 d-inline-block w-100" />
        </div>
    );
}