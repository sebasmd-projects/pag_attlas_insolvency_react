'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

// Valores según MARITAL_STATUS_OPTIONS en el modelo
const MARITAL_OPTIONS = (t) => [
    { value: 'Soltero/a', label: t('maritalStatus.single') },
    { value: 'Casado/a', label: t('maritalStatus.married') },
    { value: 'Divorciado/a', label: t('maritalStatus.divorced') },
    { value: 'Viudo/a', label: t('maritalStatus.widowed') },
    { value: 'Unión Libre', label: t('maritalStatus.freeUnion') },
    { value: 'Declaración Marital', label: t('maritalStatus.maritalDeclaration') },
    { value: 'No aplica', label: t('maritalStatus.notApplicable') },
];

export default function Step9PermanentPartner({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step9');
    const initialized = useRef(false);

    const buildInitialState = () => ({
        marital_status: data.partner_marital_status || 'No aplica',
        document: data.partner_document_number || '',
        name: data.partner_name || '',
        lastname: data.partner_last_name || '',
        email: data.partner_email || '',
        phone: data.partner_cell_phone || '',
        relationship_duration: data.partner_relationship_duration?.toString() || '',
    });

    const [form, setForm] = useState(buildInitialState);

    useEffect(() => {
        if (!initialized.current) {
            setForm(buildInitialState());
            initialized.current = true;
        }
    }, [
        data.partner_marital_status,
        data.partner_document_number,
        data.partner_name,
        data.partner_last_name,
        data.partner_email,
        data.partner_cell_phone,
        data.partner_relationship_duration,
    ]);

    useEffect(() => {
        const payload = { partner_marital_status: form.marital_status };
        if (form.marital_status !== 'No aplica') {
            payload.partner_document_number = form.document;
            payload.partner_name = form.name;
            payload.partner_last_name = form.lastname;
            payload.partner_email = form.email;
            payload.partner_cell_phone = form.phone;
            payload.partner_relationship_duration = parseInt(form.relationship_duration, 10) || 0;
        }
        updateData(payload);
    }, [form, updateData]);

    const handleEstadoChange = (e) => {
        const marital_status = e.target.value;
        setForm(prev => {
            const next = { ...prev, marital_status };
            if (marital_status === 'No aplica') {
                next.document = '';
                next.name = '';
                next.lastname = '';
                next.email = '';
                next.phone = '';
                next.relationship_duration = '';
            }
            return next;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { partner_marital_status: form.marital_status };
        if (form.marital_status !== 'No aplica') {
            payload.partner_document_number = form.document;
            payload.partner_name = form.name;
            payload.partner_last_name = form.lastname;
            payload.partner_email = form.email;
            payload.partner_cell_phone = form.phone;
            payload.partner_relationship_duration = parseInt(form.relationship_duration, 10) || 0;
        }
        onNext(payload);
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                <div className="mb-3">
                    <label className="form-label">{t('maritalSocietyQuestion')}</label>
                    <select
                        className="form-select"
                        value={form.marital_status}
                        onChange={handleEstadoChange}
                        required
                    >
                        {MARITAL_OPTIONS(t).map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {form.marital_status !== 'No aplica' && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">{t('partnerDocument')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="document"
                                value={form.document}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">{t('partnerName')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">{t('partnerLastname')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('partnerEmail')}</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">{t('partnerPhone')}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">{t('relationshipDuration')}</label>
                            <input
                                type="number"
                                className="form-control"
                                name="relationship_duration"
                                value={form.relationship_duration}
                                onChange={handleChange}
                                min={1}
                                max={100}
                                required
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>
                    </div>
                )}
            </form>
        </>
    );
}

Step9PermanentPartner.propTypes = {
    data: PropTypes.shape({
        partner_marital_status: PropTypes.string,
        partner_document_number: PropTypes.string,
        partner_name: PropTypes.string,
        partner_last_name: PropTypes.string,
        partner_email: PropTypes.string,
        partner_cell_phone: PropTypes.string,
        partner_relationship_duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
