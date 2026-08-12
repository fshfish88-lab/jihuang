import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exportSiteAtomically } from './export-site-transaction.mjs'

const source = resolve('.output/public')
const target = resolve('成品文件/github-pages')
const packageJson = JSON.parse(await readFile(resolve('package.json'), 'utf8'))

await exportSiteAtomically({
  source,
  target,
  buildInfo: {
    name: packageJson.name,
    version: packageJson.version,
  },
})

console.log(`Exported deployable site to ${target}`)

