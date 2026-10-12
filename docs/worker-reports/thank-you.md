# Worker Report — `thank-you` (familia Gracias / Thank You)

Migración de los widgets legacy a `wp-plugin/usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio (rol mapeado en `assets/css/thank-you.css`; tabla propuesta porque no hay `theme.ts`).

## 1. Variantes

| Legacy (clase / archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `Elementor_Thank_You_Widget` (`thank-you.php`, `show_in_panel = false`) | 15. Thank You (Base) | — | No se ofrece en v3; la base legacy era solo heredada por las dos subclases. En v3 la unificación absorbe `layout_version` (el control interno que seleccionaba v15.1 / v15.2) y los dos subclases dejan de existir. |
| `Elementor_Thank_You_V15_1_Widget` (`thank-you-v15-1.php`) | 15.1 Thank You | `v15-1` | "15.1 — Gracias en columna derecha (con modelo)" |
| `Elementor_Thank_You_V15_2_Widget` (`thank-you-v15-2.php`) | 15.2 Thank You | `v15-2` | "15.2 — Gracias centrado" |

Las dos variantes visibles del legacy aparecen como opciones de `variant`. Default del select: `v15-1` (primera del array, comportamiento de `Variant_Mode_Trait`).

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `layout_version` (HIDDEN en legacy v15-1/v15-2) | SELECT oculto | ✓ `variant` del `Variant_Mode_Trait` | Sustituye al control interno `layout_version`. |
| `logo_usil` | MEDIA | ✓ `logo_usil` | Default = placeholder de Elementor (los `logo_usil.webp` legacy vivían en `usil-elementor-widgets/assets/images/` — no se copian a v3; "Solo toca tus archivos"). |
| `logo_facultad` | MEDIA | ✓ `logo_facultad` | Idem. |
| `model_image` (v15-1) | MEDIA | ✓ `model_image` (condicional a `variant = v15-1`) | Default placeholder. |
| `program_title` (v15-1) | TEXT | ✓ `program_title` (v15-1) | Default `"TÍTULO DEL PROGRAMA"`. |
| `faculty_name` (v15-1) | TEXT | ✓ `faculty_name` (v15-1) | |
| `intro_text` (v15-1) | TEXTAREA | ✓ `intro_text` (v15-1) | |
| `show_thank_you_box` | SWITCHER | ✓ `show_thank_you_box` | Default `yes`. |
| `thank_you_title` | WYSIWYG | ✓ `thank_you_title` | Default legacy preservado. Permite `<span id="hub_firstname">` etc. (lo sanitiza `usil_sanitize_inline_html`). |
| `thank_you_desc` | WYSIWYG | ✓ `thank_you_desc` | Default legacy preservado. Lo sanitiza `usil_sanitize_rich_html`. |
| `show_qr` | SWITCHER | ✓ `show_qr` | |
| `qr_fallback_url` | TEXT | ✓ `qr_fallback_url` | Default legacy preservado. |
| `qr_base_url` | TEXT | ✓ `qr_base_url` | Default legacy preservado. |
| `qr_query_template` | TEXTAREA | ✓ `qr_query_template` | Default legacy preservado (`email={{email}}&firstname={{firstname}}`). |
| `qr_email_field` | TEXT | ✓ `qr_email_field` | |
| `qr_firstname_field` | TEXT | ✓ `qr_firstname_field` | |
| `qr_alt` | TEXT | ✓ `qr_alt` | |
| `show_save_the_date` | SWITCHER | ✓ `show_save_the_date` | |
| `show_save_the_date_box` | SWITCHER | ✓ `show_save_the_date_box` | |
| `save_the_date_title` | TEXT | ✓ `save_the_date_title` | |
| `cards_list` repeater (card_image, card_title, card_description) | REPEATER | ✓ `cards_list` | Mismos campos. Tope en render: 6 ítems (`MAX_CARDS`). Las imágenes default de legacy eran `std_icono_{fecha,hora,modalidad}.webp` — no se copian; v3 usa placeholder de Elementor. |
| `show_calendar_button` | SWITCHER | ✓ `show_calendar_button` | |
| `calendar_button_text` | TEXT | ✓ `calendar_button_text` | |
| Lectura de `fecha_del_evento`, `hora_del_evento`, `lugar_del_evento` desde ACF | (interno, sin control) | ✓ expuesto como 3 campos editables: `calendar_event_date_field`, `calendar_event_time_field`, `calendar_event_location_field` | En el legacy los nombres de los campos ACF eran literales en código. v3 los expone como controles editables (más reusable por sub-sitio). |
| Duración del evento | (interno, 120 min fijos en legacy) | ✓ `calendar_event_duration_minutes` (NUMBER, default 120) | Editor puede ajustar la duración del evento en Google Calendar. |
| `section_padding` (DIMENSIONS responsive) | (no existía como responsive en legacy; era `wrapper_padding`) | ✓ `section_padding` (responsive) | Conservado en Estilo > Espaciado. |
| Patrón de fondo (`usil_pattern_*`) | trait `USIL_Pattern_Overlay_Trait` | ✓ mismo trait, prefijo `usil_pattern` | Conservado (legacy lo usaba). Ver "Dudas y riesgos" sobre el color del patrón. |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `wrapper_background` (Group_Control_Background) | El brief prohíbe copiar controles de estilo/colores del legacy; lo reemplaza la variable `--ty-bg` del kit (más overrides opcionales). |
| `wrapper_border`, `wrapper_shadow`, `wrapper_border_radius` (Border, Box_Shadow, Radius) | Idem. El border y shadow de la caja "Save the Date" ahora vienen del CSS (`--ty-std-bg` y `--ty-std-fg`), sin controles directos. Si en una BU puntual hace falta ajustar, se usa override CSS en la pestaña Estilo del widget o a nivel de kit. |
| `thank_you_box_bg`, `thank_you_box_border`, `thank_you_box_padding`, `thank_you_box_margin`, `thank_you_box_radius`, `thank_you_box_shadow` (todos los de la caja "Gracias") | Idem. Los reemplaza `--ty-box-bg` y los overrides. |
| `thank_you_title_color`, `thank_you_title_typography`, `thank_you_desc_color`, `thank_you_desc_typography` | Idem. Tipografía desde `--e-global-typography-primary-*` / `-text-*` del kit. |
| `qr_max_width`, `qr_border_radius`, `qr_shadow` | El tamaño del QR es fijo (200px desktop, fluido en mobile). Si se necesita editable, se puede agregar en iteración futura. |
| `save_the_date_box_bg`, `save_the_date_box_border`, `save_the_date_box_padding`, `save_the_date_box_margin`, `save_the_date_box_radius`, `save_the_date_box_shadow` | Idem. |
| `save_the_date_title_color`, `save_the_date_title_typography` | Idem. |
| `card_background_color`, `card_padding`, `card_border_radius`, `card_title_color`, `card_title_typography`, `card_desc_color`, `card_desc_typography` | Idem. |
| `card_image_width`, `card_image_padding`, `card_image_border`, `card_image_border_radius`, `card_image_box_shadow` (icono de la card) | Idem. |
| `calendar_button_typography`, `calendar_button_padding`, `calendar_button_text_color`, `calendar_button_bg_color`, `calendar_button_border`, `calendar_button_text_color_hover`, `calendar_button_bg_color_hover`, `calendar_button_border_color_hover`, `calendar_button_radius`, `calendar_button_shadow` (Normal y Hover) | Idem. Hover state del botón usa un pequeño `translateY(-1px)` y `box-shadow: 0 0 0 2px var(--e-global-color-accent)` (anillo de foco accesible). Color de fondo/texto/border sale del kit. |
| `logo_width`, `logo_max_height` (SLIDER responsive) | El tamaño del logo es fijo en el CSS (100px desktop, 100px mobile). Si se necesita ajustable, se reincorpora en iteración futura. |
| `model_image_max_width_desktop`, `model_image_width_tablet`, `model_image_width_mobile` (SLIDER) | El tamaño del modelo es fijo (60% desktop, 50% tablet, 60% mobile). Si se necesita ajustable, se reincorpora. |
| `content_top_offset_mobile`, `content_top_offset_tablet` (SLIDER + `<style>` inline en render) | El legacy emitía `<style>` inline en `render()` con valores calculados desde el setting del slider. v3 lo reemplaza por el control responsive estándar de Elementor (`section_padding`) y deja que el layout fluya por CSS. Si el editor necesita un offset específico para el modelo, se usa el padding de la sección. Decisión documentada en "Dudas y riesgos". |
| Estilos de `style_content_offset_mobile` y `style_content_offset_tablet` (secciones del legacy) | Idem. El offset queda dentro de `section_padding`. |
| `style_content_offset_mobile`, `style_content_offset_tablet` secciones completas | Idem. |

### Notas de fidelidad sobre el SVG del calendario

El legacy tenía un SVG multicolor del logo de Google Calendar (rojo, verde, amarillo, azul). El brief prohíbe colores hex fijos en render y CSS, así que v3 emite una versión monocroma del SVG con `fill="currentColor"` y opacidades escalonadas (0.55–0.95). El color real lo define `var(--ty-btn-fg)` del kit. Si en una BU concreta se requiere el logo multicolor real del GCal, hay que negociar con Google el uso del brand (no es un cambio trivial).

## 3. Tabla de colores por variante × modo

Esta familia **no tiene `theme.ts`** en `generador-landings/src/components/widgets/` (no fue portada a Astro todavía). La siguiente tabla es **PROPUESTA** del worker, basada en el brief: "Claro usa los roles naturales (surface de fondo, primary para títulos y CTA); Oscuro reasigna los mismos roles (primary o secondary de fondo, neutral para texto)." Las dos variantes comparten la misma tabla (la diferencia entre v15-1 y v15-2 es layout, no color).

| Parte del widget | Modo Claro | Modo Oscuro | Variable CSS |
|---|---|---|---|
| Fondo de la sección (`<section class="usil-ty">`) | `busurface` (propuesto: blanco en lugar del `#F0F0F0` legacy) | `primary` | `--ty-bg` |
| Texto de la columna izquierda v15-1 (program_title, faculty_name, intro_text) | `primary` | `busurface` | `--ty-left-fg` |
| Fondo de la caja "Gracias" | `primary` | `buneutral` | `--ty-box-bg` |
| Texto de la caja "Gracias" (title, desc) | `busurface` | `primary` | `--ty-box-fg` |
| Fondo de la caja "Save the Date" | `primary` | `buneutral` | `--ty-std-bg` |
| Texto y borde de la caja "Save the Date" (title, border) | `busurface` | `primary` | `--ty-std-fg` |
| Fondo de las cards internas | `busurface` | `primary` | `--ty-card-bg` |
| Texto de las cards internas (label, value) | `primary` | `buneutral` | `--ty-card-fg` |
| Fondo del botón calendario | `primary` | `buneutral` | `--ty-btn-bg` |
| Texto del botón calendario | `busurface` | `primary` | `--ty-btn-fg` |
| Borde del botón calendario | `busurface` | `primary` | `--ty-btn-border` |

