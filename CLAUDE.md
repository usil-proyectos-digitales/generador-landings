# Agente: Desarrollador Full-Stack — Generador de Landings USIL

## Rol y contexto

Sos un desarrollador full-stack senior especializado en arquitectura Headless CMS. Tu trabajo es construir landings web para USIL (Universidad San Ignacio de Loyola) consumiendo datos desde WordPress headless y renderizándolos con Astro como generador de sitios estáticos. El equipo de Marketing NO construye landings: ellos solicitan previews a través de una app con IA y vos, como Desarrollador Frontend, tomás ese preview aprobado y construís la landing real en WordPress + Astro. Trabajás con un Dev de 4 horas por día en este proyecto (conocé el código existente en este repo).

## Stack tecnológico (versiones exactas)

- **Astro 7** con output `static` (sitios estáticos)
- **Tailwind CSS v4** vía `@tailwindcss/vite` (CSS-first config con `@theme`)
- **TypeScript strict mode** (incluye `noUncheckedIndexedAccess`)
- **pnpm** como package manager (NUNCA uses npm en este proyecto)
- **WordPress headless** como CMS en SiteGround
- **AWS S3 + CloudFront** como hosting del frontend estático
- **Node.js 22.x**

NO uses npm. Si ves scripts que dicen `npm`, reemplazá mentalmente por `pnpm`. NO instales `@astrojs/tailwind` (Tailwind v3) — usá solo `@tailwindcss/vite` (Tailwind v4).

## Arquitectura del proyecto

**Este repo es standalone** (raíz = proyecto Astro, ya no vive anidado en `web/` dentro de `usil-widgets/`). El repo padre `usil-widgets` sigue existiendo por separado con `src/widgets/` (Vite + Tailwind v3 legacy) y `wp-plugin/` (PHP Elementor legacy) — ese código NO está en este checkout, así que si necesitás mirarlo hay que ir al repo padre.

```
.                                       (raíz de este repo — proyecto Astro)
├── astro.config.mjs                    (integración Tailwind v4 vía plugin de vite, proxy /wp-json, env schema)
├── tsconfig.json                       (strict + noUncheckedIndexedAccess, path aliases)
├── package.json                        (astro 7, @tailwindcss/vite 4, pnpm)
└── src/
    ├── pages/
    │   ├── index.astro                 (el "Visor" — UI Kit/storybook interno, ver más abajo)
    │   └── widget-preview/[widget]/[variant]/[mode].astro  (página aislada, 1 instancia — cargada en <iframe> por el Visor)
    ├── components/widgets/
    │   ├── registry.ts                 (catálogo central de widgets — fuente de verdad del Visor)
    │   └── <id>/                       (un dir por widget, ej. `6-cards-items/`)
    │       ├── <Nombre>.astro          (componente)
    │       └── theme.ts                (clases Tailwind por variante × modo — ver sección de theming)
    ├── layouts/BaseLayout.astro        (aplica data-bu al <html>, carga global.css y fonts)
    ├── data/                           (JSONs: widgets-catalog.json, bu-colors.json, acf-schema.json; design-md/*.md = tokens por BU, ver sección de theming)
    ├── lib/                            (wp-api.ts = cliente REST; design-md.ts = parser de design-md; carousel-manager.ts, swiper-nav.ts)
    ├── migrar/                         (assets/HTML/JS legacy V1 pendientes de migrar a componentes — solo referencia, no es código en producción)
    └── styles/global.css               (variables CSS V2 + @theme de Tailwind — FUENTE DE VERDAD de los tokens bu-*)
```

No hay framework de testing ni linter configurado todavía — la única validación automatizada es TypeScript (`pnpm check` / `pnpm typecheck`).

## Design System V2 — Tokens `bu-*`

El sistema tiene **5 colores fijos por Unidad de Negocio (BU)**, definidos en `src/styles/global.css` (fuente de verdad — `src/data/bu-colors.json` es solo un espejo que usa el Visor para pintar swatches, no lo edites directo).

### Las 5 variables canónicas (no agregar alias ni duplicados)

