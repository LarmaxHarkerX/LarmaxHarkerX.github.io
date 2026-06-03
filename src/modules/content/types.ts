import type { Component } from 'vue'

export interface MarkdownModule<TFrontmatter = Record<string, unknown>> {
  default: Component
  frontmatter?: TFrontmatter
}

export interface Post {
  title: string
  date: string
  description: string
  tags: string[]
  slug: string
  path: string
  folder: string
}

export interface Friend {
  slug: string
  name: string
  avatar: string
  description: string
  blog: string
  github: string
}

export interface Moment {
  slug: string
  date: string
  tags: string[]
  component: Component | null
}
