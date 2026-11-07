// Renders brand-film.html to an MP4 with a synthesized ambient score.
//
//   node video/render.mjs                 full render → public/media/birds-film.mp4 (+ poster)
//   node video/render.mjs --stills 2,7,12 single frames to video/.stills/ for review
//
// Needs Playwright's Chromium and ffmpeg.
import { createRequire } from 'node:module'
import { execSync, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const site = resolve(here, '..')
const FPS = 24, DURATION = 24, W = 1920, H = 1080
const args = process.argv.slice(2)
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null

let chromium
try {
  ;({ chromium } = createRequire(join(site, 'package.json'))('playwright'))
} catch {
  const globalRoot = execSync('npm root -g').toString().trim()
  ;({ chromium } = createRequire(join(globalRoot, 'noop.js'))('playwright'))
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(join(here, 'brand-film.html')).href)
await page.evaluate(() => document.fonts.ready)

if (stillsArg) {
  const dir = join(here, '.stills')
  mkdirSync(dir, { recursive: true })
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate((t) => window.render(t), t)
    await page.screenshot({ path: join(dir, `t${String(t).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 80 })
  }
  await browser.close()
  console.log(`stills → ${dir}`)
  process.exit(0)
}

const frames = join(here, '.frames')
rmSync(frames, { recursive: true, force: true })
mkdirSync(frames, { recursive: true })
const total = FPS * DURATION
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.render(t), i / FPS)
  await page.screenshot({ path: join(frames, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 })
  if (i % 96 === 0) console.log(`frame ${i}/${total}`)
}
await browser.close()

// Ambient score: a low A/E drone with a slow swell, and an upper voice that
// steps with each scene (C, D, E, G, C). Each note fades in and out on its own
// so changes never click; both ends fade so the loop is clean.
const NOTES = [[0, 4.6, 261.63], [4.6, 10, 293.66], [10, 15, 329.63], [15, 20, 392.0], [20, 24, 261.63]]
const env = (a, b) => `clip((t-${a})/0.8,0,1)*clip((${b}-t)/0.8,0,1)`
const expr = [
  '0.16*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*t/12))',
  '0.10*sin(2*PI*164.81*t)*(0.7+0.3*sin(2*PI*t/8))',
  '0.05*sin(2*PI*220.5*t)',
  ...NOTES.map(([a, b, f]) => `0.05*${env(a, b)}*sin(2*PI*${f}*t)`),
].join('+').replace(/,/g, '\\,') // commas must be escaped inside a filter argument
const out = join(site, 'public/media/birds-film.mp4')
const ff = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-framerate', String(FPS), '-i', join(frames, 'f%04d.jpg'),
  '-f', 'lavfi', '-i', `aevalsrc=${expr}:s=44100:d=${DURATION}`,
  '-filter_complex', `[1:a]lowpass=f=900,afade=t=in:d=1.2,afade=t=out:st=${DURATION - 1.2}:d=1.2,volume=0.9[a]`,
  '-map', '0:v', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '96k', '-shortest', out,
], { stdio: 'inherit' })
if (ff.status !== 0) process.exit(ff.status ?? 1)

// Poster: the wordmark frame, for first paint before the video starts.
spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '2.8', '-i', out, '-frames:v', '1', '-q:v', '4', join(site, 'public/media/birds-film-poster.jpg')], { stdio: 'inherit' })
rmSync(frames, { recursive: true, force: true })
console.log(`birds-film.mp4: ${(statSync(out).size / 1e6).toFixed(2)} MB`)
