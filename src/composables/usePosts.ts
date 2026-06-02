import { ref } from 'vue'

export interface Post {
  title: string
  date: string
  description: string
  tags: string[]
  slug: string
  path: string
  folder: string
}

const posts = ref<Post[]>([])
const folders = ref<string[]>([])

export function usePosts() {
  const loadPosts = async () => {
    const modules = import.meta.glob('../../posts/**/*.md', { eager: true })
    
    const allPosts: Post[] = []
    const allFolders = new Set<string>()
    
    Object.entries(modules).forEach(([path, module]: [string, any]) => {
      const relativePath = path.replace('../../posts/', '')
      const parts = relativePath.split('/')
      
      let slug: string
      let folder: string
      
      if (parts.length === 2) {
        folder = parts[0]
        slug = parts[1].replace('.md', '')
        allFolders.add(folder)
      } else {
        folder = ''
        slug = parts[0].replace('.md', '')
      }
      
      const frontmatter = module.frontmatter || {}
      
      allPosts.push({
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        slug,
        path: relativePath.replace('.md', ''),
        folder,
      })
    })
    
    posts.value = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    folders.value = Array.from(allFolders).sort()
  }

  const getPostByPath = (path: string) => {
    return posts.value.find(post => post.path === path)
  }

  const getPostsByFolder = (folder: string) => {
    return posts.value.filter(post => post.folder === folder)
  }

  return {
    posts,
    folders,
    loadPosts,
    getPostByPath,
    getPostsByFolder,
  }
}