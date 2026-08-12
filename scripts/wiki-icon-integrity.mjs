import { createHash, randomUUID } from 'node:crypto'
import { access, mkdtemp, open, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PREFAB_PATTERN = /^[A-Za-z0-9_-]+$/

export function validateWikiIconEntry({ slug, prefab }) {
  if (!SLUG_PATTERN.test(slug)) throw new Error(`unsafe slug: ${slug}`)
  if (!PREFAB_PATTERN.test(prefab)) throw new Error(`unsafe prefab: ${prefab}`)
  return { slug, prefab }
}

export function buildMirrorIconUrl(prefab, mirrorBase) {
  validateWikiIconEntry({ slug: 'safe', prefab })
  return `${mirrorBase}/${encodeURIComponent(prefab)}.png`
}

export function resolveContainedPath(root, ...parts) {
  const allowedRoot = resolve(root)
  const candidate = resolve(allowedRoot, ...parts)
  const relation = relative(allowedRoot, candidate)
  if (relation === '..' || relation.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(relation)) {
    throw new Error(`path escapes allowed directory ${allowedRoot}: ${candidate}`)
  }
  return candidate
}

async function pathExists(path, fs = { access }) {
  try {
    await fs.access(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

function recoveryAggregate(primary, secondary, message, recoveryPaths = []) {
  const aggregate = new AggregateError([primary, ...secondary], message)
  if (recoveryPaths.length) {
    aggregate.recoveryRequired = true
    aggregate.recoveryPaths = recoveryPaths
  }
  return aggregate
}

async function writeJsonAtomically(path, value, fs, label = 'state') {
  const temporary = resolveContainedPath(dirname(path), `${path.split(/[\\/]/).pop()}.${label}-${randomUUID()}`)
  let primaryError
  try {
    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
    await fs.rename(temporary, path)
  } catch (error) {
    primaryError = error
    throw error
  } finally {
    try {
      await fs.unlink(temporary)
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        if (primaryError) {
          throw recoveryAggregate(primaryError, [cleanupError], `${label} update and cleanup failed: ${primaryError.message}`)
        }
        throw cleanupError
      }
    }
  }
}

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
  outputDirectory,
  stagingDirectory,
  expected,
  download,
  operations = {}
}) {
  const fs = { readFile, unlink, ...operations }
  if (stagingDirectory) {
    const checkedTemporary = resolveContainedPath(stagingDirectory, relative(stagingDirectory, temporary))
    if (checkedTemporary !== resolve(temporary)) throw new Error(`path escapes allowed directory: ${temporary}`)
  }
  if (outputDirectory) {
    const checkedTarget = resolveContainedPath(outputDirectory, relative(outputDirectory, target))
    if (checkedTarget !== resolve(target)) throw new Error(`path escapes allowed directory: ${target}`)
  }
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

export async function withIconSyncStaging(outputDir, task, options = {}) {
  const create = options.create || createIconSyncStaging
  const remove = options.remove || removeIconSyncStaging
  const stagingDirectory = await create(outputDir, options.operations)
  let primaryError
  try {
    return await task(stagingDirectory)
  } catch (error) {
    primaryError = error
    throw error
  } finally {
    if (!primaryError?.recoveryRequired) {
      try {
        await remove(stagingDirectory, options.operations)
      } catch (cleanupError) {
        if (primaryError) {
          throw recoveryAggregate(
            primaryError,
            [cleanupError],
            `icon sync failed and staging cleanup also failed: ${primaryError.message}`,
            [stagingDirectory]
          )
        }
        throw cleanupError
      }
    }
  }
}

function defaultProcessAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (error.code === 'ESRCH') return false
    throw new Error(`cannot confirm whether process ${pid} is alive: ${error.message}`, { cause: error })
  }
}

function resolveWithinAnyRoot(path, roots) {
  for (const root of roots) {
    try {
      return resolveContainedPath(root, relative(root, path))
    } catch {}
  }
  throw new Error(`path escapes every allowed directory: ${path}`)
}

