'use client';

import { useState, useEffect, useCallback } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import type { UserData } from '@/lib/calculator/types';

interface Creditor {
    name: string;
    nature: string;
    other_nature: string;
    capital_value: string;
    days_overdue: string;
}

interface VerifyComplimentProps {
    user: UserData;
}

interface ComplianceResult {
    overdueCount: number;
    overdueDebt: number;
    totalDebt: number;
    overduePercentage: number;
}

const EMPTY_CREDITOR: Creditor = {
    name: '',
    nature: '',
    other_nature: '',
    capital_value: '',
    days_overdue: '',
};

export default function VerifyCompliment({ user }: VerifyComplimentProps) {
    const t = useTranslations('Platform.calculator.insolvency');
    
    const [creditors, setCreditors] = useState<Creditor[]>([{ ...EMPTY_CREDITOR }]);
    const [result, setResult] = useState<ComplianceResult | null>(null);
    const [overdueDebt, setOverdueDebt] = useState(0);
    const [onTimeDebt, setOnTimeDebt] = useState(0);
    const [totalDebt, setTotalDebt] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load creditors data for this user
    useEffect(() => {
        async function loadCreditors() {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `/api/platform/calculator/creditors?documentNumber=${encodeURIComponent(user.documentNumber)}&birthDate=${encodeURIComponent(user.birthDate)}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.creditors && data.creditors.length > 0) {
                        setCreditors(data.creditors);
                    }
                }
            } catch (error) {
                console.error('Error loading creditors:', error);
            } finally {
                setIsLoading(false);
            }
        }
        
        loadCreditors();
    }, [user.documentNumber, user.birthDate]);

    // Save creditors when they change (debounced)
    const saveCreditors = useCallback(async (creditorsToSave: Creditor[]) => {
        try {
            setIsSaving(true);
            await fetch('/api/platform/calculator/creditors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentNumber: user.documentNumber,
                    birthDate: user.birthDate,
                    creditors: creditorsToSave,
                }),
            });
        } catch (error) {
            console.error('Error saving creditors:', error);
        } finally {
            setIsSaving(false);
        }
    }, [user.documentNumber, user.birthDate]);

    // Calculate totals when creditors change
    useEffect(() => {
        const filteredCreditors = creditors.filter(c =>
            c.nature !== 'CRÉDITO DE LIBRANZA' && c.nature !== 'CRÉDITO DE NÓMINA'
        );

        let overdue = 0;
        let onTime = 0;
        let total = 0;

        filteredCreditors.forEach(c => {
            const capital = parseCurrencyToNumber(c.capital_value);
            const overdueDays = parseInt(c.days_overdue);

            if (!isNaN(capital)) {
                total += capital;
                if (!isNaN(overdueDays)) {
                    if (overdueDays >= 90) {
                        overdue += capital;
                    } else {
                        onTime += capital;
                    }
                }
            }
        });

        setOverdueDebt(overdue);
        setOnTimeDebt(onTime);
        setTotalDebt(total);
    }, [creditors]);

    const normalizeText = (str: string) => str.normalize('NFD').replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();

    const formatToLocaleNumber = (value: number | string) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numericValue)) return '';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericValue);
    };

    const parseCurrencyToNumber = (value: string) => {
        if (!value) return 0;
        const numericString = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString);
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = [...creditors];

        if (name === 'capital_value') {
            const filteredValue = value.replace(/[^0-9.,]/g, '');
            updated[index] = { ...updated[index], [name]: filteredValue };
        } else if (name === 'name' || name === 'other_nature') {
            updated[index] = { ...updated[index], [name]: normalizeText(value) };
        } else {
            updated[index] = { ...updated[index], [name]: value };
        }

        if (name === 'nature' && value !== 'OTRO') {
            updated[index] = { ...updated[index], other_nature: '' };
        }

        setCreditors(updated);
    };

    const handleBlur = (index: number, e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'capital_value') {
            const updated = [...creditors];
            updated[index] = { ...updated[index], [name]: formatToLocaleNumber(parseCurrencyToNumber(value)) };
            setCreditors(updated);
            
            // Save on blur for capital value
            saveCreditors(updated);
        } else {
            // Save on blur for other fields
            saveCreditors(creditors);
        }
    };

    const addRow = () => {
        const newCreditors = [...creditors, { ...EMPTY_CREDITOR }];
        setCreditors(newCreditors);
    };

    const removeRow = (index: number) => {
        if (creditors.length <= 1) return;
        const updated = [...creditors];
        updated.splice(index, 1);
        setCreditors(updated);
        saveCreditors(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const incomplete = creditors.some(c =>
            !c.name || !c.nature || (c.nature === 'OTRO' && !c.other_nature) || !c.capital_value || !c.days_overdue
        );

        if (incomplete) {
            toast.error(t('errors.incompleteFields'));
            return;
        }

        validateCompliance();
        saveCreditors(creditors);
    };

    const validateCompliance = () => {
        const filteredCreditors = creditors.filter(c =>
            c.nature !== 'CRÉDITO DE LIBRANZA' && c.nature !== 'CRÉDITO DE NÓMINA'
        );

        const overdueCreditors = filteredCreditors.filter(c => parseInt(c.days_overdue) >= 90);
        const overdueCount = overdueCreditors.length;

        const totalDebtCalc = filteredCreditors.reduce((sum, c) => sum + parseCurrencyToNumber(c.capital_value), 0);
        const overdueDebtCalc = overdueCreditors.reduce((sum, c) => sum + parseCurrencyToNumber(c.capital_value), 0);

        const overduePercentage = totalDebtCalc ? (overdueDebtCalc / totalDebtCalc) * 100 : 0;

        setResult({
            overdueCount,
            overdueDebt: overdueDebtCalc,
            totalDebt: totalDebtCalc,
            overduePercentage,
        });
    };

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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">{t('title')}</h5>
                {isSaving && (
                    <small className="text-muted">
                        <Spinner animation="border" size="sm" className="me-1" />
                        {t('saving')}
                    </small>
                )}
            </div>
            
            <Alert variant="info" className="mb-4">
                <strong>{t('calculatingFor')}:</strong> {user.firstName} {user.lastName} ({user.documentNumber})
            </Alert>

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
                        {creditors.map((c, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={c.name}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        className="form-control"
                                        required
                                    />
                                </td>
                                <td>
                                    <select
                                        name="nature"
                                        value={c.nature}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={() => saveCreditors(creditors)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">{t('table.selectNature')}</option>
                                        <option value="CRÉDITO DE LIBRANZA">{t('natures.libranza')}</option>
                                        <option value="CRÉDITO HIPOTECARIO">{t('natures.mortgage')}</option>
                                        <option value="CRÉDITO CON GARANTÍA MOBILIARIA">{t('natures.movableGuarantee')}</option>
                                        <option value="CRÉDITO FISCAL O TRIBUTARIO">{t('natures.fiscal')}</option>
                                        <option value="CRÉDITO DE LIBRE INVERSIÓN">{t('natures.freeInvestment')}</option>
                                        <option value="CRÉDITO DE NÓMINA">{t('natures.payroll')}</option>
                                        <option value="CRÉDITO PERSONAL">{t('natures.personal')}</option>
                                        <option value="CRÉDITO COMERCIAL">{t('natures.commercial')}</option>
                                        <option value="CRÉDITO ROTATIVO">{t('natures.rotary')}</option>
                                        <option value="CRÉDITO EDUCATIVO O DE ESTUDIO">{t('natures.educational')}</option>
                                        <option value="CRÉDITO DE CONSUMO">{t('natures.consumer')}</option>
                                        <option value="OTRO">{t('natures.other')}</option>
                                    </select>
                                    {c.nature === 'OTRO' && (
                                        <input
                                            type="text"
                                            name="other_nature"
                                            value={c.other_nature}
                                            onChange={(e) => handleChange(index, e)}
                                            onBlur={(e) => handleBlur(index, e)}
                                            className="form-control mt-2"
                                            placeholder={t('table.specifyOther')}
                                            required
                                        />
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="capital_value"
                                        value={c.capital_value}
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        className="form-control text-end"
                                        inputMode="decimal"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        min="0"
                                        name="days_overdue"
                                        onChange={(e) => handleChange(index, e)}
                                        onBlur={(e) => handleBlur(index, e)}
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                        required
                                        type="number"
                                        value={c.days_overdue}
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeRow(index)}
                                        disabled={creditors.length <= 1}
                                    >
                                        {t('table.remove')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <strong>{t('summary.overdueCapital')}:</strong> $ {formatToLocaleNumber(overdueDebt)}
                </div>
                <div className="col-md-4">
                    <strong>{t('summary.onTimeCapital')}:</strong> $ {formatToLocaleNumber(onTimeDebt)}
                </div>
                <div className="col-md-4">
                    <strong>{t('summary.totalDebts')}:</strong> $ {formatToLocaleNumber(totalDebt)}
                </div>
            </div>

            <div className="d-flex mb-4 gap-2">
                <button type="button" className="btn btn-outline-success" onClick={addRow}>
                    + {t('addCreditor')}
                </button>
                <button type="submit" className="btn btn-primary">
                    {t('verifyCompliance')}
                </button>
            </div>

            {result && (
                <div className="mt-4">
                    {result.overdueCount >= 2 && result.overduePercentage >= 30 ? (
                        <Alert variant="success">
                            <strong>{t('result.complies')}</strong> {t('result.compliesDetail', { 
                                count: result.overdueCount, 
                                percentage: result.overduePercentage.toFixed(2) 
                            })}
                        </Alert>
                    ) : (
                        <Alert variant="danger">
                            <strong>{t('result.notComplies')}</strong> {result.overdueCount < 2 
                                ? t('result.notEnoughDebts', { count: result.overdueCount })
                                : t('result.notEnoughPercentage', { percentage: result.overduePercentage.toFixed(2) })
                            }
                        </Alert>
                    )}

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <strong>{t('result.overdueCapitalExcluding')}:</strong> $ {formatToLocaleNumber(result.overdueDebt)}
                        </div>
                        <div className="col-md-6">
                            <strong>{t('result.totalDebtsExcluding')}:</strong> $ {formatToLocaleNumber(result.totalDebt)}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
