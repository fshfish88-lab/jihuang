import { describe, expect, it } from 'vitest'
import { progressNodes } from '../../app/data/progression'
import { calculateCompletion, findNextIncomplete } from '../../app/stores/progress'

describe('world progress', () => {
  it('calculates rounded completion', () => {
    expect(calculateCompletion([])).toBe(0)
    expect(calculateCompletion(progressNodes.slice(0, 1).map(node => node.id))).toBe(8)
    expect(calculateCompletion(progressNodes.map(node => node.id))).toBe(100)
  })

  it('ignores duplicate ids in completion', () => {
    expect(calculateCompletion([progressNodes[0].id, progressNodes[0].id])).toBe(8)
  })

  it('returns the next unfinished node in route order', () => {
    expect(findNextIncomplete([])?.id).toBe(progressNodes[0].id)
    expect(findNextIncomplete([progressNodes[0].id])?.id).toBe(progressNodes[1].id)
    expect(findNextIncomplete(progressNodes.map(node => node.id))).toBeUndefined()
  })
})