async function recoverDeadOwner(lockPath, rawOwner, owner, fs, allowedRoots) {
  if (!owner.recoveryPath) {
    const current = await fs.readFile(lockPath, 'utf8')
    if (current !== rawOwner) throw new Error('stale lock changed while checking ownership; refusing takeover')
    await fs.unlink(lockPath)
    return
  }

  const lockDirectory = dirname(lockPath)
  const recoveryPath = resolveContainedPath(lockDirectory, relative(lockDirectory, owner.recoveryPath))
  const statePath = resolveContainedPath(recoveryPath, 'recovery-state.json')
  let state
  try {
    state = JSON.parse(await fs.readFile(statePath, 'utf8'))
  } catch (error) {
    throw new Error(`dead process recovery cannot be confirmed; preserving lock and recovery path ${recoveryPath}: ${error.message}`)
  }

  const records = [
    ...(state.entries || []).map(entry => ({ kind: 'icon', ...entry })),
    ...(state.manifest ? [{ kind: 'manifest', ...state.manifest }] : [])
  ]
  const phase = state.phase || 'prepared'
  if (phase === 'manifest-committed' || phase === 'cleanup') {
    for (const record of records) {
      const target = resolveWithinAnyRoot(record.target, allowedRoots)
      if (!await pathExists(target, fs)) {
        throw new Error(`committed recovery target is missing: ${target}; preserving ${recoveryPath}`)
      }
      const actualSha256 = createHash('sha256').update(await fs.readFile(target)).digest('hex')
      if (actualSha256 !== record.promotedSha256) {
        throw new Error(`committed recovery target SHA differs from promoted SHA: ${target}; preserving ${recoveryPath}`)
      }
    }
    const currentBeforeCleanup = await fs.readFile(lockPath, 'utf8')
    if (currentBeforeCleanup !== rawOwner) throw new Error('stale lock changed before committed cleanup; refusing takeover')
    await fs.unlink(lockPath)
    await fs.rm(recoveryPath, { recursive: true, force: true })
    return
  }
  if (!['prepared', 'promoted'].includes(phase)) {
    throw new Error(`unknown recovery phase ${phase}; preserving ${recoveryPath}`)
  }

  const actions = []
  for (const record of records) {
    const target = resolveWithinAnyRoot(record.target, allowedRoots)
    const backup = record.backup
      ? resolveContainedPath(recoveryPath, relative(recoveryPath, record.backup))
      : null
    const [targetExists, backupExists] = await Promise.all([
      pathExists(target, fs),
      backup ? pathExists(backup, fs) : false
    ])

    if (state.version === 1 || record.existedBefore === undefined) {
      if (!targetExists && backupExists) actions.push({ type: 'restore', backup, target })
      else if (targetExists && !backupExists) continue
      else {
        throw new Error(`ambiguous recovery for ${record.kind}: target=${target} backup=${backup}; preserving ${recoveryPath}`)
      }
      continue
    }

    if (!record.existedBefore) {
      if (backupExists) {
        throw new Error(`ambiguous recovery for ${record.kind}: unexpected backup ${backup}; preserving ${recoveryPath}`)
      }
      if (!targetExists) continue
      const actualSha256 = createHash('sha256').update(await fs.readFile(target)).digest('hex')
      if (actualSha256 !== record.promotedSha256) {
        throw new Error(`ambiguous recovery for ${record.kind}: target SHA differs from promoted SHA; preserving ${recoveryPath}`)
      }
      actions.push({ type: 'remove', target })
      continue
    }

    if (!targetExists && backupExists) {
      actions.push({ type: 'restore', backup, target })
    } else if (targetExists && !backupExists) {
      if (state.version < 3) continue
      const actualSha256 = createHash('sha256').update(await fs.readFile(target)).digest('hex')
      if (record.oldSha256 && actualSha256 === record.oldSha256) continue
      throw new Error(`ambiguous recovery for ${record.kind}: existing target is neither safely backed up nor unchanged; preserving ${recoveryPath}`)
    } else if (targetExists && backupExists) {
      const actualSha256 = createHash('sha256').update(await fs.readFile(target)).digest('hex')
      if (actualSha256 !== record.promotedSha256) {
        throw new Error(`ambiguous recovery for ${record.kind}: target SHA differs from promoted SHA; preserving ${recoveryPath}`)
      }
      actions.push({ type: 'replace', backup, target })
    } else {
      throw new Error(`ambiguous recovery for ${record.kind}: old target and backup are both missing; preserving ${recoveryPath}`)
    }
  }

  const currentBeforeRecovery = await fs.readFile(lockPath, 'utf8')
  if (currentBeforeRecovery !== rawOwner) throw new Error('stale lock changed before recovery; refusing takeover')
  for (const action of actions) {
    if (action.type === 'remove') await fs.unlink(action.target)
    if (action.type === 'replace') await fs.unlink(action.target)
    if (action.type === 'restore' || action.type === 'replace') await fs.rename(action.backup, action.target)
  }
  const current = await fs.readFile(lockPath, 'utf8')
  if (current !== rawOwner) throw new Error('stale lock changed during recovery; refusing takeover')
  await fs.unlink(lockPath)
  await fs.rm(recoveryPath, { recursive: true, force: true })
}

