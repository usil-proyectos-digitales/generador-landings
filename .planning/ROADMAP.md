# Roadmap: Generador de Landings USIL

## Overview

Migración incremental de los widgets legacy (`src/migrar/`) al patrón Astro +
Tailwind v4 del Design System V2, uno por uno, registrados en el Visor
interno. El trabajo puntual por widget corre como quick task GSD
(`.planning/quick/`) en vez de fases formales, ya que cada widget es una
unidad de trabajo pequeña y autocontenida.

## Phases

- [ ] **Phase 1: Migración de widgets legacy** - Portar cada widget de
  `src/migrar/` al patrón Astro (componente + theme.ts + registry.ts +
  entrada en widgets-catalog.json)

## Phase Details

### Phase 1: Migración de widgets legacy
**Goal**: Cada widget legacy tiene su equivalente Astro registrado en el
Visor y en `widgets-catalog.json`, respetando el Design System V2.
**Depends on**: Nothing (primera fase)
**Requirements**: Migrar widget 7 (ponentes/testimonios)
**Success Criteria** (what must be TRUE):
  1. El Visor renderiza el widget nuevo sin errores en las 3 variantes × 2 modos
  2. `npx astro check` pasa sin errores de TypeScript
  3. `widgets-catalog.json` tiene una entrada válida para el widget nuevo
**Plans**: TBD (ejecutado vía quick tasks, no plans formales de fase)

## Progress

**Execution Order:**
Fase única — el trabajo real se trackea vía quick tasks en `.planning/quick/`.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Migración de widgets legacy | 0/0 | In progress | - |
