<?php
defined( 'ABSPATH' ) || exit;
get_header();
global $wp_query;
?>
<main class="birds-wrap birds-page birds-page--wide">
	<header class="birds-page__head">
		<p class="birds-kicker"><?php esc_html_e( 'Search', 'birds' ); ?></p>
		<h1>
			<?php
			/* translators: 1: count 2: query */
			echo esc_html( sprintf( _n( '%1$d result for “%2$s”', '%1$d results for “%2$s”', (int) $wp_query->found_posts, 'birds' ), (int) $wp_query->found_posts, get_search_query() ) );
			?>
		</h1>
		<?php get_search_form(); ?>
	</header>
	<?php if ( have_posts() ) : ?>
		<div class="birds-list birds-search-list">
			<?php
			while ( have_posts() ) {
				the_post();
				if ( function_exists( 'birds_article_row_html' ) && 'post' === get_post_type() ) {
					echo birds_article_row_html( get_post() ); // phpcs:ignore
				} else {
					echo '<a class="birds-row" href="' . esc_url( get_permalink() ) . '"><span class="birds-row__text"><span class="birds-row__title">' . esc_html( get_the_title() ) . '</span></span></a>';
				}
			}
			?>
		</div>
		<?php birds_theme_pagination(); ?>
	<?php else : ?>
		<p class="birds-empty"><?php esc_html_e( 'No briefings matched. Try a series name, an expert or a company.', 'birds' ); ?></p>
	<?php endif; ?>
</main>
<?php
get_footer();
