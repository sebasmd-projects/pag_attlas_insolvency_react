// src/app/[locale]/platform/calculator/components/CalculatorForm.tsx

'use client';

import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Alert, Button, Form } from 'react-bootstrap';
import { RiAlarmWarningLine, RiInformationLine } from 'react-icons/ri';
import { ReactSVG } from 'react-svg';
import { useCalculator, formatCurrency } from '../hooks/useCalculator';
import { DEFAULT_USURA_RATE } from '@/lib/calculator';
import type { UserData } from '@/lib/calculator/types';

const DebtGauge = dynamic(() => import('./DebtGauge'));

interface CalculatorFormProps {
    user?: UserData;
    onBack?: () => void;
}

function CalculatorFormComponent({ user, onBack }: CalculatorFormProps) {
    const t = useTranslations('Platform.calculator');

    const {
        essentialExpenses,
        totalDebt,
        payrollDiscount,
        income,
        hasPayrollDiscount,
        setHasPayrollDiscount,
        usuraRate,
        setUsuraRate,
        interestType,
        setInterestType,
        result,
        calculate,
        parsedUsuraRate,
    } = useCalculator();

    const translations = useMemo(() => ({
        years: t('result.years'),
        months: t('result.months'),
    }), [t]);

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault();
        calculate(translations);
    }

    const inputProps = {
        inputMode: 'decimal' as const,
        onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
    };

    function translateRaw(key: string) {
        return t.raw(key as Parameters<typeof t.raw>[0]);
    }

    const itemKeys = [
        'item1', 'item2', 'item3', 'item4', 'item5',
        'item6', 'item7', 'item8', 'item9', 'item10',
        'item11', 'item12', 'item13',
    ] as const satisfies ReadonlyArray<string>;

    // Calculated values for display
    const displayResult = useMemo(() => {
        if (!result) return null;

        return {
            ...result,
            formattedInterest: result.estimatedInterest
                ? formatCurrency(result.estimatedInterest)
                : null,
            formattedTotal: result.totalPayment
                ? formatCurrency(result.totalPayment)
                : null,
            formattedCapacity: result.monthlyPaymentCapacity
                ? formatCurrency(result.monthlyPaymentCapacity)
                : null,
        };
    }, [result]);

    return (
        <>
            {/* User info banner */}
            {user && (
                <Alert variant="info" className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{t('userData.calculatingFor')}:</strong> {user.firstName} {user.lastName}
                            <br />
                            <small className="text-muted">{t('userData.cedula')}: {user.cedula}</small>
                        </div>
                        {onBack && (
                            <Button variant="outline-primary" size="sm" onClick={onBack}>
                                {t('userData.changeUser')}
                            </Button>
                        )}
                    </div>
                </Alert>
            )}

            <div className="row">
                <div className="col-md-6">
                    <Form onSubmit={handleSubmit}>
                        {/* Gastos esenciales */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">{t('form.inputs.essentialExpenses')}</Form.Label>

                            <Form.Text className="text-muted">
                                <div className="mb-2 d-flex align-items-start">
                                    <RiAlarmWarningLine className="me-2 mt-1" />
                                    <span>{t('form.inputs.essentialExpensesHelpText')}</span>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            {itemKeys.slice(0, Math.ceil(itemKeys.length / 2)).map((key) => {
                                                const fullKey = `form.inputs.essentialExpensesItems.${key}`;
                                                return <li key={key}>{translateRaw(fullKey)}</li>;
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            {itemKeys.slice(Math.ceil(itemKeys.length / 2)).map((key) => {
                                                const fullKey = `form.inputs.essentialExpensesItems.${key}`;
                                                return <li key={key}>{translateRaw(fullKey)}</li>;
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </Form.Text>

                            <Form.Control
                                {...inputProps}
                                onBlur={essentialExpenses.onBlur}
                                onChange={(e) => essentialExpenses.handleChange(e.target.value)}
                                placeholder={t('form.inputs.essentialExpenses')}
                                required
                                value={essentialExpenses.display}
                            />
                        </Form.Group>

                        {/* Total de deudas */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">{t('form.inputs.totalDebt')}</Form.Label>
                            <Form.Control
                                {...inputProps}
                                onBlur={totalDebt.onBlur}
                                onChange={(e) => totalDebt.handleChange(e.target.value)}
                                placeholder={t('form.inputs.totalDebt')}
                                required
                                value={totalDebt.display}
                            />
                        </Form.Group>

                        {/* Descuento por nomina */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">{t('form.inputs.payrollDiscount')}</Form.Label>
                            <Form.Text className="text-muted d-block mb-2">
                                <div className="d-flex align-items-start">
                                    <RiInformationLine className="me-2 mt-1" />
                                    <span>{t('form.inputs.payrollBonusInfo')}</span>
                                </div>
                            </Form.Text>
                            <Form.Select
                                onChange={(e) => setHasPayrollDiscount(e.target.value as 'yes' | 'no')}
                                value={hasPayrollDiscount}
                            >
                                <option value="yes">{t('form.yes')}</option>
                                <option value="no">{t('form.no')}</option>
                            </Form.Select>
                        </Form.Group>

                        {hasPayrollDiscount === 'yes' && (
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">{t('form.inputs.discountAmount')}</Form.Label>
                                <Form.Control
                                    {...inputProps}
                                    onBlur={payrollDiscount.onBlur}
                                    onChange={(e) => payrollDiscount.handleChange(e.target.value)}
                                    required
                                    value={payrollDiscount.display}
                                />
                            </Form.Group>
                        )}

                        {/* Ingresos */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">{t('form.inputs.income')}</Form.Label>
                            <Form.Control
                                {...inputProps}
                                onBlur={income.onBlur}
                                onChange={(e) => income.handleChange(e.target.value)}
                                placeholder={t('form.inputs.income')}
                                required
                                value={income.display}
                            />
                        </Form.Group>

                        {/* Tasa de usura */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">{t('form.inputs.usuraRate')}</Form.Label>
                            <Form.Text className="text-muted d-block mb-2">
                                <div className="d-flex align-items-start">
                                    <RiInformationLine className="me-2 mt-1" />
                                    <span>{t('form.inputs.usuraRateHelpText')}</span>
                                </div>
                            </Form.Text>
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    inputMode="decimal"
                                    value={usuraRate}
                                    onChange={(e) => setUsuraRate(e.target.value)}
                                    placeholder={DEFAULT_USURA_RATE.toString()}
                                    aria-label={t('form.inputs.usuraRate')}
                                />
                                <span className="input-group-text">% {t('form.inputs.annual')}</span>
                            </div>
                        </Form.Group>

                        {/* Tipo de interes */}
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">{t('form.inputs.interestType')}</Form.Label>
                            <Form.Text className="text-muted d-block mb-2">
                                <div className="d-flex align-items-start">
                                    <RiInformationLine className="me-2 mt-1" />
                                    <span>{t('form.inputs.interestTypeHelpText')}</span>
                                </div>
                            </Form.Text>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="interest-simple"
                                    name="interestType"
                                    label={t('form.inputs.simpleInterest')}
                                    checked={interestType === 'simple'}
                                    onChange={() => setInterestType('simple')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="interest-compound"
                                    name="interestType"
                                    label={t('form.inputs.compoundInterest')}
                                    checked={interestType === 'compound'}
                                    onChange={() => setInterestType('compound')}
                                />
                            </div>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button type="submit" variant="outline-success">
                                {t('form.calculate')}
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
                    {displayResult ? (
                        <div className="w-100">
                            <Alert className="text-center" variant={displayResult.isError ? 'danger' : 'success'}>
                                <h4 className="mb-3">{t('result.title')}</h4>
                                
                                {displayResult.isError ? (
                                    <p className="mb-0">
                                        {t.rich('result.cantPay', {
                                            link1: (chunks) => <Link href="/#contact">{chunks}</Link>,
                                            link2: (chunks) => (
                                                <a href="https://wa.me/573012283818" rel="noopener noreferrer" target="_blank">{chunks}</a>
                                            ),
                                        })}
                                    </p>
                                ) : (
                                    <>
                                        <p className="mb-3">
                                            {t.rich('result.success', {
                                                time: displayResult.formattedTime ?? '',
                                                link1: (chunks) => <Link href="/#contact">{chunks}</Link>,
                                                link2: (chunks) => (
                                                    <a href="https://wa.me/573012283818" rel="noopener noreferrer" target="_blank">{chunks}</a>
                                                ),
                                            })}
                                        </p>

                                        {/* Detalles adicionales */}
                                        <div className="border-top pt-3 mt-3 text-start">
                                            <h6 className="text-center mb-3">{t('result.details')}</h6>
                                            
                                            <div className="row g-2">
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">{t('result.estimatedInterest')}:</span>
                                                        <span className="fw-bold">{displayResult.formattedInterest}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">{t('result.totalPayment')}:</span>
                                                        <span className="fw-bold">{displayResult.formattedTotal}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">{t('result.monthlyCapacity')}:</span>
                                                        <span className="fw-bold">{displayResult.formattedCapacity}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">{t('result.usedRate')}:</span>
                                                        <span className="fw-bold">{parsedUsuraRate}% {t('form.inputs.annual')}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">{t('result.interestTypeUsed')}:</span>
                                                        <span className="fw-bold">
                                                            {interestType === 'simple'
                                                                ? t('form.inputs.simpleInterest')
                                                                : t('form.inputs.compoundInterest')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <DebtGauge
                                    isInsolvent={!!displayResult.isError}
                                    years={displayResult.timeInYears}
                                />
                            </Alert>
                        </div>
                    ) : (
                        <div className="mt-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ReactSVG
                                beforeInjection={(svg) => {
                                    svg.setAttribute('width', '600px');
                                    svg.setAttribute('height', '600px');
                                }}
                                src="/assets/imgs/icons/calculadora.svg"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export const CalculatorForm = memo(CalculatorFormComponent);
export default CalculatorForm;
