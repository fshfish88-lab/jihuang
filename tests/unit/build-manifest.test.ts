import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []

async function helpers() {
  return import('../../scripts/build-manifest.mjs')
}

async function temporaryDirectory(): Promise<string> {
  const { mkdtemp } = await import('node:fs/promises')
  const directory = await mkdtemp(join(tmpdir(), 'campfire-build-manifest-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

describe('completed-build manifest', () => {
  it('runs manifest finalization only after Nuxt generation succeeds', async () => {
    const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'))
    expect(packageJson.scripts.generate).toBe('nuxt generate && node scripts/write-build-manifest.mjs')
  })

  it('atomically records every generated file path, size, and SHA-256', async () => {
    const { writeCompletedBuildManifest, readAndVerifyBuildManifest } = await helpers()
    const source = await temporaryDirectory()
    await mkdir(join(source, 'wiki'))
    await Promise.all([
      writeFile(join(source, 'index.html'), 'home'),
      writeFile(join(source, 'wiki', 'index.html'), 'wiki'),
    ])

    const manifest = await writeCompletedBuildManifest({
      source,
      commit: 'abc123',
      baseURL: '/jihuang/',
      generatedAt: '2026-08-13T01:02:03.000Z',
      token: 'test-token',
    })

    expect(manifest).toMatchObject({ schemaVersion: 1, commit: 'abc123', baseURL: '/jihuang/' })
    expect(manifest.files.map((entry: { path: string }) => entry.path)).toEqual(['index.html', 'wiki/index.html'])
    expect(manifest.files.every((entry: { size: number, sha256: string }) => entry.size > 0 && /^[a-f0-9]{64}$/.test(entry.sha256))).toBe(true)
    expect(await readAndVerifyBuildManifest(source)).toEqual(manifest)
    expect((await readdir(source)).filter(name => name.includes('test-token'))).toEqual([])
  })

  it('does not publish a completion manifest when its atomic rename fails', async () => {
    const { writeCompletedBuildManifest } = await helpers()
    const source = await temporaryDirectory()
    await writeFile(join(source, 'index.html'), 'home')

    await expect(writeCompletedBuildManifest({
      source,
      commit: 'abc123',
      baseURL: '/',
      generatedAt: '2026-08-13T01:02:03.000Z',
      token: 'failure-token',
      operations: {
        rename: async () => { throw new Error('injected manifest rename failure') },
      },
    })).rejects.toThrow(/injected manifest rename failure/i)

    await expect(readFile(join(source, '.campfire-build.json'))).rejects.toMatchObject({ code: 'ENOENT' })
    expect((await readdir(source)).filter(name => name.includes('failure-token'))).toEqual([])
  })

  it('rejects a generated tree changed after completion', async () => {
    const { writeCompletedBuildManifest, readAndVerifyBuildManifest } = await helpers()
    const source = await temporaryDirectory()
    await writeFile(join(source, 'index.html'), 'home')
    await writeCompletedBuildManifest({ source, commit: 'abc123', baseURL: '/', token: 'test' })
    await writeFile(join(source, 'index.html'), 'tampered')

    await expect(readAndVerifyBuildManifest(source)).rejects.toThrow(/manifest|snapshot|match/i)
  })
})
