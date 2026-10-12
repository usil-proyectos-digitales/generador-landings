# Worker report — cards-items-carrusel (migración a Swiper compartido)

Unidad: familia 8-cards-items-carrusel (widgets legacy `hk_cards_items_v8_1`, `hk_cards_items_v8_3`, `hk_cards_items_v8_5`).
Tarea: rehacer el carrusel sobre la infra `UsilCarousel` compartida y descartar el scroll-snap propio que quedó de la primera versión.

Archivos editados:
- `wp-plugin/usil-elementor-widgets-v3/widgets/cards-items-carrusel.php`
- `wp-plugin/usil-elementor-widgets-v3/assets/css/cards-items-carrusel.css`

Archivos NO editados (intactos):
- `wp-plugin/usil-elementor-widgets-v3/assets/js/usil-carousel.js` — preset `cards-v8-1`, `cards-v8-3`, `cards-v8-5` ya estaban dados de alta en la Ola 1.
- `wp-plugin/usil-elementor-widgets-v3/assets/css/usil-carousel.css`.
- `wp-plugin/usil-elementor-widgets-v3/assets/js/cards-items-carrusel.js` — ya estaba borrado por una tarea previa; no se recrea.

## 1. Variantes

| Legado            | Opción `variant` v3 | Preset Swiper        | Modo        |
|-------------------|---------------------|----------------------|-------------|
| `hk_cards_items_v8_1` | `v8-1`            | `cards-v8-1`         | horizontal  |
| `hk_cards_items_v8_3` | `v8-3`            | `cards-v8-3`         | horizontal  |
| `hk_cards_items_v8_5` | `v8-5`            | `cards-v8-5` (vertical, override de itemSelector + height) | vertical |

## 2. Controles de contenido (heredados del v3 actual + ajustes)

Sin cambios de paridad en esta tarea. Se mantienen los controles ya dados de alta en la versión previa:

- Cabecera: `title`, `title_tag`/`hide_title_seo` (vía trait), `highlight_text` (v8-1/v8-3), `description`, `title_align`.
- Opciones por variante: `show_btn` (v8-1), `placeholder_image_v83` (v8-3), `list_max_height` (v8-5).
- Repeater `cards` (v8-1/v8-3): `card_image`, `card_title`, `card_title_tag`, `card_content`, `btn_text`, `btn_link`.
- Repeater `list_items` (v8-5): `list_image`, `list_text`.
- Carrusel: `carousel_autoplay`, `carousel_autoplay_speed`, `carousel_loop`, `carousel_arrows`, `carousel_dots` (vía `Carousel_Controls_Trait::register_usil_carousel_controls()`; sin condición de variante — el JS ya filtra por `data-usil-carousel`).
- CTA final: `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos` (vía `Cta_Controls_Trait`).
- Estilo: `section_padding`, `card_border_radius`, overrides `--cic-bg/-fg/-highlight-bg/-card-bg/-card-fg`.

Cambios aplicados en esta tarea:
- `get_style_depends()` → `['usil-v3-cards-items-carrusel', 'usil-v3-usil-carousel']` (añadido el estilo del carrusel compartido).
- `get_script_depends()` → `['usil-v3-usil-carousel']` (eliminado `usil-v3-cards-items-carrusel`, cuyo `.js` ya no existe).
- `usil_render_cic_items()` (v8-1/v8-3): el contenedor `.usil-cic__cards-grid--<variant>` ahora lleva `data-usil-carousel="cards-v8-1"` o `cards-v8-3` + atributos `data-swiper-*` de `get_carousel_attributes()`. Hijos directos = `.usil-cic__card` (cada uno será `.swiper-slide` tras `initHorizontal`).
- `usil_render_cic_list_v85()` (v8-5): el contenedor `.usil-cic__list` lleva `data-usil-carousel="cards-v8-5"` + `data-usil-carousel-config='{"itemSelector":".usil-cic__list-item","height":"<size><unit>"}'` porque el preset asume `.usil-cic__logo` y el marcado del widget usa `.usil-cic__list-item`. El JSON se imprime con `wp_json_encode()` dentro de comillas simples — `esc_attr` rompería el parseo al escapar `"` a `&quot;`. Hijos directos = `.usil-cic__list-item`.
- Ambos contenedores siguen llevando los `data-swiper-*` de `get_carousel_attributes()` (autoplay/loop/arrows/dots). Por debajo del umbral el JS no hace nada y todo queda como grid/lista estática.

## 3. Contenedor del carrusel vs. contenedor del grid

La regla "el contenedor del carrusel debe tener como hijos DIRECTOS solo los items" se cumple en ambas ramas:

| Variante | Contenedor (data-usil-carousel) | Hijos directos                  | Observaciones |
|----------|--------------------------------|---------------------------------|---------------|
| v8-1     | `.usil-cic__cards-grid`        | `.usil-cic__card`               | ItemSelector ya coincide con el preset; sin override. |
| v8-3     | `.usil-cic__cards-grid`        | `.usil-cic__card`               | Misma estructura que v8-1, preset distinto por los breakpoints. |
| v8-5     | `.usil-cic__list`              | `.usil-cic__list-item`          | Contenedor diferente al grid (lista vertical en grid de 2 columnas); se pasa `itemSelector` y `height` por `data-usil-carousel-config`. |

