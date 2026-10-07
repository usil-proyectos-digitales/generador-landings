# Design Tokens — Pregrado

> Documento de referencia (prueba). Color y tipografía de la BU `pregrado`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#1e50dc` |
| Secondary | `#002663` |
| Accent | `#817aff` |
| Surface | `#DFE8F7` |
| Neutral | `#FFFFFF` |

## Tipografía

Mezcla **Montserrat** (texto general) + **Anton** (headline-2 y links) — transcrito de la tabla provista por Marketing.

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-regular`→400, `-medium`→500, `-bold`→700, `-extrabold`→800, `-black`→900). Se agrega acá explícito porque el CSS lo necesita.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-black | Montserrat | 900 | 62px | 60px | 0% |
| headline-1-extrabold | Montserrat | 800 | 48px | 50px | 0% |
| headline-1-bold | Montserrat | 700 | 42px | 50px | 0% |
| headline-2-regular | Anton | 400 | 52px | 60px | 0.3% |
| title-1-extrabold | Montserrat | 800 | 24px | 32px | 0.25% |
| title-1-bold | Montserrat | 700 | 24px | 32px | 0.25% |
| title-1-regular | Montserrat | 400 | 24px | 32px | 0% |
| body-1-medium | Montserrat | 500 | 20px | 28px | 1.8% |
| body-1-regular | Montserrat | 400 | 20px | 28px | 1.8% |
| body-2-bold | Montserrat | 700 | 18px | 24px | 0% |
| body-2-regular | Montserrat | 400 | 18px | 24px | 0% |
| label-1-medium | Montserrat | 500 | 16px | 24px | 1% |
| label-2-bold | Montserrat | 700 | 14px | 20px | 1.8% |
| link-1-regular | Anton | 400 | 24px | 32px | 1% |
| link-2-regular | Anton | 400 | 16px | 20px | 1.8% |

## Roles (mapeo semántico usado por el visor de prueba)

Qué token de tipografía usa cada parte de los widgets de prueba (`6-cards-items` v6.3, `7-bloque-ponentes-testimonios` v7.2).

```json
{
  "bu": "pregrado",
  "colors": { "primary": "#1e50dc", "secondary": "#002663", "accent": "#817aff", "surface": "#DFE8F7", "neutral": "#FFFFFF" },
  "typography": [
    { "token": "display-1-black", "fontFamily": "Montserrat", "fontWeight": 900, "sizePx": 62, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-1-extrabold", "fontFamily": "Montserrat", "fontWeight": 800, "sizePx": 48, "lineHeightPx": 50, "letterSpacingPct": 0 },
    { "token": "headline-1-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 42, "lineHeightPx": 50, "letterSpacingPct": 0 },
    { "token": "headline-2-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 52, "lineHeightPx": 60, "letterSpacingPct": 0.3 },
    { "token": "title-1-extrabold", "fontFamily": "Montserrat", "fontWeight": 800, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-regular", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Montserrat", "fontWeight": 500, "sizePx": 20, "lineHeightPx": 28, "letterSpacingPct": 1.8 },
    { "token": "body-1-regular", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 20, "lineHeightPx": 28, "letterSpacingPct": 1.8 },
    { "token": "body-2-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-regular", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Montserrat", "fontWeight": 500, "sizePx": 16, "lineHeightPx": 24, "letterSpacingPct": 1 },
    { "token": "label-2-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 14, "lineHeightPx": 20, "letterSpacingPct": 1.8 },
    { "token": "link-1-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 1 },
    { "token": "link-2-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 }
  ],
  "roles": {
    "blockTitle": "headline-2-regular",
    "blockBody": "body-1-regular",
    "cardTitle": "title-1-extrabold",
    "cardBody": "body-1-regular",
    "label": "label-1-medium",
    "link": "link-1-regular"
  },
  "status": "provisional",
  "colorRoles": {
    "light": {
      "section.bg": "surfaceLight",
      "section.title": "brandPrimary",
      "section.body": "brandSecondary",
      "section.label": "brandPrimary",
      "card.bg": "neutral",
      "card.title": "brandPrimary",
      "card.text": "brandSecondary",
      "cta.bg": "brandPrimary",
      "cta.text": "neutral",
      "accent": "accentPrimary",
      "saveTheDate.bg": "surfaceLight",
      "saveTheDate.title": "brandSecondary",
      "saveTheDate.card.bg": "accentPrimary",
      "saveTheDate.card.text": "brandSecondary",
      "footer.bg": "surfaceLight",
      "footer.title": "brandPrimary",
      "footer.text": "brandSecondary",
      "footer.icon": "brandPrimary"
    },
    "dark": {
      "section.bg": "brandSecondary",
      "section.title": "neutral",
      "section.body": "surfaceLight",
      "section.label": "surfaceLight",
      "card.bg": "surfaceLight",
      "card.title": "brandSecondary",
      "card.text": "brandSecondary",
      "cta.bg": "surfaceLight",
      "cta.text": "brandSecondary",
      "accent": "accentPrimary",
      "saveTheDate.bg": "brandPrimary",
      "saveTheDate.title": "neutral",
      "saveTheDate.card.bg": "neutral",
      "saveTheDate.card.text": "brandPrimary",
      "footer.bg": "brandSecondary",
      "footer.title": "neutral",
      "footer.text": "neutral",
      "footer.icon": "neutral"
    }
  },
  "typeRoles": {
    "section.title": "primary",
    "section.body": "text",
    "section.label": "accent",
    "card.title": "secondary",
    "card.text": "text",
    "cta.text": "accent"
  }
}
```

> Roles verificados contra el Figma real (`Cards / Items (sin carrusel)` v6.3, nodo `1478:10342`) el 2026-08-27: `blockTitle` es Headline-2 (Anton), no Headline-1; `cardTitle` es extrabold, no bold; `cardBody` es Body-1, no Body-2. La distribución de COLOR (qué rol de los 5 usa cada parte) se deja igual en las 3 BU a propósito — aunque el Figma de Emprendedores usa `primary` donde Pregrado/Ejecutivo usan `secondary`/`neutral`, el requerimiento original del proyecto es mantener el mismo rol de color en las 3 BU sin excepción; esa inconsistencia queda del lado del Figma, no se replica acá.
