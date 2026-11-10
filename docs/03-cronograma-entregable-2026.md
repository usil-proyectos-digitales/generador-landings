# Cronograma Entregable 2026 (alcance recortado)

> Artifact: https://claude.ai/artifact/KLKqtXKxV2yWAfcrNbKMhT · Backup del cronograma completo: `03-cronograma-estimado-v2.md` (artifact `PBMckeReNrDan1duJDDawa`). Registro de artifacts: `artifacts/INDEX.md`.

**Meta:** al **30 dic 2026**, flujo usable de punta a punta (solicitud de landing → preview → edición del Dev con Claude Code + EMCP → publicación) con las **9 BU**. Calculado a **8h/día** desde el **lun 9 nov 2026**; el artifact tiene un switch a 4h/día.

## Días no laborables
- 11 y 12 nov (visita del Papa): medio día opcional, no contado. Si se trabaja, adelanta ~1 día.
- 8 y 9 dic (feriados) · 14–21 dic (vacaciones de Javier, 8 días) · 25 dic · 1 ene.

Días hábiles disponibles 9 nov–30 dic: **27**. El plan completo necesita 39; el recortado, **21** → 6 días de reserva.

## Recortes (días a 8h)
| Tarea | Antes | Ahora | Detalle |
|---|---|---|---|
| B3 widgets restante | 13 | 4 | Se difieren Misceláneos, Videos, Carreras/facultades y Acordeones/Tabs (~7 d); sin modo oscuro (~2 d) |
| B4 testing widgets | 4 | 2 | 9 BU × solo modo claro |
| B5 manifest | 3 | 2 | Solo los widgets que quedan |
| B6 builder | 3 | 3 | Núcleo |
| B7 login/roles | 1 | 0 | Roles nativos de WP, sin `landing_client` |
| B8 IA crea borrador | 3 | 3 | Núcleo |
| B9 wizard | 2 | 2 | Núcleo |
| B10 aprobación + historial | 2 | 0 | El Dev revisa el borrador en WP |
| B11 acceso Dev (EMCP) | 1 | 1 | Núcleo |
| B12 IA casos borde | 2 | 0 | 2027 |
| B13 prueba final | 5 | 4 | 9 BU, solo modo claro |
| **Total** | **39** | **21** | |

## Fechas a 8h/día
Track A (paralelo, **replanteado el 10 nov: ya no hay multisitio**): el dev es un solo WP con CPT `landing` y taxonomía `unidad_negocio` (9 términos, uno por BU de `design.md`), como `landings.usil.edu.pe`.
- A1 (spike multisitio): **hecho 9–10 nov**. Resultado: el multisitio chocaba con las URLs de las LP (`/pregrado/` lo atendía el subsitio) y con plugins de licencia multisitio; se descartó.
- A2 (antes red de 9 subsitios): **reemplazado**. Hecho 10 nov: subsitios borrados, `wp-config.php` y `.htaccess` de WP normal, plugins reactivados, 9 términos de BU, snippet global de `design.md` (`docs/wpcode/design-md-global.php`, solo LP con widgets v3), verificado en posgrado. Queda ~1 día (estimación): probar pregrado y otra BU, y pasar la tarea programada de widgets `hk_*` a v3. Ya no ocupa 16–18 nov.
B3 9, 10, 13, 16 nov · B4 17–18 nov · B5 19–20 nov · B6 23–25 nov · B8 26, 27, 30 nov · B9 1–2 dic · B11 3 dic · B13 4, 7, 10, 11 dic · **fin 11 dic** · reserva 22–30 dic (6 d) · Marcha Blanca 12–26 dic.

La reserva se puede usar para reponer, en orden: B12 (2 d), B10 simplificada (2 d), B7 (1 d).

## Fechas a 4h/día (no llega a fin de año)
42 días: B3 9–20 nov · B4 23–26 nov · B5 27 nov–2 dic · B6 3 dic–22 dic · B8 23–31 dic · B9 4–7 ene · B11 8, 11 ene · B13 12–21 ene · Marcha Blanca 22 ene–5 feb.

## Queda para 2027
Modo oscuro · 4 familias de widgets (Misceláneos, Videos, Carreras/facultades, Acordeones/Tabs) · rol `landing_client`, Supervisor e historial · pantalla de aprobación · IA en casos borde.

## Supuestos
- Los ahorros de B3 son heurística, sin estimación confirmada por familia.
- Track A ya no depende de Infra/DevOps ni de SiteGround para multisitio: se eliminaron los 6 dominios propios (DNS + SSL) y la red de 9 subsitios. Las LP viven bajo un solo host, con la BU en la taxonomía y en la URL.
- Licencias de Elementor Pro y EMCP en 9 subsitios: ya no aplica (un solo WP).
- Las LP existentes (102 publicadas y 7 borradores) se quedan como están; no usan widgets v3, y el snippet de `design.md` solo corre en LP con widgets v3 y una BU asignada.
- Pendiente de Track A, sin fecha: el `design.md` de las 9 BU en la tarea programada y en la tarea del Dev; el pase a producción es sobre el WP actual de `landings.usil.edu.pe`, sin cambio de URLs.
