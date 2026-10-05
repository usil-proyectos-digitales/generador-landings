# Flujo E2E — Generación de Landings con IA

> Complementa a `CLAUDE.md`. Léelo primero para stack, convenciones y estructura del repo — acá solo se documenta el flujo de generación con IA, de punta a punta.

## Estado: en fase de diseño/spec, no implementado

**Importante para cualquier agente que trabaje en este repo:** el wizard de captura y el motor de IA que interpreta el input **no existen todavía como código en este repo**. Si buscás un endpoint, un cliente de IA o una UI de wizard y no aparece, es porque no está construido — este documento describe el diseño acordado, no un feature ya implementado. El diseño acordado es que ese wizard/chat viva como **plugin PHP dentro de WordPress (SiteGround)** — no como una aplicación aparte con hosting propio — para reusar el login/roles nativos de WP y no sumar infraestructura nueva (nada de Vercel/Netlify/Lambda).

Lo que sí existe hoy y sustenta este diseño (código real, ya en el repo):

| Pieza | Archivo | Rol en este flujo |
|---|---|---|
| Catálogo de widgets | `src/components/widgets/registry.ts` | Define qué widgets/variantes existen — es el universo que la IA tiene que mapear |
| Cliente REST de WP | `src/lib/wp-api.ts` | Ya consume el CPT `landings` (`getLandingBySlug`, `getAllLandings`) — el borrador que crearía la IA es una entrada más de este mismo CPT |
| Schema de bloques ACF | `src/data/acf-schema.json` | Los layouts reales (`hero`, `cards`, `form`, `footer`) a los que la IA tiene que mapear su output — no hay que inventar campos fuera de acá |
| Tokens + tipografía por BU | `src/data/design-md/*.md` + `src/lib/design-md.ts` | El motor de marca que resuelve la IA al pintar el preview y al generar el borrador (ver `CLAUDE.md`, sección "`design.md` por BU") — hoy cubre 3 de 9 BU |
| Registro de BUs vigentes | `src/data/bu-colors.json` / `global.css` | 9 BU con sus 5 roles de color, capa de compatibilidad para widgets ya construidos con `theme.ts` |
| Auth / roles / login | — (no existe código en este repo) | `wp-api.ts` no maneja autenticación hoy. El login/roles del plugin IA (sección 5) se apoyan en las capacidades nativas de WordPress (Application Passwords / JWT), no en código de este repo — un agente no debe asumir que existe un endpoint o middleware de auth acá |

Alcance de arquitectura: **WordPress headless es la decisión de backend** — no un backend alternativo en evaluación. Se descartó explícitamente considerar Payload u otras alternativas; no hace falta comparación adicional.

## Documentación extendida (para humanos / presentación)

Este archivo es la referencia técnica compacta para un agente. Para el desarrollo completo, con tablas comparativas, diagramas visuales y ejemplos, ver los artifacts publicados:
- **"Del prompt al preview"** — fase cliente en detalle (UI journey, spec del visor).
- **"Del prompt al sitio publicado"** — fase backend/Dev en detalle.
- **"Del Prompt a Landing"** — documento maestro que fusiona ambos.

## 1. Visión general

Tres capas, en este orden:

```
Cliente (UI + IA)  →  Plugin IA & WordPress (CMS)  →  Dev / Frontend (Astro + Tailwind)
```

1. **Cliente**: elige su BU, describe la landing que necesita (método híbrido), revisa un preview en vivo, aprueba.
2. **Plugin IA & WordPress**: interpreta ese input, lo mapea a los layouts reales de `acf-schema.json`, crea una entrada del CPT `landings` en estado **Borrador** — llamada directa (`wp_insert_post`) dentro de la misma instalación de WP, sin POST a un sistema externo.
3. **Dev / Frontend**: entra a esa entrada ya existente en WordPress, completa lo que la IA no puede resolver (imágenes, SEO, Open Graph, configuración), hace QA sobre el frontend real en Astro, publica.

Nada se publica automáticamente — siempre hay una persona (el Dev) entre el borrador generado y el sitio en producción.

## 2. Fase cliente

### 2.1 Selección de BU

El cliente elige su Unidad de Negocio de las 9 vigentes (ver `bu-colors.json`). Esa elección carga el `design.md` de esa BU — color, tipografía y roles — para todo lo que sigue en la sesión. Cambiarla más adelante reinicia el proceso.

### 2.2 Método de entrada — híbrido

No es prompt libre puro ni formulario rígido puro. Es:
- Campos clave estructurados (objetivo, título/propuesta, oferta, CTA) — los que la IA necesita sí o sí para mapear a un widget.
- + un campo de prompt/texto libre opcional, para tono y contexto que no entra en un campo fijo.
- + opción de adjuntar un documento (Word/PDF) con un brief ya armado.

**La cantidad exacta de campos obligatorios todavía está en fase de definición/mapeo — es modular por diseño, no una lista cerrada.** Lo que no cambia es el contrato de salida: cualquier combinación de campos termina resolviéndose al mismo formato de JSON de la sección 3.

### 2.3 Thinking UI

