# Documento Oficial de Definición de Roles y Perfiles de Usuario

**Proyecto**: Generador de Landings — Arquitectura Headless (WordPress + Astro + Tailwind CSS)
**Versión**: 1.0
**Fecha de emisión**: Julio 2026
**Clasificación**: Documento estratégico interno — Stakeholders y directivos
**Estado**: Borrador para revisión

---

## 1. Resumen Ejecutivo — Arquitectura de un Vistazo

El presente documento establece el modelo de roles, perfiles, responsabilidades y flujos de trabajo del ecosistema digital **Generador de Landings**, una plataforma basada en una **arquitectura Headless CMS** desacoplada en dos capas técnicas independientes que se comunican a través de una interfaz de programación de aplicaciones (API).

### 1.1. Separación de capas

| Capa | Tecnología | Función | Audiencia principal |
| --- | --- | --- | --- |
| **Backend (CMS)** | WordPress Headless sobre SiteGround | Administración de contenidos, landings, unidades de negocio, design system | Marketing, editores, administradores de contenido |
| **Frontend (Visualización)** | Astro + Tailwind CSS v4 sobre AWS S3 + CloudFront | Renderizado estático del sitio público, performance óptima, SEO | Usuarios finales / visitantes |

### 1.2. Arquitectura de un vistazo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       USUARIO FINAL / VISITANTE                         │
│              (Navegador web, mobile, tablet)                           │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Astro + Tailwind)                         │
│                  AWS S3 + CloudFront (CDN global)                       │
│              HTML estático pre-construido en build time                  │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ REST API + GraphQL (build time)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   BACKEND (WordPress Headless)                          │
│              SiteGround — Solo admin (sin frontend público)             │
│   Custom Post Types + ACF Flexible Content + REST API expuesta          │
│   + Plugin IA (Gemini dev / AWS Bedrock prod, login nativo WP)          │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ Admin (wp-admin)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              EQUIPO DE MARKETING / DESARROLLADORES                       │
│         WordPress admin (login nativo) + GitHub Actions + S3/CloudFront  │
│         (staging = prefijo `staging/` del mismo bucket)                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3. Ventajas de la arquitectura Headless por perfil

| Beneficio | Marketing | Desarrollo | Negocio |
| --- | --- | --- | --- |
| **Velocidad de creación** | De 5 días a 1-2 días por landing | Componentes reusables en Astro | Time-to-market reducido |
| **Performance del sitio** | N/A (no toca código) | Lighthouse 95+ | Mejor SEO y conversión |
| **Independencia de equipos** | Crea contenido sin esperar devs | Desarrolla sin bloquear marketing | Equipos paralelos |
| **Costo operativo** | Sin licencia de Elementor Pro | Open source + serverless | ~$30-100/mes total |
| **Seguridad** | WP no expuesto públicamente | Build estático sin superficie de ataque | Menor riesgo |

---

## 2. Matriz de Roles y Perfiles

### 2.1. Resumen de perfiles

| # | Perfil | Capa | Acceso principal | Frecuencia de uso |
|---|---|---|---|---|
| 1 | Solicitante de Landing (Marketing) | WordPress (plugin IA) | Chat con IA dentro de WP — login con cuenta WP nativa, rol limitado | Diaria |
| 2 | Administrador de Marketing / Growth / SEO — funciones de **Administrador** y **Supervisor** | Backend (WordPress) + Plugin IA | wp-admin (rol: Administrator), plugin IA | Diaria |
| 3 | Desarrollador Frontend | Frontend (Astro) + Backend (WP) | GitHub, VS Code, Terminal, **WordPress admin** | Diaria |
| 4 | Administrador de Sistemas / DevOps | Infraestructura | AWS Console, SiteGround, GitHub Actions | Semanal |
| 5 | Usuario Final / Visitante Web | Frontend público | Navegador web | Variable (tráfico del sitio) |

### 2.2. Matriz de permisos por capa

