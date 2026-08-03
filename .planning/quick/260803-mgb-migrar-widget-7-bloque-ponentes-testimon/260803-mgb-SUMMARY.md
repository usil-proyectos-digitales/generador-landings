---
phase: quick/260803-mgb-migrar-widget-7-bloque-ponentes-testimon
plan: 01
subsystem: ui
tags: [astro, tailwind-v4, design-system-v2, swiper, widgets-catalog]

# Dependency graph
requires:
  - phase: n/a (quick task)
    provides: patrón establecido por 5-save-the-date y 6-cards-items (theme.ts + .astro + registry.ts)
provides:
  - "Widget 7-bloque-ponentes-testimonios migrado a Astro (theme.ts + BloquePonentesTestimonios.astro) con 3 variantes x 2 modos"
  - "Entrada registrada en registry.ts (Visor) y en widgets-catalog.json (IA app)"
affects: [widgets-catalog, visor, migracion-widgets-legacy]

actuals:
  tokens: 7100
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - "Widget sin editor de cards en el drawer (defaults hardcodeados en el .astro, no en registry.ts) — mismo patrón que SaveTheDate.astro, para widgets cuyo contenido real vendrá de ACF/WordPress"
    - "theme[variant][mode] + baseClasses, mismo patrón que 6-cards-items"
    - "initDynamicCarousel (src/lib/carousel-manager.ts) reusado sin cambios para 2 grids distintos del mismo widget"

key-files:
  created:
    - src/components/widgets/7-bloque-ponentes-testimonios/theme.ts
    - src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro
  modified:
    - src/components/widgets/registry.ts
    - src/data/widgets-catalog.json

key-decisions:
  - "En v7.2 el único texto visible (dentro de la caja resaltada) se renderiza con la clase `hk-title` y toma el valor de `titleSupport` (no de `title`) — el legacy no tiene título+soporte separados en esta variante, así que el control 'Título' del drawer termina editando ese único span. `title` queda declarado pero sin uso visual en v7.2 (sí se usa como prefijo de texto en v7.4/v7.5)."
  - "titleSupport defaultea a 'resaltar beneficios' dentro del propio componente (no solo en registry.defaults), porque computeWidgetInstanceProps() sin propsAdapter no propaga titleSupport — sin este default la caja resaltada no se vería en ninguna ruta de preview."
  - "Sin propsAdapter y sin cards en registry.ts — decisión de alcance del spec aprobado: el Visor no necesita editor de cards para este widget, el contenido real llega vía ACF en la fase de reconstrucción WP+Astro."

patterns-established: []

requirements-completed: [MIG-W7]

coverage:
  - id: D1
    description: "theme.ts con tokens bu-* para 3 variantes (v7.2/v7.4/v7.5) x 2 modos (light/dark), sin hex hardcodeado salvo 'bg-[#F0F0F0]'"
    requirement: "MIG-W7"
    verification:
      - kind: automated_ui
        ref: "pnpm build — grep de control sin literales hex ni `any` en BloquePonentesTestimonios.astro"
        status: pass
    human_judgment: false
  - id: D2
    description: "BloquePonentesTestimonios.astro renderiza las 3 variantes (v7.2 ponente único, v7.4 grid con bandera, v7.5 grid con hover) con clases hk-* preservadas del legacy"
    requirement: "MIG-W7"
    verification:
      - kind: automated_ui
        ref: "pnpm build — grep hk-card-ponente / hk-card-7-4 (>=5) / hk-box-ponente (>=4) / hk-title-soporte / hk-desc en dist/widget-preview/7-bloque-ponentes-testimonios/**"
        status: pass
    human_judgment: false
  - id: D3
    description: "Carrusel Swiper vía initDynamicCarousel cableado en v7.4 y v7.5 (threshold 4), invocado en load y en astro:page-load"
    requirement: "MIG-W7"
    verification:
      - kind: manual_procedural
        ref: "Task 4 checkpoint:human-verify — v7.4 muestra carrusel Swiper activo (5 ponentes > threshold 4), v7.5 se queda como grid estático (4 ponentes, no supera threshold)"
        status: pass
    human_judgment: true
    rationale: "El build solo prueba que el <script> compila y que el HTML SSR tiene la cantidad correcta de items; el comportamiento real del carrusel se confirmó en el navegador — humano aprobó el checkpoint (respuesta 'approved')."
  - id: D4
    description: "Widget registrado en registry.ts (sidebar del Visor) sin propsAdapter y sin cards, y en widgets-catalog.json (props que la IA app puede generar)"
    requirement: "MIG-W7"
    verification:
      - kind: unit
        ref: "node -e validación de schema (variants v7-2/v7-4/v7-5, props de sección, 9 campos de items) — imprime 'catalogo OK'"
        status: pass
    human_judgment: false
  - id: D5
    description: "Repintado correcto por BU (todos los colores vía tokens bu-*, sin azul/negro pegado al cambiar de BU) y validación visual completa en el Visor (3 variantes x 2 modos sin overlap, drawer sin editor de cards)"
    verification:
      - kind: manual_procedural
        ref: "Task 4 checkpoint:human-verify — verificación visual de 3 variantes x 2 modos sin overlap, carrusel v7.4 activo, grid v7.5 estático, sin editor de cards en el drawer"
        status: pass
    human_judgment: true
    rationale: "Inspección visual en navegador real — checkpoint humano (Task 4) del plan. Humano respondió 'approved' confirmando las 3 variantes x 2 modos, carrusel v7.4 activo, grid v7.5 estático y ausencia de editor de cards en el drawer."

