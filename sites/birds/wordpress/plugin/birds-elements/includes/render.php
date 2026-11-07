<?php
/**
 * HTML renderers for every Birds component. The theme templates, the
 * shortcodes and the Elementor widgets all call these, so each piece of the
 * design exists exactly once.
 */

defined( 'ABSPATH' ) || exit;

function birds_access_badge( $type, $tone = 'light' ) {
	$member = 'member' === $type;
	return sprintf(
		'<span class="birds-badge birds-badge--%1$s%2$s">%3$s%4$s</span>',
		$member ? 'member' : 'free',
		'dark' === $tone ? ' birds-badge--dark' : '',
		birds_icon( $member ? 'lock' : 'unlock' ),
		esc_html( $member ? __( 'Member Briefing', 'birds-elements' ) : __( 'Free Access', 'birds-elements' ) )
	);
}

/* ------------------------------------------------------------------ quote */

function birds_quote_html( $text, $author = '', $title = '' ) {
	if ( '' === trim( (string) $text ) ) {
		return '';
	}
	$footer = '';
	if ( $author ) {
		$footer = '<footer class="birds-quote__by"><strong>' . esc_html( $author ) . '</strong>' . ( $title ? '<span> — ' . esc_html( $title ) . '</span>' : '' ) . '</footer>';
	}
	return '<blockquote class="birds-quote birds-reveal"><span class="birds-quote__mark" aria-hidden="true">&ldquo;</span><p>' . esc_html( $text ) . '</p>' . $footer . '</blockquote>';
}

/* -------------------------------------------------------------- takeaways */

function birds_takeaways_html( array $items, $heading = '' ) {
	$items = array_values( array_filter( array_map( 'trim', $items ) ) );
	if ( ! $items ) {
		return '';
	}
	$heading = $heading ? $heading : __( 'Executive key takeaways', 'birds-elements' );
	$out     = '<aside class="birds-takeaways" aria-label="' . esc_attr( $heading ) . '"><p class="birds-takeaways__title">' . esc_html( $heading ) . '</p><ol>';
	foreach ( $items as $i => $t ) {
		$out .= '<li><span class="birds-takeaways__n">' . esc_html( str_pad( (string) ( $i + 1 ), 2, '0', STR_PAD_LEFT ) ) . '</span><span>' . esc_html( $t ) . '</span></li>';
	}
	return $out . '</ol></aside>';
}

/* --------------------------------------------------------------- carousel */

/**
 * @param array $slides Each: image (url|id), caption, attribution, quote.
 */
function birds_carousel_html( array $slides ) {
	$slides = array_values( array_filter( $slides, function ( $s ) {
		return ! empty( $s['image'] ) || ! empty( $s['quote'] ) || ! empty( $s['caption'] );
	} ) );
	if ( ! $slides ) {
		return '';
	}
	$total = count( $slides );
	$out   = '<figure class="birds-carousel" data-birds-carousel aria-roledescription="carousel"><div class="birds-carousel__stage"><div class="birds-carousel__track">';
	foreach ( $slides as $i => $s ) {
		$img  = birds_resolve_image( $s['image'] ?? '', 'large' );
		$out .= '<div class="birds-carousel__slide" role="group" aria-roledescription="slide" aria-label="' . esc_attr( ( $i + 1 ) . ' / ' . $total ) . '"' . ( $i ? ' aria-hidden="true"' : '' ) . '>';
		$out .= $img ? '<img src="' . esc_url( $img ) . '" alt="" loading="lazy" draggable="false">' : '<span class="birds-media__fallback" aria-hidden="true"></span>';
		if ( ! empty( $s['quote'] ) ) {
			$out .= '<div class="birds-carousel__quote">' . birds_icon( 'quote' ) . '<p>' . esc_html( $s['quote'] ) . '</p><span>' . esc_html( $s['caption'] ?? '' ) . '</span></div>';
		} elseif ( ! empty( $s['caption'] ) ) {
			$out .= '<div class="birds-carousel__caption"><p>' . esc_html( $s['caption'] ) . '</p>' . ( ! empty( $s['attribution'] ) ? '<span>' . esc_html( $s['attribution'] ) . '</span>' : '' ) . '</div>';
		}
		$out .= '</div>';
	}
	$out .= '</div>';
	if ( $total > 1 ) {
		$out .= '<button type="button" class="birds-carousel__nav birds-carousel__nav--prev" data-dir="-1" aria-label="' . esc_attr__( 'Previous slide', 'birds-elements' ) . '">' . birds_icon( 'chevron-left' ) . '</button>';
		$out .= '<button type="button" class="birds-carousel__nav birds-carousel__nav--next" data-dir="1" aria-label="' . esc_attr__( 'Next slide', 'birds-elements' ) . '">' . birds_icon( 'chevron-right' ) . '</button>';
	}
	$out .= '</div>';
	if ( $total > 1 ) {
		$out .= '<div class="birds-carousel__foot"><div class="birds-carousel__dots" role="tablist">';
		for ( $i = 0; $i < $total; $i++ ) {
			$out .= '<button type="button" role="tab" aria-label="' . esc_attr( sprintf( /* translators: %d slide */ __( 'Slide %d', 'birds-elements' ), $i + 1 ) ) . '" aria-selected="' . ( $i ? 'false' : 'true' ) . '" data-index="' . $i . '"></button>';
		}
		$out .= '</div><span class="birds-carousel__count"><span data-current>01</span> / ' . esc_html( str_pad( (string) $total, 2, '0', STR_PAD_LEFT ) ) . '</span></div>';
	}
	return $out . '</figure>';
}

