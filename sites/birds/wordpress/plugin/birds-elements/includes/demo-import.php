<?php
/**
 * Demo content importer (Settings → Birds). Turns demo/articles.json into
 * categories, contributors, media and block-editor posts. Everything created
 * is tagged with _birds_demo so it can be removed again.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_post_birds_demo_import', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'birds-elements' ) );
	}
	check_admin_referer( 'birds_demo_import' );
	$result = birds_demo_import();
	$msg    = is_wp_error( $result )
		? $result->get_error_message()
		/* translators: 1: articles 2: contributors */
		: sprintf( __( 'Demo imported: %1$d articles, %2$d contributors. Visit the site to see them.', 'birds-elements' ), $result['articles'], $result['contributors'] );
	wp_safe_redirect( add_query_arg( 'birds_demo', rawurlencode( $msg ), admin_url( 'options-general.php?page=birds' ) ) );
	exit;
} );

add_action( 'admin_post_birds_demo_remove', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'birds-elements' ) );
	}
	check_admin_referer( 'birds_demo_remove' );
	$n = birds_demo_remove();
	/* translators: %d items */
	wp_safe_redirect( add_query_arg( 'birds_demo', rawurlencode( sprintf( __( 'Removed %d demo items.', 'birds-elements' ), $n ) ), admin_url( 'options-general.php?page=birds' ) ) );
	exit;
} );

/** Escapes a value for use inside a shortcode attribute. */
function birds_sc_attr( $value ) {
	return str_replace( array( '"', '[', ']' ), array( '&quot;', '&#91;', '&#93;' ), (string) $value );
}

function birds_block( $type, $inner ) {
	switch ( $type ) {
		case 'heading':
			return "<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">" . esc_html( $inner ) . "</h2>\n<!-- /wp:heading -->\n\n";
		case 'paragraph':
			return "<!-- wp:paragraph -->\n<p>" . esc_html( $inner ) . "</p>\n<!-- /wp:paragraph -->\n\n";
		default:
			return "<!-- wp:shortcode -->\n" . $inner . "\n<!-- /wp:shortcode -->\n\n";
	}
}

/** Imports a bundled media file once; returns the attachment id. */
function birds_demo_media( $file ) {
	static $cache = array();
	if ( isset( $cache[ $file ] ) ) {
		return $cache[ $file ];
	}
	$existing = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_birds_demo_file', 'meta_value' => $file ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
	if ( $existing ) {
		return $cache[ $file ] = $existing[0];
	}
	$src = BIRDS_ELEMENTS_DIR . 'demo/media/' . basename( $file );
	if ( ! is_readable( $src ) ) {
		return 0;
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$tmp = wp_tempnam( $file );
	copy( $src, $tmp );
	$id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $tmp ), 0 );
	if ( is_wp_error( $id ) ) {
		wp_delete_file( $tmp );
		return 0;
	}
	update_post_meta( $id, '_birds_demo', 1 );
	update_post_meta( $id, '_birds_demo_file', $file );
	return $cache[ $file ] = $id;
}

function birds_demo_category( $name, $parent = 0, $description = '' ) {
	$term = term_exists( $name, 'category', $parent );
	if ( ! $term ) {
		$term = wp_insert_term( $name, 'category', array( 'parent' => $parent, 'description' => $description ) );
	} elseif ( $description ) {
		wp_update_term( (int) $term['term_id'], 'category', array( 'description' => $description ) );
	}
	return is_wp_error( $term ) ? 0 : (int) $term['term_id'];
}

