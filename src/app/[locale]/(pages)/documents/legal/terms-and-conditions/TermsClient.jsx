'use client';

import { useTranslations } from 'next-intl';

export default function TermsClient() {
    const t = useTranslations('Pages.documents.legal');

    return (
        <div className="container py-5">
            <embed 
                src={t('termsAndConditions')} 
                type="application/pdf" 
                className="vh-100 d-inline-block w-100"
                title="Terminos y Condiciones"
            />
        </div>
    );
}
