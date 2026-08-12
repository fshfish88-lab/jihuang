import { createHash, randomUUID } from 'node:crypto'
import { access, mkdtemp, open, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
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

export async function stageTrustedIconReplacement({
  label,
  temporary,
  target,
  replaceExisting,
  expected,
  download,
  operations = {}
}) {
  const fs = { readFile, unlink, ...operations }
  try {
    await download(temporary)
    const bytes = await fs.readFile(temporary)
    validateIconBytes(bytes, expected, `${label} downloaded icon`)
    return {
      bytes,
      pending: { temporary, target, replaceExisting }
    }
  } catch (error) {
    await fs.unlink(temporary).catch(() => {})
    throw error
  }
}

export async function replaceManifestAtomically(manifestPath, serialized, errors) {
  if (errors.length) throw new Error(errors.join('\n'))
  const temporary = `${manifestPath}.${randomUUID()}.part`
  try {
    await writeFile(temporary, serialized, 'utf8')
    await rename(temporary, manifestPath)
  } finally {
    await unlink(temporary).catch(() => {})
  }
}

export async function createIconSyncStaging(outputDir, operations = {}) {
  const fs = { mkdtemp, ...operations }
  return fs.mkdtemp(join(outputDir, '.wiki-icon-sync-'))
}

export async function removeIconSyncStaging(stagingDirectory, operations = {}) {
  const fs = { rm, ...operations }
  await fs.rm(stagingDirectory, { recursive: true, force: true })
}

export async function acquireIconSyncLock(lockPath, options = {}) {
  const fs = { open, readFile, unlink, ...options.operations }
  const token = options.token || randomUUID()
  let handle
  try {
    handle = await fs.open(lockPath, 'wx')
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(`wiki icon sync is already running (lock exists: ${lockPath})`)
    }
    throw error
  }

  try {
    await handle.writeFile(`${token}\n`, 'utf8')
  } catch (error) {
    await handle.close().catch(() => {})
    await fs.unlink(lockPath).catch(() => {})
    throw error
  }

  let released = false
  return async () => {
    if (released) return
    released = true
    await handle.close()
    const currentToken = await fs.readFile(lockPath, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return undefined
      throw error
    })
    if (currentToken === `${token}\n`) {
      await fs.unlink(lockPath).catch(error => {
        if (error.code !== 'ENOENT') throw error
      })
    }
  }
}

export async function withIconSyncLock(lockPath, task, options = {}) {
  const release = await acquireIconSyncLock(lockPath, options)
  try {
    return await task()
  } finally {
    await release()
  }
}

export async function commitIconSyncTransaction({
  pendingRenames,
  manifestPath,
  stagingDirectory,
  serializedManifest,
  manifestChanged,
  operations = {}
}) {
  const fs = { access, rename, unlink, writeFile, ...operations }
  if (!stagingDirectory) throw new Error('icon sync transaction requires a unique staging directory')
  const manifestTemporary = join(stagingDirectory, 'manifest.next.json')
  const manifestBackup = join(stagingDirectory, 'manifest.backup')
  const states = pendingRenames.map((pending, index) => ({
    ...pending,
    backup: join(stagingDirectory, `icon-${index}.backup`),
    backedUp: false,
    promoted: false
  }))
  let manifestBackedUp = false
  let manifestPromoted = false

  try {
    for (const state of states) {
      let exists = true
      try {
        await fs.access(state.target)
      } catch (error) {
        if (error.code === 'ENOENT') exists = false
        else throw error
      }
      if (exists && !state.replaceExisting) {
        throw new Error(`refusing to replace icon target that already exists: ${state.target}`)
      }
      if (!exists && state.replaceExisting) {
        throw new Error(`cannot replace icon target because it no longer exists: ${state.target}`)
      }
    }

    if (manifestChanged) {
      await fs.writeFile(manifestTemporary, serializedManifest, 'utf8')
    }

    for (const state of states) {
      if (state.replaceExisting) {
        await fs.rename(state.target, state.backup)
        state.backedUp = true
      }
      await fs.rename(state.temporary, state.target)
      state.promoted = true
    }

    if (manifestChanged) {
      await fs.rename(manifestPath, manifestBackup)
      manifestBackedUp = true
      await fs.rename(manifestTemporary, manifestPath)
      manifestPromoted = true
    }
  } catch (error) {
    const rollbackErrors = []
    if (manifestPromoted) {
      await fs.unlink(manifestPath).catch(rollbackError => rollbackErrors.push(rollbackError))
    }
    if (manifestBackedUp) {
      await fs.rename(manifestBackup, manifestPath).catch(rollbackError => rollbackErrors.push(rollbackError))
    }
    for (const state of [...states].reverse()) {
      if (state.promoted) {
        await fs.unlink(state.target).catch(rollbackError => {
          if (rollbackError.code !== 'ENOENT') rollbackErrors.push(rollbackError)
        })
      }
      if (state.backedUp) {
        await fs.rename(state.backup, state.target).catch(rollbackError => rollbackErrors.push(rollbackError))
      }
    }
    if (rollbackErrors.length) {
      throw new AggregateError([error, ...rollbackErrors], `icon sync failed and rollback was incomplete: ${error.message}`)
    }
    throw error
  } finally {
    await Promise.all([
      ...states.map(state => fs.unlink(state.temporary).catch(() => {})),
      ...states.map(state => fs.unlink(state.backup).catch(() => {})),
      fs.unlink(manifestTemporary).catch(() => {}),
      fs.unlink(manifestBackup).catch(() => {})
    ])
  }
}

export async function readPriorManifest(manifestPath) {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return { entries: [] }
    throw error
  }
}
