---
phase: quick/260803-mgb-migrar-widget-7-bloque-ponentes-testimon
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/widgets/7-bloque-ponentes-testimonios/theme.ts
  - src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro
  - src/components/widgets/registry.ts
  - src/data/widgets-catalog.json
autonomous: false
requirements: [MIG-W7]

estimate:
  tokens: 90000
  raw_tokens: 45000
  tasks: 4
  confidence: low

must_haves:
  truths:
    - "El Visor lista '7. Bloque Ponentes / Testimonios' en el sidebar y puede alternar sus 3 variantes y 2 modos."
    - "Las 6 combinaciones variante × modo se prerenderizan como rutas estáticas de /widget-preview sin errores de build."
    - "v7.4 con 5 ponentes por default arranca como carrusel Swiper (supera el threshold de 4)."
    - "v7.5 con 4 ponentes por default se queda como grid (no supera el threshold)."
    - "Ningún color hex del legacy queda hardcodeado en el .astro — todos viven en theme.ts como tokens bu-*."
    - "La IA app puede leer del catálogo qué props generar para el widget de ponentes."
  artifacts:
    - src/components/widgets/7-bloque-ponentes-testimonios/theme.ts
    - src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro
    - "entrada '7-bloque-ponentes-testimonios' en src/components/widgets/registry.ts"
    - "entrada 'ponentes-testimonios' en src/data/widgets-catalog.json"
  key_links:
    - "registry.ts → getStaticPaths() de src/pages/widget-preview/[widget]/[variant]/[mode].astro (genera las 6 rutas)"
    - "clases .hk-title / .hk-title-soporte / .hk-desc → controles del drawer en src/pages/index.astro (líneas 1368-1380)"
    - "<script> del .astro → initDynamicCarousel de src/lib/carousel-manager.ts vía alias @lib"
    - "defaults del componente (no del registry) → render del preview, porque computeWidgetInstanceProps() sin propsAdapter NO propaga titleSupport ni ponentes"
---

<objective>
Migrar el widget legacy `src/migrar/7-bloque-ponentes-testimonios/` (Vite + JS plano,
3 variantes) al patrón Astro + Tailwind v4 + Design System V2, y registrarlo en el
Visor y en el catálogo que consume la IA app.

Purpose: Cada widget migrado se ve y funciona igual en las 9 BUs y en los 2 modos
(claro/oscuro) sin colores hardcodeados — es el core value del proyecto.
Output: `theme.ts` + `BloquePonentesTestimonios.astro` nuevos, más 2 ediciones
puntuales (`registry.ts`, `widgets-catalog.json`).

**Este plan implementa un spec ya aprobado por el usuario**
(`C:\Users\jmadrid\.claude\plans\usa-superpowers-para-definir-hidden-tome.md`).
No re-derivar el approach: nombres de archivo, nombres de prop, estructura de tokens
y schema del catálogo ya están decididos. Si algo del legacy no encaja, preguntar —
no improvisar.
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.agents/skills/migrate-widget-v1-to-v2/SKILL.md

# Spec aprobado — fuente de verdad de este plan
@C:\Users\jmadrid\.claude\plans\usa-superpowers-para-definir-hidden-tome.md

# Fuente legacy a migrar
@src/migrar/7-bloque-ponentes-testimonios/template.html
@src/migrar/7-bloque-ponentes-testimonios/index.js

# Patrones a imitar
@src/components/widgets/6-cards-items/theme.ts
@src/components/widgets/6-cards-items/CardsItems.astro
@src/components/widgets/5-save-the-date/SaveTheDate.astro

# Archivos a editar
@src/components/widgets/registry.ts
@src/data/widgets-catalog.json
</context>

<interface_context>
Contratos ya existentes que el widget nuevo debe cumplir (no modificarlos):

