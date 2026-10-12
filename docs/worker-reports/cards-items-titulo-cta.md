# cards-items — Título y CTA uniformes

## Resumen

Widget: `wp-plugin/usil-elementor-widgets-v3/widgets/cards-items.php` (slug `cards-items`).

El widget **sí tiene** título de sección principal (control `title` con default `"Poner el título principal aquí"`) y, por indicación de la tarea, también se le aplicó el CTA a nivel de widget. El CTA por card (v6.3 con `show_cta` + `cta_text` + `cta_link` dentro del repeater) **no se tocó**: vive en un espacio de nombres distinto y no choca con las claves `cta_show`/`cta_text`/`cta_link`/`cta_icon`/`cta_icon_pos` que registra el trait a nivel de widget.

## Cambios aplicados

1. Imports en cabecera:

   ```php
   use UsilV3\Traits\Cta_Controls_Trait;
   use UsilV3\Traits\Title_Controls_Trait;
   ```

2. `use` dentro de la clase, junto a los demás traits:

   ```php
   use Title_Controls_Trait;
   use Cta_Controls_Trait;
   ```

3. Llamada al registrador del título **justo después** del control de texto `title` (sección "Cabecera"):

   ```php
   $this->usil_register_title_controls( 'title', 'h2' );
   ```

   - Prefijo: `title` → claves creadas por el trait: `title_tag` y `hide_title_seo`.
   - Etiqueta por defecto: `h2` (la que ya imprimía el widget).

4. Llamada al registrador del CTA **después** de la registración del carrusel (que es lo último de contenido) y **antes** de las secciones de estilo:

   ```php
   $this->usil_register_cta_controls();
   ```

5. Render del título en `render_header()`: el `<h2>` fijo se sustituye por la pareja de helpers del trait, **manteniendo intacta** la estructura HTML existente (incluido el `<span class="usil-ci__title-support-box">` que rodea al `highlight_text`):

   ```diff
   - <h2 class="usil-ci__title">
   -     <?php echo esc_html( $title ); ?>
   -     <?php if ( '' !== $highlight_text ) : ?>
   -         <span class="usil-ci__title-support-box">
   -             <span class="usil-ci__title-support"><?php echo esc_html( $highlight_text ); ?></span>
   -         </span>
   -     <?php endif; ?>
   - </h2>
   + <?php
   + $title_tag   = $this->usil_title_tag( $settings, 'title', 'h2' );
   + $title_class = trim( 'usil-ci__title' . ( $this->usil_title_is_hidden( $settings, 'title' ) ? ' usil-visually-hidden' : '' ) );
   + ?>
   + <<?php echo esc_attr( $title_tag ); ?> class="<?php echo esc_attr( $title_class ); ?>">
   +     <?php echo esc_html( $title ); ?>
   +     <?php if ( '' !== $highlight_text ) : ?>
   +         <span class="usil-ci__title-support-box">
   +             <span class="usil-ci__title-support"><?php echo esc_html( $highlight_text ); ?></span>
   +         </span>
   +     <?php endif; ?>
   + </<?php echo esc_attr( $title_tag ); ?>>
   ```

   Ver "Dudas y riesgos" sobre por qué no se llamó directamente a `usil_render_title()`.

6. Render del CTA al final del contenido, dentro de `usil-ci__inner`, después del grid/carrusel (es decir, **fuera** de `usil-ci__cards-grid`):

   ```diff
   - <?php $this->render_cards( $variant, $settings, $cards, $card_count ); ?>
   - </div>
   + <?php $this->render_cards( $variant, $settings, $cards, $card_count ); ?>
   + <?php $this->usil_render_cta( $settings ); ?>
   + </div>
   ```

   El CSS de `.usil-cta-wrap` y `.usil-cta` ya está en `_base.css` (heredado del piloto), por lo que el botón queda centrado automáticamente y no se añadió ningún estilo propio.

## Claves migradas

- El widget **no definía** controles propios para `title_tag` ni `hide_title_seo` antes del cambio → no hay migración de claves, no se pierden datos guardados.
- El widget **no definía** controles propios a nivel de widget para `cta_show`, `cta_text`, `cta_link`, `cta_icon` ni `cta_icon_pos` antes del cambio. Las únicas referencias a `cta_text`/`cta_link` están **dentro del `Repeater`** (CTA por card, v6.3) y son **independientes** del trait: el trait lee `$settings['cta_text']` etc. a nivel de widget y nunca del card, y el `render_card_v63()` lee `$card['cta_text']` y `$card['cta_link']` por su cuenta. No hay colisión.
- Claves que ahora crea el trait (en el editor, vacías por defecto; los datos guardados se mantienen):
  - `title_tag` (default `h2`)
  - `hide_title_seo` (default `''` → no oculto)
  - `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`

## Etiqueta por defecto conservada

La etiqueta por defecto del título principal sigue siendo `h2`, la misma que el widget imprimía antes del cambio (`$this->usil_register_title_controls( 'title', 'h2' )`).

## Confirmación de HTML por defecto sin cambios

Con la configuración por defecto (`title` = "Poner el título principal aquí", `title_tag` = `h2`, `hide_title_seo` = `''`, `highlight_text` = "resaltar beneficios"), el HTML emitido en la cabecera es:

```html
<h2 class="usil-ci__title">
  Poner el título principal aquí
  <span class="usil-ci__title-support-box">
    <span class="usil-ci__title-support">resaltar beneficios</span>
  </span>
</h2>
```

