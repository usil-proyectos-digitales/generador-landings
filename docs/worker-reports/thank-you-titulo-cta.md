# thank-you — Título y CTA uniformes (Ola 2)

Widget: `wp-plugin/usil-elementor-widgets-v3/widgets/thank-you.php`
Slug: `thank-you`

## Identificación del "título principal"

El widget Thank You tiene tres encabezados (`<h1>`/`<h2>`) ya maquetados:

| Encabezado                              | Etiqueta | Fuente                  | Tratamiento                  |
|-----------------------------------------|----------|--------------------------|------------------------------|
| Título de la caja "Gracias"             | `h2`     | `thank_you_title` (WYSIWYG) | **Principal** → trait         |
| Título "Save the Date"                  | `h2`     | `save_the_date_title`    | No se toca (subtítulo de caja) |
| Título del programa (col. izq. v15-1)   | `h1`     | `program_title`          | No se toca (subtítulo de columna) |

El "título principal" es el de la caja "Gracias" (`thank_you_title`): es el que da identidad al widget y aparece en ambas variantes. La etiqueta actual es `<h2>` (legacy y v3 antes de este cambio), así que se conserva como `default_tag = 'h2'`.

Prefijo elegido: **`title`** (el prefijo estándar del brief para el título principal; no existía ya ninguna clave `*_tag` ni `hide_*_seo` en el widget que forzara otro prefijo).

## CTA

No existía ninguna clave `cta_*` a nivel de widget antes del cambio (sí existía `calendar_button_text` dentro de la caja Save the Date, pero ese es un botón específico de esa caja, no un CTA uniforme). No hay colisión con `cta_show` / `cta_text` / `cta_link` / `cta_icon` / `cta_icon_pos`.

El CTA se pinta al final del contenido, dentro de `<div class="usil-ty__inner">`, **después** de la caja Save the Date — que es el último bloque de las dos variantes (v15-1: grid → Save the Date; v15-2: Gracias → Save the Date).

## Cambios aplicados

1. **Use statements** (líneas 7, 9): añadido `UsilV3\Traits\Cta_Controls_Trait` y `UsilV3\Traits\Title_Controls_Trait`, en orden alfabético junto a los traits previos.
2. **Use dentro de la clase** (líneas 43–44): `use Title_Controls_Trait; use Cta_Controls_Trait;` añadidos tras `use USIL_Pattern_Overlay_Trait;`.
3. **`register_controls()`** (línea 193): `$this->usil_register_title_controls( 'title', 'h2' );` justo después del control WYSIWYG `thank_you_title`. Esto registra `title_tag` (SELECT, default `h2`) y `hide_title_seo` (SWITCHER, default `''`).
4. **`register_controls()`** (línea 488): `$this->usil_register_cta_controls();` justo después de cerrar la sección de Save the Date, antes de la sección de Colores. Crea la sección `section_cta` con las 5 claves uniformes.
5. **`usil_render_thank_you_box()`** (línea 863): el bloque `<h2 class="usil-ty__title">…</h2>` se reemplazó por `$this->usil_render_title( $settings, (string) ( $settings['thank_you_title'] ?? '' ), 'usil-ty__title', 'title', 'h2' );`. La clase CSS `usil-ty__title` se conserva.
6. **`usil_render_v15_1()`** (línea 989): `$this->usil_render_cta( $settings );` justo después de `usil_render_save_the_date_box`, dentro de `usil-ty__inner`.
7. **`usil_render_v15_2()`** (línea 1005): misma llamada en la misma posición.

## Claves migradas / creadas

| Clave           | Origen                         | Acción                            |
|-----------------|--------------------------------|-----------------------------------|
| `title_tag`     | `Title_Controls_Trait`         | Nueva (default `h2`)              |
| `hide_title_seo`| `Title_Controls_Trait`         | Nueva (default `''`)              |
| `cta_show`      | `Cta_Controls_Trait`           | Nueva (default `''`)              |
| `cta_text`      | `Cta_Controls_Trait`           | Nueva (default "Más información") |
| `cta_link`      | `Cta_Controls_Trait`           | Nueva                              |
| `cta_icon`      | `Cta_Controls_Trait`           | Nueva                              |
| `cta_icon_pos`  | `Cta_Controls_Trait`           | Nueva (default `before`)          |

