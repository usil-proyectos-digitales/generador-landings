# Registro de solicitud — qué se guarda de cada landing pedida

> Borrador v0. Define el contrato de datos entre el wizard y el historial. El bloque json del final es lo que lee el compilador.

Cada vez que un cliente completa el wizard se crea un **registro de solicitud**. Es lo que se muestra en "Mis solicitudes" (cliente) y en el historial del Dev y del Supervisor (`docs/artifacts/del-prompt-a-landing-v2.md` §05).

Este archivo define **qué** se guarda. **Dónde y cómo** (post meta, pantallas, permisos, consultas entre subsitios) es trabajo del plugin PHP, fuera de este repo.

## Por qué guardar todo esto

Las preguntas del wizard van a cambiar. Si el historial guardara solo las respuestas sueltas, una solicitud vieja no se podría leer cuando cambien las preguntas. Por eso cada registro guarda:

1. Lo que el cliente respondió, tal cual.
2. Con qué versión de `landing-logic` se respondió.
3. Lo que la IA dedujo y decidió (señales, receta).
4. Lo que se entregó (`landing-spec.json`, página creada).
5. Quién hizo qué y cuándo.

## Campos

| Grupo | Campo | Se llena al | Qué guarda |
|---|---|---|---|
| Identidad | `id_solicitud` | enviar | Id único de la solicitud |
| | `bu` | enviar | Unidad de negocio elegida |
| | `subsitio_id` | enviar | Id del subsitio de la red multisitio |
| | `landing_logic_version` | enviar | Valor de `version` de `preguntas.md` con que se respondió |
| Entrada del cliente | `respuestas` | enviar | Objeto `id de pregunta → respuesta`, tal cual la dio el cliente |
| | `adjuntos` | enviar | Ids de medios de WordPress de los documentos adjuntos |
| Decisión de la IA | `senales` | generar | Objeto `id de señal → valor` con todas las señales resueltas |
| | `senales_inferidas` | generar | Lista de ids de señales que dedujo la IA (no las respondió el cliente) |
| | `receta` | generar | Id de la receta aplicada |
| | `landing_spec` | generar | El `landing-spec.json` completo que se usó para crear la página |
| Resultado | `page_id` | generar | Id de la página Elementor creada en borrador |
| | `gracias_page_id` | generar | Id de la página de gracias, si se generó |
| Historial | `requested_by` | enviar | Usuario que pidió la landing |
| | `requested_at` | enviar | Fecha y hora del envío |
| | `client_approved_at` | aprobar | Fecha y hora en que el cliente aprobó el preview |
| | `assigned_dev` | asignar | Dev que toma la landing |
| | `published_by` | publicar | Quién publicó |
| | `published_at` | publicar | Fecha y hora de publicación |

Los datos internos del formulario (`cierre_tipo`, `cierre_inscripciones`) no tienen campo propio: viven dentro de `respuestas` y `senales`, igual que el resto. El valor de `cierre_inscripciones` se copia además al campo ACF de la página.

## Reglas

- `respuestas` y `adjuntos` no se modifican después del envío. Si el cliente cambia algo, se registra como regeneración en el plugin, no se pisa lo original.
- `senales`, `receta` y `landing_spec` se reescriben si el cliente regenera el preview antes de aprobar. Después de aprobar quedan fijos.
- Los campos de historial (`requested_by` ... `published_at`) solo se llenan una vez, en el momento indicado.
- `landing_logic_version` es obligatorio: sin él, el registro no se puede interpretar a futuro.

## Ejemplo

```text
{
  "id_solicitud": "sol-2026-000123",
  "bu": "pregrado",
  "subsitio_id": 2,
  "landing_logic_version": "0.1",
  "respuestas": {
    "tipo_landing": "congreso",
    "objetivo": "inscripcion",
    "titulo_propuesta": "Congreso de Innovación 2026",
    "cierre_tipo": "otra_fecha",
    "cierre_inscripciones": "2026-11-20T23:59",
    "contenidos": ["ponentes", "faq"]
  },
  "adjuntos": [481],
  "senales": { "tipo_landing": "congreso", "tiene_ponentes": true, "n_ponentes": 6, "capta_leads": true },
  "senales_inferidas": ["n_ponentes"],
  "receta": "congreso",
  "landing_spec": { "bu": "pregrado", "sections": [] },
  "page_id": 210,
  "gracias_page_id": 211,
  "requested_by": 14,
  "requested_at": "2026-10-14T10:32:00",
  "client_approved_at": null,
  "assigned_dev": null,
  "published_by": null,
  "published_at": null
}
```

```json
{
  "version": "0.1",
  "campos": [
    { "id": "id_solicitud", "tipo": "texto", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Id único de la solicitud" },
    { "id": "bu", "tipo": "texto", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Unidad de negocio elegida" },
    { "id": "subsitio_id", "tipo": "entero", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Id del subsitio de la red multisitio" },
    { "id": "landing_logic_version", "tipo": "texto", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Versión de landing-logic con que se respondió" },
    { "id": "respuestas", "tipo": "objeto", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "id de pregunta → respuesta del cliente, sin modificar" },
    { "id": "adjuntos", "tipo": "lista", "obligatorio": false, "se_llena_al": "enviar", "descripcion": "Ids de medios de los documentos adjuntos" },
    { "id": "senales", "tipo": "objeto", "obligatorio": true, "se_llena_al": "generar", "descripcion": "id de señal → valor resuelto" },
    { "id": "senales_inferidas", "tipo": "lista", "obligatorio": true, "se_llena_al": "generar", "descripcion": "Ids de señales deducidas por la IA" },
    { "id": "receta", "tipo": "texto", "obligatorio": true, "se_llena_al": "generar", "descripcion": "Id de la receta aplicada" },
    { "id": "landing_spec", "tipo": "objeto", "obligatorio": true, "se_llena_al": "generar", "descripcion": "landing-spec.json usado para crear la página" },
    { "id": "page_id", "tipo": "entero", "obligatorio": true, "se_llena_al": "generar", "descripcion": "Id de la página Elementor en borrador" },
    { "id": "gracias_page_id", "tipo": "entero", "obligatorio": false, "se_llena_al": "generar", "descripcion": "Id de la página de gracias, si se generó" },
    { "id": "requested_by", "tipo": "usuario", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Usuario que pidió la landing" },
    { "id": "requested_at", "tipo": "fecha_hora", "obligatorio": true, "se_llena_al": "enviar", "descripcion": "Fecha y hora del envío" },
    { "id": "client_approved_at", "tipo": "fecha_hora", "obligatorio": false, "se_llena_al": "aprobar", "descripcion": "Aprobación del preview por el cliente" },
    { "id": "assigned_dev", "tipo": "usuario", "obligatorio": false, "se_llena_al": "asignar", "descripcion": "Dev que toma la landing" },
    { "id": "published_by", "tipo": "usuario", "obligatorio": false, "se_llena_al": "publicar", "descripcion": "Quién publicó" },
    { "id": "published_at", "tipo": "fecha_hora", "obligatorio": false, "se_llena_al": "publicar", "descripcion": "Fecha y hora de publicación" }
  ]
}
```