| Perfil | Chat IA (plugin en WP) | WordPress Admin (`wp-admin`) | GitHub Repo | AWS Console | SiteGround Panel | Frontend público |
|---|---|---|---|---|---|---|
| Solicitante (Marketing) | ✅ Solicita + valida previews (login WP, rol limitado) | ⚠️ Solo el plugin de solicitud, no el panel general | ❌ | ❌ | ❌ | ✅ Solo lectura |
| Administrador Marketing | ✅ Valida previews | ❌ | ❌ | ❌ | ❌ | ✅ Solo lectura |
| Desarrollador Frontend | ⚠️ Lectura de previews | ✅ **Construye landings** | ✅ Push/Merge/Deploy | ⚠️ Lectura | ⚠️ Lectura | ✅ Solo lectura |
| Administrador Sistemas | ⚠️ Lectura | ⚠️ Lectura (debug) | ✅ Admin (settings, secrets) | ✅ Control total | ✅ Control total | ✅ Solo lectura |
| Usuario Final | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Lectura |

---

## 3. Detalle por Perfil

### 3.1. Perfil: Solicitante de Landing (Marketing)

#### Nivel de acceso

- **Rol WordPress**: rol nativo limitado (ej. `landing_client`) — login con su propia cuenta de WordPress, sin acceso al panel administrativo general
- **Acceso**: solo al chat/wizard con IA (plugin dentro de WordPress) y a su propio historial de solicitudes ("Mis solicitudes")
- **No tiene acceso**: al panel de administración de WordPress (`wp-admin` general), código fuente, ni infraestructura

#### Herramientas e interfaces

| Herramienta | Propósito |
|---|---|
| Chat/wizard con IA (plugin dentro de WordPress) | Solicitar landings mediante prompts en lenguaje natural — no es una aplicación aparte, corre como plugin PHP sobre la misma instalación de WP |
| Interfaz de preview | Revisar el preview visual generado por la IA antes de aprobar — build puntual servido desde `previews/` en S3 + CloudFront |
| Brief de campaña (recurso externo) | Documento con objetivos, audiencia, BU, copy base, deadline |

#### Responsabilidades principales

- **Solicitar landings** a través del chat con IA describiendo el tipo de landing, bloques necesarios e información clave
- **Proporcionar contenido base** a la IA: textos principales, llamadas a la acción, imágenes, links
- **Validar el preview** generado por la IA y dar feedback iterativo hasta lograr el resultado deseado
- **Aprobar el preview final** que se entrega al equipo de Desarrollo para construirlo
- Definir la **unidad de negocio (BU)** correcta (Pregrado, Pregrado Ejecutivo, Instituto de Emprendedores, etc.) para que la IA aplique la paleta de colores adecuada
- Mantener el **tono y estilo de marca** definido en las guidelines
- Cumplir los lineamientos de marca y SEO básico (títulos < 60 chars, descripciones < 160 chars)

#### Flujo de trabajo típico

1. **Recibe el briefing** de la campaña (objetivo, audiencia, BU, deadline, copy base)
2. **Accede al chat con IA dentro de WordPress** (login con su cuenta) y abre un nuevo chat de solicitud
3. **Describe la landing** en lenguaje natural: "Necesito una landing para Pregrado Ejecutivo sobre la Maestría en Marketing Digital, debe tener hero con CTA principal a inscripción, 3 cards de especializaciones, sección de testimonios, y formulario de contacto"
4. **Proporciona la información** que la IA pide (textos, imágenes, links)
5. **Recibe el preview** generado por la IA (estructura de widgets + contenido)
6. **Itera con feedback**: "cambia el CTA", "agrega una sección de beneficios", etc.
7. **Aprueba el preview final** que se entrega al equipo de Desarrollo
8. **Espera la notificación** del equipo cuando la landing esté publicada en producción

---

### 3.2. Perfil: Administrador de Marketing / Growth / SEO

Este perfil cumple **dos funciones distintas**, hoy combinadas en la misma persona/rol WP — se listan por separado porque son responsabilidades de naturaleza distinta:

