'use client';

import { useTranslations } from 'next-intl';

export default function CookiesClient() {
    const t = useTranslations('Pages.documents.legal.cookies');

    return (
        <div className="container py-5">
            <embed 
                src={t('cookiesDocument')} 
                type="application/pdf" 
                className="vh-100 d-inline-block w-100"
                title={t('cookiesTitle')}
            />
        </div>
    );
}
