---
name: migrate-widget-v1-to-v2
description: >
  Migra un widget del sistema legacy V1 (HTML+JS plano en `src/widgets/<id>/`)
  al sistema Astro V2 (componente `.astro` con theme.ts, props tipadas, multi-tenant).
  Use when the user has placed a widget folder inside `src/migrar/` and asks to
  migrate it to V2, following the same architecture as `2-bloque-intro` and
  `5-save-the-date`. Handles variant enumeration, theme.ts extraction,
  propsAdapter wiring, and visor registration.
compatibility: trae-ai
---

# Migrate Widget V1 → V2 (Astro)

Migra un widget del sistema legacy (HTML plano + Vanilla JS para Vite/Elementor) al nuevo sistema Astro V2, **preservando 100% de la lógica funcional del JS** y siguiendo la arquitectura ya establecida por `2-bloque-intro` y `5-save-the-date`.

## Cuándo usar este skill

El usuario:
1. Copia una carpeta `src/widgets/<id>/` (legacy) dentro de `src/migrar/<id>/` en el repo `generador-landings/`.
2. Pide migrar ese widget al sistema V2.

NO usar este skill para:
- Widgets que ya están en V2 (carpeta `src/components/widgets/<id>/<Name>.astro`).
- Cambios al visor (`src/pages/index.astro`) o al registry (`src/components/widgets/registry.ts`) sin un widget que migrar.

## Inputs del workspace

```
generador-landings/
├── src/
│   ├── migrar/                          ← input: el usuario copia el widget legacy acá
│   │   └── <id>/
│   │       ├── index.js                  ← lógica funcional del widget (CRÍTICO preservarla)
│   │       ├── template.html             ← HTML de cada variante
│   │       └── widget.php                ← opcional: la versión Elementor (referencia, no se copia)
│   ├── components/widgets/               ← output: el widget migrado va acá
│   │   ├── registry.ts                   ← registro central, hay que agregar el widget acá
│   │   └── <existing-widgets>/           ← referencia: 2-bloque-intro, 5-save-the-date
│   └── pages/
│       └── index.astro                   ← visor: hay que actualizar el render para incluir el widget
└── public/                               ← assets estáticos (si el widget usa imágenes locales)
```

## Arquitectura objetivo (la que ya existe en V2)

Cada widget migrado debe quedar así:

```
src/components/widgets/<id>/
├── <PascalCaseName>.astro   ← Componente principal, props tipadas, mode light/dark
├── theme.ts                 ← Tokens de color: theme[variant][mode] + baseClasses
├── icons.ts                  ← (opcional) SVGs inline con ICON_PATHS si hay iconos custom
└── widget-registry.ts       ← (legacy, ya no se usa — todo va en registry.ts central)
```

Y agregar una entrada en `src/components/widgets/registry.ts` con la misma estructura que las entradas existentes.

## Workflow

### Step 1: Analizar la carpeta legacy

Lee TODO el contenido de `src/migrar/<id>/`:

- **`index.js`**: Lee la lógica completa. Identifica:
  - ¿Qué hace en `render(container)` / `init(container)` / `activate(container)`?
  - ¿Usa selectores de variant? (probablemente sí, porque el Visor V1 lo necesita)
  - ¿Inyecta HTML dinámico? (probablemente inyecta el `template.html`)
  - ¿Hay event listeners, IntersectionObservers, animaciones, sliders?
  - ¿Hay llamadas a APIs externas o integraciones (HubSpot, YouTube Lite, Swiper)?

- **`template.html`**: Identifica las variantes visuales. Típicamente el HTML tiene:
  - Múltiples `<section id="...">` con `data-widget-variant="..."` (vN.M).
  - Comentarios `<!-- VARIANTE N.M: nombre -->`.
  - Clases de Tailwind v3 (pueden tener variantes viejas como `bg-brand-dark`).
  - Selectores especiales (`.hk-title`, `.hk-desc`, etc.) que el visor usa para live-editing.

