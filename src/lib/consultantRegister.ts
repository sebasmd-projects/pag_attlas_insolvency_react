// Funciones puras (sin I/O) del registro de asesores. Seguras para cliente y servidor.

export const ALLOWED_EMAIL_DOMAINS = [
  'propensionesabogados.com',
  'fundacionattlas.com',
  'fundacionattlas.org',
] as const;

/** Dominio EXACTO permitido (sin subdominios). */
export function isAllowedEmailDomain(email: string): boolean {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf('@');
  if (at <= 0 || value.indexOf('@') !== at) return false;
  const domain = value.slice(at + 1);
  return (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain);
}

export function normalizeName(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export function buildRegisterPayload(input: RegisterPayload): RegisterPayload {
  return {
    first_name: normalizeName(input.first_name),
    last_name: normalizeName(input.last_name),
    email: normalizeEmail(input.email),
    password: input.password,
    password_confirm: input.password_confirm,
  };
}

export interface MappedResponse {
  status: number;
  body: Record<string, unknown>;
}

const RATE_LIMIT: MappedResponse = { status: 429, body: { success: false, error: 'RATE_LIMIT' } };
const BACKEND_ERROR: MappedResponse = { status: 502, body: { success: false, error: 'BACKEND_ERROR' } };

export function mapRegisterResponse(status: number, data: unknown): MappedResponse {
  if (status === 202) {
    const id = (data as { challenge_id?: unknown } | null)?.challenge_id;
    if (typeof id === 'string' && id) {
      return { status: 200, body: { success: true, challengeId: id } };
    }
    return BACKEND_ERROR;
  }
  if (status === 400) {
    const fields = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    return { status: 400, body: { success: false, error: 'VALIDATION_ERROR', fields } };
  }
  if (status === 429) return RATE_LIMIT;
  return BACKEND_ERROR;
}

export function mapRegisterVerifyResponse(status: number, data: unknown): MappedResponse {
  if (status === 200 && data && typeof data === 'object') {
    const u = data as { user?: unknown; email?: unknown };
    if (typeof u.user === 'string' && u.user) {
      return {
        status: 200,
        body: { success: true, user: u.user, email: typeof u.email === 'string' ? u.email : '' },
      };
    }
    return BACKEND_ERROR;
  }
  if (status === 400) return { status: 400, body: { success: false, error: 'INVALID_CODE' } };
  if (status === 429) return RATE_LIMIT;
  return BACKEND_ERROR;
}
