import { describe, expect, it } from 'vitest'
import { wikiEntries } from '../../app/data/wiki'
import type { CombatInfo, WikiRoute } from '../../app/types/wiki'

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

  it('keeps the existing encyclopedia intact before route data is added', () => {
    expect(wikiEntries).toHaveLength(168)
  })
})