**`initDynamicCarousel` (src/lib/carousel-manager.ts), importable como `@lib/carousel-manager.ts`:**
```ts
interface DynamicCarouselOptions {
  container: HTMLElement | null;
  itemSelector: string;          // ej: '.hk-card-7-4'
  threshold?: number;            // default 4 — activa si items.length > threshold
  swiperConfig?: SwiperOptions;
  removeClasses?: string[];      // default: ['flex','flex-wrap','grid','justify-center','gap-4','gap-8','gap-y-8','sm:gap-[2px]']
  onInit?: (swiper: Swiper, outerWrapper: HTMLElement) => void;
}
function initDynamicCarousel(opts: DynamicCarouselOptions): Swiper | undefined;
```
`filterItems()` solo mira **hijos directos** de `container` — el item con
`itemSelector` tiene que ser hijo directo del grid.

**`computeWidgetInstanceProps` (registry.ts, líneas 110-140)** — sin `propsAdapter`
pasa EXACTAMENTE `{ title, description, variant, id, mode }` al componente.
`titleSupport` y cualquier prop custom **NO llegan**. Consecuencia crítica para
Task 1: los defaults reales de render viven en el `.astro`, no en el registry.

**Controles del drawer (src/pages/index.astro, líneas 1368-1380)** — live-edit por
selector DOM dentro del iframe:
- `title` → `doc.querySelector('.hk-title').textContent = valor`
- `description` → `doc.querySelector('.hk-desc, .hk-paragraph-6-8, .hk-text-paragraph').innerHTML = valor`
- `titleSupport` → `doc.querySelector('.hk-title-soporte').textContent = valor`

**`defaultCardsFor()` (index.astro, línea 54)** — `w.variants[].cards ?? w.defaults.cards`.
Si ninguno existe devuelve `undefined` y el drawer no renderiza editor de cards.
Por eso la entrada del registry NO declara `cards` (decisión del spec).

**Rutas de preview (src/pages/widget-preview/[widget]/[variant]/[mode].astro)** —
`getStaticPaths()` itera `widgetRegistry` × `variants` × `['light','dark']`.
Build `output: 'static'`, `build.format` default `directory` → cada ruta se emite
como `dist/widget-preview/<id>/<variant>/<mode>/index.html`. No hay que tocar
este archivo ni `index.astro`.
</interface_context>

<tasks>

<task type="tracer">
  <name>Task 1: Slice end-to-end — theme.ts + v7.2 + registro, una variante viva</name>
  <files>
    src/components/widgets/7-bloque-ponentes-testimonios/theme.ts,
    src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro,
    src/components/widgets/registry.ts
  </files>
  <read_first>
    src/migrar/7-bloque-ponentes-testimonios/template.html (líneas 1-25, bloque v7.2),
    src/components/widgets/6-cards-items/theme.ts,
    src/components/widgets/5-save-the-date/SaveTheDate.astro
  </read_first>
  <action>
Probar la cadena completa theme → componente → registry → ruta de preview con UNA
sola variante (v7.2), antes de expandir a las otras dos.

**1. `theme.ts`** — mismo patrón y mismo header de comentario que
`6-cards-items/theme.ts`. Exportar `type Mode = 'light' | 'dark'`,
`type Variant = 'v7.2' | 'v7.4' | 'v7.5'`, `interface VariantTheme`,
`export const theme: Record<Variant, Record<Mode, VariantTheme>>` y
`export const baseClasses`.

Keys de `VariantTheme` (las 3 variantes declaran las 10, con `''` donde no aplica —
igual que hace `6-cards-items`): `section`, `title`, `titleSupport`,
`titleSupportBox`, `desc`, `card`, `cardTitle`, `cardText`, `overlay`, `bar`.

Definir los tokens de las 3 variantes ya en este task (el theme completo es barato
y evita reabrir el archivo en Task 2). Traducción legacy → tokens según la tabla del
skill `migrate-widget-v1-to-v2` (`bg-brand-dark`→`bg-bu-primary`,
`text-brand-dark`→`text-bu-primary`, `text-white`→`text-bu-surface`,
`bg-white`→`bg-bu-surface`, y el gris neutro queda como `'bg-[#F0F0F0]'` dentro de
theme.ts). Modo `dark` = inversión de roles con las mismas parejas que ya usa
`6-cards-items`: sección `bg-bu-primary` con textos `text-bu-neutral`, superficies
claras `bg-bu-neutral` con textos `text-bu-primary`.