**No hubo migración** de claves propias: el widget no tenía `*_tag`, `hide_*_seo` ni `cta_*` propios a nivel de widget. No se perdió ningún ajuste guardado.

## Etiqueta por defecto conservada

- Antes: `<h2 class="usil-ty__title">…</h2>`
- Ahora: `<h2 class="usil-ty__title">…</h2>` (mismo tag, misma clase, contenido escapado por `esc_html` dentro del trait).

`usil_register_title_controls( 'title', 'h2' )` → `title_tag` queda con `default = 'h2'`. ✓

## Confirmación de HTML por defecto sin cambios

El render por defecto (sin overrides del editor) producía:

```html
<h2 class="usil-ty__title">Mensaje principal del Thank You Page.</h2>
```

Con los traits produce exactamente lo mismo:

```html
<h2 class="usil-ty__title">Mensaje principal del Thank You Page.</h2>
```

El default `thank_you_title` es texto plano (`esc_html__( 'Mensaje principal del Thank You Page.', … )`), así que `esc_html()` dentro del trait no altera nada visible. Etiqueta y clase CSS idénticas.

## Definición de hecho adicional (pega literal)

```text
$ cd "D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3"
$ php -l widgets/thank-you.php
No syntax errors detected in widgets/thank-you.php

$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/thank-you.php
7:use UsilV3\Traits\Cta_Controls_Trait;
9:use UsilV3\Traits\Title_Controls_Trait;
43:	use Title_Controls_Trait;
44:	use Cta_Controls_Trait;
193:		$this->usil_register_title_controls( 'title', 'h2' );
488:		$this->usil_register_cta_controls();
863:				<?php $this->usil_render_title( $settings, (string) ( $settings['thank_you_title'] ?? '' ), 'usil-ty__title', 'title', 'h2' ); ?>
989:				<?php $this->usil_render_cta( $settings ); ?>
1005:				<?php $this->usil_render_cta( $settings ); ?>

$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/thank-you.php
0
```

✓ 0 definiciones propias de las claves del trait.
✓ Los 6 hooks del trait (2 imports, 2 `use`, 1 `register_title`, 1 `register_cta`, 1 `render_title`, 2 `render_cta` por las dos variantes) están todos presentes.

## Dudas y riesgos

1. **Tipo del título: WYSIWYG, no TEXT.** `thank_you_title` es un `Controls_Manager::WYSIWYG` (permite `<span>`, `<br>`, `<strong>`, `<em>`, `<b>`, `<i>`, `<u>` en el legacy, vía `usil_sanitize_inline_html`). El trait `usil_render_title` aplica `esc_html()` al texto, lo que escapa ese HTML inline y lo muestra literal. **El render por defecto no se ve afectado** (el default es texto plano), pero si alguien editó el título en producción con formato (`<strong>…</strong>`), ahora verá el HTML literal. El brief fija el uso del trait para "el título principal" sin distinguir el tipo de control; la solución conforme al brief es aceptar este cambio y, si hace falta, abrir un ticket para que el trait acepte una función de escape opcional o para tipar `thank_you_title` como TEXT. Lo dejo señalado por si llega feedback desde producción.

2. **`save_the_date_title` también es h2.** No se le aplicó el trait porque el brief dice "título principal" (singular) y este es el subtítulo de la caja Save the Date. Si en una iteración futura se quiere que también tenga selector de etiqueta/ocultar SEO, habría que añadir una segunda llamada con prefijo distinto (p. ej. `save_the_date`). Hoy no se hace.

3. **`program_title` también es h1.** Mismo razonamiento: es el título de la columna izquierda en v15-1, no el título principal del widget. Sin trait aplicado.