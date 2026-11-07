<?php
/**
 * Bar, column, line and donut charts as server-rendered HTML/SVG — the same
 * construction as the React site, so they print and index without JavaScript.
 * assets/js adds the hover tooltips and the in-view animation.
 */

defined( 'ABSPATH' ) || exit;

/** Rounds up to a "nice" axis maximum and returns evenly spaced ticks. */
function birds_nice_scale( $max_value, $ticks = 4 ) {
	$raw   = $max_value / $ticks;
	$raw   = $raw > 0 ? $raw : 1;
	$mag   = pow( 10, floor( log10( $raw ) ) );
	$step  = 10 * $mag;
	foreach ( array( 1, 2, 2.5, 5, 10 ) as $m ) {
		if ( $m * $mag >= $raw ) {
			$step = $m * $mag;
			break;
		}
	}
	$out = array();
	for ( $i = 0; $i <= $ticks; $i++ ) {
		$out[] = round( $i * $step, 6 );
	}
	return array( 'max' => $step * $ticks, 'ticks' => $out );
}

/**
 * Normalises a chart spec.
 *
 * @param array $spec type, title, subtitle, unit, value_label, benchmark_label,
 *                    source, data: [ [label, value, benchmark?, color?] ...].
 */
function birds_chart_spec( array $spec ) {
	$spec = wp_parse_args( $spec, array(
		'type'            => 'column',
		'title'           => '',
		'subtitle'        => '',
		'unit'            => '',
		'value_label'     => __( 'Value', 'birds-elements' ),
		'benchmark_label' => __( 'Benchmark', 'birds-elements' ),
		'source'          => '',
		'data'            => array(),
		'exhibit'         => true,
	) );
	$data = array();
	foreach ( (array) $spec['data'] as $d ) {
		$d = array_values( (array) $d );
		if ( ! isset( $d[0], $d[1] ) || '' === trim( (string) $d[0] ) || ! is_numeric( $d[1] ) ) {
			continue;
		}
		$data[] = array(
			'label'     => trim( (string) $d[0] ),
			'value'     => (float) $d[1],
			'benchmark' => isset( $d[2] ) && is_numeric( $d[2] ) ? (float) $d[2] : null,
			'color'     => isset( $d[3] ) ? sanitize_hex_color( trim( (string) $d[3] ) ) : null,
		);
	}
	$spec['data'] = $data;
	$spec['type'] = in_array( $spec['type'], array( 'bar', 'column', 'line', 'pie' ), true ) ? $spec['type'] : 'column';
	return $spec;
}

