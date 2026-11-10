# Graph Report - generador-landings  (2026-11-09)

## Corpus Check
- 189 files · ~153,919 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .graphify-bak 1, .example 1, (none) 1)

## Summary
- 587 nodes · 878 edges · 29 communities (22 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Referencias Node externas
- Reportes de workers
- Caveman Compress CLI
- Cards items Astro
- Landing-logic y decisiones
- Flujo E2E y arquitectura
- Bloque Intro y theme
- Benchmark de compresion
- Config Astro y deps
- Ponentes y carruseles
- Swiper y misceláneos
- Iconos Save the date
- Cards items widget
- Carousel manager legacy
- tsconfig strict
- Design tokens por BU (A)
- Design tokens por BU (B)
- Visor y registry
- Cliente wp-api
- Thank-you y HubSpot
- Acordeones y tabs
- Stack y README
- Tipos de entorno
- Carreras y acordeones

## God Nodes (most connected - your core abstractions)
1. `compress_file()` - 15 edges
2. `compileLandingLogic()` - 15 edges
3. `validate()` - 14 edges
4. `Title_Controls_Trait` - 12 edges
5. `initDynamicCarousel()` - 11 edges
6. `scripts` - 10 edges
7. `detect_file_type()` - 9 edges
8. `isObject()` - 9 edges
9. `Cta_Controls_Trait` - 9 edges
10. `USIL_Pattern_Overlay_Trait (colores hex por defecto, pendiente)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Mapeo theme.ts de 6-cards-items al kit Elementor` --semantically_similar_to--> `colorRoles light/dark en design.md (section, card, cta, saveTheDate, footer, bat)`  [INFERRED] [semantically similar]
  docs/worker-reports/cards-items.md → src/data/design-md/csir.md
- `Del Prompt a Landing v1 (Astro headless, documento maestro)` --semantically_similar_to--> `Flujo E2E generacion de landings con IA`  [INFERRED] [semantically similar]
  docs/artifacts/del-prompt-a-landing.md → AI-LANDING-FLOW.md
- `Phase 1: Migracion de widgets legacy` --references--> `theme.ts por widget (variante x modo)`  [INFERRED]
  .planning/ROADMAP.md → CLAUDE.md
- `Del prompt al preview (fase cliente, metodo hibrido)` --references--> `design.md por BU (color + tipografia + roles)`  [EXTRACTED]
  docs/artifacts/del-prompt-al-preview.md → CLAUDE.md
- `Spec: slots de color y tipografia por BU en design.md` --rationale_for--> `theme.ts por widget (variante x modo)`  [INFERRED]
  docs/superpowers/specs/2026-10-07-design-md-color-slots-design.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Documentacion de la migracion de widgets a v3** — docs_worker_brief, docs_artifacts_del_prompt_a_landing_v2_widgets_v3, docs_worker_reports_bloque_acordeones_tabs, docs_superpowers_specs_color_slots_design [INFERRED 0.85]
- **Versiones del cronograma** — docs_03_cronograma_estimado_v1, docs_03_cronograma_estimado_v2, docs_03_cronograma_entregable_2026 [EXTRACTED 1.00]
- **Familia de documentos Del prompt a landing** — docs_artifacts_del_prompt_a_landing_v1, docs_artifacts_del_prompt_al_preview, docs_artifacts_del_prompt_al_sitio_publicado, ai_landing_flow_e2e [EXTRACTED 1.00]
- **Rollout de Title_Controls_Trait y Cta_Controls_Trait en widgets v3** — docs_worker_reports_bloque_contenido_imagen_titulo_cta, docs_worker_reports_bloque_footer_titulo_cta, docs_worker_reports_cards_items_carrusel_titulo_cta, docs_worker_reports_cards_items_titulo_cta, docs_worker_reports_intro_text_block_titulo_cta, docs_worker_reports_ponentes_testimonios_titulo_cta, docs_worker_reports_thank_you_titulo_cta [EXTRACTED 1.00]
- **Migracion de carruseles scroll-snap al Swiper compartido** — docs_worker_reports_cards_items_carrusel_swiper, docs_worker_reports_ponentes_swiper, docs_worker_reports_miscelaneos_carrusel, shared_usil_carousel_swiper [EXTRACTED 0.95]
- **design.md por BU: color, tipografia y colorRoles** — src_data_design_md_coloring_dreams, src_data_design_md_csir, src_data_design_md_instituto_de_emprendedores, src_data_design_md_posgrado, src_data_design_md_pregrado_ejecutivo [EXTRACTED 1.00]
- **design.md per-BU token documents** — src_data_design_md_pregrado_bu_pregrado, src_data_design_md_siu_bu_siu, src_data_design_md_usil_corporativo_bu_usil_corporativo, src_data_design_md_usil_paraguay_bu_usil_paraguay [EXTRACTED 1.00]
- **landing-logic source documents** — src_data_landing_logic_preguntas_wizard, src_data_landing_logic_widgets_cards_items_ficha, src_data_landing_logic_solicitud_registro, src_data_landing_logic_readme_landing_logic [EXTRACTED 1.00]
- **Cards Items variants** — src_data_landing_logic_widgets_cards_items_v6_3, src_data_landing_logic_widgets_cards_items_v6_6, src_data_landing_logic_widgets_cards_items_v6_8, src_data_landing_logic_widgets_cards_items_v6_10, src_data_landing_logic_widgets_cards_items_v6_11, src_data_landing_logic_widgets_cards_items_v6_12 [EXTRACTED 1.00]

## Communities (29 total, 7 thin omitted)

### Community 0 - "Referencias Node externas"
Cohesion: 0.06
Nodes (50): dataDir, outFile, result, srcDir, compileLandingLogic(), CompileResult, Condition, ConditionOp (+42 more)

### Community 1 - "Reportes de workers"
Cohesion: 0.05
Nodes (49): Worker Report bloque-contenido-imagen (familia 9), Tabla de colores por modo propuesta (bci), bloque-contenido-imagen Titulo y CTA (ola 2), Variantes v9-1, v9-2, v9-3, Worker Report bloque-footer (familia Footer), Footer siempre oscuro: tabla de colores propuesta, bloque-footer Titulo y CTA uniformes, Variantes v13-1, v13-2, v13-3 (+41 more)

### Community 2 - "Caveman Compress CLI"
Cohesion: 0.08
Nodes (18): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), first_nonblank_line() (+10 more)

