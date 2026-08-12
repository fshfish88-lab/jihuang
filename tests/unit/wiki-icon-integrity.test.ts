import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { access, mkdtemp, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []
const execFileAsync = promisify(execFile)

async function helpers() {
  return import('../../scripts/wiki-icon-integrity.mjs')
}

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'campfire-wiki-icons-'))
  temporaryDirectories.push(directory)
  return directory
}

function validPng(): Buffer {
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    Buffer.alloc(120, 1),
  ])
}

afterEach(async () => {
  const { rm } = await import('node:fs/promises')
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('wiki icon trust anchor helpers', () => {
  it('rejects an existing local icon when no prior manifest record trusts it', async () => {
    const { validateTrustedLocalIcon } = await helpers()

    expect(() => validateTrustedLocalIcon(validPng(), undefined, 'local icon'))
      .toThrow(/without a trusted manifest record/i)
  })

  it('accepts a valid PNG only when bytes and SHA-256 match the prior manifest record', async () => {
    const { validateIconBytes } = await helpers()
    const bytes = validPng()
    const expected = {
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    }

    expect(validateIconBytes(bytes, expected, 'trusted')).toEqual(expected)
    expect(() => validateIconBytes(bytes, { ...expected, bytes: expected.bytes + 1 }, 'trusted'))
      .toThrow(/byte count does not match trusted manifest/i)
    expect(() => validateIconBytes(Buffer.from(bytes).fill(2, 20), expected, 'trusted'))
      .toThrow(/SHA-256 does not match trusted manifest/i)
  })

  it('rejects malformed or undersized PNG downloads before they can be trusted', async () => {
    const { validateIconBytes } = await helpers()
    const proposed = validateIconBytes(validPng(), undefined, 'new icon')

    expect(proposed.bytes).toBe(validPng().length)
    expect(proposed.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(() => validateIconBytes(Buffer.alloc(128), undefined, 'new icon')).toThrow(/not a PNG/i)
    expect(() => validateIconBytes(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), undefined, 'new icon'))
      .toThrow(/too small/i)
  })

  it('leaves the prior manifest byte-identical when errors prevent atomic replacement', async () => {
    const { replaceManifestAtomically } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    const original = Buffer.from('{"trusted":true}\n')
    await writeFile(manifestPath, original)

    await expect(replaceManifestAtomically(manifestPath, '{"trusted":false}\n', ['download failed']))
      .rejects.toThrow(/download failed/i)
    expect(await readFile(manifestPath)).toEqual(original)
    await expect(readFile(`${manifestPath}.part`)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('replaces a complete manifest atomically only after a successful run', async () => {
    const { replaceManifestAtomically } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    await writeFile(manifestPath, '{"trusted":true}\n')

    await replaceManifestAtomically(manifestPath, '{"trusted":"next"}\n', [])

    expect(await readFile(manifestPath, 'utf8')).toBe('{"trusted":"next"}\n')
    await expect(readFile(`${manifestPath}.part`)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('creates independent staging directories and cleans only the requested run', async () => {
    const { createIconSyncStaging, removeIconSyncStaging } = await helpers()
    const directory = await temporaryDirectory()
    const first = await createIconSyncStaging(directory)
    const second = await createIconSyncStaging(directory)
    await writeFile(join(first, 'download.png'), 'first')
    await writeFile(join(second, 'download.png'), 'second')

    expect(first).not.toBe(second)
    await removeIconSyncStaging(first)

    await expect(access(first)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(join(second, 'download.png'), 'utf8')).toBe('second')
  })

  it('rejects a competing sync process and releases its own lock after failure', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const release = await acquireIconSyncLock(lockPath, { token: 'first-run' })

    await expect(acquireIconSyncLock(lockPath, { token: 'second-run' }))
      .rejects.toThrow(/already running/i)
    expect(await readFile(lockPath, 'utf8')).toContain('first-run')

    await release()
    const releaseAfterException = await acquireIconSyncLock(lockPath, { token: 'third-run' })
    await releaseAfterException()
    await expect(access(lockPath)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('does not remove a lock that no longer contains its ownership token', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const release = await acquireIconSyncLock(lockPath, { token: 'first-run' })
    await writeFile(lockPath, 'other-live-run\n')

    await release()

    expect(await readFile(lockPath, 'utf8')).toBe('other-live-run\n')
  })

  it('makes the real sync command fail clearly while another process owns the lock', async () => {
    const { acquireIconSyncLock } = await helpers()
    const root = process.cwd()
    const lockPath = join(root, 'public', 'images', 'wiki', '.wiki-icon-sync.lock')
    const release = await acquireIconSyncLock(lockPath, { token: 'integration-test-owner' })
    try {
      let failure: { stderr?: string } | undefined
      try {
        await execFileAsync(process.execPath, [join(root, 'scripts', 'sync-wiki-icons.mjs')], { cwd: root })
      } catch (error) {
        failure = error as { stderr?: string }
      }
      expect(failure?.stderr).toMatch(/already running/i)
      expect(await readFile(lockPath, 'utf8')).toBe('integration-test-owner\n')
    } finally {
      await release()
    }
  })

  it('rolls back every promoted new icon when a later icon rename fails', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    const original = Buffer.from('{"trusted":true}\n')
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const first = { temporary: join(stagingDirectory, 'first.png'), target: join(directory, 'first.png') }
    const second = { temporary: join(stagingDirectory, 'second.png'), target: join(directory, 'second.png') }
    const existingTrusted = join(directory, 'trusted.png')
    await Promise.all([
      writeFile(manifestPath, original),
      writeFile(first.temporary, validPng()),
      writeFile(second.temporary, validPng()),
      writeFile(existingTrusted, 'trusted bytes'),
    ])
    let iconRenameCount = 0

    await expect(commitIconSyncTransaction({
      pendingRenames: [first, second],
      manifestPath,
      stagingDirectory,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: true,
      operations: {
        access,
        unlink,
        writeFile,
        rename: async (source: string, target: string) => {
          if (source.startsWith(stagingDirectory) && source.endsWith('.png') && ++iconRenameCount === 2) throw new Error('injected icon rename failure')
          await rename(source, target)
        },
      },
    })).rejects.toThrow(/injected icon rename failure/i)

    expect(await readFile(manifestPath)).toEqual(original)
    expect(await readFile(existingTrusted, 'utf8')).toBe('trusted bytes')
    for (const path of [first.temporary, first.target, second.temporary, second.target, `${manifestPath}.part`]) {
      await expect(readFile(path), path).rejects.toMatchObject({ code: 'ENOENT' })
    }
  })

  it.each(['write', 'rename'] as const)(
    'rolls back new icons and preserves the prior manifest when manifest %s fails',
    async (failure) => {
      const { commitIconSyncTransaction } = await helpers()
      const directory = await temporaryDirectory()
      const manifestPath = join(directory, 'manifest.json')
      const original = Buffer.from('{"trusted":true}\n')
      const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
      const pending = { temporary: join(stagingDirectory, 'new.png'), target: join(directory, 'new.png') }
      const existingTrusted = join(directory, 'trusted.png')
      await Promise.all([
        writeFile(manifestPath, original),
        writeFile(pending.temporary, validPng()),
        writeFile(existingTrusted, 'trusted bytes'),
      ])

      await expect(commitIconSyncTransaction({
        pendingRenames: [pending],
        manifestPath,
        stagingDirectory,
        serializedManifest: '{"trusted":"next"}\n',
        manifestChanged: true,
        operations: {
          access,
          unlink,
          writeFile: async (...args: Parameters<typeof writeFile>) => {
            if (failure === 'write' && String(args[0]).includes(stagingDirectory)) throw new Error('injected manifest write failure')
            await writeFile(...args)
          },
          rename: async (source: string, target: string) => {
            if (failure === 'rename' && source.includes(stagingDirectory) && source.endsWith('.json')) throw new Error('injected manifest rename failure')
            await rename(source, target)
          },
        },
      })).rejects.toThrow(new RegExp(`injected manifest ${failure} failure`, 'i'))

      expect(await readFile(manifestPath)).toEqual(original)
      expect(await readFile(existingTrusted, 'utf8')).toBe('trusted bytes')
      for (const path of [pending.temporary, pending.target, `${manifestPath}.part`]) {
        await expect(readFile(path), path).rejects.toMatchObject({ code: 'ENOENT' })
      }
    },
  )

  it('replaces a damaged known icon only when the replacement has already been verified', async () => {
    const { commitIconSyncTransaction, stageTrustedIconReplacement } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const manifestPath = join(directory, 'manifest.json')
    const original = Buffer.from('{"trusted":true}\n')
    const replacement = validPng()
    const target = join(directory, 'trusted.png')
    const expected = {
      bytes: replacement.length,
      sha256: createHash('sha256').update(replacement).digest('hex'),
    }
    await Promise.all([
      writeFile(manifestPath, original),
      writeFile(target, 'damaged bytes'),
    ])
    const { pending } = await stageTrustedIconReplacement({
      label: 'trusted icon',
      temporary: join(stagingDirectory, 'trusted.png'),
      target: join(directory, 'trusted.png'),
      replaceExisting: true,
      expected,
      download: (temporary: string) => writeFile(temporary, replacement),
    })

    await commitIconSyncTransaction({
      pendingRenames: [pending],
      manifestPath,
      stagingDirectory,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: false,
    })

    expect(await readFile(manifestPath)).toEqual(original)
    expect(await readFile(pending.target)).toEqual(replacement)
    await expect(readFile(pending.temporary)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('rejects and cleans a downloaded replacement that does not match the trusted SHA', async () => {
    const { stageTrustedIconReplacement } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const temporary = join(stagingDirectory, 'trusted.png')
    const target = join(directory, 'trusted.png')
    const trusted = validPng()
    const damaged = Buffer.from('damaged original bytes')
    await writeFile(target, damaged)

    await expect(stageTrustedIconReplacement({
      label: 'trusted icon',
      temporary,
      target,
      replaceExisting: true,
      expected: {
        bytes: trusted.length,
        sha256: createHash('sha256').update(trusted).digest('hex'),
      },
      download: (path: string) => writeFile(path, Buffer.from(trusted).fill(2, 20)),
    })).rejects.toThrow(/SHA-256 does not match trusted manifest/i)

    expect(await readFile(target)).toEqual(damaged)
    await expect(access(temporary)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('restores a damaged existing icon byte-for-byte when a later promotion fails', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const manifestPath = join(directory, 'manifest.json')
    const damaged = Buffer.from('damaged original bytes')
    const first = {
      temporary: join(stagingDirectory, 'first.png'),
      target: join(directory, 'first.png'),
      replaceExisting: true,
    }
    const second = { temporary: join(stagingDirectory, 'second.png'), target: join(directory, 'second.png') }
    await Promise.all([
      writeFile(manifestPath, '{"trusted":true}\n'),
      writeFile(first.target, damaged),
      writeFile(first.temporary, validPng()),
      writeFile(second.temporary, validPng()),
    ])
    let promotions = 0

    await expect(commitIconSyncTransaction({
      pendingRenames: [first, second],
      manifestPath,
      stagingDirectory,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: false,
      operations: {
        access,
        unlink,
        writeFile,
        rename: async (source: string, target: string) => {
          if (source.startsWith(stagingDirectory) && source.endsWith('.png') && ++promotions === 2) {
            throw new Error('injected second promotion failure')
          }
          await rename(source, target)
        },
      },
    })).rejects.toThrow(/second promotion failure/i)

    expect(await readFile(first.target)).toEqual(damaged)
    await expect(access(second.target)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it.each(['write', 'rename'] as const)(
    'restores a replaced icon when manifest %s fails',
    async (failure) => {
      const { commitIconSyncTransaction } = await helpers()
      const directory = await temporaryDirectory()
      const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
      const manifestPath = join(directory, 'manifest.json')
      const originalManifest = Buffer.from('{"trusted":true}\n')
      const damaged = Buffer.from('damaged original bytes')
      const pending = {
        temporary: join(stagingDirectory, 'replacement.png'),
        target: join(directory, 'trusted.png'),
        replaceExisting: true,
      }
      await Promise.all([
        writeFile(manifestPath, originalManifest),
        writeFile(pending.target, damaged),
        writeFile(pending.temporary, validPng()),
      ])

      await expect(commitIconSyncTransaction({
        pendingRenames: [pending],
        manifestPath,
        stagingDirectory,
        serializedManifest: '{"trusted":"next"}\n',
        manifestChanged: true,
        operations: {
          access,
          unlink,
          writeFile: async (...args: Parameters<typeof writeFile>) => {
            if (failure === 'write' && String(args[0]).includes(stagingDirectory)) throw new Error('manifest write failure')
            await writeFile(...args)
          },
          rename: async (source: string, target: string) => {
            if (failure === 'rename' && source.includes(stagingDirectory) && source.endsWith('.json')) {
              throw new Error('manifest rename failure')
            }
            await rename(source, target)
          },
        },
      })).rejects.toThrow(new RegExp(`manifest ${failure} failure`, 'i'))

      expect(await readFile(pending.target)).toEqual(damaged)
      expect(await readFile(manifestPath)).toEqual(originalManifest)
    },
  )

  it('still refuses an existing target unless the caller explicitly marks a verified replacement', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const manifestPath = join(directory, 'manifest.json')
    const pending = { temporary: join(stagingDirectory, 'trusted.png'), target: join(directory, 'trusted.png') }
    await Promise.all([
      writeFile(manifestPath, '{"trusted":true}\n'),
      writeFile(pending.temporary, validPng()),
      writeFile(pending.target, 'trusted bytes'),
    ])

    await expect(commitIconSyncTransaction({
      pendingRenames: [pending],
      manifestPath,
      stagingDirectory,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: false,
    })).rejects.toThrow(/already exists/i)

    expect(await readFile(pending.target, 'utf8')).toBe('trusted bytes')
  })
})
