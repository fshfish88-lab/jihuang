import { describe, expect, it } from 'vitest'
import { progressNodes, routeOrder } from '../../app/data/progression'
import { getEntries, getEntryBySlug } from '../../app/data/content'
import { calculateCompletion, findNextIncomplete } from '../../app/stores/progress'

describe('world progress', () => {
  it('covers every route with valid links and keeps saved node IDs', () => {
    expect([...routeOrder].sort()).toEqual(getEntries('progression').map(entry => entry.slug).sort())
    expect(progressNodes.slice(0, 13).map(node => node.id)).toEqual(['gather-basics', 'map-key-biomes', 'science-machine', 'choose-base', 'food-loop', 'winter-ready', 'cave-entry', 'underground-outpost', 'find-ruins', 'defeat-guardian', 'boat-ready', 'find-lunar-island', 'lunar-tech'])
    expect(new Set(progressNodes.map(node => node.id)).size).toBe(progressNodes.length)
    for (const route of routeOrder) expect(progressNodes.some(node => node.route === route)).toBe(true)
    for (const node of progressNodes) for (const slug of node.related) expect(getEntryBySlug(slug), slug).toBeDefined()
  })
  it('calculates rounded completion', () => {
    expect(calculateCompletion([])).toBe(0)
    expect(calculateCompletion(progressNodes.slice(0, 1).map(node => node.id))).toBe(3)
    expect(calculateCompletion(progressNodes.map(node => node.id))).toBe(100)
  })

  it('ignores duplicate ids in completion', () => {
    expect(calculateCompletion([progressNodes[0].id, progressNodes[0].id])).toBe(3)
  })

  it('returns the next unfinished node in route order', () => {
    expect(findNextIncomplete([])?.id).toBe(progressNodes[0].id)
    expect(findNextIncomplete([progressNodes[0].id])?.id).toBe(progressNodes[1].id)
    expect(findNextIncomplete(progressNodes.map(node => node.id))).toBeUndefined()
  })
})

