<script setup lang="ts">
import { ref } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TerminalPrompt from '../components/terminal/TerminalPrompt.vue'
import shuoshuoData from '../data/shuoshuo.json'

interface ShuoshuoItem {
  id: number
  content: string
  date: string
  tags: string[]
}

const items = ref<ShuoshuoItem[]>(shuoshuoData)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="shuoshuo-page">
    <TerminalWindow title="~/shuoshuo">
      <!-- Header -->
      <div class="shuoshuo-header">
        <TerminalPrompt path="~/shuoshuo" />
        <span class="command">cat shuoshuo.md</span>
      </div>
      
      <!-- Shuoshuo Items -->
      <div class="shuoshuo-list">
        <article v-for="item in items" :key="item.id" class="shuoshuo-card">
          <div class="card-header">
            <span class="card-id">#{{ item.id }}</span>
            <span class="card-date">{{ formatDate(item.date) }}</span>
          </div>
          
          <div class="card-content">
            {{ item.content }}
          </div>
          
          <div class="card-footer">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </article>
      </div>
      
      <!-- Summary -->
      <div class="shuoshuo-summary">
        <span class="text-muted">共 {{ items.length }} 条说说</span>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.shuoshuo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.shuoshuo-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.command {
  color: var(--terminal-fg);
}

.shuoshuo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.shuoshuo-card {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all var(--transition-fast);
}

.shuoshuo-card:hover {
  border-color: var(--terminal-accent);
  box-shadow: 0 0 20px var(--terminal-glow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.card-id {
  color: var(--terminal-accent);
  font-weight: 600;
  font-size: var(--text-sm);
}

.card-date {
  color: var(--terminal-fg-muted);
  font-size: var(--text-sm);
}

.card-content {
  color: var(--terminal-fg);
  line-height: 1.8;
  margin-bottom: var(--space-3);
}

.card-footer {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tag {
  color: var(--terminal-cyan);
  font-size: var(--text-sm);
}

.shuoshuo-summary {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--terminal-border);
}
</style>