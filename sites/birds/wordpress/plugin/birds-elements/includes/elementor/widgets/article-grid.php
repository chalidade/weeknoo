<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Article_Grid_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-article-grid';
	}
	public function get_title() {
		return __( 'Birds Article Grid', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-posts-grid';
	}
	public function get_keywords() {
		return array( 'posts', 'articles', 'grid', 'list', 'latest', 'insights' );
	}
	protected function register_controls() {
		$this->heading_section( __( 'Query', 'birds-elements' ) );
		$this->add_control( 'heading', array( 'label' => __( 'Heading', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Latest insights', 'birds-elements' ) ) );
		$this->add_control( 'intro', array( 'label' => __( 'Intro', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Research and perspectives for leaders shaping the workforce of the future.', 'birds-elements' ) ) );
		$this->add_control( 'layout', array(
			'label'   => __( 'Layout', 'birds-elements' ),
			'type'    => Controls_Manager::SELECT,
			'default' => 'feature',
			'options' => array(
				'feature' => __( 'Feature + list (McKinsey front page)', 'birds-elements' ),
				'grid'    => __( 'Card grid', 'birds-elements' ),
				'list'    => __( 'Compact list', 'birds-elements' ),
			),
		) );
		$this->add_control( 'category', array( 'label' => __( 'Series', 'birds-elements' ), 'type' => Controls_Manager::SELECT, 'options' => birds_el_category_options(), 'default' => '' ) );
		$this->add_control( 'access', array(
			'label'   => __( 'Access', 'birds-elements' ),
			'type'    => Controls_Manager::SELECT,
			'default' => '',
			'options' => array( '' => __( 'All', 'birds-elements' ), 'free' => __( 'Free only', 'birds-elements' ), 'member' => __( 'Member briefings only', 'birds-elements' ) ),
		) );
		$this->add_control( 'count', array( 'label' => __( 'Number of articles', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'default' => 8, 'min' => 1, 'max' => 48 ) );
		$this->add_control( 'offset', array( 'label' => __( 'Skip first', 'birds-elements' ), 'type' => Controls_Manager::NUMBER, 'default' => 0, 'min' => 0 ) );
		$this->add_control( 'columns', array( 'label' => __( 'Columns', 'birds-elements' ), 'type' => Controls_Manager::SELECT, 'default' => '3', 'options' => array( '2' => '2', '3' => '3', '4' => '4' ), 'condition' => array( 'layout!' => 'list' ) ) );
		$this->add_control( 'deck', array( 'label' => __( 'Show deck', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => '', 'condition' => array( 'layout' => 'grid' ) ) );
		$this->add_control( 'filters', array( 'label' => __( 'Series filter chips', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => '', 'description' => __( 'Lets readers filter the shown articles by series.', 'birds-elements' ) ) );
		$this->add_control( 'exclude_featured', array( 'label' => __( 'Skip the featured (sticky) story', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => 'yes' ) );
		$this->end_controls_section();
	}
	protected function render() {
		$s = $this->get_settings_for_display();
		echo birds_latest_section_html( array( // phpcs:ignore WordPress.Security.EscapeOutput
			'heading'  => $s['heading'],
			'intro'    => $s['intro'],
			'filters'  => 'yes' === $s['filters'],
			'layout'   => $s['layout'],
			'category' => $s['category'],
			'access'   => $s['access'],
			'count'    => $s['count'],
			'offset'   => $s['offset'],
			'columns'  => $s['columns'] ?? 3,
			'deck'     => 'yes' === ( $s['deck'] ?? '' ),
			'exclude'  => 'yes' === $s['exclude_featured'] ? array( birds_featured_post_id() ) : array(),
		) );
	}
}
