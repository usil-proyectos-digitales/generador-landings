/**
 * Theme tokens — BloqueIntro (id: `2-bloque-intro`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color que usa el widget.
 * Para ajustar un color del widget, edita solo este archivo.
 *
 * Estructura:
 *   - theme[variant][mode]  → tokens por variante visual × modo claro/oscuro
 *   - baseClasses           → clases compartidas (layout, tipografía)
 *
 * Las clases resuelven a CSS variables del Design System V2
 * (`bg-bu-primary` → `var(--bu-color-brand-primary)`, etc.).
 * Las variables cambian en función de:
 *   - `data-bu="..."` en <html> o wrapper → cambia la paleta del BU
 *   - `data-mode="dark"` en el wrapper → activa la versión oscura del BU
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
 * Tokens por variante × modo.
 * - `light`: versión clara del BU activo.
 * - `dark`:  versión oscura del BU activo (mismos roles de color, valores invertidos).
 */
export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v2.1 — Centrado ──────────────────────────────────────
  'v2.1': {
    light: {
      // Light: fondo primary, texto surface claro.
      section: 'bg-bu-primary text-bu-surface',
      title: '',
      desc: '',
    },
    dark: {
      // Dark: mantenemos el primary como acento fuerte pero el fondo
      // pasa a un surface oscuro del BU; textos claros.
      section: 'bg-bu-surface text-bu-primary',
      title: 'text-bu-primary',
      desc: 'text-bu-secondary',
    },
  },
  // ── v2.2 — Dividido ───────────────────────────────────────
  'v2.2': {
    light: {
      // Light: fondo surface claro, título primary, descripción secondary.
      section: 'bg-bu-surface text-bu-primary',
      title: 'text-bu-primary',
      desc: 'text-bu-secondary',
    },
    dark: {
      // Dark: se invierten los roles — el section se vuelve primary
      // (oscuro del BU) y los textos pasan a surface.
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      desc: 'text-bu-accent',
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