- **Función Administrador** (gestión de plataforma): usuarios, plugins, ACF, taxonomías, configuración técnica del CMS — nivel de acceso alto (`Administrator` en WP).
- **Función Supervisor** (aprobador de solicitudes): revisa y aprueba (o rechaza con feedback) cada solicitud de landing del Solicitante antes de que pase a Desarrollo — es el punto de control de calidad/marca entre "Marketing pidió algo" y "Dev lo construye".

#### Nivel de acceso

- **Rol WordPress**: Administrator
- **Acceso**: Panel completo de WordPress + herramientas externas de marketing/analytics

#### Herramientas e interfaces

| Herramienta | Propósito |
| --- | --- |
| WordPress Admin (rol Admin) | Gestión completa: usuarios, plugins, ACF, taxonomías, diseño de menús |
| Google Analytics / GTM | Análisis de tráfico, conversiones y embudos |
| Google Search Console | Monitoreo de indexación, Core Web Vitals, sitemaps |
| HubSpot CRM | Lead scoring, formularios, automatización de marketing |
| SEMrush | Keyword research, auditoría SEO, backlinks |
| Microsoft Clarity | Mapas de calor, grabación de sesiones, análisis UX |

#### Responsabilidades principales

- Aprobar landings antes de su publicación final
- Configurar **tags de rastreo** (Google Tag Manager, Meta Pixel, LinkedIn Insight Tag) en cada landing
- Gestionar **taxonomías y categorías** (programas, facultades, modalidades) para mejorar la arquitectura de información
- Optimizar **metadatos SEO** (title tags, meta descriptions, Open Graph, Schema.org)
- Analizar **métricas de conversión** y proponer iteraciones
- Coordinar con desarrollo para cambios estructurales o nuevos widgets
- Gestionar **A/B testing** y experimentos de CRO (Conversion Rate Optimization)
- Aprobar el pase a producción luego de la Marcha Blanca

#### Flujo de trabajo típico

1. **Recibe notificación** de que un Editor ha creado un borrador de landing
2. **Revisa el contenido** en preview (URL temporal de staging)
3. **Verifica SEO**: títulos, descripciones, palabras clave, schema markup
4. **Configura tags de analytics**: agrega conversiones personalizadas en GTM, eventos en Meta Pixel
5. **Aprueba o rechaza** el borrador (con feedback si rechaza)
6. **Coordina con Desarrollador** el deploy a producción cuando está aprobado
7. **Monitorea el rendimiento** post-publicación (CTR, conversiones, bounce rate)

---

### 3.3. Perfil: Desarrollador Frontend

#### Nivel de acceso

- **Acceso**: Repositorio Git (GitHub/GitLab), VS Code, terminal, consola de AWS (lectura), **WordPress admin (rol Editor o Administrator)**

#### Herramientas e interfaces

| Herramienta | Propósito |
|---|---|
| VS Code (o editor preferido) | Desarrollo de componentes Astro, TypeScript, Tailwind |
| Terminal / iTerm2 / Windows Terminal | Comandos `pnpm`, git, Astro CLI |
| Git + GitHub | Control de versiones, branches, pull requests, code review |
| **WordPress Admin (wp-admin)** | **Construcción efectiva de landings: crear entradas en CPT, configurar ACF, seleccionar BU, llenar widgets** |
| Storybook (opcional) | Documentación visual de componentes Astro |
| Chrome DevTools | Debug de CSS, performance, accesibilidad |
| Lighthouse / WebPageTest | Auditoría de performance y SEO |
| AWS Console (lectura) | Ver logs de CloudFront, S3 |
| Microsoft Copilot / Claude Code (provisional) | Asistencia con IA para código y debugging |
| Plugin IA en WordPress (modo lectura) | Recibir previews aprobados por Marketing para construir |

#### Responsabilidades principales

- Mantener el **repositorio Astro** (`/web`) con componentes, layouts, páginas y estilos
- **Construir las landings en WordPress** a partir del preview aprobado por Marketing (selección de BU, configuración de ACF Flexible Content, llenado de widgets)
- Implementar y mantener **componentes reutilizables** que consuman datos del design system V2
- Crear y mantener los **tokens `bu-*`** del Design System V2 (CSS variables + Tailwind config)
- **Construir integraciones** con la REST API de WordPress para consumir landings dinámicamente
- **Optimizar performance**: build estático, lazy loading, critical CSS, optimización de imágenes
- Implementar **CI/CD** vía GitHub Actions (build automático + deploy a S3)
- **Testing**: verificar que el build funcione, validar accesibilidad, responsive
- Mantener la consistencia entre el preview aprobado (Astro) y la versión productiva (WordPress + build estático)
- Resolver issues técnicos reportados por el equipo o usuarios

