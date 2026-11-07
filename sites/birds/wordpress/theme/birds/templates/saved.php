<?php
/**
 * Template Name: Saved library
 *
 * Bookmarks live in the reader's browser; the cards are fetched from the
 * REST API (birds.card field from the Birds Elements plugin).
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main class="birds-wrap birds-page birds-page--wide birds-saved" data-birds-saved-page>
	<header class="birds-page__head">
		<p class="birds-kicker"><?php esc_html_e( 'Your library', 'birds' ); ?></p>
		<h1><?php the_title(); ?></h1>
		<p class="birds-saved__count"><span data-birds-saved-count>0</span> <?php esc_html_e( 'saved · stored in this browser', 'birds' ); ?></p>
	</header>
	<div class="birds-grid birds-grid--3" data-birds-saved-list></div>
	<div class="birds-saved__empty" data-birds-saved-empty hidden>
		<?php echo birds_theme_icon( 'bookmark' ); // phpcs:ignore ?>
		<p><strong><?php esc_html_e( 'Nothing saved yet', 'birds' ); ?></strong></p>
		<p><?php esc_html_e( 'Use the bookmark icon on any briefing to keep it here.', 'birds' ); ?></p>
		<a class="birds-more" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Browse latest insights', 'birds' ); ?> <?php echo birds_theme_icon( 'arrow-right' ); // phpcs:ignore ?></a>
	</div>
</main>
<?php
get_footer();
