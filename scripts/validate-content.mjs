import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const root = new URL('..', import.meta.url)
const contentDir = new URL('../content/', import.meta.url)
const required = ['title', 'description', 'version', 'updatedAt', 'aliases', 'tags', 'related', 'stage']
const collections = ['beginner', 'characters', 'bosses', 'progression', 'wiki']
const files = []

for (const collection of collections) {
  const dir = new URL(`../content/${collection}/`, import.meta.url)
  for (const name of await readdir(dir)) {
    if (extname(name) === '.md') files.push(new URL(name, dir))
  }
}

const slugs = new Set(files.map(file => file.pathname.split('/').pop().replace(/\.md$/, '')))
const errors = []

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  return match[1]
}

function field(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return match?.[1]?.trim()
}

function listValues(value) {
  if (!value?.startsWith('[') || !value.endsWith(']')) return []
  return value.slice(1, -1).split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
}

for (const file of files) {
  const text = await readFile(file, 'utf8')
  const block = frontmatter(text)
  const label = relative(new URL('../', root).pathname, file.pathname).replaceAll('\\', '/')

  if (!block) {
    errors.push(`${label}: missing frontmatter`)
    continue
  }

  for (const key of required) {
    if (!field(block, key)) errors.push(`${label}: missing ${key}`)
  }

  if (!/^#|^>|\r?\n#|\r?\n>/.test(text.slice(block.length + 8))) {
    errors.push(`${label}: body has no readable heading or conclusion`)
  }

  for (const related of listValues(field(block, 'related'))) {
    if (!slugs.has(related)) errors.push(`${label}: related slug "${related}" does not exist`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${files.length} content entries; 0 errors.`)