### Community 3 - "Cards items Astro"
Cohesion: 0.07
Nodes (30): applyDynamicLayouts(), CardItem, initCarouselV68(), normalizeSwiperSlides(), Props, revertCarousel(), setCardWidths(), V68_FLEX_CLASSES (+22 more)

### Community 4 - "Landing-logic y decisiones"
Cohesion: 0.06
Nodes (38): Legacy V1 hk-* class hooks and brand-dark/brand-light tokens, landing-logic.json (generado), Pregunta contenidos (10 casillas que encienden señales tiene_*), Dos fechas: fecha_del_evento vs cierre_inscripciones, Pregunta objetivo (inscripcion, informar), Señales derivadas (capta_leads, genera_gracias), Señales inferidas por la IA (n_beneficios, n_ponentes, n_testimonios, n_faq, n_programas, n_cifras), Pregunta tipo_landing (admision, evento, congreso, webinar, curso_corto) (+30 more)

### Community 5 - "Flujo E2E y arquitectura"
Cohesion: 0.07
Nodes (36): Mapeo JSON por bloque a acf-schema.json, Flujo E2E generacion de landings con IA, Pipeline GitHub Actions -> S3 + CloudFront (no existe aun), Roles WP e historial (requested_by, assigned_dev, published_by), Tres capas: Cliente - Plugin IA & WP - Dev, BU (Business Unit) - 9 unidades de negocio, design.md por BU (color + tipografia + roles), Design System V2 - tokens bu-* (5 roles por BU) (+28 more)

### Community 6 - "Bloque Intro y theme"
Cohesion: 0.09
Nodes (19): Props, baseClasses, Mode, theme, Variant, VariantTheme, ICON_PATHS, Card6FieldSpec (+11 more)

### Community 7 - "Benchmark de compresion"
Cohesion: 0.11
Nodes (19): benchmark_pair(), count_tokens(), main(), print_table(), count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes() (+11 more)

### Community 8 - "Config Astro y deps"
Cohesion: 0.08
Nodes (29): dependencies, astro@^7.1.3, @astrojs/check@^0.9.9, tailwindcss@^4.1.7, @tailwindcss/vite@^4.1.7, description, devDependencies, @types/node@^22.20.1 (+21 more)

### Community 9 - "Ponentes y carruseles"
Cohesion: 0.10
Nodes (23): initCarousels(), PonenteItem, Props, baseClasses, Mode, theme, Variant, VariantTheme (+15 more)

### Community 10 - "Swiper y misceláneos"
Cohesion: 0.15
Nodes (16): swiper@^14.0.7, swiper, activate(), applyRanking148LayoutInSection(), ensureCarousel147Styles(), init(), initCarousel147InSection(), startCountdownInRoot() (+8 more)

### Community 11 - "Iconos Save the date"
Cohesion: 0.14
Nodes (19): baseProps(), ICON_SLUGS, IconFecha(), IconHibrida(), IconHora(), IconPresencial(), IconProps, ICONS (+11 more)

