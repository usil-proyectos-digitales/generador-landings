# Worker report — `miscelaneos-contador` (14.5)

Migración del widget legacy `hk_miscelaneos_v14_5` a `usil-elementor-widgets-v3`.

## 1. Variantes

Las 5 variantes de Misceláneos no comparten contenido; cada una es su propio
widget (ver WORKER-BRIEF, sección "Ola 4b — Misceláneos"). Para 14.5 la unidad
de trabajo es **una sola variante**:

| Widget legacy                  | Opción `variant` en v3 | get_name()                  | Prefijo CSS | Clase                    |
| ------------------------------ | ---------------------- | --------------------------- | ----------- | ------------------------ |
| `hk_miscelaneos_v14_5`         | `v14-5`                | `usil_miscelaneos_contador` | `usil-mcd`  | `Miscelaneos_Contador`   |

## 2. Controles de contenido (paridad legacy → v3)

Todos los controles de CONTENIDO del legacy están en v3 con la misma clave:

| Clave legacy       | ¿Existe en v3? | Notas                                                                                              |
| ------------------ | -------------- | -------------------------------------------------------------------------------------------------- |
| `counter_title`    | ✅              | `Controls_Manager::TEXT` con el mismo default. `Title_Controls_Trait` añade `counter_title_tag` (default `h2`) y `hide_counter_title_seo` (nuevas, no rompen datos). |
| `due_date`         | ✅              | `DATE_TIME`, default `2026-12-31 23:59:59`.                                                        |
| `timezone_mode`    | ✅              | `SELECT` con `site` (default) y `visitor`.                                                         |
| `show_days`        | ✅              | `SWITCHER` con la misma clave y default `yes`.                                                     |
| `show_hours`       | ✅              | idem.                                                                                              |
| `show_minutes`     | ✅              | idem.                                                                                              |
| `show_seconds`     | ✅              | idem.                                                                                              |
| `label_days`       | ✅              | `TEXT`, default `Días`, `condition => show_days = yes`.                                            |
| `label_hours`      | ✅              | idem.                                                                                              |
| `label_minutes`    | ✅              | idem.                                                                                              |
| `label_seconds`    | ✅              | idem.                                                                                              |
| `pad_length`       | ✅              | `NUMBER`, min 1, max 4, default 2. (Acotado igual que el legacy antes de emitir el data-attribute.) |
| `after_expire`     | ✅              | `SELECT` con `zeros` (default), `hide`, `message`.                                                 |
| `expired_message`  | ✅              | `WYSIWYG`, default `El evento ya empezó.`, `condition => after_expire = message`.                  |
| `paragraph_1`      | ✅              | `WYSIWYG`.                                                                                          |
| `paragraph_2`      | ✅              | `WYSIWYG` (permite `<br>` por `wp_kses_post`).                                                     |
| `paragraph_3`      | ✅              | `WYSIWYG`.                                                                                          |

### Controles de estilo sueltos del legacy (NO copiados)

Los reemplaza el kit + las variables por modo + la pestaña "Colores (opcional)"
que pisa `--mcd-*` (mismo patrón que el piloto `miscelaneos-caja-texto`):

- Color y tipografía del título (`title_color`, `title_typography`,
  `title_align`, `title_margin`): se conservan vía kit (`primary` para tipografía
  y `fg-on-bg` para color por modo) y, opcionalmente, `bg_override` /
  `fg_override`.
- Fondo y overlay de la sección (`section_background`, `section_overlay`):
  se reemplaza por `--mcd-bg` (claro: `busurface`, oscuro: `primary`). El
  overlay de patrón se conserva vía `usil_pattern` (USIL_Pattern_Overlay_Trait).
- Estilo del contador (`counter_gap`, `item_background`, `item_border`,
  `item_border_radius`, `item_box_shadow`, `item_padding`, `value_color`,
  `value_font_size`, `value_typography`, `label_color`, `label_typography`):
  se mantienen los valores del template original en CSS (tamaños mobile/tablet/
  desktop, `border-radius`, color heredado del item) y quedan sobrescritos por
  la pestaña "Colores (opcional)" cuando se necesite.
- Estilo de los párrafos (`paragraph_color`, `paragraph_typography`,
  `paragraph_align`, `paragraph_margin`): la tipografía sale del kit
  (`typography-text-*`); el color cae en `--mcd-fg-on-bg` (mismo rol que el
  título). No hay padding/margin editor porque el template original tampoco
  los exponía al editor.

> El spacing de la sección sí se conserva como `section_padding`
> (`DIMENSIONS` responsive, mismo nombre legacy).

### Controles añadidos por los traits (no son legacy)

- `variant` (`v14-5`) y `mode` (`light`/`dark`) — `Variant_Mode_Trait`.
- `counter_title_tag` y `hide_counter_title_seo` — `Title_Controls_Trait`
  con prefijo `counter_title` (mantiene el `h2` por defecto del legacy).
- `cta_show`, `cta_text`, `cta_link`, `cta_align`, `cta_icon`, `cta_icon_pos`
  — `Cta_Controls_Trait`. No había un CTA explícito en el legacy; queda como
  opcional al final del bloque, sin romper lo existente.

## 3. Tabla de colores por modo (propuesta)

