// src/app/[locale]/platform/(home)/steps/Step1DatosPersonales.jsx

'use client';

import { useEffect, useState } from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export default function Step1DatosPersonales({ data, onNext, onBack, isSubmitting }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step1');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');
    const initialData = {
        document_number: data.document_number || '',
        expedition_city: data.expedition_city || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        is_merchant: data.is_merchant || 'No',
        cell_phone: data.cell_phone || '',
        email: data.email || '',
    }
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        setForm(initialData);
    }, [data]);


    useEffect(() => {
        fetch('/api/platform/auth/token-info')
            .then((res) => res.json())
            .then((data) => {
                if (data?.document_number) {
                    setForm((prev) => ({ ...prev, document_number: data.document_number }));
                }
            })
            .catch((err) => console.error('Error obteniendo cédula:', err));
    }, []);

    const removeAccents = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === 'expedition_city' || name === 'first_name' || name === 'last_name') {
            newValue = removeAccents(value).toUpperCase();
        }

        setForm((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !form.expedition_city ||
            !form.first_name ||
            !form.last_name ||
            !form.cell_phone ||
            !form.email
        ) {
            return;
        }
        onNext(form);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">{t('form.document_number')}</label>
                    <input
                        type="text"
                        name="document_number"
                        className="form-control"
                        value={form.document_number}
                        disabled
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">{t('form.expedition_city')}</label>
                    <input
                        type="text"
                        name="expedition_city"
                        className="form-control"
                        value={form.expedition_city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">{t('form.first_name')}</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">{t('form.last_name')}</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">{t('form.cell_phone')}</label>
                    <input
                        type="tel"
                        name="cell_phone"
                        className="form-control"
                        value={form.cell_phone}
                        onChange={handleChange}
                        pattern="[0-9]{10,15}"
                        title="El teléfono debe contener entre 10 y 15 dígitos"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">{t('form.email')}</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">{t('form.is_merchant.title')}</label>
                    <select
                        className="form-select"
                        name="is_merchant"
                        value={form.is_merchant}
                        onChange={handleChange}
                    >
                        <option value="no">{t('form.is_merchant.options.no')}</option>
                        <option value="yes">{t('form.is_merchant.options.yes')}</option>
                    </select>
                </div>

                <div className="col-12 d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onBack}
                    >
                        <FaArrowCircleLeft /> <span className='ms-2'>{wizardButton('back')}</span>
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

            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{t('exampleTitle')}</h5>
                    <p className="card-text">
                        {t.rich('example', {
                            firstName: (chunks) => <span>{form.first_name || '________'}</span>,
                            lastName: (chunks) => <span>{form.last_name || '________'}</span>,
                            documentNumber: (chunks) => <span>{form.document_number || '________'}</span>,
                            expeditionCity: (chunks) => <span>{form.expedition_city || '________'}</span>,
                            isMerchant: (chunks) => <span>{form.is_merchant.toLowerCase() === 'yes' ? '' : 'NO'}</span>,
                            cellPhone: (chunks) => <span>{form.cell_phone || '________'}</span>,
                            email: (chunks) => <span>{form.email || '________'}</span>
                        })}
                    </p>
                </div>
            </div>
        </>
    );
}
