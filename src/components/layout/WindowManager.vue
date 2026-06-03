<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Win3xIcon from '../shared/Win3xIcon.vue'
import type { WindowState } from '../../modules/windows/types'

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

// Detect mobile
const isMobile = ref(window.innerWidth <= 768)

// Drag state
const isDragging = ref(false)
const dragWindowId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

// Resize state
const isResizing = ref(false)
const resizeWindowId = ref<string | null>(null)
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })

// Window position/size with responsive adjustments
const getWindowStyle = (win: WindowState) => {
  if (isMobile.value || win.isMaximized) {
    return {
      left: '0',
      top: '0',
      width: '100%',
      height: 'calc(100% - 32px)',
      zIndex: win.zIndex
    }
  }
  
  // Ensure window stays within viewport
  const maxX = Math.max(0, window.innerWidth - win.width)
  const maxY = Math.max(0, window.innerHeight - 32 - win.height)
  
  return {
    left: Math.min(win.x, maxX) + 'px',
    top: Math.min(win.y, maxY) + 'px',
    width: win.width + 'px',
    height: win.height + 'px',
    zIndex: win.zIndex
  }
}

// Handle window resize
const handleWindowResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Mouse/touch event handlers
const getPosition = (e: MouseEvent | TouchEvent) => {
  if ('touches' in e) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

const handleDragStart = (e: MouseEvent | TouchEvent, windowId: string) => {
  if ((e.target as HTMLElement).closest('.win31-titlebar-controls')) return
  if (isMobile.value) return // Disable drag on mobile
  
  isDragging.value = true
  dragWindowId.value = windowId
  
  const pos = getPosition(e)
  const win = props.windows.find(w => w.id === windowId)
  if (win) {
    dragOffset.value = {
      x: pos.x - win.x,
      y: pos.y - win.y
    }
  }
  
  emit('focus', windowId)
  e.preventDefault()
}

const handleResizeStart = (e: MouseEvent | TouchEvent, windowId: string) => {
  if (isMobile.value) return // Disable resize on mobile
  
  isResizing.value = true
  resizeWindowId.value = windowId
  
  const pos = getPosition(e)
  const win = props.windows.find(w => w.id === windowId)
  if (win) {
    resizeStartPos.value = { x: pos.x, y: pos.y }
    resizeStartSize.value = { width: win.width, height: win.height }
  }
  
  emit('focus', windowId)
  e.preventDefault()
  e.stopPropagation()
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  const pos = getPosition(e)
  
  if (isDragging.value && dragWindowId.value) {
    const newX = Math.max(0, pos.x - dragOffset.value.x)
    const newY = Math.max(0, pos.y - dragOffset.value.y)
    emit('move', dragWindowId.value, newX, newY)
  }
  
  if (isResizing.value && resizeWindowId.value) {
    const deltaX = pos.x - resizeStartPos.value.x
    const deltaY = pos.y - resizeStartPos.value.y
    
    const win = props.windows.find(w => w.id === resizeWindowId.value)
    if (win) {
      const newWidth = Math.max(win.minWidth, resizeStartSize.value.width + deltaX)
      const newHeight = Math.max(win.minHeight, resizeStartSize.value.height + deltaY)
      emit('resize', resizeWindowId.value, newWidth, newHeight)
    }
  }
}

const handleEnd = () => {
  isDragging.value = false
  dragWindowId.value = null
  isResizing.value = false
  resizeWindowId.value = null
}

onMounted(() => {
  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseup', handleEnd)
  window.addEventListener('touchmove', handleMove, { passive: false })
  window.addEventListener('touchend', handleEnd)
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMove)
  window.removeEventListener('mouseup', handleEnd)
  window.removeEventListener('touchmove', handleMove)
  window.removeEventListener('touchend', handleEnd)
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<template>
  <div class="window-manager">
    <div
      v-for="win in windows.filter(w => w.isOpen && !w.isMinimized)"
      :key="win.id"
      class="floating-window"
      :class="{ 
        'window-mobile': isMobile
      }"
      :style="getWindowStyle(win)"
      @mousedown="emit('focus', win.id)"
      @touchstart="emit('focus', win.id)"
    >
      <!-- Window Frame -->
      <div
        class="win31-window win31-window--fill"
        :class="{ 'win31-window--active': win.id === activeWindowId }"
      >
        <!-- Title Bar -->
        <div 
          class="win31-titlebar win31-titlebar--draggable"
          :class="{ 'win31-titlebar--inactive': win.id !== activeWindowId }"
          @mousedown="handleDragStart($event, win.id)"
          @touchstart="handleDragStart($event, win.id)"
        >
          <div class="win31-titlebar-text">
            <span class="win31-titlebar-icon">
              <Win3xIcon :name="win.icon" size="small" :label="win.title" />
            </span>
            {{ win.title }}
          </div>
          <div class="win31-titlebar-controls">
            <button 
              type="button"
              class="win31-control-btn"
              @click.stop="emit('minimize', win.id)"
              title="Minimize"
            >
              <Win3xIcon name="minimize" size="small" label="Minimize" />
            </button>
            <button 
              v-if="!isMobile"
              type="button"
              class="win31-control-btn"
              @click.stop="emit('maximize', win.id)"
              title="Maximize"
            >
              <Win3xIcon name="maximize" size="small" label="Maximize" />
            </button>
            <button 
              type="button"
              class="win31-control-btn control-close"
              @click.stop="emit('close', win.id)"
              title="Close"
            >
              <Win3xIcon name="close" size="small" label="Close" />
            </button>
          </div>
        </div>
        
        <!-- Window Content -->
        <div class="win31-window-content">
          <slot :name="win.id" />
        </div>
        
        <!-- Resize Handle (desktop only) -->
        <div 
          v-if="!win.isMaximized && !isMobile"
          class="resize-handle"
          @mousedown="handleResizeStart($event, win.id)"
          @touchstart="handleResizeStart($event, win.id)"
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
}

.control-close {
  margin-left: 2px;
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

/* Mobile styles */
.window-mobile .win31-titlebar--draggable {
  cursor: default;
}

@media (max-width: 768px) {
  .window-manager {
    bottom: 28px;
  }
}
</style>
