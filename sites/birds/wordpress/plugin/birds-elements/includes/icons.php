<?php
/**
 * Inline SVG icons (Lucide paths, ISC licence) so no icon font is needed.
 */

defined( 'ABSPATH' ) || exit;

function birds_icon( $name, $class = '' ) {
	static $paths = array(
		'lock'            => '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
		'unlock'          => '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
		'bookmark'        => '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
		'bookmark-check'  => '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/>',
		'share'           => '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
		'download'        => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
		'headphones'      => '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
		'stop'            => '<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor"/>',
		'play'            => '<path d="M7 4v16l13-8z" fill="currentColor"/>',
		'pause'           => '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>',
		'volume'          => '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
		'mute'            => '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
		'search'          => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
		'arrow-right'     => '<path d="M5 12h14M12 5l7 7-7 7"/>',
		'arrow-up-right'  => '<path d="M7 17 17 7M7 7h10v10"/>',
		'chevron-down'    => '<path d="m6 9 6 6 6-6"/>',
		'chevron-left'    => '<path d="m15 18-6-6 6-6"/>',
		'chevron-right'   => '<path d="m9 18 6-6-6-6"/>',
		'check'           => '<path d="M20 6 9 17l-5-5"/>',
		'check-circle'    => '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
		'link'            => '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
		'mail'            => '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
		'menu'            => '<path d="M4 6h16M4 12h16M4 18h16"/>',
		'close'           => '<path d="M18 6 6 18M6 6l12 12"/>',
		'user'            => '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
		'logout'          => '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
		'file'            => '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
		'video'           => '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z" fill="currentColor"/>',
		'quote'           => '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z" fill="currentColor"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>',
	);
	static $filled = array(
		'linkedin' => '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
		'x'        => '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z"/>',
	);
	$cls = 'birds-icon' . ( $class ? ' ' . $class : '' );
	if ( isset( $filled[ $name ] ) ) {
		return '<svg class="' . esc_attr( $cls ) . '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' . $filled[ $name ] . '</svg>';
	}
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg class="' . esc_attr( $cls ) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $paths[ $name ] . '</svg>';
}
