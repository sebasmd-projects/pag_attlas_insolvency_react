// src/app/[locale]/platform/(home)/steps/Step5Creditors.jsx

'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { MdSaveAs } from "react-icons/md";

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

/* ──────────── Constantes ──────────── */
const EXCLUDED_NATURES = ['CRÉDITO DE LIBRANZA', 'CRÉDITO DE NOMINA'];

const NATURE_OPTIONS = [
    'CRÉDITO DE LIBRANZA',
    'CRÉDITO DE NOMINA',
    'CRÉDITO HIPOTECARIO',
    'CRÉDITO DE GARANTÍA MOBILIARIA',
    'CRÉDITO FISCAL O TRIBUTARIO',
    'CRÉDITO DE LIBRE INVERSION',
    'CRÉDITO PERSONAL',
    'CRÉDITO COMERCIAL',
    'CRÉDITO ROTATIVO',
    'CRÉDITO EDUCATIVO O DE ESTUDIO',
    'CRÉDITO DE CONSUMO',
    'OTRO',
];

const CONSANGUINITY_OPTIONS = [
    ['NN', 'No tengo parentesco'],
    ['1C', '1° consanguíneo: Compañero/a permanente, Padres e Hijos'],
    ['2C', '2° consanguíneo: Abuelos, Nietos y Hermanos'],
    ['3C', '3° consanguíneo: Tíos y Sobrinos'],
    ['4C', '4° consanguíneo: Primos y Sobrinos (nietos)'],
    ['1A', '1° afinidad: Suegros y Yerno/Nuera'],
    ['2A', '2° afinidad: Abuelos, Nietos y Hermanos del compañero/a permanente'],
    ['1CIV', '1° civil: Hijos adoptados y Padres Adoptivos'],
];

const EMPTY_CREDITOR = {
    creditor: '',
    nit: '',
    creditor_contact: '',
    nature_type: '',
    other_nature: '',
    personal_credit_interest_rate: '',
    personal_consanguinity: '',
    guarantee: '',
    capital_value: '',
    days_overdue: '',
};

/* ──────────── Helpers de formato ──────────── */
const toFmt = (v) => new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
}).format(v || 0);

const toNum = (v) => parseFloat(String(v || '0').replace(/,/g, '')) || 0;

/* ──────────── Hook de métricas ──────────── */
function useMetrics(list) {
    return useMemo(() => {
        const m = {
            withEx: { total: 0, arrears: 0 },
            noEx: { total: 0, arrears: 0, severeArrears: 0, severeCount: 0 },
        };
        list.forEach((c) => {
            const capital = toNum(c.capital_value);
            const days = parseInt(c.days_overdue, 10) || 0;
            const excluded = EXCLUDED_NATURES.includes(c.nature_type);
            m.withEx.total += capital;
            if (days > 0) m.withEx.arrears += capital;
            if (!excluded) {
                m.noEx.total += capital;
                if (days > 0) m.noEx.arrears += capital;
                if (days >= 90) {
                    m.noEx.severeArrears += capital;
                    m.noEx.severeCount += 1;
                }
            }
        });
        m.withEx.current = m.withEx.total - m.withEx.arrears;
        m.noEx.current = m.noEx.total - m.noEx.arrears;
        m.noEx.pct = m.noEx.total ? (m.noEx.severeArrears / m.noEx.total) * 100 : 0;
        return m;
    }, [list]);
}

async function fetchStep5() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=5');
    return data;
}

async function saveStep5(creditors) {
    const payload = {
        creditors: creditors.map(c => ({
            ...c,
            capital_value: toNum(c.capital_value),
            days_overdue: parseInt(c.days_overdue, 10) || 0,
        }))
    };
    return axios.patch('/api/platform/insolvency-form/?step=5', payload);
}

