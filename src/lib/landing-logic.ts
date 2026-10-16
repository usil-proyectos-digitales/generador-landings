/**
 * landing-logic — compilador y validador de `src/data/landing-logic/`.
 *
 * Cada `.md` de esa carpeta documenta una pieza para humanos y embebe un
 * bloque ```json``` con los mismos datos (misma técnica que `design-md.ts`).
 * Este módulo extrae esos bloques, valida que las tres piezas encajen
 * (preguntas → señales → recetas → fichas de widgets) y devuelve un único
 * objeto listo para serializar a `src/data/landing-logic.json`.
 *
 * Es puro: recibe el contenido de los archivos, no toca disco. El script que
 * lee/escribe es `landing-logic.build.ts`.
 */

export type SignalType = 'enum' | 'bool' | 'numero';
export type SignalOrigin = 'pregunta' | 'inferida' | 'derivada';
export type ConditionOp = 'es' | 'en' | 'gte' | 'lte';
export type Mode = 'light' | 'dark';

export interface Condition {
  senal: string;
  op: ConditionOp;
  valor: string | number | boolean | string[];
}

export interface QuestionOption {
  valor: string;
  etiqueta: string;
  senal?: string;
}

export interface Question {
  id: string;
  texto: string;
  tipo: string;
  obligatoria: boolean;
  opciones?: QuestionOption[];
  mostrar_si?: Condition[];
  produce: string[];
}

export interface Signal {
  id: string;
  tipo: SignalType;
  origen: SignalOrigin;
  valores?: string[];
  fuente?: string;
  regla?: Condition[];
  defecto?: string | number | boolean;
  descripcion?: string;
}

export interface WidgetVariant {
  id: string;
  etiqueta: string;
  usar_cuando: string;
  no_usar_cuando: string;
  condiciones?: Condition[];
  senal_items?: string;
  min_items?: number;
  max_items?: number;
  requiere?: string[];
  modos: Mode[];
}

export interface WidgetSheet {
  id: string;
  familia: string;
  widget: string;
  nombre: string;
  variantes: WidgetVariant[];
}

export interface RecipeSection {
  ficha: string;
  obligatoria: boolean;
  condicion?: Condition[];
  variantes_permitidas?: string[];
  nota?: string;
}

export interface Recipe {
  id: string;
  nombre: string;
  cuando: Condition[];
  max_secciones: number;
  secciones: RecipeSection[];
}

export type RecordFieldType = 'texto' | 'entero' | 'fecha_hora' | 'usuario' | 'objeto' | 'lista';
export type RecordStage = 'enviar' | 'generar' | 'aprobar' | 'asignar' | 'publicar';

export interface RecordField {
  id: string;
  tipo: RecordFieldType;
  obligatorio: boolean;
  se_llena_al: RecordStage;
  descripcion: string;
}

/** Contrato de lo que se guarda de cada solicitud (`solicitud.md`). */
export interface RequestRecord {
  version: string;
  campos: RecordField[];
}

export interface LandingLogic {
  version: string;
  preguntas: Question[];
  senales: Signal[];
  widgets: WidgetSheet[];
  recetas: Recipe[];
  solicitud: RequestRecord | null;
}

export interface LandingLogicSources {
  /** Contenido de `preguntas.md`. */
  preguntas: string;
  /** nombre de archivo → contenido, de `widgets/*.md`. */
  widgets: Record<string, string>;
  /** nombre de archivo → contenido, de `recetas/*.md`. */
  recetas: Record<string, string>;
  /** Contenido de `solicitud.md`. Opcional para poder compilar sin él. */
  solicitud?: string;
}

export interface CompileResult {
  data: LandingLogic | null;
  errors: string[];
  warnings: string[];
}

/** Lo que una variante puede exigir del contenido del cliente. */
export const REQUIREMENTS = ['imagen', 'icono', 'fecha', 'precio', 'cta', 'video'] as const;

const SIGNAL_TYPES: SignalType[] = ['enum', 'bool', 'numero'];
const SIGNAL_ORIGINS: SignalOrigin[] = ['pregunta', 'inferida', 'derivada'];
const MODES: Mode[] = ['light', 'dark'];
const RECORD_TYPES: RecordFieldType[] = ['texto', 'entero', 'fecha_hora', 'usuario', 'objeto', 'lista'];
const RECORD_STAGES: RecordStage[] = ['enviar', 'generar', 'aprobar', 'asignar', 'publicar'];
/** Sin estos campos un registro de solicitud no se puede interpretar a futuro. */
const REQUIRED_RECORD_FIELDS = ['landing_logic_version', 'respuestas', 'requested_by'];
const ID_PATTERN = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
/** Familia que toda receta debe incluir: todas las landings terminan en formulario. */
const FORM_FAMILY = 'formulario';

