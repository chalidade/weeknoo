<?php
/**
 * Series (category) and other archives.
 */
defined( 'ABSPATH' ) || exit;
get_header();
$term   = get_queried_object();
$parent = ( $term instanceof WP_Term && $term->parent ) ? get_term( $term->parent ) : null;
?>
<main class="birds-archive">
	<header class="birds-archive__head">
		<div class="birds-wrap birds-archive__inner">
			<div>
				<p class="birds-kicker"><?php echo esc_html( $parent && ! is_wp_error( $parent ) ? $parent->name : ( is_category() ? __( 'Series', 'birds' ) : __( 'Archive', 'birds' ) ) ); ?></p>
				<h1><?php echo esc_html( wp_strip_all_tags( get_the_archive_title() ) ); ?></h1>
				<?php if ( get_the_archive_description() ) : ?>
					<div class="birds-archive__desc"><?php echo wp_kses_post( get_the_archive_description() ); ?></div>
				<?php endif; ?>
				<p class="birds-archive__count">
					<?php
					global $wp_query;
					/* translators: %d: number of articles */
					echo esc_html( sprintf( _n( '%d briefing', '%d briefings', (int) $wp_query->found_posts, 'birds' ), (int) $wp_query->found_posts ) );
					?>
				</p>
			</div>
			<div class="birds-archive__art" aria-hidden="true"></div>
		</div>
	</header>
	<div class="birds-wrap birds-archive__body">
		<?php if ( have_posts() ) : ?>
			<div class="birds-grid birds-grid--3">
				<?php
				while ( have_posts() ) {
					the_post();
					birds_theme_card();
				}
				?>
			</div>
			<?php birds_theme_pagination(); ?>
		<?php else : ?>
			<p class="birds-empty"><?php esc_html_e( 'No briefings in this series yet.', 'birds' ); ?></p>
		<?php endif; ?>
	</div>
	<?php
	if ( function_exists( 'birds_membership_banner_html' ) && birds_mod( 'birds_show_banner' ) ) {
		echo birds_membership_banner_html( array( 'heading' => birds_mod( 'birds_banner_heading' ), 'text' => birds_mod( 'birds_banner_text' ), 'button' => birds_mod( 'birds_banner_button' ) ) ); // phpcs:ignore
	}
	?>
</main>
<?php
get_footer();
