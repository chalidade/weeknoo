// blocks.mjs — turn prerendered section HTML into WordPress block markup.
//
// The goal is editable-where-it-is-safe. A node becomes a real core block only
// when the block's save() output is provably identical to the markup we already
// have — otherwise WordPress flags it as "unexpected or invalid content" in the
// editor. Everything else is wrapped in core/html, which renders verbatim and
// never invalidates. In practice that makes headings, paragraphs and the
// structural containers editable, and leaves icons, images and mixed inline
// content exactly as the React build produced them.

import { serialize, attr, setAttr, walk } from './html.mjs'

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

// core/group only accepts these as tagName.
const GROUP_TAGS = new Set(['div', 'section', 'header', 'footer', 'main', 'article', 'aside'])

// What may appear inside a rich-text block without WordPress rewriting it.
const INLINE = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'del', 'em', 'i', 'ins',
  'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong',
  'sub', 'sup', 'time', 'u', 'var', 'wbr',
])

// Attributes a converted block can carry: class becomes `className`, id becomes
// `anchor`. Anything else (data-*, style, aria-*, role…) would not round-trip.
const KEEPABLE = new Set(['class', 'id'])

const isBlank = (node) => node.text !== undefined && node.text.trim() === ''
const elements = (node) => node.children.filter((c) => c.text === undefined)

function keepableAttrsOnly(node) {
  return node.attrs.every(([name]) => KEEPABLE.has(name.toLowerCase()))
}

function inlineOnly(node) {
  for (const child of node.children) {
    if (child.text !== undefined) continue
    if (!INLINE.has(child.tagName)) return false
    if (!inlineOnly(child)) return false
  }
  return true
}

function blockAttrs(node, extra = {}) {
  const attrs = { ...extra }
  const className = attr(node, 'class')
  if (className) attrs.className = className
  const anchor = attr(node, 'id')
  if (anchor) attrs.anchor = anchor
  return attrs
}

const comment = (name, attrs) => {
  const json = Object.keys(attrs).length ? ` ${JSON.stringify(attrs)}` : ''
  return `<!-- wp:${name}${json} -->`
}

const wrap = (name, attrs, inner, indent) => {
  const pad = '  '.repeat(indent)
  return `${pad}${comment(name, attrs)}\n${pad}${inner}\n${pad}<!-- /wp:${name} -->`
}

// Prepend WordPress's own generated class, the way the block's save() does.
function withGeneratedClass(node, generated) {
  const current = attr(node, 'class')
  setAttr(node, 'class', current ? `${generated} ${current}` : generated)
}

function html(node, indent) {
  return wrap('html', {}, serialize(node), indent)
}

function convert(node, indent) {
  if (node.text !== undefined) {
    return isBlank(node) ? '' : wrap('html', {}, node.text, indent)
  }

  if (!keepableAttrsOnly(node)) return html(node, indent)

  if (HEADINGS.has(node.tagName) && inlineOnly(node)) {
    const attrs = blockAttrs(node, { level: Number(node.tagName[1]) })
    withGeneratedClass(node, 'wp-block-heading')
    return wrap('heading', attrs, serialize(node), indent)
  }

  if (node.tagName === 'p' && inlineOnly(node)) {
    return wrap('paragraph', blockAttrs(node), serialize(node), indent)
  }

  if (GROUP_TAGS.has(node.tagName)) {
    const kids = elements(node)
    const hasLooseText = node.children.some((c) => c.text !== undefined && c.text.trim() !== '')
    if (kids.length > 0 && !hasLooseText) {
      const inner = kids.map((k) => convert(k, indent + 1)).filter(Boolean)
      if (inner.length === kids.length) {
        const attrs = blockAttrs(node, node.tagName === 'div' ? {} : { tagName: node.tagName })
        withGeneratedClass(node, 'wp-block-group')
        const open = `<${node.tag}${node.attrs.map(([n, v]) => (v === null ? ` ${n}` : ` ${n}="${v}"`)).join('')}>`
        const pad = '  '.repeat(indent)
        return [
          `${pad}${comment('group', attrs)}`,
          `${pad}${open}`,
          inner.join('\n'),
          `${pad}</${node.tag}>`,
          `${pad}<!-- /wp:group -->`,
        ].join('\n')
      }
    }
  }

  return html(node, indent)
}

// Motion renders its `initial` state as inline styles, which server-side means
// the section ships invisible. Drop those declarations — the theme fades
// sections in with assets/reveal.js instead.
export function stripAnimationStyles(tree) {
  walk(tree, (node) => {
    const style = attr(node, 'style')
    if (!style) return
    const kept = style
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .filter((decl) => {
        const [prop, ...rest] = decl.split(':')
        const name = prop.trim().toLowerCase()
        const value = rest.join(':').trim().toLowerCase()
        if (name === 'will-change') return false
        if (name === 'opacity') return !/^0(\.\d+)?$/.test(value)
        if (name === 'transform' || name === '-webkit-transform') {
          return !/translate|scale|rotate|skew|matrix|perspective/.test(value)
        }
        return true
      })
    node.attrs = node.attrs.filter(([n]) => n.toLowerCase() !== 'style')
    if (kept.length) node.attrs.push(['style', `${kept.join('; ')};`])
  })
  return tree
}

// A section renders as a single root element; give it the reveal hook and hand
// the whole thing to the converter.
export function sectionToBlocks(tree, { reveal = false } = {}) {
  const roots = elements(tree)
  if (roots.length === 0) return ''
  if (reveal) {
    for (const root of roots) {
      const current = attr(root, 'class')
      setAttr(root, 'class', current ? `${current} wp-reveal` : 'wp-reveal')
    }
  }
  return roots.map((root) => convert(root, 0)).join('\n')
}
