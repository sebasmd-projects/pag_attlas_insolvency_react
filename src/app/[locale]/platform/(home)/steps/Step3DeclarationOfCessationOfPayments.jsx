// src/app/[locale]/platform/(home)/steps/Step3DeclarationOfCessationOfPayments.jsx

'use client'

import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

async function GetStep3() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=3');
    return data;
}

export default function Step3DeclarationOfCessationOfPayments({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step3');

    const { data: step3Data } = useQuery({
        queryKey: ['step3Data'],
        queryFn: GetStep3
    });

    // 1) Estado local
    const [form, setForm] = useState({
        debtor_statement_accepted: false
    });

    // 2) Inicialización sólo la primera vez que llegue step3Data
    const initialized = useRef(false);
    useEffect(() => {
        if (step3Data && !initialized.current) {
            const init = {
                debtor_statement_accepted: step3Data.debtor_statement_accepted ?? false
            };
            setForm(init);
            updateData(init);
            initialized.current = true;
        }
    }, [step3Data, updateData]);

    // 3) Manejo de cambios
    const handleChange = useCallback((e) => {
        const next = { debtor_statement_accepted: e.target.checked };
        setForm(next);
        updateData(next);
    }, [updateData]);

    // 4) Envío del paso
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onNext(form);
    }, [form, onNext]);

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
                            required
                        />
                        <label className="form-check-label" htmlFor="debtor_statement_accepted">
                            {t('declarationLabel')}
                        </label>
                    </div>
                </div>
            </form>
        </>
    );
}

Step3DeclarationOfCessationOfPayments.propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func,
};
