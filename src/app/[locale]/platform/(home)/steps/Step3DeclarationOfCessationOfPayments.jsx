// src/app/[locale]/platform/(home)/steps/Step3DeclarationOfCessationOfPayments.jsx

'use client';
import PropTypes from 'prop-types';
import { MdSaveAs } from "react-icons/md";

import { useStep } from '../hooks/useStep';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

export default function Step3DeclarationOfCessationOfPayments({ data, updateData, onNext }) {

    const buildInitial = (serverData) => ({
        debtor_statement_accepted: serverData?.debtor_statement_accepted ?? false
    });

    const { form, t, handleChange, handleSubmit, handleSave, saveLoading } = useStep({
        stepNumber: 3,
        buildInitial,
        updateData,
        onNext,
    });


    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title={'subTitle'} />

            <div className="card my-3">
                <div className="card-body">
                    <p className="card-text">
                        {t.rich('declarationText', {
                            u: (chunks) => (
                                <u>
                                    {
                                        data.debtor_is_merchant
                                            ? ''
                                            : chunks
                                    }
                                </u>
                            ),
                            b: (chunks) => (
                                <strong>
                                    {chunks}
                                </strong>
                            ),
                        })}
                    </p>
                </div>
                <div className="card-footer">
                    <div className="alert alert-warning m-1" role="alert">
                        <small>{t('declarationNote')}</small>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                <div className="mb-2">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="debtor_statement_accepted"
                            id="debtor_statement_accepted"
                            checked={form.debtor_statement_accepted}
                            onChange={handleChange}

                        />
                        <label className="form-check-label" htmlFor="debtor_statement_accepted">
                            {t('declarationLabel')}
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
        </>
    );
}

Step3DeclarationOfCessationOfPayments.propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func,
};
