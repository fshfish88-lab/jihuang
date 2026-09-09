import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { readAndVerifyBuildManifest, snapshotBuildFiles } from '../../../scripts/build-manifest.mjs'

const dir = dirname(fileURLToPath(import.meta.url))
await mkdir(join(dir, 'screenshots'), { recursive: true })
const root = resolve('成品文件/github-pages')
const manifest = await readAndVerifyBuildManifest(root, {
  readdir: async (path, options) => {
    const entries = await readdir(path, options)
    return resolve(path) === root ? entries.filter(entry => entry.name !== 'build-info.json') : entries
  }
})
const state = JSON.parse(await readFile(join(root, 'source-state.json'), 'utf8'))
const runtimeFiles = []
for (const folder of ['app', 'content', 'public']) runtimeFiles.push({ folder, files: await snapshotBuildFiles(resolve(folder)) })
const sourceHash = createHash('sha256').update(JSON.stringify(runtimeFiles)).digest('hex')
if (sourceHash !== state.runtimeSourceSha256) throw new Error('Runtime source differs from the built artifact')
const r = { manifestFiles: manifest.files.length, generatedAt: manifest.generatedAt, sourceHash, pages: [], errors: [], links: [], interactions: {} }
const server = spawn(process.execPath, ['scripts/preview-static.mjs'], { env: { ...process.env, CAMPFIRE_PREVIEW_PORT: '4176' }, stdio: ['ignore', 'inherit', 'inherit', 'ipc'], windowsHide: true })
let browser
try {
  await Promise.race([once(server, 'message'), once(server, 'exit').then(() => { throw new Error('Preview failed') })])
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  const base = 'http://127.0.0.1:4176/jihuang/'
  page.on('pageerror', error => r.errors.push({ url: page.url(), message: error.message }))
  page.on('console', message => { if (message.type() === 'error' || /hydration/i.test(message.text())) r.errors.push({ url: page.url(), message: message.text() }) })
  const routes = ['', 'wiki', 'wiki?category=料理&benefit=health', 'wiki/pierogi', 'wiki/war-saddle', 'wiki/ancient-fuelweaver', 'beginner/first-day', 'characters/wilson', 'bosses', 'bosses/deerclops', 'progression/shadow-sanctum', 'tools/progression-checklist?route=shadow-sanctum', 'search?q=怎么复活', 'about']
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 812 })
    for (const route of routes) {
      const res = await page.goto(base + route, { waitUntil: 'networkidle' })
      const data = await page.evaluate(async () => {
        for (const img of document.images) img.loading = 'eager'
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
        return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
          brokenImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src),
          cards: document.querySelectorAll('.wiki-catalog-item').length,
          recipeTop: document.querySelector('.dish-panel') ? Math.round(document.querySelector('.dish-panel').getBoundingClientRect().top + scrollY) : null }
      })
      r.pages.push({ route, status: res.status(), ...data })
      if (['', 'wiki', 'wiki?category=料理&benefit=health', 'wiki/pierogi', 'tools/progression-checklist?route=shadow-sanctum', 'search?q=怎么复活'].includes(route)) await page.screenshot({ path: join(dir, 'screenshots', `${width}-${route.replaceAll(/[^a-zA-Z0-9_-]/g, '_') || 'home'}.png`) })
    }
  }
  await page.goto(base + 'search', { waitUntil: 'networkidle' })
  await page.getByRole('searchbox').pressSequentially('怎么复活', { delay: 40 })
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length > 0)
  r.interactions.typing = { input: await page.getByRole('searchbox').inputValue(), count: await page.locator('.search-result').count() }
  await page.goto(base + 'wiki/ancient-fuelweaver', { waitUntil: 'networkidle' })
  await page.getByRole('checkbox').first().check()
  r.interactions.bossPrepared = await page.locator('.combat-prepared-count').textContent()
  const xml = await readFile(join(root, 'sitemap.xml'), 'utf8')
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1].replace('https://fshfish88-lab.github.io/jihuang/', base))
  urls.push(base + 'search')
  for (const url of urls) { const response = await context.request.get(url); r.links.push({ url: url.replace(base, '/'), status: response.status() }) }
  await page.goto(base + 'wiki', { waitUntil: 'networkidle' })
  const slugs = []
  for (let n = 1; n <= 14; n++) {
    if (n > 1) { await page.getByRole('link', { name: '下一页', exact: true }).click(); await page.waitForFunction(n => document.querySelector('.catalog-summary').textContent.includes(`第 ${n} /`), n) }
    slugs.push(...await page.locator('.wiki-catalog-item').evaluateAll(links => links.map(link => link.getAttribute('href'))))
  }
  r.interactions.paginatedUniqueEntries = new Set(slugs).size
  await writeFile(join(dir, 'results.json'), JSON.stringify(r, null, 2))
  console.log(JSON.stringify({ manifestFiles: r.manifestFiles, sourceHash, pageChecks: r.pages.length, failures: r.pages.filter(p => p.status !== 200 || p.width < p.scrollWidth || p.brokenImages.length), errors: r.errors, linkChecks: r.links.length, badLinks: r.links.filter(p => p.status !== 200), interactions: r.interactions, mobileWiki: r.pages.find(p => p.width === 375 && p.route === 'wiki'), mobileRecipe: r.pages.find(p => p.width === 375 && p.route === 'wiki/pierogi') }, null, 2))
  if (r.pages.some(p => p.status !== 200 || p.width < p.scrollWidth || p.brokenImages.length) || r.errors.length || r.links.some(p => p.status !== 200) || new Set(slugs).size !== 328) process.exitCode = 1
} finally {
  await browser?.close()
  if (server.connected) { const closed = once(server, 'exit'); server.send('shutdown'); await closed }
  else server.kill()
}
