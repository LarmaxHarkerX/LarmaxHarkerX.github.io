import { ref } from 'vue'

export interface Moment {
  slug: string
  date: string
  tags: string[]
  content: string
  component: any
}

const moments = ref<Moment[]>([])

export function useMoments() {
  const loadMoments = () => {
    const modules = import.meta.glob('../../moments/*.md', { eager: true })
    
    moments.value = Object.entries(modules).map(([path, mod]: [string, any]) => {
      const slug = path.replace('../../moments/', '').replace('.md', '')
      const fm = mod.frontmatter || {}
      
      return {
        slug,
        date: fm.date || '',
        tags: fm.tags || [],
        content: fm.content || '',
        component: mod.default,
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return {
    moments,
    loadMoments,
  }
}