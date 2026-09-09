import { readdir, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

const root = resolve('.output/public')
const base = process.env.NUXT_APP_BASE_URL || '/jihuang/'
const origin = process.env.NUXT_PUBLIC_SITE_ORIGIN || 'https://fshfish88-lab.github.io'
const pages = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('_')) await walk(path)
    else if (entry.name === 'index.html') {
      const route = relative(root, dir).replaceAll('\\', '/')
      if (route !== 'search') pages.push(new URL(base + (route ? `${route}/` : ''), origin).href)
    }
  }
}
await walk(root)
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
await writeFile(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.sort().map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`)
console.log(`Wrote sitemap with ${pages.length} canonical pages`)
