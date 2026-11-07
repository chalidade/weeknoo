<?php
/**
 * Shortcodes — every Birds component is usable without Elementor, in the
 * block editor (Shortcode block) or the classic editor.
 *
 *   [birds_chart type="column" title="…" subtitle="…" unit="%" value_label="…"
 *                benchmark_label="…" source="…"]
 *   Label | value | benchmark | #color
 *   [/birds_chart]
 *   [birds_quote author="…" title="…"]Quote text[/birds_quote]
 *   [birds_takeaways]One per line (empty = the post's key takeaways)[/birds_takeaways]
 *   [birds_carousel][birds_slide image="ID or URL" attribution="…" quote="…"]Caption[/birds_slide][/birds_carousel]
 *   [birds_table caption="…"]Header | Header
 *   Cell | Cell[/birds_table]
 *   [birds_member_gate]   — member articles stop here for signed-out readers
 *   [birds_contributors author="ID" experts="ID,ID"]  (empty = this post's)
 *   [birds_articles layout="grid|feature|list" category="slug" count="6" columns="3" deck="yes" access="member"]
 *   [birds_marquee post="ID"]  [birds_membership_banner]  [birds_series_sections count="3"]
 */

defined( 'ABSPATH' ) || exit;

/** Shortcode body → plain lines, undoing wpautop's <p>/<br>. */
function birds_shortcode_text( $content ) {
	$content = preg_replace( '#<br\s*/?>|</p>\s*<p[^>]*>|</?p[^>]*>#i', "\n", (string) $content );
	return trim( html_entity_decode( wp_strip_all_tags( $content ), ENT_QUOTES, 'UTF-8' ) );
}

function birds_yes( $value ) {
	return in_array( strtolower( (string) $value ), array( '1', 'yes', 'true', 'on' ), true );
}

add_action( 'init', function () {
	add_shortcode( 'birds_chart', function ( $atts, $content = '' ) {
		$atts         = shortcode_atts( array(
			'type'            => 'column',
			'title'           => '',
			'subtitle'        => '',
			'unit'            => '',
			'value_label'     => __( 'Value', 'birds-elements' ),
			'benchmark_label' => __( 'Benchmark', 'birds-elements' ),
			'source'          => '',
			'exhibit'         => 'yes',
		), $atts, 'birds_chart' );
		$atts['data']    = birds_parse_rows( birds_shortcode_text( $content ) );
		$atts['exhibit'] = birds_yes( $atts['exhibit'] );
		return birds_chart_html( $atts );
	} );

	add_shortcode( 'birds_quote', function ( $atts, $content = '' ) {
		$atts = shortcode_atts( array( 'author' => '', 'title' => '' ), $atts, 'birds_quote' );
		return birds_quote_html( birds_shortcode_text( $content ), $atts['author'], $atts['title'] );
	} );

	add_shortcode( 'birds_takeaways', function ( $atts, $content = '' ) {
		$atts  = shortcode_atts( array( 'title' => '' ), $atts, 'birds_takeaways' );
		$text  = birds_shortcode_text( $content );
		$items = '' !== $text ? preg_split( '/\n+/', $text ) : birds_article()['takeaways'] ?? array();
		return birds_takeaways_html( (array) $items, $atts['title'] );
	} );

	add_shortcode( 'birds_slide', function ( $atts, $content = '' ) {
		$atts                     = shortcode_atts( array( 'image' => '', 'attribution' => '', 'quote' => '' ), $atts, 'birds_slide' );
		$atts['caption']          = birds_shortcode_text( $content );
		$GLOBALS['birds_slides'][] = $atts;
		return '';
	} );

	add_shortcode( 'birds_carousel', function ( $atts, $content = '' ) {
		$GLOBALS['birds_slides'] = array();
		do_shortcode( $content );
		$slides = $GLOBALS['birds_slides'];
		unset( $GLOBALS['birds_slides'] );
		return birds_carousel_html( $slides );
	} );

	add_shortcode( 'birds_table', function ( $atts, $content = '' ) {
		$atts = shortcode_atts( array( 'caption' => '', 'header' => 'yes' ), $atts, 'birds_table' );
		$rows = birds_parse_rows( birds_shortcode_text( $content ) );
		$head = birds_yes( $atts['header'] ) && $rows ? array_shift( $rows ) : array();
		return birds_table_html( $atts['caption'], $head, $rows );
	} );

	// The gate is a marker: content after it is removed for signed-out readers
	// by the_content filter in membership.php, so here it renders nothing.
	add_shortcode( 'birds_member_gate', '__return_empty_string' );

	add_shortcode( 'birds_contributors', function ( $atts ) {
		$atts    = shortcode_atts( array( 'author' => '', 'experts' => '' ), $atts, 'birds_contributors' );
		$a       = birds_article();
		$author  = '' !== $atts['author'] ? absint( $atts['author'] ) : ( $a['author'] ?? 0 );
		$experts = '' !== $atts['experts'] ? array_filter( array_map( 'absint', explode( ',', $atts['experts'] ) ) ) : ( $a['experts'] ?? array() );
		return birds_contributors_html( $author, $experts );
	} );

	add_shortcode( 'birds_articles', function ( $atts ) {
		$atts = shortcode_atts( array(
			'layout'   => 'grid',
			'category' => '',
			'count'    => 6,
			'offset'   => 0,
			'columns'  => 3,
			'deck'     => 'no',
			'access'   => '',
			'orderby'  => 'date',
		), $atts, 'birds_articles' );
		$atts['deck'] = birds_yes( $atts['deck'] );
		return birds_articles_html( $atts );
	} );

	add_shortcode( 'birds_marquee', function ( $atts ) {
		$atts = shortcode_atts( array( 'post' => '', 'eyebrow' => '', 'button' => '' ), $atts, 'birds_marquee' );
		$post = $atts['post'] ? absint( $atts['post'] ) : birds_featured_post_id();
		return birds_marquee_html( $post, array_filter( array( 'eyebrow' => $atts['eyebrow'], 'button' => $atts['button'] ) ) );
	} );

	add_shortcode( 'birds_membership_banner', function ( $atts ) {
		return birds_membership_banner_html( array_filter( shortcode_atts( array( 'heading' => '', 'text' => '', 'button' => '' ), $atts, 'birds_membership_banner' ) ) );
	} );

	add_shortcode( 'birds_series_sections', function ( $atts ) {
		$atts = shortcode_atts( array( 'count' => 3 ), $atts, 'birds_series_sections' );
		return birds_series_sections_html( array( 'count' => absint( $atts['count'] ) ) );
	} );
} );

/** Lead story: newest sticky post, else the newest post. */
function birds_featured_post_id() {
	$sticky = array_filter( array_map( 'absint', (array) get_option( 'sticky_posts', array() ) ) );
	if ( $sticky ) {
		$p = get_posts( array( 'post__in' => $sticky, 'numberposts' => 1, 'ignore_sticky_posts' => true ) );
		if ( $p ) {
			return $p[0]->ID;
		}
	}
	$p = get_posts( array( 'numberposts' => 1 ) );
	return $p ? $p[0]->ID : 0;
}
