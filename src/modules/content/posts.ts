import type { Component } from 'vue'
import type { MarkdownModule, Post } from './types'

interface PostFrontmatter {
  title?: string
  date?: string
  description?: string
  tags?: string[]
}

const postSourceModules = import.meta.glob<string>('../../../posts/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const postComponentModules = import.meta.glob<MarkdownModule<PostFrontmatter>>('../../../posts/**/*.md')

function normalizeTags(tags: unknown) {
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === 'string') : []
}

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function parseArrayValue(value: string) {
  return value
    .slice(1, -1)
    .split(',')
    .map((entry) => stripWrappingQuotes(entry.trim()))
    .filter(Boolean)
}

function parseFrontmatter(source: string): PostFrontmatter {
  const normalizedSource = source.replace(/\r\n/g, '\n')
  const lines = normalizedSource.split('\n')

  if (lines[0]?.trim() !== '---') {
    return {}
  }

  const frontmatter: PostFrontmatter = {}

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index].trim()

    if (line === '---') {
      break
    }

    if (!line) {
      continue
    }

    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      frontmatter[key as keyof PostFrontmatter] = parseArrayValue(rawValue) as never
      continue
    }

    frontmatter[key as keyof PostFrontmatter] = stripWrappingQuotes(rawValue) as never
  }

  return frontmatter
}

function toPost(path: string, frontmatter: PostFrontmatter): Post {
  const relativePath = path.replace('../../../posts/', '')
  const parts = relativePath.split('/')
  const slug = parts[parts.length - 1].replace('.md', '')
  const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : ''

  return {
    title: frontmatter.title || slug,
    date: frontmatter.date || '',
    description: frontmatter.description || '',
    tags: normalizeTags(frontmatter.tags),
    slug,
    path: relativePath.replace('.md', ''),
    folder,
  }
}

export function loadPostIndex() {
  return Object.entries(postSourceModules)
    .map(([path, source]) => toPost(path, parseFrontmatter(source)))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
}

export async function loadPostComponent(path: string): Promise<Component | null> {
  const modulePath = `../../../posts/${path}.md`
  const loader = postComponentModules[modulePath]

  if (!loader) {
    return null
  }

  const module = await loader()
  return module.default ?? null
}
