# Ficha — Cards Items (`usil_cards_items`)

> Borrador v0, ficha piloto. Los nombres de widget, variantes y modos están verificados contra el widget real del subsitio `/pregrado/` (2026-10-13). Los rangos de cantidad de cards son una propuesta: los confirma Diseño.

Bloque de cards estáticas: un título de sección y una fila o grilla de cards. Sirve para mostrar varias cosas del mismo tipo, una al lado de otra: beneficios, programas, opciones con precio o fechas.

No es un carrusel puro. Si el contenido debe deslizarse siempre, va la ficha `cards-items-carrusel`.

## Variantes

| Variante | Cómo se ve | Cards | Necesita |
|---|---|---|---|
| `v6-3` | Título centrado, cards verticales con icono, texto y botón | 2 a 4 | botón por card |
| `v6-6` | Título a la izquierda, cards horizontales con icono y texto, sin botón | 4 a 6 | icono |
| `v6-8` | Título a la izquierda, cards verticales con foto; pasa a carrusel con más de 4 | 3 a 12 | imagen |
| `v6-10` | Título a la izquierda, 2 cards grandes con foto y botón | 2 | imagen, botón |
| `v6-11` | Título centrado, cards de producto: categoría, título, precio, botón | 2 a 4 | precio, botón |
| `v6-12` | Título centrado, cards con etiqueta de fecha | sin límite definido | fecha |

## Cuándo usar cada una

**`v6-3`** — Pocos beneficios o pasos, cada uno con su propia acción. Es la opción por defecto cuando hay 2 a 4 beneficios y no hay fotos. No usar con más de 4: las cards se aprietan; pasar a `v6-6`.

**`v6-6`** — Lista más larga de beneficios cortos. No lleva botón, así que solo informa. No usar si cada ítem necesita su propio enlace.

**`v6-8`** — Listado de programas o carreras con foto, cada card enlaza a otra página. No usar sin imágenes propias: la foto ocupa casi toda la card.

**`v6-10`** — Exactamente dos opciones que se comparan o se eligen (por ejemplo, dos modalidades). No usar con otra cantidad.

**`v6-11`** — Opciones con precio visible. No usar si el cliente no dio precios: el campo de precio no puede quedar vacío.

**`v6-12`** — Varias fechas o sesiones (por ejemplo, grupos de inicio). No usar para la fecha única de un evento: eso va en `save-the-date`.

## Modos

Todas las variantes tienen modo claro y oscuro.

```json
{
  "id": "cards-items",
  "familia": "cards",
  "widget": "usil_cards_items",
  "nombre": "Cards Items",
  "variantes": [
    {
      "id": "v6-3",
      "etiqueta": "Título centrado + cards verticales con icono, texto y botón",
      "usar_cuando": "Hay de 2 a 4 beneficios o pasos y cada uno puede llevar su propio botón. Opción por defecto para pocos beneficios sin fotos.",
      "no_usar_cuando": "Hay más de 4 ítems (usar v6-6) o los ítems son programas con foto (usar v6-8).",
      "condiciones": [{ "senal": "tiene_beneficios", "op": "es", "valor": true }],
      "senal_items": "n_beneficios",
      "min_items": 2,
      "max_items": 4,
      "requiere": ["cta"],
      "modos": ["light", "dark"]
    },
    {
      "id": "v6-6",
      "etiqueta": "Título a la izquierda + cards horizontales con icono y texto, sin botón",
      "usar_cuando": "Hay de 4 a 6 beneficios cortos que solo informan.",
      "no_usar_cuando": "Cada ítem necesita su propio enlace o botón, o hay menos de 4 ítems (usar v6-3).",
      "condiciones": [{ "senal": "tiene_beneficios", "op": "es", "valor": true }],
      "senal_items": "n_beneficios",
      "min_items": 4,
      "max_items": 6,
      "requiere": ["icono"],
      "modos": ["light", "dark"]
    },
    {
      "id": "v6-8",
      "etiqueta": "Título a la izquierda + cards verticales con foto (carrusel con más de 4)",
      "usar_cuando": "Hay un listado de 3 o más programas o carreras con foto, y cada card enlaza a otra página.",
      "no_usar_cuando": "El cliente no tiene imágenes propias, o los ítems son beneficios sin foto.",
      "condiciones": [
        { "senal": "tiene_listado_programas", "op": "es", "valor": true },
        { "senal": "tiene_imagenes", "op": "es", "valor": true }
      ],
      "senal_items": "n_programas",
      "min_items": 3,
      "max_items": 12,
      "requiere": ["imagen"],
      "modos": ["light", "dark"]
    },
    {
      "id": "v6-10",
      "etiqueta": "Título a la izquierda + 2 cards grandes con foto y botón",
      "usar_cuando": "Hay exactamente dos opciones que se comparan o se eligen, cada una con foto y botón.",
      "no_usar_cuando": "Hay una sola opción o más de dos, o no hay imágenes propias.",
      "condiciones": [
        { "senal": "tiene_listado_programas", "op": "es", "valor": true },
        { "senal": "tiene_imagenes", "op": "es", "valor": true }
      ],
      "senal_items": "n_programas",
      "min_items": 2,
      "max_items": 2,
      "requiere": ["imagen", "cta"],
      "modos": ["light", "dark"]
    },
    {
      "id": "v6-11",
      "etiqueta": "Título centrado + cards de producto (categoría, título, precio, botón)",
      "usar_cuando": "Hay de 2 a 4 opciones con precio visible.",
      "no_usar_cuando": "El cliente no dio precios: el campo de precio no puede quedar vacío.",
      "condiciones": [{ "senal": "tiene_precio", "op": "es", "valor": true }],
      "senal_items": "n_programas",
      "min_items": 2,
      "max_items": 4,
      "requiere": ["precio", "cta"],
      "modos": ["light", "dark"]
    },
    {
      "id": "v6-12",
      "etiqueta": "Título centrado + cards con etiqueta de fecha",
      "usar_cuando": "Hay varias fechas o sesiones que mostrar, cada una con su descripción.",
      "no_usar_cuando": "Hay una sola fecha de evento: eso va en save-the-date.",
      "condiciones": [{ "senal": "tiene_fecha", "op": "es", "valor": true }],
      "requiere": ["fecha"],
      "modos": ["light", "dark"]
    }
  ]
}
```
