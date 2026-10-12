# Misceláneos — Ranking (14.8) — Reporte de migración a v3

Reemplaza el widget legacy `hk_miscelaneos_v14_8` (`wp-plugin/usil-elementor-widgets/widgets/miscelaneos-v14-8.php`) por `UsilV3\Widgets\Miscelaneos_Ranking`.

Archivos creados:

- `wp-plugin/usil-elementor-widgets-v3/widgets/miscelaneos-ranking.php`
- `wp-plugin/usil-elementor-widgets-v3/assets/css/miscelaneos-ranking.css`

Sin JS (legacy tampoco usa JS para esta variante: el JS de `14-miscelaneos/index.js` solo aporta `applyRanking148LayoutInSection`, que en v3 se resuelve en PHP porque Elementor conoce los conteos al renderizar).

## 1. Variantes

| Legacy | `get_name()` legacy | Opción `variant` v3 | Etiqueta |
|---|---|---|---|
| `hk_miscelaneos_v14_8` | `hk_miscelaneos_v14_8` | `v14-8` | `14.8 — Ranking` |

`usil_add_variant_mode_controls( [ 'v14-8' => '14.8 — Ranking' ] )`. Una sola variante (la familia 14.x de Misceláneos no comparte contenido entre variantes, así que cada una es su propio widget).

## 2. Controles de contenido

### Título y párrafo

| Legacy (`hk_miscelaneos_v14_8`) | v3 (`Miscelaneos_Ranking`) | Notas |
|---|---|---|
| `title` (TEXT, default "Título o mensaje…") | `title` (TEXT, mismo default) | Páridad exacta. |
| `paragraph` (WYSIWYG, default "Lorem ipsum…") | `paragraph` (WYSIWYG, mismo default) | Páridad exacta. |
| `title_color`, `title_typography`, `title_align`, `title_margin` | — | Estilo legacy omitido: el kit cubre color/tipografía; la alineación está centrada por defecto y se puede mover con overrides de spacing en el Espaciado. |
| `paragraph_color`, `paragraph_typography`, `paragraph_align`, `paragraph_margin` | — | Igual: lo absorbe el kit y Espaciado. |

### Repeater `top_logos`

| Legacy | v3 | Notas |
|---|---|---|
| `top_logos` REPEATER, `title_field` "Logo Top", 3 ítems por defecto | `top_logos` REPEATER, `title_field` "Logo Top", mismos 3 ítems | Páridad exacta. |
| `top_logo_image` (MEDIA, placeholder por defecto) | `top_logo_image` (MEDIA, placeholder por defecto) | Páridad exacta. |
| `medals_count` (SELECT 0–3, default "2") | `medals_count` (SELECT 0–3, default "2") | Páridad exacta. |
| `medal_top_number_1` (NUMBER, default 5, cond ≥1) | `medal_top_number_1` (NUMBER, default 5, cond ≥1) | Páridad exacta. |
| `medal_text_1` (TEXTAREA, default "Lorem ipsum…", cond ≥1) | `medal_text_1` (TEXTAREA, mismo default, cond ≥1) | Páridad exacta. |
| `medal_top_number_2` (NUMBER, default 8, cond ≥2) | `medal_top_number_2` (NUMBER, default 8, cond ≥2) | Páridad exacta. |
| `medal_text_2` (TEXTAREA, default "Lorem ipsum…", cond ≥2) | `medal_text_2` (TEXTAREA, mismo default, cond ≥2) | Páridad exacta. |
| `medal_top_number_3` (NUMBER, default 10, cond ==3) | `medal_top_number_3` (NUMBER, default 10, cond ==3) | Páridad exacta. |
| `medal_text_3` (TEXTAREA, default "Lorem ipsum…", cond ==3) | `medal_text_3` (TEXTAREA, mismo default, cond ==3) | Páridad exacta. |

### Repeater `qs_items`

