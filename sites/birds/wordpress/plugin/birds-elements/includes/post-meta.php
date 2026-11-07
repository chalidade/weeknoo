<?php
/**
 * Article settings stored as post meta, with a meta box that works in both
 * the block editor and the classic editor.
 */

defined( 'ABSPATH' ) || exit;

const BIRDS_ARTICLE_META = array(
	'_birds_access'     => 'string',
	'_birds_series'     => 'string',
	'_birds_hero_type'  => 'string',
	'_birds_hero_video' => 'string',
	'_birds_read_time'  => 'string',
	'_birds_takeaways'  => 'string',
	'_birds_author'     => 'integer',
	'_birds_experts'    => 'string',
);

add_action( 'init', function () {
	foreach ( BIRDS_ARTICLE_META as $key => $type ) {
		register_post_meta(
			'post',
			$key,
			array(
				'type'          => $type,
				'single'        => true,
				'show_in_rest'  => true,
				'auth_callback' => function ( $allowed, $meta_key, $post_id ) {
					return current_user_can( 'edit_post', $post_id );
				},
			)
		);
	}
} );

add_action( 'add_meta_boxes_post', function () {
	add_meta_box( 'birds-article', __( 'Birds — article settings', 'birds-elements' ), 'birds_article_metabox', 'post', 'normal', 'high' );
} );