Valores concretos:
- `v7.2.light`: section `'bg-[#F0F0F0]'`, title `'text-bu-primary'`,
  titleSupportBox `'bg-bu-primary'`, titleSupport `'text-bu-surface'`,
  desc `'text-bu-primary'`, card `'bg-bu-primary'`, cardTitle `'text-bu-surface'`,
  cardText `'text-bu-surface'`, overlay `''`, bar `''`.
- `v7.2.dark`: section `'bg-bu-primary'`, title `'text-bu-neutral'`,
  titleSupportBox `'bg-bu-neutral'`, titleSupport `'text-bu-primary'`,
  desc `'text-bu-neutral'`, card `'bg-bu-neutral'`, cardTitle `'text-bu-primary'`,
  cardText `'text-bu-primary'`, overlay `''`, bar `''`.
- `v7.4.light`: section `'bg-[#F0F0F0]'`, title `'text-bu-primary'`,
  titleSupportBox `'bg-bu-primary'`, titleSupport `'text-bu-surface'`,
  desc `'text-bu-primary'`, card `''`, cardTitle `'text-bu-primary'`,
  cardText `'text-bu-primary'`, overlay `''`, bar `'border-bu-primary'`
  (el token `bar` acá lleva el color del borde de la foto y de la píldora del nombre).
- `v7.4.dark`: section `'bg-bu-primary'`, title `'text-bu-neutral'`,
  titleSupportBox `'bg-bu-neutral'`, titleSupport `'text-bu-primary'`,
  desc `'text-bu-neutral'`, card `''`, cardTitle `'text-bu-neutral'`,
  cardText `'text-bu-neutral'`, overlay `''`, bar `'border-bu-neutral'`.
- `v7.5.light`: section `'bg-bu-primary'`, title `'text-bu-neutral'`,
  titleSupportBox `'bg-bu-neutral'`, titleSupport `'text-bu-primary'`,
  desc `'text-bu-neutral'`, card `''`, cardTitle `'text-bu-primary'`
  (el `<h3>` sobre la foto, legacy `text-brand-dark`), cardText `'text-bu-neutral'`,
  overlay `'bg-bu-primary/80'`, bar `''`.
- `v7.5.dark`: section `'bg-bu-secondary'`, title `'text-bu-neutral'`,
  titleSupportBox `'bg-bu-neutral'`, titleSupport `'text-bu-secondary'`,
  desc `'text-bu-neutral'`, card `''`, cardTitle `'text-bu-neutral'`,
  cardText `'text-bu-neutral'`, overlay `'bg-bu-secondary/80'`, bar `''`.

`baseClasses` compartidas (tipografía/layout, sin color): `section`
(`'relative py-16 w-full transition-opacity duration-300 md:py-24 font-montserrat'`),
`container`, `titleFont` (`'font-anton text-anton-block-title-mobile md:text-anton-block-title'`),
`titleSupportFont`, `bodyFont`, `cardTitleFont`, `cardTextFont`, `cardItemTextFont`,
y helpers de layout por variante (`cardBaseV72`, `cardBaseV74`, `cardBaseV75`) con
las clases estructurales copiadas del legacy.

**2. `BloquePonentesTestimonios.astro`** — solo el bloque de v7.2 en este task.
Header de comentario con el bloque `ACF (WordPress)` (mapa prop → tipo ACF) y
`Comportamiento`, como en `CardsItems.astro`.

Exportar la interface del spec:
```ts
export interface PonenteItem {
  nombre: string;
  cargo?: string;
  descripcion?: string;
  foto?: string;
  bandera?: string;
  subtitulo?: string;
  overlayTitle?: string;
  overlayDesc?: string;
  href?: string;
}
```
`interface Props`: `title`, `titleSupport?`, `description?`, `ponentes?: PonenteItem[]`,
`variant?: Variant`, `mode?: Mode`, `id?: string`. Cada prop con JSDoc.