- **`widget.php`**: Solo como referencia de la versión Elementor. NO se copia.

**Output esperado de este step**: Un mapa claro de:
- Variantes visuales (IDs y descripciones).
- Lógica JS crítica (qué funciones/clases/eventos tiene `index.js`).
- Selectores que el visor necesita (`.hk-title`, `.hk-desc`, etc.).
- Tokens de color hardcodeados (para mapearlos al theme.ts).
- Props que el widget recibe del editor de ACF (text, image, repeater, etc.).

### Step 2: Confirmar mapeo de variantes y props con el usuario

Antes de escribir código, **SIEMPRE confirma con el usuario**:

```
Las variantes que detecté en el template.html son:
- vN.1: "Nombre de la variante" (descripción breve)
- vN.2: "Nombre de la variante"

Las props que el widget recibe (según el PHP y el HTML) son:
- title: string (texto fijo del editor)
- description: string (wysiwyg HTML)
- image: string (URL)
- cards: array (repeater)

¿Confirmás esto o falta algo?
```

Esto evita implementar props equivocadas que después hay que reescribir.

### Step 3: Crear el componente `.astro`

Path de salida: `src/components/widgets/<id>/<PascalCaseName>.astro`.

**Estructura obligatoria**:

```astro
---
/**
 * <Name> — Widget "<title>" (id: `<id>`).
 * --------------------------------------------------------------
 * Migración a Astro del widget legacy en `src/migrar/<id>/`.
 * Lógica preservada 1:1 desde `index.js`.
 *
 * Sistema de color:
 *   Tokens centralizados en `./theme.ts` por variante × modo.
 *   El widget consume las 5 variables semánticas del Design System V2.
 *
 * ACF (WordPress):
 *   - <prop1>  ← ACF `<type>` "<label>"
 *   - <prop2>  ← ACF `<type>` "<label>"
 *
 * Comportamiento:
 *   - <detalle de comportamiento relevante>
 */
import { theme, baseClasses, type Mode } from './theme.ts';

interface Props {
  // ... props tipadas, cada una con JSDoc
}

const { /* ...props con defaults razonables... */ } = Astro.props;

// Resolución de tokens UNA sola vez por render.
const tokens = theme['<variant>'][mode];

// Clases base compartidas (typography, layout).
// Las clases de color vienen de tokens, NO de strings hardcoded.
---

<{/* VARIANTE vN.1 */}
{variant === 'vN.1' && (
  <section
    id={id}
    data-widget="<id>"
    data-variant="vN.1"
    data-mode={mode}
    class:list={[baseClasses.section, tokens.section]}
  >
    {/* ...estructura HTML del template.html, con clases Tailwind v4 (tokens bu-*) */}
  </section>
)}

{/* VARIANTE vN.2 */}
{...}
```

**Reglas del template**:

1. **ESTRUCTURA HTML IGUAL** al legacy. Mismas clases, mismos divs, misma jerarquía. **NO refactorizar el HTML** — solo reemplazar colores hardcoded por tokens.
2. **Reemplazar colores hardcoded** por utilities de tokens:
   - `bg-brand-dark` → `bg-bu-primary`
   - `text-brand-dark` → `text-bu-primary`
   - `bg-[#F0F0F0]` → dejar (es gray neutro) o usar `bg-[#F0F0F0]` con clase en theme.ts
   - `bg-white` → `bg-bu-surface`
   - `text-white` → `text-bu-surface`
