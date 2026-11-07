<?php
/**
 * Two-tier access. Members are ordinary WordPress users (Subscriber role);
 * joining is free and instant. Member articles are cut server-side for
 * signed-out readers — the hidden part never reaches the browser, the feed or
 * the REST API.
 */

defined( 'ABSPATH' ) || exit;

/* ------------------------------------------------------- content gating */

/** Is this post rendered with Elementor? Elementor gating is separate. */
function birds_is_elementor_post( $post_id ) {
	if ( ! did_action( 'elementor/loaded' ) || ! class_exists( '\Elementor\Plugin' ) ) {
		return false;
	}
	$doc = \Elementor\Plugin::$instance->documents->get( $post_id );
	return $doc && $doc->is_built_with_elementor();
}

/**
 * Cuts raw post content at the member gate. Returns [visible, hidden_sections].
 */
function birds_split_member_content( $content ) {
	$marker = strpos( $content, '[birds_member_gate' );
	if ( false !== $marker ) {
		$cut = $marker;
		// Step back over the opening comment of a Shortcode block, if any.
		$comment = strrpos( substr( $content, 0, $marker ), '<!-- wp:shortcode' );
		if ( false !== $comment && $marker - $comment < 40 ) {
			$cut = $comment;
		}
		$rest = substr( $content, $cut );
		return array( substr( $content, 0, $cut ), preg_match_all( '/<h2[\s>]/i', $rest ) );
	}

	// No marker: show the configured number of sections. A section starts at
	// an <h2>; text before the first heading counts as the opening section.
	preg_match_all( '/<h2[\s>]/i', $content, $m, PREG_OFFSET_CAPTURE );
	$heads   = $m[0];
	$keep    = max( 1, (int) birds_setting( 'preview_sections' ) );
	$intro   = $heads && '' !== trim( wp_strip_all_tags( substr( $content, 0, $heads[0][1] ) ) );
	$cut_idx = $intro ? $keep - 1 : $keep;
	if ( isset( $heads[ $cut_idx ] ) ) {
		$cut     = $heads[ $cut_idx ][1];
		$comment = strrpos( substr( $content, 0, $cut ), '<!-- wp:heading' );
		if ( false !== $comment && $cut - $comment < 120 ) {
			$cut = $comment;
		}
		return array( substr( $content, 0, $cut ), count( $heads ) - $cut_idx );
	}

	// Too few headings: keep roughly the first third of the paragraphs.
	$parts = preg_split( '#(</p>)#i', $content, -1, PREG_SPLIT_DELIM_CAPTURE );
	$paras = (int) floor( count( $parts ) / 2 );
	if ( $paras < 3 ) {
		return array( $content, 0 );
	}
	$keep_p = max( 1, (int) ceil( $paras / 3 ) );
	return array( implode( '', array_slice( $parts, 0, $keep_p * 2 ) ), 0 );
}

add_filter( 'the_content', function ( $content ) {
	$post = get_post();
	if ( ! $post || 'post' !== $post->post_type || birds_can_read( $post ) || birds_is_elementor_post( $post->ID ) ) {
		return $content;
	}
	list( $visible, $hidden ) = birds_split_member_content( $content );
	$GLOBALS['birds_gate_pending'] = array( 'post' => $post->ID, 'hidden' => $hidden );
	return $visible;
}, 1 );

add_filter( 'the_content', function ( $content ) {
	$pending = $GLOBALS['birds_gate_pending'] ?? null;
	$post    = get_post();
	if ( $pending && $post && $pending['post'] === $post->ID ) {
		unset( $GLOBALS['birds_gate_pending'] );
		$content .= birds_gate_html( (int) $pending['hidden'] );
	}
	return $content;
}, 99 );

/* Elementor: stop rendering after the Member Gate widget (or after the
 * configured number of top-level sections when no gate widget is placed). */

