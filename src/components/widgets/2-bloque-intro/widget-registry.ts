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
 *
 * Para REGISTRAR UN WIDGET NUEVO en el visor:
 *   1. Crear el componente .astro en `src/components/widgets/<id>/<Name>.astro`
 *   2. Importarlo arriba y agregar una entrada al array `widgetRegistry`.
 *   3. (Opcional) Definir `defaults` con contenido realista de la marca.
 *
 * El visor recorre `widgetRegistry` y renderiza una sección por widget,
 * con sus controles a la izquierda y el preview a la derecha.
 */
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import BloqueIntro from './BloqueIntro.astro';

/** Definición de una variante visual de un widget. */
export interface WidgetVariant {
  id: string;
  label: string;
}

/** Definición completa de un widget registrado en el visor. */
export interface WidgetRegistration {
  id: string;
  name: string;
  description: string;
  variants: WidgetVariant[];
  defaultVariant: string;
  /** Props por defecto — se pasan al componente Astro en cada preview. */
  defaults: {
    title: string;
    description: string;
  };
  /** Componente Astro factory. Se renderiza con `<Component {...props} />`. */
  component: AstroComponentFactory;
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
  },
];