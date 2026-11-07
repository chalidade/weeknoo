<?php
/**
 * Single article — zero-sidebar reading canvas.
 * Hero (image or video) → header + actions → contributors → takeaways → body.
 */
defined( 'ABSPATH' ) || exit;

get_header();
$plugin = function_exists( 'birds_article' );

while ( have_posts() ) :
	the_post();
	$id      = get_the_ID();
	$a       = $plugin ? birds_article( $id ) : array();
	$has_hero = birds_theme_overlay();
	?>
	<div class="birds-progress" aria-hidden="true"><span></span></div>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'birds-single' ); ?>>
		<?php if ( $plugin ) : ?>
			<?php if ( $has_hero ) : ?>
				<div class="birds-article-hero"><?php echo birds_hero_media_html( $id ); // phpcs:ignore ?></div>
			<?php else : ?>
				<div class="birds-header-spacer"></div>
			<?php endif; ?>
			<div class="birds-print-only"><?php echo birds_print_masthead_html( $id ); // phpcs:ignore ?></div>
			<?php echo birds_article_header_html( $id ); // phpcs:ignore ?>
			<div class="birds-measure">
				<?php
				if ( ! birds_theme_has_widget( $id, 'birds-contributors' ) && false === strpos( get_post_field( 'post_content', $id ), '[birds_contributors' ) ) {
					echo birds_contributors_html( $a['author'], $a['experts'] ); // phpcs:ignore
				}
				?>
			</div>
		<?php else : ?>
			<div class="birds-header-spacer"></div>
			<header class="birds-article-head"><h1 class="birds-article-head__title"><?php the_title(); ?></h1></header>
		<?php endif; ?>

		<div class="birds-measure birds-article-body entry-content">
			<?php
			if ( $plugin && ! birds_theme_has_widget( $id, 'birds-key-takeaways' ) && false === strpos( get_post_field( 'post_content', $id ), '[birds_takeaways' ) ) {
				echo birds_takeaways_html( $a['takeaways'] ); // phpcs:ignore
			}
			the_content();
			wp_link_pages( array( 'before' => '<nav class="birds-page-links">', 'after' => '</nav>' ) );
			if ( ! $plugin || birds_can_read( $id ) ) {
				echo '<p class="birds-endmark"><span>' . esc_html__( 'End of briefing', 'birds' ) . '</span></p>';
			}
			?>
		</div>
		<?php if ( $plugin ) : ?>
			<p class="birds-print-only birds-print-foot"><?php echo esc_html( get_bloginfo( 'name' ) . ' · ' . get_permalink() ); ?></p>
		<?php endif; ?>
	</article>

	<?php
	if ( birds_mod( 'birds_show_related' ) && $plugin ) :
		$cat     = $a['category'];
		$related = get_posts( array( 'numberposts' => 3, 'post__not_in' => array( $id ), 'category__in' => $cat ? array( $cat->term_id ) : array(), 'ignore_sticky_posts' => true ) );
		if ( count( $related ) < 3 ) {
			$related = array_merge( $related, get_posts( array( 'numberposts' => 3 - count( $related ), 'post__not_in' => array_merge( array( $id ), wp_list_pluck( $related, 'ID' ) ), 'ignore_sticky_posts' => true ) ) );
		}
		if ( $related ) :
			?>
			<section class="birds-related" aria-label="<?php esc_attr_e( 'Continue reading', 'birds' ); ?>">
				<div class="birds-wrap">
					<h2 class="birds-related__title"><?php esc_html_e( 'Continue reading', 'birds' ); ?></h2>
					<div class="birds-grid birds-grid--3">
						<?php
						foreach ( $related as $r ) {
							echo birds_article_card_html( $r ); // phpcs:ignore
						}
						?>
					</div>
				</div>
			</section>
			<?php
		endif;
	endif;
endwhile;

get_footer();
