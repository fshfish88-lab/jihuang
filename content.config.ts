import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  version: z.string(),
  updatedAt: z.string(),
  aliases: z.array(z.string()),
  tags: z.array(z.string()),
  related: z.array(z.string()),
  stage: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  category: z.string().optional(),
  english: z.string().optional()
})

export default defineContentConfig({
  collections: {
    beginner: defineCollection({
      type: 'page',
      source: 'beginner/*.md',
      schema: commonSchema
    }),
    characters: defineCollection({
      type: 'page',
      source: 'characters/*.md',
      schema: commonSchema
    }),
    bosses: defineCollection({
      type: 'page',
      source: 'bosses/*.md',
      schema: commonSchema
    }),
    progression: defineCollection({
      type: 'page',
      source: 'progression/*.md',
      schema: commonSchema
    }),
    wiki: defineCollection({
      type: 'page',
      source: 'wiki/*.md',
      schema: commonSchema
    })
  }
})

