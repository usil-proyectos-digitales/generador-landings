# Del Prompt a Landing

> Backup en Markdown del artifact publicado en claude.ai. Documento maestro — fusiona `del-prompt-al-preview.md` y `del-prompt-al-sitio-publicado.md` en una sola fuente de verdad. Ver también `AI-LANDING-FLOW.md` en la raíz del repo (versión compacta para agentes de IA).
>
> Artifact: https://claude.ai/code/artifact/99f4bc57-6466-4f70-ab06-bdfbfb6a36b7

Arquitectura E2E completa del generador de landings con IA: interfaces del cliente, procesamiento de IA, creación del borrador en WordPress y workflow técnico del Dev hasta el sitio publicado.

- **Alcance**: de la solicitud del cliente al sitio en producción
- **Fusiona**: "Del prompt al preview" + "Del prompt al sitio publicado"

## 01 — Visión general y arquitectura del sistema

La plataforma resuelve un problema puntual: hoy, construir una landing significa que un Dev traduzca a mano un pedido de Marketing a un widget, una variante y una paleta de colores. El sistema descrito acá reparte ese trabajo en tres capas, cada una con una responsabilidad clara y un límite explícito de hasta dónde llega antes de pasarle la posta a la siguiente.

El cliente nunca publica nada directamente, y la IA tampoco. El resultado del lado del cliente es siempre un **preview**; el resultado del lado de la IA/middleware es siempre un **borrador** en WordPress; el sitio en producción solo existe después de que un Dev humano lo revisa y publica.

**Alcance de arquitectura**: **WordPress headless es la decisión de backend** — el stack vigente hoy en el repo (`wp-api.ts`, `acf-schema.json`). Se descartó explícitamente considerar Payload u otras alternativas; no hay comparación pendiente.

**Motor de marca**: tanto el preview del cliente como el borrador que recibe WordPress se pintan con el `design.md` por Unidad de Negocio (color, tipografía y roles) — el enfoque de theming en adopción, que reemplaza al esquema anterior de clases de color fijas por BU.

```
Cliente (UI + IA)       Middleware & WordPress            Dev / Frontend
[WordPress · Plugin PHP] → [WordPress · Plugin PHP]     →  [Astro + Tailwind]

Selecciona BU,          Interpreta el input,             Completa contenido, SEO,
describe la landing,    mapea a bloques ACF,              QA y publica —
revisa y aprueba        crea la entrada en                dispara el rebuild
un preview              Borrador                          del sitio
```

Las capas 1 y 2 corren dentro del **mismo plugin PHP en WordPress** — la separación es de responsabilidad (qué ve el cliente vs. qué pasa tras aprobar), no de sistema técnico. Astro entra recién en la capa 3, como consumidor de solo lectura de la REST API de WP — nunca antes.

## 02 — Interfaces y User Journey del cliente

### 2.0 — Login

Antes de tocar contenido, el usuario entra con su propia cuenta de WordPress (login y roles nativos de WP, sin sistema de usuarios aparte) — identifica quién hace la solicitud y habilita su historial personal ("Mis solicitudes", ver §05).

### 2.1 — Selección de Unidad de Negocio

Primer y único paso obligatorio antes de tocar contenido: elegir para qué BU es la landing. Esa elección no es cosmética — fija de entrada la identidad de marca completa de todo lo que sigue.

- Grilla de 9 BU, cada una con su combinación real de color como referencia visual.
- Al elegir una se carga su `design.md` — color, tipografía y qué rol usa cada parte de un bloque.
- Fija para toda la sesión; cambiarla más adelante reinicia el preview.

### 2.2 — Método de entrada híbrido

La opción adoptada. Se evaluó contra prompt libre, documento adjunto y formulario guiado por separado — esa comparación completa queda documentada en `del-prompt-al-preview.md`; acá solo se describe con qué nos quedamos.

- **Obligatorio** — campos que la IA necesita sí o sí: objetivo de la landing, título/propuesta, oferta o dato clave, llamado a la acción. Mapean directo a las props que necesita un widget.
- **Opcional** — texto libre (tono/contexto que no entra en un campo fijo) + opción de adjuntar un Word/PDF con el brief ya armado.

**Por qué esta combinación**: la IA entrega al final una selección de widget + variante + props tipadas, no texto plano. Los campos obligatorios bajan drástico la tasa de preview incompleto; el texto libre y el documento adjunto absorben lo que un formulario rígido no previó.

**Nota sobre mapeo flexible**: la cantidad exacta de campos obligatorios está en fase de definición/mapeo — es modular por diseño, no una lista cerrada.

### 2.3 — Procesamiento visual ("Thinking UI")

