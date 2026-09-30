/**
 * @jest-environment node
 */
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

  describe('X-Client-IP', () => {
    const req = (headers: Record<string, string>) => new Request('http://x', { headers });
    beforeEach(() => {
      process.env.ATTLAS_SERVER_KEY = 'k';
    });

    it('usa x-vercel-forwarded-for con prioridad', () => {
      const h = djangoHeaders({}, req({ 'x-vercel-forwarded-for': '198.51.100.9', 'x-forwarded-for': '203.0.113.7' }));
      expect(h['X-Client-IP']).toBe('198.51.100.9');
    });

    it('usa el primer valor de x-forwarded-for', () => {
      const h = djangoHeaders({}, req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }));
      expect(h['X-Client-IP']).toBe('203.0.113.7');
    });

    it('usa x-real-ip como último recurso', () => {
      expect(djangoHeaders({}, req({ 'x-real-ip': '192.0.2.5' }))['X-Client-IP']).toBe('192.0.2.5');
    });

    it('acepta IPv6 válida', () => {
      expect(djangoHeaders({}, req({ 'x-forwarded-for': '2001:db8::1' }))['X-Client-IP']).toBe('2001:db8::1');
    });

    it('no envía la cabecera con valor inválido', () => {
      expect(djangoHeaders({}, req({ 'x-forwarded-for': 'no-es-ip' }))).not.toHaveProperty('X-Client-IP');
    });

    it('no envía la cabecera sin cabeceras de IP', () => {
      expect(djangoHeaders({}, req({}))).toEqual({ 'X-Server-Key': 'k' });
    });

    it('sin request se comporta como antes', () => {
      expect(djangoHeaders({ A: 'b' })).toEqual({ 'X-Server-Key': 'k', A: 'b' });
    });
  });
});