/* ----------------------------------------------------------- action table */

function birds_table_html( $caption, array $columns, array $rows ) {
	if ( ! $columns && ! $rows ) {
		return '';
	}
	$out = '<figure class="birds-table">';
	if ( $caption ) {
		$out .= '<figcaption>' . esc_html( $caption ) . '</figcaption>';
	}
	$out .= '<div class="birds-table__scroll"><table>';
	if ( $columns ) {
		$out .= '<thead><tr>';
		foreach ( $columns as $c ) {
			$out .= '<th scope="col">' . esc_html( $c ) . '</th>';
		}
		$out .= '</tr></thead>';
	}
	$out .= '<tbody>';
	foreach ( $rows as $r ) {
		$out .= '<tr>';
		foreach ( array_values( $r ) as $j => $cell ) {
			$out .= $j ? '<td>' . esc_html( $cell ) . '</td>' : '<th scope="row">' . esc_html( $cell ) . '</th>';
		}
		$out .= '</tr>';
	}
	return $out . '</tbody></table></div></figure>';
}

/* ------------------------------------------------------------- member gate */

function birds_gate_html( $remaining = 0 ) {
	$copy = $remaining > 0
		/* translators: %d: number of hidden sections */
		? sprintf( _n( '%d more section, every exhibit and the executive PDF are waiting.', '%d more sections, every exhibit and the executive PDF are waiting.', $remaining, 'birds-elements' ), $remaining )
		: __( 'The full analysis, every exhibit and the executive PDF are waiting.', 'birds-elements' );
	ob_start();
	?>
	<div class="birds-gate">
		<div class="birds-gate__fade" aria-hidden="true"></div>
		<div class="birds-gate__card birds-reveal">
			<span class="birds-gate__icon"><?php echo birds_icon( 'lock' ); // phpcs:ignore ?></span>
			<p class="birds-kicker"><?php esc_html_e( 'Member Briefing', 'birds-elements' ); ?></p>
			<h3><?php esc_html_e( 'Unlock member access to keep reading', 'birds-elements' ); ?></h3>
			<p><?php echo esc_html( $copy . ' ' . __( 'Membership is 100% free — instant one-step registration, no payment.', 'birds-elements' ) ); ?></p>
			<div class="birds-gate__actions">
				<button type="button" class="birds-btn birds-btn--primary" data-birds-auth="join"><?php esc_html_e( 'Join free & unlock', 'birds-elements' ); ?> <?php echo birds_icon( 'arrow-right' ); // phpcs:ignore ?></button>
				<button type="button" class="birds-btn birds-btn--link" data-birds-auth="signin"><?php esc_html_e( 'I’m already a member', 'birds-elements' ); ?></button>
			</div>
			<div class="birds-gate__perks">
				<span><?php echo birds_icon( 'file' ); // phpcs:ignore ?> <?php esc_html_e( 'Full deep-dive analysis', 'birds-elements' ); ?></span>
				<span><?php echo birds_icon( 'download' ); // phpcs:ignore ?> <?php esc_html_e( 'Executive PDF dossier', 'birds-elements' ); ?></span>
			</div>
		</div>
	</div>
	<?php
	return (string) ob_get_clean();
}