#### Flujo de trabajo típico

1. **Recibe notificación** de que Marketing aprobó un preview de landing (vía el plugin IA en WordPress)
2. **Revisa el preview aprobado**: estructura de widgets, contenido, BU, CTAs
3. **Accede a WordPress** (`wp-admin`) y crea una nueva entrada en el CPT "Landing"
4. **Selecciona la BU** en el campo correspondiente (esto define la paleta de colores via `data-bu`)
5. **Configura el orden de widgets** mediante Flexible Content de ACF según el preview aprobado (Hero → Cards → Form → Footer)
6. **Llena los campos** de cada widget replicando el contenido del preview (títulos, imágenes, URLs de CTAs, textos legales)
7. **Crea o modifica componentes Astro** en `/web/src/components/` si el preview requiere widgets nuevos
8. **Actualiza tokens del design system** en `/web/src/styles/global.css` si es necesario
9. **Verifica con múltiples BU** cambiando `data-bu="pregrado"` ↔ `data-bu="ejecutivo"` ↔ `data-bu="emprendedores"`
10. **Prueba build de producción** con `pnpm build` y valida performance con Lighthouse
11. **Hace commit, push, y crea Pull Request** con descripción detallada
12. **Merge a main** → GitHub Actions dispara build + deploy automático a staging/producción
13. **Verifica deploy** en el ambiente correspondiente y notifica al equipo

---

### 3.4. Perfil: Administrador de Sistemas / DevOps

#### Nivel de acceso

- **Acceso**: AWS Console (admin), SiteGround Panel (admin), GitHub (admin), secrets manager

#### Herramientas e interfaces

| Herramienta | Propósito |
| --- | --- |
| AWS Console | S3 (hosting estático), CloudFront (CDN), IAM, CloudWatch |
| SiteGround Panel | Gestión del servidor WordPress, backups, SSL, PHP, MySQL |
| GitHub | Settings del repo, Actions (CI/CD), Secrets, branch protection rules |
| Terraform / Pulumi (opcional) | Infrastructure as Code para AWS |
| CloudWatch / Datadog | Monitoring y alertas |
| Let's Encrypt / ACM | Gestión de certificados SSL |
| 1Password / Vault | Gestión de secretos (API keys, tokens) |

#### Responsabilidades principales

- **Administrar la infraestructura AWS**: S3 buckets, CloudFront distributions, IAM roles
- **Mantener el servidor WordPress**: actualizaciones de seguridad, backups automáticos, monitoreo de uptime
- **Gestionar CI/CD**: GitHub Actions workflows, secrets, environment protection rules
- **Configurar CDN y caché**: CloudFront behaviors, TTL, compresión, cache invalidation
- **Monitoreo y alertas**: CloudWatch alarms para errores 5xx, latencia alta, costos excedidos
- **Gestión de secretos**: API key de Gemini (dev), credenciales de AWS Bedrock (prod), AWS credentials, tokens de HubSpot
- **Seguridad**: rate limiting, WAF, headers de seguridad (CSP, HSTS), protección contra DDoS
- **Costos**: monitorear gasto mensual de AWS y SiteGround, alertar si se excede el presupuesto
- **Respuesta a incidentes**: estar disponible para resolver caídas o problemas críticos

#### Flujo de trabajo típico

