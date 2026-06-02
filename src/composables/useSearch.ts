import { ref, computed } from 'vue'
import FlexSearch from 'flexsearch'

interface SearchItem {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
}

const index = new FlexSearch.Document<SearchItem>({
  tokenize: 'forward',
  cache: true,
  document: {
    id: 'id',
    index: ['title', 'content', 'tags', 'category'],
    store: ['title', 'content'],
  },
})

const isIndexed = ref(false)
const searchResults = ref<SearchItem[]>([])
const isSearching = ref(false)

export function useSearch() {
  const buildIndex = async (posts: any[]) => {
    if (isIndexed.value) return
    
    posts.forEach((post) => {
      index.add({
        id: post.slug,
        title: post.title,
        content: post.description,
        tags: post.tags,
        category: post.category,
      })
    })
    
    isIndexed.value = true
  }

  const search = (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }
    
    isSearching.value = true
    
    const results = index.search(query, {
      limit: 10,
      enrich: true,
    })
    
    searchResults.value = results.flatMap((result: any) => 
      result.result.map((item: any) => item.doc)
    )
    
    isSearching.value = false
  }

  const clearSearch = () => {
    searchResults.value = []
  }

  return {
    buildIndex,
    search,
    clearSearch,
    searchResults,
    isSearching,
    isIndexed,
  }
}