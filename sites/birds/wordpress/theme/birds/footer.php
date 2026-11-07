<?php
defined( 'ABSPATH' ) || exit;
?>
</div><!-- #content -->
<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) : ?>
<footer class="birds-footer">
	<div class="birds-wrap">
		<div class="birds-footer__grid">
			<div>
				<?php birds_theme_brand(); ?>
				<?php if ( birds_mod( 'birds_footer_blurb' ) ) : ?>
					<p class="birds-footer__blurb"><?php echo esc_html( birds_mod( 'birds_footer_blurb' ) ); ?></p>
				<?php endif; ?>
			</div>
			<div class="birds-footer__cols">
				<?php
				$top = get_categories( array( 'parent' => 0, 'hide_empty' => false, 'orderby' => 'term_id', 'exclude' => array( (int) get_option( 'default_category' ) ) ) );
				foreach ( $top as $cat ) :
					$kids = get_categories( array( 'parent' => $cat->term_id, 'hide_empty' => false, 'orderby' => 'term_id' ) );
					$list = $kids ? $kids : array( $cat );
					?>
					<div>
						<p class="birds-footer__head"><?php echo esc_html( $cat->name ); ?></p>
						<ul>
							<?php foreach ( $list as $item ) : ?>
								<li><a href="<?php echo esc_url( get_category_link( $item ) ); ?>"><?php echo esc_html( $item->name ); ?></a></li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endforeach; ?>
				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<div>
						<p class="birds-footer__head"><?php esc_html_e( 'About', 'birds' ); ?></p>
						<?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'depth' => 1 ) ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php if ( is_active_sidebar( 'footer' ) ) : ?>
			<div class="birds-footer__widgets"><?php dynamic_sidebar( 'footer' ); ?></div>
		<?php endif; ?>
		<div class="birds-footer__base">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) . ' ' . birds_mod( 'birds_footer_owner' ) ); ?>. <?php esc_html_e( 'All rights reserved.', 'birds' ); ?></p>
			<p><?php echo esc_html( birds_mod( 'birds_footer_note' ) ); ?></p>
		</div>
	</div>
</footer>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
