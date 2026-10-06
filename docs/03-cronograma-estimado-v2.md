# Cronograma Estimado v2 — WordPress + Elementor + EMCP

> Segunda versión del cronograma. La v1 (`03-cronograma-estimado.md`, flujo Astro + ACF + pipeline S3/CloudFront, 72 días hábiles) **no se borra** — queda intacta como registro histórico. Esta versión recalcula el camino crítico para el flujo descrito en `docs/artifacts/del-prompt-a-landing-v2.md`: WordPress + Elementor renderiza la landing (sin Astro-rendering), widgets v3 nativos de Elementor, `design.md` ya completo para las 9 BU, y topología Multisitio con mapeo de dominio.
>
> **Revisión 1 (06/10/2026):** la primera pasada de esta v2 asumía "landing mínima" — 7 familias de widgets, 1 variante cada una, 21 días. Al revisar el inventario real del plugin legacy (`wp-plugin/usil-elementor-widgets/widgets/`) se confirmó que son **42 archivos PHP en 13 familias**, y se decidió portar **todo** el legado, sin recortar alcance.
>
> **Revisión 2 (06/10/2026, el mismo día):** la Revisión 1 seguía mal planteada — trataba cada variante como si se construyera desde cero (3 días la primera, 1 día cada extra), cuando en realidad **el legacy ya es un widget Elementor completo y en producción** (`register_controls()` + `render()` ya escritos, probados, con repeaters e imágenes). Lo que de verdad falta para que sea "V3" es: tokenizar color y tipografía (cambiar clases Tailwind fijas y hex de Elementor por `var(--bu-color-*)`/`.dsmd-{role}`), consolidar las variantes de cada familia en 1 clase con un control `variant`, y agregar modo oscuro real (el legacy no tiene dark en ninguna familia — se confirmó con el usuario que sí se construye dark real para las 13 familias, no se difiere). Eso dio un B3 de 45 días, no 68.
>
> **Revisión 3 (06/10/2026, el mismo día):** 4 de las 13 familias (`2-bloque-intro`, `5-save-the-date`, `6-cards-items`, `7-bloque-ponentes-testimonios`) **ya tienen** este trabajo hecho en Astro — `theme.ts` con tabla `variant × mode` real, tipada, visible en el Visor. El hallazgo clave: el modo oscuro ahí no es diseño nuevo, es una segunda fila de la misma tabla que reasigna los mismos 5 roles `bu-*` — la decisión ya está tomada y portar esa tabla a PHP es mucho más rápido que decidirla de cero. 2 de esas 4 (`cards-items`, `ponentes-testimonios`) tienen además una prueba con tipografía vía roles `dsmd-*`. Las otras 9 familias siguen sin este trabajo, igual que en la Revisión 2. Resultado: **B3 = 37 días**, Track B = **91 días hábiles a 4h/día** (48 a 8h/día) — ver el desglose por familia más abajo.
>
> Hay una versión a **8 horas/día** (ver el [artifact interactivo](https://claude.ai/code/artifact/b39b318b-f05f-4337-8832-2f6c88c1c941), con toggle 4h/8h) que comprime el mismo trabajo a **48 días hábiles**.

## El dato principal sigue siendo la duración, no fechas

Igual que en v1, hay **dos tracks que corren en paralelo**:

- **Track A — Infra/Topología**: spike + puesta en marcha de la red multisitio con mapeo de dominio. Corre aparte, no bloquea el trabajo de widgets/IA.
- **Track B — camino crítico**: todo el resto (tokens, widgets v3, builder, IA, wizard, Dev). Es el track que de verdad determina cuánto dura el proyecto.

Track A (10 días) es mucho más corto que Track B (91 días) y no lo necesita hasta la tarea del Builder (B6, ver tabla) — igual que en v1 el Track Diseño no extendía el camino crítico. **El número que manda es el de Track B: 91 días hábiles de trabajo a 4h/día** (48 a 8h/día).

## Qué cambió respecto a v1 (72 días hábiles)

- **El Track Diseño de v1 (12 días, construir los 9 `design.md`) ya está completo** — no es trabajo pendiente. Los 9 archivos (`pregrado`, `pregrado-ejecutivo`, `instituto-de-emprendedores`, `posgrado`, `csir`, `siu`, `coloring-dreams`, `usil-paraguay`, `usil-corporativo`) ya existen en `src/data/design-md/`. Esto no resta días del camino crítico de v1 (ese track ya corría en paralelo sin bloquear), pero sí cambia qué hace falta ahora: ya no es "escribir los `design.md`", es "compilarlos a Kit de Elementor" (tarea B1 nueva).
- **Se elimina el pipeline de build/deploy para landings** (antes "Fase 3.3" y "Fase 3.4" de v1, ~8 días entre ambas): GitHub Actions → build Astro → S3 + CloudFront. WordPress + Elementor sirve la página directo, sin rebuild — no hay pipeline que armar.
- **Se elimina "Testing (WP)" ya estaba eliminado en v1** y se reemplaza el viejo "WP: CPT + ACF" + "WP: Flexible Content de ACF" (5 + 4 = 9 días en v1) por el **Builder + abilities** (`usil/apply-spec`, `usil/regenerate-section`) que escribe `_elementor_data` directo — tarea B6, 6 días. Es más simple porque ya se conoce, de un spike real, la forma exacta que debe tener el árbol de Elementor (container `content_width:full` + `flex_direction:column`, widgets como hijos directos, template `elementor_canvas`).
- **Se agrega Multisitio con mapeo de dominio** (Track A, 10 días) — no existía en v1, que asumía un sitio único con BU como taxonomía. El hallazgo de que 6 de las 9 BU necesitan dominio propio (no solo `instituto-de-emprendedores`) se descubrió recién en esta pasada — ver `del-prompt-a-landing-v2.md` §07.
- **Los widgets pasan de "Astro, 12 widgets" a "v3 nativos de Elementor" — y se porta TODO el legado, no un recorte**: la primera pasada de esta v2 había asumido 7 familias ("landing mínima", 1 variante cada una, 21 días), diferiendo `carreras-facultades`, `acordeones-tabs` y `misceláneos`. Al contar el plugin legacy real son **13 familias y 42 variantes** (ej. `cards-items` sola tiene 9) — se decidió portar todas, sin recorte de alcance.
- **B3 se recalculó tres veces el mismo día.** La primera corrección (68 días) trataba cada variante como si se construyera desde cero. Al revisar el código real (`cards-items-v8-5.php`) se confirmó que el legacy **ya es** un widget Elementor completo y en producción — lo que falta es tokenizar color/tipografía (hoy fijos, vía Tailwind `brand-dark` y hex de Elementor) y consolidar las variantes de cada familia en 1 clase con control `variant`. La única pieza que en principio era diseño nuevo es el modo oscuro (el legacy no tiene dark en ninguna familia; se confirmó con el usuario que se construye real para las 13). Esa segunda pasada dio B3 = 45 días. La tercera pasada encontró que **4 de las 13 familias ya resolvieron esto en Astro** (`src/components/widgets/{2-bloque-intro,5-save-the-date,6-cards-items,7-bloque-ponentes-testimonios}/theme.ts`): modo oscuro ahí no es diseño nuevo, es la misma tabla de 5 roles `bu-*` reasignada — la decisión ya está tomada, tipada y visible en el Visor; portarla a PHP es mucho más rápido que decidirla de cero. Resultado: **B3 = 37 días** (tabla de desglose más abajo), Track B total = 21→68→45→**91 días hábiles**. Cada widget sigue siendo PHP real de Elementor con control `variant`+`mode`, no un componente Astro.
- **Se agrega una tarea explícita de mockups visuales no funcionales** (B2, 2 días) — ya hay avance real: un prototipo de 5 pantallas del wizard IA + una página de demo con 7 widgets, publicados en el WP de desarrollo, usados para iterar la UX antes de construir el wizard real.
- **Se agrega el Flujo Dev con Claude Code + EMCP** (B11, 2 días) como tarea concreta — ya no es solo "QA responsive sobre Astro", es configurar el acceso MCP + el skill/prompt que acota al Dev a los widgets v3 y las abilities `usil/*`.
- **EMCP se evaluó también como herramienta de autoría de widgets, no solo de QA — se descartó para esa parte**: EMCP introspecciona y manipula widgets que *ya existen* como clase PHP registrada (`get-widget-schema`, `add-free-widget`), no genera código PHP nuevo. Construir/tokenizar cada widget v3 sigue siendo desarrollo normal. Donde sí puede ayudar es como loop de verificación durante B3/B4 (insertar el widget recién escrito en una página de prueba y ver el resultado contra las 9 BU sin abrir el editor a mano) — no cuantificado en los días de abajo.

## Ya completado (no cambia respecto a v1, se mantiene el registro histórico)

Ver la tabla "Ya completado" de `03-cronograma-estimado.md` (v1) — sin cambios. Se agrega una fila nueva:

| Tarea | Responsable | Estado | Fecha |
|---|---|---|---|
| Spike EMCP contra WP de desarrollo (SiteGround): mockup del wizard IA + página de demo con 7 widgets USIL | Javier Madrid | ✅ Completado | 05–06/10/2026 |
| Creación de los 9 `design.md` completos (las 6 BU que faltaban: `csir`, `coloring-dreams`, `posgrado`, `siu`, `usil-corporativo`, `usil-paraguay`) | Javier Madrid | ✅ Completado | 05/10/2026 |

## Track A — Infra/Topología (paralelo, no extiende el camino crítico)

| # | Tarea | Duración |
|---|---|---|
| A1 | Spike multisitio + mapeo de dominio + EMCP por subsitio (desechable) — valida licencias, soporte de SiteGround, y que EMCP conecta a un subsitio vía OAuth | 5 días |
| A2 | Red multisitio real: 9 subsitios (3 por path bajo `landings.usil.edu.pe`, 6 con dominio propio mapeado), roles por subsitio, import de Kit por BU — **sin migración de landings viejas** | 5 días |
| | **Total Track A** | **10 días hábiles** |

## Track B — Camino crítico

| # | Tarea | Duración |
|---|---|---|
| B1 | Compilador `design.md` → `bu-tokens.css` + Kit JSON por BU (los 9 `design.md` ya están completos, falta el compilador que los convierte en Kit de Elementor) | 3 días |
| B2 | Mockups visuales (wizard IA + preview) — pulido iterativo del prototipo ya construido | 2 días |
| B3 | Widgets v3 — **todo el legado**: 13 familias / 42 variantes, tokenizadas (color + tipografía por BU) y consolidadas (1 clase + control `variant`), con modo oscuro real — 4 familias reusan el `theme.ts` ya resuelto en Astro (ver tabla de desglose abajo) | 37 días |
| B4 | Testing — Widgets v3 × 9 BU × 2 modos (verificar color/tipografía correctos vía el Kit de cada subsitio, sobre las 42 variantes en light y dark) | 8 días |
| B5 | Manifest de catálogo (JSON de los 42 widgets/variantes v3, incl. metadata de modo — insumo de la IA y del validador de specs) | 5 días |
| B6 | Builder + abilities (`usil/apply-spec`, `usil/regenerate-section`) → escriben `_elementor_data` siguiendo las reglas confirmadas en el spike | 6 días |
| B7 | IA — Fase 2.1: login/roles nativos de WP (Application Passwords o JWT, rol `landing_client`) | 2 días |
| B8 | IA — Fase 2.2: plugin IA + motor intercambiable (Gemini dev / Bedrock Haiku 4.5 prod) + creación directa del borrador vía `usil/apply-spec` | 6 días |
| B9 | IA — Fase 3.1: UI wizard en wp-admin (el mockup de B2 ya resolvió buena parte del diseño visual, baja el riesgo de esta tarea) | 3 días |
| B10 | IA — Fase 3.2: UI aprobación (Supervisor) + vistas de historial | 3 días |
| B11 | Flujo Dev — Claude Code + EMCP: configurar acceso MCP acotado (solo tools necesarias, destructivas off) + skill/prompt que restringe al Dev a widgets v3 + abilities `usil/*` | 2 días |
| B12 | IA — Fase 4: mejorar la IA para casos edge | 4 días |
| B13 | Testing final — Widgets + IA + Multisitio (QA cruzando las 9 BU/dominios × 2 modos, sobre las 42 variantes) | 10 días |
| | **Total Track B (camino crítico)** | **91 días hábiles** |

### B3 en detalle — 42 variantes del plugin legacy, por familia

El legacy ya es Elementor funcionando (controles + render ya escritos y probados); no se reconstruye desde cero. El trabajo real por familia es tokenizar color/tipografía + consolidar variantes en 1 clase con control `variant`, más diseñar/construir modo oscuro real donde todavía no existe. **4 familias ya tienen esto resuelto en Astro** (`theme.ts` con tabla `variant × mode` real — el modo oscuro ahí es solo una reasignación de los mismos 5 roles `bu-*`, no diseño nuevo) — para esas, el costo es portar esa tabla ya decidida a PHP, no decidirla. Las otras 9 no tienen este antecedente y siguen el modelo completo. Heurística, **no confirmada ítem por ítem** — ver Supuestos y riesgos.

| Familia | Variantes legacy | ¿Ya resuelto en Astro? | Días estimados |
|---|---|---|---|
| Intro | 3 | ✅ `theme.ts` | 1.5 |
| Cards | 9 | ✅ `theme.ts` + prueba `dsmd-*` | 2.5 |
| Ponentes / Testimonios | 3 | ✅ `theme.ts` + prueba `dsmd-*` | 2 |
| Save the date | 1 | ✅ `theme.ts` | 1 |
| Header / Hero | 4 | — | 4 |
| Formulario (HubSpot) | 1 | — | 2.5 |
| Footer | 3 | — | 3 |
| Acordeones / Tabs | 2 | — | 3 |
| Carreras y facultades | 1 | — | 2.5 |
| Contenido + imagen | 3 | — | 3 |
| Videos | 4 | — | 4 |
| Misceláneos | 5 | — | 5 |
| Gracias (thank you) | 3 | — | 2.5 |
| **Total** | **42** | **4 de 13 ya resueltas** | **37** |

## Totales

- **Track A: 10 días hábiles** (paralelo — no se suma al camino crítico).
- **Track B (camino crítico): 91 días hábiles de trabajo a 4h/día** (48 días a 8h/día, ver artifact).
- **72 (v1) → 66 (v2 rev.1, alcance recortado) → 119 (v2 rev.1 corregido por alcance, modelo "desde cero") → 99 (v2 rev.2, modelo real tokenizar/consolidar+dark) → 91 días hábiles (v2 rev.3, reusando el `theme.ts` ya resuelto en 4 familias)**. Sigue siendo más largo que v1 — el ahorro del pipeline eliminado (~8 días) y el multisitio en paralelo no compensan portar los 42 widgets reales con dark real — pero cada revisión del mismo día lo ajustó más cerca de lo que el trabajo real requiere, en vez de reconstruir desde cero algo que ya existe.
- Igual que en v1, se mantendría el período de **Marcha Blanca** (tiempo de calendario, no de desarrollo) después de Track B — en esta revisión, usando el 06/10/2026 como arranque de ejemplo, cae ~20 feb al 06 mar 2027 a 4h/día (11 dic al 25 dic 2026 a 8h/día); sigue siendo un ejemplo, no un compromiso de fecha.

## Supuestos y riesgos (mismo espíritu que v1 — estimaciones no confirmadas ítem por ítem)

- **B3 (37 días, 42 variantes)** sigue siendo la fila más incierta — la heurística es una aproximación; `cards-items` (9 variantes, repeaters de imágenes) probablemente pesa más, y variantes casi idénticas entre sí (ej. dos versiones de footer con un campo de diferencia) probablemente pesan menos. Para las 9 familias sin `theme.ts` previo, la parte de dark (diseño genuinamente nuevo) no tiene precedente real para calibrarla todavía.
- **A2 (red multisitio con dominios reales)** depende de Infraestructura/DevOps para DNS + SSL de los 6 dominios propios, y de confirmar que SiteGround soporta el mapeo de dominio en multisitio sin fricción — soft estimate, mismo rol que tenía la vieja "Fase 3.3" de v1.
- **El loop EMCP como QA durante B3/B4** (escribir el widget → insertarlo vía EMCP en una página de prueba → verificar contra las 9 BU sin abrir el editor Elementor a mano) podría recortar algo de B3/B4, pero no está cuantificado — los 37+8 días de la tabla no asumen ese ahorro.
- **Licencias de Elementor Pro y EMCP en escenario multisitio** no están confirmadas — si alguna no cubre los 9 subsitios con el tier actual, puede sumar costo pero no necesariamente días (es una gestión administrativa, no de desarrollo).
- **Multisitio no duplica el trabajo de widgets.** En WP Multisitio el código de los plugins vive en un solo lugar (`wp-content/plugins/`), compartido por toda la red — no hay "un WP principal" con privilegios de código distintos a los sub-WP. Los widgets v3 se construyen una sola vez (B3) y se activan a nivel de red (network-activate desde Network Admin), quedando disponibles automáticamente en los 9 subsitios — sin instalar ni duplicar nada por sitio. Lo que sí es por-subsitio es el Kit de Elementor (colores/tipografía, ya cubierto en A2) y las páginas/`_elementor_data` de cada uno — eso es dato, no código.
- **B6 (Builder, 6 días)** asume que las reglas de `_elementor_data` ya confirmadas en el spike (container único, `content_width:full`, `flex_direction:column`, `elementor_canvas`) se sostienen igual en el entorno de producción multisitio — no validado todavía fuera del spike single-site.
- Estimaciones no confirmadas ítem por ítem — se muestran para revisión y ajuste, igual que en v1.
