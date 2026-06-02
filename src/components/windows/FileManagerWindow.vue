<script setup lang="ts">
import { onMounted } from 'vue'
import { usePosts } from '../../composables/usePosts'

const { posts, loadPosts, categories } = usePosts()

onMounted(() => {
  loadPosts()
})

const emit = defineEmits<{
  openPost: [slug: string]
  openParent: []
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--------'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit' 
  })
}
</script>

<template>
  <div class="file-manager">
    <!-- Toolbar -->
    <div class="fm-toolbar">
      <button class="fm-btn" @click="emit('openParent')">⬅️</button>
      <button class="fm-btn">➡️</button>
      <div class="fm-separator"></div>
      <button class="fm-btn">📋</button>
      <button class="fm-btn">📦</button>
    </div>
    
    <!-- Address Bar -->
    <div class="fm-address">
      <span>Directory:</span>
      <input class="fm-input" value="C:\BLOG\POSTS" readonly />
    </div>
    
    <!-- File List -->
    <div class="fm-content">
      <div class="fm-header">
        <span class="fm-col-icon"></span>
        <span class="fm-col-name">Name</span>
        <span class="fm-col-size">Size</span>
        <span class="fm-col-date">Date</span>
      </div>
      
      <div class="fm-list">
        <!-- Parent Directory -->
        <div class="fm-item" @dblclick="emit('openParent')">
          <span class="fm-icon">📁</span>
          <span class="fm-name">..</span>
          <span class="fm-size"></span>
          <span class="fm-date"></span>
        </div>
        
        <!-- Categories (Folders) -->
        <div 
          v-for="cat in categories" 
          :key="cat"
          class="fm-item"
        >
          <span class="fm-icon">📁</span>
          <span class="fm-name">{{ cat }}</span>
          <span class="fm-size">&lt;DIR&gt;</span>
          <span class="fm-date"></span>
        </div>
        
        <!-- Posts (Files) -->
        <div 
          v-for="post in posts" 
          :key="post.slug"
          class="fm-item"
          @dblclick="emit('openPost', post.slug)"
        >
          <span class="fm-icon">📄</span>
          <span class="fm-name">{{ post.title }}</span>
          <span class="fm-size">4 KB</span>
          <span class="fm-date">{{ formatDate(post.date) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Status Bar -->
    <div class="fm-status">
      <span>{{ posts.length }} file(s)</span>
      <span>{{ categories.length }} folder(s)</span>
    </div>
  </div>
</template>

<style scoped>
.file-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fm-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.fm-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.fm-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.fm-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.fm-address {
  background: #c0c0c0;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
}

.fm-input {
  flex: 1;
  background: #fff;
  border: none;
  padding: 2px 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.fm-content {
  flex: 1;
  background: #fff;
  margin: 2px;
  overflow: auto;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.fm-header {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px;
  padding: 4px 8px;
  background: #c0c0c0;
  border-bottom: 2px solid;
  border-color: #fff #000 #000 #fff;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  position: sticky;
  top: 0;
}

.fm-list {
  padding: 4px;
}

.fm-item {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.fm-item:hover {
  background: #000080;
  color: #fff;
}

.fm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fm-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fm-size,
.fm-date {
  color: #808080;
}

.fm-item:hover .fm-size,
.fm-item:hover .fm-date {
  color: #fff;
}

.fm-status {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

@media (max-width: 600px) {
  .fm-header,
  .fm-item {
    grid-template-columns: 24px 1fr 60px;
  }
  
  .fm-date {
    display: none;
  }
}
</style>