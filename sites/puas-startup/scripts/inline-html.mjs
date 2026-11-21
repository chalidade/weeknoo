// Folds a built site (vite build --base=./ with PUAS_SINGLE=1) into one HTML
// file. Usage: node scripts/inline-html.mjs <distDir> <outFile> <siteUrl>
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const [dist, out, siteUrl = 'https://startup.puas.academy/'] = process.argv.slice(2)
if (!dist || !out) throw new Error('usage: inline-html.mjs <distDir> <outFile> [siteUrl]')

const MIME = { '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' }
const dataUri = async (file) =>
  `data:${MIME[path.extname(file)]};base64,${(await readFile(file)).toString('base64')}`

let html = await readFile(path.join(dist, 'index.html'), 'utf8')
const assets = await readdir(path.join(dist, 'assets'))

// --- stylesheet: keep the Latin font only and embed it
const cssTag = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+)"[^>]*>/)
let css = await readFile(path.join(dist, cssTag[1]), 'utf8')
const latin = assets.find((f) => /-latin-wght-normal-[^.]+\.woff2$/.test(f))
const latinUri = await dataUri(path.join(dist, 'assets', latin))
css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) =>
  block.includes(latin) ? block.replace(/url\([^)]*\)\s*format\([^)]*\)/, `url(${latinUri}) format("woff2")`) : '',
)
if (/url\((?!data:)/.test(css)) throw new Error('stylesheet still points at a file')

// --- script: one bundle, with the logo embedded
const jsTag = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+)"[^>]*><\/script>/)
const scripts = assets.filter((f) => f.endsWith('.js'))
if (scripts.length !== 1) throw new Error(`expected one script, found ${scripts.length}: build with PUAS_SINGLE=1`)
let js = await readFile(path.join(dist, jsTag[1]), 'utf8')

const logo = await dataUri(path.join(dist, 'puas-logo.webp'))
js = js.replace(/([`"'])\.\/puas-logo\.webp\1/g, JSON.stringify(logo))
html = html.replaceAll('"./puas-logo.webp"', JSON.stringify(logo))
html = html.replace('href="./favicon.png"', `href="${await dataUri(path.join(dist, 'favicon.png'))}"`)
html = html.replace('href="./apple-touch-icon.png"', `href="${await dataUri(path.join(dist, 'apple-touch-icon.png'))}"`)
html = html.replaceAll('https://chalidade.github.io/weeknoo/puas-startup/', siteUrl.replace(/\/?$/, '/'))

html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
html = html.replace(cssTag[0], () => `<style>${css}</style>`)
html = html.replace(jsTag[0], '')
html = html.replace('</body>', () => `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>\n</body>`)

const left = [...html.matchAll(/(?:src|href)="(\.\/[^"]*)"/g)].map((m) => m[1])
if (left.length || js.includes('puas-logo.webp')) throw new Error(`still referencing files: ${left.join(', ') || 'logo in script'}`)

await writeFile(out, html)