add_action( 'elementor/frontend/before_get_builder_content', function ( $document ) {
	$id = $document && method_exists( $document, 'get_main_id' ) ? $document->get_main_id() : 0;
	// Elementor's element cache stores one rendering for every visitor. On a
	// member article every element is marked dynamic (below), so the cache
	// keeps only placeholders and each visitor gets their own rendering.
	$GLOBALS['birds_el_member_doc'] = $id && birds_is_member_post( $id );
	if ( ! $id || 'post' !== get_post_type( $id ) || birds_can_read( $id ) ) {
		$GLOBALS['birds_el_gate'] = null;
		return;
	}
	// With a Member Gate widget placed, it alone decides where the preview
	// ends; the "first N sections" fallback is only for layouts without one.
	$data      = method_exists( $document, 'get_elements_data' ) ? $document->get_elements_data() : array();
	$ancestors = birds_el_gate_ancestors( (array) $data );
	$GLOBALS['birds_el_gate'] = array(
		'doc'       => $id,
		'has_gate'  => null !== $ancestors,
		'ancestors' => (array) $ancestors,
		'hit'       => false,
		'fallback'  => false,
		'top'       => 0,
		'hidden'    => 0,
	);
} );

/**
 * IDs of the containers that hold the first Member Gate widget, or null when
 * the layout has none. Elementor decides should_render after rendering an
 * element's children, so the gate's own ancestors are evaluated after the
 * gate itself and must be let through explicitly.
 */
function birds_el_gate_ancestors( array $elements, array $path = array() ) {
	foreach ( $elements as $el ) {
		if ( 'birds-member-gate' === ( $el['widgetType'] ?? '' ) ) {
			return $path;
		}
		if ( ! empty( $el['elements'] ) ) {
			$found = birds_el_gate_ancestors( $el['elements'], array_merge( $path, array( $el['id'] ?? '' ) ) );
			if ( null !== $found ) {
				return $found;
			}
		}
	}
	return null;
}

add_filter( 'elementor/element/is_dynamic_content', function ( $is_dynamic ) {
	return ! empty( $GLOBALS['birds_el_member_doc'] ) ? true : $is_dynamic;
} );

function birds_elementor_should_render( $should, $element ) {
	$state = &$GLOBALS['birds_el_gate'];
	if ( empty( $state ) || ! $should ) {
		return $should;
	}
	$is_top = in_array( $element->get_type(), array( 'section', 'container' ), true ) && ! $element->get_data( 'isInner' );
	if ( 'birds-member-gate' === $element->get_name() && ! $state['hit'] ) {
		$state['hit'] = true;
		return true;
	}
	if ( $state['hit'] ) {
		if ( in_array( $element->get_id(), $state['ancestors'], true ) ) {
			return true; // The containers wrapping the gate card.
		}
		if ( $is_top ) {
			$state['hidden']++;
		}
		return false;
	}
	if ( $is_top && ! $state['has_gate'] ) {
		$state['top']++;
		if ( $state['top'] > max( 1, (int) birds_setting( 'preview_sections' ) ) ) {
			$state['hit']      = true;
			$state['fallback'] = true;
			$state['hidden']++;
			return false;
		}
	}
	return $should;
}
foreach ( array( 'widget', 'section', 'column', 'container' ) as $birds_el_type ) {
	add_filter( "elementor/frontend/{$birds_el_type}/should_render", 'birds_elementor_should_render', 10, 2 );
}

add_filter( 'elementor/frontend/the_content', function ( $html ) {
	$state = $GLOBALS['birds_el_gate'] ?? null;
	if ( $state && $state['fallback'] ) {
		$html .= birds_gate_html( (int) $state['hidden'] );
	}
	$GLOBALS['birds_el_gate'] = null;
	return $html;
} );

/* ---------------------------------------------------------- join / sign in */

function birds_auth_rate_limited() {
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'birds_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );
	return $n >= 10;
}

function birds_auth_guard() {
	if ( ! check_ajax_referer( 'birds_auth', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => __( 'Your session expired. Please reload the page and try again.', 'birds-elements' ) ), 403 );
	}
	if ( ! empty( $_POST['website'] ) ) { // Honeypot.
		wp_send_json_error( array( 'message' => __( 'Something went wrong.', 'birds-elements' ) ), 400 );
	}
	if ( birds_auth_rate_limited() ) {
		wp_send_json_error( array( 'message' => __( 'Too many attempts. Please try again in an hour.', 'birds-elements' ) ), 429 );
	}
}

