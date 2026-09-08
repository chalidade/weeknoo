// build-theme.mjs — assemble a WordPress block theme from a prerendered site.
//
// Usage: node build-theme.mjs --site <dir> --sections <json> --css <file…>
//                             --out <dir> --slug <slug> --title <name>
//
// Inputs are the JSON produced by the SSR entry (one HTML string per section)
// and the site's compiled Tailwind CSS. Output is a complete block theme:
// theme.json carries the design tokens, patterns/ carry the sections, and
// templates/ compose them the way App.tsx does.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { parseHtml, walk, attr, setAttr, prune, serialize } from './lib/html.mjs'
import { sectionToBlocks, stripAnimationStyles } from './lib/blocks.mjs'

// --- arguments -------------------------------------------------------------

const argv = process.argv.slice(2)
const opt = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? null : argv[i + 1]
}
const optAll = (name) => {
  const out = []
  argv.forEach((a, i) => {
    if (a === `--${name}`) out.push(argv[i + 1])
  })
  return out
}

const siteDir = opt('site')
const sectionsFile = opt('sections')
const outDir = opt('out')
const slug = opt('slug')
const title = opt('title') ?? slug
const cssFiles = optAll('css')

if (!siteDir || !sectionsFile || !outDir || !slug) {
  console.error('usage: build-theme.mjs --site <dir> --sections <json> --out <dir> --slug <slug> [--title <name>] [--css <file>…]')
  process.exit(1)
}

const write = (relPath, content) => {
  const full = join(outDir, relPath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
}

// --- design tokens ---------------------------------------------------------

// Pull the `:root` custom properties out of src/index.css. They are the single
// source of truth for the palette in this workspace, so theme.json is derived
// from them rather than maintained separately.
function readTokens(css) {
  const start = css.indexOf(':root')
  if (start === -1) return {}
  const open = css.indexOf('{', start)
  let depth = 0
  let end = open
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) {
      end = i
      break
    }
  }
  const tokens = {}
  for (const m of css.slice(open + 1, end).matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[m[1]] = m[2].trim()
  }
  return tokens
}

const COLOR_TOKENS = [
  ['background', 'Background'], ['foreground', 'Foreground'],
  ['primary', 'Primary'], ['primary-foreground', 'Primary Foreground'],
  ['secondary', 'Secondary'], ['secondary-foreground', 'Secondary Foreground'],
  ['muted', 'Muted'], ['muted-foreground', 'Muted Foreground'],
  ['accent', 'Accent'], ['accent-foreground', 'Accent Foreground'],
  ['card', 'Card'], ['card-foreground', 'Card Foreground'],
  ['destructive', 'Destructive'], ['border', 'Border'], ['ring', 'Ring'],
]

const isColor = (v) => /^(oklch|oklab|hsl|hsla|rgb|rgba|color|lab|lch)\(|^#[0-9a-f]{3,8}$/i.test(v)

function buildThemeJson(tokens) {
  const palette = COLOR_TOKENS.filter(([t]) => tokens[t] && isColor(tokens[t])).map(([t, name]) => ({
    slug: t,
    name,
    color: tokens[t],
  }))

  const fontFamilies = []
  for (const [token, name, fslug] of [
    ['font-display', 'Display', 'display'],
    ['font-sans', 'Body', 'body'],
    ['font-serif', 'Serif', 'serif'],
    ['font-mono', 'Mono', 'mono'],
  ]) {
    if (tokens[token]) fontFamilies.push({ fontFamily: tokens[token], name, slug: fslug })
  }

  return {
    $schema: 'https://schemas.wp.org/trunk/theme.json',
    version: 3,
    settings: {
      appearanceTools: true,
      useRootPaddingAwareAlignments: false,
      layout: { contentSize: '100%', wideSize: '100%' },
      // The sections carry their own Tailwind spacing; block gap would add a
      // second, competing rhythm on top of it.
      spacing: { blockGap: null, units: ['px', 'rem', 'em', '%', 'vw', 'vh'] },
      color: {
        defaultPalette: false,
        defaultGradients: false,
        defaultDuotone: false,
        palette,
      },
      typography: {
        defaultFontSizes: false,
        fluid: false,
        ...(fontFamilies.length ? { fontFamilies } : {}),
      },
    },
    styles: {
      color: { background: 'var(--background)', text: 'var(--foreground)' },
      ...(tokens['font-sans'] ? { typography: { fontFamily: 'var(--font-sans)' } } : {}),
    },
  }
}

// --- assets ----------------------------------------------------------------

// Vite serves everything in public/ from the site root; under WordPress the
// same files live inside the theme, so root-relative URLs have to move with
// them.
function collectPublicFiles(dir, base = dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...collectPublicFiles(full, base))
    else out.push('/' + relative(base, full).split('\\').join('/'))
  }
  return out
}

