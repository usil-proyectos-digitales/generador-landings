# Preguntas del wizard y señales

> Borrador v0. Pendiente de corrección por el equipo. El bloque json del final es lo que lee el compilador.

El cliente ya eligió su Unidad de Negocio antes de llegar aquí; la BU no es una pregunta de este archivo.

## Preguntas

Son 11. Las 5 primeras son obligatorias. Están pensadas para responderse en menos de 3 minutos sin conocer los widgets.

| # | id | Pregunta | Tipo | Obligatoria |
|---|---|---|---|---|
| 1 | `tipo_landing` | ¿Qué tipo de landing necesitas? | opción única | sí |
| 2 | `objetivo` | ¿Qué quieres que haga la persona que entra? | opción única | sí |
| 3 | `titulo_propuesta` | ¿Cuál es el título o mensaje principal? | texto | sí |
| 4 | `oferta` | ¿Qué ofreces? Descríbelo en pocas líneas. | texto largo | sí |
| 5 | `cta` | ¿Qué texto lleva el botón principal? | texto | sí |
| 6 | `datos_evento` | Fecha, hora, lugar y modalidad | grupo | solo evento, congreso y webinar |
| 7 | `cierre_tipo` | ¿Hasta cuándo se reciben inscripciones? | opción única | sí, si hay formulario |
| 8 | `cierre_inscripciones` | Fecha y hora de cierre | fecha y hora | solo si en la 7 eligió "otra fecha" |
| 9 | `contenidos` | ¿Qué contenido tienes para mostrar? (10 casillas) | opción múltiple | no |
| 10 | `imagenes` | ¿Tienes fotos o imágenes propias? | opción única | no |
| 11 | `extra` | Texto libre y documento adjunto (Word/PDF) | texto + archivo | no |

### Por qué estas

- **1 `tipo_landing`** elige la receta. Es la pregunta que más pesa.
- **2 `objetivo`** decide si la landing lleva formulario y dónde.
- **3, 4 y 5** son contenido puro: no cambian la estructura, alimentan los textos.
- **6 `datos_evento`** solo aparece si el tipo es evento, congreso o webinar. Activa el bloque de fecha.
- **7 `cierre_tipo` y 8 `cierre_inscripciones`** son datos internos: no se muestran en la landing ni cambian qué widgets se usan. Sirven para desactivar el formulario a tiempo. Ver "Dos fechas distintas" más abajo.
- **9 `contenidos`** es la lista de "qué tengo". Cada casilla enciende una sección opcional de la receta.
- **10 `imagenes`** evita elegir variantes con foto cuando no hay fotos.
- **11 `extra`** es de donde la IA saca las cantidades (cuántos ponentes, cuántos beneficios).

### Opciones

**1. `tipo_landing`**

| Valor | Etiqueta para el cliente |
|---|---|
| `admision` | Admisión o programa (carrera, maestría, diplomado) |
| `evento` | Evento presencial o híbrido |
| `congreso` | Congreso (varios ponentes, programa de sesiones) |
| `webinar` | Webinar o charla online |
| `curso_corto` | Curso corto o taller |

La página de gracias no es una opción: se genera siempre que la landing tenga formulario (señal `genera_gracias`). Sin formulario no se genera.

**2. `objetivo`**

| Valor | Etiqueta para el cliente |
|---|---|
| `inscripcion` | Que se inscriba o deje sus datos |
| `informar` | Que conozca la propuesta (sin formulario) |

No existe compra directa: no hay pasarela de pago integrada. Lo normal es `inscripcion`. Si además hay un link de pago externo, se marca en la pregunta 9 y convive con el formulario.

**7. `cierre_tipo`**

| Valor | Etiqueta para el cliente | Cuándo se ofrece |
|---|---|---|
| `mismo_evento` | El mismo día y hora del evento | Solo si hay fecha de evento (evento, congreso, webinar) |
| `otra_fecha` | Otra fecha y hora | Siempre |
| `sin_cierre` | No tiene fecha de cierre, o aún no está definida | Siempre |

**9. `contenidos`** (casillas)