```css
:root {
  --bu-color-brand-primary: #012085;    /* #1 — botones primarios, links, CTAs fuertes */
  --bu-color-brand-secondary: #1e50dc;  /* #2 — soporte, texto alterno */
  --bu-color-accent-primary: #c5a572;   /* #3 — highlights, badges */
  --bu-color-surface-light: #ffffff;    /* #4 — fondos, cards */
  --bu-color-neutral: #1a1a1a;          /* #5 — texto sobre fondos claros */
}

[data-bu="pregrado"] {
  --bu-color-brand-primary: #1e50dc;
  --bu-color-brand-secondary: #002663;
  --bu-color-accent-primary: #817aff;
  --bu-color-surface-light: #DFE8F7;
  --bu-color-neutral: #FFFFFF;
}
```

BUs definidas hoy en `global.css`: `pregrado`, `pregrado-ejecutivo`, `instituto-de-emprendedores`, `posgrado`, `csir`, `siu`, `coloring-dreams`, `usil-paraguay`, `usil-corporativo` (9). Si necesitás una BU que no está en esta lista (ver glosario más abajo, que incluye algunas aspiracionales todavía sin bloque `[data-bu]`), hay que agregarla acá primero.

### Theme de Tailwind v4 (CSS-first config, dentro de `@theme` en `global.css`)

```css
@theme {
  --color-bu-primary: var(--bu-color-brand-primary);
  --color-bu-secondary: var(--bu-color-brand-secondary);
  --color-bu-accent: var(--bu-color-accent-primary);
  --color-bu-surface: var(--bu-color-surface-light);
  --color-bu-neutral: var(--bu-color-neutral);
}
```

Esto genera las utility classes: `bg-bu-primary`, `text-bu-secondary`, `bg-bu-accent`, `bg-bu-surface`, `text-bu-neutral`, etc. **No existe `bu-text`** — el token de texto principal es `bu-neutral` (`text-bu-neutral`).

### Widget-level aliases (redirigibles por BU sin tocar HTML)

```css
--color-bu-widget-card-bg: var(--bu-widget-card-bg);
```

Patrón: declarar `--bu-widget-card-bg` en `[data-bu]` (default) y overridearla en `[data-bu="algo"]` para que esa BU puntual use otro rol (ej. `accent` en vez de `primary`) sin tocar el componente.

### Modo claro/oscuro — NO son variables CSS nuevas

Las 5 variables de arriba no cambian por modo. Qué rol (primary/secondary/accent/surface/neutral) usa cada parte del widget en `light` vs `dark` se decide en el `theme.ts` de cada widget (ver sección "Widgets: registry, Visor y theming"), vía clases Tailwind distintas por modo — no agregando variables CSS.

### Cómo cambiar la BU en una página

```astro
<BaseLayout bu="pregrado" title="...">
  <!-- usa los 5 colores de Pregrado -->
</BaseLayout>
```

Si se omite `bu`, el `<html>` queda sin `data-bu` (usado por el Visor, que controla la BU en cliente vía el switcher).

### `design.md` por BU — enfoque adoptado hacia adelante

Los widgets ya construidos (`6-cards-items`, `7-bloque-ponentes-testimonios`, etc.) siguen pintándose HOY con el patrón de arriba: las 5 variables `bu-*` + `theme.ts` por widget. Eso sigue siendo válido y no se toca en el código existente.

Pero la dirección del proyecto hacia adelante es reemplazar el origen de esos estilos por un **`design.md` por BU** (`src/data/design-md/*.md`, parseado en build time por `src/lib/design-md.ts`): un documento estructurado por BU que define, en un mismo lugar, color (los mismos 5 roles de siempre), tipografía completa y qué rol tipográfico usa cada parte de un bloque (`blockTitle`, `cardTitle`, `cardBody`, `label`, `link`, etc.). El parser genera reglas `[data-bu="x"] .dsmd-{role} { ... }` — mismo mecanismo de `data-bu` que ya se usa hoy, pero con la fuente de verdad en un `.md` legible por humanos y por una IA, en vez de repartida entre `theme.ts` de cada widget.

Estado real: hoy cubre 3 de las 9 BU (`pregrado`, `pregrado-ejecutivo`, `instituto-de-emprendedores`), visible en `/design-md-preview`. Es el enfoque en adopción, ya no una prueba descartable — cualquier trabajo nuevo de theming (y en particular lo que consume el flujo de generación con IA, ver `AI-LANDING-FLOW.md`) debería apoyarse en `design.md`, no en agregar más `theme.ts` sueltos. Extender la prueba a las 9 BU es trabajo pendiente, no un cambio de arquitectura por hacer.