/* ----------------------------------------------------------- contributors */

function birds_portrait_html( array $c, $size = 'md' ) {
	if ( $c['photo'] ) {
		return '<span class="birds-portrait birds-portrait--' . esc_attr( $size ) . '"><img src="' . esc_url( $c['photo'] ) . '" alt="' . esc_attr( $c['name'] ) . '" loading="lazy"></span>';
	}
	$tone = array_sum( array_map( 'ord', str_split( $c['name'] ) ) ) % 4;
	return '<span class="birds-portrait birds-portrait--' . esc_attr( $size ) . ' birds-portrait--tone' . $tone . '" role="img" aria-label="' . esc_attr( $c['name'] ) . '">' . esc_html( birds_initials( $c['name'] ) ) . '</span>';
}

function birds_contributor_card_html( $id, $large = false ) {
	$c = birds_contributor( $id );
	if ( ! $c ) {
		return '';
	}
	$role_line = trim( $c['title'] . ( $c['title'] && $c['company'] ? ', ' : '' ) . $c['company'] );
	$out       = '<article class="birds-person' . ( $large ? ' birds-person--large' : '' ) . '">' . birds_portrait_html( $c, $large ? 'lg' : 'md' ) . '<div class="birds-person__body">';
	$out      .= '<p class="birds-person__name">' . esc_html( $c['name'] ) . '</p>';
	if ( $role_line ) {
		$out .= '<p class="birds-person__role">' . esc_html( $role_line ) . '</p>';
	}
	if ( $c['bio'] ) {
		$out .= '<p class="birds-person__bio">' . esc_html( $c['bio'] ) . '</p>';
	}
	if ( $c['company_bio'] ) {
		$out .= '<div class="birds-person__company"><strong>' . esc_html( sprintf( /* translators: %s company */ __( 'About %s.', 'birds-elements' ), $c['company'] ) ) . '</strong> ' . esc_html( $c['company_bio'] ) . '</div>';
	}
	$links = '';
	if ( $c['linkedin'] ) {
		$links .= '<a href="' . esc_url( $c['linkedin'] ) . '" target="_blank" rel="noopener">' . birds_icon( 'linkedin', 'birds-icon--linkedin' ) . ' LinkedIn</a>';
	}
	if ( $c['company_url'] ) {
		/* translators: %s company */
		$links .= '<a href="' . esc_url( $c['company_url'] ) . '" target="_blank" rel="noopener">' . esc_html( sprintf( __( '%s website', 'birds-elements' ), $c['company'] ? $c['company'] : __( 'Company', 'birds-elements' ) ) ) . ' ' . birds_icon( 'arrow-up-right' ) . '</a>';
	}
	if ( $links ) {
		$out .= '<div class="birds-person__links">' . $links . '</div>';
	}
	return $out . '</div></article>';
}

function birds_contributors_html( $author_id, array $expert_ids, $labels = array() ) {
	$labels = wp_parse_args( $labels, array(
		'author'  => __( 'Written by', 'birds-elements' ),
		'experts' => __( 'Featured experts interviewed', 'birds-elements' ),
	) );
	$author  = $author_id ? birds_contributor_card_html( $author_id, true ) : '';
	$experts = '';
	foreach ( $expert_ids as $id ) {
		$experts .= birds_contributor_card_html( $id );
	}
	if ( ! $author && ! $experts ) {
		return '';
	}
	$out = '<section class="birds-people" aria-label="' . esc_attr__( 'Contributors', 'birds-elements' ) . '">';
	if ( $author ) {
		$out .= '<p class="birds-label">' . esc_html( $labels['author'] ) . '</p>' . $author;
	}
	if ( $experts ) {
		$out .= '<p class="birds-label birds-people__experts-label">' . esc_html( $labels['experts'] ) . '</p><div class="birds-people__grid' . ( count( $expert_ids ) > 1 ? ' birds-people__grid--two' : '' ) . '">' . $experts . '</div>';
	}
	return $out . '</section>';
}

/* ---------------------------------------------------------- article cards */