function birds_chart_html( array $spec ) {
	static $exhibit = 0;
	$spec = birds_chart_spec( $spec );
	if ( ! $spec['data'] ) {
		return current_user_can( 'edit_posts' ) ? '<p class="birds-empty">' . esc_html__( 'Chart: add at least one data row (label | value | benchmark).', 'birds-elements' ) . '</p>' : '';
	}
	$has_bench = (bool) array_filter( wp_list_pluck( $spec['data'], 'benchmark' ), 'is_float' );
	$fn        = 'birds_chart_' . $spec['type'];
	$body      = $fn( $spec, $has_bench );

	$out = '<figure class="birds-chart birds-chart--' . esc_attr( $spec['type'] ) . '" data-birds-chart data-unit="' . esc_attr( $spec['unit'] ) . '" data-value-label="' . esc_attr( $spec['value_label'] ) . '" data-benchmark-label="' . esc_attr( $spec['benchmark_label'] ) . '">';
	if ( $spec['exhibit'] ) {
		$exhibit++;
		/* translators: %d exhibit number */
		$out .= '<p class="birds-chart__exhibit">' . esc_html( sprintf( __( 'Exhibit %d', 'birds-elements' ), $exhibit ) ) . '</p>';
	}
	$out .= '<figcaption><span class="birds-chart__title">' . esc_html( $spec['title'] ) . '</span>' . ( $spec['subtitle'] ? '<span class="birds-chart__subtitle">' . esc_html( $spec['subtitle'] ) . '</span>' : '' ) . '</figcaption>';

	$legend = array();
	if ( 'pie' !== $spec['type'] ) {
		$legend[] = array( $spec['value_label'], 'var(--birds-chart-2)', false );
		if ( $has_bench ) {
			$legend[] = array( $spec['benchmark_label'], 'bar' === $spec['type'] ? 'var(--birds-chart-1)' : 'var(--birds-chart-4)', 'column' !== $spec['type'] );
		}
	}
	if ( count( $legend ) > 1 || ( 'line' === $spec['type'] ) ) {
		$out .= '<div class="birds-chart__legend">';
		foreach ( $legend as $l ) {
			$out .= '<span><i class="' . ( $l[2] ? 'is-dashed' : '' ) . '" style="' . ( $l[2] ? 'border-color:' : 'background:' ) . esc_attr( $l[1] ) . '"></i>' . esc_html( $l[0] ) . '</span>';
		}
		$out .= '</div>';
	}
	$out .= '<div class="birds-chart__body">' . $body . '</div>';
	if ( $spec['source'] ) {
		/* translators: %s source */
		$out .= '<p class="birds-chart__source">' . esc_html( sprintf( __( 'Source: %s', 'birds-elements' ), $spec['source'] ) ) . '</p>';
	}
	return $out . '</figure>';
}

function birds_chart_point_attrs( $d, $unit ) {
	return ' data-label="' . esc_attr( $d['label'] ) . '" data-value="' . esc_attr( birds_format_number( $d['value'], $unit ) ) . '"'
		. ( null !== $d['benchmark'] ? ' data-benchmark="' . esc_attr( birds_format_number( $d['benchmark'], $unit ) ) . '"' : '' );
}

function birds_chart_column( $spec, $has_bench ) {
	$vals  = array();
	foreach ( $spec['data'] as $d ) {
		$vals[] = $d['value'];
		$vals[] = (float) $d['benchmark'];
	}
	$scale = birds_nice_scale( max( $vals ) );
	$max   = $scale['max'];
	$out   = '<div class="birds-cc"><div class="birds-cc__axis">';
	foreach ( $scale['ticks'] as $t ) {
		$out .= '<span style="bottom:' . esc_attr( $t / $max * 100 ) . '%">' . esc_html( birds_format_number( $t ) ) . '</span>';
	}
	$out .= '</div><div class="birds-cc__main"><div class="birds-cc__plot">';
	foreach ( array_slice( $scale['ticks'], 1 ) as $t ) {
		$out .= '<i class="birds-gridline" style="bottom:' . esc_attr( $t / $max * 100 ) . '%"></i>';
	}
	$out .= '<div class="birds-cc__groups">';
	foreach ( $spec['data'] as $i => $d ) {
		$out .= '<div class="birds-cc__group" tabindex="0"' . birds_chart_point_attrs( $d, $spec['unit'] ) . '>';
		$out .= '<span class="birds-cc__bar" style="--h:' . esc_attr( $d['value'] / $max * 100 ) . '%;--d:' . ( $i * 70 ) . 'ms;background:' . esc_attr( $d['color'] ? $d['color'] : 'var(--birds-chart-2)' ) . '"><b>' . esc_html( birds_format_number( $d['value'], $spec['unit'] ) ) . '</b></span>';
		if ( $has_bench && null !== $d['benchmark'] ) {
			$out .= '<span class="birds-cc__bar is-bench" style="--h:' . esc_attr( $d['benchmark'] / $max * 100 ) . '%;--d:' . ( $i * 70 + 50 ) . 'ms"></span>';
		}
		$out .= '</div>';
	}
	$out .= '</div></div><div class="birds-cc__labels">';
	foreach ( $spec['data'] as $d ) {
		$out .= '<span>' . esc_html( $d['label'] ) . '</span>';
	}
	return $out . '</div></div></div>';
}

