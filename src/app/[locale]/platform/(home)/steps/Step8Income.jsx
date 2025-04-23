'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

const INCOME_TYPE = [
    { label: 'salary', value: 'SALARIO' },
    { label: 'independent', value: 'INDEPENDIENTE' },
    { label: 'pensioner', value: 'PENSIONADO' },
    { label: 'unemployed', value: 'DESEMPLEADO' },
    { label: 'other', value: 'OTRO' },
];

const parseCurrencyInput = (value) =>
    parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;

const formatToLocaleNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const numericValue = typeof value === 'number' ? value : parseCurrencyInput(value);
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    }).format(numericValue);
};

export default function Step8Income({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step8');

    const buildInitialState = () => {
        const inc = Array.isArray(data?.incomes) && data.incomes.length > 0
            ? data.incomes[0]
            : {};
        return {
            type: inc.type || '',
            amount: inc.amount != null ? formatToLocaleNumber(inc.amount) : '',
            others: Array.isArray(inc.others) && inc.others.length > 0
                ? inc.others.map(o => ({
                    detail: o.detail || '',
                    amount: formatToLocaleNumber(o.amount),
                }))
                : [{ detail: '', amount: '' }],
        };
    };

    const [form, setForm] = useState(buildInitialState);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            setForm(buildInitialState());
            initialized.current = true;
        }
    }, [data.incomes]);

    useEffect(() => {
        const payload = {
            type: form.type,
            amount: ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type)
                ? parseCurrencyInput(form.amount)
                : null,
        };
        if (form.type === 'OTRO') {
            payload.others = form.others.map(o => ({
                detail: o.detail,
                amount: parseCurrencyInput(o.amount),
            }));
        }
        updateData({ incomes: [payload] });
    }, [form, updateData]);

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setForm({
            type,
            amount: ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(type)
                ? form.amount
                : '',
            others: type === 'OTRO'
                ? (form.others.length ? form.others : [{ detail: '', amount: '' }])
                : [{ detail: '', amount: '' }],
        });
    };

    const handleAmountChange = (e) => {
        const amount = e.target.value.replace(/[^0-9.,]/g, '');
        setForm(prev => ({ ...prev, amount }));
    };

    const handleAmountBlur = () => {
        setForm(prev => ({ ...prev, amount: formatToLocaleNumber(prev.amount) }));
    };

    const handleOthersDetailChange = (i, value) => {
        setForm(prev => {
            const others = [...prev.others];
            others[i].detail = value;
            return { ...prev, others };
        });
    };

    const handleOthersAmountChange = (i, value) => {
        setForm(prev => {
            const others = [...prev.others];
            others[i].amount = value.replace(/[^0-9.,]/g, '');
            return { ...prev, others };
        });
    };

    const handleOthersAmountBlur = (i) => {
        setForm(prev => {
            const others = [...prev.others];
            others[i].amount = formatToLocaleNumber(others[i].amount);
            return { ...prev, others };
        });
    };

    const addOther = () => setForm(prev => ({ ...prev, others: [...prev.others, { detail: '', amount: '' }] }));
    const removeOther = (i) => setForm(prev => ({ ...prev, others: prev.others.filter((_, idx) => idx !== i) }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            type: form.type,
            amount: ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type)
                ? parseCurrencyInput(form.amount)
                : null,
        };
        if (form.type === 'OTRO') {
            payload.others = form.others.map(o => ({
                detail: o.detail,
                amount: parseCurrencyInput(o.amount),
            }));
        }
        onNext({ incomes: [payload] });
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                <div className="mb-3">
                    <label className="form-label">{t('form.typeLabel')}</label>
                    <select className="form-select" value={form.type} onChange={handleTypeChange} required>
                        <option value="">{t('form.typeOptions.selectPlaceholder')}</option>
                        {INCOME_TYPE.map(op => (
                            <option key={op.value} value={op.value}>{t(`form.typeOptions.${op.label}`)}</option>
                        ))}
                    </select>
                </div>

                {['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type) && (
                    <div className="mb-3">
                        <label className="form-label">{t('form.amountLabel')}</label>
                        <input type="text" className="form-control" value={form.amount} onChange={handleAmountChange} onBlur={handleAmountBlur} inputMode="decimal" required />
                    </div>
                )}

                {form.type === 'OTRO' && form.others.map((other, idx) => (
                    <div key={idx} className="input-group mb-2">
                        <input type="text" className="form-control" placeholder={t('form.typeOptions.otherOptions.otherDetailPlaceholder')} value={other.detail} onChange={e => handleOthersDetailChange(idx, e.target.value)} required />
                        <input type="text" className="form-control" placeholder={t('form.typeOptions.otherOptions.otherAmountPlaceholder')} value={other.amount} onChange={e => handleOthersAmountChange(idx, e.target.value)} onBlur={() => handleOthersAmountBlur(idx)} required />
                        <button type="button" className="btn btn-outline-success" onClick={addOther}><FaPlus /></button>
                        {form.others.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => removeOther(idx)}><FaMinus /></button>}
                    </div>
                ))}
            </form>
        </>
    );
}

Step8Income.propTypes = {
    data: PropTypes.shape({ incomes: PropTypes.array }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};