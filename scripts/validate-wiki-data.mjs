import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const manifestPath = resolve(root, '素材文件', '物品图标', '来源清单.json')
const listOutput = execFileSync(process.execPath, [resolve(root, 'scripts', 'sync-wiki-icons.mjs'), '--list'], {
  encoding: 'utf8'
})
const entries = JSON.parse(listOutput)
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const manifestBySlug = new Map(manifest.entries.map(entry => [entry.slug, entry]))
const errors = []

if (entries.length < 120) errors.push(`structured wiki has only ${entries.length} entries`)
if (new Set(entries.map(entry => entry.slug)).size !== entries.length) errors.push('structured wiki contains duplicate slugs')
if (manifest.count !== entries.length) errors.push(`manifest count ${manifest.count} does not match ${entries.length} entries`)

for (const entry of entries) {
  const record = manifestBySlug.get(entry.slug)
  const iconPath = resolve(root, 'public', 'images', 'wiki', `${entry.slug}.png`)
  if (!record) {
    errors.push(`${entry.slug}: missing source manifest record`)
    continue
  }

  if (!record.sourceUrl?.startsWith('https://')) errors.push(`${entry.slug}: invalid image source URL`)
  if (!record.sourcePage?.startsWith('https://')) errors.push(`${entry.slug}: invalid image source page`)
  if (record.owner !== 'Klei Entertainment') errors.push(`${entry.slug}: missing Klei ownership attribution`)

  try {
    const [fileInfo, bytes] = await Promise.all([stat(iconPath), readFile(iconPath)])
    const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    if (!isPng) errors.push(`${entry.slug}: local icon is not a PNG`)
    if (fileInfo.size < 100) errors.push(`${entry.slug}: local icon is too small`)
    if (record.bytes !== fileInfo.size) errors.push(`${entry.slug}: manifest byte count is stale`)
    if (record.sha256 !== sha256) errors.push(`${entry.slug}: manifest SHA-256 is stale`)
  } catch {
    errors.push(`${entry.slug}: local icon is missing`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${entries.length} structured wiki entries and ${manifest.count} attributed PNG icons; 0 errors.`)