3. **NO escribir colores hex en el .astro**. Si encontrás `#XXXXXX` en el template, moverlo a `theme.ts` como `'bg-[#XXXXXX]'`.
4. **Preservar TODOS los selectores `.hk-*`** (`.hk-title`, `.hk-desc`, `.hk-card-icon`, etc.). El visor los usa para live-editing.
5. **Mantener `data-widget="<id>"` y `data-variant="..."` en cada variante** — son hooks que el visor usa.
6. **Soporte `mode: 'light' | 'dark'`**: agregar `data-mode={mode}` al `<section>` y usar `theme[variant][mode]` para elegir las clases.
7. **Si el JS legacy inyecta contenido dinámico** (sliders, video players, forms): NO incluirlo inline en el .astro. Crear un `<script>` en el `.astro` que ejecute la misma lógica sobre los selectores que el JS legacy usaba. Documentar la equivalencia.

### Step 4: Crear `theme.ts`

Path: `src/components/widgets/<id>/theme.ts`.

**Estructura**:

```ts
/**
 * Theme tokens — <Name> (id: `<id>`).
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
 */
export type Mode = 'light' | 'dark';
export type Variant = 'vN.1' | 'vN.2';

export interface VariantTheme {
  /** Clases para el contenedor raíz `<section>`. */
  section: string;
  /** Clases para el `<h2>` del título. */
  title: string;
  // ... agregar keys según lo que tenga el widget
}

export const theme: Record<Variant, Record<Mode, VariantTheme>> = {
  'vN.1': {
    light: { section: '...', title: '...', /* ... */ },
    dark:  { section: '...', title: '...', /* ... */ },
  },
  'vN.2': {
    light: { /* ... */ },
    dark:  { /* ... */ },
  },
};

export const baseClasses = {
  section: 'relative py-16 w-full transition-opacity duration-300 md:py-24',
  container: 'container relative z-10 px-4 mx-auto md:px-6',
  // ... más clases compartidas según necesidad
};
```

**Reglas del theme**:

1. **Solo clases Tailwind de tokens** (`bg-bu-*`, `text-bu-*`). NO hex.
2. **Si necesitás un color custom** (gris neutro, overlay, etc.), usá `'bg-[#XXXXXX]'` acá. NO en el .astro.
3. **`baseClasses`** para todo lo que NO cambia entre variantes o modos (tipografía, padding, transiciones).
4. **Dark mode es role-inversion**, no nuevos colores. Ver ejemplos en `2-bloque-intro/theme.ts`.

### Step 5: (Opcional) Crear `icons.ts`

Si el widget usa SVGs custom (NO Font Awesome), crear `icons.ts` con el mismo patrón que `5-save-the-date/icons.ts`:

```ts
export const ICON_SLUGS = ['icon1', 'icon2'] as const;
export type IconSlug = typeof ICON_SLUGS[number];

export const ICON_PATHS: Record<IconSlug, string> = {
  icon1: 'M...',
  icon2: 'M...',
};
```

Para iconos de Font Awesome, usá paths de FA v7.3.1 (viewBox 0 0 640 640) y agregá un factory `IconX(props)` que retorne el SVG completo.

### Step 6: Registrar en `src/components/widgets/registry.ts`

Editar el array `widgetRegistry`:

```ts
import <Name> from './<id>/<PascalCaseName>.astro';
// ... otros imports

export const widgetRegistry: WidgetRegistration[] = [
  // ... entradas existentes
  {
    id: '<id>',
    name: '<Título visible>',
    description: '<Descripción corta>',
    variants: [
      { id: 'vN.1', label: 'vN.1 — <nombre>' },
      { id: 'vN.2', label: 'vN.2 — <nombre>' },
    ],
    defaultVariant: 'vN.1',
    defaults: {
      title: '<título demo>',
      description: '<desc demo>',
      mode: 'light',
      // ... si el widget tiene props custom (ej. cards, image), extender con:
      // ...(spread del WidgetDefaults original)
      cards: [...] // opcional
    },
    component: <Name>,
    // Si las props no son title/description/variant/mode estándar:
    propsAdapter: ({ title, description, id, mode, cards }) => ({
      title,
      bottomText: description,  // ejemplo: rename description → bottomText
      id,
      mode,
      ...(cards ? { cards } : {}),
    }),
  },
];
```

