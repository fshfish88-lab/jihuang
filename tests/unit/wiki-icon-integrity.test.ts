import { createHash } from 'node:crypto'
import { access, mkdtemp, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []

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

  it('removes stale icon and manifest part files without touching trusted files', async () => {
    const { removeStaleParts } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    const iconPart = join(directory, 'icon.png.part')
    const trusted = join(directory, 'icon.png')
    await Promise.all([
      writeFile(`${manifestPath}.part`, 'stale'),
      writeFile(iconPart, 'stale'),
      writeFile(trusted, 'trusted'),
    ])

    await removeStaleParts(directory, manifestPath)

    expect(await readFile(trusted, 'utf8')).toBe('trusted')
    await expect(readFile(iconPart)).rejects.toMatchObject({ code: 'ENOENT' })
    await expect(readFile(`${manifestPath}.part`)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('rolls back every promoted new icon when a later icon rename fails', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    const original = Buffer.from('{"trusted":true}\n')
    const first = { temporary: join(directory, 'first.png.part'), target: join(directory, 'first.png') }
    const second = { temporary: join(directory, 'second.png.part'), target: join(directory, 'second.png') }
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
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: true,
      operations: {
        access,
        unlink,
        writeFile,
        rename: async (source: string, target: string) => {
          if (source.endsWith('.png.part') && ++iconRenameCount === 2) throw new Error('injected icon rename failure')
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
      const pending = { temporary: join(directory, 'new.png.part'), target: join(directory, 'new.png') }
      const existingTrusted = join(directory, 'trusted.png')
      await Promise.all([
        writeFile(manifestPath, original),
        writeFile(pending.temporary, validPng()),
        writeFile(existingTrusted, 'trusted bytes'),
      ])

      await expect(commitIconSyncTransaction({
        pendingRenames: [pending],
        manifestPath,
        serializedManifest: '{"trusted":"next"}\n',
        manifestChanged: true,
        operations: {
          access,
          unlink,
          writeFile: async (...args: Parameters<typeof writeFile>) => {
            if (failure === 'write' && String(args[0]).endsWith('.json.part')) throw new Error('injected manifest write failure')
            await writeFile(...args)
          },
          rename: async (source: string, target: string) => {
            if (failure === 'rename' && source.endsWith('.json.part')) throw new Error('injected manifest rename failure')
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

  it('refuses to overwrite or delete an existing trusted target during rollback', async () => {
    const { commitIconSyncTransaction } = await helpers()
    const directory = await temporaryDirectory()
    const manifestPath = join(directory, 'manifest.json')
    const original = Buffer.from('{"trusted":true}\n')
    const pending = { temporary: join(directory, 'trusted.png.part'), target: join(directory, 'trusted.png') }
    await Promise.all([
      writeFile(manifestPath, original),
      writeFile(pending.temporary, validPng()),
      writeFile(pending.target, 'trusted bytes'),
    ])

    await expect(commitIconSyncTransaction({
      pendingRenames: [pending],
      manifestPath,
      serializedManifest: '{"trusted":"next"}\n',
      manifestChanged: true,
    })).rejects.toThrow(/already exists/i)

    expect(await readFile(manifestPath)).toEqual(original)
    expect(await readFile(pending.target, 'utf8')).toBe('trusted bytes')
    await expect(readFile(pending.temporary)).rejects.toMatchObject({ code: 'ENOENT' })
    await expect(readFile(`${manifestPath}.part`)).rejects.toMatchObject({ code: 'ENOENT' })
  })
})