export async function acquireIconSyncLock(lockPath, options = {}) {
  const fs = { access, open, readFile, rename, rm, unlink, writeFile, ...options.operations }
  const token = options.token || randomUUID()
  const owner = {
    token,
    pid: options.pid ?? process.pid,
    startedAt: options.startedAt || new Date().toISOString(),
    recoveryPath: null
  }
  let handle
  try {
    handle = await fs.open(lockPath, 'wx')
  } catch (error) {
    if (error.code === 'EEXIST') {
      let rawOwner
      let existing
      try {
        rawOwner = await fs.readFile(lockPath, 'utf8')
        existing = JSON.parse(rawOwner)
      } catch (ownerError) {
        throw new Error(`wiki icon sync lock owner cannot be confirmed; refusing takeover: ${ownerError.message}`)
      }
      if (!Number.isInteger(existing.pid) || !existing.token || !existing.startedAt) {
        throw new Error('wiki icon sync lock owner metadata is incomplete; refusing takeover')
      }
      let alive
      try {
        alive = await (options.isProcessAlive || defaultProcessAlive)(existing.pid)
      } catch (aliveError) {
        throw new Error(`wiki icon sync lock owner cannot be confirmed; refusing takeover: ${aliveError.message}`)
      }
      if (alive) throw new Error(`wiki icon sync is already running in active process ${existing.pid}`)
      await recoverDeadOwner(
        lockPath,
        rawOwner,
        existing,
        fs,
        (options.allowedRoots || [dirname(lockPath)]).map(root => resolve(root))
      )
      return acquireIconSyncLock(lockPath, options)
    }
    throw error
  }

  try {
    await handle.writeFile(`${JSON.stringify(owner)}\n`, 'utf8')
    await handle.close()
    handle = undefined
  } catch (error) {
    await handle?.close().catch(() => {})
    await fs.unlink(lockPath).catch(() => {})
    throw error
  }

  let released = false
  const release = async ({ preserve = false } = {}) => {
    if (released) return
    released = true
    await handle?.close()
    if (preserve) return
    const currentToken = await fs.readFile(lockPath, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return undefined
      throw error
    })
    let currentOwner
    try {
      currentOwner = currentToken ? JSON.parse(currentToken) : undefined
    } catch {}
    if (currentOwner?.token === token) {
      await fs.unlink(lockPath).catch(error => {
        if (error.code !== 'ENOENT') throw error
      })
    }
  }
  release.setRecoveryPath = async recoveryPath => {
    const nextOwner = {
      ...owner,
      recoveryPath: resolveContainedPath(dirname(lockPath), relative(dirname(lockPath), recoveryPath))
    }
    const temporary = resolveContainedPath(dirname(lockPath), `${lockPath.split(/[\\/]/).pop()}.metadata-${token}-${randomUUID()}`)
    let primaryError
    try {
      await fs.writeFile(temporary, `${JSON.stringify(nextOwner)}\n`, 'utf8')
      const current = await fs.readFile(lockPath, 'utf8')
      let currentOwner
      try {
        currentOwner = JSON.parse(current)
      } catch (error) {
        throw new Error(`owned lock metadata became unreadable before atomic update: ${error.message}`)
      }
      if (currentOwner.token !== token) throw new Error('owned lock changed before atomic metadata update; refusing replacement')
      await fs.rename(temporary, lockPath)
      Object.assign(owner, nextOwner)
    } catch (error) {
      primaryError = error
      throw error
    } finally {
      try {
        await fs.unlink(temporary)
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') {
          if (primaryError) {
            throw recoveryAggregate(primaryError, [cleanupError], `lock metadata update and cleanup failed: ${primaryError.message}`)
          }
          throw cleanupError
        }
      }
    }
  }
  release.owner = owner
  return release
}

