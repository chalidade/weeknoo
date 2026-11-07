<?php
/**
 * Customizer: brand, palette, home page sections, footer copy.
 * Appearance → Customize → Birds.
 */

defined( 'ABSPATH' ) || exit;

function birds_theme_defaults() {
	return array(
		'birds_wordmark'        => 'Birds',
		'birds_tagline'         => 'Baugment’s Insights, Research, and Discoveries',
		'birds_color_navy'      => '#000f34',
		'birds_color_royal'     => '#0972cb',
		'birds_color_grey'      => '#f5f5f7',
		'birds_show_marquee'    => true,
		'birds_featured_post'   => 0,
		'birds_marquee_eyebrow' => 'Featured briefing',
		'birds_marquee_button'  => 'Read the briefing',
		'birds_latest_heading'  => 'Latest insights',
		'birds_latest_intro'    => 'Research and perspectives for leaders shaping the workforce of the future.',
		'birds_latest_count'    => 9,
		'birds_latest_filters'  => true,
		'birds_show_banner'     => true,
		'birds_banner_heading'  => 'Executive intelligence, without the paywall.',
		'birds_banner_text'     => 'Membership is free. Join in one step to unlock deep-dive briefings and downloadable executive dossiers.',
		'birds_banner_button'   => 'Join free',
		'birds_show_series'     => true,
		'birds_series_count'    => 3,
		'birds_show_related'    => true,
		'birds_footer_blurb'    => 'Executive intelligence on workforce, leadership and capability across the GCC, Southeast Asia and global markets. No advertising. No clickbait.',
		'birds_footer_owner'    => 'Baugment',
		'birds_footer_note'     => 'A Baugment publication',
	);
}

function birds_mod( $key ) {
	$d = birds_theme_defaults();
	return get_theme_mod( $key, $d[ $key ] ?? '' );
}

add_action( 'customize_register', function ( WP_Customize_Manager $c ) {
	$d = birds_theme_defaults();
	$c->add_panel( 'birds', array( 'title' => __( 'Birds', 'birds' ), 'priority' => 25 ) );

	$text = function ( $section, $key, $label, $type = 'text', $extra = array() ) use ( $c, $d ) {
		$sanitize = array(
			'text'     => 'sanitize_text_field',
			'textarea' => 'sanitize_textarea_field',
			'checkbox' => 'wp_validate_boolean',
			'number'   => 'absint',
		);
		$c->add_setting( $key, array( 'default' => $d[ $key ], 'sanitize_callback' => $sanitize[ $type ] ?? 'sanitize_text_field', 'transport' => 'refresh' ) );
		$c->add_control( $key, array_merge( array( 'section' => $section, 'label' => $label, 'type' => $type ), $extra ) );
	};

	// Brand.
	$c->add_section( 'birds_brand', array( 'title' => __( 'Brand', 'birds' ), 'panel' => 'birds' ) );
	$text( 'birds_brand', 'birds_wordmark', __( 'Wordmark (shown when no logo is set)', 'birds' ) );
	$text( 'birds_brand', 'birds_tagline', __( 'Tagline under the wordmark', 'birds' ) );
	foreach ( array(
		'birds_color_navy'  => __( 'Dark Blue — text, brand, buttons', 'birds' ),
		'birds_color_royal' => __( 'Royal Blue — accents, hover, kickers', 'birds' ),
		'birds_color_grey'  => __( 'Light Grey — dropdowns, alternate sections', 'birds' ),
	) as $key => $label ) {
		$c->add_setting( $key, array( 'default' => $d[ $key ], 'sanitize_callback' => 'sanitize_hex_color' ) );
		$c->add_control( new WP_Customize_Color_Control( $c, $key, array( 'section' => 'birds_brand', 'label' => $label ) ) );
	}

	// Home page.
	$c->add_section( 'birds_home', array( 'title' => __( 'Home page', 'birds' ), 'panel' => 'birds', 'description' => __( 'Used when Settings → Reading shows “Your latest posts”. Choose a static page instead to build the home page with Elementor and the Birds widgets.', 'birds' ) ) );
	$text( 'birds_home', 'birds_show_marquee', __( 'Show the featured hero', 'birds' ), 'checkbox' );
	$posts = array( 0 => __( '— Newest sticky post, else newest post —', 'birds' ) );
	foreach ( get_posts( array( 'numberposts' => 50 ) ) as $p ) {
		$posts[ $p->ID ] = $p->post_title;
	}
	$text( 'birds_home', 'birds_featured_post', __( 'Featured article', 'birds' ), 'select', array( 'choices' => $posts ) );
	$c->get_setting( 'birds_featured_post' )->sanitize_callback = 'absint';
	$text( 'birds_home', 'birds_marquee_eyebrow', __( 'Hero eyebrow', 'birds' ) );
	$text( 'birds_home', 'birds_marquee_button', __( 'Hero button', 'birds' ) );
	$text( 'birds_home', 'birds_latest_heading', __( 'Latest insights — heading', 'birds' ) );
	$text( 'birds_home', 'birds_latest_intro', __( 'Latest insights — intro', 'birds' ) );
	$text( 'birds_home', 'birds_latest_count', __( 'Latest insights — number of articles', 'birds' ), 'number', array( 'input_attrs' => array( 'min' => 3, 'max' => 30 ) ) );
	$text( 'birds_home', 'birds_latest_filters', __( 'Series filter chips', 'birds' ), 'checkbox' );
	$text( 'birds_home', 'birds_show_banner', __( 'Show the membership banner', 'birds' ), 'checkbox' );
	$text( 'birds_home', 'birds_banner_heading', __( 'Banner heading', 'birds' ) );
	$text( 'birds_home', 'birds_banner_text', __( 'Banner text', 'birds' ), 'textarea' );
	$text( 'birds_home', 'birds_banner_button', __( 'Banner button', 'birds' ) );
	$text( 'birds_home', 'birds_show_series', __( 'Show one section per series', 'birds' ), 'checkbox' );
	$text( 'birds_home', 'birds_series_count', __( 'Articles per series section', 'birds' ), 'number', array( 'input_attrs' => array( 'min' => 1, 'max' => 6 ) ) );

	// Articles & footer.
	$c->add_section( 'birds_article', array( 'title' => __( 'Articles', 'birds' ), 'panel' => 'birds' ) );
	$text( 'birds_article', 'birds_show_related', __( 'Show “Continue reading” after articles', 'birds' ), 'checkbox' );
	$c->add_section( 'birds_footer', array( 'title' => __( 'Footer', 'birds' ), 'panel' => 'birds' ) );
	$text( 'birds_footer', 'birds_footer_blurb', __( 'About text', 'birds' ), 'textarea' );
	$text( 'birds_footer', 'birds_footer_owner', __( 'Copyright holder', 'birds' ) );
	$text( 'birds_footer', 'birds_footer_note', __( 'Right-hand note', 'birds' ) );
} );

/** Palette overrides as CSS variables shared by theme and plugin. */
function birds_theme_color_css() {
	$navy  = sanitize_hex_color( birds_mod( 'birds_color_navy' ) );
	$royal = sanitize_hex_color( birds_mod( 'birds_color_royal' ) );
	$grey  = sanitize_hex_color( birds_mod( 'birds_color_grey' ) );
	return ':root{' . ( $navy ? '--birds-navy:' . $navy . ';' : '' ) . ( $royal ? '--birds-royal:' . $royal . ';' : '' ) . ( $grey ? '--birds-grey:' . $grey . ';' : '' ) . '}';
}
