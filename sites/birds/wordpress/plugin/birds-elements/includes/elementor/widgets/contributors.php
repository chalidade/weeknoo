<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Contributors_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-contributors';
	}
	public function get_title() {
		return __( 'Birds Author & Experts', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-person';
	}
	protected function register_controls() {
		$people = birds_contributor_options();
		$this->heading_section( __( 'Contributors', 'birds-elements' ) );
		$this->add_control( 'source', array(
			'label'   => __( 'Source', 'birds-elements' ),
			'type'    => Controls_Manager::SELECT,
			'default' => 'post',
			'options' => array(
				'post'   => __( 'This article’s author & experts', 'birds-elements' ),
				'manual' => __( 'Choose here', 'birds-elements' ),
			),
		) );
		$this->add_control( 'author', array( 'label' => __( 'Written by', 'birds-elements' ), 'type' => Controls_Manager::SELECT2, 'options' => $people, 'condition' => array( 'source' => 'manual' ) ) );
		$this->add_control( 'experts', array( 'label' => __( 'Experts interviewed', 'birds-elements' ), 'type' => Controls_Manager::SELECT2, 'multiple' => true, 'options' => $people, 'condition' => array( 'source' => 'manual' ) ) );
		$this->add_control( 'author_label', array( 'label' => __( 'Author label', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Written by', 'birds-elements' ) ) );
		$this->add_control( 'experts_label', array( 'label' => __( 'Experts label', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Featured experts interviewed', 'birds-elements' ) ) );
		$this->add_control( 'manage', array(
			'type' => Controls_Manager::RAW_HTML,
			'raw'  => '<a href="' . esc_url( admin_url( 'edit.php?post_type=birds_contributor' ) ) . '" target="_blank">' . esc_html__( 'Manage contributors →', 'birds-elements' ) . '</a>',
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$s = $this->get_settings_for_display();
		if ( 'manual' === $s['source'] ) {
			$author  = absint( $s['author'] );
			$experts = array_map( 'absint', (array) $s['experts'] );
		} else {
			$a       = birds_article( $this->current_post_id() );
			$author  = $a['author'] ?? 0;
			$experts = $a['experts'] ?? array();
		}
		$html = birds_contributors_html( $author, $experts, array( 'author' => $s['author_label'], 'experts' => $s['experts_label'] ) );
		if ( ! $html ) {
			$this->editor_notice( __( 'Author & Experts: no contributors selected yet.', 'birds-elements' ) );
		}
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