/** @return array|WP_Error */
function birds_demo_import() {
	$json = file_get_contents( BIRDS_ELEMENTS_DIR . 'demo/articles.json' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	$data = $json ? json_decode( $json, true ) : null;
	if ( ! is_array( $data ) ) {
		return new WP_Error( 'birds_demo', __( 'Demo data is missing or unreadable.', 'birds-elements' ) );
	}
	if ( function_exists( 'set_time_limit' ) ) {
		set_time_limit( 300 ); // phpcs:ignore
	}

	// Series → categories, in series order (menus and footers sort by creation).
	// A group other than a series of the same name becomes the parent category.
	$group_ids  = array();
	$series_ids = array();
	foreach ( $data['series'] as $s ) {
		$parent = 0;
		if ( $s['group'] !== $s['name'] ) {
			if ( ! isset( $group_ids[ $s['group'] ] ) ) {
				$group_ids[ $s['group'] ] = birds_demo_category( $s['group'] );
			}
			$parent = $group_ids[ $s['group'] ];
		}
		$series_ids[ $s['name'] ] = birds_demo_category( $s['name'], $parent, $s['description'] );
	}

	// WordPress's untouched sample post would otherwise lead the home page.
	$hello = get_post( 1 );
	if ( $hello && 'hello-world' === $hello->post_name && $hello->post_date === $hello->post_modified ) {
		wp_trash_post( 1 );
	}

	// Contributors.
	$company_url = (string) birds_setting( 'company_url' );
	$people      = array();
	foreach ( $data['contributors'] as $c ) {
		$found = get_posts( array( 'post_type' => 'birds_contributor', 'title' => $c['fullName'], 'numberposts' => 1, 'fields' => 'ids', 'post_status' => 'any' ) );
		$id    = $found ? $found[0] : wp_insert_post( wp_slash( array(
			'post_type'    => 'birds_contributor',
			'post_status'  => 'publish',
			'post_title'   => $c['fullName'],
			'post_content' => $c['personalBio'],
		) ) );
		if ( ! $id || is_wp_error( $id ) ) {
			continue;
		}
		if ( ! $found ) {
			$meta = array(
				'_birds_role'        => $c['role'],
				'_birds_title'       => $c['title'],
				'_birds_company'     => $c['company'],
				'_birds_company_bio' => $c['companyBio'],
				'_birds_linkedin'    => $c['linkedinUrl'],
				'_birds_company_url' => $c['companyUrl'] ? $c['companyUrl'] : ( 'Baugment' === $c['company'] ? $company_url : '' ),
				'_birds_demo'        => 1,
			);
			foreach ( $meta as $k => $v ) {
				update_post_meta( $id, $k, $v );
			}
		}
		$people[ $c['key'] ] = $id;
	}

	// Articles.
	$preview = max( 1, (int) birds_setting( 'preview_sections' ) );
	$count   = 0;
	foreach ( $data['articles'] as $a ) {
		if ( get_page_by_path( $a['id'], OBJECT, 'post' ) ) {
			continue;
		}
		$content = '';
		foreach ( $a['contentSections'] as $i => $s ) {
			if ( 'member' === $a['accessType'] && $i === $preview ) {
				$content .= birds_block( 'shortcode', '[birds_member_gate]' );
			}
			if ( ! empty( $s['heading'] ) ) {
				$content .= birds_block( 'heading', $s['heading'] );
			}
			foreach ( $s['paragraphs'] as $p ) {
				$content .= birds_block( 'paragraph', $p );
			}
			if ( isset( $s['chartIndex'] ) && isset( $a['charts'][ $s['chartIndex'] ] ) ) {
				$c     = $a['charts'][ $s['chartIndex'] ];
				$attrs = array( 'type' => $c['type'], 'title' => $c['title'] );
				foreach ( array( 'subtitle' => 'subtitle', 'unit' => 'unit', 'valueLabel' => 'value_label', 'benchmarkLabel' => 'benchmark_label', 'source' => 'source' ) as $from => $to ) {
					if ( isset( $c[ $from ] ) && '' !== $c[ $from ] ) {
						$attrs[ $to ] = $c[ $from ];
					}
				}
				$sc = '[birds_chart';
				foreach ( $attrs as $k => $v ) {
					$sc .= ' ' . $k . '="' . birds_sc_attr( $v ) . '"';
				}
				$sc .= "]\n";
				foreach ( $c['data'] as $d ) {
					$sc .= $d['label'] . ' | ' . $d['value'] . ( isset( $d['benchmark'] ) ? ' | ' . $d['benchmark'] : '' ) . "\n";
				}
				$content .= birds_block( 'shortcode', $sc . '[/birds_chart]' );
			}
			if ( ! empty( $s['actionTable'] ) ) {
				$t   = $s['actionTable'];
				$sc  = '[birds_table caption="' . birds_sc_attr( $t['caption'] ?? '' ) . "\"]\n" . implode( ' | ', $t['columns'] ) . "\n";
				foreach ( $t['rows'] as $r ) {
					$sc .= implode( ' | ', $r ) . "\n";
				}
				$content .= birds_block( 'shortcode', $sc . '[/birds_table]' );
			}
			if ( ! empty( $s['showCarousel'] ) && ! empty( $a['carouselItems'] ) ) {
				$sc = '[birds_carousel]';
				foreach ( $a['carouselItems'] as $slide ) {
					$sc .= "\n" . '[birds_slide image="' . birds_demo_media( $slide['imageUrl'] ) . '"'
						. ( ! empty( $slide['attribution'] ) ? ' attribution="' . birds_sc_attr( $slide['attribution'] ) . '"' : '' )
						. ( ! empty( $slide['quote'] ) ? ' quote="' . birds_sc_attr( $slide['quote'] ) . '"' : '' )
						. ']' . $slide['caption'] . '[/birds_slide]';
				}
				$content .= birds_block( 'shortcode', $sc . "\n[/birds_carousel]" );
			}
			if ( ! empty( $s['pullQuote'] ) ) {
				$q        = $s['pullQuote'];
				$content .= birds_block( 'shortcode', '[birds_quote author="' . birds_sc_attr( $q['author'] ?? '' ) . '" title="' . birds_sc_attr( $q['title'] ?? '' ) . '"]' . $q['text'] . '[/birds_quote]' );
			}
		}

		$post_id = wp_insert_post( wp_slash( array(
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_name'     => $a['id'],
			'post_title'    => $a['title'],
			'post_excerpt'  => $a['subtitle'],
			'post_content'  => trim( $content ),
			'post_date'     => $a['publishedAt'] . ' 09:00:00',
			'post_category' => array( $series_ids[ $a['category'] ] ?? 0 ),
		) ), true );
		if ( is_wp_error( $post_id ) ) {
			continue;
		}
		$video = ! empty( $a['heroVideoUrl'] ) ? birds_demo_media( $a['heroVideoUrl'] ) : 0;
		$meta  = array(
			'_birds_access'     => $a['accessType'],
			'_birds_series'     => $a['series'] ?? '',
			'_birds_hero_type'  => $video ? $a['heroType'] : 'image',
			'_birds_hero_video' => $video ? wp_get_attachment_url( $video ) : '',
			'_birds_read_time'  => $a['readTime'],
			'_birds_takeaways'  => implode( "\n", $a['keyTakeaways'] ),
			'_birds_author'     => $people[ $a['author'] ] ?? 0,
			'_birds_experts'    => implode( ',', array_filter( array_map( function ( $k ) use ( $people ) {
				return $people[ $k ] ?? 0;
			}, $a['interviewedExperts'] ) ) ),
			'_birds_demo'       => 1,
		);
		foreach ( $meta as $k => $v ) {
			update_post_meta( $post_id, $k, $v );
		}
		$thumb = birds_demo_media( $a['featuredImage'] );
		if ( $thumb ) {
			set_post_thumbnail( $post_id, $thumb );
		}
		if ( ! empty( $a['featured'] ) ) {
			stick_post( $post_id );
		}
		$count++;
	}

	return array( 'articles' => $count, 'contributors' => count( $people ) );
}

function birds_demo_remove() {
	$ids = get_posts( array( 'post_type' => array( 'post', 'birds_contributor', 'attachment' ), 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids', 'meta_key' => '_birds_demo' ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
	foreach ( $ids as $id ) {
		if ( 'attachment' === get_post_type( $id ) ) {
			wp_delete_attachment( $id, true );
		} else {
			unstick_post( $id );
			wp_delete_post( $id, true );
		}
	}
	return count( $ids );
}
