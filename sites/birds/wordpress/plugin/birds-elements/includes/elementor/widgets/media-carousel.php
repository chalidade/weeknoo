<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;
use Elementor\Repeater;

class Birds_Media_Carousel_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-media-carousel';
	}
	public function get_title() {
		return __( 'Birds Photo & Quote Carousel', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-media-carousel';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Slides', 'birds-elements' ) );
		$rep = new Repeater();
		$rep->add_control( 'image', array( 'label' => __( 'Image', 'birds-elements' ), 'type' => Controls_Manager::MEDIA ) );
		$rep->add_control( 'quote', array( 'label' => __( 'Quote (turns the slide into a quote card)', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'rows' => 3 ) );
		$rep->add_control( 'caption', array( 'label' => __( 'Caption / speaker', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'rows' => 2 ) );
		$rep->add_control( 'attribution', array( 'label' => __( 'Attribution', 'birds-elements' ), 'type' => Controls_Manager::TEXT ) );
		$this->add_control( 'slides', array(
			'label'       => __( 'Slides', 'birds-elements' ),
			'type'        => Controls_Manager::REPEATER,
			'fields'      => $rep->get_controls(),
			'title_field' => '{{{ caption ? caption.substring(0, 40) : quote.substring(0, 40) }}}',
			'default'     => array(
				array( 'caption' => __( 'Photo essay caption goes here.', 'birds-elements' ), 'attribution' => 'Birds Research Desk' ),
				array( 'quote' => __( 'A quote slide sits on a navy card over the image.', 'birds-elements' ), 'caption' => __( 'Speaker, Title, Company', 'birds-elements' ) ),
			),
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$slides = array();
		foreach ( (array) $this->get_settings_for_display( 'slides' ) as $s ) {
			$slides[] = array(
				'image'       => ! empty( $s['image']['id'] ) ? $s['image']['id'] : ( $s['image']['url'] ?? '' ),
				'quote'       => $s['quote'],
				'caption'     => $s['caption'],
				'attribution' => $s['attribution'],
			);
		}
		echo birds_carousel_html( $slides ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