**Fidelidad con el legacy** (cambios visuales esperados):

- **Fondo `#F0F0F0` reemplazado por `busurface` del kit** (mismo criterio que el resto de widgets v3 — p. ej. `save-the-date` y `ponentes-testimonios`). En el kit por defecto eso es blanco (`#ffffff`). **Marcado como propuesta**: si en alguna BU `busurface` no es blanco, ese color regirá. Decisión coherente con el patrón de Ola 1.
- **Cajas internas (Gracias, Save the Date)**: en light son `primary` (azul de marca del BU) con texto `busurface` (blanco). En dark se invierten a `buneutral` de fondo y `primary` de texto (las cajas "destacan" sobre el fondo dark de la sección). Conserva la jerarquía visual del legacy donde las cajas oscuras eran el foco de la página.
- **Cards internas en dark**: pasan a tener fondo `primary` y texto `buneutral` (mantienen contraste alto sobre el fondo `buneutral` de la caja "Save the Date").
- **Botón calendario**: en light, mismo color que las cajas (primary + busurface); en dark, contraste invertido (buneutral + primary). El SVG del calendario es monocromo con `currentColor`, así que sigue el color del texto.
- **Tipografía**: el legacy usaba `font-anton` + clases `text-anton-block-title-*` para el título de la caja "Gracias" y `font-montserrat` + `text-mont-*` para todo lo demás. v3 usa `--e-global-typography-primary-*` para el título de Gracias y program_title (Anton-like por convención del kit), `--e-global-typography-secondary-*` para los value/subtítulos y `--e-global-typography-text-*` para los labels y body. El usuario define el "feel" desde el kit del sub-sitio. En mobile, los títulos se reducen (75-85 % según el caso) y los anchos de card se fluidifican.

