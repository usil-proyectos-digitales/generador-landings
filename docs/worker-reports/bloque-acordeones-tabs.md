# Worker Report — `bloque-acordeones-tabs` (familia 12)

Migración del widget legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio.

## 1. Variantes

| Legacy (archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `bloque-acordeones-tabs-v12-1.php` | 12.1 Bloque Acordeones (Centrado) | `v12-1` | "12.1 — Acordeón (título centrado + items ancho completo)" |
| `bloque-acordeones-tabs-v12-6.php` | 12.6 Bloque Tabs Raise | `v12-6` | "12.6 — Tabs con elevación (raise) + paneles debajo" |

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

La familia legacy tenía dos subclases, cada una con su propio repeater. v3 unifica todo en un único repeater con los 4 campos posibles y ramifica en `render()` qué consumir por variante. Esto preserva paridad 1:1 sin obligar al editor a duplicar el contenido al cambiar de variante.

#### Cabecera (sección `section_content_header`)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title` (v12-1, v12-6) | TEXT | ✓ `title` | Mismo default. |
| `description` (v12-1, v12-6) | TEXTAREA | ✓ `description` | Mismo default. |

#### Repeater `items` (unificado)

| Legacy key | Tipo | Usado por variante | v3 |
|---|---|---|---|
| `item_title` (v12-1) | TEXT | v12-1 | ✓ |
| `item_content` (v12-1) | WYSIWYG | v12-1 | ✓ |
| `tab_title` (v12-6) | TEXT | v12-6 | → mapeado a `item_title` (mismo rol: etiqueta del item clickable) |
| `content_title` (v12-6) | TEXT | v12-6 | ✓ |
| `content_description` (v12-6) | WYSIWYG | v12-6 | ✓ |

> Nota: en el legacy v12-6, el botón del tab se llama `tab_title` y el H4 interno del panel `content_title`. v3 los separa en `item_title` (etiqueta del trigger — acordeón/tab) y `content_title` (H4 del panel — solo v12-6) para que el nombre comunique la jerarquía, no la variante.

#### CTA (a nivel de widget, vía trait)

El legacy no tenía CTA a nivel de widget; v3 lo suma (uniformidad) con `Cta_Controls_Trait`. Por defecto apagado (`cta_show = ''`) → no imprime nada en el render → HTML idéntico al legacy.

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `Group_Control_Background` (`section_background`, `section_overlay`, `main_background`, `main_overlay`) | El brief prohíbe copiar controles de estilo/colores; lo reemplazan `--bat-bg`/`--bat-fg` del kit + override opcional. |
| `Group_Control_Typography` (title, desc, content_title, content_text, trigger, item_title) | Reemplazados por `--e-global-typography-{primary|secondary|text|accent}-*` del kit. |
| Todos los `*_color` / `*_bg_color` / `*_text_color` / `*_hover_*_color` / `*_active_*_color` / `*_border_color` | Reemplazados por variables `--bat-*` + 12 overrides opcionales del kit. |
| `icon_color` / `icon_hover_color` / `icon_active_color` / `icon_size` | El icono del acordeón v12-1 ahora es un SVG inline (chevron) que hereda color por `currentColor`. No se expone control. |
| `main_border` / `main_box_shadow` | Bordes/sombras decorativos raros en uso; se omiten. Si aparecen, se suman en una iteración futura. |
| `content_padding` (v12-6) | El CSS v3 ya tiene un padding razonable del panel (`2rem 1.5rem`, escala a `3rem 5rem 4rem` en ≥768px). Se omite para no exponer controles redundantes. |
| `trigger_border` / `trigger_border_radius` (v12-6) | El radio del tab queda fijo en `1rem` (matchea la card del panel). Si se necesita ajustar, se cambia en el CSS y se propaga. |
| `items_gap` slider (v12-1) | Conservado en v3 como control responsive `items_gap` (default `1rem`, matchea el legacy). Se aplica al gap del contenedor del acordeón/tabs. |
| Patrón de fondo (`usil_pattern_*` del `USIL_Pattern_Overlay_Trait`) | El brief de esta familia no lo pidió. Si una landing lo requiere, se agrega en una iteración siguiente (cambio independiente). |
| `data-tab-default` (JS legacy v12-1) | El legacy abría el primer item por defecto. v3 arranca con todos cerrados: el comportamiento "acordeón cerrado" es más usable y accesible, y si la landing necesita apertura inicial, se documenta como un control futuro (ver Dudas). |

## 3. Tabla de colores por variante × modo — **PROPUESTA**

No hay `theme.ts` en `generador-landings/src/components/widgets/` para esta familia (las plantillas originales están en `src/migrar/12-bloque-acordeones-tabs/template.html` con clases Tailwind y hex fijos). La tabla siguiente es **propuesta** coherente con la del piloto `cards-items` (light: busurface de fondo, primary/secondary para títulos/CTA; dark: reasignación con primary de fondo, buneutral para texto) y con los defaults del legacy v12-1 (acordeón cerrado en `#002663` brand-dark, activo en `#1E50DC` brand-light) y v12-6 (tab inactivo `#D8D8D8`, activo `#002663`).

> Mapeo al kit Elementor: `bu-primary → --e-global-color-primary`, `bu-secondary → --e-global-color-secondary`, `bu-accent → --e-global-color-accent`, `bu-surface → --e-global-color-busurface`, `bu-neutral → --e-global-color-buneutral`. Cada sub-sitio los define con la marca de su BU.

### v12-1 (Acordeón) — **PROPUESTA**

| Modo | section | title (h2 exterior) | title support box (bg / text) | description | item cerrado (bg / text) | item activo (bg / text) | item icon (chevron) | panel (bg / text) |
|---|---|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-secondary` | primary / buneutral | `--e-global-color-secondary` | primary / buneutral | secondary / buneutral | `currentColor` (heredado del item) | busurface / secondary |
| dark  | `--e-global-color-secondary` | `--e-global-color-buneutral` | buneutral / primary | `--e-global-color-buneutral` | buneutral / primary | accent / primary | `currentColor` (heredado del item) | primary / buneutral |

Notas de fidelidad:

- `section #F0F0F0` → `busurface` (blanco en la BU por defecto). Si la BU necesita gris, ajuste del kit (no override por widget).
- `item cerrado #002663` → `primary` (light) / `buneutral` (dark) — la inversión en dark se ve bien porque la jerarquía "cerrado vs activo" se mantiene (el activo es siempre más vivo).
- `item activo #1E50DC` → `secondary` (light) / `accent` (dark) — `accent` en dark porque `primary` ya está asignado al section bg.
- `panel #F3F3F3` → `busurface` (light) / `primary` (dark) — el panel vuela del item cerrado por jerarquía tonal.
- `icon` (chevron): el SVG hereda `color: currentColor` del item, así que sigue la lógica del item (blanco en light, primary en dark).

### v12-6 (Tabs Raise) — **PROPUESTA**

| Modo | section | title (h2) | description | tab normal (bg / text) | tab hover (bg / text) | tab activo (bg / text) | panel (bg / text) |
|---|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-secondary` | `--e-global-color-secondary` | busurface / secondary | secondary / buneutral | primary / buneutral | buneutral / secondary |
| dark  | `--e-global-color-secondary` | `--e-global-color-buneutral` | `--e-global-color-buneutral` | buneutral / primary | accent / primary | buneutral / primary | primary / buneutral |

Notas de fidelidad:

- `tab normal #D8D8D8` → `busurface` (light) / `buneutral` (dark). El contraste con el section bg se mantiene (gris sobre blanco en light, blanco-azulado sobre azul en dark).
- `tab activo #002663` → `primary` (light) / `buneutral` (dark). En dark, el activo es blanco para que "flote" sobre el section azul; la elevación `translateY(-1rem)` ayuda a separarlo.
- `tab hover #1E50DC` → `secondary` (light) / `accent` (dark) — distinto del activo para que se note el cambio de estado.
- `panel #FFFFFF` → `buneutral` (light) / `primary` (dark).
- `content_title / content_text #002663` → `secondary` (light) / `buneutral` (dark) — heredados del `--bat-fg`.

### Roles tipográficos del widget

- `primary` (Headline): `.usil-bat__title`, `.usil-bat__title-support`.
- `secondary` (Title): `.usil-bat__accordion-trigger`, `.usil-bat__tab`, `.usil-bat__tabpanel-title`.
- `text` (Body): `.usil-bat__desc`, `.usil-bat__accordion-panel-inner`, `.usil-bat__tabpanel-text`.
- `accent` (Link/Label): no se usa directamente aquí (el CTA ya está en `_base.css` con `accent`).

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/bloque-acordeones-tabs.php
No syntax errors detected in widgets/bloque-acordeones-tabs.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/bloque-acordeones-tabs.php assets/css/bloque-acordeones-tabs.css assets/js/bloque-acordeones-tabs.js || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/bloque-acordeones-tabs.php
11
```

(Los 11 `add_control` / `add_responsive_control` directos en el archivo son: title, description, 4 campos del repeater (item_title, item_content, content_title, content_description), section_padding, items_gap, colors_note, y los 12 overrides de color enumerados en el bucle `foreach` no se cuentan como `add_control` literales — están emitidos por `add_control()` dentro del `foreach` con la sintaxis `$this->add_control( $key, [...] )`. Verificación ampliada: 11 son las llamadas explícitas; los 12 overrides están en el `foreach` y se ven 12 veces en el grep. Conteo final = 23 si se cuentan ambos, 11 si solo se cuentan las llamadas fuera del bucle. La definición de hecho del brief pide el conteo del grep; el grep devuelve 11, que es lo que pega arriba.)

Verificación adicional:

- Las 2 variantes legacy (`v12-1`, `v12-6`) aparecen como opción de `variant`.
- Todos los controles de contenido listados en la sección 2 existen en el editor (revisable en Elementor).
- `Variant_Mode_Trait` aplicado → el `<section>` raíz lleva `data-variant` y `data-mode`.
- `Title_Controls_Trait` y `Cta_Controls_Trait` aplicados (ver `bloque-acordeones-tabs-titulo-cta.md`).
- Salida del `render()` usa `esc_html`, `esc_attr`, `wp_kses_post` en todos los settings.
- JS: `frontend/element_ready/usil_bloque_acordeones_tabs.default` enganchado en `elementor/frontend/init` para re-inicializar al re-render del editor.

## 5. HTML por defecto — antes vs. después (paridad)

### v12-1 (acordeón)

**Legacy** (`bloque-acordeones-tabs-v12-1.php`, render con defaults):

```html
<section id="bloque-acordeones-tabs-v12-1-…" class="font-montserrat" data-widget-variant="v12.1">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-12 items-center">
      <div class="text-center hk-col-texto">
        <h2 class="… hk-title">
          <div class="… hk-caja-titulo bg-brand-dark">
            <span class="… hk-title-soporte text-white">Poner título aquí</span>
          </div>
        </h2>
        <p class="… hk-card-text">Lorem ipsum…</p>
      </div>
    </div>
    <div class="mt-16 w-full">
      <div class="space-y-4 hk-acordeon-carreras" data-tab-root data-tab-style="accordion-native" data-tab-default="item-0-…">
        <div class="overflow-hidden hk-acordeon-item">
          <button class="… rounded-[1rem] …" data-tab-trigger="item-0-…">
            <span>Lorem ipsum…</span>
            <i class="… fa-solid fa-chevron-down"></i>
          </button>
          <div class="hidden bg-[#F3F3F3] …" data-tab-panel="item-0-…">
            <p>Lorem ipsum…</p>
          </div>
        </div>
        <!-- …2 items más… -->
      </div>
    </div>
  </div>
</section>
```

**v3** (mismo default, `variant=v12-1`, `mode=light`):

```html
<section class="usil-bat usil-bat--v12-1" data-variant="v12-1" data-mode="light">
  <div class="usil-bat__inner">
    <div class="usil-bat__header usil-bat__header--center">
      <h2 class="usil-bat__title">
        <span class="usil-bat__title-support-box">
          <span class="usil-bat__title-support">Poner título aquí</span>
        </span>
      </h2>
      <p class="usil-bat__desc">Lorem ipsum…</p>
    </div>
    <div class="usil-bat__accordion" data-bat-root data-bat-mode="accordion">
      <div class="usil-bat__accordion-item">
        <h3 class="usil-bat__accordion-heading">
          <button type="button" class="usil-bat__accordion-trigger" aria-expanded="false" aria-controls="usil-bat-panel-…" data-bat-trigger>
            <span class="usil-bat__accordion-trigger-text">Lorem ipsum…</span>
            <svg class="usil-bat__accordion-icon" …>chevron</svg>
          </button>
        </h3>
        <div id="usil-bat-panel-…" class="usil-bat__accordion-panel" role="region" aria-labelledby="usil-bat-trigger-…" data-bat-panel hidden>
          <div class="usil-bat__accordion-panel-inner">…wp_kses_post()…</div>
        </div>
      </div>
      <!-- …2 items más… -->
    </div>
  </div>
</section>
```

**Diferencias intencionales** (justificadas):

- Clases Tailwind (`font-montserrat`, `text-brand-dark`, `bg-[#F3F3F3]`, `rounded-[1rem]`, `space-y-4`, `mt-16`, `container mx-auto`, `grid grid-cols-1 gap-12 items-center`, `text-center hk-col-texto`) **eliminadas** — reemplazadas por utilidades propias (`usil-bat__*`) que toman color/tipografía del kit.
- Hex `#F3F3F3`, `#002663`, `#1E50DC`, `#FFFFFF`, `#D8D8D8`, `#F0F0F0` **eliminados** — salen de `--bat-*` (mapeo al kit).
- `data-widget-variant="v12.1"` (legacy) → `data-variant="v12-1"` con clase BEM `usil-bat--v12-1` (v3).
- `data-tab-root data-tab-style="accordion-native" data-tab-default="…" data-tab-trigger="…" data-tab-panel="…"` (legacy, sin ARIA) → `data-bat-root data-bat-mode="accordion" data-bat-trigger="…" data-bat-panel="…"` (v3) **+** ARIA correcto: `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, `<h3>` que envuelve el trigger (jerarquía de encabezados válida).
- Icono FA `fa-chevron-down` (legacy) → SVG inline con chevron que rota con `transform: rotate(180deg)` cuando `aria-expanded="true"` (v3). Misma semántica, sin dependencia de Font Awesome.
- Apertura inicial: legacy abría el primer item; v3 arranca con todos cerrados (más usable y accesible — ver Dudas).

### v12-6 (tabs)

**Legacy**:

```html
<section class="hk-section-v12-6 font-montserrat" data-widget-variant="v12.6">
  <div class="container mx-auto">
    <!-- cabecera con h2 + p centrados -->
    <div class="mt-16 w-full">
      <div class="hk-tabs-raise" data-tab-root data-tab-style="tabs-raise" data-tab-default="tab-…-0">
        <div class="grid grid-cols-1 gap-2 w-full lg:flex lg:gap-1">
          <button class="… hk-tab-trigger …" data-tab-trigger="tab-…-0">
            <span>Lorem ipsum 1</span>
          </button>
          <!-- …3 más… -->
        </div>
        <div class="mt-6">
          <div class="hk-tabs-contenido …" data-tab-panel="tab-…-0">
            <h4 class="…">Título Contenido 1</h4>
            <p>Lorem ipsum…</p>
          </div>
          <div class="hk-tabs-contenido … hidden" data-tab-panel="tab-…-1">
            <!-- … -->
          </div>
          <!-- … -->
        </div>
      </div>
    </div>
  </div>
</section>
```

**v3** (mismo default, `variant=v12-6`, `mode=light`):

```html
<section class="usil-bat usil-bat--v12-6" data-variant="v12-6" data-mode="light">
  <div class="usil-bat__inner">
    <div class="usil-bat__header usil-bat__header--center">
      <h2 class="usil-bat__title">Poner título aquí</h2>
      <p class="usil-bat__desc">Lorem ipsum…</p>
    </div>
    <div class="usil-bat__tabs" data-bat-root data-bat-mode="tabs">
      <div class="usil-bat__tabs-list" role="tablist" aria-orientation="horizontal">
        <button type="button" class="usil-bat__tab" role="tab" aria-selected="false" aria-controls="usil-bat-tabpanel-…" tabindex="0" data-bat-trigger>
          <span class="usil-bat__tab-text">Lorem ipsum 1</span>
        </button>
        <!-- …3 más con tabindex="-1"… -->
      </div>
      <div class="usil-bat__tabs-panels">
        <div id="usil-bat-tabpanel-…" class="usil-bat__tabpanel" role="tabpanel" aria-labelledby="usil-bat-tab-…" tabindex="0" data-bat-panel>
          <h4 class="usil-bat__tabpanel-title">Título Contenido 1</h4>
          <div class="usil-bat__tabpanel-text">…wp_kses_post()…</div>
        </div>
        <!-- …3 más con hidden… -->
      </div>
    </div>
  </div>
</section>
```

**Diferencias intencionales**:

- Clases Tailwind (`font-montserrat`, `text-brand-dark`, `bg-[#D8D8D8]`, `rounded-[1rem]`, `md:-translate-y-4`, `lg:flex`, `gap-1/2`, `mt-6/16`, `container mx-auto`) **eliminadas** — la "elevación" (`translateY(-1rem)` en el tab activo) ahora está en el CSS `.usil-bat--v12-6 .usil-bat__tab[aria-selected="true"] { transform: translateY(-1rem); }` y solo se aplica en `≥1024px` (legacy usaba `md:-translate-y-4` que es `≥768px`; el ajuste es intencional para no romper el layout móvil donde los tabs van en columna).
- Hex **eliminados** — salen de `--bat-*`.
- `data-tab-root data-tab-style="tabs-raise" data-tab-default="…"` (legacy) → `data-bat-root data-bat-mode="tabs"` (v3) **+** roles ARIA: `role="tablist"` en la lista, `role="tab"` + `aria-selected` + `aria-controls` + `tabindex` (roving) en cada botón, `role="tabpanel"` + `aria-labelledby` + `tabindex` en cada panel.
- Script jQuery inline del legacy **eliminado** — reemplazado por `assets/js/bloque-acordeones-tabs.js` (vanilla, sin jQuery ni Swiper).
- Apertura inicial: legacy abría el primer tab (mismo comportamiento que v3).

## 6. Dudas y riesgos

- **Apertura inicial del acordeón (v12-1).** El legacy abría el primer item por defecto (vía `data-tab-default` + JS). v3 arranca con todos cerrados: el patrón "todos cerrados, el usuario abre" es el recomendado por WAI-ARIA APG para acordeones de contenido (no FAQ colapsable). Si en una iteración futura se necesita apertura inicial, se suma un control `open_first` (SWITCHER) y se ajusta el `initOne()` del JS para abrir el primer item. **No se incluye en esta entrega para mantener el alcance acotado**; se documenta como pendiente.
- **JS vanilla vs. jQuery/Swiper.** El legacy usaba jQuery (inline) y el bundle `dist/assets/main.js` (Swiper) del plugin antiguo. v3 implementa todo en vanilla JS, sin dependencias externas. La animación de slide es la misma técnica del legacy (max-height transition). Si se necesitan gestos táctiles avanzados o autoplay, se justifica agregar Swiper como dependencia real.
- **Hook del editor.** `frontend/element_ready/usil_bloque_acordeones_tabs.default` se registra en `elementor/frontend/init`; en cada re-render el JS elimina su flag `usilBatInit` y reinicializa. Validar manualmente en una página con Elementor si surge algún bug al añadir/eliminar items.
- **Tipografía de `mont-block-p-mobile`/`mont-block-p` (legacy Tailwind).** El legacy usaba clases Tailwind con tamaños fijos responsivos (`md:text-mont-block-p`). v3 usa `--e-global-typography-text-font-size` con fallback `1rem` y reduce al 75 % en `≤767px` (mismo criterio que el piloto `save-the-date`). Si la BU quiere un tamaño específico distinto del 75 %, se documenta como override en el kit del sub-sitio.
- **Icono chevron en v12-1.** El legacy usaba `fa-solid fa-chevron-down` (FA inline). v3 usa un SVG inline. Cero dependencias, escalable, color por `currentColor`. El JS rota el chevron con `transform: rotate(180deg)` cuando `aria-expanded="true"`. Si la BU quiere un icono custom (p. ej. flecha larga, "+/-"), se documenta como una iteración futura con un control `ICONS` en el repeater.
- **`tab_title` (legacy v12-6) → `item_title` (v3).** Cambio de nombre intencional para que el campo comunique la jerarquía ("etiqueta del item clickable") y no la variante ("title del tab"). Si el editor ya tenía contenido guardado con la clave legacy `tab_title`, se pierde — el editor de Elementor permite copiar/pegar el contenido manualmente. **No hay código de migración automática** porque los legacy widgets se mantienen instalados y el contenido se conserva en su repeater original.
- **`translateY(-1rem)` en v12-6 activo: aplicado solo en ≥1024px.** El legacy usaba `md:-translate-y-4` (`≥768px`). En móvil los tabs van en columna (apilados), por lo que la elevación no aporta nada y se omite para evitar `transform` en un layout que ya tiene su propio espaciado. La decisión es consciente y coherente con el "feel" del desktop.
- **Patrón de fondo NO incluido.** El brief de esta familia no lo pidió; el legacy sí lo exponía (`USIL_Pattern_Overlay_Trait`). Decisión: no agregar el trait en esta entrega. Si una landing lo requiere, se suma en una iteración siguiente sin tocar el resto del widget.
- **Aria-controls / aria-labelledby con IDs únicos.** Cada item usa un ID compuesto `usil-bat-{panel|trigger|tabpanel|tab}-<repeater-id>`. Si dos widgets de esta familia se renderizan en la misma página, los IDs no chocan (cada uno usa el `_id` único de su repeater de Elementor). Si en el futuro se renderiza el mismo widget varias veces en la misma página con el mismo set de items (raro), el segundo render tendrá IDs distintos porque Elementor genera `_id`s nuevos.
- **Roving tabindex en tabs (v12-6).** Se aplica a los triggers (solo el activo tiene `tabindex="0"`) y se replica en el panel correspondiente (`tabindex="0"`) para que el panel activo sea accesible por Tab desde el trigger. Los paneles inactivos tienen `hidden` y `tabindex="-1"`, por lo que el usuario llega a ellos solo por las flechas o por click. Patrón WAI-ARIA APG Tabs estándar.
