<?php
defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class Birds_Membership_Banner_Widget extends Birds_Widget {
	public function get_name() {
		return 'birds-membership-banner';
	}
	public function get_title() {
		return __( 'Birds Membership Banner', 'birds-elements' );
	}
	public function get_icon() {
		return 'eicon-call-to-action';
	}
	/** Output depends on who is reading — never serve it from Elementor's element cache. */
	protected function is_dynamic_content(): bool {
		return true;
	}

	protected function register_controls() {
		$this->heading_section( __( 'Banner', 'birds-elements' ) );
		$this->add_control( 'eyebrow', array( 'label' => __( 'Eyebrow', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Birds Membership', 'birds-elements' ) ) );
		$this->add_control( 'heading', array( 'label' => __( 'Heading', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Executive intelligence, without the paywall.', 'birds-elements' ) ) );
		$this->add_control( 'text', array( 'label' => __( 'Text', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'default' => __( 'Membership is free. Join in one step to unlock deep-dive briefings and downloadable executive dossiers.', 'birds-elements' ) ) );
		$this->add_control( 'perks', array( 'label' => __( 'Perks (one per line)', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'default' => "Unabridged member briefings\nExecutive PDF dossiers\nNo payment, ever" ) );
		$this->add_control( 'button', array( 'label' => __( 'Button', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'Join free', 'birds-elements' ) ) );
		$this->add_control( 'member_heading', array( 'label' => __( 'Heading for signed-in members', 'birds-elements' ), 'type' => Controls_Manager::TEXT, 'default' => __( 'You have full member access.', 'birds-elements' ), 'separator' => 'before' ) );
		$this->add_control( 'member_text', array( 'label' => __( 'Text for signed-in members', 'birds-elements' ), 'type' => Controls_Manager::TEXTAREA, 'default' => __( 'Every member briefing, exhibit and executive PDF is unlocked for your account.', 'birds-elements' ) ) );
		$this->end_controls_section();
	}
	protected function render() {
		$s          = $this->get_settings_for_display();
		$s['perks'] = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $s['perks'] ) ) );
		echo birds_membership_banner_html( $s ); // phpcs:ignore WordPress.Security.EscapeOutput
	}
}
