# Worker Report — `intro-text-block` (Título + CTA uniformes)

Migración de los controles uniformes de Título (`Title_Controls_Trait`) y CTA (`Cta_Controls_Trait`) en el widget `intro-text-block` del plugin v3. Sustituye el trait antiguo `USIL_Title_Visibility_Trait` por el nuevo, conservando clave y sin tocar `intro-text-block.css`.

## 1. Claves migradas

| Concepto | Antes (trait antiguo) | Ahora (trait nuevo) | Notas |
|---|---|---|---|
| Ocultar título (SEO) | `hide_title_seo` vía `USIL_Title_Visibility_Trait::register_title_visibility_control()` | `hide_title_seo` vía `Title_Controls_Trait::usil_register_title_controls( 'title', 'h2' )` | Misma clave → datos guardados se conservan. La función helper `get_title_visibility_class()` del trait antiguo ya no se llama. |
| Etiqueta HTML del título | n/a (siempre `<h2>`) | `title_tag` (SELECT con default `h2`) | Control nuevo del trait; default `h2` mantiene el HTML por defecto. |
| Mostrar CTA | n/a (no existía) | `cta_show` (SWITCHER) | Nuevo control del trait. |
| Texto CTA | n/a | `cta_text` (TEXT) | Nuevo control del trait. |
| Enlace CTA | n/a | `cta_link` (URL) | Nuevo control del trait. |
| Icono CTA | n/a | `cta_icon` (ICONS) | Nuevo control del trait. |
| Posición icono | n/a | `cta_icon_pos` (SELECT) | Nuevo control del trait. |

Conteo de definiciones propias de esas claves en `intro-text-block.php`:

```text
$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/intro-text-block.php
0
```

→ Las 7 claves las crean los traits, el widget no las redefine.

## 2. Cambios estructurales en el widget

- **Imports** (arriba del archivo): quitado `use UsilV3\Traits\USIL_Title_Visibility_Trait;`, añadidos `use UsilV3\Traits\Title_Controls_Trait;` y `use UsilV3\Traits\Cta_Controls_Trait;`.
- **Traits de la clase**: reemplazado `use USIL_Title_Visibility_Trait;` por `use Title_Controls_Trait;` + `use Cta_Controls_Trait;` (orden: `Variant_Mode_Trait`, `Title_Controls_Trait`, `Cta_Controls_Trait`, `USIL_Pattern_Overlay_Trait`).
- **`register_controls()`**:
  - Sustituida la llamada `$this->register_title_visibility_control();` (justo después del control `title_text`) por `$this->usil_register_title_controls( 'title', 'h2' );`. El comentario ahora apunta al trait nuevo y deja constancia explícita de que la clave `hide_title_seo` es la misma.
  - Añadida `$this->usil_register_cta_controls();` inmediatamente después de `end_controls_section()` de la sección de contenido y antes de la primera sección de estilo (`section_style_text_wrap`), tal como pide el brief.
- **`render()`**:
  - Eliminadas las variables `$title_visibility` y `$title_classes` y la variable `$has_title` (el trait ya no imprime nada si el texto está vacío).
  - Reemplazados los dos `<h2 class="usil-bit__title ...">…</h2>` (uno en v2.1 dentro de `__centered`, otro en v2.2 dentro de `__col-title`) por llamadas a `$this->usil_render_title( $settings, (string) ( $settings['title_text'] ?? '' ), 'usil-bit__title', 'title', 'h2' );`. La clase CSS del widget (`usil-bit__title`) se conserva como segundo argumento.
  - Añadido `<?php $this->usil_render_cta( $settings ); ?>` al final del contenido, dentro de `usil-bit__inner`, después del bloque variante-específico (`__centered` o `__grid`) y antes de cerrar `usil-bit__inner`, para que el CTA quede alineado con el patrón del piloto (`save-the-date.php`).
  - `add_link_attributes`/`print_render_attribute_string` los gestiona internamente `Cta_Controls_Trait` (no se duplican aquí, lección Ola 1).

## 3. Etiqueta por defecto del título

`usil_register_title_controls( 'title', 'h2' )` registra `title_tag` con `default = 'h2'`. La función de render del trait (`usil_render_title`) imprime el `<h2>…</h2>` cuando el texto no está vacío y aplica la clase de visibilidad accesible solo si `hide_title_seo = 'yes'`. El widget antes emitía `<h2 class="usil-bit__title">…</h2>` (o `<h2 class="usil-bit__title usil-visually-hidden">…</h2>` si estaba oculto). Con el nuevo trait el resultado es idéntico en el render por defecto (mismo `h2`, misma clase base, misma clase extra condicional).

## 4. Confirmación de HTML por defecto sin cambios

Comparación de la salida por defecto (con datos por defecto, `hide_title_seo` apagado):

| Estado | Antes | Ahora |
|---|---|---|
| `title_text` no vacío, `hide_title_seo` vacío | `<h2 class="usil-bit__title">Título o mensaje de introducción</h2>` | igual (mismo `h2`, misma clase base, mismo orden de atributos) |
| `title_text` no vacío, `hide_title_seo = 'yes'` | `<h2 class="usil-bit__title usil-visually-hidden">…</h2>` | igual (mismo `h2`, misma concatenación de clases con espacio, mismo orden) |
| `title_text` vacío | no se imprime ningún `<h2>` | igual (el trait hace `if ( '' === trim( $text ) ) return;`) |

