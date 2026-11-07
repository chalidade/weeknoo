<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Action_Table_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-action-table';
	}
	public function get_title() {
		return __( 'Birds Action Table', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-table';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Table', 'birds-elements' ) );
		$this->add_control( 'caption', array( 'label' => __( 'Caption', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Competency unlock action table', 'birds-elements' ) ) );
		$this->add_control( 'columns', array( 'label' => __( 'Column headings', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => 'Capability | Weekly practice | Stretch assignment | Measure', 'description' => __( 'Separate with |', 'birds-elements' ) ) );
		$this->add_control( 'rows', array(
			'label'       => __( 'Rows', 'birds-elements' ),
			'type'        => Controls_Manager::TEXTAREA,
			'rows'        => 8,
			'default'     => "Decide under ambiguity | Write a one-page decision memo | Own a cross-unit trade-off | Decision cycle time\nCoach for growth | Thirty-minute coaching session | Mentor a high-potential leader | Team internal-move rate",
			'description' => __( 'One row per line, cells separated with |. The first cell is bold.', 'birds-elements' ),
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$s    = $this->get_settings_for_display();
		$cols = array_map( 'trim', explode( '|', (string) $s['columns'] ) );
		echo birds_table_html( $s['caption'], array_filter( $cols, 'strlen' ), birds_parse_rows( $s['rows'] ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
