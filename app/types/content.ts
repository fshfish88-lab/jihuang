export type ContentKind = 'beginner' | 'character' | 'boss' | 'progression' | 'wiki'

export interface GuideEntry {
  slug: string
  title: string
  english?: string
  kind: ContentKind
  description: string
  stage: string
  difficulty?: number
  tags: string[]
  aliases: string[]
  image: string
  imageAlt: string
  updatedAt: string
  version: string
}

export interface ProgressNode {
  id: string
  route: string
  title: string
  stage: string
  summary: string
  requires: string[]
  completion: string
  related: string[]
}

