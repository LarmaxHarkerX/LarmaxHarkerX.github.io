<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Win3xIcon from '../shared/Win3xIcon.vue'
import { usePosts } from '../../composables/usePosts'

const { posts, folders, ensurePostsLoaded, getPostsByFolder } = usePosts()

interface Props {
  folder?: string
}

const props = withDefaults(defineProps<Props>(), {
  folder: '',
})

// Current folder (empty = root)
const currentFolder = ref('')

onMounted(() => {
  void ensurePostsLoaded()
})

const emit = defineEmits<{
  openPost: [path: string, parentFolder: string, title: string]
  folderChange: [folder: string]
}>()

const canGoUp = computed(() => currentFolder.value !== '')

const setCurrentFolder = (folder: string) => {
  currentFolder.value = folder
  emit('folderChange', folder)
}

watch(
  () => props.folder,
  (folder) => {
    currentFolder.value = folder
  },
  { immediate: true },
)

// Items to show in current view
const currentItems = computed(() => {
  if (currentFolder.value === '') {
    // Root: show folders + root-level posts
    const folderItems = folders.value.map(f => ({
      type: 'folder' as const,
      name: f,
      size: '<DIR>',
      date: '',
    }))
    
    const rootPosts = posts.value
      .filter(p => p.folder === '')
      .map(p => ({
        type: 'file' as const,
        name: p.title,
        size: '4 KB',
        date: p.date,
        path: p.path,
      }))
    
    return [...folderItems, ...rootPosts]
  } else {
    // In folder: show posts in this folder
    return getPostsByFolder(currentFolder.value).map(p => ({
      type: 'file' as const,
      name: p.title,
      size: '4 KB',
      date: p.date,
      path: p.path,
    }))
  }
})

const currentPathStr = computed(() => {
  return 'C:\\BLOG\\POSTS' + (currentFolder.value ? '\\' + currentFolder.value : '')
})

const enterFolder = (name: string) => {
  setCurrentFolder(name)
}

const goBack = () => {
  if (!canGoUp.value) {
    return
  }

  setCurrentFolder('')
}

const openFile = (path: string, title: string) => {
  emit('openPost', path, currentFolder.value, title)
}

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
    <div class="win31-toolbar">
      <button type="button" class="win31-toolbar-button" title="Back" :disabled="!canGoUp" @click="goBack">
        <Win3xIcon name="back" size="small" label="Back" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Forward" disabled>
        <Win3xIcon name="forward" size="small" label="Forward" />
      </button>
      <div class="win31-toolbar-separator"></div>
      <button type="button" class="win31-toolbar-button" title="Copy">
        <Win3xIcon name="copy" size="small" label="Copy" />
      </button>
      <button type="button" class="win31-toolbar-button" title="Archive">
        <Win3xIcon name="archive" size="small" label="Archive" />
      </button>
    </div>
    
    <div class="fm-address">
      <span>Directory:</span>
      <input class="fm-input win31-input" :value="currentPathStr" readonly />
    </div>
    
    <div class="fm-content win31-pane win31-pane--scrollable">
      <div class="fm-header">
        <span class="fm-col-icon"></span>
        <span class="fm-col-name">Name</span>
        <span class="fm-col-size">Size</span>
        <span class="fm-col-date">Date</span>
      </div>
      
      <div class="fm-list">
        <div v-if="canGoUp" class="fm-item" @dblclick="goBack">
          <span class="fm-icon">
            <Win3xIcon name="folder" size="small" label="Parent folder" />
          </span>
          <span class="fm-name">..</span>
          <span class="fm-size"></span>
          <span class="fm-date"></span>
        </div>
        
        <div 
          v-for="item in currentItems" 
          :key="item.type === 'folder' ? `folder-${item.name}` : `file-${item.path}`"
          class="fm-item"
          @dblclick="item.type === 'folder' ? enterFolder(item.name) : openFile(item.path, item.name)"
        >
          <span class="fm-icon">
            <Win3xIcon :name="item.type === 'folder' ? 'folder' : 'document'" size="small" :label="item.type" />
          </span>
          <span class="fm-name">{{ item.name }}</span>
          <span class="fm-size">{{ item.size }}</span>
          <span class="fm-date">{{ formatDate(item.date) }}</span>
        </div>
      </div>
    </div>
    
    <div class="fm-status win31-statusbar">
      <span>{{ currentItems.filter(i => i.type === 'file').length }} file(s)</span>
      <span>{{ currentItems.filter(i => i.type === 'folder').length }} folder(s)</span>
    </div>
  </div>
</template>

<style scoped>
.file-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
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
}

.fm-content {
  flex: 1;
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
  justify-content: space-between;
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