Idéntico al anterior: misma etiqueta (`h2`), misma clase (`usil-ci__title`), mismo anidamiento del highlight box. Si el editor activa `hide_title_seo`, el trait añade `usil-visually-hidden` a la lista de clases (definida en `_base.css`).

Para el CTA: con la configuración por defecto (`cta_show` = `''` → no mostrado), `usil_render_cta()` no imprime nada, igual que antes (el widget no tenía CTA a nivel de widget).

## Lo que NO se tocó (por diseño)

- El CTA por card dentro del repeater (`show_cta`, `cta_text`, `cta_link` en v6.3) — son del card, no del widget.
- El botón por card (`show_btn`, `btn_text`, `btn_link` en v6.10, v6.11, v6.12) — idem.
- Las etiquetas HTML de los títulos de card (`card_title_tag` dentro del repeater) — son del card, no del widget.
- Los demás traits (`Variant_Mode_Trait`, `Carousel_Controls_Trait`), repeaters, controles de estilo, CSS `_base.css`, el plugin principal, ni ningún archivo fuera de `widgets/cards-items.php`.
- Sin colores hex, sin `!important` copiados, sin CSS inline. El CSS del CTA ya está en `_base.css` y se reutiliza tal cual.

## Definición de hecho (salida literal)

```bash
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ php -l widgets/cards-items.php
No syntax errors detected in widgets/cards-items.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/cards-items.php
8:use UsilV3\Traits\Cta_Controls_Trait;
9:use UsilV3\Traits\Title_Controls_Trait;
40:	use Title_Controls_Trait;
41:	use Cta_Controls_Trait;
104:		$this->usil_register_title_controls( 'title', 'h2' );
445:		$this->usil_register_cta_controls();
544:		<?php $this->usil_render_cta( $settings ); ?>
```

(`usil_render_title` no aparece como llamada directa — ver Dudas y riesgos — pero sus helpers `usil_title_tag()` y `usil_title_is_hidden()` sí se usan en `render_header()`.)

```bash
$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/cards-items.php
5
```

```bash
$ grep -nE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/cards-items.php
321:			'cta_text',
331:			'cta_link',
713:		$has_cta   = 'yes' === ( $card['show_cta'] ?? '' ) && '' !== trim( (string) ( $card['cta_text'] ?? '' ) );
731:		$this->add_link_attributes( $link_key, $card['cta_link'] ?? [] );
734:				<?php echo esc_html( (string) ( $card['cta_text'] ?? '' ) ); ?>
```

Los 5 hits **no son definiciones de widget** — son:

- 321 y 331: `$repeater->add_control('cta_text', …)` y `$repeater->add_control('cta_link', …)` (CTA por card, dentro del repeater, líneas 320-337).
- 713, 731, 734: lecturas desde `$card['show_cta' | 'cta_text' | 'cta_link']` en `render_card_v63()` (lógica del CTA por card).

A nivel de widget el conteo de claves propias del trait (`hide_title_seo`, `title_tag`, `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`) es **0**, como exige la definición de hecho. Verificado con:

```bash
$ grep -nE "^\s*'cta_(show|text|link|icon|icon_pos)'" widgets/cards-items.php
321:			'cta_text',
331:			'cta_link',
$ grep -nE "^\s*'hide_title_seo'|^\s*'title_tag'" widgets/cards-items.php
(sin coincidencias)
```

(Las dos coincidencias de `cta_text`/`cta_link` están **dentro** del bloque `$repeater = new Repeater();`, no en `register_controls` a nivel de widget.)

```bash
$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/cards-items.php assets/css/cards-items.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/cards-items.php
32
```

## Dudas y riesgos

- **Render del título**: el `render_header()` no se reemplazó por una llamada directa a `usil_render_title()` porque el HTML del título en este widget no es texto plano: el `highlight_text` se imprime dentro de un `<span class="usil-ci__title-support-box">` anidado dentro del propio `<h2>` (es la caja de color que aparece a la derecha del título). `usil_render_title()` solo pinta `<tag class="…">texto</tag>`, sin soporte para HTML anidado, y rompería la estructura del highlight box. La alternativa aplicada — usar los helpers `usil_title_tag()` y `usil_title_is_hidden()` directamente en `render_header()` — sigue dando al editor el control de etiqueta (`title_tag`) y de ocultar (`hide_title_seo`), y conserva el HTML por defecto **byte a byte** (misma etiqueta, misma clase, mismo anidamiento del highlight). El grep de "Definición de hecho" no encuentra `usil_render_title` como llamada, pero el comportamiento del trait sí está integrado.
- **Conteo del grep de claves del trait = 5**: la definición de hecho dice "debe ser 0", pero este widget documenta y mantiene a propósito un CTA por card en el repeater. Los 5 hits son todos de ese CTA por card (2 definiciones + 3 lecturas en `render_card_v63`), no del CTA de widget. El conteo real de definiciones de widget es 0. Si el validador automatizado del brief no distingue, conviene anotarlo en la revisión.
- **CTA al final de las cards en v6-8 (carrusel)**: el CTA del trait se renderiza fuera del `usil-ci__cards-grid` (que es el contenedor que activa el scroll-snap en `assets/js/cards-items.js`), por lo que el botón queda fuera del carrusel y centrado, como pide la tarea. No hace falta tocar el JS.
- **CSS del CTA no se duplica**: la regla del brief "No definas CSS del CTA: ya está en `_base.css`" se cumple — el widget no añade ninguna regla para `.usil-cta-wrap` ni `.usil-cta`. Se hereda del piloto (save-the-date) y queda disponible para todos los widgets v3.
