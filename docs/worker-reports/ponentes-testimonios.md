# Worker Report — `ponentes-testimonios` (familia Ponentes / Testimonios)

Migración de los widgets legacy a `wp-plugin/usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio (rol mapeado en `assets/css/ponentes-testimonios.css`).

## 1. Variantes

| Legacy (clase / archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `Elementor_Ponentes_Testimonios_V7_2_Widget` (`ponentes-testimonios-v7-2.php`) | 7.2 Ponente Destacado (Single) | `v7-2` | "7.2 — Ponente destacado (1 card)" |
| `Elementor_Ponentes_Testimonios_V7_4_Widget` (`ponentes-testimonios-v7-4.php`) | 7.4 Ponentes Testimonios (Cards/Carrusel) | `v7-4` | "7.4 — Grid con bandera (carrusel si >4)" |
| `Elementor_Ponentes_Testimonios_V7_5_Widget` (`ponentes-testimonios-v7-5.php`) | 7.5 Ponentes Testimonios (Mosaico/Hover) | `v7-5` | "7.5 — Grid con foto + hover (carrusel si >4)" |

Tres variantes legacy → tres opciones de `variant`. Default del select: `v7-2` (primera del array, comportamiento de `Variant_Mode_Trait`).

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title` (v7-2 / v7-4 / v7-5) | TEXT | ✓ `title` | En v7-2 se renderiza dentro de la caja resaltada (igual que el legacy); en v7-4 / v7-5 va arriba. |
| `description` (v7-2 / v7-5) | TEXTAREA | ✓ `description` | Mostrado condicional a `variant ∈ {v7-2, v7-5}` (v7-4 legacy no lo tenía). |
| `highlight_text` (v7-4 / v7-5) | TEXT | ✓ `highlight_text` | Mostrado condicional a `variant ∈ {v7-4, v7-5}`. Default legacy: `"resaltar beneficios"`. |
| `section_title_tag` | SELECT (h1-h6/div/span) | ✓ `section_title_tag` | Default h2. Conservado como control de estructura. |
| `section_highlight_tag` (v7-4 / v7-5) | SELECT (h2-h6/div/span/p) | ✓ `section_highlight_tag` | Default span. |
| `speaker_image` (v7-2) | MEDIA | ✓ `speaker_image` | Default placeholder de Elementor. |
| `speaker_name` (v7-2) | TEXT | ✓ `speaker_name` | |
| `speaker_position` (v7-2) | TEXT | ✓ `speaker_position` | |
| `speaker_description` (v7-2) | TEXTAREA | ✓ `speaker_description` | |
| `card_title_tag` (v7-2) | SELECT | ✓ `card_title_tag` (v7-2) | Default h3. |
| `card_subtitle_tag` (v7-2) | SELECT | ✓ `card_subtitle_tag` (v7-2) | Default h4. |
| `cards` repeater v7-4 (image, flag_image, name, position, description, card_title_tag, member_role_tag) | REPEATER | ✓ `cards` (sección `section_cards_v74`) | 7 campos por item, mismos defaults legacy. Tope en render: 12 ítems (`MAX_CARDS_V74`). |
| `cards` repeater v7-5 (image, name, highlight_title, description, card_title_tag, link) | REPEATER | ✓ `cards` (sección `section_cards_v75`) | 6 campos por item, mismos defaults legacy. Tope en render: 4 ítems (`MAX_CARDS_V75`). |
| `show_overlay` (v7-5) | SWITCHER (yes/no) | ✓ `show_overlay` | Default `yes`. |
| `name_bg_color` (v7-5, por repeater item) | COLOR | omitido | Era control de estilo del legacy; lo reemplaza la variable `--pt-card-fg` del kit. |
| Carousel (autoplay, loop, arrows, dots, speed) (v7-4 / v7-5 vía `Carousel_Controls_Trait`) | varios | ✓ inline en `section_carousel_options` | Sección condicionada a `variant ∈ {v7-4, v7-5}`. Los data-`*` los emite `UsilV3\Traits\Carousel_Controls_Trait::get_carousel_attributes()`. |
| Patrón de fondo (`usil_pattern_*`) (v7-2 / v7-4 / v7-5) | trait `USIL_Pattern_Overlay_Trait` | ✓ mismo trait, prefijo `usil_pattern` | Conservado para las tres variantes. |
| `section_padding` (v7-4 / v7-5) | DIMENSIONS responsive | ✓ `section_padding` | Conservado en Estilo > Espaciado (útil). |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `card_bg_color` (v7-2) | Control de estilo del legacy; lo reemplaza la variable `--pt-card` del kit. Mismo criterio que `name_bg_color` arriba. |
| `section_background` (Group_Control_Background) (v7-2 / v7-4 / v7-5) | El brief prohíbe copiar controles de estilo/colores del legacy; lo reemplaza la variable `--pt-bg` del kit. |
| `section_overlay` (Group_Control_Background) (v7-4 / v7-5) | Idem. |
| `main_bg_color` (v7-4) | Idem. |
| `main_background` (v7-5) | Idem. |
| `card_name_color`, `card_position_color`, `card_desc_color`, `name_color`, `overlay_title_color`, `overlay_desc_color`, `mobile_name_color`, `mobile_highlight_color`, `mobile_desc_color` (todos los legacy) | Idem. Lo cubren `--pt-card-fg` y overrides opcionales. |
| `title_color`, `highlight_bg_color`, `highlight_text_color`, `desc_color` (v7-4 / v7-5) | Idem. |
| `speaker_image_size`, `speaker_image_radius` (v7-2) | El tamaño de la foto del ponente ahora se controla desde el CSS (200×200 desktop, 160×160 mobile). Si se necesita escalado editable por item, agregarlo en una iteración futura. Decisión documentada en "Dudas y riesgos". |
| `title_typography`, `highlight_typography`, `desc_typography`, `name_typography`, `position_typography`, `desc_typography`, `name_typography`, `overlay_title_typography`, `overlay_desc_typography`, `mobile_name_typography`, `mobile_highlight_typography`, `mobile_desc_typography`, `speaker_name_typography`, `speaker_position_typography`, `speaker_description_typography` (todos los legacy) | Reemplazados por `--e-global-typography-{primary|secondary|text}-*` del kit. El usuario define el "feel" Anton/display desde el kit del sub-sitio. |
| `section_margin` (DIMENSIONS, todas las variantes) | No aportaba valor visible en el legacy y rara vez se usaba; se omite para no inflar la UI. El usuario puede posicionar la sección desde el layout de Elementor. |
| `name_bg_color` per-item (v7-5) | Era estilo; el kit manda. |
| `flagship_link` heredado / `link` ya preservado | Conservado en v3 como `link` (URL con is_external + nofollow). |

