<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
  showMenu?: boolean
  menuItems?: string[]
  showStatus?: boolean
  statusText?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Window',
  icon: '📄',
  showMenu: false,
  menuItems: () => ['File', 'Edit', 'View', 'Help'],
  showStatus: false,
  statusText: 'Ready',
  width: 'auto',
  height: 'auto',
})

const emit = defineEmits<{
  close: []
  menuClick: [item: string]
}>()

const handleClose = () => emit('close')

const handleMenuClick = (item: string) => {
  emit('menuClick', item)
}
</script>

<template>
  <div 
    class="win31-window"
    :style="{ width, height }"
  >
    <!-- Title Bar -->
    <div class="win31-titlebar">
      <div class="win31-titlebar-text">
        <span v-if="icon" class="win31-titlebar-icon">{{ icon }}</span>
        {{ title }}
      </div>
      <div class="win31-titlebar-controls">
        <button 
          class="win31-control-btn" 
          aria-label="System Menu"
          @click="handleClose"
        >
          ▼
        </button>
      </div>
    </div>
    
    <!-- Menu Bar -->
    <div v-if="showMenu" class="win31-menubar">
      <button 
        v-for="item in menuItems" 
        :key="item"
        class="win31-menu-item"
        @click="handleMenuClick(item)"
      >
        {{ item }}
      </button>
    </div>
    
    <!-- Window Content -->
    <div class="win31-window-content">
      <slot />
    </div>
    
    <!-- Status Bar -->
    <div v-if="showStatus" class="win31-statusbar">
      <div class="win31-statusbar-section">
        {{ statusText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.win31-window {
  background: var(--win31-gray);
  border: 2px solid;
  border-color: var(--win31-white) var(--win31-black) 
                var(--win31-black) var(--win31-white);
  box-shadow: 
    inset 1px 1px 0 var(--win31-light-gray),
    inset -1px -1px 0 var(--win31-dark-gray);
  padding: 3px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.win31-window--maximized {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: var(--z-window-active);
}

.win31-titlebar {
  background: var(--win31-navy);
  color: var(--win31-active-caption-text);
  font-family: var(--font-system);
  font-weight: bold;
  font-size: var(--text-sm);
  padding: 3px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 22px;
  flex-shrink: 0;
  user-select: none;
}

.win31-titlebar-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.win31-titlebar-icon {
  font-size: 14px;
}

.win31-titlebar-controls {
  display: flex;
  gap: 2px;
}

.win31-control-btn {
  width: 20px;
  height: 16px;
  background: var(--win31-gray);
  border: none;
  font-size: 8px;
  font-family: var(--font-system);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 var(--win31-black),
    inset 1px 1px 0 var(--win31-white),
    inset -2px -2px 0 var(--win31-dark-gray),
    inset 2px 2px 0 var(--win31-light-gray);
}

.win31-control-btn:active {
  box-shadow:
    inset 1px 1px 0 var(--win31-black),
    inset -1px -1px 0 var(--win31-white);
}

.win31-menubar {
  background: var(--win31-gray);
  border-bottom: 1px solid var(--win31-dark-gray);
  padding: 0;
  display: flex;
  align-items: center;
  height: 20px;
  flex-shrink: 0;
}

.win31-menu-item {
  background: var(--win31-gray);
  color: var(--win31-black);
  font-family: var(--font-system);
  font-size: var(--text-sm);
  padding: 2px 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.win31-menu-item:hover {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
}

.win31-window-content {
  flex: 1;
  overflow: auto;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  margin: 2px;
}

.win31-statusbar {
  background: var(--win31-gray);
  border-top: 1px solid var(--win31-dark-gray);
  padding: 2px 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-xs);
  height: 20px;
  flex-shrink: 0;
}

.win31-statusbar-section {
  box-shadow: var(--bevel-inset);
  padding: 1px 4px;
  flex: 1;
}
</style>