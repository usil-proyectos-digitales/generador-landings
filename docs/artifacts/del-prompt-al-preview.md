# Del prompt al preview

> Backup en Markdown del artifact publicado en claude.ai. Ver también `AI-LANDING-FLOW.md` (guía compacta para agentes) y `docs/artifacts/del-prompt-a-landing.md` (documento maestro que fusiona este documento con el de backend/Dev).
>
> Artifact: https://claude.ai/code/artifact/22d2fbf2-f0c5-4103-a1ca-c36f6c190bb9

Flujo completo de la plataforma que Marketing usará para generar landings con IA: cómo entra la información, qué ve el usuario mientras la IA trabaja, y cómo se estructura el resultado que llega a Desarrollo.

- **Alcance**: onboarding hasta preview aprobado
- **Se conecta con**: el workflow en WordPress y publicación, en "Del prompt al sitio publicado"

La plataforma existe para resolver un problema puntual: hoy, construir una landing significa que un Dev traduzca a mano un pedido de Marketing a un widget, una variante y una paleta de colores. Este documento define la capa de UX que se interpone entre "Marketing tiene una idea" y "existe un preview navegable con la estructura correcta" — sin asumir todavía cómo se resuelve la generación puertas adentro, solo qué necesita ver y decidir el usuario en cada paso.

Un supuesto atraviesa las cuatro secciones: el motor de estilos que pinta ese preview no es el esquema anterior de clases fijas por Unidad de Negocio (BU), sino un `design.md` por BU — color, tipografía y el mapeo de qué rol tipográfico usa cada parte de un bloque, en un documento estructurado que ya se probó en 3 de las 9 BU. Esa es la pieza que hace posible que una IA pinte un preview de marca sin tener codificado a mano, por adelantado, qué combinación de estilos corresponde a cada Unidad de Negocio.

## 01 — Cómo entra el contenido

Tres formas de que el usuario le cuente a la IA qué landing quiere. Cada una cambia cuánto trabajo hace el usuario contra cuánto tiene que adivinar la IA — y adivinar mal cuesta un preview que no sirve y hay que regenerar.

| Método | Cómo funciona | A favor | En contra |
|---|---|---|---|
| **A — Prompt libre** (texto sin estructura) | El usuario escribe en un cuadro de texto lo que quiere, como si se lo describiera a una persona. | Cero fricción para empezar. Cubre casos que un formulario no anticipó. | La IA tiene que inferir campos obligatorios (título, oferta, CTA). Si el usuario omite uno, el preview sale incompleto y no queda claro por qué. |
| **B — Documento adjunto** (Word / PDF) | El usuario sube el brief que ya armó con Marketing — a menudo un documento que nunca se escribió pensando en que una máquina lo fuera a leer. | No duplica trabajo: reutiliza el brief que ya existe en el proceso actual. | Formato libre — tablas, bullets, texto corrido mezclados. Mayor superficie de error de extracción, y sin forma fácil de saber qué se leyó bien y qué no. |
| **C — Formulario guiado** (wizard, campos fijos) | Pantallas cortas con campos explícitos: objetivo, título, oferta, CTA, uno por uno. | Precisión alta — cada campo mapea directo a un dato que la IA necesita. Nunca falta lo obligatorio. | Más pasos, más fricción. Fuerza a pensar en campos que el usuario a veces no tiene resueltos todavía (ej. el CTA exacto). |
| **Híbrida** (recomendada) | Wizard corto con los campos que la IA *necesita sí o sí* para mapear a un widget (objetivo de la landing, título, oferta, llamado a la acción) + un campo de texto libre opcional al final para tono, contexto o cualquier cosa que no entre en un campo fijo. | Los campos obligatorios bajan drástico la tasa de preview incompleto; el campo libre absorbe todo lo que un formulario rígido no previó. | Hay que diseñar bien qué es "obligatorio" — si la lista crece, el wizard empieza a sentirse como el Formulario C. |

**Por qué la híbrida gana acá**: lo que la IA entrega al final no es texto — es una selección de widget, una variante, y un set de props tipadas por widget (título, cards, CTA...). Cuanto más estructurados llegan los datos de entrada, más directo es ese mapeo y menos casos de "la IA adivinó mal el layout". El campo libre no compite con eso: cubre el resto, tono y matices, que ningún campo fijo captura bien.

## 02 — Los cuatro pasos, pantalla por pantalla

Del primer clic al preview navegable. Cada paso describe qué ve el usuario y qué decisión toma — no cómo se resuelve técnicamente por dentro.

### 0. Login — Cuenta de WordPress

Antes de tocar contenido, el usuario entra con su propia cuenta de WordPress (login y roles nativos de WP, sin sistema de usuarios aparte) — eso identifica quién hace la solicitud y habilita su historial personal ("Mis solicitudes").

### 1. Onboarding — Selección de Unidad de Negocio

Primer y único paso obligatorio antes de tocar contenido: elegir para qué BU es la landing (Pregrado, Posgrado, Instituto de Emprendedores...). Esa elección no es cosmética — fija de entrada la identidad de marca completa de todo lo que sigue.