No se introducen cambios en el resto del HTML: el `<section class="usil-bit">`, `<div class="usil-bit__inner">`, los wrappers `usil-bit__centered` / `usil-bit__grid`, las columnas y el `<div class="usil-bit__desc">` se imprimen exactamente igual.

## 5. Verificación del CSS del widget (intro-text-block.css)

Sí, el CSS del widget depende de la clase que emitía el trait antiguo: `intro-text-block.css` línea 134 define la regla:

```css
.usil-bit .usil-visually-hidden { position: absolute !important; ... }
```

- El trait antiguo (`USIL_Title_Visibility_Trait::get_title_visibility_class()`) devolvía `'usil-visually-hidden'`.
- El trait nuevo (`Title_Controls_Trait::usil_render_title()`) añade exactamente la misma clase (`usil-visually-hidden`) al `class` del `<h2>` cuando `hide_title_seo = 'yes'`.

→ La regla CSS del widget **sigue siendo efectiva** con el trait nuevo. No es necesario tocarla para que el widget funcione.

Adicionalmente:

- **`_base.css` ya define `.usil-visually-hidden` globalmente** (líneas 23–34, sin `!important`). Eso significa que el bloque duplicado de `intro-text-block.css` (scoped a `.usil-bit .usil-visually-hidden` y con `!important`) ahora es redundante con la regla global del plugin.
- Recomendación para el equipo (no aplicada aquí por restricción del brief: no tocar `intro-text-block.css` ni `_base.css`): eliminar el bloque `.usil-bit .usil-visually-hidden { … !important; }` de `intro-text-block.css` y dejar que `_base.css` provea la regla. Si en algún sub-sitio se observa que un tema o Elementor rompe la ocultación con la versión sin `!important`, decidir si se prefiere la versión con `!important` en `_base.css` (afecta a todos los widgets que usen la utilidad) o se mantiene local.

## 6. Salida de la "Definición de hecho adicional"

Ejecutado desde `D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3`:

```text
$ php -l widgets/intro-text-block.php
No syntax errors detected in widgets/intro-text-block.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/intro-text-block.php
6:use UsilV3\Traits\Cta_Controls_Trait;
7:use UsilV3\Traits\Title_Controls_Trait;
35:	use Title_Controls_Trait;
36:	use Cta_Controls_Trait;
93:		// del trait Title_Controls_Trait. Misma clave hide_title_seo que usaba
95:		$this->usil_register_title_controls( 'title', 'h2' );
108:		$this->usil_register_cta_controls();
253:						<?php $this->usil_render_title( $settings, (string) ( $settings['title_text'] ?? '' ), 'usil-bit__title', 'title', 'h2' ); ?>
261:							<?php $this->usil_render_title( $settings, (string) ( $settings['title_text'] ?? '' ), 'usil-bit__title', 'title', 'h2' ); ?>
271:				<?php $this->usil_render_cta( $settings ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/intro-text-block.php
0
```

Y la "Definición de hecho" del brief original (sin cambios esperados en este pase):

```text
$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/intro-text-block.php assets/css/intro-text-block.css || echo "sin colores fijos"
sin colores fijos

$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/intro-text-block.php
9
```

(El conteo de `add_control` se mantiene en 9: el trait nuevo añade internamente los dos controles del título — `title_tag` y `hide_title_seo` — y los del CTA los registra `Cta_Controls_Trait`, pero `grep` cuenta solo las llamadas que aparecen en el código del widget, no las que se expanden desde los traits.)

## 7. Dudas y riesgos

- **Cambio visible en el editor (no en el render).** Aparece un control nuevo en la pestaña Contenido: "Etiqueta HTML del título" (SELECT). Para los widgets ya publicados con `<h2>`, al re-abrir el editor el control mostrará `h2` (default), por lo que la migración no requiere acción manual del editor. Si en el futuro se quiere un default distinto (p. ej. `h3` porque la página ya tiene un `<h1>` propio en el hero), cambiar el segundo argumento de `usil_register_title_controls`.
- **El bloque `.usil-bit .usil-visually-hidden` con `!important` en `intro-text-block.css` queda redundante con `_base.css`** (regla global sin `!important`). No lo quité por restricción del brief. Punto para limpieza futura del CSS (ver sección 5).
- **El `hide_title_seo` se sigue ofreciendo para ambas variantes (v2.1 y v2.2).** Decisión heredada de la migración original: el `<h2>` existe en las dos variantes y la utilidad a11y/SEO es la misma. Si se prefiere paridad estricta con el legacy (donde solo v2.1 lo exponía), condicionar el control con `update_control( 'hide_title_seo', [ 'condition' => [ 'variant' => 'v2.1' ] ] )` justo después de `usil_register_title_controls( 'title', 'h2' )`. Decisión recomendada: dejarlo visible en ambas.
- **Sin cambios en `USIL_Pattern_Overlay_Trait`**: el color del patrón sigue siendo picker directo con defaults hex. Limitación del trait, no de este pase. Reportado en el worker-report original (`intro-text-block.md`).