function birds_chart_bar( $spec, $has_bench ) {
	$vals = array();
	foreach ( $spec['data'] as $d ) {
		$vals[] = $d['value'];
		$vals[] = (float) $d['benchmark'];
	}
	$max = birds_nice_scale( max( $vals ) )['max'];
	$top = max( wp_list_pluck( $spec['data'], 'value' ) );
	$out = '<div class="birds-bc">';
	foreach ( $spec['data'] as $i => $d ) {
		$color = $d['color'] ? $d['color'] : ( $d['value'] === $top ? 'var(--birds-chart-1)' : 'var(--birds-chart-2)' );
		$out  .= '<div class="birds-bc__row" tabindex="0"' . birds_chart_point_attrs( $d, $spec['unit'] ) . '><span class="birds-bc__label">' . esc_html( $d['label'] ) . '</span><div class="birds-bc__track-wrap"><div class="birds-bc__track">';
		$out  .= '<span class="birds-bc__bar" style="--w:' . esc_attr( $d['value'] / $max * 100 ) . '%;--d:' . ( $i * 80 ) . 'ms;background:' . esc_attr( $color ) . '"></span>';
		if ( null !== $d['benchmark'] ) {
			$out .= '<span class="birds-bc__bench" style="left:' . esc_attr( $d['benchmark'] / $max * 100 ) . '%"></span>';
		}
		$out .= '</div><span class="birds-bc__value">' . esc_html( birds_format_number( $d['value'], $spec['unit'] ) ) . '</span></div></div>';
	}
	return $out . '</div>';
}

function birds_chart_line( $spec, $has_bench ) {
	$all = array();
	foreach ( $spec['data'] as $d ) {
		$all[] = $d['value'];
		$all[] = null !== $d['benchmark'] ? $d['benchmark'] : $d['value'];
	}
	$lo    = min( $all );
	$hi    = max( $all );
	$fstep = pow( 10, floor( log10( max( $hi - $lo, 1 ) ) ) );
	$min   = max( 0, floor( ( $lo - ( $hi - $lo ) * 0.15 ) / $fstep ) * $fstep );
	$scale = birds_nice_scale( $hi - $min );
	$max   = $min + $scale['max'];
	$n     = count( $spec['data'] );
	$x     = function ( $i ) use ( $n ) {
		return 1 === $n ? 50 : $i / ( $n - 1 ) * 100;
	};
	$y     = function ( $v ) use ( $min, $max ) {
		return 100 - ( $v - $min ) / ( $max - $min ) * 100;
	};
	$path  = function ( $key ) use ( $spec, $x, $y ) {
		$d = '';
		foreach ( $spec['data'] as $i => $p ) {
			$v  = 'value' === $key ? $p['value'] : ( null !== $p['benchmark'] ? $p['benchmark'] : $p['value'] );
			$d .= ( $i ? 'L' : 'M' ) . round( $x( $i ), 3 ) . ',' . round( $y( $v ), 3 ) . ' ';
		}
		return trim( $d );
	};

	$out = '<div class="birds-lc"><div class="birds-lc__axis">';
	foreach ( $scale['ticks'] as $t ) {
		$out .= '<span style="bottom:' . esc_attr( $t / $scale['max'] * 100 ) . '%">' . esc_html( birds_format_number( $t + $min ) ) . '</span>';
	}
	$out .= '</div><div class="birds-lc__main"><div class="birds-lc__plot">';
	foreach ( array_slice( $scale['ticks'], 1 ) as $t ) {
		$out .= '<i class="birds-gridline" style="bottom:' . esc_attr( $t / $scale['max'] * 100 ) . '%"></i>';
	}
	$out .= '<div class="birds-lc__lines"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
	if ( $has_bench ) {
		$out .= '<path d="' . esc_attr( $path( 'benchmark' ) ) . '" class="is-bench" vector-effect="non-scaling-stroke"/>';
	}
	$out .= '<path d="' . esc_attr( $path( 'value' ) ) . '" vector-effect="non-scaling-stroke"/></svg></div>';
	$band = 100 / max( $n - 1, 1 );
	foreach ( $spec['data'] as $i => $d ) {
		$out .= '<span class="birds-lc__dot" style="left:' . esc_attr( $x( $i ) ) . '%;bottom:' . esc_attr( 100 - $y( $d['value'] ) ) . '%"></span>';
		if ( null !== $d['benchmark'] ) {
			$out .= '<span class="birds-lc__dot is-bench" style="left:' . esc_attr( $x( $i ) ) . '%;bottom:' . esc_attr( 100 - $y( $d['benchmark'] ) ) . '%"></span>';
		}
		$top  = 100 - $y( max( $d['value'], (float) $d['benchmark'] ) );
		$out .= '<button type="button" class="birds-lc__hit" style="left:' . esc_attr( $x( $i ) - $band / 2 ) . '%;width:' . esc_attr( $band ) . '%" data-x="' . esc_attr( $x( $i ) ) . '" data-top="' . esc_attr( $top ) . '"' . birds_chart_point_attrs( $d, $spec['unit'] ) . ' aria-label="' . esc_attr( $d['label'] . ': ' . birds_format_number( $d['value'], $spec['unit'] ) ) . '"></button>';
	}
	$out .= '</div><div class="birds-lc__labels">';
	foreach ( $spec['data'] as $i => $d ) {
		$out .= '<span style="left:' . esc_attr( $x( $i ) ) . '%">' . esc_html( $d['label'] ) . '</span>';
	}
	return $out . '</div></div></div>';
}