function birds_ajax_join() {
	birds_auth_guard();
	if ( ! birds_setting( 'instant_registration' ) ) {
		wp_send_json_error( array( 'message' => __( 'Registration is currently closed.', 'birds-elements' ) ), 403 );
	}
	$name  = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	if ( strlen( $name ) < 2 ) {
		wp_send_json_error( array( 'message' => __( 'Please enter your full name.', 'birds-elements' ) ), 400 );
	}
	if ( ! is_email( $email ) ) {
		wp_send_json_error( array( 'message' => __( 'Please enter a valid work email.', 'birds-elements' ) ), 400 );
	}
	if ( email_exists( $email ) ) {
		wp_send_json_error( array( 'message' => __( 'You already have a membership with this email. Please sign in.', 'birds-elements' ), 'mode' => 'signin' ), 409 );
	}
	$login = sanitize_user( current( explode( '@', $email ) ), true );
	$login = $login ? $login : 'member';
	$base  = $login;
	for ( $i = 2; username_exists( $login ); $i++ ) {
		$login = $base . $i;
	}
	$parts   = preg_split( '/\s+/', $name, 2 );
	$user_id = wp_insert_user( array(
		'user_login'   => $login,
		'user_email'   => $email,
		'user_pass'    => wp_generate_password( 24 ),
		'display_name' => $name,
		'first_name'   => $parts[0],
		'last_name'    => $parts[1] ?? '',
		'role'         => 'subscriber',
	) );
	if ( is_wp_error( $user_id ) ) {
		wp_send_json_error( array( 'message' => $user_id->get_error_message() ), 400 );
	}
	update_user_meta( $user_id, 'birds_member_since', time() );
	// Email them a link to set a password so they can sign in on other devices.
	wp_new_user_notification( $user_id, null, 'user' );
	wp_set_current_user( $user_id );
	wp_set_auth_cookie( $user_id, true, is_ssl() );
	do_action( 'birds_member_joined', $user_id );
	wp_send_json_success( array( 'message' => __( 'Membership activated — full access unlocked.', 'birds-elements' ) ) );
}
add_action( 'wp_ajax_nopriv_birds_join', 'birds_ajax_join' );