- Grilla de 9 tarjetas, una por BU, cada una mostrando su combinación real de color como referencia visual inmediata.
- Al elegir una, la plataforma carga el `design.md` de esa BU — no solo color: también la tipografía y qué rol usa cada parte de un bloque (título, texto, card, label).
- La BU queda fija para toda la sesión de generación; cambiarla más adelante reinicia el preview.

### 2. Captura — Contar qué landing se necesita

El wizard híbrido de la Sección 01: campos obligatorios primero, texto libre al final.

- Campos: objetivo de la campaña, título/propuesta, oferta o dato clave, llamado a la acción.
- Campo de texto libre, con placeholder que sugiere qué agregar ahí ("tono, referencias, algo que no entre arriba") — no un cuadro vacío intimidante.
- Un botón único de avance; no hay guardado intermedio porque no hay nada persistido todavía.

### 3. Estado de espera — La IA construye el boceto

Una pantalla de progreso con pasos visibles, no un spinner ciego — cada paso comunica un avance real, no un efecto decorativo.

- **Leyendo el contenido** — interpretando lo que se escribió o adjuntó.
- **Eligiendo la estructura** — decidiendo qué widget y qué variante encajan mejor con ese contenido.
- **Aplicando el estilo de marca** — resolviendo tipografía y color leyendo el `design.md` de la BU elegida en el Paso 1.
- **Armando el boceto** — ensamblando la vista final.

Nada de este paso se guarda todavía — es un proceso efímero. Si el usuario cierra la pestaña acá, no queda rastro ni hay que "limpiar" nada después.

### 4. Resultado — Entrega del preview

El boceto responsive, ya con los colores y tipografía de la BU aplicados, en una URL temporal de prueba.

- Este preview es estructura, no producto terminado — los textos son los que el usuario ingresó, sin pulido editorial ni imágenes finales.
- Aprobarlo no publica nada: crea una landing en Borrador — el mismo build real que vio el usuario en el preview, con la estructura y los textos ya cargados. Lo que falta (imágenes finales, SEO, Open Graph) lo completa Desarrollo antes de publicar, no un placeholder visual.

## 03 — La pantalla de preview, en detalle

Qué componentes necesita la pantalla de resultado para que el usuario pueda revisar, ajustar y decidir sin volver a empezar el wizard desde cero.

| Componente | Descripción |
|---|---|
| **Contenedor** — Vista responsive | Toggle Desktop / Mobile sobre el mismo preview — mismo contenido, sin recargar ni regenerar, solo cambia el ancho del lienzo. |
| **Identificador** — URL temporal | No es un boceto abstracto: es un build real de Astro con el contenido que armó la IA, disparado por GitHub Actions (mismo mecanismo que el deploy real) y subido a `previews/` en el mismo bucket S3 — servido por CloudFront. Se comparte esa URL con quien tenga que dar el visto bueno, sin pedirle que abra la plataforma. |
| **Panel lateral** — Editar textos | Ajustes puntuales sobre lo ya generado — título, texto de una card, CTA — sin volver a pasar por el wizard. |
| **Panel lateral** — Regenerar una sección | Pedirle a la IA que vuelva a intentar *solo* un bloque puntual — cambia su variante y sus props, no toca el resto del preview. |
| **Panel lateral** — Modo claro / oscuro | Alternar el widget entre `light` y `dark` — cada modo resuelve su propio color y tipografía dentro del mismo `design.md` de la BU, nunca sale de esa identidad de marca. |
| **Acción principal** — Aprobar y enviar | Cierra el ciclo de preview: envía el boceto como landing en borrador para que Desarrollo la complete y publique. |

## 04 — Mapa de pantallas

```
Onboarding → Captura → Estado de espera → Preview → [Editar/regenerar | Aprobar → borrador]
```

| Pantalla | Elementos clave |
|---|---|
| Onboarding | Grilla de 9 BU con swatch real · Estado seleccionado persistente · CTA único: continuar |
| Captura | 4 campos obligatorios · 1 campo de texto libre opcional · Sin guardado parcial |
| Estado de espera | 4 pasos con estado activo/hecho · Sin cancelar a mitad de camino · Nada persistido aún |
| Preview | Toggle desktop/mobile · Panel: editar, regenerar, variante · URL temporal visible y copiable |
| Editar / regenerar | Vuelve al preview, no al wizard · Cambios por sección, no globales · Sin límite de reintentos |
| Aprobar → borrador | Confirmación explícita, no automática · Handoff a Desarrollo · Cierra el ciclo de este documento |

## Fuera de alcance de este documento

Qué pasa entre "landing en borrador" y "landing publicada" — contenido real, imágenes, SEO, Open Graph, QA y publicación — corresponde al workflow del Dev en WordPress, cubierto en detalle en **"Del prompt al sitio publicado"**. Este documento termina donde Marketing suelta el preview aprobado.

Para que el Paso 1 y el Paso 3 funcionen como se describen acá, el `design.md` tiene que existir para las 9 BU — hoy cubre 3. Es la única dependencia dura de este flujo sobre trabajo que todavía no se terminó.
