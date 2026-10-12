# bloque-contenido-imagen — Título y CTA uniformes (ola 2)

Migración del widget `bloque-contenido-imagen` a los traits `Title_Controls_Trait` y
`Cta_Controls_Trait`. Editado: solo `widgets/bloque-contenido-imagen.php`.

## Claves migradas

El widget no definía controles propios de etiqueta/ocultar del título ni del CTA.
No hubo claves previas que migrar: el trait crea las suyas (`title_tag`,
`hide_title_seo`, `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos`)
desde cero. No se reemplazó nada — no existían duplicados.

> Detalle: `title_tag` y `hide_title_seo` se registran con prefijo `title`
> (`usil_register_title_controls( 'title', 'h2' )`); el conmutador queda como
> `hide_title_seo`, la misma clave que ya usaba `USIL_Title_Visibility_Trait`
> si algún día se quisiera quitar.

## Etiqueta por defecto conservada

La etiqueta por defecto del selector sigue siendo **h2** — la que el widget ya
imprime hoy (los tres renders v9-1, v9-2, v9-3 usan `<h2 class="usil-bci__title">`
en el HTML estático). Se pasa como segundo argumento al trait:
`usil_register_title_controls( 'title', 'h2' )`. El helper
`$this->usil_title_tag( $settings, 'title', 'h2' )` cae también a `h2` si el
control está vacío o mal escrito (lista blanca de etiquetas del trait).

## HTML por defecto sin cambios

El bloque del título en este widget no es un simple `<h2>texto</h2>`: tiene
hijos internos (`<span class="usil-bci__title-text">` y/o
`<span class="usil-bci__title-support-box"><span class="usil-bci__title-support">…`).
`usil_render_title()` del trait solo imprime `<tag class="…">texto</tag>` — no
admite hijos — y, si se usara tal cual, perderíamos la caja de soporte (que en
v9-2 y v9-3 es el contenedor visual del título, no un adorno opcional).

Para no romper la maquetación existente, en cada `usil_render_v9X` se aplica
el trait por la vía "controles + helpers":

- `$title_tag` ← `$this->usil_title_tag( $settings, 'title', 'h2' )`
- `$title_hidden` ← `$this->usil_title_is_hidden( $settings, 'title' )`
- clase final: `usil-bci__title` + (si oculto) ` usil-visually-hidden`
- la etiqueta de apertura/cierre se imprime con `<?php echo esc_attr( $title_tag ); ?>`

Resultado: para los ajustes por defecto (variant=v9-1, title="Poner Título aquí",
highlight_text="Texto Resaltado", hide_title_seo=vacío, cta_show=vacío) el HTML
emitido es **idéntico** al anterior byte a byte:

```html
<h2 class="usil-bci__title">
    <span class="usil-bci__title-text">Poner Título aquí</span>
    <span class="usil-bci__title-support-box">
        <span class="usil-bci__title-support">Texto Resaltado</span>
    </span>
</h2>
```

El conmutador `hide_title_seo` añade `usil-visually-hidden` (clase de
`assets/css/_base.css`) sin retirar el nodo — accesibilidad y SEO conservados.

## CTA

- `usil_register_cta_controls()` se llama justo después de la última sección
  de contenido (`section_content_v93`) y antes de las secciones de estilo, en
  línea con la receta del brief.
- `usil_render_cta( $settings )` se inserta **al final de la columna de
  contenido** de cada variante:
  - v9-1 y v9-2: dentro de `<div class="usil-bci__text">`, después del
    `<div class="usil-bci__desc">`.
  - v9-3: dentro de `<div class="usil-bci__text-v93">`, después del
    `<div class="usil-bci__desc">`.
- El botón se centra solo (reglas `.usil-cta-wrap` / `.usil-cta` en
  `_base.css`); el widget no añade CSS propio para el CTA.
- El widget **no tenía botón/enlace propio**, así que no hay nada que
  conservar. Reportado conforme a la regla "si ya tiene botón, no lo
  elimines".

## Definición de hecho (pegar salida tal cual)

### php -l

```text
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ php -l widgets/bloque-contenido-imagen.php
No syntax errors detected in widgets/bloque-contenido-imagen.php
```

### Colores fijos en widget + CSS (debe ser "sin colores fijos")

```text
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/bloque-contenido-imagen.php assets/css/bloque-contenido-imagen.css || echo "sin colores fijos"
sin colores fijos
```

### Conteo de add_control/responsive/group (referencia del brief general)

```text
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ grep -cE "add_control|add_responsive_control|add_group_control" widgets/bloque-contenido-imagen.php
20
```

### Definición de hecho adicional (específica de Título + CTA)

```text
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/bloque-contenido-imagen.php
6:use UsilV3\Traits\Cta_Controls_Trait;
7:use UsilV3\Traits\Title_Controls_Trait;
49:	use Title_Controls_Trait;
50:	use Cta_Controls_Trait;
106:		$this->usil_register_title_controls( 'title', 'h2' );
260:		$this->usil_register_cta_controls();
517:					<?php $this->usil_render_cta( $settings ); ?>
554:					<?php $this->usil_render_cta( $settings ); ?>
589:				<?php $this->usil_render_cta( $settings ); ?>
```

```text
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/bloque-contenido-imagen.php
0
```

> El último conteo es 0, como exige el brief: el widget **no** redefine las
> claves del trait, solo las consume vía los helpers `usil_title_tag()` /
> `usil_title_is_hidden()` y vía `usil_render_cta()`.
>
> `usil_render_title` no aparece en el grep porque no se llama directamente:
> el bloque de título del widget tiene hijos (`title-text`, `title-support-box`,
> `title-support`) que el helper del trait no puede envolver. Ver "Dudas".

## Dudas y riesgos

1. **No se llama a `usil_render_title()`** del trait. El brief lo sugiere
   como atajo para widgets con un título plano (`save-the-date`), pero este
   widget tiene caja de soporte anidada en las tres variantes (en v9-1 como
   hermano del título, en v9-2/v9-3 envolviendo el título). Usar
   `usil_render_title()` eliminaría esa caja y rompería el visual aprobado
   (sobre todo en v9-2 y v9-3, donde la caja ES la presentación del título).
   La salida se construye entonces con los helpers `usil_title_tag()` +
   `usil_title_is_hidden()` y un `printf`/`<?=` que respeta la estructura
   previa. El trait queda "aplicado" para lo que aporta de valor (selector de
   etiqueta + conmutador SEO), que es lo uniforme entre widgets.
   Si en el futuro el CSS de la caja se separa del título y el bloque se
   simplifica, conviene revisar para usar `usil_render_title()` directo y
   bajar la duplicación.
2. El conmutador `hide_title_seo` por defecto vacío: si un usuario del legacy
   tenía ya guardado `hide_title_seo=yes` (vía `USIL_Title_Visibility_Trait`,
   que este widget nunca usó), las claves casan (`hide_title_seo` es la misma)
   y los datos previos se conservan sin migración manual. Lo mismo para
   `title_tag` si existiera — clave idéntica, sin pérdida.
3. El CTA se renderiza al final de la **columna de contenido**, no al final
   del `<section>` raíz. En v9-1 y v9-2 eso queda dentro de
   `.usil-bci__text`; en v9-3, dentro de `.usil-bci__text-v93`. En los tres
   casos el botón se centra solo por el CSS compartido (`.usil-cta-wrap`).
   Si en alguna variante se prefiere CTA fuera de la columna de texto (p. ej.
   v9-3 a ancho completo bajo la sección), mover el `usil_render_cta()` al
   `render()` general sería un cambio de un par de líneas, pero excede esta
   ola.
