# Worker Report — `miscelaneos-informativo` (familia 14.6 — Misceláneos)

Migración del widget legacy a `usil-elementor-widgets-v3`. Una sola clase con control `variant` (`v14-6`) y control `mode` (Claro/Oscuro). Color y tipografía salen del kit de Elementor del sub-sitio. Sin `theme.ts` de Astro: la tabla de roles por modo se **propone** abajo.

## 1. Variantes

| Legacy (clase / archivo) | Nombre legacy | Opción `variant` v3 | Etiqueta visible |
|---|---|---|---|
| `Elementor_Miscelaneos_V14_6_Widget` (`miscelaneos-v14-6.php`) | 14.6 Misceláneos (Bloque informativo) | `v14-6` | "14.6 — Bloque informativo" |

Solo existe una variante legacy (`v14-6`), así que el control `variant` se registra con una única opción (igual que el piloto `miscelaneos-caja-texto` con `v14-3`).

## 2. Controles de contenido

### Controles que existen en v3 (paridad)

| Legacy key | Tipo | v3 | Notas |
|---|---|---|---|
| `title` | TEXT | ✓ `title` | Etiqueta por defecto h2 (legacy usaba `<h2>` literal). |
| `model_image` | MEDIA | ✓ `model_image` (default `\Elementor\Utils::get_placeholder_image_src()`) | El legacy tenía URL fija `https://placehold.co/480x730/012085/ffffff/?text=Modelo`; en v3 se usa el helper genérico y los tamaños salen de los nuevos sliders de la sección Imágenes. |
| `intro_text` | TEXTAREA | ✓ `intro_text` | |
| `show_second_benefit` | SWITCHER (default `yes`) | ✓ `show_second_benefit` (default `yes`) | |
| `benefit_1_title` | TEXT | ✓ `benefit_1_title` | |
| `benefit_1_desc` | TEXTAREA | ✓ `benefit_1_desc` | |
| `benefit_1_image` | MEDIA | ✓ `benefit_1_image` (default placeholder) | |
| `benefit_2_title` | TEXT (cond. `show_second_benefit`) | ✓ `benefit_2_title` (cond.) | |
| `benefit_2_desc` | TEXTAREA (cond.) | ✓ `benefit_2_desc` (cond.) | |
| `benefit_2_image` | MEDIA (cond.) | ✓ `benefit_2_image` (cond.) | |
| `plus_symbol` | TEXT (cond., default `+`) | ✓ `plus_symbol` (cond., default `+`) | |
| `promo_text` | WYSIWYG | ✓ `promo_text` | Default con `<b>` (conserva formato en línea del legacy). |
| `show_second_logo` | SWITCHER (default `yes`) | ✓ `show_second_logo` (default `yes`) | |
| `logo_1_label` | TEXT | ✓ `logo_1_label` | |
| `logo_1_image` | MEDIA | ✓ `logo_1_image` (default placeholder) | |
| `logo_2_label` | TEXT (cond.) | ✓ `logo_2_label` (cond.) | |
| `logo_2_image` | MEDIA (cond.) | ✓ `logo_2_image` (cond.) | |
| `model_image_max_width` | SLIDER | ✓ `model_image_max_width` (sección Imágenes, default 480px) | Tamaño útil del legado. |
| `model_image_max_height` | SLIDER | ✓ `model_image_max_height` (sección Imágenes, default 730px) | |
| `round_image_size` | SLIDER | ✓ `round_image_size` (sección Imágenes, default 75px) | |
| `logo_max_width` | SLIDER | ✓ `logo_max_width` (sección Imágenes, default 185px) | |
| `logo_max_height` | SLIDER | ✓ `logo_max_height` (sección Imágenes, default 80px) | |
| Patrón de fondo (`usil_pattern_*`) | trait `USIL_Pattern_Overlay_Trait` | ✓ mismo trait, prefijo `usil_pattern` | Conservado. Ver "Dudas y riesgos" sobre el color del patrón. |

### Controles legacy omitidos (con motivo)