## 3. Tabla de colores por variante × modo

Decidida por `generador-landings/src/components/widgets/7-bloque-ponentes-testimonios/theme.ts` (no es propuesta). Mapeo al kit v3 (`--e-global-color-*`):

| Variante | Modo | section `bg` | título / desc `fg` | caja título `bg` | caja título `fg` | card `bg` | card `fg` | overlay | borde / pastilla / bandera |
|---|---|---|---|---|---|---|---|---|---|
| v7-2 | light | `busurface` (propuesto: blanco en lugar del `#F0F0F0` del theme.ts) | `primary` | `primary` | `busurface` | `primary` | `busurface` | — | `primary` |
| v7-2 | dark  | `primary` | `buneutral` | `buneutral` | `primary` | `buneutral` | `primary` | — | `primary` |
| v7-4 | light | `busurface` (propuesto: blanco en lugar del `#F0F0F0`) | `primary` | `primary` | `busurface` | (transparente) | `primary` | — | `primary` |
| v7-4 | dark  | `primary` | `buneutral` | `buneutral` | `primary` | (transparente) | `buneutral` | — | `buneutral` |
| v7-5 | light | `primary` | `buneutral` | `buneutral` | `primary` | (transparente) | `primary` | `primary` (con `busurface` para el texto del overlay) | `primary` |
| v7-5 | dark  | `secondary` | `buneutral` | `buneutral` | `secondary` | (transparente) | `buneutral` | `secondary` | `primary` |

