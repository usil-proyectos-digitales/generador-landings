# Cronograma Estimado — Generador de Landings + IA

> Actualización del Gantt original (`Generador LPs + IA [Vibe Coding]`) a la luz del enfoque `design.md` adoptado y del diseño detallado de la fase de IA (`AI-LANDING-FLOW.md`). Todo el trabajo —tanto de Javier como del área de Diseño— se calcula a razón de **4 horas/día**.
>
> **Fecha de referencia**: 02/09/2026. **Arranque tentativo usado como ejemplo**: 14/09/2026 (ver "Proyección tentativa de fechas" más abajo — no es un compromiso, es solo una referencia de cálculo).

## El dato principal es la duración, no un rango de fechas

El cronograma tiene **dos tracks que corren en paralelo**, no uno solo:

- **Track Diseño** — construir los 9 `design.md` (definición + archivos). Corre aparte, a cargo del área de Diseño.
- **Track Javier** — todo el resto: widgets, WP e IA. Es el **camino crítico** del proyecto (el que de verdad determina cuánto dura todo).

Como el track de Diseño (12 días) es más corto que la ventana en la que Javier lo necesita (llega alrededor del día 12, y Javier no lo necesita hasta bien entrada la tarea de construir los 8 bloques nuevos), **el track de Diseño no extiende la duración total** — el número que manda es el de Javier.

**Duración total del camino crítico: 72 días hábiles de trabajo a 4h/día.** Las fechas de calendario son una proyección tentativa (ver más abajo), útil como ejemplo, pero no el dato que lidera este documento.

## Qué cambió respecto a la iteración anterior

- **Ya no son 6 BU, son las 9 BU completas** — los 3 `design.md` que Javier armó como prueba inicial también se rehacen: los nuevos son más detallados y los define el **área de Diseño** desde su expertise (no se nombra a la persona en este documento, solo "área de Diseño").
- **El trabajo de Diseño corre en paralelo, no bloquea el inicio de Javier.** Mientras Diseño investiga y arma los 9 `design.md`, Javier sigue con sus propios `design.md` de prueba: reconstruye directo los 4 widgets existentes y sigue construyendo bloques nuevos. Cuando Diseño entrega los `design.md` oficiales, hay un **swap de 1 día** para que los componentes lean los archivos oficiales en lugar de los de prueba.
- **Se elimina la tarea "Definir patrón de widget con `design.md`" (2 días)** — ya no hace falta como paso aparte: Javier ya tiene avance usando sus `design.md` de prueba, y el patrón real de tipografía/roles lo termina definiendo Diseño.
- **Se elimina la tarea "Testing (WP)" (3 días)** que seguía a "WP: Flexible Content" — venía del concepto viejo de probar versiones PHP de los widgets ("Rigid Widgets"), que ya no existe: los widgets son Astro, no PHP. Después del Flexible Content de ACF se pasa directo a IA Fase 1.
- **Corrección de un error de suma**: la iteración anterior de este documento decía "86 días hábiles" en Totales, pero sumando las duraciones reales de cada fila daba 71 — quedó desactualizado de un recálculo previo y nunca se corrigió. Con los cambios de esta pasada (menos 2 días de "definir patrón", menos 3 de "Testing WP", más 1 de swap), el total correcto es **67 días hábiles**.
- **"[Apoyo] Pase a prod Proyecto Cursos Cortos"** ya se completó — se mantiene fuera del cronograma.
- **Javier tiene dos períodos de vacaciones**: 28/09–04/10 (fijo) y una segunda tentativa de 8 días, 14/12–21/12. Ambos solo aplican al track de Javier, no al de Diseño (Diseño sigue trabajando esas semanas).
- **Se agrega la tarea de setup del pipeline de deploy (GitHub Actions → S3 + CloudFront), como "IA — Fase 3.3"**, entre "Fase 3.2 — UI aprobación" y "Fase 3.4 — pipeline de preview on-demand" (la antigua Fase 3.3, renumerada). Va ahí y no antes porque para entonces WP ya está funcionando (CPT+ACF, Flexible Content) y el plugin de IA ya puede crear entradas reales — el primer deploy real prueba el flujo completo (WP → build de Astro → S3 → CloudFront) con contenido real, no una cáscara vacía; y porque le da a Infraestructura más tiempo de plomo para dejar el AWS listo. Investigando el repo se confirmó que **nada de esto existe hoy** — no hay `.github/workflows/`, `astro.config.mjs` no tiene integración AWS, no hay scripts de deploy ni credenciales en `.env`. La afirmación de `AI-LANDING-FLOW.md` de que "el build-on-publish ya existe" era falsa — se corrigió ese documento también. La configuración de AWS (bucket, CloudFront, credenciales) depende de coordinar con el área de Infraestructura; Javier arma el workflow de GitHub Actions sobre esa base.
- **Navidad (25/12) y Año Nuevo (01/01) se excluyen explícitamente del conteo de días hábiles** — a diferencia del resto de feriados peruanos (que quedan como riesgo no modelado). Ambos caen viernes, así que cada uno corre el camino crítico ~1 día.