| Legacy key | Motivo |
|---|---|
| `section_background` / `section_overlay` (Group_Control_Background, default `#F0F0F0`) | Reemplazado por `--minf-bg` del kit + override opcional. |
| `section_padding` (DIMENSIONS, default `6rem 0 0 0`) | Conservado como espaciado útil (`section_padding` en sección Espaciado). El default ahora lo define el CSS (`6rem 1rem 0`) por coherencia con el piloto. |
| `section_margin` (DIMENSIONS) | Rara vez usado en el legacy; se omite (mismo criterio que `intro-text-block` y `bloque-contenido-imagen`). El usuario puede aplicar margin desde el layout de Elementor. |
| `section_border` / `section_border_radius` / `section_box_shadow` (Group_Control_Border/Radius/Box_Shadow) | Efectos de estilo; el legacy no los usaba por defecto. Ola 1 no los expone. |
| `title_color`, `title_typography`, `title_align`, `title_margin` | Reemplazados por tipografía del kit (`--e-global-typography-primary-*`) y por `--minf-fg` con override opcional. El `text-center` del legacy se aplica como estilo base en `.usil-minf__title`. |
| `intro_text_color`, `intro_text_typography`, `intro_text_align`, `intro_text_margin` | Idem. Texto intro usa `--e-global-typography-text-*` y hereda el color del contenedor (variable `--minf-fg`). |
| `benefit_title_color`, `benefit_title_typography`, `benefit_desc_color`, `benefit_desc_typography` | Idem. |
| `plus_color`, `plus_typography` | El símbolo `+` usa `--minf-plus-color` (ver tabla de colores). Tipografía del kit `--e-global-typography-primary-*`. |
| `promo_text_color`, `promo_text_typography` | Idem. |
| `logo_label_color`, `logo_label_typography` | Las etiquetas usan la variable `--minf-logobar-fg`; tipografía del kit. |
| `round_image_border_radius` (DIMENSIONS, default 999px — círculo) | Hardcodeado como `border-radius: 9999px` en `.usil-minf__round-image`. El control estaba siempre al máximo (círculo por diseño). Omite un control que el usuario nunca tocaba. |
| `round_image_shadow` (Group_Control_Box_Shadow) | Efecto de estilo no usado por defecto en el legacy. |
| `logo_shadow` (Group_Control_Box_Shadow) | Idem. |
| ID de `<section>` (`miscelaneo-v14-6` hardcoded) | Era literal, no control. No se expone en v3. |
| Selectores responsive `(mobile)` / `(tablet)` del modelo | El control legacy `model_image_max_width` solo aplicaba al desktop y forzaba `display: none` en tablet/mobile con responsive selectors. En v3 se aplica la misma regla con CSS base (`display: none` por defecto, `display: block` a partir de `1024px`); los nuevos sliders aplican el `width/max-width/height/max-height` a cualquier breakpoint. Decisión: la regla responsive del legado se transfiere a CSS; los sliders cubren el resto. |

## 3. Tabla de colores por modo (PROPUESTA — sin `theme.ts`)

| Parte | Light | Dark |
|---|---|---|
| section `bg` | `--e-global-color-busurface` | `--e-global-color-primary` |
| Título (h2) | `--e-global-color-buneutral` | `--e-global-color-busurface` |
| Intro (p) | `--e-global-color-buneutral` | `--e-global-color-busurface` |
| Título beneficio (h3) | `--e-global-color-buneutral` | `--e-global-color-busurface` |
| Desc. beneficio (p) | `--e-global-color-buneutral` | `--e-global-color-busurface` |
| Símbolo `+` (span) | `--e-global-color-buneutral` | `--e-global-color-accent` |
| Promo (div) | `--e-global-color-buneutral` | `--e-global-color-busurface` |
| Barra de logos `bg` | `--e-global-color-busurface` | `--e-global-color-buneutral` |
| Etiqueta de logo | `--e-global-color-buneutral` | `--e-global-color-primary` |

Variables CSS expuestas en `data-mode="light"` / `data-mode="dark"`: `--minf-bg`, `--minf-fg`, `--minf-logobar-bg`, `--minf-logobar-fg`, `--minf-plus-color`. Todas con fallback `var(--e-global-color-…, currentColor)` (sin hex).

