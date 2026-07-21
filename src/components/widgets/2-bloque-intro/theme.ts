/**
 * Theme tokens — BloqueIntro (id: `2-bloque-intro`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color que usa el widget.
 * Para ajustar un color del widget, editá solo este archivo.
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
export type Variant = 'v2.1' | 'v2.2';

export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título. */
  title: string;
  /** Clases para el `<p>` de la descripción / bajada. */
  desc: string;
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
  // ── v2.1 — Centrado ──────────────────────────────────────
  'v2.1': {
    light: {
      // Light: fondo primary (azul del BU), texto surface claro.
      section: 'bg-bu-primary text-bu-surface',
      title: '',
      desc: '',
    },
    dark: {
      // Dark: invertimos — fondo surface oscuro del BU + texto claro.
      section: 'bg-bu-surface text-bu-text',
      title: 'text-bu-primary',
      desc: 'text-bu-secondary',
    },
  },
  // ── v2.2 — Dividido ───────────────────────────────────────
  'v2.2': {
    light: {
      // Light: fondo surface claro, título primary, descripción secondary.
      section: 'bg-bu-surface',
      title: 'text-bu-primary',
      desc: 'text-bu-secondary',
    },
    dark: {
      // Dark: se invierten los roles — el section pasa a primary
      // (oscuro del BU) y los textos pasan a text (claro del BU).
      // OJO: la utility es `text-bu-text`, no `text-bu-neutral` —
      // aunque la CSS variable se llama --bu-color-neutral, Tailwind
      // genera utilities con el nombre definido en @theme → text-bu-text.
      section: 'bg-bu-primary text-bu-text',
      title: 'text-bu-text',
      desc: 'text-bu-text',
    },
  },
};

/**
 * Clases base compartidas entre todas las variantes.
 * Tipografía, layout, transiciones — viven acá.
 */
export const baseClasses = {
  section: 'relative py-16 w-full transition-opacity duration-300 md:py-24',
  container: 'container relative z-10 px-4 mx-auto md:px-6',
};