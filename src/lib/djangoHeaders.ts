// SOLO SERVIDOR: este módulo lee ATTLAS_SERVER_KEY y NUNCA debe importarse
// desde componentes cliente ("use client"). La variable no debe llevar prefijo NEXT_PUBLIC_.

export function djangoHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const key = process.env.ATTLAS_SERVER_KEY;
  if (!key) {
    throw new Error('ATTLAS_SERVER_KEY no está definida: es obligatoria para llamar a la API de Attlas.');
  }
  return { 'X-Server-Key': key, ...extra };
}
