import { mapBackendError, splitAdvisorPassword } from '../platformLogin';

describe('splitAdvisorPassword', () => {
  it('divide solo en el primer guion', () => {
    expect(splitAdvisorPassword('ASE-cl-a-ve')).toEqual({ user: 'ASE', password: 'cl-a-ve' });
  });
  it.each(['singuion', '-clave', 'USER-', ''])('rechaza %j', (v) => {
    expect(splitAdvisorPassword(v)).toBeNull();
  });
});

describe('mapBackendError', () => {
  it('non_field_errors y 400/401 son credenciales inválidas', () => {
    expect(mapBackendError({ non_field_errors: ['x'] }, 400).code).toBe('invalidCredentials');
    expect(mapBackendError(null, 401).code).toBe('invalidCredentials');
  });
  it('429 es tooManyAttempts', () => {
    expect(mapBackendError({ detail: 'x' }, 429).code).toBe('tooManyAttempts');
  });
  it('otros son generalError', () => {
    expect(mapBackendError(null, 500).code).toBe('generalError');
  });
});
