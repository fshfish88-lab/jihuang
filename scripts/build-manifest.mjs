import { createHash, randomUUID } from 'node:crypto'
import { readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

export const BUILD_MANIFEST_NAME = '.campfire-build.json'

const defaultOperations = { readFile, readdir, rename, rm, writeFile }

/** @returns {string} */
function createToken() {
  return randomUUID()
}

export async function snapshotBuildFiles(root, operations = defaultOperations, current = root) {
  const entries = await operations.readdir(current, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (current === root && entry.name === BUILD_MANIFEST_NAME) continue
    const path = join(current, entry.name)
    if (entry.isDirectory()) {
      files.push(...await snapshotBuildFiles(root, operations, path))
    } else if (entry.isFile()) {
      const bytes = await operations.readFile(path)
      files.push({
        path: relative(root, path).replaceAll('\\', '/'),
        size: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })
    } else {
      throw new Error(`Generated build contains an unsupported filesystem entry: ${path}`)
    }
  }
  return files
}

function validateManifestShape(manifest) {
  if (!manifest || manifest.schemaVersion !== 1) throw new Error('Build manifest has an unsupported schema')
  for (const key of ['commit', 'baseURL', 'generatedAt']) {
    if (typeof manifest[key] !== 'string' || !manifest[key]) throw new Error(`Build manifest is missing ${key}`)
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error('Build manifest has no generated files')
  for (const file of manifest.files) {
    if (!file || typeof file.path !== 'string' || !Number.isSafeInteger(file.size) || file.size < 0 || !/^[a-f0-9]{64}$/.test(file.sha256)) {
      throw new Error('Build manifest contains an invalid file record')
    }
  }
}

function filesMatch(expected, actual) {
  return expected.length === actual.length && expected.every((entry, index) => (
    entry.path === actual[index].path
    && entry.size === actual[index].size
    && entry.sha256 === actual[index].sha256
  ))
}

export async function writeCompletedBuildManifest({
  source,
  commit,
  baseURL,
  generatedAt = new Date().toISOString(),
  token = createToken(),
  operations: overrides = {},
}) {
  const operations = { ...defaultOperations, ...overrides }
  const manifestPath = join(source, BUILD_MANIFEST_NAME)
  const temporary = `${manifestPath}.tmp-${token}`
  const manifest = {
    schemaVersion: 1,
    commit,
    baseURL,
    generatedAt,
    files: await snapshotBuildFiles(source, operations),
  }
  validateManifestShape(manifest)
  try {
    await operations.writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
    await operations.rename(temporary, manifestPath)
  } finally {
    await operations.rm(temporary, { force: true })
  }
  return manifest
}

export async function readAndVerifyBuildManifest(source, operationOverrides = {}) {
  const operations = { ...defaultOperations, ...operationOverrides }
  const manifestPath = join(source, BUILD_MANIFEST_NAME)
  let manifest
  try {
    manifest = JSON.parse(await operations.readFile(manifestPath, 'utf8'))
  } catch (error) {
    throw new Error(`Completed build manifest is missing or invalid: ${manifestPath}`, { cause: error })
  }
  validateManifestShape(manifest)
  const currentFiles = await snapshotBuildFiles(source, operations)
  if (!filesMatch(manifest.files, currentFiles)) {
    throw new Error('Generated source snapshot does not match the completed build manifest')
  }
  return manifest
}
