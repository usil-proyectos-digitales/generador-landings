# Del prompt al sitio publicado

> Backup en Markdown del artifact publicado en claude.ai. Ver también `AI-LANDING-FLOW.md` (guía compacta para agentes) y `docs/artifacts/del-prompt-a-landing.md` (documento maestro que fusiona este documento con el de la fase cliente).
>
> Artifact: https://claude.ai/code/artifact/85547358-0560-4111-810b-bd2eed7ce4d3

Arquitectura de proceso end-to-end: desde que el cliente completa su solicitud con IA hasta que el sitio queda publicado — pasando por el borrador que se crea en WordPress y el trabajo del equipo de Desarrollo sobre esa entrada.

- **Alcance**: solicitud del cliente hasta sitio en producción
- **Continúa**: el flujo de captura y preview ya definido en "Del prompt al preview"

Este documento describe el proceso completo sobre la arquitectura que ya está vigente hoy: **WordPress como CMS headless**, consumido por el sitio en Astro. No es el backend alternativo (Payload) que se exploró en el documento de comparación de stack — ese es un análisis de arquitectura aparte. Acá se asume que el CMS de destino sigue siendo WordPress, y el foco es cómo la IA, el CMS y el Dev se pasan la posta entre sí hasta que la landing queda en producción.

El motor de marca que pinta cada landing —en el preview inicial y en lo que la IA le entrega a WordPress— es el `design.md` por Unidad de Negocio: color, tipografía y qué rol tipográfico usa cada parte de un bloque. Es el reemplazo del esquema anterior de clases de color fijas por BU, que queda en desuso.

## 01 — Fase cliente: solicitud e interfaz de IA (resumen)

El punto de partida de todo el proceso — detalle completo en "Del prompt al preview".

- **Entrada** — Método híbrido: campos clave estructurados + prompt guiado, con opción de adjuntar un Word/PDF con el brief ya armado.
- **Identidad de marca** — Selección de BU: el cliente elige su Unidad de Negocio; la plataforma carga su `design.md` — color, tipografía y roles — para todo lo que sigue.
- **Validación** — Preview en tiempo real: URL de prueba pintada en vivo con el `design.md` de la BU seleccionada, antes de que nada llegue a WordPress.

**Nota sobre mapeo flexible**: la cantidad exacta de campos obligatorios del wizard todavía está en fase de definición/mapeo — es modular por diseño. Lo que no cambia es el contrato de salida: cualquier combinación de campos que se decida termina resolviéndose al mismo formato de JSON que consume la Sección 02.

## 02 — Del preview aprobado al borrador en WordPress

Qué pasa apenas el cliente confirma su solicitud — sin intervención humana todavía de por medio.

### 1. La IA / API intermedia interpreta el input

Toma lo que llegó del wizard híbrido (campos + prompt + documento adjunto, si lo hubo) y lo traduce a la estructura real que WordPress espera: un layout de ACF Flexible Content por cada bloque de la landing.

### 2. Arma el JSON por bloque

Cada bloque generado mapea 1 a 1 a un layout existente (`hero`, `cards`, `form`, `footer`), con los campos reales que ese layout define — nada inventado por fuera del esquema.

Ejemplo — bloque hero generado por la IA:

```json
{
  "acf_fc_layout": "hero",
  "title": "Admisión 2026 abierta",
  "subtitle": "Empieza en agosto con becas disponibles",
  "cta_text": "Postula ahora",
  "cta_url": "https://...",
  "image_url": null,
  "image_alt": null
}
```

`image_url`/`image_alt` quedan `null` a propósito — pendientes de que el Dev los complete (ver §03.2).

### 3. Crea la entrada en WordPress, en Borrador

El JSON completo se envía por REST API (o GraphQL) y crea una nueva entrada del tipo de contenido `landing` en estado **Borrador**, con todos los bloques generados ya cargados.

- La entrada existe y es editable en el admin de WordPress — el Dev no arranca de cero, entra a completar algo que ya tiene estructura y textos.
- Nada de esto es visible en el sitio público: un Borrador no se renderiza en producción.

**Caso especial — campos de configuración**: algunos campos no son contenido, son configuración: un widget de `form` necesita un `hubspot_form_id` real. La IA no puede inventar ese dato — llega vacío, y es responsabilidad del Dev completarlo con el ID correcto de HubSpot antes de publicar.

## 03 — Workflow operativo del Dev / Maquetador

Seis pasos, todos sobre la misma entrada en Borrador que ya generó la IA — no hay handoff a un sistema distinto entre uno y otro.

