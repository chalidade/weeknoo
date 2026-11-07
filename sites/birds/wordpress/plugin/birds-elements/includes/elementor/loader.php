<?php
/**
 * Elementor integration: a "Birds" panel category with one widget per Birds
 * component. Loaded only when Elementor is active.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'elementor/elements/categories_registered', function ( $elements_manager ) {
	$elements_manager->add_category( 'birds', array(
		'title' => __( 'Birds', 'birds-elements' ),
		'icon'  => 'eicon-posts-grid',
	) );
} );

add_action( 'elementor/widgets/register', function ( $widgets_manager ) {
	require_once __DIR__ . '/class-birds-widget.php';
	$widgets = array(
		'chart'              => 'Birds_Chart_Widget',
		'pull-quote'         => 'Birds_Pull_Quote_Widget',
		'key-takeaways'      => 'Birds_Key_Takeaways_Widget',
		'media-carousel'     => 'Birds_Media_Carousel_Widget',
		'action-table'       => 'Birds_Action_Table_Widget',
		'contributors'       => 'Birds_Contributors_Widget',
		'member-gate'        => 'Birds_Member_Gate_Widget',
		'article-grid'       => 'Birds_Article_Grid_Widget',
		'featured-hero'      => 'Birds_Featured_Hero_Widget',
		'membership-banner'  => 'Birds_Membership_Banner_Widget',
		'series-sections'    => 'Birds_Series_Sections_Widget',
		'article-header'     => 'Birds_Article_Header_Widget',
	);
	foreach ( $widgets as $file => $class ) {
		require_once __DIR__ . '/widgets/' . $file . '.php';
		$widgets_manager->register( new $class() );
	}
} );

/* Re-run the Birds front-end behaviour on widgets rendered in the editor. */
add_action( 'elementor/preview/enqueue_scripts', function () {
	wp_enqueue_script( 'birds-elements' );
} );

/** Category options for selects. */
function birds_el_category_options( $all_label = '' ) {
	$out = array( '' => $all_label ? $all_label : __( 'All series', 'birds-elements' ) );
	foreach ( get_categories( array( 'hide_empty' => false ) ) as $c ) {
		$out[ (string) $c->term_id ] = $c->name;
	}
	return $out;
}

/** Recent posts for selects. */
function birds_el_post_options( $first = '' ) {
	$out = array( '' => $first ? $first : __( 'Automatic (sticky or newest)', 'birds-elements' ) );
	foreach ( get_posts( array( 'numberposts' => 60 ) ) as $p ) {
		$out[ (string) $p->ID ] = $p->post_title;
	}
	return $out;
}