Defaults en el destructuring de `Astro.props` — **acá está el punto crítico**: como no
hay `propsAdapter`, `computeWidgetInstanceProps()` no propaga `titleSupport` ni
`ponentes`, así que los valores que se ven en el preview son los defaults del propio
componente (patrón `SaveTheDate.astro`). Por eso `titleSupport` debe defaultear a
`'resaltar beneficios'` — el mismo string que va en `registry.defaults` — para que el
input del drawer y el render del iframe arranquen sincronizados. Con `titleSupport = ''`
la caja resaltada nunca aparecería en las rutas de preview.

`ponentes` defaultea por variante mediante un helper local que devuelve el set correcto
según `variant`, con longitudes fijadas por el spec: **1 para v7.2, 5 para v7.4
(dispara el carrusel), 4 para v7.5 (queda como grid)**. Fotos vía `placehold.co` con
los mismos tamaños del legacy (200x200 en v7.2, 160x160 + bandera 57x57 en v7.4,
375x429 en v7.5) y `href` default `'#'`.

Resolver `const tokens = theme[variant][mode]` una sola vez.

Markup de v7.2 — replicar la jerarquía del legacy (`template.html` líneas 1-25) tal
cual, cambiando solo colores por tokens:
- `<section>` con `id={id}`, `data-widget="ponentes-testimonios"`,
  `data-variant={variant}`, `data-mode={mode}`,
  `class:list={[baseClasses.section, tokens.section]}`.
- `<h2>` con la caja resaltada adentro; el `<span>` interior lleva la clase
  `hk-title` (y NO `hk-title-soporte`), porque en v7.2 el título completo vive dentro
  de la caja y no hay título de soporte separado — así el control "Título" del drawer
  edita ese span sin destruir la caja.
- `<p>` de descripción con las clases `hk-card-text` (legacy) **más** `hk-desc`, para
  que el control "Descripción" del drawer lo encuentre.
- Card grande: `.hk-card-ponente` con `tokens.card`, `<img class="hk-ponente-foto">`,
  `.hk-box-contenido` con `.hk-ponente-nombre` / `.hk-ponente-cargo` /
  `.hk-ponente-descripcion` usando `tokens.cardTitle` / `tokens.cardText`.
  Renderizar desde `ponentes[0]`, con guarda para el caso de array vacío
  (`noUncheckedIndexedAccess` está activo — el índice devuelve `PonenteItem | undefined`).

Preservar TODAS las clases `hk-*` del legacy. Cero hex en el `.astro`. Cero `any`.
Todavía sin `<script>` (llega en Task 2).

**3. `registry.ts`** — importar el componente junto a los otros imports y agregar la
entrada al final de `widgetRegistry` (el orden define el sidebar), exactamente como
la define el spec: `id: '7-bloque-ponentes-testimonios'`,
`name: '7. Bloque Ponentes / Testimonios'`, la `description` del spec, las 3
`variants` con sus labels (`'7.2 — Ponente único'`, `'7.4 — Grid con bandera'`,
`'7.5 — Grid con hover'`), `defaultVariant: 'v7.2'`, y `defaults` con `title`,
`titleSupport`, `description` y `mode: 'light'`.
**Sin `propsAdapter` y sin `cards`** en `defaults` ni en `variants` — es una decisión
del spec: mantiene `defaultCardsFor()` en `undefined` para que el drawer no monte el
editor genérico `cards6`, que está cableado a los selectores DOM de `6-cards-items`.
  </action>
  <verify>
    <automated>cd "D:/laragon/www/github/usil-widgets/generador-landings" && pnpm check && pnpm build && test -f dist/widget-preview/7-bloque-ponentes-testimonios/v7.2/light/index.html && test -f dist/widget-preview/7-bloque-ponentes-testimonios/v7.2/dark/index.html && grep -q 'data-widget="ponentes-testimonios"' dist/widget-preview/7-bloque-ponentes-testimonios/v7.2/light/index.html && grep -q 'hk-card-ponente' dist/widget-preview/7-bloque-ponentes-testimonios/v7.2/light/index.html && grep -q 'resaltar beneficios' dist/widget-preview/7-bloque-ponentes-testimonios/v7.2/light/index.html</automated>
  </verify>
  <done>
