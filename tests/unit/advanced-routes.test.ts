import { describe, expect, it } from 'vitest'
import { getWikiEntriesByRoute, wikiEntries } from '../../app/data/wiki'
import type { CombatInfo, WikiRoute } from '../../app/types/wiki'

const routeSlugs: Record<WikiRoute, string[]> = {
  四季生存: ['winter-hat', 'puffy-vest', 'rain-coat', 'eyebrella', 'chilled-amulet', 'luxury-fan', 'endothermic-fire', 'endothermic-fire-pit', 'thermal-measurer', 'desert-goggles', 'deerclops', 'moose-goose', 'dragonfly', 'bearger', 'antlion'],
  洞穴遗迹: ['cave-entrance', 'moggles', 'mushroom-planter', 'batilisk', 'bunnyman', 'depth-worm', 'slurper', 'splumonkey', 'ruins', 'ancient-pseudoscience-station', 'thulecite-crown', 'thulecite-suit', 'star-callers-staff', 'deconstruction-staff', 'ancient-guardian'],
  航海月岛: ['boat-patch', 'mast', 'steering-wheel', 'anchor', 'oar', 'boat-lantern', 'salt-box', 'salt-crystals', 'cookie-cutter', 'lunar-island', 'stone-fruit', 'kelp-stalk', 'moon-moth', 'glass-cutter', 'moon-dial'],
  Boss战备: ['tentacle-spike', 'night-armour', 'marble-suit', 'bee-mine', 'tooth-trap', 'pan-flute', 'weather-pain', 'bee-queen', 'klaus', 'toadstool', 'crab-king', 'malbatross', 'eye-of-terror', 'twins-of-terror', 'ancient-fuelweaver'],
  天体裂隙: ['celestial-altar', 'celestial-portal', 'moon-storm', 'restrained-static', 'celestial-champion', 'enlightened-crown', 'lunar-rift', 'grazer', 'deadly-brightshade', 'brightshade-husk', 'brightshade-staff', 'brightshade-sword', 'brightshade-helm', 'brightshade-armour', 'brightshade-bomb'],
  暗影圣所: ['shadow-rift', 'dreadstone-helm', 'dreadstone-armour', 'void-cowl', 'void-robe', 'shadow-reaper', 'sanctum', 'waymark-compass', 'ancient-guard-tower', 'keystone', 'geothermite', 'heat-gland', 'ardent-axe', 'pyretic-pickaxe', 'thermal-balm']
}

describe('advanced route contract', () => {
  it('accepts the six fixed routes and structured combat fields', () => {
    const route: WikiRoute = '四季生存'
    const combat: CombatInfo = {
      spawn: ['冬季世界计时达到对应阶段'],
      preparation: ['至少准备两套护甲'],
      steps: ['引离基地后再战斗'],
      retreat: ['护甲耗尽时撤退'],
      drops: [{ slug: 'deerclops-eyeball', name: '独眼巨鹿眼球', amount: '1' }]
    }

    expect(route).toBe('四季生存')
    expect(combat.drops[0]?.slug).toBe('deerclops-eyeball')
  })

  it('adds the exact 90 entries in six balanced route packs', () => {
    expect(wikiEntries).toHaveLength(258)
    for (const [route, expected] of Object.entries(routeSlugs) as [WikiRoute, string[]][]) {
      const entries = getWikiEntriesByRoute(route)
      expect(entries.map(entry => entry.slug).sort()).toEqual([...expected].sort())
      expect(entries.every(entry => entry.routeGuide)).toBe(true)
    }
  })

  it('gives every advanced creature a complete combat file', () => {
    const creatures = wikiEntries.filter(entry => entry.route && entry.category === '生物')
    expect(creatures.length).toBeGreaterThan(0)
    for (const entry of creatures) {
      expect(entry.combat, entry.slug).toBeDefined()
      expect(entry.combat!.spawn.length, entry.slug).toBeGreaterThan(0)
      expect(entry.combat!.preparation.length, entry.slug).toBeGreaterThan(0)
      expect(entry.combat!.steps.length, entry.slug).toBeGreaterThan(0)
      expect(entry.combat!.retreat.length, entry.slug).toBeGreaterThan(0)
      expect(entry.combat!.drops.length, entry.slug).toBeGreaterThan(0)
    }
  })

  it('links advanced crafting ingredients and structured drops to real entries', () => {
    const slugs = new Set(wikiEntries.map(entry => entry.slug))
    for (const entry of wikiEntries.filter(item => item.route)) {
      for (const ingredient of entry.crafting.ingredients) {
        if (ingredient.slug) expect(slugs.has(ingredient.slug), `${entry.slug} ingredient ${ingredient.slug}`).toBe(true)
      }
      for (const drop of entry.combat?.drops || []) {
        if (drop.slug) expect(slugs.has(drop.slug), `${entry.slug} drop ${drop.slug}`).toBe(true)
      }
    }
  })

  it('attaches current official sources to the 2026 Sanctum pack', () => {
    for (const entry of getWikiEntriesByRoute('暗影圣所')) {
      expect(entry.sources.some(source => source.kind === 'official'), entry.slug).toBe(true)
    }
  })
})
