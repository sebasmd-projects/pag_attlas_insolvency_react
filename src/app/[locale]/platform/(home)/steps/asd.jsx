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
        queryFn: fetchStep5
    });

    const saveMutation = useMutation({
        mutationFn: saveStep5,
        onSuccess: () => {
            toast.success(t('messages.saveSuccess'));
            queryClient.invalidateQueries(['step5Data']);
        },
        onError: () => {
            toast.error(t('messages.saveError'));
        }
    });

    // 1) Inicializamos SOLO UNA VEZ el estado local
    const [form, setForm] = useState({ creditors: [EMPTY_CREDITOR] });

    // 2) Inicializar solo una vez desde `data`
    const initialized = useRef(false);
    useEffect(() => {
        if (step5Data && !initialized.current) {
            const initList = step5Data.creditors ?? data.creditors ?? [EMPTY_CREDITOR];
            setForm({ creditors: initList });
            updateData({ creditors: initList });
            initialized.current = true;
        }
    }, [step5Data, data, updateData]);

    // 2) Calculamos métricas y totales en cada render
    const metrics = useMetrics(form.creditors);
    const { withEx: withExcluded, noEx: withoutExcluded } = metrics;
    const compliancePct = withoutExcluded.pct;

    // 3) Sincronizamos con el wizard *solo* cuando cambia la lista
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

    const handleSave = () => {
        saveMutation.mutate(form.creditors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLegal()) return;
        const payloadList = form.creditors.map(c => ({
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
        }));
        onNext({ creditors: payloadList });
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

                <div className='my-5'>
                    <button
                        type="button"
                        className="btn btn-info me-2"
                        onClick={handleSave}
                        disabled={saveMutation.isLoading}
                    >
                        <MdSaveAs className="me-1" /> {t('form.save')}
                    </button>
                </div>
            </form>

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

// src/app/[locale]/platform/(home)/steps/Step6MovableImmovableProperty.jsx

'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

/* ──────────── Constantes ──────────── */
const EMPTY_ASSET = {
    asset_type: '',
    name: '',
    identification: '',
    lien: '',
    affectation: '',
    legal_measure: [],
    patrimonial_society: '',
    commercial_value: '',
    exclusion: false,
};

const AFFECT_OPTIONS = (t) => [
    '',
    t('form.affectation.options.family_heritage'),
    t('form.affectation.options.family_home'),
    t('form.affectation.options.decent_housing'),
    t('form.affectation.options.not_apply'),
];

const MEASURE_OPTIONS = (t) => [
    t('form.measure.options.seizure'),
    t('form.measure.options.confiscation'),
    t('form.measure.options.auction'),
    t('form.measure.options.none'),
];

const toNum = (v) => parseFloat(String(v || '0').replace(/,/g, '')) || 0;

async function GetStep6() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=6');
    return data;
}