Pantalla de progreso con pasos visibles, no un spinner genérico:

1. Leyendo el contenido.
2. Eligiendo la estructura (qué widget/variante).
3. Aplicando el estilo de marca (resolviendo `design.md` de la BU).
4. Armando el boceto.

Nada de este paso persiste — es efímero.

### 2.4 — Visor de Preview URL

| Componente | Descripción |
|---|---|
| Contenedor | Toggle Desktop / Mobile sobre el mismo preview. |
| URL temporal | No es un boceto abstracto: build real de Astro con el contenido de la IA, disparado por GitHub Actions y subido a `previews/` en el mismo bucket S3, servido por CloudFront. |
| Panel — Editar textos | Ajustes puntuales sin volver al wizard. |
| Panel — Regenerar sección | Solo un bloque puntual, no toda la landing. |
| Panel — Modo claro / oscuro | Alternar el widget entre `light` y `dark` — cada modo resuelve su propio color y tipografía dentro del mismo `design.md` de la BU. |
| Acción principal | Aprobar y enviar → dispara la Sección 03. |

## 03 — Procesamiento IA y creación de borrador en WordPress

### 1. El plugin IA (dentro de WordPress) interpreta el input

Traduce lo que llegó del wizard híbrido a la estructura real que WordPress espera: un layout de ACF Flexible Content por cada bloque. Corre como código PHP dentro de la misma instalación de WordPress en SiteGround — no es una aplicación externa con hosting propio.

### 2. Arma el JSON por bloque

Cada bloque mapea 1 a 1 a un layout existente (`hero`, `cards`, `form`, `footer`), sin inventar campos fuera del esquema.

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

`image_url`/`image_alt` quedan pendientes — los completa el Dev (§04.2).

### 3. Crea la entrada en WordPress, en Borrador

El plugin crea la entrada directo en la base de datos de WP (`wp_insert_post` + campos ACF) — sin POST a un sistema externo, porque corre dentro de la misma instalación. Queda una entrada del tipo `landing` en estado **Borrador**, con todos los bloques cargados y el usuario WP solicitante registrado en `requested_by` (§05). No es visible en el sitio público.

**Caso especial — campos de configuración**: un widget `form` necesita un `hubspot_form_id` real. La IA no puede inventarlo — queda vacío, y es responsabilidad del Dev completarlo antes de publicar.

## 04 — Workflow operativo técnico del Desarrollador

Seis pasos, todos sobre la misma entrada en Borrador — sin handoff a otro sistema. El Dev usa su propio usuario y rol de WordPress (login nativo) — al abrir el borrador queda registrado en `assigned_dev`, y al publicar en `published_by`/`published_at` (§05).

1. **Contenido — Revisión y curaduría**: validar textos en Custom Fields/ACF. El schema ya marca límites (`cta_text` ≤ 30, `title` ≤ 80).
2. **Recursos gráficos — Asignación de assets visuales**: completar `image_url`/`image_alt`, imágenes de fondo e iconografía según el `design.md` de la BU.
3. **SEO técnico**: título SEO, meta descripción, slug y estructura de encabezados — configurado directo en WordPress, no modelado en el esquema de bloques.
4. **Open Graph / redes sociales**: `og:image`, `og:title`, `og:description` — mismo tratamiento manual que el SEO.
5. **QA responsive y preview frontend**: sobre Astro + Tailwind, mobile-first.
6. **Publicación y trigger de build**: Borrador → Publicado en WordPress. Como Astro usa salida `static`, dispara un webhook que arranca el rebuild (GitHub Actions) + redeploy a S3/CloudFront. Cuatro piezas del stack entran en juego acá:

   | Pieza | Rol |
   |---|---|
   | **Astro** (framework) | El build (GitHub Actions) corre `pnpm build`: Astro consulta la REST API de WordPress y compila todas las páginas de antemano. |
   | **WordPress** (CMS) | Vive en SiteGround, separado de AWS — solo expone contenido vía REST API en el momento del build. |
   | **S3** (storage) | Un *bucket* es un contenedor de object storage en AWS — guarda el HTML/CSS/JS/imágenes que generó Astro. |
   | **CloudFront** (CDN) | Delante del bucket: HTTPS, cachea en *edge locations* globales, se invalida en cada publicación. |

   Glosario: **Bucket** = contenedor de almacenamiento de archivos en S3 · **Edge location** = cada punto de copia de CloudFront, el más cercano al visitante · **Invalidación de caché** = la orden de descartar la copia vieja, se dispara sola en cada publicación.

   **Referencia de costo**: ver §06 para el desglose completo de presupuesto (SiteGround, S3, CloudFront, GitHub Actions, IA).

