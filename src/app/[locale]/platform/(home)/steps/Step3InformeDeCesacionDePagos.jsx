// src/app/[locale]/platform/(home)/steps/Step3InformeDeCesacionDePagos.jsx

'use client';

import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Step3InformeDeCesacionDePagos({ data, onNext, onBack, isSubmitting }) {

    const t = useTranslations('Platform.pages.home.wizard.steps.step3');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const [form, setForm] = useState({
        termination_report: data.termination_report || '',
    });

    useEffect(() => {
        setForm({
            termination_report: data.termination_report || '',
        });
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.termination_report.trim()) {
            toast.error(t('form.error'));
            return;
        }
        onNext(form);
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label mx-3">
                        {t('subTitle')}
                    </label>
                    <textarea
                        name="termination_report"
                        className="form-control"
                        rows="10"
                        placeholder={t('form.terminationReport')}
                        value={form.termination_report}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="btn btn-secondary" onClick={onBack}>
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

            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">
                        {t('exampleTitle')}
                    </h5>
                    <p className="card-text">
                        {t('example')}
                    </p>
                </div>
            </div>
        </>
    );
}
