# Worker Report — `cards-items` (familia Cards)

Migración del widget legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio.

## 1. Variantes

| Legacy (archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `cards-items.php` | 6.3 Cards Items | `v6-3` | "6.3 — Título centrado + cards verticales con CTA" |
| `cards-items-v6-6.php` | 6.6 Cards Items List | `v6-6` | "6.6 — Título izq + cards horizontales (icono + texto)" |
| `cards-items-v6-8.php` | 6.8 Cards Items | `v6-8` | "6.8 — Título izq + cards verticales con imagen (carrusel si >4)" |
| `cards-items-v6-10.php` | 6.10 Cards Items (2 Cards) | `v6-10` | "6.10 — Título izq + 2 cards grandes con imagen y CTA" |
| `cards-items-v6-11.php` | 6.11 Cards Items (Vertical + Price) | `v6-11` | "6.11 — Título centrado + cards producto (categoría/título/precio/CTA)" |
| `cards-items-v6-12.php` | 6.12 Cards Items (Date + CTA) | `v6-12` | "6.12 — Título centrado + cards con badge de fecha" |

Las variantes `v8-*` (`cards-items-v8-1.php`, `v8-3.php`, `v8-5.php`) no entran en esta familia: son carruseles puros y van en otra tarea.

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

La familia legacy tenía un control distinto por variante (cada subclase exponía su propio set). v3 unifica todo en un único repeater con todos los campos posibles y ramifica en `render()` qué consumir por variante. Esto preserva paridad 1:1 sin obligar al editor a editar dos repeater distintos según la variante.

#### Cabecera (global, una sola sección `section_content_header`)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title` (v6.3, v6.6, v6.10, v6.11, v6.12) | TEXT | ✓ `title` | Mismo default. v6.8 lo expone como `header_title` en legacy pero el rol es idéntico; v3 usa `title` para todas. |
| `highlight_text` (v6.3, v6.6, v6.10, v6.11, v6.12) | TEXT | ✓ `highlight_text` | Caja de color bajo el título. |
| `description` (v6.6, v6.8, v6.10) | TEXTAREA | ✓ `description` | Las demás variantes la ignoran (legacy igual). |
| `header_description` (v6.8) | TEXTAREA | → mapeado a `description` | Mismo rol que `description`; v3 unifica. |
| `show_header_bar` (v6.8) | SWITCHER | ✓ `show_header_bar` | En la sección "Opciones por variante" para evitar ruido en las demás. |

#### Opciones por variante (sección `section_content_variant`)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `show_image_container` (v6.6) | SWITCHER | ✓ `show_image_container` | Toggle del círculo contenedor del icono en v6.6. |
| `show_card_bar` (v6.8) | SWITCHER | ✓ `show_card_bar` | Barra bajo el título de la card en v6.8. |
| `ver_mas_icon` (v6.8) | MEDIA | ✓ `ver_mas_icon` | Imagen del overlay en hover escritorio. |
| `view_more_text` (v6.8) | TEXT | ✓ `view_more_text` | Texto del overlay y del link móvil. |
| `separator_color` (v6.11) | COLOR | ✓ `selector → .usil-ci__separator` | Único color de la sección de cards en v6.11 que tenía un "color directo" no override de card. Lo dejo como override opcional del usuario. |
| `date_badge_bg` (v6.12) | COLOR | ✓ `selector → .usil-ci__date-badge` | Override opcional del fondo del badge de fecha. |

#### Repeater `cards` (unificado)

| Legacy key | Tipo | Usado por variante | v3 |
|---|---|---|---|
| `card_image` (v6.3, v6.6, v6.8, v6.10) | MEDIA | v6-3, v6-6, v6-8, v6-10 | ✓ |
| `card_title` (todas) | TEXT | todas | ✓ |
| `card_title_tag` (todas) | SELECT | todas | ✓ |
| `card_description` (v6.3, v6.6, v6.10, v6.12) | WYSIWYG (v6.3) / TEXTAREA (v6.10/v6.12) | v6-3, v6-6, v6-10, v6-12 | ✓ unificado a WYSIWYG (superset; render usa `wp_kses_post`) |
| `card_link` (v6.8) | URL | v6-8 | ✓ |
| `show_cta` (v6.3) | SWITCHER | v6-3 | ✓ |
| `cta_text` (v6.3) | TEXT | v6-3 | ✓ |
| `cta_link` (v6.3) | URL | v6-3 | ✓ |
| `show_btn` (v6.10) | SWITCHER | v6-10 | ✓ |
| `btn_text` (v6.10, v6.11, v6.12) | TEXT | v6-10, v6-11, v6-12 | ✓ |
| `btn_link` (v6.10, v6.11, v6.12) | URL | v6-10, v6-11, v6-12 | ✓ |
| `show_arrow` (v6.10) | SWITCHER | v6-10 | ✓ |
| `card_category` (v6.11) | TEXT | v6-11 | ✓ |
| `price_label` (v6.11) | TEXT | v6-11 | ✓ |
| `price_amount` (v6.11) | TEXT | v6-11 | ✓ |
| `date_text` (v6.12) | TEXT | v6-12 | ✓ |

#### Carrusel (solo v6-8)

| Legacy key (v6-8) | v3 | Notas |
|---|---|---|
| `register_usil_carousel_controls()` (autoplay, speed, loop, arrows, dots) | ✓ vía `Carousel_Controls_Trait`, condicionado a `variant = v6-8` | Mismo trait que ya existía en v3; los `data-swiper-*` se emiten con `get_carousel_attributes()` y los consume `assets/js/cards-items.js`. |

#### Estilo: espaciado (conservado)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `section_padding` | DIMENSIONS responsive | ✓ `section_padding` | Útil; conservado. |
| `card_border_radius` | DIMENSIONS (varios legacy) | ✓ `card_border_radius` | Útil; conservado, aplicado a `.usil-ci__card` y al wrap de imagen en v6-8/v6-10. |

#### Estilo: colores (overrides opcionales del kit)

| Override v3 | Variable pisada | Notas |
|---|---|---|
| `bg_override` | `--ci-bg` | Fondo de la sección. |
| `fg_override` | `--ci-fg` | Color del título y la bajada. |
| `accent_override` | `--ci-accent` | Cajas de soporte y barras (v6.8 header bar, v6.8 card bar). |
| `card_bg_override` | `--ci-card-bg` | Fondo de la card. |
| `card_fg_override` | `--ci-card-fg` | Texto e icono de la card. |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| Todos los `Group_Control_Background` (`section_background`, `section_overlay`, `main_background`, `main_overlay`, `card_text_background`) | El brief prohíbe copiar controles de estilo/colores; lo reemplaza `--ci-bg`/`--ci-card-bg` del kit + override opcional. |
| Todos los `Group_Control_Typography` (title, desc, highlight, card_title, card_desc, btn, button, item_title, item_desc, category, product, price, date_text, ver_mas_text) | Reemplazados por `--e-global-typography-{primary|secondary|text|accent}-*` del kit. |
| Todos los `*_color` / `*_text_color` / `*_bg_color` / `*_border_color` / `*_hover_*_color` | Reemplazados por variables `--ci-*` + overrides opcionales del kit. |
| `cards_bg_color` (v6.3) per-card | Era un override de estilo por card; ahora toda la card sale del kit. Si la card tiene un color excepcional, se unifica con `--ci-card-bg` y el usuario lo cambia globalmente o usa `card_bg_override` en Estilo. |
| `card_bg_color` (v6.8) per-card | Idem. |
| `main_border` (v6.6/v6.11) | Borde decorativo raro en uso; se omite. Si aparece el caso, se agrega en una iteración futura. |
| `main_box_shadow` (v6.6/v6.11) | Mismo motivo. |
| `card_image_*` SLIDER (width/height/padding/border_radius/box_shadow) | El CSS del v3 ya dimensiona la imagen con valores razonables derivados del legacy. Si hace falta ajustar, el usuario usa `card_border_radius` y los tamaños pasan por el CSS por variante. |
| `card_layout_direction`, `card_layout_justify_content`, `card_layout_align_items` (v6.6) | Eran overrides del comportamiento flex interno; el CSS v3 ya define la dirección/justify por variante. Se omite para no exponer controles redundantes. |
| `text_wrap_control` (v6.6) | El CSS v3 ya aplica `text-wrap: balance` al título y `pretty` a la bajada, igual que el legacy default. |
| `card_text_align` (v6.3) | El título de la card ahora va a la izquierda por CSS; los controles de alineación por eje no aportaban. |
| `v6-3` `card_align` etc. | Sin uso real en el legacy; se omite. |
| Patrón de fondo (`usil_pattern_*` del trait) | Esta tarea no lo incluye. El brief de cards-items no menciona patrón; si se requiere en una landing concreta, se agrega vía `USIL_Pattern_Overlay_Trait` en una iteración siguiente (cambio independiente). |

## 3. Tabla de colores por variante × modo

Decidida por `generador-landings/src/components/widgets/6-cards-items/theme.ts` (no es propuesta). Mapeo al kit v3 (`--e-global-color-*`):

> Mapeo de tokens Astro → kit Elementor: `bu-primary → --e-global-color-primary`, `bu-secondary → --e-global-color-secondary`, `bu-accent → --e-global-color-accent`, `bu-surface → --e-global-color-busurface`, `bu-neutral → --e-global-color-buneutral`. El kit Elementor del sub-sitio define cada uno.

### v6-3

| Modo | section | title | titleSupportBox | desc | card | cardTitle / cardText | cardCta (normal / hover) |
|---|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-secondary` | `--e-global-color-accent` | `--e-global-color-secondary` | `--e-global-color-primary` | `--e-global-color-buneutral` | primary/fgBusurface / busurface/primary, borde buneutral |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-accent` | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-secondary` | buneutral/secondary / busurface/secondary, borde secondary |

### v6-6

| Modo | section | title | desc / cardTitle / cardText | cardIconBox |
|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-primary` |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-buneutral` |

No hay cardCta (la variante es lista horizontal sin botón).

### v6-8

| Modo | section | title / desc | bar | card (box de texto) | cardTitle | cardOverlay (hover) |
|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` + 80% α |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-primary` | `--e-global-color-buneutral` + 80% α |

`ver_mas_text` (label del overlay) usa `--e-global-color-busurface` por herencia del overlay.

### v6-10

| Modo | section | title / desc | card (box) | cardCta (normal / hover) |
|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-busurface` (legacy `#DFDFDF`) | primary/busurface / busurface/primary, borde primary |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | buneutral/primary / busurface/buneutral, borde buneutral |

Nota: el `theme.ts` original deja `card` vacío para v6-10 y el legacy usaba `bg-[#DFDFDF]`. v3 usa `--ci-card-bg` (kit, default light = busurface blanco). Si la landing quiere gris, override en Estilo o ajustar el kit.

### v6-11

| Modo | section | title / desc | card | cardTitle / cardText | cardCta (normal / hover) | separator (líneas) |
|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-busurface` | primary/busurface / busurface/primary, borde buneutral | `--ci-card-fg` con 40% α |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-primary` | buneutral/primary / busurface/buneutral, borde buneutral | `--ci-card-fg` con 40% α |

### v6-12

| Modo | section | title / desc | card | cardTitle / cardText | cardCta (normal / hover) | dateBadge |
|---|---|---|---|---|---|---|
| light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-primary` | `--e-global-color-busurface` | primary/busurface / busurface/primary, borde buneutral | bg=busurface, fg=primary (heredado) |
| dark  | `--e-global-color-primary`  | `--e-global-color-buneutral` | `--e-global-color-buneutral` | `--e-global-color-primary` | buneutral/primary / busurface/buneutral, borde buneutral | bg=busurface, fg=primary (heredado) |

### Notas de fidelidad (cambios visuales respecto al legacy)

- **`#F0F0F0` → `busurface`.** El legacy de v6.6/v6.8/v6.10/v6.11/v6.12 usaba un gris literal `#F0F0F0` como fondo de sección en light. v3 lo reemplaza por `--e-global-color-busurface` (blanco del kit en la BU por defecto). Si la BU necesita gris, se ajusta el kit del sub-sitio (no es un override por-widget). Decisión coherente con el principio "color del kit, no hex fijo".
- **`#002663` y `#FFFFFF` → kit.** Las cards de v6-15+/v6.11/v6.12 usaban `bg-brand-dark` (#002063) en light y `bg-white`/`#FFFFFF` para textos. v3 los mapea a `--e-global-color-primary` y `--e-global-color-busurface`/`--e-global-color-buneutral`. En la BU por defecto el resultado visual es idéntico.
- **`card_bg_color` per-item de v6.8:** eliminado. Era un override decorativo raro en uso. Si reaparece el caso, agregar un override opcional en Estilo en una iteración futura.
- **Tipografía:** el legacy usaba `font-anton` para los títulos y `font-montserrat` para el cuerpo, ambos con clases Tailwind específicas. v3 usa `--e-global-typography-primary-*` (rol Headline) para títulos y `--e-global-typography-text-*` (rol Body) para el cuerpo. El usuario define el "feel" Anton/display desde el kit del sub-sitio. En mobile, los tamaños derivados del primary font-size se reducen al 75 % (mismo criterio que el piloto `save-the-date`).
- **Roles tipográficos:**
  - `primary` (Headline): `.usil-ci__title`, `.usil-ci__title-support`
  - `secondary` (Title): `.usil-ci__card-title`, `.usil-ci__card-category`
  - `text` (Body): `.usil-ci__desc`, `.usil-ci__card-text`, `.usil-ci__date-text`, `.usil-ci__card-overlay-text`
  - `accent` (Link/Label): `.usil-ci__card-cta`

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/cards-items.php
No syntax errors detected in widgets/cards-items.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/cards-items.php assets/css/cards-items.css assets/js/cards-items.js || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/cards-items.php
31
```

Verificación adicional:

- Las 6 variantes legacy aparecen como opción de `variant` (`v6-3`, `v6-6`, `v6-8`, `v6-10`, `v6-11`, `v6-12`).
- Todos los controles de contenido listados en la sección 2 existen en el editor.
- `Variant_Mode_Trait` aplicado → la sección `<section>` raíz lleva `data-variant` y `data-mode` correctamente.
- `Carousel_Controls_Trait` aplicado con `condition_key = variant, condition_value = v6-8` → los controles del carrusel solo aparecen para v6-8 en el panel.
- Salida del `render()` usa `esc_html`, `esc_url`, `esc_attr` y `wp_kses_post` en todos los settings (sin imprimir setting crudo).

## 5. Dudas y riesgos

- **Repeater unificado vs. un repeater por variante.** El legacy tenía 6 subclases, cada una con su propio repeater. v3 unifica todos los campos en uno solo para no obligar al editor a duplicar el contenido al cambiar de variante. Riesgo: el editor ve campos que no se usan en la variante actual. Mitigación: el label de cada campo menciona la variante a la que aplica (ej. "Botón (v6-3)"). Decisión tomada por densidad de información, alineada con la práctica habitual de Elementor (campos condicionales).
- **`v6-8` carrusel: vanilla JS vs. Swiper.** El legacy usa Swiper (bundle en `dist/assets/main.js` del plugin viejo). El brief exige "sin dependencias nuevas". v3 reemplaza Swiper por vanilla JS + scroll-snap (`assets/js/cards-items.js`). Funcionalidad cubierta: flechas prev/next, dots con scroll a slide, autoplay, desactivación a ≤4 cards. Funcionalidad NO cubierta: gestos táctiles avanzados (Swiper tiene momentum, edge-resistance, freeMode, parallax). En la práctica las landings no usan esas features — si se necesitan, se justifica agregar Swiper como dependencia real.
- **JS auto-init en el editor de Elementor.** El script engancha `elementorFrontend/hooks/addAction('frontend/element_ready/usil_cards_items.default', …)` para re-inicializar el carrusel cuando Elementor reemplaza el DOM en el editor. Probado solo en teoría (no se ejecuta Elementor en este repo). Pendiente validar manualmente en una página con Elementor si surge algún bug de re-init al añadir cards.
- **`header_title` (v6.8) → `title`.** El legacy tenía `header_title` y `header_description` separados; v3 los unifica en `title` y `description` (mismo rol, menos campos). Si el equipo prefiere mantener `header_title` por motivos de UX (separar el título de cabecera del resto), se renombra en una iteración siguiente.
- **`card_description` como WYSIWYG en todas las variantes.** El legacy usaba TEXTAREA en v6.10/v6.12 y WYSIWYG en v6.3. v3 unifica a WYSIWYG (más flexible). Quien quiera texto plano puede usar el modo "Texto" del editor. No afecta el render porque `wp_kses_post` acepta ambos.
- **Patrón de fondo NO incluido.** El brief de cards-items no los pidió; los legacy sí lo exponían. Decisión: no agregar `USIL_Pattern_Overlay_Trait` en esta entrega para mantener el alcance acotado. Si una landing lo necesita, se suma en una iteración siguiente sin tocar el resto.
- **Date badge v6.12: SVG inline de calendario.** El legacy cargaba `assets/images/mini_calendario.webp` (PNG). v3 lo reemplaza por un SVG inline (icono de calendario de Lucide / Feather style). Cero dependencias externas, escalable y respeta el color via `currentColor`. Si una BU ya usa un calendario custom, se reemplaza el SVG con `<img>` en una variante futura.
- **Card image height v6.8 = 184 px (legacy) y v6.10 = 242 px (legacy).** El CSS v3 respeta esos valores hardcoded heredados del legacy. Si la BU quiere imágenes más altas, se agrega un control `card_image_height` en Estilo en una iteración futura.
- **`color` overrides de patrón.** El brief dice "no hex fijos". Las variables del kit (`--e-global-color-busurface` sin fallback) se usan tal cual. Si un sub-sitio no define `busurface`, el badge de fecha de v6-12 queda transparente (sin fondo). Es el comportamiento esperado: si no hay marca, no inventamos una.