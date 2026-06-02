<script setup lang="ts">
import { ref, onMounted, shallowRef, markRaw, nextTick } from 'vue'
import { usePosts } from '../../composables/usePosts'

interface Props {
  path: string
}

const props = defineProps<Props>()
const { getPostByPath } = usePosts()

const post = ref<any>(null)
const contentComponent = shallowRef<any>(null)
const bpBody = ref<HTMLElement>()

onMounted(async () => {
  post.value = getPostByPath(props.path)
  
  // Load markdown component
  const modules = import.meta.glob('../../../posts/**/*.md', { eager: true })
  const fullPath = `../../../posts/${props.path}.md`
  const mod = modules[fullPath] as any
  
  if (mod) {
    contentComponent.value = markRaw(mod.default)
    
    // After component renders, fix any links that weren't caught by markdown-it plugin
    await nextTick()
    fixLinks()
  }
})

// Fix links in rendered content
const fixLinks = () => {
  if (!bpBody.value) return
  
  const links = bpBody.value.querySelectorAll('a[href]')
  links.forEach((link) => {
    const anchor = link as HTMLAnchorElement
    if (!anchor.target) {
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
    }
  })
}

// Handle link clicks - safety net
const handleBodyClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const anchor = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a') as HTMLAnchorElement
  
  if (anchor && anchor.href) {
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
    <div class="bp-toolbar">
      <button class="bp-btn" @click="emit('back')">⬅️</button>
      <button class="bp-btn">➡️</button>
      <div class="bp-separator"></div>
      <button class="bp-btn">📋</button>
      <button class="bp-btn">🔍</button>
    </div>
    
    <div class="bp-content">
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
      <div v-else class="bp-loading">
        Loading...
      </div>
    </div>
    
    <div class="bp-status">
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

.bp-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.bp-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.bp-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.bp-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.bp-content {
  flex: 1;
  background: #fff;
  margin: 2px;
  overflow: auto;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
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

.bp-status {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}
</style>