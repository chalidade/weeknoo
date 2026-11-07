<?php
/**
 * Shared helpers: settings, article data access, formatting.
 */

defined( 'ABSPATH' ) || exit;

function birds_default_settings() {
	return array(
		'instant_registration' => 1,
		'preview_sections'     => 2,
		'company_name'         => 'Baugment',
		'company_url'          => '',
	);
}

function birds_setting( $key ) {
	$settings = wp_parse_args( (array) get_option( 'birds_settings', array() ), birds_default_settings() );
	return $settings[ $key ] ?? null;
}

/**
 * Everything the templates and widgets need to know about an article.
 *
 * @param int|WP_Post|null $post Post.
 * @return array
 */
function birds_article( $post = null ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return array();
	}
	$id         = $post->ID;
	$takeaways  = array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) get_post_meta( $id, '_birds_takeaways', true ) ) ) ) );
	$experts    = array_values( array_filter( array_map( 'absint', explode( ',', (string) get_post_meta( $id, '_birds_experts', true ) ) ) ) );
	$hero_video = (string) get_post_meta( $id, '_birds_hero_video', true );
	$categories = get_the_category( $id );
	$primary    = $categories ? $categories[0] : null;

	return array(
		'id'         => $id,
		'access'     => 'member' === get_post_meta( $id, '_birds_access', true ) ? 'member' : 'free',
		'series'     => (string) get_post_meta( $id, '_birds_series', true ),
		'hero_type'  => ( 'video' === get_post_meta( $id, '_birds_hero_type', true ) && $hero_video ) ? 'video' : 'image',
		'hero_video' => $hero_video,
		'read_time'  => birds_read_time( $post ),
		'takeaways'  => $takeaways,
		'author'     => absint( get_post_meta( $id, '_birds_author', true ) ),
		'experts'    => $experts,
		'category'   => $primary,
	);
}

function birds_read_time( $post ) {
	$post   = get_post( $post );
	$manual = trim( (string) get_post_meta( $post->ID, '_birds_read_time', true ) );
	if ( '' !== $manual ) {
		return $manual;
	}
	$words = str_word_count( wp_strip_all_tags( strip_shortcodes( $post->post_content ) ) );
	/* translators: %d: minutes */
	return sprintf( __( '%d min read', 'birds-elements' ), max( 1, (int) ceil( $words / 230 ) ) );
}

function birds_is_member_post( $post = null ) {
	$post = get_post( $post );
	return $post && 'member' === get_post_meta( $post->ID, '_birds_access', true );
}

/** True when the current visitor may read the full article. */
function birds_can_read( $post = null ) {
	if ( ! birds_is_member_post( $post ) ) {
		return true;
	}
	return (bool) apply_filters( 'birds_can_read_member_content', is_user_logged_in(), get_post( $post ) );
}

/** Kicker text for a post: "CATEGORY · SERIES". */
function birds_kicker( $post = null ) {
	$a = birds_article( $post );
	$parts = array();
	if ( $a['category'] ) {
		$parts[] = $a['category']->name;
	}
	if ( $a['series'] ) {
		$parts[] = $a['series'];
	}
	return implode( ' · ', $parts );
}

/** Featured image URL, or '' (callers render generated artwork instead). */
function birds_image_url( $post = null, $size = 'large' ) {
	$post = get_post( $post );
	return $post && has_post_thumbnail( $post ) ? (string) get_the_post_thumbnail_url( $post, $size ) : '';
}

/** Media block: the featured image or a tasteful navy fallback panel. */
function birds_media_html( $post = null, $size = 'large', $class = '' ) {
	$post = get_post( $post );
	if ( $post && has_post_thumbnail( $post ) ) {
		return get_the_post_thumbnail( $post, $size, array( 'class' => 'birds-media__img ' . $class, 'loading' => 'lazy', 'alt' => '' ) );
	}
	return '<span class="birds-media__fallback ' . esc_attr( $class ) . '" aria-hidden="true"></span>';
}

function birds_initials( $name ) {
	$name  = preg_replace( '/^Dr\.?\s*/i', '', (string) $name );
	$parts = preg_split( '/\s+/', trim( $name ) );
	$out   = '';
	foreach ( array_slice( $parts, 0, 2 ) as $p ) {
		$out .= function_exists( 'mb_substr' ) ? mb_substr( $p, 0, 1 ) : substr( $p, 0, 1 );
	}
	return strtoupper( $out );
}

function birds_format_number( $value, $unit = '' ) {
	$value = (float) $value;
	$out   = ( floor( $value ) == $value ) ? number_format_i18n( $value ) : number_format_i18n( $value, 1 );
	return $out . $unit;
}

/** Splits "a | b | c" lines into rows of cells. */
function birds_parse_rows( $text ) {
	$rows = array();
	foreach ( preg_split( '/\r\n|\r|\n/', (string) $text ) as $line ) {
		$line = trim( wp_strip_all_tags( $line ) );
		if ( '' === $line ) {
			continue;
		}
		$rows[] = array_map( 'trim', explode( '|', $line ) );
	}
	return $rows;
}

/** Normalises an image reference (attachment id or URL) to a URL. */
function birds_resolve_image( $ref, $size = 'large' ) {
	if ( is_numeric( $ref ) && (int) $ref > 0 ) {
		$url = wp_get_attachment_image_url( (int) $ref, $size );
		return $url ? $url : '';
	}
	return esc_url_raw( (string) $ref );
}
