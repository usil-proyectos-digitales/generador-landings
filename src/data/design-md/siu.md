# Design Tokens — SIU

> Documento de referencia (prueba). Color y tipografía de la BU `siu`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#002663` |
| Secondary | `#0561CC` |
| Accent | `#00BBBA` |
| Surface | `#EDEDED` |
| Neutral | `#ffffff` |

## Tipografía

**Montserrat** en toda la escala tipográfica (decisión del equipo: sustituye a la Gotham de la tabla de Figma de SIU, que no es una fuente web gratuita). La tabla sí trae columna de letter spacing.

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-book`→400, `-medium`→500, `-bold`→700, `-extrabold`→800, `-black`→900, `-ultra`→900). Se agrega acá explícito porque el CSS lo necesita.
>
> La tabla trae dos filas `Headline-1-black` (46px y 42px); la de 42px se documenta como `headline-1-black-42` para evitar colisión de nombre.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-ultra | Montserrat | 900 | 62px | 60px | 0% |
| headline-1-black | Montserrat | 900 | 46px | 52px | 0% |
| headline-1-black-42 | Montserrat | 900 | 42px | 52px | 0% |
| headline-1-bold | Montserrat | 700 | 42px | 52px | 0.3% |
| title-1-extrabold | Montserrat | 800 | 24px | 32px | 0.25% |
| title-1-bold | Montserrat | 700 | 24px | 32px | 0.25% |
| title-1-book | Montserrat | 400 | 24px | 32px | 0% |
| body-1-medium | Montserrat | 500 | 20px | 24px | 1.8% |
| body-1-book | Montserrat | 400 | 20px | 24px | 1.8% |
| body-2-bold | Montserrat | 700 | 18px | 24px | 0% |
| body-2-book | Montserrat | 400 | 18px | 24px | 0% |
| label-1-medium | Montserrat | 500 | 16px | 24px | 1% |
| label-2-bold | Montserrat | 700 | 14px | 20px | 1.8% |
| link-1-bold | Montserrat | 700 | 24px | 32px | 1% |
| link-2-bold | Montserrat | 700 | 16px | 20px | 1.8% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "siu",
  "colors": { "primary": "#002663", "secondary": "#0561CC", "accent": "#00BBBA", "surface": "#EDEDED", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-ultra", "fontFamily": "Montserrat", "fontWeight": 900, "sizePx": 62, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-1-black", "fontFamily": "Montserrat", "fontWeight": 900, "sizePx": 46, "lineHeightPx": 52, "letterSpacingPct": 0 },
    { "token": "headline-1-black-42", "fontFamily": "Montserrat", "fontWeight": 900, "sizePx": 42, "lineHeightPx": 52, "letterSpacingPct": 0 },
    { "token": "headline-1-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 42, "lineHeightPx": 52, "letterSpacingPct": 0.3 },
    { "token": "title-1-extrabold", "fontFamily": "Montserrat", "fontWeight": 800, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-book", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Montserrat", "fontWeight": 500, "sizePx": 20, "lineHeightPx": 24, "letterSpacingPct": 1.8 },
    { "token": "body-1-book", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 20, "lineHeightPx": 24, "letterSpacingPct": 1.8 },
    { "token": "body-2-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-book", "fontFamily": "Montserrat", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Montserrat", "fontWeight": 500, "sizePx": 16, "lineHeightPx": 24, "letterSpacingPct": 1 },
    { "token": "label-2-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 14, "lineHeightPx": 20, "letterSpacingPct": 1.8 },
    { "token": "link-1-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 1 },
    { "token": "link-2-bold", "fontFamily": "Montserrat", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 }
  ],
  "roles": {
    "blockTitle": "headline-1-black",
    "blockBody": "body-1-book",
    "cardTitle": "title-1-extrabold",
    "cardBody": "body-1-book",
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
      "footer.icon": "brandPrimary",
      "bat.bg": "surfaceLight",
      "bat.title": "brandSecondary",
      "bat.body": "brandSecondary",
      "bat.titleBox.bg": "brandPrimary",
      "bat.titleBox.text": "surfaceLight",
      "bat.item.bg": "brandSecondary",
      "bat.item.text": "neutral",
      "bat.itemActive.bg": "brandPrimary",
      "bat.itemActive.text": "neutral",
      "bat.panel.bg": "neutral",
      "bat.panel.text": "brandSecondary",
      "bat.tab.bg": "neutral",
      "bat.tab.text": "brandSecondary",
      "bat.tabHover.bg": "accentPrimary",
      "bat.tabHover.text": "brandPrimary",
      "bat.tabActive.bg": "brandSecondary",
      "bat.tabActive.text": "neutral"
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
      "footer.icon": "neutral",
      "bat.bg": "brandPrimary",
      "bat.title": "neutral",
      "bat.body": "neutral",
      "bat.titleBox.bg": "neutral",
      "bat.titleBox.text": "brandPrimary",
      "bat.item.bg": "brandSecondary",
      "bat.item.text": "neutral",
      "bat.itemActive.bg": "surfaceLight",
      "bat.itemActive.text": "brandSecondary",
      "bat.panel.bg": "neutral",
      "bat.panel.text": "brandSecondary",
      "bat.tab.bg": "neutral",
      "bat.tab.text": "brandSecondary",
      "bat.tabHover.bg": "accentPrimary",
      "bat.tabHover.text": "brandPrimary",
      "bat.tabActive.bg": "brandSecondary",
      "bat.tabActive.text": "neutral"
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

> Roles provisionales: SIU no tiene tokens `headline-2`, así que `blockTitle` usa `headline-1-black` (46px); `body-1-book` cumple el rol de `body-1-regular`. Falta verificarlos contra un nodo de Figma de SIU (`Cards / Items`), como se hizo en las otras BU.
