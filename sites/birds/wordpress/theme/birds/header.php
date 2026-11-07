<?php
/**
 * Header: one-row transparent bar — brand, menu, search / saved / account.
 */
defined( 'ABSPATH' ) || exit;
$saved_id = birds_theme_saved_page_id();
$saved    = $saved_id ? get_permalink( $saved_id ) : '';
$user     = wp_get_current_user();
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="<?php echo esc_attr( birds_mod( 'birds_color_navy' ) ); ?>">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text skip-link" href="#content"><?php esc_html_e( 'Skip to content', 'birds' ); ?></a>
<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'header' ) ) : ?>
<header class="birds-header" data-birds-header>
	<div class="birds-header__bar">
		<div class="birds-header__brand"><?php birds_theme_brand(); ?></div>

		<nav class="birds-nav" aria-label="<?php esc_attr_e( 'Primary', 'birds' ); ?>">
			<?php birds_theme_nav(); ?>
		</nav>

		<div class="birds-utility">
			<button type="button" class="birds-utility__btn" data-birds-search-open aria-label="<?php esc_attr_e( 'Search (press /)', 'birds' ); ?>"><?php echo birds_theme_icon( 'search' ); // phpcs:ignore ?></button>
			<?php if ( $saved ) : ?>
				<a class="birds-utility__saved" href="<?php echo esc_url( $saved ); ?>"><?php echo birds_theme_icon( 'bookmark' ); // phpcs:ignore ?><span><?php esc_html_e( 'Saved', 'birds' ); ?></span><b data-birds-saved-count>0</b></a>
			<?php endif; ?>
			<?php if ( is_user_logged_in() ) : ?>
				<div class="birds-account">
					<button type="button" class="birds-account__avatar" aria-expanded="false" aria-label="<?php esc_attr_e( 'Account menu', 'birds' ); ?>"><?php echo esc_html( function_exists( 'birds_initials' ) ? birds_initials( $user->display_name ) : substr( $user->display_name, 0, 1 ) ); ?></button>
					<div class="birds-account__menu" hidden>
						<p class="birds-account__name"><?php echo esc_html( $user->display_name ); ?></p>
						<p class="birds-account__email"><?php echo esc_html( $user->user_email ); ?></p>
						<p class="birds-account__tier"><?php esc_html_e( 'Member · Full access', 'birds' ); ?></p>
						<?php if ( $saved ) : ?>
							<a href="<?php echo esc_url( $saved ); ?>"><?php echo birds_theme_icon( 'bookmark' ); // phpcs:ignore ?> <?php esc_html_e( 'Saved library', 'birds' ); ?></a>
						<?php endif; ?>
						<?php if ( current_user_can( 'edit_posts' ) ) : ?>
							<a href="<?php echo esc_url( admin_url() ); ?>"><?php echo birds_theme_icon( 'file' ); // phpcs:ignore ?> <?php esc_html_e( 'Dashboard', 'birds' ); ?></a>
						<?php endif; ?>
						<a href="<?php echo esc_url( wp_logout_url( home_url( '/' ) ) ); ?>"><?php echo birds_theme_icon( 'logout' ); // phpcs:ignore ?> <?php esc_html_e( 'Sign out', 'birds' ); ?></a>
					</div>
				</div>
			<?php else : ?>
				<button type="button" class="birds-utility__signin" data-birds-auth="join"><?php echo birds_theme_icon( 'user' ); // phpcs:ignore ?><span><?php esc_html_e( 'Sign in', 'birds' ); ?></span></button>
			<?php endif; ?>
			<button type="button" class="birds-utility__btn birds-burger" aria-expanded="false" aria-controls="birds-drawer" aria-label="<?php esc_attr_e( 'Menu', 'birds' ); ?>"><?php echo birds_theme_icon( 'menu' ) . birds_theme_icon( 'close' ); // phpcs:ignore ?></button>
		</div>
	</div>

	<div class="birds-drawer" id="birds-drawer" hidden>
		<nav aria-label="<?php esc_attr_e( 'Mobile', 'birds' ); ?>"><?php birds_theme_nav(); ?></nav>
		<?php if ( $saved ) : ?>
			<a class="birds-drawer__saved" href="<?php echo esc_url( $saved ); ?>"><?php esc_html_e( 'Saved', 'birds' ); ?> <b data-birds-saved-count>0</b></a>
		<?php endif; ?>
		<?php if ( ! is_user_logged_in() ) : ?>
			<button type="button" class="birds-btn birds-btn--primary birds-btn--block" data-birds-auth="join"><?php esc_html_e( 'Sign in · Join free', 'birds' ); ?></button>
		<?php endif; ?>
		<p class="birds-drawer__tag"><?php echo esc_html( birds_mod( 'birds_tagline' ) ); ?></p>
	</div>
</header>

<div class="birds-search" id="birds-search" hidden role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Search', 'birds' ); ?>">
	<div class="birds-search__inner">
		<div class="birds-search__close"><button type="button" data-birds-search-close aria-label="<?php esc_attr_e( 'Close search', 'birds' ); ?>"><?php echo birds_theme_icon( 'close' ); // phpcs:ignore ?></button></div>
		<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="birds-search__form">
			<?php echo birds_theme_icon( 'search' ); // phpcs:ignore ?>
			<input type="search" name="s" autocomplete="off" placeholder="<?php esc_attr_e( 'Search insights, experts, series…', 'birds' ); ?>" aria-label="<?php esc_attr_e( 'Search', 'birds' ); ?>">
		</form>
		<div class="birds-search__browse">
			<p class="birds-label"><?php esc_html_e( 'Browse series', 'birds' ); ?></p>
			<div class="birds-search__chips">
				<?php foreach ( get_categories( array( 'hide_empty' => true, 'orderby' => 'term_id' ) ) as $cat ) : ?>
					<?php if ( 'uncategorized' !== $cat->slug ) : ?>
						<a href="<?php echo esc_url( get_category_link( $cat ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<p class="birds-search__count" hidden></p>
		<ul class="birds-search__results"></ul>
	</div>
</div>
<?php endif; ?>
<div id="content" class="birds-site">