Mientras la IA procesa, se muestran pasos de progreso reales (no un spinner genérico):
1. Leyendo el contenido.
2. Eligiendo la estructura (qué widget/variante).
3. Aplicando el estilo de marca (resolviendo `design.md` de la BU).
4. Armando el boceto.

Nada de este paso persiste — es efímero. Si el cliente cierra la pestaña acá, no queda rastro.

### 2.4 Visor de preview

El preview no es un boceto abstracto: es un **build real de Astro** con el contenido que armó la IA, disparado puntualmente por GitHub Actions (mismo mecanismo que el deploy a producción) y subido a una carpeta `previews/` del mismo bucket S3, servido por CloudFront. Se entrega esa URL temporal, ya pintada según el `design.md` de la BU. Componentes esperados:
- Contenedor responsive con toggle Desktop/Mobile.
- Panel lateral: editar textos puntuales, regenerar una sección específica (solo esa, no toda la landing), alternar modo claro/oscuro del widget (cada modo resuelve su propio color y tipografía dentro del mismo `design.md` de la BU).
- Acción principal: aprobar → dispara la sección 3.

## 3. Plugin IA & creación del borrador en WordPress

1. **Interpreta el input** del cliente (campos + prompt + documento, si lo hubo).
2. **Arma un JSON por bloque**, mapeado 1 a 1 a los layouts reales de `acf-schema.json`:

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

   `image_url`/`image_alt` quedan vacíos a propósito — eso lo completa el Dev en la sección 4. Igual con campos de configuración real como `hubspot_form_id` en un bloque `form`: la IA no puede inventar ese ID, queda pendiente.

3. **Crea la entrada directo en la base de datos de WP** (`wp_insert_post` + campos ACF) — el plugin corre dentro de la misma instalación de WordPress, así que no hay POST a un sistema externo. Queda una entrada del CPT `landings` en estado **Borrador**, con todos los bloques ya cargados. No es visible en el sitio público — un Borrador no se renderiza en producción.

## 4. Workflow del Dev (post-generación)

Todo sobre la misma entrada en Borrador — no hay handoff a otro sistema entre un paso y otro.

1. **Revisión de contenido** — Custom Fields/ACF en WordPress. El propio `acf-schema.json` ya marca límites (ej. `cta_text` ≤ 30 caracteres, `title` ≤ 80) — no hace falta un criterio nuevo para saber qué acortar.
2. **Recursos visuales** — completar `image_url`/`image_alt` por bloque, según el manual de marca de la BU (`design.md`).
3. **SEO técnico** — título SEO, meta descripción, slug. Se configura directo en WordPress sobre la entrada; no es un campo que la IA genera ni algo modelado en `acf-schema.json`.
4. **Open Graph** — `og:image`, `og:title`, `og:description`. Mismo tratamiento manual que el SEO técnico.
5. **QA responsive** — sobre el frontend real (Astro + Tailwind), breakpoints mobile-first.
6. **Publicación** — cambiar Borrador → Publicado en WordPress. Como Astro usa output `static`, eso no alcanza solo: dispara un webhook que arranca el rebuild (GitHub Actions) + redeploy a S3 + invalidación de CloudFront. Recién ahí el contenido queda en vivo.

   - **GitHub Actions** corre `pnpm build` (Astro contra la REST API de WP) y sube el resultado.
   - **S3** guarda el sitio compilado — un *bucket* es un contenedor de object storage en AWS, no una base de datos ni un servidor de ejecución.
   - **CloudFront** es el CDN delante del bucket: HTTPS, cache en edge locations, se invalida en cada deploy.
   - **WordPress headless vive en SiteGround**, no en AWS — separado del hosting del frontend.
   - Costo aproximado (cotizar antes de comprometer presupuesto): S3 Standard cuesta USD 0.023/GB-mes en el tier más barato (ej. us-east-1); para este tamaño de sitio queda en centavos. CloudFront tiene free tier perpetuo de 1TB/mes, costo incremental típico de un dígito de dólares/mes. Ninguno de los dos escala con la cantidad de landings a un ritmo que importe (S3 recién pasaría de centavos a ~USD 1/mes con miles de landings acumulados; CloudFront depende del tráfico, no de cuántos landings existan) — desglose completo en `docs/artifacts/del-prompt-a-landing.md` §6.3. SiteGround no es gasto nuevo.
   - **Costo aproximado de AWS Bedrock (Claude Haiku 4.5)**: USD 1.00 por millón de tokens de entrada y USD 5.00 por millón de tokens de salida (pricing oficial de AWS Bedrock, sep. 2026 — cotizar antes de comprometer presupuesto, cambia con el tiempo). Una generación típica (~5k tokens de entrada, ~2k de salida) cuesta ~USD 0.015 por llamada — unos pocos centavos, no fracciones de centavo. Cruzado con el volumen real de solicitudes (6 a 36 landings/mes según el histórico, con 3-6 llamadas por landing esperadas mientras el equipo aprende a usar la plataforma), el gasto mensual de IA en producción se mantiene bajo ~USD 5 incluso en el mes más cargado — desglose completo en `docs/artifacts/del-prompt-a-landing.md` §06. Se prefirió Claude Haiku sobre modelos más baratos de Bedrock (Amazon Nova Micro/Lite) por mejor comprensión de lenguaje ante prompts ambiguos y documentos adjuntos con formato irregular. En dev se sigue usando el tier gratis de Gemini (sin este costo) — ahí la confidencialidad no aplica porque no se prueba con contenido real de Marketing.

