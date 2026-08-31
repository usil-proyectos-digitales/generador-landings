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

**Alcance de arquitectura**: este documento asume **WordPress headless** como CMS — el stack vigente hoy en el repo (`wp-api.ts`, `acf-schema.json`). No es el backend alternativo (Payload) que se evaluó en un análisis de arquitectura aparte.

**Motor de marca**: tanto el preview del cliente como el borrador que recibe WordPress se pintan con el `design.md` por Unidad de Negocio (color, tipografía y roles) — el enfoque de theming en adopción, que reemplaza al esquema anterior de clases de color fijas por BU.

```
Cliente (UI + IA)  →  Middleware & WordPress (CMS)  →  Dev / Frontend (Astro + Tailwind)

Selecciona BU,          Interpreta el input,             Completa contenido, SEO,
describe la landing,    mapea a bloques ACF,              QA y publica —
revisa y aprueba        crea la entrada en                dispara el rebuild
un preview              Borrador                          del sitio
```

## 02 — Interfaces y User Journey del cliente

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
| URL temporal | Generada automáticamente al entregar el boceto. |
| Panel — Editar textos | Ajustes puntuales sin volver al wizard. |
| Panel — Regenerar sección | Solo un bloque puntual, no toda la landing. |
| Panel — Modo claro / oscuro | Alternar el widget entre `light` y `dark` — cada modo resuelve su propio color y tipografía dentro del mismo `design.md` de la BU. |
| Acción principal | Aprobar y enviar → dispara la Sección 03. |

## 03 — Procesamiento IA y creación de borrador en WordPress

### 1. La IA / API intermedia interpreta el input

Traduce lo que llegó del wizard híbrido a la estructura real que WordPress espera: un layout de ACF Flexible Content por cada bloque.

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

El JSON se envía por REST API (o GraphQL), creando una entrada del tipo `landing` en estado **Borrador**, ya con todos los bloques cargados. No es visible en el sitio público.

**Caso especial — campos de configuración**: un widget `form` necesita un `hubspot_form_id` real. La IA no puede inventarlo — queda vacío, y es responsabilidad del Dev completarlo antes de publicar.

## 04 — Workflow operativo técnico del Desarrollador

Seis pasos, todos sobre la misma entrada en Borrador — sin handoff a otro sistema.

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

   **Referencia de costo** (aproximada, cotizar antes de comprometer presupuesto): S3 cuesta USD 0.023 por GB al mes en el tier más barato de S3 Standard (ej. región Norte de Virginia) — centavos para este tamaño de sitio. CloudFront tiene free tier perpetuo de 1TB/mes, costo incremental típico de un solo dígito de dólares/mes. GitHub Actions da minutos gratis según el plan del repo. WordPress/SiteGround no es gasto nuevo.

### 4.7 — Las tres capas, resumen final

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| **Cliente** | Elige su BU, completa el wizard híbrido y revisa el preview en tiempo real. | — (arranca el proceso) | Preview aprobado |
| **IA & Middleware** | Interpreta el input, resuelve marca vía `design.md`, mapea a los layouts de ACF y crea la entrada en WordPress. | Preview aprobado | Entrada `landing` en Borrador, con bloques generados |
| **Dev / Marketing Ops** | Completa contenido, imágenes, SEO, Open Graph, hace QA responsive y publica. | Entrada en Borrador | Sitio publicado y en producción |

## Sobre este documento

Consolida "Del prompt al preview" (fase cliente en detalle) y "Del prompt al sitio publicado" (fase backend/Dev en detalle) en una sola fuente de verdad. El repo también tiene `AI-LANDING-FLOW.md`, con esta misma información en formato compacto para agentes de IA que trabajen en el código.
