<?php
/**
 * Primary navigation: a WordPress menu when one is assigned, otherwise built
 * from the category tree (top-level categories; children become dropdowns).
 */

defined( 'ABSPATH' ) || exit;

/** Dropdown-capable walker: items with children get a toggle + panel. */
class Birds_Nav_Walker extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '<div class="birds-nav__panel"><ul class="birds-nav__sub">';
	}
	public function end_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '</ul></div>';
	}
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$has_kids = in_array( 'menu-item-has-children', (array) $item->classes, true );
		$active   = array_intersect( array( 'current-menu-item', 'current-menu-ancestor', 'current-menu-parent', 'current-category-ancestor' ), (array) $item->classes ) ? ' is-active' : '';
		$output  .= '<li class="birds-nav__item' . ( $has_kids ? ' has-dropdown' : '' ) . $active . '">';
		if ( 0 === $depth && $has_kids ) {
			$output .= '<button type="button" class="birds-nav__link" aria-expanded="false">' . esc_html( $item->title ) . ( function_exists( 'birds_icon' ) ? birds_icon( 'chevron-down' ) : '' ) . '</button>';
			return;
		}
		$desc    = $depth && $item->description ? '<small>' . esc_html( $item->description ) . '</small>' : '';
		$output .= '<a class="' . ( $depth ? 'birds-nav__sublink' : 'birds-nav__link' ) . '" href="' . esc_url( $item->url ) . '"' . ( $item->target ? ' target="' . esc_attr( $item->target ) . '"' : '' ) . '><span>' . esc_html( $item->title ) . '</span>' . $desc . '</a>';
	}
	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		$output .= '</li>';
	}
}

function birds_theme_nav() {
	if ( has_nav_menu( 'primary' ) ) {
		wp_nav_menu( array(
			'theme_location' => 'primary',
			'container'      => false,
			'menu_class'     => 'birds-nav__list',
			'depth'          => 2,
			'walker'         => new Birds_Nav_Walker(),
		) );
		return;
	}
	// Fallback: Home + category tree.
	$current = is_category() ? get_queried_object_id() : 0;
	$chev    = function_exists( 'birds_icon' ) ? birds_icon( 'chevron-down' ) : '';
	echo '<ul class="birds-nav__list">';
	echo '<li class="birds-nav__item' . ( is_front_page() ? ' is-active' : '' ) . '"><a class="birds-nav__link" href="' . esc_url( home_url( '/' ) ) . '"><span>' . esc_html__( 'Home', 'birds' ) . '</span></a></li>';
	foreach ( get_categories( array( 'parent' => 0, 'hide_empty' => false, 'orderby' => 'term_id', 'exclude' => array( (int) get_option( 'default_category' ) ) ) ) as $cat ) {
		$kids = get_categories( array( 'parent' => $cat->term_id, 'hide_empty' => false, 'orderby' => 'term_id' ) );
		if ( ! $kids ) {
			echo '<li class="birds-nav__item' . ( $current === $cat->term_id ? ' is-active' : '' ) . '"><a class="birds-nav__link" href="' . esc_url( get_category_link( $cat ) ) . '"><span>' . esc_html( $cat->name ) . '</span></a></li>';
			continue;
		}
		$active = in_array( $current, array_merge( array( $cat->term_id ), wp_list_pluck( $kids, 'term_id' ) ), true ) ? ' is-active' : '';
		echo '<li class="birds-nav__item has-dropdown' . esc_attr( $active ) . '"><button type="button" class="birds-nav__link" aria-expanded="false">' . esc_html( $cat->name ) . $chev . '</button>'; // phpcs:ignore
		echo '<div class="birds-nav__panel"><ul class="birds-nav__sub">';
		foreach ( $kids as $k ) {
			echo '<li><a class="birds-nav__sublink" href="' . esc_url( get_category_link( $k ) ) . '"><span>' . esc_html( $k->name ) . '</span>' . ( $k->description ? '<small>' . esc_html( $k->description ) . '</small>' : '' ) . '</a></li>';
		}
		echo '</ul></div></li>';
	}
	echo '</ul>';
}
