<?php
/**
 * Fallback template (blog index when the front page is a static page).
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main class="birds-wrap birds-page birds-page--wide">
	<header class="birds-page__head">
		<p class="birds-kicker"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
		<h1><?php echo esc_html( is_home() && get_option( 'page_for_posts' ) ? get_the_title( get_option( 'page_for_posts' ) ) : __( 'Latest insights', 'birds' ) ); ?></h1>
	</header>
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
		<p class="birds-empty"><?php esc_html_e( 'Nothing published yet.', 'birds' ); ?></p>
	<?php endif; ?>
</main>
<?php
get_footer();