`pnpm check` reporta 0 errors / 0 warnings / 0 hints. `pnpm build` termina sin errores
y emite las 6 rutas del widget (las de v7.4/v7.5 todavía renderizan vacío, es
esperado). El HTML de v7.2 light contiene la sección con `data-widget`, la card
`.hk-card-ponente` y el texto de la caja resaltada — confirmando que theme, componente,
registry y `getStaticPaths()` están conectados end-to-end.
  </done>
</task>

<task type="auto">
  <name>Task 2: Expandir a v7.4 y v7.5 + wiring del carrusel</name>
  <files>src/components/widgets/7-bloque-ponentes-testimonios/BloquePonentesTestimonios.astro</files>
  <read_first>
    src/migrar/7-bloque-ponentes-testimonios/template.html (líneas 27-201),
    src/migrar/7-bloque-ponentes-testimonios/index.js (líneas 110-158),
    src/components/widgets/6-cards-items/CardsItems.astro (bloque `<script>` final)
  </read_first>
  <action>
Agregar al mismo `.astro` los dos bloques condicionales restantes, siguiendo la
estructura de `CardsItems.astro` (un `{variant === 'vX' && (...)}` por variante) y
replicando el markup legacy sin refactorizarlo.

**v7.4** (`template.html` líneas 27-120):
- `<h2 class="... hk-title ...">` con el texto plano de `title` seguido de la caja
  `.hk-caja-titulo` (`tokens.titleSupportBox`) que envuelve el
  `<span class="... hk-title-soporte ...">` con `titleSupport` — idéntico a v6.3 de
  `CardsItems.astro`.
- Grid `.ponentes-grid-v7-4` con las clases del legacy
  (`flex flex-wrap gap-8 justify-center items-start mx-auto w-full`).
- Cada item mapeado desde `ponentes`, con la clase `.hk-card-7-4` como **hijo directo
  del grid**. Es un rename deliberado del `.hk-card` genérico del legacy, para que el
  selector no colisione con las cards de otros widgets. Dentro: foto 160x160 con
  `.hk-ponente-foto` y borde desde `tokens.bar`, bandera absoluta en
  `.hk-bandera-icon` / `.hk-ponente-bandera` (renderizar el bloque de bandera solo si
  `ponente.bandera` existe), píldora `.hk-ponente-nombre` con borde de `tokens.bar`,
  `.hk-ponente-subtitulo` y `.hk-ponente-descripcion` con `tokens.cardTitle` /
  `tokens.cardText`.
- v7.4 no tiene párrafo de descripción en el legacy — no agregarlo. El control
  "Descripción" del drawer queda inerte en esta variante, igual que el legacy.

**v7.5** (`template.html` líneas 123-201):
- Bloque de título alineado a la izquierda dentro del `container`: `<h2>` con
  `.hk-title`, caja `.hk-caja-titulo` + `<span class="hk-title-soporte">`, y el `<p>`
  intro con las clases del legacy más `hk-desc` (el legacy lo llama
  `.hk-desc-intro`; preservar ambas).
- El grid `.hk-ponentes` va **fuera del `container`**, con las clases exactas del
  legacy: `2xl:w-[70%] xl:w-[90%] lg:w-[90%] w-[90%] mx-auto hk-ponentes grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-[2px]`.
  Esas clases tienen que coincidir literalmente con el `removeClasses` del script.
- Cada item `.hk-box-ponente group` como hijo directo del grid: contenedor
  `aspect-[375/429]` con la foto (`.hk-ponente-foto`, `lg:group-hover:scale-110`),
  el `<a href={ponente.href ?? '#'}>` overlay con `tokens.overlay` y las clases de
  transición del legacy (`.hk-overlay-container`, `.hk-overlay-title`,
  `.hk-overlay-desc`), el `<h3 class="... hk-ponente-nombre ...">` absoluto con
  `tokens.cardTitle`, y el bloque mobile (`lg:hidden`) con `.hk-mobile-name`,
  `.hk-mobile-highlight` y `.hk-mobile-desc`.

