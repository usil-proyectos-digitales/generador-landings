# Plan: pasar el dev de SiteGround de multisitio a sitio único

Decisión: se abandona el multisitio y se sigue la línea de `landings.usil.edu.pe` (un solo WP, CPT `landing` + taxonomía `unidad_negocio`). No se importa el `.wpress` de producción en el dev: el contenido ya está (XML) y el import borraría EMCP, `mockup-wizard-ia` y las páginas `Spike ...`.

## Por qué
- Las 77 LP publicadas de pregrado no se pueden abrir en su URL: `/pregrado/` lo atiende el subsitio "Landings Pregrado" (colisión de rutas).
- Plugins que piden licencia multisitio.
- La prueba de variables (color y tipografía por BU) funciona igual en un WP normal.

## Pasos
1. Respaldo completo del dev (BD + archivos).
2. Borrar los subsitios 2–5 desde Network Admin.
3. Volver a sitio único: desactivar plugins de red; quitar `MULTISITE`, `SUBDOMAIN_INSTALL`, `DOMAIN_CURRENT_SITE`, etc. de `wp-config.php`; dejar el `.htaccess` de WP normal.
4. Reactivar plugins (Elementor, Elementor Pro, ACF, WPCode, CPT Permalinks, v3, EMCP, HubSpot). Confirmar que ninguno exige licencia multisitio.
5. Verificar: `/pregrado/conversatorio-htg/` y `/pregrado-ejecutivo/...` cargan; 102 publicadas y 7 borradores; el snippet 1631 sigue funcionando; el conector EMCP responde.
6. Taxonomía `unidad_negocio`: crear los 9 términos de BU (hoy hay 5: pregrado, pregrado-ejecutivo, open-day, congreso, cge).
7. Snippet global de `design.md`: se aplica solo si la LP contiene widgets v3 (lista de los 19 `usil_*` de v3, no el prefijo: `usil_hubspot_form_descubre` no es v3); pone `data-bu` según `unidad_negocio`; selector `html[data-bu="x"] body {…}` (con `[data-bu]` solo pierde contra `body.elementor-kit-7`). CSS de las 9 BU generado desde `usil-widgets/design/design-md/*.md` (`npm run wpcode:design-md` en `usil-widgets`; desde el 10 nov los `design.md` ya no viven en este repo); fuentes: Rubik, Poppins, Anton, Montserrat, Roboto.
8. Prueba de cierre: una LP nueva con widgets v3 en pregrado y otra en posgrado; una LP vieja debe quedar sin cambios.

## No tocar
- Tarea programada `spike-sheet-emcp-preview` (claude.ai): depende de EMCP y de la URL del dev. Usa widgets `hk_*`; con `design.md` por v3 habrá que actualizarla a `usil_*`.
- Página `mockup-wizard-ia` (ID 4358) y las páginas `Spike ...`.

## Pendiente
- Actualizar el Track A (A1/A2) del cronograma: ya no hay red multisitio.
- Pasar a producción: la LP viven en `landings.usil.edu.pe`, sin multisitio no hay riesgo de URLs.
- HubSpot: los formularios importados apuntan al portal de producción; no enviarlos desde dev.

## Actualización 10 nov 2026
- Pasos 1–8 hechos en el dev (sitio único, 9 términos, snippet global `Design MD` activo, verificado en posgrado y pregrado).
- La fuente de `design.md` y el generador del snippet (`docs/wpcode/design-md-global.php`) pasaron al repo `usil-widgets` (`design/design-md/`, `npm run wpcode:design-md`). Este repo ya no tiene copia, parser ni `/design-md-preview`.
