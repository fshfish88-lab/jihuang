import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getEntries, getEntry, guideEntries } from '../../app/data/content'
import { SITE_UPDATED_AT, SITE_VERSION, siteStats, wikiDescription } from '../../app/data/site-metadata'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

function readSource(path: string) {
  return readFileSync(join(root, path), 'utf8')
}

describe('site metadata', () => {
  it('preserves each content batch metadata independently of site publication metadata', () => {
    expect(getEntry('beginner', 'first-day')).toMatchObject({
      version: '2026.07',
      updatedAt: '2026-07-31'
    })
    expect(getEntry('progression', 'seasonal-cycle')).toMatchObject({
      version: '2026.08',
      updatedAt: '2026-08-08'
    })
  })

  it('exports current site metadata and derives all shared statistics once', () => {
    const wikiEntries = getEntries('wiki')
    const dishEntries = wikiEntries.filter(entry => entry.tags.includes('四格食谱'))

    expect(SITE_VERSION).toBe('2026.09')
    expect(SITE_UPDATED_AT).toBe('2026-09-09')
    expect(siteStats).toEqual({
      totalEntries: guideEntries.length,
      wikiEntries: wikiEntries.length,
      dishEntries: dishEntries.length,
      progressionEntries: getEntries('progression').length
    })
    expect(wikiDescription).toContain(`${siteStats.wikiEntries} 份`)
    expect(wikiDescription).toContain(`${siteStats.dishEntries} 道`)
  })

  it('makes pages consume the shared site version, statistics and wiki description', () => {
    const home = readSource('app/pages/index.vue')
    const about = readSource('app/pages/about.vue')
    const footer = readSource('app/components/SiteFooter.vue')
    const wiki = readSource('app/pages/wiki/index.vue')

    expect(home).toMatch(/import \{ SITE_VERSION \} from ['"]~\/data\/site-metadata['"]/)
    expect(footer).toMatch(/import \{ SITE_VERSION \} from ['"]~\/data\/site-metadata['"]/)
    expect(about).toMatch(/import \{ SITE_VERSION, siteStats \} from ['"]~\/data\/site-metadata['"]/)
    expect(wiki).toMatch(/import \{ wikiDescription \} from ['"]~\/data\/site-metadata['"]/)
    expect(wiki).toContain(':description="wikiDescription"')
    expect([home, about, footer, wiki].join('\n')).not.toMatch(
      /2026\.07|168\s*份|首版包含\s*39|首版路线/
    )
  })
})
