/**
 * Registro de widgets para el Visor (UI Kit / Storybook interno).
 * --------------------------------------------------------------
 * Cada entrada describe:
 *   - id              → slug del widget
 *   - name            → título visible
 *   - description     → descripción corta
 *   - variants[]      → variantes visuales (id + label)
 *   - defaultVariant  → variante que se muestra al cargar
 *   - defaults        → props por defecto (incluye `mode: 'light' | 'dark'`)
 *   - component       → componente Astro
 *   - propsAdapter    → opcional, traduce props canónicas a props reales
 *
 * Para REGISTRAR UN WIDGET NUEVO:
 *   1. Crear el componente .astro en `src/components/widgets/<id>/<Name>.astro`
 *   2. Importarlo arriba y agregar una entrada al array `widgetRegistry`.
 *   3. Si acepta title/description/variant/mode → listo.
 *      Si tiene props custom (ej. cards[]) → usar `propsAdapter`.
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import BloqueIntro from './2-bloque-intro/BloqueIntro.astro';
import SaveTheDate from './5-save-the-date/SaveTheDate.astro';
import CardsItems from './6-cards-items/CardsItems.astro';
import type { Mode } from './2-bloque-intro/theme.ts';

/** Un campo editable por card en el editor del drawer (widgets "cards6"). */
export interface Card6FieldSpec {
  /** Clave del campo en el objeto card (title, text, icon, ctaText, ctaHref, ...). */
  key: string;
  /** Label visible en el editor del drawer. */
  label: string;
}

/** Definición de una variante visual de un widget. */
export interface WidgetVariant {
  id: string;
  label: string;
  /**
   * Cards por defecto específicas de esta variante (si el widget usa `cards`).
   * Cuando se define, tiene prioridad sobre `defaults.cards` — así cada
   * variante arranca con su propia cantidad/contenido, en vez de compartir
   * un único set entre todas las variantes del widget.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cards?: any[];
  /**
   * Schema de campos editables por card para ESTA variante (solo widgets
   * "cards6", ver `data-cards-kind` en el Visor). Cada variante puede tener
   * una estructura de card muy distinta — si se omite, el editor usa el
   * default de 3 campos (`DEFAULT_CARD6_FIELDS`: título/texto/CTA texto).
   */
  cardFields?: Card6FieldSpec[];
}

/** Schema default del editor de cards cuando una variante no declara el suyo propio. */
export const DEFAULT_CARD6_FIELDS: Card6FieldSpec[] = [
  { key: 'title', label: 'Título' },
  { key: 'text', label: 'Texto' },
  { key: 'ctaText', label: 'CTA' },
];

/** Props canónicas que el visor sabe manejar (live editing). */
export interface WidgetDefaults {
  title: string;
  description: string;
  mode?: Mode;
  titleSupport?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cards?: any[];
}

/** Adapter que traduce las props canónicas a las props reales del componente. */
export type PropsAdapter = (input: {
  title: string;
  description: string;
  variant: string;
  id: string;
  mode: Mode;
  titleSupport?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cards?: any[];
}) => Record<string, unknown>;



/** Definición completa de un widget registrado en el visor. */
export interface WidgetRegistration {
  id: string;
  name: string;
  description: string;
  variants: WidgetVariant[];
  defaultVariant: string;
  /** Props por defecto. Incluye `mode` para alternar claro/oscuro. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaults: WidgetDefaults & { cards?: any[]; titleSupport?: string } & Record<string, any>;
  /** Componente Astro factory. */
  component: AstroComponentFactory;
  /**
   * Adapter opcional. Si se omite, el visor pasa title/description/variant/mode/id directo.
   */
  propsAdapter?: PropsAdapter;
}

/**
 * Calcula las props reales de una instancia widget × variante × modo, tal
 * como las necesita `<w.component>`. Centralizado acá para que la ruta de
 * preview (`src/pages/widget-preview/[widget]/[variant]/[mode].astro`) use
 * exactamente la misma lógica que antes vivía inline en el Visor.
 */
export function computeWidgetInstanceProps(
  w: WidgetRegistration,
  variantId: string,
  mode: Mode
): { previewId: string; componentProps: Record<string, unknown> } {
  const v = w.variants.find((x) => x.id === variantId);
  const variantCards = v?.cards ?? w.defaults.cards;
  const previewId = `preview-${w.id}-${variantId}-${mode}`;

  const adapterInput = {
    title: w.defaults.title,
    description: w.defaults.description,
    variant: variantId,
    id: previewId,
    mode,
    ...(w.defaults.titleSupport ? { titleSupport: w.defaults.titleSupport } : {}),
    ...(variantCards ? { cards: variantCards } : {}),
  };

  const componentProps = w.propsAdapter
    ? w.propsAdapter(adapterInput)
    : {
        title: w.defaults.title,
        description: w.defaults.description,
        variant: variantId,
        id: previewId,
        mode,
      };

  return { previewId, componentProps };
}

/**
 * Genera N cards de relleno (Lorem Ipsum) para sembrar el default de una
 * variante de `6-cards-items`. El contenido es irrelevante — lo único que
 * importa acá es la CANTIDAD, que varía por variante (ver comentario en
 * cada entrada de `variants` más abajo).
 */