const publicFiles = new Set(collectPublicFiles(join(siteDir, 'public')))
const publicBase = `/wp-content/themes/${slug}/public`

function rewriteAssetUrls(tree) {
  walk(tree, (node) => {
    for (const name of ['src', 'href', 'poster']) {
      const value = attr(node, name)
      if (value && publicFiles.has(value)) setAttr(node, name, publicBase + value)
    }
    const srcset = attr(node, 'srcset')
    if (srcset) {
      setAttr(
        node,
        'srcset',
        srcset
          .split(',')
          .map((part) => {
            const [url, ...rest] = part.trim().split(/\s+/)
            return [publicFiles.has(url) ? publicBase + url : url, ...rest].join(' ')
          })
          .join(', '),
      )
    }
  })
  return tree
}

// --- sections --------------------------------------------------------------

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-|-$/g, '')

const HEADER_NAMES = /^(navbar|nav|header|topbar|menubar|siteheader)$/i
const FOOTER_NAMES = /^footer$/i

const rendered = JSON.parse(readFileSync(sectionsFile, 'utf8'))

// React 19 renders resource hints (<link rel="preload">, <meta>) inline with
// the markup. They have to move to wp_head — a <link> stranded in the body is
// not what a theme should ship.
const HOISTED_TAGS = new Set(['link', 'meta', 'title', 'base'])
const hoisted = new Map()

// A navbar does not count towards "first section": whichever section leads the
// body is the one above the fold, and revealing that on scroll would just make
// the page start blank.
let bodyIndex = 0

const sections = rendered.map((section) => {
  const isHeader = HEADER_NAMES.test(section.name)
  const isFooter = FOOTER_NAMES.test(section.name)
  const tree = rewriteAssetUrls(stripAnimationStyles(parseHtml(section.html)))
  for (const node of prune(tree, (n) => HOISTED_TAGS.has(n.tagName))) {
    if (node.tagName !== 'title') hoisted.set(serialize(node), true)
  }
  const reveal = !isHeader && !isFooter && bodyIndex++ > 0
  return {
    ...section,
    slug: kebab(section.name),
    isHeader,
    isFooter,
    blocks: sectionToBlocks(tree, { reveal }),
  }
})

const header = sections.find((s) => s.isHeader)
const footer = sections.find((s) => s.isFooter)
const body = sections.filter((s) => !s.isHeader && !s.isFooter)

// --- cascade layers --------------------------------------------------------

// Tailwind v4 puts everything it emits inside @layer (properties, theme, base,
// components, utilities). WordPress's own block CSS is unlayered, and an
// unlayered rule beats every layered one no matter how weak its selector — so
// `:where(figure){margin:0 0 1em}` from core silently outranks Tailwind's
// preflight, and `.is-layout-flex > :is(*,div){margin:0}` outranks .mt-6.
// Unwrapping the layers puts both stylesheets back on equal footing, where
// ordinary specificity decides and the theme's utilities win as intended.
function stripCascadeLayers(css) {
  let out = ''
  let depth = 0
  const fromLayer = new Set()
  let i = 0

  while (i < css.length) {
    const c = css[i]

    // Escapes come first: Tailwind writes class names like
    // `.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]` and that \' must not
    // read as the start of a string.
    if (c === '\\') {
      out += css.slice(i, i + 2)
      i += 2
      continue
    }

    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < css.length && css[j] !== c) j += css[j] === '\\' ? 2 : 1
      out += css.slice(i, j + 1)
      i = j + 1
      continue
    }

    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      const stop = end === -1 ? css.length : end + 2
      out += css.slice(i, stop)
      i = stop
      continue
    }

    if (c === '@' && css.startsWith('@layer', i) && /[\s{;]/.test(css[i + 6] ?? '')) {
      let j = i + 6
      while (j < css.length && css[j] !== '{' && css[j] !== ';') j++
      if (css[j] === ';' || j >= css.length) {
        // A bare `@layer a, b;` only declares an order — nothing to keep.
        i = j + 1
      } else {
        depth++
        fromLayer.add(depth)
        i = j + 1
      }
      continue
    }

    if (c === '{') {
      depth++
      out += c
      i++
      continue
    }

    if (c === '}') {
      if (fromLayer.has(depth)) {
        fromLayer.delete(depth)
      } else {
        out += c
      }
      depth--
      i++
      continue
    }

    out += c
    i++
  }

  return out
}

