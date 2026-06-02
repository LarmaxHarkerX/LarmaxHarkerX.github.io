<script setup lang="ts">
interface WindowState {
  id: string
  title: string
  icon: string
  isOpen: boolean
  isMinimized: boolean
}

interface Props {
  currentTime?: string
  showStartMenu?: boolean
  windows?: WindowState[]
  activeWindowId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  currentTime: '00:00',
  showStartMenu: false,
  windows: () => [],
  activeWindowId: null,
})

const emit = defineEmits<{
  toggleStart: []
  startAction: [action: string]
  iconDblclick: [action: string]
  taskbarClick: [id: string]
}>()

const startMenuItems = [
  { icon: '📁', label: 'Program Manager', action: '/' },
  { icon: '📝', label: 'File Manager', action: '/blog' },
  { icon: '📋', label: 'Notepad', action: '/shuoshuo' },
  { icon: '📇', label: 'Cardfile', action: '/friends' },
  { icon: 'ℹ️', label: 'About', action: '/about' },
  { icon: '🔄', label: 'Shut Down...', action: 'shutdown' },
]

const desktopIcons = [
  { icon: '📁', label: 'Program\nManager', action: '/' },
  { icon: '📝', label: 'File\nManager', action: '/blog' },
  { icon: '📋', label: 'Notepad', action: '/shuoshuo' },
  { icon: '📇', label: 'Cardfile', action: '/friends' },
  { icon: 'ℹ️', label: 'About', action: '/about' },
]
</script>

<template>
  <div class="win31-desktop">
    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <div 
        v-for="icon in desktopIcons" 
        :key="icon.action"
        class="desktop-icon"
        @dblclick="emit('iconDblclick', icon.action)"
      >
        <div class="icon-image">{{ icon.icon }}</div>
        <div class="icon-label" v-html="icon.label.replace('\n', '<br>')"></div>
      </div>
    </div>
    
    <!-- Start Menu -->
    <Transition name="menu">
      <div v-if="showStartMenu" class="start-menu">
        <div 
          v-for="item in startMenuItems" 
          :key="item.action"
          class="start-menu-item"
          @click="emit('startAction', item.action)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>
    </Transition>
    
    <!-- Taskbar -->
    <div class="win31-taskbar">
      <div class="taskbar-left">
        <button 
          class="start-button"
          :class="{ 'start-button--active': showStartMenu }"
          @click="emit('toggleStart')"
        >
          <span class="start-icon">🪟</span>
          <span class="start-text">Start</span>
        </button>
        
        <div class="taskbar-divider"></div>
        
        <!-- Open Windows in Taskbar -->
        <button 
          v-for="win in windows.filter(w => w.isOpen)" 
          :key="win.id"
          class="taskbar-window-btn"
          :class="{ 'taskbar-window-btn--active': win.id === activeWindowId && !win.isMinimized }"
          @click="emit('taskbarClick', win.id)"
        >
          <span class="window-btn-icon">{{ win.icon }}</span>
          <span class="window-btn-title">{{ win.title }}</span>
        </button>
      </div>
      
      <div class="taskbar-right">
        <div class="taskbar-time">
          {{ currentTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win31-desktop {
  background: #008080;
  min-height: 100vh;
  position: relative;
}

.desktop-icons {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 0;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  cursor: pointer;
  width: 80px;
  text-align: center;
  user-select: none;
}

.desktop-icon:hover {
  background: rgba(0, 0, 128, 0.3);
}

.icon-image {
  width: 48px;
  height: 48px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  line-height: 1.2;
}

.desktop-icon:hover .icon-label {
  background: #000080;
  text-shadow: none;
  padding: 2px 4px;
}

/* Start Menu */
.start-menu {
  position: fixed;
  bottom: 32px;
  left: 4px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  box-shadow: 
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080,
    4px 4px 0 rgba(0, 0, 0, 0.3);
  padding: 4px;
  min-width: 180px;
  z-index: 1000;
}

.start-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.start-menu-item:hover {
  background: #000080;
  color: #fff;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Taskbar */
.win31-taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  z-index: 100;
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow: hidden;
}

.taskbar-right {
  display: flex;
  align-items: center;
}

.start-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #c0c0c0;
  border: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 #000,
    inset 1px 1px 0 #fff,
    inset -2px -2px 0 #808080,
    inset 2px 2px 0 #dfdfdf;
  height: 24px;
  min-width: 60px;
}

.start-button:active,
.start-button--active {
  box-shadow:
    inset 1px 1px 0 #000,
    inset -1px -1px 0 #fff;
}

.start-icon { font-size: 14px; }

.taskbar-divider {
  width: 2px;
  height: 20px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 4px;
}

.taskbar-window-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #c0c0c0;
  border: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 #000,
    inset 1px 1px 0 #fff,
    inset -2px -2px 0 #808080,
    inset 2px 2px 0 #dfdfdf;
  min-width: 100px;
  height: 22px;
  max-width: 150px;
}

.taskbar-window-btn--active {
  box-shadow:
    inset 1px 1px 0 #000,
    inset -1px -1px 0 #fff;
  background: #dfdfdf;
}

.window-btn-icon { font-size: 12px; }

.window-btn-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-time {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  padding: 4px 8px;
  box-shadow:
    inset 1px 1px 0 #808080,
    inset -1px -1px 0 #fff;
  min-width: 50px;
  text-align: center;
}

/* Menu Transition */
.menu-enter-active { transition: all 0.15s ease-out; }
.menu-leave-active { transition: all 0.1s ease-in; }
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>