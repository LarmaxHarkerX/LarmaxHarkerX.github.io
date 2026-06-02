<script setup lang="ts">
import { ref } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
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
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="shuoshuo-page">
    <TerminalWindow 
      title="Notepad - ShuoShuo.txt" 
      icon="📝"
      :showMenu="true"
      :menuItems="['File', 'Edit', 'Search', 'Help']"
      :showStatus="true"
      statusText="Ready"
      width="100%"
    >
      <!-- Toolbar -->
      <div class="win31-toolbar">
        <button class="win31-toolbar-button" title="New">📄</button>
        <button class="win31-toolbar-button" title="Open">📂</button>
        <button class="win31-toolbar-button" title="Save">💾</button>
        <div class="win31-toolbar-separator"></div>
        <button class="win31-toolbar-button" title="Cut">✂️</button>
        <button class="win31-toolbar-button" title="Copy">📋</button>
        <button class="win31-toolbar-button" title="Paste">📌</button>
      </div>
      
      <!-- Content -->
      <div class="notepad-content">
        <div class="notepad-text">
          <div v-for="item in items" :key="item.id" class="shuoshuo-entry">
            <div class="entry-header">
              <span class="entry-id">[{{ item.id }}]</span>
              <span class="entry-date">{{ formatDate(item.date) }}</span>
            </div>
            <div class="entry-content">{{ item.content }}</div>
            <div class="entry-tags">
              <span v-for="tag in item.tags" :key="tag" class="entry-tag">
                #{{ tag }}
              </span>
            </div>
            <div class="entry-separator">────────────────────────────────</div>
          </div>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.shuoshuo-page {
  width: 100%;
}

.notepad-content {
  flex: 1;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  margin: 2px;
  overflow-y: auto;
  padding: 8px;
}

.notepad-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.shuoshuo-entry {
  margin-bottom: 8px;
}

.entry-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.entry-id {
  font-weight: bold;
  color: var(--win31-navy);
}

.entry-date {
  color: var(--win31-dark-gray);
}

.entry-content {
  margin-bottom: 4px;
  white-space: pre-wrap;
}

.entry-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.entry-tag {
  color: var(--win31-navy);
  font-size: var(--text-xs);
}

.entry-separator {
  color: var(--win31-dark-gray);
  margin-top: 8px;
  font-size: var(--text-xs);
}

@media (max-width: 768px) {
  .entry-header {
    flex-direction: column;
    gap: 2px;
  }
}
</style>