/**
 * Theme tokens — CardsItems, COPIA AISLADA para la prueba `/design-md-preview`.
 * --------------------------------------------------------------
 * Copia de `src/components/widgets/6-cards-items/theme.ts`. Único cambio:
 * las clases de fuente fijas (`font-anton`/`font-montserrat` + tamaños
 * `text-anton-*`/`text-mont-*`) se reemplazan por clases de rol `dsmd-*`
 * cuyo CSS real se genera desde `src/data/design-md/*.md` (ver
 * `src/lib/design-md.ts` + `src/layouts/DesignMdPreviewLayout.astro`),
 * scopeado por `[data-bu]` — así cambia de fuente automáticamente por BU.
 * Los colores (`bg-bu-*`, `text-bu-*`) NO se tocan, siguen igual que el
 * widget de producción.
 *
 * Esta copia NO se registra en `registry.ts` y no aparece en el Visor real.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v6.3' | 'v6.6' | 'v6.8' | 'v6.10' | 'v6.11' | 'v6.12';

export interface VariantTheme {
  section: string;
  title: string;
  titleSupport: string;
  titleSupportBox: string;
  desc: string;
  card: string;
  cardIconBox: string;
  cardTitle: string;
  cardText: string;
  cardCta: string;
  dateBadgeText: string;
  imageOverlay: string;
  bar: string;
}

export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  'v6.3': {
    light: {
      section: 'bg-bu-surface',
      title: 'text-bu-secondary',
      titleSupportBox: 'bg-bu-accent',
      titleSupport: 'text-bu-secondary',
      desc: 'text-bu-secondary',
      card: 'bg-bu-primary',
      cardIconBox: 'bg-bu-primary',
      cardTitle: 'text-bu-neutral',
      cardText: 'text-bu-neutral',
      cardCta: 'bg-bu-primary text-bu-surface hover:bg-bu-surface hover:text-bu-primary border border-bu-neutral',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-primary/80',
      bar: '',
    },
    dark: {
      section: 'bg-bu-primary',
      title: 'text-bu-neutral',
      titleSupportBox: 'bg-bu-accent',
      titleSupport: 'text-bu-secondary',
      desc: 'text-bu-neutral',
      card: 'bg-bu-neutral',
      cardIconBox: 'bg-bu-neutral',
      cardTitle: 'text-bu-secondary',
      cardText: 'text-bu-secondary',
      cardCta: 'bg-bu-neutral text-bu-secondary hover:bg-bu-surface hover:text-bu-secondary border border-bu-secondary',
      dateBadgeText: '',
      imageOverlay: 'bg-bu-neutral/80',
      bar: '',
    },
  },
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
  'v6.11': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
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
      desc: 'text-bu-neutral',
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
  'v6.12': {
    light: {
      section: 'bg-[#F0F0F0]',
      title: 'text-bu-primary',
      titleSupportBox: 'bg-bu-primary',
      titleSupport: 'text-bu-surface',
      desc: 'text-bu-primary',
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
      desc: 'text-bu-neutral',
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
 * Tipografía ahora vía roles `dsmd-*` (dinámicos por BU) en vez de
 * `font-anton`/`font-montserrat` fijos — layout se mantiene igual.
 */
export const baseClasses = {
  section: 'relative py-16 w-full transition-opacity duration-300 md:py-24',
  container: 'container relative z-10 px-4 mx-auto md:px-6',

  titleFont: 'dsmd-block-title',
  titleSupportFont: 'dsmd-block-title',
  bodyFont: 'dsmd-block-body',

  cardTitleFont: 'dsmd-card-title',
  cardTextFont: 'dsmd-card-body',
  cardItemTextFont: 'dsmd-card-body',
  cardCtaFont: 'dsmd-link',
  cardCtaFontAntonio: 'dsmd-link',
  cardTitleFontAnton: 'dsmd-card-title',

  cardBase: 'flex flex-col justify-start items-start px-11 py-12 space-y-4 rounded-[2rem] min-h-[330px] w-full',
  cardBaseMd: 'md:w-[calc(50%-2rem)]',
  cardBaseLg3: 'lg:w-[30%]',
  cardBaseLg2: 'lg:w-[calc(50%-2rem)]',

  cardBaseV611: 'flex flex-col justify-between items-start px-6 py-12 rounded-[2rem] min-h-[400px] w-full max-w-[400px] lg:max-w-none',
  cardBaseV611Lg: 'lg:w-[30%]',

  cardBaseV612: 'flex flex-col justify-start items-start px-10 py-12 rounded-[2rem] w-full max-w-[350px] lg:max-w-none space-y-4',
  cardBaseV612Lg: 'lg:w-[30%]',

  cardBaseV610: 'hk-card md:w-[calc((100%-2rem)/2)] w-full group',
  cardBoxV610: 'p-10 bg-[#DFDFDF] rounded-b-[2rem] hk-box-texto space-y-4',
};