function birds_ajax_signin() {
	birds_auth_guard();
	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$pass  = isset( $_POST['password'] ) ? (string) wp_unslash( $_POST['password'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	$user  = get_user_by( 'email', $email );
	$res   = $user ? wp_signon( array( 'user_login' => $user->user_login, 'user_password' => $pass, 'remember' => true ), is_ssl() ) : new WP_Error( 'nope' );
	if ( is_wp_error( $res ) ) {
		wp_send_json_error( array( 'message' => __( 'That email and password do not match.', 'birds-elements' ) ), 401 );
	}
	/* translators: %s first name */
	wp_send_json_success( array( 'message' => sprintf( __( 'Welcome back, %s', 'birds-elements' ), $res->first_name ? $res->first_name : $res->display_name ) ) );
}
add_action( 'wp_ajax_nopriv_birds_signin', 'birds_ajax_signin' );

/* Members never need the toolbar or the dashboard. */
add_filter( 'show_admin_bar', function ( $show ) {
	return current_user_can( 'edit_posts' ) ? $show : false;
} );
add_filter( 'login_redirect', function ( $to, $requested, $user ) {
	return ( $user instanceof WP_User && ! $user->has_cap( 'edit_posts' ) && ( ! $requested || false !== strpos( $requested, 'wp-admin' ) ) ) ? home_url( '/' ) : $to;
}, 10, 3 );

/* ------------------------------------------------- dialogs (any theme) */

add_action( 'wp_footer', function () {
	$lost = wp_lostpassword_url( home_url( '/' ) );
	?>
	<div class="birds-dialog" id="birds-auth" role="dialog" aria-modal="true" aria-labelledby="birds-auth-title" hidden>
		<div class="birds-dialog__panel">
			<button type="button" class="birds-dialog__close" data-birds-close aria-label="<?php esc_attr_e( 'Close', 'birds-elements' ); ?>"><?php echo birds_icon( 'close' ); // phpcs:ignore ?></button>
			<div class="birds-dialog__body birds-dialog__body--accent">
				<p class="birds-kicker"><?php esc_html_e( 'Birds Membership', 'birds-elements' ); ?></p>
				<h2 id="birds-auth-title" data-join="<?php esc_attr_e( 'Unlock full member access', 'birds-elements' ); ?>" data-signin="<?php esc_attr_e( 'Welcome back', 'birds-elements' ); ?>"><?php esc_html_e( 'Unlock full member access', 'birds-elements' ); ?></h2>
				<p class="birds-dialog__lead" data-default="<?php esc_attr_e( 'Membership is 100% free. No payment, no card — instant access to every briefing.', 'birds-elements' ); ?>"><?php esc_html_e( 'Membership is 100% free. No payment, no card — instant access to every briefing.', 'birds-elements' ); ?></p>
				<ul class="birds-dialog__perks" data-only="join">
					<li><?php echo birds_icon( 'check' ); // phpcs:ignore ?> <?php esc_html_e( 'Unabridged member briefings', 'birds-elements' ); ?></li>
					<li><?php echo birds_icon( 'check' ); // phpcs:ignore ?> <?php esc_html_e( 'Executive PDF dossiers', 'birds-elements' ); ?></li>
					<li><?php echo birds_icon( 'check' ); // phpcs:ignore ?> <?php esc_html_e( 'Your saved library', 'birds-elements' ); ?></li>
				</ul>
				<form class="birds-form" novalidate>
					<label data-only="join"><span><?php esc_html_e( 'Full name', 'birds-elements' ); ?></span><input name="name" autocomplete="name" placeholder="<?php esc_attr_e( 'Your name', 'birds-elements' ); ?>"></label>
					<label><span><?php esc_html_e( 'Work email', 'birds-elements' ); ?></span><input name="email" type="email" autocomplete="email" placeholder="name@company.com" required></label>
					<label data-only="signin"><span><?php esc_html_e( 'Password', 'birds-elements' ); ?></span><input name="password" type="password" autocomplete="current-password"></label>
					<input class="birds-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
					<p class="birds-form__error" role="alert" hidden></p>
					<button class="birds-btn birds-btn--primary birds-btn--block" type="submit" data-join="<?php esc_attr_e( 'Join free & unlock instantly', 'birds-elements' ); ?>" data-signin="<?php esc_attr_e( 'Sign in', 'birds-elements' ); ?>"><?php esc_html_e( 'Join free & unlock instantly', 'birds-elements' ); ?></button>
				</form>
				<p class="birds-dialog__switch">
					<span data-only="join"><?php esc_html_e( 'Already a member?', 'birds-elements' ); ?> <button type="button" data-birds-mode="signin"><?php esc_html_e( 'Sign in', 'birds-elements' ); ?></button></span>
					<span data-only="signin"><?php esc_html_e( 'New to Birds?', 'birds-elements' ); ?> <button type="button" data-birds-mode="join"><?php esc_html_e( 'Join free', 'birds-elements' ); ?></button> · <a href="<?php echo esc_url( $lost ); ?>"><?php esc_html_e( 'Forgot password?', 'birds-elements' ); ?></a></span>
				</p>
				<p class="birds-dialog__fine"><?php esc_html_e( 'We never ask for payment. We email you a link to set a password for other devices.', 'birds-elements' ); ?></p>
			</div>
		</div>
	</div>

	<div class="birds-dialog" id="birds-share" role="dialog" aria-modal="true" aria-labelledby="birds-share-title" hidden>
		<div class="birds-dialog__panel">
			<button type="button" class="birds-dialog__close" data-birds-close aria-label="<?php esc_attr_e( 'Close', 'birds-elements' ); ?>"><?php echo birds_icon( 'close' ); // phpcs:ignore ?></button>
			<div class="birds-dialog__body">
				<p class="birds-kicker"><?php esc_html_e( 'Share this briefing', 'birds-elements' ); ?></p>
				<h2 id="birds-share-title" class="birds-share__title"></h2>
				<div class="birds-share__copy"><input readonly aria-label="<?php esc_attr_e( 'Article link', 'birds-elements' ); ?>"><button type="button" class="birds-btn birds-btn--primary" data-birds-copy><?php echo birds_icon( 'link' ); // phpcs:ignore ?> <span><?php esc_html_e( 'Copy', 'birds-elements' ); ?></span></button></div>
				<div class="birds-share__targets">
					<a data-share="linkedin" target="_blank" rel="noopener"><?php echo birds_icon( 'linkedin' ); // phpcs:ignore ?> LinkedIn</a>
					<a data-share="x" target="_blank" rel="noopener"><?php echo birds_icon( 'x' ); // phpcs:ignore ?> X / Twitter</a>
					<a data-share="email"><?php echo birds_icon( 'mail' ); // phpcs:ignore ?> <?php esc_html_e( 'Email', 'birds-elements' ); ?></a>
				</div>
			</div>
		</div>
	</div>
	<div class="birds-toasts" aria-live="polite"></div>
	<?php
}, 20 );
