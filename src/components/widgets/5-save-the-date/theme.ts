/**
 * Theme tokens — SaveTheDate (id: `5-save-the-date`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color del widget.
 * Editá solo este archivo para ajustar colores.
 *
 * ESTRATEGIA DE COLORES:
 *   - Solo existen 5 variables CSS por BU en `global.css`:
 *       --bu-color-brand-primary / -secondary / -accent-primary
 *       --bu-color-surface-light / -neutral
 *   - Esas 5 variables NO cambian con `data-mode`. La elección de cuál
 *     de los 5 roles usar (primary, secondary, accent, surface, neutral)
 *     depende del MODO y se hace ACÁ, vía clases Tailwind.
 *   - Resultado: este archivo controla 100% cómo se ve el widget
 *     en light/dark. El CSS nunca necesita overrides por modo.
 *
 * Estructura:
 *   - theme[variant][mode]  → clases Tailwind por variante × modo
 *   - baseClasses           → clases compartidas (layout, tipografía)
 *
 * Cambian en runtime cuando Astro re-renderiza con el prop `mode`.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v5.7';

export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título. */
  title: string;
  /** Clases para las cards. */
  card: string;
  /** Clases para el texto de bajada. */
  bajada: string;
}

/**
 * Tokens por variante × modo. La elección de qué clase Tailwind usar
 * (bg-bu-primary vs bg-bu-surface, etc.) se decide ACÁ.
 *
 * - `light`: roles "naturales" del BU (primary=CTA, surface=fondo claro).
 * - `dark`:  los roles se invierten para que el widget se vea oscuro
 *            sin cambiar los 5 tokens del CSS.
 */
export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v5.7 — Título + Cards + Bajada ────────────────────────
  'v5.7': {
    light: {
      // Light: sección primary (azul del BU), texto en surface.
      section: 'bg-bu-surface text-bu-primary',
      title: '',
      card: 'bg-bu-accent text-bu-surface',
      bajada: 'text-bu-primary',
    },
    dark: {
      // Dark: invertimos — fondo surface oscuro del BU + texto claro.
      section: 'bg-bu-primary text-bu-neutral',
      title: 'text-bu-neutral',
      card: 'bg-bu-accent text-bu-surface',
      bajada: 'text-bu-neutral',
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