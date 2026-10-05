# Design Tokens — Posgrado

> Documento de referencia (prueba). Color y tipografía de la BU `posgrado`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#000000` |
| Secondary | `#1E50DC` |
| Accent | `#01004E` |
| Surface | `#DEE2EC` |
| Neutral | `#ffffff` |

## Tipografía

Mezcla **Stelvio Grotesk** (texto general) + **Anton** (headline-2 y links) — transcrito de la tabla de Figma de Posgrado (captura provista).

> La tabla original no trae columnas de peso ni de letter spacing. El peso se infiere del sufijo del nombre (`-regular`→400, `-medium`→500, `-bold`→700, `-extrabold`→800). El letter spacing no está en la fuente: se deja en `0%` para todos los tokens hasta confirmarlo con Marketing o Figma.
>
> La tabla trae dos filas `Headline-1-extrabold` (46px y 52px); la de 52px se documenta como `headline-1-extrabold-52` para evitar colisión de nombre. La fila `Displey-1-extrabold` de la captura está escrita con error de tipeo; se documenta como `display-1-extrabold`.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-extrabold | Stelvio Grotesk | 800 | 72px | 60px | 0% |
| headline-1-extrabold | Stelvio Grotesk | 800 | 46px | 40px | 0% |
| headline-1-extrabold-52 | Stelvio Grotesk | 800 | 52px | 60px | 0% |
| headline-2-regular | Anton | 400 | 52px | 54px | 0% |
| title-1-extrabold | Stelvio Grotesk | 800 | 30px | 36px | 0% |
| title-1-bold | Stelvio Grotesk | 700 | 30px | 36px | 0% |
| title-1-regular | Stelvio Grotesk | 400 | 30px | 36px | 0% |
| body-1-medium | Stelvio Grotesk | 500 | 26px | 32px | 0% |
| body-1-regular | Stelvio Grotesk | 400 | 26px | 32px | 0% |
| body-2-bold | Stelvio Grotesk | 700 | 24px | 32px | 0% |
| body-2-regular | Stelvio Grotesk | 400 | 24px | 32px | 0% |
| label-1-medium | Stelvio Grotesk | 500 | 22px | 30px | 0% |
| label-2-bold | Stelvio Grotesk | 700 | 18px | 24px | 0% |
| link-1-regular | Anton | 400 | 24px | 32px | 0% |
| link-2-regular | Anton | 400 | 16px | 20px | 0% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "posgrado",
  "colors": { "primary": "#000000", "secondary": "#1E50DC", "accent": "#01004E", "surface": "#DEE2EC", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-extrabold", "fontFamily": "Stelvio Grotesk", "fontWeight": 800, "sizePx": 72, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-1-extrabold", "fontFamily": "Stelvio Grotesk", "fontWeight": 800, "sizePx": 46, "lineHeightPx": 40, "letterSpacingPct": 0 },
    { "token": "headline-1-extrabold-52", "fontFamily": "Stelvio Grotesk", "fontWeight": 800, "sizePx": 52, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-2-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 52, "lineHeightPx": 54, "letterSpacingPct": 0 },
    { "token": "title-1-extrabold", "fontFamily": "Stelvio Grotesk", "fontWeight": 800, "sizePx": 30, "lineHeightPx": 36, "letterSpacingPct": 0 },
    { "token": "title-1-bold", "fontFamily": "Stelvio Grotesk", "fontWeight": 700, "sizePx": 30, "lineHeightPx": 36, "letterSpacingPct": 0 },
    { "token": "title-1-regular", "fontFamily": "Stelvio Grotesk", "fontWeight": 400, "sizePx": 30, "lineHeightPx": 36, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Stelvio Grotesk", "fontWeight": 500, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-regular", "fontFamily": "Stelvio Grotesk", "fontWeight": 400, "sizePx": 26, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-2-bold", "fontFamily": "Stelvio Grotesk", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-2-regular", "fontFamily": "Stelvio Grotesk", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Stelvio Grotesk", "fontWeight": 500, "sizePx": 22, "lineHeightPx": 30, "letterSpacingPct": 0 },
    { "token": "label-2-bold", "fontFamily": "Stelvio Grotesk", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "link-1-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "link-2-regular", "fontFamily": "Anton", "fontWeight": 400, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 0 }
  ],
  "roles": {
    "blockTitle": "headline-2-regular",
    "blockBody": "body-1-regular",
    "cardTitle": "title-1-extrabold",
    "cardBody": "body-1-regular",
    "label": "label-1-medium",
    "link": "link-1-regular"
  }
}
```

> Roles provisionales: copiados del mapeo de Pregrado. Falta verificarlos contra un nodo de Figma de Posgrado (`Cards / Items`), como se hizo en las otras BU.