function birds_article_card_html( $post, $args = array() ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	$args = wp_parse_args( $args, array( 'size' => 'md', 'deck' => false ) );
	$a    = birds_article( $post );
	$link = get_permalink( $post );
	$cat  = $a['category'];
	ob_start();
	?>
	<article class="birds-card birds-card--<?php echo esc_attr( $args['size'] ); ?>" data-category="<?php echo esc_attr( $cat ? $cat->slug : '' ); ?>">
		<a class="birds-card__media" href="<?php echo esc_url( $link ); ?>" aria-label="<?php echo esc_attr( get_the_title( $post ) ); ?>">
			<span class="birds-card__zoom"><?php echo birds_media_html( $post, 'large' ); // phpcs:ignore ?></span>
			<?php if ( 'video' === $a['hero_type'] ) : ?>
				<span class="birds-card__flag"><?php echo birds_icon( 'video' ); // phpcs:ignore ?> <?php esc_html_e( 'Video', 'birds-elements' ); ?></span>
			<?php endif; ?>
			<?php if ( $a['takeaways'] ) : ?>
				<span class="birds-card__preview"><small><?php esc_html_e( 'Key takeaway', 'birds-elements' ); ?></small><?php echo esc_html( $a['takeaways'][0] ); ?></span>
			<?php endif; ?>
		</a>
		<div class="birds-card__top">
			<?php if ( $cat ) : ?>
				<a class="birds-kicker" href="<?php echo esc_url( get_category_link( $cat ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
			<?php endif; ?>
			<button type="button" class="birds-save" data-birds-save="<?php echo esc_attr( $post->ID ); ?>" aria-pressed="false" aria-label="<?php esc_attr_e( 'Save article', 'birds-elements' ); ?>"><?php echo birds_icon( 'bookmark', 'is-off' ) . birds_icon( 'bookmark-check', 'is-on' ); // phpcs:ignore ?></button>
		</div>
		<h3 class="birds-card__title"><a href="<?php echo esc_url( $link ); ?>"><span class="birds-underline"><?php echo esc_html( get_the_title( $post ) ); ?></span></a></h3>
		<?php if ( $args['deck'] && has_excerpt( $post ) ) : ?>
			<p class="birds-card__deck"><?php echo esc_html( get_the_excerpt( $post ) ); ?></p>
		<?php endif; ?>
		<div class="birds-card__meta">
			<time datetime="<?php echo esc_attr( get_the_date( 'c', $post ) ); ?>"><?php echo esc_html( get_the_date( '', $post ) ); ?></time>
			<span aria-hidden="true">·</span>
			<span><?php echo esc_html( $a['read_time'] ); ?></span>
			<?php echo birds_access_badge( $a['access'] ); // phpcs:ignore ?>
		</div>
	</article>
	<?php
	return (string) ob_get_clean();
}

function birds_article_row_html( $post ) {
	$post = get_post( $post );
	$a    = birds_article( $post );
	ob_start();
	?>
	<a class="birds-row" href="<?php echo esc_url( get_permalink( $post ) ); ?>" data-category="<?php echo esc_attr( $a['category'] ? $a['category']->slug : '' ); ?>">
		<span class="birds-row__text">
			<?php if ( $a['category'] ) : ?>
				<span class="birds-kicker"><?php echo esc_html( $a['category']->name ); ?></span>
			<?php endif; ?>
			<span class="birds-row__title"><?php echo esc_html( get_the_title( $post ) ); ?></span>
			<span class="birds-card__meta"><span><?php echo esc_html( $a['read_time'] ); ?></span><?php echo birds_access_badge( $a['access'] ); // phpcs:ignore ?></span>
		</span>
		<span class="birds-row__media"><span class="birds-card__zoom"><?php echo birds_media_html( $post, 'medium_large' ); // phpcs:ignore ?></span></span>
	</a>
	<?php
	return (string) ob_get_clean();
}

/**
 * Article grid / list driven by a WP_Query.
 *
 * @param array $args layout: grid|feature|list, category (slug or id), count,
 *                    offset, columns (2|3|4), deck (bool), exclude (ids),
 *                    access (''|free|member), orderby.
 */
