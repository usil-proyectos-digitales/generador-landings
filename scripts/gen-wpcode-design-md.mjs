// Genera el snippet PHP de WPCode con el CSS de color y tipografía por BU, leído de src/data/design-md/*.md.
// design.md manda: para cambiar un valor, editar el .md y volver a correr `pnpm wpcode:design-md`.
import fs from 'node:fs';

const DIR = 'src/data/design-md/';
const OUT = 'docs/wpcode/design-md-global.php';
// Slot de Elementor -> rol de design.md (los widgets v3 leen --e-global-typography-{slot}-*).
const SLOTS = { primary: 'blockTitle', secondary: 'cardTitle', text: 'blockBody', accent: 'link' };
// Variable de Elementor -> color de design.md.
const COLORS = { primary: 'primary', secondary: 'secondary', accent: 'accent', busurface: 'surface', buneutral: 'neutral' };
// Los 19 widgets del plugin usil-elementor-widgets-v3 (get_name()). No usar el prefijo usil_: hay widgets legacy con ese prefijo.
const V3 = [
  'usil_bloque_acordeones_tabs', 'usil_bloque_carreras_facultades', 'usil_bloque_contenido_imagen', 'usil_bloque_footer',
  'usil_bloque_videos', 'usil_cards_items_carrusel', 'usil_cards_items', 'usil_formularios', 'usil_header_formulario',
  'usil_header_modelo', 'usil_intro_text_block', 'usil_miscelaneos_caja_texto', 'usil_miscelaneos_carrusel',
  'usil_miscelaneos_contador', 'usil_miscelaneos_informativo', 'usil_miscelaneos_ranking', 'usil_ponentes_testimonios',
  'usil_save_the_date', 'usil_thank_you',
];

const fontUrl = (fams) =>
  'https://fonts.googleapis.com/css2?' +
  [...fams].map((f) => (f === 'Anton' ? 'family=Anton' : 'family=' + f.replace(/ /g, '+') + ':wght@400..900')).join('&') +
  '&display=swap';

const bus = {};
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const bu = file.slice(0, -3);
  const j = JSON.parse(fs.readFileSync(DIR + file, 'utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
  const fams = new Set();
  let d = `html[data-bu="${bu}"] body{`;
  for (const [k, v] of Object.entries(COLORS)) d += `--e-global-color-${k}:${j.colors[v]};`;
  for (const [slot, role] of Object.entries(SLOTS)) {
    const t = j.typography.find((x) => x.token === j.roles[role]);
    fams.add(t.fontFamily);
    const p = `--e-global-typography-${slot}-`;
    d += `${p}font-family:"${t.fontFamily}";${p}font-weight:${t.fontWeight};${p}font-size:${t.sizePx}px;`;
    d += `${p}line-height:${t.lineHeightPx}px;${p}letter-spacing:${+(t.letterSpacingPct / 100).toFixed(4)}em;`;
  }
  bus[bu] = { css: d + '}', fonts: fontUrl(fams) };
}

const phpStr = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const map = Object.entries(bus)
  .map(([bu, v]) => `\t${phpStr(bu)} => [ 'css' => ${phpStr(v.css)}, 'fonts' => ${phpStr(v.fonts)} ],`)
  .join('\n');

const php = `<?php
/**
 * Design.md global (color + tipografía por BU) — GENERADO por scripts/gen-wpcode-design-md.mjs. No editar a mano.
 * Aplica solo si la LP (CPT landing) tiene algún widget v3 y un término directo de unidad_negocio que sea una de las BU.
 * Pone data-bu en <html> y carga el CSS (selector html[data-bu] body: gana a .elementor-kit-N, que define las variables en body).
 * WPCode: tipo PHP, insertar en "Ejecutar en todas partes".
 */
if ( ! function_exists( 'usil_dsmd_bu' ) ) {
	function usil_dsmd_bu() {
		static $bu = false;
		if ( false !== $bu ) {
			return $bu;
		}
		$bu = '';
		if ( ! is_singular( 'landing' ) ) {
			return $bu;
		}
		$id = get_queried_object_id();
		$data = (string) get_post_meta( $id, '_elementor_data', true );
		$v3 = [ ${V3.map(phpStr).join(', ')} ];
		$tiene_v3 = false;
		foreach ( $v3 as $w ) {
			if ( false !== strpos( $data, '"' . $w . '"' ) ) {
				$tiene_v3 = true;
				break;
			}
		}
		if ( ! $tiene_v3 ) {
			return $bu;
		}
		$terms = wp_get_object_terms( $id, 'unidad_negocio', [ 'fields' => 'slugs' ] );
		if ( is_wp_error( $terms ) ) {
			return $bu;
		}
		foreach ( usil_dsmd_data() as $slug => $_ ) {
			if ( in_array( $slug, $terms, true ) ) {
				$bu = $slug;
				break;
			}
		}
		return $bu;
	}
}
if ( ! function_exists( 'usil_dsmd_data' ) ) {
	function usil_dsmd_data() {
		return [
${map.replace(/^\t/gm, '\t\t\t')}
		];
	}
}
add_filter( 'language_attributes', function ( $out ) {
	$bu = usil_dsmd_bu();
	return $bu ? $out . ' data-bu="' . esc_attr( $bu ) . '"' : $out;
} );
add_action( 'wp_head', function () {
	$bu = usil_dsmd_bu();
	if ( ! $bu ) {
		return;
	}
	$d = usil_dsmd_data()[ $bu ];
	echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
	echo '<link rel="stylesheet" href="' . esc_url( $d['fonts'] ) . '">';
	echo '<style id="usil-design-md">' . $d['css'] . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput -- CSS generado del repo.
}, 1 );
`;

fs.mkdirSync('docs/wpcode', { recursive: true });
fs.writeFileSync(OUT, php);
console.log(`${OUT}: ${Object.keys(bus).length} BU (${Object.keys(bus).join(', ')}), ${php.length} bytes`);
