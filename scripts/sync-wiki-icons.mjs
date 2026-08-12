import { execFile } from 'node:child_process'
import { mkdir, readFile, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
  buildMirrorIconUrl,
  commitIconSyncTransaction,
  readPriorManifest,
  resolveContainedPath,
  stageTrustedIconReplacement,
  validateIconBytes,
  validateTrustedLocalIcon,
  validateWikiIconEntry,
  withIconSyncLock,
  withIconSyncStaging
} from './wiki-icon-integrity.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const dataDir = join(root, 'app', 'data', 'wiki')
const outputDir = join(root, 'public', 'images', 'wiki')
const materialDir = join(root, '素材文件', '物品图标')
const manifestPath = join(materialDir, '来源清单.json')
const lockPath = join(outputDir, '.wiki-icon-sync.lock')
// The mutable upstream is only a retrieval source. Vendored PNGs and the checked-in manifest hashes are trusted.
const mirrorBase = 'https://raw.githubusercontent.com/fankimm/dst-craft/main/public/images/game-items'
const execFileAsync = promisify(execFile)
const sourceOverrides = {
  'bee-queen': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bee_Queen.png',
  'malbatross': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Malbatross.png',
  'crab-king': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Crab_King.png',
  'twins-of-terror': 'https://dontstarve.wiki.gg/images/Retinazor.png?6e12b3',
  'cave-entrance': 'https://dontstarve.wiki.gg/images/Sinkhole.png?ef9ea5',
  'klaus': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Klaus.png',
  'toadstool': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Toadstool.png',
  'ancient-fuelweaver': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Fuelweaver.png',
  'eye-of-terror': 'https://dontstarve.wiki.gg/images/Eye_of_Terror_Phase_1.png?1e50f7',
  'ruins': 'https://dontstarve.wiki.gg/images/Ruins_Entrance.png?4b188f',
  'depth-worm': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Depths_Worm.png',
  'bunnyman': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bunnyman.png',
  'splumonkey': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Splumonkey.png',
  'ancient-guardian': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Guardian.png',
  'ancient-pseudoscience-station': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Ancient_Pseudoscience_Station.png',
  'celestial-portal': 'https://dontstarve.wiki.gg/images/Celestial_Portal.png?b13281',
  'celestial-altar': 'https://dontstarve.wiki.gg/images/Celestial_Altar.png?6223d1',
  'deadly-brightshade': 'https://dontstarve.wiki.gg/images/Deadly_Brightshade.png?7e4470',
  'grazer': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Grazer.png',
  'lunar-rift': 'https://dontstarve.wiki.gg/images/Lunar_Rift_Phase_3.png?2baa26',
  'celestial-champion': 'https://dontstarve.wiki.gg/images/Celestial_Champion_Phase_3.png?18cdc3',
  'lunar-island': 'https://dontstarve.wiki.gg/images/Lunar_Island.png?a901f4',
  'cookie-cutter': 'https://dontstarve.wiki.gg/images/Cookie_Cutter.png?725d8d',
  'deerclops': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Deerclops.png',
  'antlion': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Antlion.png',
  'bearger': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Bearger.png',
  'dragonfly': 'https://dontstarve.wiki.gg/wiki/Special:Redirect/file/Dragonfly.png',
  'shadow-rift': 'https://dontstarve.wiki.gg/images/Shadow_Rift_Phase_3.png?55d45c',
  'moose-goose': 'https://dontstarve.wiki.gg/images/Goose.png?6fad68',
  'waymark-compass': 'https://dontstarve.wiki.gg/images/Waymark_Compass.png?ffd7f3',
  'sanctum': 'https://dontstarve.wiki.gg/images/Sanctum_Icon.png?c3d611',
  'ancient-guard-tower': 'https://dontstarve.wiki.gg/images/Ancient_Guard_Tower.png?c3ea50',
  'geothermite': 'https://dontstarve.wiki.gg/images/Geothermite.png?a79ca6',
  'keystone': 'https://dontstarve.wiki.gg/images/Keystone.png?efda91',
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

const sourceFiles = (await readdir(dataDir))
  .filter(name => name.endsWith('.ts') && !['index.ts', 'shared.ts'].includes(name))

const entries = []
for (const name of sourceFiles) {
  const text = await readFile(join(dataDir, name), 'utf8')
  const starts = [...text.matchAll(/^  (?:[A-Za-z]\w*\()?\{\s*(?:\r?\n\s*)?slug:\s*'([^']+)'/gm)]
  for (let index = 0; index < starts.length; index += 1) {
    const match = starts[index]
    const slug = match[1]
    const block = text.slice(match.index, starts[index + 1]?.index || text.length)
    const title = block.match(/\btitle:\s*'([^']+)'/)?.[1]
    if (!title) continue
    const prefab = block.match(/\bprefab:\s*'([^']+)'/)?.[1] || slug
    entries.push({ slug, prefab, title, sourceFile: name })
  }
}

const unique = [...new Map(entries.map(entry => [entry.slug, entry])).values()]
for (const entry of unique) validateWikiIconEntry(entry)

if (process.argv.includes('--list')) {
  console.log(JSON.stringify(unique))
  process.exit(0)
}

await mkdir(outputDir, { recursive: true })
await mkdir(materialDir, { recursive: true })

try {
  await withIconSyncLock(lockPath, async lock => {
    await withIconSyncStaging(outputDir, async stagingDirectory => {
      await lock.setRecoveryPath(stagingDirectory)
      await syncIcons(stagingDirectory)
    })
  }, { allowedRoots: [outputDir, materialDir] })
} catch (error) {
  console.error(`icon sync failed: ${error.message}`)
  process.exitCode = 1
}

async function syncIcons(stagingDirectory) {
const priorManifest = await readPriorManifest(manifestPath)
const expectedBySlug = new Map((priorManifest.entries || []).map(record => [record.slug, record]))
const manifest = []
const errors = []
const pendingRenames = []

async function download(entry) {
  const url = sourceOverrides[entry.slug] || buildMirrorIconUrl(entry.prefab, mirrorBase)
  const target = resolveContainedPath(outputDir, `${entry.slug}.png`)
  const expected = expectedBySlug.get(entry.slug)
  try {
    const bytes = await readFile(target)
    try {
      validateTrustedLocalIcon(bytes, expected, `${entry.slug} local icon`)
    } catch (error) {
      if (!expected) {
        errors.push(error.message)
        return
      }
      // A damaged trusted icon may be recovered, but only from bytes matching its checked-in hash.
      return downloadTrustedReplacement(entry, url, target, expected, true)
    }
    manifest.push(manifestEntry(entry, url, bytes))
    return
  } catch (error) {
    if (error.code !== 'ENOENT') {
      errors.push(`${entry.slug}: cannot read local icon (${error.message})`)
      return
    }
  }

  return downloadTrustedReplacement(entry, url, target, expected, false)
}

async function downloadTrustedReplacement(entry, url, target, expected, replaceExisting) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const temporary = resolveContainedPath(stagingDirectory, `${entry.slug}-${attempt}.png`)
    try {
      const { bytes, pending } = await stageTrustedIconReplacement({
        label: entry.slug,
        temporary,
        target,
        replaceExisting,
        outputDirectory: outputDir,
        stagingDirectory,
        expected,
        download: async output => {
          const command = process.platform === 'win32' ? 'curl.exe' : 'curl'
          const args = [
            '--fail',
            '--location',
            '--silent',
            '--show-error',
            '--connect-timeout', '20',
            '--max-time', '60',
            '--user-agent', 'Campfire-Wiki/1.0 (non-commercial DST guide)',
            '--output', output,
            url
          ]
          if (process.platform === 'win32') args.unshift('--ssl-no-revoke')
          await execFileAsync(command, args)
        }
      })
      pendingRenames.push(pending)
      manifest.push(manifestEntry(entry, url, bytes))
      return
    } catch (error) {
      lastError = error
      await unlink(temporary).catch(() => {})
      await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    }
  }
  errors.push(`${entry.slug} (${entry.prefab}.png): ${lastError.message}`)
}

