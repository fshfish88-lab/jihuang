import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { exportSiteAtomically } from './export-site-transaction.mjs'

const source = resolve('.output/public')
const target = resolve('成品文件/github-pages')
const packageJson = JSON.parse(await readFile(resolve('package.json'), 'utf8'))

let commit = 'uncommitted'
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
} catch {}

await exportSiteAtomically({
  source,
  target,
  buildInfo: {
    name: packageJson.name,
    version: packageJson.version,
    commit,
    builtAt: new Date().toISOString(),
  },
})

console.log(`Exported deployable site to ${target}`)

