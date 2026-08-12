import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as content from '../../app/data/content'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

function readSource(path: string) {
  return readFileSync(join(root, path), 'utf8')
}

function readAppSources(directory = join(root, 'app')): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return readAppSources(path)
      return ['.ts', '.vue'].includes(extname(entry.name)) ? [readFileSync(path, 'utf8')] : []
    })
    .join('\n')
}

describe('site metadata', () => {
  it('exports the current page-level metadata from the content registry', () => {
    expect(content).toHaveProperty('CONTENT_VERSION', '2026.08')
    expect(content).toHaveProperty('SITE_UPDATED_AT', '2026-08-13')
    expect(new Set(content.guideEntries.map(entry => entry.version))).toEqual(new Set(['2026.08']))
  })

  it('derives the wiki description from the live wiki and dish collections', () => {
    const source = readSource('app/pages/wiki/index.vue')
    const wikiEntries = content.getEntries('wiki')
    const dishCount = wikiEntries.filter(entry => entry.tags.includes('四格食谱')).length

    expect(wikiEntries.length).toBeGreaterThan(0)
    expect(dishCount).toBeGreaterThan(0)
    expect(source).toContain("const wikiEntries = getEntries('wiki')")
    expect(source).toContain("entry.tags.includes('四格食谱')")
    expect(source).toContain(':description="wikiDescription"')
    expect(source).not.toMatch(/description="[^\n]*\d+\s*份/)
    expect(source).not.toMatch(/description="[^\n]*\d+\s*道/)
  })

  it('uses centralized version and dynamic totals in shared page copy', () => {
    const home = readSource('app/pages/index.vue')
    const about = readSource('app/pages/about.vue')
    const footer = readSource('app/components/SiteFooter.vue')

    expect(home).toContain('CONTENT_VERSION')
    expect(footer).toContain('CONTENT_VERSION')
    expect(about).toContain('CONTENT_VERSION')
    expect(about).toContain('guideEntries.length')
    expect(about).toContain("getEntries('wiki')")
    expect(about).toContain("getEntries('progression')")
    expect(about).toContain("entry.tags.includes('四格食谱')")
  })

  it('contains no stale release copy in application sources', () => {
    expect(readAppSources()).not.toMatch(/2026\.07|168\s*份|首版包含\s*39|首版路线/)
  })
})
