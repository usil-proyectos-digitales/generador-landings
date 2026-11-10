<?php
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
		$v3 = [ 'usil_bloque_acordeones_tabs', 'usil_bloque_carreras_facultades', 'usil_bloque_contenido_imagen', 'usil_bloque_footer', 'usil_bloque_videos', 'usil_cards_items_carrusel', 'usil_cards_items', 'usil_formularios', 'usil_header_formulario', 'usil_header_modelo', 'usil_intro_text_block', 'usil_miscelaneos_caja_texto', 'usil_miscelaneos_carrusel', 'usil_miscelaneos_contador', 'usil_miscelaneos_informativo', 'usil_miscelaneos_ranking', 'usil_ponentes_testimonios', 'usil_save_the_date', 'usil_thank_you' ];
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
			'coloring-dreams' => [ 'css' => 'html[data-bu="coloring-dreams"] body{--e-global-color-primary:#002663;--e-global-color-secondary:#5967D2;--e-global-color-accent:#A9C635;--e-global-color-busurface:#EDEDED;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Rubik";--e-global-typography-primary-font-weight:800;--e-global-typography-primary-font-size:42px;--e-global-typography-primary-line-height:36px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Rubik";--e-global-typography-secondary-font-weight:900;--e-global-typography-secondary-font-size:26px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0em;--e-global-typography-text-font-family:"Rubik";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:22px;--e-global-typography-text-line-height:30px;--e-global-typography-text-letter-spacing:0em;--e-global-typography-accent-font-family:"Rubik";--e-global-typography-accent-font-weight:800;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Rubik:wght@400..900&display=swap' ],
			'csir' => [ 'css' => 'html[data-bu="csir"] body{--e-global-color-primary:#232B91;--e-global-color-secondary:#5967D2;--e-global-color-accent:#f6b724;--e-global-color-busurface:#EDEDED;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Rubik";--e-global-typography-primary-font-weight:800;--e-global-typography-primary-font-size:42px;--e-global-typography-primary-line-height:36px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Rubik";--e-global-typography-secondary-font-weight:900;--e-global-typography-secondary-font-size:26px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0em;--e-global-typography-text-font-family:"Rubik";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:22px;--e-global-typography-text-line-height:30px;--e-global-typography-text-letter-spacing:0em;--e-global-typography-accent-font-family:"Rubik";--e-global-typography-accent-font-weight:800;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Rubik:wght@400..900&display=swap' ],
			'instituto-de-emprendedores' => [ 'css' => 'html[data-bu="instituto-de-emprendedores"] body{--e-global-color-primary:#1B1464;--e-global-color-secondary:#1D18E4;--e-global-color-accent:#00F600;--e-global-color-busurface:#EDEDED;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Poppins";--e-global-typography-primary-font-weight:900;--e-global-typography-primary-font-size:46px;--e-global-typography-primary-line-height:48px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Poppins";--e-global-typography-secondary-font-weight:700;--e-global-typography-secondary-font-size:24px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Poppins";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:20px;--e-global-typography-text-line-height:30px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Poppins";--e-global-typography-accent-font-weight:700;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Poppins:wght@400..900&display=swap' ],
			'posgrado' => [ 'css' => 'html[data-bu="posgrado"] body{--e-global-color-primary:#000000;--e-global-color-secondary:#001D6E;--e-global-color-accent:#1E50DC;--e-global-color-busurface:#DEE2EC;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Anton";--e-global-typography-primary-font-weight:400;--e-global-typography-primary-font-size:52px;--e-global-typography-primary-line-height:54px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Montserrat";--e-global-typography-secondary-font-weight:800;--e-global-typography-secondary-font-size:30px;--e-global-typography-secondary-line-height:36px;--e-global-typography-secondary-letter-spacing:0em;--e-global-typography-text-font-family:"Montserrat";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:26px;--e-global-typography-text-line-height:32px;--e-global-typography-text-letter-spacing:0em;--e-global-typography-accent-font-family:"Anton";--e-global-typography-accent-font-weight:400;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400..900&display=swap' ],
			'pregrado-ejecutivo' => [ 'css' => 'html[data-bu="pregrado-ejecutivo"] body{--e-global-color-primary:#0050E2;--e-global-color-secondary:#002663;--e-global-color-accent:#00B79A;--e-global-color-busurface:#EDEDED;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Roboto";--e-global-typography-primary-font-weight:900;--e-global-typography-primary-font-size:46px;--e-global-typography-primary-line-height:54px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Roboto";--e-global-typography-secondary-font-weight:900;--e-global-typography-secondary-font-size:26px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Roboto";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:22px;--e-global-typography-text-line-height:30px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Roboto";--e-global-typography-accent-font-weight:700;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Roboto:wght@400..900&display=swap' ],
			'pregrado' => [ 'css' => 'html[data-bu="pregrado"] body{--e-global-color-primary:#1e50dc;--e-global-color-secondary:#002663;--e-global-color-accent:#817aff;--e-global-color-busurface:#DFE8F7;--e-global-color-buneutral:#FFFFFF;--e-global-typography-primary-font-family:"Anton";--e-global-typography-primary-font-weight:400;--e-global-typography-primary-font-size:52px;--e-global-typography-primary-line-height:60px;--e-global-typography-primary-letter-spacing:0.003em;--e-global-typography-secondary-font-family:"Montserrat";--e-global-typography-secondary-font-weight:800;--e-global-typography-secondary-font-size:24px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Montserrat";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:20px;--e-global-typography-text-line-height:28px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Anton";--e-global-typography-accent-font-weight:400;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400..900&display=swap' ],
			'siu' => [ 'css' => 'html[data-bu="siu"] body{--e-global-color-primary:#002663;--e-global-color-secondary:#0561CC;--e-global-color-accent:#00BBBA;--e-global-color-busurface:#EDEDED;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Montserrat";--e-global-typography-primary-font-weight:900;--e-global-typography-primary-font-size:46px;--e-global-typography-primary-line-height:52px;--e-global-typography-primary-letter-spacing:0em;--e-global-typography-secondary-font-family:"Montserrat";--e-global-typography-secondary-font-weight:800;--e-global-typography-secondary-font-size:24px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Montserrat";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:20px;--e-global-typography-text-line-height:24px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Montserrat";--e-global-typography-accent-font-weight:700;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400..900&display=swap' ],
			'usil-corporativo' => [ 'css' => 'html[data-bu="usil-corporativo"] body{--e-global-color-primary:#002663;--e-global-color-secondary:#1E50DC;--e-global-color-accent:#438BE0;--e-global-color-busurface:#DFE8F7;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Anton";--e-global-typography-primary-font-weight:400;--e-global-typography-primary-font-size:52px;--e-global-typography-primary-line-height:60px;--e-global-typography-primary-letter-spacing:0.003em;--e-global-typography-secondary-font-family:"Montserrat";--e-global-typography-secondary-font-weight:800;--e-global-typography-secondary-font-size:24px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Montserrat";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:20px;--e-global-typography-text-line-height:28px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Anton";--e-global-typography-accent-font-weight:400;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400..900&display=swap' ],
			'usil-paraguay' => [ 'css' => 'html[data-bu="usil-paraguay"] body{--e-global-color-primary:#1E50DC;--e-global-color-secondary:#002663;--e-global-color-accent:#FF4CEE;--e-global-color-busurface:#DFE8F7;--e-global-color-buneutral:#ffffff;--e-global-typography-primary-font-family:"Anton";--e-global-typography-primary-font-weight:400;--e-global-typography-primary-font-size:52px;--e-global-typography-primary-line-height:60px;--e-global-typography-primary-letter-spacing:0.003em;--e-global-typography-secondary-font-family:"Montserrat";--e-global-typography-secondary-font-weight:800;--e-global-typography-secondary-font-size:24px;--e-global-typography-secondary-line-height:32px;--e-global-typography-secondary-letter-spacing:0.0025em;--e-global-typography-text-font-family:"Montserrat";--e-global-typography-text-font-weight:400;--e-global-typography-text-font-size:20px;--e-global-typography-text-line-height:28px;--e-global-typography-text-letter-spacing:0.018em;--e-global-typography-accent-font-family:"Anton";--e-global-typography-accent-font-weight:400;--e-global-typography-accent-font-size:24px;--e-global-typography-accent-line-height:32px;--e-global-typography-accent-letter-spacing:0.01em;}', 'fonts' => 'https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400..900&display=swap' ],
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