## Ya completado (registro histórico, sin cambios)

| Tarea | Responsable | Estado | Fechas originales |
|---|---|---|---|
| Diseño — Definición de colores | Laura Leon Quispe | ✅ Completado | 14/07 – 20/07/2026 |
| Diseño — Definición de Tipografía | Laura Leon Quispe | ✅ Completado | 16/07 – 22/07/2026 |
| Desarrollo HTMLs V1 → V2 (primera tanda, 4 widgets `bu-*`) | Javier Madrid | ✅ Completado — **a reconstruir con `design.md`** | 21/07 – 04/08/2026 |
| [Apoyo] Proyecto de Cursos Cortos | Javier Madrid | ✅ Completado — fuera del cronograma pendiente | 05/08 – 20/08/2026 |
| Prueba de `design.md` (3 BU vía MCP Figma) | Javier Madrid | ✅ Completado — **se descarta, se rehace más detallado** | ~28/08/2026 |

**Nota sobre las duraciones**: todos los "días" de las tablas de abajo son **días hábiles** (lunes a viernes) a 4h/día — sábados, domingos y las dos semanas de vacaciones de Javier ya están excluidos del conteo de su track (no del de Diseño, que no tiene esas vacaciones).

## Track Diseño (paralelo — no extiende el camino crítico)

| # | Tarea | Responsable | Duración |
|---|---|---|---|
| D1 | Investigación / planificación de los 9 `design.md` (criterio de tipografía y roles por BU) | Área de Diseño | 3 días |
| D2 | Desarrollo de los 9 `design.md` (con Claude Code leyendo Figma, una vez el criterio está definido) | Área de Diseño | 9 días |
| | **Total Track Diseño** | | **12 días hábiles** |

## Track Javier (camino crítico del proyecto)

| # | Tarea | Duración |
|---|---|---|
| 1 | Reconstruir los 4 widgets existentes (`2-bloque-intro`, `5-save-the-date`, `6-cards-items`, `7-bloque-ponentes-testimonios`) con los `design.md` de prueba | 4 días |
| 2 | Construir los 8 bloques V1→V2 restantes con `design.md` | **21 días** (20 de construcción + 1 día de swap a los `design.md` oficiales, una vez Diseño entrega — cae dentro de esta tarea, alrededor del día 12 del calendario paralelo) |
| 3 | Testing — Widgets (12 widgets × 9 BU) | 3 días |
| 4 | WP: CPT + ACF (+ campos custom de historial: `requested_by`, `client_approved_at`, `assigned_dev`, `published_by`, `published_at`) | 5 días |
| 5 | WP: Flexible Content de ACF por widget | 4 días |
| 6 | IA — **Fase 1**: enseñar a la IA qué widgets usar (mapeo a `acf-schema.json`) | 4 días |
| 7 | IA — **Fase 2.1**: conectar la IA con WP — login/roles nativos (Application Passwords o JWT, rol `landing_client`, Supervisor/Administrador) | 2 días |
| 8 | IA — **Fase 2.2**: conectar la IA con WP — plugin con motor de IA intercambiable (Gemini dev / AWS Bedrock-Claude Haiku 4.5 prod) + mapeo a JSON/ACF + creación directa del borrador (`wp_insert_post`) | 5 días |
| 9 | IA — **Fase 3.1**: UI en admin WP — chat/wizard (Cliente) | 3 días |
| 10 | IA — **Fase 3.2**: UI en admin WP — aprobación (Supervisor) + vistas de historial | 3 días |
| 11 | IA — **Fase 3.3**: setup del pipeline de deploy — GitHub Actions → build Astro → S3 + CloudFront (coordinado con el área de Infraestructura, que provee el AWS listo para usar) | 5 días |
| 12 | IA — **Fase 3.4**: pipeline de preview on-demand (GitHub Actions → `previews/` en S3 + CloudFront, sobre el pipeline base ya armado en la Fase 3.3) | 3 días |
| 13 | IA — **Fase 4**: mejorar la IA para casos edge | 4 días |
| 14 | Testing — Widgets + IA | 6 días |
| | **Total Track Javier (camino crítico)** | **72 días hábiles** |