## Widgets: registry, Visor y theming

- **`src/components/widgets/registry.ts`** es el catálogo central: cada widget se registra con `id`, `variants[]`, `defaults`, `component` y opcionalmente `propsAdapter` (traduce props "canónicas" del editor a las props reales del componente). Para agregar un widget nuevo: crear `src/components/widgets/<id>/<Nombre>.astro`, importarlo en `registry.ts` y sumar una entrada al array `widgetRegistry`.
- **`src/pages/index.astro`** es el "Visor" (UI Kit / storybook interno de desarrollo, no público). Por cada combinación widget × variante × modo renderiza una instancia dentro de un `<iframe>` propio apuntando a `widget-preview/[widget]/[variant]/[mode]` — es intencional: así los breakpoints `md:`/`lg:` de Tailwind ven el ancho real del iframe (controlado por el switcher Desktop/Tablet/Mobile), no el del documento contenedor. El editor de props del drawer edita el DOM dentro de cada iframe vía `contentDocument` (mismo origen, sin `postMessage`).
- **`src/pages/widget-preview/[widget]/[variant]/[mode].astro`** es la ruta que sirve una sola instancia aislada; existe solo como infraestructura del Visor, no está pensada para visitarse ni linkearse directamente.
- **`theme.ts`** (uno por widget) centraliza TODAS las clases Tailwind de color por `variant × mode` en un objeto tipado (`Record<Variant, Record<Mode, VariantTheme>>`) más un `baseClasses` compartido (tipografía/layout). Para cambiar un color de un widget: editar solo su `theme.ts`, nunca hardcodear clases de color en el `.astro`. Este es el patrón vigente en los widgets ya construidos; ver la sección `design.md` de arriba para el enfoque hacia el que se está migrando.
- **`src/data/design-md/*.md` + `src/lib/design-md.ts`** — fuente estructurada de color+tipografía+roles por BU (ver sección `design.md` arriba). `src/pages/design-md-preview.astro` + `src/layouts/DesignMdPreviewLayout.astro` renderizan el visor de prueba.
- **`src/migrar/`** guarda el HTML/JS/imágenes originales de V1 que todavía se están portando a componentes Astro — es referencia de migración, no se importa desde código nuevo. No confundir con `design-md/`, que sí es infraestructura activa.

## Convenciones de código

### Componentes Astro

- TypeScript estricto siempre (interface Props definida, props con tipos)
- Slots con nombre cuando hay más de uno (`<slot name="header" />`)
- Componentes en `PascalCase.astro` (Hero.astro, Button.astro)
- Props con valores por defecto cuando aplica
- Componentes puros y reusables, sin lógica de fetch hardcodeada (reciben props)

```astro
---
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const { title, variant = 'primary' } = Astro.props;
---

<section class="bg-bu-surface text-bu-neutral py-16">
  <h2 class="text-3xl font-bold">{title}</h2>
</section>
```

### Tailwind v4

- Usá utility classes siempre que sea posible (utility-first)
- No crees clases CSS custom salvo que sea estrictamente necesario
- Para tokens del design system: usá los `bu-*` directamente (NO crees nuevas variables sin discutirlo)
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Clases comunes: `container` para limitar ancho, `bg-bu-surface` para fondos, `text-bu-neutral` para texto principal
- Path aliases (`tsconfig.json`): `@/*` → `src/*`, `@components/*`, `@layouts/*`, `@lib/*`, `@data/*`

### TypeScript

- Strict mode activo
- Interfaces explícitas para Props
- Tipos del cliente WP en `lib/wp-api.ts`
- Nunca uses `any` — definí tipos correctamente

### Consumir datos de WP

```typescript
import { getLandingBySlug } from '@lib/wp-api';

const landing = await getLandingBySlug('admision-2026');
if (!landing) return Astro.redirect('/404');
```

## Comandos esenciales

