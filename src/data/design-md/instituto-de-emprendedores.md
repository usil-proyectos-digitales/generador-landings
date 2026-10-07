# Design Tokens — Instituto de Emprendedores

> Documento de referencia (prueba). Color y tipografía de la BU `instituto-de-emprendedores`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#1B1464` |
| Secondary | `#1D18E4` |
| Accent | `#00F600` |
| Surface | `#EDEDED` |
| Neutral | `#ffffff` |

## Tipografía

**Poppins** en toda la escala tipográfica — transcrito de la tabla provista por Marketing. La tabla original trae dos filas "Headline-1-black" (46px y 44px); se documentan ambas tal cual, distinguidas por sufijo `-44` para evitar colisión de nombre.

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-regular`→400, `-medium`→500, `-semibold`→600, `-bold`→700, `-black`→900). Se agrega acá explícito porque el CSS lo necesita.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-black | Poppins | 900 | 62px | 60px | 0% |
| headline-1-black | Poppins | 900 | 46px | 48px | 0% |
| headline-1-black-italic | Poppins (italic) | 900 | 46px | 48px | 0% |
| headline-1-black-44 | Poppins | 900 | 44px | 52px | 0% |
| headline-1-bold | Poppins | 700 | 44px | 52px | 0.3% |
| title-1-semibold | Poppins | 600 | 24px | 32px | 0.25% |
| title-1-bold | Poppins | 700 | 24px | 32px | 0.25% |
| title-1-regular | Poppins | 400 | 24px | 32px | 0% |
| body-1-medium | Poppins | 500 | 20px | 30px | 1.8% |
| body-1-regular | Poppins | 400 | 20px | 30px | 1.8% |
| body-2-bold | Poppins | 700 | 18px | 24px | 0% |
| body-2-medium-italic | Poppins (italic) | 500 | 18px | 24px | 0% |
| body-2-regular | Poppins | 400 | 18px | 24px | 0% |
| label-1-medium | Poppins | 500 | 16px | 20px | 1% |
| label-2-bold | Poppins | 700 | 14px | 20px | 1.8% |
| link-1-bold | Poppins | 700 | 24px | 32px | 1% |
| link-2-bold | Poppins | 700 | 16px | 20px | 1.8% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "instituto-de-emprendedores",
  "colors": { "primary": "#1B1464", "secondary": "#1D18E4", "accent": "#00F600", "surface": "#EDEDED", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-black", "fontFamily": "Poppins", "fontWeight": 900, "sizePx": 62, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-1-black", "fontFamily": "Poppins", "fontWeight": 900, "sizePx": 46, "lineHeightPx": 48, "letterSpacingPct": 0 },
    { "token": "headline-1-black-italic", "fontFamily": "Poppins", "fontWeight": 900, "sizePx": 46, "lineHeightPx": 48, "letterSpacingPct": 0, "fontStyle": "italic", "textTransform": "uppercase" },
    { "token": "headline-1-black-44", "fontFamily": "Poppins", "fontWeight": 900, "sizePx": 44, "lineHeightPx": 52, "letterSpacingPct": 0 },
    { "token": "headline-1-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 44, "lineHeightPx": 52, "letterSpacingPct": 0.3 },
    { "token": "title-1-semibold", "fontFamily": "Poppins", "fontWeight": 600, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-regular", "fontFamily": "Poppins", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Poppins", "fontWeight": 500, "sizePx": 20, "lineHeightPx": 30, "letterSpacingPct": 1.8 },
    { "token": "body-1-regular", "fontFamily": "Poppins", "fontWeight": 400, "sizePx": 20, "lineHeightPx": 30, "letterSpacingPct": 1.8 },
    { "token": "body-2-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-medium-italic", "fontFamily": "Poppins", "fontWeight": 500, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-regular", "fontFamily": "Poppins", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Poppins", "fontWeight": 500, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1 },
    { "token": "label-2-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 14, "lineHeightPx": 20, "letterSpacingPct": 1.8 },
    { "token": "link-1-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 1 },
    { "token": "link-2-bold", "fontFamily": "Poppins", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 }
  ],
  "roles": {
    "blockTitle": "headline-1-black-italic",
    "blockBody": "body-1-regular",
    "cardTitle": "title-1-bold",
    "cardBody": "body-1-regular",
    "label": "label-1-medium",
    "link": "link-1-bold"
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

> Roles verificados contra el Figma real (`Cards / Items (sin carrusel)` v6.3, nodo `1478:10414`) el 2026-08-27: `blockTitle` es Headline-1-black **italic + mayúsculas** (no la variante regular); `cardTitle` (title-1-bold) ya estaba correcto; `cardBody` es Body-1, no Body-2. Color: mismo criterio — se mantiene el rol uniforme entre BUs por requerimiento del proyecto; el Figma de esta BU usa `primary` donde las otras usan `secondary`/`neutral` para el título y el texto de la caja resaltada, pero esa variación NO se replica en el código (ver nota en `pregrado.md`).
