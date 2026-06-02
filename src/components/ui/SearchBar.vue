<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '../../composables/useSearch'
import { usePosts } from '../../composables/usePosts'
import TerminalPrompt from '../terminal/TerminalPrompt.vue'

const router = useRouter()
const { buildIndex, search, searchResults, isSearching } = useSearch()
const { posts, loadPosts } = usePosts()

const query = ref('')
const isOpen = ref(false)

onMounted(async () => {
  await loadPosts()
  await buildIndex(posts.value)
})

watch(query, (newQuery) => {
  search(newQuery)
})

const handleResultClick = (slug: string) => {
  router.push(`/blog/${slug}`)
  isOpen.value = false
  query.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
    query.value = ''
  }
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper" @click="isOpen = true">
      <TerminalPrompt path="~" />
      <span class="search-command">grep</span>
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="Search posts..."
        @keydown="handleKeydown"
        @focus="isOpen = true"
      />
    </div>
    
    <Transition name="search-results">
      <div v-if="isOpen && query" class="search-results">
        <div v-if="isSearching" class="search-status">
          Searching...
        </div>
        
        <div v-else-if="searchResults.length === 0" class="search-status">
          No results found
        </div>
        
        <div v-else class="results-list">
          <button
            v-for="result in searchResults"
            :key="result.id"
            class="result-item"
            @click="handleResultClick(result.id)"
          >
            <span class="result-title">{{ result.title }}</span>
            <span class="result-content">{{ result.content }}</span>
          </button>
        </div>
        
        <div class="search-footer">
          <span class="text-muted">{{ searchResults.length }} results found</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-md);
  cursor: text;
  transition: border-color var(--transition-fast);
}

.search-input-wrapper:focus-within {
  border-color: var(--terminal-accent);
  box-shadow: 0 0 0 2px var(--terminal-glow);
}

.search-command {
  color: var(--terminal-fg);
  font-weight: 600;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--terminal-fg);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  outline: none;
}

.search-input::placeholder {
  color: var(--terminal-fg-muted);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-2);
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: var(--z-dropdown);
  max-height: 400px;
  overflow-y: auto;
}

.search-status {
  padding: var(--space-4);
  text-align: center;
  color: var(--terminal-fg-muted);
}

.results-list {
  padding: var(--space-2);
}

.result-item {
  display: block;
  width: 100%;
  padding: var(--space-3);
  text-align: left;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.result-item:hover {
  background: var(--terminal-bg-secondary);
}

.result-title {
  display: block;
  color: var(--terminal-accent);
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.result-content {
  display: block;
  color: var(--terminal-fg-muted);
  font-size: var(--text-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-footer {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--terminal-border);
  font-size: var(--text-sm);
}

/* Transition */
.search-results-enter-active {
  transition: all 0.2s ease-out;
}

.search-results-leave-active {
  transition: all 0.15s ease-in;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>