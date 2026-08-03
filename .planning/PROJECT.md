# Generador de Landings USIL

## What This Is

Frontend público del Generador de LPs V2: Astro 7 (output static) consumiendo
WordPress headless vía REST API, con un Design System V2 basado en tokens
`bu-*` por Unidad de Negocio (BU). Incluye un Visor interno (`/`, storybook
de widgets) usado para validar previews antes de reconstruir landings reales
en WP + Astro.

## Core Value

Que cada widget migrado del legacy (Vite + Tailwind v3) al patrón Astro +
Tailwind v4 se vea y funcione igual en todas las BUs y en los 2 modos
(claro/oscuro), sin colores hardcodeados.

## Requirements

### Validated

- ✓ Widgets `2-bloque-intro`, `5-save-the-date`, `6-cards-items` migrados y
  registrados en el Visor (`src/components/widgets/registry.ts`)
- ✓ Widget `7-bloque-ponentes-testimonios` (3 variantes: v7.2, v7.4, v7.5)
  migrado y registrado en el Visor y en `widgets-catalog.json` — quick task
  260803-mgb, aprobado visualmente por el usuario

### Active

(Ninguno activo — próximo widget a migrar por definir)

### Out of Scope

- Editor live de cards en el drawer del Visor para widget 7 — el contenido
  real de ponentes se termina cargando vía ACF en WordPress, no vale la pena
  invertir tiempo en editarlo en vivo desde la herramienta interna
- Reconstrucción real en WordPress/producción — este proyecto solo cubre el
  componente Astro + su entrada en el Visor y en `widgets-catalog.json`

## Context

- Repo standalone (raíz = proyecto Astro), separado del repo padre
  `usil-widgets` (que tiene el legacy `src/widgets/` Vite + Tailwind v3 y el
  plugin PHP de Elementor — no están en este checkout)
- Legacy de referencia para widgets pendientes vive en `src/migrar/`
- Patrón establecido: `src/components/widgets/<id>/<Nombre>.astro` +
  `theme.ts` (tokens por variante × modo) + entrada en `registry.ts`

## Constraints

- **Tech stack**: Astro 7 (static), Tailwind v4 vía `@tailwindcss/vite`,
  TypeScript strict — ver `CLAUDE.md` en la raíz del repo
- **Package manager**: pnpm únicamente

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Scaffold GSD mínimo (sin onboarding completo) | Repo ya tiene CLAUDE.md + patrones establecidos; mapear todo el codebase para una sola quick task era desproporcionado | ✓ Good |
| Widget 7 sin editor de cards en el Visor | Contenido real se edita vía ACF en WP, no en el Visor interno | ✓ Good |

---
*Last updated: 2026-08-03 after scaffold GSD mínimo*