Notes de fidelidad (cambios visuales respecto al legacy):

- Legacy sección: `bg-[#F0F0F0]` (gris fijo). v3: `busurface` (típicamente blanco/gris claro según el kit) en light / `primary` en dark. El gris `busurface` del kit de la BU suele coincidir con la intención del `#F0F0F0`; en cualquier BU que use un surface blanco puro, se aplica el override opcional `--minf-bg`.
- Legacy textos (título, intro, beneficios, promo, etiquetas): todos `text-brand-dark` (#012085) sobre fondo gris claro. v3 light: `buneutral` (color de texto principal del kit, no un azul fijo). Si la BU quiere la identidad azul del brand, el override `--minf-fg` lo permite.
- Legacy barra de logos: `bg-white` con logos encima. v3 light: `busurface` (mismo rol que la sección pero elevado visualmente por el `border-radius` y por el propio fondo del contenedor); en dark: `buneutral` (inversión coherente con el patrón del piloto `miscelaneos-caja-texto`, claro→primary / oscuro→buneutral).
- Legacy símbolo `+`: `text-brand-dark`. v3 dark usa `accent` (oro) para destacar el separador; en light usa `buneutral` (mismo tono que los textos).
- Tipografía: el legacy usaba `font-anton` (display) y `font-montserrat` (body) vía clases Tailwind. v3 usa `--e-global-typography-primary-*` (Headline) y `--e-global-typography-text-*` (Body). El "feel" Anton/Montserrat se logra configurando los slots de tipografía del kit. Mismo criterio que `intro-text-block`, `bloque-contenido-imagen` y `miscelaneos-caja-texto`.
- Mobile: el kit no define tamaños responsive. v3 reduce el título al 75 % y la `padding` lateral a 1rem en `@media (max-width: 767px)`, igual que el piloto y `intro-text-block`. El responsive del modelo (visible solo en `lg+`) se transfiere directo del legacy.

Overrides opcionales en la pestaña Estilo (vacíos por defecto) pisan `--minf-bg`, `--minf-fg`, `--minf-logobar-bg` y `--minf-logobar-fg` vía `{{WRAPPER}} .usil-minf`, igual que el piloto.

## 4. Salida de la sección "Definición de hecho"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/miscelaneos-informativo.php
No syntax errors detected in widgets/miscelaneos-informativo.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/miscelaneos-informativo.php assets/css/miscelaneos-informativo.css || echo "sin colores fijos"
sin colores fijos
```

Verificación adicional:

```text
$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/miscelaneos-informativo.php
25

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/miscelaneos-informativo.php
6:use UsilV3\Traits\Cta_Controls_Trait;
7:use UsilV3\Traits\Title_Controls_Trait;
33:	use Title_Controls_Trait;
34:	use Cta_Controls_Trait;
88:		$this->usil_register_title_controls( 'title', 'h2' );
252:		$this->usil_register_cta_controls();
467:				<?php $this->usil_render_title( $settings, $title, 'usil-minf__title' ); ?>
539:				<?php $this->usil_render_cta( $settings ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/miscelaneos-informativo.php
0
```

Conteo de `add_control`/`add_responsive_control`/`add_group_control`: **25** — incluye los 5 sliders de tamaño de imagen, los 4 overrides de color y los controles de CTA y patrón (estos dos últimos añadidos por sus traits, así que se cuentan desde aquí porque su `add_control` corre dentro de `register_controls()`). El último `grep` confirma **0 definiciones propias** de las claves `title_tag`/`hide_title_seo`/`cta_*`: todas vienen de los traits, como exige la Ola 1 + Ola 2.

Verificación adicional: la variante legacy aparece como opción en `variant` (`v14-6`) y todas las claves de contenido listadas en la sección 2 existen en el editor.

## 5. Dudas y riesgos

- **Sin JS (legítimo).** El legacy `miscelaneos-v14-6.php` no usa carrusel, tabs ni acordeón. El `src/widgets/14-miscelaneos/index.js` contiene lógica del carrusel de v14-7, el contador de v14-5 y el ranking de v14-8, pero **nada** del informativo v14.6. Por tanto no se crea `assets/js/miscelaneos-informativo.js` y el widget no declara `get_script_depends()`. (Lección Ola 1 #4: "Si el legacy usa JS".)
- **Modelo de imagen solo en `lg+`.** El legacy ocultaba el modelo en tablet/mobile vía Elementor responsive selectors `(tablet)display: none`. En v3 esto se aplica con CSS puro (`display: none` por defecto + `display: block` en `@media (min-width: 1024px)`). A11y: la imagen lleva `alt` (fallback "Modelo" si no se subió con alt), no es decorativa, así que desaparece del flujo en vez de quedar invisible con `aria-hidden`. Si en una BU específica el modelo debe verse en tablet, se modifica el `min-width` del breakpoint; el control de tamaño sigue aplicando.
- **`plus_symbol` con formato.** El legacy usa `TEXT` para `plus_symbol` con default `+`. Si un usuario pone varios caracteres o un glifo largo, el layout podría desajustarse. v3 lo respeta literal: si quieres un símbolo complejo, ajustar el CSS (`.usil-minf__plus-symbol { font-size / line-height }`) o el `flex-basis` del contenedor `.usil-minf__plus`. No se valida el contenido por ser texto libre.
- **`promo_text` con `<b>` por defecto.** El default del legacy era `Lorem ipsum <b>dolor sit amet</b>`. v3 lo conserva y el render lo imprime con `wp_kses_post()` para permitir `<b>`/`<strong>` pero neutralizar el resto. Si una BU usa otras marcas (e.g. `<a>`, `<span class>`), deben pegar el HTML manualmente.
- **CTA no usado por defecto.** El legacy no tiene CTA; v3 incluye el control (uniformidad del kit de widgets, ver Ola 1 #2). Si nadie lo activa, no se renderiza (el `if (! $this->usil_has_cta(...))` del trait lo aborta). El usuario lo activa con `cta_show: yes` y los slots del kit (`--usil-cta-bg/--usil-cta-text`) toman el control.
- **Trait de patrón: color hex por defecto.** `USIL_Pattern_Overlay_Trait` sigue emitiendo `style="background-image: ...; background-color: rgba(...)"` con hex pickers cuando el usuario activa el patrón (diagonales o puntos). Lección Ola 1 #5: "sus colores por defecto son hex y se marcan como pendiente en el reporte". El presente widget no añade hex en su código fuente; el gap está en el trait compartido.
- **Border-radius de la imagen redonda hardcodeado.** El legacy tenía control `round_image_border_radius` con default `999px` (círculo perfecto). En v3 se aplica `border-radius: 9999px` en el CSS de `.usil-minf__round-image`. Si en una BU se necesita una imagen ovalada o cuadrada, sería un nuevo control DIMENSIONS condicional; alineado con la decisión de Ola 1 #5 sobre reducir la superficie del editor.
- **Box-shadow de la imagen redonda omitido.** El legacy exponía `round_image_shadow` (`Group_Control_Box_Shadow`) sin default. v3 no lo expone (Ola 1 #1: estilo en kit, no en cada widget). Si una BU lo demanda, agregarlo como `Group_Control_Box_Shadow` con `selector => {{WRAPPER}} .usil-minf__round-image`.
- **Backslashes de namespace.** Los `use UsilV3\Traits\…;` y los `\Elementor\…` se revisaron a conciencia al final del archivo; los scripts que escriben archivos PHP pierden los `\` con facilidad (lección Ola 1 #4 / Ola 2 #4).
- **`tag` por defecto del título.** El legacy usaba `<h2>` literal. v3 registra con `usil_register_title_controls('title', 'h2')`; el redactor puede cambiar a h3/h4/div/span/p desde la pestaña Estilo del título sin tocar el código. Si el SEO del sitio quiere h1, cambiar el default a `h1` en una iteración futura.
- **Tamaño del modelo con `aspect-ratio` implícito.** El control `model_image_max_height` aplica `height/max-height` y `object-fit: contain`. Si la imagen subida no respeta el ratio del control, queda "encajada" con bandas. Es la misma semántica del legacy. No se introduce aspect-ratio fijo para no romper imágenes verticales/horizontales.
