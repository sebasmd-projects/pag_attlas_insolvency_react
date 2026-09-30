// Mapeo puro (sin I/O) de las respuestas del flujo OTP de /clients/lookup/.
// Seguro para importar desde servidor o tests; no toca secretos.

export interface LookupResult {
  status: number;
  body: Record<string, unknown>;
}

export interface VerifyResult extends LookupResult {
  /** Token de alcance "lookup" para la cookie; solo presente en éxito. */
  token?: string;
  expiresIn?: number;
}

export const LOOKUP_COOKIE = 'lookup_token';

const RATE_LIMIT: LookupResult = { status: 429, body: { success: false, error: 'RATE_LIMIT' } };

export function mapLookupResponse(status: number, data: unknown): LookupResult {
  if (status === 202) {
    const id = (data as { challenge_id?: unknown } | null)?.challenge_id;
    if (typeof id === 'string' && id) {
      return { status: 200, body: { success: true, challengeId: id } };
    }
    return { status: 502, body: { success: false, error: 'BACKEND_ERROR' } };
  }
  if (status === 429) return RATE_LIMIT;
  if (status === 400) {
    return { status: 400, body: { success: false, error: 'VALIDATION_ERROR' } };
  }
  return { status: 502, body: { success: false, error: 'BACKEND_ERROR' } };
}

export function mapVerifyResponse(status: number, data: unknown): VerifyResult {
  if (status === 200 && data && typeof data === 'object') {
    const u = data as Record<string, any>;
    if (typeof u.token === 'string' && u.token) {
      return {
        status: 200,
        token: u.token,
        expiresIn: typeof u.expires_in === 'number' ? u.expires_in : undefined,
        body: {
          success: true,
          found: true,
          user: {
            id: u.id,
            formId: u.form_id ?? null,
            cedula: u.documentNumber,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email ?? '',
            phone: u.phone ?? '',
            address: u.address ?? '',
            birthDate: u.birthDate,
          },
        },
      };
    }
    return { status: 502, body: { success: false, error: 'BACKEND_ERROR' } };
  }
  if (status === 400) return { status: 400, body: { success: false, error: 'INVALID_CODE' } };
  if (status === 429) return RATE_LIMIT;
  return { status: 502, body: { success: false, error: 'BACKEND_ERROR' } };
}
