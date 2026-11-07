<?php
/**
 * Front page. With "Your latest posts" this is the magazine home (sections
 * set in Customize → Birds → Home page). With a static page it shows that
 * page — build it with Elementor and the Birds widgets.
 */
defined( 'ABSPATH' ) || exit;

if ( 'page' === get_option( 'show_on_front' ) ) {
	require get_template_directory() . '/page.php';
	return;
}

get_header();

if ( ! function_exists( 'birds_articles_html' ) ) {
	echo '<main class="birds-wrap birds-page"><h1>' . esc_html( get_bloginfo( 'name' ) ) . '</h1><div class="birds-grid birds-grid--3">';
	while ( have_posts() ) {
		the_post();
		birds_theme_card();
	}
	echo '</div></main>';
	get_footer();
	return;
}

$lead = birds_theme_featured_id();
?>
<main class="birds-home">
	<?php
	if ( $lead && birds_mod( 'birds_show_marquee' ) ) {
		echo birds_marquee_html( $lead, array( 'eyebrow' => birds_mod( 'birds_marquee_eyebrow' ), 'button' => birds_mod( 'birds_marquee_button' ) ) ); // phpcs:ignore
	}
	?>
	<div class="birds-wrap birds-home__latest">
		<?php
		echo birds_latest_section_html( array( // phpcs:ignore
			'heading' => birds_mod( 'birds_latest_heading' ),
			'intro'   => birds_mod( 'birds_latest_intro' ),
			'filters' => (bool) birds_mod( 'birds_latest_filters' ),
			'layout'  => 'feature',
			'count'   => max( 3, (int) birds_mod( 'birds_latest_count' ) ),
			'exclude' => $lead && birds_mod( 'birds_show_marquee' ) ? array( $lead ) : array(),
		) );
		?>
	</div>
	<?php
	if ( birds_mod( 'birds_show_banner' ) ) {
		echo birds_membership_banner_html( array( // phpcs:ignore
			'heading' => birds_mod( 'birds_banner_heading' ),
			'text'    => birds_mod( 'birds_banner_text' ),
			'button'  => birds_mod( 'birds_banner_button' ),
		) );
	}
	if ( birds_mod( 'birds_show_series' ) ) {
		echo '<div class="birds-home__series">' . birds_series_sections_html( array( 'count' => max( 1, (int) birds_mod( 'birds_series_count' ) ) ) ) . '</div>'; // phpcs:ignore
	}
	?>
</main>
<?php
get_footer();
