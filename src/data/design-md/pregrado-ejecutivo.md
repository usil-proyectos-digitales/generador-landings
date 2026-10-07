# Design Tokens — Pregrado Ejecutivo

> Documento de referencia (prueba). Color y tipografía de la BU `pregrado-ejecutivo`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#0050E2` |
| Secondary | `#002663` |
| Accent | `#00B79A` |
| Surface | `#EDEDED` |
| Neutral | `#ffffff` |

## Tipografía

**Roboto** en toda la escala tipográfica — transcrito de la tabla provista por Marketing.

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-regular`→400, `-medium`→500, `-bold`→700, `-black`→900). Se agrega acá explícito porque el CSS lo necesita.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-black | Roboto | 900 | 64px | 62px | 0% |
| headline-1-black | Roboto | 900 | 48px | 50px | 0% |
| headline-2-black | Roboto | 900 | 46px | 54px | 0% |
| headline-2-bold | Roboto | 700 | 46px | 54px | 0.3% |
| title-1-black | Roboto | 900 | 26px | 32px | 0.25% |
| title-1-bold | Roboto | 700 | 26px | 32px | 0.25% |
| title-1-regular | Roboto | 400 | 26px | 32px | 0% |
| body-1-medium | Roboto | 500 | 22px | 30px | 1.8% |
| body-1-regular | Roboto | 400 | 22px | 30px | 1.8% |
| body-2-bold | Roboto | 700 | 20px | 28px | 0% |
| body-2-regular | Roboto | 400 | 20px | 28px | 0% |
| label-1-medium | Roboto | 500 | 18px | 24px | 1% |
| label-2-bold | Roboto | 700 | 16px | 20px | 1.8% |
| link-1-bold | Roboto | 700 | 24px | 32px | 1% |
| link-2-bold | Roboto | 700 | 16px | 20px | 1.8% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "pregrado-ejecutivo",
  "colors": { "primary": "#0050E2", "secondary": "#002663", "accent": "#00B79A", "surface": "#EDEDED", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-black", "fontFamily": "Roboto", "fontWeight": 900, "sizePx": 64, "lineHeightPx": 62, "letterSpacingPct": 0 },
    { "token": "headline-1-black", "fontFamily": "Roboto", "fontWeight": 900, "sizePx": 48, "lineHeightPx": 50, "letterSpacingPct": 0 },
    { "token": "headline-2-black", "fontFamily": "Roboto", "fontWeight": 900, "sizePx": 46, "lineHeightPx": 54, "letterSpacingPct": 0 },
    { "token": "headline-2-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 46, "lineHeightPx": 54, "letterSpacingPct": 0.3 },
    { "token": "title-1-black", "fontFamily": "Roboto", "fontWeight": 900, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-regular", "fontFamily": "Roboto", "fontWeight": 400, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Roboto", "fontWeight": 500, "sizePx": 22, "lineHeightPx": 30, "letterSpacingPct": 1.8 },
    { "token": "body-1-regular", "fontFamily": "Roboto", "fontWeight": 400, "sizePx": 22, "lineHeightPx": 30, "letterSpacingPct": 1.8 },
    { "token": "body-2-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 20, "lineHeightPx": 28, "letterSpacingPct": 0 },
    { "token": "body-2-regular", "fontFamily": "Roboto", "fontWeight": 400, "sizePx": 20, "lineHeightPx": 28, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Roboto", "fontWeight": 500, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 1 },
    { "token": "label-2-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 },
    { "token": "link-1-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 1 },
    { "token": "link-2-bold", "fontFamily": "Roboto", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 }
  ],
  "roles": {
    "blockTitle": "headline-2-black",
    "blockBody": "body-1-regular",
    "cardTitle": "title-1-black",
    "cardBody": "body-1-regular",
    "label": "label-1-medium",
    "link": "link-1-bold"
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
      "saveTheDate.title": "brandPrimary",
      "saveTheDate.card.bg": "accentPrimary",
      "saveTheDate.card.text": "brandSecondary",
      "footer.bg": "surfaceLight",
      "footer.title": "brandPrimary",
      "footer.text": "brandPrimary",
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

> Roles verificados contra el Figma real (`Cards / Items (sin carrusel)` v6.3, nodo `1478:10270`) el 2026-08-27: `blockTitle` es Headline-2-black, no Headline-1-black; `cardTitle` es black (900), no bold; `cardBody` es Body-1, no Body-2. Color: mismo criterio que Pregrado — se mantiene el rol uniforme entre BUs por requerimiento del proyecto, no el de Figma.