// --- theme files -----------------------------------------------------------

const indexCss = existsSync(join(siteDir, 'src', 'index.css'))
  ? readFileSync(join(siteDir, 'src', 'index.css'), 'utf8')
  : ''
const tokens = readTokens(indexCss)

// Google Fonts links from the site's index.html carry over verbatim — the
// tokens reference those families by name.
const siteHtml = existsSync(join(siteDir, 'index.html'))
  ? readFileSync(join(siteDir, 'index.html'), 'utf8')
  : ''
const fontHrefs = [...siteHtml.matchAll(/href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"/g)].map((m) =>
  m[1].replace(/&amp;/g, '&'),
)
const description =
  (siteHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/) ?? [])[1] ??
  `Tema blok WordPress yang dibangkitkan dari situs ${title}.`

write(
  'style.css',
  `/*
Theme Name: ${title}
Theme URI: https://chalidade.github.io/weeknoo/${slug}/
Author: ${title}
Description: ${description}
Version: 1.0.0
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${slug}
Tags: full-site-editing, block-patterns, one-column, custom-colors, custom-menu

Dibangkitkan oleh scripts/build-wp.sh dari sites/${slug}. Jangan diedit tangan —
ubah situsnya, lalu bangkitkan ulang.
*/
`,
)

write('theme.json', JSON.stringify(buildThemeJson(tokens), null, 2) + '\n')

