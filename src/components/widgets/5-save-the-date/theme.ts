/**
 * Theme tokens — SaveTheDate (id: `5-save-the-date`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color del widget.
 * Editá solo este archivo para ajustar colores.
 *
 * ESTRATEGIA DE COLORES:
 *   - Solo existen 5 variables CSS por BU en `global.css`. Esas
 *     variables NO cambian con `data-mode`. La elección de cuál de
 *     los 5 roles usar (primary, secondary, accent, surface, neutral)
 *     depende del MODO y se hace ACÁ, vía clases Tailwind.
 *   - El fondo gris claro (`#F0F0F0`) de la sección en modo light
 *     es independiente de los tokens del BU — está hardcoded porque
 *     en light no queremos teñir el section con la paleta del BU.
 *     En dark sí queremos teñirlo → usamos `bg-bu-surface`.
 *
 * Estructura:
 *   - theme[variant][mode] → clases Tailwind por variante × modo
 *   - baseClasses          → clases compartidas (layout, tipografía)
 *   - backgrounds          → enum de fondos alternativos (override via prop)
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
      // Light: sección gris claro neutro, título primary, cards en accent.
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      card: 'bg-bu-accent text-bu-surface',
      bajada: 'text-bu-primary',
    },
    dark: {
      // Dark: la sección toma el surface oscuro del BU (teñido por el BU),
      // el título pasa a accent (resalta sobre el surface oscuro),
      // las cards mantienen accent (contraste alto), la bajada va a surface.
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