// src/app/[locale]/platform/(home)/steps/Step7Ingresos.jsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft, FaArrowCircleRight, FaPlus, FaMinus } from 'react-icons/fa';

export default function Step7Ingresos({ data, onNext, onBack, isSubmitting }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step7');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const INCOME_TYPE = [
        { label: 'salary', value: 'SALARIED' },
        { label: 'independent', value: 'INDEPENDENT' },
        { label: 'pensioner', value: 'PENSIONER' },
        { label: 'unemployed', value: 'UNEMPLOYED' },
        { label: 'other', value: 'OTHER' },
    ];

    const formatToLocaleNumber = (value) => {
        if (value === '' || value === null || value === undefined) return '';
        const numericValue = parseCurrencyInput(value);
        if (isNaN(numericValue)) return '';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        }).format(numericValue);
    };

    const parseCurrencyInput = (value) => {
        const numericString = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString);
    };

    const [form, setForm] = useState({
        type: data.type || '',
        amount: data.amount || '',
        others: data.others || [{ detail: '', amount: '' }],
    });

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setForm({
            ...form,
            type: selectedType,
            amount: (selectedType === 'SALARIED' ||
                selectedType === 'INDEPENDENT' ||
                selectedType === 'PENSIONER')
                ? form.amount
                : '',
            others: selectedType === 'OTHER' ? (form.others.length ? form.others : [{ detail: '', amount: '' }]) : [{ detail: '', amount: '' }],
        });
    };

    const handleAmountChange = (e) => {
        const filteredValue = e.target.value.replace(/[^0-9.,]/g, '');
        setForm({ ...form, amount: filteredValue });
    };

    const handleAmountBlur = () => {
        setForm((prev) => ({
            ...prev,
            amount: formatToLocaleNumber(prev.amount),
        }));
    };

    const handleOthersDetailChange = (index, value) => {
        const newOthers = [...form.others];
        newOthers[index].detail = value;
        setForm({ ...form, others: newOthers });
    };

    const handleOthersAmountChange = (index, value) => {
        const newOthers = [...form.others];
        newOthers[index].amount = value.replace(/[^0-9.,]/g, '');
        setForm({ ...form, others: newOthers });
    };

    const handleOthersAmountBlur = (index) => {
        const newOthers = [...form.others];
        newOthers[index].amount = formatToLocaleNumber(newOthers[index].amount);
        setForm({ ...form, others: newOthers });
    };

    const addOther = () => {
        setForm({ ...form, others: [...form.others, { detail: '', amount: '' }] });
    };

    const removeOther = (index) => {
        if (form.others.length > 1) {
            const newOthers = [...form.others];
            newOthers.splice(index, 1);
            setForm({ ...form, others: newOthers });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.type) {
            toast.error(t('form.errorType'));
            return;
        }
        if (form.type === 'SALARIED' || form.type === 'INDEPENDENT' || form.type === 'PENSIONER') {
            if (!form.amount.trim()) {
                toast.error(t('form.errorAmount'));
                return;
            }
        }
        if (form.type === 'OTHER') {
            const validOthers = form.others.filter(item => item.detail.trim() && item.amount.trim());
            if (validOthers.length === 0) {
                toast.error(t('form.errorOther'));
                return;
            }
        }

        onNext(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-4">{t('title')}</h5>

            <div className="mb-3">
                <label className="form-label">{t('form.typeLabel')}</label>
                <select className="form-select" value={form.type} onChange={handleTypeChange} required>
                    <option value="">{t('form.typeOptions.selectPlaceholder')}</option>
                    {INCOME_TYPE.map((op) => (
                        <option key={op.value} value={op.value}>
                            {t(`form.typeOptions.${op.label}`)}
                        </option>
                    ))}
                </select>
            </div>

            {(form.type === 'SALARIED' || form.type === 'INDEPENDENT' || form.type === 'PENSIONER') && (
                <div className="mb-3">
                    <label className="form-label">{t('form.amountLabel') || 'Cuánto?'}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.amount}
                        onChange={handleAmountChange}
                        onBlur={handleAmountBlur}
                        inputMode="decimal"
                        onWheel={(e) => e.target.blur()}
                        required
                    />
                </div>
            )}

            {form.type === 'OTHER' && (
                <div className="mb-3">
                    <label className="form-label">{t('form.typeOptions.otherOptions.otherLabel')}</label>
                    {form.others.map((other, index) => (
                        <div key={index} className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('form.typeOptions.otherOptions.otherDetailPlaceholder')}
                                value={other.detail}
                                onChange={(e) => handleOthersDetailChange(index, e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('form.typeOptions.otherOptions.otherAmountPlaceholder')}
                                value={other.amount}
                                onChange={(e) => handleOthersAmountChange(index, e.target.value)}
                                onBlur={() => handleOthersAmountBlur(index)}
                                inputMode="decimal"
                                onWheel={(e) => e.target.blur()}
                                required
                            />
                            <div className="input-group-text">
                                {index === form.others.length - 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={addOther}
                                    >
                                        <FaPlus />
                                    </button>
                                )}
                                {form.others.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger ms-2"
                                        onClick={() => removeOther(index)}
                                    >
                                        <FaMinus />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
    );
}
