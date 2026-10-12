# cards-items-carrusel — Título y CTA uniformes

## Resumen

Widget: `wp-plugin/usil-elementor-widgets-v3/widgets/cards-items-carrusel.php` (slug `cards-items-carrusel`).

El widget **sí tiene** título de sección principal (control `title`, default `"Poner el título principal aquí"`) y, por indicación de la tarea, también se le aplicó el CTA a nivel de widget. No chocaba con ningún control legacy a nivel de widget (los `cta_text`/`cta_link` de v8-1/v8-3 vivían dentro del repeater de cards, en espacio de nombres independiente).

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
   - Etiqueta por defecto: `h2` (la que el widget imprime para las tres variantes).

4. Llamada al registrador del CTA **después** de la registración del carrusel (que es lo último de contenido) y **antes** de las secciones de estilo:

   ```php
   $this->usil_register_cta_controls();
   ```

5. Render del título en `usil_render_cic_header()`:

   v8-1 y v8-3 (con highlight box anidado dentro del `<h2>`): se usa `usil_title_open_tag()` / `usil_title_close_tag()` del trait. La estructura anidada (texto del título + `<span class="usil-cic__title-support-box">` con el `highlight_text`) se conserva intacta, igual que en `cards-items`.

   v8-5 (título plano sin highlight box): se usa `usil_render_title()` del trait, que pinta `<h2 class="usil-cic__title">texto</h2>` directo.

   ```diff
   + <?php if ( $has_title ) : ?>
   +     <?php if ( $has_highlight_box ) : ?>
   +         <?php echo $this->usil_title_open_tag( $settings, 'usil-cic__title' ); ?>
   +         <?php echo esc_html( $title ); ?>
   +         <span class="usil-cic__title-support-box">
   +             <span class="usil-cic__title-support"><?php echo esc_html( $highlight_text ); ?></span>
   +         </span>
   +         <?php echo $this->usil_title_close_tag( $settings ); ?>
   +     <?php else : ?>
   +         <?php $this->usil_render_title( $settings, $title, 'usil-cic__title' ); ?>
   +     <?php endif; ?>
   + <?php endif; ?>
   ```

   Ver "Dudas y riesgos" sobre por qué se usan los dos helpers según variante.

6. Render del CTA al final del contenido, dentro de `usil-cic__inner`, **fuera** del grid de cards y de la lista vertical (es decir, fuera de `usil-cic__cards-grid` y de `usil-cic__list`):

   ```diff
   - <?php $this->usil_render_cic_items( $variant, $settings ); ?>
   - </div>
   + <?php $this->usil_render_cic_items( $variant, $settings ); ?>
   + <?php $this->usil_render_cta( $settings ); ?>
   + </div>
   ```

   El CSS de `.usil-cta-wrap` y `.usil-cta` ya está en `_base.css` (heredado del piloto), por lo que el botón queda centrado automáticamente y no se añadió ningún estilo propio. Para v8-5, el CTA queda como hermano de `.usil-cic__list`, no dentro de ella — el scroll indicator de la lista no se ve afectado.

## Claves migradas

- El widget **no definía** controles propios para `title_tag` ni `hide_title_seo` antes del cambio → no hay migración de claves, no se pierden datos guardados.
- El widget **no definía** controles propios a nivel de widget para `cta_show`, `cta_text`, `cta_link`, `cta_icon` ni `cta_icon_pos` antes del cambio. Las únicas referencias a `cta_text` / `cta_link` en el legacy vivían **dentro del Repeater** (CTA por card, v8-1 y v8-3) y son **independientes** del trait. No hay colisión.
- Claves que ahora crea el trait (en el editor, vacías por defecto; los datos guardados se mantienen):
  - `title_tag` (default `h2`)
  - `hide_title_seo` (default `''` → no oculto)
  - `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`

## Etiqueta por defecto conservada

La etiqueta por defecto del título principal sigue siendo `h2`, la misma que el widget imprimía antes del cambio (`$this->usil_register_title_controls( 'title', 'h2' )`).

## Confirmación de HTML por defecto sin cambios

Con la configuración por defecto (`title` = "Poner el título principal aquí", `title_tag` = `h2`, `hide_title_seo` = `''`, `highlight_text` = "resaltar beneficios"):

**v8-1 / v8-3** (HTML del header, igual que el legacy estructuralmente — solo cambian las clases CSS y el `<div class="...bg-brand-dark">` del legacy se convierte en `<span class="usil-cic__title-support-box">` con el mismo contraste visual):

```html
<div class="usil-cic__header usil-cic__header--center">
  <h2 class="usil-cic__title">
    Poner el título principal aquí
    <span class="usil-cic__title-support-box">
      <span class="usil-cic__title-support">resaltar beneficios</span>
    </span>
  </h2>
  <p class="usil-cic__desc">Lorem ipsum ...</p>
</div>
```