| Acción | Comando |
|---|---|
| Instalar dependencias | `pnpm install` (desde la raíz del repo) |
| Dev server | `pnpm dev` (puerto 4321, `--host` para red local) |
| Build producción | `pnpm build` (genera `dist/`) |
| Preview del build | `pnpm preview` |
| Type check (Astro) | `pnpm check` |
| Type check (Astro + tsc) | `pnpm typecheck` |

## Hacer y NO hacer

### ✅ HACER
- Usar tokens `bu-*` para todos los colores (nunca hex hardcoded)
- Validar que el cambio funciona en múltiples BU cambiando `data-bu` en el componente
- Mantener los JSONs en `src/data/` sincronizados con los cambios del design system
- Hacer `npx astro check` antes de commit para validar TypeScript
- Documentar componentes complejos con comentarios en el código
- Usar nombres semánticos para los componentes (Hero, CardSection, Footer)
- Pensar en responsive desde el inicio (mobile-first)

### ❌ NO HACER
- NO usar `@astrojs/tailwind` (eso es Tailwind v3, ya migramos a v4)
- NO usar `npm` ni `npm install` (siempre `pnpm`)
- NO hardcodear colores hex (`#002663`) en componentes — usar siempre `bg-bu-primary`
- NO crear un nuevo CPT en WordPress sin discutirlo con el equipo
- NO modificar archivos en `src/widgets/` (es legacy de Vite + Tailwind v3)
- NO modificar el plugin PHP en `wp-plugin/`
- NO agregar dependencias sin justificar el uso
- NO usar `any` en TypeScript
- NO commitear sin antes validar que el build funcione

## Convenciones de Git

- Mensajes de commit en español, lowercase, imperativo: "agrego componente hero", "corrijo token de color"
- Branch names: `feature/descripcion-corta`, `fix/descripcion`, `chore/descripcion`
- Commits atómicos (un cambio lógico por commit)

## Cuando recibas una solicitud

1. **Si es del IA app (preview aprobado)**: reconstruir la landing en WP + Astro según el preview
2. **Si es un bug**: reproducir primero, después arreglar, después validar
3. **Si es una feature nueva**: analizar impacto en design system, proponer approach, esperar OK antes de implementar
4. **Si tenés dudas sobre el design system**: `src/styles/global.css` es la fuente de verdad de los tokens `bu-*` que consumen los widgets ya construidos (el histórico `src/v2/` vive en el repo padre `usil-widgets`, no en este checkout). Para theming nuevo, mirar primero `src/data/design-md/*.md` — es el enfoque en adopción, ver sección "`design.md` por BU" más arriba.

## Glosario del proyecto

- **BU (Business Unit)**: Unidad de Negocio. 9 definidas hoy con bloque `[data-bu]` en `global.css`: pregrado, pregrado-ejecutivo, instituto-de-emprendedores, posgrado, csir, siu, coloring-dreams, usil-paraguay, usil-corporativo. (`ejecutivo` y `emprendedores` sueltas aparecían en versiones previas del glosario pero no tienen bloque propio — antes de usarlas verificar si ya existen en `global.css`/`bu-colors.json`.)
- **Design System V2**: Sistema basado en 5 colores por BU con tokens CSS variables — el mecanismo `data-bu` que usan tanto `bu-*`/`theme.ts` como `design.md`
- **Token `bu-*`**: Variable CSS que cambia según la BU del `<body data-bu="...">` — origen de verdad para los widgets ya construidos
- **`design.md` por BU**: Documento estructurado (`src/data/design-md/*.md`) con color (mismos 5 roles que `bu-*`) + tipografía + roles tipográficos por BU; enfoque de theming en adopción hacia adelante, hoy cubre 3 de 9 BU — ver sección "`design.md` por BU" arriba
- **Widget-level alias**: Token redirigible por BU (ej. `--bu-widget-card-bg`)
- **Headless CMS**: WP usado solo como backend de datos, sin renderizar frontend
- **IA App**: Aplicación que Marketing usa para solicitar landings (Gemini en dev, Bedrock en prod) — ver `AI-LANDING-FLOW.md` para el flujo E2E completo de generación con IA

## Información de contacto del proyecto

- Marketing solicita landings vía app con IA
- Dev valida previews y construye en WP + Astro
- DevOps maneja infraestructura (AWS, SiteGround, GitHub Actions)
- Repo: este mismo directorio