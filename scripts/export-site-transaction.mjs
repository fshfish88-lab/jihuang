import { createHash, randomUUID } from 'node:crypto'
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'

const defaultOperations = { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile }

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

export async function exportSiteAtomically({
  source,
  target,
  buildInfo,
  operations: operationOverrides = {},
  uniqueId = randomUUID,
}) {
  const operations = { ...defaultOperations, ...operationOverrides }

  // Source validation is deliberately completed before any target-side path is created.
  const sourceSnapshot = await validateSource(source, operations)
  const parent = dirname(target)
  const targetName = basename(target)
  const runId = uniqueId()
  const staging = join(parent, `.${targetName}.staging-${runId}`)
  const backup = join(parent, `.${targetName}.backup-${runId}`)
  const lock = join(parent, `.${targetName}.export.lock`)
  let lockAcquired = false
  let stagingCreated = false
  let backupCreated = false

  await operations.mkdir(parent, { recursive: true })
  try {
    try {
      await operations.mkdir(lock)
      lockAcquired = true
    } catch (error) {
      if (error?.code === 'EEXIST') {
        throw new Error(`Another static-site export is already running (lock: ${lock})`, { cause: error })
      }
      throw error
    }

    await operations.mkdir(staging)
    stagingCreated = true
    await operations.cp(source, staging, { recursive: true })

    const copiedSnapshot = await snapshotDirectory(staging, operations)
    if (!snapshotsMatch(sourceSnapshot, copiedSnapshot)) {
      throw new Error('Staging verification failed: copied files do not match the static export source')
    }

    await operations.writeFile(
      join(staging, 'build-info.json'),
      `${JSON.stringify(buildInfo, null, 2)}\n`,
    )
    await requireDirectory(staging, operations, 'Static export staging directory')
    await requireIndex(staging, operations, 'Static export staging directory')
    await operations.stat(join(staging, 'build-info.json'))

    if (await pathExists(target, operations)) {
      await operations.rename(target, backup)
      backupCreated = true
    }

    try {
      await operations.rename(staging, target)
      stagingCreated = false
    } catch (promotionError) {
      if (backupCreated) {
        try {
          await operations.rename(backup, target)
          backupCreated = false
        } catch (restoreError) {
          throw new AggregateError(
            [promotionError, restoreError],
            `Static export promotion failed and the old artifact could not be restored from ${backup}`,
          )
        }
      }
      throw promotionError
    }

    if (backupCreated) {
      await operations.rm(backup, { recursive: true })
      backupCreated = false
    }

    return { target, staging, backup, lock }
  } finally {
    try {
      if (stagingCreated) await operations.rm(staging, { recursive: true, force: true })
      // Never remove an unrestored backup: it is the last byte-identical old artifact.
    } finally {
      if (lockAcquired) await operations.rm(lock, { recursive: true })
    }
  }
}