1. **Monitoreo diario**: revisar dashboards de CloudWatch (errores, latencia, costos)
2. **Backups**: validar que los backups automáticos de WP y de S3 versioning funcionen
3. **Actualizaciones de seguridad**: aplicar parches de WordPress, PHP, Node.js cuando hay vulnerabilidades críticas
4. **Gestión de credenciales**: rotar API keys trimestralmente, actualizar secrets en GitHub
5. **Optimización de costos**: revisar uso de AWS Bedrock en prod (Gemini en dev es gratis), ajustar thresholds de alertas
6. **Respuesta a incidentes**: cuando se reporta un bug crítico, revisar logs, métricas, y desplegar hotfix
7. **Documentación**: mantener actualizada la documentación de infraestructura (runbooks, diagramas)

---

### 3.5. Perfil: Usuario Final / Visitante Web

#### Nivel de acceso

- **Acceso**: Lectura pública del sitio. Sin autenticación requerida.

#### Herramientas e interfaces

| Dispositivo | Navegador típico |
| --- | --- |
| Desktop | Chrome, Firefox, Safari, Edge (últimas 2 versiones) |
| Mobile | Safari iOS, Chrome Android |
| Tablet | Safari iPadOS, Chrome Android |
| Conexión | 4G/5G, WiFi, conexiones lentas (3G fallback) |

#### Responsabilidades (expectativas del perfil)

- **No tiene responsabilidades técnicas**. Su rol es consumir el contenido.
- Sin embargo, su **experiencia** determina el éxito del proyecto:
    - Debe poder encontrar la información rápidamente
    - El sitio debe cargar en menos de 3 segundos (LCP)
    - Debe poder completar acciones (inscripción, descarga, contacto) sin fricción
    - La experiencia debe ser consistente en todos los dispositivos

#### Flujo de trabajo típico (experiencia)

1. **Llega al sitio** vía búsqueda orgánica, redes sociales, email marketing, o publicidad paga
2. **Ve el Hero** con título claro, propuesta de valor y CTA principal visible
3. **Scrollea** por los bloques de contenido (cards de carreras, testimonios, formulario)
4. **Interactúa** con elementos: carruseles, acordeones, tabs, formulario
5. **Completa una conversión**: inscripción, descarga de brochure, agendamiento de cita
6. **Recibe follow-up** vía email o WhatsApp (automatizado por HubSpot)
7. **(Opcional) Comparte** el sitio en redes sociales o recomienda a conocidos

#### Indicadores clave de experiencia (KPIs)

| KPI | Meta | Herramienta de medición |
| --- | --- | --- |
| Largest Contentful Paint (LCP) | < 2.5 segundos | Lighthouse, PageSpeed Insights |
| First Input Delay (FID) | < 100 ms | Core Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Core Web Vitals |
| Bounce rate | < 50% | Google Analytics |
| Tasa de conversión | > 5% (objetivo por landing) | HubSpot + GA |
| Tiempo en página | > 90 segundos | Google Analytics |

---

## 4. Flujo de Aprobación y Publicación (Workflow Completo)

