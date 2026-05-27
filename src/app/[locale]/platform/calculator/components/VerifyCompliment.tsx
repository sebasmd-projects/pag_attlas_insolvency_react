// src/app/[locale]/platform/calculator/components/VerifyCompliment.tsx
//
// Versión actualizada:
// • Lee y escribe en el mismo endpoint que Step5 (useCreditors).
// • Trabaja con el shape simple (name, nature, capital_value, days_overdue).
// • Al guardar, los campos que la calculadora no gestiona se rellenan con 'TODO'
//   si el registro es nuevo (mergeSimpleToCanonical). Si ya existía, se preservan.

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import {
    useCreditors,
    toSimpleCreditor,
    EXCLUDED_NATURES,
    NATURE_OPTIONS_SIMPLE,
    formatLocale,
    parseLocale,
} from '../../hooks/useCreditors';

import type { UserData } from '@/lib/calculator/types';

/* ─── Types ───────────────────────────────────────────────────── */
interface SimpleCreditor {
    _canonicalId?: number | string;
    name: string;
    nature: string;
    other_nature: string;
    capital_value: string;
    days_overdue: string;
}

const EMPTY_SIMPLE: SimpleCreditor = {
    name: '', nature: '', other_nature: '', capital_value: '', days_overdue: '',
};

interface Props {
    user: UserData;
    onBack: () => void;
}

