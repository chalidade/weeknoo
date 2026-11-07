<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Pull_Quote_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-pull-quote';
	}
	public function get_title() {
		return __( 'Birds Pull Quote', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-blockquote';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Quote', 'birds-elements' ) );
		$this->add_control( 'text', array( 'label' => __( 'Quote', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'rows' => 4, 'default' => __( 'The question is no longer whether you have the skills you need. It is whether you can build them faster than they expire.', 'birds-elements' ) ) );
		$this->add_control( 'author', array( 'label' => __( 'Speaker', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => 'Sofia Marquez' ) );
		$this->add_control( 'title', array( 'label' => __( 'Speaker title', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Labour Economist, Meridian Policy Institute', 'birds-elements' ) ) );
		$this->end_controls_section();
	}
	protected function render() {
		$s = $this->get_settings_for_display();
		echo birds_quote_html( $s['text'], $s['author'], $s['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
