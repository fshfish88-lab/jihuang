import { describe, expect, it } from 'vitest'
import { createSearchIndex } from '../../app/composables/useSearchIndex'

const index = createSearchIndex()

describe('alias-aware search', () => {
  it.each([
    ['巨鹿', 'deerclops'],
    ['dl', 'deerclops'],
    ['机器人', 'wx-78'],
    ['复活心', 'tell-tale-heart'],
    ['二本', 'alchemy-engine']
  ])('finds %s as %s', (query, slug) => {
    expect(index.search(query, { limit: 3 }).map(result => result.item.slug)).toContain(slug)
  })

  it('supports a small typo without returning unrelated top result', () => {
    expect(index.search('波兰水胶', { limit: 1 })[0]?.item.slug).toBe('pierogi')
  })
})