### 4.7 — Las tres capas, resumen final

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| **Cliente** | Elige su BU, completa el wizard híbrido y revisa el preview en tiempo real. | — (arranca el proceso) | Preview aprobado |
| **Plugin IA & WordPress** | Interpreta el input, resuelve marca vía `design.md`, mapea a los layouts de ACF y crea la entrada — sin salir de la misma instalación de WP. | Preview aprobado | Entrada `landing` en Borrador, con bloques generados |
| **Dev / Marketing Ops** | Completa contenido, imágenes, SEO, Open Graph, hace QA responsive y publica. | Entrada en Borrador | Sitio publicado y en producción |

## 05 — Roles, autenticación e historial de solicitudes

Diseño, no implementado — mismo estado que el resto del flujo IA descrito en este documento.

### 5.1 — Roles

Cuatro roles nativos de WordPress, sin tabla de usuarios aparte:

| Rol | Acceso |
|---|---|
| **Cliente** (Marketing / Solicitante) | Rol WP limitado (ej. `landing_client`) — login con su cuenta, acceso solo al plugin IA (§02-03) y a su propio historial. Sin acceso al panel general de `wp-admin`. |
| **Supervisor** (Marketing Lead / SEO) | Revisa y aprueba (o rechaza con feedback) cada solicitud antes de que pase a Desarrollo — control de calidad/marca entre el Cliente y el Dev. |
| **Dev** | Rol editor/admin sobre el CPT `landings` — mismo login que ya usa en `wp-admin` (§04). |
| **Administrador** | Gestión de la plataforma: usuarios, roles, plugins, configuración técnica del CMS. Rol `Administrator` nativo de WP. |

Hoy Supervisor y Administrador son la misma persona/rol (ver `docs/01-definicion-roles-perfiles.md`), pero son dos funciones distintas — se listan por separado por si conviene separarlas más adelante.

### 5.2 — Login

Un solo sistema de identidad: usuarios y roles nativos de WordPress. El plugin IA autentica contra el login de WP en vez de mantener su propia tabla — vía **Application Passwords** (nativo desde WP 5.6) o un plugin tipo **JWT Authentication for WP REST API** (a definir en implementación). El sitio Astro (`generador-landings`, `output: static`) no implementa auth — sigue siendo un consumidor de solo lectura de la REST API pública de WP.

### 5.3 — Estado y campos custom

El post_status nativo de WP (Borrador/Publicado) no alcanza para rastrear quién pidió, aprobó y publicó cada landing. Se agregan campos post meta sobre cada entrada de `landings` — hoy no modelados en `acf-schema.json` (gap explícito, trabajo pendiente):

| Campo | Se llena en | Quién lo escribe |
|---|---|---|
| `requested_by` | §02.0 | Plugin IA, con el usuario WP logueado |
| `client_approved_at` | §02.4 (aprobación) | Plugin IA |
| `assigned_dev` | §04, paso 1 | Se asigna cuando un Dev abre el borrador |
| `published_by` / `published_at` | §04, paso 6 | WordPress, al publicar |

Lifecycle: `Solicitado` → `Preview aprobado` → `Borrador en WP` → `En trabajo (Dev)` → `Publicado`.

### 5.4 — Historial

Los campos de 5.3 se exponen vía REST API (`register_rest_field`) para dos vistas dentro del plugin IA — sin sumar ningún servicio nuevo, todo vive en la base de datos de WP que ya existe:

- **"Mis solicitudes"** (Cliente): `landings` filtrado por `requested_by` = su propio usuario. Muestra qué se solicitó (el input original del wizard — campos + texto libre + documento adjunto, no solo el JSON ya mapeado), qué se entregó (el preview aprobado) y qué se publicó.
- **Historial del Dev/Supervisor**: `landings` filtrado por `assigned_dev` / `published_by` — qué tomó y qué publicó.

## 06 — Costos y presupuesto

Precios de lista pública investigados en septiembre de 2026 (WebSearch/WebFetch) — no son la factura real de la organización; antes de comprometer presupuesto, confirmar con Infraestructura/DevOps el monto efectivamente facturado hoy en SiteGround y AWS.

### 6.1 — Resumen mensual

