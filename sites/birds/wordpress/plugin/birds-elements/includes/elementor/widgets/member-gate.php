<?php
defined( 'ABSPATH' ) || exit;

class Birds_Member_Gate_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-member-gate';
	}
	public function get_title() {
		return __( 'Birds Member Gate', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-lock-user';
	}
	public function get_keywords() {
		return array( 'member', 'gate', 'paywall', 'login', 'lock' );
	}
	/** Output depends on who is reading — never serve it from Elementor's element cache. */
	protected function is_dynamic_content(): bool {
		return true;
	}

	protected function register_controls() {
		$this->heading_section( __( 'Member Gate', 'birds-elements' ) );
		$this->add_control( 'info', array(
			'type'            => \Elementor\Controls_Manager::RAW_HTML,
			'raw'             => esc_html__( 'On a Member Briefing, signed-out readers see everything above this widget, then the unlock card. Nothing below it is sent to their browser. Members and free articles are not affected.', 'birds-elements' ),
			'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
		) );
		$this->end_controls_section();
	}
	protected function render() {
		$post_id = $this->current_post_id();
		if ( $this->is_editor() ) {
			echo '<div class="birds-el-notice birds-el-notice--gate">' . esc_html__( 'Member Gate — signed-out readers of a Member Briefing stop here.', 'birds-elements' ) . '</div>';
			return;
		}
		if ( $post_id && ! birds_can_read( $post_id ) ) {
			$hidden = $GLOBALS['birds_el_gate']['hidden'] ?? 0;
			echo birds_gate_html( $hidden ); // phpcs:ignore WordPress.Security.EscapeOutput
		}
	}
}