| Valor | Etiqueta para el cliente | Señal que enciende |
|---|---|---|
| `ponentes` | Ponentes o docentes | `tiene_ponentes` |
| `testimonios` | Testimonios de alumnos o egresados | `tiene_testimonios` |
| `beneficios` | Beneficios o diferenciales | `tiene_beneficios` |
| `temario` | Plan de estudios o temario | `tiene_temario` |
| `faq` | Preguntas frecuentes | `tiene_faq` |
| `video` | Video | `tiene_video` |
| `cifras` | Cifras, rankings o acreditaciones | `tiene_cifras` |
| `precio` | Precios o inversión | `tiene_precio` |
| `programas` | Lista de carreras o programas | `tiene_listado_programas` |
| `link_pago` | Link de pago externo | `tiene_link_pago` |

**10. `imagenes`**

| Valor | Etiqueta para el cliente |
|---|---|
| `si` | Sí, tengo imágenes |
| `no` | No, usen imágenes de referencia |

## Dos fechas distintas

| Fecha | Pregunta | Se ve en la landing | Campo ACF | Para qué |
|---|---|---|---|---|
| Del evento | 6 `datos_evento` | Sí | `fecha_del_evento` | Bloque de fecha (save the date) |
| Cierre de inscripciones | 8 `cierre_inscripciones` | No | `cierre_inscripciones` (nuevo) | Desactivar el formulario |

A veces no coinciden: las inscripciones pueden cerrar antes del evento (cupo, logística), o un programa sin fecha de evento puede tener fecha límite de postulación.

Flujo en el wizard:

1. Se pregunta la fecha del evento (pregunta 6), si el tipo de landing la tiene.
2. Se pregunta hasta cuándo se reciben inscripciones (pregunta 7), con una casilla:
   - **El mismo día y hora del evento**: no se pide nada más. `cierre_inscripciones` queda vacío.
   - **Otra fecha y hora**: recién aquí aparece la pregunta 8 y se llena `cierre_inscripciones`.
   - **No tiene fecha de cierre, o aún no está definida**: disponible en todos los tipos, para no frenar la solicitud. `cierre_inscripciones` queda vacío y el Dev lo completa después si el cliente lo define.

Regla del bloque de formulario (la implementa el widget, fuera de este repo):

- Si `cierre_inscripciones` tiene valor, el formulario se bloquea al pasar esa fecha y hora.
- Si está vacío, se bloquea al pasar `fecha_del_evento`.
- Si los dos están vacíos, no se bloquea solo.

Ojo: "mismo día del evento" y "sin fecha de cierre" dejan el campo vacío por igual, así que en una landing con fecha de evento las dos opciones terminan bloqueando el formulario al pasar el evento. La diferencia queda registrada en la solicitud (`cierre_inscripcion`), para que el Dev sepa si el cierre está confirmado o pendiente.

Las preguntas 7 y 8 solo aparecen si la landing tiene formulario (`objetivo` = `inscripcion`).

## Señales

### Respondidas por el cliente

| Señal | Tipo | Valores | Pregunta |
|---|---|---|---|
| `tipo_landing` | enum | `admision`, `evento`, `congreso`, `webinar`, `curso_corto` | 1 |
| `objetivo` | enum | `inscripcion`, `informar` | 2 |
| `tiene_fecha` | bool | | 6 |
| `modalidad` | enum | `presencial`, `virtual`, `hibrida`, `no_aplica` | 6 |
| `cierre_inscripcion` | enum | `mismo_evento`, `otra_fecha`, `sin_cierre` | 7 |
| `tiene_ponentes` | bool | | 9 |
| `tiene_testimonios` | bool | | 9 |
| `tiene_beneficios` | bool | | 9 |
| `tiene_temario` | bool | | 9 |
| `tiene_faq` | bool | | 9 |
| `tiene_video` | bool | | 9 |
| `tiene_cifras` | bool | | 9 |
| `tiene_precio` | bool | | 9 |
| `tiene_listado_programas` | bool | | 9 |
| `tiene_link_pago` | bool | | 9 |
| `tiene_imagenes` | bool | | 10 |

### Inferidas por la IA

Salen del texto de `oferta`, del texto libre y del documento adjunto. Si no hay dato, valen 0.

| Señal | Qué cuenta |
|---|---|
| `n_beneficios` | Beneficios o diferenciales distintos |
| `n_ponentes` | Ponentes o docentes con nombre |
| `n_testimonios` | Testimonios con autor |
| `n_faq` | Preguntas frecuentes |
| `n_programas` | Carreras o programas listados |
| `n_cifras` | Cifras o rankings concretos |

### Derivadas