export async function withIconSyncLock(lockPath, task, options = {}) {
  const release = await acquireIconSyncLock(lockPath, options)
  let primaryError
  try {
    return await task(release)
  } catch (error) {
    primaryError = error
    throw error
  } finally {
    try {
      await release({ preserve: Boolean(primaryError?.recoveryRequired) })
    } catch (releaseError) {
      if (primaryError) {
        throw recoveryAggregate(
          primaryError,
          [releaseError],
          `icon sync failed and lock release also failed: ${primaryError.message}`,
          primaryError.recoveryPaths || []
        )
      }
      throw releaseError
    }
  }
}

export async function commitIconSyncTransaction({
  pendingRenames,
  manifestPath,
  manifestDirectory,
  outputDirectory,
  stagingDirectory,
  serializedManifest,
  manifestChanged,
  operations = {}
}) {
  const fs = { access, readFile, rename, unlink, writeFile, ...operations }
  if (!stagingDirectory) throw new Error('icon sync transaction requires a unique staging directory')
  if (!outputDirectory) throw new Error('icon sync transaction requires an output directory containment boundary')
  if (!manifestDirectory) throw new Error('icon sync transaction requires a manifest directory containment boundary')
  const safeStaging = resolve(stagingDirectory)
  const safeOutput = resolve(outputDirectory)
  const safeManifest = resolveContainedPath(manifestDirectory, relative(manifestDirectory, manifestPath))
  const manifestTemporary = resolveContainedPath(safeStaging, 'manifest.next.json')
  const manifestBackup = resolveContainedPath(safeStaging, 'manifest.backup')
  const recoveryStatePath = resolveContainedPath(safeStaging, 'recovery-state.json')
  const states = pendingRenames.map((pending, index) => ({
    ...pending,
    temporary: resolveContainedPath(safeStaging, relative(safeStaging, pending.temporary)),
    target: resolveContainedPath(safeOutput, relative(safeOutput, pending.target)),
    backup: resolveContainedPath(safeStaging, `icon-${index}.backup`),
    backedUp: false,
    promoted: false
  }))
  let manifestBackedUp = false
  let manifestPromoted = false
  let transactionSucceeded = false
  let rollbackComplete = false
  let primaryError

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
      state.existedBefore = exists
      state.promotedSha256 = createHash('sha256').update(await fs.readFile(state.temporary)).digest('hex')
      state.oldSha256 = exists
        ? createHash('sha256').update(await fs.readFile(state.target)).digest('hex')
        : null
    }

    const recoveryState = {
      version: 3,
      phase: 'prepared',
      entries: states.map(state => ({
        target: state.target,
        backup: state.replaceExisting ? state.backup : null,
        existedBefore: state.existedBefore,
        oldSha256: state.oldSha256,
        promotedSha256: state.promotedSha256
      })),
      manifest: manifestChanged ? {
        target: safeManifest,
        backup: manifestBackup,
        existedBefore: await pathExists(safeManifest, fs),
        oldSha256: await pathExists(safeManifest, fs)
          ? createHash('sha256').update(await fs.readFile(safeManifest)).digest('hex')
          : null,
        promotedSha256: createHash('sha256').update(serializedManifest).digest('hex')
      } : null
    }

    if (manifestChanged) {
      await fs.writeFile(manifestTemporary, serializedManifest, 'utf8')
    }
    await writeJsonAtomically(recoveryStatePath, recoveryState, fs, 'state')

    for (const state of states) {
      if (state.replaceExisting) {
        await fs.rename(state.target, state.backup)
        state.backedUp = true
      }
      await fs.rename(state.temporary, state.target)
      state.promoted = true
    }
    recoveryState.phase = 'promoted'
    await writeJsonAtomically(recoveryStatePath, recoveryState, fs, 'state')

    if (manifestChanged) {
      await fs.rename(safeManifest, manifestBackup)
      manifestBackedUp = true
      await fs.rename(manifestTemporary, safeManifest)
      manifestPromoted = true
    }
    recoveryState.phase = 'manifest-committed'
    await writeJsonAtomically(recoveryStatePath, recoveryState, fs, 'state')
    recoveryState.phase = 'cleanup'
    await writeJsonAtomically(recoveryStatePath, recoveryState, fs, 'state')
    transactionSucceeded = true
  } catch (error) {
    primaryError = error
    const rollbackErrors = []
    if (manifestPromoted) {
      await fs.unlink(safeManifest).catch(rollbackError => rollbackErrors.push(rollbackError))
    }
    if (manifestBackedUp) {
      await fs.rename(manifestBackup, safeManifest)
        .then(() => { manifestBackedUp = false })
        .catch(rollbackError => rollbackErrors.push(rollbackError))
    }
    for (const state of [...states].reverse()) {
      if (state.promoted) {
        await fs.unlink(state.target).catch(rollbackError => {
          if (rollbackError.code !== 'ENOENT') rollbackErrors.push(rollbackError)
        })
      }
      if (state.backedUp) {
        await fs.rename(state.backup, state.target)
          .then(() => { state.backedUp = false })
          .catch(rollbackError => rollbackErrors.push(rollbackError))
      }
    }
    if (rollbackErrors.length) {
      const recoveryPaths = [safeStaging]
      const backupPaths = [
        ...states.filter(state => state.backedUp).map(state => state.backup),
        ...(manifestBackedUp ? [manifestBackup] : [])
      ]
      throw recoveryAggregate(
        error,
        rollbackErrors,
        `icon sync failed and rollback was incomplete; preserve recovery directory ${safeStaging}; backups: ${backupPaths.join(', ')}`,
        recoveryPaths
      )
    }
    rollbackComplete = true
    throw error
  } finally {
    if (transactionSucceeded || rollbackComplete || !primaryError) {
      const cleanupErrors = []
      for (const path of [
        ...states.map(state => state.temporary),
        ...states.map(state => state.backup),
        manifestTemporary,
        manifestBackup,
        recoveryStatePath
      ]) {
        await fs.unlink(path).catch(error => {
          if (error.code !== 'ENOENT') cleanupErrors.push(error)
        })
      }
      if (cleanupErrors.length) {
        if (primaryError) {
          throw recoveryAggregate(
            primaryError,
            cleanupErrors,
            `icon sync failed and transaction cleanup also failed: ${primaryError.message}`,
            [safeStaging]
          )
        }
        throw new AggregateError(cleanupErrors, 'icon sync transaction cleanup failed')
      }
    }
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
