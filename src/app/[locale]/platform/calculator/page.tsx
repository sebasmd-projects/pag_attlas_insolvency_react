'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

function parseLocaleNumber(value: string): number {
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    return Number(cleaned);
}

function formatToLocale(value: string): string {
    const numeric = parseLocaleNumber(value);
    if (isNaN(numeric)) return value;
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numeric);
}

function useCurrencyInput(initial = '') {
    const [display, setDisplay] = useState(initial);
    const [numeric, setNumeric] = useState<number | undefined>();

    function handleChange(value: string) {
        setDisplay(value);
        setNumeric(parseLocaleNumber(value));
    }

    function handleBlur() {
        setDisplay(formatToLocale(display));
    }

    return { display, numeric, handleChange, handleBlur };
}

export default function CalculatorPage() {
    const t = useTranslations('Platform.calculator');

    const essentialExpenses = useCurrencyInput();
    const totalDebt = useCurrencyInput();
    const payrollDiscount = useCurrencyInput();
    const income = useCurrencyInput();

    const [hasPayrollDiscount, setHasPayrollDiscount] = useState<'yes' | 'no'>('no');
    const [result, setResult] = useState<{ message?: string; isError?: boolean }>({});

    function convertYearsToYearsAndMonths(years: number): string {
        const fullYears = Math.floor(years);
        const remainingMonths = Math.round((years - fullYears) * 12);
        if (fullYears === 0) return `${remainingMonths} ${t('result.months')}`;
        return `${fullYears} ${t('result.years')} ${remainingMonths} ${t('result.months')}`;
    }

    function calculate(e: React.FormEvent): void {
        e.preventDefault();

        const payroll = hasPayrollDiscount === 'yes' ? payrollDiscount.numeric || 0 : 0;
        const availableMonthly = (income.numeric || 0) - (payroll + (essentialExpenses.numeric || 0));

        if (!totalDebt.numeric || totalDebt.numeric <= 0) {
            setResult({ message: t('form.validation.debtZero'), isError: true });
            return;
        }

        if (availableMonthly <= 0) {
            setResult({ message: t('result.cantPay'), isError: true });
            return;
        }

        const yearsNeeded = totalDebt.numeric / (availableMonthly * 12);
        const formattedTime = convertYearsToYearsAndMonths(yearsNeeded);
        setResult({ message: t('result.success', { time: formattedTime }), isError: false });
    }

    const inputProps = {
        inputMode: 'decimal' as const,
        onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">{t('title')}</h2>

            <Form onSubmit={calculate}>
                <Form.Group className="mb-3">
                    <Form.Label>{t('form.inputs.essentialExpenses')}</Form.Label>
                    <Form.Control
                        {...inputProps}
                        onBlur={() => essentialExpenses.handleBlur}
                        onChange={(e) => essentialExpenses.handleChange(e.target.value)}
                        required
                        value={essentialExpenses.display}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{t('form.inputs.totalDebt')}</Form.Label>
                    <Form.Control
                        {...inputProps}
                        onBlur={() => totalDebt.handleBlur}
                        onChange={(e) => totalDebt.handleChange(e.target.value)}
                        required
                        value={totalDebt.display}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{t('form.inputs.payrollDiscount')}</Form.Label>
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
                        <Form.Label>{t('form.inputs.discountAmount')}</Form.Label>
                        <Form.Control
                            {...inputProps}
                            onBlur={() => payrollDiscount.handleBlur}
                            onChange={(e) => payrollDiscount.handleChange(e.target.value)}
                            required
                            value={payrollDiscount.display}
                        />
                    </Form.Group>
                )}

                <Form.Group className="mb-4">
                    <Form.Label>{t('form.inputs.income')}</Form.Label>
                    <Form.Control
                        {...inputProps}
                        onBlur={() => income.handleBlur}
                        onChange={(e) => income.handleChange(e.target.value)}
                        required
                        value={income.display}
                    />
                </Form.Group>


                <div className="d-grid gap-2">
                    <Button type="submit" variant="outline-success">
                        {t('form.calculate')}
                    </Button>
                </div>

            </Form>

            {result.message && (
                <div className="mt-4">
                    <Alert variant={result.isError ? 'danger' : 'success'}>
                        <h4 className="mb-3">{t('result.title')}</h4>
                        <p className="mb-0">{result.message}</p>
                    </Alert>
                </div>
            )}
        </div>
    );
}