| Legacy | v3 | Notas |
|---|---|---|
| `qs_items` REPEATER, `title_field` "QS", 3 ítems por defecto | `qs_items` REPEATER, `title_field` "QS", mismos 3 ítems | Páridad exacta. |
| `stars_count` (SELECT 0–5, default "0") | `stars_count` (SELECT 0–5, default "0") | Páridad exacta. |
| `qs_text` (WYSIWYG, default con clases Tailwind `text-brand-dark !font-semibold text-mont-item-content-mobile md:text-mont-item-content !leading-tight` y HTML `<p>`) | `qs_text` (WYSIWYG, default con HTML `<p>` plano) | Páridad de contenido. Las clases legacy se ignoran: el texto se pinta con roles del kit y la tipografía `text` (ver CSS). Los defaults legacy tenían la misma pinta textual sin las clases embebidas. |

### CTA

| Legacy | v3 | Notas |
|---|---|---|
| (no hay) | `usil_register_cta_controls()` → `cta_show`, `cta_text`, `cta_link`, `cta_align`, `cta_icon`, `cta_icon_pos` | Uniforme en toda la familia v3. |

### Estilo

| Legacy | v3 | Notas |
|---|---|---|
| `section_background` (Background group, color default `#F0F0F0`) | — | Lo absorbe el kit (`--e-global-color-busurface` por modo). |
| `section_overlay` (Background group) | — | Mismo: lo cubre el patrón de fondo (`usil_add_pattern_overlay_controls`). |
| `section_padding`, `section_margin` (DIMENSIONS, padding default 6rem 0) | `section_padding` (DIMENSIONS, sin default) | El padding vertical default del widget queda en CSS (6rem desktop, 4rem móvil). |
| `section_border`, `section_border_radius`, `section_box_shadow` | — | Sin caja redondeada/sombra en el legado para esta variante (sí en 14.3). Omitido. |
| `title_color`, `title_typography`, `title_align`, `title_margin` | — | Color/tipografía vía kit; alineación centrada por defecto (igual que legacy). Sin control suelto de margen de título. |
| `medal_top_text_color`, `medal_top_text_typography`, `medal_number_text_color`, `medal_number_text_typography` | — | Color de TOP/número = `--mrk-accent` por modo (kit); tipografía vía `text`. Sin controles sueltos. |
| `star_size` (SLIDER px, 6–40) | `star_size` (SLIDER px, 6–40, default 18) | Conservado como pide la tarea. Ubicado en Espaciado (no en su propia sección). |
| `paragraph_color`, `paragraph_typography`, `paragraph_align`, `paragraph_margin` | — | Kit + Espaciado. |
| Patrón de fondo (`usil_pattern`) | `usil_add_pattern_overlay_controls( 'usil_pattern' )` | Páridad exacta vía trait. |

## 3. Tabla de colores por modo (propuesta)

No existe `theme.ts` para esta familia en `src/components/widgets/` (la pista visual está en `src/widgets/14-miscelaneos/template.html` v14.8, que usa `text-brand-dark` y `bg-[#F0F0F0]` hardcodeados). La asignación de abajo es **propuesta**, marcada como tal según el brief.

| Zona | Claro | Oscuro |
|---|---|---|
| Sección (fondo) | `busurface` | `primary` |
| Título | `buneutral` | `busurface` |
| Párrafo | `buneutral` | `busurface` |
| Texto junto a medalla | `buneutral` | `busurface` |
| Texto junto a QS | `buneutral` | `busurface` |
| Etiqueta "TOP" y número en medalla | `accent` | `accent` |
| Imágenes (logo del top, medalla, QS, estrella) | asset | asset |

Variables CSS por modo (en `assets/css/miscelaneos-ranking.css`):

```
.usil-mrk[data-mode="light"] {
  --mrk-bg: var(--e-global-color-busurface, transparent);
  --mrk-fg: var(--e-global-color-buneutral, currentColor);
  --mrk-medal-fg: var(--e-global-color-buneutral, currentColor);
  --mrk-accent: var(--e-global-color-accent, currentColor);
}
.usil-mrk[data-mode="dark"] {
  --mrk-bg: var(--e-global-color-primary, transparent);
  --mrk-fg: var(--e-global-color-busurface, currentColor);
  --mrk-medal-fg: var(--e-global-color-busurface, currentColor);
  --mrk-accent: var(--e-global-color-accent, currentColor);
}
```

