# Design Tokens — SIU

> Documento de referencia (prueba). Color y tipografía de la BU `siu`. El bloque JSON abajo es la fuente de datos que consume el visor de prueba (`/design-md-preview`) — no es solo documentación, el parser (`src/lib/design-md.ts`) lo lee en build time.

## Color

Copiado literal de `src/styles/global.css` / `src/data/bu-colors.json` (fuente real, no se inventa acá).

| Rol | Hex |
|---|---|
| Primary | `#002663` |
| Secondary | `#1172E3` |
| Accent | `#00BBBA` |
| Surface | `#EDEDED` |
| Neutral | `#ffffff` |

## Tipografía

**Gotham** en toda la escala tipográfica — transcrito de la tabla de Figma de SIU (captura provista). La tabla sí trae columna de letter spacing.

> El peso (weight) no venía como columna en la tabla original — se infiere del sufijo del nombre de cada token (`-book`→400, `-medium`→500, `-bold`→700, `-extrabold`→800, `-black`→900, `-ultra`→900). Se agrega acá explícito porque el CSS lo necesita. Gotham Book es técnicamente más liviano que 400; se usa 400 por la regla del sufijo, a confirmar.
>
> La tabla trae dos filas `Headline-1-black` (46px y 42px); la de 42px se documenta como `headline-1-black-42` para evitar colisión de nombre.

| Token | Fuente | Peso | Tamaño | Line height | Letter spacing |
|---|---|---|---|---|---|
| display-1-ultra | Gotham | 900 | 62px | 60px | 0% |
| headline-1-black | Gotham | 900 | 46px | 52px | 0% |
| headline-1-black-42 | Gotham | 900 | 42px | 52px | 0% |
| headline-1-bold | Gotham | 700 | 42px | 52px | 0.3% |
| title-1-extrabold | Gotham | 800 | 24px | 32px | 0.25% |
| title-1-bold | Gotham | 700 | 24px | 32px | 0.25% |
| title-1-book | Gotham | 400 | 24px | 32px | 0% |
| body-1-medium | Gotham | 500 | 20px | 24px | 1.8% |
| body-1-book | Gotham | 400 | 20px | 24px | 1.8% |
| body-2-bold | Gotham | 700 | 18px | 24px | 0% |
| body-2-book | Gotham | 400 | 18px | 24px | 0% |
| label-1-medium | Gotham | 500 | 16px | 24px | 1% |
| label-2-bold | Gotham | 700 | 14px | 20px | 1.8% |
| link-1-bold | Gotham | 700 | 24px | 32px | 1% |
| link-2-bold | Gotham | 700 | 16px | 20px | 1.8% |

## Roles (mapeo semántico usado por el visor de prueba)

```json
{
  "bu": "siu",
  "colors": { "primary": "#002663", "secondary": "#1172E3", "accent": "#00BBBA", "surface": "#EDEDED", "neutral": "#ffffff" },
  "typography": [
    { "token": "display-1-ultra", "fontFamily": "Gotham", "fontWeight": 900, "sizePx": 62, "lineHeightPx": 60, "letterSpacingPct": 0 },
    { "token": "headline-1-black", "fontFamily": "Gotham", "fontWeight": 900, "sizePx": 46, "lineHeightPx": 52, "letterSpacingPct": 0 },
    { "token": "headline-1-black-42", "fontFamily": "Gotham", "fontWeight": 900, "sizePx": 42, "lineHeightPx": 52, "letterSpacingPct": 0 },
    { "token": "headline-1-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 42, "lineHeightPx": 52, "letterSpacingPct": 0.3 },
    { "token": "title-1-extrabold", "fontFamily": "Gotham", "fontWeight": 800, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0.25 },
    { "token": "title-1-book", "fontFamily": "Gotham", "fontWeight": 400, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 0 },
    { "token": "body-1-medium", "fontFamily": "Gotham", "fontWeight": 500, "sizePx": 20, "lineHeightPx": 24, "letterSpacingPct": 1.8 },
    { "token": "body-1-book", "fontFamily": "Gotham", "fontWeight": 400, "sizePx": 20, "lineHeightPx": 24, "letterSpacingPct": 1.8 },
    { "token": "body-2-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "body-2-book", "fontFamily": "Gotham", "fontWeight": 400, "sizePx": 18, "lineHeightPx": 24, "letterSpacingPct": 0 },
    { "token": "label-1-medium", "fontFamily": "Gotham", "fontWeight": 500, "sizePx": 16, "lineHeightPx": 24, "letterSpacingPct": 1 },
    { "token": "label-2-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 14, "lineHeightPx": 20, "letterSpacingPct": 1.8 },
    { "token": "link-1-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 24, "lineHeightPx": 32, "letterSpacingPct": 1 },
    { "token": "link-2-bold", "fontFamily": "Gotham", "fontWeight": 700, "sizePx": 16, "lineHeightPx": 20, "letterSpacingPct": 1.8 }
  ],
  "roles": {
    "blockTitle": "headline-1-black",
    "blockBody": "body-1-book",
    "cardTitle": "title-1-extrabold",
    "cardBody": "body-1-book",
    "label": "label-1-medium",
    "link": "link-1-bold"
  }
}
```

> Roles provisionales: SIU no tiene tokens `headline-2`, así que `blockTitle` usa `headline-1-black` (46px); `body-1-book` cumple el rol de `body-1-regular`. Falta verificarlos contra un nodo de Figma de SIU (`Cards / Items`), como se hizo en las otras BU.
