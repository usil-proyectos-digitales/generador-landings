/**
 * Theme tokens — BloquePonentesTestimonios (id: `7-bloque-ponentes-testimonios`).
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
 * Variantes:
 *   - v7.2 — Título + párrafo + 1 card grande de ponente
 *   - v7.4 — Título + grid de cards cuadradas con bandera (carrusel si >4)
 *   - v7.5 — Título izq + intro + grid de cards con foto grande y hover (carrusel si >4)
 *
 * Estructura:
 *   - theme[variant][mode]  → clases Tailwind por variante × modo
 *   - baseClasses           → clases compartidas (layout, tipografía)
 *
 * Cambian en runtime cuando Astro re-renderiza con el prop `mode`.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v7.2' | 'v7.4' | 'v7.5';

export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título principal. */
  title: string;
  /** Clases para el span del título de soporte (caja resaltada). */
  titleSupport: string;
  /** Clases para el contenedor del título de soporte. */
  titleSupportBox: string;
  /** Clases para el `<p>` de la descripción / bajada. */
  desc: string;
  /** Clases para el fondo de la card / grupo de ponente. */
  card: string;
  /** Clases para el nombre/título dentro de la card de ponente. */
  cardTitle: string;
  /** Clases para el texto secundario (cargo, descripción) de la card. */
  cardText: string;
  /** Clases para el overlay de hover en v7.5. */
  overlay: string;
  /** Clases para bordes/pastillas (foto, píldora de nombre) en v7.4. */
  bar: string;
}

/**
 * Tokens por variante × modo.
 *
 * - v7.2 / v7.4 `light`: fondo gris neutro (`#F0F0F0`), textos/cards en primary.
 * - v7.2 `dark`: se invierten roles — fondo primary, cards/textos en neutral.
 * - v7.5 `light`: fondo primary del BU (legacy `bg-brand-dark`).
 * - v7.5 `dark`: fondo secondary del BU, overlay en secondary.
 */
export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v7.2 — Título + párrafo + 1 card grande de ponente ──────
  'v7.2': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: 'bg-bu-primary',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      overlay: '',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: 'bg-bu-neutral',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      overlay: '',
      bar: '',
    },
  },
  // ── v7.4 — Grid de cards cuadradas con bandera ───────────────
  'v7.4': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      overlay: '',
      bar: 'border-bu-primary',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: '',
      cardTitle: 'text-bu-neutral',
      cardText: 'text-bu-neutral',
      overlay: '',
      bar: 'border-bu-neutral',
    },
  },
  // ── v7.5 — Título izq + cards con foto grande y hover ────────
  'v7.5': {
    light: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-neutral',
      overlay: 'bg-bu-primary/80',
      bar: '',
    },
    dark: {
      section: 'bg-bu-secondary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-secondary',
      desc: 'text-bu-neutral',
      card: '',
      cardTitle: 'text-bu-neutral',
      cardText: 'text-bu-neutral',
      overlay: 'bg-bu-secondary/80',
      bar: '',
    },
  },
};

/**
 * Clases base compartidas entre todas las variantes.
 * Tipografía, layout, transiciones — viven acá.
 */
export const baseClasses = {
  section: 'relative py-16 w-full transition-opacity duration-300 md:py-24 font-montserrat',
  container: 'container relative z-10 px-4 mx-auto md:px-6',

  // Tipografía de títulos (Anton, alineado al sistema V1)
  titleFont: 'font-anton text-anton-block-title-mobile md:text-anton-block-title',
  titleSupportFont: 'font-anton text-anton-block-title-mobile md:text-anton-block-title',
  bodyFont: 'font-montserrat',

  // Card helpers
  cardTitleFont: 'font-montserrat text-mont-card-title-mobile md:text-mont-card-title',
  cardTextFont: 'font-montserrat text-mont-card-content-mobile md:text-mont-card-content',
  cardItemTextFont: 'font-montserrat text-mont-item-content-mobile md:text-mont-item-content',

  // v7.2 — card grande de ponente único
  cardBaseV72:
    'hk-card-ponente rounded-[1rem] md:rounded-[3rem] py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-8 w-11/12 mx-auto text-center md:text-left',

  // v7.4 — card cuadrada individual dentro del grid
  cardBaseV74: 'hk-card-7-4 pt-4 relative w-[246px] flex flex-col items-start',

  // v7.5 — card grande con foto + overlay
  cardBaseV75: 'overflow-hidden relative w-full hk-box-ponente group',
};
