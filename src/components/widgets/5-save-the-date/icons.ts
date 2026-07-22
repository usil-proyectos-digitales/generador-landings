/**
 * Iconos SVG inline para SaveTheDate.
 * ------------------------------------
 * Paths de Font Awesome Free (MIT License).
 * - Usan `currentColor` para heredar el color del texto padre → cambian
 *   automáticamente con el BU sin duplicar archivos.
 * - Inline (no son archivos .svg servidos) → WordPress nunca los toca.
 *
 * Shape: 512x512 viewBox (Font Awesome estándar), fill="currentColor".
 *
 * EXPORTAMOS DOS FORMATES:
 *   - Funciones `Icon*` que devuelven strings SVG completos.
 *     → Usadas por el widget Astro server-side (set:html).
 *   - Objeto `ICON_PATHS` con solo los `<path d="..."/>`.
 *     → Usado por el visor (renderCards en cliente) para mantener
 *       consistencia sin duplicar paths.
 */
export const ICON_SLUGS = ['fecha', 'hora', 'modalidad'] as const;
export type IconSlug = typeof ICON_SLUGS[number];

interface IconProps {
  class?: string;
  size?: number | string;
}

const baseProps = (p: IconProps) => ({
  class: p.class,
  width: p.size ?? 80,
  height: p.size ?? 80,
  viewBox: '0 0 512 512',
  fill: 'currentColor',
  'aria-hidden': 'true',
});

/**
 * Solo los paths `<path d="..."/>` de Font Awesome Free.
 * Reutilizables desde el cliente (visor) sin duplicar lógica.
 * Fuentes verificadas en https://fontawesome.com/icons (Free, MIT).
 */
export const ICON_PATHS: Record<IconSlug, string> = {
  // fa-calendar-days — calendario con grid
  fecha: 'M96 32l0 32L480 32l0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM480 96L32 96 32 480c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32l0-384zM256 272c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm96 0c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm96 0c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zM224 368c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm96 0c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm96 0c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32z',
  // fa-clock — reloj con manecillas
  hora: 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z',
  // fa-mobile-screen — dispositivo móvil
  modalidad: 'M160 0c-35.3 0-64 28.7-64 64L96 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L160 0zM192 64l128 0 0 16-128 0 0-16zm128 384l-128 0 0-320 128 0 0 320z',
};

/** Helpers server-side: devuelve un SVG completo listo para set:html. */
function wrapPath(path: string, props: IconProps): string {
  const a = baseProps(props);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="${a.viewBox}" fill="${a.fill}" aria-hidden="${a['aria-hidden']}"${a.class ? ` class="${a.class}"` : ''}>
  <path d="${path}"/>
</svg>`;
}

/**
 * Helper genérico: wrappea cualquier path en un SVG. Útil desde el
 * cliente (visor) que tiene los paths como `ICON_PATHS` y no las
 * funciones Icon*.
 */
export function wrapIconSvg(path: string, props: IconProps = {}): string {
  return wrapPath(path, props);
}

export function IconFecha(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.fecha, props);
}

export function IconHora(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.hora, props);
}

export function IconModalidad(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.modalidad, props);
}

/** Mapa de factories para usar con `set:html` desde el .astro. */
export const ICONS: Record<IconSlug, (props?: IconProps) => string> = {
  fecha: IconFecha,
  hora: IconHora,
  modalidad: IconModalidad,
};