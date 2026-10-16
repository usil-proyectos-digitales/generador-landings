/**
 * Lee `src/data/landing-logic/`, lo valida con `compileLandingLogic` y escribe
 * `src/data/landing-logic.json`. Se corre con `pnpm logic:build`.
 * Sale con código 1 si hay errores (no escribe nada en ese caso).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileLandingLogic } from './landing-logic.ts';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const srcDir = join(dataDir, 'landing-logic');
const outFile = join(dataDir, 'landing-logic.json');

function readMdDir(dir: string): Record<string, string> {
  if (!existsSync(dir)) return {};
  const out: Record<string, string> = {};
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.md')) out[file] = readFileSync(join(dir, file), 'utf8');
  }
  return out;
}

const result = compileLandingLogic({
  preguntas: readFileSync(join(srcDir, 'preguntas.md'), 'utf8'),
  widgets: readMdDir(join(srcDir, 'widgets')),
  recetas: readMdDir(join(srcDir, 'recetas')),
  solicitud: existsSync(join(srcDir, 'solicitud.md')) ? readFileSync(join(srcDir, 'solicitud.md'), 'utf8') : undefined,
});

result.warnings.forEach((w) => console.warn(`aviso: ${w}`));

if (!result.data) {
  result.errors.forEach((e) => console.error(`error: ${e}`));
  console.error(`\nlanding-logic: ${result.errors.length} error(es). No se generó landing-logic.json.`);
  process.exit(1);
}

writeFileSync(outFile, `${JSON.stringify(result.data, null, 2)}\n`, 'utf8');
const { preguntas, senales, widgets, recetas, solicitud } = result.data;
console.log(
  `landing-logic: OK — ${preguntas.length} preguntas, ${senales.length} señales, ${widgets.length} fichas, ${recetas.length} recetas, ${solicitud?.campos.length ?? 0} campos de solicitud → src/data/landing-logic.json`
);
