/**
 * Resuelve la IP real del cliente detrás del proxy del hosting administrado.
 * Prioridad: x-forwarded-for (primer valor) -> x-real-ip -> "unknown".
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
