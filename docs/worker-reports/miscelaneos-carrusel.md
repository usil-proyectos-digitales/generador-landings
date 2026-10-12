# Worker report — `miscelaneos-carrusel` (v3, 14.7)

Migración de la variante legacy `hk_miscelaneos_v14_7` (Misceláneos: bloque de texto izquierda + carrusel 1 card derecha) al plugin v3. Una sola variante (`v14-7`), como indica la Ola 4b.

## 1. Variantes

| Legacy (clase / archivo)         | Slug v3         | Etiqueta                                          |
| -------------------------------- | --------------- | ------------------------------------------------- |
| `hk_miscelaneos_v14_7` (1 sola) | `v14-7`         | 14.7 — Texto izquierda + carrusel 1 card derecha  |

`usil_add_variant_mode_controls()` recibe únicamente `['v14-7' => '14.7 — …']`.

## 2. Controles de contenido — legacy vs v3

### Cabecera

| Legacy                                | v3                                                                                | Notas |
| ------------------------------------- | --------------------------------------------------------------------------------- | ----- |
| `title` (TEXT, "Poner Título aquí")   | `title` (TEXT, mismo default) + trait `title_tag`/`hide_title_seo` (prefijo `title`, default `h2`) | El legacy no exponía etiqueta ni visibilidad; v3 los agrega vía `Title_Controls_Trait`. |
| `description` (WYSIWYG, lorem)        | `description` (WYSIWYG, mismo default)                                            | Idéntico. |

### Repeater `slides`

| Legacy                      | v3                              | Notas |
| --------------------------- | ------------------------------- | ----- |
| `slides` (REPEATER)         | `slides` (REPEATER)             | Claves conservadas verbatim. |
| `slide_image` (MEDIA, placeholder) | `slide_image` (MEDIA, `\Elementor\Utils::get_placeholder_image_src()`) | Idéntico. |
| `slide_title` (TEXT, default "BIBLIOTECA VIRTUAL…") | `slide_title` (TEXT, mismo default) | Idéntico. |
| `slide_description` (TEXTAREA, default lorem) | `slide_description` (TEXTAREA, mismo default) | Idéntico. |

El repeater lleva 3 entradas por defecto con los mismos textos del legacy (BENEFICIO PRINCIPAL / VENTAJA DIFERENCIAL / RESULTADO ESPERADO).

### Carrusel

| Legacy                                                     | v3                                                                                  | Notas |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----- |
| `carousel_arrows` (SWITCHER, yes)                          | igual vía `Carousel_Controls_Trait`                                                 |     |
| `carousel_dots` (SWITCHER, yes)                            | igual                                                                              |     |
| `carousel_autoplay` (no en legacy)                          | `carousel_autoplay` (SWITCHER, no por defecto)                                      | Sumado por el trait compartido. |
| `carousel_autoplay_speed`                                  | `carousel_autoplay_speed` (NUMBER, 5000)                                            |     |
| `carousel_loop` (no en legacy)                              | `carousel_loop` (SWITCHER, yes por defecto)                                        | Sumado por el trait compartido. |

### Fondo de sección

| Legacy (legacy `Group_Control_Background` `section_background`) | v3                                                                  | Notas |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- | ----- |
| `color` default `#F0F0F0`, `image` por defecto `assets/images/14_7_fondo.webp`, attachment fixed, bg-cover, no-repeat | `section_bg_image` (MEDIA, **vacío por defecto**)                    | El color del legacy se descarta: usa el color del kit (`--mcar-bg`). La imagen queda como control opcional: el editor puede subir la misma u otra, o dejarla vacía para no tener fondo fijo. |

### CTA al final del bloque

| Legacy | v3 |
| ------ | -- |
| (no existía CTA) | trait `cta_*` (`cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`, `cta_align`) |

### Patrón de fondo

| Legacy | v3 |
| ------ | -- |
| `usil_add_pattern_overlay_controls('usil_pattern')` | igual, conservado |

### Controles de estilo del legacy (omitidos en v3)