### 4.1. Diagrama del flujo

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 1: SOLICITUD DE LANDING                                          │
│  Marketing Strategist → Chat IA (plugin dentro de WordPress)            │
│  • Define objetivo, audiencia, BU, deadline                            │
│  • Prepara brief con copy base, imágenes, requisitos                   │
│  • Login con su cuenta WP (rol limitado) y describe la landing          │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 2: GENERACIÓN DE PREVIEW POR IA                                  │
│  Plugin IA en WordPress (Gemini en dev, AWS Bedrock en prod)           │
│  • Recibe prompt + información de Marketing                            │
│  • Selecciona widgets del catálogo + tokens `bu-*` de la BU            │
│  • Genera estructura de widgets + contenido en JSON                     │
│  • Dispara un build puntual (GitHub Actions) a `previews/` en S3,       │
│    servido por CloudFront — mismo mecanismo que el deploy real          │
│  • Marketing itera con feedback hasta aprobar el preview                │
│  • Estado: PREVIEW APROBADO                                            │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 3: VALIDACIÓN DE MARKETING (opcional pero recomendado)             │
│  Administrador Marketing / SEO                                         │
│  • Valida copy, tono de marca, SEO on-page del preview                  │
│  • Confirma que el preview refleja el brief original                   │
│  • Aprueba o solicita ajustes (vuelve a Fase 2)                        │
│  • Estado: PREVIEW VALIDADO POR MARKETING                              │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 4: CONSTRUCCIÓN EN WORDPRESS                                      │
│  Desarrollador Frontend                                                  │
│  • Recibe notificación de que hay un preview aprobado                   │
│  • Accede a WordPress (`wp-admin`) y abre la entrada que el plugin IA   │
│    ya creó en Borrador (llamada directa `wp_insert_post`, sin POST      │
│    externo — BU, widgets y textos ya vienen cargados)                   │
│  • Completa lo que la IA no puede resolver: imágenes, SEO, Open Graph   │
│  • Ajusta campos de cada widget si hace falta                           │
│  • Estado: BORRADOR EN WP (asignado a este Dev)                         │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 5: BUILD Y DEPLOY A STAGING                                      │
│  Desarrollador (merge a main) + GitHub Actions                         │
│  • Commit + push del código Astro necesario                             │
│  • Merge a `main` (o PR aprobado)                                       │
│  • GitHub Actions: Astro build → fetch data desde WP REST API          │
│  • Deploy automático a staging (prefijo `staging/` en el mismo bucket   │
│    S3 + CloudFront — sin plataformas nuevas)                            │
│  • URL temporal generada y enviada al equipo                            │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 6: QA Y TESTING                                                  │
│  Desarrollador + Marketing en staging                                   │
│  • Dev valida performance (Lighthouse > 95) y accesibilidad             │
│  • Marketing verifica visualmente que coincide con el preview aprobado   │
│  • Pruebas en múltiples dispositivos (mobile, tablet, desktop)          │
│  • Pruebas cross-browser                                                │
│  • Estado: APROBADO PARA PRODUCCIÓN                                    │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 7: DEPLOY A PRODUCCIÓN                                            │
│  DevOps o Dev con permisos sobre `main`                                │
│  • Merge a `main` (o tag de release)                                    │
│  • GitHub Actions: build → upload a S3 → invalidar CloudFront          │
│  • URL pública activa en minutos                                       │
│  • Notificación al equipo de marketing con URL final                     │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FASE 8: MONITOREO Y OPTIMIZACIÓN POST-LANZAMIENTO                       │
│  Marketing + DevOps                                                     │
│  • Monitoreo de tráfico y conversiones (primeras 24-72h críticas)       │
│  • A/B testing de variantes                                            │
│  • Iteraciones basadas en data (heatmaps, scroll depth, etc.)          │
│  • Solicitud de cambios (vuelve a Fase 1 con nuevo brief)               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Triggers y automatizaciones

| Trigger | Acción | Herramienta |
|---|---|---|
| Marketing aprueba preview en el plugin IA (WP) | Notificación al Desarrollador con el preview | WordPress → Slack/email |
| Merge a `main` en GitHub | Build + deploy a S3 + invalidar CDN | GitHub Actions |
| Lighthouse score < 90 en build | Falla el deploy, notifica al dev | GitHub Actions + Lighthouse CI |
| Error 5xx en CloudFront (> 1% del tráfico) | Alarma a DevOps | CloudWatch Alarm + SNS |
| Marketing solicita cambios post-deploy | Vuelve a Fase 1 con nuevo brief | Slack/email |

### 4.3. Tiempos estimados por fase

| Fase | Responsable | Duración estimada | Bloqueante |
|---|---|---|---|
| 1. Solicitud de landing | Marketing + Asistente IA | 0.5-1 día (con iteración) | — |
| 2. Generación de preview por IA | Plugin IA en WordPress (Gemini/Bedrock) | 5-30 minutos | Depende de Fase 1 |
| 3. Validación de Marketing | Admin Marketing | 0.5 día (opcional) | Depende de Fase 2 |
| 4. Construcción en WordPress | Desarrollador | 1-2 días | Depende de Fase 2/3 |
| 5. Build a staging | Automático | 5-10 minutos | Depende de Fase 4 |
| 6. QA y testing | Desarrollador + Marketing | 0.5 día | Depende de Fase 5 |
| 7. Deploy a producción | DevOps/Dev | 5-10 minutos | Depende de Fase 6 |
| 8. Monitoreo | Marketing + DevOps | Continuo | — |
| **Total** |  | **3-5 días** |  |

