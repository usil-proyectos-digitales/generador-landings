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

/** Definición de una variante visual de un widget. */
export interface WidgetVariant {
  id: string;
  label: string;
}

/** Props canónicas que el visor sabe manejar (live editing). */
export interface WidgetDefaults {
  title: string;
  description: string;
  mode?: Mode;
  titleSupport?: string;
}

/** Adapter que traduce las props canónicas a las props reales del componente. */
export type PropsAdapter = (input: {
  title: string;
  description: string;
  variant: string;
  id: string;
  mode: Mode;
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
      { id: 'v6.3', label: '6.3 — Cards Centradas' },
      { id: 'v6.6', label: '6.6 — Cards Icono Izq' },
      { id: 'v6.8', label: '6.8 — Cards Verticales' },
      { id: 'v6.10', label: '6.10 — Dos Cards Grandes' },
      { id: 'v6.11', label: '6.11 — Cards Venta + CTA' },
      { id: 'v6.12', label: '6.12 — Cards con Fecha' },
    ],
    defaultVariant: 'v6.3',
    defaults: {
      title: 'Título principal de la sección',
      titleSupport: 'resaltar beneficios',
      description: 'Descripción introductoria de la sección.',
      mode: 'light',
      cards: [
        {
          title: 'Lorem ipsum dolor sit',
          text: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          ctaText: 'Inscríbete',
          ctaHref: '#',
        },
        {
          title: 'Sed do eiusmod tempor',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
          ctaText: 'Inscríbete',
          ctaHref: '#',
        },
        {
          title: 'Dolor sit amet consectetur',
          text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
          ctaText: 'Inscríbete',
          ctaHref: '#',
        },
      ],
    },
    component: CardsItems,
    propsAdapter: ({ title, description, id, mode, cards, ...rest }) => {
      // titleSupport puede venir en rest si el visor lo soporta.
      const titleSupport = (rest as Record<string, unknown>).titleSupport as string | undefined;
      return {
        title,
        titleSupport: titleSupport ?? 'resaltar beneficios',
        description,
        id,
        mode,
        ...(cards ? { cards } : {}),
      };
    },
  },
];