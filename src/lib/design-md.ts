/**
 * Parser de `design.md` — PRUEBA aislada, no forma parte del Design System V2
 * de producción (`src/styles/global.css`).
 *
 * Cada archivo en `src/data/design-md/*.md` documenta color + tipografía de
 * una BU para humanos, y embebe un bloque ```json``` con los mismos datos en
 * formato estructurado. Este módulo extrae ese bloque en build time y genera
 * el CSS que pinta `/design-md-preview` — así el `.md` es la fuente real de
 * los estilos, no solo documentación.
 */

export interface TypographyToken {
  token: string;
  fontFamily: string;
  fontWeight: number;
  sizePx: number;
  lineHeightPx: number;
  letterSpacingPct: number;
  /** Opcional — ej. headline-1-black-italic de Instituto de Emprendedores. */
  fontStyle?: 'italic';
  /** Opcional — ej. headline-1-black-italic de Instituto de Emprendedores. */
  textTransform?: 'uppercase';
}

export type TypographyRole = 'blockTitle' | 'blockBody' | 'cardTitle' | 'cardBody' | 'label' | 'link';

export interface DesignTokens {
  bu: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    neutral: string;
  };
  typography: TypographyToken[];
  roles: Record<TypographyRole, string>;
}

const ROLE_TO_CLASS: Record<TypographyRole, string> = {
  blockTitle: 'dsmd-block-title',
  blockBody: 'dsmd-block-body',
  cardTitle: 'dsmd-card-title',
  cardBody: 'dsmd-card-body',
  label: 'dsmd-label',
  link: 'dsmd-link',
};

const rawFiles = import.meta.glob('/src/data/design-md/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseDesignMd(raw: string): DesignTokens {
  const match = raw.match(/```json\s*([\s\S]*?)```/);
  if (!match || !match[1]) {
    throw new Error('design-md.ts: no se encontró bloque ```json``` en un archivo de src/data/design-md/');
  }
  return JSON.parse(match[1]) as DesignTokens;
}

let cache: Record<string, DesignTokens> | null = null;

/** BU slug → DesignTokens, parseado de src/data/design-md/*.md */
export function getDesignTokens(): Record<string, DesignTokens> {
  if (cache) return cache;
  cache = {};
  for (const raw of Object.values(rawFiles)) {
    const tokens = parseDesignMd(raw);
    cache[tokens.bu] = tokens;
  }
  return cache;
}

function findToken(tokens: DesignTokens, tokenName: string): TypographyToken {
  const found = tokens.typography.find((t) => t.token === tokenName);
  if (!found) {
    throw new Error(`design-md.ts: token "${tokenName}" no existe en typography de BU "${tokens.bu}"`);
  }
  return found;
}

/**
 * Genera las reglas CSS `[data-bu="x"] .dsmd-{role} { ... }` para todas las
 * BUs cargadas — esto es lo que hace "automático" el pintado: cambiar el
 * `data-bu` de un contenedor ya alcanza la tipografía correcta.
 */
export function buildTypographyCss(allTokens: Record<string, DesignTokens>): string {
  const rules: string[] = [];
  for (const tokens of Object.values(allTokens)) {
    for (const role of Object.keys(ROLE_TO_CLASS) as TypographyRole[]) {
      const tokenName = tokens.roles[role];
      const t = findToken(tokens, tokenName);
      const className = ROLE_TO_CLASS[role];
      const letterSpacingEm = (t.letterSpacingPct / 100).toFixed(4);
      const fontStyle = t.fontStyle ? ` font-style: ${t.fontStyle};` : '';
      const textTransform = t.textTransform ? ` text-transform: ${t.textTransform};` : '';
      rules.push(
        `[data-bu="${tokens.bu}"] .${className} { font-family: '${t.fontFamily}', sans-serif; font-weight: ${t.fontWeight}; font-size: ${t.sizePx}px; line-height: ${t.lineHeightPx}px; letter-spacing: ${letterSpacingEm}em;${fontStyle}${textTransform} }`
      );
    }
  }
  return rules.join('\n');
}
