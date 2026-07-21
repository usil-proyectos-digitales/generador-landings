# Generador de Landings — Astro Frontend (V2)

Frontend público del Generador de LPs V2. Astro consume WordPress headless vía REST API y se compila a HTML estático para desplegar en AWS S3 + CloudFront.

> **Nota:** Este repo es standalone (antes vivía como `web/` dentro de `usil-widgets/`).
> El flujo Astro ↔ WP ↔ deploy se independiza del repo padre a partir de V2.

## Stack

- **Astro 7** — generador de sitios estáticos (output: `static`)
- **TypeScript** strict mode
- **Tailwind CSS v4** vía `@tailwindcss/vite` (CSS-first config con `@theme`)
- **pnpm** — gestor de dependencias (más rápido y eficiente que npm)
- **WordPress Headless** como CMS (SiteGround staging)
- **Google Gemini** en dev (gratis), **AWS Bedrock** en producción

## Estructura

```
.                                 ← raíz de este repo
├── src/
│   ├── pages/           # Rutas del sitio (index.astro = homepage, visor.astro = UI Kit)
│   ├── components/      # Componentes Astro (Hero, Button, widgets/...)
│   ├── layouts/         # Layouts base (BaseLayout.astro)
│   ├── data/            # JSONs del Design System (catálogo widgets, ACF, colores)
│   ├── lib/             # Utilidades (wp-api.ts = cliente REST)
│   ├── styles/          # CSS global con @import "tailwindcss" + @theme + variables V2
│   └── env.d.ts         # Tipos del entorno
├── public/              # Assets estáticos (favicon, etc.)
├── astro.config.mjs     # Config Astro + plugin Vite de Tailwind v4
├── postcss.config.js    # Bloquea el walk-up del postcss.config.js del repo padre
├── tsconfig.json        # TypeScript strict
├── .env.example         # Plantilla de variables de entorno
└── package.json
```

## Setup

### 1. Instalar dependencias

Asegurate de tener [pnpm](https://pnpm.io) instalado (`npm install -g pnpm`).

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tu WP_API_URL real y GEMINI_API_KEY
```

### 3. Levantar dev server

```bash
pnpm dev
# Astro corre en http://localhost:4321
```

## Scripts

Todos los scripts usan `pnpm run <script>`.

| Comando | Acción |
|---|---|
| `pnpm dev` | Levanta Astro dev server (puerto 4321) |
| `pnpm build` | Genera sitio estático en `dist/` |
| `pnpm preview` | Preview del build local |
| `pnpm check` | TypeScript + Astro check |

## Convenciones

### Tokens del Design System V2

Los tokens `bu-*` se definen en `src/styles/global.css` dentro del bloque `@theme` de Tailwind v4 (CSS-first config). Cambian según el BU del `<body data-bu="...">`:

```html
<body data-bu="pregrado">      <!-- usa los 5 colores de Pregrado -->
<body data-bu="emprendedores"> <!-- usa los 5 colores de Emprendedores -->
```

| Token Tailwind | Variable CSS fuente | Uso |
|---|---|---|
| `bg-bu-primary` | `var(--bu-color-brand-primary)` | Botones primarios, links, acentos |
| `bg-bu-secondary` | `var(--bu-color-brand-secondary)` | Botones secundarios |
| `bg-bu-accent` | `var(--bu-color-accent-primary)` | Highlights, badges |
| `bg-bu-surface` | `var(--bu-color-surface-light)` | Fondos, cards |
| `text-bu-text` | `var(--bu-color-neutral)` | Texto principal |
| `bg-bu-widget-card-bg` | `var(--bu-widget-card-bg)` | Card BG redirigible por BU |

Para agregar un nuevo token, editar `src/styles/global.css`:

```css
@theme {
  --color-bu-mitoken: var(--bu-color-mitoken);
}
```

### Estructura de un componente

```astro
---
// components/MiWidget.astro
interface Props {
  title: string;
  subtitle?: string;
}

const { title, subtitle } = Astro.props;
---

<section class="bg-bu-surface text-bu-text py-16">
  <div class="container">
    <h2 class="text-3xl font-bold">{title}</h2>
    {subtitle && <p class="opacity-80 mt-4">{subtitle}</p>}
  </div>
</section>
```

### Consumir datos de WP

```astro
---
import { getLandingBySlug } from '@lib/wp-api';

const landing = await getLandingBySlug('admision-2026');
if (!landing) return Astro.redirect('/404');

const widgets = landing.acf?.widgets ?? [];
---

<BaseLayout title={landing.title.rendered}>
  {widgets.map(widget => {
    if (widget.acf_fc_layout === 'hero') {
      return <Hero {...widget} />;
    }
    // ... otros widgets
  })}
</BaseLayout>
```

## Build para producción

```bash
pnpm build
# Genera archivos estáticos en dist/
# Subir a S3:
aws s3 sync dist/ s3://usil-landings-prod --delete
```

## Relación con el repo padre (`usil-widgets`)

Este repo se independizó de `usil-widgets` (raíz). Los siguientes siguen en el repo padre y se mantienen sincronizados manualmente cuando aplica:

```
usil-widgets/                       (repo padre)
├── src/                            (Vite + Tailwind legacy — Visor V1)
│   └── widgets/                    (preview de widgets individuales)
├── wp-plugin/                      (PHP Elementor legacy)
│   └── usil-elementor-widgets/
└── docs/
```

- **Vite** en el padre sigue corriendo para `src/widgets/` (preview legacy).
- **PHP plugin** sigue activo para landings V1 en producción.
- **Astro (este repo)** es el frontend público del futuro.

## Próximos pasos

1. **Spike de 1 semana** (recomendado): validar el flujo Astro + WP Headless + Gemini
2. **Migrar widgets V2** desde el `src/widgets/` del repo padre a `src/components/` de este repo
3. **Setup del plugin IA** que consume `src/data/` de este repo para generar landings con Gemini
4. **Deploy a staging** en SiteGround o Netlify para preview del cliente
5. **Deploy a producción** en AWS S3 + CloudFront cuando esté validado

## Referencias

- [Documentación Astro](https://docs.astro.build)
- [Tailwind con Astro](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
- [WP REST API](https://developer.wordpress.org/rest-api/)
- [Design System V2 — tokens](../src/v2/styles/_bu-variables.css)