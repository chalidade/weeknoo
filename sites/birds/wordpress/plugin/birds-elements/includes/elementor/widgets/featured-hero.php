<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Featured_Hero_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-featured-hero';
	}
	public function get_title() {
		return __( 'Birds Featured Hero', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-slider-video';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Lead story', 'birds-elements' ) );
		$this->add_control( 'post', array( 'label' => __( 'Article', 'birds-elements' ), 'type' => Controls_Manager::SELECT2, 'options' => birds_el_post_options(), 'default' => '' ) );
		$this->add_control( 'eyebrow', array( 'label' => __( 'Eyebrow', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Featured briefing', 'birds-elements' ) ) );
		$this->add_control( 'button', array( 'label' => __( 'Button text', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Read the briefing', 'birds-elements' ) ) );
		$this->add_control( 'more', array( 'label' => __( 'More stories strip', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'default' => 3, 'min' => 0, 'max' => 4 ) );
		$this->add_control( 'note', array(
			'type'            => Controls_Manager::RAW_HTML,
			'raw'             => esc_html__( 'The background is the article’s featured image, or its looping video when the article’s hero is set to video. Use a full-width section with no padding.', 'birds-elements' ),
			'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$s  = $this->get_settings_for_display();
		$id = $s['post'] ? absint( $s['post'] ) : birds_featured_post_id();
		if ( ! $id ) {
			$this->editor_notice( __( 'Featured Hero: publish an article first.', 'birds-elements' ) );
			return;
		}
		echo birds_marquee_html( $id, array( 'eyebrow' => $s['eyebrow'], 'button' => $s['button'], 'more' => (int) $s['more'] ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
