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
  width: p.size ?? 80,
  height: p.size ?? 80,
  viewBox: '0 0 640 640',
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
  // fa-users (FA v7.3.1): grupo de personas (presencial)
  presencial: 'M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z',
  // fa-wifi: senal wireless (virtual)
  virtual: 'M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-16C7.31 2 2.93 3.96.04 7c-.45.48-.45 1.18 0 1.66l1.7 1.84c.43.47 1.13.47 1.56 0C5.61 8.16 8.66 6.5 12 6.5s6.39 1.66 8.7 4c.43.47 1.13.47 1.56 0l1.7-1.84c.45-.48.45-1.18 0-1.66C21.07 3.96 16.69 2 12 2zm0 5c-2.7 0-5.21.94-7.21 2.5-.45.36-.45 1.02 0 1.38l1.71 1.84c.41.45 1.08.45 1.49 0C9.18 11.61 10.55 11 12 11s2.82.61 4.01 1.72c.41.45 1.08.45 1.49 0l1.71-1.84c.45-.36.45-1.02 0-1.38C17.21 7.94 14.7 7 12 7z',
  // fa-laptop (FA v7.3.1): dispositivo portatil (hibrida)
  hibrida: 'M128 96C92.7 96 64 124.7 64 160L64 400L128 400L128 160L512 160L512 400L576 400L576 160C576 124.7 547.3 96 512 96L128 96zM19.2 448C8.6 448 0 456.6 0 467.2C0 509.6 34.4 544 76.8 544L563.2 544C605.6 544 640 509.6 640 467.2C640 456.6 631.4 448 620.8 448L19.2 448z',
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