function birds_articles_html( $args = array() ) {
	$args  = wp_parse_args( $args, array(
		'layout'   => 'grid',
		'category' => '',
		'count'    => 6,
		'offset'   => 0,
		'columns'  => 3,
		'deck'     => false,
		'exclude'  => array(),
		'access'   => '',
		'orderby'  => 'date',
		'filters'  => false,
	) );
	$query = array(
		'post_type'           => 'post',
		'posts_per_page'      => max( 1, (int) $args['count'] ),
		'offset'              => max( 0, (int) $args['offset'] ),
		'ignore_sticky_posts' => true,
		'post__not_in'        => array_map( 'absint', (array) $args['exclude'] ),
		'orderby'             => in_array( $args['orderby'], array( 'date', 'title', 'rand', 'modified', 'comment_count' ), true ) ? $args['orderby'] : 'date',
	);
	if ( $args['category'] ) {
		if ( is_numeric( $args['category'] ) ) {
			$query['cat'] = (int) $args['category'];
		} else {
			$query['category_name'] = sanitize_title( $args['category'] );
		}
	}
	if ( in_array( $args['access'], array( 'free', 'member' ), true ) ) {
		$query['meta_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery
			'member' === $args['access']
				? array( 'key' => '_birds_access', 'value' => 'member' )
				: array( 'relation' => 'OR', array( 'key' => '_birds_access', 'value' => 'free' ), array( 'key' => '_birds_access', 'compare' => 'NOT EXISTS' ) ),
		);
	}
	$posts = get_posts( apply_filters( 'birds_articles_query', $query, $args ) );
	if ( ! $posts ) {
		return '<p class="birds-empty">' . esc_html__( 'No briefings here yet.', 'birds-elements' ) . '</p>';
	}

	$cols = max( 1, min( 4, (int) $args['columns'] ) );
	if ( 'list' === $args['layout'] ) {
		$out = '<div class="birds-list">';
		foreach ( $posts as $p ) {
			$out .= birds_article_row_html( $p );
		}
		return $out . '</div>';
	}
	if ( 'feature' === $args['layout'] ) {
		$first = array_shift( $posts );
		$side  = array_slice( $posts, 0, 4 );
		$rest  = array_slice( $posts, 4 );
		$out   = '<div class="birds-feature"><div class="birds-feature__lead">' . birds_article_card_html( $first, array( 'size' => 'lg', 'deck' => true ) ) . '</div><div class="birds-list">';
		foreach ( $side as $p ) {
			$out .= birds_article_row_html( $p );
		}
		$out .= '</div></div>';
		if ( $rest ) {
			$out .= '<div class="birds-grid birds-grid--' . $cols . ' birds-feature__rest">';
			foreach ( $rest as $p ) {
				$out .= birds_article_card_html( $p );
			}
			$out .= '</div>';
		}
		return $out;
	}
	$out = '<div class="birds-grid birds-grid--' . $cols . '">';
	foreach ( $posts as $p ) {
		$out .= birds_article_card_html( $p, array( 'deck' => (bool) $args['deck'] ) );
	}
	return $out . '</div>';
}

/* -------------------------------------------------------------------- hero */

/** Media for a hero: looping video (with controls) layered over the image. */
function birds_hero_media_html( $post, $with_controls = true ) {
	$a   = birds_article( $post );
	$out = '<div class="birds-hero-media">' . birds_media_html( $post, 'full' );
	if ( 'video' === $a['hero_type'] ) {
		$out .= '<video class="birds-hero-media__video" src="' . esc_url( $a['hero_video'] ) . '" autoplay muted loop playsinline preload="metadata" aria-label="' . esc_attr__( 'Ambient background video', 'birds-elements' ) . '"></video>';
		if ( $with_controls ) {
			$out .= '<div class="birds-hero-media__controls">'
				. '<button type="button" data-birds-video="play" aria-label="' . esc_attr__( 'Pause video', 'birds-elements' ) . '">' . birds_icon( 'pause', 'is-on' ) . birds_icon( 'play', 'is-off' ) . '</button>'
				. '<button type="button" data-birds-video="mute" aria-label="' . esc_attr__( 'Unmute video', 'birds-elements' ) . '">' . birds_icon( 'mute', 'is-on' ) . birds_icon( 'volume', 'is-off' ) . '</button>'
				. '</div>';
		}
	}
	return $out . '<span class="birds-hero-media__scrim" aria-hidden="true"></span></div>';
}