### Detalle de las fases de IA (#6 a #13)

- **Fase 1 — Enseñar a la IA qué widgets usar**: mapear el input del cliente (campos obligatorios + texto libre + documento adjunto, si lo hubo) al catálogo real de widgets (`registry.ts`) y al esquema de bloques (`acf-schema.json`) — que la IA elija widget + variante + props tipadas, sin inventar campos fuera de ese esquema.
- **Fase 2.1 — Login/roles nativos de WP**: configurar el mecanismo de autenticación (Application Passwords o un plugin JWT) para que el plugin de IA entre a WordPress con el usuario logueado, y crear el rol limitado `landing_client` (Cliente) además de confirmar el mapeo de las funciones Supervisor/Administrador sobre el rol existente.
- **Fase 2.2 — Plugin: IA + ACF + borrador**: el plugin PHP llama al motor de IA (Gemini en dev, AWS Bedrock/Claude Haiku 4.5 en prod) con el input ya estructurado, traduce la respuesta al JSON de bloques (`hero`/`cards`/`form`/`footer`) y crea directo la entrada del CPT `landings` en estado Borrador (`wp_insert_post`) — sin salir de la misma instalación de WordPress.
- **Fase 3.1 — UI chat/wizard (Cliente)**: la pantalla dentro de WP donde Marketing completa el método híbrido (campos + texto libre + documento adjunto) y ve el "Thinking UI" (leyendo contenido → eligiendo estructura → aplicando estilo de marca → armando el boceto) mientras la IA arma el preview.
- **Fase 3.2 — UI aprobación (Supervisor) + historial**: pantalla para que el Supervisor apruebe o rechace con feedback cada solicitud antes de que pase a Desarrollo, más las vistas de historial: "Mis solicitudes" (Cliente, filtrado por `requested_by`) e historial de trabajo (Dev/Supervisor, filtrado por `assigned_dev`/`published_by`).
- **Fase 3.3 — Setup del pipeline de deploy**: nada de esto existe hoy (sin `.github/workflows/`, sin integración AWS, sin credenciales). El bucket S3 + CloudFront + credenciales los provee el área de Infraestructura (coordinado por Javier, presupuesto de su área); Javier arma el workflow de GitHub Actions y hace el primer deploy real de validación — ya con WP funcionando y contenido real, no solo el Visor/storybook.
- **Fase 3.4 — Pipeline de preview on-demand**: conectar el plugin con GitHub Actions para disparar, por cada preview solicitado, un build real de Astro con el contenido de la IA, subirlo a `previews/` en el bucket S3 y servirlo por CloudFront — mismo pipeline ya probado en la Fase 3.3, pero activado bajo demanda en vez de en cada publicación.
- **Fase 4 — Mejorar la IA para casos edge**: iterar sobre los casos donde la IA falla o da resultados pobres — prompts ambiguos que no alcanzan a definir un widget claro, mapeo incorrecto de widget/variante, contenido incompleto (falta CTA, oferta o título), documentos adjuntos con formato irregular (tablas y texto corrido mezclados), y manejo de errores/timeouts del motor de IA (Gemini/Bedrock) sin inventar contenido que falte — el fallback correcto es pedirle al usuario que lo complete, no rellenarlo solo.

## Totales

