/**
 * Iconos SVG inline para SaveTheDate.
 * ------------------------------------
 * - Usan `currentColor` para heredar el color del texto padre → cambian
 *   automáticamente con el BU sin duplicar archivos.
 * - Inline (no son archivos .svg servidos) → WordPress nunca los toca,
 *   evitando el problema conocido de sanitización de SVG en WP.
 * - Stroke/fill coherentes con el visual: blanco translúcido sobre fondo
 *   de BU, simulando el look de la referencia (icono + texto en card).
 *
 * Shape: 64x64 viewBox, stroke 2, fill none, currentColor.
 */
export const ICON_SLUGS = ['fecha', 'hora', 'modalidad'] as const;
export type IconSlug = typeof ICON_SLUGS[number];

interface IconProps {
  class?: string;
  size?: number | string;
  strokeWidth?: number;
}

const baseProps = (p: IconProps) => ({
  class: p.class,
  width: p.size ?? 48,
  height: p.size ?? 48,
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': p.strokeWidth ?? 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': 'true',
});

export function IconFecha(props: IconProps = {}): string {
  // Calendario: rectángulo con grilla + pestaña superior
  const a = baseProps(props);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="${a.viewBox}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a['stroke-width']}" stroke-linecap="${a['stroke-linecap']}" stroke-linejoin="${a['stroke-linejoin']}" aria-hidden="${a['aria-hidden']}"${a.class ? ` class="${a.class}"` : ''}>
  <rect x="10" y="14" width="44" height="40" rx="3"/>
  <line x1="10" y1="24" x2="54" y2="24"/>
  <line x1="22" y1="8" x2="22" y2="18"/>
  <line x1="42" y1="8" x2="42" y2="18"/>
  <line x1="20" y1="32" x2="20" y2="32.01"/>
  <line x1="32" y1="32" x2="32" y2="32.01"/>
  <line x1="44" y1="32" x2="44" y2="32.01"/>
  <line x1="20" y1="42" x2="20" y2="42.01"/>
  <line x1="32" y1="42" x2="32" y2="42.01"/>
  <line x1="44" y1="42" x2="44" y2="42.01"/>
</svg>`;
}

export function IconHora(props: IconProps = {}): string {
  // Reloj: círculo + manecillas (10:10 aprox)
  const a = baseProps(props);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="${a.viewBox}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a['stroke-width']}" stroke-linecap="${a['stroke-linecap']}" stroke-linejoin="${a['stroke-linejoin']}" aria-hidden="${a['aria-hidden']}"${a.class ? ` class="${a.class}"` : ''}>
  <circle cx="32" cy="32" r="22"/>
  <polyline points="32,18 32,32 42,38"/>
</svg>`;
}

export function IconModalidad(props: IconProps = {}): string {
  // Dispositivo móvil (representa presencial/virtual/híbrida)
  const a = baseProps(props);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="${a.viewBox}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a['stroke-width']}" stroke-linecap="${a['stroke-linecap']}" stroke-linejoin="${a['stroke-linejoin']}" aria-hidden="${a['aria-hidden']}"${a.class ? ` class="${a.class}"` : ''}>
  <rect x="20" y="8" width="24" height="48" rx="3"/>
  <line x1="28" y1="48" x2="36" y2="48"/>
  <line x1="20" y1="20" x2="44" y2="20"/>
  <line x1="20" y1="42" x2="44" y2="42"/>
  <circle cx="27" cy="30" r="0.8" fill="${a.stroke}"/>
  <circle cx="32" cy="30" r="0.8" fill="${a.stroke}"/>
  <circle cx="37" cy="30" r="0.8" fill="${a.stroke}"/>
</svg>`;
}

export const ICONS: Record<IconSlug, (props?: IconProps) => string> = {
  fecha: IconFecha,
  hora: IconHora,
  modalidad: IconModalidad,
};