v8-5 usa `usil-carousel--vertical` automáticamente (preset `mode: 'vertical'`) → scrollbar + indicador "Scroll" los pone `usil-carousel.js` (no este widget). Por debajo del umbral (≤3 logos) la lista sigue usando el `max-height` + `overflow-y: auto` del CSS como fallback nativo.

## 4. CSS del widget — qué se quitó y qué se quedó

Quitado (era el scroll-snap propio):
- Regla `.usil-cic__cards-grid--carousel { flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; … }` (clase nunca aplicada por el PHP; era residuo del intento con scroll-snap).
- Regla `.usil-cic__cards-grid--carousel .usil-cic__card { scroll-snap-align: start; flex: none; }`.
- Bloque `.usil-cic__carousel-arrows / __prev / __next / __dots / __dot / __dot.is-active` (flechas y puntos que el widget nunca tuvo; los provee `usil-carousel.css` con `var(--usil-carousel-ui)`).
- Bloque `.usil-cic__scroll-indicator*` (indicador de scroll legacy; lo reemplaza `.usil-carousel__scroll-indicator` del CSS compartido).

Conservado:
- Variables por variante × modo (`--cic-bg`, `--cic-fg`, `--cic-card-bg`, `--cic-card-fg`, `--cic-cta-*`).
- Reglas de tarjeta (v8-1, v8-3): padding, radio, color, tipografía, imagen, CTA. Los anchos `width: 100%` / `calc(50% - 1rem)` / `calc((100% - 2rem) / 3)` (v8-3) o `calc((100% - 4rem) / 3)` (v8-1) se quedan en CSS a propósito: en modo grid (≤3 cards, sin Swiper) hacen falta para la composición correcta, y al activarse Swiper los pisa con inline `style="width: …"`. Mismo patrón que `cards-items` v6-8.
- v8-5: `display: flex; flex-direction: column; gap: 3rem;` en la lista, `max-height` + `overflow-y: auto` como fallback para el caso ≤3 logos. La altura del control `list_max_height` se inyecta además al `container.style.height` vía preset config, así Swiper la respeta al activarse.
- Bloques `› Móvil` (override de padding, altura de icono, alto de imagen).

## 5. Verificación (salida literal)

```
$ php -l widgets/cards-items-carrusel.php
No syntax errors detected in D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3/widgets/cards-items-carrusel.php

$ grep -nE "scroll-snap|new Swiper|overflow-x" widgets/cards-items-carrusel.php assets/css/cards-items-carrusel.css
assets/css/cards-items-carrusel.css:13: * El CSS del carrusel (scroll-snap/flechas/puntos) NO se define aquí: vive
assets/css/cards-items-carrusel.css:390:   No definimos aquí scroll-snap, overflow-x, flechas ni puntos: la infra Swiper

$ ls assets/js/cards-items-carrusel.js
ls: cannot access 'assets/js/cards-items-carrusel.js': No such file or directory
exit:1

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/cards-items-carrusel.php assets/css/cards-items-carrusel.css
(sin coincidencias)
```

Las dos coincidencias de `grep scroll-snap` están en comentarios que documentan lo que NO está. La regla del brief era "vacío salvo comentarios" → cumplido.

## 6. Dudas / notas

- **Riesgo de overflow-x en wrappers padres:** `usil-carousel.css` ya envuelve el contenedor en `.usil-carousel__outer` con `padding-inline: 50px` y los slides en `.swiper` con `overflow: hidden`. Por eso Swiper pisa todos los `overflow-x` previos sin que tengamos que tocar este CSS. Si el sitio fuerza `overflow-x: hidden` en `<html>`/`<body>`, las flechas del carrusel compartido se ven igual que en el piloto `cards-items`.
- **v8-5 itemSelector:** opté por override `data-usil-carousel-config` antes que renombrar `.usil-cic__list-item` → `.usil-cic__logo`. Renombrar obligaba a tocar todas las reglas CSS de v8-5 (`.usil-cic--v8-5 .usil-cic__list-item`, `.usil-cic__list-image`, `.usil-cic__list-text`) y rompía el comentario del brief "el contenedor del carrusel debe tener como hijos DIRECTOS solo los items", que está satisfecho igualmente (los list-items ya eran hijos directos de la lista).
- **Altura v8-5:** dejo pasar `height` por la config porque el control `list_max_height` la expone como override (`px`/`vh`). Si el editor elige `60vh`, el contenedor Swiper recibe `60vh` válido. En el camino viejo del scroll-snap ese control solo afectaba al `max-height` del CSS; ahora también al `height` del carrusel activado.
- **Backslashes PHP:** revisados manualmente los `use UsilV3\Traits\...;` y `\Elementor\...` — todos presentes.
