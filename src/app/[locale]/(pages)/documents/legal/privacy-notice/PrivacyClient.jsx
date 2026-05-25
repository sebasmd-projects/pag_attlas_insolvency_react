'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyClient() {
    const t = useTranslations('Pages.documents.legal.privacyNotice');

    return (
        <div className="container py-5">
            <embed 
                src={t('document')} 
                type="application/pdf" 
                className="vh-100 d-inline-block w-100"
                title={t('title')}
            />
        </div>
    );
}
