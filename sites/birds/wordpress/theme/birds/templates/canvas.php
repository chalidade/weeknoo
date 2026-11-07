<?php
/**
 * Template Name: Birds canvas (full width, for Elementor)
 * Template Post Type: page, post
 *
 * Header and footer stay; everything between is the page builder's.
 */
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) {
	the_post();
	echo '<main class="birds-canvas">';
	the_content();
	echo '</main>';
}
get_footer();
