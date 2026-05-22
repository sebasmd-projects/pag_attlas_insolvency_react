/**
 * Tipos para la calculadora de insolvencia
 */

export type InterestType = 'simple' | 'compound';

export interface CalculatorInput {
  /** Total de deudas en COP */
  totalDebt: number;
  /** Gastos esenciales mensuales en COP */
  essentialExpenses: number;
  /** Ingresos totales mensuales en COP */
  income: number;
  /** Descuento por nomina mensual en COP (si aplica) */
  payrollDiscount: number;
  /** Indica si tiene descuento por nomina */
  hasPayrollDiscount: boolean;
  /** Tasa de interes de usura anual (porcentaje) */
  usuraRate: number;
  /** Tipo de interes: simple o compuesto */
  interestType: InterestType;
}

export interface CalculatorResult {
  /** Indica si hubo un error en el calculo */
  isError: boolean;
  /** Mensaje de error si aplica */
  errorMessage?: string;
  /** Tiempo en meses para pagar la deuda */
  timeInMonths?: number;
  /** Tiempo en anos para pagar la deuda */
  timeInYears?: number;
  /** Tiempo formateado como string (ej: "2 anos 3 meses") */
  formattedTime?: string;
  /** Valor estimado de intereses en COP */
  estimatedInterest?: number;
  /** Pago total (deuda + intereses) en COP */
  totalPayment?: number;
  /** Capacidad de pago mensual en COP */
  monthlyPaymentCapacity?: number;
}

export interface UserIdentificationData {
  /** Numero de cedula */
  cedula: string;
  /** Fecha de nacimiento (YYYY-MM-DD) */
  birthDate: string;
}

export interface UserData {
  id?: string;
  cedula: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
}

export interface UserSearchResult {
  found: boolean;
  user?: UserData;
  error?: string;
}
