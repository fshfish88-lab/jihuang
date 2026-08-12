import { describe, expect, it } from 'vitest'
import { wikiEntries } from '../../app/data/wiki'

const requiredMissingMaterials = ['glow-berry', 'infused-moon-shard', 'pure-horror', 'dark-tatters']
const requiredCraftables = [
  'razor', 'pitchfork', 'garden-hoe', 'watering-can', 'golden-axe', 'golden-pickaxe',
  'golden-shovel', 'compass', 'boomerang', 'blow-dart', 'sleep-dart', 'fire-dart',
  'electric-dart', 'morning-star', 'fire-staff', 'ice-staff', 'grass-suit',
  'beekeeper-hat', 'rabbit-earmuffs', 'bush-hat', 'garland', 'honey-poultice',
  'straw-roll', 'fur-roll', 'feather-hat', 'brush', 'saddle', 'war-saddle',
  'glossamer-saddle', 'saddlehorn'
]
const missingMaterialLinks: Record<string, string> = {
  '发光浆果': 'glow-berry',
  '注能月亮碎片': 'infused-moon-shard',
  '纯粹恐惧': 'pure-horror',
  '暗影碎布': 'dark-tatters'
}

describe('wiki data', () => {
  it('contains the expanded core batch', () => {
    expect(wikiEntries.length).toBeGreaterThanOrEqual(312)
    expect(wikiEntries.filter(item => item.category === '料理').length).toBeGreaterThanOrEqual(50)

    const slugs = new Set(wikiEntries.map(item => item.slug))
    for (const slug of requiredMissingMaterials) {
      expect(slugs.has(slug), `missing material ${slug}`).toBe(true)
    }
    for (const slug of requiredCraftables) {
      const entry = wikiEntries.find(item => item.slug === slug)
      expect(entry, `missing craftable ${slug}`).toBeDefined()
      expect(entry?.crafting.craftable, `${slug} is craftable`).toBe(true)
    }
  })

  it('has valid crafting or acquisition data', () => {
    for (const item of wikiEntries) {
      expect(item.sources.length).toBeGreaterThan(0)
      expect(item.image.sourceUrl).toMatch(/^https:\/\//)
      expect(item.acquisition.length).toBeGreaterThan(0)
      if (item.crafting.craftable) {
        expect(item.crafting.ingredients.length).toBeGreaterThan(0)
        expect(item.crafting.station.length).toBeGreaterThan(0)
        expect(item.crafting.filter.length).toBeGreaterThan(0)
        expect(item.crafting.yield).toBeGreaterThan(0)
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

  it('uses unique slugs and resolvable ingredient links', () => {
    const slugs = new Set(wikiEntries.map(item => item.slug))
    expect(slugs.size).toBe(wikiEntries.length)

    for (const item of wikiEntries) {
      const ingredients = [
        ...item.crafting.ingredients,
        ...(item.dish?.examples.flatMap(example => example.ingredients) || [])
      ]
      for (const ingredient of ingredients) {
        expect(ingredient.name.length, `${item.slug} ingredient name`).toBeGreaterThan(0)
        const expectedSlug = missingMaterialLinks[ingredient.name]
        if (expectedSlug) {
          expect(ingredient.slug, `${item.slug} ingredient ${ingredient.name}`).toBe(expectedSlug)
          expect(slugs.has(expectedSlug), `${item.slug} -> ${expectedSlug}`).toBe(true)
        }
        if (ingredient.slug) expect(slugs.has(ingredient.slug), `${item.slug} -> ${ingredient.slug}`).toBe(true)
      }
    }
  })
})
