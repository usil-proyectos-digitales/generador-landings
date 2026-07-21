/**
 * Registro de widgets para el Visor (UI Kit / Storybook interno).
 * --------------------------------------------------------------
 * Cada entrada describe:
 *   - id           → slug del widget (matches carpeta en `components/widgets/<id>/`)
 *   - name         → título visible
 *   - description  → descripción corta
 *   - variants[]   → variantes visuales (id + label)
 *   - defaultVariant → variante que se muestra al cargar
 *   - defaults     → props por defecto (se inyectan al preview inicial)
 *   - component    → componente Astro que renderiza el preview
 *   - propsAdapter → opcional, traduce props canónicas a props reales
 *
 * Props canónicas que el visor sabe manejar (live editing):
 *   - title       → título del widget
 *   - description → texto secundario (descripción o bajada según widget)
 *   - variant     → variante visual
 *
 * Para widgets con props NO canónicas (ej. SaveTheDate con `cards[]`),
 * usar `propsAdapter` para traducir o exponer `defaultProps` directo.
 *
 * Para REGISTRAR UN WIDGET NUEVO:
 *   1. Crear el componente .astro en `src/components/widgets/<id>/<Name>.astro`
 *   2. Importarlo arriba y agregar una entrada al array `widgetRegistry`.
 *   3. Si el widget acepta solo `title/description/variant` → listo.
 *      Si tiene props custom (ej. cards[]) → usar `propsAdapter`.
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import BloqueIntro from './2-bloque-intro/BloqueIntro.astro';
import SaveTheDate from './5-save-the-date/SaveTheDate.astro';
import type { CardItem } from './5-save-the-date/SaveTheDate.astro';

/** Definición de una variante visual de un widget. */
export interface WidgetVariant {
  id: string;
  label: string;
}

/** Props canónicas que el visor sabe cómo manejar. */
export interface WidgetDefaults {
  title: string;
  /** Texto secundario. En BloqueIntro es la descripción; en SaveTheDate es la bajada. */
  description: string;
}

/** Adapter que traduce las props canónicas a las props reales del componente. */
export type PropsAdapter = (input: {
  title: string;
  description: string;
  variant: string;
  id: string;
}) => Record<string, unknown>;

/** Definición completa de un widget registrado en el visor. */
export interface WidgetRegistration {
  id: string;
  name: string;
  description: string;
  variants: WidgetVariant[];
  defaultVariant: string;
  /** Props por defecto del widget. Si el widget expone más (ej. cards),
   *  extender con `defaultProps` y mergear en el render del visor. */
  defaults: WidgetDefaults & { cards?: CardItem[] };
  /** Componente Astro factory. */
  component: AstroComponentFactory;
  /**
   * Adapter opcional. Si se omite, el visor pasa `{ title, description, variant, id }`
   * directo. Útil cuando el widget expone props con otro nombre o estructura
   * más compleja (ej. SaveTheDate usa `cards[]` además de `title`/`bottomText`).
   */
  propsAdapter?: PropsAdapter;
}

/** Catálogo de widgets. Ampliar aquí cuando se agreguen nuevos widgets. */
export const widgetRegistry: WidgetRegistration[] = [
  {
    id: '2-bloque-intro',
    name: 'Bloque Intro Texto',
    description:
      'Bloque introductorio de texto con dos variantes: centrado (v2.1) o dividido en dos columnas (v2.2). Ideal para presentar la propuesta de valor.',
    variants: [
      { id: 'v2.1', label: '2.1 — Centrado' },
      { id: 'v2.2', label: '2.2 — Dividido' },
    ],
    defaultVariant: 'v2.1',
    defaults: {
      title: 'Título o mensaje de introducción',
      description:
        'Este es un bloque de texto introductorio diseñado para captar la atención del usuario. Puede usarse para presentar la facultad, el programa o la propuesta de valor principal.',
    },
    component: BloqueIntro,
    // BloqueIntro acepta title/description/variant directamente.
  },
  {
    id: '5-save-the-date',
    name: 'Save the Date',
    description:
      'Bloque informativo de evento con título, hasta 6 cards (icono SVG + etiqueta + valor: Fecha, Hora, Modalidad, etc.) y texto de bajada con el lugar. Los iconos son SVG inline con currentColor y cambian con el BU.',
    variants: [
      { id: 'v5.7', label: '5.7 — Título + Cards + Bajada' },
    ],
    defaultVariant: 'v5.7',
    defaults: {
      title: 'Save the Date',
      description:
        'USIL, campus 1 - Aula Magna<br> <span class="font-normal">(av. La Fontana 550, La Molina)</span>',
      cards: [
        { label: 'Fecha:', value: '25 y 26 abril', iconSlug: 'fecha' },
        { label: 'Hora:', value: '9:00 - 18:00', iconSlug: 'hora' },
        { label: 'Modalidad:', value: 'Híbrida', iconSlug: 'modalidad' },
      ],
    },
    component: SaveTheDate,
    // SaveTheDate NO acepta `variant` ni `description`. Recibe `cards[]`,
    // `bottomText` (en lugar de description), `title` e `id`.
    propsAdapter: ({ title, description, id, variant }) => ({
      title,
      bottomText: description,
      id,
      // variant no aplica en SaveTheDate (solo v5.7); el visor no lo usa.
      ...(variant ? { variant } : {}),
    }),
  },
];