**Reglas del registry**:

1. **El orden de las entradas define el orden en el sidebar del visor**.
2. **`defaults`** son los valores que se ven al cargar el visor.
3. **`propsAdapter`** es opcional — solo cuando el widget NO acepta `title/description/variant/mode/id` estándar.
4. **Si el widget tiene props custom** (cards, image, etc.), agregalas al `WidgetDefaults` interface o usá `propsAdapter`.

### Step 7: Verificar el visor

Editar `src/pages/index.astro` si es necesario:

1. **El render del preview** ya itera sobre `widgetRegistry`, así que un widget nuevo aparece automáticamente.
2. **`renderCards`** (función JS del visor): si el widget tiene `cards` en sus defaults, agregar la edición de cards en el drawer (ver sección "Cards editor" en `index.astro`).
3. **Si el widget tiene props adicionales que se quieran editar** (ej. un campo `image`), agregarlos en el drawer bajo el variant/mode switchers.

### Step 8: Verificación final

```bash
cd generador-landings
pnpm check
# → 0 errors / 0 warnings / 0 hints
```

Y verificar visualmente:
- `http://localhost:4321/` → el widget aparece en el sidebar.
- `http://localhost:4321/#<id>` → el preview muestra la variante default con el modo default.
- Click en "Props" → el drawer muestra los campos correctos.
- Cambiar BU en el sidebar → el widget repinta.
- Cambiar variant o mode → el widget cambia.
- Editar un campo (title, description, cards) → el preview se actualiza en vivo.

### Step 9: Limpieza

Una vez validado:
- Confirmar con el usuario antes de eliminar la carpeta `src/migrar/<id>/`.
- Recomendar: `git add -A && git commit -m "feat: migrate <id> widget from V1 to V2"` con los archivos nuevos.

## Referencia: widgets ya migrados

Estos dos widgets son los **golden examples** que el resultado debe imitar:

- `src/components/widgets/2-bloque-intro/BloqueIntro.astro` (2 variantes, modo light/dark)
- `src/components/widgets/5-save-the-date/SaveTheDate.astro` (1 variante, modo light/dark, cards editables, SVGs de FA v7.3.1)

**Antes de implementar**, leé ambos archivos completos para familiarizarte con los patrones. Si algo del widget legacy no encaja en estos patrones, **preguntá al usuario** antes de improvisar.

## Convenciones críticas

| Regla | Por qué |
|---|---|
| Clases `hk-*` SIEMPRE presentes en el HTML renderizado | El visor las usa para live-editing |
| `data-widget="<id>"` y `data-variant="vN.M"` en cada `<section>` | El visor filtra por estos atributos |
| `theme.ts` separado del `.astro` | Para que un solo cambio de color no toque el HTML |
| Colores hex SOLO en `theme.ts` (como `'bg-[#F0F0F0]'`) | Una sola fuente de verdad por BU/modo |
| `mode: 'light' \| 'dark'` como prop del widget | Permite mezclar widgets claros/oscuros en una landing |
| `class:list={[baseClasses.X, tokens.X]}` | Combina clases compartidas + tokens sin concatenar strings |
| `set:html` solo para SVG inline (no para texto del usuario) | Seguridad XSS |
| `set:html={description}` SOLO si la prop es HTML confiable | Nunca con user input sin sanitizar |

## Diferencias con Elementor V1

- **No se incluye `widget.php`** — es solo referencia de lo que el widget hace en WordPress.
- **No se incluye `index.js`** — la lógica JS se reescribe en un `<script>` del `.astro` o se elimina si era solo inyectar HTML estático.
- **No se incluyen assets físicos** (imágenes) — van a `public/` o se cargan vía CDN. Si el widget legacy usa imágenes locales, moverlas a `public/`.
- **Las clases `bg-brand-dark` (legacy V1) se traducen a tokens V2** (`bg-bu-primary`).
