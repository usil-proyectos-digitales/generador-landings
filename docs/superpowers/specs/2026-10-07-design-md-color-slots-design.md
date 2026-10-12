# Slots de color y tipografía por BU en design.md

Fecha: 2026-10-07 · Estado: borrador para revisión

## Objetivo

Que cada `design.md` por BU defina qué rol de color y qué rol tipográfico pinta cada elemento de los widgets v3 (claro y oscuro). Los widgets dejan de elegir roles; solo consumen slots. Se deja de escribir `theme.ts` a mano.

## Decisiones (del usuario)

- Tabla **completa por BU**, sin herencia ni tabla global: diseño entregará un `design.md` validado por BU.
- Enfoque: **script que genera un CSS por BU** dentro del plugin v3.
- Los valores de los 5 colores siguen saliendo del kit de Elementor de cada sub-sitio.

## Problema que resuelve

Con tablas por widget, "oscuro" reasigna roles (por ejemplo `buneutral` como fondo). Eso falla cuando `neutral` cambia de color por BU: en Pregrado y Emprendedores es blanco y el footer oscuro queda blanco sobre blanco (verificado en las páginas de prueba, 2026-10-07).

## Diseño

### 1. Vocabulario de slots (compartido)

| Grupo | Slots |
|---|---|
| section | `section.bg`, `section.title`, `section.body`, `section.label` |
| card | `card.bg`, `card.title`, `card.text` |
| cta | `cta.bg`, `cta.text` |
| general | `accent` |

Un widget puede declarar slots propios con prefijo (`cards.dateBadge`). Se añaden al vocabulario y pasan a ser obligatorios en todos los `design.md`.

### 2. Formato en `design.md`

Se agregan dos claves al bloque JSON existente de `src/data/design-md/<bu>.md`:

```json
"colorRoles": {
  "light": { "section.bg": "surfaceLight", "section.title": "brandPrimary" },
  "dark":  { "section.bg": "brandPrimary", "section.title": "surfaceLight" }
},
"typeRoles": { "section.title": "primary", "card.title": "secondary", "section.body": "text", "cta.text": "accent" }
```

- Roles de color válidos: `brandPrimary`, `brandSecondary`, `accentPrimary`, `surfaceLight`, `neutral`.
- Roles tipográficos válidos: `primary` (Headline), `secondary` (Title), `text` (Body), `accent` (Link/Label).

### 3. Generador

Script Node (`scripts/build-bu-css.js`):

1. Lee todos los `design.md`.
2. Valida que cada BU tenga todos los slots en claro y oscuro; si falta alguno, falla con el nombre de BU y slot.
3. Emite `wp-plugin/usil-elementor-widgets-v3/assets/css/bu/<bu>.css`:

```css
[data-mode="light"] { --usil-section-bg: var(--e-global-color-busurface, transparent); }
[data-mode="dark"]  { --usil-section-bg: var(--e-global-color-primary, transparent); }
```

Mapa de roles a variables del kit: `brandPrimary→primary`, `brandSecondary→secondary`, `accentPrimary→accent`, `surfaceLight→busurface`, `neutral→buneutral`.

### 4. Plugin

Encola el CSS de la BU según el sub-sitio (mapa sub-sitio → BU en el archivo principal). Sin archivo para la BU, carga `bu/_default.css` generado desde `pregrado.md`.

### 5. Widgets

El CSS de cada familia reemplaza `--std-bg: var(--e-global-color-…)` por `var(--usil-section-bg, transparent)`. Los overrides de color de la pestaña Estilo siguen pisando las variables locales. Sin hex ni clases Tailwind.

### 6. Deploy

`npm run deploy:v3` ejecuta el generador antes del `php -l`.

## Fuera de alcance

- Completar los `design.md` de las BU que aún no tienen tablas validadas por diseño; se usa `_default.css` hasta entonces.
- Migrar el Visor/Astro.

## Pruebas

- El generador falla con un slot faltante (probar quitando uno).
- `php -l` y grep de hex sin resultados en widgets migrados.
- Páginas "Prueba widgets v3" en los 3 sub-sitios: claro y oscuro legibles, incluido el footer oscuro.

## Orden

1. Definir slots y bloque en `pregrado.md`.
2. Generador y carga en el plugin.
3. Migrar `save-the-date` y validar en los 3 sub-sitios.
4. Migrar el resto de familias (7).
5. Actualizar `docs/WORKER-BRIEF.md` antes de la Ola 3.

## Riesgos

- Vocabulario demasiado corto: un widget nuevo puede necesitar slots que obliguen a editar los 9 `design.md`. Mitigación: revisar los slots al inicio de cada ola.
- Los `design.md` finales de diseño pueden traer otro formato. Mitigación: el generador es el único lector del formato.
