<?php
/**
 * Theme supports, assets, activation defaults.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'birds', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'custom-logo', array( 'height' => 64, 'width' => 220, 'flex-width' => true, 'flex-height' => true ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( array( 'assets/css/editor.css' ) );
	add_image_size( 'birds-hero', 2400, 1350, true );
	register_nav_menus( array(
		'primary' => __( 'Primary navigation', 'birds' ),
		'footer'  => __( 'Footer links', 'birds' ),
	) );
} );

/** Inter, theme CSS/JS and the Customizer colour overrides. */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'birds-inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	$deps = wp_style_is( 'birds-elements', 'registered' ) ? array( 'birds-elements' ) : array();
	wp_enqueue_style( 'birds-theme', get_template_directory_uri() . '/assets/css/theme.css', $deps, BIRDS_THEME_VERSION );
	wp_add_inline_style( 'birds-theme', birds_theme_color_css() );
	wp_enqueue_script( 'birds-theme', get_template_directory_uri() . '/assets/js/theme.js', array(), BIRDS_THEME_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	wp_localize_script( 'birds-theme', 'BirdsTheme', array(
		'rest'    => esc_url_raw( rest_url( 'wp/v2/' ) ),
		'search'  => esc_url_raw( home_url( '/?s=' ) ),
		'plugin'  => function_exists( 'birds_article' ),
		'strings' => array(
			'results' => __( 'results for', 'birds' ),
			'result'  => __( 'result for', 'birds' ),
			'empty'   => __( 'Nothing saved yet', 'birds' ),
		),
	) );
}, 20 );

add_filter( 'wp_resource_hints', function ( $urls, $type ) {
	if ( 'preconnect' === $type ) {
		$urls[] = 'https://fonts.googleapis.com';
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' );
	}
	return $urls;
}, 10, 2 );

add_action( 'wp_head', function () {
	echo "<script>document.documentElement.className = document.documentElement.className.replace('no-js','js');</script>\n";
}, 1 );

add_filter( 'language_attributes', function ( $output ) {
	return $output . ' class="no-js"';
} );

/** Header sits over a dark hero on the magazine home and on articles with media. */
function birds_theme_overlay() {
	if ( is_front_page() && 'posts' === get_option( 'show_on_front' ) && birds_mod( 'birds_show_marquee' ) && function_exists( 'birds_marquee_html' ) && birds_theme_featured_id() ) {
		return true;
	}
	if ( is_singular( 'post' ) ) {
		$a = function_exists( 'birds_article' ) ? birds_article() : array();
		return has_post_thumbnail() || ( isset( $a['hero_type'] ) && 'video' === $a['hero_type'] );
	}
	return false;
}

add_filter( 'body_class', function ( $classes ) {
	if ( birds_theme_overlay() ) {
		$classes[] = 'birds-overlay';
	}
	if ( is_singular() && function_exists( 'birds_is_elementor_post' ) && birds_is_elementor_post( get_the_ID() ) ) {
		$classes[] = 'birds-elementor';
	}
	return $classes;
} );

/** Elementor Pro theme-builder locations (header, footer, single, archive). */
add_action( 'elementor/theme/register_locations', function ( $manager ) {
	$manager->register_all_core_location();
} );

/* Activation: tagline, a Saved page and a sensible excerpt length. */
add_action( 'after_switch_theme', function () {
	$desc = get_option( 'blogdescription' );
	if ( ! $desc || 'Just another WordPress site' === $desc ) {
		update_option( 'blogdescription', 'Baugment’s Insights, Research, and Discoveries' );
	}
	if ( ! birds_theme_saved_page_id() ) {
		$id = wp_insert_post( array(
			'post_type'   => 'page',
			'post_status' => 'publish',
			'post_title'  => __( 'Saved', 'birds' ),
			'post_name'   => 'saved',
		) );
		if ( $id && ! is_wp_error( $id ) ) {
			update_post_meta( $id, '_wp_page_template', 'templates/saved.php' );
		}
	}
} );

function birds_theme_saved_page_id() {
	$pages = get_pages( array( 'meta_key' => '_wp_page_template', 'meta_value' => 'templates/saved.php', 'number' => 1 ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
	return $pages ? (int) $pages[0]->ID : 0;
}

add_filter( 'excerpt_length', function () {
	return 32;
} );

/* Recommend the companion plugin. */
add_action( 'admin_notices', function () {
	if ( function_exists( 'birds_article' ) || ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	echo '<div class="notice notice-warning"><p>' . wp_kses_post( __( '<strong>Birds theme:</strong> activate the <em>Birds Elements</em> plugin for charts, contributor profiles, member access and the Elementor widgets.', 'birds' ) ) . '</p></div>';
} );

/* An optional footer widget area (also keeps the Customizer's Widgets panel present). */
add_action( 'widgets_init', function () {
	register_sidebar( array(
		'name'          => __( 'Footer', 'birds' ),
		'id'            => 'footer',
		'description'   => __( 'Shown above the footer’s copyright line.', 'birds' ),
		'before_widget' => '<div id="%1$s" class="birds-footer__widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<p class="birds-footer__head">',
		'after_title'   => '</p>',
	) );
} );