// Tailwind's own output first, then the handful of rules needed to stop
// WordPress's block CSS and the theme's utility classes fighting each other.
const interopCss = `
/* ------------------------------------------------------------------ */
/* WordPress interop — appended by scripts/wp/build-theme.mjs          */
/* ------------------------------------------------------------------ */

/* Everything above this line is Tailwind's output with its @layer wrappers
   unwrapped, so this file and WordPress's core block CSS compete on plain
   specificity. Keep the rules below narrow and specific for the same reason:
   a blanket reset here would outrank the utility classes on the sections. */

/* Everything WordPress renders that did not come from the React build — the
   page and post templates — is styled here, never with Tailwind utilities.
   Tailwind only compiles the classes it finds in the site's own source, so a
   utility the sections happen not to use simply would not exist. */
/* Sticky footer: App.tsx gives <main> a min-h-screen so a page never ends
   half-way down the window. WordPress splits the footer into a template part
   outside <main>, so the same intent is expressed on the page wrapper — this
   way a short page pushes the footer to the bottom instead of stretching
   <main> past it. */
.wp-site-blocks {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1 0 auto;
}

.site-content {
  box-sizing: border-box;
  width: 100%;
  max-width: 48rem;
  margin-inline: auto;
  padding: 6rem 1.5rem;
  min-height: 60vh;
}

.site-content .wp-block-post-title,
.site-content .site-title {
  font-family: var(--font-display, var(--font-sans, inherit));
  font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
  font-weight: 600;
  line-height: 1.1;
  margin-block: 0 1.5rem;
}

.site-content .wp-block-post-date {
  font-size: 0.875rem;
  color: var(--muted-foreground, inherit);
  margin-block: -1rem 2rem;
}

.site-content .wp-block-post-template {
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-content .wp-block-post-template > li + li {
  margin-block-start: 2.5rem;
}

.site-content .wp-block-post-template .wp-block-post-title {
  font-size: 1.5rem;
  margin-block: 0 0.5rem;
}

.site-content .wp-block-post-excerpt {
  color: var(--muted-foreground, inherit);
}

.site-content .wp-block-query-pagination {
  display: flex;
  gap: 0.75rem;
  margin-block-start: 3rem;
}

.site-content .wp-block-search {
  margin-block-end: 2.5rem;
}

.site-content .wp-block-search__button {
  border: 1px solid var(--border, currentColor);
  border-radius: var(--radius, 0.5rem);
  padding: 0.5rem 1rem;
  background: var(--secondary, transparent);
  color: inherit;
}

.site-content .wp-block-search__input {
  border: 1px solid var(--border, currentColor);
  border-radius: var(--radius, 0.5rem);
  padding: 0.5rem 0.75rem;
  background: var(--background, transparent);
  color: inherit;
}

/* Tailwind's preflight flattens headings and lists. That is right for the
   generated sections, and wrong for anything written in the WordPress
   editor — give post and page content its typography back. */
.wp-block-post-content h1 { font-size: 2.25rem; line-height: 1.15; font-weight: 600; margin-block: 1.5rem 0.75rem; }
.wp-block-post-content h2 { font-size: 1.75rem; line-height: 1.2; font-weight: 600; margin-block: 1.5rem 0.75rem; }
.wp-block-post-content h3 { font-size: 1.375rem; line-height: 1.3; font-weight: 600; margin-block: 1.25rem 0.5rem; }
.wp-block-post-content :is(h4, h5, h6) { font-size: 1.125rem; font-weight: 600; margin-block: 1rem 0.5rem; }
.wp-block-post-content p { margin-block: 0 1rem; line-height: 1.75; }
.wp-block-post-content ul { list-style: disc; padding-inline-start: 1.5rem; margin-block: 0 1rem; }
.wp-block-post-content ol { list-style: decimal; padding-inline-start: 1.5rem; margin-block: 0 1rem; }
.wp-block-post-content li { margin-block: 0.25rem; }
.wp-block-post-content a { text-decoration: underline; }
.wp-block-post-content blockquote { border-inline-start: 3px solid var(--border); padding-inline-start: 1rem; font-style: italic; margin-block: 1.5rem; }
.wp-block-post-content img { border-radius: var(--radius, 0.5rem); }

/* Sections fade in as they scroll into view — the block theme's stand-in for
   the Motion animations the React build runs. This is a scroll-driven CSS
   animation on purpose: a browser that does not support view() timelines
   simply shows the section, so content can never end up stranded invisible
   the way a JavaScript reveal can. */
@keyframes wp-reveal-in {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .wp-reveal {
      animation: wp-reveal-in linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 55%;
    }
  }
}
`

const compiledCss = cssFiles
  .filter((f) => f && existsSync(f))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')

if (!compiledCss) {
  console.error('error: no compiled CSS found — did the site build succeed?')
  process.exit(1)
}

const unlayered = stripCascadeLayers(compiledCss)
const braceBalance = (css) => css.split('{').length - css.split('}').length
if (unlayered.includes('@layer') || braceBalance(unlayered) !== braceBalance(compiledCss)) {
  console.error('error: could not unwrap Tailwind cascade layers cleanly — theme CSS would lose to core')
  process.exit(1)
}

write('assets/theme.css', unlayered + '\n' + interopCss)

const fontEnqueue = fontHrefs.length
  ? fontHrefs
      .map(
        (href, i) =>
          `    wp_enqueue_style( '${slug}-fonts${i ? `-${i + 1}` : ''}', '${href.replace(/'/g, "\\'")}', array(), null );`,
      )
      .join('\n')
  : '    // Situs ini tidak memuat webfont dari Google Fonts.'

write(
  'functions.php',
  `<?php
/**
 * ${title} — theme bootstrap.
 *
 * Generated by scripts/build-wp.sh. Regenerate rather than edit.
 *
 * @package ${slug}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'html5', array( 'style', 'script' ) );
		add_editor_style( 'assets/theme.css' );
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		$version = wp_get_theme()->get( 'Version' );

${fontEnqueue}

		// Depends on core's block and global styles so the theme's own rules
		// always win the cascade.
		wp_enqueue_style(
			'${slug}-theme',
			get_template_directory_uri() . '/assets/theme.css',
			array( 'wp-block-library', 'global-styles' ),
			$version
		);
	}
);

${
  hoisted.size
    ? `/**
 * Resource hints the React build emitted alongside the sections.
 */
add_action(
	'wp_head',
	function () {
		echo <<<'RESOURCE_HINTS'
${[...hoisted.keys()].join('\n')}

RESOURCE_HINTS;
	},
	5
);

`
    : ''
}`,
)

