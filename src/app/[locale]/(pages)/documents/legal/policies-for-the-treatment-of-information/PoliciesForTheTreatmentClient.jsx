'use client';

import { useTranslations } from 'next-intl';

export default function PoliciesForTheTreatmentOfInformationClient() {
    const t = useTranslations('Pages.documents.legal.policiesForTheTreatmentOfInformation');

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