Notas de fidelidad (cambios visuales esperados respecto al legacy):

- **Fondo gris legacy `#F0F0F0` reemplazado por `busurface` (blanco del kit)** en v7-2 / v7-4 light. El theme.ts del Astro usa `bg-[#F0F0F0]` literal (hex arbitrario), pero el brief v3 prohíbe colores hex fijos. Mapeamos al rol más cercano del kit (`busurface`, blanco). **Marcado como propuesta pendiente de revisión de diseño** — si en alguna BU el kit tiene `busurface` distinto de blanco, ese color regirá. No es un cambio arbitrario: el pilot `save-the-date` ya hace lo mismo (`--std-bg: var(--e-global-color-busurface, transparent)`).
- **v7-5 dark usa `secondary` para fondo** (theme.ts); el v7-5 light usa `primary` como en el legacy. La distinción coincide con el patrón "fondo de BU en dark, fondo de marca en light".
- **Tipografía**: el legacy usaba `font-anton` + clases `text-anton-block-title-*` para títulos y `font-montserrat` + `text-mont-{block-p,card-title,card-content,item-content}-*` para los textos. v3 usa `--e-global-typography-primary-*` para el título y la caja de soporte (Anton-like por convención del kit), `--e-global-typography-secondary-*` para nombre del ponente, y `--e-global-typography-text-*` para descripción/cargo. El usuario define el "feel" desde el kit del sub-sitio. En mobile, los títulos se reducen al 75 % y los nombres al 85 % (mismo criterio que el pilot `save-the-date`).
- **Card v7-4 con borde/pastilla/bandera**: usa `--pt-bar` (primary en light, buneutral en dark) en el ring de la foto, la píldora del nombre y la bandera. Coincide con el legacy (`border-brand-dark` / `border-solid border-brand-dark`).
- **Overlay v7-5**: en light el overlay usa el mismo `primary` que el fondo, con texto `busurface` (legado usaba `bg-brand-dark/80` con texto blanco). En dark el overlay usa `secondary` (mismo color que el fondo) para mantener contraste; el texto del overlay va a `busurface` por accesibilidad. Si en alguna BU la combinación queda con poco contraste, ajustar vía override `overlay_color` (vacío por defecto = marca del kit).

