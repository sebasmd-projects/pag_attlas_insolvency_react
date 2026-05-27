// src/app/[locale]/platform/calculator/hooks/useCalculator.ts

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  calculateDebtPayment,
  DEFAULT_USURA_RATE,
  type CalculatorInput,
  type CalculatorResult,
  type InterestType,
} from '@/lib/calculator';

interface CurrencyInputState {
  display: string;
  numeric: number | undefined;
}

/**
 * Parsea un numero con formato de locale (1.234,56) a numero
 */
function parseLocaleNumber(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  return Number(cleaned);
}

/**
 * Formatea un numero a formato de locale (1.234,56)
 */
function formatToLocale(value: string): string {
  const numeric = parseLocaleNumber(value);
  if (isNaN(numeric)) return value;
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Formatea un numero a formato de moneda COP
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export interface UseCalculatorReturn {
  // Inputs
  essentialExpenses: CurrencyInputState & {
    handleChange: (value: string) => void;
    onBlur: () => void;
  };
  totalDebt: CurrencyInputState & {
    handleChange: (value: string) => void;
    onBlur: () => void;
  };
  payrollDiscount: CurrencyInputState & {
    handleChange: (value: string) => void;
    onBlur: () => void;
  };
  income: CurrencyInputState & {
    handleChange: (value: string) => void;
    onBlur: () => void;
  };

  // Options
  hasPayrollDiscount: 'yes' | 'no';
  setHasPayrollDiscount: (value: 'yes' | 'no') => void;
  usuraRate: string;
  setUsuraRate: (value: string) => void;
  interestType: InterestType;
  setInterestType: (value: InterestType) => void;

  // Result
  result: CalculatorResult | null;
  setResult: (result: CalculatorResult | null) => void;

  // Actions
  calculate: (translations: { years: string; months: string }) => void;
  reset: () => void;

  // Computed values
  parsedUsuraRate: number;
  
  // Loading state for interest rate
  isLoadingRate: boolean;
  rateSource: 'backend' | 'default' | 'manual';
}

/**
 * Custom hook para manejar la logica de la calculadora
 */
export function useCalculator(): UseCalculatorReturn {
  // State for currency inputs
  const [essentialExpensesState, setEssentialExpensesState] = useState<CurrencyInputState>({
    display: '',
    numeric: undefined,
  });

  const [totalDebtState, setTotalDebtState] = useState<CurrencyInputState>({
    display: '',
    numeric: undefined,
  });

  const [payrollDiscountState, setPayrollDiscountState] = useState<CurrencyInputState>({
    display: '',
    numeric: undefined,
  });

  const [incomeState, setIncomeState] = useState<CurrencyInputState>({
    display: '',
    numeric: undefined,
  });

  // Options state
  const [hasPayrollDiscount, setHasPayrollDiscount] = useState<'yes' | 'no'>('no');
  const [usuraRate, setUsuraRate] = useState<string>(DEFAULT_USURA_RATE.toString());
  const [interestType, setInterestType] = useState<InterestType>('simple');
  
  // Interest rate loading state
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);
  const [rateSource, setRateSource] = useState<'backend' | 'default' | 'manual'>('default');

  // Result state
  const [result, setResult] = useState<CalculatorResult | null>(null);
  
  // Fetch interest rate from backend on mount
  useEffect(() => {
    async function fetchInterestRate() {
      try {
        setIsLoadingRate(true);
        const response = await fetch('/api/platform/calculator/interest-rate');
        const data = await response.json();
        
        if (data.success && typeof data.rate === 'number') {
          setUsuraRate(data.rate.toString());
          setRateSource(data.source === 'backend' ? 'backend' : 'default');
        }
      } catch {
        // Keep default rate on error
        setRateSource('default');
      } finally {
        setIsLoadingRate(false);
      }
    }
    
    fetchInterestRate();
  }, []);

  // Parsed usura rate
  const parsedUsuraRate = useMemo(() => {
    const parsed = parseFloat(usuraRate.replace(',', '.'));
    return isNaN(parsed) ? DEFAULT_USURA_RATE : parsed;
  }, [usuraRate]);

  // Create currency input handlers
  const createCurrencyInput = useCallback(
    (
      state: CurrencyInputState,
      setState: React.Dispatch<React.SetStateAction<CurrencyInputState>>
    ) => ({
      ...state,
      handleChange: (value: string) => {
        setState({
          display: value,
          numeric: parseLocaleNumber(value),
        });
      },
      onBlur: () => {
        setState((prev) => ({
          ...prev,
          display: formatToLocale(prev.display),
        }));
      },
    }),
    []
  );

  const essentialExpenses = useMemo(
    () => createCurrencyInput(essentialExpensesState, setEssentialExpensesState),
    [essentialExpensesState, createCurrencyInput]
  );

  const totalDebt = useMemo(
    () => createCurrencyInput(totalDebtState, setTotalDebtState),
    [totalDebtState, createCurrencyInput]
  );

  const payrollDiscount = useMemo(
    () => createCurrencyInput(payrollDiscountState, setPayrollDiscountState),
    [payrollDiscountState, createCurrencyInput]
  );

  const income = useMemo(
    () => createCurrencyInput(incomeState, setIncomeState),
    [incomeState, createCurrencyInput]
  );

  // Calculate function
  const calculate = useCallback(
    (translations: { years: string; months: string }) => {
      const input: CalculatorInput = {
        totalDebt: totalDebtState.numeric || 0,
        essentialExpenses: essentialExpensesState.numeric || 0,
        income: incomeState.numeric || 0,
        payrollDiscount: hasPayrollDiscount === 'yes' ? payrollDiscountState.numeric || 0 : 0,
        hasPayrollDiscount: hasPayrollDiscount === 'yes',
        usuraRate: parsedUsuraRate,
        interestType,
      };

      const calculationResult = calculateDebtPayment(input, translations);
      setResult(calculationResult);
    },
    [
      totalDebtState.numeric,
      essentialExpensesState.numeric,
      incomeState.numeric,
      payrollDiscountState.numeric,
      hasPayrollDiscount,
      parsedUsuraRate,
      interestType,
    ]
  );

  // Reset function
  const reset = useCallback(() => {
    setEssentialExpensesState({ display: '', numeric: undefined });
    setTotalDebtState({ display: '', numeric: undefined });
    setPayrollDiscountState({ display: '', numeric: undefined });
    setIncomeState({ display: '', numeric: undefined });
    setHasPayrollDiscount('no');
    setUsuraRate(DEFAULT_USURA_RATE.toString());
    setInterestType('simple');
    setResult(null);
  }, []);

  // Custom setUsuraRate that marks source as manual
  const handleSetUsuraRate = useCallback((value: string) => {
    setUsuraRate(value);
    setRateSource('manual');
  }, []);

  return {
    essentialExpenses,
    totalDebt,
    payrollDiscount,
    income,
    hasPayrollDiscount,
    setHasPayrollDiscount,
    usuraRate,
    setUsuraRate: handleSetUsuraRate,
    interestType,
    setInterestType,
    result,
    setResult,
    calculate,
    reset,
    parsedUsuraRate,
    isLoadingRate,
    rateSource,
  };
}
