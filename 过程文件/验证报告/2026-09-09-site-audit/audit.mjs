import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
await mkdir(join(dir, 'screenshots'), { recursive: true })
const base = 'http://127.0.0.1:4174/jihuang'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const result = { browser: browser.version(), pages: [], interactions: {}, errors: [], badLinks: [], online: {} }
const links = new Set()
const routes = ['/', '/beginner', '/beginner/first-day', '/characters', '/characters/wendy', '/bosses', '/bosses/deerclops', '/progression', '/progression/shadow-sanctum', '/wiki', '/wiki/torch', '/wiki/pierogi', '/wiki/ancient-fuelweaver', '/search', '/tools/progression-checklist', '/about']
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
page.on('pageerror', error => result.errors.push({ url: page.url(), type: 'pageerror', message: error.message }))
page.on('console', message => { if (message.type() === 'error') result.errors.push({ url: page.url(), type: 'console', message: message.text() }) })
async function go(route) { await page.goto(base + route, { waitUntil: 'networkidle' }) }
async function shot(name, fullPage = false) { await page.screenshot({ path: join(dir, 'screenshots', name + '.png'), fullPage }) }

for (const width of [1440, 375]) {
  await page.setViewportSize({ width, height: width === 1440 ? 1000 : 812 })
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' })
    const data = await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager'
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
      const nav = performance.getEntriesByType('navigation')[0]
      return {
        title: document.title, h1: [...document.querySelectorAll('h1')].map(e => e.textContent),
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        cards: document.querySelectorAll('.content-card').length,
        brokenImages: [...document.images].filter(i => !i.naturalWidth).map(i => i.src),
        mainCount: document.querySelectorAll('main').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
        links: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin)),
        h2: [...document.querySelectorAll('h2')].map(e => ({ text: e.textContent, id: e.id })),
        loadMs: Math.round(nav.loadEventEnd), resources: performance.getEntriesByType('resource').length
      }
    })
    data.links.forEach(h => links.add(h.split('#')[0]))
    delete data.links
    result.pages.push({ route, status: response.status(), ...data })
    await writeFile(join(dir, 'results.json'), JSON.stringify(result, null, 2))
    if (['/', '/wiki', '/progression/shadow-sanctum', '/wiki/pierogi'].includes(route)) await shot(`${width}-${route.replaceAll('/', '_') || 'home'}`)
    console.log(JSON.stringify({ route, width, status: response.status(), height: data.height, overflow: data.scrollWidth > width, brokenImages: data.brokenImages.length }))
  }
}

await page.setViewportSize({ width: 1440, height: 1000 })
await go('/')
await page.keyboard.press('/')
result.interactions.slashShortcut = { urlAfterPress: page.url(), activeElement: await page.evaluate(() => document.activeElement.tagName) }
await shot('slash-shortcut-after')

await go('/search')
result.interactions.search = []
for (const query of ['巨鹿', 'dl', '机器人', '怎么复活', '料理', '保暖', 'zzzznomatch']) {
  await page.getByRole('searchbox').fill(query)
  await page.waitForTimeout(120)
  result.interactions.search.push({ query, count: await page.locator('.search-result').count(), titles: await page.locator('.search-result h2').allTextContents(), url: page.url() })
}
await page.getByRole('searchbox').fill('料理')
await shot('search-dishes-12')
await page.locator('.search-result').first().click()
await page.waitForURL('**/wiki/**')
await page.waitForLoadState('networkidle')
await page.goBack({ waitUntil: 'networkidle' })
await page.waitForURL('**/search')
result.interactions.searchBack = { value: await page.getByRole('searchbox').inputValue(), count: await page.locator('.search-result').count() }
await shot('search-back-empty')

await go('/wiki')
await page.getByRole('button', { name: '料理', exact: true }).click()
result.interactions.wikiFilter = { cards: await page.locator('.content-card').count(), stamp: await page.locator('.index-hero .stamp').textContent(), url: page.url() }
await page.locator('.content-card').first().click()
await page.waitForURL('**/wiki/**')
await page.waitForLoadState('networkidle')
await page.goBack({ waitUntil: 'networkidle' })
await page.waitForURL('**/wiki')
result.interactions.wikiFilterBack = { cards: await page.locator('.content-card').count(), active: await page.locator('.filter-button[aria-pressed="true"]').textContent() }
await shot('wiki-filter-back-all')

await go('/tools/progression-checklist')
const toggle = page.locator('.route-checklist li > button').first()
await toggle.click()
await page.reload({ waitUntil: 'networkidle' })
result.interactions.progressSaved = { pressed: await toggle.getAttribute('aria-pressed'), percentage: await page.locator('.progress-seal strong').textContent() }
await page.getByRole('button', { name: '重置全部进度', exact: true }).click()
await page.getByRole('button', { name: '取消', exact: true }).click()
result.interactions.progressResetCancelled = await toggle.getAttribute('aria-pressed')
await page.getByRole('button', { name: '重置全部进度', exact: true }).click()
await page.getByRole('button', { name: '确定重置', exact: true }).click()
result.interactions.progressReset = await toggle.getAttribute('aria-pressed')

await page.setViewportSize({ width: 375, height: 812 })
await go('/')
result.interactions.mobileSearch = await page.locator('.search-shortcut').ariaSnapshot()
await page.getByRole('button', { name: '切换导航' }).click()
await shot('mobile-menu-open')
await page.keyboard.press('Escape')
result.interactions.mobileMenuEscape = await page.locator('#mobile-menu').isVisible()
await page.locator('#mobile-menu').getByRole('link', { name: '百科资料', exact: true }).click()
await page.waitForURL('**/wiki')
result.interactions.mobileMenuNavigation = { url: page.url(), open: await page.locator('#mobile-menu').isVisible() }
const missing = await page.goto(base + '/not-a-real-page-audit', { waitUntil: 'networkidle' })
result.interactions.notFound = { status: missing.status(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 1000) }
await shot('mobile-404')

result.linkCount = links.size
for (const url of links) {
  const response = await context.request.get(url)
  if (response.status() !== 200) result.badLinks.push({ url, status: response.status() })
}
for (const url of ['https://fshfish88-lab.github.io/jihuang/', 'https://github.com/fshfish88-lab/jihuang']) {
  try { const res = await context.request.get(url, { timeout: 20000 }); result.online[url] = { status: res.status(), title: (await res.text()).match(/<title>(.*?)<\/title>/s)?.[1] } }
  catch (error) { result.online[url] = { error: error.message.slice(0, 500) } }
}
await writeFile(join(dir, 'results.json'), JSON.stringify(result, null, 2))
console.log(JSON.stringify({ interactions: result.interactions, errors: result.errors, linkCount: result.linkCount, badLinks: result.badLinks, online: result.online }, null, 2))
await browser.close()
