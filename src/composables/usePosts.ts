import { markRaw, ref } from 'vue'
import type { Component } from 'vue'
import { loadPostComponent, loadPostIndex } from '../modules/content/posts'
import type { Post } from '../modules/content/types'

const posts = ref<Post[]>([])
const folders = ref<string[]>([])
const isLoaded = ref(false)
const postComponentCache = new Map<string, Component>()

export function usePosts() {
  const ensurePostsLoaded = async () => {
    if (isLoaded.value) {
      return
    }

    posts.value = loadPostIndex()
    folders.value = Array.from(new Set(posts.value.map((post) => post.folder).filter(Boolean))).sort()
    isLoaded.value = true
  }

  const getPostByPath = (path: string) => {
    return posts.value.find(post => post.path === path)
  }

  const getPostsByFolder = (folder: string) => {
    return posts.value.filter(post => post.folder === folder)
  }

  const getPostComponentByPath = async (path: string) => {
    await ensurePostsLoaded()

    const cached = postComponentCache.get(path)

    if (cached) {
      return cached
    }

    const component = await loadPostComponent(path)

    if (!component) {
      return null
    }

    const rawComponent = markRaw(component)
    postComponentCache.set(path, rawComponent)
    return rawComponent
  }

  return {
    posts,
    folders,
    isLoaded,
    ensurePostsLoaded,
    getPostByPath,
    getPostsByFolder,
    getPostComponentByPath,
  }
}
