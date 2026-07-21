/**
 * Theme tokens — SaveTheDate (id: `5-save-the-date`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color del widget.
 * Editá solo este archivo para ajustar colores.
 *
 * Las clases resuelven a CSS variables del Design System V2
 * (cambian automáticamente con el BU activo en runtime).
 * Los SVG usan `currentColor` → heredan color del texto padre.
 */
export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título principal. */
  title: string;
  /** Clases para cada `<div class="hk-std-card">`. */
  card: string;
  /** Clases para el `<p>` de bajada (lugar / dirección). */
  bajada: string;
}

export const theme: Record<'v5.7', VariantTheme> = {
  // Título + Cards + Bajada — fondo gris claro, cards en accent del BU.
  'v5.7': {
    section: 'bg-[#F0F0F0]',
    title: 'text-bu-primary',
    card: 'bg-bu-accent text-bu-surface',
    bajada: 'text-bu-primary',
  },
};

/**
 * Clases base compartidas (layout, tipografía, transiciones).
 */
export const baseClasses = {
  section: 'py-16 w-full transition-opacity duration-300 md:py-24 font-montserrat',
  container: 'container relative z-10 px-4 mx-auto md:px-6',
  title:
    'mb-12 text-4xl font-bold hk-title ' +
    'text-anton-block-title-mobile md:text-anton-block-title',
  cardLabel:
    'hk-card-label font-montserrat ' +
    'text-mont-card-content-mobile md:text-mont-card-content font-normal',
  cardValue:
    'hk-card-value font-montserrat ' +
    'text-mont-card-title-mobile md:text-mont-card-title font-extrabold',
  cardShell:
    'hk-std-card px-8 py-6 rounded-lg flex items-center justify-center gap-4 ' +
    'lg:w-[300px] lg:min-w-[300px] md:w-[300px] md:min-w-[300px] ' +
    'w-[280px] min-w-[280px] flex-none',
  bajada:
    'text-base font-extrabold hk-std-texto-bajada hk-desc md:text-2xl',
};

/** Fondos alternativos para la sección (override via prop `background`). */
export const backgrounds = {
  gray: 'bg-[#F0F0F0]',
  white: 'bg-bu-surface',
  transparent: 'bg-transparent',
} as const;