/**
 * Theme tokens — SaveTheDate (id: `5-save-the-date`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color del widget.
 * Editá solo este archivo para ajustar colores.
 *
 * Estructura:
 *   - theme[variant][mode]  → tokens por variante × modo
 *   - baseClasses           → clases compartidas (layout, tipografía)
 *   - backgrounds           → enum de fondos alternativos (override via prop)
 *
 * Las clases resuelven a CSS variables del Design System V2.
 * Variables cambian por:
 *   - `data-bu="..."`  → paleta del BU
 *   - `data-mode="dark"` → versión oscura del BU
 *
 * Los SVG usan `currentColor` → heredan color del texto padre.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v5.7';

export interface VariantTheme {
  section: string;
  title: string;
  card: string;
  bajada: string;
}

export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v5.7 — Título + Cards + Bajada ────────────────────────
  'v5.7': {
    light: {
      // Light: sección gris claro neutro, cards en accent del BU.
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      card: 'bg-bu-accent text-bu-surface',
      bajada: 'text-bu-primary',
    },
    dark: {
      // Dark: sección toma el surface oscuro del BU, cards en accent
      // (que ya es más vivo en dark), bajada clara.
      section: 'bg-bu-surface',
      title: 'text-bu-accent',
      card: 'bg-bu-accent text-bu-surface',
      bajada: 'text-bu-surface',
    },
  },
};

/** Clases compartidas (layout, tipografía, transiciones). */
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