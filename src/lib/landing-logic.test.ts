/** Tests del compilador de landing-logic. Se corren con `pnpm logic:test`. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compileLandingLogic, extractJsonBlock, type LandingLogicSources } from './landing-logic.ts';

const md = (data: unknown): string => `# doc\n\n\`\`\`json\n${JSON.stringify(data)}\n\`\`\`\n`;

const preguntasBase = {
  version: '0.1',
  preguntas: [
    {
      id: 'tipo_landing',
      texto: '¿Tipo?',
      tipo: 'opcion_unica',
      obligatoria: true,
      opciones: [
        { valor: 'evento', etiqueta: 'Evento' },
        { valor: 'admision', etiqueta: 'Admisión' },
      ],
      produce: ['tipo_landing'],
    },
    {
      id: 'contenidos',
      texto: '¿Qué tienes?',
      tipo: 'opcion_multiple',
      obligatoria: false,
      opciones: [
        { valor: 'ponentes', etiqueta: 'Ponentes', senal: 'tiene_ponentes' },
        { valor: 'faq', etiqueta: 'FAQ', senal: 'tiene_faq' },
      ],
      produce: ['tiene_ponentes', 'tiene_faq'],
    },
  ],
  senales: [
    { id: 'tipo_landing', tipo: 'enum', valores: ['evento', 'admision'], origen: 'pregunta', fuente: 'tipo_landing' },
    { id: 'tiene_ponentes', tipo: 'bool', origen: 'pregunta', fuente: 'contenidos', defecto: false },
    { id: 'tiene_faq', tipo: 'bool', origen: 'pregunta', fuente: 'contenidos', defecto: false },
    { id: 'n_ponentes', tipo: 'numero', origen: 'inferida', defecto: 0 },
  ],
};

const fichaPonentes = {
  id: 'ponentes',
  familia: 'ponentes-testimonios',
  widget: 'usil_ponentes_testimonios',
  nombre: 'Ponentes',
  variantes: [
    {
      id: 'v7-4',
      etiqueta: 'Grilla',
      usar_cuando: 'Hay varios ponentes.',
      no_usar_cuando: 'Hay uno solo.',
      senal_items: 'n_ponentes',
      min_items: 2,
      max_items: 8,
      requiere: ['imagen'],
      modos: ['light', 'dark'],
    },
  ],
};

const fichaFormulario = {
  id: 'formulario',
  familia: 'formulario',
  widget: 'usil_formularios',
  nombre: 'Formulario',
  variantes: [{ id: 'v1', etiqueta: 'Único', usar_cuando: 'Siempre.', no_usar_cuando: 'Nunca.', modos: ['light', 'dark'] }],
};

const recetaEvento = {
  id: 'evento',
  nombre: 'Evento',
  cuando: [{ senal: 'tipo_landing', op: 'es', valor: 'evento' }],
  max_secciones: 6,
  secciones: [
    { ficha: 'formulario', obligatoria: true },
    {
      ficha: 'ponentes',
      obligatoria: false,
      condicion: [{ senal: 'tiene_ponentes', op: 'es', valor: true }],
      variantes_permitidas: ['v7-4'],
    },
  ],
};

const solicitudBase = {
  version: '0.1',
  campos: [
    { id: 'landing_logic_version', tipo: 'texto', obligatorio: true, se_llena_al: 'enviar', descripcion: 'Versión' },
    { id: 'respuestas', tipo: 'objeto', obligatorio: true, se_llena_al: 'enviar', descripcion: 'Respuestas' },
    { id: 'requested_by', tipo: 'usuario', obligatorio: true, se_llena_al: 'enviar', descripcion: 'Quién pidió' },
    { id: 'published_at', tipo: 'fecha_hora', obligatorio: false, se_llena_al: 'publicar', descripcion: 'Publicación' },
  ],
};

/** Copia profunda de las fuentes válidas, para mutar en cada test. */
function fixture(): {
  preguntas: typeof preguntasBase;
  ponentes: typeof fichaPonentes;
  receta: typeof recetaEvento;
  solicitud: typeof solicitudBase;
} {
  return structuredClone({ preguntas: preguntasBase, ponentes: fichaPonentes, receta: recetaEvento, solicitud: solicitudBase });
}

function sources(f: ReturnType<typeof fixture>): LandingLogicSources {
  return {
    preguntas: md(f.preguntas),
    widgets: { 'ponentes.md': md(f.ponentes), 'formulario.md': md(fichaFormulario) },
    recetas: { 'evento.md': md(f.receta) },
    solicitud: md(f.solicitud),
  };
}

function errorsOf(f: ReturnType<typeof fixture>): string[] {
  const r = compileLandingLogic(sources(f));
  assert.equal(r.data, null, 'se esperaba que la compilación fallara');
  return r.errors;
}

