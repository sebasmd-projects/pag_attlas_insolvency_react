'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { RiAlarmWarningLine } from 'react-icons/ri';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';

const DebtGauge = dynamic(() => import('./components/DebtGauge'));

export default function CalculatorPage() {
    const t = useTranslations('Platform.calculator');

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

        function onBlur() {
            setDisplay(formatToLocale(display));
        }

        return { display, numeric, handleChange, onBlur };
    }

    const essentialExpenses = useCurrencyInput();
    const totalDebt = useCurrencyInput();
    const payrollDiscount = useCurrencyInput();
    const income = useCurrencyInput();

    const [hasPayrollDiscount, setHasPayrollDiscount] = useState<'yes' | 'no'>('no');
    const [result, setResult] = useState<{ isError?: boolean; time?: string }>({});

    function convertYearsToYearsAndMonths(years: number): string {
        const fullYears = Math.floor(years);
        const remainingMonths = Math.round((years - fullYears) * 12);
        if (fullYears === 0) return `${remainingMonths} ${t('result.months')}`;
        return `${fullYears} ${t('result.years')} ${remainingMonths} ${t('result.months')}`;
    }

    function parseTimeToYears(timeStr: string): number {
        const yearsMatch = timeStr.match(/(\d+)\s+años?/);
        const monthsMatch = timeStr.match(/(\d+)\s+meses?/);
        const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
        const months = monthsMatch ? parseInt(monthsMatch[1]) : 0;
        return years + months / 12;
    }

    function calculate(e: React.FormEvent): void {
        e.preventDefault();

        const payroll = hasPayrollDiscount === 'yes' ? payrollDiscount.numeric || 0 : 0;
        const availableMonthly = (income.numeric || 0) - (payroll + (essentialExpenses.numeric || 0));

        if (!totalDebt.numeric || totalDebt.numeric <= 0) {
            setResult({ isError: true });
            return;
        }

        if (availableMonthly <= 0) {
            setResult({ isError: true });
            return;
        }

        const yearsNeeded = totalDebt.numeric / (availableMonthly * 12);
        const formattedTime = convertYearsToYearsAndMonths(yearsNeeded);
        setResult({ isError: false, time: formattedTime });
    }

    const inputProps = {
        inputMode: 'decimal' as const,
        onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
    };

    function translateRaw(key: string) {
        return t.raw(key as any);
    }

    const itemKeys = [
        'item1', 'item2', 'item3', 'item4', 'item5',
        'item6', 'item7', 'item8', 'item9', 'item10',
        'item11', 'item12', 'item13',
    ] as const satisfies ReadonlyArray<string>;

    return (
        <div className="container my-5">
            <div className="mb-4 container-lg">
                <TitleComponent title={t('title')} />
                <SubTitleComponent sub_title="subTitle" t={t} />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form onSubmit={calculate}>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>{t('form.inputs.essentialExpenses')}</Form.Label>

                            <Form.Text className="text-muted">
                                <div className="mb-2 d-flex align-items-start">
                                    <RiAlarmWarningLine className="me-2 mt-1" />
                                    <span>{t('form.inputs.essentialExpensesHelpText')}</span>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <ul className="list-unstyled">
                                            {itemKeys.slice(0, Math.ceil(itemKeys.length / 2)).map((key) => {
                                                const fullKey = `form.inputs.essentialExpensesItems.${key}`;
                                                return <li key={key}>{translateRaw(fullKey)}</li>;
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-6">
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

                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>{t('form.inputs.totalDebt')}</Form.Label>
                            <Form.Control
                                {...inputProps}
                                onBlur={totalDebt.onBlur}
                                onChange={(e) => totalDebt.handleChange(e.target.value)}
                                placeholder={t('form.inputs.totalDebt')}
                                required
                                value={totalDebt.display}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>{t('form.inputs.payrollDiscount')}</Form.Label>
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
                                <Form.Label className='fw-bold'>{t('form.inputs.discountAmount')}</Form.Label>
                                <Form.Control
                                    {...inputProps}
                                    onBlur={payrollDiscount.onBlur}
                                    onChange={(e) => payrollDiscount.handleChange(e.target.value)}
                                    required
                                    value={payrollDiscount.display}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-4">
                            <Form.Label className='fw-bold'>{t('form.inputs.income')}</Form.Label>
                            <Form.Control
                                {...inputProps}
                                onBlur={income.onBlur}
                                onChange={(e) => income.handleChange(e.target.value)}
                                placeholder={t('form.inputs.income')}
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
                </div>

                <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
                    {(result.time || result.isError) && (
                        <div className="w-100">
                            <Alert className="text-center" variant={result.isError ? 'danger' : 'success'}>
                                <h4 className="mb-3">{t('result.title')}</h4>
                                <p className="mb-0">
                                    {result.isError
                                        ? t.rich('result.cantPay', {
                                            link1: (chunks) => <Link href="/#contact">{chunks}</Link>,
                                            link2: (chunks) => (
                                                <a href="https://wa.me/573012283818" rel="noopener noreferrer" target="_blank">{chunks}</a>
                                            ),
                                        })
                                        : t.rich('result.success', {
                                            time: result.time ?? '',
                                            link1: (chunks) => <Link href="/#contact">{chunks}</Link>,
                                            link2: (chunks) => (
                                                <a href="https://wa.me/573012283818" rel="noopener noreferrer" target="_blank">{chunks}</a>
                                            ),
                                        })}
                                    <DebtGauge
                                        isInsolvent={!!result.isError}
                                        years={result.time ? parseTimeToYears(result.time) : undefined}
                                    />
                                </p>
                            </Alert>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