**`<script>` al final del archivo** (después del cierre del último bloque), con el
mismo patrón que el de `CardsItems.astro` pero sin lógica de revert ni live-edit de
cards, porque este widget no expone editor de cards:
- Importar `initDynamicCarousel` desde `@lib/carousel-manager.ts`.
- Definir `initCarousels()` que recorre
  `section[data-widget="ponentes-testimonios"][data-variant="v7.4"]` y llama
  `initDynamicCarousel` con `container: section.querySelector('.ponentes-grid-v7-4')`,
  `itemSelector: '.hk-card-7-4'`, `threshold: 4`, `swiperConfig: { spaceBetween: 20,
  breakpoints: { 550: { slidesPerView: 2 }, 850: { slidesPerView: 3 }, 1000: { slidesPerView: 4 } } }`.
- Y las secciones `[data-variant="v7.5"]` con
  `container: section.querySelector('.hk-ponentes')`,
  `itemSelector: '.hk-box-ponente'`, `threshold: 4`,
  `removeClasses: ['grid','grid-cols-1','sm:grid-cols-2','lg:grid-cols-4','gap-y-8','sm:gap-[2px]']`,
  `swiperConfig: { spaceBetween: 2, breakpoints: { 550: { slidesPerView: 2 }, 850: { slidesPerView: 3 }, 1000: { slidesPerView: 4 } } }`.
  Estos valores replican 1:1 `initVariant74` / `initVariant75` de `index.js`.
- Invocar `initCarousels()` y registrar `document.addEventListener('astro:page-load', initCarousels)`.
- Tipar los `querySelector` para no caer en `any` (el `container` de la opción acepta
  `HTMLElement | null`, así que usar `querySelector<HTMLElement>(...)`).

Cero hex nuevos en el `.astro`: cualquier color que aparezca en el legacy y no tenga
token todavía se agrega a `theme.ts`, no acá.
  </action>
  <verify>
    <automated>cd "D:/laragon/www/github/usil-widgets/generador-landings" && pnpm check && pnpm build && for v in v7.2 v7.4 v7.5; do for m in light dark; do test -f "dist/widget-preview/7-bloque-ponentes-testimonios/$v/$m/index.html" || { echo "FALTA $v/$m"; exit 1; }; done; done && test "$(grep -o 'hk-card-7-4' dist/widget-preview/7-bloque-ponentes-testimonios/v7.4/light/index.html | wc -l)" -ge 5 && test "$(grep -o 'hk-box-ponente' dist/widget-preview/7-bloque-ponentes-testimonios/v7.5/dark/index.html | wc -l)" -ge 4 && grep -q 'hk-title-soporte' dist/widget-preview/7-bloque-ponentes-testimonios/v7.4/light/index.html && grep -q 'hk-desc' dist/widget-preview/7-bloque-ponentes-testimonios/v7.5/light/index.html</automated>
  </verify>
  <done>
`pnpm check` sigue en 0 errores. Las 6 rutas existen en `dist/`. v7.4 emite al menos
5 items `.hk-card-7-4` (supera el threshold de 4 → el carrusel se activa en runtime) y
v7.5 emite al menos 4 items `.hk-box-ponente` (no lo supera → queda grid). Los
selectores del drawer (`hk-title-soporte`, `hk-desc`) están presentes en el HTML
generado de las variantes que los usan.
  </done>
</task>

<task type="auto">
  <name>Task 3: Entrada del widget en widgets-catalog.json</name>
  <files>src/data/widgets-catalog.json</files>
  <read_first>src/data/widgets-catalog.json</read_first>
  <action>
Agregar al array `widgets` la entrada nueva, copiando literalmente el bloque JSON que
define el spec aprobado (sección "`src/data/widgets-catalog.json` (editar)"):
`id: "ponentes-testimonios"`, `name: "Ponentes / Testimonios"`,
`variants: ["v7-2", "v7-4", "v7-5"]` (guiones, no puntos — es la convención del resto
del catálogo), la `description` del spec, y el objeto `props` con
`section_title` / `section_title_support` / `section_body` / `items`, respetando
`type`, `required` y `maxLength` de cada campo tal como están escritos ahí.

Ubicarla después de la entrada `cards` y antes de `form`, para que el orden del
catálogo siga la numeración de widgets.

