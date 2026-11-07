<?php
/**
 * Birds theme bootstrap.
 *
 * The theme owns layout (header, footer, templates, Customizer). Editorial
 * components — charts, contributors, member gating, cards — come from the
 * Birds Elements plugin; templates degrade gracefully when it is missing.
 */

defined( 'ABSPATH' ) || exit;

define( 'BIRDS_THEME_VERSION', '1.0.0' );

require get_template_directory() . '/inc/setup.php';
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/nav.php';
require get_template_directory() . '/inc/template-tags.php';
