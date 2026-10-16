# Brief para workers — fichas de `landing-logic`

Tu tarea es escribir **una ficha** en `src/data/landing-logic/widgets/`. Una ficha le dice a la IA cuándo usar cada variante de un widget de Elementor. No escribes código.

## Lee primero, completo

1. `src/data/landing-logic/README.md` — reglas de edición y formato de condiciones.
2. `src/data/landing-logic/preguntas.md` — la lista cerrada de señales.
3. `src/data/landing-logic/widgets/cards-items.md` — **ficha piloto. Imita su estructura exacta.**
4. La fuente de tu widget, indicada en tu prompt (un reporte en `docs/worker-reports/`).

## Estructura de una ficha

Mismo orden que el piloto:

1. Título `# Ficha — <Nombre> (\`<widget>\`)` y una nota de estado.
2. Un párrafo: qué es el bloque y para qué sirve, en lenguaje de Marketing.
3. `## Variantes`: tabla con variante, cómo se ve, cantidad de ítems, qué necesita.
4. `## Cuándo usar cada una`: un párrafo por variante, con cuándo sí y cuándo no.
5. `## Modos`.
6. **Un solo** bloque ```` ```json ```` al final.

## Campos del bloque json

| Campo | Obligatorio | Qué va |
|---|---|---|
| `id` | sí | Igual al nombre del archivo sin `.md` |
| `familia` | sí | La que te indica tu prompt |
| `widget` | sí | Nombre del widget Elementor que te indica tu prompt (ej. `usil_cards_items`) |
| `nombre` | sí | Nombre legible |
| `variantes[].id` | sí | Id real de la variante, con guion: `v6-3`, nunca `v6.3` |
| `variantes[].etiqueta` | sí | Descripción visual corta |
| `variantes[].usar_cuando` | sí | Una o dos frases concretas |
| `variantes[].no_usar_cuando` | sí | Una o dos frases concretas, con la alternativa si existe |
| `variantes[].modos` | sí | `["light", "dark"]` salvo que tu fuente diga otra cosa |
| `variantes[].condiciones` | no | Lista de condiciones que deben cumplirse para considerar la variante |
| `variantes[].senal_items` | no | Señal numérica que cuenta los ítems (`n_beneficios`, `n_ponentes`...) |
| `variantes[].min_items` / `max_items` | no | Enteros. Solo si pones `senal_items` |
| `variantes[].requiere` | no | Subconjunto de: `imagen`, `icono`, `fecha`, `precio`, `cta`, `video` |

## Reglas duras

- Edita **solo** tu archivo de ficha y tu reporte. No toques `README.md`, `preguntas.md`, `solicitud.md`, el piloto, `src/lib/`, `package.json` ni otra ficha.
- **No uses git.** Sin commits, sin stash, sin checkout.
- **No inventes variantes.** Solo las que aparecen en tu fuente. Si tu fuente lista 3, la ficha tiene 3.
- **No inventes señales.** Solo las declaradas en `preguntas.md`. Si te falta una, no la uses: pídela en tu reporte.
- **No copies** el mismo `usar_cuando` en dos variantes. Si no sabes en qué se diferencian dos variantes, dilo en el reporte.
- Si tu fuente no dice cuántos ítems soporta una variante, **no pongas** `min_items`/`max_items`. No adivines números.
- Escribe en español, con acentos correctos. Los `id` van sin acentos.
- Prosa corta y concreta. Nada de "versátil", "moderno", "potente".
- `landing-logic.json` es generado: no lo edites a mano.

## Definición de hecho

1. `pnpm logic:build` termina con `landing-logic: OK` y tu ficha cuenta en el total.
2. La cantidad de variantes de la ficha coincide con la de tu fuente.
3. Reporte escrito en `docs/worker-reports/logic-<id>.md`.

## Reporte obligatorio

`docs/worker-reports/logic-<id>.md` con:

1. **Variantes cubiertas**: lista de ids, y de qué archivo fuente salió cada una.
2. **Señales que faltaron**: qué señal habrías necesitado y para qué variante. "Ninguna" si no faltó.
3. **Dudas**: variantes cuya diferencia no pudiste determinar, datos que no estaban en la fuente.
4. **Salida literal** de `pnpm logic:build`, pegada tal cual. Si no lo corriste o falló, dilo.

## Errores frecuentes

- Escribir `v6.3` en vez de `v6-3`.
- Dos bloques ```` ```json ```` en el mismo archivo (por ejemplo, uno de ejemplo en la prosa). Debe haber uno solo.
- `id` de la ficha distinto del nombre del archivo.
- Usar `op: "gte"` con una señal `bool`, o `op: "es"` con una numérica.
- Afirmar en el reporte que compiló sin haber corrido el comando.
