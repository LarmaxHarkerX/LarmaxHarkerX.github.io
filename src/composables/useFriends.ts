import { ref } from 'vue'

export interface Friend {
  slug: string
  name: string
  avatar: string
  description: string
  blog: string
  github: string
}

const friends = ref<Friend[]>([])

export function useFriends() {
  const loadFriends = () => {
    const modules = import.meta.glob('../../friends/*.md', { eager: true })
    
    friends.value = Object.entries(modules).map(([path, mod]: [string, any]) => {
      const slug = path.replace('../../friends/', '').replace('.md', '')
      const fm = mod.frontmatter || {}
      
      return {
        slug,
        name: fm.name || slug,
        avatar: fm.avatar || '',
        description: fm.description || '',
        blog: fm.blog || '',
        github: fm.github || '',
      }
    })
  }

  return {
    friends,
    loadFriends,
  }
}