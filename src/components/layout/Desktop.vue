<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  currentTime?: string
  showStartMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentTime: '00:00',
  showStartMenu: false,
})

const emit = defineEmits<{
  open: [path: string]
  toggleStart: []
  startAction: [action: string]
}>()

const startMenuItems = [
  { icon: '📁', label: 'Program Manager', action: '/' },
  { icon: '📝', label: 'File Manager', action: '/blog' },
  { icon: '📋', label: 'Notepad', action: '/shuoshuo' },
  { icon: '📇', label: 'Cardfile', action: '/friends' },
  { icon: 'ℹ️', label: 'About', action: '/about' },
  { icon: '🔄', label: 'Shut Down...', action: 'shutdown' },
]
</script>

<template>
  <div class="win31-desktop">
    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <slot name="icons" />
    </div>
    
    <!-- Windows Container -->
    <div class="desktop-windows">
      <slot />
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
        <!-- Start Button -->
        <button 
          class="start-button"
          :class="{ 'start-button--active': showStartMenu }"
          @click="emit('toggleStart')"
        >
          <span class="start-icon">🪟</span>
          <span class="start-text">Start</span>
        </button>
        
        <!-- Divider -->
        <div class="taskbar-divider"></div>
        
        <!-- Open Windows -->
        <slot name="taskbar-windows" />
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
  display: flex;
  flex-direction: column;
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

.desktop-windows {
  flex: 1;
  padding: 16px;
  padding-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-content: flex-start;
  z-index: 1;
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

.menu-label {
  flex: 1;
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
  gap: 8px;
}

/* Start Button */
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

.start-icon {
  font-size: 14px;
}

.start-text {
  font-size: 12px;
}

/* Taskbar Divider */
.taskbar-divider {
  width: 2px;
  height: 20px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 4px;
}

/* Taskbar Time */
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
.menu-enter-active {
  transition: all 0.15s ease-out;
}

.menu-leave-active {
  transition: all 0.1s ease-in;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .desktop-icons {
    top: 8px;
    left: 8px;
    gap: 8px;
  }
  
  .start-menu {
    left: 0;
    right: 0;
    bottom: 32px;
  }
}
</style>