type Json = Record<string, unknown>;

function isObject(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

/** Extrae y parsea el único bloque ```json``` de un `.md`. */
export function extractJsonBlock(raw: string, file: string): unknown {
  const blocks = [...raw.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (blocks.length === 0) throw new Error(`${file}: no se encontró bloque \`\`\`json\`\`\``);
  if (blocks.length > 1) throw new Error(`${file}: hay ${blocks.length} bloques \`\`\`json\`\`\`, debe haber uno solo`);
  try {
    return JSON.parse(blocks[0]![1]!);
  } catch (e) {
    throw new Error(`${file}: el bloque json no es JSON válido (${(e as Error).message})`);
  }
}

class Validator {
  errors: string[] = [];
  warnings: string[] = [];
  signals = new Map<string, Signal>();
  usedSignals = new Set<string>();

  err(where: string, msg: string): void {
    this.errors.push(`${where}: ${msg}`);
  }

  requireString(obj: Json, key: string, where: string): boolean {
    if (typeof obj[key] === 'string' && (obj[key] as string).trim() !== '') return true;
    this.err(where, `falta el campo de texto "${key}"`);
    return false;
  }

  requireId(obj: Json, key: string, where: string): boolean {
    if (!this.requireString(obj, key, where)) return false;
    if (ID_PATTERN.test(obj[key] as string)) return true;
    this.err(where, `"${key}": "${String(obj[key])}" no es un id válido (minúsculas, números, "-" o "_")`);
    return false;
  }

  conditions(value: unknown, where: string): void {
    if (!Array.isArray(value)) {
      this.err(where, 'debe ser una lista de condiciones');
      return;
    }
    value.forEach((c, i) => this.condition(c, `${where}[${i}]`));
  }

  condition(c: unknown, where: string): void {
    if (!isObject(c) || typeof c.senal !== 'string' || typeof c.op !== 'string' || !('valor' in c)) {
      this.err(where, 'una condición necesita "senal", "op" y "valor"');
      return;
    }
    const signal = this.signals.get(c.senal);
    if (!signal) {
      this.err(where, `usa la señal "${c.senal}", que no está declarada en preguntas.md`);
      return;
    }
    this.usedSignals.add(signal.id);
    const { op, valor } = c;
    const inValues = (v: unknown) => typeof v === 'string' && (signal.valores ?? []).includes(v);

    if (op === 'es') {
      if (signal.tipo === 'bool' && typeof valor === 'boolean') return;
      if (signal.tipo === 'enum' && inValues(valor)) return;
      this.err(where, `"es" sobre "${signal.id}" (${signal.tipo}) con valor no permitido: ${JSON.stringify(valor)}`);
    } else if (op === 'en') {
      if (signal.tipo === 'enum' && Array.isArray(valor) && valor.length > 0 && valor.every(inValues)) return;
      this.err(where, `"en" sobre "${signal.id}" necesita una lista de valores válidos de un enum: ${JSON.stringify(valor)}`);
    } else if (op === 'gte' || op === 'lte') {
      if (signal.tipo === 'numero' && typeof valor === 'number') return;
      this.err(where, `"${op}" solo aplica a señales numéricas con valor numérico ("${signal.id}" es ${signal.tipo})`);
    } else {
      this.err(where, `operador desconocido "${op}" (válidos: es, en, gte, lte)`);
    }
  }
}

function validateSignals(v: Validator, raw: unknown, questionIds: Set<string>): Signal[] {
  if (!Array.isArray(raw)) {
    v.err('preguntas.md', '"senales" debe ser una lista');
    return [];
  }
  const out: Signal[] = [];
  raw.forEach((s, i) => {
    const where = `preguntas.md senales[${i}]`;
    if (!isObject(s) || !v.requireId(s, 'id', where)) return;
    const id = s.id as string;
    const w = `preguntas.md señal "${id}"`;
    if (v.signals.has(id)) return v.err(w, 'está declarada dos veces');
    if (!SIGNAL_TYPES.includes(s.tipo as SignalType)) return v.err(w, `"tipo" debe ser uno de: ${SIGNAL_TYPES.join(', ')}`);
    if (!SIGNAL_ORIGINS.includes(s.origen as SignalOrigin)) return v.err(w, `"origen" debe ser uno de: ${SIGNAL_ORIGINS.join(', ')}`);
    if (s.tipo === 'enum' && (!isStringArray(s.valores) || s.valores.length === 0)) return v.err(w, 'un enum necesita "valores"');
    if (s.origen === 'pregunta' && (typeof s.fuente !== 'string' || !questionIds.has(s.fuente))) {
      return v.err(w, `"fuente" debe ser el id de una pregunta existente (tiene: ${JSON.stringify(s.fuente)})`);
    }
    if (s.origen === 'derivada' && !Array.isArray(s.regla)) return v.err(w, 'una señal derivada necesita "regla"');
    const signal = s as unknown as Signal;
    v.signals.set(id, signal);
    out.push(signal);
  });
  // Las reglas se validan al final: pueden referirse a señales declaradas después.
  out.forEach((s) => s.regla && v.conditions(s.regla, `preguntas.md señal "${s.id}" regla`));
  return out;
}

function validateQuestions(v: Validator, questions: Question[]): void {
  const producedBy = new Map<string, string>();
  questions.forEach((q) => {
    const w = `preguntas.md pregunta "${q.id}"`;
    if (!isStringArray(q.produce)) return v.err(w, '"produce" debe ser una lista de ids de señal');
    q.produce.forEach((sid) => {
      if (!v.signals.has(sid)) return v.err(w, `produce la señal "${sid}", que no está declarada`);
      producedBy.set(sid, q.id);
    });
    if (q.mostrar_si) v.conditions(q.mostrar_si, `${w} mostrar_si`);
    const needsOptions = q.tipo === 'opcion_unica' || q.tipo === 'opcion_multiple';
    if (needsOptions && (!Array.isArray(q.opciones) || q.opciones.length < 2)) {
      return v.err(w, 'una pregunta de opciones necesita al menos 2 "opciones"');
    }
    const seen = new Set<string>();
    (q.opciones ?? []).forEach((o) => {
      if (!isObject(o) || typeof o.valor !== 'string' || typeof o.etiqueta !== 'string') {
        return v.err(w, 'cada opción necesita "valor" y "etiqueta"');
      }
      if (seen.has(o.valor)) v.err(w, `opción repetida "${o.valor}"`);
      seen.add(o.valor);
      if (o.senal !== undefined && !q.produce.includes(o.senal)) {
        v.err(w, `la opción "${o.valor}" enciende "${o.senal}", que no está en "produce"`);
      }
    });
  });
  v.signals.forEach((s) => {
    if (s.origen === 'pregunta' && producedBy.get(s.id) !== s.fuente) {
      v.err(`preguntas.md señal "${s.id}"`, `dice venir de la pregunta "${s.fuente}", pero esa pregunta no la lista en "produce"`);
    }
  });
}

function parseQuestions(v: Validator, raw: unknown): Question[] {
  if (!Array.isArray(raw)) {
    v.err('preguntas.md', '"preguntas" debe ser una lista');
    return [];
  }
  const out: Question[] = [];
  const seen = new Set<string>();
  raw.forEach((q, i) => {
    const where = `preguntas.md preguntas[${i}]`;
    if (!isObject(q) || !v.requireId(q, 'id', where)) return;
    const w = `preguntas.md pregunta "${String(q.id)}"`;
    if (seen.has(q.id as string)) return v.err(w, 'id repetido');
    seen.add(q.id as string);
    const ok = v.requireString(q, 'texto', w) && v.requireString(q, 'tipo', w);
    if (typeof q.obligatoria !== 'boolean') return v.err(w, 'falta "obligatoria" (true/false)');
    if (ok) out.push(q as unknown as Question);
  });
  return out;
}

function validateSheet(v: Validator, raw: unknown, file: string): WidgetSheet | null {
  const where = `widgets/${file}`;
  if (!isObject(raw)) {
    v.err(where, 'el bloque json debe ser un objeto');
    return null;
  }
  const ok =
    v.requireId(raw, 'id', where) &&
    v.requireId(raw, 'familia', where) &&
    v.requireString(raw, 'widget', where) &&
    v.requireString(raw, 'nombre', where);
  if (!ok) return null;
  if (`${raw.id as string}.md` !== file) v.err(where, `el "id" ("${raw.id as string}") debe coincidir con el nombre del archivo`);
  if (!Array.isArray(raw.variantes) || raw.variantes.length === 0) {
    v.err(where, 'necesita al menos una variante en "variantes"');
    return null;
  }
  const seen = new Set<string>();
  raw.variantes.forEach((va, i) => {
    if (!isObject(va) || !v.requireId(va, 'id', `${where} variantes[${i}]`)) return;
    const w = `${where} variante "${va.id as string}"`;
    if (seen.has(va.id as string)) v.err(w, 'id repetido');
    seen.add(va.id as string);
    v.requireString(va, 'etiqueta', w);
    v.requireString(va, 'usar_cuando', w);
    v.requireString(va, 'no_usar_cuando', w);
    if (!isStringArray(va.modos) || va.modos.length === 0 || !va.modos.every((m) => MODES.includes(m as Mode))) {
      v.err(w, `"modos" debe ser una lista no vacía con: ${MODES.join(', ')}`);
    }
    if (va.condiciones !== undefined) v.conditions(va.condiciones, `${w} condiciones`);
    if (va.requiere !== undefined) {
      const bad = isStringArray(va.requiere) ? va.requiere.filter((r) => !(REQUIREMENTS as readonly string[]).includes(r)) : ['(no es lista)'];
      if (bad.length) v.err(w, `"requiere" tiene valores no permitidos: ${bad.join(', ')} (válidos: ${REQUIREMENTS.join(', ')})`);
    }
    const hasRange = va.min_items !== undefined || va.max_items !== undefined;
    if (va.senal_items !== undefined) {
      const s = typeof va.senal_items === 'string' ? v.signals.get(va.senal_items) : undefined;
      if (!s || s.tipo !== 'numero') v.err(w, `"senal_items" debe ser una señal numérica declarada (tiene: ${JSON.stringify(va.senal_items)})`);
      else v.usedSignals.add(s.id);
    } else if (hasRange) {
      v.err(w, '"min_items"/"max_items" necesitan "senal_items" para saber qué se cuenta');
    }
    for (const k of ['min_items', 'max_items'] as const) {
      if (va[k] !== undefined && (typeof va[k] !== 'number' || !Number.isInteger(va[k]) || (va[k] as number) < 0)) {
        v.err(w, `"${k}" debe ser un entero mayor o igual a 0`);
      }
    }
    if (typeof va.min_items === 'number' && typeof va.max_items === 'number' && va.min_items > va.max_items) {
      v.err(w, '"min_items" no puede ser mayor que "max_items"');
    }
  });
  return raw as unknown as WidgetSheet;
}

function validateRecipe(v: Validator, raw: unknown, file: string, sheets: Map<string, WidgetSheet>): Recipe | null {
  const where = `recetas/${file}`;
  if (!isObject(raw)) {
    v.err(where, 'el bloque json debe ser un objeto');
    return null;
  }
  if (!v.requireId(raw, 'id', where) || !v.requireString(raw, 'nombre', where)) return null;
  if (`${raw.id as string}.md` !== file) v.err(where, `el "id" ("${raw.id as string}") debe coincidir con el nombre del archivo`);
  if (!Array.isArray(raw.cuando) || raw.cuando.length === 0) v.err(where, 'necesita "cuando" con al menos una condición');
  else v.conditions(raw.cuando, `${where} cuando`);
  if (typeof raw.max_secciones !== 'number' || !Number.isInteger(raw.max_secciones) || raw.max_secciones < 1) {
    v.err(where, '"max_secciones" debe ser un entero mayor o igual a 1');
  }
  if (!Array.isArray(raw.secciones) || raw.secciones.length === 0) {
    v.err(where, 'necesita al menos una sección en "secciones"');
    return null;
  }
  let mandatory = 0;
  let hasForm = false;
  raw.secciones.forEach((sec, i) => {
    const w = `${where} secciones[${i}]`;
    if (!isObject(sec) || typeof sec.ficha !== 'string') return v.err(w, 'falta "ficha"');
    const sheet = sheets.get(sec.ficha);
    if (!sheet) return v.err(w, `la ficha "${sec.ficha}" no existe en widgets/`);
    if (sheet.familia === FORM_FAMILY) hasForm = true;
    if (typeof sec.obligatoria !== 'boolean') v.err(w, 'falta "obligatoria" (true/false)');
    if (sec.obligatoria === true) mandatory++;
    if (sec.condicion !== undefined) v.conditions(sec.condicion, `${w} condicion`);
    if (sec.variantes_permitidas !== undefined) {
      if (!isStringArray(sec.variantes_permitidas) || sec.variantes_permitidas.length === 0) {
        return v.err(w, '"variantes_permitidas" debe ser una lista no vacía');
      }
      const known = new Set(sheet.variantes.map((x) => x.id));
      sec.variantes_permitidas
        .filter((id) => !known.has(id))
        .forEach((id) => v.err(w, `la variante "${id}" no existe en la ficha "${sheet.id}"`));
    }
  });
  if (mandatory === 0) v.err(where, 'no tiene ninguna sección obligatoria');
  if (!hasForm) v.err(where, `no incluye ninguna sección de la familia "${FORM_FAMILY}"`);
  if (typeof raw.max_secciones === 'number' && mandatory > raw.max_secciones) {
    v.err(where, `tiene ${mandatory} secciones obligatorias y "max_secciones" es ${raw.max_secciones}`);
  }
  return raw as unknown as Recipe;
}

function validateRecord(v: Validator, raw: unknown): RequestRecord | null {
  const where = 'solicitud.md';
  if (!isObject(raw)) {
    v.err(where, 'el bloque json debe ser un objeto');
    return null;
  }
  if (!v.requireString(raw, 'version', where)) return null;
  if (!Array.isArray(raw.campos) || raw.campos.length === 0) {
    v.err(where, 'necesita al menos un campo en "campos"');
    return null;
  }
  const seen = new Set<string>();
  raw.campos.forEach((c, i) => {
    if (!isObject(c) || !v.requireId(c, 'id', `${where} campos[${i}]`)) return;
    const w = `${where} campo "${c.id as string}"`;
    if (seen.has(c.id as string)) v.err(w, 'id repetido');
    seen.add(c.id as string);
    v.requireString(c, 'descripcion', w);
    if (!RECORD_TYPES.includes(c.tipo as RecordFieldType)) v.err(w, `"tipo" debe ser uno de: ${RECORD_TYPES.join(', ')}`);
    if (!RECORD_STAGES.includes(c.se_llena_al as RecordStage)) v.err(w, `"se_llena_al" debe ser uno de: ${RECORD_STAGES.join(', ')}`);
    if (typeof c.obligatorio !== 'boolean') v.err(w, 'falta "obligatorio" (true/false)');
  });
  REQUIRED_RECORD_FIELDS.forEach((id) => {
    const field = (raw.campos as unknown[]).find((c): c is Json => isObject(c) && c.id === id);
    if (!field) v.err(where, `falta el campo "${id}"`);
    else if (field.obligatorio !== true) v.err(where, `el campo "${id}" debe ser obligatorio`);
  });
  return raw as unknown as RequestRecord;
}

/** Valida las piezas y devuelve el objeto compilado, o los errores. */
export function compileLandingLogic(sources: LandingLogicSources): CompileResult {
  const v = new Validator();
  const read = (raw: string, file: string): unknown => {
    try {
      return extractJsonBlock(raw, file);
    } catch (e) {
      v.errors.push((e as Error).message);
      return null;
    }
  };

  const root = read(sources.preguntas, 'preguntas.md');
  let version = '';
  let preguntas: Question[] = [];
  let senales: Signal[] = [];
  if (isObject(root)) {
    if (v.requireString(root, 'version', 'preguntas.md')) version = root.version as string;
    preguntas = parseQuestions(v, root.preguntas);
    senales = validateSignals(v, root.senales, new Set(preguntas.map((q) => q.id)));
    validateQuestions(v, preguntas);
  } else if (root !== null) {
    v.err('preguntas.md', 'el bloque json debe ser un objeto');
  }

  const sheets = new Map<string, WidgetSheet>();
  for (const file of Object.keys(sources.widgets).sort()) {
    const raw = read(sources.widgets[file]!, `widgets/${file}`);
    if (raw === null) continue;
    const sheet = validateSheet(v, raw, file);
    if (sheet) sheets.set(sheet.id, sheet);
  }

  const recetas: Recipe[] = [];
  for (const file of Object.keys(sources.recetas).sort()) {
    const raw = read(sources.recetas[file]!, `recetas/${file}`);
    if (raw === null) continue;
    const recipe = validateRecipe(v, raw, file, sheets);
    if (recipe) recetas.push(recipe);
  }

  let solicitud: RequestRecord | null = null;
  if (sources.solicitud === undefined) {
    v.warnings.push('no hay solicitud.md');
  } else {
    const raw = read(sources.solicitud, 'solicitud.md');
    if (raw !== null) solicitud = validateRecord(v, raw);
  }

  if (sheets.size === 0) v.warnings.push('no hay fichas en widgets/');
  if (recetas.length === 0) v.warnings.push('no hay recetas en recetas/');
  // Solo tiene sentido avisar de señales sin uso cuando ya hay quien las pueda usar.
  if (sheets.size > 0 && recetas.length > 0) {
    senales
      .filter((s) => !v.usedSignals.has(s.id))
      .forEach((s) => v.warnings.push(`la señal "${s.id}" está declarada pero nadie la usa`));
  }

  if (v.errors.length > 0) return { data: null, errors: v.errors, warnings: v.warnings };
  return {
    data: { version, preguntas, senales, widgets: [...sheets.values()], recetas, solicitud },
    errors: [],
    warnings: v.warnings,
  };
}
