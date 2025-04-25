// src/app/[locale]/platform/(home)/steps/Step8Income.jsx

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdSaveAs } from 'react-icons/md';
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';


const INCOME_TYPE = [
    { label: 'salary', value: 'SALARIO' },
    { label: 'independent', value: 'INDEPENDIENTE' },
    { label: 'pensioner', value: 'PENSIONADO' },
    { label: 'unemployed', value: 'DESEMPLEADO' },
    { label: 'other', value: 'OTRO' },
];

const parseCurrencyInput = (v) =>
    parseFloat(String(v || '0').replace(/,/g, '')) || 0;

const formatToLocaleNumber = (v) => {
    if (v === '' || v == null) return '';
    const n = typeof v === 'number' ? v : parseCurrencyInput(v);
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    }).format(n);
};

async function GetStep8() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=8');
    return data;
}

async function SaveStep8(incomes) {
    return axios.patch('/api/platform/insolvency-form/?step=8', { incomes });
}

export default function Step8Income({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step8');
    const queryClient = useQueryClient();

    const { data: step8Data } = useQuery({
        queryKey: ['step8Data'],
        queryFn: GetStep8,
        refetchOnMount: true,
    });

    const buildInitialState = () => {
        const inc =
            step8Data?.incomes?.length > 0
                ? step8Data.incomes[0]
                : data?.incomes?.[0] ?? {};

        return {
            type: inc.type ?? '',
            amount:
                inc.amount != null ? formatToLocaleNumber(inc.amount) : '',
            others:
                inc.others?.length > 0
                    ? inc.others.map((o) => ({
                        detail: o.detail ?? '',
                        amount: formatToLocaleNumber(o.amount),
                    }))
                    : [{ detail: '', amount: '' }],
        };
    };

    const [form, setForm] = useState(buildInitialState);

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current && step8Data) {
            const initState = buildInitialState();
            setForm(initState);
            updateData({ incomes: [initState] });
            initialized.current = true;
        }
    }, [step8Data, data, updateData]);

    useEffect(() => {
        const payload = {
            type: form.type,
            amount:
                ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type)
                    ? parseCurrencyInput(form.amount)
                    : null,
            others:
                form.type === 'OTRO'
                    ? form.others.map((o) => ({
                        detail: o.detail,
                        amount: parseCurrencyInput(o.amount),
                    }))
                    : [],
        };
        updateData({ incomes: [payload] });
    }, [form, updateData]);

    const saveMutation = useMutation({
        mutationFn: () => {
            const toSend = {
                type: form.type,
                amount:
                    ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type)
                        ? parseCurrencyInput(form.amount)
                        : null,
                others:
                    form.type === 'OTRO'
                        ? form.others.map((o) => ({
                            detail: o.detail,
                            amount: parseCurrencyInput(o.amount),
                        }))
                        : [],
            };
            return SaveStep8([toSend]);
        },
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step8Data']);
        },
        onError: () => toast.error(t('messages.saveError')),
    });

    const handleSave = () => saveMutation.mutate();

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setForm({
            type,
            amount:
                ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(type)
                    ? form.amount
                    : '',
            others:
                type === 'OTRO'
                    ? form.others.length
                        ? form.others
                        : [{ detail: '', amount: '' }]
                    : [{ detail: '', amount: '' }],
        });
    };

    const handleAmountChange = (e) => {
        const amount = e.target.value.replace(/[^0-9.,]/g, '');
        setForm((prev) => ({ ...prev, amount }));
    };

    const handleAmountBlur = () =>
        setForm((prev) => ({
            ...prev,
            amount: formatToLocaleNumber(prev.amount),
        }));

    const handleOthersDetailChange = (i, value) =>
        setForm((prev) => {
            const others = [...prev.others];
            others[i].detail = value;
            return { ...prev, others };
        });

    const handleOthersAmountChange = (i, value) =>
        setForm((prev) => {
            const others = [...prev.others];
            others[i].amount = value.replace(/[^0-9.,]/g, '');
            return { ...prev, others };
        });

    const handleOthersAmountBlur = (i) =>
        setForm((prev) => {
            const others = [...prev.others];
            others[i].amount = formatToLocaleNumber(others[i].amount);
            return { ...prev, others };
        });

    const addOther = () =>
        setForm((prev) => ({
            ...prev,
            others: [...prev.others, { detail: '', amount: '' }],
        }));

    const removeOther = (i) =>
        setForm((prev) => ({
            ...prev,
            others: prev.others.filter((_, idx) => idx !== i),
        }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            type: form.type,
            amount:
                ['SALARIO', 'INDEPENDIENTE', 'PENSIONADO'].includes(form.type)
                    ? parseCurrencyInput(form.amount)
                    : null,
            others:
                form.type === 'OTRO'
                    ? form.others.map((o) => ({
                        detail: o.detail,
                        amount: parseCurrencyInput(o.amount),
                    }))
                    : [],
        };
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
        </>
    );
}

Step8Income.propTypes = {
    data: PropTypes.shape({ incomes: PropTypes.array }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};