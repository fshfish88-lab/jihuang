import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { snapshotBuildFiles, writeCompletedBuildManifest } from './build-manifest.mjs'

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const baseURL = process.env.NUXT_APP_BASE_URL || '/jihuang/'
const runtimeFiles = []
for (const folder of ['app', 'content', 'public']) {
  runtimeFiles.push({ folder, files: await snapshotBuildFiles(resolve(folder)) })
}
await writeFile(resolve('.output/public/source-state.json'), JSON.stringify({
  baseCommit: commit,
  workingTreeModified: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()),
  runtimeSourceSha256: createHash('sha256').update(JSON.stringify(runtimeFiles)).digest('hex'),
  note: 'baseCommit identifies the checkout base; runtimeSourceSha256 identifies app, content and public file bytes used for this build.'
}, null, 2) + '\n')

const manifest = await writeCompletedBuildManifest({
  source: resolve('.output/public'),
  commit,
  baseURL,
})

console.log(`Recorded completed static build ${manifest.commit} (${manifest.files.length} files, base ${manifest.baseURL})`)
