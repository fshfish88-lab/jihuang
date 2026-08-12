import { createHash, randomUUID } from 'node:crypto'
import {
  cp,
  mkdir,
  readFile,
  realpath,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { readAndVerifyBuildManifest } from './build-manifest.mjs'

const defaultOperations = { cp, mkdir, readFile, realpath, readdir, rename, rm, stat, writeFile }

/** @returns {string} */
function createToken() {
  return randomUUID()
}

function formatFsError(error) {
  return error instanceof Error ? error.message : String(error)
}

async function requireDirectory(path, operations, label) {
  let details
  try {
    details = await operations.stat(path)
  } catch (error) {
    throw new Error(`${label} is missing: ${path} (${formatFsError(error)})`, { cause: error })
  }
  if (!details.isDirectory()) throw new Error(`${label} is not a directory: ${path}`)
}

async function requireIndex(path, operations, label) {
  const indexPath = join(path, 'index.html')
  let details
  try {
    details = await operations.stat(indexPath)
  } catch (error) {
    throw new Error(`${label} is missing index.html: ${indexPath}`, { cause: error })
  }
  if (!details.isFile()) throw new Error(`${label} index.html is not a file: ${indexPath}`)
}

async function snapshotDirectory(root, operations, current = root) {
  const entries = await operations.readdir(current, { withFileTypes: true })
  const snapshot = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(current, entry.name)
    const pathFromRoot = relative(root, path).replaceAll('\\', '/')
    if (entry.isDirectory()) {
      snapshot.push(`directory:${pathFromRoot}`)
      snapshot.push(...await snapshotDirectory(root, operations, path))
    } else if (entry.isFile()) {
      const details = await operations.stat(path)
      const digest = createHash('sha256').update(await operations.readFile(path)).digest('hex')
      snapshot.push(`file:${pathFromRoot}:${details.size}:${digest}`)
    } else {
      throw new Error(`Static export contains an unsupported filesystem entry: ${path}`)
    }
  }
  return snapshot
}

async function validateSource(source, operations) {
  await requireDirectory(source, operations, 'Static export source')
  const entries = await operations.readdir(source)
  if (entries.length === 0) throw new Error(`Static export source is empty: ${source}`)
  await requireIndex(source, operations, 'Static export source')
  return snapshotDirectory(source, operations)
}

async function pathExists(path, operations) {
  try {
    await operations.stat(path)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

function snapshotsMatch(expected, actual) {
  return expected.length === actual.length && expected.every((entry, index) => entry === actual[index])
}

export async function artifactIdentity(path, operationOverrides = {}) {
  const operations = { ...defaultOperations, ...operationOverrides }
  if (!await pathExists(path, operations)) return { exists: false }
  await requireDirectory(path, operations, 'Artifact identity target')
  const snapshot = await snapshotDirectory(path, operations)
  return {
    exists: true,
    entries: snapshot.length,
    sha256: createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'),
  }
}

function identitiesMatch(left, right) {
  return Boolean(left && right)
    && left.exists === right.exists
    && (!left.exists || (left.entries === right.entries && left.sha256 === right.sha256))
}

function defaultIsProcessAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (error?.code === 'ESRCH') return false
    if (error?.code === 'EPERM') return true
    throw error
  }
}

function transactionJournal({ token, target, staging, backup, phase }) {
  return { token, pid: process.pid, startedAt: new Date().toISOString(), target, staging, backup, phase }
}

async function writeJournal(lock, journal, operations) {
  await operations.writeFile(join(lock, 'transaction.json'), `${JSON.stringify(journal, null, 2)}\n`)
}

function validateRecordedTransaction(journal, target) {
  if (
    !journal
    || typeof journal.token !== 'string'
    || !/^[a-zA-Z0-9-]+$/.test(journal.token)
    || !Number.isSafeInteger(journal.pid)
    || typeof journal.startedAt !== 'string'
    || typeof journal.phase !== 'string'
    || typeof journal.target !== 'string'
    || typeof journal.staging !== 'string'
    || typeof journal.backup !== 'string'
  ) throw new Error('Existing export lock has an invalid or incomplete transaction journal')

  const parent = dirname(target)
  const targetName = basename(target)
  const expectedStaging = join(parent, `.${targetName}.staging-${journal.token}`)
  const expectedBackup = join(parent, `.${targetName}.backup-${journal.token}`)
  if (
    normalizedWindowsPath(journal.target) !== normalizedWindowsPath(target)
    || normalizedWindowsPath(journal.staging) !== normalizedWindowsPath(expectedStaging)
    || normalizedWindowsPath(journal.backup) !== normalizedWindowsPath(expectedBackup)
  ) throw new Error('Existing export lock journal paths do not match this export target; refusing recovery')
}