/* ─── Componente ──────────────────────────────────────────────── */
export default function VerifyCompliment({ user, onBack }: Props) {
    const t = useTranslations('Platform.calculator.insolvency');

    /* useCreditors: mismo hook que Step5 */
    const {
        creditors: canonicalList,
        isLoading,
        isSaving,
        saveFromSimple,
    } = useCreditors({
        onSaveSuccess: () => { /* silencioso en la calculadora */ },
        onSaveError: () => { /* silencioso */ },
    });

    /* Lista simple (shape reducido para la calculadora) */
    const [simpleList, setSimpleList] = useState<SimpleCreditor[]>([{ ...EMPTY_SIMPLE }]);
    const [validated, setValidated] = useState(false);

    /* Cuando llegan datos del servidor, convertimos a shape simple */
    useEffect(() => {
        if (!canonicalList.length) return;
        setSimpleList(canonicalList.map(toSimpleCreditor));
    }, [canonicalList]);

    /* Totales (excluye libranza y nómina) */
    const { overdueDebt, onTimeDebt, totalDebt } = useMemo(() => {
        const filtered = simpleList.filter(
            (c) => !EXCLUDED_NATURES.includes(c.nature)
        );
        let overdue = 0, onTime = 0, total = 0;
        filtered.forEach((c) => {
            const cap = parseLocale(c.capital_value);
            const days = parseInt(c.days_overdue, 10);
            total += cap;
            if (!isNaN(days) && days >= 90) overdue += cap;
            else onTime += cap;
        });
        return { overdueDebt: overdue, onTimeDebt: onTime, totalDebt: total };
    }, [simpleList]);

    /* ─── Handlers ────────────────────────────────────────────── */
    const handleChange = useCallback(
        (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setSimpleList((prev) => {
                const next = [...prev];
                const row = { ...next[index] };

                if (name === 'capital_value') {
                    row.capital_value = value.replace(/[^0-9.,]/g, '');
                } else if (name === 'name' || name === 'other_nature') {
                    row[name as 'name' | 'other_nature'] = value
                        .normalize('NFD')
                        .replace(/[^a-zA-Z0-9 ]/g, '')
                        .toUpperCase();
                } else {
                    (row as Record<string, string>)[name] = value;
                }

                if (name === 'nature' && value !== 'OTRO') {
                    row.other_nature = '';
                }

                next[index] = row;
                return next;
            });
        },
        []
    );

    const handleBlurCapital = useCallback((index: number) => {
        setSimpleList((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                capital_value: formatLocale(parseLocale(next[index].capital_value)),
            };
            // Guardado auto-persistente al salir del campo capital
            saveFromSimple(next);
            return next;
        });
    }, [saveFromSimple]);

    const handleBlurOther = useCallback(() => {
        saveFromSimple(simpleList);
    }, [saveFromSimple, simpleList]);

    const addRow = useCallback(() => {
        setSimpleList((prev) => [...prev, { ...EMPTY_SIMPLE }]);
    }, []);

    const removeRow = useCallback((index: number) => {
        if (simpleList.length <= 1) return;
        const next = simpleList.filter((_, i) => i !== index);
        setSimpleList(next);
        saveFromSimple(next);
    }, [simpleList, saveFromSimple]);

    /* ─── Validar y mostrar resultado ─────────────────────────── */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const incomplete = simpleList.some(
            (c) => !c.name || !c.nature || (c.nature === 'OTRO' && !c.other_nature) ||
                !c.capital_value || !c.days_overdue
        );
        if (incomplete) {
            toast.error(t('errors.incompleteFields'));
            return;
        }

        saveFromSimple(simpleList);
        setValidated(true);
    };

    /* Resultado de cumplimiento */
    const complianceResult = useMemo(() => {
        if (!validated) return null;
        const filtered = simpleList.filter((c) => !EXCLUDED_NATURES.includes(c.nature));
        const overdueCr = filtered.filter((c) => parseInt(c.days_overdue, 10) >= 90);
        const total = filtered.reduce((s, c) => s + parseLocale(c.capital_value), 0);
        const overdue = overdueCr.reduce((s, c) => s + parseLocale(c.capital_value), 0);
        return {
            count: overdueCr.length,
            overdueAmt: overdue,
            total,
            pct: total ? (overdue / total) * 100 : 0,
        };
    }, [validated, simpleList]);

    /* ─── Render ──────────────────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="container my-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
                <p className="mt-2">{t('loadingData')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="container my-5">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">{t('title')}</h5>
                {isSaving && (
                    <small className="text-muted">
                        <Spinner animation="border" size="sm" className="me-1" />
                        {t('saving')}
                    </small>
                )}
            </div>

            {user && (
                <Alert variant="info" className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{t('calculatingFor')}:</strong> {user.firstName} {user.lastName}
                            <br />
                            <small className="text-muted">C.C: {user.cedula}</small>
                        </div>
                        {onBack && (
                            <Button variant="outline-primary" size="sm" onClick={onBack}>
                                {t('changeUser')}
                            </Button>
                        )}
                    </div>
                </Alert>
            )}

            {/* Tabla simplificada */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>{t('table.creditor')}</th>
                            <th>{t('table.nature')}</th>
                            <th>{t('table.capital')}</th>
                            <th>{t('table.daysOverdue')}</th>
                            <th>{t('table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {simpleList.map((c, index) => (
                            <tr key={index}>
                                {/* Nombre */}
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={c.name}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={handleBlurOther}
                                        className="form-control"
                                        required
                                    />
                                </td>

                                {/* Naturaleza */}
                                <td>
                                    <select
                                        name="nature"
                                        value={c.nature}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={handleBlurOther}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">{t('table.selectNature')}</option>
                                        {NATURE_OPTIONS_SIMPLE.map(([val, lbl]) => (
                                            <option key={val} value={val}>{lbl}</option>
                                        ))}
                                    </select>
                                    {c.nature === 'OTRO' && (
                                        <input
                                            type="text"
                                            name="other_nature"
                                            value={c.other_nature}
                                            onChange={(e) => handleChange(index, e)}
                                            onBlur={handleBlurOther}
                                            className="form-control mt-2"
                                            placeholder={t('table.specifyOther')}
                                            required
                                        />
                                    )}
                                </td>

                                {/* Capital */}
                                <td>
                                    <input
                                        type="text"
                                        name="capital_value"
                                        value={c.capital_value}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={() => handleBlurCapital(index)}
                                        className="form-control text-end"
                                        inputMode="decimal"
                                        required
                                    />
                                </td>

                                {/* Días mora */}
                                <td>
                                    <input
                                        className="form-control"
                                        min="0"
                                        name="days_overdue"
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={handleBlurOther}
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                        required
                                        type="number"
                                        value={c.days_overdue}
                                    />
                                </td>

                                {/* Eliminar */}
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeRow(index)}
                                        disabled={simpleList.length <= 1}
                                    >
                                        {t('table.remove')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totales rápidos */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <strong>{t('summary.overdueCapital')}:</strong> $ {formatLocale(overdueDebt)}
                </div>
                <div className="col-md-4">
                    <strong>{t('summary.onTimeCapital')}:</strong> $ {formatLocale(onTimeDebt)}
                </div>
                <div className="col-md-4">
                    <strong>{t('summary.totalDebts')}:</strong> $ {formatLocale(totalDebt)}
                </div>
            </div>

            {/* Acciones */}
            <div className="d-flex mb-4 gap-2">
                <button type="button" className="btn btn-outline-success" onClick={addRow}>
                    + {t('addCreditor')}
                </button>
                <button type="submit" className="btn btn-primary">
                    {t('verifyCompliance')}
                </button>
            </div>

            {/* Resultado */}
            {complianceResult && (
                <div className="mt-4">
                    {complianceResult.count >= 2 && complianceResult.pct >= 30 ? (
                        <Alert variant="success">
                            <strong>{t('result.complies')}</strong>{' '}
                            {t('result.compliesDetail', {
                                count: complianceResult.count,
                                percentage: complianceResult.pct.toFixed(2),
                            })}
                        </Alert>
                    ) : (
                        <Alert variant="danger">
                            <strong>{t('result.notComplies')}</strong>{' '}
                            {complianceResult.count < 2
                                ? t('result.notEnoughDebts', { count: complianceResult.count })
                                : t('result.notEnoughPercentage', { percentage: complianceResult.pct.toFixed(2) })}
                        </Alert>
                    )}

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <strong>{t('result.overdueCapitalExcluding')}:</strong>{' '}
                            $ {formatLocale(complianceResult.overdueAmt)}
                        </div>
                        <div className="col-md-6">
                            <strong>{t('result.totalDebtsExcluding')}:</strong>{' '}
                            $ {formatLocale(complianceResult.total)}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