const hasError = (errors: string[], fragment: string): void =>
  assert.ok(errors.some((e) => e.includes(fragment)), `falta un error con "${fragment}" en:\n${errors.join('\n')}`);

test('compila fuentes válidas', () => {
  const r = compileLandingLogic(sources(fixture()));
  assert.deepEqual(r.errors, []);
  assert.equal(r.data?.recetas.length, 1);
  assert.deepEqual(r.data?.widgets.map((w) => w.id), ['formulario', 'ponentes']);
});

test('avisa de señales declaradas que nadie usa', () => {
  const r = compileLandingLogic(sources(fixture()));
  assert.ok(r.warnings.some((w) => w.includes('"tiene_faq"')));
  assert.ok(!r.warnings.some((w) => w.includes('"tiene_ponentes"')));
});

test('falla si un md no tiene bloque json o tiene más de uno', () => {
  assert.throws(() => extractJsonBlock('# sin bloque', 'x.md'), /no se encontró/);
  assert.throws(() => extractJsonBlock(md({}) + md({}), 'x.md'), /uno solo/);
  assert.throws(() => extractJsonBlock('```json\n{mal}\n```', 'x.md'), /no es JSON válido/);
});

test('falla si una receta nombra una ficha inexistente', () => {
  const f = fixture();
  f.receta.secciones[1]!.ficha = 'no-existe';
  hasError(errorsOf(f), 'la ficha "no-existe" no existe');
});

test('falla si una receta permite una variante que la ficha no tiene', () => {
  const f = fixture();
  f.receta.secciones[1]!.variantes_permitidas = ['v9-9'];
  hasError(errorsOf(f), 'la variante "v9-9" no existe en la ficha "ponentes"');
});

test('falla si una condición usa una señal no declarada', () => {
  const f = fixture();
  f.receta.secciones[1]!.condicion = [{ senal: 'tiene_magia', op: 'es', valor: true }];
  hasError(errorsOf(f), 'la señal "tiene_magia", que no está declarada');
});

test('falla si el operador no corresponde al tipo de la señal', () => {
  const f = fixture();
  f.receta.cuando = [{ senal: 'tipo_landing', op: 'gte', valor: 'evento' }];
  hasError(errorsOf(f), '"gte" solo aplica a señales numéricas');
});

test('falla si el valor no pertenece al enum', () => {
  const f = fixture();
  f.receta.cuando = [{ senal: 'tipo_landing', op: 'es', valor: 'congreso' }];
  hasError(errorsOf(f), 'valor no permitido');
});

test('falla si la receta no tiene secciones obligatorias', () => {
  const f = fixture();
  f.receta.secciones[0]!.obligatoria = false;
  hasError(errorsOf(f), 'no tiene ninguna sección obligatoria');
});

test('falla si la receta no incluye formulario', () => {
  const f = fixture();
  f.receta.secciones = [{ ...f.receta.secciones[1]!, obligatoria: true }];
  hasError(errorsOf(f), 'familia "formulario"');
});

test('falla si una variante cuenta ítems con una señal no numérica', () => {
  const f = fixture();
  f.ponentes.variantes[0]!.senal_items = 'tiene_ponentes';
  hasError(errorsOf(f), '"senal_items" debe ser una señal numérica');
});

test('falla si "requiere" tiene un valor fuera de la lista', () => {
  const f = fixture();
  f.ponentes.variantes[0]!.requiere = ['dinero'];
  hasError(errorsOf(f), '"requiere" tiene valores no permitidos: dinero');
});

test('falla si el id de la ficha no coincide con el archivo', () => {
  const f = fixture();
  f.ponentes.id = 'otro';
  hasError(errorsOf(f), 'debe coincidir con el nombre del archivo');
});

test('falla si una señal dice venir de una pregunta que no la produce', () => {
  const f = fixture();
  f.preguntas.preguntas[1]!.produce = ['tiene_ponentes'];
  (f.preguntas.preguntas[1]!.opciones[1] as { senal?: string }).senal = 'tiene_ponentes';
  hasError(errorsOf(f), 'esa pregunta no la lista en "produce"');
});

test('incluye el registro de solicitud en la salida', () => {
  const r = compileLandingLogic(sources(fixture()));
  assert.equal(r.data?.solicitud?.campos.length, 4);
});

test('falla si el registro de solicitud no tiene la versión de landing-logic', () => {
  const f = fixture();
  f.solicitud.campos = f.solicitud.campos.filter((c) => c.id !== 'landing_logic_version');
  hasError(errorsOf(f), 'falta el campo "landing_logic_version"');
});

test('falla si un campo de solicitud tiene tipo o etapa desconocidos', () => {
  const f = fixture();
  f.solicitud.campos[3]!.tipo = 'binario';
  f.solicitud.campos[3]!.se_llena_al = 'nunca';
  const errors = errorsOf(f);
  hasError(errors, '"tipo" debe ser uno de');
  hasError(errors, '"se_llena_al" debe ser uno de');
});
