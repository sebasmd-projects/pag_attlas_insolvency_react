// SOLO SERVIDOR: este módulo lee ATTLAS_SERVER_KEY y NUNCA debe importarse
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

export function djangoHeaders(
  extra: Record<string, string> = {},
  request?: Request,
): Record<string, string> {
  const key = process.env.ATTLAS_SERVER_KEY;
  if (!key) {
    throw new Error('ATTLAS_SERVER_KEY no está definida: es obligatoria para llamar a la API de Attlas.');
  }
  const headers: Record<string, string> = { 'X-Server-Key': key, ...extra };
  if (request) {
    const ip = clientIp(request);
    if (ip) headers['X-Client-IP'] = ip;
  }
  return headers;
}
