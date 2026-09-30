// SOLO SERVIDOR: este módulo lee SERVER_KEY y NUNCA debe importarse
// desde componentes cliente ("use client"). La variable no debe llevar prefijo NEXT_PUBLIC_.

import { isIP } from 'node:net';

function clientIp(request: Request): string | null {
  const sources = ['x-vercel-forwarded-for', 'x-forwarded-for', 'x-real-ip'];
  for (const name of sources) {
    const raw = request.headers.get(name);
    if (!raw) continue;
    const first = raw.split(',')[0].trim();
    if (first && isIP(first) !== 0) return first;
  }
  return null;
}

let legacyWarned = false;

// Transición: SERVER_KEY manda; si falta se usa ATTLAS_SERVER_KEY (nombre viejo)
// y se avisa una sola vez. Retirar el fallback cuando Vercel ya use SERVER_KEY.
function serverKey(): string | undefined {
  const key = process.env.SERVER_KEY;
  if (key) return key;
  const legacy = process.env.ATTLAS_SERVER_KEY;
  if (legacy && !legacyWarned) {
    legacyWarned = true;
    console.warn('ATTLAS_SERVER_KEY está en desuso: define SERVER_KEY (el mismo valor) y retira la vieja.');
  }
  return legacy || undefined;
}

export function djangoHeaders(
  extra: Record<string, string> = {},
  request?: Request,
): Record<string, string> {
  const key = serverKey();
  if (!key) {
    throw new Error('SERVER_KEY no está definida: es obligatoria para llamar a la API de Attlas.');
  }
  const headers: Record<string, string> = { 'X-Server-Key': key, ...extra };
  if (request) {
    const ip = clientIp(request);
    if (ip) headers['X-Client-IP'] = ip;
  }
  return headers;
}