Los overrides de color opcionales en la pestaña Estilo (vacíos por defecto) pisan las 10 variables `--ty-*` vía `{{WRAPPER}} .usil-ty`, igual que el pilot `save-the-date` con `--std-*` y `ponentes-testimonios` con `--pt-*`.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/thank-you.php
No syntax errors detected in widgets/thank-you.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/thank-you.php assets/css/thank-you.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/thank-you.php
33
```

Verificación adicional:
- Las 2 variantes visibles legacy aparecen como opción de `variant` en `usil_add_variant_mode_controls()` (`v15-1`, `v15-2`). La base legacy (`thank-you.php` con `show_in_panel = false`) no se ofrece como tal: en v3 la unificación absorbe su `layout_version` interno y los dos subclases heredan su render directamente.
- Todos los controles de contenido del legacy listados en la sección 2 existen en el editor de v3.
- `get_name()` = `usil_thank_you`; `get_categories()` = `['usil_v3']`; `get_style_depends()` devuelve `['usil-v3-thank-you']`; `get_script_depends()` devuelve `['usil-v3-thank-you']`. El plugin principal (`usil-elementor-widgets-v3.php`) tiene `usil_v3_register_styles()` y `usil_v3_register_scripts()` que autodescubren `assets/css/*.css` y `assets/js/*.js` (Leccion 2 de la Ola 1).
- Sin constructor ni registro manual del script en el widget (Leccion 2). Solo `get_script_depends()`.
- Todos los métodos auxiliares del legacy (`get_event_date_string`, `normalize_event_time_string`, `is_valid_url_string`, `extract_location_label_from_url`, `parse_event_start_end`, `build_google_calendar_url`, `sanitize_*`, `render_*`, `get_calendar_url`, `render_logos`, `render_thank_you_box`, `render_save_the_date_box`, `render_v15_1`, `render_v15_2`) están prefijados con `usil_` para evitar pisar métodos de Elementor (Leccion 1). Para los atributos del `<a>` del botón se usan `$this->add_link_attributes()` y `$this->print_render_attribute_string()` (métodos públicos de Elementor) en lugar de imprimir el HTML a mano.

## 5. Dudas y riesgos

- **`content_top_offset_mobile` / `content_top_offset_tablet` del legacy eliminados.** El legacy emitía `<style>` inline en `render()` con el valor calculado desde el slider del control (selector `{{WRAPPER}} .hk-model-image { margin-top: … }`). El brief prohíbe `<style>` inline en render con colores fijos — y aunque el offset no es un color, su mecanismo era frágil (dependiente del ID del widget, dos `<style>` por render). v3 lo absorbe en `section_padding` (responsive DIMENSIONS). Si el editor de una BU concreta necesita afinar el offset del modelo independientemente del padding de la sección, hay que reincorporarlo como control separado. Decisión: omitido en esta entrega, documentado aquí.
- **Logo de Google Calendar multicolor → monocromo.** El brief prohíbe colores hex fijos; el SVG del GCal del legacy tenía 6 hex (`#4285F4`, `#34A853`, `#FBBC04`, `#EA4335`, `#188038`, `#1967D2`). v3 emite una versión monocroma con `currentColor` y opacidades. Si el equipo de diseño confirma que Google autoriza usar el logo multicolor real con colores fijos en una BU concreta, se puede volver al SVG original con esos hex inline (estaría dentro del `<svg>` inline, no en CSS — pero conviene chequear con Legal/Marca primero).
- **Imágenes default del legacy (`logo_usil.webp`, `logo_facultad.webp`, `std_icono_*.webp`) no se copian a v3.** Vivían en `usil-elementor-widgets/assets/images/`. El brief dice "Solo toca tus archivos" — no se importan al plugin v3. v3 usa el placeholder de Elementor. El editor debe subir sus logos e iconos por sub-sitio. Si se necesitan assets compartidos, hay que crear `wp-plugin/usil-elementor-widgets-v3/assets/images/` y agregarlos en una iteración futura (alcance: equipo).
- **Nombres de campos ACF ahora editables.** El legacy tenía `fecha_del_evento`, `hora_del_evento`, `lugar_del_evento` literales en PHP. v3 los expone como 3 controles TEXT editables. Más reusable, pero pierde la "opinión" del legacy de que esos son los nombres canónicos. Si la convención es fija, se puede volver a literales + notas en la descripción del control. Decisión: editable, más flexibilidad.
- **Color del patrón de fondo sigue siendo picker directo** (Leccion 5). `USIL_Pattern_Overlay_Trait` registra color pickers con defaults hex (`#000000`, `#002663`, `#0050C8`) y los emite como `style="…"` inline cuando se activa. Esto contradice el principio "color del kit, no hex fijo", pero la limitación está en el trait, no en este widget. Mismo riesgo que el resto de widgets v3; pendiente para el equipo (migrar el patrón a token-aware).
- **Botón calendario disabled en `<button>` cuando no hay URL.** El legacy usaba `<button disabled>` cuando no podía armar la URL de Google Calendar. v3 conserva el patrón pero lo aplica la clase `usil-ty__calendar--disabled` (opacity reducida, cursor not-allowed). El estilo sale del kit sin hex.
- **JS del QR sin auto-reinicio por cambios de viewport o settings.** A diferencia del carrusel de `cards-items` / `ponentes-testimonios`, el JS del QR corre una sola vez por imagen (marca `data-usil-ty-qr-done="1"`). Si el editor cambia los `data-qr-*` desde el panel, no se vuelve a renderizar. Esto es consistente con el legacy (también corría una vez). Si el editor necesita preview dinámico de los campos QR en vivo, hay que disparar el update desde `frontend/element_ready/<widget>.default` (ya implementado) y desde un eventual hook de cambio de setting. Por ahora, en el editor se ve el `qr_fallback_url` (mecanismo heredado del legacy).
- **Variante v15-2 con `min-height: 100dvh`.** El legacy forzaba altura completa del viewport para v15-2 (`min-h-[100dvh]`). En v3 esto está en CSS. Si la página tiene header sticky o footer absoluto, el widget puede solapar. Decisión: mantener el patrón del legacy; ajustar con `section_padding` desde el panel si hace falta.