### 4.4. Rollback y manejo de incidentes

En caso de error crítico post-deploy:

1. **Detección**: DevOps o usuario reporta error
2. **Diagnóstico**: revisar logs en CloudWatch, verificar último deploy en GitHub Actions
3. **Rollback inmediato**: revertir merge en GitHub → rebuild automático → deploy
4. **Post-mortem**: documentar causa raíz, acción correctiva, prevenir recurrencia

### 4.5. Estado de la solicitud e historial

El post_status nativo de WordPress (Borrador/Publicado) no alcanza para rastrear quién pidió, aprobó y publicó cada landing — se necesitan campos adicionales a nivel de entrada sobre el CPT `landings` (hoy no modelados en `acf-schema.json`, que solo define bloques de contenido; es trabajo pendiente, no implementado todavía):

| Campo (post meta) | Se llena en | Quién lo escribe |
|---|---|---|
| `requested_by` | Fase 1 | Plugin IA, con el usuario WP logueado |
| `client_approved_at` | Fase 2 | Plugin IA, al aprobar el preview |
| `assigned_dev` | Fase 4 | Se asigna cuando un Dev abre el borrador |
| `published_by` / `published_at` | Fase 7 | WordPress, al publicar |

Lifecycle resultante: `Solicitado` → `Preview aprobado` → `Borrador en WP` → `En trabajo (Dev)` → `Publicado`.

Estos campos se exponen vía REST API (`register_rest_field`) para alimentar dos vistas de historial, sin sumar ningún servicio nuevo — todo vive en la base de datos de WordPress que ya existe:

- **Historial del Solicitante** ("Mis solicitudes"): filtra `landings` por `requested_by` = su propio usuario WP.
- **Historial del Dev**: filtra por `assigned_dev` / `published_by` — qué landings tomó y cuáles publicó.

---

## 5. Resumen de Herramientas por Perfil

| Perfil | Herramientas principales | Frecuencia |
|---|---|---|
| **Solicitante (Marketing)** | Plugin IA en WordPress (login WP, rol limitado), Brief de campaña | Diaria |
| **Admin Marketing / SEO** | Plugin IA en WordPress (validación), WordPress Admin, GA, GSC, HubSpot, SEMrush, Microsoft Clarity | Diaria |
| **Desarrollador Frontend** | Plugin IA en WordPress (lectura), WordPress Admin, VS Code, Git, pnpm, Astro CLI, Chrome DevTools | Diaria |
| **Admin Sistemas / DevOps** | AWS Console, SiteGround, GitHub Actions, CloudWatch | Semanal |
| **Usuario Final** | Navegador web (cualquier dispositivo) | Variable |

---

## 6. Glosario

| Término | Definición |
| --- | --- |
| **ACF (Advanced Custom Fields)** | Plugin de WordPress para crear campos personalizados en el editor |
| **Astro** | Framework de sitios estáticos que genera HTML optimizado en build time |
| **BU (Business Unit)** | Unidad de Negocio: Pregrado, Ejecutivo, Emprendedores, etc. |
| **CDN (Content Delivery Network)** | Red de distribución de contenido (ej. CloudFront) |
| **CI/CD (Continuous Integration/Deployment)** | Automatización de build, test y deploy |
| **CMS (Content Management System)** | Sistema de gestión de contenidos (WordPress) |
| **CPT (Custom Post Type)** | Tipo de contenido personalizado en WordPress |
| **Design System V2** | Sistema de diseño del proyecto basado en 5 colores por BU |
| **Headless CMS** | CMS usado solo como backend de datos, sin renderizar frontend |
| **Lighthouse** | Herramienta de Google para medir performance y SEO |
| **pnpm** | Gestor de dependencias para Node.js (alternativa a npm) |
| **REST API** | Interfaz de programación para consumir datos de WordPress |
| **Tailwind CSS** | Framework CSS utility-first |
| **Token `bu-*`** | Variable CSS del Design System V2 que cambia según la BU |

---