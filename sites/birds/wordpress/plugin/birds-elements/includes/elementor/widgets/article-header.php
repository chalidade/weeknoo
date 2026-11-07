<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

/** For Elementor Pro single-post templates: kicker, title, deck, meta, actions. */
class Birds_Article_Header_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-article-header';
	}
	public function get_title() {
		return __( 'Birds Article Header', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-post-title';
	}
	/** Output depends on who is reading — never serve it from Elementor's element cache. */
	protected function is_dynamic_content(): bool {
		return true;
	}

	protected function register_controls() {
		$this->heading_section( __( 'Article header', 'birds-elements' ) );
		$this->add_control( 'actions', array( 'label' => __( 'Listen / Save / Share / PDF bar', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => 'yes' ) );
		$this->add_control( 'hero', array( 'label' => __( 'Show hero media above', 'birds-elements' ), 'type' => Controls_Manager::SWITCHER, 'default' => '' ) );
		$this->end_controls_section();
	}
	protected function render() {
		$s  = $this->get_settings_for_display();
		$id = $this->current_post_id();
		if ( 'post' !== get_post_type( $id ) ) {
			$this->editor_notice( __( 'Article Header shows the current post. Preview it on an article (Elementor Pro: Preview settings → choose a post).', 'birds-elements' ) );
			return;
		}
		if ( 'yes' === $s['hero'] ) {
			echo '<div class="birds-article-hero">' . birds_hero_media_html( $id ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput
		}
		echo birds_article_header_html( $id, array( 'actions' => 'yes' === $s['actions'] ) ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
