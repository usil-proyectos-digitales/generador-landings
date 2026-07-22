/**
 * Iconos SVG inline para SaveTheDate.
 * ------------------------------------
 * Paths de Font Awesome Free v6.5.x (MIT License).
 * - Usan `currentColor` para heredar el color del texto padre y cambian
 *   automaticamente con el BU sin duplicar archivos.
 * - Inline (no son archivos .svg servidos): WordPress nunca los toca.
 *
 * Shape: 24x24 viewBox, fill="currentColor".
 * El SVG se renderiza con width/height 48px (configurable via prop `size`).
 *
 * EXPORTAMOS DOS FORMATES:
 *   - Funciones `Icon*` que devuelven strings SVG completos.
 *     Usadas por el widget Astro server-side (set:html).
 *   - Objeto `ICON_PATHS` con solo los `<path d="..."/>`.
 *     Usado por el visor (renderCards en cliente) para mantener
 *     consistencia sin duplicar paths.
 *
 * CATÁLOGO DE ICONOS (mapeo ACF):
 *   - 'fecha'      → fa-calendar       → bloque con grid de días
 *   - 'hora'       → fa-clock          → reloj con manecillas
 *   - 'presencial' → fa-users         → grupo de personas reunidas
 *   - 'virtual'    → fa-wifi          → señal wireless
 *   - 'hibrida'    → fa-laptop         → dispositivo móvil/conexión
 *
 * El campo ACF "modalidad" es un select con 3 opciones (presencial |
 * virtual | hibrida). El editor elige la lógica; el componente mapea
 * el valor al icono correcto automáticamente.
 */
export const ICON_SLUGS = [
  'fecha',
  'hora',
  'presencial',
  'virtual',
  'hibrida',
] as const;
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
 * ViewBox unificado: 24x24.
 */
export const ICON_PATHS: Record<IconSlug, string> = {
  // fa-calendar: mes con grid de numeros
  fecha: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-4-4h-2V8h2v2zm4 0h-2V8h2v2z',
  // fa-clock: reloj con manecillas
  hora: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  // fa-users: grupo de personas (presencial)
  presencial: 'M9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5zm9.5-.5c0-.83-.67-1.5-1.5-1.5h-1c-.28 0-.5.22-.5.5v3.5c0 .83.67 1.5 1.5 1.5H19c.83 0 1.5-.67 1.5-1.5v-3.5c0-.28-.22-.5-.5-.5h-1.5zM22 19h-3v-1.5c0-1.1-.9-2-2-2h-1v-1.5c0-1.1.9-2 2-2H20c1.66 0 3 1.34 3 3v4h-1z',
  // fa-wifi: senal wireless (virtual)
  virtual: 'M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-16C7.31 2 2.93 3.96.04 7c-.45.48-.45 1.18 0 1.66l1.7 1.84c.43.47 1.13.47 1.56 0C5.61 8.16 8.66 6.5 12 6.5s6.39 1.66 8.7 4c.43.47 1.13.47 1.56 0l1.7-1.84c.45-.48.45-1.18 0-1.66C21.07 3.96 16.69 2 12 2zm0 5c-2.7 0-5.21.94-7.21 2.5-.45.36-.45 1.02 0 1.38l1.71 1.84c.41.45 1.08.45 1.49 0C9.18 11.61 10.55 11 12 11s2.82.61 4.01 1.72c.41.45 1.08.45 1.49 0l1.71-1.84c.45-.36.45-1.02 0-1.38C17.21 7.94 14.7 7 12 7z',
  // fa-laptop: dispositivo portatil (hibrida)
  hibrida: 'M20 18h-2V8H6v10H4c-1.1 0-2 .9-2 2s.9 2 2 2h16c1.1 0 2-.9 2-2s-.9-2-2-2zM8 10h8v8H8v-8zm12 0c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v6h12v-6h2z',
};

/** Helper: wrappea cualquier path en un SVG. */
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

export function IconPresencial(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.presencial, props);
}

export function IconVirtual(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.virtual, props);
}

export function IconHibrida(props: IconProps = {}): string {
  return wrapPath(ICON_PATHS.hibrida, props);
}

/** Mapa de factories para usar con `set:html` desde el .astro. */
export const ICONS: Record<IconSlug, (props?: IconProps) => string> = {
  fecha: IconFecha,
  hora: IconHora,
  presencial: IconPresencial,
  virtual: IconVirtual,
  hibrida: IconHibrida,
};