/** Home marquee: lead story over its media, with three more stories below. */
function birds_marquee_html( $post, $args = array() ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	$args = wp_parse_args( $args, array(
		'eyebrow' => __( 'Featured briefing', 'birds-elements' ),
		'button'  => __( 'Read the briefing', 'birds-elements' ),
		'more'    => 3,
	) );
	$a    = birds_article( $post );
	$more = $args['more'] ? get_posts( array( 'numberposts' => (int) $args['more'], 'post__not_in' => array( $post->ID ), 'ignore_sticky_posts' => true ) ) : array();
	$auth = $a['author'] ? birds_contributor( $a['author'] ) : null;
	ob_start();
	?>
	<section class="birds-marquee">
		<?php echo birds_hero_media_html( $post, false ); // phpcs:ignore ?>
		<div class="birds-marquee__inner birds-wrap">
			<div class="birds-marquee__copy birds-stagger">
				<p class="birds-marquee__eyebrow"><?php echo esc_html( $args['eyebrow'] . ( $a['category'] ? ' · ' . $a['category']->name : '' ) ); ?></p>
				<h1 class="birds-marquee__title"><?php echo esc_html( get_the_title( $post ) ); ?></h1>
				<?php if ( has_excerpt( $post ) ) : ?>
					<p class="birds-marquee__deck"><?php echo esc_html( get_the_excerpt( $post ) ); ?></p>
				<?php endif; ?>
				<div class="birds-marquee__actions">
					<a class="birds-btn birds-btn--light" href="<?php echo esc_url( get_permalink( $post ) ); ?>"><?php echo esc_html( $args['button'] ); ?> <?php echo birds_icon( 'arrow-right' ); // phpcs:ignore ?></a>
					<span class="birds-marquee__by"><?php echo esc_html( trim( ( $auth ? $auth['name'] : get_the_author_meta( 'display_name', $post->post_author ) ) . ' · ' . $a['read_time'] ) ); ?></span>
					<?php echo birds_access_badge( $a['access'], 'dark' ); // phpcs:ignore ?>
				</div>
			</div>
		</div>
		<?php if ( $more ) : ?>
			<div class="birds-marquee__more">
				<div class="birds-wrap birds-marquee__more-grid">
					<?php foreach ( $more as $m ) : $mc = birds_article( $m )['category']; ?>
						<a href="<?php echo esc_url( get_permalink( $m ) ); ?>">
							<?php if ( $mc ) : ?><small><?php echo esc_html( $mc->name ); ?></small><?php endif; ?>
							<span><?php echo esc_html( get_the_title( $m ) ); ?></span>
						</a>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</section>
	<?php
	return (string) ob_get_clean();
}

/* ------------------------------------------------------- membership banner */

function birds_membership_banner_html( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'eyebrow'        => __( 'Birds Membership', 'birds-elements' ),
		'heading'        => __( 'Executive intelligence, without the paywall.', 'birds-elements' ),
		'text'           => __( 'Membership is free. Join in one step to unlock deep-dive briefings and downloadable executive dossiers.', 'birds-elements' ),
		'perks'          => array( __( 'Unabridged member briefings', 'birds-elements' ), __( 'Executive PDF dossiers', 'birds-elements' ), __( 'No payment, ever', 'birds-elements' ) ),
		'button'         => __( 'Join free', 'birds-elements' ),
		'member_heading' => __( 'You have full member access.', 'birds-elements' ),
		'member_text'    => __( 'Every member briefing, exhibit and executive PDF is unlocked for your account.', 'birds-elements' ),
	) );
	$member = is_user_logged_in();
	ob_start();
	?>
	<section class="birds-banner">
		<div class="birds-banner__art" aria-hidden="true"></div>
		<div class="birds-wrap birds-banner__inner">
			<p class="birds-banner__eyebrow"><?php echo esc_html( $args['eyebrow'] ); ?></p>
			<h2><?php echo esc_html( $member ? $args['member_heading'] : $args['heading'] ); ?></h2>
			<p class="birds-banner__text"><?php echo esc_html( $member ? $args['member_text'] : $args['text'] ); ?></p>
			<?php if ( ! $member ) : ?>
				<?php if ( $args['perks'] ) : ?>
					<ul>
						<?php foreach ( (array) $args['perks'] as $perk ) : ?>
							<li><?php echo birds_icon( 'check' ); // phpcs:ignore ?> <?php echo esc_html( $perk ); ?></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
				<button type="button" class="birds-btn birds-btn--light" data-birds-auth="join"><?php echo esc_html( $args['button'] ); ?> <?php echo birds_icon( 'arrow-right' ); // phpcs:ignore ?></button>
			<?php endif; ?>
		</div>
	</section>
	<?php
	return (string) ob_get_clean();
}

/* ----------------------------------------------------------- series blocks */

