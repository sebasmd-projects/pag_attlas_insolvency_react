/**
 * Funciones de calculo para la calculadora de insolvencia
 * Todas las funciones son puras y no tienen efectos secundarios
 */

import type { CalculatorInput, CalculatorResult, InterestType } from './types';

/**
 * Tasa de usura por defecto (anual)
 * Fuente: Superintendencia Financiera de Colombia
 */
export const DEFAULT_USURA_RATE = 27.14;

/**
 * Calcula el interes simple
 * Formula: I = P * r * t
 * @param principal - Monto principal (deuda)
 * @param annualRate - Tasa de interes anual (porcentaje)
 * @param timeYears - Tiempo en anos
 * @returns Interes calculado
 */
export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  timeYears: number
): number {
  if (principal <= 0 || annualRate < 0 || timeYears <= 0) return 0;
  return principal * (annualRate / 100) * timeYears;
}

/**
 * Calcula el interes compuesto
 * Formula: I = P * ((1 + r)^t - 1)
 * @param principal - Monto principal (deuda)
 * @param annualRate - Tasa de interes anual (porcentaje)
 * @param timeYears - Tiempo en anos
 * @returns Interes calculado
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  timeYears: number
): number {
  if (principal <= 0 || annualRate < 0 || timeYears <= 0) return 0;
  const rate = annualRate / 100;
  return principal * (Math.pow(1 + rate, timeYears) - 1);
}

/**
 * Calcula el interes segun el tipo especificado
 */
export function calculateInterest(
  principal: number,
  annualRate: number,
  timeYears: number,
  interestType: InterestType
): number {
  if (interestType === 'compound') {
    return calculateCompoundInterest(principal, annualRate, timeYears);
  }
  return calculateSimpleInterest(principal, annualRate, timeYears);
}

/**
 * Valida los inputs de la calculadora
 */
export function validateCalculatorInputs(input: CalculatorInput): {
  valid: boolean;
  error?: string;
} {
  if (input.totalDebt <= 0) {
    return { valid: false, error: 'debtZero' };
  }

  if (input.income <= 0) {
    return { valid: false, error: 'incomeZero' };
  }

  if (input.essentialExpenses < 0) {
    return { valid: false, error: 'expensesNegative' };
  }

  if (input.hasPayrollDiscount && input.payrollDiscount < 0) {
    return { valid: false, error: 'payrollNegative' };
  }

  if (input.usuraRate < 0 || input.usuraRate > 100) {
    return { valid: false, error: 'rateInvalid' };
  }

  return { valid: true };
}

/**
 * Calcula la capacidad de pago mensual
 * 
 * Nueva formula:
 * - El descuento de nomina se SUMA al ingreso disponible (bono hacia la deuda)
 * - capacidadPago = (ingresos - gastosEsenciales) + descuentoNomina
 */
export function calculateMonthlyPaymentCapacity(input: CalculatorInput): number {
  const baseAvailable = input.income - input.essentialExpenses;
  
  // El descuento de nomina es un "bono" hacia la deuda
  // ya que ese dinero va directamente a pagar deudas
  const payrollBonus = input.hasPayrollDiscount ? input.payrollDiscount : 0;
  
  return baseAvailable + payrollBonus;
}

/**
 * Convierte anos a string formateado "X anos Y meses"
 */
export function formatYearsToString(
  years: number,
  translations: { years: string; months: string }
): string {
  const fullYears = Math.floor(years);
  const remainingMonths = Math.round((years - fullYears) * 12);

  if (fullYears === 0) {
    return `${remainingMonths} ${translations.months}`;
  }

  if (remainingMonths === 0) {
    return `${fullYears} ${translations.years}`;
  }

  return `${fullYears} ${translations.years} ${remainingMonths} ${translations.months}`;
}

/**
 * Parsea un string de tiempo a anos
 * Ejemplo: "2 anos 3 meses" -> 2.25
 */
export function parseTimeStringToYears(timeStr: string): number {
  const yearsMatch = timeStr.match(/(\d+)\s+años?/);
  const monthsMatch = timeStr.match(/(\d+)\s+meses?/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  const months = monthsMatch ? parseInt(monthsMatch[1]) : 0;
  return years + months / 12;
}

/**
 * Calcula el resultado completo de la calculadora
 */
export function calculateDebtPayment(
  input: CalculatorInput,
  translations: { years: string; months: string }
): CalculatorResult {
  // Validar inputs
  const validation = validateCalculatorInputs(input);
  if (!validation.valid) {
    return {
      isError: true,
      errorMessage: validation.error,
    };
  }

  // Calcular capacidad de pago mensual
  const monthlyCapacity = calculateMonthlyPaymentCapacity(input);

  // Si no hay capacidad de pago, retornar error
  if (monthlyCapacity <= 0) {
    return {
      isError: true,
      errorMessage: 'noPaymentCapacity',
      monthlyPaymentCapacity: monthlyCapacity,
    };
  }

  // Calcular tiempo en meses y anos
  const timeInMonths = input.totalDebt / monthlyCapacity;
  const timeInYears = timeInMonths / 12;

  // Calcular intereses estimados
  const estimatedInterest = calculateInterest(
    input.totalDebt,
    input.usuraRate,
    timeInYears,
    input.interestType
  );

  // Pago total
  const totalPayment = input.totalDebt + estimatedInterest;

  // Formatear tiempo
  const formattedTime = formatYearsToString(timeInYears, translations);

  return {
    isError: false,
    timeInMonths,
    timeInYears,
    formattedTime,
    estimatedInterest,
    totalPayment,
    monthlyPaymentCapacity: monthlyCapacity,
  };
}
