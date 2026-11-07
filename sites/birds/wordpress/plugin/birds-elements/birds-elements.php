<?php
/**
 * Plugin Name:       Birds Elements
 * Plugin URI:        https://chalidade.github.io/weeknoo/birds/
 * Description:       Editorial toolkit for the Birds magazine: contributor profiles, article settings, free vs member access, and Birds components (charts, pull quotes, carousels, action tables, article grids, hero) as Elementor widgets and shortcodes.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Baugment
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       birds-elements
 *
 * Elementor tested up to: 3.30
 */

defined( 'ABSPATH' ) || exit;

define( 'BIRDS_ELEMENTS_VERSION', '1.0.0' );
define( 'BIRDS_ELEMENTS_FILE', __FILE__ );
define( 'BIRDS_ELEMENTS_DIR', plugin_dir_path( __FILE__ ) );
define( 'BIRDS_ELEMENTS_URL', plugin_dir_url( __FILE__ ) );

require_once BIRDS_ELEMENTS_DIR . 'includes/helpers.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/icons.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/contributors.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/post-meta.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/render.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/charts.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/shortcodes.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/membership.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/rest.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/admin.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/demo-import.php';
require_once BIRDS_ELEMENTS_DIR . 'includes/elementor/loader.php';

add_action( 'init', function () {
	load_plugin_textdomain( 'birds-elements', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'birds-elements', BIRDS_ELEMENTS_URL . 'assets/css/birds-elements.css', array(), BIRDS_ELEMENTS_VERSION );
	wp_enqueue_script( 'birds-elements', BIRDS_ELEMENTS_URL . 'assets/js/birds-elements.js', array(), BIRDS_ELEMENTS_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	wp_localize_script(
		'birds-elements',
		'BirdsElements',
		array(
			'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( 'birds_auth' ),
			'loggedIn' => is_user_logged_in(),
		)
	);
} );

register_activation_hook( __FILE__, function () {
	birds_register_contributor_type();
	flush_rewrite_rules();
	if ( false === get_option( 'birds_settings' ) ) {
		add_option( 'birds_settings', birds_default_settings() );
	}
} );

/* Renderings cached by Elementor before this plugin's gating was active
 * must not be served again. */
register_activation_hook( __FILE__, function () {
	delete_post_meta_by_key( '_elementor_element_cache' );
} );