function makeCards6(count: number) {
  const titles = [
    'Lorem ipsum dolor sit',
    'Sed do eiusmod tempor',
    'Dolor sit amet consectetur',
    'Ut enim ad minim veniam',
    'Excepteur sint occaecat',
    'Duis aute irure dolor',
  ];
  return Array.from({ length: count }, (_, i) => ({
    title: titles[i % titles.length],
    text: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ctaText: 'Inscríbete',
    ctaHref: '',
  }));
}

/** Catálogo de widgets. Ampliar aquí cuando se agreguen nuevos widgets. */
export const widgetRegistry: WidgetRegistration[] = [
  {
    id: '2-bloque-intro',
    name: '2. Bloque Intro Texto',
    description:
      'Bloque introductorio de texto con dos variantes: centrado (v2.1) o dividido en dos columnas (v2.2). Soporta modo claro y oscuro por instancia.',
    variants: [
      { id: 'v2.1', label: '2.1 — Centrado' },
      { id: 'v2.2', label: '2.2 — Dividido' },
    ],
    defaultVariant: 'v2.1',
    defaults: {
      title: 'Título o mensaje de introducción',
      description:
        'Este es un bloque de texto introductorio diseñado para captar la atención del usuario. Puede usarse para presentar la facultad, el programa o la propuesta de valor principal.',
      mode: 'light',
    },
    component: BloqueIntro,
  },
  {
    id: '5-save-the-date',
    name: '5. Save the Date',
    description:
      'Bloque informativo de evento con título, hasta 6 cards (icono SVG + etiqueta + valor) y texto de bajada. Soporta modo claro y oscuro por instancia.',
    variants: [
      { id: 'v5.7', label: '5.7 — Cards + Bajada' },
    ],
    defaultVariant: 'v5.7',
    defaults: {
      title: 'Save the Date',
      description:
        'USIL, campus 1 - Aula Magna<br> <span class="font-normal">(av. La Fontana 550, La Molina)</span>',
      mode: 'light',
      cards: [
        { label: 'Fecha:', value: '25 y 26 abril', iconSlug: 'fecha' },
        { label: 'Hora:', value: '9:00 - 18:00', iconSlug: 'hora' },
        { label: 'Modalidad:', value: 'Híbrida', iconSlug: 'hibrida' },
      ],
    },
    component: SaveTheDate,
    propsAdapter: ({ title, description, id, mode, cards }) => ({
      title,
      bottomText: description,
      id,
      mode,
      ...(cards ? { cards } : {}),
    }),
  },
  {
    id: '6-cards-items',
    name: '6. Cards Items',
    description:
      'Widget de cards versátil con 6 variantes: cards centradas (v6.3), icono izq (v6.6), verticales con imagen (v6.8), dos cards grandes (v6.10), cards venta+CTA (v6.11) y cards con fecha (v6.12). Soporta modo claro y oscuro.',
    variants: [
      // Cantidad inicial de cards acordada por variante — cada una arranca
      // independiente de las demás (no comparten props ni conteo).
      {
        id: 'v6.3',
        label: '6.3 — Cards Centradas',
        cards: makeCards6(3),
        // v6.3 permite reemplazar el ícono default por una imagen propia
        // (75×75px, opcional — sin imagen el título ocupa todo el ancho) y
        // un link de CTA propio. Ninguna otra variante necesita estos
        // campos hoy, por eso el schema es específico de v6.3.
        cardFields: [
          { key: 'title', label: 'Título' },
          { key: 'text', label: 'Texto' },
          { key: 'icon', label: 'Imagen (URL, 75×75px — opcional)' },
          { key: 'ctaText', label: 'CTA' },
          { key: 'ctaHref', label: 'CTA URL' },
        ],
      },
      { id: 'v6.6', label: '6.6 — Cards Icono Izq', cards: makeCards6(6) },
      { id: 'v6.8', label: '6.8 — Cards Verticales', cards: makeCards6(5) },
      { id: 'v6.10', label: '6.10 — Dos Cards Grandes', cards: makeCards6(2) },
      { id: 'v6.11', label: '6.11 — Cards Venta + CTA', cards: makeCards6(3) },
      { id: 'v6.12', label: '6.12 — Cards con Fecha', cards: makeCards6(3) },
    ],
    defaultVariant: 'v6.3',
    defaults: {
      title: 'Título principal de la sección',
      titleSupport: 'resaltar beneficios',
      description: 'Descripción introductoria de la sección.',
      mode: 'light',
      // Fallback genérico (variantes sin `cards` propio caerían acá).
      // La cantidad real por variante vive en `variants[].cards` arriba.
      cards: makeCards6(3),
    },
    component: CardsItems,
    propsAdapter: ({ title, description, variant, id, mode, cards, titleSupport }) => ({
      title,
      titleSupport: titleSupport ?? 'resaltar beneficios',
      description,
      variant: variant as 'v6.3' | 'v6.6' | 'v6.8' | 'v6.10' | 'v6.11' | 'v6.12',
      id,
      mode,
      ...(cards ? { cards } : {}),
    }),
  },
];