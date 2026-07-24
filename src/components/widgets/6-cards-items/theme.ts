/**
 * Theme tokens — CardsItems (id: `6-cards-items`).
 * --------------------------------------------------------------
 * Centraliza todas las clases de color que usa el widget.
 * Para ajustar un color del widget, editá solo este archivo.
 *
 * ESTRUCTURA:
 *   - theme[variant][mode] → clases Tailwind por variante × modo
 *   - baseClasses          → clases compartidas (layout, tipografía)
 *
 * Modos:
 *   - light: roles "naturales" del BU
 *   - dark:  roles invertidos (sin cambiar las 5 variables del CSS)
 *
 * Colores neutrales del template legacy (no dependen de BU):
 *   bg-[#F0F0F0] → fondo neutro claro (section background light)
 *   bg-[#E5E5E5] → card alternada
 *   bg-[#DFDFDF]  → card body
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v6.3' | 'v6.6' | 'v6.8' | 'v6.10' | 'v6.11' | 'v6.12';

export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el título principal. */
  title: string;
  /** Clases para la caja de soporte del título (cuando existe). */
  titleBox: string;
  /** Clases para el texto dentro de la caja de soporte. */
  titleSupport: string;
  /** Clases para el párrafo de descripción. */
  desc: string;
  /** Clases para cada card. */
  card: string;
  /** Clases para el título de la card. */
  cardTitle: string;
  /** Clases para el texto de la card. */
  cardText: string;
  /** Clases para el CTA de la card. */
  cardCta: string;
  /** Clases para el ícono/imagen de la card. */
  cardImage: string;
  /** Clases para el badge de fecha (v6.12). */
  dateBadge: string;
  /** Clases para el texto de fecha (v6.12). */
  dateText: string;
  /** Clases para el separador/divisor. */
  divider: string;
  /** Clases para el contenedor de cards. */
  cardsContainer: string;
  /** Clases para el header/container de título (v6.8). */
  headerContainer: string;
  /** Clases para la barra decorativa (v6.8). */
  headerBar: string;
  /** Clases para el texto de ver más overlay (v6.8). */
  vermasText: string;
  /** Clases para el contenido de card (caja texto inferior, v6.8). */
  cardBoxText: string;
  /** Clases para categoría (v6.11). */
  cardCategory: string;
  /** Clases para precio texto (v6.11). */
  cardPriceText: string;
  /** Clases para precio monto (v6.11). */
  cardPriceAmount: string;
  /** Clases para el body de la card (v6.10). */
  cardBody: string;
}

