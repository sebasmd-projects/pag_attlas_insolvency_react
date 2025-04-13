'use client';

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

const EXCLUDED_NATURES = ['CRÉDITO DE LIBRANZA', 'CRÉDITO DE NÓMINA'];
const NATURE_OPTIONS = [
    'CRÉDITO DE LIBRANZA', 'CRÉDITO HIPOTECARIO', 'CRÉDITO CON GARANTÍA MOBILIARIA', 'CRÉDITO FISCAL O TRIBUTARIO',
    'CRÉDITO DE LIBRE INVERSIÓN', 'CRÉDITO DE NÓMINA', 'CRÉDITO PERSONAL', 'CRÉDITO COMERCIAL',
    'CRÉDITO ROTATIVO', 'CRÉDITO EDUCATIVO O DE ESTUDIO', 'CRÉDITO DE CONSUMO', 'OTRO'
];
const CONSANGUINITY_OPTIONS = [
    "1° consanguíneo: Compañero/a permanente, Padres e Hijos",
    "2° consanguíneo: Abuelos, Nietos y Hermanos",
    "3° consanguíneo: Tíos y Sobrinos",
    "4° consanguineo: Primos y Sobrinos (nietos)",
    "",
    "1° afinidad: Suegros y Yerno/Nuera",
    "2° afinidad: Abuelos, Nietos y Hermanos del compañero/a permanente",
    "1° civil: Hijos adoptados y Padres Adoptivos",
]
const EMPTY_CREDITOR = {
    name: '', nature: '',
    other_nature: '', consanguinity: '',
    interest_rate: '', guarantee_support: '',
    capital_value: '', days_overdue: 0,
};

const toFmt = (v) => new Intl.NumberFormat('es-CO').format(v || 0);
const toNum = (v) =>
    parseFloat(String(v || '0').replace(/\./g, '').replace(',', '.')) || 0;

/* ────────── Métricas para la validación legal ────────── */

function useMetrics(list) {
    return useMemo(() => {
        const m = {
            withEx: {               // ← totales con TODO incluido
                total: 0,
                arrears: 0,           // ≥ 1 día de mora
            },
            noEx: {                 // ← totales SIN las naturalezas excluidas
                total: 0,
                arrears: 0,
                severeArrears: 0,     // ≥ 90 días
                severeCount: 0,
            },
        };

        list.forEach((c) => {
            const capital = toNum(c.capital_value);
            const days = parseInt(c.days_overdue) || 0;
            const excluded = EXCLUDED_NATURES.includes(c.nature);

            /* ── con excluidos ───────────────────────────── */
            m.withEx.total += capital;
            if (days > 0) m.withEx.arrears += capital;

            /* ── sin excluidos ───────────────────────────── */
            if (!excluded) {
                m.noEx.total += capital;
                if (days > 0) m.noEx.arrears += capital;
                if (days >= 90) {
                    m.noEx.severeArrears += capital;
                    m.noEx.severeCount += 1;
                }
            }
        });

        // porcentajes y “current”
        m.withEx.current = m.withEx.total - m.withEx.arrears;
        m.noEx.current = m.noEx.total - m.noEx.arrears;
        m.noEx.pct = m.noEx.total
            ? (m.noEx.severeArrears / m.noEx.total) * 100
            : 0;

        return m;
    }, [list]);
}