### Community 12 - "Cards items widget"
Cohesion: 0.13
Nodes (13): applyDynamicLayouts(), CardItem, initCarouselV68(), normalizeSwiperSlides(), Props, revertCarousel(), setCardWidths(), V68_FLEX_CLASSES (+5 more)

### Community 13 - "Carousel manager legacy"
Cohesion: 0.22
Nodes (12): activate, activate(), init(), initCarouselV68(), initLayoutV611(), initLayoutV612(), initLayoutV63(), initLayoutV66() (+4 more)

### Community 14 - "tsconfig strict"
Cohesion: 0.14
Nodes (13): astro/tsconfigs/strict, compilerOptions, baseUrl, noUncheckedIndexedAccess, paths, strict, exclude, extends (+5 more)

### Community 15 - "Design tokens por BU (A)"
Cohesion: 0.16
Nodes (11): colorRoles light/dark en design.md (section, card, cta, saveTheDate, footer, bat), Design Tokens Coloring Dreams, Tipografia Rubik (Coloring Dreams), Design Tokens CSIR, Tipografia Rubik (CSIR), Design Tokens Instituto de Emprendedores, Tipografia Poppins (Instituto de Emprendedores), Design Tokens Posgrado (+3 more)

### Community 16 - "Design tokens por BU (B)"
Cohesion: 0.19
Nodes (14): BU Pregrado design tokens, colorRoles light/dark slot mapping, Semantic typography roles (blockTitle, cardTitle, cardBody, label, link), Pregrado typography scale (Montserrat + Anton), BU SIU design tokens, SIU colorRoles light/dark, SIU typography scale (Montserrat only, replaces Gotham), BU USIL Corporativo design tokens (+6 more)

### Community 17 - "Visor y registry"
Cohesion: 0.22
Nodes (8): Visor (UI Kit/storybook interno, index.astro), registry.ts (catalogo central de widgets), computeWidgetInstanceProps (registry.ts), initDynamicCarousel (carousel-manager.ts), Plan: migrar widget 7 Bloque Ponentes/Testimonios, Entrada ponentes-testimonios en widgets-catalog.json, Summary: widget 7 migrado, checkpoint humano aprobado, Planning STATE (quick task 260803-mgb completada)

### Community 19 - "Thank-you y HubSpot"
Cohesion: 0.53
Nodes (4): activate(), getFormHubData(), normalizeValue(), renderTemplate()

### Community 20 - "Acordeones y tabs"
Cohesion: 0.83
Nodes (3): activate(), init(), initTabGroups()

### Community 21 - "Stack y README"
Cohesion: 0.67
Nodes (3): Stack: Astro 7 static + Tailwind v4 + pnpm + TS strict, README: Generador de Landings - Astro Frontend V2, Repo padre usil-widgets (legacy Vite + plugin PHP)

### Community 23 - "Carreras y acordeones"
Cohesion: 0.67
Nodes (3): Bloque Carreras/Facultades v11.1 (tabs laterales + acordeón anidado), Bloque Acordeones/Tabs v12.1 (acordeón) y v12.6 (tabs-raise), data-tab-root / data-tab-trigger / data-tab-panel pattern

## Knowledge Gaps
- **53 isolated node(s):** `astro/tsconfigs/strict`, `Visor (UI Kit/storybook interno, index.astro)`, `Stack: Astro 7 static + Tailwind v4 + pnpm + TS strict`, `BU (Business Unit) - 9 unidades de negocio`, `IA App (plugin PHP en WP; Gemini dev, Bedrock Haiku 4.5 prod)` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 244 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `swiper` connect `Swiper y misceláneos` to `Config Astro y deps`, `Ponentes y carruseles`, `Cards items Astro`, `Cards items widget`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `compileLandingLogic()` (e.g. with `.err()` and `.requireString()`) actually correct?**
  _`compileLandingLogic()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `astro/tsconfigs/strict`, `Visor (UI Kit/storybook interno, index.astro)`, `Stack: Astro 7 static + Tailwind v4 + pnpm + TS strict` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Referencias Node externas` be split into smaller, more focused modules?**
  _Cohesion score 0.05547785547785548 - nodes in this community are weakly interconnected._
- **Why does `initDynamicCarousel()` connect `Ponentes y carruseles` to `Cards items Astro`, `Cards items widget`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Should `Reportes de workers` be split into smaller, more focused modules?**
  _Cohesion score 0.05028248587570622 - nodes in this community are weakly interconnected._
- **Why does `astro` connect `Config Astro y deps` to `Bloque Intro y theme`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._