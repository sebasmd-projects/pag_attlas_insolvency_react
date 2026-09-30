import {
  isAllowedEmailDomain,
  normalizeName,
  normalizeEmail,
  buildRegisterPayload,
  mapRegisterResponse,
  mapRegisterVerifyResponse,
} from '../consultantRegister';

describe('isAllowedEmailDomain', () => {
  it.each([
    'a@propensionesabogados.com',
    'a@fundacionattlas.com',
    'a@fundacionattlas.org',
    'A@FundacionAttlas.ORG',
  ])('permite %s', (e) => expect(isAllowedEmailDomain(e)).toBe(true));

  it.each([
    'a@gmail.com',
    'a@sub.fundacionattlas.org',
    'a@evil.propensionesabogados.com',
    'a@fundacionattlas.org.evil.com',
    'a@xfundacionattlas.org',
    'a@fundacionattlas.net',
    'a@b@fundacionattlas.org',
    'fundacionattlas.org',
    '',
  ])('rechaza %s', (e) => expect(isAllowedEmailDomain(e)).toBe(false));
});

describe('normalizacion', () => {
  it('nombres en mayusculas y correo en minusculas', () => {
    expect(normalizeName('  juan sebastian ')).toBe('JUAN SEBASTIAN');
    expect(normalizeEmail(' Juan@FundacionAttlas.ORG ')).toBe('juan@fundacionattlas.org');
    expect(
      buildRegisterPayload({
        first_name: 'ana',
        last_name: 'perez',
        email: 'A@Fundacionattlas.com',
        password: 'Xy',
        password_confirm: 'Xy',
      })
    ).toEqual({
      first_name: 'ANA',
      last_name: 'PEREZ',
      email: 'a@fundacionattlas.com',
      password: 'Xy',
      password_confirm: 'Xy',
    });
  });
});

describe('mapRegisterResponse', () => {
  it('202 devuelve challengeId', () => {
    expect(mapRegisterResponse(202, { challenge_id: 'abc' })).toEqual({
      status: 200,
      body: { success: true, challengeId: 'abc' },
    });
  });
  it('202 sin challenge_id es error', () => {
    expect(mapRegisterResponse(202, {}).status).toBe(502);
  });
  it('400 reenvia errores por campo', () => {
    expect(mapRegisterResponse(400, { email: ['Dominio no permitido'] })).toEqual({
      status: 400,
      body: { success: false, error: 'VALIDATION_ERROR', fields: { email: ['Dominio no permitido'] } },
    });
  });
  it('429 es RATE_LIMIT', () => {
    expect(mapRegisterResponse(429, {})).toEqual({
      status: 429,
      body: { success: false, error: 'RATE_LIMIT' },
    });
  });
  it('otros son error generico', () => {
    expect(mapRegisterResponse(500, {}).status).toBe(502);
  });
});

describe('mapRegisterVerifyResponse', () => {
  it('200 devuelve user y email', () => {
    expect(mapRegisterVerifyResponse(200, { user: 'JSMD', email: 'a@b.c' })).toEqual({
      status: 200,
      body: { success: true, user: 'JSMD', email: 'a@b.c' },
    });
  });
  it('400 es INVALID_CODE', () => {
    expect(mapRegisterVerifyResponse(400, { detail: 'x' }).body).toEqual({
      success: false,
      error: 'INVALID_CODE',
    });
  });
  it('429 es RATE_LIMIT', () => {
    expect(mapRegisterVerifyResponse(429, {}).status).toBe(429);
  });
  it('200 sin user es error', () => {
    expect(mapRegisterVerifyResponse(200, {}).status).toBe(502);
  });
});