| Señal | Regla |
|---|---|
| `capta_leads` | sí cuando `objetivo` es `inscripcion` |
| `genera_gracias` | sí cuando `capta_leads` es sí |

## Decisiones del equipo (2026-10-13)

1. Se agrega el tipo `congreso`. Suele incluir ponentes.
2. Toda landing termina en formulario; no hay compra directa. Puede haber formulario y, además, un link de pago externo (`tiene_link_pago`).
3. La página de gracias se genera siempre que haya formulario. Una landing sin formulario es poco probable, pero posible (`objetivo: informar`).
4. Se manejan dos fechas: la del evento (visible, ACF `fecha_del_evento`) y el cierre de inscripciones (interna, ACF nuevo `cierre_inscripciones`). El cierre solo se pide si el cliente marca "otra fecha y hora"; si queda vacío, el formulario se bloquea al pasar `fecha_del_evento`.

```json
{
  "version": "0.1",
  "preguntas": [
    {
      "id": "tipo_landing",
      "texto": "¿Qué tipo de landing necesitas?",
      "tipo": "opcion_unica",
      "obligatoria": true,
      "opciones": [
        { "valor": "admision", "etiqueta": "Admisión o programa (carrera, maestría, diplomado)" },
        { "valor": "evento", "etiqueta": "Evento presencial o híbrido" },
        { "valor": "congreso", "etiqueta": "Congreso (varios ponentes, programa de sesiones)" },
        { "valor": "webinar", "etiqueta": "Webinar o charla online" },
        { "valor": "curso_corto", "etiqueta": "Curso corto o taller" }
      ],
      "produce": ["tipo_landing"]
    },
    {
      "id": "objetivo",
      "texto": "¿Qué quieres que haga la persona que entra?",
      "tipo": "opcion_unica",
      "obligatoria": true,
      "opciones": [
        { "valor": "inscripcion", "etiqueta": "Que se inscriba o deje sus datos" },
        { "valor": "informar", "etiqueta": "Que conozca la propuesta (sin formulario)" }
      ],
      "produce": ["objetivo"]
    },
    {
      "id": "titulo_propuesta",
      "texto": "¿Cuál es el título o mensaje principal?",
      "tipo": "texto",
      "obligatoria": true,
      "produce": []
    },
    {
      "id": "oferta",
      "texto": "¿Qué ofreces? Descríbelo en pocas líneas.",
      "tipo": "texto_largo",
      "obligatoria": true,
      "produce": []
    },
    {
      "id": "cta",
      "texto": "¿Qué texto lleva el botón principal?",
      "tipo": "texto",
      "obligatoria": true,
      "produce": []
    },
    {
      "id": "datos_evento",
      "texto": "Fecha, hora, lugar y modalidad",
      "tipo": "grupo_evento",
      "obligatoria": true,
      "mostrar_si": [{ "senal": "tipo_landing", "op": "en", "valor": ["evento", "congreso", "webinar"] }],
      "produce": ["tiene_fecha", "modalidad"]
    },
    {
      "id": "cierre_tipo",
      "texto": "¿Hasta cuándo se reciben inscripciones?",
      "ayuda": "No se muestra en la landing. Sirve para desactivar el formulario a tiempo.",
      "tipo": "opcion_unica",
      "obligatoria": true,
      "interna": true,
      "mostrar_si": [{ "senal": "objetivo", "op": "es", "valor": "inscripcion" }],
      "opciones": [
        {
          "valor": "mismo_evento",
          "etiqueta": "El mismo día y hora del evento",
          "mostrar_si": [{ "senal": "tipo_landing", "op": "en", "valor": ["evento", "congreso", "webinar"] }]
        },
        { "valor": "otra_fecha", "etiqueta": "Otra fecha y hora" },
        { "valor": "sin_cierre", "etiqueta": "No tiene fecha de cierre, o aún no está definida" }
      ],
      "produce": ["cierre_inscripcion"]
    },
    {
      "id": "cierre_inscripciones",
      "texto": "Fecha y hora de cierre de inscripciones",
      "tipo": "fecha_hora",
      "obligatoria": true,
      "interna": true,
      "destino_acf": "cierre_inscripciones",
      "mostrar_si": [{ "senal": "cierre_inscripcion", "op": "es", "valor": "otra_fecha" }],
      "produce": []
    },
    {
      "id": "contenidos",
      "texto": "¿Qué contenido tienes para mostrar?",
      "tipo": "opcion_multiple",
      "obligatoria": false,
      "opciones": [
        { "valor": "ponentes", "etiqueta": "Ponentes o docentes", "senal": "tiene_ponentes" },
        { "valor": "testimonios", "etiqueta": "Testimonios de alumnos o egresados", "senal": "tiene_testimonios" },
        { "valor": "beneficios", "etiqueta": "Beneficios o diferenciales", "senal": "tiene_beneficios" },
        { "valor": "temario", "etiqueta": "Plan de estudios o temario", "senal": "tiene_temario" },
        { "valor": "faq", "etiqueta": "Preguntas frecuentes", "senal": "tiene_faq" },
        { "valor": "video", "etiqueta": "Video", "senal": "tiene_video" },
        { "valor": "cifras", "etiqueta": "Cifras, rankings o acreditaciones", "senal": "tiene_cifras" },
        { "valor": "precio", "etiqueta": "Precios o inversión", "senal": "tiene_precio" },
        { "valor": "programas", "etiqueta": "Lista de carreras o programas", "senal": "tiene_listado_programas" },
        { "valor": "link_pago", "etiqueta": "Link de pago externo", "senal": "tiene_link_pago" }
      ],
      "produce": [
        "tiene_ponentes", "tiene_testimonios", "tiene_beneficios", "tiene_temario", "tiene_faq",
        "tiene_video", "tiene_cifras", "tiene_precio", "tiene_listado_programas", "tiene_link_pago"
      ]
    },
    {
      "id": "imagenes",
      "texto": "¿Tienes fotos o imágenes propias?",
      "tipo": "opcion_unica",
      "obligatoria": false,
      "opciones": [
        { "valor": "si", "etiqueta": "Sí, tengo imágenes" },
        { "valor": "no", "etiqueta": "No, usen imágenes de referencia" }
      ],
      "produce": ["tiene_imagenes"]
    },
    {
      "id": "extra",
      "texto": "¿Algo más que debamos saber? Puedes adjuntar un Word o PDF.",
      "tipo": "texto_y_archivo",
      "obligatoria": false,
      "produce": []
    }
  ],
  "senales": [
    { "id": "tipo_landing", "tipo": "enum", "valores": ["admision", "evento", "congreso", "webinar", "curso_corto"], "origen": "pregunta", "fuente": "tipo_landing" },
    { "id": "objetivo", "tipo": "enum", "valores": ["inscripcion", "informar"], "origen": "pregunta", "fuente": "objetivo" },
    { "id": "tiene_fecha", "tipo": "bool", "origen": "pregunta", "fuente": "datos_evento", "defecto": false },
    { "id": "modalidad", "tipo": "enum", "valores": ["presencial", "virtual", "hibrida", "no_aplica"], "origen": "pregunta", "fuente": "datos_evento", "defecto": "no_aplica" },
    { "id": "cierre_inscripcion", "tipo": "enum", "valores": ["mismo_evento", "otra_fecha", "sin_cierre"], "origen": "pregunta", "fuente": "cierre_tipo", "defecto": "sin_cierre" },
    { "id": "tiene_ponentes", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_testimonios", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_beneficios", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_temario", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_faq", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_video", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_cifras", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_precio", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_listado_programas", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_link_pago", "tipo": "bool", "origen": "pregunta", "fuente": "contenidos", "defecto": false },
    { "id": "tiene_imagenes", "tipo": "bool", "origen": "pregunta", "fuente": "imagenes", "defecto": false },
    { "id": "n_beneficios", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Beneficios o diferenciales distintos" },
    { "id": "n_ponentes", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Ponentes o docentes con nombre" },
    { "id": "n_testimonios", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Testimonios con autor" },
    { "id": "n_faq", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Preguntas frecuentes" },
    { "id": "n_programas", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Carreras o programas listados" },
    { "id": "n_cifras", "tipo": "numero", "origen": "inferida", "defecto": 0, "descripcion": "Cifras o rankings concretos" },
    {
      "id": "capta_leads",
      "tipo": "bool",
      "origen": "derivada",
      "regla": [{ "senal": "objetivo", "op": "es", "valor": "inscripcion" }],
      "defecto": false
    },
    {
      "id": "genera_gracias",
      "tipo": "bool",
      "origen": "derivada",
      "regla": [{ "senal": "capta_leads", "op": "es", "valor": true }],
      "defecto": false
    }
  ]
}
```