Los siguientes controles del legacy **no** se copian: salen del kit (`--e-global-color-*`, `--e-global-typography-*`) y/o de los overrides opcionales (`bg_override`, `fg_override`, `box_bg_override`, `box_fg_override`, `card_bg_override`, `card_fg_override`, `card_shadow_override`, `ui_override`).

- `section_background` color → override `--mcar-bg`.
- `section_overlay` → no replicado (la imagen de fondo opcional cubre el caso; si se necesita overlay, el editor puede usar el patrón o un color de fondo personalizado).
- `title_box_background` color → override `--mcar-box-bg`.
- `title_box_padding`, `title_box_border_radius` → conservados como útiles; ver "Espaciado". En v3 estos pasan al control global de espaciado de la sección y al padding interno de la card; los valores por defecto del box (`0.5rem 1.5rem`, `0.75rem`) quedan en CSS.
- `title_color` → override `--mcar-box-fg` (texto dentro de la caja).
- `title_typography` → kit `--e-global-typography-primary-*`.
- `title_align` → no replicado. Legacy default = izquierda; v3 lo fija en CSS (`text-align: left`). Si se necesita otra alineación, el editor puede usar CSS personalizado.
- `title_margin` → no replicado (control de espaciado útil). El margen del `<h2>` queda en CSS (`0 0 3rem`).
- `description_color`, `description_typography`, `description_margin` → kit + `--mcar-fg`.
- `card_background` color → override `--mcar-card-bg`.
- `card_border`, `card_box_shadow` → border omitido; shadow → override `--mcar-card-shadow`.
- `card_border_radius` → control de espaciado global `card_radius` (DIMENSIONS).
- `card_padding` → control de espaciado global `card_padding` (DIMENSIONS).
- `carousel_wrapper_max_width`, `carousel_slide_inner_width` → los anchos por breakpoint (320/320/385 wrapper; 260/280/309 slide-inner) quedaron en CSS. Si hace falta ajustar, son los controles `card_padding` y `col_gap` los que regulan el espaciado.
- `nav_color`, `nav_hover_color`, `dots_border_color`, `dots_active_color` → override `--mcar-carousel-ui` (un solo color para flechas y puntos; no se distinguen estados `border`/`active` por separado porque el JS compartido usa solo dos estados: bullet vacío con opacidad 0.35 y bullet activo con opacidad 1, ambos del mismo color).

## 3. Tabla de colores por modo (propuesta — no hay `theme.ts` para esta familia en `generador-landings/`)

| Parte                                   | Claro              | Oscuro             | Notas |
| --------------------------------------- | ------------------ | ------------------ | ----- |
| Fondo de sección                        | `busurface`        | `primary`          | Override: `--mcar-bg`. Si se sube `section_bg_image`, el background-image inline tapa el color. |
| Texto (descripción, slide título/texto) | `primary`          | `buneutral`        | Override: `--mcar-fg`. |
| Caja del título — fondo                 | `primary`          | `buneutral`        | Override: `--mcar-box-bg`. Regla "Caja de título" del brief. |
| Caja del título — texto                 | `busurface`        | `primary`          | Override: `--mcar-box-fg`. Regla "Caja de título" del brief. |
| Card del carrusel — fondo               | `primary`          | `buneutral`        | Override: `--mcar-card-bg`. Regla de Misceláneos (bloque/caja = primary en claro, buneutral en oscuro). |
| Card del carrusel — texto               | `buneutral`        | `primary`          | Override: `--mcar-card-fg`. |
| Sombra de la card                       | `buneutral` (translúcido vía opacidad) | `accent` | Override: `--mcar-card-shadow`. |
| Flechas y puntos del carrusel           | `primary`          | `buneutral`        | Override: `--mcar-carousel-ui`. |

> Tabla propuesta. No hay `theme.ts` en `generador-landings/src/components/widgets/` para esta familia. El kit del sub-sitio (los 5 slots `busurface/buneutral/primary/secondary/accent`) se respeta en todos los roles; el editor puede pisarlos con los overrides opcionales sin tocar el HTML.

## 4. Salida literal de la "Definición de hecho"

```bash
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3 && php -l widgets/miscelaneos-carrusel.php
No syntax errors detected in widgets/miscelaneos-carrusel.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/miscelaneos-carrusel.php assets/css/miscelaneos-carrusel.css || echo "sin colores fijos"
sin colores fijos
```