/* ─────────────── Componente Principal ─────────────── */
export default function Step5Creditors({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step5');

    /* ---------- estado ---------- */
    const initialState = {
        creditors:
            data?.creditors?.length > 0 ? data.creditors : [EMPTY_CREDITOR],
    };

    const [form, setForm] = useState(() => initialState);

    /* ---------- métricas ---------- */
    const metrics = useMetrics(form.creditors);

    const {
        withEx: withExcluded,
        noEx: withoutExcluded,
    } = metrics;

    const compliancePct = withoutExcluded.pct;

    useEffect(() => {
        setForm(initialState);
    }, []);




    /* ---------- helpers ---------- */
    const persist = (next) => {
        setForm(next);
        updateData({ creditors: next.creditors });
    };

    const addRow = () => {
        persist({ creditors: [...form.creditors, EMPTY_CREDITOR] });
    };

    const removeRow = (idx) => {
        if (form.creditors.length <= 1) return;
        const next = form.creditors.filter((_, i) => i !== idx);
        persist({ creditors: next });
    };

    const handleChange = (idx, e) => {
        const { name, value } = e.target;
        const next = form.creditors.map((c, i) =>
            i === idx ? { ...c, [name]: value } : c,
        );
        persist({ creditors: next });
    };

    const handleBlurCurrency = (idx) => {
        const next = form.creditors.map((c, i) =>
            i === idx
                ? { ...c, capital_value: toFmt(toNum(c.capital_value)) }
                : c,
        );
        persist({ creditors: next });
    };

    /* ---------- validación legal ---------- */
    const isLegal = () => {
        if (withoutExcluded.severeCount < 2) {
            toast.error(t('errors.minSevereCount'));
            return false;
        }
        if (withoutExcluded.pct < 30) {
            toast.error(t('errors.minSeverePct'));
            return false;
        }
        return true;
    };

    /* ---------- envío ---------- */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLegal()) return;
        onNext({ creditors: form.creditors });
    };

    /* ---------- UI ---------- */
    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form
                onSubmit={handleSubmit}
                className="row"
                id="wizard-step-form"
                noValidate
            >
                <div className="table-responsive mb-3">
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
                            {form.creditors.map((c, idx) => (
                                <tr key={idx}>
                                    {/* Acreedor */}
                                    <td>
                                        <input
                                            name="name"
                                            className="form-control"
                                            value={c.name}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        />
                                    </td>

                                    {/* Naturaleza */}
                                    <td>
                                        <select
                                            name="nature"
                                            className="form-select"
                                            value={c.nature}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        >
                                            <option value="">{t('form.placeholders.select')}</option>
                                            {NATURE_OPTIONS.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>

                                        {c.nature === 'OTRO' && (
                                            <input
                                                name="other_nature"
                                                className="form-control mt-1"
                                                value={c.other_nature}
                                                onChange={(e) => handleChange(idx, e)}
                                                required
                                            />
                                        )}

                                        {c.nature === 'CRÉDITO PERSONAL' && (
                                            <select
                                                name="consanguinity"
                                                className="form-select mt-1"
                                                value={c.consanguinity}
                                                onChange={(e) => handleChange(idx, e)}
                                                required
                                            >
                                                <option value="">{t('form.placeholders.consanguinity')}</option>
                                                {CONSANGUINITY_OPTIONS.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {c.nature === 'CRÉDITO PERSONAL' && (
                                            <input
                                                name="interest_rate"
                                                className="form-control mt-1"
                                                value={c.interest_rate}
                                                onChange={(e) => handleChange(idx, e)}
                                                placeholder={t('form.placeholders.interestRate')}
                                                inputMode="decimal"
                                                required
                                            />
                                        )}
                                    </td>

                                    {/* Garantía */}
                                    <td>
                                        <textarea
                                            name="guarantee_support"
                                            className="form-control"
                                            rows={3}
                                            value={c.guarantee_support}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        />
                                    </td>

                                    {/* Capital */}
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

                                    {/* Días en mora */}
                                    <td>
                                        <input
                                            name="days_overdue"
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            value={c.days_overdue}
                                            onChange={(e) => handleChange(idx, e)}
                                            required
                                        />
                                    </td>

                                    {/* Acciones */}
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

                {/* Botón agregar acreedor */}

                <div className="d-grid gap-2 mb-4">
                    <button
                        type="button"
                        className="btn btn-outline-success mb-3"
                        onClick={addRow}
                    >
                        {t('form.addCreditor')}
                    </button>
                </div>
            </form>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t('totals.title')}</h5>

                    <div className="row flex justify-content-around">
                        {/* Incluyendo excluidos */}
                        <div className="col-md-6">
                            <h6>{t('totals.includingExcluded')}</h6>
                            <ul className="list-unstyled">
                                <li>{t('totals.arrears')}: $ {toFmt(withExcluded.arrears)}</li>
                                <li>{t('totals.current')}: $ {toFmt(withExcluded.current)}</li>
                                <li>{t('totals.totalDebt')}: $ {toFmt(withExcluded.total)}</li>
                            </ul>
                        </div>

                        {/* Excluyendo excluidos */}
                        <div className="col-md-6">
                            <h6>{t('totals.excludingExcluded')}</h6>
                            <ul className="list-unstyled">
                                <li>{t('totals.arrears')}: $ {toFmt(withoutExcluded.arrears)}</li>
                                <li>{t('totals.severeArrears')}: $ {toFmt(withoutExcluded.severeArrears)}</li>
                                <li>{t('totals.current')}: $ {toFmt(withoutExcluded.current)}</li>
                                <li>{t('totals.totalDebt')}: $ {toFmt(withoutExcluded.total)}</li>
                                <li>{t('totals.severeCount')}: {withoutExcluded.severeCount}</li>
                                <li>{t('totals.compliancePercentage')}: {compliancePct.toFixed(1)}%</li>
                            </ul>
                        </div>
                    </div>

                    {compliancePct >= 30 && withoutExcluded.severeCount >= 2 ? (
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
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};
