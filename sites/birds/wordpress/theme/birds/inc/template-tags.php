<?php
/**
 * Template helpers.
 */

defined( 'ABSPATH' ) || exit;

function birds_theme_icon( $name ) {
	return function_exists( 'birds_icon' ) ? birds_icon( $name ) : '';
}

/** Lead story: Customizer choice, else the plugin's sticky/newest rule. */
function birds_theme_featured_id() {
	$id = absint( birds_mod( 'birds_featured_post' ) );
	if ( $id && 'publish' === get_post_status( $id ) ) {
		return $id;
	}
	return function_exists( 'birds_featured_post_id' ) ? birds_featured_post_id() : 0;
}

function birds_theme_brand() {
	if ( has_custom_logo() ) {
		the_custom_logo();
		return;
	}
	$word = birds_mod( 'birds_wordmark' );
	$word = $word ? $word : get_bloginfo( 'name' );
	$tag  = birds_mod( 'birds_tagline' );
	printf(
		'<a class="birds-brand" href="%1$s" rel="home"><span class="birds-brand__word">%2$s<i>.</i></span>%3$s</a>',
		esc_url( home_url( '/' ) ),
		esc_html( $word ),
		$tag ? '<span class="birds-brand__tag">' . esc_html( $tag ) . '</span>' : ''
	);
}

/** Does this post's Elementor layout already contain a given widget? */
function birds_theme_has_widget( $post_id, $widget ) {
	$data = get_post_meta( $post_id, '_elementor_data', true );
	return is_string( $data ) && false !== strpos( $data, '"widgetType":"' . $widget . '"' );
}

function birds_theme_card( $post = null ) {
	if ( function_exists( 'birds_article_card_html' ) ) {
		echo birds_article_card_html( $post, array( 'deck' => true ) ); // phpcs:ignore WordPress.Security.EscapeOutput
		return;
	}
	$post = get_post( $post );
	echo '<article class="birds-card"><a class="birds-card__media" href="' . esc_url( get_permalink( $post ) ) . '">' . get_the_post_thumbnail( $post, 'large' ) . '</a><h3 class="birds-card__title"><a href="' . esc_url( get_permalink( $post ) ) . '">' . esc_html( get_the_title( $post ) ) . '</a></h3></article>'; // phpcs:ignore
}

function birds_theme_pagination() {
	the_posts_pagination( array(
		'mid_size'  => 1,
		'prev_text' => birds_theme_icon( 'chevron-left' ) . '<span class="screen-reader-text">' . esc_html__( 'Previous', 'birds' ) . '</span>',
		'next_text' => '<span class="screen-reader-text">' . esc_html__( 'Next', 'birds' ) . '</span>' . birds_theme_icon( 'chevron-right' ),
	) );
}