| Partida | Costo mensual | Nota |
|---|---|---|
| SiteGround (WP headless) | **USD 29.99** (plan GrowBig, precio de renovación) | Ya contratado — no es gasto nuevo, se documenta para tener el presupuesto completo. Promo de entrada más baja (~USD 4.99 el primer término); presupuestar con el precio de renovación. |
| AWS S3 (storage del sitio estático) | < USD 1 | USD 0.023/GB/mes (S3 Standard) — el sitio son HTML/CSS/JS/imágenes de unas pocas decenas de landings, unos pocos GB. |
| AWS CloudFront (CDN) | USD 0 esperado | Free tier **permanente** (no de 12 meses): 1 TB de salida + 10M requests/mes. El tráfico de landings de campaña puntuales de USIL muy probablemente no lo supera. |
| GitHub Actions (build/deploy) | USD 0 | El repo `generador-landings` es **público** → minutos de runner ilimitados y gratis. |
| AWS Bedrock — Claude Haiku 4.5 (IA, producción) | USD 0.25 – 4.50 (variable, ver 6.2) | Pago por token, sin costo fijo. |
| Google Gemini (IA, dev) | USD 0 | Tier gratis — solo se usa en desarrollo/pruebas, sin datos reales de Marketing. |
| **Total estimado** | **~USD 30 – 35/mes** | SiteGround es la partida que domina el presupuesto; IA e infraestructura AWS son ruido en comparación. |

### 6.2 — Detalle del costo de IA (AWS Bedrock, producción)

Costo Bedrock on-demand para Claude Haiku 4.5: **USD 1.00 por millón de tokens de entrada, USD 5.00 por millón de tokens de salida**. Una generación de landing típica usa unos 5.000 tokens de entrada (prompt + esquema de widgets + input del cliente) y 2.000 de salida (JSON de bloques) → **USD 0.015 por llamada**; si el cliente adjunta un documento, la entrada sube a ~10.000 tokens → **USD 0.02 por llamada**.

Cruzando eso con el volumen real de solicitudes de los últimos meses (mayo 9, junio 36, julio 18, agosto 6) y con que en los primeros meses de uso se esperan **3 a 6 llamadas por landing** (curva de aprendizaje de la plataforma, antes de que el equipo la use con fluidez):

| Escenario | Landings/mes | Llamadas/landing | Costo mensual |
|---|---|---|---|
| Mes más bajo observado (agosto) | 6 | 6 | USD 0.54 |
| Promedio declarado | 15 | 3–6 | USD 0.67 – 1.35 |
| Mes pico observado (junio) | 36 | 3–6 | USD 1.62 – 3.24 |
| Pico + todas las solicitudes con documento adjunto | 36 | 6 | USD 4.32 |
| Régimen estable, post-adopción (1–2 llamadas/landing) | 15 | 1–2 | USD 0.23 – 0.45 |

**¿Alcanza Claude Haiku 4.5 para este volumen?** Sí, con margen amplio: incluso en el escenario más caro observado (pico de 36 landings, 6 llamadas cada una, todas con documento adjunto) el costo mensual de IA no pasa de ~USD 4.50. Sobre capacidad/throughput (no solo costo): la cuota por defecto de Bedrock ronda los 200.000 tokens/minuto por modelo, y una sola llamada usa 5.000–10.000 tokens — ni el mes pico se acerca a un problema de cuota, es un tema puramente de costo (trivial) y no de capacidad.

En desarrollo se sigue usando el tier gratis de Gemini (USD 0) — ahí no aplica este cálculo porque no se prueba con contenido real de Marketing ni a este volumen.

### 6.3 — Detalle de infraestructura

- **SiteGround (GrowBig)**: USD 29.99/mes al precio de renovación (USD 359.88/año). Es infraestructura ya contratada, no un gasto que este proyecto agregue — se lista igual porque es parte del costo total de mantener el sistema.
- **AWS S3 + CloudFront**: el costo de storage (S3) es previsible y bajo (centavos/mes para este tamaño de sitio); el de entrega (CloudFront) tiene free tier permanente que cubre 1TB/mes de salida — para landings de campaña con tráfico puntual, es razonable esperar que el proyecto quede dentro del free tier casi todos los meses. Un pico de campaña grande podría generar cargo incremental de USD 0.085/GB por encima de 1TB. Ninguno de los dos escala con la cantidad de landings a un ritmo que importe: S3 recién pasaría de centavos a ~USD 1/mes con miles de landings acumulados sin borrar nunca ninguno (a este ritmo, décadas); CloudFront depende del tráfico, no de cuántos landings existan, y su free tier cubre del orden de cientos de miles de visitas/mes antes de cualquier cargo.
- **GitHub Actions**: sin costo mientras el repo se mantenga público — si en algún momento pasara a privado, el plan Free de GitHub da 2.000 minutos/mes incluidos antes de facturar por minuto.

## Sobre este documento

Consolida "Del prompt al preview" (fase cliente en detalle) y "Del prompt al sitio publicado" (fase backend/Dev en detalle) en una sola fuente de verdad. El repo también tiene `AI-LANDING-FLOW.md`, con esta misma información en formato compacto para agentes de IA que trabajen en el código.
