# landing-logic — qué widgets usa la IA y por qué

Fuente de verdad del criterio con que la IA arma una landing a partir de las respuestas del wizard. Lo editan personas; un compilador (`src/lib/landing-logic.ts`, `pnpm logic:build`) lo valida y genera `src/data/landing-logic.json`, que es lo que consume el plugin de WordPress.

No define props ni textos de cada widget: solo **qué familia, qué variante y en qué orden**.

## Cómo se conectan las piezas

```
preguntas  --producen-->  señales  --activan-->  recetas  --eligen-->  widget + variante
```

| Archivo | Qué contiene | Quién lo corrige |
|---|---|---|
| `preguntas.md` | Preguntas del wizard y el vocabulario de señales | Marketing + Dev |
| `recetas/<tipo>.md` | Por tipo de landing: secciones en orden, obligatorias y opcionales | Marketing + Diseño |
| `widgets/<familia>.md` | Por familia: cuándo usar cada variante y qué necesita | Diseño + Dev |
| `solicitud.md` | Qué se guarda de cada solicitud para el historial | Dev |

## Reglas de edición

1. Cada `.md` tiene prosa (para personas) y **un solo** bloque ```` ```json ```` (para el compilador). Si se contradicen, manda el bloque json.
2. Los `id` van en minúsculas, sin acentos ni espacios (`tiene_ponentes`, `v6-3`).
3. Una señal existe solo si está declarada en `preguntas.md`. Recetas y fichas no pueden inventar señales.
4. Un widget o variante existe solo si tiene ficha en `widgets/`. Las recetas no pueden nombrar otros.
5. Después de editar: `pnpm logic:build`. Si falla, el mensaje dice qué archivo y qué campo.
6. `landing-logic.json` es generado. No se edita a mano.

## Señales

Una señal es un dato corto sobre la landing que se va a construir. Tres orígenes:

| Origen | De dónde sale | Ejemplo |
|---|---|---|
| `pregunta` | El cliente la responde en el wizard | `tipo_landing` |
| `inferida` | La IA la deduce del texto libre o del documento adjunto | `n_beneficios` |
| `derivada` | Se calcula de otras señales con una regla fija | `capta_leads` |

Tipos de valor: `enum` (una opción de una lista), `bool` (sí/no), `numero` (entero, 0 si no hay).

Si una señal inferida no se puede deducir, vale su `defecto`. La IA no debe inventar contenido para subir un número.

## Condiciones

Recetas y fichas usan condiciones para decir cuándo aplica algo. Formato único:

```json
{ "senal": "n_beneficios", "op": "gte", "valor": 4 }
```

| `op` | Significado | Tipos |
|---|---|---|
| `es` | igual a `valor` | enum, bool |
| `en` | está en la lista `valor` | enum |
| `gte` | mayor o igual que `valor` | numero |
| `lte` | menor o igual que `valor` | numero |

Varias condiciones juntas en una lista significan **todas a la vez** (Y). No hay "O": si hace falta, se escriben dos entradas.