- **Track Diseño: 12 días hábiles** (paralelo — no se suma al camino crítico).
- **Track Javier (camino crítico): 72 días hábiles de trabajo a 4h/día.**
- **+ 15 días de calendario de Marcha Blanca** (monitoreo del sitio ya en producción — corre todos los días, feriados y fines de semana incluidos, no consume horas de desarrollo — se suma después de que termina el track de Javier).

## Proyección tentativa de fechas (referencia, no compromiso)

Calculado con `node` (saltando fines de semana; el track de Javier además descuenta sus dos vacaciones — 28/09–04/10 y la tentativa de 14/12–21/12 — más Navidad y Año Nuevo; el de Diseño no descuenta ninguna, porque no son suyas), usando el **14/09/2026** como ejemplo de arranque:

| Hito | Fecha tentativa |
|---|---|
| Arranque (ambos tracks) | lun 14/09/2026 |
| Fin Track Diseño (12 días hábiles) | mar 29/09/2026 |
| Fase 3.2 — UI aprobación + historial | mar 01/12 → jue 03/12/2026 |
| Fase 3.3 — Setup pipeline de deploy | vie 04/12 → jue 10/12/2026 |
| Fase 3.4 — pipeline de preview on-demand | vie 11/12 → mié 23/12/2026 |
| Fase 4 — casos edge | jue 24/12 → mié 30/12/2026 *(salta el viernes 25/12, Navidad)* |
| Fin Track Javier (72 días hábiles, camino crítico) — Testing — Widgets + IA | jue 31/12/2026 → vie 08/01/2027 *(salta el viernes 01/01, Año Nuevo)* |
| Marcha Blanca (15 días de calendario) | sáb 09/01/2027 → sáb 23/01/2027 |
| **Fin proyectado tentativo** | **sábado 23 de enero de 2027** |

Esto es un ejemplo de cálculo, no una fecha de compromiso — si el arranque real es otro, todo el bloque se desplaza igual mantiendo las mismas duraciones.

## Supuestos y riesgos

- **El paralelismo depende de que Diseño entregue a tiempo**: el swap de 1 día asume que los `design.md` oficiales están listos alrededor del día 12 del calendario paralelo (cuando Javier ya está construyendo los 8 bloques nuevos). Si Diseño se atrasa más allá de ese punto, el swap puede generar tiempo de espera que hoy no está modelado como riesgo aparte.
- **Marcha Blanca es tiempo de calendario, no de trabajo** — es el período de observación del sitio ya en producción, no una tarea de desarrollo a 4h/día. Por eso no descuenta findes ni feriados.
- **Navidad (25/12) y Año Nuevo (01/01) se excluyen explícitamente del conteo de días hábiles** (a diferencia del resto de feriados peruanos, ver el siguiente ítem) — ambos caen viernes, así que cada uno corre el camino crítico ~1 día. Con esto más la segunda vacación tentativa (14–21/12), ninguno de los dos feriados cae ya dentro de Marcha Blanca en esta proyección: Navidad cae sobre "Fase 4" y Año Nuevo sobre "Testing — Widgets + IA".
- **Otros feriados peruanos no considerados** en las fases de desarrollo (8 de octubre, 1 de noviembre, etc.) — si aplican como no laborables ahí, cada uno suma ~1 día hábil más al camino crítico.
- **La Fase 3.3 (setup del pipeline de deploy, 5 días) es el supuesto más blando de esta tabla**: Javier no tiene mapeados los tiempos reales del área de Infraestructura para dejar el bucket S3 + CloudFront + credenciales listos — los 5 días son un margen que Javier considera "más que suficiente", no una estimación confirmada por Infraestructura.
- **Tarea #2 del track Javier (8 bloques nuevos, 21 días)** es la estimación más incierta — se asumió ~2.5 días/bloque + 1 de swap; puede variar según la complejidad real de cada bloque (`13-bloque-footer` y `14-miscelaneos` probablemente más rápidos que `11-bloque-carreras-facultades` o `12-bloque-acordeones-tabs`).
- **Tarea #5 del track Javier (Flexible Content ACF, 4 días)** se reestimó dos veces a la baja (12→6→4) — si el trabajo real resulta aún más simple de lo pensado, ese margen puede absorber atrasos de la tarea #2.
- Estimaciones no confirmadas ítem por ítem — se muestran para revisión y ajuste.
