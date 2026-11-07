<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Series_Sections_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-series-sections';
	}
	public function get_title() {
		return __( 'Birds Series Sections', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-gallery-justified';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Series', 'birds-elements' ) );
		$this->add_control( 'count', array( 'label' => __( 'Articles per series', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'default' => 3, 'min' => 1, 'max' => 6 ) );
		$this->add_control( 'link_text', array( 'label' => __( 'Link text', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Explore the series', 'birds-elements' ) ) );
		$this->add_control( 'info', array(
			'type'            => Controls_Manager::RAW_HTML,
			'raw'             => esc_html__( 'One block per post category that has articles. Edit names and descriptions under Posts → Categories.', 'birds-elements' ),
			'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$s = $this->get_settings_for_display();
		echo birds_series_sections_html( array( 'count' => absint( $s['count'] ), 'link_text' => $s['link_text'] ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