/** One block per category (series) with its newest articles. */
function birds_series_sections_html( $args = array() ) {
	$args = wp_parse_args( $args, array( 'count' => 3, 'include' => array(), 'link_text' => __( 'Explore the series', 'birds-elements' ) ) );
	$cats = get_categories( array( 'hide_empty' => true, 'include' => $args['include'], 'orderby' => 'term_id' ) );
	// Only leaf categories are series; parents ("Human Leadership") are groups.
	$cats = array_values( array_filter( $cats, function ( $c ) {
		return 'uncategorized' !== $c->slug && ! get_term_children( $c->term_id, 'category' );
	} ) );
	if ( ! $cats ) {
		return '';
	}
	$out = '<section class="birds-series" aria-label="' . esc_attr__( 'Series', 'birds-elements' ) . '">';
	foreach ( $cats as $i => $c ) {
		$parent = $c->parent ? get_category( $c->parent ) : null;
		$out   .= '<div class="birds-series__block' . ( $i % 2 ? ' is-alt' : '' ) . ' birds-reveal"><div class="birds-wrap birds-series__inner"><div class="birds-series__intro">';
		$out   .= '<p class="birds-label">' . esc_html( sprintf( 'Series %02d', $i + 1 ) . ( $parent && ! is_wp_error( $parent ) ? ' · ' . $parent->name : '' ) ) . '</p>';
		$out   .= '<h2>' . esc_html( $c->name ) . '</h2>';
		if ( $c->description ) {
			$out .= '<p>' . esc_html( $c->description ) . '</p>';
		}
		$out .= '<a class="birds-more" href="' . esc_url( get_category_link( $c ) ) . '">' . esc_html( $args['link_text'] ) . ' ' . birds_icon( 'arrow-right' ) . '</a></div>';
		$out .= birds_articles_html( array( 'category' => $c->term_id, 'count' => $args['count'], 'columns' => 3 ) );
		$out .= '</div></div>';
	}
	return $out . '</section>';
}

/* ---------------------------------------------------------- article header */

/** Kicker, headline, deck, meta line and the Listen/Save/Share/PDF bar. */
function birds_article_header_html( $post = null, $args = array() ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	$args = wp_parse_args( $args, array( 'title_tag' => 'h1', 'actions' => true ) );
	$a    = birds_article( $post );
	$auth = $a['author'] ? birds_contributor( $a['author'] ) : null;
	$tag  = in_array( $args['title_tag'], array( 'h1', 'h2' ), true ) ? $args['title_tag'] : 'h1';
	$can  = birds_can_read( $post );
	ob_start();
	?>
	<header class="birds-article-head">
		<p class="birds-kicker">
			<?php if ( $a['category'] ) : ?>
				<a href="<?php echo esc_url( get_category_link( $a['category'] ) ); ?>"><?php echo esc_html( $a['category']->name ); ?></a>
			<?php endif; ?>
			<?php if ( $a['series'] ) : ?>
				<span class="birds-kicker__series"> · <?php echo esc_html( $a['series'] ); ?></span>
			<?php endif; ?>
		</p>
		<<?php echo $tag; // phpcs:ignore ?> class="birds-article-head__title"><?php echo esc_html( get_the_title( $post ) ); ?></<?php echo $tag; // phpcs:ignore ?>>
		<?php if ( has_excerpt( $post ) ) : ?>
			<p class="birds-article-head__deck"><?php echo esc_html( get_the_excerpt( $post ) ); ?></p>
		<?php endif; ?>
		<div class="birds-article-head__meta">
			<strong><?php echo esc_html( $auth ? $auth['name'] : get_the_author_meta( 'display_name', $post->post_author ) ); ?></strong>
			<span aria-hidden="true">·</span>
			<time datetime="<?php echo esc_attr( get_the_date( 'c', $post ) ); ?>"><?php echo esc_html( get_the_date( '', $post ) ); ?></time>
			<span aria-hidden="true">·</span>
			<span><?php echo esc_html( $a['read_time'] ); ?></span>
			<?php echo birds_access_badge( $a['access'] ); // phpcs:ignore ?>
		</div>
		<?php if ( $args['actions'] ) : ?>
			<div class="birds-actions" data-title="<?php echo esc_attr( get_the_title( $post ) ); ?>" data-url="<?php echo esc_url( get_permalink( $post ) ); ?>" data-deck="<?php echo esc_attr( has_excerpt( $post ) ? get_the_excerpt( $post ) : '' ); ?>">
				<button type="button" class="birds-action" data-birds-listen aria-pressed="false"><?php echo birds_icon( 'headphones', 'is-off' ) . birds_icon( 'stop', 'is-on' ); // phpcs:ignore ?><span data-off="<?php esc_attr_e( 'Listen', 'birds-elements' ); ?>" data-on="<?php esc_attr_e( 'Stop', 'birds-elements' ); ?>"><?php esc_html_e( 'Listen', 'birds-elements' ); ?></span></button>
				<button type="button" class="birds-action" data-birds-save="<?php echo esc_attr( $post->ID ); ?>" aria-pressed="false"><?php echo birds_icon( 'bookmark', 'is-off' ) . birds_icon( 'bookmark-check', 'is-on' ); // phpcs:ignore ?><span data-off="<?php esc_attr_e( 'Save', 'birds-elements' ); ?>" data-on="<?php esc_attr_e( 'Saved', 'birds-elements' ); ?>"><?php esc_html_e( 'Save', 'birds-elements' ); ?></span></button>
				<button type="button" class="birds-action" data-birds-share><?php echo birds_icon( 'share' ); // phpcs:ignore ?><span><?php esc_html_e( 'Share', 'birds-elements' ); ?></span></button>
				<button type="button" class="birds-action birds-action--primary" <?php echo $can ? 'data-birds-pdf' : 'data-birds-auth="join" data-birds-reason="pdf"'; ?>><?php echo birds_icon( 'download' ); // phpcs:ignore ?><span><?php esc_html_e( 'Download PDF', 'birds-elements' ); ?></span></button>
			</div>
		<?php endif; ?>
	</header>
	<?php
	return (string) ob_get_clean();
}