function manifestEntry(entry, url, bytes) {
  const fromWiki = Boolean(sourceOverrides[entry.slug])
  const integrity = validateIconBytes(bytes, undefined, entry.slug)
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
    sha256: integrity.sha256,
    bytes: integrity.bytes,
    verifiedAt: '2026-08-13'
  }
}

for (let index = 0; index < unique.length; index += 3) {
  await Promise.all(unique.slice(index, index + 3).map(download))
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug))
if (errors.length) {
  throw new Error(errors.join('\n'))
}

const manifestHeader = {
  title: '火堆边百科物品图标来源清单',
  note: '图标为 Klei Entertainment 游戏素材；本站为免费、非官方玩家攻略站。PNG 随仓库提交，清单中的字节数与 SHA-256 是信任锚；上游 main 变化会导致同步失败，不会静默替换。',
  count: manifest.length,
  entries: manifest
}
const priorComparable = {
  title: priorManifest.title,
  note: priorManifest.note,
  count: priorManifest.count,
  entries: priorManifest.entries
}
const changed = JSON.stringify(manifestHeader) !== JSON.stringify(priorComparable)
const nextManifest = {
  title: manifestHeader.title,
  note: manifestHeader.note,
  generatedAt: new Date().toISOString(),
  count: manifestHeader.count,
  entries: manifestHeader.entries
}
await commitIconSyncTransaction({
  pendingRenames,
  manifestPath,
  manifestDirectory: materialDir,
  outputDirectory: outputDir,
  stagingDirectory,
  serializedManifest: `${JSON.stringify(nextManifest, null, 2)}\n`,
  manifestChanged: changed
})

console.log(`Verified ${manifest.length}/${unique.length} wiki icons; manifest ${changed ? 'updated atomically' : 'unchanged'}.`)
}
