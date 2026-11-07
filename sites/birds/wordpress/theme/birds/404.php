<?php
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main class="birds-wrap birds-page birds-404">
	<p class="birds-kicker">404</p>
	<h1><?php esc_html_e( 'This briefing could not be found', 'birds' ); ?></h1>
	<p><?php esc_html_e( 'It may have moved. Try searching, or return to the latest insights.', 'birds' ); ?></p>
	<?php get_search_form(); ?>
	<p><a class="birds-more" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'birds' ); ?> <?php echo birds_theme_icon( 'arrow-right' ); // phpcs:ignore ?></a></p>
</main>
<?php
get_footer();
