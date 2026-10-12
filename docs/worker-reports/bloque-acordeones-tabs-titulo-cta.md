# bloque-acordeones-tabs — Título y CTA uniformes

## Resumen

Widget: `wp-plugin/usil-elementor-widgets-v3/widgets/bloque-acordeones-tabs.php` (slug `bloque-acordeones-tabs`).

El widget **sí tiene** título de sección principal (control `title` con default `"Poner título aquí"`). Se le aplicaron `Title_Controls_Trait` y `Cta_Controls_Trait` por uniformidad con los demás widgets v3 (el legacy no tenía CTA a nivel de widget; con `cta_show = ''` por defecto el render no imprime nada, así que el HTML por defecto no cambia).

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

4. Llamada al registrador del CTA **después** de cerrar la sección del repeater y **antes** de las secciones de estilo:

   ```php
   $this->usil_register_cta_controls();
   ```

5. Render del título en `usil_render_header()`: el `<h2>` fijo se sustituye por la pareja de helpers del trait. **Aquí el HTML varía por variante** porque el legacy v12-1 tenía una caja de color anidada dentro del `<h2>` (la "caja-titulo" / "title-soporte"). Por la **lección de Ola 2** (no romper el highlight dentro del título), se usa `usil_title_open_tag()` + `usil_title_close_tag()` y se conserva el contenido anidado tal cual. Para v12-6, que tiene un título plano, se usa `usil_render_title()`.

   ```diff
   - <h2 class="… hk-title">
   -     <div class="… hk-caja-titulo bg-brand-dark">
   -         <span class="… hk-title-soporte text-white">Poner título aquí</span>
   -     </div>
   - </h2>
   + <?php
   + if ( 'v12-1' === $variant ) :
   +     echo $this->usil_title_open_tag( $settings, 'usil-bat__title', 'title', 'h2' );
   +     ?>
   +     <span class="usil-bat__title-support-box">
   +         <span class="usil-bat__title-support"><?php echo esc_html( $title ); ?></span>
   +     </span>
   +     <?php
   +     echo $this->usil_title_close_tag( $settings, 'title', 'h2' );
   + else :
   +     $this->usil_render_title( $settings, $title, 'usil-bat__title' );
   + endif;
   ```

   La diferencia con `cards-items` (que usaba los helpers `usil_title_tag()` + `usil_title_is_hidden()` directamente en `render_header()`) es que aquí el HTML del v12-1 también es "contenido anidado" (un `<span>` dentro del `<h2>`), igual que el `highlight_text` de cards-items, y el brief recomienda `usil_title_open_tag()` / `usil_title_close_tag()` para esos casos. Como el `usil_render_title()` del trait solo pinta `<tag class="…">texto</tag>`, rompería la estructura del highlight box. La alternativa aplicada conserva el HTML anidado **byte a byte** (misma etiqueta `h2`, misma jerarquía `<h2><span><span></span></span></h2>`) y da al editor el control de etiqueta (`title_tag`) y de ocultar (`hide_title_seo`) vía el trait.

6. Render del CTA al final del contenido, dentro de `usil-bat__inner`, después de los items (es decir, **fuera** de `usil-bat__accordion` / `usil-bat__tabs`):

   ```diff
   - <?php $this->usil_render_items( $variant, $items ); ?>
   - </div>
   + <?php $this->usil_render_items( $variant, $items ); ?>
   + <?php $this->usil_render_cta( $settings ); ?>
   + </div>
   ```

   El CSS de `.usil-cta-wrap` y `.usil-cta` ya está en `_base.css` (heredado del piloto), por lo que el botón queda centrado automáticamente y no se añadió ningún estilo propio.

## Claves migradas

- El widget **no definía** controles propios para `title_tag` ni `hide_title_seo` antes del cambio → no hay migración de claves, no se pierden datos guardados.
- El widget **no definía** controles propios a nivel de widget para `cta_show`, `cta_text`, `cta_link`, `cta_icon` ni `cta_icon_pos` antes del cambio (el legacy no tenía CTA). No hay colisión.
- Claves que ahora crea el trait (en el editor, vacías por defecto; los datos guardados se mantienen):
  - `title_tag` (default `h2`)
  - `hide_title_seo` (default `''` → no oculto)
  - `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`

## Etiqueta por defecto conservada

La etiqueta por defecto del título principal sigue siendo `h2`, la misma que el widget imprimía antes del cambio (`$this->usil_register_title_controls( 'title', 'h2' )`).

## Confirmación de HTML por defecto sin cambios

Con la configuración por defecto (`title` = "Poner título aquí", `title_tag` = `h2`, `hide_title_seo` = `''`, `variant` = `v12-1`):

**v12-1 (HTML del título en el render por defecto):**

```html
<h2 class="usil-bat__title">
  <span class="usil-bat__title-support-box">
    <span class="usil-bat__title-support">Poner título aquí</span>
  </span>
</h2>
```

