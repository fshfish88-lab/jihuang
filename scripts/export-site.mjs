import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const source = resolve('.output/public')
const target = resolve('成品文件/github-pages')
const packageJson = JSON.parse(await readFile(resolve('package.json'), 'utf8'))

await rm(target, { recursive: true, force: true })
await mkdir(target, { recursive: true })
await cp(source, target, { recursive: true })

let commit = 'uncommitted'
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
} catch {}

await writeFile(resolve(target, 'build-info.json'), JSON.stringify({
  name: packageJson.name,
  version: packageJson.version,
  commit,
  builtAt: new Date().toISOString()
}, null, 2))

console.log(`Exported deployable site to ${target}`)

