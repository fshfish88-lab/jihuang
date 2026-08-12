import { describe, expect, it } from 'vitest'
import { wikiEntries } from '../../app/data/wiki'
import { expandedDishEntries } from '../../app/data/wiki/dishes-expanded'

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
const requiredMissingMaterials = Object.values(missingMaterialLinks)
const requiredExpandedDishes = [
  'mandrake-soup', 'pumpkin-cookies', 'fruit-medley', 'fish-tacos', 'unagi',
  'banana-pop', 'asparagus-soup', 'stuffed-pepper-poppers', 'potato-souffle',
  'volt-goat-chaud-froid', 'lobster-dinner', 'lobster-bisque', 'california-roll',
  'barnacle-linguine', 'stuffed-fish-heads', 'barnacle-nigiri', 'leafy-meatloaf',
  'beefy-greens', 'jelly-salad', 'frozen-banana-daiquiri'
] as const
const canonicalDishExamples: Record<string, Record<string, number>> = {
  'lobster-dinner': { wobster: 1, butter: 1, berries: 2 },
  'lobster-bisque': { wobster: 1, ice: 1, berries: 2 },
  'california-roll': { 'kelp-fronds': 2, 'freshwater-fish': 2 },
  'barnacle-linguine': { barnacles: 2, asparagus: 2 },
  'stuffed-fish-heads': { barnacles: 1, 'freshwater-fish': 2, potato: 1 },
  'barnacle-nigiri': { barnacles: 1, 'kelp-fronds': 2, egg: 1 },
  'jelly-salad': { 'leafy-meat': 2, honey: 2 },
  'frozen-banana-daiquiri': { banana: 1, ice: 1, berries: 2 }
}
const featherUses: Record<string, string[]> = {
  'jet-feather': ['催眠吹箭', '鞍具脱卸器'],
  'crimson-feather': ['火焰吹箭'],
  'azure-feather': ['攻击吹箭'],
  'saffron-feather': ['电击吹箭']
}
const canonicalRecipeContracts: Record<string, { ingredients: Record<string, number>, station: string }> = {
  compass: { ingredients: { 'gold-nugget': 1, flint: 1 }, station: '徒手制作' },
  'blow-dart': { ingredients: { 'cut-reeds': 2, 'hound-tooth': 1, 'azure-feather': 1 }, station: '科学机器及以上科技' },
  'sleep-dart': { ingredients: { 'cut-reeds': 2, stinger: 1, 'jet-feather': 1 }, station: '科学机器及以上科技' },
  'fire-dart': { ingredients: { 'cut-reeds': 2, charcoal: 1, 'crimson-feather': 1 }, station: '科学机器及以上科技' },
  'electric-dart': { ingredients: { 'cut-reeds': 2, 'gold-nugget': 1, 'saffron-feather': 1 }, station: '科学机器及以上科技' },
  'rabbit-earmuffs': { ingredients: { rabbit: 2, twigs: 1 }, station: '徒手制作' },
  'bush-hat': { ingredients: { 'straw-hat': 1, rope: 1, 'berry-bush': 1 }, station: '炼金引擎' },
  'war-saddle': { ingredients: { rabbit: 4, 'steel-wool': 4, log: 10 }, station: '炼金引擎' },
  saddlehorn: { ingredients: { twigs: 2, 'bone-shards': 2, 'jet-feather': 1 }, station: '炼金引擎' },
  'feather-hat': { ingredients: { 'crimson-feather': 2, 'jet-feather': 3, 'tentacle-spots': 2 }, station: '炼金引擎' }
}

