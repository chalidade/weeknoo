<?php
/**
 * Contributors: authors, editors and interviewed experts as a private post type.
 * Title = full name, editor = personal bio, featured image = portrait.
 */

defined( 'ABSPATH' ) || exit;

const BIRDS_CONTRIBUTOR_FIELDS = array(
	'_birds_role'        => 'Role',
	'_birds_title'       => 'Designation',
	'_birds_company'     => 'Company',
	'_birds_linkedin'    => 'LinkedIn profile URL',
	'_birds_company_url' => 'Company website URL',
	'_birds_company_bio' => 'Company bio',
);

function birds_register_contributor_type() {
	register_post_type(
		'birds_contributor',
		array(
			'labels'        => array(
				'name'               => __( 'Contributors', 'birds-elements' ),
				'singular_name'      => __( 'Contributor', 'birds-elements' ),
				'add_new_item'       => __( 'Add contributor', 'birds-elements' ),
				'edit_item'          => __( 'Edit contributor', 'birds-elements' ),
				'featured_image'     => __( 'Portrait', 'birds-elements' ),
				'set_featured_image' => __( 'Set portrait', 'birds-elements' ),
				'menu_name'          => __( 'Contributors', 'birds-elements' ),
				'search_items'       => __( 'Search contributors', 'birds-elements' ),
				'not_found'          => __( 'No contributors yet.', 'birds-elements' ),
			),
			'public'        => false,
			'show_ui'       => true,
			'show_in_rest'  => true,
			'menu_icon'     => 'dashicons-id-alt',
			'menu_position' => 6,
			'supports'      => array( 'title', 'editor', 'thumbnail' ),
		)
	);

	foreach ( array_keys( BIRDS_CONTRIBUTOR_FIELDS ) as $key ) {
		register_post_meta(
			'birds_contributor',
			$key,
			array(
				'type'          => 'string',
				'single'        => true,
				'show_in_rest'  => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'birds_register_contributor_type' );

add_filter( 'enter_title_here', function ( $text, $post ) {
	return 'birds_contributor' === $post->post_type ? __( 'Full name', 'birds-elements' ) : $text;
}, 10, 2 );

add_action( 'add_meta_boxes_birds_contributor', function () {
	add_meta_box( 'birds-contributor', __( 'Profile', 'birds-elements' ), 'birds_contributor_metabox', 'birds_contributor', 'normal', 'high' );
} );

function birds_contributor_metabox( $post ) {
	wp_nonce_field( 'birds_contributor_save', 'birds_contributor_nonce' );
	echo '<p class="description">' . esc_html__( 'Write the personal bio in the editor above. The featured image is the circular portrait (a monogram is shown when empty).', 'birds-elements' ) . '</p>';
	echo '<table class="form-table" role="presentation"><tbody>';
	foreach ( BIRDS_CONTRIBUTOR_FIELDS as $key => $label ) {
		$value = (string) get_post_meta( $post->ID, $key, true );
		echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $label ) . '</label></th><td>';
		if ( '_birds_role' === $key ) {
			echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
			foreach ( array( 'author' => 'Author', 'editor' => 'Editor', 'expert' => 'Interviewed expert' ) as $v => $l ) {
				printf( '<option value="%s"%s>%s</option>', esc_attr( $v ), selected( $value ? $value : 'expert', $v, false ), esc_html( $l ) );
			}
			echo '</select>';
		} elseif ( '_birds_company_bio' === $key ) {
			echo '<textarea class="large-text" rows="3" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $value ) . '</textarea>';
		} else {
			$type = false !== strpos( $key, 'url' ) || '_birds_linkedin' === $key ? 'url' : 'text';
			echo '<input class="regular-text" type="' . esc_attr( $type ) . '" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '">';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

add_action( 'save_post_birds_contributor', function ( $post_id ) {
	if ( ! isset( $_POST['birds_contributor_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['birds_contributor_nonce'] ) ), 'birds_contributor_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array_keys( BIRDS_CONTRIBUTOR_FIELDS ) as $key ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$raw = wp_unslash( $_POST[ $key ] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( '_birds_linkedin' === $key || '_birds_company_url' === $key ) {
			$value = esc_url_raw( $raw );
		} elseif ( '_birds_company_bio' === $key ) {
			$value = sanitize_textarea_field( $raw );
		} else {
			$value = sanitize_text_field( $raw );
		}
		update_post_meta( $post_id, $key, $value );
	}
} );

add_filter( 'manage_birds_contributor_posts_columns', function ( $cols ) {
	return array(
		'cb'            => $cols['cb'],
		'title'         => __( 'Name', 'birds-elements' ),
		'birds_role'    => __( 'Role', 'birds-elements' ),
		'birds_company' => __( 'Designation & company', 'birds-elements' ),
		'date'          => $cols['date'],
	);
} );

add_action( 'manage_birds_contributor_posts_custom_column', function ( $col, $id ) {
	if ( 'birds_role' === $col ) {
		echo esc_html( ucfirst( (string) get_post_meta( $id, '_birds_role', true ) ) );
	} elseif ( 'birds_company' === $col ) {
		echo esc_html( trim( get_post_meta( $id, '_birds_title', true ) . ', ' . get_post_meta( $id, '_birds_company', true ), ', ' ) );
	}
}, 10, 2 );

/** @return array{name:string,title:string,company:string,photo:string,linkedin:string,bio:string,company_bio:string,company_url:string,role:string}|null */
function birds_contributor( $id ) {
	$p = get_post( $id );
	if ( ! $p || 'birds_contributor' !== $p->post_type || 'publish' !== $p->post_status ) {
		return null;
	}
	return array(
		'id'          => $p->ID,
		'name'        => get_the_title( $p ),
		'role'        => (string) get_post_meta( $p->ID, '_birds_role', true ),
		'title'       => (string) get_post_meta( $p->ID, '_birds_title', true ),
		'company'     => (string) get_post_meta( $p->ID, '_birds_company', true ),
		'photo'       => birds_image_url( $p, 'thumbnail' ),
		'linkedin'    => (string) get_post_meta( $p->ID, '_birds_linkedin', true ),
		'bio'         => wp_strip_all_tags( $p->post_content ),
		'company_bio' => (string) get_post_meta( $p->ID, '_birds_company_bio', true ),
		'company_url' => (string) get_post_meta( $p->ID, '_birds_company_url', true ),
	);
}

/** id => "Name — Company" for selects. */
function birds_contributor_options() {
	$out   = array();
	$posts = get_posts( array( 'post_type' => 'birds_contributor', 'numberposts' => 200, 'orderby' => 'title', 'order' => 'ASC' ) );
	foreach ( $posts as $p ) {
		$company        = get_post_meta( $p->ID, '_birds_company', true );
		$out[ $p->ID ] = $p->post_title . ( $company ? ' — ' . $company : '' );
	}
	return $out;
}
