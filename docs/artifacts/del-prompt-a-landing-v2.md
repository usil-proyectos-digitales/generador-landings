# Del Prompt a Landing — v2 (WordPress + Elementor + EMCP)

> Segunda versión de este documento. La v1 (flujo Astro + ACF Flexible Content + pipeline S3/CloudFront) **no se borra** — queda en `del-prompt-a-landing.md` y en su artifact original de claude.ai (https://claude.ai/code/artifact/99f4bc57-6466-4f70-ab06-bdfbfb6a36b7), tal cual estaban. Este documento reemplaza ese flujo por el nuevo: WordPress + Elementor renderiza la landing directo, con [elementor-mcp (EMCP Tools)](https://github.com/msrbuilds/elementor-mcp) como puente entre el Dev y la página real. Ver también `AI-LANDING-FLOW.md` en la raíz del repo (pendiente de actualizar a esta versión) y el plan de arquitectura completo en `C:\Users\jmadrid\.claude\plans\necesito-que-analices-el-enchanted-stonebraker.md`.
>
> Versión en diapositivas de este mismo documento (deck interactivo, 14 slides): https://claude.ai/code/artifact/21232afa-794b-456f-93f1-73ac545de92c

Arquitectura E2E completa del generador de landings con IA: interfaces del cliente, procesamiento de IA, creación del borrador en WordPress (ahora como página Elementor real) y workflow técnico del Dev hasta el sitio publicado.

- **Alcance**: de la solicitud del cliente al sitio en producción.
- **Qué cambió respecto a v1**: se abandona el renderizado headless con Astro para las landings. WordPress + Elementor pasa a ser el motor de render; Astro se queda como laboratorio de diseño (Visor/UI-kit, compilador de `design.md` → tokens). Se elimina el pipeline de build/deploy (GitHub Actions → S3 → CloudFront) para landings — no hace falta: WP sirve la página sin rebuild. Se agrega topología Multisitio (1 subsitio por Unidad de Negocio) para que cada BU tenga su Kit de marca nativo en el editor de Elementor.

## 00 — Qué cambió y por qué (resumen ejecutivo)

| Punto | v1 (Astro headless) | v2 (WordPress + Elementor + EMCP) |
|---|---|---|
| Quién renderiza la landing publicada | Astro (`output: static`), build disparado por GitHub Actions | WordPress + Elementor Pro, directo — sin build |
| Preview del cliente | Build real de Astro en `previews/` (S3 + CloudFront) | Página Elementor real en Borrador — iframe al preview nativo de WP |
| Creación del contenido IA → WP | `wp_insert_post` + campos ACF Flexible Content | Abilities WP propias (`usil/apply-spec`) que escriben `_elementor_data` directo |
| Widgets | Componentes Astro (`src/components/widgets/`), tokens `bu-*`/`theme.ts` | Widgets PHP nativos de Elementor ("v3"), colores vía `design.md`/`.dsmd-*` — los widgets Astro y los PHP legacy (`wp-plugin/usil-elementor-widgets`) quedan solo de referencia |
| Marca por BU | Tokens CSS `bu-*` fijos + `theme.ts` por widget | `design.md` por BU (ya completo para las 9) → Kit nativo de Elementor por subsitio |
| Topología WP | Sitio único, BU = taxonomía | Multisitio subdirectorio: 1 subsitio por BU |
| Deploy/infra | GitHub Actions + S3 + CloudFront | Ninguno — WP publica directo. Se suma mapeo de dominio para las BU con dominio propio |
| Rol de este repo (Astro) | Sirve las landings en producción | Laboratorio de diseño: Visor/UI-kit, compilador `design.md` → `bu-tokens.css`/Kit JSON |

El motivo del cambio: las cuatro motivaciones que llevaron a evaluar `elementor-mcp` —que Dev/Marketing editen visualmente, reusar widgets PHP ya existentes, que la IA arme la página sola, y reducir infraestructura— solo se cumplen si WordPress con Elementor es quien de verdad renderiza la landing publicada. Mantener Astro como motor de render y agregar EMCP encima no las cumple ninguna.

**El flujo del cliente no cambia** (restricción explícita del proyecto): UI → preguntas clave → la IA decide BU + widgets → adjunta Word opcional → preview → aceptar → el Dev termina. Lo que cambia es *qué hay detrás* de "preview" y "borrador".

## 01 — Visión general y arquitectura del sistema

El problema de fondo es el mismo que en v1: hoy, construir una landing significa que un Dev traduzca a mano un pedido de Marketing a un widget, una variante y una paleta de colores. El sistema reparte ese trabajo en tres capas, cada una con un límite explícito de hasta dónde llega antes de pasarle la posta a la siguiente.

El cliente nunca publica nada directamente, y la IA tampoco. El resultado del lado del cliente sigue siendo siempre un **preview**; el resultado del lado de la IA/middleware sigue siendo siempre un **borrador** — ahora una página Elementor real, no una entrada ACF; el sitio en producción solo existe después de que un Dev humano lo revisa y publica.

**Alcance de arquitectura**: **WordPress + Elementor Pro es la decisión de backend *y* frontend** para las landings — ya no headless. El Visor/UI-kit de este repo (Astro) sigue existiendo, pero como herramienta de diseño interna, no como lo que sirve la landing al visitante final.

**Motor de marca**: el preview del cliente, el borrador que crea la IA y lo que el Dev termina se pintan todos con el mismo `design.md` por Unidad de Negocio (color, tipografía y roles) — hoy completo para las 9 BU. La diferencia con v1 es *cómo* llega esa marca al render: en vez de clases Tailwind (`bu-*`) resueltas en un componente Astro, el `design.md` se compila a un **Kit nativo de Elementor** por subsitio — el mismo mecanismo de "Global Colors/Fonts" que ya usa cualquier sitio Elementor, solo que generado automáticamente desde el `.md`, nunca editado a mano.

```
Cliente (UI + IA)              Middleware & WordPress                  Dev
[WordPress · Plugin PHP]  →    [WordPress · abilities PHP]       →    [Claude Code + EMCP]

Selecciona BU,                 Interpreta el input,                   Completa imágenes,
describe la landing,           llama a `usil/apply-spec`,             HubSpot ID, SEO,
revisa y aprueba                escribe _elementor_data                QA y publica —
un preview (página              en una página Elementor                WP sirve directo,
Elementor real)                 en Borrador                            sin rebuild
```

Las capas 1 y 2 siguen corriendo dentro del **mismo plugin PHP en WordPress** — la separación sigue siendo de responsabilidad, no de sistema técnico. El Dev en la capa 3 ya no trabaja sobre Astro + rebuild: trabaja con **Claude Code + EMCP** directo sobre la página Elementor real que la IA creó.

## 02 — Interfaces y User Journey del cliente

Esta sección **no cambia de fondo respecto a v1** — el wizard, el método de entrada híbrido y el Thinking UI son los mismos. Lo que cambia es qué hay detrás del Visor de Preview (2.4). Se resumen 2.0–2.3 y se detalla 2.4.

### 2.0 — Login

Sin cambios: el usuario entra con su propia cuenta de WordPress (login y roles nativos), lo que habilita su historial personal ("Mis solicitudes", ver §05).

### 2.1 — Selección de Unidad de Negocio

Sin cambios en la experiencia — grilla de 9 BU, cada una con su combinación real de color. Lo que cambia por debajo: elegir una BU ahora también determina **en qué subsitio de la red multisitio** se va a crear el borrador (ver §07), porque cada BU es un subsitio con su propio Kit de Elementor. El cliente no ve esa mecánica — para él sigue siendo "elegir mi unidad de negocio".

### 2.2 — Método de entrada híbrido

Sin cambios: campos obligatorios (objetivo, título/propuesta, oferta, CTA) + texto libre opcional + adjuntar Word/PDF. La IA sigue entregando al final una selección de widget + variante + props tipadas — ahora widgets v3 (§08), no componentes Astro.

### 2.3 — Procesamiento visual ("Thinking UI")

Sin cambios en los 4 pasos (leyendo → estructura → marca → boceto). Hay un **mockup visual no funcional ya construido** de esta pantalla — ver §06.

### 2.4 — Visor de Preview

| Componente | v1 | v2 |
|---|---|---|
| Qué es el preview | Build real de Astro, subido a `previews/` en S3, servido por CloudFront | **Página Elementor real**, creada en Borrador por la ability `usil/apply-spec`, mostrada en un iframe apuntando al preview nativo de WordPress (`?preview=true`) |
| Toggle Desktop/Mobile | Sobre el build de Astro | Mismo toggle, sobre el iframe de WP — ya validado en el mockup (§06): cambia el `max-width` del wrapper del iframe |
| Panel — Editar textos | Ajuste puntual sin volver al wizard | Igual, ahora actualiza el `_elementor_data` del widget vía ability (`usil/update-widget-text` o equivalente) |
| Panel — Regenerar sección | Solo un bloque puntual | Igual — ability `usil/regenerate-section`, reemplaza el widget correspondiente dentro del mismo `_elementor_data` |
| Panel — Modo claro/oscuro | Cada modo resuelve su propio color/tipografía en `design.md` | Sin cambio conceptual — el widget v3 tiene un control `mode` (`light`/`dark`) que resuelve contra el Kit del subsitio |
| Acción principal | Aprobar y enviar → dispara la Sección 03 | Sin cambio |

**Por qué esto es mejor que v1**: el preview ya es *exactamente* la página que el Dev va a terminar — no una reconstrucción. No hay "se ve distinto en el preview que en la página final" posible, porque es la misma entidad en todo momento.

## 03 — Procesamiento IA y creación de borrador en WordPress

### 1. El plugin IA interpreta el input

Sin cambios de ubicación: sigue corriendo como código PHP dentro de la misma instalación de WordPress en SiteGround.

### 2. Arma el `landing-spec.json`

Cambia la forma del artefacto intermedio. En v1 era un JSON por bloque ACF (`acf_fc_layout`). En v2 es una especificación más simple y agnóstica de Elementor:

```json
{
  "bu": "pregrado",
  "sections": [
    {
      "widget": "header-hero",
      "variant": "v1",
      "mode": "light",
      "props": {
        "title": "Admisión 2026 abierta",
        "subtitle": "Empieza en agosto con becas disponibles",
        "cta_text": "Postula ahora",
        "cta_url": "https://..."
      }
    }
  ]
}
```

Este spec se valida contra el **manifest del catálogo** (JSON generado desde los widgets v3, ver §08) — la IA no puede inventar un widget, variante o prop fuera de ese esquema.

### 3. Crea el borrador — ahora una página Elementor real

Acá está el cambio técnico central de v2. En vez de `wp_insert_post` + campos ACF, la ability `usil/apply-spec`:

1. Crea la página (`create-post`/`wp_insert_post` equivalente) en estado Borrador, con meta `usil_bu` (o, si se adoptó Multisitio, directamente en el subsitio correcto — ver §07).
2. Construye el árbol `_elementor_data`: **un container raíz** con `content_width: "full"` + `flex_direction: "column"`, y cada sección del spec como **widget hijo directo** — sin container envolvente por sección. Esta regla salió de un spike real contra el entorno de desarrollo (ver nota técnica abajo) y es obligatoria para que la página se vea a ancho completo.
3. Aplica el template `elementor_canvas` (`update-page-settings`) para que la página no herede el chrome del tema (header/toolbar) — un preview/landing limpio.

**Nota técnica (de un spike real, no teórico)**: se construyó un spike contra el WP de desarrollo (SiteGround) usando EMCP, con 7 widgets USIL legacy, para validar exactamente esta mecánica antes de escribirla en código. Dos hallazgos quedaron documentados como reglas obligatorias para `usil/apply-spec`:
- El parámetro `full_bleed` que algunas herramientas de EMCP documentan **no existe** en la tool que construye la página — hay que fijar `content_width: "full"` explícito en cada container, el default es `"boxed"`.
- Un container que envuelve un único widget sin `flex_direction: "column"` explícito se encoge al tamaño de su contenido (shrink-to-fit) en vez de ocupar el 100% del ancho, aunque ya sea `content_width: "full"`.

**Caso especial — campos de configuración**: igual que en v1, un widget de formulario necesita un `hubspot_form_id` real que la IA no puede inventar — queda vacío/pendiente, responsabilidad del Dev. El mismo spike encontró además que el widget de formulario legacy, si no se le fija `hubspot_form_id_source: "manual"` + el ID explícito, **no renderiza nada en absoluto** en el frontend (falla en silencio) — es la regla que el builder real debe aplicar siempre, nunca confiar en su default.

## 04 — Workflow operativo técnico del Desarrollador

Sigue siendo sobre la misma entidad en Borrador — sin handoff a otro sistema, ahora más literal que en v1: es la misma página Elementor de punta a punta, no una entrada ACF que después "se traduce" a una página Astro.

1. **Contenido — Revisión y curaduría**: igual que v1, sobre los textos ya cargados en los widgets v3.
2. **Recursos gráficos**: completar imágenes/iconografía — igual que v1, ahora vía controles de Media del widget Elementor en vez de un campo ACF.
3. **SEO técnico**: título SEO, meta descripción, slug — configurado directo en WordPress (sin cambio; Yoast/RankMath o el campo nativo, a definir en implementación).
4. **Open Graph / redes sociales**: sin cambio.
5. **QA responsive y preview frontend**: **ya no es "sobre Astro + Tailwind"** — es directo sobre la página Elementor, usando el editor visual de Elementor o **Claude Code + EMCP** (ver 4.6).
6. **Publicación — ya no dispara ningún build**: Borrador → Publicado en WordPress, y listo. WordPress sirve la página directo. **Se elimina por completo el paso de v1 que disparaba GitHub Actions → S3 → CloudFront** — no hay rebuild, no hay invalidación de caché de CDN propia del proyecto, no hay bucket que mantener para las landings.

### 4.6 — Dev con Claude Code + EMCP

El Dev de 4h/día usa Claude Code conectado al WP vía **elementor-mcp (EMCP Tools)** — un plugin WP que expone la página Elementor como herramientas MCP (`get-page-structure`, `update-element`, `update-container`, `get-widget-schema`, etc.). Reglas operativas confirmadas en el spike:

- EMCP introspecciona **cualquier widget registrado**, incluidos los widgets USIL (legacy o v3), por esquema en vivo (`get-widget-schema`) — no hace falta que estén en su catálogo curado para poder usarlos (`add-free-widget`/`build-page` aceptan el `widget_type` real).
- Un skill/prompt acotado restringe la sesión del Dev a los widgets v3 + las abilities `usil/*` — no herramientas destructivas, no widgets ajenos al catálogo.
- El agente conecta vía Bedrock en producción (`CLAUDE_CODE_USE_BEDROCK`), consistente con el motor de IA de producción (§06).

**EMCP no es solo el QA post-aprobación — es la herramienta técnica del Dev en todo el flujo, en cada punto donde hay que tocar la página Elementor sin pasar por la UI a mano:**

| Dónde | Qué hace EMCP ahí |
|---|---|
| **§3 — `usil/apply-spec` (creación del borrador)** | No es un sistema aparte de EMCP: la ability construye el `_elementor_data` llamando directo a las mismas tools MCP (`add-atomic-widget`/`add-block`, `update-container`, `update-page-settings`) que usa el Dev — la IA y el Dev hablan el mismo protocolo contra la misma página. |
| **§4 (este paso) — QA responsive post-preview** | El uso ya documentado: revisar/ajustar la página en Borrador antes de publicar. |
| **Cambios manuales en cualquier momento** | El Dev puede abrir una sesión de Claude Code + EMCP contra *cualquier* página existente — no solo las recién generadas por la IA — para un ajuste puntual, un fix, o retocar algo que el cliente pidió después de publicado. No depende de que exista un "preview pendiente de aprobación": es una herramienta de edición directa sobre WP, disponible siempre que el Dev la necesite. |
| **§07 — Kit de Elementor por subsitio (multisitio)** | `update-global-colors` / `update-global-typography` (+ `get-global-settings` para leer el estado actual) setean el Kit de cada subsitio a partir de su `design.md` — es EMCP, no un paso manual en el editor visual. |

### 4.7 — Las tres capas, resumen final

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| **Cliente** | Elige su BU, completa el wizard híbrido y revisa el preview (página Elementor real en iframe). | — (arranca el proceso) | Preview aprobado |
| **Plugin IA & WordPress** | Interpreta el input, resuelve marca vía `design.md`/Kit del subsitio, llama a `usil/apply-spec` (que internamente llama tools de **EMCP**) y crea la página Elementor en Borrador. | Preview aprobado | Página Elementor en Borrador, con widgets v3 generados |
| **Dev** | Completa imágenes, SEO, Open Graph, HubSpot ID, hace QA con Claude Code + **EMCP** y publica — y usa la misma vía **EMCP** para cambios manuales puntuales en cualquier momento, no solo en este paso. | Página en Borrador | Sitio publicado — WP sirve directo, sin build |

EMCP, entonces, no es una capa ni un paso del flujo del cliente — es la herramienta técnica (MCP) que atraviesa transversalmente la capa 2 (la IA construye con ella) y la capa 3 (el Dev opera con ella, en QA, en cambios manuales ad hoc, y en el Kit de Elementor por subsitio — ver detalle en §4.6).

## 05 — Roles, autenticación e historial de solicitudes

Sin cambios respecto a v1 — los cuatro roles (Cliente/`landing_client`, Supervisor, Dev, Administrador), el mecanismo de login (Application Passwords o JWT nativo de WP) y los campos de historial (`requested_by`, `client_approved_at`, `assigned_dev`, `published_by`/`published_at`) aplican igual. La única diferencia es *dónde* viven esos campos: antes post meta de una entrada del CPT `landings`, ahora post meta de una página Elementor normal — mismo mecanismo de WordPress, distinto tipo de contenido por debajo.

Si se adopta Multisitio (§07), estas consultas de historial pasan de ser locales a un sitio a ser cross-site (`switch_to_blog()` por subsitio) — detalle de implementación, no cambia el diseño de los campos.

## 06 — Mockups visuales (prototipo no funcional)

Pieza nueva de v2, sin equivalente en v1: antes de construir el wizard real, se armó un **prototipo HTML/CSS/JS autocontenido, sin backend**, para validar la experiencia visual con el equipo antes de escribir una sola línea de PHP del wizard definitivo. Publicado en el WP de desarrollo (no en producción):

- **Mockup del wizard IA**: https://proyectos.usil.digital/dev/landings-usil/mockup-wizard-ia/ — 5 pantallas clickeables (preguntas clave + adjuntar Word → Thinking UI animado → resultado con BU detectada → visor de preview con toggle Desktop/Mobile e iframe a la página de demo → confirmación). Pintado con los tokens reales de `design.md` de Pregrado.
- **Página de demo (la que el iframe del mockup muestra como "preview")**: https://proyectos.usil.digital/dev/landings-usil/demo-admision-2026-pregrado/ — 7 widgets USIL (legacy, usados solo para esta prueba visual) armados con la regla de container único `content_width:"full"` + `flex_direction:"column"` descrita en §03.

Nada de esto es funcional (no hay IA real, no hay wizard real) — es exclusivamente para iterar la UI/UX con feedback visual rápido antes de construir. Se sigue puliendo (ajustes de ancho, limpieza del template) a medida que se revisa con el equipo.

## 07 — Topología: WordPress Multisitio con mapeo de dominio

Pieza nueva de v2. En producción hoy, las landings viven en `landings.usil.edu.pe/<bu>/<slug>`, con la BU como taxonomía en un sitio único. v2 adopta **Multisitio en modo subdirectorio, 1 subsitio por BU** — con un matiz importante descubierto al revisar las 9 BU una por una: **no todas comparten dominio**.

| Grupo | BU | URL |
|---|---|---|
| Por path, bajo `landings.usil.edu.pe` | `pregrado`, `pregrado-ejecutivo`, `posgrado` | `landings.usil.edu.pe/<bu>/<slug>` — sin cambio respecto a hoy |
| Dominio propio, mapeado al mismo subsitio | `instituto-de-emprendedores`, `usil-paraguay`, `coloring-dreams`, `usil-corporativo`, `csir`, `siu` | su propio dominio (ej. `institutoemprendedores.pe/<slug>`) — el subsitio sigue siendo parte de la misma red multisitio, solo que WordPress lo sirve bajo un dominio distinto al de la red (mecanismo de **mapeo de dominio**, nativo de WP vía `sunrise.php` o un plugin probado — `Mercator`/`WP Multisite Domain Mapping`) |

**Por qué Multisitio y no solo CSS override sobre un sitio único**: un Kit nativo de Elementor por subsitio hace que el selector de colores del editor muestre la paleta *real* de esa BU (no una paleta genérica pisada por CSS) — encaja directo con la motivación de que Dev/Marketing editen visualmente sin pensar en qué variable CSS corresponde a qué color de marca.

**Sin migración**: a diferencia de lo que se había evaluado antes, este despliegue **no migra landings viejas** — es un sistema nuevo; las landings existentes se quedan donde están y se van reemplazando por uso natural a medida que se crean nuevas en el sistema v2, no por un proceso de migración de datos.

**Implicancias pendientes de validar (spike, no bloqueante para este documento)**:
- Mapeo de dominio real en SiteGround: agregar cada dominio propio como *parked/addon domain* apuntando al mismo hosting, más su propio certificado SSL — mecánica estándar de WP, pero no probada todavía en esta cuenta.
- Licencias de Elementor Pro y de EMCP en una red multisitio con 9 subsitios — sin confirmar aún si licencian por red completa o por sitio.
- Conexión de EMCP/Claude Code por subsitio — probablemente una conexión MCP por subsitio (9), soporte multisitio de EMCP sin confirmar formalmente todavía.

## 08 — Widgets v3

Pieza nueva de v2. Los widgets Astro ya construidos (`src/components/widgets/`) y los widgets PHP legacy (`wp-plugin/usil-elementor-widgets/`) **no se reusan tal cual**:

- Los widgets Astro están atados al mecanismo `bu-*`/`theme.ts`, pensado para un sitio renderizado por Astro — no aplica si WordPress+Elementor es quien renderiza.
- Los widgets PHP legacy usan colores hex hardcodeados (ej. `brand-dark`, `#002663`) — no son conscientes de BU; sirven solo de referencia de controles de Elementor, markup y traits (ej. `Carousel_Controls_Trait`).

**Widgets v3** = una familia nueva de widgets PHP nativos de Elementor, construida desde cero con estas reglas:
- Control `variant` (qué diseño) + `mode` (`light`/`dark`), igual al patrón que ya usan los componentes Astro.
- Colores y tipografía **siempre** vía `var(--bu-color-*)`/clases `.dsmd-{role}` — nunca un valor hex en el widget. El Kit del subsitio (§07), generado desde `design.md`, es quien resuelve esos colores en cada BU.
- Markup tomado como referencia del componente Astro equivalente (fidelidad visual ya validada ahí), portado a PHP + control de Elementor.

**Alcance: se porta todo el legado, no un subconjunto.** El plugin legacy (`wp-plugin/usil-elementor-widgets/widgets/`) tiene **42 archivos PHP en 13 familias** — no 7. Cada archivo es una variante visual existente de su familia (ej. `cards-items` sola tiene 9: la base, `v6-6/8/10/11/12` y `v8-1/3/5`). Decisión confirmada: las 42 variantes pasan a v3, cada una como opción del control `variant` dentro del widget Elementor de su familia — no se descarta ninguna por alcance mínimo.

**"Portar" no es reconstruir.** Se verificó leyendo el código real (`cards-items-v8-5.php`) que el legacy ya es un widget Elementor completo y en producción: `register_controls()` con repeaters/controles de color y tipografía, `render()` con el markup entero — ya probado. El trabajo real de V3 es:
- **Tokenizar** color y tipografía: hoy son clases Tailwind fijas (`text-brand-dark`, `font-montserrat`) y hex de Elementor (`'default' => '#002663'`) — se reemplazan por `var(--bu-color-*)`/`.dsmd-{role}`, resueltos por el Kit del subsitio.
- **Consolidar**: las variantes de una familia hoy son archivos PHP separados (`get_name()` distinto cada uno) — pasan a 1 clase con un control `variant` que elige qué `render()` correr.
- **Modo oscuro real**: el legacy no tiene dark en ninguna familia. Se confirmó con el usuario que V3 construye dark real para las 13 familias (no se difiere).

**4 de las 13 familias ya resolvieron esto en Astro — se reusa, no se rediseña.** `src/components/widgets/{2-bloque-intro,5-save-the-date,6-cards-items,7-bloque-ponentes-testimonios}/theme.ts` ya tiene una tabla `variant × mode` real, tipada y probada en el Visor. Hallazgo clave: ahí el modo oscuro **no es diseño nuevo** — es la misma tabla de 5 roles `bu-*` reasignada (ej. "section" pasa de `bg-bu-surface` a `bg-bu-primary`), sin CSS adicional. Portar esa tabla ya decidida a PHP es mucho más rápido que decidirla de cero para las otras 9 familias. 2 de esas 4 (`cards-items`, `ponentes-testimonios`) tienen además una prueba (`src/components/widgets-design-md-preview/`, no en producción) con tipografía vía roles `dsmd-*` en vez de clases fijas — confirma el mismo mecanismo para texto.

| Familia | Variantes legacy |
|---|---|
| Header / Hero | 4 |
| Intro | 3 |
| Cards | 9 |
| Ponentes / Testimonios | 3 |
| Save the date | 1 |
| Formulario (HubSpot) | 1 |
| Footer | 3 |
| Acordeones / Tabs | 2 |
| Carreras y facultades | 1 |
| Contenido + imagen | 3 |
| Videos | 4 |
| Misceláneos | 5 |
| Gracias (thank you) | 3 |
| **Total** | **42 variantes, 13 familias** |

La idea de "landing mínima" (7 familias, diferir el resto) queda descartada — fue un recorte de alcance que no se había validado contra el inventario real del legacy.

## 09 — Costos y presupuesto

Precios de lista pública — no son la factura real de la organización; confirmar con Infraestructura/DevOps el monto efectivamente facturado.

### 9.1 — Qué cambia respecto a v1

| Partida (v1) | v1 | v2 |
|---|---|---|
| SiteGround (WP) | USD 29.99/mes | Sin cambio — sigue siendo la base de hosting, ahora además corre Elementor Pro + EMCP |
| AWS S3 (storage del sitio estático) | < USD 1/mes | **Se elimina para landings** — no hay build que subir. Puede seguir existiendo si el Visor Astro u otra pieza del repo lo usa aparte |
| AWS CloudFront (CDN) | USD 0 esperado (free tier) | **Se elimina para landings** — mismo motivo |
| GitHub Actions (build/deploy) | USD 0 (repo público) | **Se elimina para landings** — no hay build que disparar |
| Elementor Pro | No aplicaba | Licencia existente/nueva — **confirmar tier necesario para cubrir 9 subsitios** (Expert cubre hasta 25 sitios, Agency ilimitado — pendiente de confirmar cuál aplica hoy) |
| EMCP (elementor-mcp) | No aplicaba | Plugin — confirmar licenciamiento en escenario multisitio (pendiente de validar en el spike) |
| Dominios/SSL adicionales (6 BU con dominio propio) | No aplicaba | Probablemente ya contratados si los dominios ya existen (ej. `institutoemprendedores.pe`) — confirmar con Infra si hace falta presupuesto nuevo |
| AWS Bedrock — Claude Haiku 4.5 (IA, producción) | USD 0.25 – 4.50/mes | Sin cambio — el motor de IA no cambia, solo lo que hace con la salida |
| Google Gemini (IA, dev) | USD 0 | Sin cambio |

**Lectura**: v2 es, de las partidas puramente de infraestructura, **más simple** que v1 (se cae todo el pipeline AWS de build/deploy para landings) — el costo nuevo que entra es de licencias (Elementor Pro/EMCP en multisitio) y, potencialmente, dominios/SSL si alguno de los 6 dominios propios no estuviera ya contratado. Ver §9.2 de v1 (`del-prompt-a-landing.md`) para el detalle de costo de IA — no cambia en v2.

## Sobre este documento

Reemplaza, para el flujo de generación de landings, la arquitectura descrita en `del-prompt-a-landing.md` (v1) — ese documento y su artifact original de claude.ai se mantienen intactos como registro histórico. Este v2 nace de un spike técnico real (no solo diseño en papel) contra el WP de desarrollo de SiteGround usando EMCP, documentado en detalle en el plan de arquitectura (`C:\Users\jmadrid\.claude\plans\necesito-que-analices-el-enchanted-stonebraker.md`).