export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  // ── v6.3 — Cards Centradas (título centrado + caja soporte + cards) ─
  'v6.3': {
    light: {
      section: 'bg-bu-surface text-bu-surface',
      title: 'text-bu-secondary',
      titleBox: 'bg-bu-accent',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: 'bg-bu-primary',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface border-bu-surface hover:bg-bu-surface hover:text-bu-primary hover:border-bu-primary',
      cardImage: '',
      dateBadge: '',
      dateText: 'text-bu-primary',
      divider: 'bg-bu-surface',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: 'text-bu-surface',
      cardPriceText: 'text-bu-surface',
      cardPriceAmount: 'text-bu-surface',
      cardBody: '',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: 'bg-bu-surface',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-surface',
      card: 'bg-bu-surface text-bu-text',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-text',
      cardCta: 'bg-bu-surface text-bu-primary border-bu-primary hover:bg-bu-primary hover:text-bu-surface hover:border-bu-surface',
      cardImage: '',
      dateBadge: '',
      dateText: 'text-bu-primary',
      divider: 'bg-bu-primary',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: 'text-bu-primary',
      cardPriceText: 'text-bu-text',
      cardPriceAmount: 'text-bu-text',
      cardBody: '',
    },
  },

  // ── v6.6 — Cards Icono Izq (horizontal: ícono circular + texto) ────
  'v6.6': {
    light: {
      section: 'bg-[#F0F0F0] text-bu-surface',
      title: 'text-bu-primary',
      titleBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: '',
      cardImage: 'bg-bu-primary',
      dateBadge: '',
      dateText: 'text-bu-primary',
      divider: 'bg-bu-surface',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: 'bg-bu-surface',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-surface',
      card: '',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: '',
      cardImage: 'bg-bu-surface text-bu-primary',
      dateBadge: '',
      dateText: 'text-bu-surface',
      divider: 'bg-bu-primary',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
    },
  },

  // ── v6.8 — Cards Verticales (imagen top + hover overlay) ─────────
  'v6.8': {
    light: {
      section: 'bg-[#F0F0F0] text-bu-surface',
      title: 'text-bu-primary',
      titleBox: '',
      titleSupport: '',
      desc: 'text-bu-primary',
      card: '',
      cardTitle: 'text-bu-primary',
      cardText: '',
      cardCta: 'text-bu-primary lg:hidden',
      cardImage: 'bg-bu-primary/80',
      dateBadge: '',
      dateText: '',
      divider: 'bg-bu-primary',
      cardsContainer: 'max-w-[270px] md:max-w-[560px] lg:max-w-[850px] xl:max-w-[1140px]',
      headerContainer: '',
      headerBar: 'bg-bu-primary',
      vermasText: 'text-bu-surface',
      cardBoxText: 'bg-bu-surface',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: '',
      titleSupport: '',
      desc: 'text-bu-surface',
      card: '',
      cardTitle: 'text-bu-surface',
      cardText: '',
      cardCta: 'text-bu-surface lg:hidden',
      cardImage: 'bg-bu-surface/80 text-bu-primary',
      dateBadge: '',
      dateText: '',
      divider: 'bg-bu-surface',
      cardsContainer: 'max-w-[270px] md:max-w-[560px] lg:max-w-[850px] xl:max-w-[1140px]',
      headerContainer: '',
      headerBar: 'bg-bu-surface',
      vermasText: 'text-bu-primary',
      cardBoxText: 'bg-bu-text text-bu-surface',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
    },
  },

  // ── v6.10 — Dos Cards Grandes ──────────────────────────────────────
  'v6.10': {
    light: {
      section: 'bg-[#F0F0F0] text-bu-surface',
      title: 'text-bu-primary',
      titleBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
      card: '',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-primary',
      cardCta: 'bg-bu-primary text-bu-surface border-bu-surface hover:bg-bu-surface hover:text-bu-primary hover:border-bu-primary',
      cardImage: '',
      dateBadge: '',
      dateText: '',
      divider: '',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: 'bg-[#DFDFDF]',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: 'bg-bu-surface',
      titleSupport: 'text-bu-primary',
      desc: 'text-bu-surface',
      card: '',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-surface text-bu-primary border-bu-primary hover:bg-bu-primary hover:text-bu-surface hover:border-bu-surface',
      cardImage: '',
      dateBadge: '',
      dateText: '',
      divider: '',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: 'bg-bu-text',
    },
  },

  // ── v6.11 — Cards Venta + CTA (categoría + producto + precio) ─────
  'v6.11': {
    light: {
      section: 'bg-[#F0F0F0] text-bu-surface',
      title: 'text-bu-primary',
      titleBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: '',
      card: 'bg-bu-primary',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface border-bu-surface hover:bg-bu-surface hover:text-bu-primary hover:border-bu-primary',
      cardImage: '',
      dateBadge: '',
      dateText: '',
      divider: 'bg-bu-surface',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: 'text-bu-surface',
      cardPriceText: 'text-bu-surface',
      cardPriceAmount: 'text-bu-surface',
      cardBody: '',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: 'bg-bu-surface',
      titleSupport: 'text-bu-primary',
      desc: '',
      card: 'bg-bu-surface text-bu-text',
      cardTitle: 'text-bu-primary',
      cardText: 'text-bu-text',
      cardCta: 'bg-bu-surface text-bu-primary border-bu-primary hover:bg-bu-primary hover:text-bu-surface hover:border-bu-surface',
      cardImage: '',
      dateBadge: '',
      dateText: '',
      divider: 'bg-bu-primary',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: 'text-bu-primary',
      cardPriceText: 'text-bu-text',
      cardPriceAmount: 'text-bu-text',
      cardBody: '',
    },
  },

  // ── v6.12 — Cards con Fecha (badge calendario) ────────────────────
  'v6.12': {
    light: {
      section: 'bg-[#F0F0F0] text-bu-surface',
      title: 'text-bu-primary',
      titleBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: '',
      card: 'bg-bu-primary',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-surface',
      cardCta: 'bg-bu-primary text-bu-surface border-bu-surface hover:bg-bu-surface hover:text-bu-primary hover:border-bu-primary',
      cardImage: '',
      dateBadge: 'bg-bu-surface',
      dateText: 'text-bu-primary',
      divider: 'bg-bu-surface',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
    },
    dark: {
      section: 'bg-bu-primary text-bu-surface',
      title: 'text-bu-surface',
      titleBox: 'bg-bu-surface',
      titleSupport: 'text-bu-primary',
      desc: '',
      card: 'bg-bu-surface text-bu-text',
      cardTitle: 'text-bu-surface',
      cardText: 'text-bu-text',
      cardCta: 'bg-bu-surface text-bu-primary border-bu-primary hover:bg-bu-primary hover:text-bu-surface hover:border-bu-surface',
      cardImage: '',
      dateBadge: 'bg-bu-text',
      dateText: 'text-bu-surface',
      divider: 'bg-bu-primary',
      cardsContainer: '',
      headerContainer: '',
      headerBar: '',
      vermasText: '',
      cardBoxText: '',
      cardCategory: '',
      cardPriceText: '',
      cardPriceAmount: '',
      cardBody: '',
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
};