export default function Step5Creditors({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step5');
    const queryClient = useQueryClient();

    const { data: step5Data } = useQuery({
        queryKey: ['step5Data'],
        queryFn: fetchStep5,
        refetchOnMount: true,
    });

    const saveMutation = useMutation({
        mutationFn: saveStep5,
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step5Data']);
        },
        onError: () => toast.error(t('messages.saveError'))
    });

    const [form, setForm] = useState({ creditors: [EMPTY_CREDITOR] });

    const initialized = useRef(false);
    useEffect(() => {
        if (step5Data && !initialized.current) {
            const initList = step5Data.creditors ?? data.creditors ?? [EMPTY_CREDITOR];
            setForm({ creditors: initList });
            updateData({ creditors: initList });
            initialized.current = true;
        }
    }, [step5Data, data, updateData]);

    const metrics = useMetrics(form.creditors);
    const { withEx: withExcluded, noEx: withoutExcluded } = metrics;
    const compliancePct = withoutExcluded.pct;

    useEffect(() => updateData({ creditors: form.creditors }), [form.creditors, updateData]);


    // 4) Helpers para añadir, eliminar y modificar filas
    const persist = (list) => setForm({ creditors: list });
    const addRow = () => persist([...form.creditors, EMPTY_CREDITOR]);
    const removeRow = (idx) => form.creditors.length > 1 && persist(
        form.creditors.filter((_, i) => i !== idx)
    );

    const handleChange = (idx, e) => {
        const { name, value } = e.target;
        persist(
            form.creditors.map((c, i) => i === idx ? { ...c, [name]: value } : c)
        );
    };

    const handleBlurCurrency = (idx) => persist(
        form.creditors.map((c, i) =>
            i === idx
                ? { ...c, capital_value: toFmt(toNum(c.capital_value)) }
                : c
        )
    );

    // 5) Validación legal y envío
    const isLegal = () => {
        if (withoutExcluded.severeCount < 2) {
            toast.error(t('errors.minSevereCount'));
            return false;
        }
        if (compliancePct < 30) {
            toast.error(t('errors.minSeverePct'));
            return false;
        }
        return true;
    };

    const handleSave = () => saveMutation.mutate(form.creditors);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLegal()) return;
        onNext({
            creditors: form.creditors.map(c => ({
                id: c.id,
                creditor: c.creditor,
                nit: c.nit,
                creditor_contact: c.creditor_contact,
                nature_type: c.nature_type,
                other_nature: c.other_nature,
                personal_credit_interest_rate: c.personal_credit_interest_rate,
                personal_consanguinity: c.personal_consanguinity,
                guarantee: c.guarantee,
                capital_value: toNum(c.capital_value),
                days_overdue: parseInt(c.days_overdue, 10) || 0,
            }))
        });
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} id="wizard-step-form">
                <div className="table-responsive mb-3">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>{t('form.headers.creditor')}</th>
                                <th>{t('form.headers.nit')}</th>
                                <th>{t('form.headers.contact')}</th>
                                <th>{t('form.headers.nature')}</th>
                                <th>{t('form.headers.supportGuarantee')}</th>
                                <th>{t('form.headers.capital')}</th>
                                <th>{t('form.headers.daysOverdue')}</th>
                                <th>{t('form.headers.creditClassification')}</th>
                                <th>{t('form.headers.actions.title')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.creditors.map((c, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            name="creditor"
                                            id='creditor'
                                            className="form-control"
                                            value={c.creditor}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="nit"
                                            id='nit'
                                            className="form-control"
                                            value={c.nit}
                                            onChange={(e) => handleChange(idx, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="creditor_contact"
                                            id='creditor_contact'
                                            className="form-control"
                                            value={c.creditor_contact}
                                            onChange={(e) => handleChange(idx, e)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="nature_type"
                                            className="form-select"
                                            value={c.nature_type}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        >
                                            <option value="">{t('form.placeholders.select')}</option>
                                            {NATURE_OPTIONS.map((n) => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                        {c.nature_type === 'OTRO' && (
                                            <input
                                                name="other_nature"
                                                className="form-control mt-1"
                                                value={c.other_nature}
                                                onChange={(e) => handleChange(idx, e)}
                                                required
                                            />
                                        )}
                                        {c.nature_type === 'CRÉDITO PERSONAL' && (
                                            <>
                                                <select
                                                    name="personal_consanguinity"
                                                    className="form-select mt-1"
                                                    value={c.personal_consanguinity}
                                                    onChange={(e) => handleChange(idx, e)}
                                                    required
                                                >
                                                    <option value="">
                                                        {t('form.placeholders.consanguinity')}
                                                    </option>
                                                    {CONSANGUINITY_OPTIONS.map(([val, lbl]) => (
                                                        <option key={val} value={val}>
                                                            {lbl}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    name="personal_credit_interest_rate"
                                                    className="form-control mt-1"
                                                    value={c.personal_credit_interest_rate}
                                                    placeholder={t('form.placeholders.interestRate')}
                                                    onChange={(e) => handleChange(idx, e)}
                                                    inputMode="decimal"
                                                    required
                                                />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <textarea
                                            name="guarantee"
                                            className="form-control"
                                            rows={3}
                                            value={c.guarantee}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="capital_value"
                                            className="form-control text-end"
                                            value={c.capital_value}
                                            onChange={(e) => handleChange(idx, e)}
                                            onBlur={() => handleBlurCurrency(idx)}
                                            inputMode="decimal"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="days_overdue"
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            value={c.days_overdue}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="credit_classification"
                                            className="form-select"
                                            value={c.credit_classification}
                                            onChange={(e) => handleChange(idx, e)}
                                        >
                                            <option value="">{t('form.placeholders.selectClassification')}</option>
                                            <option value="1">{t('form.creditClassificationOptions.1')}</option>
                                            <option value="2">{t('form.creditClassificationOptions.2')}</option>
                                            <option value="3">{t('form.creditClassificationOptions.3')}</option>
                                            <option value="5">{t('form.creditClassificationOptions.5')}</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeRow(idx)}
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

                {/* Botón agregar */}
                <div className="d-grid gap-2 mb-4">
                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={addRow}
                    >
                        {t('form.addCreditor')}
                    </button>
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

            {/* Totales y validación */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t('totals.title')}</h5>
                    <div className="row justify-content-around">
                        <div className="col-md-6">
                            <h6>{t('totals.includingExcluded')}</h6>
                            <ul className="list-unstyled">
                                <li>
                                    {t('totals.arrears')}: $ {toFmt(withExcluded.arrears)}
                                </li>
                                <li>
                                    {t('totals.current')}: $ {toFmt(withExcluded.current)}
                                </li>
                                <li>
                                    {t('totals.totalDebt')}: $ {toFmt(withExcluded.total)}
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h6>{t('totals.excludingExcluded')}</h6>
                            <ul className="list-unstyled">
                                <li>
                                    {t('totals.arrears')}: $ {toFmt(withoutExcluded.arrears)}
                                </li>
                                <li>
                                    {t('totals.severeArrears')}: $ {toFmt(withoutExcluded.severeArrears)}
                                </li>
                                <li>
                                    {t('totals.current')}: $ {toFmt(withoutExcluded.current)}
                                </li>
                                <li>
                                    {t('totals.totalDebt')}: $ {toFmt(withoutExcluded.total)}
                                </li>
                                <li>
                                    {t('totals.severeCount')}: {withoutExcluded.severeCount}
                                </li>
                                <li>
                                    {t('totals.compliancePercentage')}: {compliancePct.toFixed(1)}%
                                </li>
                            </ul>
                        </div>
                    </div>

                    {withoutExcluded.severeCount >= 2 && compliancePct >= 30 ? (
                        <div className="alert alert-success mt-3">
                            {t('validation.meetsRequirements')}
                        </div>
                    ) : (
                        <div className="alert alert-danger mt-3">
                            {t('validation.doesNotMeetRequirements')}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Step5Creditors.propTypes = {
    data: PropTypes.shape({ creditors: PropTypes.array }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
