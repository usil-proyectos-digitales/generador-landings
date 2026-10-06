# Generador de Landings con IA — Resumen Consolidado

> Este documento sintetiza en un solo lugar la arquitectura, los roles y el cronograma del proyecto. No es backup de ningún artifact ni reemplaza a los documentos fuente — cada sección enlaza al documento del que viene, que sigue siendo la referencia completa para su tema:
>
> - **Arquitectura y flujo E2E** → `docs/artifacts/del-prompt-a-landing.md` (documento maestro, backup del artifact ["Del Prompt a Landing"](https://claude.ai/code/artifact/99f4bc57-6466-4f70-ab06-bdfbfb6a36b7); fusiona a su vez "Del prompt al preview" y "Del prompt al sitio publicado")
> - **Roles y perfiles** → `docs/01-definicion-roles-perfiles.md`
> - **Cronograma** → `docs/03-cronograma-estimado.md`
> - Versión compacta para agentes de IA que trabajen en el código → `AI-LANDING-FLOW.md` (raíz del repo)

## Resumen ejecutivo

Hoy, construir una landing significa que un Dev traduzca a mano un pedido de Marketing a un widget, una variante y una paleta de colores. El Generador de Landings reparte ese trabajo en tres capas, cada una con una responsabilidad clara y un límite explícito de hasta dónde llega antes de pasarle la posta a la siguiente:

| Capa | Tecnología | Función | Audiencia principal |
|---|---|---|---|
| **Backend (CMS)** | WordPress Headless sobre SiteGround | Administración de contenidos, landings, unidades de negocio (BU), design system, plugin IA | Marketing, editores, administradores de contenido |
| **Frontend (Visualización)** | Astro + Tailwind CSS v4 sobre AWS S3 + CloudFront | Renderizado estático del sitio público, performance, SEO | Usuarios finales / visitantes |

El cliente nunca publica nada directamente, y la IA tampoco: el resultado del lado del cliente es siempre un **preview**; el resultado del lado de la IA/middleware es siempre un **borrador** en WordPress; el sitio en producción solo existe después de que un Dev humano lo revisa y publica.

**WordPress headless es la decisión de backend** — el stack vigente hoy en el repo (`wp-api.ts`, `acf-schema.json`). Se descartó explícitamente considerar Payload u otras alternativas; no hay comparación pendiente.

Ventajas por perfil:

| Beneficio | Marketing | Desarrollo | Negocio |
|---|---|---|---|
| **Velocidad de creación** | De 5 días a 1-2 días por landing | Componentes reusables en Astro | Time-to-market reducido |
| **Performance del sitio** | N/A (no toca código) | Lighthouse 95+ | Mejor SEO y conversión |
| **Independencia de equipos** | Crea contenido sin esperar devs | Desarrolla sin bloquear marketing | Equipos paralelos |
| **Costo operativo** | Sin licencia de Elementor Pro | Open source + serverless | ~USD 30-35/mes (ver sección Costos) |
| **Seguridad** | WP no expuesto públicamente | Build estático sin superficie de ataque | Menor riesgo |

## Arquitectura y flujo E2E

### Las tres capas

```
Cliente (UI + IA)       Middleware & WordPress            Dev / Frontend
[WordPress · Plugin PHP] → [WordPress · Plugin PHP]     →  [Astro + Tailwind]

Selecciona BU,          Interpreta el input,             Completa contenido, SEO,
describe la landing,    mapea a bloques ACF,              QA y publica —
revisa y aprueba        crea la entrada en                dispara el rebuild
un preview              Borrador                          del sitio
```

Las capas 1 y 2 corren dentro del **mismo plugin PHP en WordPress** — la separación es de responsabilidad (qué ve el cliente vs. qué pasa tras aprobar), no de sistema técnico. Astro entra recién en la capa 3, como consumidor de solo lectura de la REST API de WP — nunca antes.

**Motor de marca**: tanto el preview del cliente como el borrador que recibe WordPress se pintan con el `design.md` por Unidad de Negocio (color, tipografía y roles) — el enfoque de theming en adopción, que reemplaza al esquema anterior de clases de color fijas por BU. Hoy cubre 3 de las 9 BU (ver Cronograma).

| Capa | Qué hace | Recibe | Entrega |
|---|---|---|---|
| **Cliente** | Elige su BU, completa el wizard híbrido y revisa el preview en tiempo real. | — (arranca el proceso) | Preview aprobado |
| **Plugin IA & WordPress** | Interpreta el input, resuelve marca vía `design.md`, mapea a los layouts de ACF y crea la entrada — sin salir de la misma instalación de WP. | Preview aprobado | Entrada `landing` en Borrador, con bloques generados |
| **Dev / Marketing Ops** | Completa contenido, imágenes, SEO, Open Graph, hace QA responsive y publica. | Entrada en Borrador | Sitio publicado y en producción |

### Interfaces y user journey del cliente

| Paso | Qué pasa |
|---|---|
| **0 — Login** | El usuario entra con su propia cuenta de WordPress (login y roles nativos, sin sistema de usuarios aparte) — identifica quién hace la solicitud y habilita su historial personal ("Mis solicitudes"). |
| **1 — Selección de BU** | Único paso obligatorio antes de tocar contenido: grilla de 9 BU, cada una con su combinación real de color. Al elegir una se carga su `design.md`. Fija para toda la sesión; cambiarla reinicia el preview. |
| **2 — Método de entrada híbrido** | **Obligatorio**: objetivo de la landing, título/propuesta, oferta o dato clave, llamado a la acción — mapean directo a las props que necesita un widget. **Opcional**: texto libre (tono/contexto) + adjuntar Word/PDF con el brief ya armado. La cantidad exacta de campos obligatorios está en fase de definición/mapeo, es modular por diseño. |
| **3 — "Thinking UI"** | Pantalla de progreso con pasos visibles, no un spinner genérico: leyendo el contenido → eligiendo la estructura (widget/variante) → aplicando el estilo de marca (`design.md`) → armando el boceto. Nada de esto persiste, es efímero. |
| **4 — Visor de preview** | URL temporal con un build real de Astro (disparado por GitHub Actions, subido a `previews/` en el bucket S3, servido por CloudFront) — toggle Desktop/Mobile, editar textos, regenerar una sección puntual, alternar modo claro/oscuro. Acción principal: aprobar y enviar. |

**Por qué el método híbrido**: la IA entrega al final una selección de widget + variante + props tipadas, no texto plano. Los campos obligatorios bajan drástico la tasa de preview incompleto; el texto libre y el documento adjunto absorben lo que un formulario rígido no previó.

### Procesamiento IA y creación de borrador en WordPress

1. **El plugin IA (dentro de WordPress) interpreta el input** — traduce el wizard híbrido a la estructura real que WordPress espera: un layout de ACF Flexible Content por cada bloque. Corre como código PHP dentro de la misma instalación de WordPress en SiteGround, no es una aplicación externa con hosting propio.
2. **Arma el JSON por bloque** — cada bloque mapea 1 a 1 a un layout existente (`hero`, `cards`, `form`, `footer`), sin inventar campos fuera del esquema:

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

   `image_url`/`image_alt` quedan pendientes — los completa el Dev.
3. **Crea la entrada en WordPress, en Borrador** — `wp_insert_post` + campos ACF, sin POST a un sistema externo. Queda una entrada `landing` en estado **Borrador**, no visible en el sitio público, con el solicitante registrado en `requested_by` (ver Roles, auth e historial más abajo).

**Caso especial — campos de configuración**: un widget `form` necesita un `hubspot_form_id` real; la IA no puede inventarlo, queda vacío y es responsabilidad del Dev completarlo antes de publicar.

### Workflow operativo técnico del Desarrollador

Seis pasos, todos sobre la misma entrada en Borrador — sin handoff a otro sistema. El Dev usa su propio login/rol nativo de WordPress; al abrir el borrador queda registrado en `assigned_dev`, y al publicar en `published_by`/`published_at`.

1. **Contenido** — revisión y curaduría de textos en ACF (`cta_text` ≤ 30, `title` ≤ 80).
2. **Recursos gráficos** — completar `image_url`/`image_alt`, imágenes de fondo e iconografía según el `design.md` de la BU.
3. **SEO técnico** — título SEO, meta descripción, slug y encabezados, configurado directo en WordPress.
4. **Open Graph / redes sociales** — `og:image`, `og:title`, `og:description`, mismo tratamiento manual que el SEO.
5. **QA responsive** — sobre Astro + Tailwind, mobile-first.
6. **Publicación y trigger de build** — Borrador → Publicado dispara un webhook que arranca el rebuild (GitHub Actions) + redeploy a S3/CloudFront:

   | Pieza | Rol |
   |---|---|
   | **Astro** (framework) | El build (GitHub Actions) corre `pnpm build`: consulta la REST API de WordPress y compila todas las páginas de antemano. |
   | **WordPress** (CMS) | Vive en SiteGround, separado de AWS — solo expone contenido vía REST API en el momento del build. |
   | **S3** (storage) | Un *bucket* es un contenedor de object storage en AWS — guarda el HTML/CSS/JS/imágenes que generó Astro. |
   | **CloudFront** (CDN) | Delante del bucket: HTTPS, cachea en *edge locations* globales, se invalida en cada publicación. |

### Roles, autenticación e historial de solicitudes

*Diseño, no implementado — mismo estado que el resto del flujo IA.*

Cuatro roles nativos de WordPress, sin tabla de usuarios aparte (ver detalle completo en la sección "Roles y perfiles" más abajo):

| Rol | Acceso |
|---|---|
| **Cliente** (Marketing / Solicitante) | Rol WP limitado (ej. `landing_client`) — login con su cuenta, acceso solo al plugin IA y a su propio historial. |
| **Supervisor** (Marketing Lead / SEO) | Revisa y aprueba (o rechaza con feedback) cada solicitud antes de pasar a Desarrollo. |
| **Dev** | Rol editor/admin sobre el CPT `landings`. |
| **Administrador** | Gestión de la plataforma: usuarios, roles, plugins, configuración técnica. |

Hoy Supervisor y Administrador son la misma persona/rol, pero son dos funciones distintas — se listan por separado por si conviene separarlas más adelante.

**Login**: un solo sistema de identidad (usuarios y roles nativos de WordPress). El plugin IA autentica contra el login de WP vía **Application Passwords** o un plugin tipo **JWT Authentication for WP REST API** (a definir en implementación). El sitio Astro no implementa auth — sigue siendo un consumidor de solo lectura de la REST API pública de WP.

**Campos custom de historial** (post meta sobre `landings`, hoy no modelados en `acf-schema.json` — gap explícito, trabajo pendiente):

| Campo | Se llena en | Quién lo escribe |
|---|---|---|
| `requested_by` | Login / solicitud inicial | Plugin IA, con el usuario WP logueado |
| `client_approved_at` | Aprobación del preview | Plugin IA |
| `assigned_dev` | Cuando un Dev abre el borrador | Se asigna automáticamente |
| `published_by` / `published_at` | Al publicar | WordPress |

Lifecycle: `Solicitado` → `Preview aprobado` → `Borrador en WP` → `En trabajo (Dev)` → `Publicado`.

Estos campos se exponen vía REST API (`register_rest_field`) para dos vistas de historial dentro del plugin IA: **"Mis solicitudes"** (Cliente, filtrado por `requested_by`) e **historial del Dev/Supervisor** (filtrado por `assigned_dev`/`published_by`).

## Roles y perfiles

### Matriz de permisos por capa

| Perfil | Chat IA (plugin en WP) | WordPress Admin (`wp-admin`) | GitHub Repo | AWS Console | SiteGround Panel | Frontend público |
|---|---|---|---|---|---|---|
| Solicitante (Marketing) | ✅ Solicita + valida previews | ⚠️ Solo el plugin de solicitud | ❌ | ❌ | ❌ | ✅ Solo lectura |
| Administrador Marketing | ✅ Valida previews | ❌ | ❌ | ❌ | ❌ | ✅ Solo lectura |
| Desarrollador Frontend | ⚠️ Lectura de previews | ✅ **Construye landings** | ✅ Push/Merge/Deploy | ⚠️ Lectura | ⚠️ Lectura | ✅ Solo lectura |
| Administrador Sistemas | ⚠️ Lectura | ⚠️ Lectura (debug) | ✅ Admin (settings, secrets) | ✅ Control total | ✅ Control total | ✅ Solo lectura |
| Usuario Final | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Lectura |

### Detalle por perfil

**1 — Solicitante de Landing (Marketing)**: rol WP limitado (`landing_client`), login con su propia cuenta, sin acceso al panel administrativo general. Solicita landings describiendo tipo, bloques e información clave; provee contenido base; valida y aprueba el preview final; define la BU correcta; cumple lineamientos de marca y SEO básico (títulos < 60 chars, descripciones < 160 chars).

**2 — Administrador de Marketing / Growth / SEO** (dos funciones distintas, hoy combinadas en la misma persona/rol WP):
- *Función Administrador*: usuarios, plugins, ACF, taxonomías, configuración técnica del CMS.
- *Función Supervisor*: aprueba o rechaza cada solicitud antes de pasar a Desarrollo — punto de control de calidad/marca.

Herramientas: WordPress Admin, Google Analytics/GTM, Google Search Console, HubSpot CRM, SEMrush, Microsoft Clarity. Responsabilidades: aprobar landings, configurar tags de rastreo, gestionar taxonomías, optimizar metadatos SEO, analizar conversión, gestionar A/B testing, aprobar el pase a producción luego de la Marcha Blanca.

**3 — Desarrollador Frontend**: acceso a GitHub, VS Code, terminal, consola AWS (lectura) y **WordPress admin** (rol Editor/Administrator — ahí construye efectivamente las landings). Mantiene el repo Astro, construye las landings en WordPress a partir del preview aprobado (selecciona BU, configura ACF Flexible Content, llena widgets), implementa componentes reutilizables y tokens `bu-*`, optimiza performance, mantiene CI/CD vía GitHub Actions, hace testing y resuelve issues técnicos.

**4 — Administrador de Sistemas / DevOps**: acceso admin a AWS Console, SiteGround Panel, GitHub, secrets manager. Administra infraestructura AWS (S3, CloudFront, IAM), mantiene el servidor WordPress (seguridad, backups, uptime), gestiona CI/CD y secrets (API keys de Gemini/Bedrock, credenciales AWS, tokens HubSpot), configura CDN/caché, monitorea costos y responde a incidentes.

**5 — Usuario Final / Visitante Web**: lectura pública, sin autenticación. Sin responsabilidades técnicas, pero su experiencia determina el éxito del proyecto — debe encontrar información rápido, el sitio debe cargar en < 3s (LCP), completar conversiones sin fricción, experiencia consistente en todo dispositivo.

| KPI | Meta | Herramienta de medición |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5 segundos | Lighthouse, PageSpeed Insights |
| First Input Delay (FID) | < 100 ms | Core Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Core Web Vitals |
| Bounce rate | < 50% | Google Analytics |
| Tasa de conversión | > 5% (objetivo por landing) | HubSpot + GA |
| Tiempo en página | > 90 segundos | Google Analytics |

## Flujo de aprobación y publicación

Ocho fases, desde la solicitud de Marketing hasta el monitoreo post-lanzamiento:

| Fase | Responsable | Qué pasa | Duración estimada |
|---|---|---|---|
| 1. Solicitud de landing | Marketing + Asistente IA | Define objetivo, audiencia, BU, deadline; describe la landing con su cuenta WP | 0.5-1 día (con iteración) |
| 2. Generación de preview por IA | Plugin IA en WordPress | Selecciona widgets + tokens de la BU, genera estructura y contenido en JSON, dispara build puntual a `previews/`; Marketing itera hasta aprobar | 5-30 minutos |
| 3. Validación de Marketing (opcional) | Admin Marketing | Valida copy, tono de marca, SEO on-page | 0.5 día |
| 4. Construcción en WordPress | Desarrollador | Abre el borrador que el plugin IA ya creó (`wp_insert_post`, sin POST externo); completa imágenes, SEO, Open Graph | 1-2 días |
| 5. Build y deploy a staging | Automático | GitHub Actions: Astro build → fetch desde WP REST API → deploy a `staging/` en el mismo bucket | 5-10 minutos |
| 6. QA y testing | Dev + Marketing | Performance (Lighthouse > 95), accesibilidad, verificación visual contra el preview, multi-dispositivo y cross-browser | 0.5 día |
| 7. Deploy a producción | DevOps/Dev | Merge a `main` → build → upload a S3 → invalidar CloudFront | 5-10 minutos |
| 8. Monitoreo | Marketing + DevOps | Tráfico y conversiones (24-72h críticas), A/B testing, iteraciones basadas en datos | Continuo |
| **Total** | | | **3-5 días** |

**Triggers y automatizaciones**: aprobación de preview → notifica al Dev · merge a `main` → build+deploy+invalidar CDN · Lighthouse < 90 en build → falla el deploy y notifica · error 5xx > 1% del tráfico en CloudFront → alarma a DevOps · solicitud de cambios post-deploy → vuelve a Fase 1.

**Rollback**: detección (DevOps o reporte de usuario) → diagnóstico (logs en CloudWatch, último deploy en GitHub Actions) → rollback inmediato (revertir merge → rebuild automático → deploy) → post-mortem (causa raíz, acción correctiva).

## Costos y presupuesto

> Precios de lista pública investigados en septiembre de 2026 — no son la factura real de la organización; confirmar con Infraestructura/DevOps el monto efectivamente facturado.

### Resumen mensual

| Partida | Costo mensual | Nota |
|---|---|---|
| SiteGround (WP headless) | **USD 29.99** (plan GrowBig, precio de renovación) | Ya contratado, no es gasto nuevo. |
| AWS S3 (storage del sitio estático) | < USD 1 | USD 0.023/GB/mes (S3 Standard) para unos pocos GB. |
| AWS CloudFront (CDN) | USD 0 esperado | Free tier permanente: 1 TB de salida + 10M requests/mes. |
| GitHub Actions (build/deploy) | USD 0 | Repo público → minutos de runner ilimitados y gratis. |
| AWS Bedrock — Claude Haiku 4.5 (IA, producción) | USD 0.25 – 4.50 (variable) | Pago por token, sin costo fijo. |
| Google Gemini (IA, dev) | USD 0 | Tier gratis, solo desarrollo/pruebas. |
| **Total estimado** | **~USD 30 – 35/mes** | SiteGround domina el presupuesto; IA e infraestructura AWS son ruido en comparación. |

### Detalle del costo de IA (Bedrock, producción)

Claude Haiku 4.5 on-demand: USD 1.00/millón de tokens de entrada, USD 5.00/millón de salida. Una generación típica (~5.000 in / 2.000 out) cuesta ~USD 0.015/llamada (~USD 0.02 con documento adjunto).

| Escenario | Landings/mes | Llamadas/landing | Costo mensual |
|---|---|---|---|
| Mes más bajo observado (agosto) | 6 | 6 | USD 0.54 |
| Promedio declarado | 15 | 3–6 | USD 0.67 – 1.35 |
| Mes pico observado (junio) | 36 | 3–6 | USD 1.62 – 3.24 |
| Pico + todas con documento adjunto | 36 | 6 | USD 4.32 |
| Régimen estable, post-adopción | 15 | 1–2 | USD 0.23 – 0.45 |

Incluso en el escenario más caro observado, el costo mensual de IA no pasa de ~USD 4.50 — con margen amplio sobre la cuota por defecto de Bedrock (~200.000 tokens/minuto por modelo). Es un tema puramente de costo (trivial), no de capacidad.

### Detalle de infraestructura

- **SiteGround (GrowBig)**: USD 29.99/mes (USD 359.88/año), infraestructura ya contratada.
- **AWS S3 + CloudFront**: ninguno escala con la cantidad de landings a un ritmo que importe — S3 pasaría de centavos a ~USD 1/mes solo con miles de landings acumulados (a este ritmo, décadas); CloudFront depende del tráfico, con free tier que cubre cientos de miles de visitas/mes.
- **GitHub Actions**: sin costo mientras el repo sea público; si pasara a privado, el plan Free da 2.000 minutos/mes antes de facturar por minuto.

## Cronograma

> Fecha de referencia: 02/09/2026. Arranque tentativo usado como ejemplo: 14/09/2026 — no es un compromiso, es solo una referencia de cálculo. Todo el trabajo (Javier y el área de Diseño) se calcula a razón de **4 horas/día**.

**El dato principal es la duración, no un rango de fechas.** El cronograma tiene dos tracks en paralelo:

- **Track Diseño** — construir los 9 `design.md`. A cargo del área de Diseño. **12 días hábiles.**
- **Track Javier** — widgets, WP e IA. Es el **camino crítico**: **72 días hábiles** de trabajo a 4h/día.

Como el track de Diseño es más corto que la ventana en la que Javier lo necesita, no extiende la duración total — el número que manda es el de Javier.

### Track Javier (camino crítico)

| # | Tarea | Duración |
|---|---|---|
| 1 | Reconstruir los 4 widgets existentes con `design.md` de prueba | 4 días |
| 2 | Construir los 8 bloques V1→V2 restantes con `design.md` (+ swap a los oficiales) | 21 días |
| 3 | Testing — Widgets (12 widgets × 9 BU) | 3 días |
| 4 | WP: CPT + ACF (+ campos custom de historial) | 5 días |
| 5 | WP: Flexible Content de ACF por widget | 4 días |
| 6 | IA — Fase 1: enseñar a la IA qué widgets usar | 4 días |
| 7 | IA — Fase 2.1: login/roles nativos de WP | 2 días |
| 8 | IA — Fase 2.2: plugin con motor de IA intercambiable + ACF + borrador | 5 días |
| 9 | IA — Fase 3.1: UI chat/wizard (Cliente) | 3 días |
| 10 | IA — Fase 3.2: UI aprobación (Supervisor) + historial | 3 días |
| 11 | IA — Fase 3.3: setup del pipeline de deploy (GitHub Actions → S3 + CloudFront) | 5 días |
| 12 | IA — Fase 3.4: pipeline de preview on-demand | 3 días |
| 13 | IA — Fase 4: mejorar la IA para casos edge | 4 días |
| 14 | Testing — Widgets + IA | 6 días |
| | **Total camino crítico** | **72 días hábiles** |

**Nota sobre la Fase 3.3**: nada del pipeline de deploy existe hoy en el repo (sin `.github/workflows/`, sin integración AWS en `astro.config.mjs`, sin credenciales en `.env`) — se confirmó investigando el código. El bucket S3 + CloudFront + credenciales los provee el área de Infraestructura; Javier arma el workflow de GitHub Actions sobre esa base.

### Totales y proyección

- Track Diseño: 12 días hábiles (paralelo, no se suma al camino crítico).
- Track Javier: 72 días hábiles.
- + 15 días de calendario de Marcha Blanca (monitoreo post-producción, corre todos los días incluyendo feriados y fines de semana, no consume horas de desarrollo).

| Hito | Fecha tentativa (arrancando 14/09/2026) |
|---|---|
| Arranque (ambos tracks) | lun 14/09/2026 |
| Fin Track Diseño | mar 29/09/2026 |
| Fin Track Javier (camino crítico) | jue 31/12/2026 → vie 08/01/2027 |
| Marcha Blanca (15 días de calendario) | sáb 09/01/2027 → sáb 23/01/2027 |
| **Fin proyectado tentativo** | **sábado 23 de enero de 2027** |

### Supuestos y riesgos principales

- El paralelismo depende de que Diseño entregue los `design.md` oficiales a tiempo (alrededor del día 12) — un atraso puede generar tiempo de espera no modelado.
- Otros feriados peruanos no considerados (8 de octubre, 1 de noviembre, etc.) suman ~1 día hábil cada uno si aplican.
- La Fase 3.3 (5 días) es el supuesto más blando: no hay tiempos confirmados por Infraestructura para dejar el AWS listo.
- La tarea #2 (8 bloques nuevos, 21 días) es la estimación más incierta — puede variar según la complejidad real de cada bloque.
- Estimaciones no confirmadas ítem por ítem — se muestran para revisión y ajuste.

## Glosario

| Término | Definición |
|---|---|
| **ACF (Advanced Custom Fields)** | Plugin de WordPress para crear campos personalizados en el editor. |
| **Astro** | Framework de sitios estáticos que genera HTML optimizado en build time. |
| **BU (Business Unit)** | Unidad de Negocio: Pregrado, Posgrado, Instituto de Emprendedores, etc. (9 BU definidas). |
| **Bucket** | Contenedor de object storage en AWS S3 — no una base de datos ni un servidor que ejecuta código. |
| **CDN (Content Delivery Network)** | Red de distribución de contenido (ej. CloudFront). |
| **CI/CD** | Automatización de build, test y deploy. |
| **CMS (Content Management System)** | Sistema de gestión de contenidos (WordPress). |
| **CPT (Custom Post Type)** | Tipo de contenido personalizado en WordPress. |
| **Design System V2 / `design.md`** | Sistema de diseño basado en 5 roles de color + tipografía por BU; `design.md` es el enfoque en adopción (hoy cubre 3 de 9 BU). |
| **Edge location** | Cada punto de copia distribuido de CloudFront por el mundo, el más cercano a cada visitante. |
| **Headless CMS** | CMS usado solo como backend de datos, sin renderizar frontend. |
| **Invalidación de caché** | Orden que descarta la copia vieja en los edge locations de CloudFront — se dispara sola en cada publicación. |
| **Lighthouse** | Herramienta de Google para medir performance y SEO. |
| **pnpm** | Gestor de dependencias para Node.js (alternativa a npm). |
| **REST API** | Interfaz de programación para consumir datos de WordPress. |
| **Tailwind CSS** | Framework CSS utility-first. |
| **Token `bu-*`** | Variable CSS del Design System V2 que cambia según la BU. |