async function recoverDeadTransaction({ lock, target, operations, isProcessAlive }) {
  let journal
  try {
    journal = JSON.parse(await operations.readFile(join(lock, 'transaction.json'), 'utf8'))
  } catch (error) {
    throw new Error(`Existing export lock cannot be safely inspected; refusing recovery: ${lock}`, { cause: error })
  }
  validateRecordedTransaction(journal, target)
  if (isProcessAlive(journal.pid)) {
    throw new Error(`Static-site export is already running with live PID ${journal.pid} (lock: ${lock})`)
  }

  const parent = dirname(target)
  const backupPrefix = `.${basename(target)}.backup-`
  const backupNames = (await operations.readdir(parent)).filter(name => name.startsWith(backupPrefix))
  const targetExists = await pathExists(target, operations)
  const stagingExists = await pathExists(journal.staging, operations)
  if (journal.phase === 'acquiring' && backupNames.length === 0) {
    if (stagingExists) {
      throw new Error(`Dead acquiring-phase export already has staging side effects; preserving lock and staging: ${lock}`)
    }
    const currentIdentity = await artifactIdentity(target, operations)
    if (!identitiesMatch(journal.oldTargetIdentity, currentIdentity)) {
      throw new Error(`Dead acquiring-phase export target identity changed; preserving target and lock: ${lock}`)
    }
    await operations.rm(lock, { recursive: true })
    return
  }
  if (['prepared', 'copying'].includes(journal.phase) && backupNames.length === 0) {
    if (stagingExists) await operations.rm(journal.staging, { recursive: true, force: true })
    const currentIdentity = await artifactIdentity(target, operations)
    if (!identitiesMatch(journal.oldTargetIdentity, currentIdentity)) {
      throw new Error(`Dead ${journal.phase}-phase export target identity changed; preserving target and lock: ${lock}`)
    }
    await operations.rm(lock, { recursive: true })
    return
  }
  if (targetExists && journal.phase === 'cleanup' && backupNames.length === 0 && !stagingExists) {
    await verifyCompletedExportTarget(target, operations)
    await operations.rm(lock, { recursive: true })
    return
  }
  if (stagingExists) {
    await operations.rm(journal.staging, { recursive: true, force: true })
  }
  if (!targetExists) {
    if (backupNames.length !== 1 || normalizedWindowsPath(join(parent, backupNames[0])) !== normalizedWindowsPath(journal.backup)) {
      throw new Error(`Dead export recovery is ambiguous; preserving lock and ${backupNames.length} backup path(s): ${lock}`)
    }
    await operations.rename(journal.backup, target)
  } else {
    throw new Error(`Dead export recovery is ambiguous because the target still exists; preserving target, backups, and lock: ${lock}`)
  }
  await operations.rm(lock, { recursive: true })
}

async function verifyCompletedExportTarget(target, operations) {
  const targetPath = normalizedWindowsPath(target)
  const manifest = await readAndVerifyBuildManifest(target, {
    ...operations,
    readdir: async (path, options) => {
      const entries = await operations.readdir(path, options)
      if (normalizedWindowsPath(String(path)) !== targetPath) return entries
      return entries.filter(entry => (typeof entry === 'string' ? entry : entry.name) !== 'build-info.json')
    },
  })
  let buildInfo
  try {
    buildInfo = JSON.parse(await operations.readFile(join(target, 'build-info.json'), 'utf8'))
  } catch (error) {
    throw new Error('Completed cleanup-phase target has missing or invalid build-info.json', { cause: error })
  }
  if (
    buildInfo.commit !== manifest.commit
    || buildInfo.baseURL !== manifest.baseURL
    || buildInfo.generatedAt !== manifest.generatedAt
  ) throw new Error('Completed cleanup-phase target build-info does not match its build manifest')
}

async function acquireTransactionLock({ lock, journal, target, operations, isProcessAlive }) {
  let recoveredPreviousTransaction = false
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await operations.mkdir(lock)
      try {
        await writeJournal(lock, journal, operations)
      } catch (error) {
        try {
          await operations.rm(lock, { recursive: true })
        } catch (cleanupError) {
          throw new AggregateError([error, cleanupError], `Export lock initialization failed and lock cleanup also failed: ${lock}`)
        }
        throw error
      }
      return recoveredPreviousTransaction
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error
      if (attempt > 0) throw new Error(`Static-site export lock could not be acquired after recovery: ${lock}`, { cause: error })
      await recoverDeadTransaction({ lock, target, operations, isProcessAlive })
      recoveredPreviousTransaction = true
    }
  }
}

