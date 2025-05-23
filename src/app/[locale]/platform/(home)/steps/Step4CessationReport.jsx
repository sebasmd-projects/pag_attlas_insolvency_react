// src/app/[locale]/platform/(home)/steps/Step4CessationReport.jsx

'use client';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { BsRobot } from 'react-icons/bs';
import { MdSaveAs } from "react-icons/md";

import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

async function GetStep4() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=4');
    return data;
}

export default function Step4CessationReport({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step4');
    const queryClient = useQueryClient();

    const { data: step4Data } = useQuery({
        queryKey: ['step4Data'],
        queryFn: GetStep4,
        refetchOnMount: true,
    });

    const [form, setForm] = useState({
        debtor_cessation_report: '',
        use_ai: false,
    });

    const initialized = useRef(false);

    useEffect(() => {
        if (step4Data && !initialized.current) {
            const init = {
                debtor_cessation_report: step4Data.debtor_cessation_report ?? data.debtor_cessation_report ?? '',
                use_ai: step4Data.use_ai ?? data.use_ai ?? false,
            };
            setForm(init);
            updateData(init);
            initialized.current = true;
        }
    }, [step4Data, data, updateData]);

    const saveMutation = useMutation({
        mutationFn: () =>
            axios.patch('/api/platform/insolvency-form/?step=4', form),
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step4Data']);
        },
        onError: () => toast.error(t('messages.saveError'))
    });
    const handleSave = () => saveMutation.mutate();

    const handleChange = useCallback((e) => {
        const { name, type, checked, value } = e.target;
        const nextValue = type === 'checkbox' ? checked : value;
        setForm(prev => {
            const next = { ...prev, [name]: nextValue };
            updateData(next);
            return next;
        });
    }, [updateData]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onNext(form);
    }, [form, onNext]);

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form
                id="wizard-step-form"
                className="row"
                onSubmit={handleSubmit}
            >
                {/* Texto de informe */}
                <div className="col-12 mb-3">
                    <label
                        htmlFor="debtor_cessation_report"
                        className="form-label"
                    >
                        {t('form.terminationReport')}
                    </label>
                    <textarea
                        id="debtor_cessation_report"
                        name="debtor_cessation_report"
                        className="form-control mb-3"
                        rows={10}
                        minLength={100}
                        required
                        aria-label={t('form.terminationReport')}
                        placeholder={t('form.terminationReport')}
                        value={form.debtor_cessation_report}
                        onChange={handleChange}
                    />
                </div>

                {/* Checkbox: Mejorar con IA */}
                <div className="col-12 mb-3 form-check card alert alert-primary">
                    <div className="mx-5 form-check card-body">
                        <input
                            id="use_ai"
                            name="use_ai"
                            type="checkbox"
                            className="form-check-input"
                            checked={form.use_ai}
                            onChange={handleChange}
                        />
                        <label htmlFor="use_ai" className="form-check-label">
                            <BsRobot /> {t('form.useAI', 'Mejorar el texto utilizando IA')}
                        </label>
                    </div>
                </div>
            </form>

            <div className="my-3">
                <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleSave}
                    disabled={saveMutation.isLoading}
                >
                    <MdSaveAs /> {saveMutation.isLoading ? t('messages.saving') : t('messages.save')}
                </button>
            </div>

            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{t('legalCausesTitle')}</h5>
                    <ul className="row">
                        {t.rich('legalCauses', {
                            li: (chunks) => (
                                <li key={chunks} className="col-md-5 mx-5 my-1">
                                    {chunks}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{t('exampleTitle')}</h5>
                    <p className="card-text">{t('example1')}</p>
                    <p className="card-text">{t('example2')}</p>
                    <p className="card-text">{t('example3')}</p>
                    <p className="card-text">{t('example4')}</p>
                    <p className="card-text">{t('example5')}</p>
                </div>
            </div>
        </>
    );
}

Step4CessationReport.propTypes = {
    data: PropTypes.shape({
        debtor_cessation_report: PropTypes.string,
        use_ai: PropTypes.bool,
    }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