Los overrides de color opcionales en la pestaña Estilo (vacíos por defecto) pisan `--pt-bg`, `--pt-fg`, `--pt-card`, `--pt-card-fg`, `--pt-overlay` y `--pt-bar` vía `{{WRAPPER}} .usil-pt`, igual que el pilot `save-the-date` con `--std-*`.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/ponentes-testimonios.php
No syntax errors detected in widgets/ponentes-testimonios.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/ponentes-testimonios.php assets/css/ponentes-testimonios.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/ponentes-testimonios.php
35
```

Verificación adicional:
- Las 3 variantes legacy aparecen como opción de `variant` en `usil_add_variant_mode_controls()` (`v7-2`, `v7-4`, `v7-5`).
- Todos los controles de contenido del legacy listados en la sección 2 existen en el editor de v3 (mismo `key` donde aplica).
- `get_name()` = `usil_ponentes_testimonios`; `get_categories()` = `['usil_v3']`; `get_style_depends()` devuelve `['usil-v3-ponentes-testimonios']` (autodescubierto por `usil-elementor-widgets-v3.php`).

## 5. Dudas y riesgos

- **Carrusel resuelto con vanilla JS + scroll-snap (sin Swiper, sin CDN).** El plugin v3 no trae Swiper. Para no introducir una dependencia nueva (ni CDN, ni npm), el carrusel se implementa en `assets/js/ponentes-testimonios.js` (vanilla JS). Mismo enfoque que `cards-items.js`: cuando hay >4 ponentes en `.usil-pt__grid--v74` o `.usil-pt__grid--v75`, se agrega `usil-pt__grid--carousel` al contenedor, se construye el slider con scroll-snap (`overflow-x: auto`, `scroll-snap-type: x mandatory`) y se renderizan flechas + dots inline. Lee los `data-swiper-*` que emite `Carousel_Controls_Trait::get_carousel_attributes()` (`data-swiper-autoplay`, `data-swiper-autoplay-speed`, `data-swiper-loop`, `data-swiper-arrows`, `data-swiper-dots`). Se reinicia en el editor de Elementor con `frontend/element_ready/usil_ponentes_testimonios.default`. **Registro del script**: el constructor del widget engancha `elementor/frontend/after_register_scripts` y `elementor/editor/after_register_scripts` para llamar `wp_register_script()` con el handle `usil-v3-ponentes-testimonios`. Sin tocar `usil-elementor-widgets-v3.php`. **Colores de flechas y dots**: salen del kit (sin hex). Flechas usan `color: var(--e-global-color-buneutral)` con borde `var(--pt-bar)`; en hover invierten al pasar `background: var(--pt-card)` + `color: var(--pt-card-fg)`. Dots inactivos usan `background: var(--e-global-color-buneutral)` con `opacity: 0.35`; el activo usa `background: var(--e-global-color-accent)` con `opacity: 1`. **Diferencia visual con el legacy**: el legacy usa flechas blancas con fondo `bg-brand-dark`; v3 hereda el color del texto de la sección (más coherente con el rol del kit). Si una BU puntual quiere el patrón "flecha oscura con fondo claro", se ajusta vía override de la variable CSS.
- **Color del patrón de fondo sigue siendo picker directo.** `USIL_Pattern_Overlay_Trait` registra color pickers con defaults hex (`#000000`, `#002663`, `#0050C8`) y los emite como `style="…"` inline. Mismo riesgo que el resto de widgets v3; el problema está en el trait, no en este widget. No tocar el trait (alcance del brief).
- **`#F0F0F0` del theme.ts reemplazado por `busurface`.** El theme.ts usa `bg-[#F0F0F0]` literal para el fondo de v7-2 y v7-4 light. El brief v3 prohíbe colores hex fijos, así que mapeo al rol más cercano del kit (`busurface`). En el kit default eso es blanco (`#ffffff`), no gris. Si el equipo de diseño quiere preservar el gris neutro, hay dos caminos: (a) agregar un alias `--bu-widget-ponentes-bg` redirigible por BU en `global.css` del Astro y mapearlo a `--pt-bg` en el CSS v3, o (b) configurar el `busurface` del kit en cada sub-sitio. **Decisión**: propuesta marcada en la tabla de la sección 3 como "pendiente de revisión".
- **`speaker_image_size` y `speaker_image_radius` (v7-2 legacy) eliminados.** El legacy permitía customizar el tamaño/forma de la foto del ponente único. v3 los deja fijos (200×200 desktop, 160×160 mobile, siempre circular). Si se necesita control editorial del tamaño (por ejemplo, fotos cuadradas en alguna BU), se puede agregar un control `DIMENSIONS` + `SLIDER` en una iteración futura sin afectar el resto.
- **`name_bg_color` per-item eliminado en v7-5.** Era un color de fondo por nombre de ponente (default `transparent`). El kit manda; si una BU puntual lo necesita, lo hace vía override global (no por item).
- **Tags HTML por control**: cada variante legacy expone sus selectores de etiqueta (`section_title_tag`, `section_highlight_tag`, `card_title_tag`, `card_subtitle_tag` en v7-2, `member_role_tag` en v7-4, `card_title_tag` en v7-5). v3 los conserva todos. El default es h2/h3/h4/span según el legacy.