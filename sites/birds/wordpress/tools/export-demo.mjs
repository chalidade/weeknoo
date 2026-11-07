// Exports the React site's sample content for the WordPress demo importer:
//   plugin/birds-elements/demo/articles.json  — series, contributors, articles
//   plugin/birds-elements/demo/media/*.jpg    — the editorial artwork presets
//   plugin/birds-elements/demo/media/*.mp4      — hero videos used by the articles
//
// Run from sites/birds:  node wordpress/tools/export-demo.mjs
// Needs the site's node_modules and the pre-installed Playwright Chromium.
import { createServer } from 'vite'
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const here = dirname(fileURLToPath(import.meta.url))
const site = resolve(here, '../..')
const out = resolve(here, '../plugin/birds-elements/demo')
mkdirSync(join(out, 'media'), { recursive: true })

const vite = await createServer({ root: site, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
try {
  const { ARTICLES } = await vite.ssrLoadModule('/src/data/articles.ts')
  const { SERIES } = await vite.ssrLoadModule('/src/data/categories.ts')
  const { Artwork, ARTWORK_PRESETS } = await vite.ssrLoadModule('/src/components/Artwork.tsx')
  const req = createRequire(join(site, 'package.json'))
  const React = req('react')
  const { renderToStaticMarkup } = req('react-dom/server')

  // --- contributors, de-duplicated by name ---------------------------------
  const people = new Map()
  const keyOf = (c) => {
    const key = c.fullName.toLowerCase().replace(/^dr\.\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!people.has(key)) {
      people.set(key, {
        key, fullName: c.fullName, role: c.role, title: c.title, company: c.company,
        personalBio: c.personalBio, companyBio: c.companyBio,
        // placeholder links in the React data are not carried over
        linkedinUrl: '', companyUrl: c.companyUrl.includes('example.com') ? '' : c.companyUrl,
      })
    }
    return key
  }

  const art = (ref) => (ref?.startsWith('art:') ? `${ref.slice(4)}.jpg` : ref)
  const articles = ARTICLES.map((a) => ({
    ...a,
    featuredImage: art(a.featuredImage),
    heroVideoUrl: a.heroVideoUrl ? a.heroVideoUrl.split('/').pop() : undefined,
    author: keyOf(a.author),
    interviewedExperts: a.interviewedExperts.map(keyOf),
    carouselItems: a.carouselItems?.map((c) => ({ ...c, imageUrl: art(c.imageUrl) })),
  }))

  const data = {
    generatedFrom: 'sites/birds/src/data',
    groups: ['Workforce Intelligence', 'Human Leadership', 'Mind & Impact'],
    series: SERIES,
    contributors: [...people.values()],
    articles,
  }
  writeFileSync(join(out, 'articles.json'), JSON.stringify(data, null, 1) + '\n')
  console.log(`articles.json: ${articles.length} articles, ${people.size} contributors, ${SERIES.length} series`)

  // --- artwork → JPG ---------------------------------------------------------
  const css = `:root{--navy:#000f34;--royal:#0972cb;--sky:#38bdf8;--slate:#94a3b8;--muted:#f5f5f7}html,body{margin:0}svg{display:block;width:1600px;height:1000px}`
  // Playwright: the site's own copy if present, else a global install.
  let chromium
  try {
    ;({ chromium } = req('playwright'))
  } catch {
    const { execSync } = await import('node:child_process')
    const globalRoot = execSync('npm root -g').toString().trim()
    ;({ chromium } = createRequire(join(globalRoot, 'noop.js'))('playwright'))
  }
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
  for (const preset of ARTWORK_PRESETS) {
    const svg = renderToStaticMarkup(React.createElement(Artwork, { preset }))
    await page.setContent(`<!doctype html><style>${css}</style>${svg}`)
    await page.screenshot({ path: join(out, 'media', `${preset}.jpg`), type: 'jpeg', quality: 80 })
  }
  await browser.close()
  console.log(`media: ${ARTWORK_PRESETS.length} artwork JPGs`)

  for (const video of new Set(articles.map((a) => a.heroVideoUrl).filter(Boolean))) {
    copyFileSync(join(site, 'public/media', video), join(out, 'media', video))
    console.log(`media: ${video}`)
  }
} finally {
  await vite.close()
}
