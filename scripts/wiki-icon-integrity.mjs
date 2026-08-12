import { createHash } from 'node:crypto'
import { readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

export function validateIconBytes(bytes, expected, label) {
  if (bytes.length < 100) throw new Error(`${label}: image is too small (${bytes.length} bytes)`)
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${label}: image is not a PNG`)
  }

  const actual = {
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex')
  }
  if (expected?.bytes !== undefined && actual.bytes !== expected.bytes) {
    throw new Error(`${label}: byte count does not match trusted manifest (${actual.bytes} != ${expected.bytes})`)
  }
  if (expected?.sha256 !== undefined && actual.sha256 !== expected.sha256) {
    throw new Error(`${label}: SHA-256 does not match trusted manifest`)
  }
  return actual
}

export function validateTrustedLocalIcon(bytes, expected, label) {
  if (!expected) throw new Error(`${label}: local icon exists without a trusted manifest record`)
  return validateIconBytes(bytes, expected, label)
}

export async function replaceManifestAtomically(manifestPath, serialized, errors) {
  const temporary = `${manifestPath}.part`
  await unlink(temporary).catch(() => {})
  if (errors.length) throw new Error(errors.join('\n'))
  await writeFile(temporary, serialized, 'utf8')
  await rename(temporary, manifestPath)
}

export async function removeStaleParts(outputDir, manifestPath) {
  const names = await readdir(outputDir).catch(error => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  await Promise.all([
    ...names.filter(name => name.endsWith('.part')).map(name => unlink(join(outputDir, name)).catch(() => {})),
    unlink(`${manifestPath}.part`).catch(() => {})
  ])
}

export async function readPriorManifest(manifestPath) {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return { entries: [] }
    throw error
  }
}
