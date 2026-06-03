import type { Moment, MarkdownModule } from './types'

interface MomentFrontmatter {
  date?: string
  tags?: string[]
}

const momentModules = import.meta.glob<MarkdownModule<MomentFrontmatter>>('../../../moments/*.md', { eager: true })

function normalizeTags(tags: unknown) {
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === 'string') : []
}

export function loadMomentIndex() {
  return Object.entries(momentModules)
    .map(([path, module]): Moment => ({
      slug: path.replace('../../../moments/', '').replace('.md', ''),
      date: module.frontmatter?.date || '',
      tags: normalizeTags(module.frontmatter?.tags),
      component: module.default ?? null,
    }))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
}
