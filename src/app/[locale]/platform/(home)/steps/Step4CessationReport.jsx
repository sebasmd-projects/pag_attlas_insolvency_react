// src/app/[locale]/platform/(home)/steps/Step4CessationReport.jsx

'use client';
import PropTypes from 'prop-types';
import { BsRobot } from 'react-icons/bs';
import { MdSaveAs } from "react-icons/md";

import { useStep } from '../hooks/useStep';


import TitleComponent from '@/components/micro-components/title';
import SubTitleComponent from '@/components/micro-components/sub_title';

export default function Step4CessationReport({ data, updateData, onNext }) {
    
    const buildInitial = (data) => ({
        debtor_cessation_report: data?.debtor_cessation_report || '',
        use_ai: data ? !!data.use_ai : false,
    });

    const { form, t, handleChange, handleSubmit, handleSave, saveLoading } = useStep({
        stepNumber: 4,
        buildInitial,
        updateData,
        onNext,
    });

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
                    disabled={saveLoading}
                >
                    <MdSaveAs /> {saveLoading ? t('messages.saving') : t('messages.save')}
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
