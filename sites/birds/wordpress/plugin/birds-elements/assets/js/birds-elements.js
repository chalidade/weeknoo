/*
 * Birds Elements — front-end behaviour (no dependencies).
 * Charts, carousel, hero video, saved library, dialogs, membership,
 * sharing, narration and PDF export. Exposed as window.Birds.
 */
( function () {
	'use strict';

	var cfg = window.BirdsElements || { ajaxUrl: '', nonce: '', loggedIn: false };
	var SAVED_KEY = 'birds:saved';
	var $ = function ( sel, root ) { return ( root || document ).querySelector( sel ); };
	var $$ = function ( sel, root ) { return Array.prototype.slice.call( ( root || document ).querySelectorAll( sel ) ); };
	document.documentElement.classList.remove( 'no-js' );

	/* ------------------------------------------------------------- toast */
	function toast( message ) {
		var box = $( '.birds-toasts' );
		if ( ! box ) {
			box = document.createElement( 'div' );
			box.className = 'birds-toasts';
			document.body.appendChild( box );
		}
		var el = document.createElement( 'div' );
		el.className = 'birds-toast';
		el.innerHTML = '<svg class="birds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
		el.appendChild( document.createTextNode( message ) );
		box.appendChild( el );
		setTimeout( function () {
			el.classList.add( 'is-leaving' );
			setTimeout( function () { el.remove(); }, 220 );
		}, 2600 );
	}

	/* ------------------------------------------------------------ reveal */
	var io = 'IntersectionObserver' in window ? new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( e ) {
			if ( e.isIntersecting ) {
				e.target.classList.add( 'is-in' );
				io.unobserve( e.target );
			}
		} );
	}, { rootMargin: '0px 0px -60px 0px' } ) : null;

	function reveal( root ) {
		$$( '.birds-reveal, [data-birds-chart]', root ).forEach( function ( el ) {
			if ( io ) io.observe( el ); else el.classList.add( 'is-in' );
		} );
	}

	/* ------------------------------------------------------------ charts */
	function tipHtml( el, chart ) {
		var html = '<b>' + esc( el.dataset.label ) + '</b><span>' + esc( chart.dataset.valueLabel || '' ) + ': ' + esc( el.dataset.value ) + '</span>';
		if ( el.dataset.benchmark ) html += '<span class="is-bench">' + esc( chart.dataset.benchmarkLabel || '' ) + ': ' + esc( el.dataset.benchmark ) + '</span>';
		return html;
	}
	function esc( s ) {
		var d = document.createElement( 'div' );
		d.textContent = s == null ? '' : String( s );
		return d.innerHTML;
	}

	function initChart( chart ) {
		if ( chart.dataset.ready ) return;
		chart.dataset.ready = '1';
		var body = $( '.birds-chart__body', chart );
		var tip = document.createElement( 'div' );
		tip.className = 'birds-tip';
		tip.hidden = true;

		function clear() {
			chart.classList.remove( 'is-hovering' );
			$$( '.is-active', chart ).forEach( function ( n ) { n.classList.remove( 'is-active' ); } );
			tip.hidden = true;
			var cur = $( '.birds-lc__cursor', chart );
			if ( cur ) cur.remove();
		}

		// Column chart: tooltip above the group.
		$$( '.birds-cc__group', chart ).forEach( function ( g ) {
			var show = function () {
				clear();
				chart.classList.add( 'is-hovering' );
				g.classList.add( 'is-active' );
				var bars = $$( '.birds-cc__bar', g );
				var top = Math.max.apply( null, bars.map( function ( b ) { return parseFloat( b.style.getPropertyValue( '--h' ) ) || 0; } ) );
				tip.innerHTML = tipHtml( g, chart );
				tip.style.left = '50%';
				tip.style.top = ( 100 - top - 6 ) + '%';
				g.appendChild( tip );
				tip.hidden = false;
			};
			g.addEventListener( 'mouseenter', show );
			g.addEventListener( 'focus', show );
			g.addEventListener( 'click', show );
			g.addEventListener( 'mouseleave', clear );
			g.addEventListener( 'blur', clear );
		} );

		// Bar chart: highlight row (values are printed inline).
		$$( '.birds-bc__row', chart ).forEach( function ( r ) {
			var on = function () { clear(); chart.classList.add( 'is-hovering' ); r.classList.add( 'is-active' ); };
			r.addEventListener( 'mouseenter', on );
			r.addEventListener( 'focus', on );
			r.addEventListener( 'mouseleave', clear );
			r.addEventListener( 'blur', clear );
		} );

		// Line chart: vertical cursor + tooltip per x position.
		var plot = $( '.birds-lc__plot', chart );
		if ( plot ) {
			var dots = $$( '.birds-lc__dot:not(.is-bench)', plot );
			$$( '.birds-lc__hit', plot ).forEach( function ( h, i ) {
				var show = function () {
					clear();
					if ( dots[ i ] ) dots[ i ].classList.add( 'is-active' );
					var x = parseFloat( h.dataset.x );
					var cur = document.createElement( 'div' );
					cur.className = 'birds-lc__cursor';
					cur.style.left = x + '%';
					plot.appendChild( cur );
					tip.innerHTML = tipHtml( h, chart );
					tip.style.left = Math.min( Math.max( x, 12 ), 88 ) + '%';
					tip.style.top = ( 100 - parseFloat( h.dataset.top ) - 8 ) + '%';
					plot.appendChild( tip );
					tip.hidden = false;
				};
				h.addEventListener( 'mouseenter', show );
				h.addEventListener( 'focus', show );
				h.addEventListener( 'click', show );
			} );
			plot.addEventListener( 'mouseleave', clear );
		}

		// Donut: centre label follows the hovered slice or legend row.
		var donut = $( '.birds-pc', chart );
		if ( donut ) {
			var val = $( '[data-pc-value]', donut ), lab = $( '[data-pc-label]', donut );
			var rows = $$( '.birds-pc__legend li', donut ), arcs = $$( 'circle', donut );
			var first = { v: val.textContent, l: lab.textContent };
			var on = function ( i ) {
				clear();
				chart.classList.add( 'is-hovering' );
				if ( arcs[ i ] ) arcs[ i ].classList.add( 'is-active' );
				if ( rows[ i ] ) {
					rows[ i ].classList.add( 'is-active' );
					val.textContent = rows[ i ].dataset.value;
					lab.textContent = rows[ i ].dataset.label;
				}
			};
			var off = function () { clear(); val.textContent = first.v; lab.textContent = first.l; };
			rows.concat( arcs ).forEach( function ( n ) {
				var i = parseInt( n.dataset.i, 10 );
				n.addEventListener( 'mouseenter', function () { on( i ); } );
				n.addEventListener( 'focus', function () { on( i ); } );
				n.addEventListener( 'click', function () { on( i ); } );
				n.addEventListener( 'mouseleave', off );
				n.addEventListener( 'blur', off );
			} );
		}
		if ( body ) body.addEventListener( 'mouseleave', clear );
	}

	/* ---------------------------------------------------------- carousel */
	function initCarousel( root ) {
		if ( root.dataset.ready ) return;
		root.dataset.ready = '1';
		var track = $( '.birds-carousel__track', root );
		var slides = $$( '.birds-carousel__slide', root );
		var dots = $$( '.birds-carousel__dots button', root );
		var count = $( '[data-current]', root );
		var stage = $( '.birds-carousel__stage', root );
		var index = 0;
		if ( slides.length < 2 ) return;

		function go( i ) {
			index = ( i + slides.length ) % slides.length;
			track.style.transform = 'translateX(' + ( -100 * index ) + '%)';
			slides.forEach( function ( s, k ) { s.setAttribute( 'aria-hidden', k === index ? 'false' : 'true' ); } );
			dots.forEach( function ( d, k ) { d.setAttribute( 'aria-selected', k === index ? 'true' : 'false' ); } );
			if ( count ) count.textContent = String( index + 1 ).padStart( 2, '0' );
		}
		$$( '.birds-carousel__nav', root ).forEach( function ( b ) {
			b.addEventListener( 'click', function () { go( index + parseInt( b.dataset.dir, 10 ) ); } );
		} );
		dots.forEach( function ( d ) { d.addEventListener( 'click', function () { go( parseInt( d.dataset.index, 10 ) ); } ); } );
		root.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'ArrowRight' ) go( index + 1 );
			if ( e.key === 'ArrowLeft' ) go( index - 1 );
		} );

		// Swipe / drag.
		var startX = null, dx = 0;
		stage.addEventListener( 'pointerdown', function ( e ) {
			if ( e.target.closest( 'button' ) ) return;
			startX = e.clientX; dx = 0;
			track.style.transition = 'none';
			stage.setPointerCapture( e.pointerId );
		} );
		stage.addEventListener( 'pointermove', function ( e ) {
			if ( startX === null ) return;
			dx = e.clientX - startX;
			track.style.transform = 'translateX(calc(' + ( -100 * index ) + '% + ' + dx + 'px))';
		} );
		var end = function () {
			if ( startX === null ) return;
			track.style.transition = '';
			startX = null;
			if ( dx < -60 ) go( index + 1 ); else if ( dx > 60 ) go( index - 1 ); else go( index );
		};
		stage.addEventListener( 'pointerup', end );
		stage.addEventListener( 'pointercancel', end );
	}

	/* ------------------------------------------------------- hero video */
	function initVideo( root ) {
		var media = root.closest ? root : document;
		$$( '.birds-hero-media', media ).forEach( function ( m ) {
			var v = $( 'video', m );
			if ( ! v || m.dataset.ready ) return;
			m.dataset.ready = '1';
			if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) v.pause();
			var play = $( '[data-birds-video="play"]', m ), mute = $( '[data-birds-video="mute"]', m );
			var sync = function () {
				if ( play ) {
					play.setAttribute( 'aria-pressed', v.paused ? 'true' : 'false' );
					play.setAttribute( 'aria-label', v.paused ? 'Play video' : 'Pause video' );
				}
				if ( mute ) {
					mute.setAttribute( 'aria-pressed', v.muted ? 'false' : 'true' );
					mute.setAttribute( 'aria-label', v.muted ? 'Unmute video' : 'Mute video' );
				}
			};
			if ( play ) play.addEventListener( 'click', function () { if ( v.paused ) v.play(); else v.pause(); } );
			if ( mute ) mute.addEventListener( 'click', function () { v.muted = ! v.muted; sync(); } );
			v.addEventListener( 'play', sync );
			v.addEventListener( 'pause', sync );
			sync();
		} );
	}

	/* ------------------------------------------------------------- saved */
	function getSaved() {
		try { return JSON.parse( localStorage.getItem( SAVED_KEY ) || '[]' ).map( Number ).filter( Boolean ); } catch { return []; }
	}
	function setSaved( ids ) {
		try { localStorage.setItem( SAVED_KEY, JSON.stringify( ids ) ); } catch { /* private mode */ }
		syncSaved();
		document.dispatchEvent( new CustomEvent( 'birds:saved', { detail: ids } ) );
	}
	function syncSaved() {
		var ids = getSaved();
		$$( '[data-birds-save]' ).forEach( function ( b ) {
			var on = ids.indexOf( Number( b.dataset.birdsSave ) ) > -1;
			b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			var label = $( 'span[data-on]', b );
			if ( label ) label.textContent = on ? label.dataset.on : label.dataset.off;
		} );
		$$( '[data-birds-saved-count]' ).forEach( function ( n ) { n.textContent = ids.length; } );
	}
	document.addEventListener( 'click', function ( e ) {
		var b = e.target.closest( '[data-birds-save]' );
		if ( ! b ) return;
		e.preventDefault();
		var id = Number( b.dataset.birdsSave ), ids = getSaved(), at = ids.indexOf( id );
		if ( at > -1 ) { ids.splice( at, 1 ); toast( 'Removed from your library' ); } else { ids.unshift( id ); toast( 'Saved to your library' ); }
		setSaved( ids );
	} );

	/* ----------------------------------------------------------- dialogs */
	var lastFocus = null;
	function openDialog( id ) {
		var d = document.getElementById( id );
		if ( ! d ) return null;
		lastFocus = document.activeElement;
		d.hidden = false;
		document.documentElement.classList.add( 'birds-locked' );
		requestAnimationFrame( function () { d.classList.add( 'is-open' ); } );
		setTimeout( function () {
			var f = $( 'input:not([type=hidden]):not(.birds-hp):not([hidden] *)', d ) || $( 'button', d );
			if ( f && f.offsetParent ) f.focus();
		}, 60 );
		return d;
	}
	function closeDialog( d ) {
		if ( ! d || d.hidden ) return;
		d.classList.remove( 'is-open' );
		document.documentElement.classList.remove( 'birds-locked' );
		setTimeout( function () { d.hidden = true; }, 200 );
		if ( lastFocus && lastFocus.focus ) lastFocus.focus();
	}
	document.addEventListener( 'click', function ( e ) {
		if ( e.target.closest( '[data-birds-close]' ) ) closeDialog( e.target.closest( '.birds-dialog' ) );
		else if ( e.target.classList && e.target.classList.contains( 'birds-dialog' ) ) closeDialog( e.target );
	} );
	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Escape' ) $$( '.birds-dialog.is-open' ).forEach( closeDialog );
	} );

	/* -------------------------------------------------------- membership */
	var REASONS = {
		pdf: 'The executive PDF dossier is a member benefit. Join free in one step — no payment needed.'
	};
	function setMode( d, mode ) {
		d.dataset.mode = mode;
		$$( '[data-only]', d ).forEach( function ( n ) { n.hidden = n.dataset.only !== mode; } );
		var h = $( 'h2', d ), btn = $( 'button[type=submit]', d );
		h.textContent = h.dataset[ mode ];
		btn.textContent = btn.dataset[ mode ];
		var err = $( '.birds-form__error', d );
		err.hidden = true;
	}
	function openAuth( mode, reason ) {
		if ( cfg.loggedIn ) { toast( 'You already have full access' ); return; }
		var d = document.getElementById( 'birds-auth' );
		if ( ! d ) return;
		setMode( d, mode || 'join' );
		var lead = $( '.birds-dialog__lead', d );
		lead.textContent = ( reason && REASONS[ reason ] ) || lead.dataset.default;
		openDialog( 'birds-auth' );
	}
	document.addEventListener( 'click', function ( e ) {
		var t = e.target.closest( '[data-birds-auth]' );
		if ( t ) { e.preventDefault(); openAuth( t.dataset.birdsAuth, t.dataset.birdsReason ); return; }
		var m = e.target.closest( '[data-birds-mode]' );
		if ( m ) setMode( document.getElementById( 'birds-auth' ), m.dataset.birdsMode );
	} );
	document.addEventListener( 'submit', function ( e ) {
		var form = e.target.closest( '#birds-auth form' );
		if ( ! form ) return;
		e.preventDefault();
		var d = document.getElementById( 'birds-auth' );
		var mode = d.dataset.mode || 'join';
		var err = $( '.birds-form__error', form ), btn = $( 'button[type=submit]', form );
		var data = new FormData( form );
		var email = String( data.get( 'email' ) || '' ).trim();
		var fail = function ( msg ) { err.textContent = msg; err.hidden = false; };
		if ( ! /^\S+@\S+\.\S+$/.test( email ) ) return fail( 'Please enter a valid work email.' );
		if ( mode === 'join' && String( data.get( 'name' ) || '' ).trim().length < 2 ) return fail( 'Please enter your full name.' );
		if ( mode === 'signin' && ! data.get( 'password' ) ) return fail( 'Please enter your password.' );
		data.append( 'action', mode === 'join' ? 'birds_join' : 'birds_signin' );
		data.append( 'nonce', cfg.nonce );
		btn.disabled = true;
		fetch( cfg.ajaxUrl, { method: 'POST', body: data, credentials: 'same-origin' } )
			.then( function ( r ) { return r.json(); } )
			.then( function ( res ) {
				if ( res && res.success ) {
					toast( res.data.message );
					setTimeout( function () { window.location.reload(); }, 700 );
				} else {
					btn.disabled = false;
					fail( ( res && res.data && res.data.message ) || 'Something went wrong. Please try again.' );
					if ( res && res.data && res.data.mode ) setTimeout( function () { setMode( d, res.data.mode ); $( '[name=email]', form ).value = email; fail( res.data.message ); }, 0 );
				}
			} )
			.catch( function () { btn.disabled = false; fail( 'Network error. Please try again.' ); } );
	} );

	/* ------------------------------------------------------------- share */
	document.addEventListener( 'click', function ( e ) {
		var t = e.target.closest( '[data-birds-share]' );
		if ( ! t ) return;
		var bar = t.closest( '[data-url]' ) || document.body;
		var url = bar.dataset.url || window.location.href;
		var title = bar.dataset.title || document.title;
		var deck = bar.dataset.deck || '';
		var d = document.getElementById( 'birds-share' );
		if ( ! d ) return;
		$( '.birds-share__title', d ).textContent = title;
		$( '.birds-share__copy input', d ).value = url;
		var enc = encodeURIComponent;
		$( '[data-share="linkedin"]', d ).href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc( url );
		$( '[data-share="x"]', d ).href = 'https://twitter.com/intent/tweet?text=' + enc( title ) + '&url=' + enc( url );
		$( '[data-share="email"]', d ).href = 'mailto:?subject=' + enc( title ) + '&body=' + enc( ( deck ? deck + '\n\n' : '' ) + url );
		openDialog( 'birds-share' );
	} );
	document.addEventListener( 'click', function ( e ) {
		var b = e.target.closest( '[data-birds-copy]' );
		if ( ! b ) return;
		var input = $( 'input', b.parentNode );
		var done = function () {
			var label = $( 'span', b ), old = label.textContent;
			label.textContent = 'Copied';
			toast( 'Link copied to clipboard' );
			setTimeout( function () { label.textContent = old; }, 2000 );
		};
		if ( navigator.clipboard && window.isSecureContext ) navigator.clipboard.writeText( input.value ).then( done, function () { input.select(); document.execCommand( 'copy' ); done(); } );
		else { input.select(); document.execCommand( 'copy' ); done(); }
	} );

	/* --------------------------------------------------------- narration */
	var speaking = null;
	document.addEventListener( 'click', function ( e ) {
		var b = e.target.closest( '[data-birds-listen]' );
		if ( ! b ) return;
		if ( ! ( 'speechSynthesis' in window ) ) { toast( 'Audio narration is not supported in this browser' ); return; }
		var synth = window.speechSynthesis;
		var label = $( 'span[data-on]', b );
		var set = function ( on ) {
			b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			if ( label ) label.textContent = on ? label.dataset.on : label.dataset.off;
		};
		if ( speaking ) { synth.cancel(); speaking = null; set( false ); return; }
		var head = b.closest( '.birds-article-head' );
		var body = $( '.birds-article-body' ) || $( '.entry-content' ) || $( 'article' );
		var parts = [];
		if ( head ) parts.push( $( '.birds-article-head__title', head ).textContent, ( $( '.birds-article-head__deck', head ) || { textContent: '' } ).textContent );
		if ( body ) $$( 'h2, h3, p', body ).forEach( function ( n ) {
			if ( ! n.closest( '.birds-chart, .birds-gate, .birds-carousel, .birds-person' ) ) parts.push( n.textContent );
		} );
		var u = new SpeechSynthesisUtterance( parts.filter( Boolean ).join( '. ' ) );
		u.lang = document.documentElement.lang || 'en-GB';
		var voices = synth.getVoices();
		var v = voices.filter( function ( x ) { return x.lang.indexOf( 'en-GB' ) === 0; } )[ 0 ] || voices.filter( function ( x ) { return x.lang.indexOf( 'en' ) === 0; } )[ 0 ];
		if ( v ) u.voice = v;
		u.onend = u.onerror = function () { speaking = null; set( false ); };
		synth.cancel();
		synth.speak( u );
		speaking = u;
		set( true );
	} );
	window.addEventListener( 'pagehide', function () { if ( speaking ) window.speechSynthesis.cancel(); } );

	/* --------------------------------------------------------------- pdf */
	document.addEventListener( 'click', function ( e ) {
		if ( ! e.target.closest( '[data-birds-pdf]' ) ) return;
		var bar = e.target.closest( '[data-title]' );
		var prev = document.title;
		document.title = 'Executive Dossier — ' + ( bar ? bar.dataset.title : prev );
		$$( '.birds-chart' ).forEach( function ( c ) { c.classList.add( 'is-in' ); } );
		toast( 'Preparing your executive PDF — choose “Save as PDF”' );
		setTimeout( function () {
			window.print();
			document.title = prev;
		}, 350 );
	} );

	/* --------------------------------------------------- series filters */
	function initFilter( root ) {
		if ( root.dataset.ready ) return;
		root.dataset.ready = '1';
		var empty = $( '[data-filter-empty]', root );
		$$( '.birds-chips button', root ).forEach( function ( chip ) {
			chip.addEventListener( 'click', function () {
				var f = chip.dataset.filter, shown = 0;
				$$( '.birds-chips button', root ).forEach( function ( c ) { c.setAttribute( 'aria-selected', c === chip ? 'true' : 'false' ); } );
				$$( '.birds-card, .birds-row', root ).forEach( function ( card ) {
					var ok = ! f || card.dataset.category === f;
					card.hidden = ! ok;
					if ( ok ) shown++;
				} );
				if ( empty ) empty.hidden = shown > 0;
			} );
		} );
	}

	/* -------------------------------------------------------------- init */
	function init( root ) {
		root = root || document;
		reveal( root );
		$$( '[data-birds-chart]', root ).forEach( initChart );
		$$( '[data-birds-carousel]', root ).forEach( initCarousel );
		$$( '[data-birds-filter]', root ).forEach( initFilter );
		initVideo( root );
		syncSaved();
	}

	window.Birds = { init: init, toast: toast, openAuth: openAuth, getSaved: getSaved, setSaved: setSaved };
	window.addEventListener( 'beforeprint', function () { $$( '.birds-chart' ).forEach( function ( c ) { c.classList.add( 'is-in' ); } ); } );

	if ( document.readyState === 'loading' ) document.addEventListener( 'DOMContentLoaded', function () { init(); } );
	else init();

	// Elementor editor: widgets re-render in place, so re-run on each one.
	window.addEventListener( 'elementor/frontend/init', function () {
		if ( ! window.elementorFrontend || ! window.elementorFrontend.hooks ) return;
		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function ( $scope ) {
			init( $scope && $scope[ 0 ] ? $scope[ 0 ] : document );
			$$( '.birds-reveal, [data-birds-chart]', $scope && $scope[ 0 ] ).forEach( function ( n ) { n.classList.add( 'is-in' ); } );
		} );
	} );
}() );
