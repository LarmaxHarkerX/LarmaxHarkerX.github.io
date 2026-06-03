<script setup lang="ts">
import { nextTick, ref, shallowRef, watch } from 'vue'
import type { Component } from 'vue'
import Win3xIcon from '../shared/Win3xIcon.vue'
import { usePosts } from '../../composables/usePosts'
import type { Post } from '../../modules/content/types'

interface Props {
  path: string
}

const props = defineProps<Props>()
const { ensurePostsLoaded, getPostByPath, getPostComponentByPath } = usePosts()

const post = ref<Post | null>(null)
const contentComponent = shallowRef<Component | null>(null)
const bpBody = ref<HTMLElement | null>(null)
const bpScrollPane = ref<HTMLElement | null>(null)
const isLoading = ref(true)

function normalizeAnchorId(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
}

function resolveInPageHash(href: string) {
  if (href.startsWith('#')) {
    return href.slice(1)
  }

  try {
    const url = new URL(href, window.location.href)
    const current = new URL(window.location.href)

    if (
      url.origin === current.origin
      && url.pathname === current.pathname
      && url.search === current.search
      && url.hash
    ) {
      return url.hash.slice(1)
    }
  } catch {
    return null
  }

  return null
}

function scrollToAnchor(anchorId: string) {
  if (!bpBody.value || !bpScrollPane.value) {
    return
  }

  const escapedId = window.CSS?.escape ? window.CSS.escape(anchorId) : anchorId
  const element = bpBody.value.querySelector<HTMLElement>(`#${escapedId}`)

  if (!element) {
    return
  }

  const containerRect = bpScrollPane.value.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const nextTop = elementRect.top - containerRect.top + bpScrollPane.value.scrollTop - 8

  bpScrollPane.value.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' })
}

function prepareArticleContent() {
  if (!bpBody.value) {
    return
  }

  const usedIds = new Map<string, number>()
  const headings = bpBody.value.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')

  headings.forEach((heading) => {
    if (heading.id) {
      usedIds.set(heading.id, (usedIds.get(heading.id) ?? 0) + 1)
      return
    }

    const baseId = normalizeAnchorId(heading.textContent || '')

    if (!baseId) {
      return
    }

    const count = usedIds.get(baseId) ?? 0
    usedIds.set(baseId, count + 1)
    heading.id = count === 0 ? baseId : `${baseId}-${count + 1}`
  })
}

const loadPost = async () => {
  isLoading.value = true
  await ensurePostsLoaded()
  post.value = getPostByPath(props.path) ?? null
  contentComponent.value = await getPostComponentByPath(props.path)

  await nextTick()
  prepareArticleContent()
  fixLinks()
  isLoading.value = false
}

watch(
  () => props.path,
  () => {
    void loadPost()
  },
  { immediate: true },
)

const fixLinks = () => {
  if (!bpBody.value) return
  
  const links = bpBody.value.querySelectorAll('a[href]')
  links.forEach((link) => {
    const anchor = link as HTMLAnchorElement
    const href = anchor.getAttribute('href') || ''
    
    if (!resolveInPageHash(href)) {
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      return
    }

    anchor.removeAttribute('target')
    anchor.removeAttribute('rel')
  })
}

const handleBodyClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const anchor = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a') as HTMLAnchorElement
  
  if (!anchor) return
  
  const href = anchor.getAttribute('href') || ''
  const inPageHash = resolveInPageHash(href)

  if (inPageHash) {
    e.preventDefault()
    scrollToAnchor(inPageHash)
    return
  }

  if (anchor.href) {
    e.preventDefault()
    window.open(anchor.href, '_blank', 'noopener,noreferrer')
  }
}

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="blog-post">
    <div class="win31-toolbar">
      <button type="button" class="win31-toolbar-button" title="Back" @click="emit('back')">
        <Win3xIcon name="back" size="small" label="Back" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Forward" disabled>
        <Win3xIcon name="forward" size="small" label="Forward" />
      </button>
      <div class="win31-toolbar-separator"></div>
      <button type="button" class="win31-toolbar-button" title="Copy" disabled>
        <Win3xIcon name="copy" size="small" label="Copy" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Search" disabled>
        <Win3xIcon name="search" size="small" label="Search" />
      </button>
    </div>
    
    <div ref="bpScrollPane" class="bp-content win31-pane win31-pane--scrollable">
      <div v-if="post" class="bp-article">
        <h1 class="bp-title">{{ post.title }}</h1>
        <div class="bp-meta">
          <span class="bp-date">{{ post.date }}</span>
          <span v-if="post.folder" class="bp-folder">{{ post.folder }}</span>
        </div>
        <div class="bp-tags">
          <span v-for="tag in post.tags" :key="tag" class="bp-tag">#{{ tag }}</span>
        </div>
        <div class="bp-description">{{ post.description }}</div>
        <div class="bp-divider"></div>
        <div class="bp-body" ref="bpBody" @click="handleBodyClick">
          <component :is="contentComponent" v-if="contentComponent" />
        </div>
      </div>
      <div v-else-if="isLoading" class="bp-loading">
        Loading...
      </div>
      <div v-else class="bp-loading">
        Post not found.
      </div>
    </div>
    
    <div class="bp-status win31-statusbar">
      <span>{{ post?.title || 'Loading...' }}</span>
    </div>
  </div>
</template>

<style scoped>
.blog-post {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bp-content {
  flex: 1;
  padding: 16px;
}

.bp-article {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  line-height: 1.6;
}

.bp-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.bp-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #808080;
}

.bp-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.bp-tag {
  background: #c0c0c0;
  padding: 2px 6px;
  font-size: 10px;
}

.bp-description {
  font-style: italic;
  color: #808080;
  margin-bottom: 16px;
}

.bp-divider {
  border: none;
  border-top: 1px solid #808080;
  margin: 16px 0;
}

.bp-body {
  font-size: 12px;
}

.bp-body :deep(img),
.bp-body :deep(picture),
.bp-body :deep(video),
.bp-body :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 12px auto;
}

.bp-body :deep(h1) {
  font-size: 20px;
  margin: 20px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #808080;
}

.bp-body :deep(h2) {
  font-size: 16px;
  margin: 16px 0 8px;
}

.bp-body :deep(h3) {
  font-size: 14px;
  margin: 12px 0 6px;
}

.bp-body :deep(p) {
  margin-bottom: 12px;
}

.bp-body :deep(ul),
.bp-body :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.bp-body :deep(li) {
  margin-bottom: 4px;
}

.bp-body :deep(code) {
  background: #f0f0f0;
  padding: 2px 4px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
}

.bp-body :deep(pre) {
  background: #f0f0f0;
  padding: 8px;
  overflow-x: auto;
  margin-bottom: 12px;
  border: 1px solid #808080;
}

.bp-body :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
}

.bp-body :deep(blockquote) {
  border-left: 3px solid #000080;
  padding-left: 12px;
  margin: 12px 0;
  color: #808080;
}

.bp-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.bp-body :deep(th),
.bp-body :deep(td) {
  border: 1px solid #808080;
  padding: 6px 8px;
  text-align: left;
}

.bp-body :deep(th) {
  background: #c0c0c0;
  font-weight: bold;
}

.bp-body :deep(a) {
  color: #000080;
  text-decoration: underline;
}

.bp-body :deep(hr) {
  border: none;
  border-top: 1px solid #808080;
  margin: 16px 0;
}

.bp-body :deep(strong) {
  font-weight: bold;
}

.bp-body :deep(em) {
  font-style: italic;
}

.bp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  color: #808080;
}
</style>