1. **Contenido — Revisión y ajuste de textos**: validar lo que generó la IA directo en los Custom Fields de ACF. El propio schema ya marca los límites — un `cta_text` de más de 30 caracteres o un `title` de más de 80 se detectan solos, no hace falta un criterio nuevo para saber qué acortar.
2. **Recursos visuales — Selección e inserción de imágenes**: completar los campos `image_url`/`image_alt` que la IA dejó vacíos en cada bloque, con recursos e íconos acordes al manual de marca de la BU (su `design.md`).
3. **SEO técnico — Título SEO, meta descripción y slug**: se configura directo en WordPress, sobre la misma entrada — no es un dato que la IA genera ni algo que haga falta modelar en el esquema de bloques. Es trabajo editorial estándar del Dev antes de publicar.
4. **Open Graph — Tarjetas para redes y WhatsApp**: `og:image`, `og:title`, `og:description` — mismo tratamiento que el SEO técnico: se cargan a mano en WordPress sobre la entrada, como parte del mismo paso editorial.
5. **QA — Revisión responsive**: comprobar el maquetado ya renderizado por Astro + Tailwind en los tres breakpoints estándar (mobile-first) — el mismo frontend que pintó el preview inicial del cliente, ahora con contenido real.
6. **Lanzamiento — Publicación y despliegue**: cambiar el estado de Borrador a Publicado en WordPress. Como el sitio es estático (Astro, salida `static`), publicar en WP no alcanza por sí solo — ese cambio dispara un webhook que arranca el rebuild (GitHub Actions) y el redeploy a S3 + invalidación de CloudFront. Recién ahí el contenido nuevo queda en vivo. Cuatro piezas del stack entran en juego acá:

   | Pieza | Rol |
   |---|---|
   | **Astro** (framework) | El build (disparado por GitHub Actions) corre `pnpm build`: Astro consulta la REST API de WordPress y compila todas las páginas de antemano — no se arman al momento de cada visita. |
   | **WordPress** (CMS) | Vive en SiteGround, separado de AWS. Solo expone el contenido vía REST API en el momento del build; el hosting del frontend no depende de que esté disponible en producción. |
   | **S3** (storage) | Un *bucket* es un contenedor de object storage en AWS — guarda el HTML/CSS/JS/imágenes que generó Astro. No es una base de datos ni un servidor que ejecuta código. |
   | **CloudFront** (CDN) | Va delante del bucket: sirve por HTTPS, cachea en *edge locations* globales, y es lo que se invalida en cada publicación para que el contenido nuevo se vea de inmediato. |

   | Término | Qué significa |
   |---|---|
   | **Bucket** | Un contenedor de almacenamiento de archivos en S3 — no una base de datos ni un servidor que ejecuta código. |
   | **Edge location** | Cada punto de copia distribuido de CloudFront por el mundo — el más cercano a cada visitante. |
   | **Invalidación de caché** | La orden que descarta la copia vieja en esos puntos — se dispara sola en cada publicación. |

   **Referencia de costo** (aproximada, cotizar antes de comprometer presupuesto): guardar los archivos del sitio (S3) cuesta USD 0.023 por GB al mes en el tier más barato de S3 Standard (ej. región Norte de Virginia) — para un sitio de este tamaño, el costo es de centavos. Entregarlo a los visitantes (CloudFront) tiene un tier gratuito perpetuo de 1TB/mes, así que el costo extra suele quedar en un solo dígito de dólares al mes. GitHub Actions da minutos gratis según el plan del repo. WordPress/SiteGround no es gasto nuevo — es la infraestructura que ya existe hoy.

## 04 — Las tres capas, de punta a punta

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| **Cliente** | Elige su BU, completa el wizard híbrido y revisa el preview en tiempo real. | — (arranca el proceso) | Preview aprobado |
| **IA & Middleware** | Interpreta el input, resuelve marca vía `design.md`, mapea a los layouts de ACF y crea la entrada en WordPress. | Preview aprobado | Entrada `landing` en Borrador, con bloques generados |
| **Dev / Marketing Ops** | Completa contenido, imágenes, SEO, Open Graph, hace QA responsive y publica. | Entrada en Borrador | Sitio publicado y en producción |

```
Cliente                    IA & Middleware              Dev / Marketing Ops
Selección de BU        →   Interpreta contenido      →  Contenido + imágenes
Wizard híbrido          →   Arma JSON por bloque       →  SEO + Open Graph
Preview aprobado        →   POST a WordPress           →  QA responsive
                                                        →  Publica (rebuild + redeploy)
```

## Cómo se conecta con el documento anterior

"Del prompt al preview" define en detalle la Sección 01 de este documento (pantallas, componentes de UI, mapa de pantallas del lado cliente). Este documento continúa exactamente donde ese terminaba — en el preview aprobado — y cubre todo lo que pasa después, hasta el sitio en producción.