Los nombres de campo van en snake_case (`foto_url`, `bandera_url`, `overlay_title`,
`overlay_desc`, `cta_url`) — es lo que ya usan `hero` y `cards`. La traducción
snake_case → props del componente Astro NO se hace ahora: es responsabilidad de la
fase de reconstrucción en WP+Astro, y por eso el registry no lleva `propsAdapter`.

Actualizar también `last_updated` a la fecha de hoy. No tocar `version` ni las
entradas existentes.
  </action>
  <verify>
    <automated>cd "D:/laragon/www/github/usil-widgets/generador-landings" && node -e "const c=JSON.parse(require('fs').readFileSync('src/data/widgets-catalog.json','utf8'));const w=c.widgets.find(x=>x.id==='ponentes-testimonios');if(!w)throw new Error('entrada ponentes-testimonios ausente');const need=['v7-2','v7-4','v7-5'];if(need.some(v=>!w.variants.includes(v)))throw new Error('variants incompletas: '+JSON.stringify(w.variants));const p=w.props;['section_title','section_title_support','section_body','items'].forEach(k=>{if(!p[k])throw new Error('falta prop '+k)});if(p.section_title.required!==true)throw new Error('section_title debe ser required');const it=p.items.items;['nombre','cargo','descripcion','foto_url','bandera_url','subtitulo','overlay_title','overlay_desc','cta_url'].forEach(k=>{if(!it[k])throw new Error('falta items.'+k)});console.log('catalogo OK — widgets:',c.widgets.length)"</automated>
  </verify>
  <done>
`widgets-catalog.json` sigue siendo JSON válido, tiene la entrada
`ponentes-testimonios` con las 3 variantes en formato `v7-N`, las 4 props de sección y
los 9 campos de `items` del spec. El script de validación imprime `catalogo OK`.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Validación visual del widget en el Visor</name>
  <what-built>
El widget `7-bloque-ponentes-testimonios` migrado a Astro: `theme.ts` con tokens
`bu-*` para 3 variantes × 2 modos, `BloquePonentesTestimonios.astro` con las 3
variantes y el carrusel Swiper cableado, entrada en `registry.ts` (sin editor de
cards, por decisión de alcance) y entrada en `widgets-catalog.json` para la IA app.
El build valida el HTML generado, pero el resultado visual y el comportamiento del
carrusel solo se confirman en el navegador.
  </what-built>
  <how-to-verify>
1. Levantar el dev server (o reusar el que ya esté corriendo):
   `cd "D:/laragon/www/github/usil-widgets/generador-landings" && pnpm dev`

2. Confirmar que las 6 rutas responden 200:
   ```
   for v in v7.2 v7.4 v7.5; do for m in light dark; do \
     curl -s -o /dev/null -w "$v/$m -> %{http_code}\n" \
     "http://localhost:4321/widget-preview/7-bloque-ponentes-testimonios/$v/$m"; \
   done; done
   ```

3. Abrir `http://localhost:4321/` y en el sidebar entrar a
   "7. Bloque Ponentes / Testimonios". Chequear:
   - Las 3 variantes renderizan sin solapamientos ni overflow, en light y en dark.
   - **v7.4 muestra el carrusel Swiper** con flechas y dots (5 ponentes > threshold 4).
   - **v7.5 se queda como grid de 4** (no debe volverse carrusel).
   - v7.5 en desktop: al pasar el mouse sobre una foto aparece el overlay con
     título + descripción; en mobile (achicar el iframe) el contenido se ve siempre.
   - El drawer NO muestra editor de cards para este widget.
   - Los controles Título / Título de soporte / Descripción del drawer actualizan
     el preview en vivo donde corresponde (Descripción no aplica en v7.4).

4. Cambiar la BU en el sidebar (ej. pregrado → emprendedores) y confirmar que los
   3 layouts repintan con los colores de la BU nueva, sin ningún azul/negro pegado.
  </how-to-verify>
  <resume-signal>Escribí "approved" o describí qué variante/modo se ve mal</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| props del componente → HTML renderizado | Texto que en producción viene de ACF/WordPress y termina en el DOM |
