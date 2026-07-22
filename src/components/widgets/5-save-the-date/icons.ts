/**
 * Iconos SVG inline para SaveTheDate.
 * ------------------------------------
 * Paths de Font Awesome Free v6.5.x (MIT License).
 * - Usan `currentColor` para heredar el color del texto padre y cambian
 *   automaticamente con el BU sin duplicar archivos.
 * - Inline (no son archivos .svg servidos): WordPress nunca los toca.
 *
 * Shape: 24x24 viewBox (estandar Heroicons-style), fill="currentColor".
 * El SVG se renderiza con width/height 48px (configurable via prop `size`).
 *
 * EXPORTAMOS DOS FORMATES:
 *   - Funciones `Icon*` que devuelven strings SVG completos.
 *     Usadas por el widget Astro server-side (set:html).
 *   - Objeto `ICON_PATHS` con solo los `<path d="..."/>`.
 *     Usado por el visor (renderCards en cliente) para mantener
 *     consistencia sin duplicar paths.
 */
export const ICON_SLUGS = ['fecha', 'hora', 'modalidad'] as const;
export type IconSlug = typeof ICON_SLUGS[number];

interface IconProps {
  class?: string;
  size?: number | string;
}

const baseProps = (p: IconProps) => ({
  class: p.class,
  width: p.size ?? 48,
  height: p.size ?? 48,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true',
});

/**
 * Paths `<path d="..."/>` de Font Awesome Free v6.5.x.
 * Reutilizables desde el cliente (visor) que tiene los paths como
 * `ICON_PATHS` y no las funciones Icon*.
 * Fuentes verificadas en https://fontawesome.com/icons (Free, MIT).
 *
 * ViewBox unificado: 24x24 (todos encajan a width=48 sin padding raro).
 * fill: currentColor (hereda color del texto padre).
 */
export const ICON_PATHS: Record<IconSlug, string> = {
  // fa-calendar: mes con grid de numeros (lineas horizontales + verticales)
  fecha: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-4-4h-2V8h2v2zm4 0h-2V8h2v2z',
  // fa-clock: reloj circular con manecillas (incluye el aro redondo)
  hora: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  // fa-mobile-screen: dispositivo movil con pantalla y boton home
  modalidad: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
};

/** Helper genérico: wrappea cualquier path en un SVG. Útil desde el
 * cliente (visor) que tiene los paths como `ICON_PATHS`. */
function wrapPath(path: string, props: IconProps): string {
  const a = baseProps(props);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a.width}" height="${a.height}" viewBox="${a.viewBox}" fill="${a.fill}" aria-hidden="${a['aria-hidden']}"${a.class ? ` class="${a.class}"` : ''}>
  <path d="${path}"/>
</svg>`;
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