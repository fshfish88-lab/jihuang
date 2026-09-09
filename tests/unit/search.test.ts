import { describe, expect, it } from 'vitest'
import { createSearchIndex } from '../../app/composables/useSearchIndex'
import { searchEntries } from '../../app/utils/search'

const index = createSearchIndex()

describe('alias-aware search', () => {
  it('answers the homepage question and returns all matching dishes', () => {
    expect(searchEntries(index, '怎么复活？').map(entry => entry.slug)).toContain('tell-tale-heart')
    expect(searchEntries(index, '料理').filter(entry => entry.tags.includes('四格食谱'))).toHaveLength(50)
    expect(searchEntries(index, '机器人')[0]?.slug).toBe('wx-78')
    expect(searchEntries(index, 'dl')[0]?.slug).toBe('deerclops')
  })
  it.each([
    ['巨鹿', 'deerclops'],
    ['dl', 'deerclops'],
    ['机器人', 'wx-78'],
    ['复活心', 'tell-tale-heart'],
    ['二本', 'alchemy-engine'],
    ['猪皮帽', 'football-helmet'],
    ['火龙果派', 'dragonpie'],
    ['铥矿', 'thulecite']
  ])('finds %s as %s', (query, slug) => {
    expect(index.search(query, { limit: 3 }).map(result => result.item.slug)).toContain(slug)
  })

  it('supports a small typo without returning unrelated top result', () => {
    expect(index.search('波兰水胶', { limit: 1 })[0]?.item.slug).toBe('pierogi')
  })

  it('indexes structured encyclopedia categories and summaries', () => {
    expect(index.search('四格食谱', { limit: 10 }).some(result => result.item.slug === 'meatballs')).toBe(true)
    expect(index.search('季节与探索', { limit: 10 }).length).toBeGreaterThan(0)
  })

  it.each([
    ['眼球伞', 'eyebrella'],
    ['犀牛', 'ancient-guardian'],
    ['帝王蟹', 'crab-king'],
    ['亮茄炸弹', 'brightshade-bomb'],
    ['圣所', 'sanctum'],
    ['热腺体', 'heat-gland']
  ])('finds advanced query %s as %s', (query, slug) => {
    expect(index.search(query, { limit: 5 }).map(result => result.item.slug)).toContain(slug)
  })
})

