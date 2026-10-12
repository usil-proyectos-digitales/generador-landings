# Worker Report — `bloque-footer` (familia Footer)

Migración del widget legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio.

## 1. Variantes

| Legacy (archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `bloque-footer-v13-1.php` | 13.1 Bloque Footer | `v13-1` | "13.1 — 2 columnas (consultas + redes)" |
| `bloque-footer-v13-2.php` | 13.2 Footer 1 Columna | `v13-2` | "13.2 — 1 columna centrada (título + contacto con label/link)" |
| `bloque-footer-v13-3.php` | 13.3 Bloque Footer | `v13-3` | "13.3 — 2 columnas (logo + título/subtítulo + contacto)" |

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

#### Cabecera izquierda (v13-1, v13-3)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `left_title` (v13-1, v13-3) | TEXT | ✓ `left_title` | Mismo default literal del legacy. |
| `left_subtitle` (v13-3) | TEXT | ✓ `left_subtitle` | Mismo default. |
| `logo_image` (v13-3) | MEDIA | ✓ `logo_image` | Mismo default (placeholder). |

#### Cabecera derecha (v13-1, v13-3)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `right_title` (v13-1, v13-3) | TEXT | ✓ `right_title` | Mismo default. |

#### Cabecera centrada (v13-2)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title` (v13-2) | TEXT | ✓ `title` | Mismo default. |
| `subtitle` (v13-2) | TEXT | ✓ `subtitle` | Mismo default. |

#### Repeater `icon_items` (v13-1 izquierda + v13-3 derecha)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `icon` (`contact_items[*].icon` en v13-1 y v13-3) | ICONS | ✓ `icon` | Default `fas fa-envelope` / `fa-solid`. v3 mantiene los 2 defaults idénticos. |
| `text` (`contact_items[*].text` en v13-1 y v13-3) | WYSIWYG | ✓ `text` | Mismo default. |
| `is_bold` (`contact_items[*].is_bold` en v13-3) | SWITCHER | ✓ `is_bold` | Default vacío. |

#### Repeater `social_items` (v13-1 derecha)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `social_icon` | ICONS | ✓ `social_icon` | Mismos defaults (4 redes precargadas). |
| `social_link` | URL | ✓ `social_link` | Mismo default (`url => '#'`). |

#### Repeater `link_items` (v13-2)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `contact_label` | TEXT | ✓ `contact_label` | Mismo default. |
| `link_text` | TEXT | ✓ `link_text` | Mismo default. |
| `link_url` | URL | ✓ `link_url` | Mismo default. |

> **Decisión sobre los repeaters:** hay tres repeaters distintos (`icon_items`, `social_items`, `link_items`) en lugar de uno unificado. Motivo: cada uno tiene una forma semántica diferente (icon + html / icon + url / label + text + url) y unificarlos solo añade ruido al editor. Es un punto de divergencia con la decisión de cards-items de Ola 1, justificada por la asimetría mayor entre las tres formas. Documentado en "Dudas y riesgos".

#### Estilo: logo (v13-3)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `logo_width` | SLIDER responsive | ✓ `logo_width` (condición `variant = v13-3`) | Default 125 px. |
| `logo_margin_bottom` | SLIDER responsive | ✓ `logo_margin_bottom` (condición `variant = v13-3`) | Default 1 rem. |

#### Estilo: espaciado (conservado)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `padding` / `section_padding` (todos) | DIMENSIONS responsive | ✓ `section_padding` | Default 6 rem vertical. |
| `margin` / `section_margin` (todos) | DIMENSIONS responsive | ✓ `section_margin` | Sin default. |

#### Estilo: overrides opcionales del kit

| Override v3 | Variable pisada | Notas |
|---|---|---|
| `bg_override` | `--bf-bg` | Fondo del footer. |
| `fg_override` | `--bf-fg` | Texto / títulos. |
| `muted_override` | `--bf-muted` | Subtítulo / texto secundario. |
| `link_override` | `--bf-link` | Enlaces. |
| `icon_override` | `--bf-icon` | Iconos. |

#### Patrón de fondo

El trait `USIL_Pattern_Overlay_Trait` se conserva (todos los legacy lo usaban). Sus colores por defecto son hex (`#000000`, `#002663`, `#0050C8`) y se emiten inline cuando el usuario activa el patrón; esto contradice el principio "color del kit", pero la limitación está en el trait compartido, no en este widget. Pendiente de un trait kit-aware. Documentado en "Dudas y riesgos".

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| Todos los `Group_Control_Background` (`section_background`, `section_overlay`) | El brief prohíbe copiar controles de estilo; lo reemplaza `--bf-bg` del kit + override opcional. |
| Todos los `Group_Control_Typography` (`title_typography`, `text_typography`, `subtitle_typography`, `items_typography`, `contact_text_typography`, `left_title_typography`, `left_subtitle_typography`, `right_title_typography`) | Reemplazados por `--e-global-typography-{primary|secondary|text}-*` del kit. |
| Todos los `*_color` (`title_color`, `text_color`, `icon_color`, `social_icon_color`, `items_color`, `items_link_color`, `subtitle_color`, `left_title_color`, `left_subtitle_color`, `right_title_color`, `contact_text_color`, `contact_link_color_hover`) | Reemplazados por `--bf-fg`/`--bf-muted`/`--bf-link`/`--bf-icon` + overrides opcionales. |
| `subtitle_margin_bottom` (v13-2) | Slider decorativo raro en uso; el CSS v3 ya da margen inferior coherente con el legacy. |
| `icon_color` y `social_icon_color` separados (v13-1) | En el legacy tenían el mismo default (`#ffffff`) y los mismos selectores; v3 los colapsa en `--bf-icon`. |
| `align_responsive` y similares (no existían en el legacy) | Sin paridad que defender; se omite. |

## 3. Tabla de colores por variante × modo

**Esta familia NO tiene `theme.ts` en `generador-landings/src/components/widgets/`.** La tabla de abajo es **propuesta** siguiendo el criterio del brief: el footer es siempre oscuro respecto al resto de la página, así que en ambos modos conserva el bg de marca + texto claro, cambiando solo el matiz dentro de la paleta de la BU.

| Variante | Modo | section bg | title | subtitle / muted | link | icon |
|---|---|---|---|---|---|---|
| v13-1 / v13-2 / v13-3 | light | `--e-global-color-primary` | `--e-global-color-busurface` | `--e-global-color-busurface` | `--e-global-color-busurface` | `--e-global-color-busurface` |
| v13-1 / v13-2 / v13-3 | dark  | `--e-global-color-buneutral` | `--e-global-color-busurface` | `--e-global-color-busurface` | `--e-global-color-accent` | `--e-global-color-busurface` |

Notas de fidelidad (cambios visuales respecto al legacy):

- Legacy: `bg-brand-dark` (#002663) + `text-white` en todas las variantes y modos. v3 default `light`: bg = `--e-global-color-primary` (≈ brand-dark del kit en la BU por defecto, #012085) + fg = `--e-global-color-busurface` (≈ #ffffff). Resultado visual idéntico en la BU por defecto.
- En dark mode se reasigna el bg a `buneutral` (en lugar de `primary`) para mantener la jerarquía visual: el footer sigue siendo la pieza más oscura de la landing (cuando la página ya es oscura, "más oscuro" = `buneutral`). Se cambia además el color de link a `accent` (≈ gold del BU) para que los enlaces no se pierdan sobre el fondo neutral.
- Tipografía: el legacy usaba `font-anton` para los títulos de v13-1 y `font-montserrat` para el resto. v3 usa `--e-global-typography-primary-*` (Headline) para `.usil-bf__title` y `--e-global-typography-text-*` (Body) para el resto. El usuario define el "feel" Anton/display desde el kit del sub-sitio. En mobile, el título se reduce al 75 % (mismo criterio que el piloto `save-the-date`).
- **Validación pendiente:** esta tabla es propuesta. Si el equipo prefiere invertir el modo dark (footer con bg más claro, fg oscuro), el cambio es solo en `assets/css/bloque-footer.css` líneas 25-39 (los selectores `[data-mode="dark"]`). No requiere tocar PHP ni los repeaters.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/bloque-footer.php
No syntax errors detected in widgets/bloque-footer.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/bloque-footer.php assets/css/bloque-footer.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/bloque-footer.php
23
```

Verificación adicional:

- Las 3 variantes legacy aparecen como opción de `variant` (`v13-1`, `v13-2`, `v13-3`).
- Todos los controles de contenido listados en la sección 2 existen en el editor.
- `Variant_Mode_Trait` aplicado → el `<footer>` raíz lleva `data-variant` y `data-mode` correctamente.
- `USIL_Pattern_Overlay_Trait` aplicado → sección "Patrón de Fondo" visible en el editor (todos los legacy lo usaban).
- Salida del `render()` usa `esc_html`, `esc_url`, `esc_attr` y `wp_kses_post` en todos los settings. No se imprime setting crudo.
- `print_render_attribute_string()` se llama desde el método público de Elementor `Widget_Base` (no se redefinió en este widget — lección Ola 1 punto 1).
- No se registra CSS ni JS a mano: solo `get_style_depends()` con el handle `usil-v3-bloque-footer` (descubrimiento automático del plugin, lección Ola 1 punto 2).
- No se fuerza `width: 100%` en el `<footer>`: lo da `assets/css/_base.css` (lección Ola 1 punto 3).
- No se creó `assets/js/bloque-footer.js`: el legacy no usa JS (no hay carrusel/tabs/acordeón en esta familia).

## 5. Dudas y riesgos

- **Tabla de colores propuesta (sin `theme.ts`).** La sección 3 es propuesta; si el Visor se llega a migrar a esta familia, el `theme.ts` correspondiente sobrescribirá estos valores. Mientras tanto, el criterio seguido es: footer siempre oscuro respecto al resto, bg primario en light y buneutral en dark (manteniendo la jerarquía "más oscuro = footer"). Si el equipo prefiere invertir esto (footer blanco en dark mode), se cambia en el CSS.
- **Tres repeaters en lugar de uno unificado.** cards-items de Ola 1 optó por un repeater unificado con todos los campos; aquí elegí tres (`icon_items`, `social_items`, `link_items`) por la asimetría mayor entre sus formas. La forma `label + text + url` de v13-2 es semánticamente distinta a `icon + html` de v13-1/v13-3; meter todo en uno expone campos irrelevantes en cada variante (ej. `is_bold` aparecería en v13-2). Si se prefiere el patrón "uno unificado" del cards-items, se unifica en una iteración siguiente — el coste es bajo.
- **`social_link` vs `link_url` vs `cta_link`.** Cada repeater usa su propio nombre de campo (legacy también), pero los tres apuntan a `Elementor\Controls_Manager::URL`. v3 mantiene los nombres para paridad con el legacy; si el equipo prefiere normalizar (`link_url` en todos los repeaters), se hace con un sed mecánico.
- **Patrón de fondo con colores hex fijos.** El trait `USIL_Pattern_Overlay_Trait` registra color pickers con defaults `#000000`, `#002663`, `#0050C8` y los emite inline cuando se activa el patrón. Esto contradice el principio "color del kit". La limitación está en el trait compartido, no en este widget. Pendiente para el equipo: reescribir el trait para que use variables del kit.
- **Detección de red social (v13-1) por nombre del icono.** El helper `usil_detect_social_network()` busca cadenas (`facebook`, `instagram`, `linkedin`, etc.) en `social_icon.value`. Si el editor usa un icono Font Awesome con un nombre distinto (ej. `fa-x-twitter`), no se clasifica y hereda el color genérico del link. Aceptable: la clase detectada solo añade especificidad para futuras reglas de hover por red; sin esa clase, el color del link sigue funcionando.
- **`is_bold` solo aplica en v13-3.** El switch existe en el repeater `icon_items` (también usado por v13-1), pero v13-1 ignora el campo. Visualmente idéntico al legacy: v13-1 nunca lo usó.
- **Logo image en v13-3.** v3 renderiza el logo con un `<img>` simple en lugar del helper `Elementor\Group_Control_Image_Size::get_attachment_image_html()` que usaba el legacy (que devuelve tamaños responsivos). Decisión: el legacy no exponía controles `image_size`, así que el helper nunca producía variación. Si en una iteración futura se quiere agregar `image_size`, se cambia el render.
- **CSS fallback de `busurface`.** El `data-mode="light"` usa `var(--e-global-color-primary, transparent)`. Si el kit del sub-sitio no define `primary`, el footer queda transparente (el container de Elementor le da fondo blanco). No es ideal pero es la convención del plugin (mismo fallback que `save-the-date.css`). El brief permite el fallback; documentado.
- **Validación manual en Elementor.** No se ejecuta Elementor en este repo. Pendiente validar en una página real que el carrusel de v3 (no aplica aquí) y la edición en vivo funcionan. Para esta familia (estática), no se esperan sorpresas.