No existía `theme.ts` en `generador-landings/src/migrar/14-5/` para esta
variante (la marca del legacy venía de `bg-brand-dark` hardcodeado). La
siguiente tabla es **propuesta** siguiendo la regla 1 de Ola 4b ("Claro =
sección `busurface`, bloque/caja `primary` con texto `buneutral`; Oscuro =
sección `primary`, bloque `buneutral` con texto `primary`").

| Parte del widget     | Rol kit — Claro | Rol kit — Oscuro | Variable CSS       |
| -------------------- | --------------- | ---------------- | ------------------ |
| Sección (fondo)      | `busurface`     | `primary`        | `--mcd-bg`         |
| Título               | `primary`       | `buneutral`      | `--mcd-fg-on-bg`   |
| Párrafos             | `primary`       | `buneutral`      | `--mcd-fg-on-bg`   |
| Caja del contador (fondo) | `primary`  | `buneutral`      | `--mcd-item-bg`    |
| Caja del contador (texto) | `buneutral` | `primary`        | `--mcd-item-fg`    |
| Mensaje al expirar   | `primary`       | `buneutral`      | `--mcd-fg-on-bg`   |

Variables CSS en `assets/css/miscelaneos-contador.css`:

```css
.usil-mcd[data-mode="light"] {
	--mcd-bg:       var(--e-global-color-busurface, transparent);
	--mcd-fg-on-bg: var(--e-global-color-primary, currentColor);
	--mcd-item-bg:  var(--e-global-color-primary, transparent);
	--mcd-item-fg:  var(--e-global-color-buneutral, currentColor);
}

.usil-mcd[data-mode="dark"] {
	--mcd-bg:       var(--e-global-color-primary, transparent);
	--mcd-fg-on-bg: var(--e-global-color-buneutral, currentColor);
	--mcd-item-bg:  var(--e-global-color-buneutral, transparent);
	--mcd-item-fg:  var(--e-global-color-primary, currentColor);
}
```

## 4. Salida de "Definición de hecho"

```bash
$ cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
$ php -l widgets/miscelaneos-contador.php
No syntax errors detected in widgets/miscelaneos-contador.php

$ grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/miscelaneos-contador.php assets/css/miscelaneos-contador.css || echo "sin colores fijos"
sin colores fijos

$ node --check assets/js/miscelaneos-contador.js
JS syntax OK
```

El último comando no es parte de la "Definición de hecho" del brief; lo añadí
como verificación adicional porque el widget sí tiene JS. Salida real arriba.

## 5. Dudas y riesgos

- **Caja de título:** la cabecera `counter_title` del legacy va en texto
  plano sobre el fondo de la sección, **sin caja redondeada** alrededor (el
  contenedor redondeado solo aparece en la variante 14.3 — `Miscelaneos_Caja_Texto`).
  Por eso no se aplican las reglas de "Caja de título" del brief (variables
  `--mcd-box-bg` / `--mcd-box-fg`). Si en algún futuro se quisiera replicar
  exactamente la cabecera 14.7 dentro del contador, sería otro widget o un
  ajuste puntual.
- **`Title_Controls_Trait` con prefijo `counter_title`:** la regla del brief
  dice que si el widget ya tenía una clave de etiqueta con otro nombre, se
  usa ese prefijo y se elimina el duplicado. El legacy no exponía selector de
  etiqueta ni switch `hide_*_seo`, así que ambos controles son **nuevos** y
  tienen prefijo `counter_title` para no chocar con `title_*` de otros
  widgets del editor. No se rompe ningún dato guardado.
- **`hide_title_seo` legacy:** el legacy `Miscelaneos_V14_5_Widget` no usaba
  `USIL_Title_Visibility_Trait` (no hay clave `hide_title_seo` en su bloque
  `register_controls()`). El widget de otro piloto (v14.6 / etc.) podría
  tenerlo; no es problema de esta migración.
- **Zona horaria en `visitor`:** el PHP emite la fecha tal cual viene de
  Elementor (sin sufijo `Z`). JS hace `new Date(targetIso)` que, sin sufijo
  de zona, se interpreta como hora local del navegador. Es el mismo
  comportamiento que el legacy y por eso se conserva.
- **Eventos duplicados:** el PHP emite `data-usil-init="false"` y el JS lo
  promueve a `"true"` después del primer init. Si Elementor dispara el
  hook dos veces (p. ej. switch de template), el segundo init se ignora
  silenciosamente.
- **Override `--mcd-item-bg`/`--mcd-item-fg`:** si el editor pone color fijo
  a `--mcd-item-bg`, pierde la translucencia relativa al kit. Lo dejé como
  color sólido (sin `rgba`) para que el override sea 1:1 con el picker; si
  después se quiere mantener la sensación "translúcido" del legacy, se puede
  mover la translucencia al CSS (`color-mix(...)` o un segundo override de
  `opacity`). **No aplicado en esta entrega** para no introducir diferencias
  con la paleta del kit.
- **Solo esta unidad:** no se ha tocado `wp-plugin/usil-elementor-widgets-v3.php`,
  ningún trait, `_base.css`, `usil-carousel.js`, ni otros widgets, según las
  reglas duras del worker.
