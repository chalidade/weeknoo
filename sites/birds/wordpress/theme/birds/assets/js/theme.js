/*
 * Birds theme — header states, dropdowns, drawer, account menu, live search,
 * reading progress and the saved library page.
 */
( function () {
	'use strict';
	var cfg = window.BirdsTheme || {};
	var $ = function ( s, r ) { return ( r || document ).querySelector( s ); };
	var $$ = function ( s, r ) { return Array.prototype.slice.call( ( r || document ).querySelectorAll( s ) ); };
	var esc = function ( s ) { var d = document.createElement( 'div' ); d.textContent = s == null ? '' : String( s ); return d.innerHTML; };
	var header = $( '[data-birds-header]' );

	/* Solid header after scrolling. */
	if ( header ) {
		var onScroll = function () { header.classList.toggle( 'is-solid', window.scrollY > 24 ); };
		onScroll();
		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	/* Dropdowns: hover on desktop (CSS), click/keyboard everywhere. */
	function closeMenus( except ) {
		$$( '.birds-nav__item.is-open' ).forEach( function ( li ) {
			if ( li !== except ) { li.classList.remove( 'is-open' ); var b = $( '.birds-nav__link', li ); if ( b ) b.setAttribute( 'aria-expanded', 'false' ); }
		} );
	}
	document.addEventListener( 'click', function ( e ) {
		var btn = e.target.closest( '.birds-nav__item.has-dropdown > button.birds-nav__link' );
		if ( btn && ! btn.closest( '.birds-drawer' ) ) {
			var li = btn.parentNode, open = ! li.classList.contains( 'is-open' );
			closeMenus( li );
			li.classList.toggle( 'is-open', open );
			btn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			return;
		}
		if ( ! e.target.closest( '.birds-nav__panel' ) ) closeMenus();
		var acc = e.target.closest( '.birds-account__avatar' );
		$$( '.birds-account__menu' ).forEach( function ( m ) {
			var mine = acc && acc.parentNode.contains( m );
			if ( mine ) { m.hidden = ! m.hidden; acc.setAttribute( 'aria-expanded', m.hidden ? 'false' : 'true' ); }
			else if ( ! e.target.closest( '.birds-account__menu' ) ) m.hidden = true;
		} );
	} );

	/* Mobile drawer. */
	var burger = $( '.birds-burger' ), drawer = $( '#birds-drawer' );
	if ( burger && drawer ) {
		burger.addEventListener( 'click', function () {
			var open = drawer.hidden;
			drawer.hidden = ! open;
			burger.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			header.classList.toggle( 'is-open', open );
			document.documentElement.style.overflow = open ? 'hidden' : '';
		} );
	}

	/* Search overlay with live results from the REST API. */
	var search = $( '#birds-search' );
	function openSearch() {
		if ( ! search ) return;
		search.hidden = false;
		document.documentElement.style.overflow = 'hidden';
		setTimeout( function () { $( 'input', search ).focus(); }, 30 );
	}
	function closeSearch() {
		if ( ! search || search.hidden ) return;
		search.hidden = true;
		document.documentElement.style.overflow = '';
	}
	document.addEventListener( 'click', function ( e ) {
		if ( e.target.closest( '[data-birds-search-open]' ) ) openSearch();
		if ( e.target.closest( '[data-birds-search-close]' ) ) closeSearch();
	} );
	document.addEventListener( 'keydown', function ( e ) {
		var typing = e.target.closest && e.target.closest( 'input, textarea, select, [contenteditable]' );
		if ( e.key === '/' && ! typing ) { e.preventDefault(); openSearch(); }
		if ( e.key === 'Escape' ) { closeSearch(); closeMenus(); }
	} );
	if ( search && cfg.rest ) {
		var input = $( 'input', search ), list = $( '.birds-search__results', search ), count = $( '.birds-search__count', search ), browse = $( '.birds-search__browse', search );
		var timer, seq = 0;
		input.addEventListener( 'input', function () {
			clearTimeout( timer );
			var q = input.value.trim();
			browse.hidden = !! q;
			if ( ! q ) { list.innerHTML = ''; count.hidden = true; return; }
			timer = setTimeout( function () {
				var mine = ++seq;
				fetch( cfg.rest + 'posts?per_page=10&search=' + encodeURIComponent( q ) + '&_fields=id,link,title,birds' )
					.then( function ( r ) { return r.json(); } )
					.then( function ( posts ) {
						if ( mine !== seq || ! Array.isArray( posts ) ) return;
						count.hidden = false;
						count.textContent = posts.length + ' ' + ( posts.length === 1 ? cfg.strings.result : cfg.strings.results ) + ' “' + q + '”';
						list.innerHTML = posts.map( function ( p ) {
							var b = p.birds || {};
							return '<li><a href="' + esc( p.link ) + '"><span><span class="birds-kicker">' + esc( b.kicker || '' ) + '</span><strong>' + p.title.rendered + '</strong><small>' + esc( [ b.read_time, b.access === 'member' ? 'Member Briefing' : 'Free Access' ].filter( Boolean ).join( ' · ' ) ) + '</small></span><svg class="birds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a></li>';
						} ).join( '' );
					} )
					.catch( function () {} );
			}, 220 );
		} );
	}

	/* Reading progress. */
	var bar = $( '.birds-progress span' );
	if ( bar ) {
		var tick = function () {
			var h = document.documentElement.scrollHeight - window.innerHeight;
			bar.style.transform = 'scaleX(' + ( h > 0 ? Math.min( 1, window.scrollY / h ) : 0 ) + ')';
		};
		tick();
		window.addEventListener( 'scroll', tick, { passive: true } );
		window.addEventListener( 'resize', tick );
	}

	/* Saved library page. */
	function savedIds() {
		try { return JSON.parse( localStorage.getItem( 'birds:saved' ) || '[]' ).map( Number ).filter( Boolean ); } catch { return []; }
	}
	function renderSaved() {
		var page = $( '[data-birds-saved-page]' );
		if ( ! page ) return;
		var listEl = $( '[data-birds-saved-list]', page ), empty = $( '[data-birds-saved-empty]', page ), ids = savedIds();
		$$( '[data-birds-saved-count]', page ).forEach( function ( n ) { n.textContent = ids.length; } );
		if ( ! ids.length ) { listEl.innerHTML = ''; empty.hidden = false; return; }
		empty.hidden = true;
		fetch( cfg.rest + 'posts?per_page=100&include=' + ids.join( ',' ) + '&_fields=id,link,title,birds' )
			.then( function ( r ) { return r.json(); } )
			.then( function ( posts ) {
				var byId = {};
				( posts || [] ).forEach( function ( p ) { byId[ p.id ] = p; } );
				listEl.innerHTML = ids.map( function ( id ) {
					var p = byId[ id ];
					if ( ! p ) return '';
					return p.birds && p.birds.card ? p.birds.card : '<article class="birds-card"><h3 class="birds-card__title"><a href="' + esc( p.link ) + '">' + p.title.rendered + '</a></h3></article>';
				} ).join( '' );
				if ( window.Birds ) window.Birds.init( listEl );
			} );
	}
	renderSaved();
	document.addEventListener( 'birds:saved', renderSaved );

	/* Saved counter without the plugin (the plugin keeps it in sync otherwise). */
	if ( ! cfg.plugin ) $$( '[data-birds-saved-count]' ).forEach( function ( n ) { n.textContent = savedIds().length; } );
}() );