Check adicional (brief, sección "Definición de hecho adicional" de Título/CTA):

```bash
$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/miscelaneos-carrusel.php
8:use UsilV3\Traits\Cta_Controls_Trait;
9:use UsilV3\Traits\Title_Controls_Trait;
36: *     `usil_render_title()`, que no soporta HTML anidado). La caja aplica la
50:	use Title_Controls_Trait;
51:	use Cta_Controls_Trait;
109:		$this->usil_register_title_controls( 'title', 'h2' );
216:		$this->usil_register_cta_controls();
384:						<?php $this->usil_render_cta( $settings ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/miscelaneos-carrusel.php
0
```

Conteo `0` confirmando que no hay definiciones propias de las claves — todas las crea el trait.

## 5. HTML por defecto — antes vs después

### Legacy (`miscelaneos-v14-7.php` + `template.html`)

```html
<section class="hk-miscelaneos-v14-7-section …" data-widget-variant="v14.7">
  <div class="hk-miscelaneos-v14-7-overlay absolute inset-0 pointer-events-none"></div>
  <div class="relative z-10 container mx-auto">
    <div class="grid grid-cols-1 gap-12 items-center md:gap-4 md:grid-cols-2">
      <div class="text-left hk-col-texto …">
        <h2 class="flex flex-col items-start mb-12 text-left hk-title … text-brand-dark">
          <div class="inline-block px-6 py-2 mt-2 rounded-xl hk-caja-titulo bg-brand-dark md:w-[max-content]">
            <span class="block text-white hk-title-soporte …">Poner Título aquí</span>
          </div>
        </h2>
        <div class="hk-miscelaneos-v14-7-desc text-left … text-brand-dark …">
          Lorem ipsum …
        </div>
      </div>
      <div class="flex justify-center hk-miscelaneos-v14-7-col-carousel">
        <div class="hk-miscelaneos-v14-7-carousel-wrapper …">
          <div class="hk-miscelaneos-v14-7-carousel-card hk-carousel-card bg-[#F9F9F9] rounded-[2rem] shadow-[0_18px_40px_rgba(0,0,0,0.12)] …">
            <div class="hk-miscelaneos-v14-7-swiper hk-carousel-swiper swiper" {…carousel attrs…}>
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="hk-miscelaneos-v14-7-slide-inner mx-auto w-[260px] md:w-[280px] lg:w-[309px]">
                    <img src="…" class="w-full rounded-3xl hk-miscelaneos-v14-7-slide-image hk-imagen" alt="…">
                    <div class="px-0 py-6 space-y-1 w-full text-left">
                      <h3 class="text-xs font-bold hk-miscelaneos-v14-7-slide-title hk-carousel-title text-brand-dark …">…</h3>
                      <p class="text-sm leading-relaxed hk-miscelaneos-v14-7-slide-text hk-carousel-text text-brand-dark …">…</p>
                    </div>
                  </div>
                </div>
                <!-- …3 slides por defecto… -->
              </div>
            </div>
            <div class="flex gap-6 justify-between items-center px-8 py-0 md:px-10">
              <button class="hk-carousel-prev text-brand-dark"><i class="fa-solid fa-chevron-left"></i></button>
              <div class="flex gap-2 justify-center items-center hk-carousel-dots"></div>
              <button class="hk-carousel-next text-brand-dark"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### v3 (`miscelaneos-carrusel.php`)

```html
<section class="usil-mcar usil-mcar--v14-7" data-variant="v14-7" data-mode="light" {…pattern bg inline opcional…}>
  <div class="usil-mcar__inner">
    <div class="usil-mcar__grid">
      <div class="usil-mcar__col-text">
        <h2 class="usil-mcar__title">
          <span class="usil-mcar__title-box">
            <span class="usil-mcar__title-text">Poner Título aquí</span>
          </span>
        </h2>
        <div class="usil-mcar__desc">…lorem…</div>
        <?php $this->usil_render_cta( $settings ); ?>   <!-- solo si cta_show=yes -->
      </div>
      <div class="usil-mcar__col-carousel">
        <div class="usil-mcar__card">
          <div class="usil-mcar__slides" data-usil-carousel="miscelaneos-v14-7" {…carousel data-*…}>
            <div class="usil-mcar__slide elementor-repeater-item-{_id}">
              <div class="usil-mcar__slide-inner">
                <img class="usil-mcar__slide-image" src="…" alt="…">
                <div class="usil-mcar__slide-text-block">
                  <h3 class="usil-mcar__slide-title">…</h3>
                  <p class="usil-mcar__slide-text">…</p>
                </div>
              </div>
            </div>
            <!-- …3 slides por defecto… -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Cambios relevantes

