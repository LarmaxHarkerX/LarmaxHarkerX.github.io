<script setup lang="ts">
import { onMounted } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TerminalPrompt from '../components/terminal/TerminalPrompt.vue'
import { usePosts } from '../composables/usePosts'

const { posts, loadPosts, categories, tags } = usePosts()

onMounted(() => {
  loadPosts()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '----------'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}
</script>

<template>
  <div class="blog-list-page">
    <TerminalWindow title="~/blog">
      <!-- Header -->
      <div class="blog-header">
        <TerminalPrompt path="~/blog" />
        <span class="command">ls -la</span>
      </div>
      
      <!-- Table Header -->
      <div class="ls-header">
        <span class="col-permissions">Permissions</span>
        <span class="col-date">Date</span>
        <span class="col-category">Category</span>
        <span class="col-title">Title</span>
      </div>
      
      <!-- Posts List -->
      <div class="posts-list">
        <router-link 
          v-for="post in posts" 
          :key="post.slug"
          :to="post.path"
          class="post-row"
        >
          <span class="col-permissions">-rw-r--r--</span>
          <span class="col-date">{{ formatDate(post.date) }}</span>
          <span class="col-category">
            <span class="category-badge">{{ post.category }}</span>
          </span>
          <span class="col-title">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </span>
          </span>
        </router-link>
      </div>
      
      <!-- Summary -->
      <div class="ls-summary">
        <span class="text-muted">total {{ posts.length }} posts</span>
      </div>
      
      <!-- Categories -->
      <div class="categories-section">
        <TerminalPrompt path="~/blog" />
        <span class="command">ls categories/</span>
        <div class="categories-list">
          <span v-for="cat in categories" :key="cat" class="category-item">
            {{ cat }}
          </span>
        </div>
      </div>
      
      <!-- Tags -->
      <div class="tags-section">
        <TerminalPrompt path="~/blog" />
        <span class="command">grep -r "tags" . | sort | uniq</span>
        <div class="tags-cloud">
          <span v-for="tag in tags" :key="tag" class="tag-item">
            #{{ tag }}
          </span>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.blog-list-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.blog-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.command {
  color: var(--terminal-fg);
}

.ls-header {
  display: grid;
  grid-template-columns: 120px 100px 120px 1fr;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--terminal-border);
  color: var(--terminal-fg-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.posts-list {
  margin-bottom: var(--space-4);
}

.post-row {
  display: grid;
  grid-template-columns: 120px 100px 120px 1fr;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--terminal-border);
  color: var(--terminal-fg);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.post-row:hover {
  background: var(--terminal-bg-secondary);
  border-color: var(--terminal-accent);
}

.col-permissions {
  color: var(--terminal-fg-muted);
  font-size: var(--text-sm);
}

.col-date {
  color: var(--terminal-green);
  font-size: var(--text-sm);
}

.col-category {
  font-size: var(--text-sm);
}

.category-badge {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.col-title {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.post-title {
  color: var(--terminal-accent);
  font-weight: 500;
}

.post-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tag {
  color: var(--terminal-fg-muted);
  font-size: var(--text-xs);
}

.ls-summary {
  padding: var(--space-2) 0;
  border-top: 1px solid var(--terminal-border);
  margin-bottom: var(--space-8);
}

.categories-section,
.tags-section {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--terminal-border);
}

.categories-list,
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-3);
  padding-left: var(--space-6);
}

.category-item {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--terminal-fg);
}

.tag-item {
  color: var(--terminal-cyan);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .ls-header,
  .post-row {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }
  
  .col-permissions {
    display: none;
  }
}
</style>