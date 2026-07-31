/**
 * Theme tokens — CardsItems (id: `6-cards-items`).
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
 *   - v6.3  — Título centrado + 3 cards verticales con CTA
 *   - v6.6  — Título izq + 6 cards horizontales (icono + texto)
 *   - v6.8  — Título izq + cards verticales con imagen (carrusel si >4)
 *   - v6.10 — Título izq + 2 cards grandes con imagen y CTA
 *   - v6.11 — Título centrado + 3 cards de producto (categoría/título/precio/CTA)
 *   - v6.12 — Título centrado + 3 cards con badge de fecha
 *
 * Estructura:
 *   - theme[variant][mode]  → clases Tailwind por variante × modo
 *   - baseClasses           → clases compartidas (layout, tipografía)
 *
 * Cambian en runtime cuando Astro re-renderiza con el prop `mode`.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v6.3' | 'v6.6' | 'v6.8' | 'v6.10' | 'v6.11' | 'v6.12';

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
  /** Clases para cada card. */
  card: string;
  /** Clases para el contenedor del icono redondo en v6.6. */
  cardIconBox: string;
  /** Clases para el título de la card. */
  cardTitle: string;
  /** Clases para el texto de la card. */
  cardText: string;
  /** Clases para el contenedor del CTA (botón). */
  cardCta: string;
  /** Clases para el texto del badge de fecha en v6.12. */
  dateBadgeText: string;
  /** Clases para el overlay oscuro sobre la imagen en v6.8. */
  imageOverlay: string;
  /** Clases para la barra separadora (v6.8 header bar, v6.12 mini bar). */
  bar: string;
}

/**
 * Tokens por variante × modo.
 *
 * - `light`: fondo gris neutro (`#F0F0F0`) con cards en primary del BU.
 * - `dark`:  se invierten roles — fondo primary del BU, cards en surface,
 *            textos sobre primary usan neutral.
 */
export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v6.3 — Título centrado + cards verticales ──────────────
  'v6.3': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: 'bg-bu-primary',
      cardIconBox: 'bg-bu-primary',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface hover:bg-bu-surface hover:text-bu-primary border border-bu-neutral',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-primary/80',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: 'bg-bu-neutral',
      cardIconBox: 'bg-bu-neutral',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: 'bg-bu-neutral text-bu-primary hover:bg-bu-surface hover:text-bu-primary border border-bu-primary',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-neutral/80',
      bar: '',
    },
  },
  // ── v6.6 — Título izq + cards horizontales (icono + texto) ──
  'v6.6': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: '',
      cardIconBox: 'bg-bu-primary',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: '',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: '',
      cardIconBox: 'bg-bu-neutral',
      cardTitle: 'text-bu-neutral',
      cardText: 'text-bu-neutral',
      cardCta: '',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
  },
  // ── v6.8 — Título izq + cards verticales con imagen ─────────
  'v6.8': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: '',
      titleSupport: '',
      desc: 'text-bu-primary',
      card: 'bg-bu-surface',
      cardIconBox: '',
      cardTitle: 'text-bu-primary',
      cardText: '',
      cardCta: '',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-primary/80',
      bar: 'bg-bu-primary',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: '',
      titleSupport: '',
      desc: 'text-bu-neutral',
      card: 'bg-bu-neutral',
      cardIconBox: '',
      cardTitle: 'text-bu-primary',
      cardText: '',
      cardCta: '',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-neutral/80',
      bar: 'bg-bu-neutral',
    },
  },
  // ── v6.10 — Título izq + 2 cards grandes ────────────────────
  'v6.10': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: '',
      cardIconBox: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: 'bg-bu-primary text-bu-surface hover:bg-bu-surface hover:text-bu-primary border border-bu-primary',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-neutral',
      card: '',
      cardIconBox: '',
      cardTitle: 'text-bu-neutral',
      cardText: 'text-bu-neutral',
      cardCta: 'bg-bu-neutral text-bu-primary hover:bg-bu-surface hover:text-bu-neutral border border-bu-neutral',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
  },
  // ── v6.11 — Título centrado + cards producto ────────────────
  'v6.11': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: '',
      card: 'bg-bu-primary',
      cardIconBox: '',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface hover:bg-bu-surface hover:text-bu-primary border border-bu-neutral',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: '',
      card: 'bg-bu-neutral',
      cardIconBox: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: 'bg-bu-neutral text-bu-primary hover:bg-bu-surface hover:text-bu-neutral border border-bu-neutral',
      dateBadgeText: '',
      imageOverlay: '',
      bar: '',
    },
  },
  // ── v6.12 — Título centrado + cards con badge de fecha ──────
  'v6.12': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: '',
      card: 'bg-bu-primary',
      cardIconBox: '',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface hover:bg-bu-surface hover:text-bu-primary border border-bu-neutral',
      dateBadgeText: 'text-bu-primary',
      imageOverlay: '',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-neutral',
      titleSupport: 'text-bu-primary',
      desc: '',
      card: 'bg-bu-neutral',
      cardIconBox: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: 'bg-bu-neutral text-bu-primary hover:bg-bu-surface hover:text-bu-neutral border border-bu-neutral',
      dateBadgeText: 'text-bu-primary',
      imageOverlay: '',
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
  cardCtaFont: 'font-montserrat text-mont-form-cta',
  cardCtaFontAntonio: 'font-antonio text-antonio-card-cta-mobile md:text-antonio-card-cta',
  cardTitleFontAnton: 'font-anton text-anton-card-title-mobile md:text-anton-card-title',

  // Layout helpers
  cardBase: 'flex flex-col justify-start items-start px-11 py-12 space-y-4 rounded-[2rem] min-h-[330px] w-full',
  cardBaseMd: 'md:w-[calc(50%-2rem)]',
  cardBaseLg3: 'lg:w-[30%]',
  cardBaseLg2: 'lg:w-[calc(50%-2rem)]',

  // v6.11 (producto) usa otro padding/max-width
  cardBaseV611: 'flex flex-col justify-between items-start px-6 py-12 rounded-[2rem] min-h-[400px] w-full max-w-[400px] lg:max-w-none',
  cardBaseV611Lg: 'lg:w-[30%]',

  // v6.12 (con fecha) usa otro padding/max-width
  cardBaseV612: 'flex flex-col justify-start items-start px-10 py-12 rounded-[2rem] w-full max-w-[350px] lg:max-w-none space-y-4',
  cardBaseV612Lg: 'lg:w-[30%]',

  // v6.10 (2 cards grandes) usa otro ancho
  cardBaseV610: 'hk-card md:w-[calc((100%-2rem)/2)] w-full group',
  cardBoxV610: 'p-10 bg-[#DFDFDF] rounded-b-[2rem] hk-box-texto space-y-4',
};