function birds_chart_pie( $spec, $has_bench ) {
	$palette = array( 'var(--birds-chart-1)', 'var(--birds-chart-2)', 'var(--birds-chart-3)', 'var(--birds-chart-4)', 'var(--birds-chart-5)' );
	$total   = array_sum( wp_list_pluck( $spec['data'], 'value' ) );
	$total   = $total > 0 ? $total : 1;
	$r       = 70;
	$c       = 2 * M_PI * $r;
	$acc     = 0;
	$first   = $spec['data'][0];
	$svg     = '<svg viewBox="0 0 200 200" aria-hidden="true">';
	$legend  = '<ul class="birds-pc__legend">';
	foreach ( $spec['data'] as $i => $d ) {
		$frac   = $d['value'] / $total;
		$color  = $d['color'] ? $d['color'] : $palette[ $i % count( $palette ) ];
		$svg   .= '<circle cx="100" cy="100" r="' . $r . '" data-i="' . $i . '" stroke="' . esc_attr( $color ) . '" stroke-dasharray="' . esc_attr( round( max( $frac * $c - 1.5, 0 ), 3 ) . ' ' . round( $c, 3 ) ) . '" stroke-dashoffset="' . esc_attr( round( -$acc * $c, 3 ) ) . '"/>';
		$legend .= '<li data-i="' . $i . '" tabindex="0"' . birds_chart_point_attrs( $d, $spec['unit'] ) . '><span><i style="background:' . esc_attr( $color ) . '"></i>' . esc_html( $d['label'] ) . '</span><b>' . esc_html( birds_format_number( $d['value'], $spec['unit'] ) ) . '</b></li>';
		$acc   += $frac;
	}
	$svg    .= '</svg>';
	$legend .= '</ul>';
	return '<div class="birds-pc"><div class="birds-pc__donut">' . $svg . '<div class="birds-pc__center"><strong data-pc-value>' . esc_html( birds_format_number( $first['value'], $spec['unit'] ) ) . '</strong><span data-pc-label>' . esc_html( $first['label'] ) . '</span></div></div>' . $legend . '</div>';
}
