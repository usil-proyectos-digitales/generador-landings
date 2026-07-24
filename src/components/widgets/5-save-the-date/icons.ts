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
  // fa-calendar (FA v7.3.1): calendario con grid
  fecha: 'M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z',
  // fa-clock (FA v7.3.1): reloj con manecillas
  hora: 'M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z',
  // fa-users (FA v7.3.1): grupo de personas (presencial)
  presencial: 'M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z',
  // fa-wifi (FA v7.3.1): senal wireless (virtual)
  virtual: 'M320 160C229.1 160 146.8 196 86.3 254.6C73.6 266.9 53.3 266.6 41.1 253.9C28.9 241.2 29.1 220.9 41.8 208.7C113.7 138.9 211.9 96 320 96C428.1 96 526.3 138.9 598.3 208.7C611 221 611.3 241.3 599 253.9C586.7 266.5 566.4 266.9 553.8 254.6C493.2 196 410.9 160 320 160zM272 496C272 469.5 293.5 448 320 448C346.5 448 368 469.5 368 496C368 522.5 346.5 544 320 544C293.5 544 272 522.5 272 496zM200 390.2C188.3 403.5 168.1 404.7 154.8 393C141.5 381.3 140.3 361.1 152 347.8C193 301.4 253.1 272 320 272C386.9 272 447 301.4 488 347.8C499.7 361.1 498.4 381.3 485.2 393C472 404.7 451.7 403.4 440 390.2C410.6 356.9 367.8 336 320 336C272.2 336 229.4 356.9 200 390.2z',
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