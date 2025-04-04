// src/app/[locale]/platform/(home)/steps/Step2DeclaracionDeCesacionDePagos.jsx

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import TitleComponent from '@/components/micro-components/title';

export default function Step2DeclaracionDeCesacionDePagos({ data, onNext, onBack, isSubmitting }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.step2');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const [form, setForm] = useState({
        statement: data.statement || false,
    });

    useEffect(() => {
        setForm({
            statement: data.statement || false,
        });
    }, [data]);

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(form);
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <form onSubmit={handleSubmit}>
                <div className="card my-3">
                    <div className="card-body">
                        <p className="card-text">
                            {t.rich('declarationText', {
                                u: (chunks) => (
                                    <u>
                                        {data?.is_merchant &&
                                            data.is_merchant.toLowerCase() === "no"
                                            ? chunks
                                            : ''}
                                    </u>
                                )
                            })}
                        </p>
                    </div>
                    <div className="card-footer">
                        <div className="alert alert-info" role="alert">
                            <small>{t('declarationNote')}</small>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="statement"
                            id="statementCheckbox"
                            checked={form.statement}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-check-label" htmlFor="statementCheckbox">
                            {t('declarationLabel')}
                        </label>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="btn btn-secondary" onClick={onBack}>
                        <FaArrowCircleLeft /> <span className='ms-2'>{wizardButton('back')}</span>
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || !form.statement}
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


        </>
    );
}