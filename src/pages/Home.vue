<script setup lang="ts">
import { useRouter } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'

const router = useRouter()

const programs = [
  { icon: '📝', label: 'Blog Posts', path: '/blog', description: 'View all blog posts' },
  { icon: '💬', label: 'Shuo Shuo', path: '/shuoshuo', description: 'Short thoughts & updates' },
  { icon: '👥', label: 'Friends', path: '/friends', description: 'Friend links & contacts' },
  { icon: 'ℹ️', label: 'About Me', path: '/about', description: 'Learn about the author' },
  { icon: '🔍', label: 'Search', path: '/blog', description: 'Search blog posts' },
  { icon: '📰', label: 'RSS Feed', path: '/feed.xml', description: 'Subscribe to RSS' },
]

const navigateTo = (path: string) => {
  if (path.startsWith('http') || path.endsWith('.xml')) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }
}
</script>

<template>
  <div class="home-page">
    <TerminalWindow 
      title="Program Manager" 
      icon="📁"
      :showMenu="true"
      :menuItems="['File', 'Options', 'Window', 'Help']"
      :showStatus="true"
      statusText="Ready"
      width="100%"
      height="100%"
    >
      <div class="program-manager">
        <!-- Main Group Window -->
        <div class="group-window">
          <div class="group-title">
            <span class="group-icon">📁</span>
            <span>LARMAX Blog</span>
          </div>
          
          <div class="program-grid">
            <div 
              v-for="program in programs" 
              :key="program.path"
              class="program-item"
              @dblclick="navigateTo(program.path)"
              :title="program.description"
            >
              <div class="program-icon">{{ program.icon }}</div>
              <div class="program-label">{{ program.label }}</div>
            </div>
          </div>
        </div>
        
        <!-- Welcome Message -->
        <div class="welcome-window">
          <TerminalWindow 
            title="Welcome" 
            icon="ℹ️"
            width="100%"
          >
            <div class="welcome-content">
              <div class="welcome-text">
                <p class="welcome-title">Welcome to LARMAX Blog!</p>
                <p>This is a Windows 3.1 style blog interface.</p>
                <p>Double-click any icon above to open a program.</p>
              </div>
              <button class="win31-button win31-button--default" @click="navigateTo('/blog')">
                OK
              </button>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  height: calc(100vh - 36px);
}

.program-manager {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.group-window {
  background: var(--win31-gray);
  border: 2px solid;
  border-color: var(--win31-white) var(--win31-black) 
                var(--win31-black) var(--win31-white);
  box-shadow: 
    inset 1px 1px 0 var(--win31-light-gray),
    inset -1px -1px 0 var(--win31-dark-gray);
  padding: 2px;
}

.group-title {
  background: var(--win31-navy);
  color: var(--win31-white);
  font-family: var(--font-system);
  font-weight: bold;
  font-size: var(--text-sm);
  padding: 2px 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
}

.group-icon {
  font-size: 12px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  padding: 8px;
  background: var(--win31-gray);
}

.program-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  cursor: pointer;
  user-select: none;
}

.program-item:hover {
  background: var(--win31-selection);
}

.program-item:active {
  background: var(--win31-selection);
}

.program-icon {
  width: 32px;
  height: 32px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-label {
  font-family: var(--font-system);
  font-size: var(--text-xs);
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
  color: var(--win31-black);
}

.program-item:hover .program-label {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
  padding: 0 2px;
}

.welcome-window {
  margin-top: auto;
}

.welcome-content {
  padding: 16px;
  text-align: center;
}

.welcome-text {
  margin-bottom: 16px;
}

.welcome-title {
  font-weight: bold;
  font-size: var(--text-lg);
  margin-bottom: 8px;
}

.welcome-text p {
  margin-bottom: 4px;
  font-size: var(--text-sm);
}
</style>