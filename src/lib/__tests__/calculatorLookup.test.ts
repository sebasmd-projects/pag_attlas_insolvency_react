import { mapLookupResponse, mapVerifyResponse } from '../calculatorLookup';

describe('mapLookupResponse', () => {
  it('202 devuelve solo challengeId', () => {
    expect(mapLookupResponse(202, { challenge_id: 'abc' })).toEqual({
      status: 200,
      body: { success: true, challengeId: 'abc' },
    });
  });
  it('202 sin challenge_id es error', () => {
    expect(mapLookupResponse(202, {}).status).toBe(502);
  });
  it('429 es RATE_LIMIT', () => {
    expect(mapLookupResponse(429, { detail: 'x' })).toEqual({
      status: 429,
      body: { success: false, error: 'RATE_LIMIT' },
    });
  });
  it('otros errores son genéricos', () => {
    expect(mapLookupResponse(500, null).body).toEqual({ success: false, error: 'BACKEND_ERROR' });
  });
});

describe('mapVerifyResponse', () => {
  const ok = {
    id: 1, form_id: 9, documentNumber: '123456', birthDate: '1990-01-01',
    firstName: 'A', lastName: 'B', email: 'a@b.c', phone: null, address: undefined,
    token: 'tok', expires_in: 1800,
  };
  it('200 mapea user y separa el token del cuerpo', () => {
    const r = mapVerifyResponse(200, ok);
    expect(r.token).toBe('tok');
    expect(r.expiresIn).toBe(1800);
    expect(JSON.stringify(r.body)).not.toContain('tok');
    expect(r.body).toEqual({
      success: true,
      found: true,
      user: {
        id: 1, formId: 9, cedula: '123456', firstName: 'A', lastName: 'B',
        email: 'a@b.c', phone: '', address: '', birthDate: '1990-01-01',
      },
    });
  });
  it('400 es INVALID_CODE', () => {
    expect(mapVerifyResponse(400, { detail: 'x' })).toEqual({
      status: 400,
      body: { success: false, error: 'INVALID_CODE' },
    });
  });
  it('429 es RATE_LIMIT', () => {
    expect(mapVerifyResponse(429, {}).status).toBe(429);
  });
  it('200 sin token es error', () => {
    expect(mapVerifyResponse(200, { ...ok, token: undefined }).status).toBe(502);
  });
});
