import { describe, expect, it } from 'vitest'
import { entryPath, guideEntries } from '../../app/data/content'

describe('content registry', () => {
  it('contains the complete polished MVP', () => {
    expect(guideEntries.filter(item => item.kind === 'beginner')).toHaveLength(5)
    expect(guideEntries.filter(item => item.kind === 'character')).toHaveLength(5)
    expect(guideEntries.filter(item => item.kind === 'boss')).toHaveLength(5)
    expect(guideEntries.filter(item => item.kind === 'progression')).toHaveLength(3)
    expect(guideEntries.filter(item => item.kind === 'wiki').length).toBeGreaterThanOrEqual(20)
  })

  it('gives every entry a stable internal route and real local image', () => {
    for (const entry of guideEntries) {
      expect(entryPath(entry)).toMatch(/^\/(beginner|characters|bosses|progression|wiki)\//)
      expect(entry.image).toMatch(/^\/images\/official\/.+\.jpg$/)
      expect(entry.aliases.length).toBeGreaterThan(0)
    }
  })
})

