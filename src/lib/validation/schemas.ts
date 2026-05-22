/**
 * Esquemas de validacion con Zod para la calculadora y autenticacion
 */

import { z } from 'zod';

/**
 * Schema para los inputs de la calculadora
 */
export const calculatorInputSchema = z.object({
  totalDebt: z.number().positive('El total de deudas debe ser mayor a cero'),
  essentialExpenses: z.number().nonnegative('Los gastos esenciales no pueden ser negativos'),
  income: z.number().positive('Los ingresos deben ser mayores a cero'),
  payrollDiscount: z.number().nonnegative('El descuento de nomina no puede ser negativo'),
  hasPayrollDiscount: z.boolean(),
  usuraRate: z.number().min(0).max(100, 'La tasa debe estar entre 0 y 100'),
  interestType: z.enum(['simple', 'compound']),
});

/**
 * Schema para identificacion de usuario
 */
export const userIdentificationSchema = z.object({
  cedula: z
    .string()
    .min(6, 'La cedula debe tener al menos 6 caracteres')
    .max(15, 'La cedula no puede tener mas de 15 caracteres')
    .regex(/^\d+$/, 'La cedula solo puede contener numeros'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha invalido (YYYY-MM-DD)'),
});

/**
 * Schema para registro de usuario
 */
export const userRegistrationSchema = z.object({
  cedula: z
    .string()
    .min(6, 'La cedula debe tener al menos 6 caracteres')
    .max(15, 'La cedula no puede tener mas de 15 caracteres')
    .regex(/^\d+$/, 'La cedula solo puede contener numeros'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha invalido'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener mas de 100 caracteres'),
  email: z
    .string()
    .email('El correo electronico no es valido'),
  phone: z
    .string()
    .min(7, 'El telefono debe tener al menos 7 digitos')
    .max(15, 'El telefono no puede tener mas de 15 digitos')
    .regex(/^[\d\s\-\+]+$/, 'El telefono solo puede contener numeros'),
  address: z
    .string()
    .min(5, 'La direccion debe tener al menos 5 caracteres')
    .max(200, 'La direccion no puede tener mas de 200 caracteres')
    .optional(),
});

/**
 * Schema para login de cliente
 */
export const clientLoginSchema = z.object({
  cedula: z
    .string()
    .min(6, 'La cedula debe tener al menos 6 caracteres')
    .max(15, 'La cedula no puede tener mas de 15 caracteres')
    .regex(/^\d+$/, 'La cedula solo puede contener numeros'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha invalido'),
});

/**
 * Schema para login de asesor
 */
export const advisorLoginSchema = z.object({
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

// Tipos inferidos de los schemas
export type CalculatorInputSchema = z.infer<typeof calculatorInputSchema>;
export type UserIdentificationSchema = z.infer<typeof userIdentificationSchema>;
export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
export type ClientLoginSchema = z.infer<typeof clientLoginSchema>;
export type AdvisorLoginSchema = z.infer<typeof advisorLoginSchema>;