duration: 14min
completed: 2026-08-03
status: complete
---

# Quick Task 260803-mgb: Migración widget 7 — Bloque Ponentes / Testimonios

**Widget legacy `7-bloque-ponentes-testimonios` (Vite + JS plano) migrado a Astro + Tailwind v4 + Design System V2: theme.ts con tokens `bu-*` para 3 variantes x 2 modos, componente con carrusel Swiper cableado en v7.4/v7.5, y registro en el Visor y en el catálogo de la IA app. Las 4 tasks del plan están completas — checkpoint humano (Task 4) aprobado.**

## Performance

- **Duration:** ~14 min (Tasks 1-3, commits 16:24:14 → 16:27:41) + verificación humana (Task 4)
- **Started:** 2026-08-03T16:22:00-05:00 (aprox.)
- **Completed:** 2026-08-03 — checkpoint humano aprobado
- **Tasks:** 4 de 4 completadas
- **Files modified:** 4 (2 creados, 2 editados)

## Accomplishments

- `theme.ts` nuevo con `theme[variant][mode]` para v7.2/v7.4/v7.5 x light/dark, solo tokens `bu-*` (+ `bg-[#F0F0F0]` como único hex permitido) y `baseClasses` compartidas.
- `BloquePonentesTestimonios.astro` nuevo: 3 variantes con la jerarquía HTML del legacy preservada 1:1 (clases `hk-*` intactas), `PonenteItem` tipado sin `any`, defaults de `ponentes` hardcodeados por variante (1/5/4), y `<script>` que cablea `initDynamicCarousel` (de `@lib/carousel-manager.ts`) en v7.4 y v7.5.
- `registry.ts`: entrada `7-bloque-ponentes-testimonios` agregada al sidebar del Visor, sin `propsAdapter` ni `cards` (decisión de alcance del spec aprobado).
- `widgets-catalog.json`: entrada `ponentes-testimonios` agregada (props de sección + 9 campos de `items` en snake_case), para que la IA app sepa qué generar para este widget.
- `pnpm check` (0 errors / 0 warnings / 0 hints atribuibles a este cambio) y `pnpm build` (6 rutas de preview emitidas, HTML validado con grep) pasan en las 3 tasks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Slice end-to-end — theme.ts + v7.2 + registro** - `1e5cf13` (feat)
2. **Task 2: Expandir a v7.4 y v7.5 + wiring del carrusel** - `e0c815d` (feat)
3. **Task 3: Entrada del widget en widgets-catalog.json** - `2132372` (feat)
4. **Task 4: Validación visual del widget en el Visor (checkpoint:human-verify, gate="blocking")** - sin commit de código (gate de verificación manual) — **aprobado por el humano** ("approved": 3 variantes x 2 modos correctas, carrusel v7.4 activo, grid v7.5 estático, sin editor de cards en el drawer).

