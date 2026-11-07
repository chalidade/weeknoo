<?php defined( 'ABSPATH' ) || exit; ?>
<form role="search" method="get" class="birds-searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="birds-s"><?php esc_html_e( 'Search for:', 'birds' ); ?></label>
	<input type="search" id="birds-s" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search insights…', 'birds' ); ?>">
	<button type="submit" class="birds-btn birds-btn--primary"><?php esc_html_e( 'Search', 'birds' ); ?></button>
</form>
