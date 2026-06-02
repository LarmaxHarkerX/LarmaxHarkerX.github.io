<script setup lang="ts">
import { ref } from 'vue'
import shuoshuoData from '../../data/shuoshuo.json'

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
  <div class="notepad">
    <!-- Toolbar -->
    <div class="np-toolbar">
      <button class="np-btn">📄</button>
      <button class="np-btn">📂</button>
      <button class="np-btn">💾</button>
      <div class="np-separator"></div>
      <button class="np-btn">✂️</button>
      <button class="np-btn">📋</button>
      <button class="np-btn">📌</button>
    </div>
    
    <!-- Content -->
    <div class="np-content">
      <div class="np-text">
        <div v-for="item in items" :key="item.id" class="shuoshuo-entry">
          <div class="entry-header">
            <span class="entry-id">[{{ item.id }}]</span>
            <span class="entry-date">{{ formatDate(item.date) }}</span>
          </div>
          <div class="entry-content">{{ item.content }}</div>
          <div class="entry-tags">
            <span v-for="tag in item.tags" :key="tag" class="entry-tag">#{{ tag }}</span>
          </div>
          <div class="entry-separator">────────────────────────────────</div>
        </div>
      </div>
    </div>
    
    <!-- Status -->
    <div class="np-status">
      <span>{{ items.length }} entries</span>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.np-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.np-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.np-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.np-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.np-content {
  flex: 1;
  background: #fff;
  margin: 2px;
  overflow: auto;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
  padding: 8px;
}

.np-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
}

.shuoshuo-entry {
  margin-bottom: 12px;
}

.entry-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.entry-id {
  font-weight: bold;
  color: #000080;
}

.entry-date {
  color: #808080;
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
  color: #000080;
  font-size: 11px;
}

.entry-separator {
  color: #808080;
  margin-top: 8px;
  font-size: 11px;
}

.np-status {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}
</style>