_Plan metadata commit: lo aplica el orquestador tras este SUMMARY._

## Files Created/Modified

- `src/components/widgets/7-bloque-ponentes-testimonios/theme.ts` - Tokens `bu-*` por variante x modo + `baseClasses`.
- `src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro` - Componente con 3 variantes + script de carrusel.
- `src/components/widgets/registry.ts` - Import + entrada del widget en `widgetRegistry`.
- `src/data/widgets-catalog.json` - Entrada `ponentes-testimonios` + `last_updated` actualizado.

## Decisions Made

- El texto dentro de la caja resaltada de v7.2 se bindea a `titleSupport` (no a `title`) bajo la clase `hk-title`, porque el legacy de v7.2 no distingue título/soporte — hay un único texto visible. Esto satisface el control "Título" del drawer (que apunta a `.hk-title`) sin duplicar markup. `title` queda como prop requerida sin uso visual en v7.2 (sí se usa en v7.4/v7.5).
- `titleSupport` defaultea a `'resaltar beneficios'` dentro del propio componente — no solo en `registry.defaults` — porque `computeWidgetInstanceProps()` sin `propsAdapter` no propaga `titleSupport` a las props reales del componente.
- Sin `propsAdapter` y sin `cards` en el registro — decisión de alcance heredada del spec aprobado: el drawer del Visor no necesita editor de cards para este widget porque el contenido real de los ponentes se carga vía ACF en WordPress.

## Deviations from Plan

None - plan ejecutado exactamente como estaba escrito (Tasks 1-3). Sin auto-fixes de Reglas 1-3, sin cambios arquitectónicos (Regla 4).

## Issues Encountered

Ninguno durante Tasks 1-3. La única ambigüedad interpretativa fue la resuelta arriba (contenido del `<span class="hk-title">` en v7.2) — resuelta siguiendo el `<verify>` automatizado del propio Task 1 del plan (que exige el literal `'resaltar beneficios'` presente en el HTML renderizado de v7.2), documentada como decisión, no como deviation (no contradice el plan, lo interpreta donde el plan era ambiguo).

## Estado del checkpoint (Task 4 — aprobado)

El plan tiene un cuarto task de tipo `checkpoint:human-verify` con `gate="blocking"` que
requería verificación visual humana en el navegador (imposible de automatizar de forma
confiable: comportamiento de hover, animación del carrusel, repintado por BU).

**Preparación hecha antes del checkpoint:**
- Dev server corriendo en `http://localhost:4321` (proceso existente, pid 13204).
- Las 6 rutas de preview confirmadas en `200`:
  ```
  v7.2/light -> 200   v7.2/dark -> 200
  v7.4/light -> 200   v7.4/dark -> 200
  v7.5/light -> 200   v7.5/dark -> 200
  ```

**Resultado:** el humano verificó las 3 variantes x 2 modos en el Visor y respondió
**"approved"**, confirmando:
- Las 3 variantes renderizan sin overlap/overflow en light y dark.
- v7.4 muestra el carrusel Swiper activo (5 ponentes > threshold 4).
- v7.5 se queda como grid estático (4 ponentes, no supera el threshold).
- El drawer no muestra editor de cards para este widget.

Con esto, las 4 tasks del plan quedan completas.

## Next Phase Readiness

- Widget `7-bloque-ponentes-testimonios` completo y verificado end-to-end: build limpio,
  registrado en el Visor y en el catálogo de la IA app, y aprobado visualmente por el
  humano en las 3 variantes x 2 modos.
- Sin bloqueos pendientes para este quick task. El mapeo `PonenteItem` → snake_case del
  catálogo queda documentado como responsabilidad de la fase de reconstrucción WP+Astro
  (no de este quick task).

---
*Phase: quick/260803-mgb-migrar-widget-7-bloque-ponentes-testimon*
*Completed: 2026-08-03*

## Self-Check: PASSED

Todos los archivos creados (`theme.ts`, `BloquePonentesTestimonios.astro`) y editados
(`registry.ts`, `widgets-catalog.json`) existen en disco. Los 3 commits de task
(`1e5cf13`, `e0c815d`, `2132372`) existen en el historial de git.
