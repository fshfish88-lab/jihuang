import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const sharedSource = readFileSync(`${root}/app/data/wiki/shared.ts`, 'utf8')
const syncSource = readFileSync(`${root}/scripts/sync-wiki-icons.mjs`, 'utf8')
const validatorSource = readFileSync(`${root}/scripts/validate-wiki-data.mjs`, 'utf8')
const contactSheetSource = readFileSync(`${root}/scripts/generate-icon-contact-sheet.py`, 'utf8')

function parseOverrides(source: string, declaration: string): Record<string, string> {
  const body = source.match(new RegExp(`(?:const|export const) ${declaration}(?:[^=]*)= \\{([\\s\\S]*?)\\n\\}`))?.[1]
  expect(body, `${declaration} declaration`).toBeDefined()

  return Object.fromEntries(
    [...body!.matchAll(/^\s*(?:'([^']+)'|([A-Za-z][\w-]*)):\s*'([^']+)'/gm)]
      .map(match => [match[1] || match[2], match[3]]),
  )
}

describe('wiki icon source contract', () => {
  it('keeps the runtime and downloader source overrides identical', () => {
    const runtimeOverrides = parseOverrides(sharedSource, 'imageSourceOverrides')
    const downloaderOverrides = parseOverrides(syncSource, 'sourceOverrides')

    expect(Object.keys(runtimeOverrides)).toHaveLength(43)
    expect(Object.keys(downloaderOverrides)).toHaveLength(43)
    expect(runtimeOverrides).toEqual(downloaderOverrides)
  })

  it('dates image verification separately from factual entry verification', () => {
    expect(sharedSource).toContain("export const VERIFIED_AT = '2026-08-08'")
    expect(sharedSource).toContain("export const IMAGE_VERIFIED_AT = '2026-08-13'")
    expect(sharedSource).toContain('verifiedAt: IMAGE_VERIFIED_AT')
    expect(syncSource).toContain("verifiedAt: '2026-08-13'")
  })

  it('requires the current 328-entry icon corpus', () => {
    expect(validatorSource).toContain('if (entries.length < 328)')
  })

  it('derives contact-sheet rows from the number of audited icons', () => {
    expect(contactSheetSource).toContain('ROWS = ceil(len(ITEMS) / COLS)')
  })
})
