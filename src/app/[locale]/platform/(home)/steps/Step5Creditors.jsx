// src/app/[locale]/platform/(home)/steps/Step5Creditors.jsx

'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { MdSaveAs, MdExpandMore, MdExpandLess, MdDelete, MdAdd } from 'react-icons/md';
import PropTypes from 'prop-types';



import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

import {
    useCreditors,
    EMPTY_CREDITOR,
    NATURE_OPTIONS,
    CONSANGUINITY_OPTIONS,
    computeMetrics,
    toFmt,
    toNum,
} from '../../hooks/useCreditors';

/* ─── Subcomponente: tarjeta de acreedor ──────────────────────── */
function CreditorCard({ creditor, index, onChange, onBlurCurrency, onRemove, canRemove, t }) {
    const [expanded, setExpanded] = useState(index === 0);

    const days = parseInt(creditor.days_overdue, 10) || 0;
    const capital = toNum(creditor.capital_value);

    // Badge de estado según días de mora
    const badge = useMemo(() => {
        if (days === 0) return { label: t('status.current'), cls: 'bg-success text-white' };
        if (days >= 1 && days < 30) return { label: t('status.overdue1'), cls: 'bg-info text-dark' };
        if (days >= 30 && days < 90) return { label: t('status.overdue2'), cls: 'bg-warning text-dark' };
        return { label: t('status.severe'), cls: 'bg-danger text-white' };
    }, [days, t]);

    // Título de la tarjeta en estado colapsado
    const cardTitle = creditor.creditor
        ? `${creditor.creditor}${creditor.nature_type ? ` · ${creditor.nature_type}` : ''}`
        : t('form.newCreditor', { n: index + 1 });

    return (
        <div className="card mb-3 border">
            {/* Header */}
            <div
                className="card-header d-flex align-items-center justify-content-between"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-semibold">#{index + 1}</span>
                    <span className="text-truncate" style={{ maxWidth: 300 }}>{cardTitle}</span>
                    {capital > 0 && (
                        <span className="text-muted small">$ {toFmt(capital)}</span>
                    )}
                    <span className={`badge ${badge.cls} small`}>{badge.label}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        disabled={!canRemove}
                        aria-label={t('form.headers.actions.delete')}
                    >
                        <MdDelete />
                    </button>
                    {expanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                </div>
            </div>

            {/* Body expandible */}
            {expanded && (
                <div className="card-body">
                    <div className="row g-3">
                        {/* Acreedor */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.creditor')} <span className="text-danger">*</span>
                            </label>
                            <input
                                name="creditor"
                                className="form-control"
                                value={creditor.creditor}
                                onChange={(e) => onChange(index, e)}
                                placeholder={t('form.placeholders.creditor')}
                            />
                        </div>

                        {/* NIT */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">{t('form.headers.nit')}</label>
                            <input
                                name="nit"
                                className="form-control"
                                value={creditor.nit}
                                onChange={(e) => onChange(index, e)}
                                placeholder="NIT / Cédula"
                            />
                        </div>

                        {/* Contacto */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">{t('form.headers.contact')}</label>
                            <input
                                name="creditor_contact"
                                className="form-control"
                                value={creditor.creditor_contact}
                                onChange={(e) => onChange(index, e)}
                                placeholder={t('form.placeholders.contact')}
                            />
                        </div>

                        {/* Naturaleza */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.nature')} <span className="text-danger">*</span>
                            </label>
                            <select
                                name="nature_type"
                                className="form-select"
                                value={creditor.nature_type}
                                onChange={(e) => onChange(index, e)}
                            >
                                <option value="">{t('form.placeholders.select')}</option>
                                {NATURE_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>

                            {creditor.nature_type === 'OTRO' && (
                                <input
                                    name="other_nature"
                                    className="form-control mt-2"
                                    value={creditor.other_nature}
                                    onChange={(e) => onChange(index, e)}
                                    placeholder={t('form.placeholders.otherNature')}
                                />
                            )}

                            {creditor.nature_type === 'CRÉDITO PERSONAL' && (
                                <div className="mt-2 d-flex flex-column gap-2">
                                    <select
                                        name="personal_consanguinity"
                                        className="form-select"
                                        value={creditor.personal_consanguinity}
                                        onChange={(e) => onChange(index, e)}
                                    >
                                        <option value="">{t('form.placeholders.consanguinity')}</option>
                                        {CONSANGUINITY_OPTIONS.map(([val, lbl]) => (
                                            <option key={val} value={val}>{lbl}</option>
                                        ))}
                                    </select>
                                    <input
                                        name="personal_credit_interest_rate"
                                        className="form-control"
                                        value={creditor.personal_credit_interest_rate}
                                        placeholder={t('form.placeholders.interestRate')}
                                        onChange={(e) => onChange(index, e)}
                                        inputMode="decimal"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Clasificación del crédito */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.creditClassification')}
                            </label>
                            <select
                                name="credit_classification"
                                className="form-select"
                                value={creditor.credit_classification}
                                onChange={(e) => onChange(index, e)}
                            >
                                <option value="">{t('form.placeholders.selectClassification')}</option>
                                <option value="1">{t('form.creditClassificationOptions.1')}</option>
                                <option value="2">{t('form.creditClassificationOptions.2')}</option>
                                <option value="3">{t('form.creditClassificationOptions.3')}</option>
                                <option value="5">{t('form.creditClassificationOptions.5')}</option>
                            </select>
                        </div>

                        {/* Capital */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.capital')} <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    name="capital_value"
                                    className="form-control text-end"
                                    value={creditor.capital_value}
                                    onChange={(e) => onChange(index, e)}
                                    onBlur={() => onBlurCurrency(index)}
                                    inputMode="decimal"
                                />
                            </div>
                        </div>

                        {/* Días de mora */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.daysOverdue')} <span className="text-danger">*</span>
                            </label>
                            <input
                                name="days_overdue"
                                type="number"
                                min="0"
                                className="form-control"
                                value={creditor.days_overdue}
                                onChange={(e) => onChange(index, e)}
                                onWheel={(e) => e.target.blur()}
                            />
                        </div>

                        {/* Garantía */}
                        <div className="col-12">
                            <label className="form-label fw-semibold small">
                                {t('form.headers.supportGuarantee')}
                            </label>
                            <textarea
                                name="guarantee"
                                className="form-control"
                                rows={2}
                                value={creditor.guarantee}
                                onChange={(e) => onChange(index, e)}
                                placeholder={t('form.placeholders.guarantee')}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Step5Creditors({ data, updateData, onNext }) {
    const t = useTranslations('Platform.pages.home.wizard.steps.step5');

    const {
        creditors: serverCreditors,
        isLoading,
        isSaving,
        save,
    } = useCreditors({
        onSaveSuccess: () => toast.success(t('messages.saveSuccess')),
        onSaveError: () => toast.error(t('messages.saveError')),
    });

    /* Lista local (editable en memoria) */
    const [list, setList] = useState([{ ...EMPTY_CREDITOR }]);
    const initialized = useRef(false);

    useEffect(() => {
        if (!serverCreditors.length || initialized.current) return;
        const initial = serverCreditors.length > 0
            ? serverCreditors
            : data?.creditors ?? [{ ...EMPTY_CREDITOR }];
        setList(initial);
        updateData({ creditors: initial });
        initialized.current = true;
    }, [serverCreditors, data, updateData]);

    // Sincroniza con el padre cada vez que la lista cambia
    useEffect(() => {
        updateData({ creditors: list });
    }, [list, updateData]);

    /* Métricas */
    const metrics = useMemo(() => computeMetrics(list), [list]);
    const { withEx, noEx } = metrics;

    /* ─── Handlers ─────────────────────────────────── */
    const persist = useCallback((next) => setList(next), []);

    const handleChange = useCallback((idx, e) => {
        const { name, value } = e.target;
        persist(list.map((c, i) => (i === idx ? { ...c, [name]: value } : c)));
    }, [list, persist]);

    const handleBlurCurrency = useCallback((idx) => {
        persist(list.map((c, i) =>
            i === idx ? { ...c, capital_value: toFmt(toNum(c.capital_value)) } : c
        ));
    }, [list, persist]);

    const addRow = useCallback(() => {
        const next = [...list, { ...EMPTY_CREDITOR }];
        persist(next);
        // Auto-expand the new card: handled inside CreditorCard (index === newIndex)
    }, [list, persist]);

    const removeRow = useCallback((idx) => {
        if (list.length <= 1) return;
        persist(list.filter((_, i) => i !== idx));
    }, [list, persist]);

    const handleSave = useCallback(() => save(list), [save, list]);

    /* ─── Validación y envío ────────────────────────── */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (noEx.severeCount < 2) {
            toast.error(t('errors.minSevereCount'));
            return;
        }
        if (noEx.pct < 30) {
            toast.error(t('errors.minSeverePct'));
            return;
        }

        onNext({
            creditors: list.map((c) => ({
                ...c,
                capital_value: toNum(c.capital_value),
                days_overdue: parseInt(c.days_overdue, 10) || 0,
            })),
        });
    };

    if (isLoading) {
        return (
            <div className="d-flex align-items-center gap-2 my-4 text-muted">
                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>{t('messages.loading')}</span>
            </div>
        );
    }

    const meetsRequirements = noEx.severeCount >= 2 && noEx.pct >= 30;

    return (
        <>
            <TitleComponent title={t('title')} />
            <SubTitleComponent t={t} sub_title="subTitle" />

            <form onSubmit={handleSubmit} id="wizard-step-form">
                {/* Lista de tarjetas */}
                {list.map((c, idx) => (
                    <CreditorCard
                        key={idx}
                        index={idx}
                        creditor={c}
                        onChange={handleChange}
                        onBlurCurrency={handleBlurCurrency}
                        onRemove={removeRow}
                        canRemove={list.length > 1}
                        t={t}
                    />
                ))}

                {/* Agregar acreedor */}
                <button
                    type="button"
                    className="btn btn-outline-success w-100 mb-4"
                    onClick={addRow}
                >
                    <MdAdd className="me-1" /> {t('form.addCreditor')}
                </button>
            </form>

            {/* Guardar borrador */}
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <MdSaveAs className="me-1" />
                    {isSaving ? t('messages.saving') : t('messages.save')}
                </button>
            </div>

            {/* Panel de totales y validación */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">{t('totals.title')}</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {/* Con excluidos */}
                        <div className="col-md-6">
                            <p className="fw-semibold mb-2">{t('totals.includingExcluded')}</p>
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td className="text-muted">{t('totals.arrears')}</td>
                                        <td className="text-end fw-semibold">$ {toFmt(withEx.arrears)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">{t('totals.current')}</td>
                                        <td className="text-end fw-semibold">$ {toFmt(withEx.current)}</td>
                                    </tr>
                                    <tr className="border-top">
                                        <td className="fw-semibold">{t('totals.totalDebt')}</td>
                                        <td className="text-end fw-bold">$ {toFmt(withEx.total)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Sin excluidos */}
                        <div className="col-md-6">
                            <p className="fw-semibold mb-2">{t('totals.excludingExcluded')}</p>
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td className="text-muted">{t('totals.arrears')}</td>
                                        <td className="text-end fw-semibold">$ {toFmt(noEx.arrears)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">{t('totals.severeArrears')}</td>
                                        <td className="text-end fw-semibold text-danger">$ {toFmt(noEx.severeArrears)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">{t('totals.current')}</td>
                                        <td className="text-end fw-semibold">$ {toFmt(noEx.current)}</td>
                                    </tr>
                                    <tr className="border-top">
                                        <td className="fw-semibold">{t('totals.totalDebt')}</td>
                                        <td className="text-end fw-bold">$ {toFmt(noEx.total)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">{t('totals.severeCount')}</td>
                                        <td className="text-end">{noEx.severeCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">{t('totals.compliancePercentage')}</td>
                                        <td className={`text-end fw-bold ${noEx.pct >= 30 ? 'text-success' : 'text-danger'}`}>
                                            {noEx.pct.toFixed(1)}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Alerta de cumplimiento */}
                    <div className={`alert mt-3 mb-0 ${meetsRequirements ? 'alert-success' : 'alert-danger'}`}>
                        {meetsRequirements
                            ? t('validation.meetsRequirements')
                            : t('validation.doesNotMeetRequirements')}
                    </div>
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
