<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;
use Elementor\Repeater;

class Birds_Chart_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-chart';
	}
	public function get_title() {
		return __( 'Birds Chart', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-skill-bar';
	}
	public function get_keywords() {
		return array( 'chart', 'bar', 'column', 'line', 'pie', 'donut', 'data', 'exhibit' );
	}

	protected function register_controls() {
		$this->heading_section( __( 'Chart', 'birds-elements' ) );
		$this->add_control( 'type', array(
			'label'   => __( 'Type', 'birds-elements' ),
			'type'    => Controls_Manager::SELECT,
			'default' => 'column',
			'options' => array(
				'column' => __( 'Column (vertical bars)', 'birds-elements' ),
				'bar'    => __( 'Bar (horizontal)', 'birds-elements' ),
				'line'   => __( 'Line (trend)', 'birds-elements' ),
				'pie'    => __( 'Donut / pie', 'birds-elements' ),
			),
		) );
		$this->add_control( 'title', array( 'label' => __( 'Title', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'rows' => 2, 'default' => __( 'Skills demand versus available talent', 'birds-elements' ) ) );
		$this->add_control( 'subtitle', array( 'label' => __( 'Subtitle', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Index, 2023 = 100', 'birds-elements' ) ) );
		$this->add_control( 'unit', array( 'label' => __( 'Value suffix', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'placeholder' => '%', 'description' => __( 'Appended to values, e.g. %, " days", " h".', 'birds-elements' ) ) );
		$this->add_control( 'value_label', array( 'label' => __( 'Series label', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Demand', 'birds-elements' ), 'condition' => array( 'type!' => 'pie' ) ) );
		$this->add_control( 'benchmark_label', array( 'label' => __( 'Benchmark label', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Talent supply', 'birds-elements' ), 'condition' => array( 'type!' => 'pie' ) ) );

		$rep = new Repeater();
		$rep->add_control( 'label', array( 'label' => __( 'Label', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Category', 'birds-elements' ) ) );
		$rep->add_control( 'value', array( 'label' => __( 'Value', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'default' => 50, 'step' => 'any' ) );
		$rep->add_control( 'benchmark', array( 'label' => __( 'Benchmark (optional)', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'step' => 'any' ) );
		$rep->add_control( 'color', array( 'label' => __( 'Colour override', 'birds-elements' ), 'type' => Controls_Manager::COLOR ) );
		$this->add_control( 'data', array(
			'label'       => __( 'Data', 'birds-elements' ),
			'type'        => Controls_Manager::REPEATER,
			'fields'      => $rep->get_controls(),
			'title_field' => '{{{ label }}} — {{{ value }}}',
			'default'     => array(
				array( 'label' => 'AI & data', 'value' => 182, 'benchmark' => 121 ),
				array( 'label' => 'Cloud & cyber', 'value' => 164, 'benchmark' => 118 ),
				array( 'label' => 'Leadership', 'value' => 141, 'benchmark' => 104 ),
				array( 'label' => 'Green skills', 'value' => 156, 'benchmark' => 109 ),
			),
		) );
		$this->add_control( 'source', array( 'label' => __( 'Source line', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Birds Research Desk analysis.', 'birds-elements' ) ) );
		$this->add_control( 'exhibit', array( 'label' => __( 'Number as “Exhibit”', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => 'yes' ) );
		$this->end_controls_section();
	}

	protected function render() {
		$s    = $this->get_settings_for_display();
		$data = array();
		foreach ( (array) $s['data'] as $row ) {
			$data[] = array( $row['label'], $row['value'], '' === ( $row['benchmark'] ?? '' ) ? null : $row['benchmark'], $row['color'] ?? '' );
		}
		echo birds_chart_html( array( // phpcs:ignore WordPress.Security.EscapeOutput
			'type'            => $s['type'],
			'title'           => $s['title'],
			'subtitle'        => $s['subtitle'],
			'unit'            => $s['unit'],
			'value_label'     => $s['value_label'] ?? '',
			'benchmark_label' => $s['benchmark_label'] ?? '',
			'source'          => $s['source'],
			'exhibit'         => 'yes' === $s['exhibit'],
			'data'            => $data,
		) );
	}
}
