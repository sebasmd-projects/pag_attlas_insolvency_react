// src/app/[locale]/platform/(home)/steps/Step9Sociedad.jsx

'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';



export default function Step9Sociedad({ data, onNext, onBack, isSubmitting }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step9');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const MARITAL_OPTIONS = [
        { value: 'spouse', label: t('maritalStatus.spouse') },
        { value: 'marital_declaration', label: t('maritalStatus.maritalDeclaration') },
        { value: 'free_union', label: t('maritalStatus.freeUnion') },
        { value: 'not_applicable', label: t('maritalStatus.notApplicable') }
    ];

    const [estado, setEstado] = useState(data.marital_status || 'not_applicable');
    const [pareja, setPareja] = useState({
        partner_document: data.partner_document || '',
        partner_name: data.partner_name || '',
        partner_lastname: data.partner_lastname || '',
        partner_email: data.partner_email || '',
        partner_phone: data.partner_phone || '',
        partner_relationship_duration: data.partner_relationship_duration || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPareja((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const baseData = { marital_status: estado };

        if (estado !== 'not_applicable') {
            onNext({ ...baseData, ...pareja });
        } else {
            onNext(baseData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>{t('title')}</h5>

            <div className="mb-3">
                <label className="form-label">{t('maritalSocietyQuestion')}</label>
                <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                >
                    {MARITAL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {estado !== 'not_applicable' && (
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">{t('partnerDocument')}</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            name="partner_document"
                            value={pareja.partner_document}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">{t('partnerName')}</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            name="partner_name"
                            value={pareja.partner_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">{t('partnerLastname')}</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            name="partner_lastname"
                            value={pareja.partner_lastname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{t('partnerEmail')}</label>
                        <input
                            type="email"
                            required
                            className="form-control"
                            name="partner_email"
                            value={pareja.partner_email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{t('partnerPhone')}</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            name="partner_phone"
                            value={pareja.partner_phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">{t('relationshipDuration')}</label>
                        <input
                            type="number"
                            required
                            className="form-control"
                            min={1}
                            max={100}
                            name="partner_relationship_duration"
                            value={pareja.partner_relationship_duration}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    <FaArrowCircleLeft /> <span className="ms-2">{wizardButton('back')}</span>
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {wizardButton('processing')}
                        </>
                    ) : (
                        <>
                            {wizardButton('next')} <FaArrowCircleRight className='ms-2' />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}