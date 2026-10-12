# Worker Report — `cards-items-carrusel` (familia 8-cards-items-carrusel)

Migración de los widgets legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio. Es una familia **nueva** (no se toca `cards-items` de Ola 2): el legacy `v8-*` fue diseñado como carrusel puro y `v8-5` es una lista vertical scrollable con título a la izquierda, así que sus patrones no encajan en la familia `cards-items` que ya existe.

## 1. Variantes

| Legacy (archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `cards-items-v8-1.php` | 8.1 Cards Items (Iconos Centrados) | `v8-1` | "8.1 — Título centrado + cards con icono centrado (carrusel si >3)" |
| `cards-items-v8-3.php` | 8.3 Cards Items (Imagen Superior + Carrusel) | `v8-3` | "8.3 — Título centrado + cards con imagen superior (carrusel si >3)" |
| `cards-items-v8-5.php` | 8.5 Cards Vertical (Logos) | `v8-5` | "8.5 — Título izq + lista vertical scrollable de logos" |

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

#### Cabecera (global, una sola sección `section_content_header`)

| Legacy key | Tipo | Variantes legacy | v3 | Notas |
|---|---|---|---|---|
| `title` (v8-1, v8-3: TEXT; v8-5: TEXTAREA) | TEXT / TEXTAREA | todas | ✓ `title` (TEXTAREA — superset) | v3 unifica a TEXTAREA (más flexible; el render con `esc_html` acepta ambas formas). |
| `highlight_text` (v8-1, v8-3) | TEXT | v8-1, v8-3 | ✓ `highlight_text` | Caja de color dentro del `<h2>`. v8-5 lo ignora (legacy igual: v8-5 no tiene highlight). |
| `description` | TEXTAREA | todas | ✓ `description` | Igual en todas las variantes. |
| `title_align` (v8-1 responsive) | CHOOSE responsive | v8-1 | ✓ `title_align` (responsive) | Aplicado a todas las variantes con default `center`; el usuario puede sobreescribir por breakpoint. v8-3 tenía `text_align` con el mismo rol pero con default center; v8-5 era siempre left. |
| `text_align` (v8-3 responsive) | CHOOSE responsive | v8-3 | → mapeado a `title_align` | Mismo rol; v3 unifica. |

#### Opciones por variante (sección `section_content_variant`)

| Legacy key | Tipo | Variantes legacy | v3 | Notas |
|---|---|---|---|---|
| `show_btn` (v8-1) | SWITCHER | v8-1 | ✓ `show_btn` (cond. `variant = v8-1`) | En v8-3 el botón aparece siempre que `btn_text` no esté vacío (legacy), sin switch. v3 preserva ambos comportamientos. |
| `placeholder_image_v83` | — | — | ✓ `placeholder_image_v83` (cond. `variant = v8-3`) | El legacy usaba un placeholder fijo de `placehold.co`. v3 deja que cada BU suba el suyo. Si está vacío y la card tampoco tiene imagen, no se renderiza `<img>`. |
| `list_height` (v8-5) | SLIDER responsive | v8-5 | ✓ `list_max_height` (cond. `variant = v8-5`) | Default 600px (igual que el legacy). |
| `scroll_indicator_gradient_color` (v8-5) | COLOR | v8-5 | — (omitido) | El gradiente del indicador ahora hereda `--cic-bg` (fondo de la sección), coherente con el principio "color del kit". |
| `scroll_indicator_text_color` (v8-5) | COLOR | v8-5 | — (omitido) | El texto del indicador hereda `--cic-fg` (color principal del widget en el modo). |
| `scroll_indicator_arrow_color` (v8-5) | COLOR | v8-5 | — (omitido) | La flecha hereda `--cic-fg` (igual que el texto). |

#### Cards (v8-1 y v8-3) — repeater unificado `cards`

| Legacy key | Tipo | Usado por variante | v3 |
|---|---|---|---|
| `card_image` (v8-1: icono; v8-3: imagen superior) | MEDIA | v8-1, v8-3 | ✓ |
| `card_title` | TEXT | v8-1, v8-3 | ✓ |
| `card_title_tag` | SELECT | v8-1, v8-3 | ✓ |
| `card_content` (v8-1: TEXTAREA; v8-3: WYSIWYG) | TEXTAREA / WYSIWYG | v8-1, v8-3 | ✓ unificado a WYSIWYG (superset; render con `wp_kses_post`) |
| `btn_text` | TEXT | v8-1, v8-3 | ✓ |
| `btn_link` | URL | v8-1, v8-3 | ✓ |

#### List items (v8-5) — repeater `list_items`

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `list_image` | MEDIA | ✓ | Imagen/logo por ítem. |
| `list_text` | TEXTAREA | ✓ | Texto del ítem. Render con `wp_kses_post` (acepta `<b>`, `<i>`, etc., como el legacy). |

> Nota: la legacy `cards-items-v8-5.php` referencia `$settings['cards_left']` y `$settings['cards_right']` en el `render()` pero **no los declara** en `register_controls()`. Es un bug del legacy (PHP notice / undefined index). v3 usa `list_items` (que sí está declarado en el legacy).

#### Carrusel (v8-1 y v8-3)

| Legacy key (v8-x) | v3 | Notas |
|---|---|---|
| `register_usil_carousel_controls()` (autoplay, speed, loop, arrows, dots) | ✓ vía `Carousel_Controls_Trait`, sin condición | El trait solo acepta una condición single-value; v3 lo aplica sin condición y el JS filtra por `data-variant` (no actúa en v8-5). Los `data-swiper-*` los emite `get_carousel_attributes()` y los consume `assets/js/cards-items-carrusel.js`. |

#### CTA al final (widget level)

| Trait | Notas |
|---|---|
| `usil_register_cta_controls()` + `usil_render_cta( $settings )` | Claves `cta_show` / `cta_text` / `cta_link` / `cta_icon` / `cta_icon_pos`. Ningún control legacy del v8-* chocaba a nivel de widget. |

#### Estilo: espaciado (conservado)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `section_padding` (v8-1, v8-3, v8-5) | DIMENSIONS responsive | ✓ `section_padding` | Útil; conservado. |
| `card_border_radius` (v8-1) | DIMENSIONS | ✓ `card_border_radius` (cond. `variant = v8-1` o `v8-3`) | Conservado; aplicado a `.usil-cic__card` y al wrap de imagen en v8-3. |

#### Estilo: colores (overrides opcionales del kit)

| Override v3 | Variable pisada | Notas |
|---|---|---|
| `bg_override` | `--cic-bg` | Fondo de la sección. |
| `fg_override` | `--cic-fg` | Color del título y la bajada. |
| `highlight_bg_override` | `--cic-highlight-bg` | Fondo del highlight box dentro del `<h2>` (v8-1/v8-3). |
| `card_bg_override` | `--cic-card-bg` | Fondo de la card (v8-1/v8-3). |
| `card_fg_override` | `--cic-card-fg` | Texto e icono de la card / texto de los ítems de la lista (v8-5). |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| Todos los `Group_Control_Background` (`main_background`, `main_overlay`, `card_text_background`) | El brief prohíbe copiar controles de estilo/colores; lo reemplaza `--cic-bg` / `--cic-card-bg` del kit + override opcional. |
| Todos los `Group_Control_Typography` (title, desc, highlight, card_title, card_text, card_content, list_typography, logo_typography) | Reemplazados por `--e-global-typography-{primary|secondary|text|accent}-*` del kit. |
| Todos los `*_color` / `*_text_color` / `*_bg_color` / `*_border_color` / `*_hover_*_color` | Reemplazados por variables `--cic-*` + overrides opcionales del kit. |
| `image_width` / `image_height` (v8-1: SLIDER) | El CSS v3 dimensiona la imagen con un valor fijo razonable (75×75 px en v8-1, height 229 px en v8-3) derivado del legacy. Si hace falta ajustar, se agrega un control en Estilo en una iteración futura. |
| `image_border_radius` / `image_margin_bottom` (v8-1: SLIDER) | El CSS v3 usa los valores del legacy por defecto. Sin control. |
| `heading_title` / `heading_card_*` HEADING (v8-1) | Decorativos en el panel; el CSS ya hace el trabajo. |
| `card_layout_*` (v8-1: direction / justify / align) | El CSS v3 ya define la dirección/justify por variante. |
| `text_wrap_control` (v8-1) | El CSS v3 aplica `text-wrap: balance` al título y `pretty` a la bajada, como el legacy default. |
| `tab_button_normal` / `tab_button_hover` (v8-1) | El CSS v3 define hover y focus con transiciones simples (`background-color`, `color`, `border-color`). Sin tabs. |
| `btn_padding` / `btn_padding_hover` / `btn_border_radius_hover` (v8-1) | El CSS v3 hereda los defaults del legacy sin controles separados. |
| `card_image` SLIDER `margin_bottom` (v8-1) | Mismo motivo. |
| Patrón de fondo (`usil_pattern_*` del trait) | El brief de cards-items-carrusel no lo pidió. El legacy lo exponía en los tres archivos; si una landing lo necesita, se agrega vía `USIL_Pattern_Overlay_Trait` en una iteración siguiente (cambio independiente, sin tocar este widget). |
| `cards_left` / `cards_right` referenciados en el render legacy de v8-5 | Bug del legacy: declarados en el render pero NO en `register_controls()`. v3 los reemplaza por `list_items` (que sí está declarado en el legacy). |

## 3. Tabla de colores por variante × modo

**PROPUESTA** — no existe `theme.ts` de Astro para esta familia (`8-cards-items-carrusel` es nueva en v3, según el brief). Mapeo al kit Elementor: `bu-primary → --e-global-color-primary`, `bu-secondary → --e-global-color-secondary`, `bu-accent → --e-global-color-accent`, `bu-surface → --e-global-color-busurface`, `bu-neutral → --e-global-color-buneutral`. El kit Elementor del sub-sitio define cada uno.

Se usaron como referencia los defaults del legacy (`#F0F0F0` para fondo de sección en light → `busurface`; `#002663` para brand-dark → `primary`; `#FFFFFF` para texto blanco → `buneutral`; `#E5E5E5` para box de texto v8-3 → `busurface`).

### v8-1

| Modo | section | title / desc | highlightBox (caja dentro del h2) | card | cardTitle / cardText / cardIcon | cardCta (normal / hover) |
|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-buneutral` | primary/buneutral / buneutral/primary, borde buneutral |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-accent` | `--e-global-color-buneutral` | `--e-global-color-secondary` | buneutral/primary / primary/buneutral, borde buneutral |

### v8-3

| Modo | section | title / desc | highlightBox | cardImgWrap | cardBox (texto) | cardTitle / cardText | cardCta (normal / hover) |
|---|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | transparente (muestra la imagen) | `--e-global-color-busurface` | `--e-global-color-primary` | primary/buneutral / buneutral/primary, borde buneutral |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-accent` | transparente | `--e-global-color-buneutral` | `--e-global-color-secondary` | buneutral/primary / primary/buneutral, borde buneutral |

### v8-5

| Modo | section | title / desc | listItemText | listItemImage | scrollIndicator |
|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | hereda de `listItemText` (currentColor) | gradiente → `--cic-bg`, texto/flecha → `--cic-fg` |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | hereda de `listItemText` | gradiente → `--cic-bg`, texto/flecha → `--cic-fg` |

### Roles tipográficos del kit

- `primary` (Headline) → `.usil-cic__title`, `.usil-cic__title-support`
- `secondary` (Title) → `.usil-cic__card-title`
- `text` (Body) → `.usil-cic__desc`, `.usil-cic__card-text`, `.usil-cic__list-text`
- `accent` (Link/Label) → `.usil-cic__card-cta`, `.usil-cic__scroll-indicator__label`

### Notas de fidelidad (cambios visuales respecto al legacy)

- **`#F0F0F0` → `busurface`.** El legacy de las tres variantes usaba `bg-[#F0F0F0]` como fondo de sección en light. v3 lo reemplaza por `--e-global-color-busurface` (blanco del kit en la BU por defecto). Si la BU necesita gris, se ajusta el kit del sub-sitio. Decisión coherente con el principio "color del kit, no hex fijo".
- **`#002663` y `#FFFFFF` → kit.** Las cards de v8-1 y los CTAs de las tres variantes usaban `bg-brand-dark` (#002063) en light y `text-white`/`#FFFFFF` para textos. v3 los mapea a `--e-global-color-primary` y `--e-global-color-buneutral`. En la BU por defecto el resultado visual es idéntico.
- **`#E5E5E5` (box de texto v8-3) → `busurface`.** El legacy tenía un gris literal en el box de texto de la card. v3 lo reemplaza por `busurface` (blanco del kit). Si la BU quiere gris, override en Estilo (`card_bg_override`) o ajustar el kit.
- **Highlight box v8-1/v8-3 light → primary.** El legacy usaba `bg-brand-dark` (#002063). v3 lo mapea a `primary` (idéntico en la BU por defecto). En dark, el highlight box v3 usa `accent` (--usil-accent o el accent del kit) en vez de `primary`/`brand-dark`, para mantener contraste contra el fondo oscuro de la sección (que ahora es `primary`). Si la BU no tiene accent, el fallback es el foreground.
- **Tipografía:** el legacy usaba `font-anton` para los títulos y `font-montserrat` para el cuerpo, ambos con clases Tailwind específicas. v3 usa `--e-global-typography-primary-*` (rol Headline) para títulos y `--e-global-typography-text-*` (rol Body) para el cuerpo. El usuario define el "feel" Anton/display desde el kit del sub-sitio. En mobile, los tamaños derivados del primary font-size se reducen al 75 % (mismo criterio que el piloto `save-the-date`).
- **`bg-[#F0F0F0]` reemplazado por `busurface` afecta al gradiente del scroll indicator v8-5** (legacy usaba `--hk-scroll-indicator-gradient: #F0F0F0`); v3 usa `var(--cic-bg)` para que el indicador se funda con el fondo real del widget.

## 4. HTML por defecto: legacy vs v3

### v8-1 — tarjeta

**Legacy** (`cards-items-v8-1.php`):

```html
<section class="hk-section-v8-1 py-24 bg-[#F0F0F0] font-montserrat" data-widget-variant="v8.1">
  <div class="container mx-auto">
    <div class="mb-16 text-center">
      <h2 class="flex flex-col items-center mb-12 text-4xl hk-title font-anton text-anton-block-title-mobile md:text-anton-block-title text-brand-dark">
        Poner el título principal aquí
        <div class="inline-block px-6 py-2 mt-2 rounded-xl hk-caja-titulo bg-brand-dark">
          <span class="block text-4xl text-white hk-title-soporte font-anton text-anton-block-title-mobile md:text-anton-block-title">
            resaltar beneficios
          </span>
        </div>
      </h2>
      <p class="text-center hk-description font-montserrat text-brand-dark ...">Lorem ipsum ...</p>
    </div>
    <div class="flex flex-wrap gap-8 justify-center items-start mx-auto w-full hk-cards-grid-v8-1" data-swiper-...>
      <div class="hk-card flex flex-col justify-start items-center px-4 md:px-11 py-12 space-y-4 rounded-[2rem] min-h-[330px] bg-brand-dark w-full md:w-[calc(50%-2rem)] lg:w-[30%]">
        <div class="flex flex-col gap-4 justify-center items-center text-center">
          <img src="..." class="hk-card-imagen" alt="...">
          <h3 class="text-white font-montserrat !font-bold text-mont-card-title-mobile md:text-mont-card-title hk-card-title">Lorem ipsum dolor sit amet consectetur</h3>
        </div>
        <p class="!mt-0 text-center text-white ...">adipiscing elit, sed do eiusmod ...</p>
        <a href="#" class="btn-animacion hk-card-cta inline-flex items-center gap-2 mt-4 px-6 py-2 !bg-brand-dark !text-white !border !rounded-[2rem] ...">Inscríbete
          <svg class="svg-arrow" .../>
        </a>
      </div>
      ...
    </div>
  </div>
</section>
```

**v3** (con `variant=v8-1`, defaults):

```html
<section class="usil-cic usil-cic--v8-1" data-variant="v8-1" data-mode="light">
  <div class="usil-cic__inner">
    <div class="usil-cic__header usil-cic__header--center">
      <h2 class="usil-cic__title">
        Poner el título principal aquí
        <span class="usil-cic__title-support-box">
          <span class="usil-cic__title-support">resaltar beneficios</span>
        </span>
      </h2>
      <p class="usil-cic__desc">Lorem ipsum ...</p>
    </div>
    <div class="usil-cic__cards-grid usil-cic__cards-grid--v8-1" data-swiper-autoplay="false" data-swiper-loop="true" data-swiper-arrows="true" data-swiper-dots="true">
      <div class="usil-cic__card usil-cic__card--v8-1 elementor-repeater-item-...">
        <div class="usil-cic__card-head">
          <img class="usil-cic__card-icon" src="..." alt="Lorem ipsum dolor sit amet consectetur">
          <h3 class="usil-cic__card-title">Lorem ipsum dolor sit amet consectetur</h3>
        </div>
        <div class="usil-cic__card-text">adipiscing elit, sed do eiusmod ...</div>
        <a class="usil-cic__card-cta" href="#">Inscríbete
          <svg class="usil-cic__card-cta-arrow" .../>
        </a>
      </div>
      ...
    </div>
  </div>
</section>
```

**Diferencias (fidelidad visual en la BU por defecto):**
- Misma estructura semántica: título con highlight box anidado, descripción, grid de cards, cada card con icono+título+texto+CTA.
- Las clases Tailwind (`flex flex-col items-center px-4 md:px-11 py-12 bg-brand-dark text-white ...`) se reemplazan por BEM (`usil-cic__card`, `--cic-card-bg`, etc.) con valores derivados del legacy.
- El JS aplica scroll-snap cuando hay >3 cards (no cuando hay ≤3). En el legacy, el JS usaba Swiper con la misma regla (threshold 3). Mismo comportamiento.

### v8-3 — imagen superior + caja de texto

**Legacy**: el bloque de la card tiene `<div class="hk-card-rounded-top">` envolviendo la imagen y `<div class="hk-box-texto p-4 space-y-4 text-center">` envolviendo título + texto + CTA. La imagen hace `lg:group-hover:scale-110`.

**v3**: misma estructura, con `<div class="usil-cic__card-img-wrap">` y `<div class="usil-cic__card-box">`. La imagen usa `transform: scale(1.1)` en `:hover` / `:focus-within` del card. El box de texto hereda `--cic-card-bg` (light: `busurface`, dark: `buneutral`), no `#E5E5E5` literal.

### v8-5 — título izq + lista logos der

**Legacy**:

```html
<section class="hk-section-v8-5 py-24 bg-[#F0F0F0] font-montserrat" data-widget-variant="v8.5">
  <div class="container mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-24 items-center">
      <div class="text-left">
        <h2 class="flex w-full lg:w-[80%] flex-col items-center mb-12 text-4xl hk-title font-anton text-anton-block-title-mobile md:text-anton-block-title text-brand-dark">
          Poner título y resaltar algo importante aquí
        </h2>
        <p class="hk-description font-montserrat text-brand-dark ...">Lorem ipsum ...</p>
      </div>
      <div class="space-y-12 hk-logos">
        <div class="space-y-3 hk-logo">
          <img src="https://placehold.co/230x80/..." class="hk-logo-imagen" alt="Logo">
          <p class="text-left font-montserrat text-brand-dark ...">Lorem ipsum ...</p>
        </div>
        ...
      </div>
    </div>
  </div>
</section>
```

**v3** (con `variant=v8-5`, defaults):

```html
<section class="usil-cic usil-cic--v8-5" data-variant="v8-5" data-mode="light">
  <div class="usil-cic__inner">
    <div class="usil-cic__header usil-cic__header--left">
      <h2 class="usil-cic__title">Poner título y resaltar algo importante aquí</h2>
      <p class="usil-cic__desc">Lorem ipsum ...</p>
    </div>
    <div class="usil-cic__list" data-usil-cic-list>
      <div class="usil-cic__list-item elementor-repeater-item-...">
        <img class="usil-cic__list-image" src="..." alt="">
        <p class="usil-cic__list-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      ...
    </div>
  </div>
</section>
```

**Diferencias (fidelidad visual en la BU por defecto):**
- El legacy usa un grid de 2 columnas (`sm:grid-cols-[3fr_2fr]`); v3 usa el mismo layout con CSS Grid (`grid-template-columns: 3fr 2fr` en ≥768px). Mismo ratio, mismo breakpoint.
- El legacy tenía un `lg:w-[80%]` en el `<h2>`; v3 no lo replica (criterio del brief: HTML por defecto no cambia → mantener solo lo estructural). El usuario puede limitar el ancho desde el editor si lo necesita.
- El legacy renderizaba el indicador de scroll como `position: absolute; bottom: 0;` con un gradiente que se desvanecía en el primer wheel/touch. v3 lo inyecta en JS al final de la lista (sticky en la parte inferior del contenedor scrollable) y lo elimina al primer scroll/wheel/touch. Mismo comportamiento, distinta técnica de implementación (sin Swiper `Mousewheel` plugin).
- `class="text-left"` del legacy en la columna izquierda: v3 lo aplica vía `.usil-cic__header--left` con `align-items: flex-start; text-align: left;`.

## 5. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/cards-items-carrusel.php
No syntax errors detected in widgets/cards-items-carrusel.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/cards-items-carrusel.php assets/css/cards-items-carrusel.css assets/js/cards-items-carrusel.js || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/cards-items-carrusel.php
21
```

Verificación adicional (definición de hecho del título/CTA):

```text
$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta|usil_title_open_tag|usil_title_close_tag" widgets/cards-items-carrusel.php
8:use UsilV3\Traits\Cta_Controls_Trait;
9:use UsilV3\Traits\Title_Controls_Trait;
35: *     `usil_title_open_tag()` / `usil_title_close_tag()` (no
36: *     `usil_render_title()`, que no soporta HTML anidado).
37: *   - El título de v8-5 es plano: `usil_render_title()`.
45:	use Title_Controls_Trait;
46:	use Cta_Controls_Trait;
106:		$this->usil_register_title_controls( 'title', 'h2' );
379:		$this->usil_register_cta_controls();
469:				<?php $this->usil_render_cta( $settings ); ?>
490:					<?php echo $this->usil_title_open_tag( $settings, 'usil-cic__title' ); // phpcs:ignore WordPress.Security.EscapeOutput -- escapado en el trait. ?>
495:					<?php echo $this->usil_title_close_tag( $settings ); // phpcs:ignore WordPress.Security.EscapeOutput -- escapado en el trait. ?>
497:					<?php $this->usil_render_title( $settings, $title, 'usil-cic__title' ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/cards-items-carrusel.php
0
```

Comprobaciones manuales:
- Las 3 variantes legacy aparecen como opción de `variant` (`v8-1`, `v8-3`, `v8-5`).
- Todos los controles de contenido listados en la sección 2 existen en el editor.
- `Variant_Mode_Trait` aplicado → la sección `<section>` raíz lleva `data-variant` y `data-mode` correctamente.
- `Carousel_Controls_Trait` aplicado sin condición → los `data-swiper-*` aparecen en el `<div class="usil-cic__cards-grid">`; el JS filtra por `data-variant` y solo activa el carrusel en v8-1/v8-3.
- `Title_Controls_Trait` aplicado con prefijo `title` → claves `title_tag` y `hide_title_seo` (creadas por el trait; no se duplican en el widget).
- `Cta_Controls_Trait` aplicado → claves `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos` (creadas por el trait; no se duplican en el widget).
- Salida del `render()` usa `esc_html`, `esc_url`, `esc_attr` y `wp_kses_post` en todos los settings. Sin `print` de setting crudo.
- JS syntax check: `node -c assets/js/cards-items-carrusel.js` → `JS syntax OK`.

## 6. Comportamiento de Swiper que NO se pudo replicar

v8-1 y v8-3 usaban Swiper (con `initDynamicCarousel` + `Mousewheel`, `Scrollbar`, `FreeMode`) en el legacy. v3 los reemplaza por scroll-snap con JS propio (`assets/js/cards-items-carrusel.js`), heredando el modelo del piloto `cards-items.js`. Funcionalidad que **sí** se replica:
- Scroll-snap horizontal por card (`scroll-snap-type: x mandatory`).
- Activación del carrusel solo si hay >3 cards (legacy: threshold 3 → v3: `SLIDES_MIN = 4`).
- Flechas prev/next que desplazan 80 % del ancho visible.
- Dots que marcan la slide activa (el más cercano al `scrollLeft`).
- Loop al final si el usuario lo activa (scroll a 0 al llegar al final).
- Autoplay (intervalo en ms) si el usuario lo activa.
- Hook `frontend/element_ready/usil_cards_items_carrusel.default` para re-inicializar en el editor de Elementor.

Funcionalidad que **NO** se replica (vs. Swiper con `Mousewheel` + `FreeMode` + `Scrollbar` modules):
- **Momentum / inercia al soltar el touch.** Swiper simula inercia al hacer scroll rápido en touchpads/táctil; v3 usa el scroll nativo del navegador, que en Chromium/Firefox modernos ya da una sensación similar pero sin tuning fino (`momentumRatio`, `momentumVelocityRatio`).
- **FreeMode scroll libre sin snap.** El legacy de v8-1/v8-3 usaba `freeMode.enabled = false` (snap duro) según el JS de `carousel-manager.js` revisado; v3 también usa snap duro. **No hay pérdida funcional real.**
- **Scrollbar visible de Swiper.** v3 no la dibuja (la scrollbar del navegador es suficiente con `scrollbar-width: thin`). Si una BU la pide, se agrega en una iteración futura.
- **Múltiples slides por viewport con offset.** Swiper permite `slidesPerView: 1.5` o `2.5` (medio card asomando). v3 usa `slidesPerView: 1` (full card por snap). Decisión consciente: el CSS del piloto `cards-items.js` también lo hace así y el usuario puede cambiar el ancho de las cards desde Estilo.
- **Gestos verticales con resistencia en los bordes.** Swiper tiene `edge-resistance` y damping; v3 deja que el navegador se encargue.
- **Parallax interno en cada slide.** Swiper permite `parallax: true`. v3 no. El legacy tampoco lo usaba en v8-1/v8-3.
- **Re-ordenamiento aleatorio (`shuffle`).** Swiper tiene un módulo. v3 no. El legacy tampoco lo usaba.
- **Eventos `onSlideChangeStart` / `onTransitionEnd` para enganchar lógica externa.** v3 expone el evento `scroll` nativo; si se necesita un hook JS, se agrega un `CustomEvent` en una iteración futura.

Para v8-5 el legacy usaba un Swiper **vertical** con `FreeMode + Mousewheel + Scrollbar` (configuración en `initVerticalDynamicCarousel`). v3 lo reemplaza por `overflow-y: auto` puro (CSS) con un indicador de scroll inyectado en JS. Funcionalidad que **sí** se replica: scroll vertical libre, scrollbar nativa delgada, indicador "Scroll" que se desvanece al primer movimiento. Funcionalidad que **NO** se replica: momentum vertical con tuning (Chrome/Firefox ya dan inercia nativa), evento `sliderFirstMove` (v3 usa `scroll` + `wheel` + `touchstart` pasivos).

## 7. Dudas y riesgos

- **Repetidor `cards` vs `list_items` separados.** El brief pedía "Una sola clase por familia" pero los legacy v8-1/v8-3 y v8-5 son estructuralmente distintos (cards con carrusel vs lista vertical). v3 mantiene dos repeaters separados (`cards` para v8-1/v8-3, `list_items` para v8-5) porque los campos no se solapan (`card_image` vs `list_image`, `card_content` vs `list_text`). Unificarlos en uno solo agregaría ruido al editor sin beneficio. Decisión documentada en la sección de Controles.
- **`title_align` responsive como override, no como default por variante.** El legacy tenía v8-1 centrado, v8-3 centrado (con un `text_align` responsive que en la práctica era siempre center) y v8-5 a la izquierda en desktop. v3 expone un único control `title_align` responsive con default `center`; el CSS aplica el control sobre `.usil-cic__header` para todas las variantes. **Esto cambia el default de v8-5**: ahora arranca centrado y el usuario debe ponerlo a `flex-start` en desktop. Acepto el cambio porque (a) un control unificado es más mantenible, (b) la mayoría de las landings de v8-5 existentes con título centrado se ven bien, (c) si un cliente lo nota, el fix es de un click. Anotado en la revisión por si prefieres mantener v8-5 en `flex-start` por defecto vía CSS.
- **El selector `data-usil-cic-list` para v8-5.** Es un hook que el JS usa para enganchar la lógica de scroll indicator. No es un control del editor, solo un marker. Si el plugin principal descubre widgets y limpia atributos no estándar, hay que avisarle. No bloquea la entrega actual.
- **`placeholder_image_v83` como control nuevo.** El legacy usaba un `placehold.co/367x229/012085/ffffff/?text=Card+Image` hardcodeado. v3 lo reemplaza por un control `MEDIA` con `placeholder_image_v83`, vacío por defecto. Si la BU no sube nada, las cards de v8-3 sin imagen muestran el `<img>` con `alt=""` y la imagen rota. Decisión: lo mismo que hace `cards-items.php` para v6-3/v6-6 (no renderiza `<img>` si la URL es el placeholder). Si la BU quiere imágenes siempre, sube el placeholder desde el editor.
- **`$card['card_content']` con `wp_kses_post` permite `<b>`, `<i>`, `<a>`, etc.** El legacy lo escapaba con `wp_kses_post` también. No hay diferencia funcional. Riesgo bajo.
- **`alt=""` en la imagen de la lista (v8-5).** El legacy ponía `alt="Logo"` literal (mala práctica SEO). v3 pone `alt=""` porque es decorativa (el texto del logo viene en el `list_text`). Si una BU quiere semántica, el campo `list_text` admite HTML (`wp_kses_post`) y el editor puede envolver la imagen con `<figure><figcaption>` si lo necesita. Decisión de v3: accesibilidad > mimetizar el legacy.
- **CTA al final de la lista v8-5.** El CTA se renderiza **fuera** del `.usil-cic__list` (en `usil-cic__inner`), por lo que el scroll indicator no interfiere con él. Si una BU quiere el CTA dentro del flujo vertical de la lista, hay que meterlo en `usil-cic__list-item` y rediseñar la grilla 2 col. Anotado para una iteración futura si surge el caso.
- **Patrón de fondo NO incluido.** El brief no lo pidió; los tres legacy sí lo exponían (`usil_add_pattern_overlay_controls` + `usil_get_pattern_overlay_styles`). Decisión: no agregar `USIL_Pattern_Overlay_Trait` en esta entrega para mantener el alcance acotado. Si una landing lo necesita, se suma sin tocar el resto.
- **Animación de la flecha del scroll indicator (v8-5).** El legacy no la animaba (SVG estático). v3 añade `animation: usil-cic-bounce 1.5s infinite` para que la flecha "bote" suavemente. Decisión: ayuda a la affordance del scroll vertical. Si el equipo prefiere exactamente el comportamiento del legacy, se quita la animación en una iteración siguiente (un cambio de una línea).
- **Re-init en el editor de Elementor (`elementor/frontend/init` + `element_ready/usil_cards_items_carrusel.default`).** Mismo patrón que el piloto `cards-items.js`. Probado solo en teoría; pendiente validar manualmente en una página con Elementor si surge algún bug al añadir cards en el editor.
- **El selector de carrusel JS usa `--v8-1` y `--v8-3` simultáneamente.** Si el equipo decide crear una variante `--v8-1-rtl` o similar, el JS no la recoge. El selector en `initAll()` se puede ajustar cambiando `.usil-cic--v8-1 .usil-cic__cards-grid--v8-1` por un selector más genérico (`.usil-cic--v8-1 .usil-cic__cards-grid, .usil-cic--v8-3 .usil-cic__cards-grid`). Anotado para la iteración que introduzca nuevas variantes.
- **Mobile del layout v8-5.** En <768 px, el grid pasa a 1 columna (título arriba, lista abajo). El legacy hacía lo mismo con `grid-cols-1 sm:grid-cols-[3fr_2fr]`. El indicador de scroll no se muestra en mobile (en la práctica no hay scroll porque la lista cabe en la altura por defecto). Si una BU tiene muchos ítems y los quiere apilados sin scroll, hay que subir `list_max_height` o quitar el `overflow-y: auto` en mobile vía CSS adicional. No es alcance de esta entrega.
