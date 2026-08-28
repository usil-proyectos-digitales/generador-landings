/**
 * Theme tokens — BloquePonentesTestimonios, COPIA AISLADA para la prueba
 * `/design-md-preview`.
 * --------------------------------------------------------------
 * Copia de `src/components/widgets/7-bloque-ponentes-testimonios/theme.ts`.
 * Único cambio: tipografía vía roles `dsmd-*` (ver comentario equivalente
 * en `widgets-design-md-preview/6-cards-items/theme.ts`). Colores intactos.
 *
 * Esta copia NO se registra en `registry.ts` y no aparece en el Visor real.
 */
export type Mode = 'light' | 'dark';
export type Variant = 'v7.2' | 'v7.4' | 'v7.5';

export interface VariantTheme {
  section: string;
  title: string;
  titleSupport: string;
  titleSupportBox: string;
  desc: string;
  card: string;
  cardTitle: string;
  cardText: string;
  overlay: string;
  bar: string;
}

export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
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

export const baseClasses = {
  section: 'relative py-16 w-full transition-opacity duration-300 md:py-24',
  container: 'container relative z-10 px-4 mx-auto md:px-6',

  titleFont: 'dsmd-block-title',
  titleSupportFont: 'dsmd-block-title',
  bodyFont: 'dsmd-block-body',

  cardTitleFont: 'dsmd-card-title',
  cardTextFont: 'dsmd-card-body',
  cardItemTextFont: 'dsmd-card-body',

  cardBaseV72:
    'hk-card-ponente rounded-[1rem] md:rounded-[3rem] py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-8 w-11/12 mx-auto text-center md:text-left',

  cardBaseV74: 'hk-card-7-4 pt-4 relative w-[246px] flex flex-col items-start',

  cardBaseV75: 'overflow-hidden relative w-full hk-box-ponente group',
};
