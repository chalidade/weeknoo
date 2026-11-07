<?php
/**
 * Pages. Pages built with Elementor get the full width; others the reading measure.
 */
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) :
	the_post();
	$elementor = function_exists( 'birds_is_elementor_post' ) && birds_is_elementor_post( get_the_ID() );
	if ( $elementor ) :
		?>
		<main class="birds-canvas"><?php the_content(); ?></main>
	<?php else : ?>
		<main class="birds-wrap birds-page">
			<header class="birds-page__head birds-measure"><h1><?php the_title(); ?></h1></header>
			<div class="birds-measure birds-article-body entry-content"><?php the_content(); ?></div>
		</main>
		<?php
	endif;
endwhile;
get_footer();
