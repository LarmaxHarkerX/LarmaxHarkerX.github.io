import type { Friend, MarkdownModule } from './types'

interface FriendFrontmatter {
  name?: string
  avatar?: string
  description?: string
  blog?: string
  github?: string
}

const friendModules = import.meta.glob<MarkdownModule<FriendFrontmatter>>('../../../friends/*.md', { eager: true })

export function loadFriendIndex() {
  return Object.entries(friendModules).map(([path, module]): Friend => {
    const slug = path.replace('../../../friends/', '').replace('.md', '')

    return {
      slug,
      name: module.frontmatter?.name || slug,
      avatar: module.frontmatter?.avatar || '',
      description: module.frontmatter?.description || '',
      blog: module.frontmatter?.blog || '',
      github: module.frontmatter?.github || '',
    }
  })
}
