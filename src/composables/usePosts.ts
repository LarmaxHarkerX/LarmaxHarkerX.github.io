import { ref, computed } from 'vue'

export interface Post {
  title: string
  date: string
  description: string
  category: string
  tags: string[]
  path: string
  slug: string
}

const posts = ref<Post[]>([])

export function usePosts() {
  const loadPosts = async () => {
    const modules = import.meta.glob('../posts/*.md', { eager: true })
    
    posts.value = Object.entries(modules).map(([path, module]: [string, any]) => {
      const slug = path.replace('../posts/', '').replace('.md', '')
      const frontmatter = module.frontmatter || {}
      
      return {
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        description: frontmatter.description || '',
        category: frontmatter.category || 'Uncategorized',
        tags: frontmatter.tags || [],
        path: `/blog/${slug}`,
        slug,
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getPostBySlug = (slug: string) => {
    return posts.value.find(post => post.slug === slug)
  }

  const getPostsByCategory = (category: string) => {
    return posts.value.filter(post => post.category === category)
  }

  const getPostsByTag = (tag: string) => {
    return posts.value.filter(post => post.tags.includes(tag))
  }

  const categories = computed(() => {
    const cats = new Set(posts.value.map(post => post.category))
    return Array.from(cats)
  })

  const tags = computed(() => {
    const tagSet = new Set(posts.value.flatMap(post => post.tags))
    return Array.from(tagSet)
  })

  return {
    posts,
    loadPosts,
    getPostBySlug,
    getPostsByCategory,
    getPostsByTag,
    categories,
    tags,
  }
}