<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;
use Elementor\Repeater;

class Birds_Key_Takeaways_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-key-takeaways';
	}
	public function get_title() {
		return __( 'Birds Key Takeaways', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-bullet-list';
	}
	protected function register_controls() {
		$this->heading_section( __( 'Takeaways', 'birds-elements' ) );
		$this->add_control( 'source', array(
			'label'   => __( 'Source', 'birds-elements' ),
			'type'    => Controls_Manager::SELECT,
			'default' => 'post',
			'options' => array(
				'post'   => __( 'This article’s key takeaways (article settings)', 'birds-elements' ),
				'manual' => __( 'Write them here', 'birds-elements' ),
			),
		) );
		$this->add_control( 'heading', array( 'label' => __( 'Heading', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Executive key takeaways', 'birds-elements' ) ) );
		$rep = new Repeater();
		$rep->add_control( 'text', array( 'label' => __( 'Takeaway', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'rows' => 3 ) );
		$this->add_control( 'items', array(
			'label'       => __( 'Takeaways', 'birds-elements' ),
			'type'        => Controls_Manager::REPEATER,
			'fields'      => $rep->get_controls(),
			'title_field' => '{{{ text }}}',
			'condition'   => array( 'source' => 'manual' ),
			'default'     => array( array( 'text' => __( 'Write the first takeaway here.', 'birds-elements' ) ) ),
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = 'manual' === $s['source'] ? wp_list_pluck( (array) $s['items'], 'text' ) : ( birds_article( $this->current_post_id() )['takeaways'] ?? array() );
		$html  = birds_takeaways_html( $items, $s['heading'] );
		if ( ! $html ) {
			$this->editor_notice( __( 'Key Takeaways: this article has none yet — add them in the post’s “Birds — article settings”, or switch Source to “Write them here”.', 'birds-elements' ) );
		}
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
