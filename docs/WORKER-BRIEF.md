# WORKER-BRIEF — migrar una familia de widgets a v3

Lee este archivo completo antes de escribir código. Te asignaron **una familia**. Trabajas solo en tus archivos.

## Qué se construye

Los widgets legacy (`D:\laragon\www\github\usil-widgets\wp-plugin\usil-elementor-widgets\widgets\`) son PHP de Elementor con Tailwind y colores fijos. El v3 los reemplaza en el plugin nuevo:

`D:\laragon\www\github\usil-widgets\wp-plugin\usil-elementor-widgets-v3\`

Por familia se entrega **una sola clase** con un control `variant` (una opción por cada variante legacy) y un control `mode` (Claro/Oscuro). Color y tipografía salen del **kit de Elementor** del sub-sitio (la marca de cada unidad de negocio), nunca de valores fijos.

## Archivos que SÍ creas (solo estos)

- `wp-plugin/usil-elementor-widgets-v3/widgets/<slug>.php`
- `wp-plugin/usil-elementor-widgets-v3/assets/css/<slug>.css`
- `generador-landings/docs/worker-reports/<slug>.md` (tu reporte)
- Si el legacy usa JS (carrusel, tabs, acordeón): `assets/js/<slug>.js`

Convención de nombres (el plugin descubre los widgets solo, no edites el archivo principal):
- Archivo `widgets/cards-items.php` → clase `UsilV3\Widgets\Cards_Items` (guiones pasan a `_`, cada palabra con mayúscula inicial).
- `assets/css/cards-items.css` → handle de estilo `usil-v3-cards-items`; devuélvelo en `get_style_depends()`.
- `get_name()` = `usil_<slug con guion bajo>` (ej. `usil_cards_items`). `get_categories()` = `['usil_v3']`.

## Archivos que NO tocas

Cualquier otro archivo: el plugin legacy, `usil-elementor-widgets-v3.php`, los traits, los archivos de otras familias. **No hagas commit, no generes zip, no uses git.** Si necesitas algo de un trait que no existe, dilo en el reporte.

## Referencia obligatoria: imita el piloto

1. `wp-plugin/usil-elementor-widgets-v3/widgets/save-the-date.php`
2. `wp-plugin/usil-elementor-widgets-v3/assets/css/save-the-date.css`
3. `wp-plugin/usil-elementor-widgets-v3/includes/traits/Variant_Mode_Trait.php`

Traits disponibles (namespace `UsilV3\Traits`): `Variant_Mode_Trait`, `Carousel_Controls_Trait`, `USIL_Pattern_Overlay_Trait`, `USIL_Title_Visibility_Trait`. Úsalos con `use UsilV3\Traits\<Nombre>;` si el legacy los usaba.

## Receta (en este orden)

1. **Lee todos los archivos legacy de tu familia** (te los indica la tabla del prompt). Anota variantes, controles de contenido y la estructura HTML de cada una.
2. Si existe `src/components/widgets/<n>/theme.ts` en `generador-landings/`, léelo: ahí está decidido qué rol de color usa cada parte en Claro y Oscuro. Respétalo.
3. Si hay `generador-landings/src/migrar/<n>/template.html`, úsalo como referencia visual del HTML.
4. Crea la clase con `Variant_Mode_Trait` → `$this->usil_add_variant_mode_controls([ 'slug-variante' => 'Etiqueta', ... ])`. Una opción por variante legacy.
5. **Paridad de contenido**: cada control de contenido del legacy (textos, repeaters, imágenes, enlaces, toggles) debe existir en v3 con el mismo propósito. Los controles de estilo del legacy (colores, tipografías sueltas) NO se copian; se reemplazan por el kit (ver abajo). Conserva controles de espaciado útiles.
6. En `render()`: un `<section>` raíz con clase `usil-<abreviatura>` y `usil_variant_mode_attrs( $settings )` (da `data-variant` y `data-mode`). El CSS se engancha a esos atributos. Si una variante cambia la estructura HTML, ramifica en PHP según `$settings['variant']`; si solo cambia el estilo, ramifica en CSS.
7. **CSS** (`assets/css/<slug>.css`):
   - Define variables locales por modo, igual que el piloto: `.usil-xxx[data-mode="light"] { --xxx-bg: var(--e-global-color-busurface, transparent); ... }` y lo mismo para `dark`.
   - Colores permitidos (fallback siempre presente): `--e-global-color-primary`, `-secondary`, `-text`, `-accent`, `-busurface`, `-buneutral`.
   - Tipografía permitida: `--e-global-typography-{primary|secondary|text|accent}-{font-family|font-weight|font-size|line-height|letter-spacing}` con fallback.
   - Roles tipográficos del kit: `primary` = Headline, `secondary` = Title, `text` = Body, `accent` = Link/Label.
   - Mobile: el kit no define tamaños responsive; reduce tamaños en `@media (max-width: 767px)` como hace el piloto.
8. **Overrides de color opcionales** (pestaña Estilo, vacíos por defecto) que pisan las variables locales vía `selectors`, como en el piloto. Un campo vacío = marca del kit.
9. **Salida escapada**: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`. Nunca imprimas un setting crudo.
10. **JS**: solo si el legacy lo usa. Sin dependencias nuevas; si el legacy usa Swiper, reutiliza la misma librería que usa el legacy (revisa cómo la encola) y descríbelo en el reporte.

## Prohibido (se rechaza en la revisión)

- Colores hex (`#fff`, `#012085`…), `rgb()` fijos, clases `brand-dark/light/gold`, cualquier clase Tailwind (`bg-*`, `text-*`, `px-*`, `font-montserrat`…).
- `<style>` inline dentro de `render()` con colores fijos.
- Inventar controles que el legacy no tenía, o dejar fuera controles de contenido que sí tenía.
- Copiar `!important` del legacy salvo que lo justifiques en el reporte.

## Definición de hecho (ejecuta esto y pega la salida en el reporte)

```bash
cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
php -l widgets/<slug>.php
grep -nE "#[0-9a-fA-F]{3,6}\b|brand-(dark|light|gold)|rgb\(" widgets/<slug>.php assets/css/<slug>.css || echo "sin colores fijos"
grep -cE "add_control|add_responsive_control|add_group_control" widgets/<slug>.php
```

Además: cada variante legacy aparece como opción en `variant`; todos los controles de contenido legacy existen.

## Reporte (`generador-landings/docs/worker-reports/<slug>.md`)

1. **Variantes**: tabla legacy → opción `variant` v3.
2. **Controles de contenido**: lista legacy vs v3; cualquier omitido con motivo.
3. **Tabla de colores por modo**: por variante × (Claro, Oscuro), qué rol del kit usa cada parte (fondo, título, texto, card, botón…). Si no había `theme.ts`, **propón** la tabla: Claro usa los roles naturales (surface de fondo, primary para títulos y CTA); Oscuro reasigna los mismos roles (primary o secondary de fondo, neutral para texto). Márcala como propuesta.
4. **Salida de la sección "Definición de hecho"**.
5. **Dudas y riesgos**: lo que no pudiste resolver o te pareció ambiguo.

No inventes resultados: si un comando falla, pégalo tal cual.

## Título y CTA uniformes (obligatorio en todo widget)

Dos traits nuevos (namespace `UsilV3\Traits`). No los edites; si te falta algo, dilo en el reporte. Referencia: `widgets/save-the-date.php`.

1. **Título** — `use Title_Controls_Trait;`
   - En `register_controls()`, dentro de la sección de contenido y **justo después del control de texto del título**: `$this->usil_register_title_controls( '<prefijo>', '<etiqueta actual>' );`. Prefijo `title` para el título principal (claves `title_tag` y `hide_title_seo`); si el widget ya tiene un control de etiqueta con otra clave (ej. `section_title_tag`), usa ese prefijo (`section_title`) y **elimina el control duplicado** para que quede uno solo.
   - La etiqueta por defecto es **la que el widget ya imprime hoy** (no cambies el HTML de lo ya maquetado).
   - En `render()` reemplaza el `<h2>…</h2>` fijo por `$this->usil_render_title( $settings, (string) $settings['title'], 'clase-actual-del-titulo', '<prefijo>', '<etiqueta actual>' );`. Conserva la clase CSS que ya tenía.
   - Si el widget usa `USIL_Title_Visibility_Trait` (clave `hide_title_seo`), quítalo y usa este trait: la clave es la misma, no se pierden datos guardados.
   - Los títulos dentro de cards/repeaters **no** se tocan.
2. **CTA** — `use Cta_Controls_Trait;` (excepto Footer, que no lleva CTA)
   - En `register_controls()`, después de cerrar la sección de contenido y antes de las de estilo: `$this->usil_register_cta_controls();`
   - En `render()`, **al final del contenido**, dentro del contenedor raíz del widget, antes de cerrar el `<section>`/`<div>` interior: `$this->usil_render_cta( $settings );`
   - Si el widget ya tiene claves `cta_*` propias (ej. Cards las tiene **por card**, dentro de un repeater), no choca: el CTA del widget usa `cta_show`, `cta_text`, `cta_link`, `cta_icon`, `cta_icon_pos` a nivel de widget. Revisa que no exista ya una clave igual a nivel de widget.
   - No definas CSS del CTA: ya está en `_base.css` (`.usil-cta-wrap`, `.usil-cta`). Un solo botón, centrado por defecto; la posición la elige el editor (`cta_align`).
3. **Definición de hecho adicional** (pega la salida en el reporte):
   ```bash
   cd D:/laragon/www/github/usil-widgets/wp-plugin/usil-elementor-widgets-v3
   php -l widgets/<slug>.php
   grep -nE "Title_Controls_Trait|Cta_Controls_Trait|usil_register_title_controls|usil_register_cta_controls|usil_render_title|usil_render_cta" widgets/<slug>.php
   grep -cE "'(hide_title_seo|title_tag|cta_show|cta_text|cta_link|cta_icon|cta_icon_pos)'" widgets/<slug>.php
   ```
   El último conteo debe ser **0 definiciones propias** de esas claves (solo las crean los traits).
4. **Reporte** (`docs/worker-reports/<slug>-titulo-cta.md`): qué claves antiguas de etiqueta/ocultar migraste, etiqueta por defecto conservada, y confirmación de que el HTML por defecto no cambió.

## Lecciones de la Ola 1 (obligatorio)

1. **No definas métodos que ya existen en Elementor.** Un método privado `print_render_attribute_string()` provocó un error crítico en WordPress (Elementor lo declara público). Prefija tus métodos auxiliares con `usil_` (ej. `usil_render_cards()`). Para imprimir atributos de enlace usa los de Elementor: `$this->add_link_attributes()` y `$this->print_render_attribute_string( $key )`.
2. **No registres CSS ni JS a mano.** El plugin registra solo `assets/css/<slug>.css` (handle `usil-v3-<slug>`) y `assets/js/<slug>.js` (handle `usil-v3-<slug>`). Solo declara `get_style_depends()` y, si tienes JS, `get_script_depends()` con ese handle.
3. **No fuerces el ancho del widget.** El 100% de ancho ya lo da `assets/css/_base.css` a todos los widgets `usil_*`. No toques ese archivo.
4. **Carruseles: Swiper compartido, fiel a la v1.** No escribas JS de carrusel ni `new Swiper`. Marca el contenedor con `data-usil-carousel="<preset>"` + `get_carousel_attributes()` y pide `usil-v3-usil-carousel` en `get_script_depends/get_style_depends`. El preset (selector de item, umbral, breakpoints) vive en `assets/js/usil-carousel.js`; modelo: `widgets/cards-items.php` (v6-8). Sin scroll-snap.
5. **Trait de patrón de fondo**: usa `USIL_Pattern_Overlay_Trait` solo si el legacy lo usaba; sus colores por defecto son hex y se marcan como pendiente en el reporte.
6. **Sin `theme.ts` de Astro** (familias nuevas): propón la tabla de colores por modo en el reporte (sección 3), marcada como propuesta.

## Lecciones de la Ola 2 (obligatorio)

1. **El HTML por defecto no cambia.** Al aplicar los traits de título/CTA, un worker sacó el resaltado de dentro del `<h2>` y rompió el CSS. Si el título tiene contenido anidado (caja de resaltado, spans), usa `usil_title_open_tag()` / `usil_title_close_tag()` del trait y deja el contenido interno tal cual; `usil_render_title()` es solo para títulos de texto plano.
2. **Títulos con formato en línea** (`<br>`, `<strong>`, `<span>`): pasa `true` como último argumento de `usil_render_title()` (usa lista blanca con `wp_kses`). Con `false` se escapa todo con `esc_html` y se pierde el formato.
3. **Compara contra el legacy**: tu reporte debe incluir el HTML por defecto de cada variante antes y después, no solo "sin cambios".
4. **Backslashes en PHP**: revisa `use UsilV3\Traits\...;` y `\Elementor\...` al terminar; los scripts que escriben archivos los pierden con facilidad.
5. **Carruseles: Swiper vía `UsilCarousel`** (ver lección 4 de Ola 1). Prohibido scroll-snap propio y `new Swiper` fuera de `usil-carousel.js`.
6. **No definas CSS del CTA ni de `.usil-visually-hidden`**: ya están en `_base.css`.

## Caja de título (title-support-box)

Todo widget con caja redondeada en el título usa la lógica del 9.1, en ambos modos:
- Claro: fondo `primary`, texto `busurface`.
- Oscuro: fondo `buneutral`, texto `primary`.
Título sin caja: claro `primary`, oscuro `buneutral`. No usar `accent` para la caja. Variables `--<prefijo>-box-bg` / `--<prefijo>-box-fg` definidas por `[data-mode]`.

## Ola 4b — Misceláneos (un widget por variante)

Las 5 variantes de Misceláneos no comparten contenido: **cada una es su propio widget** (un archivo PHP, un CSS y, si aplica, un JS). Cada worker hace UNO.

| Variante | Archivo (`<slug>`) | Clase | Prefijo CSS | `get_name()` |
|---|---|---|---|---|
| 14.3 (piloto, hecho por Claude) | `miscelaneos-caja-texto` | `Miscelaneos_Caja_Texto` | `usil-mct` | `usil_miscelaneos_caja_texto` |
| 14.5 contador | `miscelaneos-contador` | `Miscelaneos_Contador` | `usil-mcd` | `usil_miscelaneos_contador` |
| 14.6 informativo | `miscelaneos-informativo` | `Miscelaneos_Informativo` | `usil-minf` | `usil_miscelaneos_informativo` |
| 14.7 texto + carrusel | `miscelaneos-carrusel` | `Miscelaneos_Carrusel` | `usil-mcar` | `usil_miscelaneos_carrusel` |
| 14.8 ranking | `miscelaneos-ranking` | `Miscelaneos_Ranking` | `usil-mrk` | `usil_miscelaneos_ranking` |

**Piloto obligatorio:** `widgets/miscelaneos-caja-texto.php` y `assets/css/miscelaneos-caja-texto.css`. Imítalos: estructura de la clase, `usil_add_variant_mode_controls` con UNA sola variante (`v14-X`), `Title_Controls_Trait` + `Cta_Controls_Trait` + `USIL_Pattern_Overlay_Trait`, sección Espaciado, sección "Colores (opcional)" con overrides que pisan variables `--<prefijo>-*`, variables por `[data-mode]`, móvil en `@media (max-width: 767px)`.

Reglas de la Ola 4 (aprendidas en Ola 3b/4a):
1. **Sin Tailwind ni hex.** Los colores del legacy (`bg-brand-dark`, `#F0F0F0`, `shadow-[…#ffffff]`) se traducen a roles del kit por modo: Claro = sección `busurface`, bloque/caja `primary` con texto `buneutral`; Oscuro = sección `primary`, bloque `buneutral` con texto `primary`; acentos con `accent`. Define la tabla en el reporte (propuesta).
2. **Caja de título** (si la hay): claro `primary` + texto `busurface`; oscuro `buneutral` + texto `primary`. Variables `--<prefijo>-box-bg/-box-fg`.
3. **JS (solo 14.5):** archivo `assets/js/miscelaneos-contador.js`; se registra solo con handle `usil-v3-miscelaneos-contador` (devuélvelo en `get_script_depends()`). Vanilla. **Un solo init por contenedor**: marca `data-usil-init` y NO la borres en el hook de Elementor (si la borras, se enlazan los eventos dos veces). Hook: `frontend/element_ready/<get_name()>.default`. Limpia los `setInterval` si el nodo desaparece.
4. **Carrusel (solo 14.7):** el preset `miscelaneos-v14-7` YA existe en `usil-carousel.js` (selector de item `.usil-mcar__slide`, 1 por vista). NO toques `usil-carousel.js` ni escribas `new Swiper`. Contenedor: `<div class="usil-mcar__slides" data-usil-carousel="miscelaneos-v14-7" <?php echo $this->get_carousel_attributes(); ?>>` con hijos directos `.usil-mcar__slide`; `use Carousel_Controls_Trait;` y `$this->register_usil_carousel_controls();`; depends `usil-v3-usil-carousel` (script y style). El JS compartido crea flechas y puntos.
5. **Repeaters:** los controles condicionales no llegan a `$settings` si están inactivos; con una sola variante no hay condiciones por variante, así que no uses `condition` sobre `variant`.
6. **Imágenes:** `Controls_Manager::MEDIA` con placeholder (`\Elementor\Utils::get_placeholder_image_src()`) donde el legacy tenía imagen por defecto; `esc_url` al imprimir y `alt` con `esc_attr`.
7. **No edites archivos compartidos**: `usil-elementor-widgets-v3.php`, traits, `_base.css`, `usil-carousel.js/css`, ni el widget de otro worker.
8. **Backslashes**: al terminar revisa los `use UsilV3\...;` y `\Elementor\...` de tu PHP (los scripts que escriben archivos los pierden). Prefija tus métodos auxiliares con `usil_`.
9. **Reporte:** `generador-landings/docs/worker-reports/<slug>.md` con variantes, controles legacy vs v3, tabla de colores propuesta, salida literal de `php -l` y del grep de colores fijos, y dudas.