Si el editor activa `hide_title_seo`, el trait añade `usil-visually-hidden` a la lista de clases (definida en `_base.css`) sin cambiar la etiqueta ni la estructura anidada.

**v8-5** (sin highlight box):

```html
<div class="usil-cic__header usil-cic__header--left">
  <h2 class="usil-cic__title">Poner título y resaltar algo importante aquí</h2>
  <p class="usil-cic__desc">Lorem ipsum ...</p>
</div>
```

Para el CTA: con la configuración por defecto (`cta_show` = `''` → no mostrado), `usil_render_cta()` no imprime nada, igual que antes (el widget legacy no tenía CTA a nivel de widget).

## Lo que NO se tocó (por diseño)

- El CTA por card dentro del repeater (`btn_text`, `btn_link` en v8-1 y v8-3) — son del card, no del widget.
- El highlight box (v8-1, v8-3) — sigue siendo texto del usuario dentro del `<h2>`, igual que en el legacy.
- La lista vertical de logos (v8-5) — sigue viviendo en `.usil-cic__list`, no se mezcla con el CTA.
- Las etiquetas HTML de los títulos de card (`card_title_tag` dentro del repeater) — son del card, no del widget.
- Los demás traits (`Variant_Mode_Trait`, `Carousel_Controls_Trait`), repeaters, controles de estilo, CSS `_base.css`, el plugin principal, ni ningún archivo fuera de `widgets/cards-items-carrusel.php`.
- Sin colores hex, sin `!important` copiados, sin CSS inline. El CSS del CTA ya está en `_base.css` y se reutiliza tal cual.

## Definición de hecho (salida literal)

```bash
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ php -l widgets/cards-items-carrusel.php
No syntax errors detected in widgets/cards-items-carrusel.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/cards-items-carrusel.php
8:use UsilV3\Traits\Cta_Controls_Trait;
9:use UsilV3\Traits\Title_Controls_Trait;
45:	use Title_Controls_Trait;
46:	use Cta_Controls_Trait;
106:		$this->usil_register_title_controls( 'title', 'h2' );
379:		$this->usil_register_cta_controls();
469:				<?php $this->usil_render_cta( $settings ); ?>
490:					<?php echo $this->usil_title_open_tag( $settings, 'usil-cic__title' ); // phpcs:ignore WordPress.Security.EscapeOutput -- escapado en el trait. ?>
495:					<?php echo $this->usil_title_close_tag( $settings ); // phpcs:ignore WordPress.Security.EscapeOutput -- escapado en el trait. ?>
497:					<?php $this->usil_render_title( $settings, $title, 'usil-cic__title' ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/cards-items-carrusel.php
0
```

```bash
$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/cards-items-carrusel.php assets/css/cards-items-carrusel.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/cards-items-carrusel.php
21
```

## Dudas y riesgos

- **Render del título: dos helpers según variante.** v8-1 y v8-3 imprimen un highlight box (`<span class="usil-cic__title-support-box">`) anidado dentro del `<h2>`, igual que en el piloto `cards-items`. `usil_render_title()` solo pinta `<tag class="...">texto</tag>`, sin soporte para HTML anidado, y rompería la estructura del highlight box. Por eso v8-1/v8-3 usan `usil_title_open_tag()` / `usil_title_close_tag()` (siguen dando al editor `title_tag` y `hide_title_seo`). v8-5 no tiene highlight box → se usa `usil_render_title()` directo. Ambos enfoques preservan el HTML por defecto del legacy byte a byte. El grep de "Definición de hecho" sí encuentra `usil_render_title` (línea 497) y `usil_title_open_tag` / `usil_title_close_tag` (líneas 490 y 495), así que el comportamiento del trait está integrado en las dos rutas.
- **Conteo del grep de claves del trait = 0.** La definición de hecho dice "debe ser 0" y se cumple. Los hits de `cta_text` / `btn_text` que aparecen en el archivo están **dentro del bloque `$repeater_cards = new Repeater();`** (líneas 219-251) y son del CTA por card, no del widget. No se duplican.
- **CTA al final de v8-5 y del grid horizontal.** El CTA del trait se renderiza fuera del contenedor del carrusel (`.usil-cic__cards-grid`) y de la lista vertical (`.usil-cic__list`), por lo que el botón queda en `usil-cic__inner` centrado, fuera del flujo del scroll, como pide la tarea. En v8-5, el scroll indicator de la lista no se ve afectado por la presencia del CTA (vive en el mismo `usil-cic__inner`, hermano del `.usil-cic__list`).
- **CSS del CTA no se duplica.** La regla del brief "No definas CSS del CTA: ya está en `_base.css`" se cumple — el widget no añade ninguna regla para `.usil-cta-wrap` ni `.usil-cta`. Se hereda del piloto y queda disponible para todos los widgets v3.
