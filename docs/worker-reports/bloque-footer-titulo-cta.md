# bloque-footer — Título y CTA uniformes

## Resumen

Widget: `wp-plugin/usil-elementor-widgets-v3/widgets/bloque-footer.php` (slug `bloque-footer`).

Se aplicó **únicamente** `Title_Controls_Trait` al título principal, conforme a la indicación de la tarea (el footer no lleva CTA).

## Cambios aplicados

1. Import del trait:

   ```php
   use UsilV3\Traits\Title_Controls_Trait;
   ```

2. `use` dentro de la clase, junto a los demás traits:

   ```php
   use Title_Controls_Trait;
   ```

3. Llamada al registrador justo después del control de texto `title`
   (sección "Columna derecha", el control etiquetado *"Título principal (v13.2)"*):

   ```php
   $this->usil_register_title_controls( 'title', 'h2' );
   ```

   - Prefijo: `title` → claves creadas por el trait: `title_tag` y `hide_title_seo`.
   - Etiqueta por defecto: `h2` (la que ya imprimía el widget).

4. Render de la variante `v13-2` — el único sitio donde se imprime el título principal:

   ```diff
   - <?php if ( ! empty( $settings['title'] ) ) : ?>
   -     <h2 class="usil-bf__title usil-bf__title--centered"><?php echo esc_html( (string) $settings['title'] ); ?></h2>
   - <?php endif; ?>
   + <?php $this->usil_render_title( $settings, (string) ( $settings['title'] ?? '' ), 'usil-bf__title usil-bf__title--centered' ); ?>
   ```

   Se conserva la clase original `usil-bf__title` y su modificador `usil-bf__title--centered`. La comprobación de texto vacío la hace el propio trait (sale sin imprimir).

## Claves migradas

- Ninguna migración de claves previa: el widget **no definía** controles de etiqueta ni de ocultar para el título principal (los títulos de columna `left_title` y `right_title` quedan tal cual y **no entran** en este trait por su naturaleza de sección, no de título principal).
- Claves que ahora crea el trait (en el editor, vacías por defecto; el dato guardado en Elementor se mantiene):
  - `title_tag` (default `h2`)
  - `hide_title_seo` (default `''` → no oculto)

## Etiqueta por defecto conservada

La etiqueta por defecto del título principal sigue siendo `h2`, que es la que el widget imprimía antes del cambio.

## Confirmación de HTML por defecto sin cambios

Con la configuración por defecto (`title` = "TU PUENTE AL MUNDO", `title_tag` = `h2`, `hide_title_seo` = `''`), el HTML emitido en `v13-2` es:

```html
<h2 class="usil-bf__title usil-bf__title--centered">TU PUENTE AL MUNDO</h2>
```

Idéntico al anterior. Si el editor apaga `hide_title_seo`, el trait añade `usil-visually-hidden` a la lista de clases (definida en `_base.css`).

## Lo que NO se tocó (por diseño)

- Títulos de columna `left_title` y `right_title` (v13.1, v13.3) — se renderizan como `<h2 class="usil-bf__title ...">`. No entran en el trait del título principal.
- Sub‑título `subtitle` (v13.2) renderizado como `<h3 class="usil-bf__subtitle">`.
- Sin `Cta_Controls_Trait`: el footer no lleva CTA (la tarea lo prohíbe explícitamente).
- Otros traits (`Variant_Mode_Trait`, `USIL_Pattern_Overlay_Trait`), repeaters, controles de estilo, CSS `_base.css`, plugin principal.
- Sin colores hex, sin `!important` copiados, sin CSS inline.

## Definición de hecho (salida literal)

```bash
$ php -l widgets/bloque-footer.php
No syntax errors detected in D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3/widgets/bloque-footer.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/bloque-footer.php
7:use UsilV3\Traits\Title_Controls_Trait;
39:	use Title_Controls_Trait;
147:		$this->usil_register_title_controls( 'title', 'h2' );
607:			<?php $this->usil_render_title( $settings, (string) ( $settings['title'] ?? '' ), 'usil-bf__title usil-bf__title--centered' ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/bloque-footer.php
0
```

## Dudas y riesgos

- Los otros títulos (`left_title`, `right_title`) son semánticamente títulos de columna/sección, no títulos principales del widget. La tarea dice explícitamente "los títulos de columna no se tocan", por lo que se dejaron como `<h2>` fijos. Si más adelante se quisiera tratarlos como títulos editables en etiqueta, habría que registrar varios pares `usil_register_title_controls('left_title', 'h2')`, etc. — fuera del alcance de esta tarea.
- El trait registra los controles dentro de la sección de contenido activa; en `bloque-footer` la sección "Columna derecha" (donde vive el control `title`) está abierta cuando se llama al registrador, así que los nuevos controles aparecen agrupados con el texto, como en el piloto.
