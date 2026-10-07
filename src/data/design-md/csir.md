# Design Tokens — CSIR

> Documento de referencia (prueba). Color y tipografía de la BU `csir`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#232B91` |
| Secondary | `#5967D2` |
| Accent | `#f6b724` |
| Surface | `#EDEDED` |
| Neutral | `#ffffff` |

## Tipografía

**Rubik** en toda la escala tipográfica — transcrito de la tabla de Figma de CSIR (captura provista).

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-regular`→400, `-medium`→500, `-semibold`→600, `-bold`→700, `-extrabold`→800, `-black`→900). Se agrega acá explícito porque el CSS lo necesita. El letter spacing tampoco venía en la tabla: se deja en `0%` para todos los tokens hasta confirmarlo.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-black | Rubik | 900 | 64px | 62px | 0% |
| headline-1-black | Rubik | 900 | 44px | 38px | 0% |
| headline-2-extrabold | Rubik | 800 | 42px | 36px | 0% |
| headline-2-bold | Rubik | 700 | 42px | 36px | 0% |
| title-1-black | Rubik | 900 | 26px | 32px | 0% |
| title-1-semibold | Rubik | 600 | 26px | 32px | 0% |
| title-1-regular | Rubik | 400 | 26px | 32px | 0% |
| body-1-medium | Rubik | 500 | 22px | 30px | 0% |
| body-1-regular | Rubik | 400 | 22px | 30px | 0% |
| body-2-bold | Rubik | 700 | 18px | 24px | 0% |
| body-2-regular | Rubik | 400 | 18px | 24px | 0% |
| body-2-regular-italic | Rubik (italic) | 400 | 18px | 24px | 0% |
| label-1-medium | Rubik | 500 | 16px | 24px | 0% |
| label-2-bold | Rubik | 700 | 14px | 20px | 0% |
| link-1-extrabold | Rubik | 800 | 24px | 32px | 0% |
| link-2-bold | Rubik | 700 | 16px | 24px | 0% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "csir",
  "colors": { "primary": "#232B91", "secondary": "#5967D2", "accent": "#f6b724", "surface": "#EDEDED", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-black", "fontFamily": "Rubik", "fontWeight": 900, "sizePx": 64, "lineHeightPx": 62, "letterSpacingPct": 0 },
    { "token": "headline-1-black", "fontFamily": "Rubik", "fontWeight": 900, "sizePx": 44, "lineHeightPx": 38, "letterSpacingPct": 0 },
    { "token": "headline-2-extrabold", "fontFamily": "Rubik", "fontWeight": 800, "sizePx": 42, "lineHeightPx": 36, "letterSpacingPct": 0 },
    { "token": "headline-2-bold", "fontFamily": "Rubik", "fontWeight": 700, "sizePx": 42, "lineHeightPx": 36, "letterSpacingPct": 0 },
    { "token": "title-1-black", "fontFamily": "Rubik", "fontWeight": 900, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "title-1-semibold", "fontFamily": "Rubik", "fontWeight": 600, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "title-1-regular", "fontFamily": "Rubik", "fontWeight": 400, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Rubik", "fontWeight": 500, "sizePx": 22, "lineHeightPx": 30, "letterSpacingPct": 0 },
    { "token": "body-1-regular", "fontFamily": "Rubik", "fontWeight": 400, "sizePx": 22, "lineHeightPx": 30, "letterSpacingPct": 0 },
    { "token": "body-2-bold", "fontFamily": "Rubik", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-regular", "fontFamily": "Rubik", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-regular-italic", "fontFamily": "Rubik", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0, "fontStyle": "italic" },
    { "token": "label-1-medium", "fontFamily": "Rubik", "fontWeight": 500, "sizePx": 16, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "label-2-bold", "fontFamily": "Rubik", "fontWeight": 700, "sizePx": 14, "lineHeightPx": 20, "letterSpacingPct": 0 },
    { "token": "link-1-extrabold", "fontFamily": "Rubik", "fontWeight": 800, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "link-2-bold", "fontFamily": "Rubik", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 24, "letterSpacingPct": 0 }
  ],
  "roles": {
    "blockTitle": "headline-2-extrabold",
    "blockBody": "body-1-regular",
    "cardTitle": "title-1-black",
    "cardBody": "body-1-regular",
    "label": "label-1-medium",
    "link": "link-1-extrabold"
  },
  "status": "provisional",
  "colorRoles": {
    "light": {
      "section.bg": "surfaceLight",
      "section.title": "brandPrimary",
      "section.body": "brandPrimary",
      "section.label": "brandPrimary",
      "card.bg": "neutral",
      "card.title": "brandPrimary",
      "card.text": "brandPrimary",
      "cta.bg": "brandPrimary",
      "cta.text": "neutral",
      "accent": "accentPrimary",
      "saveTheDate.bg": "surfaceLight",
      "saveTheDate.title": "brandPrimary",
      "saveTheDate.card.bg": "accentPrimary",
      "saveTheDate.card.text": "brandPrimary",
      "footer.bg": "surfaceLight",
      "footer.title": "brandPrimary",
      "footer.text": "brandPrimary",
      "footer.icon": "brandPrimary"
    },
    "dark": {
      "section.bg": "brandPrimary",
      "section.title": "neutral",
      "section.body": "surfaceLight",
      "section.label": "surfaceLight",
      "card.bg": "surfaceLight",
      "card.title": "brandPrimary",
      "card.text": "brandPrimary",
      "cta.bg": "surfaceLight",
      "cta.text": "brandPrimary",
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

> Roles provisionales: copiados de la estructura de Pregrado (`headline-2` para título de bloque, `body-1` para cuerpo, `title-1` para título de card). Falta verificarlos contra un nodo de Figma de CSIR (`Cards / Items`), como se hizo en las otras BU.
