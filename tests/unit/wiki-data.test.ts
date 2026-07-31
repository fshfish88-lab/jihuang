import { describe, expect, it } from 'vitest'
import { wikiEntries } from '../../app/data/wiki'

describe('wiki data', () => {
  it('contains the first complete core batch', () => {
    expect(wikiEntries.length).toBeGreaterThanOrEqual(120)
    expect(wikiEntries.filter(item => item.category === '料理')).toHaveLength(30)
  })

  it('has valid crafting or acquisition data', () => {
    for (const item of wikiEntries) {
      expect(item.sources.length).toBeGreaterThan(0)
      expect(item.image.sourceUrl).toMatch(/^https:\/\//)
      expect(item.acquisition.length).toBeGreaterThan(0)
      if (item.crafting.craftable) {
        expect(item.crafting.ingredients.length).toBeGreaterThan(0)
        expect(item.crafting.station.length).toBeGreaterThan(0)
      }
    }
  })

  it('uses exactly four slots for every dish example', () => {
    for (const dish of wikiEntries.filter(item => item.category === '料理')) {
      expect(dish.dish).toBeDefined()
      for (const example of dish.dish!.examples) {
        expect(example.ingredients.reduce((sum, item) => sum + item.amount, 0)).toBe(4)
      }
    }
  })
})
