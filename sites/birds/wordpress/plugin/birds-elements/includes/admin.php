<?php
/**
 * Settings → Birds: membership options and the demo-content importer.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', function () {
	add_options_page( __( 'Birds', 'birds-elements' ), __( 'Birds', 'birds-elements' ), 'manage_options', 'birds', 'birds_settings_page' );
} );

add_action( 'admin_init', function () {
	register_setting( 'birds', 'birds_settings', array(
		'type'              => 'array',
		'sanitize_callback' => function ( $in ) {
			$in = (array) $in;
			return array(
				'instant_registration' => empty( $in['instant_registration'] ) ? 0 : 1,
				'preview_sections'     => max( 1, min( 10, absint( $in['preview_sections'] ?? 2 ) ) ),
				'company_name'         => sanitize_text_field( $in['company_name'] ?? '' ),
				'company_url'          => esc_url_raw( $in['company_url'] ?? '' ),
			);
		},
		'default'           => birds_default_settings(),
	) );
} );

add_filter( 'plugin_action_links_' . plugin_basename( BIRDS_ELEMENTS_FILE ), function ( $links ) {
	array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=birds' ) ) . '">' . esc_html__( 'Settings', 'birds-elements' ) . '</a>' );
	return $links;
} );

function birds_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s          = wp_parse_args( (array) get_option( 'birds_settings', array() ), birds_default_settings() );
	$demo_count = count( get_posts( array( 'post_type' => array( 'post', 'birds_contributor' ), 'numberposts' => -1, 'fields' => 'ids', 'meta_key' => '_birds_demo', 'post_status' => 'any' ) ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Birds', 'birds-elements' ); ?></h1>
		<?php if ( isset( $_GET['birds_demo'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification ?>
			<div class="notice notice-success is-dismissible"><p><?php echo esc_html( sanitize_text_field( wp_unslash( $_GET['birds_demo'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification ?></p></div>
		<?php endif; ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'birds' ); ?>
			<h2><?php esc_html_e( 'Membership', 'birds-elements' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Instant registration', 'birds-elements' ); ?></th>
					<td><label><input type="checkbox" name="birds_settings[instant_registration]" value="1" <?php checked( $s['instant_registration'] ); ?>> <?php esc_html_e( 'Readers can join free from the unlock card (creates a Subscriber account and signs them in).', 'birds-elements' ); ?></label></td>
				</tr>
				<tr>
					<th scope="row"><label for="birds-preview"><?php esc_html_e( 'Preview length', 'birds-elements' ); ?></label></th>
					<td><input id="birds-preview" type="number" min="1" max="10" name="birds_settings[preview_sections]" value="<?php echo esc_attr( $s['preview_sections'] ); ?>" class="small-text"> <?php esc_html_e( 'sections shown to signed-out readers of a member article, when no Member Gate is placed.', 'birds-elements' ); ?></td>
				</tr>
			</table>
			<h2><?php esc_html_e( 'Publisher', 'birds-elements' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="birds-company"><?php esc_html_e( 'Company name', 'birds-elements' ); ?></label></th>
					<td><input id="birds-company" class="regular-text" name="birds_settings[company_name]" value="<?php echo esc_attr( $s['company_name'] ); ?>"></td>
				</tr>
				<tr>
					<th scope="row"><label for="birds-company-url"><?php esc_html_e( 'Company website', 'birds-elements' ); ?></label></th>
					<td><input id="birds-company-url" type="url" class="regular-text" name="birds_settings[company_url]" value="<?php echo esc_attr( $s['company_url'] ); ?>"><p class="description"><?php esc_html_e( 'Used by the demo importer for in-house contributors.', 'birds-elements' ); ?></p></td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>

		<hr>
		<h2><?php esc_html_e( 'Demo content', 'birds-elements' ); ?></h2>
		<p><?php esc_html_e( 'Imports the ten sample briefings, seven series categories, eight contributors, editorial artwork and the ambient hero video. Everything imported is tagged so it can be removed again in one click. People, companies and chart figures are fictional placeholders.', 'birds-elements' ); ?></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;margin-right:8px">
			<input type="hidden" name="action" value="birds_demo_import">
			<?php wp_nonce_field( 'birds_demo_import' ); ?>
			<?php submit_button( __( 'Import demo content', 'birds-elements' ), 'primary', 'submit', false ); ?>
		</form>
		<?php if ( $demo_count ) : ?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block" onsubmit="return confirm('<?php echo esc_js( __( 'Delete all imported demo posts, contributors and media?', 'birds-elements' ) ); ?>')">
				<input type="hidden" name="action" value="birds_demo_remove">
				<?php wp_nonce_field( 'birds_demo_remove' ); ?>
				<?php submit_button( sprintf( /* translators: %d items */ __( 'Remove demo content (%d items)', 'birds-elements' ), $demo_count ), 'delete', 'submit', false ); ?>
			</form>
		<?php endif; ?>

		<hr>
		<h2><?php esc_html_e( 'Shortcodes', 'birds-elements' ); ?></h2>
		<p><?php esc_html_e( 'Every Elementor widget also works as a shortcode in the block editor (Shortcode block) or classic editor:', 'birds-elements' ); ?></p>
		<pre style="background:#fff;border:1px solid #dcdcde;padding:12px;max-width:900px;white-space:pre-wrap">[birds_chart type="column|bar|line|pie" title="…" subtitle="…" unit="%" value_label="…" benchmark_label="…" source="…"]
Label | value | benchmark
[/birds_chart]
[birds_quote author="…" title="…"]Quote[/birds_quote]
[birds_takeaways]   (uses the post's key takeaways)
[birds_carousel][birds_slide image="ID or URL" attribution="…"]Caption[/birds_slide][birds_slide quote="…"]Speaker[/birds_slide][/birds_carousel]
[birds_table caption="…"]Header | Header
Cell | Cell[/birds_table]
[birds_member_gate]   (member articles stop here for signed-out readers)
[birds_contributors]  [birds_articles layout="grid|feature|list" category="slug" count="6"]  [birds_marquee]  [birds_membership_banner]  [birds_series_sections]</pre>
	</div>
	<?php
}