export default function Step6MovableImmovableProperty({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step6');

    const { data: step6Data } = useQuery({
        queryKey: ['step6Data'],
        queryFn: GetStep6
    });

    const [form, setForm] = useState(() => ({ assets: [] }));

    // inicializar estado una sola vez
    const initialized = useRef(false);
    useEffect(() => {
        if (step6Data && !initialized.current) {
            const initList = step6Data.assets ?? data.assets ?? [];
            setForm({ assets: initList });
            updateData({ assets: initList });
            initialized.current = true;
        }
    }, [step6Data, updateData]);

    // sincronizar con wizard
    useEffect(() => {
        updateData({ assets: form.assets });
    }, [form.assets, updateData]);

    // exclusiones únicas
    const [hasMovableExclusion, setHasMovableExclusion] = useState(false);
    const [hasImmutableExclusion, setHasImmutableExclusion] = useState(false);

    useEffect(() => {
        setHasMovableExclusion(
            form.assets.some(a => a.asset_type === 'MUEBLE' && a.exclusion)
        );
        setHasImmutableExclusion(
            form.assets.some(a => a.asset_type === 'INMUEBLE' && a.exclusion)
        );
    }, [form.assets]);

    // helpers de fila
    const persist = (assets) => setForm({ assets });

    const addRow = () => persist([...form.assets, EMPTY_ASSET]);

    const removeRow = (idx) => {
        const next = form.assets.filter((_, i) => i !== idx);
        persist(next);
    };

    const handleChange = (idx, field, value) => {
        const next = form.assets.map((a, i) =>
            i === idx ? { ...a, [field]: value } : a
        );
        persist(next);
    };

    const handleExclusionChange = (idx) => {
        const assetType = form.assets[idx].asset_type;
        const next = form.assets.map((a, i) => {
            if (i === idx) return { ...a, exclusion: !a.exclusion };
            if (a.asset_type === assetType) return { ...a, exclusion: false };
            return a;
        });
        persist(next);
    };

    const handleCommercialValueBlur = (idx, e) => {
        const cleaned = e.target.value.replace(/[^0-9.,]/g, '');
        handleChange(idx, 'commercial_value', cleaned);
    };

    const toggleMeasure = (idx, option) => {
        const none = MEASURE_OPTIONS(t)[5];
        const current = form.assets[idx].legal_measure || [];
        let nextMeasures;
        if (option === none) {
            nextMeasures = current.includes(none) ? [] : [none];
        } else {
            nextMeasures = current.includes(option)
                ? current.filter(m => m !== option)
                : [...current.filter(m => m !== none), option];
        }
        handleChange(idx, 'legal_measure', nextMeasures);
    };

    // envío
    const handleSubmit = (e) => {
        e.preventDefault();
        // transformamos commercial_value
        const payload = form.assets.map(a => ({
            asset_type: a.asset_type,
            name: a.name,
            identification: a.identification,
            lien: a.lien,
            affectation: a.affectation,
            legal_measure: a.legal_measure,
            patrimonial_society: a.patrimonial_society,
            commercial_value: toNum(a.commercial_value),
            exclusion: a.exclusion,
        }));
        onNext({ assets: payload });
    };

    const MEASURE_NONE = MEASURE_OPTIONS(t)[5];
    const renderExclusionField = (asset, idx) => {
        const isMovable = asset.asset_type === 'MUEBLE';
        const isImmutable = asset.asset_type === 'INMUEBLE';
        const show =
            (isMovable && !hasMovableExclusion) ||
            (isImmutable && !hasImmutableExclusion) ||
            asset.exclusion;
        if (!show) return null;
        return (
            <div className="col-12">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={asset.exclusion || false}
                        onChange={() => handleExclusionChange(idx)}
                        id={`exclusion-${idx}`}
                    />
                    <label className="form-check-label" htmlFor={`exclusion-${idx}`}>
                        {t('form.exclusion.label')}
                    </label>
                    {asset.exclusion && (
                        <div className="mt-2 p-2 bg-light rounded small">
                            <FaInfoCircle className="me-1" />
                            <p>{t('form.exclusion.legalReferencesTitle')}</p>
                            <p>{t('form.exclusion.legalReferencesDescription')}</p>
                            <ul>
                                {t.rich('form.exclusion.legalReferences', {
                                    li: chunks => <li>{chunks}</li>
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />
            <form onSubmit={handleSubmit} className="row" id="wizard-step-form">
                {form.assets.map((asset, idx) => (
                    <div key={idx} className="border p-3 mb-4 rounded shadow-sm bg-light">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.assetType.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.asset_type}
                                    onChange={e => handleChange(idx, 'asset_type', e.target.value)}
                                    required
                                >
                                    <option value="">{t('form.assetType.placeholder')}</option>
                                    <option value="MUEBLE">{t('form.assetType.options.furniture')}</option>
                                    <option value="INMUEBLE">{t('form.assetType.options.realEstate')}</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.description.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.name}
                                    onChange={e => handleChange(idx, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.identification.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.identification}
                                    onChange={e => handleChange(idx, 'identification', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('form.lien.label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asset.lien}
                                    onChange={e => handleChange(idx, 'lien', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('form.affectation.label')}</label>
                                <select
                                    className="form-select"
                                    value={asset.affectation}
                                    onChange={e => handleChange(idx, 'affectation', e.target.value)}
                                >
                                    {AFFECT_OPTIONS(t).map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt || t('form.affectation.placeholder')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('form.measure.label')}</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {MEASURE_OPTIONS(t).map((opt, i) => {
                                        const disabled =
                                            (opt === MEASURE_NONE &&
                                                asset.legal_measure?.length > 0 &&
                                                !asset.legal_measure.includes(MEASURE_NONE)) ||
                                            (opt !== MEASURE_NONE &&
                                                asset.legal_measure?.includes(MEASURE_NONE));
                                        return (
                                            <div className="form-check form-check-inline" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`measure-${idx}-${i}`}
                                                    checked={asset.legal_measure?.includes(opt) || false}
                                                    onChange={() => toggleMeasure(idx, opt)}
                                                    disabled={disabled}
                                                />
                                                <label className="form-check-label" htmlFor={`measure-${idx}-${i}`}>
                                                    {opt}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">{t('form.commercialValue.label')}</label>
                                <input
                                    type="text"
                                    className="form-control text-end"
                                    value={asset.commercial_value}
                                    onChange={e => handleChange(idx, 'commercial_value', e.target.value)}
                                    onBlur={e => handleCommercialValueBlur(idx, e)}
                                    inputMode="decimal"
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">{t('form.patrimonialSociety.label')}</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder={t('form.patrimonialSociety.placeholder')}
                                    value={asset.patrimonial_society}
                                    onChange={e => handleChange(idx, 'patrimonial_society', e.target.value)}
                                />
                            </div>
                            {renderExclusionField(asset, idx)}
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2"
                                onClick={() => removeRow(idx)}
                            >
                                {t('form.actions.delete')}
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mb-3">
                    <button type="button" className="btn btn-outline-success" onClick={addRow}>
                        {t('form.actions.addAsset')}
                    </button>
                </div>
            </form>
        </>
    );
}

Step6MovableImmovableProperty.propTypes = {
    data: PropTypes.shape({ assets: PropTypes.array }),
    updateData: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};