- Fondo: se aplica vía `background-color: var(--mcar-bg)` en el `<section>` (clase, no inline), y opcionalmente `background-image` inline solo si `section_bg_image` está definido (legacy lo tenía siempre con imagen fija).
- Overlay (`hk-miscelaneos-v14-7-overlay`) → no se replica (legacy no lo usaba por defecto; si el editor lo quiere, puede usar el patrón de fondo o el color de fondo personalizado).
- Título: el `<h2>` mantiene la caja anidada (estructura legacy) pero ahora la etiqueta es editable (`title_tag`); la caja aplica la regla "Caja de título" del brief (claro primary/busurface, oscuro buneutral/primary).
- Carrusel: el JS compartido (`usil-carousel.js`, preset `miscelaneos-v14-7`) crea el wrapper `.swiper-wrapper` y los botones `.usil-carousel__arrow` / `.usil-carousel__dots`; no hay flechas ni puntos en el HTML inicial. Las clases `usil-mcar__slide` son los items que el preset reconoce.
- Clases Tailwind (`bg-brand-dark`, `text-brand-dark`, `font-montserrat`, `grid grid-cols-1 …`, `rounded-[2rem]`, `shadow-[0_18px_40px_rgba(0,0,0,0.12)]`, etc.) → todas eliminadas; reemplazadas por clases BEM con roles del kit.

## 6. Dudas y riesgos

1. **Imagen de fondo vacía por defecto**. Decidí dejar `section_bg_image` vacío por defecto (a diferencia del legacy, que siempre tenía `assets/images/14_7_fondo.webp`). Motivo: el brief pide "vacío por defecto"; si la landing necesita la imagen fija, el editor la sube. La BU puede decidir caso por caso.
2. **Color del card en modo claro = `primary`**. Eso hace que la card y la caja del título tengan el mismo fondo en claro. La regla del brief para Misceláneos dice "bloque/caja primary con texto buneutral" y la regla "Caja de título" dice lo mismo para la caja, así que ambos bloques heredan el mismo rol. Si una BU lo encuentra visualmente plano, puede pisarlo con `card_bg_override` o `box_bg_override` sin tocar el código.
3. **Nav hover color y borde de puntos**. El legacy tenía 4 colores separados (`nav_color`, `nav_hover_color`, `dots_border_color`, `dots_active_color`). v3 los unifica en un solo override `--mcar-carousel-ui` porque el JS compartido (`usil-carousel.css`) usa un solo color con opacidad para los estados (0.35 inactivo, 1 activo). Si hace falta separarlos, hay que tocar `usil-carousel.css` — fuera del scope de este widget.
4. **Wrapper del carrusel**. El legacy tenía una `hk-miscelaneos-v14-7-carousel-wrapper` con max-width propio. v3 delega ese ancho a `.usil-mcar__card` (320/320/385 por breakpoint en CSS). El preset `miscelaneos-v14-7` no espera un wrapper externo, así que no se replica.
5. **Title align del legacy** (CHOOSE izq/centro/der, default izq). No se replicó: v3 fija `text-align: left` en CSS para coincidir con el default visual legacy. Si el editor quiere otra alineación, lo cubre con CSS personalizado (no es un caso común).
6. **`get_script_depends()` y `get_style_depends()`**: pedí `usil-v3-usil-carousel` en ambos para que el preset Swiper compartido funcione. No hay script propio del widget (regla 4 de Ola 1: cero JS, solo el preset `miscelaneos-v14-7` que ya existe en `usil-carousel.js`).