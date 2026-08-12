import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
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

  it('releases the lock in finally when the protected sync task throws', async () => {
    const { acquireIconSyncLock, withIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')

    await expect(withIconSyncLock(
      lockPath,
      async () => { throw new Error('injected sync failure') },
      { token: 'failing-run' },
    )).rejects.toThrow(/injected sync failure/i)

    await expect(access(lockPath)).rejects.toMatchObject({ code: 'ENOENT' })
    const releaseNextRun = await acquireIconSyncLock(lockPath, { token: 'next-run' })
    await releaseNextRun()
  })

  it('keeps the primary task error first when lock release also fails', async () => {
    const { withIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    let failure: AggregateError | undefined

    try {
      await withIconSyncLock(
        lockPath,
        async () => { throw new Error('primary sync failure') },
        {
          operations: {
            unlink: async () => { throw new Error('release cleanup failure') },
          },
        },
      )
    } catch (error) {
      failure = error as AggregateError
    }

    expect(failure).toBeInstanceOf(AggregateError)
    expect(failure!.errors.map(error => error.message)).toEqual([
      'primary sync failure',
      'release cleanup failure',
    ])
  })

  it('writes PID and start time into an owned lock and rejects a live owner', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const release = await acquireIconSyncLock(lockPath, {
      token: 'live-owner',
      pid: 4321,
      startedAt: '2026-08-13T00:00:00.000Z',
    })
    const owner = JSON.parse(await readFile(lockPath, 'utf8'))

    expect(owner).toMatchObject({ token: 'live-owner', pid: 4321, startedAt: '2026-08-13T00:00:00.000Z' })
    await expect(acquireIconSyncLock(lockPath, {
      token: 'contender',
      isProcessAlive: async () => true,
    })).rejects.toThrow(/active process 4321/i)
    expect(JSON.parse(await readFile(lockPath, 'utf8')).token).toBe('live-owner')
    await release()
  })

  it('refuses takeover when stale-owner process liveness cannot be confirmed', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const owner = { token: 'unknown-owner', pid: 4321, startedAt: '2026-08-13T00:00:00.000Z', recoveryPath: null }
    await writeFile(lockPath, JSON.stringify(owner))

    await expect(acquireIconSyncLock(lockPath, {
      isProcessAlive: async () => { throw new Error('permission denied') },
    })).rejects.toThrow(/cannot be confirmed.*permission denied/i)

    expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(owner)
  })

  it('recovers the unique backup from a dead PID transaction before taking the stale lock', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, '.wiki-icon-sync-dead')
    const target = join(directory, 'trusted.png')
    const backup = join(stagingDirectory, 'icon-0.backup')
    await mkdir(stagingDirectory)
    const original = Buffer.from('recoverable bytes')
    await writeFile(backup, original)
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version: 3,
      phase: 'promoted',
      entries: [{
        target,
        backup,
        existedBefore: true,
        oldSha256: createHash('sha256').update(original).digest('hex'),
        promotedSha256: createHash('sha256').update('replacement').digest('hex'),
      }],
      manifest: null,
    }))
    await writeFile(lockPath, JSON.stringify({
      token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }))

    const release = await acquireIconSyncLock(lockPath, {
      token: 'new-owner',
      isProcessAlive: async () => false,
    })

    expect(await readFile(target, 'utf8')).toBe('recoverable bytes')
    expect(JSON.parse(await readFile(lockPath, 'utf8')).token).toBe('new-owner')
    await expect(access(stagingDirectory)).rejects.toMatchObject({ code: 'ENOENT' })
    await release()
  })

  it('preserves an ambiguous dead-PID recovery and refuses to take its lock', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, '.wiki-icon-sync-ambiguous')
    const target = join(directory, 'trusted.png')
    const backup = join(stagingDirectory, 'icon-0.backup')
    await mkdir(stagingDirectory)
    const backupBytes = Buffer.from('backup bytes')
    await Promise.all([writeFile(target, 'current bytes'), writeFile(backup, backupBytes)])
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version: 3,
      phase: 'promoted',
      entries: [{
        target,
        backup,
        existedBefore: true,
        oldSha256: createHash('sha256').update(backupBytes).digest('hex'),
        promotedSha256: createHash('sha256').update('promoted bytes').digest('hex'),
      }],
      manifest: null,
    }))
    const staleOwner = {
      token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }
    await writeFile(lockPath, JSON.stringify(staleOwner))

    await expect(acquireIconSyncLock(lockPath, {
      token: 'new-owner',
      isProcessAlive: async () => false,
    })).rejects.toThrow(/ambiguous recovery/i)

    expect(await readFile(target, 'utf8')).toBe('current bytes')
    expect(await readFile(backup, 'utf8')).toBe('backup bytes')
    expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(staleOwner)
  })

  it('removes a crash-promoted new icon with the recorded SHA before taking a dead-owner lock', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, '.wiki-icon-sync-dead-new')
    const target = join(directory, 'new-icon.png')
    const manifestPath = join(directory, 'manifest.json')
    const originalManifest = Buffer.from('{"old":true}\n')
    const promoted = validPng()
    await mkdir(stagingDirectory)
    await Promise.all([
      writeFile(target, promoted),
      writeFile(manifestPath, originalManifest),
    ])
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version: 3,
      phase: 'promoted',
      entries: [{
        target,
        backup: null,
        existedBefore: false,
        oldSha256: null,
        promotedSha256: createHash('sha256').update(promoted).digest('hex'),
      }],
      manifest: {
        target: manifestPath,
        backup: join(stagingDirectory, 'manifest.backup'),
        existedBefore: true,
        oldSha256: createHash('sha256').update(originalManifest).digest('hex'),
        promotedSha256: createHash('sha256').update('{"new":true}\n').digest('hex'),
      },
    }))
    await writeFile(lockPath, JSON.stringify({
      token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }))

    const release = await acquireIconSyncLock(lockPath, {
      token: 'next-owner',
      isProcessAlive: async () => false,
      allowedRoots: [directory],
    })

    await expect(access(target)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(manifestPath)).toEqual(originalManifest)
    await expect(access(stagingDirectory)).rejects.toMatchObject({ code: 'ENOENT' })
    await release()
  })

  it('preserves recovery and refuses takeover when a crash-promoted new target was externally modified', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, '.wiki-icon-sync-dead-modified')
    const target = join(directory, 'new-icon.png')
    const promoted = validPng()
    await mkdir(stagingDirectory)
    await writeFile(target, Buffer.from(promoted).fill(3, 20))
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version: 3,
      phase: 'promoted',
      entries: [{
        target,
        backup: null,
        existedBefore: false,
        oldSha256: null,
        promotedSha256: createHash('sha256').update(promoted).digest('hex'),
      }],
      manifest: null,
    }))
    const staleOwner = {
      token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }
    await writeFile(lockPath, JSON.stringify(staleOwner))

    await expect(acquireIconSyncLock(lockPath, {
      token: 'next-owner',
      isProcessAlive: async () => false,
      allowedRoots: [directory],
    })).rejects.toThrow(/ambiguous recovery.*SHA/i)

    expect(await readFile(target)).toEqual(Buffer.from(promoted).fill(3, 20))
    expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(staleOwner)
    expect(await access(stagingDirectory)).toBeUndefined()
  })

  it.each([
    { phase: 'manifest-committed', keepBackup: true },
    { phase: 'cleanup', keepBackup: false },
  ] as const)(
    'keeps committed icons and manifest while finishing dead-owner $phase recovery',
    async ({ phase, keepBackup }) => {
      const { acquireIconSyncLock } = await helpers()
      const directory = await temporaryDirectory()
      const lockPath = join(directory, '.wiki-icon-sync.lock')
      const stagingDirectory = join(directory, `.wiki-icon-sync-${phase}`)
      const newTarget = join(directory, 'new-icon.png')
      const replacedTarget = join(directory, 'replaced-icon.png')
      const replacementBackup = join(stagingDirectory, 'icon-1.backup')
      const manifestPath = join(directory, 'manifest.json')
      const promotedNew = validPng()
      const promotedReplacement = Buffer.from(validPng()).fill(4, 20)
      const committedManifest = Buffer.from('{"committed":true}\n')
      await mkdir(stagingDirectory)
      await Promise.all([
        writeFile(newTarget, promotedNew),
        writeFile(replacedTarget, promotedReplacement),
        writeFile(manifestPath, committedManifest),
        ...(keepBackup ? [writeFile(replacementBackup, 'old replacement bytes')] : []),
      ])
      await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
        version: 3,
        phase,
        entries: [
          {
            target: newTarget,
            backup: null,
            existedBefore: false,
            promotedSha256: createHash('sha256').update(promotedNew).digest('hex'),
          },
          {
            target: replacedTarget,
            backup: replacementBackup,
            existedBefore: true,
            promotedSha256: createHash('sha256').update(promotedReplacement).digest('hex'),
          },
        ],
        manifest: {
          target: manifestPath,
          backup: join(stagingDirectory, 'manifest.backup'),
          existedBefore: true,
          promotedSha256: createHash('sha256').update(committedManifest).digest('hex'),
        },
      }))
      await writeFile(lockPath, JSON.stringify({
        token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
      }))

      const release = await acquireIconSyncLock(lockPath, {
        token: 'next-owner',
        isProcessAlive: async () => false,
        allowedRoots: [directory],
      })

      expect(await readFile(newTarget)).toEqual(promotedNew)
      expect(await readFile(replacedTarget)).toEqual(promotedReplacement)
      expect(await readFile(manifestPath)).toEqual(committedManifest)
      await expect(access(stagingDirectory)).rejects.toMatchObject({ code: 'ENOENT' })
      await release()
    },
  )

  it('preserves committed recovery when a promoted target was externally modified', async () => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, '.wiki-icon-sync-committed-modified')
    const target = join(directory, 'new-icon.png')
    const manifestPath = join(directory, 'manifest.json')
    const promoted = validPng()
    const modified = Buffer.from(promoted).fill(7, 20)
    const committedManifest = Buffer.from('{"committed":true}\n')
    await mkdir(stagingDirectory)
    await Promise.all([writeFile(target, modified), writeFile(manifestPath, committedManifest)])
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version: 3,
      phase: 'manifest-committed',
      entries: [{
        target,
        backup: null,
        existedBefore: false,
        promotedSha256: createHash('sha256').update(promoted).digest('hex'),
      }],
      manifest: {
        target: manifestPath,
        backup: join(stagingDirectory, 'manifest.backup'),
        existedBefore: true,
        promotedSha256: createHash('sha256').update(committedManifest).digest('hex'),
      },
    }))
    const staleOwner = {
      token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }
    await writeFile(lockPath, JSON.stringify(staleOwner))

    await expect(acquireIconSyncLock(lockPath, {
      token: 'next-owner',
      isProcessAlive: async () => false,
      allowedRoots: [directory],
    })).rejects.toThrow(/committed recovery.*SHA/i)

    expect(await readFile(target)).toEqual(modified)
    expect(await readFile(manifestPath)).toEqual(committedManifest)
    expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(staleOwner)
    expect(await access(stagingDirectory)).toBeUndefined()
  })

  it.each([
    { kind: 'icon', targetState: 'missing' },
    { kind: 'icon', targetState: 'promoted' },
    { kind: 'manifest', targetState: 'missing' },
    { kind: 'manifest', targetState: 'promoted' },
  ] as const)(
    'preserves $kind recovery when its $targetState target has a tampered backup',
    async ({ kind, targetState }) => {
      const { acquireIconSyncLock } = await helpers()
      const directory = await temporaryDirectory()
      const lockPath = join(directory, '.wiki-icon-sync.lock')
      const stagingDirectory = join(directory, `.wiki-icon-sync-${kind}-${targetState}`)
      const target = join(directory, `${kind}.dat`)
      const backup = join(stagingDirectory, `${kind}.backup`)
      const oldBytes = Buffer.from(`${kind} original trusted bytes`)
      const tamperedBackup = Buffer.from(`${kind} externally modified backup`)
      const promotedBytes = Buffer.from(`${kind} promoted transaction bytes`)
      await mkdir(stagingDirectory)
      await writeFile(backup, tamperedBackup)
      if (targetState === 'promoted') await writeFile(target, promotedBytes)
      const record = {
        target,
        backup,
        existedBefore: true,
        oldSha256: createHash('sha256').update(oldBytes).digest('hex'),
        promotedSha256: createHash('sha256').update(promotedBytes).digest('hex'),
      }
      await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
        version: 3,
        phase: 'promoted',
        entries: kind === 'icon' ? [record] : [],
        manifest: kind === 'manifest' ? record : null,
      }))
      const staleOwner = {
        token: 'dead-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
      }
      await writeFile(lockPath, JSON.stringify(staleOwner))

      await expect(acquireIconSyncLock(lockPath, {
        token: 'next-owner',
        isProcessAlive: async () => false,
        allowedRoots: [directory],
      })).rejects.toThrow(new RegExp(`ambiguous recovery for ${kind}.*backup SHA`, 'i'))

      if (targetState === 'missing') {
        await expect(access(target)).rejects.toMatchObject({ code: 'ENOENT' })
      } else {
        expect(await readFile(target)).toEqual(promotedBytes)
      }
      expect(await readFile(backup)).toEqual(tamperedBackup)
      expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(staleOwner)
      expect(await access(stagingDirectory)).toBeUndefined()
    },
  )

  it.each([1, 2])('preserves and refuses legacy v%s recovery without reliable phase and old SHA', async (version) => {
    const { acquireIconSyncLock } = await helpers()
    const directory = await temporaryDirectory()
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const stagingDirectory = join(directory, `.wiki-icon-sync-v${version}`)
    const target = join(directory, 'legacy.png')
    const backup = join(stagingDirectory, 'icon.backup')
    await mkdir(stagingDirectory)
    await writeFile(backup, 'legacy backup')
    await writeFile(join(stagingDirectory, 'recovery-state.json'), JSON.stringify({
      version,
      entries: [{ target, backup, ...(version === 2 ? { existedBefore: true, promotedSha256: '0'.repeat(64) } : {}) }],
      manifest: null,
    }))
    const staleOwner = {
      token: 'legacy-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }
    await writeFile(lockPath, JSON.stringify(staleOwner))

    await expect(acquireIconSyncLock(lockPath, {
      isProcessAlive: async () => false,
      allowedRoots: [directory],
    })).rejects.toThrow(/legacy recovery v[12].*preserving/i)

    await expect(access(target)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(backup, 'utf8')).toBe('legacy backup')
    expect(JSON.parse(await readFile(lockPath, 'utf8'))).toEqual(staleOwner)
  })

  it.each(['write', 'rename'] as const)(
    'keeps the original lock releasable when atomic recovery metadata %s fails',
    async (failure) => {
      const { acquireIconSyncLock } = await helpers()
      const directory = await temporaryDirectory()
      const lockPath = join(directory, '.wiki-icon-sync.lock')
      const stagingDirectory = join(directory, '.wiki-icon-sync-stage')
      await mkdir(stagingDirectory)
      const release = await acquireIconSyncLock(lockPath, {
        token: `${failure}-owner`,
        operations: {
          writeFile: async (path: string, data: string) => {
            if (String(path).includes('.metadata-')) {
              if (failure === 'write') {
                await writeFile(path, '{')
                throw new Error('injected metadata partial write failure')
              }
              await writeFile(path, data)
              return
            }
            await writeFile(path, data)
          },
          rename: async (source: string, target: string) => {
            if (failure === 'rename' && source.includes('.metadata-')) {
              throw new Error('injected metadata rename failure')
            }
            await rename(source, target)
          },
        },
      })

      await expect(release.setRecoveryPath(stagingDirectory))
        .rejects.toThrow(new RegExp(`metadata ${failure === 'write' ? 'partial write' : 'rename'} failure`, 'i'))
      expect(JSON.parse(await readFile(lockPath, 'utf8')).token).toBe(`${failure}-owner`)
      await release()
      await expect(access(lockPath)).rejects.toMatchObject({ code: 'ENOENT' })
      const releaseNext = await acquireIconSyncLock(lockPath, { token: 'next-owner' })
      await releaseNext()
      expect((await readdir(directory)).filter(name => name.includes('.metadata-'))).toEqual([])
    },
  )

  it('validates slug and prefab and URL-encodes a safe prefab', async () => {
    const { buildMirrorIconUrl, validateWikiIconEntry } = await helpers()

    expect(validateWikiIconEntry({ slug: 'volt-goat', prefab: 'lightning_goat' })).toEqual({
      slug: 'volt-goat', prefab: 'lightning_goat',
    })
    expect(buildMirrorIconUrl('lightning_goat', 'https://example.test/icons')).toBe(
      'https://example.test/icons/lightning_goat.png',
    )
    expect(() => validateWikiIconEntry({ slug: '../outside', prefab: 'safe' })).toThrow(/unsafe slug/i)
    expect(() => validateWikiIconEntry({ slug: 'safe', prefab: '../outside' })).toThrow(/unsafe prefab/i)
  })

  it('rejects target and staging path traversal before writing anything', async () => {
    const { resolveContainedPath, stageTrustedIconReplacement } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = join(directory, 'stage')
    await mkdir(stagingDirectory)
    const outside = join(directory, '..', 'outside.png')
    let downloadCalled = false

    expect(() => resolveContainedPath(directory, '../outside.png')).toThrow(/escapes allowed directory/i)
    await expect(stageTrustedIconReplacement({
      label: 'unsafe',
      temporary: outside,
      target: join(directory, 'target.png'),
      replaceExisting: false,
      outputDirectory: directory,
      stagingDirectory,
      expected: undefined,
      download: async () => { downloadCalled = true },
    })).rejects.toThrow(/escapes allowed directory/i)
    expect(downloadCalled).toBe(false)
  })

  it('rejects a transaction path outside its boundaries before the first write', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = join(directory, 'stage')
    const outside = resolve(directory, '..', 'outside.png')
    await mkdir(stagingDirectory)
    let writeCalled = false

    await expect(commitIconSyncTransaction({
      pendingRenames: [{ temporary: outside, target: join(directory, 'target.png') }],
      manifestPath: join(directory, 'manifest.json'),
      manifestDirectory: directory,
      outputDirectory: directory,
      stagingDirectory,
      serializedManifest: '{}\n',
      manifestChanged: false,
      operations: {
        writeFile: async () => { writeCalled = true },
      },
    })).rejects.toThrow(/escapes allowed directory/i)

    expect(writeCalled).toBe(false)
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
      expect(JSON.parse(await readFile(lockPath, 'utf8')).token).toBe('integration-test-owner')
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
      manifestDirectory: directory,
      outputDirectory: directory,
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
        manifestDirectory: directory,
        outputDirectory: directory,
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

  it('preserves the recovery backup when manifest commit and icon restore both fail', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const manifestPath = join(directory, 'manifest.json')
    const target = join(directory, 'trusted.png')
    const temporary = join(stagingDirectory, 'replacement.png')
    const original = Buffer.from('original recoverable icon bytes')
    await Promise.all([
      writeFile(manifestPath, '{"trusted":true}\n'),
      writeFile(target, original),
      writeFile(temporary, validPng()),
    ])
    let recoveryBackup = ''
    let failure: AggregateError | undefined

    try {
      await commitIconSyncTransaction({
        pendingRenames: [{ temporary, target, replaceExisting: true }],
        manifestPath,
        manifestDirectory: directory,
        outputDirectory: directory,
        stagingDirectory,
        serializedManifest: '{"trusted":"next"}\n',
        manifestChanged: true,
        operations: {
          access,
          unlink,
          writeFile,
          rename: async (source: string, destination: string) => {
            if (source.endsWith('manifest.next.json')) throw new Error('injected manifest commit failure')
            if (source.endsWith('icon-0.backup') && destination === target) {
              recoveryBackup = source
              throw new Error('injected icon restore failure')
            }
            await rename(source, destination)
          },
        },
      })
    } catch (error) {
      failure = error as AggregateError
    }

    expect(failure).toBeInstanceOf(AggregateError)
    expect(failure!.errors.map(error => error.message)).toEqual([
      'injected manifest commit failure',
      'injected icon restore failure',
    ])
    expect(failure!.message).toContain(recoveryBackup)
    await expect(access(target)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(recoveryBackup)).toEqual(original)
    expect(JSON.parse(await readFile(join(stagingDirectory, 'recovery-state.json'), 'utf8')).entries[0].backup)
      .toBe(recoveryBackup)
  })

  it('records and recovers an actual new-target promotion when rollback cannot remove it', async () => {
    const { acquireIconSyncLock, commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, '.wiki-icon-sync-crash-'))
    const lockPath = join(directory, '.wiki-icon-sync.lock')
    const manifestPath = join(directory, 'manifest.json')
    const target = join(directory, 'new-icon.png')
    const temporary = join(stagingDirectory, 'new-icon.png')
    const originalManifest = Buffer.from('{"old":true}\n')
    const promoted = validPng()
    await Promise.all([
      writeFile(manifestPath, originalManifest),
      writeFile(temporary, promoted),
    ])

    await expect(commitIconSyncTransaction({
      pendingRenames: [{ temporary, target, replaceExisting: false }],
      manifestPath,
      manifestDirectory: directory,
      outputDirectory: directory,
      stagingDirectory,
      serializedManifest: '{"new":true}\n',
      manifestChanged: true,
      operations: {
        access,
        readFile,
        writeFile,
        rename: async (source: string, destination: string) => {
          if (source.endsWith('manifest.next.json')) throw new Error('simulated crash before manifest exchange')
          await rename(source, destination)
        },
        unlink: async (path: string) => {
          if (path === target) throw new Error('simulated process death before new target rollback')
          await unlink(path)
        },
      },
    })).rejects.toBeInstanceOf(AggregateError)

    const recovery = JSON.parse(await readFile(join(stagingDirectory, 'recovery-state.json'), 'utf8'))
    expect(recovery).toMatchObject({ version: 3, phase: 'promoted' })
    expect(recovery.entries).toEqual([{
      target,
      backup: null,
      existedBefore: false,
      oldSha256: null,
      promotedSha256: createHash('sha256').update(promoted).digest('hex'),
    }])
    expect(recovery.manifest).toMatchObject({
      target: manifestPath,
      existedBefore: true,
      oldSha256: createHash('sha256').update(originalManifest).digest('hex'),
    })
    await writeFile(lockPath, JSON.stringify({
      token: 'crashed-owner', pid: 999999, startedAt: '2026-08-12T00:00:00.000Z', recoveryPath: stagingDirectory,
    }))

    const release = await acquireIconSyncLock(lockPath, {
      token: 'next-owner',
      isProcessAlive: async () => false,
      allowedRoots: [directory],
    })
    await expect(access(target)).rejects.toMatchObject({ code: 'ENOENT' })
    expect(await readFile(manifestPath)).toEqual(originalManifest)
    await release()
  })

  it('persists every recovery phase atomically during a successful transaction', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const stagingDirectory = await mkdtemp(join(directory, 'stage-'))
    const manifestPath = join(directory, 'manifest.json')
    const target = join(directory, 'new-icon.png')
    const temporary = join(stagingDirectory, 'new-icon.png')
    await Promise.all([
      writeFile(manifestPath, '{"old":true}\n'),
      writeFile(temporary, validPng()),
    ])
    const phases: string[] = []

    await commitIconSyncTransaction({
      pendingRenames: [{ temporary, target, replaceExisting: false }],
      manifestPath,
      manifestDirectory: directory,
      outputDirectory: directory,
      stagingDirectory,
      serializedManifest: '{"new":true}\n',
      manifestChanged: true,
      operations: {
        access,
        readFile,
        rename,
        unlink,
        writeFile: async (path: string, data: string | Buffer) => {
          if (String(path).includes('recovery-state.json.state-')) {
            phases.push(JSON.parse(String(data)).phase)
          }
          await writeFile(path, data)
        },
      },
    })

    expect(phases).toEqual(['prepared', 'promoted', 'manifest-committed', 'cleanup'])
    expect(await readFile(target)).toEqual(validPng())
    expect(await readFile(manifestPath, 'utf8')).toBe('{"new":true}\n')
  })

  it('does not clean a staging directory that contains required recovery state', async () => {
    const { withIconSyncStaging } = await helpers()
    const directory = await temporaryDirectory()
    let recoveryPath = ''

    await expect(withIconSyncStaging(directory, async (stagingDirectory: string) => {
      recoveryPath = stagingDirectory
      await writeFile(join(stagingDirectory, 'icon-0.backup'), 'rescue bytes')
      const failure = new AggregateError([new Error('primary'), new Error('rollback')], 'recovery required')
      Object.assign(failure, { recoveryRequired: true, recoveryPaths: [stagingDirectory] })
      throw failure
    })).rejects.toThrow(/recovery required/i)

    expect(await readFile(join(recoveryPath, 'icon-0.backup'), 'utf8')).toBe('rescue bytes')
  })

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
      outputDirectory: directory,
      stagingDirectory,
      expected,
      download: (temporary: string) => writeFile(temporary, replacement),
    })

    await commitIconSyncTransaction({
      pendingRenames: [pending],
      manifestPath,
      manifestDirectory: directory,
      outputDirectory: directory,
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
      outputDirectory: directory,
      stagingDirectory,
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
      manifestDirectory: directory,
      outputDirectory: directory,
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
        manifestDirectory: directory,
        outputDirectory: directory,
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
      manifestDirectory: directory,
      outputDirectory: directory,
      stagingDirectory,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: false,
    })).rejects.toThrow(/already exists/i)

    expect(await readFile(pending.target, 'utf8')).toBe('trusted bytes')
  })
})
