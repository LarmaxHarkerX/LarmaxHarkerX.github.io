<script setup lang="ts">
import Win3xIcon from '../shared/Win3xIcon.vue'
import { desktopPrograms, startMenuPrograms } from '../../modules/windows/registry'
import type { WindowState } from '../../modules/windows/types'

interface Props {
  currentTime?: string
  showStartMenu?: boolean
  windows?: WindowState[]
  activeWindowId?: string | null
}

withDefaults(defineProps<Props>(), {
  currentTime: '00:00',
  showStartMenu: false,
  windows: () => [],
  activeWindowId: null,
})

const emit = defineEmits<{
  toggleStart: []
  closeStart: []
  startAction: [action: string]
  iconDblclick: [action: string]
  taskbarClick: [id: string]
}>()

const handleDesktopPointerDown = (event: MouseEvent | TouchEvent) => {
  const target = event.target as HTMLElement | null

  if (!target) {
    return
  }

  if (target.closest('.start-menu') || target.closest('.start-button')) {
    return
  }

  emit('closeStart')
}

</script>

<template>
  <div class="win31-desktop" @mousedown="handleDesktopPointerDown" @touchstart="handleDesktopPointerDown">
    <!-- Desktop Icons -->
    <div class="desktop-icons">
        <div 
          v-for="program in desktopPrograms" 
          :key="program.id"
          class="desktop-icon"
          @dblclick="emit('iconDblclick', program.action)"
        >
          <div class="icon-image">
            <Win3xIcon :name="program.icon" size="desktop" :label="program.menuLabel" />
          </div>
          <div class="icon-label">{{ program.desktopLabel }}</div>
        </div>
      </div>
    
    <!-- Start Menu -->
    <Transition name="menu">
      <div v-if="showStartMenu" class="start-menu">
        <div 
          v-for="program in startMenuPrograms" 
          :key="program.id"
          class="start-menu-item"
          @click="emit('startAction', program.action)"
        >
          <span class="menu-icon">
            <Win3xIcon :name="program.icon" size="small" :label="program.menuLabel" />
          </span>
          <span class="menu-label">{{ program.menuLabel }}</span>
        </div>
      </div>
    </Transition>
    
    <!-- Taskbar -->
    <div class="win31-taskbar">
      <div class="taskbar-left">
        <button 
          type="button"
          class="start-button"
          :class="{ 'start-button--active': showStartMenu }"
          @click="emit('toggleStart')"
        >
          <span class="start-icon">
            <Win3xIcon name="windowsLogo" size="small" label="Start" />
          </span>
          <span class="start-text">Start</span>
        </button>
        
        <div class="taskbar-divider"></div>
        
        <!-- Open Windows in Taskbar -->
        <button 
          v-for="win in windows.filter(w => w.isOpen)" 
          :key="win.id"
          type="button"
          class="taskbar-window-btn"
          :class="{ 'taskbar-window-btn--active': win.id === activeWindowId && !win.isMinimized }"
          @click="emit('taskbarClick', win.id)"
        >
          <span class="window-btn-icon">
            <Win3xIcon :name="win.icon" size="small" :label="win.title" />
          </span>
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
  gap: 12px;
  z-index: 0;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 88px;
  min-height: 92px;
  padding: 6px 4px;
  cursor: pointer;
  text-align: center;
  user-select: none;
}

.icon-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.icon-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  line-height: 1.2;
  white-space: pre-line;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 2px 4px;
  max-width: 100%;
}

.desktop-icon:hover .icon-label,
.desktop-icon:focus-visible .icon-label {
  background: #000080;
  text-shadow: none;
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
  width: 20px;
  display: inline-flex;
  justify-content: center;
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

.start-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

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

.window-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

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

@media (max-width: 768px) {
  .desktop-icons {
    top: 12px;
    left: 12px;
    gap: 8px;
  }

  .desktop-icon {
    width: 78px;
    min-height: 84px;
  }

  .start-button {
    min-width: 56px;
    padding: 2px 6px;
  }

  .taskbar-window-btn {
    min-width: 84px;
  }
}
</style>