function combinedTransactionError(primaryError, cleanupErrors) {
  const errors = []
  if (primaryError instanceof AggregateError) errors.push(...primaryError.errors)
  else if (primaryError) errors.push(primaryError)
  errors.push(...cleanupErrors)
  if (errors.length === 1) return errors[0]
  const primaryMessage = primaryError instanceof AggregateError
    ? primaryError.message
    : primaryError ? formatFsError(primaryError) : ''
  const cleanupMessage = cleanupErrors.map(error => formatFsError(error)).join('; ')
  return new AggregateError(errors, [primaryMessage, cleanupMessage].filter(Boolean).join('; '))
}

async function canonicalPath(path, operations) {
  let candidate = resolve(path)
  const missingSegments = []
  while (true) {
    try {
      return resolve(await operations.realpath(candidate), ...missingSegments.reverse())
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
      const parent = dirname(candidate)
      if (parent === candidate) throw error
      missingSegments.push(basename(candidate))
      candidate = parent
    }
  }
}

function normalizedWindowsPath(path) {
  return resolve(path).replaceAll('/', '\\').replace(/[\\]+$/, '').toLocaleLowerCase('en-US')
}

async function rejectOverlappingPaths(source, target, operations) {
  const sourcePath = normalizedWindowsPath(await canonicalPath(source, operations))
  const targetPath = normalizedWindowsPath(await canonicalPath(target, operations))
  const separator = sep === '/' ? '\\' : sep
  if (
    sourcePath === targetPath
    || sourcePath.startsWith(`${targetPath}${separator}`)
    || targetPath.startsWith(`${sourcePath}${separator}`)
  ) {
    throw new Error(`Static export source and target overlap (same path or ancestor/descendant): ${source} <-> ${target}`)
  }
}

