<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const programs = [
  { icon: '📝', label: 'File Manager', action: '/blog' },
  { icon: '📋', label: 'Notepad', action: '/shuoshuo' },
  { icon: '📇', label: 'Cardfile', action: '/friends' },
  { icon: 'ℹ️', label: 'About', action: '/about' },
]

const emit = defineEmits<{
  open: [action: string]
}>()
</script>

<template>
  <div class="program-manager">
    <div class="pm-group">
      <div class="pm-group-title">📁 Main</div>
      <div class="pm-grid">
        <div 
          v-for="prog in programs" 
          :key="prog.action"
          class="pm-icon"
          @dblclick="emit('open', prog.action)"
        >
          <div class="pm-icon-img">{{ prog.icon }}</div>
          <div class="pm-icon-label">{{ prog.label }}</div>
        </div>
      </div>
    </div>
    <div class="pm-status">
      <span>Double-click an icon to open</span>
    </div>
  </div>
</template>

<style scoped>
.program-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.pm-group {
  flex: 1;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
}

.pm-group-title {
  background: #000080;
  color: #fff;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 8px;
}

.pm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  padding: 16px;
}

.pm-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  cursor: pointer;
  user-select: none;
}

.pm-icon:hover {
  background: #000080;
}

.pm-icon-img {
  font-size: 36px;
}

.pm-icon-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  text-align: center;
}

.pm-icon:hover .pm-icon-label {
  color: #fff;
}

.pm-status {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
}
</style>