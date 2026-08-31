# Flujo E2E — Generación de Landings con IA

> Complementa a `CLAUDE.md`. Léelo primero para stack, convenciones y estructura del repo — acá solo se documenta el flujo de generación con IA, de punta a punta.

## Estado: en fase de diseño/spec, no implementado

**Importante para cualquier agente que trabaje en este repo:** el wizard de captura, el middleware de IA que interpreta el input, y el envío automático del JSON generado a WordPress **no existen todavía como código en este repo**. Si buscás un endpoint, un cliente de IA o una UI de wizard y no aparece, es porque no está construido — este documento describe el diseño acordado, no un feature ya implementado.

Lo que sí existe hoy y sustenta este diseño (código real, ya en el repo):

| Pieza | Archivo | Rol en este flujo |
|---|---|---|
| Catálogo de widgets | `src/components/widgets/registry.ts` | Define qué widgets/variantes existen — es el universo que la IA tiene que mapear |
| Cliente REST de WP | `src/lib/wp-api.ts` | Ya consume el CPT `landings` (`getLandingBySlug`, `getAllLandings`) — el borrador que crearía la IA es una entrada más de este mismo CPT |
| Schema de bloques ACF | `src/data/acf-schema.json` | Los layouts reales (`hero`, `cards`, `form`, `footer`) a los que la IA tiene que mapear su output — no hay que inventar campos fuera de acá |
| Tokens + tipografía por BU | `src/data/design-md/*.md` + `src/lib/design-md.ts` | El motor de marca que resuelve la IA al pintar el preview y al generar el borrador (ver `CLAUDE.md`, sección "`design.md` por BU") — hoy cubre 3 de 9 BU |
| Registro de BUs vigentes | `src/data/bu-colors.json` / `global.css` | 9 BU con sus 5 roles de color, capa de compatibilidad para widgets ya construidos con `theme.ts` |

Alcance de arquitectura: este documento asume **WordPress headless** como CMS (el stack vigente hoy, no un backend alternativo tipo Payload explorado en otro análisis de arquitectura aparte).

## Documentación extendida (para humanos / presentación)

Este archivo es la referencia técnica compacta para un agente. Para el desarrollo completo, con tablas comparativas, diagramas visuales y ejemplos, ver los artifacts publicados:
- **"Del prompt al preview"** — fase cliente en detalle (UI journey, spec del visor).
- **"Del prompt al sitio publicado"** — fase backend/Dev en detalle.
- **"Del Prompt a Landing"** — documento maestro que fusiona ambos.

## 1. Visión general

Tres capas, en este orden:

```
Cliente (UI + IA)  →  Middleware & WordPress (CMS)  →  Dev / Frontend (Astro + Tailwind)
```

1. **Cliente**: elige su BU, describe la landing que necesita (método híbrido), revisa un preview en vivo, aprueba.
2. **Middleware & WordPress**: interpreta ese input, lo mapea a los layouts reales de `acf-schema.json`, crea una entrada del CPT `landings` en estado **Borrador**.
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

Al terminar, se entrega una URL temporal con el boceto ya pintado según el `design.md` de la BU. Componentes esperados:
- Contenedor responsive con toggle Desktop/Mobile.
- Panel lateral: editar textos puntuales, regenerar una sección específica (solo esa, no toda la landing), cambiar variante de color dentro de la misma BU.
- Acción principal: aprobar → dispara la sección 3.

## 3. Middleware & creación del borrador en WordPress

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

3. **POST por REST API (o GraphQL)** a WordPress, creando una entrada del CPT `landings` en estado **Borrador**, con todos los bloques ya cargados. No es visible en el sitio público — un Borrador no se renderiza en producción.

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
   - Costo aproximado (cotizar antes de comprometer presupuesto): S3 Standard cuesta USD 0.023/GB-mes en el tier más barato (ej. us-east-1); para este tamaño de sitio queda en centavos. CloudFront tiene free tier perpetuo de 1TB/mes, costo incremental típico de un dígito de dólares/mes. SiteGround no es gasto nuevo.

## 5. Tabla de responsabilidades

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| Cliente | Selecciona BU, completa el método híbrido, revisa y aprueba el preview | — (arranca el proceso) | Preview aprobado |
| Middleware & WordPress | Interpreta el input, resuelve marca vía `design.md`, mapea a `acf-schema.json`, crea la entrada en WP | Preview aprobado | Entrada `landings` en Borrador, con bloques generados |
| Dev / Marketing Ops | Completa contenido, imágenes, SEO, Open Graph, QA responsive, publica | Entrada en Borrador | Sitio publicado en producción |
