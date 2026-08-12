import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { writeCompletedBuildManifest } from './build-manifest.mjs'

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const baseURL = process.env.NUXT_APP_BASE_URL || '/jihuang/'

const manifest = await writeCompletedBuildManifest({
  source: resolve('.output/public'),
  commit,
  baseURL,
})

console.log(`Recorded completed static build ${manifest.commit} (${manifest.files.length} files, base ${manifest.baseURL})`)
