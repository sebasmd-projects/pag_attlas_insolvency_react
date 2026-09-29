import { djangoHeaders } from '../djangoHeaders';

describe('djangoHeaders', () => {
  const original = process.env.ATTLAS_SERVER_KEY;
  afterEach(() => {
    if (original === undefined) delete process.env.ATTLAS_SERVER_KEY;
    else process.env.ATTLAS_SERVER_KEY = original;
  });

  it('lanza si falta la clave', () => {
    delete process.env.ATTLAS_SERVER_KEY;
    expect(() => djangoHeaders()).toThrow(/ATTLAS_SERVER_KEY/);
  });

  it('incluye la clave y combina cabeceras extra', () => {
    process.env.ATTLAS_SERVER_KEY = 'k';
    expect(djangoHeaders({ Authorization: 'Bearer t' })).toEqual({
      'X-Server-Key': 'k',
      Authorization: 'Bearer t',
    });
  });
});