/** Print-only masthead for the PDF dossier. */
function birds_print_masthead_html( $post = null ) {
	$post  = get_post( $post );
	$brand = apply_filters( 'birds_brand_name', get_bloginfo( 'name' ) );
	return '<div class="birds-print-head" aria-hidden="true"><div><strong>' . esc_html( $brand ) . '</strong><span>' . esc_html( get_bloginfo( 'description' ) ) . '</span></div><div><b>' . esc_html__( 'Executive Dossier', 'birds-elements' ) . '</b><span>' . esc_html( get_the_date( '', $post ) ) . '</span></div></div>';
}

/** "Latest insights" block: heading, optional series filter chips, articles. */
function birds_latest_section_html( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'heading' => __( 'Latest insights', 'birds-elements' ),
		'intro'   => '',
		'filters' => false,
		'layout'  => 'feature',
	) );
	$chips = '';
	if ( $args['filters'] ) {
		$cats   = get_categories( array( 'hide_empty' => true, 'orderby' => 'term_id' ) );
		$chips .= '<div class="birds-chips" role="tablist" aria-label="' . esc_attr__( 'Filter by series', 'birds-elements' ) . '"><button type="button" role="tab" aria-selected="true" data-filter="">' . esc_html__( 'All', 'birds-elements' ) . '</button>';
		foreach ( $cats as $c ) {
			if ( 'uncategorized' !== $c->slug && ! get_term_children( $c->term_id, 'category' ) ) {
				$chips .= '<button type="button" role="tab" aria-selected="false" data-filter="' . esc_attr( $c->slug ) . '">' . esc_html( $c->name ) . '</button>';
			}
		}
		$chips .= '</div>';
		// Filtering is client-side over what is rendered, so use one flat grid.
		$args['layout'] = 'feature' === $args['layout'] ? 'grid' : $args['layout'];
		$args['count']  = max( (int) ( $args['count'] ?? 8 ), 12 );
	}
	$out = '<section class="birds-latest"' . ( $args['filters'] ? ' data-birds-filter' : '' ) . '>';
	if ( $args['heading'] || $chips ) {
		$out .= '<div class="birds-section-head"><div>' . ( $args['heading'] ? '<h2>' . esc_html( $args['heading'] ) . '</h2>' : '' ) . ( $args['intro'] ? '<p>' . esc_html( $args['intro'] ) . '</p>' : '' ) . '</div>' . $chips . '</div>';
	}
	return $out . birds_articles_html( $args ) . '<p class="birds-empty" data-filter-empty hidden>' . esc_html__( 'No briefings in this series yet.', 'birds-elements' ) . '</p></section>';
}
