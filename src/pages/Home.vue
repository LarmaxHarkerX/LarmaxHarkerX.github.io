<script setup lang="ts">
import { useRouter } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'

const router = useRouter()

const programs = [
  { icon: '📝', label: 'File Manager', path: '/blog', description: 'Browse blog posts' },
  { icon: '📋', label: 'Notepad', path: '/shuoshuo', description: 'Read short thoughts' },
  { icon: '📇', label: 'Cardfile', path: '/friends', description: 'View friend links' },
  { icon: 'ℹ️', label: 'About', path: '/about', description: 'About this program' },
]

const handleDoubleClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <TerminalWindow 
      title="Program Manager" 
      icon="📁"
      :showMenu="true"
      :menuItems="['File', 'Options', 'Window', 'Help']"
      width="100%"
    >
      <div class="program-manager">
        <!-- Main Group Window -->
        <div class="group-window">
          <div class="group-title">
            <span class="group-icon">📁</span>
            <span>Main</span>
          </div>
          
          <div class="program-grid">
            <div 
              v-for="program in programs" 
              :key="program.path"
              class="program-item"
              @dblclick="handleDoubleClick(program.path)"
              :title="program.description"
            >
              <div class="program-icon">{{ program.icon }}</div>
              <div class="program-label">{{ program.label }}</div>
            </div>
          </div>
        </div>
        
        <!-- Tips -->
        <div class="tips-bar">
          <span class="tip-text">Double-click an icon to open a program</span>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  max-width: 600px;
}

.program-manager {
  padding: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.group-window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  box-shadow: 
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080;
  flex: 1;
}

.group-title {
  background: #000080;
  color: #fff;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-icon {
  font-size: 14px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #c0c0c0;
}

.program-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  user-select: none;
}

.program-item:hover {
  background: #000080;
}

.program-item:active {
  background: #000080;
}

.program-icon {
  width: 48px;
  height: 48px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
  color: #000;
}

.program-item:hover .program-label {
  color: #fff;
}

.tips-bar {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  margin-top: 8px;
}

.tip-text {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
}

@media (max-width: 480px) {
  .program-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>