| `widgets-catalog.json` → IA app | Contrato de datos que la IA lee para generar contenido de landing |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-W7-01 | Tampering | `BloquePonentesTestimonios.astro` — render de texto de ponentes | medium | mitigate | Renderizar todo el texto de `PonenteItem` con interpolación normal de Astro (auto-escapada). No usar `set:html` en ningún campo de ponente ni en `description` — regla del skill `migrate-widget-v1-to-v2` ("`set:html` solo para SVG inline") |
| T-W7-02 | Tampering | `<a href={ponente.href}>` en v7.5 | low | mitigate | `href` defaultea a `'#'`; el valor real viene de ACF (backend de confianza, no de input público). Sin `target="_blank"`, así que no aplica `rel="noopener"` |
| T-W7-03 | Information Disclosure | rutas `/widget-preview/*` en el build de producción | low | accept | Ya es una condición preexistente del Visor (documentada en el header de `[mode].astro` como infraestructura interna); este plan no la cambia |
| T-W7-SC | Tampering | instalación de paquetes npm/pnpm | low | accept | El plan no instala dependencias nuevas — `swiper` y `astro` ya están en `package.json`. Si el ejecutor detecta que necesita un paquete nuevo, debe frenar y consultar (CLAUDE.md: "NO agregar dependencias sin justificar el uso") |
</threat_model>

<verification>
1. `pnpm check` → 0 errors / 0 warnings / 0 hints (TypeScript strict + `noUncheckedIndexedAccess`).
2. `pnpm build` → build limpio con las 6 rutas de preview del widget emitidas en `dist/`.
3. `node -e "JSON.parse(...)"` sobre `widgets-catalog.json` → válido y con la entrada nueva completa.
4. Checkpoint humano: 3 variantes × 2 modos en el Visor, carrusel de v7.4 activo,
   grid de v7.5 estático, repintado correcto al cambiar de BU.
5. Grep de control: no debe aparecer ningún literal hex (`#RRGGBB`) ni `any` dentro de
   `BloquePonentesTestimonios.astro` — los colores viven en `theme.ts`, los tipos son explícitos.
</verification>

<success_criteria>
- [ ] `src/components/widgets/7-bloque-ponentes-testimonios/theme.ts` existe con `theme[variant][mode]` para las 3 variantes × 2 modos, solo tokens `bu-*` (más `'bg-[#F0F0F0]'` como único hex permitido) y `baseClasses`.
- [ ] `BloquePonentesTestimonios.astro` renderiza las 3 variantes con la jerarquía del legacy y todas las clases `hk-*` preservadas.
- [ ] `titleSupport` defaultea a `'resaltar beneficios'` en el componente (no solo en el registry), así que la caja resaltada se ve en las rutas de preview.
- [ ] Defaults de `ponentes` hardcodeados en el componente: 1 / 5 / 4 ponentes para v7.2 / v7.4 / v7.5.
- [ ] `<script>` importa `initDynamicCarousel` desde `@lib/carousel-manager.ts` y lo invoca al cargar y en `astro:page-load`.
- [ ] `registry.ts` tiene la entrada del widget sin `propsAdapter` y sin `cards`.
- [ ] `widgets-catalog.json` tiene la entrada `ponentes-testimonios` y sigue siendo JSON válido.
- [ ] `pnpm check` y `pnpm build` pasan sin errores.
- [ ] `src/pages/index.astro` y `src/pages/widget-preview/[widget]/[variant]/[mode].astro` quedan **sin modificar**.
- [ ] `src/migrar/`, `src/widgets/` y `wp-plugin/` quedan **sin modificar**.
- [ ] Checkpoint humano aprobado.
</success_criteria>

<output>
Crear `.planning/quick/260803-mgb-migrar-widget-7-bloque-ponentes-testimon/260803-mgb-SUMMARY.md` al terminar.

Commits atómicos, mensajes en español lowercase imperativo (convención de CLAUDE.md):
- `agrego theme y variante v7.2 del widget ponentes testimonios`
- `agrego variantes v7.4 y v7.5 con carrusel al widget ponentes`
- `agrego widget ponentes al catalogo de la ia app`
</output>
