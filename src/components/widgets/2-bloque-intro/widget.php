<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Elementor_Intro_Text_Block_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'hk_intro_text_block';
    }

    public function get_title() {
        return esc_html__( 'Bloque Intro Texto', 'usil-widgets' );
    }

    public function get_icon() {
        return 'eicon-text-area';
    }

    public function get_categories() {
        return [ 'general' ];
    }

    public function get_keywords() {
        return [ 'intro', 'texto', 'bloque', 'titulo' ];
    }

    protected function register_controls() {

        // --- SECCIÓN: CONTENIDO ---
        $this->start_controls_section(
            'section_content',
            [
                'label' => esc_html__( 'Contenido', 'usil-widgets' ),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'title_text',
            [
                'label' => esc_html__( 'Título Principal', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__( 'Título del Bloque de Introducción', 'usil-widgets' ),
                'placeholder' => esc_html__( 'Escribe el título aquí', 'usil-widgets' ),
            ]
        );

        $this->add_control(
            'description_text',
            [
                'label' => esc_html__( 'Descripción Principal', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::WYSIWYG,
                'default' => esc_html__( 'Este es un bloque de texto introductorio diseñado para captar la atención del usuario.', 'usil-widgets' ),
            ]
        );

        $this->end_controls_section();

        // --- TAB: ESTILO ---
        
        // Background
        $this->start_controls_section(
            'section_style_background',
            [
                'label' => esc_html__( 'Fondo', 'usil-widgets' ),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Background::get_type(),
            [
                'name' => 'background',
                'types' => [ 'classic', 'gradient', 'video' ],
                'selector' => '{{WRAPPER}} .hk-intro-section',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Background::get_type(),
            [
                'name' => 'section_background_overlay',
                'label' => esc_html__( 'Overlay de Fondo', 'usil-widgets' ),
                'types' => [ 'classic', 'gradient' ],
                'selector' => '{{WRAPPER}} .hk-intro-section::before',
            ]
        );

        $this->add_responsive_control(
            'section_padding',
            [
                'label' => esc_html__( 'Padding', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%', 'em', 'rem' ],
                'selectors' => [
                    '{{WRAPPER}} .hk-intro-section' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'section_margin',
            [
                'label' => esc_html__( 'Margin', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%', 'em', 'rem' ],
                'selectors' => [
                    '{{WRAPPER}} .hk-intro-section' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Typography
        $this->start_controls_section(
            'section_style_typography',
            [
                'label' => esc_html__( 'Tipografía', 'usil-widgets' ),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'heading_title_style',
            [
                'label' => esc_html__( 'Título', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'title_typography',
                'selector' => '{{WRAPPER}} .hk-intro-title, {{WRAPPER}} .hk-title',
            ]
        );

        $this->add_control(
            'title_color',
            [
                'label' => esc_html__( 'Color Título', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hk-intro-title, {{WRAPPER}} .hk-title' => 'color: {{VALUE}}',
                ],
            ]
        );

        $this->add_control(
            'heading_desc_style',
            [
                'label' => esc_html__( 'Descripción', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'desc_typography',
                'selector' => '{{WRAPPER}} .hk-intro-desc, {{WRAPPER}} .hk-intro-paragraph, {{WRAPPER}} .hk-desc',
            ]
        );

        $this->add_control(
            'desc_color',
            [
                'label' => esc_html__( 'Color Descripción', 'usil-widgets' ),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hk-intro-desc, {{WRAPPER}} .hk-intro-paragraph, {{WRAPPER}} .hk-desc' => 'color: {{VALUE}}',
                ],
            ]
        );

        $this->end_controls_section();

    }

    protected function render() {
        $settings = $this->get_settings_for_display();

        // Variables con validación segura
        $title = isset($settings['title_text']) ? $settings['title_text'] : '';
        $description = isset($settings['description_text']) ? $settings['description_text'] : '';

        $id_attr = 'intro-v2-2';
        $wrapper_class = 'hk-intro-section relative py-16 w-full transition-opacity duration-300 md:py-24';
        $container_class = 'container relative z-10 px-4 mx-auto md:px-6';
        
        ?>
        <section id="<?php echo esc_attr( $id_attr ); ?>" class="<?php echo esc_attr( $wrapper_class ); ?> bg-[#F0F0F0]" data-widget-variant="v2.2">
            <div class="<?php echo esc_attr( $container_class ); ?>">
                <div class="grid gap-12 items-start lg:grid-cols-12">
                    <div class="space-y-4 lg:col-span-5">
                        <h2 class="text-center hk-title font-montserrat text-mont-block-title-mobile md:text-mont-block-title text-brand-dark md:text-left">
                            <?php echo esc_html( $title ); ?>
                        </h2>
                    </div>

                    <div class="space-y-6 lg:col-span-7">
                        <div class="text-center hk-desc text-mont-block-p-mobile md:text-mont-block-p text-brand-dark md:text-left">
                            <?php echo wp_kses_post( $description ); ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php
    }
}

// Registrar el widget
add_action( 'elementor/widgets/register', function( $widgets_manager ) {
    $widgets_manager->register( new Elementor_Intro_Text_Block_Widget() );
} );
