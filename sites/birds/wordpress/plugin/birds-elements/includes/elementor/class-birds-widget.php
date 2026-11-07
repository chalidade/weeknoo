<?php
/**
 * Base class for Birds widgets: shared category, icon and editor helpers.
 */

defined( 'ABSPATH' ) || exit;

abstract class Birds_Widget extends \Elementor\Widget_Base {

	public function get_categories() {
		return array( 'birds' );
	}

	public function get_keywords() {
		return array( 'birds', 'baugment', 'editorial', 'magazine' );
	}

	public function get_style_depends() {
		return array( 'birds-elements' );
	}

	public function get_script_depends() {
		return array( 'birds-elements' );
	}

	protected function is_editor() {
		return \Elementor\Plugin::$instance->editor->is_edit_mode() || \Elementor\Plugin::$instance->preview->is_preview_mode();
	}

	/** Visible hint in the editor when a widget has nothing to show. */
	protected function editor_notice( $text ) {
		if ( $this->is_editor() ) {
			echo '<div class="birds-el-notice">' . esc_html( $text ) . '</div>';
		}
	}

	/** The post being edited/viewed (works inside Elementor Pro single templates too). */
	protected function current_post_id() {
		$id = get_the_ID();
		if ( $this->is_editor() && isset( $_GET['elementor-preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$id = absint( $_GET['elementor-preview'] ); // phpcs:ignore WordPress.Security.NonceVerification
		}
		return (int) $id;
	}

	protected function heading_section( $label = '' ) {
		$this->start_controls_section( 'content', array( 'label' => $label ? $label : __( 'Content', 'birds-elements' ) ) );
	}
}