describe('wiki data', () => {
  it('contains exactly the 20 expanded practical crock pot dishes', () => {
    expect(requiredExpandedDishes).toHaveLength(20)
    expect(expandedDishEntries).toHaveLength(20)
    expect(expandedDishEntries.map(item => item.slug).sort()).toEqual([...requiredExpandedDishes].sort())
  })

  it.each(Object.entries(canonicalDishExamples))('keeps a canonical four-slot example for %s', (slug, expected) => {
    const entry = wikiEntries.find(item => item.slug === slug)
    expect(entry, `missing dish ${slug}`).toBeDefined()
    expect(Object.fromEntries(entry?.dish?.examples[0]?.ingredients.map(item => [item.slug, item.amount]) || [])).toEqual(expected)
  })

  it('uses current Live Eel inventory metadata for icon discovery', () => {
    const entry = wikiEntries.find(item => item.slug === 'eel')
    expect(entry?.english).toBe('Live Eel')
    expect(entry?.aliases).toContain('活鳗鱼')
    expect(entry?.image.sourceUrl).toMatch(/\/pondeel\.png$/)
  })

  it('contains at least 312 wiki entries', () => {
    expect(wikiEntries.length).toBeGreaterThanOrEqual(312)
  })

  it('contains at least 50 dishes', () => {
    expect(wikiEntries.filter(item => item.category === '料理').length).toBeGreaterThanOrEqual(50)
  })

  it.each(requiredMissingMaterials)('contains required material %s', (slug) => {
    const slugs = new Set(wikiEntries.map(item => item.slug))
    expect(slugs.has(slug), `missing material ${slug}`).toBe(true)
  })

  it.each(Object.entries(featherUses))('maps %s to its current crafting uses', (slug, expectedUses) => {
    const entry = wikiEntries.find(item => item.slug === slug)
    expect(entry, `missing feather ${slug}`).toBeDefined()
    expect(entry?.category).toBe('资源')
    expect(entry?.crafting.craftable).toBe(false)
    for (const expectedUse of expectedUses) {
      expect(entry?.uses.some(use => use.includes(expectedUse)), `${slug} -> ${expectedUse}`).toBe(true)
    }
  })

  it('does not map azure feather to Electric Dart', () => {
    const entry = wikiEntries.find(item => item.slug === 'azure-feather')
    expect(entry?.uses.some(use => use.includes('电击吹箭') || use.includes('带电吹箭'))).toBe(false)
  })

  it('documents the stable Friendly Scarecrow route for saffron feather', () => {
    const entry = wikiEntries.find(item => item.slug === 'saffron-feather')
    const steps = entry?.acquisition.flatMap(method => method.steps).join('') || ''
    for (const detail of ['友好稻草人', '捕鸟器', '种子', '乌鸦', '金丝雀']) {
      expect(steps, detail).toContain(detail)
    }
    expect(entry?.related).not.toContain('friendly-scarecrow')
  })

  it('defines exactly 30 required craftables', () => {
    expect(requiredCraftables).toHaveLength(30)
  })

  it.each(requiredCraftables)('contains required craftable %s', (slug) => {
    const entry = wikiEntries.find(item => item.slug === slug)
    expect(entry, `missing craftable ${slug}`).toBeDefined()
    expect(entry?.crafting.craftable, `${slug} is craftable`).toBe(true)
  })

  it.each(Object.entries(canonicalRecipeContracts))('uses the canonical current recipe and station for %s', (slug, expected) => {
    const entry = wikiEntries.find(item => item.slug === slug)
    expect(entry, `missing canonical recipe ${slug}`).toBeDefined()
    expect(Object.fromEntries(entry?.crafting.ingredients.map(item => [item.slug, item.amount]) || [])).toEqual(expected.ingredients)
    expect(entry?.crafting.station).toBe(expected.station)
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
        if (ingredient.slug) expect(slugs.has(ingredient.slug), `${item.slug} -> ${ingredient.slug}`).toBe(true)
      }
    }
  })

  it.each(Object.entries(missingMaterialLinks))('links every %s ingredient to %s', (name, expectedSlug) => {
    const slugs = new Set(wikiEntries.map(item => item.slug))
    const matches = wikiEntries.flatMap(item => item.crafting.ingredients
      .filter(ingredient => ingredient.name === name)
      .map(ingredient => ({ item, ingredient })))

    expect(matches.length, `no crafting ingredient named ${name}`).toBeGreaterThan(0)
    for (const { item, ingredient } of matches) {
      expect(ingredient.slug, `${item.slug} ingredient ${name}`).toBe(expectedSlug)
      expect(slugs.has(expectedSlug), `${item.slug} -> ${expectedSlug}`).toBe(true)
    }
  })
})
