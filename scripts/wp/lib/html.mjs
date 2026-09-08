// html.mjs — a small parser for the HTML React's renderToStaticMarkup emits.
//
// That HTML is already well-formed and consistently quoted, so a full parser
// would be overkill; this one only has to be faithful enough to round-trip.
// Tag and attribute names keep their original case — SVG needs `viewBox` and
// `linearGradient` to survive untouched.

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

const RAW_TEXT = new Set(['script', 'style'])

const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f'

export function parseHtml(html) {
  const root = { tag: null, tagName: null, attrs: [], children: [] }
  const stack = [root]
  const top = () => stack[stack.length - 1]
  const pushText = (text) => {
    if (text) top().children.push({ text })
  }

  let i = 0
  while (i < html.length) {
    const lt = html.indexOf('<', i)
    if (lt === -1) {
      pushText(html.slice(i))
      break
    }
    if (lt > i) pushText(html.slice(i, lt))

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt)
      i = end === -1 ? html.length : end + 3
      continue
    }
    if (html.startsWith('<!', lt)) {
      const end = html.indexOf('>', lt)
      i = end === -1 ? html.length : end + 1
      continue
    }
    if (html[lt + 1] === '/') {
      const end = html.indexOf('>', lt)
      const name = html.slice(lt + 2, end === -1 ? html.length : end).trim().toLowerCase()
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tagName === name) {
          stack.length = k
          break
        }
      }
      i = end === -1 ? html.length : end + 1
      continue
    }

    const open = parseOpenTag(html, lt)
    const node = { tag: open.tag, tagName: open.tag.toLowerCase(), attrs: open.attrs, children: [] }
    top().children.push(node)
    i = open.end

    if (open.selfClose || VOID.has(node.tagName)) continue

    if (RAW_TEXT.has(node.tagName)) {
      const close = html.toLowerCase().indexOf(`</${node.tagName}`, i)
      node.children.push({ text: html.slice(i, close === -1 ? html.length : close) })
      if (close === -1) {
        i = html.length
      } else {
        const end = html.indexOf('>', close)
        i = end === -1 ? html.length : end + 1
      }
      continue
    }
    stack.push(node)
  }
  return root
}

function parseOpenTag(html, start) {
  let i = start + 1
  let tag = ''
  while (i < html.length && !isSpace(html[i]) && html[i] !== '>' && html[i] !== '/') tag += html[i++]

  const attrs = []
  while (i < html.length) {
    while (i < html.length && isSpace(html[i])) i++
    if (i >= html.length) break
    if (html[i] === '>') return { tag, attrs, selfClose: false, end: i + 1 }
    if (html[i] === '/' && html[i + 1] === '>') return { tag, attrs, selfClose: true, end: i + 2 }

    let name = ''
    while (i < html.length && !isSpace(html[i]) && html[i] !== '=' && html[i] !== '>' && html[i] !== '/') {
      name += html[i++]
    }
    while (i < html.length && isSpace(html[i])) i++

    let value = null
    if (html[i] === '=') {
      i++
      while (i < html.length && isSpace(html[i])) i++
      const quote = html[i]
      if (quote === '"' || quote === "'") {
        i++
        const end = html.indexOf(quote, i)
        value = html.slice(i, end === -1 ? html.length : end)
        i = end === -1 ? html.length : end + 1
      } else {
        value = ''
        while (i < html.length && !isSpace(html[i]) && html[i] !== '>') value += html[i++]
      }
    }
    if (name) attrs.push([name, value])
  }
  return { tag, attrs, selfClose: false, end: i }
}

export function serialize(node) {
  if (node.text !== undefined) return node.text
  if (node.tag === null) return node.children.map(serialize).join('')
  const attrs = node.attrs
    .map(([name, value]) => (value === null ? ` ${name}` : ` ${name}="${value}"`))
    .join('')
  if (VOID.has(node.tagName)) return `<${node.tag}${attrs}/>`
  return `<${node.tag}${attrs}>${node.children.map(serialize).join('')}</${node.tag}>`
}

export const attr = (node, name) => {
  const found = node.attrs?.find(([n]) => n.toLowerCase() === name)
  return found ? found[1] : null
}

export function setAttr(node, name, value) {
  const found = node.attrs.find(([n]) => n.toLowerCase() === name)
  if (found) found[1] = value
  else node.attrs.push([name, value])
}

export function removeAttr(node, name) {
  node.attrs = node.attrs.filter(([n]) => n.toLowerCase() !== name)
}

export function walk(node, visit) {
  if (node.tag !== null && node.text === undefined) visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

export { VOID }

// Remove every node matching `predicate` from the tree, returning them in
// document order. React 19 renders <link>/<meta> resource hints inline; in a
// WordPress theme those belong in wp_head, not in the middle of a section.
export function prune(node, predicate, collected = []) {
  if (!node.children) return collected
  node.children = node.children.filter((child) => {
    if (child.text !== undefined) return true
    if (predicate(child)) {
      collected.push(child)
      return false
    }
    prune(child, predicate, collected)
    return true
  })
  return collected
}
