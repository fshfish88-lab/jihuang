import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { access, mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const root = fileURLToPath(new URL('..', import.meta.url))
const dataDir = join(root, 'app', 'data', 'wiki')
const outputDir = join(root, 'public', 'images', 'wiki')
const materialDir = join(root, '素材文件', '物品图标')
const mirrorBase = 'https://raw.githubusercontent.com/fankimm/dst-craft/main/public/images/game-items'
const execFileAsync = promisify(execFile)
const sourceOverrides = {
  hound: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Hound.png',
  pigman: 'https://dontstarve.wiki.gg/images/Happy_Pigman_Profile_Icon.png?82354d&20230728040734',
  frog: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Frog.png',
  'clockwork-knight': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Clockwork_Knight.png',
  'pig-king': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Pig_King.png',
  koalefant: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Koalefant.png',
  'touch-stone': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Touch_Stone.png',
  onion: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Onion.png',
  chest: 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Chest.png'
}

await mkdir(outputDir, { recursive: true })
await mkdir(materialDir, { recursive: true })

const sourceFiles = (await readdir(dataDir))
  .filter(name => name.endsWith('.ts') && !['index.ts', 'shared.ts'].includes(name))

const entries = []
for (const name of sourceFiles) {
  const text = await readFile(join(dataDir, name), 'utf8')
  const pattern = /\bslug:\s*'([^']+)'([\s\S]*?)\btitle:\s*'([^']+)'/g
  for (const match of text.matchAll(pattern)) {
    const [, slug, middle, title] = match
    const prefab = middle.match(/\bprefab:\s*'([^']+)'/)?.[1] || slug
    entries.push({ slug, prefab, title, sourceFile: name })
  }
}

const unique = [...new Map(entries.map(entry => [entry.slug, entry])).values()]

if (process.argv.includes('--list')) {
  console.log(JSON.stringify(unique))
  process.exit(0)
}

const manifest = []
const errors = []

async function download(entry) {
  const url = sourceOverrides[entry.slug] || `${mirrorBase}/${entry.prefab}.png`
  const target = join(outputDir, `${entry.slug}.png`)
  try {
    await access(target)
    const bytes = await readFile(target)
    manifest.push(manifestEntry(entry, url, bytes))
    return
  } catch {
    // Missing local icon: continue with network download.
  }

  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const temporary = `${target}.part`
    try {
      if (process.platform === 'win32') {
        await execFileAsync('curl.exe', [
          '--ssl-no-revoke',
          '--fail',
          '--location',
          '--silent',
          '--show-error',
          '--connect-timeout', '20',
          '--max-time', '60',
          '--user-agent', 'Campfire-Wiki/1.0 (non-commercial DST guide)',
          '--output', temporary,
          url
        ])
      } else {
        await execFileAsync('curl', [
          '--fail',
          '--location',
          '--silent',
          '--show-error',
          '--connect-timeout', '20',
          '--max-time', '60',
          '--user-agent', 'Campfire-Wiki/1.0 (non-commercial DST guide)',
          '--output', temporary,
          url
        ])
      }
      const bytes = await readFile(temporary)
      if (bytes.length < 100) throw new Error(`image too small (${bytes.length} bytes)`)
      if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        throw new Error('downloaded file is not a PNG')
      }
      await rename(temporary, target)
      manifest.push(manifestEntry(entry, url, bytes))
      return
    } catch (error) {
      lastError = error
      await unlink(temporary).catch(() => {})
      await new Promise(resolve => setTimeout(resolve, attempt * 500))
    }
  }
  errors.push(`${entry.slug} (${entry.prefab}.png): ${lastError.message}`)
}

function manifestEntry(entry, url, bytes) {
  const fromWiki = Boolean(sourceOverrides[entry.slug])
  return {
    slug: entry.slug,
    title: entry.title,
    file: `public/images/wiki/${entry.slug}.png`,
    sourceUrl: url,
    sourcePage: fromWiki
      ? url
      : `https://github.com/fankimm/dst-craft/blob/main/public/images/game-items/${entry.prefab}.png`,
    owner: 'Klei Entertainment',
    mirror: fromWiki ? 'dontstarve.wiki.gg' : 'fankimm/dst-craft',
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    verifiedAt: '2026-07-31'
  }
}

for (let index = 0; index < unique.length; index += 8) {
  await Promise.all(unique.slice(index, index + 8).map(download))
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug))
await writeFile(
  join(materialDir, '来源清单.json'),
  `${JSON.stringify({
    title: '火堆边百科物品图标来源清单',
    note: '图标为 Klei Entertainment 游戏素材；本站为免费、非官方玩家攻略站。下载镜像仅用于取得对应原版图标。',
    generatedAt: new Date().toISOString(),
    count: manifest.length,
    entries: manifest
  }, null, 2)}\n`,
  'utf8'
)

console.log(`Downloaded ${manifest.length}/${unique.length} wiki icons.`)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
