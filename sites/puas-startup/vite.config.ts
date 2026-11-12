import { build, defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * After the client build, render <App /> to HTML (src/entry-server.tsx) and
 * inject it into dist/index.html, so the page paints before any JS runs.
 * main.tsx then hydrates it. Works with any --base (CI, zip, local).
 */
function prerender(): Plugin {
  let cfg: ResolvedConfig
  return {
    name: 'puas-prerender',
    apply: 'build',
    configResolved(c) {
      cfg = c
    },
    async closeBundle() {
      if (cfg.build.ssr || process.env.PUAS_PRERENDER_CHILD) return
      const outDir = path.resolve(cfg.root, cfg.build.outDir)
      // Inside node_modules so the SSR bundle resolves react/motion like the app does.
      const ssrOut = path.join(cfg.root, 'node_modules', '.puas-ssr')
      process.env.PUAS_PRERENDER_CHILD = '1'
      try {
        await build({
          root: cfg.root,
          base: cfg.base,
          logLevel: 'warn',
          build: { ssr: 'src/entry-server.tsx', outDir: ssrOut, emptyOutDir: true },
        })
        const { render } = await import(pathToFileURL(path.join(ssrOut, 'entry-server.js')).href)
        const file = path.join(outDir, 'index.html')
        const html = await readFile(file, 'utf8')
        await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
      } finally {
        delete process.env.PUAS_PRERENDER_CHILD
        await rm(ssrOut, { recursive: true, force: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), prerender()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Never inline assets as data: URIs, so a strict CSP (font-src/img-src 'self') holds.
    assetsInlineLimit: 0,
  },
})