## 5. Roles, autenticación e historial

Diseño, no implementado — mismo estado que el resto de este documento.

### 5.1 Roles

Cuatro roles nativos de WordPress, sin tabla de usuarios aparte:

- **Cliente** (Marketing / Solicitante): rol limitado (ej. `landing_client`) — login con su cuenta WP, acceso solo al plugin IA (sección 2-3) y a su propio historial. Sin acceso al panel general de `wp-admin`.
- **Supervisor** (Marketing Lead / SEO): revisa y aprueba (o rechaza con feedback) cada solicitud antes de que pase a Desarrollo — punto de control de calidad/marca entre el Cliente y el Dev.
- **Dev**: rol editor/admin sobre el CPT `landings` — mismo login que ya usa hoy para trabajar en `wp-admin` (sección 4).
- **Administrador**: gestión de la plataforma en sí — usuarios, roles, plugins, configuración técnica del CMS. Rol `Administrator` nativo de WP.

Hoy Supervisor y Administrador son la misma persona/rol (ver `docs/01-definicion-roles-perfiles.md`, perfil "Administrador de Marketing"), pero son dos funciones distintas — se listan por separado por si el equipo crece y conviene separarlas en dos roles WP reales.

### 5.2 Login

Un solo sistema de identidad: usuarios y roles nativos de WordPress. El plugin IA autentica contra el login de WP en vez de mantener su propia tabla de usuarios — vía **Application Passwords** (nativo desde WP 5.6) o un plugin tipo **JWT Authentication for WP REST API**, a definir en implementación. El sitio Astro (`generador-landings`, `output: static`) no implementa auth — sigue siendo un consumidor de solo lectura de la REST API pública de WP.

### 5.3 Estado y campos custom

El post_status nativo (Borrador/Publicado) no alcanza para el historial que se necesita. Se agregan campos post meta sobre cada entrada de `landings` (hoy no modelados en `acf-schema.json` — gap explícito, trabajo pendiente):

| Campo | Se llena en | Quién lo escribe |
|---|---|---|
| `requested_by` | Sección 2 | Plugin IA, con el usuario WP logueado |
| `client_approved_at` | Sección 2.4 (aprobación) | Plugin IA |
| `assigned_dev` | Sección 4, paso 1 | Se asigna cuando un Dev abre el borrador |
| `published_by` / `published_at` | Sección 4, paso 6 | WordPress, al publicar |

Lifecycle: `Solicitado` → `Preview aprobado` → `Borrador en WP` → `En trabajo (Dev)` → `Publicado`.

### 5.4 Historial

Los campos de 5.3 se exponen vía REST API (`register_rest_field`) para dos vistas dentro del plugin IA — sin sumar ningún servicio nuevo, todo vive en la base de datos de WP que ya existe:

- **"Mis solicitudes"** (Cliente): `landings` filtrado por `requested_by` = su propio usuario. Muestra qué se solicitó (el input original del wizard: campos + texto libre + documento adjunto, guardado junto a la entrada — no solo el JSON ya mapeado a widgets), qué se entregó (el preview aprobado) y qué se publicó.
- **Historial del Dev/Supervisor**: `landings` filtrado por `assigned_dev` / `published_by` — qué tomó y qué publicó.

### 5.5 Trabajo técnico nuevo que este diseño implica

Estimación de días por tarea en `docs/03-cronograma-estimado.md` — acá solo lo que hay que construir que hoy no existe:

- El plugin PHP de IA en WordPress (chat/wizard + llamadas al motor de IA — Gemini en dev, AWS Bedrock/Claude Haiku 4.5 en prod — + mapeo a `acf-schema.json` + creación del borrador).
- Los campos custom (post meta) de la sección 5.3 sobre el CPT `landings`, y su exposición vía `register_rest_field`.
- El pipeline base de GitHub Actions → build Astro → S3 + CloudFront — **no existe hoy** (no hay `.github/workflows/`, ni integración AWS en `astro.config.mjs`, ni credenciales configuradas) y hay que construirlo de cero, coordinando con el área de Infraestructura para el bucket/CloudFront/credenciales. El ajuste para soportar el build de preview on-demand (sección 2.4) va encima de ese pipeline base, no de uno preexistente.

## 6. Tabla de responsabilidades

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| Cliente | Selecciona BU, completa el método híbrido, revisa y aprueba el preview | — (arranca el proceso) | Preview aprobado |
| Middleware & WordPress | Interpreta el input, resuelve marca vía `design.md`, mapea a `acf-schema.json`, crea la entrada en WP | Preview aprobado | Entrada `landings` en Borrador, con bloques generados |
| Dev / Marketing Ops | Completa contenido, imágenes, SEO, Open Graph, QA responsive, publica | Entrada en Borrador | Sitio publicado en producción |
