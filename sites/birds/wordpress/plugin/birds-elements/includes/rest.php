<?php
/**
 * REST fields used by the saved library and live search (and by any headless
 * front end): card HTML plus the article's Birds metadata.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	register_rest_field( 'post', 'birds', array(
		'get_callback' => function ( $data ) {
			$a = birds_article( $data['id'] );
			return array(
				'access'    => $a['access'],
				// Plain text: term names are stored HTML-encoded ("L&amp;D").
				'category'  => $a['category'] ? html_entity_decode( $a['category']->name, ENT_QUOTES, 'UTF-8' ) : '',
				'kicker'    => html_entity_decode( birds_kicker( $data['id'] ), ENT_QUOTES, 'UTF-8' ),
				'read_time' => $a['read_time'],
				'card'      => birds_article_card_html( $data['id'], array( 'deck' => true ) ),
			);
		},
		'schema'       => array( 'type' => 'object', 'context' => array( 'view' ), 'readonly' => true ),
	) );
} );
