// src/app/[locale]/platform/(home)/steps/Step4Acreedores.jsx

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

export default function Step4Acreedores({ data, onNext, onBack, isSubmitting }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step4');
    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    const formatToLocaleNumber = (value) => {
        if (value === '' || value === null || value === undefined) return '';
        const numericValue =
            typeof value === 'string'
                ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
                : value;
        if (isNaN(numericValue)) return '';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        }).format(numericValue);
    };

    const initialCreditors = data.creditors?.length
        ? data.creditors.map((c) => ({
            ...c,
            capital_value: c.capital_value ? formatToLocaleNumber(c.capital_value) : '',
        }))
        : [
            { name: '', nature: '', guarantee_support: '', capital_value: '', days_overdue: '' },
        ];

    const [form, setForm] = useState({
        creditors: initialCreditors,
    });

    useEffect(() => {
        const newCreditors = data.creditors?.length
            ? data.creditors.map((c) => ({
                ...c,
                capital_value: c.capital_value ? formatToLocaleNumber(c.capital_value) : '',
            }))
            : [{ name: '', nature: '', guarantee_support: '', capital_value: '', days_overdue: '' }];
        setForm({ creditors: newCreditors });
    }, [data]);

    const normalizeText = (str) =>
        str.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();

    const parseCurrencyToNumber = (value) => {
        if (!value) return 0;
        const numericString = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString);
    };

    const handleChange = (index, e) => {
        const { name, value, files } = e.target;
        const updated = [...form.creditors];

        if (name === 'capital_value') {
            const filteredValue = value.replace(/[^0-9.,]/g, '');
            updated[index][name] = filteredValue;
        } else if (name === 'name' || name === 'nature') {
            updated[index][name] = normalizeText(value);
        } else if (files) {
            updated[index][name] = files[0];
        } else {
            updated[index][name] = value;
        }

        setForm({ creditors: updated });
    };

    const handleBlur = (index, e) => {
        const { name, value } = e.target;
        if (name === 'capital_value') {
            const updated = [...form.creditors];
            updated[index][name] = formatToLocaleNumber(value);
            setForm({ creditors: updated });
        }
    };

    const addRow = () => {
        setForm({
            creditors: [
                ...form.creditors,
                { name: '', nature: '', guarantee_support: '', capital_value: '', days_overdue: '' },
            ],
        });
    };

    const removeRow = (index) => {
        if (form.creditors.length <= 1) return;
        const updated = [...form.creditors];
        updated.splice(index, 1);
        setForm({ creditors: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            form.creditors.some(
                (a) => !a.name || !a.nature || !a.capital_value || !a.days_overdue
            )
        ) {
            toast.error(
                t('form.error')
            );
            return;
        }

        const creditorsToSend = form.creditors.map((acreedor) => ({
            ...acreedor,
            capital_value: parseCurrencyToNumber(acreedor.capital_value),
            days_overdue: acreedor.days_overdue ? parseInt(acreedor.days_overdue) : 0,
        }));

        onNext({ creditors: creditorsToSend });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-4">{t('title')}</h5>

            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>{t('form.headers.creditor')}</th>
                            <th>{t('form.headers.nature')}</th>
                            <th>{t('form.headers.supportGuarantee')}</th>
                            <th>{t('form.headers.capital')}</th>
                            <th>{t('form.headers.daysInArrears')}</th>
                            <th>{t('form.headers.actions.title')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {form.creditors.map((acreedor, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={acreedor.name}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="nature"
                                        value={acreedor.nature}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <textarea
                                        name="guarantee_support"
                                        value={acreedor.guarantee_support}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        rows={5}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="capital_value"
                                        value={acreedor.capital_value}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        className="form-control text-end"
                                        inputMode="decimal"
                                        onWheel={(e) => e.target.blur()}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="days_overdue"
                                        value={acreedor.days_overdue}
                                        onChange={(e) => handleChange(index, e)}
                                        className="form-control"
                                        min="0"
                                        required
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeRow(index)}
                                        disabled={form.creditors.length <= 1}
                                    >
                                        {t('form.headers.actions.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-4">
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={addRow}
                >
                    {t('form.addCreditor')}
                </button>
            </div>

            <div className="col-12 d-flex justify-content-between">
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
