# Worker Report — `bloque-contenido-imagen` (familia 9 — Contenido + imagen)

Migración de los widgets legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (`v9-1`, `v9-2`, `v9-3`) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio. Sin `theme.ts` de Astro: la tabla de roles por modo se **propone** abajo.

## 1. Variantes

| Legacy (clase / archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `Elementor_Bloque_Contenido_Imagen_V9_1_Widget` (`bloque-contenido-imagen-v9-1.php`) | 9.1 Bloque Contenido Imagen | `v9-1` | "9.1 Texto + imagen (2 columnas)" |
| `Elementor_Bloque_Contenido_Imagen_V9_2_Widget` (`bloque-contenido-imagen-v9-2.php`) | 9.2 Bloque Contenido Imagen Centrado | `v9-2` | "9.2 Texto + imagen centrado" |
| `Elementor_Bloque_Contenido_Imagen_V9_3_Widget` (`bloque-contenido-imagen-v9-3.php`) | 9.3 Bloque Contenido Imagen | `v9-3` | "9.3 Texto + imagen bloque completo" |

Las tres variantes tienen estructura HTML distinta (grid 2 col / stacked / split full-bleed), por lo que el render ramifica en PHP con helpers privados prefijados `usil_render_v91` / `usil_render_v92` / `usil_render_v93` (lección Ola 1 #1: prefijar auxiliares para evitar colisión con la API pública de Elementor).

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

| Legacy key | Variante(s) | Tipo | v3 | Notas |
|---|---|---|---|---|
| `title` | v9-1, v9-2 | TEXT | ✓ `title` | Unificado. Legacy v9-3 usaba `title_text` (mismo propósito); se normaliza a `title` en v3 — documentado en "Dudas y riesgos". |
| `highlight_text` | v9-1 | TEXT | ✓ `highlight_text` (cond. v9-1) | Solo v9.1 lo tenía (la caja bajo el título libre). |
| `description` | todas | WYSIWYG | ✓ `description` | Default común. |
| `image` | todas | MEDIA | ✓ `image` (default `\Elementor\Utils::get_placeholder_image_src()`) | El legacy tenía placeholders size-specific (620x459, 626x372, 867x730); en v3 se usa el helper genérico de Elementor y el tamaño se controla por CSS por variante. |
| `image_position` (CHOOSE left/right) | v9-1 | CHOOSE | ✓ `image_position` (cond. v9-1, default right) | Orden de columna en el grid 2 col. |
| `layout_direction` | v9-3 | SELECT normal/reversed | ✓ `layout_direction` (cond. v9-3) | |
| `text_align` (responsive CHOOSE) | v9-3 | CHOOSE | ✓ `text_align` (cond. v9-3) | Con `selectors_dictionary` → text-align + align-items. |
| `image_position` (SELECT center/top/.../left/right) | v9-3 | SELECT | ✓ `bg_image_position` (cond. v9-3, default center) | **Renombrado**: colisión de key legacy con el `image_position` de v9-1 (mismo nombre, propósito distinto: `background-position` vs orden de grid). Ver "Dudas y riesgos". |
| `image_size` (cover/contain/auto) | v9-3 | SELECT | ✓ `image_size` (cond. v9-3, default cover) | Controla `background-size` del div de fondo. |
| `section_padding` (DIMENSIONS responsive) | todas | DIMENSIONS | ✓ `section_padding` | Conservado como espaciado útil. |
| `image_border_radius` (DIMENSIONS, v9-1/v9-2) | v9-1, v9-2 | DIMENSIONS | ✓ `image_border_radius` (cond. v9-1/v9-2, default 2rem) | Conservado. |
| `items_gap` (SLIDER, v9-2) | v9-2 | SLIDER | ✓ `items_gap` (cond. v9-2, default 3rem) | Separación entre texto e imagen. |
| `title_margin_bottom` (SLIDER, v9-2) | v9-2 | SLIDER | ✓ `title_margin_bottom` (cond. v9-2, default 3rem) | |
| `section_height` (SLIDER responsive, v9-3) | v9-3 | SLIDER | ✓ `section_height` (cond. v9-3, default 730px) | min-height de la sección en desktop. |
| Patrón de fondo (`usil_pattern_*`) | todas | trait `USIL_Pattern_Overlay_Trait` | ✓ mismo trait, prefijo `usil_pattern` | Conservado. Ver "Dudas y riesgos" sobre el color del patrón. |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `bg_color` (v9-1 #F0F0F0) | Reemplazado por `--bci-bg` del kit + override opcional. |
| `section_background` / `section_overlay` (Group_Control_Background) | Idem. |
| `section_margin` (DIMENSIONS) | Rara vez usado en el legacy; se omite (mismo criterio que `intro-text-block`). El usuario puede aplicar margin desde el layout de Elementor. |
| `title_typography`, `title_color`, `description_typography`, `description_color` (v9-1, v9-2, v9-3) | Reemplazados por tipografía del kit (`--e-global-typography-primary-*` para el título, `--e-global-typography-text-*` para la descripción) y por `--bci-title` / `--bci-desc` con override opcional. |
| `highlight_typography`, `highlight_text_color`, `highlight_bg_color` (v9-1) | Reemplazados por tipografía del kit y por `--bci-box-bg` / `--bci-box-fg` con override opcional. |
| `title_typography`, `title_color`, `title_bg_color` (v9-2, v9-3) | Idem. |
| `highlight_padding` (v9-1), `title_padding` (v9-2, v9-3) | La geometría de la caja (padding 0.5rem 1.5rem) se hardcodea como constante de diseño del componente "caja-titulo" en CSS, no se expone como control. Reduce la superficie del editor y alinea con la Ola 1 (cards-items expone solo `section_padding` y `card_border_radius` como controles de espaciado). Si en el futuro un BU necesita ajustar la caja, agregarlo como control DIMENSIONS condicional. |
| `title_border_radius` (v9-2, v9-3) | Idem: radius 0.75rem hardcodeado en CSS. |
| `image_max_width` / `image_max_height` (v9-1, v9-2 SLIDER) | Los tamaños del placeholder legacy (620x459, 626x372) se hardcodean como `max-width` / `max-height` / `object-fit` por variante en CSS. El usuario puede subir cualquier imagen y el CSS la recorta/ajusta. Omite 2 controles por variante; alineado con la Ola 1 (cards-items no expone sliders de tamaño por imagen). |
| `image_box_shadow` (v9-1, v9-2 Group_Control_Box_Shadow) | Efecto de estilo. Ola 1 no lo expone; el legacy tampoco lo usaba por defecto. |
| `image_position` (v9-3, SELECT bg-position) | Renombrado a `bg_image_position` (ver tabla de arriba). |
| ID de `<section>` (`bloque-contenido-imagen-v9-X` hardcoded) | Era literal, no control. No se expone en v3. |

## 3. Tabla de colores por modo (PROPUESTA — sin `theme.ts`)

Aplica a las tres variantes (la estructura cambia, no la tabla de roles). Regla de la Ola 1 #6: "Claro usa los roles naturales (surface de fondo, primary para títulos y CTA); Oscuro reasigna los mismos roles (primary o secondary de fondo, neutral para texto)."

| Parte | Light | Dark |
|---|---|---|
| section `bg` | `--e-global-color-busurface` | `--e-global-color-primary` |
| Título (texto libre, v9-1) | `--e-global-color-primary` | `--e-global-color-buneutral` |
| Caja de soporte `bg` (caja-titulo) | `--e-global-color-primary` | `--e-global-color-buneutral` |
| Caja de soporte `fg` (texto dentro de la caja) | `--e-global-color-busurface` | `--e-global-color-primary` |
| Descripción | `--e-global-color-primary` | `--e-global-color-buneutral` |

Notas de fidelidad (cambios visuales respecto al legacy):

- Legacy sección: `bg-[#F0F0F0]` (gris fijo) en las 3 variantes. v3: `busurface` (típicamente blanco) en light / `primary` en dark. Coincide con la lógica de la Ola 1 y con la tabla de `intro-text-block`.
- Legacy caja (todas las variantes): `bg-brand-dark` (#012085) + `text-white`. v3 light: `primary` + `busurface` (mismo aspecto en la BU por defecto). v3 dark: se invierte a `buneutral` + `primary` (caja clara con texto primary sobre fondo primary).
- Tipografía: el legacy usaba `font-anton` + `text-anton-block-title-mobile/md` (display font) para el título y `font-montserrat` + `text-mont-block-p-mobile/md` para la descripción. v3 usa `--e-global-typography-primary-*` para el título y `--e-global-typography-text-*` para la descripción. El "feel" Anton se logra configurando el kit de la BU. Mismo criterio que `intro-text-block`.
- Mobile: el kit no define tamaños responsive. v3 reduce el título al 75 % y la descripción al 95 % en `@media (max-width: 767px)`, igual que el piloto `save-the-date` y `intro-text-block`. El legacy tenía `py-24` (6rem) en v9-1/v9-2 mobile; v3 reduce a `4rem` siguiendo la convención del design system.

Overrides opcionales en la pestaña Estilo (vacíos por defecto) pisan `--bci-bg`, `--bci-title`, `--bci-box-bg`, `--bci-box-fg` y `--bci-desc` vía `{{WRAPPER}} .usil-bci`, como el piloto.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/bloque-contenido-imagen.php
No syntax errors detected in D:\laragon\www\github\usil-widgets\wp-plugin\usil-elementor-widgets-v3\widgets\bloque-contenido-imagen.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/bloque-contenido-imagen.php assets/css/bloque-contenido-imagen.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/bloque-contenido-imagen.php
20
```

Verificación adicional: cada variante legacy aparece como opción de `variant` (v9-1, v9-2, v9-3) y los controles de contenido listados en la sección 2 existen en el editor.

## 5. Dudas y riesgos

- **Sin JS (legítimo).** El legacy no usa carrusel/tabs/acordeón. El `migrar/9-bloque-contenido-imagen/index.js` es el selector de variante del Visor de Astro (panel de control en el iframe), no runtime del widget. Por tanto no se crea `assets/js/bloque-contenido-imagen.js` y el widget no declara `get_script_depends()`. (Lección Ola 1 #4: "Si el legacy usa JS".)
- **Normalización de `title` / `title_text`.** El legacy v9-1 y v9-2 usaban `title`; v9-3 usaba `title_text` (mismo propósito, key distinta: inconsistencia legacy). En v3 se unifica en `title`. Los sitios que migren contenido v9-3 desde el legacy perderán el texto del título (no hay mapeo automático de keys en Elementor); el redactor debe reingresarlo. Aceptable para una migración mayor a v3, pero documentado.
- **Colisión de `image_position` en el legacy (v9-1 vs v9-3).** En el legacy la misma key `image_position` controlaba dos cosas distintas: el orden de columnas en el grid de v9-1 (CHOOSE left/right) y la `background-position` de la imagen de v9-3 (SELECT center/top/.../left/right). En v3 se separan en dos controles: `image_position` (v9-1, grid order) y `bg_image_position` (v9-3, bg-position). Decisión pragmática para evitar ambigüedad; el propósito de cada control se conserva.
- **`text_align` por defecto.** El legacy tenía `text-center lg:text-left` como clase base, pero el control `text_align` con default `left` (todas las resoluciones) y `selectors_dictionary` que aplica `text-align + align-items` anulaba la base. El visual efectivo del legacy era `text-align: left` en todos los breakpoints. v3 mantiene el default del control en `left` (paridad) y no aplica `text-align` en el CSS base de `.usil-bci__text-v93`, dejando que el control (y por tanto el usuario) sea la única fuente de verdad.
- **`image_size` (v9-3) y el `!important` legacy.** El legacy v9-3 usaba `background-size: {{VALUE}} !important;` para que el control venciera a la clase base `bg-[length:100%_auto] lg:bg-cover` del template. v3 no tiene esa clase base (el CSS no define `background-size` por defecto para `.usil-bci__image-bg`), por lo que el control se aplica sin necesidad de `!important`. Cumplimos con la regla "no copiar `!important` del legacy" y evitamos la cascada forzada.
- **A11y de la imagen en v9-3.** La imagen de v9-3 se renderiza como `background-image` en un `<div>` (no `<img>`), por lo que no tiene `alt`. En el render agregué `role="img" aria-hidden="true"` al div interno. Esto es coherente con el legacy (que tampoco daba alt a esa imagen) y refleja que la imagen es decorativa del layout split. Si en una BU la imagen fuera informativa, se debería usar v9-1 o v9-2, que sí renderizan `<img>` con alt. Riesgo bajo; documentado.
- **CSS global de a11y ausente en v3 (regresión a `intro-text-block`).** Esta familia no usa `USIL_Title_Visibility_Trait`, por lo que el gap no aplica aquí. El widget no emite la clase `usil-visually-hidden`.
- **Trait de patrón: color hex por defecto.** `USIL_Pattern_Overlay_Trait` sigue emitiendo `style="background-image: ...; background-color: rgba(...)"` con hex pickers cuando el usuario activa el patrón. Lección Ola 1 #5: "sus colores por defecto son hex y se marcan como pendiente en el reporte". El presente widget no añade hex en su código fuente; el gap está en el trait compartido.
- **`image_size` y `bg_image_position` (v9-3): alcance del control.** El control aplica a la imagen de fondo en todos los breakpoints, lo que difiere del legacy que tenía `bg-[length:100%_auto]` (móvil) + `lg:bg-cover` (escritorio) como base, y el control (con `!important`) las anulaba. v3 entrega una API más limpia: el control manda en todos los tamaños. Si un BU necesita un comportamiento responsive, exponer el control como responsive (Elementor lo soporta) en una iteración futura.
- **Geometría de la caja hardcodeada.** Se omitieron los controles de padding/radius de la caja-titulo (`highlight_padding` v9-1, `title_padding` y `title_border_radius` v9-2/v9-3) como parte de la reducción de superficie de controles. Si un BU los necesita, agregarlos en una iteración futura.
