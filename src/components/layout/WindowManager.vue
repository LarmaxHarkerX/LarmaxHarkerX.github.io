<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface WindowState {
  id: string
  title: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  zIndex: number
  isOpen: boolean
  isMaximized: boolean
  isMinimized: boolean
  component: string
}

interface Props {
  windows: WindowState[]
  activeWindowId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [id: string]
  focus: [id: string]
  move: [id: string, x: number, y: number]
  resize: [id: string, width: number, height: number]
  maximize: [id: string]
  minimize: [id: string]
}>()

// Drag state
const isDragging = ref(false)
const dragWindowId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

// Resize state
const isResizing = ref(false)
const resizeWindowId = ref<string | null>(null)
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })

const handleMouseDownDrag = (e: MouseEvent, windowId: string) => {
  if ((e.target as HTMLElement).closest('.window-controls')) return
  
  isDragging.value = true
  dragWindowId.value = windowId
  
  const win = props.windows.find(w => w.id === windowId)
  if (win) {
    dragOffset.value = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    }
  }
  
  emit('focus', windowId)
  e.preventDefault()
}

const handleMouseDownResize = (e: MouseEvent, windowId: string) => {
  isResizing.value = true
  resizeWindowId.value = windowId
  
  const win = props.windows.find(w => w.id === windowId)
  if (win) {
    resizeStartPos.value = { x: e.clientX, y: e.clientY }
    resizeStartSize.value = { width: win.width, height: win.height }
  }
  
  emit('focus', windowId)
  e.preventDefault()
  e.stopPropagation()
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value && dragWindowId.value) {
    const newX = Math.max(0, e.clientX - dragOffset.value.x)
    const newY = Math.max(0, e.clientY - dragOffset.value.y)
    emit('move', dragWindowId.value, newX, newY)
  }
  
  if (isResizing.value && resizeWindowId.value) {
    const deltaX = e.clientX - resizeStartPos.value.x
    const deltaY = e.clientY - resizeStartPos.value.y
    
    const win = props.windows.find(w => w.id === resizeWindowId.value)
    if (win) {
      const newWidth = Math.max(win.minWidth, resizeStartSize.value.width + deltaX)
      const newHeight = Math.max(win.minHeight, resizeStartSize.value.height + deltaY)
      emit('resize', resizeWindowId.value, newWidth, newHeight)
    }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  dragWindowId.value = null
  isResizing.value = false
  resizeWindowId.value = null
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="window-manager">
    <div
      v-for="win in windows.filter(w => w.isOpen && !w.isMinimized)"
      :key="win.id"
      class="floating-window"
      :class="{ 'window-active': win.id === activeWindowId }"
      :style="{
        left: win.isMaximized ? '0' : win.x + 'px',
        top: win.isMaximized ? '0' : win.y + 'px',
        width: win.isMaximized ? '100%' : win.width + 'px',
        height: win.isMaximized ? 'calc(100% - 32px)' : win.height + 'px',
        zIndex: win.zIndex
      }"
      @mousedown="emit('focus', win.id)"
    >
      <!-- Window Frame -->
      <div class="win31-window" style="height: 100%;">
        <!-- Title Bar -->
        <div 
          class="win31-titlebar"
          :class="{ 'titlebar-inactive': win.id !== activeWindowId }"
          @mousedown="handleMouseDownDrag($event, win.id)"
        >
          <div class="titlebar-text">
            <span class="titlebar-icon">{{ win.icon }}</span>
            {{ win.title }}
          </div>
          <div class="window-controls">
            <button 
              class="win31-control-btn"
              @click="emit('minimize', win.id)"
              title="Minimize"
            >
              ▼
            </button>
            <button 
              class="win31-control-btn"
              @click="emit('maximize', win.id)"
              title="Maximize"
            >
              ▲
            </button>
            <button 
              class="win31-control-btn control-close"
              @click="emit('close', win.id)"
              title="Close"
            >
              ■
            </button>
          </div>
        </div>
        
        <!-- Window Content -->
        <div class="window-content">
          <slot :name="win.id" />
        </div>
        
        <!-- Resize Handle -->
        <div 
          v-if="!win.isMaximized"
          class="resize-handle"
          @mousedown="handleMouseDownResize($event, win.id)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.window-manager {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 32px;
  pointer-events: none;
}

.floating-window {
  position: absolute;
  pointer-events: auto;
  user-select: none;
}

.win31-window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  box-shadow: 
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080;
  display: flex;
  flex-direction: column;
}

.window-active .win31-window {
  box-shadow: 
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080,
    4px 4px 0 rgba(0, 0, 0, 0.3);
}

.win31-titlebar {
  background: #000080;
  color: #fff;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  flex-shrink: 0;
  cursor: move;
}

.titlebar-inactive {
  background: #808080;
}

.titlebar-text {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titlebar-icon {
  font-size: 14px;
}

.window-controls {
  display: flex;
  gap: 2px;
}

.win31-control-btn {
  width: 20px;
  height: 16px;
  background: #c0c0c0;
  border: none;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 #000,
    inset 1px 1px 0 #fff,
    inset -2px -2px 0 #808080,
    inset 2px 2px 0 #dfdfdf;
}

.win31-control-btn:active {
  box-shadow:
    inset 1px 1px 0 #000,
    inset -1px -1px 0 #fff;
}

.control-close {
  margin-left: 2px;
}

.window-content {
  flex: 1;
  overflow: auto;
  background: #c0c0c0;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: 
    linear-gradient(135deg, 
      transparent 0%, transparent 30%,
      #808080 30%, #808080 35%,
      transparent 35%, transparent 45%,
      #808080 45%, #808080 50%,
      transparent 50%, transparent 60%,
      #808080 60%, #808080 65%,
      transparent 65%
    );
}
</style>