// --- patterns, parts, templates -------------------------------------------

const patternSlug = (s) => `${slug}/${s.slug}`

for (const section of sections) {
  write(
    `patterns/${section.slug}.php`,
    `<?php
/**
 * Title: ${section.name}
 * Slug: ${patternSlug(section)}
 * Categories: ${section.isHeader ? 'header' : section.isFooter ? 'footer' : 'featured'}
 * Description: Bagian ${section.name} dari ${title}.
 */

?>
${section.blocks}
`,
  )
}

if (header) write('parts/header.html', header.blocks + '\n')
if (footer) write('parts/footer.html', footer.blocks + '\n')

const headerPart = header ? `<!-- wp:template-part {"slug":"header","tagName":"div","area":"header"} /-->\n` : ''
const footerPart = footer ? `<!-- wp:template-part {"slug":"footer","tagName":"div","area":"footer"} /-->\n` : ''

// App.tsx wraps the body sections in <main className="min-h-screen">; the
// template has to do the same, or a short page lets the footer ride up.
write(
  'templates/index.html',
  headerPart +
    `<!-- wp:group {"tagName":"main","className":"site-main"} -->
<main class="wp-block-group site-main">
${body.map((s) => s.blocks).join('\n\n')}
</main>
<!-- /wp:group -->
` +
    footerPart,
)

const contentShell = (inner) =>
  headerPart +
  `<!-- wp:group {"tagName":"main","className":"site-content"} -->
<main class="wp-block-group site-content">
${inner}
</main>
<!-- /wp:group -->
` +
  footerPart

write(
  'templates/page.html',
  contentShell(`<!-- wp:post-title {"level":1} /-->
<!-- wp:post-content {"layout":{"type":"default"}} /-->`),
)

write(
  'templates/single.html',
  contentShell(`<!-- wp:post-title {"level":1} /-->
<!-- wp:post-date /-->
<!-- wp:post-content {"layout":{"type":"default"}} /-->`),
)

const loop = `<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":true}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:post-title {"isLink":true,"level":2} /-->
<!-- wp:post-excerpt /-->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->`

write('templates/archive.html', contentShell(loop))
write('templates/search.html', contentShell(`<!-- wp:search {"label":"Cari","showLabel":false,"buttonText":"Cari","placeholder":"Cari di situs ini…"} /-->\n${loop}`))
write(
  'templates/404.html',
  contentShell(`<!-- wp:heading {"level":1,"className":"site-title"} -->
<h1 class="wp-block-heading site-title">Halaman tidak ditemukan</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Coba cari, atau kembali ke beranda.</p>
<!-- /wp:paragraph -->
<!-- wp:search {"label":"Cari","showLabel":false,"buttonText":"Cari","placeholder":"Cari di situs ini…"} /-->`),
)

if (existsSync(join(siteDir, 'public'))) {
  cpSync(join(siteDir, 'public'), join(outDir, 'public'), { recursive: true })
}

// --- report ----------------------------------------------------------------

const count = (needle, haystack) => haystack.split(needle).length - 1
const allBlocks = sections.map((s) => s.blocks).join('\n')

console.log(`theme:     ${title} (${slug})`)
console.log(`sections:  ${sections.length}` +
  (header ? ` (header: ${header.name})` : '') +
  (footer ? ` (footer: ${footer.name})` : ''))
console.log(`patterns:  ${sections.map((s) => s.slug).join(', ')}`)
console.log(`palette:   ${buildThemeJson(tokens).settings.color.palette.length} warna, ` +
  `${buildThemeJson(tokens).settings.typography.fontFamilies?.length ?? 0} keluarga font`)
console.log(`blocks:    ${count('<!-- wp:heading', allBlocks)} heading, ` +
  `${count('<!-- wp:paragraph', allBlocks)} paragraf, ` +
  `${count('<!-- wp:group', allBlocks)} group, ` +
  `${count('<!-- wp:html', allBlocks)} html`)
if (fontHrefs.length) console.log(`fonts:     ${fontHrefs.length} tautan Google Fonts`)