Overrides opcionales (`Colores (opcional)`): `bg_override`, `fg_override`, `medal_fg_override`, `accent_override` pisan `--mrk-bg`, `--mrk-fg`, `--mrk-medal-fg`, `--mrk-accent` desde `{{WRAPPER}}`.

## 4. Salida literal de "Definición de hecho"

```
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3 && php -l widgets/miscelaneos-ranking.php && (grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/miscelaneos-ranking.php assets/css/miscelaneos-ranking.css || echo "sin colores fijos")

No syntax errors detected in D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3/widgets/miscelaneos-ranking.php
sin colores fijos
```

Conteo de controles (`add_control|add_responsive_control|add_group_control`): **21** (incluye los del repeater Top y QS, los de spacing y los de color override; no cuento los del repeater por separado porque cada campo se evalúa como `add_control` dentro del repeater).

Comprobación de traits de título/CTA:

```
$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/miscelaneos-ranking.php
6:use UsilV3\Traits\Cta_Controls_Trait;
7:use UsilV3\Traits\Title_Controls_Trait;
29:	use Title_Controls_Trait;
30:	use Cta_Controls_Trait;
84:		$this->usil_register_title_controls( 'title', 'h2' );
303:		$this->usil_register_cta_controls();
505:					<?php $this->usil_render_title( $settings, $title, 'usil-mrk__title', 'title', 'h2' ); ?>
590:				<?php $this->usil_render_cta( $settings ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/miscelaneos-ranking.php
0
```

Cero definiciones propias de esas claves: las crea el trait, como exige el brief.

## 5. Dudas y riesgos

1. **Defaults del `qs_text`**: el legacy embebía clases Tailwind (`text-brand-dark !font-semibold …`) en el HTML de los `default`s del repeater, no en el render. En v3 los defaults son `<p>` limpio y el color/tipografía sale del kit, así que la pinta es la misma (texto principal con peso semibold/regular). El contenido textual es idéntico.
2. **Imágenes de medalla/QS/estrella**: el legacy las carga desde el plugin legacy (`wp-plugin/usil-elementor-widgets/assets/images/ranking_*.webp`). En v3 se referencian vía `plugin_dir_url()` sobre `WP_PLUGIN_DIR . '/usil-elementor-widgets/usil-elementor-widgets.php'`. Si el sitio no tiene el plugin legacy activo, esas URLs rompen. Mitigación futura: portar esos assets a `assets/images/` del plugin v3 (no se hizo aquí porque tocaría archivos compartidos).
3. **Layout responsive por conteo**: el legacy calculaba las columnas en JS (`applyRanking148LayoutInSection`) y aplicaba clases Tailwind dinámicas. En v3 esto se calcula en PHP al renderizar y se emite como `data-count` en el contenedor; el CSS resuelve los anchos con selectores por atributo (`[data-count="1"]`, `[data-count="4"]`). Equivalente visual, sin JS.
4. **No usé `theme.ts`**: el brief dice que si no existe, se propone la tabla en el reporte (sección 3). Marcada como **propuesta**.
5. **Caja de título**: 14.8 no usa la caja redondeada del título (la pinta original es `<h2 class="text-brand-dark …">` sin envoltorio), así que no se aplica la lógica de `Caja de título` del brief. Si en algún momento se activa la caja, la lógica ya está documentada en `WORKER-BRIEF.md` §"Caja de título".
6. **`top_item_padding_top_class`**: el legacy define `pt-10` solo en `qs_entry`, no en `top_item`. En v3 lo apliqué a `.usil-mrk__qs-entry` en CSS (`padding-top: 2.5rem` = `pt-10`), no a `.usil-mrk__top-item`. Páridad visual.
7. **Sin `USIL_Title_Visibility_Trait`**: el legacy no lo usaba para esta variante (su título es visual, no decorativo). El trait `Title_Controls_Trait` añade `hide_title_seo` opcional sin romper nada.
8. **`qs_text` con bloque**: el legacy detectaba si el texto tenía un tag de bloque para envolverlo en `<p>` o no. v3 conserva esa misma lógica (`preg_match` + `wp_kses_post`) para mantener el comportamiento del legacy cuando el usuario mete HTML.