export async function exportSiteAtomically({
  source,
  target,
  buildInfo,
  operations: operationOverrides = {},
  uniqueId = createToken,
  isProcessAlive = defaultIsProcessAlive,
}) {
  const operations = { ...defaultOperations, ...operationOverrides }

  // Canonical overlap and completed-source validation finish before any target-side mkdir/rename.
  await rejectOverlappingPaths(source, target, operations)
  const sourceSnapshot = await validateSource(source, operations)
  const buildManifest = await readAndVerifyBuildManifest(source, operations)
  const parent = dirname(target)
  const targetName = basename(target)
  const runId = uniqueId()
  if (typeof runId !== 'string' || !/^[a-zA-Z0-9-]+$/.test(runId)) {
    throw new Error('Static export transaction token contains unsafe path characters')
  }
  const staging = join(parent, `.${targetName}.staging-${runId}`)
  const backup = join(parent, `.${targetName}.backup-${runId}`)
  const lock = join(parent, `.${targetName}.export.lock`)
  const oldTargetIdentity = await artifactIdentity(target, operations)
  const journal = {
    ...transactionJournal({ token: runId, target, staging, backup, phase: 'acquiring' }),
    oldTargetIdentity,
  }
  let lockAcquired = false
  let stagingCreated = false
  let backupCreated = false
  let preserveRecoveryJournal = false
  let primaryError
  let result

  await operations.mkdir(parent, { recursive: true })
  try {
    const recoveredPreviousTransaction = await acquireTransactionLock({ lock, journal, target, operations, isProcessAlive })
    lockAcquired = true

    const targetIdentityAfterLock = await artifactIdentity(target, operations)
    if (recoveredPreviousTransaction) {
      journal.oldTargetIdentity = targetIdentityAfterLock
      await writeJournal(lock, journal, operations)
    } else if (!identitiesMatch(journal.oldTargetIdentity, targetIdentityAfterLock)) {
      throw new Error('Static export target changed while the transaction lock was being acquired')
    }
    journal.phase = 'prepared'
    await writeJournal(lock, journal, operations)
    journal.phase = 'copying'
    await writeJournal(lock, journal, operations)
    await operations.mkdir(staging)
    stagingCreated = true
    await operations.cp(source, staging, { recursive: true })

    const sourceAfterCopy = await snapshotDirectory(source, operations)
    if (!snapshotsMatch(sourceSnapshot, sourceAfterCopy)) {
      throw new Error('Static export source changed while it was being copied')
    }
    await readAndVerifyBuildManifest(source, operations)
    const copiedSnapshot = await snapshotDirectory(staging, operations)
    if (!snapshotsMatch(sourceSnapshot, copiedSnapshot)) {
      throw new Error('Staging verification failed: copied files do not match the static export source')
    }
    const stagedBuildManifest = await readAndVerifyBuildManifest(staging, operations)
    if (JSON.stringify(stagedBuildManifest) !== JSON.stringify(buildManifest)) {
      throw new Error('Staging build manifest does not match the completed source manifest')
    }

    const buildInfoPath = join(staging, 'build-info.json')
    const expectedBuildInfo = Buffer.from(`${JSON.stringify({
      ...buildInfo,
      commit: buildManifest.commit,
      baseURL: buildManifest.baseURL,
      generatedAt: buildManifest.generatedAt,
    }, null, 2)}\n`)
    await operations.writeFile(buildInfoPath, expectedBuildInfo)
    await requireDirectory(staging, operations, 'Static export staging directory')
    await requireIndex(staging, operations, 'Static export staging directory')
    const actualBuildInfo = await operations.readFile(buildInfoPath)
    const expectedBuildInfoHash = createHash('sha256').update(expectedBuildInfo).digest('hex')
    const actualBuildInfoHash = createHash('sha256').update(actualBuildInfo).digest('hex')
    if (actualBuildInfo.length !== expectedBuildInfo.length || actualBuildInfoHash !== expectedBuildInfoHash) {
      throw new Error('Build-info verification failed: written bytes do not match the expected size and SHA-256')
    }

    const currentTargetIdentity = await artifactIdentity(target, operations)
    if (!identitiesMatch(journal.oldTargetIdentity, currentTargetIdentity)) {
      throw new Error('Static export target changed or was deleted before backup; refusing to publish staging')
    }
    if (currentTargetIdentity.exists) {
      journal.phase = 'backing-up'
      await writeJournal(lock, journal, operations)
      // On Windows this is a lock-protected, crash-recoverable two-rename exchange.
      // Readers that ignore the lock can briefly observe no target; it is not atomic for them.
      await operations.rename(target, backup)
      backupCreated = true
      preserveRecoveryJournal = true
      const backupIdentity = await artifactIdentity(backup, operations)
      if (!identitiesMatch(journal.oldTargetIdentity, backupIdentity)) {
        try {
          await operations.rename(backup, target)
          backupCreated = false
          preserveRecoveryJournal = false
        } catch (restoreError) {
          throw new AggregateError(
            [new Error('Renamed backup identity changed before promotion'), restoreError],
            `Backup identity verification failed; recovery evidence preserved at lock ${lock}, journal ${join(lock, 'transaction.json')}, backup ${backup}`,
          )
        }
        throw new Error('Renamed backup identity changed before promotion; external bytes were restored to target')
      }
    }

    try {
      journal.phase = 'promoting'
      await writeJournal(lock, journal, operations)
      await operations.rename(staging, target)
      stagingCreated = false
    } catch (promotionError) {
      if (backupCreated) {
        try {
          await operations.rename(backup, target)
          backupCreated = false
          preserveRecoveryJournal = false
        } catch (restoreError) {
          throw new AggregateError(
            [promotionError, restoreError],
            `Static export promotion failed; recovery evidence preserved at lock ${lock}, journal ${join(lock, 'transaction.json')}, backup ${backup}`,
          )
        }
      }
      throw promotionError
    }

    if (backupCreated) {
      journal.phase = 'cleanup'
      await writeJournal(lock, journal, operations)
      await operations.rm(backup, { recursive: true })
      backupCreated = false
      preserveRecoveryJournal = false
    }

    result = { target, staging, backup, lock }
  } catch (error) {
    primaryError = error
  } finally {
    const cleanupErrors = []
    try {
      if (stagingCreated) await operations.rm(staging, { recursive: true, force: true })
    } catch (error) {
      cleanupErrors.push(error)
    }
    // Never remove an unrestored backup: it is the last byte-identical old artifact.
    try {
      if (lockAcquired && !preserveRecoveryJournal) await operations.rm(lock, { recursive: true })
    } catch (error) {
      cleanupErrors.push(error)
    }
    if (primaryError || cleanupErrors.length > 0) throw combinedTransactionError(primaryError, cleanupErrors)
  }
  return result
}