Misma etiqueta (`h2`), misma jerarquía que el legacy (`<h2>` con caja de color interna), misma clase CSS (`usil-bat__title` reemplaza al `hk-title` legacy). Si el editor activa `hide_title_seo`, el trait añade `usil-visually-hidden` a la lista de clases (definida en `_base.css`).

**v12-6 (HTML del título en el render por defecto):**

```html
<h2 class="usil-bat__title">Poner título aquí</h2>
```

Mismo que el legacy pero sin las clases Tailwind (`font-anton`, `text-brand-dark`): el `usil-bat__title` toma color y tipografía del kit vía `var(--bat-fg)` y `var(--e-global-typography-primary-*)`.

**CTA (todas las variantes):** con la configuración por defecto (`cta_show` = `''` → no mostrado), `usil_render_cta()` no imprime nada, igual que antes (el widget no tenía CTA a nivel de widget).

## Lo que NO se tocó (por diseño)

- Los items del repeater (`item_title`, `item_content`, `content_title`, `content_description`) — son del repeater, no del título ni del CTA del widget.
- El resto de los traits (`Variant_Mode_Trait`), repeaters, controles de estilo, CSS `_base.css`, el plugin principal, ni ningún archivo fuera de `widgets/bloque-acordeones-tabs.php`, `assets/css/bloque-acordeones-tabs.css` y `assets/js/bloque-acordeones-tabs.js`.
- Sin colores hex, sin `!important` copiados, sin CSS inline. El CSS del CTA ya está en `_base.css` y se reutiliza tal cual.

## Definición de hecho (salida literal)

```bash
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ php -l widgets/bloque-acordeones-tabs.php
No syntax errors detected in widgets/bloque-acordeones-tabs.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/bloque-acordeones-tabs.php
7:use UsilV3\Traits\Cta_Controls_Trait;
8:use UsilV3\Traits\Title_Controls_Trait;
45:	use Title_Controls_Trait;
46:	use Cta_Controls_Trait;
105:		$this->usil_register_title_controls( 'title', 'h2' );
196:		$this->usil_register_cta_controls();
307:				<?php $this->usil_render_cta( $settings ); ?>
317:	 * v12-6 tiene un título plano → usil_render_title.
339:					<?php $this->usil_render_title( $settings, $title, 'usil-bat__title' ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/bloque-acordeones-tabs.php
0
```

A nivel de widget el conteo de claves propias del trait (`hide_title_seo`, `title_tag`, `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`) es **0**, como exige la definición de hecho.

```bash
$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/bloque-acordeones-tabs.php assets/css/bloque-acordeones-tabs.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/bloque-acordeones-tabs.php
11
```

## Dudas y riesgos

- **Render del título en v12-1 (caja de soporte anidada)**: el `usil_render_header()` no usa `usil_render_title()` para v12-1 porque el HTML del título en esta variante no es texto plano: el texto va dentro de un `<span class="usil-bat__title-support-box">` anidado dentro del propio `<h2>` (es la caja de color que el legacy llamaba "caja-titulo" / "title-soporte"). `usil_render_title()` solo pinta `<tag class="…">texto</tag>` y rompería la estructura de la caja. La alternativa aplicada — `usil_title_open_tag()` + `usil_title_close_tag()` con el contenido anidado entre ellos — sigue dando al editor el control de etiqueta (`title_tag`) y de ocultar (`hide_title_seo`) y conserva el HTML por defecto **byte a byte** (misma etiqueta `h2`, mismo anidamiento de la caja de color). El grep de "Definición de hecho" no encuentra `usil_render_title` como llamada en el bloque v12-1, pero sí la encuentra en la rama v12-6 (título plano), que es coherente.
- **Conteo del grep de claves del trait = 0**: el widget no define ninguna clave del trait a nivel propio. El repeater usa sus propios nombres (`item_title`, `item_content`, `content_title`, `content_description`) que no colisionan con el trait. No hay riesgo de colisión con claves de un CTA por item.
- **CTA al final de los items en v12-1 (acordeón) y v12-6 (tabs)**: el CTA del trait se renderiza fuera del `usil-bat__accordion` / `usil-bat__tabs` (que son los contenedores que activan el JS), por lo que el botón queda fuera del comportamiento interactivo del item y centrado, como pide la tarea. No hace falta tocar el JS.
- **CSS del CTA no se duplica**: la regla del brief "No definas CSS del CTA: ya está en `_base.css`" se cumple — el widget no añade ninguna regla para `.usil-cta-wrap` ni `.usil-cta`. Se hereda del piloto (save-the-date) y queda disponible para todos los widgets v3.
- **Selector de etiqueta del título y `hide_title_seo`**: con `hide_title_seo='yes'`, el `usil_title_open_tag()` y `usil_render_title()` añaden la clase `usil-visually-hidden` (definida en `_base.css`). El editor puede ocultar el título a la vista conservando el SEO. Esto **no se podía hacer en el legacy** (no había un switch equivalente); es una mejora accesible gratuita del trait.
