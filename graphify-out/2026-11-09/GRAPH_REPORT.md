# Graph Report - generador-landings  (2026-10-06)

## Corpus Check
- 155 files · ~117,478 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .example 1, (none) 1, .stackdump 1)

## Summary
- 456 nodes · 679 edges · 32 communities (24 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Caveman Compress CLI
- Cards Items Preview
- Bloque Intro y Theme
- Caveman Benchmark
- Widget Ponentes Testimonios
- Config Astro y Dependencias
- Design-md por BU
- Iconos y Props
- Templates Legacy V1
- Widget Cards Items
- JS Legacy Videos y Cards
- tsconfig Strict
- JS Legacy Miscelaneos
- Resumen Consolidado
- Design System y Theming
- Cronograma y Tracks
- Pipeline IA Spec
- Roles y Permisos WP
- JS Carrusel Cards
- Flujo Preview a Publicado
- Cliente WP API
- JS Thank You
- Stack y Contexto
- EMCP Elementor
- JS Acordeones Tabs
- Tipos de Entorno
- Visor y Registry

## God Nodes (most connected - your core abstractions)
1. `compress_file()` - 15 edges
2. `validate()` - 14 edges
3. `initDynamicCarousel()` - 11 edges
4. `Legacy V1 hk-* title pattern (hk-title, hk-caja-titulo, brand-dark box)` - 10 edges
5. `detect_file_type()` - 9 edges
6. `design.md token scale (color + typography + roles)` - 9 edges
7. `Semantic roles mapping (blockTitle, cardTitle, cardBody, label, link)` - 9 edges
8. `src/lib/design-md.ts parser` - 9 edges
9. `/design-md-preview visor` - 9 edges
10. `Design tokens Pregrado` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Perfil Desarrollador Frontend` --semantically_similar_to--> `Workflow del Dev post-generacion (6 pasos)`  [INFERRED] [semantically similar]
  docs/01-definicion-roles-perfiles.md → AI-LANDING-FLOW.md
- `Modelo de costo IA Bedrock Haiku 4.5` --semantically_similar_to--> `Motor IA: Gemini dev, Bedrock Haiku 4.5 prod`  [INFERRED] [semantically similar]
  docs/artifacts/del-prompt-a-landing.md → AI-LANDING-FLOW.md
- `landing-spec.json validado contra manifest de catalogo` --semantically_similar_to--> `JSON por bloque mapeado a acf-schema.json`  [INFERRED] [semantically similar]
  docs/artifacts/del-prompt-a-landing-v2.md → AI-LANDING-FLOW.md
- `Flujo backend/Dev hasta sitio publicado` --semantically_similar_to--> `Workflow del Dev post-generacion (6 pasos)`  [INFERRED] [semantically similar]
  docs/artifacts/del-prompt-al-sitio-publicado.md → AI-LANDING-FLOW.md
- `Perfil Administrador de Marketing (funciones Administrador y Supervisor)` --semantically_similar_to--> `Cuatro roles WP: Cliente, Supervisor, Dev, Administrador`  [INFERRED] [semantically similar]
  docs/01-definicion-roles-perfiles.md → AI-LANDING-FLOW.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo E2E Cliente a Plugin IA a Dev** — ai_landing_flow_hybrid_input_method, ai_landing_flow_acf_block_json_mapping, ai_landing_flow_dev_workflow [EXTRACTED 1.00]
- **Artefactos de la migracion del widget 7** — planning_quick_260803_mgb_migrar_widget_7_bloque_ponentes_testimon_260803_mgb_plan_theme_ts, planning_quick_260803_mgb_migrar_widget_7_bloque_ponentes_testimon_260803_mgb_plan_bloqueponentestestimonios_astro, planning_quick_260803_mgb_migrar_widget_7_bloque_ponentes_testimon_260803_mgb_plan_widgets_catalog_entry [EXTRACTED 1.00]
- **Stack v2 WordPress + Elementor + EMCP** — docs_artifacts_del_prompt_a_landing_v2_usil_apply_spec_ability, docs_artifacts_del_prompt_a_landing_v2_emcp_tools, docs_artifacts_del_prompt_a_landing_v2_multisitio_domain_mapping, docs_artifacts_del_prompt_a_landing_v2_widgets_v3 [EXTRACTED 1.00]
- **Nine BU design.md token documents** — src_data_design_md_coloring_dreams, src_data_design_md_csir, src_data_design_md_instituto_de_emprendedores, src_data_design_md_posgrado, src_data_design_md_pregrado_ejecutivo, src_data_design_md_pregrado, src_data_design_md_siu, src_data_design_md_usil_corporativo, src_data_design_md_usil_paraguay [EXTRACTED 1.00]
- **BUs sharing Montserrat+Anton scale** — src_data_design_md_pregrado, src_data_design_md_usil_corporativo, src_data_design_md_usil_paraguay [EXTRACTED 1.00]
- **BUs sharing Rubik scale** — src_data_design_md_coloring_dreams, src_data_design_md_csir, font_rubik [EXTRACTED 1.00]

## Communities (32 total, 8 thin omitted)

### Community 0 - "Caveman Compress CLI"
Cohesion: 0.08
Nodes (18): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), first_nonblank_line() (+10 more)

### Community 1 - "Cards Items Preview"
Cohesion: 0.07
Nodes (30): applyDynamicLayouts(), CardItem, initCarouselV68(), normalizeSwiperSlides(), Props, revertCarousel(), setCardWidths(), V68_FLEX_CLASSES (+22 more)

### Community 2 - "Bloque Intro y Theme"
Cohesion: 0.09
Nodes (19): Props, baseClasses, Mode, theme, Variant, VariantTheme, ICON_PATHS, Card6FieldSpec (+11 more)

### Community 3 - "Caveman Benchmark"
Cohesion: 0.11
Nodes (19): benchmark_pair(), count_tokens(), main(), print_table(), count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes() (+11 more)

### Community 4 - "Widget Ponentes Testimonios"
Cohesion: 0.10
Nodes (23): initCarousels(), PonenteItem, Props, baseClasses, Mode, theme, Variant, VariantTheme (+15 more)

### Community 5 - "Config Astro y Dependencias"
Cohesion: 0.07
Nodes (28): dependencies, astro, @astrojs/check, swiper, tailwindcss, @tailwindcss/vite, description, devDependencies (+20 more)

### Community 6 - "Design-md por BU"
Cohesion: 0.15
Nodes (29): BU Coloring Dreams, BU CSIR, BU Instituto de Emprendedores, BU Posgrado, BU Pregrado, BU Pregrado Ejecutivo, BU SIU, BU USIL Corporativo (+21 more)

### Community 7 - "Iconos y Props"
Cohesion: 0.14
Nodes (19): baseProps(), ICON_SLUGS, IconFecha(), IconHibrida(), IconHora(), IconPresencial(), IconProps, ICONS (+11 more)

### Community 8 - "Templates Legacy V1"
Cohesion: 0.10
Nodes (21): Legacy V1 hk-* title pattern (hk-title, hk-caja-titulo, brand-dark box), Legacy template Bloque Videos v10.1, Legacy template Bloque Carreras Facultades v11.1, Legacy template Bloque Acordeones Tabs v12.1, Legacy template Bloque Footer v13.1, Legacy template Miscelaneos v14.3, Legacy template Thank You v15.1, Legacy template Cards Items v6.3 (+13 more)

### Community 9 - "Widget Cards Items"
Cohesion: 0.13
Nodes (13): applyDynamicLayouts(), CardItem, initCarouselV68(), normalizeSwiperSlides(), Props, revertCarousel(), setCardWidths(), V68_FLEX_CLASSES (+5 more)

### Community 10 - "JS Legacy Videos y Cards"
Cohesion: 0.22
Nodes (12): activate, activate(), init(), initCarouselV68(), initLayoutV611(), initLayoutV612(), initLayoutV63(), initLayoutV66() (+4 more)

### Community 11 - "tsconfig Strict"
Cohesion: 0.14
Nodes (13): astro/tsconfigs/strict, compilerOptions, baseUrl, noUncheckedIndexedAccess, paths, strict, exclude, extends (+5 more)

### Community 12 - "JS Legacy Miscelaneos"
Cohesion: 0.23
Nodes (9): swiper, activate(), applyRanking148LayoutInSection(), ensureCarousel147Styles(), init(), initCarousel147InSection(), startCountdownInRoot(), initDynamicCarousel() (+1 more)

### Community 13 - "Resumen Consolidado"
Cohesion: 0.22
Nodes (11): Metodo de entrada hibrido, Estado: diseno/spec no implementado, Tres capas: Cliente, Plugin IA & WP, Dev, Costos mensuales estimados (~USD 30-35), Cronograma resumido: 72 dias habiles, fin 23/01/2027, Resumen consolidado, Flujo de aprobacion y publicacion (8 fases), Modelo de costo IA Bedrock Haiku 4.5 (+3 more)

### Community 14 - "Design System y Theming"
Cohesion: 0.18
Nodes (8): Design System V2 tokens bu-*, theme.ts por widget (variant x mode), Core value: widgets iguales en todas las BU y modos, BloquePonentesTestimonios.astro, initDynamicCarousel (carousel-manager.ts), theme.ts del widget 7, Phase 1: Migracion de widgets legacy, Quick task 260803-mgb

### Community 15 - "Cronograma y Tracks"
Cohesion: 0.27
Nodes (10): BU (Unidad de Negocio), design.md por BU, Riesgo: Fase 3.3 setup pipeline deploy (supuesto mas blando), Track Diseno (12 dias, 9 design.md), Track Javier camino critico (72 dias habiles a 4h/dia), B3 Widgets v3: 13 familias / 42 variantes (37 dias), Track A Infra/Topologia multisitio (10 dias), Track B camino critico v2 (91 dias habiles) (+2 more)

### Community 16 - "Pipeline IA Spec"
Cohesion: 0.22
Nodes (8): JSON por bloque mapeado a acf-schema.json, Motor IA: Gemini dev, Bedrock Haiku 4.5 prod, Borrador CPT landings via wp_insert_post, landing-spec.json validado contra manifest de catalogo, computeWidgetInstanceProps (registry.ts), Widget 7 Bloque Ponentes / Testimonios (3 variantes), Entrada ponentes-testimonios en widgets-catalog.json, Checkpoint humano Task 4 aprobado

### Community 17 - "Roles y Permisos WP"
Cohesion: 0.29
Nodes (8): Campos post meta de historial, Cuatro roles WP: Cliente, Supervisor, Dev, Administrador, Perfil Administrador de Marketing (funciones Administrador y Supervisor), Perfil Administrador de Sistemas / DevOps, Perfil Desarrollador Frontend, Matriz de permisos por perfil y capa, Perfil Solicitante de Landing (Marketing), Usuario Final y KPIs web (LCP, CLS, conversion)

### Community 18 - "JS Carrusel Cards"
Cohesion: 0.50
Nodes (6): activate(), init(), initCarouselV81(), initCarouselV83(), initCarouselV85(), initVerticalDynamicCarousel()

### Community 19 - "Flujo Preview a Publicado"
Cohesion: 0.40
Nodes (6): Workflow del Dev post-generacion (6 pasos), Visor de preview (build real de Astro), Pipeline GitHub Actions a S3 + CloudFront, Thinking UI (pasos de progreso), Mockup visual no funcional del wizard IA, Flujo backend/Dev hasta sitio publicado

### Community 21 - "JS Thank You"
Cohesion: 0.53
Nodes (4): activate(), getFormHubData(), normalizeValue(), renderTemplate()

### Community 22 - "Stack y Contexto"
Cohesion: 0.40
Nodes (5): IA App (plugin PHP en WordPress), Stack Astro 7 + Tailwind v4 + pnpm, WordPress headless CMS, Generador de Landings Astro Frontend V2, Relacion con repo padre usil-widgets

### Community 23 - "EMCP Elementor"
Cohesion: 0.50
Nodes (3): Arquitectura v2: WordPress + Elementor Pro renderiza directo, elementor-mcp (EMCP Tools), Ability usil/apply-spec

### Community 24 - "JS Acordeones Tabs"
Cohesion: 0.83
Nodes (3): activate(), init(), initTabGroups()

## Knowledge Gaps
- **119 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `swiper` connect `JS Legacy Miscelaneos` to `Cards Items Preview`, `Widget Ponentes Testimonios`, `Config Astro y Dependencias`, `Widget Cards Items`, `JS Carrusel Cards`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `Legacy V1 hk-* title pattern (hk-title, hk-caja-titulo, brand-dark box)` (e.g. with `Legacy template Bloque Videos v10.1` and `Legacy template Bloque Carreras Facultades v11.1`) actually correct?**
  _`Legacy V1 hk-* title pattern (hk-title, hk-caja-titulo, brand-dark box)` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Caveman Compress CLI` be split into smaller, more focused modules?**
  _Cohesion score 0.0782312925170068 - nodes in this community are weakly interconnected._
- **Why does `initDynamicCarousel()` connect `Widget Ponentes Testimonios` to `Widget Cards Items`, `Cards Items Preview`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `Cards Items Preview` be split into smaller, more focused modules?**
  _Cohesion score 0.06504065040650407 - nodes in this community are weakly interconnected._
- **Why does `astro` connect `Config Astro y Dependencias` to `Bloque Intro y Theme`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._