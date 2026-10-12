# Worker Report — `intro-text-block` (familia Intro)

Migración del widget legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (una opción por variante legacy) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio.

## 1. Variantes

| Legacy (clase / archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `Elementor_Intro_Text_Block_V2_1_Widget` (`intro-text-block-v2-1.php`) | 2.1 Bloque Intro Texto (Centrado) | `v2.1` | "2.1 Centrado" |
| `Elementor_Intro_Text_Block_V2_2_Widget` (`intro-text-block-v2-2.php`) | 2.2 Bloque Intro Texto (Dividido) | `v2.2` | "2.2 Dividido" |
| `Elementor_Intro_Text_Block_Widget` (`intro-text-block.php`, `show_in_panel = false`) | 2. Bloque Intro Texto (base oculta) | — | No se ofrece en v3; la base legacy es solo heredada por las dos subclases. En v3 la unificación absorbe su `render_variant()` y los dos subclases dejan de existir. |

El control oculto `layout_version` del legacy se reemplaza por el control público `variant` que aporta `Variant_Mode_Trait`. No hace falta un hidden paralelo.

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title_text` | TEXT | ✓ `title_text` | Mismo default y placeholder. |
| `description_text` | WYSIWYG | ✓ `description_text` | Mismo default. |
| `hide_title_seo` (v2.1) | SWITCHER | ✓ `hide_title_seo` vía `USIL_Title_Visibility_Trait::register_title_visibility_control()` | En el legacy solo lo exponía el subclase v2.1. En v3 se ofrece para ambas variantes porque las dos renderizan un `<h2>` y la utilidad a11y/SEO es la misma. Decisión documentada en "Dudas y riesgos". |
| `title_text_wrap_control` (v2.1) | SELECT (default/pretty/balance) | ✓ `title_text_wrap_control` | Sección `section_style_text_wrap` condicionada a `variant = v2.1` (paridad estricta: el subclase v2.1 fue el único que la agregó). |
| `desc_text_wrap_control` (v2.1) | SELECT (default/pretty/balance) | ✓ `desc_text_wrap_control` | Misma condición. |
| `section_padding` | DIMENSIONS responsive | ✓ `section_padding` | Conservado como espaciado útil. |
| Patrón de fondo (`usil_pattern_*`) | trait `USIL_Pattern_Overlay_Trait` | ✓ mismo trait, prefijo `usil_pattern` | Conservado. Ver "Dudas y riesgos" sobre el color del patrón. |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `layout_version` (HIDDEN) | Sustituido por el control público `variant` del `Variant_Mode_Trait`. |
| `background` (Group_Control_Background) | El brief prohíbe copiar controles de estilo/colores del legacy; lo reemplaza la variable `--bit-bg` del kit. |
| `background_overlay` (Group_Control_Background) | Idem. |
| `section_margin` (DIMENSIONS) | No aportaba valor visible en el legacy y rara vez se usaba; se omite para no inflar la UI. El usuario puede posicionar la sección desde el layout de Elementor. |
| `title_typography` (Group_Control_Typography) | Reemplazado por `--e-global-typography-primary-*` del kit. |
| `title_color` (COLOR) | Reemplazado por `--bit-title` (kit + override opcional). |
| `desc_typography` (Group_Control_Typography) | Reemplazado por `--e-global-typography-text-*` del kit. |
| `desc_color` (COLOR) | Reemplazado por `--bit-desc` (kit + override opcional). |
| ID de `<section>` (`intro-v2-1` / `intro-v2-2` hardcoded) | En el legacy era un literal, no un control editable. v3 no lo expone para mantener paridad de controles. Si más adelante se necesita ancla/analytics, agregarlo como control `TEXT` adicional. |

## 3. Tabla de colores por variante × modo

Decidida por `generador-landings/src/components/widgets/2-bloque-intro/theme.ts` (no es propuesta). Mapeo al kit v3 (`--e-global-color-*`):

| Variante | Modo | section `bg` | title color | desc color |
|---|---|---|---|---|
| v2.1 | light | `--e-global-color-primary` | `--e-global-color-busurface` (heredado) | `--e-global-color-busurface` (heredado) |
| v2.1 | dark  | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-secondary` |
| v2.2 | light | `--e-global-color-busurface` | `--e-global-color-primary` | `--e-global-color-secondary` |
| v2.2 | dark  | `--e-global-color-primary` | `--e-global-color-buneutral` | `--e-global-color-buneutral` |

Notas de fidelidad (cambios visuales esperados respecto al legacy):

- Legacy v2.1: `bg-brand-dark` (#012085) + `text-white`. Default kit: primary = #012085 y busurface = #ffffff → mismo aspecto en la BU por defecto.
- Legacy v2.2: `bg-[#F0F0F0]` + `text-brand-dark`. v3 v2.2 light: busurface (#ffffff) + primary/secondary → el fondo deja de ser gris fijo y pasa a blanco del kit, y el cuerpo de la descripción ahora usa `secondary` en lugar del `brand-dark` del título. Decisión de `theme.ts`; coherente con el resto del design system v3.
- Tipografía: el legacy usaba `font-anton` + `text-anton-block-title-*` para el título de v2.1 y `font-montserrat` + `text-mont-block-title-*` para v2.2. v3 usa `--e-global-typography-primary-*` para el título y `--e-global-typography-text-*` para la descripción en ambas variantes. El usuario define el "feel" Anton/display desde el kit del sub-sitio. En mobile, `--bit-title` se reduce al 75 % y `--bit-desc` al 95 % (mismo criterio que el piloto `save-the-date`).

Los overrides de color opcionales en la pestaña Estilo (vacíos por defecto) pisan `--bit-bg`, `--bit-title` y `--bit-desc` vía `{{WRAPPER}} .usil-bit`, igual que el piloto.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/intro-text-block.php
No syntax errors detected in D:\laragon\www\github\usil-widgets\wp-plugin\usil-elementor-widgets-v3\widgets\intro-text-block.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/intro-text-block.php assets/css/intro-text-block.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/intro-text-block.php
9
```

Verificación adicional: cada variante legacy aparece como opción de `variant` (v2.1, v2.2) y todos los controles de contenido listados en la sección 2 existen en el editor.

## 5. Dudas y riesgos

- **`hide_title_seo` ofrecido para v2.2 (mejora menor).** En el legacy solo el subclase v2.1 exponía el switch accesible. v3 lo muestra para ambas variantes porque el `<h2>` existe en las dos. Si se quiere paridad estricta, condicionar el control con `update_control( 'hide_title_seo', [ 'condition' => [ 'variant' => 'v2.1' ] ] )` justo después del `register_title_visibility_control()`. Decisión: dejarlo visible en ambas (utilidad a11y/SEO transversal).
- **CSS global de a11y ausente en v3.** `USIL_Title_Visibility_Trait` existe en `includes/traits/` pero el plugin v3 no tiene un `includes/assets/css/usil-a11y.css` equivalente al del plugin legacy. Sin la regla `.usil-visually-hidden { … }` la clase no oculta nada. Workaround local: la regla está duplicada y scoped a `.usil-bit .usil-visually-hidden` dentro de `assets/css/intro-text-block.css`, con `!important` (mismo criterio justificado que `usil-a11y.css` del legacy: impedir que estilos del tema/Elementor rompan la ocultación). Pendiente para el equipo: crear un `usil-a11y.css` compartido en v3 y encolar desde el plugin principal para que todos los widgets que usen el trait hereden la regla sin duplicarla.
- **Color del patrón de fondo sigue siendo picker directo.** El trait `USIL_Pattern_Overlay_Trait` registra color pickers con defaults hex (`#000000`, `#002663`, `#0050C8`) y los emite como `style="…"` inline cuando se activa. Esto contradice el principio "color del kit, no hex fijo", pero la limitación está en el trait, no en este widget. Mientras no exista un trait de patrón kit-aware, el patrón sigue siendo un opt-in con color directo. No tocar el trait (alcance del brief).
- **Reaprovechamiento de Swiper/JS.** El legacy de esta familia no usa JS. No se crea `assets/js/intro-text-block.js`.
- **Fidelidad tipográfica.** Como se explica en la sección 3, el cambio a tipografía del kit es intencional (regla del brief). En BUs cuya tipografía kit no sea display/Anton-like, el v2.1 puede verse menos "titular" que en el legacy. Ajustar en el kit del sub-sitio.
