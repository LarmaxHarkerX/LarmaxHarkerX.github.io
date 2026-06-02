<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import { usePosts } from '../composables/usePosts'

const router = useRouter()
const { posts, loadPosts, categories } = usePosts()

onMounted(() => {
  loadPosts()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--------'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit' 
  })
}

const navigateToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}
</script>

<template>
  <div class="blog-list-page">
    <TerminalWindow 
      title="File Manager" 
      icon="📁"
      :showMenu="true"
      :menuItems="['File', 'Disk', 'Tree', 'View', 'Options', 'Help']"
      :showStatus="true"
      :statusText="`${posts.length} file(s)`"
      width="100%"
    >
      <!-- Toolbar -->
      <div class="win31-toolbar">
        <button class="win31-toolbar-button" title="Back">⬅️</button>
        <button class="win31-toolbar-button" title="Forward">➡️</button>
        <div class="win31-toolbar-separator"></div>
        <button class="win31-toolbar-button" title="Copy">📋</button>
        <button class="win31-toolbar-button" title="Move">📦</button>
        <button class="win31-toolbar-button" title="Delete">🗑️</button>
        <div class="win31-toolbar-separator"></div>
        <button class="win31-toolbar-button" title="View">👁️</button>
      </div>
      
      <!-- Address Bar -->
      <div class="address-bar">
        <span class="address-label">Directory:</span>
        <input 
          type="text" 
          class="win31-input address-input" 
          value="C:\BLOG\POSTS" 
          readonly
        />
      </div>
      
      <!-- File List -->
      <div class="file-list-container">
        <!-- Table Header -->
        <div class="file-list-header">
          <span class="col-icon"></span>
          <span class="col-name">Name</span>
          <span class="col-size">Size</span>
          <span class="col-date">Date</span>
          <span class="col-type">Type</span>
        </div>
        
        <!-- File List -->
        <div class="file-list">
          <!-- Parent Directory -->
          <div class="file-item" @dblclick="router.push('/')">
            <span class="col-icon">📁</span>
            <span class="col-name">..</span>
            <span class="col-size"></span>
            <span class="col-date"></span>
            <span class="col-type">Parent Dir</span>
          </div>
          
          <!-- Folders (Categories) -->
          <div 
            v-for="category in categories" 
            :key="category"
            class="file-item file-item--folder"
          >
            <span class="col-icon">📁</span>
            <span class="col-name">{{ category }}</span>
            <span class="col-size">&lt;DIR&gt;</span>
            <span class="col-date"></span>
            <span class="col-type">Folder</span>
          </div>
          
          <!-- Files (Posts) -->
          <div 
            v-for="post in posts" 
            :key="post.slug"
            class="file-item file-item--file"
            @dblclick="navigateToPost(post.slug)"
          >
            <span class="col-icon">📄</span>
            <span class="col-name">{{ post.title }}</span>
            <span class="col-size">4 KB</span>
            <span class="col-date">{{ formatDate(post.date) }}</span>
            <span class="col-type">Markdown</span>
          </div>
        </div>
      </div>
      
      <!-- Status Bar -->
      <template #status>
        <div class="status-section">
          {{ posts.length }} file(s)
        </div>
        <div class="status-section">
          {{ categories.length }} folder(s)
        </div>
      </template>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.blog-list-page {
  width: 100%;
}

.address-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--win31-gray);
  border-bottom: 1px solid var(--win31-dark-gray);
}

.address-label {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  font-weight: bold;
  white-space: nowrap;
}

.address-input {
  flex: 1;
  font-size: var(--text-sm);
}

.file-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  margin: 2px;
  overflow: hidden;
}

.file-list-header {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px 80px;
  gap: 4px;
  padding: 4px 8px;
  background: var(--win31-gray);
  border-bottom: 2px solid;
  border-color: var(--win31-white) var(--win31-black) 
                var(--win31-black) var(--win31-white);
  font-family: var(--font-system);
  font-size: var(--text-sm);
  font-weight: bold;
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.file-item {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px 80px;
  gap: 4px;
  padding: 4px 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  cursor: pointer;
}

.file-item:hover {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
}

.file-item:active {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
}

.file-item--folder {
  font-weight: bold;
}

.col-icon {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-size,
.col-date,
.col-type {
  font-size: var(--text-xs);
  color: var(--win31-dark-gray);
}

.file-item:hover .col-size,
.file-item:hover .col-date,
.file-item:hover .col-type {
  color: var(--win31-selection-text);
}

@media (max-width: 768px) {
  .file-list-header,
  .file-item {
    grid-template-columns: 24px 1fr 60px;
  }
  
  .col-date,
  .col-type {
    display: none;
  }
}
</style>