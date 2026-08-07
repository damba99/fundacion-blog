/** Genera un extracto de texto plano a partir de HTML, truncado a maxLength. */
export function generateExcerpt(html: string, maxLength = 200): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