function birds_article_metabox( $post ) {
	wp_nonce_field( 'birds_article_save', 'birds_article_nonce' );
	$m          = function ( $k ) use ( $post ) {
		return (string) get_post_meta( $post->ID, $k, true );
	};
	$access     = $m( '_birds_access' ) ? $m( '_birds_access' ) : 'free';
	$hero       = $m( '_birds_hero_type' ) ? $m( '_birds_hero_type' ) : 'image';
	$experts    = array_filter( array_map( 'absint', explode( ',', $m( '_birds_experts' ) ) ) );
	$people     = birds_contributor_options();
	$people_url = admin_url( 'post-new.php?post_type=birds_contributor' );
	?>
	<style>
		.birds-mb{display:grid;gap:18px;grid-template-columns:1fr 1fr}.birds-mb .full{grid-column:1/-1}
		.birds-mb label.h{display:block;font-weight:600;margin-bottom:6px}.birds-mb .row{display:flex;gap:16px;flex-wrap:wrap}
		.birds-mb .experts{max-height:180px;overflow:auto;border:1px solid #dcdcde;padding:8px 10px;background:#fff}
		.birds-mb .experts label{display:block;margin:3px 0}@media(max-width:782px){.birds-mb{grid-template-columns:1fr}}
	</style>
	<div class="birds-mb">
		<div>
			<label class="h"><?php esc_html_e( 'Access tier', 'birds-elements' ); ?></label>
			<div class="row">
				<label><input type="radio" name="_birds_access" value="free" <?php checked( $access, 'free' ); ?>> <?php esc_html_e( 'Free Access — anyone can read', 'birds-elements' ); ?></label>
				<label><input type="radio" name="_birds_access" value="member" <?php checked( $access, 'member' ); ?>> <?php esc_html_e( 'Member Briefing — free login required', 'birds-elements' ); ?></label>
			</div>
			<p class="description"><?php esc_html_e( 'Member articles show a preview, then an unlock card. Place a Member Gate (widget, or [birds_member_gate]) to choose where the preview ends.', 'birds-elements' ); ?></p>
		</div>
		<div>
			<label class="h" for="_birds_series"><?php esc_html_e( 'Kicker / series label', 'birds-elements' ); ?></label>
			<input class="widefat" id="_birds_series" name="_birds_series" value="<?php echo esc_attr( $m( '_birds_series' ) ); ?>" placeholder="GCC &amp; SEA Report">
			<p class="description"><?php esc_html_e( 'Shown after the category, e.g. WORKFORCE INTELLIGENCE · GCC & SEA REPORT.', 'birds-elements' ); ?></p>
		</div>
		<div>
			<label class="h"><?php esc_html_e( 'Hero presentation', 'birds-elements' ); ?></label>
			<div class="row">
				<label><input type="radio" name="_birds_hero_type" value="image" <?php checked( $hero, 'image' ); ?>> <?php esc_html_e( 'Static featured image', 'birds-elements' ); ?></label>
				<label><input type="radio" name="_birds_hero_type" value="video" <?php checked( $hero, 'video' ); ?>> <?php esc_html_e( 'Looping muted video', 'birds-elements' ); ?></label>
			</div>
			<input class="widefat" style="margin-top:8px" type="url" name="_birds_hero_video" value="<?php echo esc_attr( $m( '_birds_hero_video' ) ); ?>" placeholder="<?php esc_attr_e( 'Video URL (.mp4) — copy it from the Media Library', 'birds-elements' ); ?>">
		</div>
		<div>
			<label class="h" for="_birds_read_time"><?php esc_html_e( 'Read time', 'birds-elements' ); ?></label>
			<input class="widefat" id="_birds_read_time" name="_birds_read_time" value="<?php echo esc_attr( $m( '_birds_read_time' ) ); ?>" placeholder="<?php echo esc_attr( birds_read_time( $post ) ); ?>">
			<p class="description"><?php esc_html_e( 'Leave empty to calculate it from the word count.', 'birds-elements' ); ?></p>
		</div>
		<div class="full">
			<label class="h" for="_birds_takeaways"><?php esc_html_e( 'Executive key takeaways (one per line)', 'birds-elements' ); ?></label>
			<textarea class="widefat" rows="4" id="_birds_takeaways" name="_birds_takeaways"><?php echo esc_textarea( $m( '_birds_takeaways' ) ); ?></textarea>
		</div>
		<div>
			<label class="h" for="_birds_author"><?php esc_html_e( 'Written by', 'birds-elements' ); ?></label>
			<select class="widefat" id="_birds_author" name="_birds_author">
				<option value="0"><?php esc_html_e( '— WordPress author —', 'birds-elements' ); ?></option>
				<?php foreach ( $people as $id => $label ) : ?>
					<option value="<?php echo esc_attr( $id ); ?>" <?php selected( (int) $m( '_birds_author' ), $id ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div>
			<label class="h"><?php esc_html_e( 'Featured experts interviewed', 'birds-elements' ); ?></label>
			<div class="experts">
				<?php if ( ! $people ) : ?>
					<em><?php esc_html_e( 'No contributors yet.', 'birds-elements' ); ?></em>
				<?php endif; ?>
				<?php foreach ( $people as $id => $label ) : ?>
					<label><input type="checkbox" name="_birds_experts[]" value="<?php echo esc_attr( $id ); ?>" <?php checked( in_array( $id, $experts, true ) ); ?>> <?php echo esc_html( $label ); ?></label>
				<?php endforeach; ?>
			</div>
			<p class="description"><a href="<?php echo esc_url( $people_url ); ?>" target="_blank"><?php esc_html_e( 'Add a contributor', 'birds-elements' ); ?></a></p>
		</div>
	</div>
	<?php
}

add_action( 'save_post_post', function ( $post_id ) {
	if ( ! isset( $_POST['birds_article_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['birds_article_nonce'] ) ), 'birds_article_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$text = function ( $k ) {
		return isset( $_POST[ $k ] ) ? sanitize_text_field( wp_unslash( $_POST[ $k ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	};
	update_post_meta( $post_id, '_birds_access', 'member' === $text( '_birds_access' ) ? 'member' : 'free' );
	update_post_meta( $post_id, '_birds_hero_type', 'video' === $text( '_birds_hero_type' ) ? 'video' : 'image' );
	update_post_meta( $post_id, '_birds_series', $text( '_birds_series' ) );
	update_post_meta( $post_id, '_birds_read_time', $text( '_birds_read_time' ) );
	update_post_meta( $post_id, '_birds_hero_video', isset( $_POST['_birds_hero_video'] ) ? esc_url_raw( wp_unslash( $_POST['_birds_hero_video'] ) ) : '' );
	update_post_meta( $post_id, '_birds_takeaways', isset( $_POST['_birds_takeaways'] ) ? sanitize_textarea_field( wp_unslash( $_POST['_birds_takeaways'] ) ) : '' );
	update_post_meta( $post_id, '_birds_author', absint( $text( '_birds_author' ) ) );
	$experts = isset( $_POST['_birds_experts'] ) ? array_map( 'absint', (array) wp_unslash( $_POST['_birds_experts'] ) ) : array();
	update_post_meta( $post_id, '_birds_experts', implode( ',', array_filter( $experts ) ) );
} );

/* Access column in the posts list. */
add_filter( 'manage_post_posts_columns', function ( $cols ) {
	$cols['birds_access'] = __( 'Access', 'birds-elements' );
	return $cols;
} );
add_action( 'manage_post_posts_custom_column', function ( $col, $id ) {
	if ( 'birds_access' === $col ) {
		echo birds_is_member_post( $id ) ? '<strong>' . esc_html__( 'Member', 'birds-elements' ) . '</strong>' : esc_html__( 'Free', 'birds-elements' );
	}
}, 10, 2 );
