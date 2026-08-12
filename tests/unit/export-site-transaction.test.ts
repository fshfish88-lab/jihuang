import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
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
    commit: 'test-commit',
    builtAt: '2026-08-13T00:00:00.000Z',
  }
}

async function siblingResidues(target: string): Promise<string[]> {
  const prefix = `.${basename(target)}.`
  return (await readdir(dirname(target))).filter(name => name.startsWith(prefix))
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('atomic static-site export', () => {
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

  it('replaces the artifact only after a verified staging copy is complete', async () => {
    const { exportSiteAtomically } = await helpers()
    const root = await temporaryDirectory()
    const source = await createSource(root)
    const target = await createOldTarget(root)

    await exportSiteAtomically({ source, target, buildInfo: buildInfo() })

    expect(await readFile(join(target, 'index.html'), 'utf8')).toContain('new home')
    expect(await readFile(join(target, 'wiki', 'index.html'), 'utf8')).toContain('new wiki')
    await expect(readFile(join(target, 'old-only.txt'))).rejects.toMatchObject({ code: 'ENOENT' })
    expect(JSON.parse(await readFile(join(target, 'build-info.json'), 'utf8'))).toEqual(buildInfo())
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
