import { cp, mkdir, readFile, realpath, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []

async function helpers() {
  return import('../../scripts/export-site-transaction.mjs')
}

async function temporaryDirectory(): Promise<string> {
  const directory = await import('node:fs/promises')
    .then(({ mkdtemp }) => mkdtemp(join(tmpdir(), 'campfire-wiki-export-')))
  temporaryDirectories.push(directory)
  return directory
}

async function createSource(root: string): Promise<string> {
  const source = join(root, '.output', 'public')
  await mkdir(join(source, 'wiki'), { recursive: true })
  await Promise.all([
    writeFile(join(source, 'index.html'), '<h1>new home</h1>'),
    writeFile(join(source, 'wiki', 'index.html'), '<h1>new wiki</h1>'),
  ])
  const { writeCompletedBuildManifest } = await import('../../scripts/build-manifest.mjs')
  await writeCompletedBuildManifest({
    source,
    commit: 'generated-commit',
    baseURL: '/jihuang/',
    generatedAt: '2026-08-13T00:00:00.000Z',
  })
  return source
}

async function createOldTarget(root: string): Promise<string> {
  const target = join(root, '成品文件', 'github-pages')
  await mkdir(target, { recursive: true })
  await Promise.all([
    writeFile(join(target, 'index.html'), '<h1>old home</h1>'),
    writeFile(join(target, 'old-only.txt'), 'trusted old artifact'),
  ])
  return target
}

function buildInfo() {
  return {
    name: 'campfire-wiki',
    version: '0.1.0',
  }
}

async function siblingResidues(target: string): Promise<string[]> {
  const prefix = `.${basename(target)}.`
  return (await readdir(dirname(target))).filter(name => name.startsWith(prefix))
}

async function createTransactionLock(target: string, transaction: Record<string, unknown>) {
  const lock = join(dirname(target), `.${basename(target)}.export.lock`)
  await mkdir(lock, { recursive: true })
  await writeFile(join(lock, 'transaction.json'), `${JSON.stringify(transaction)}\n`)
  return lock
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('atomic static-site export', () => {
  it('rejects an ancestor target before any mkdir and preserves unrelated files', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const unrelated = join(root, 'unrelated.txt')
    await writeFile(unrelated, 'must survive')
    let mkdirCalls = 0

    await expect(exportSiteAtomically({
      source,
      target: root,
      buildInfo: buildInfo(),
      operations: {
        mkdir: async () => {
          mkdirCalls += 1
          throw new Error('mkdir must not be reached')
        },
      },
    })).rejects.toThrow(/overlap|ancestor|descendant/i)

    expect(mkdirCalls).toBe(0)
    expect(await readFile(unrelated, 'utf8')).toBe('must survive')
    expect(await readFile(join(source, 'index.html'), 'utf8')).toContain('new home')
  })

  it('rejects a realpath alias overlap before any target-side mkdir', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const alias = join(root, 'apparent-independent-target')
    await mkdir(alias)
    let mkdirCalls = 0

    await expect(exportSiteAtomically({
      source,
      target: alias,
      buildInfo: buildInfo(),
      operations: {
        realpath: async (path: Parameters<typeof realpath>[0]) => (
          String(path) === alias ? realpath(source) : realpath(path)
        ),
        mkdir: async () => {
          mkdirCalls += 1
          throw new Error('mkdir must not be reached')
        },
      },
    })).rejects.toThrow(/overlap/i)

    expect(mkdirCalls).toBe(0)
  })

  it.each([
    ['missing', async (root: string) => join(root, '.output', 'public')],
    ['non-directory', async (root: string) => {
      const source = join(root, '.output', 'public')
      await mkdir(dirname(source), { recursive: true })
      await writeFile(source, 'not a directory')
      return source
    }],
    ['empty', async (root: string) => {
      const source = join(root, '.output', 'public')
      await mkdir(source, { recursive: true })
      return source
    }],
    ['without index.html', async (root: string) => {
      const source = join(root, '.output', 'public')
      await mkdir(source, { recursive: true })
      await writeFile(join(source, 'other.html'), 'not an entry point')
      return source
    }],
  ])('rejects an invalid %s source before changing the old artifact', async (_kind, arrangeSource) => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await arrangeSource(root)
    const target = await createOldTarget(root)
    const oldIndex = await readFile(join(target, 'index.html'))
    const oldOnly = await readFile(join(target, 'old-only.txt'))

    await expect(exportSiteAtomically({ source, target, buildInfo: buildInfo() }))
      .rejects.toThrow(/source|index\.html|empty/i)

    expect(await readFile(join(target, 'index.html'))).toEqual(oldIndex)
    expect(await readFile(join(target, 'old-only.txt'))).toEqual(oldOnly)
    expect(await siblingResidues(target)).toEqual([])
  })

  it('preserves the old artifact when recursive copy fails', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        cp: async () => { throw new Error('injected copy failure') },
      },
    })).rejects.toThrow(/injected copy failure/i)

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(await siblingResidues(target)).toEqual([])
  })

  it.each(['stale', 'tampered', 'incomplete'])('rejects a %s completed source and preserves the old artifact', async (kind) => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    if (kind === 'stale') await writeFile(join(source, 'unlisted-after-generation.html'), 'stale extra output')
    else if (kind === 'tampered') await writeFile(join(source, 'index.html'), '<h1>tampered</h1>')
    else await rm(join(source, '.campfire-build.json'))

    await expect(exportSiteAtomically({ source, target, buildInfo: buildInfo() }))
      .rejects.toThrow(/manifest|snapshot|completed/i)

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
  })

  it('rejects a same-size corrupted staging copy before changing the old artifact', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        cp: async (...args: Parameters<typeof cp>) => {
          await cp(...args)
          const copiedFile = join(String(args[1]), 'wiki', 'index.html')
          const original = await readFile(copiedFile)
          await writeFile(copiedFile, Buffer.alloc(original.length, 120))
        },
      },
    })).rejects.toThrow(/staging verification|do not match/i)

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(await siblingResidues(target)).toEqual([])
  })

  it('rejects source mutation during copy and preserves the old artifact', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        cp: async (...args: Parameters<typeof cp>) => {
          await cp(...args)
          await writeFile(join(source, 'index.html'), '<h1>changed while copying</h1>')
        },
      },
    })).rejects.toThrow(/source|changed|snapshot|manifest/i)

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
  })

  it('preserves the old artifact when build-info writing fails', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        writeFile: async (path: Parameters<typeof writeFile>[0], ...args: any[]) => {
          if (String(path).endsWith('build-info.json')) throw new Error('injected build-info failure')
          return (writeFile as any)(path, ...args)
        },
      },
    })).rejects.toThrow(/injected build-info failure/i)

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(await siblingResidues(target)).toEqual([])
  })

  it('rejects same-size corrupted build-info bytes before changing the old artifact', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const oldIndex = await readFile(join(target, 'index.html'))
    const oldOnly = await readFile(join(target, 'old-only.txt'))

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        writeFile: async (path: Parameters<typeof writeFile>[0], data: Parameters<typeof writeFile>[1]) => {
          if (String(path).endsWith('build-info.json')) {
            if (!Buffer.isBuffer(data)) throw new Error('test expected build-info to be written as a Buffer')
            const expectedBytes = data
            await writeFile(path, Buffer.alloc(expectedBytes.length, 120))
            return
          }
          return writeFile(path, data)
        },
      },
    })).rejects.toThrow(/build-info|verification|do not match/i)

    expect(await readFile(join(target, 'index.html'))).toEqual(oldIndex)
    expect(await readFile(join(target, 'old-only.txt'))).toEqual(oldOnly)
    expect(await siblingResidues(target)).toEqual([])
  })

  it('restores the old artifact when promoting staging fails after backup rename', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    let renameCount = 0

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        rename: async (from: string, to: string) => {
          renameCount += 1
          if (renameCount === 2) throw new Error('injected promotion rename failure')
          await rename(from, to)
        },
      },
    })).rejects.toThrow(/injected promotion rename failure/i)

    expect(renameCount).toBe(3)
    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(await siblingResidues(target)).toEqual([])
  })

  it('preserves and reports the backup path when promotion and rollback both fail', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    let renameCount = 0
    let caught: unknown

    try {
      await exportSiteAtomically({
        source,
        target,
        buildInfo: buildInfo(),
        uniqueId: () => 'rollback-failure',
        operations: {
          rename: async (from: string, to: string) => {
            renameCount += 1
            if (renameCount === 2) throw new Error('primary promotion failure')
            if (renameCount === 3) throw new Error('secondary restore failure')
            await rename(from, to)
          },
        },
      })
    } catch (error) {
      caught = error
    }

    const backup = join(dirname(target), '.github-pages.backup-rollback-failure')
    const lock = join(dirname(target), '.github-pages.export.lock')
    expect(caught).toBeInstanceOf(AggregateError)
    expect((caught as Error).message).toMatch(/backup-rollback-failure/i)
    expect((caught as Error).message).toMatch(/export\.lock|transaction\.json/i)
    expect((caught as AggregateError).errors.map(error => (error as Error).message)).toEqual([
      'primary promotion failure',
      'secondary restore failure',
    ])
    expect(await readFile(join(backup, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(JSON.parse(await readFile(join(lock, 'transaction.json'), 'utf8'))).toMatchObject({
      token: 'rollback-failure',
      phase: 'promoting',
      backup,
    })
    await expect(stat(target)).rejects.toMatchObject({ code: 'ENOENT' })

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      isProcessAlive: () => false,
      operations: { cp: async () => { throw new Error('stop after journal recovery') } },
    })).rejects.toThrow(/stop after journal recovery/i)
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    await expect(stat(lock)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('replaces the artifact only after a verified staging copy is complete', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await exportSiteAtomically({ source, target, buildInfo: buildInfo() })

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('new home')
    expect(await readFile(join(target, 'wiki', 'index.html'), 'utf8')).toContain('new wiki')
    await expect(readFile(join(target, 'old-only.txt'))).rejects.toMatchObject({ code: 'ENOENT' })
    expect(JSON.parse(await readFile(join(target, 'build-info.json'), 'utf8'))).toEqual({
      ...buildInfo(),
      commit: 'generated-commit',
      baseURL: '/jihuang/',
      generatedAt: '2026-08-13T00:00:00.000Z',
    })
    expect(await siblingResidues(target)).toEqual([])
  })

  it('rejects a competing export and releases its lock in finally after failure', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const lock = join(dirname(target), `.${basename(target)}.export.lock`)
    await mkdir(lock)

    await expect(exportSiteAtomically({ source, target, buildInfo: buildInfo() }))
      .rejects.toThrow(/already running|lock/i)
    expect(await stat(lock)).toMatchObject({})
    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')

    await rm(lock, { recursive: true })
    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        cp: async () => { throw new Error('injected failure after lock') },
      },
    })).rejects.toThrow(/injected failure after lock/i)

    await expect(stat(lock)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('rejects a live transaction lock without changing its recorded paths', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const staging = join(dirname(target), '.github-pages.staging-live')
    const backup = join(dirname(target), '.github-pages.backup-live')
    const lock = await createTransactionLock(target, {
      token: 'live', pid: 4242, startedAt: '2026-08-13T00:00:00.000Z', target, staging, backup, phase: 'copying',
    })

    await expect(exportSiteAtomically({
      source, target, buildInfo: buildInfo(), isProcessAlive: () => true,
    })).rejects.toThrow(/already running|live|4242/i)

    expect(JSON.parse(await readFile(join(lock, 'transaction.json'), 'utf8'))).toMatchObject({ token: 'live', pid: 4242 })
    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
  })

  it('recovers the unique old backup from a dead transaction before starting', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const staging = join(dirname(target), '.github-pages.staging-dead')
    const backup = join(dirname(target), '.github-pages.backup-dead')
    await rename(target, backup)
    await mkdir(staging)
    await writeFile(join(staging, 'partial.txt'), 'partial')
    const lock = await createTransactionLock(target, {
      token: 'dead', pid: 4343, startedAt: '2026-08-13T00:00:00.000Z', target, staging, backup, phase: 'promoting',
    })

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      isProcessAlive: () => false,
      operations: { cp: async () => { throw new Error('stop after recovery') } },
    })).rejects.toThrow(/stop after recovery/i)

    expect(await readFile(join(target, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    await expect(stat(staging)).rejects.toMatchObject({ code: 'ENOENT' })
    await expect(stat(lock)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('accepts a completed cleanup-phase target, removes the dead lock, and continues', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = join(root, '成品文件', 'github-pages')
    await mkdir(dirname(target), { recursive: true })
    await cp(source, target, { recursive: true })
    await writeFile(join(target, 'build-info.json'), `${JSON.stringify({
      ...buildInfo(), commit: 'generated-commit', baseURL: '/jihuang/', generatedAt: '2026-08-13T00:00:00.000Z',
    })}\n`)
    const staging = join(dirname(target), '.github-pages.staging-cleanup')
    const backup = join(dirname(target), '.github-pages.backup-cleanup')
    const lock = await createTransactionLock(target, {
      token: 'cleanup', pid: 4545, startedAt: '2026-08-13T00:00:00.000Z', target, staging, backup, phase: 'cleanup',
    })

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      isProcessAlive: () => false,
      operations: { cp: async () => { throw new Error('continued after completed cleanup') } },
    })).rejects.toThrow(/continued after completed cleanup/i)

    await expect(stat(lock)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('new home')
  })

  it('preserves a cleanup-phase lock when the target no longer matches its build manifest', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = join(root, '成品文件', 'github-pages')
    await mkdir(dirname(target), { recursive: true })
    await cp(source, target, { recursive: true })
    await writeFile(join(target, 'build-info.json'), `${JSON.stringify({
      ...buildInfo(), commit: 'generated-commit', baseURL: '/jihuang/', generatedAt: '2026-08-13T00:00:00.000Z',
    })}\n`)
    await writeFile(join(target, 'index.html'), 'tampered after promotion')
    const staging = join(dirname(target), '.github-pages.staging-cleanup')
    const backup = join(dirname(target), '.github-pages.backup-cleanup')
    const lock = await createTransactionLock(target, {
      token: 'cleanup', pid: 4545, startedAt: '2026-08-13T00:00:00.000Z', target, staging, backup, phase: 'cleanup',
    })

    await expect(exportSiteAtomically({
      source, target, buildInfo: buildInfo(), isProcessAlive: () => false,
    })).rejects.toThrow(/ambiguous|manifest|match|refus/i)

    expect(await stat(lock)).toMatchObject({})
  })

  it('preserves ambiguous dead-transaction backups and refuses recovery', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const staging = join(dirname(target), '.github-pages.staging-dead')
    const backup = join(dirname(target), '.github-pages.backup-dead')
    const otherBackup = join(dirname(target), '.github-pages.backup-other')
    await rename(target, backup)
    await mkdir(staging)
    await writeFile(join(staging, 'partial.txt'), 'safe to clean')
    await mkdir(otherBackup)
    await writeFile(join(otherBackup, 'other.txt'), 'other backup')
    const lock = await createTransactionLock(target, {
      token: 'dead', pid: 4343, startedAt: '2026-08-13T00:00:00.000Z', target, staging, backup, phase: 'promoting',
    })

    await expect(exportSiteAtomically({
      source, target, buildInfo: buildInfo(), isProcessAlive: () => false,
    })).rejects.toThrow(/ambiguous|backup|refus/i)

    expect(await readFile(join(backup, 'old-only.txt'), 'utf8')).toBe('trusted old artifact')
    expect(await readFile(join(otherBackup, 'other.txt'), 'utf8')).toBe('other backup')
    await expect(stat(staging)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await stat(lock)).toMatchObject({})
  })

  it('keeps the primary failure first and appends staging and lock cleanup failures', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    let caught: unknown
    try {
      await exportSiteAtomically({
        source,
        target,
        buildInfo: buildInfo(),
        operations: {
          cp: async () => { throw new Error('primary copy failure') },
          rm: async (path: Parameters<typeof rm>[0], ...args: any[]) => {
            if (String(path).includes('.staging-')) throw new Error('secondary staging cleanup failure')
            if (String(path).endsWith('.export.lock')) throw new Error('tertiary lock cleanup failure')
            return (rm as any)(path, ...args)
          },
        },
      })
    } catch (error) {
      caught = error
    }

    expect(caught).toBeInstanceOf(AggregateError)
    expect((caught as AggregateError).errors.map(error => (error as Error).message)).toEqual([
      'primary copy failure',
      'secondary staging cleanup failure',
      'tertiary lock cleanup failure',
    ])
  })

  it('releases the export lock even when staging cleanup also fails', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)
    const lock = join(dirname(target), `.${basename(target)}.export.lock`)

    await expect(exportSiteAtomically({
      source,
      target,
      buildInfo: buildInfo(),
      operations: {
        cp: async () => { throw new Error('injected copy failure') },
        rm: async (path: Parameters<typeof rm>[0], ...args: any[]) => {
          if (String(path).includes('.staging-')) throw new Error('injected staging cleanup failure')
          return (rm as any)(path, ...args)
        },
      },
    })).rejects.toThrow(/injected staging cleanup failure/i)

    await expect(stat(lock)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('old home')
  })
})
