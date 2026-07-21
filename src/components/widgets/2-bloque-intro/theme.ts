/**
 * Theme tokens — BloqueIntro (id: `2-bloque-intro`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color que usa el widget.
 * Para ajustar un color del widget, edita solo este archivo.
 *
 * Las clases resuelven a CSS variables del Design System V2
 * (`bg-bu-primary` → `var(--bu-color-brand-primary)`, etc.).
 * Cambian automáticamente con el BU activo en runtime.
 *
 * Por cada variante visual del widget hay una entrada con keys
 * semánticas (`section`, `title`, `desc`) — agregá las que necesites.
 */
export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título. */
  title: string;
  /** Clases para el `<p>` de la descripción / bajada. */
  desc: string;
}

export const theme: Record<'v2.1' | 'v2.2', VariantTheme> = {
  // Centrado — fondo primary, textos claros sobre fondo oscuro.
  'v2.1': {
    section: 'bg-bu-primary text-bu-surface',
    title: '',
    desc: '',
  },
  // Dividido — fondo claro, título primary, descripción secondary.
  'v2.2': {
    section: 'bg-bu-surface text-bu-primary',
    title: 'text-bu-primary',
    desc: 'text-bu-secondary',
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