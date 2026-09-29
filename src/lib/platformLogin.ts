// Helpers puros del login de asesor (sin dependencias de Next) para poder probarlos.

export type LoginErrorMapping = { code: string; detail: string };

/** Divide "USUARIO-CLAVE" solo en el primer guion. Devuelve null si el formato es inválido. */
export function splitAdvisorPassword(value: string): { user: string; password: string } | null {
  const idx = value.indexOf('-');
  if (idx <= 0 || idx === value.length - 1) return null;
  return { user: value.slice(0, idx), password: value.slice(idx + 1) };
}

/** Mapea el error del backend a un código de UI, sin revelar qué campo falló. */
export function mapBackendError(errorData: unknown, statusCode: number): LoginErrorMapping {
  const data = errorData as { non_field_errors?: unknown } | null | undefined;
  if (statusCode === 429) {
    return { code: 'tooManyAttempts', detail: 'Demasiados intentos. Por favor espere unos minutos.' };
  }
  if (data?.non_field_errors || statusCode === 400 || statusCode === 401) {
    return { code: 'invalidCredentials', detail: 'Credenciales inválidas.' };
  }
  return { code: 'generalError', detail: 'Error de autenticacion' };
}
