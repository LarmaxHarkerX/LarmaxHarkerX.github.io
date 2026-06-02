<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Desktop from './components/layout/Desktop.vue'
import WindowManager from './components/layout/WindowManager.vue'
import ProgramManagerWindow from './components/windows/ProgramManagerWindow.vue'
import FileManagerWindow from './components/windows/FileManagerWindow.vue'
import NotepadWindow from './components/windows/NotepadWindow.vue'
import CardfileWindow from './components/windows/CardfileWindow.vue'
import AboutWindow from './components/windows/AboutWindow.vue'
import BlogPostWindow from './components/windows/BlogPostWindow.vue'

// Window state
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
  data?: any
}

// Boot state
const bootPhase = ref<'bios' | 'loading' | 'desktop'>('bios')
const biosLines = ref<string[]>([])
const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

// Window management
const windows = ref<WindowState[]>([])
const activeWindowId = ref<string | null>(null)
let nextZIndex = 10

// BIOS messages
const biosMessages = [
  'Award Modular BIOS v4.51PG',
  'Copyright (C) 1984-93, Award Software, Inc.',
  '',
  'LARMAX BLOG BIOS v1.0',
  'Intel(R) Pentium(R) Processor 60MHz',
  '',
  'Memory Test:    16384K OK',
  '',
  'Detecting Primary Master  ... WDC AC2850F',
  'Detecting Secondary Master... ATAPI CD-ROM',
  '',
  'Starting Windows 3.1...',
]

onMounted(() => {
  // BIOS animation
  let lineIndex = 0
  const biosInterval = setInterval(() => {
    if (lineIndex < biosMessages.length) {
      biosLines.value.push(biosMessages[lineIndex])
      lineIndex++
    } else {
      clearInterval(biosInterval)
      setTimeout(() => {
        bootPhase.value = 'loading'
        setTimeout(() => {
          bootPhase.value = 'desktop'
          updateTime()
          timeInterval = setInterval(updateTime, 1000)
        }, 2000)
      }, 500)
    }
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

// Window management functions
const openWindow = (id: string, title: string, icon: string, component: string, data?: any) => {
  const existing = windows.value.find(w => w.id === id)
  if (existing) {
    existing.isOpen = true
    existing.isMinimized = false
    activeWindowId.value = id
    existing.zIndex = nextZIndex++
    if (data) existing.data = data
    return
  }
  
  const offsetX = (windows.value.length % 5) * 30
  const offsetY = (windows.value.length % 5) * 30
  
  windows.value.push({
    id,
    title,
    icon,
    x: 50 + offsetX,
    y: 50 + offsetY,
    width: 700,
    height: 500,
    minWidth: 300,
    minHeight: 200,
    zIndex: nextZIndex++,
    isOpen: true,
    isMaximized: false,
    isMinimized: false,
    component,
    data
  })
  
  activeWindowId.value = id
}

const closeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) win.isOpen = false
  if (activeWindowId.value === id) {
    const openWindows = windows.value.filter(w => w.isOpen && !w.isMinimized)
    activeWindowId.value = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null
  }
}

const focusWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.isMinimized = false
    win.zIndex = nextZIndex++
    activeWindowId.value = id
  }
}

const moveWindow = (id: string, x: number, y: number) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.x = x
    win.y = y
  }
}

const resizeWindow = (id: string, width: number, height: number) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.width = width
    win.height = height
  }
}

const maximizeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) win.isMaximized = !win.isMaximized
}

const minimizeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) win.isMinimized = true
  if (activeWindowId.value === id) {
    const openWindows = windows.value.filter(w => w.isOpen && !w.isMinimized)
    activeWindowId.value = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null
  }
}

// Start menu
const showStartMenu = ref(false)

const toggleStartMenu = () => {
  showStartMenu.value = !showStartMenu.value
}

const handleStartAction = (action: string) => {
  showStartMenu.value = false
  
  const windowMap: Record<string, { title: string; icon: string; component: string }> = {
    '/': { title: 'Program Manager', icon: '📁', component: 'ProgramManager' },
    '/blog': { title: 'File Manager', icon: '📝', component: 'FileManager' },
    '/shuoshuo': { title: 'Notepad', icon: '📋', component: 'Notepad' },
    '/friends': { title: 'Cardfile', icon: '📇', component: 'Cardfile' },
    '/about': { title: 'About', icon: 'ℹ️', component: 'About' },
  }
  
  if (action === 'shutdown') {
    windows.value = []
    activeWindowId.value = null
    bootPhase.value = 'bios'
    biosLines.value = []
    setTimeout(() => {
      let lineIndex = 0
      const biosInterval = setInterval(() => {
        if (lineIndex < biosMessages.length) {
          biosLines.value.push(biosMessages[lineIndex])
          lineIndex++
        } else {
          clearInterval(biosInterval)
          setTimeout(() => {
            bootPhase.value = 'loading'
            setTimeout(() => {
              bootPhase.value = 'desktop'
            }, 2000)
          }, 500)
        }
      }, 100)
    }, 1000)
  } else if (windowMap[action]) {
    const { title, icon, component } = windowMap[action]
    openWindow(action, title, icon, component)
  }
}

// Handle icon double click
const handleIconDblClick = (action: string) => {
  handleStartAction(action)
}

// Handle open post
const handleOpenPost = (slug: string) => {
  openWindow(
    `post-${slug}`,
    `Blog Post - ${slug}`,
    '📄',
    'BlogPost',
    { slug }
  )
}

// Handle back to file manager
const handleBackToFileManager = () => {
  const fmWindow = windows.value.find(w => w.component === 'FileManager')
  if (fmWindow) {
    focusWindow(fmWindow.id)
  }
}
</script>

<template>
  <div class="app">
    <!-- BIOS Screen -->
    <Transition name="fade">
      <div v-if="bootPhase === 'bios'" class="bios-screen">
        <div class="bios-content">
          <div v-for="(line, index) in biosLines" :key="index" class="bios-line">{{ line }}</div>
          <span class="bios-cursor">_</span>
        </div>
      </div>
    </Transition>
    
    <!-- Windows Loading -->
    <Transition name="fade">
      <div v-if="bootPhase === 'loading'" class="loading-screen">
        <div class="loading-content">
          <div class="windows-logo">
            <div class="logo-red"></div>
            <div class="logo-green"></div>
            <div class="logo-blue"></div>
            <div class="logo-yellow"></div>
          </div>
          <div class="loading-text">Microsoft Windows</div>
          <div class="loading-version">Version 3.1</div>
          <div class="loading-progress">
            <div class="progress-bar"></div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Desktop -->
    <Transition name="fade">
      <div v-if="bootPhase === 'desktop'" class="desktop-container">
        <Desktop 
          :current-time="currentTime"
          :show-start-menu="showStartMenu"
          :windows="windows.filter(w => w.isOpen)"
          :active-window-id="activeWindowId"
          @toggle-start="toggleStartMenu"
          @start-action="handleStartAction"
          @icon-dblclick="handleIconDblClick"
          @taskbar-click="focusWindow"
        />
        
        <WindowManager
          :windows="windows"
          :active-window-id="activeWindowId"
          @close="closeWindow"
          @focus="focusWindow"
          @move="moveWindow"
          @resize="resizeWindow"
          @maximize="maximizeWindow"
          @minimize="minimizeWindow"
        >
          <template v-for="win in windows" :key="win.id" #[win.id]>
            <ProgramManagerWindow 
              v-if="win.component === 'ProgramManager'"
              @open="handleStartAction"
            />
            <FileManagerWindow 
              v-else-if="win.component === 'FileManager'"
              @open-post="handleOpenPost"
              @open-parent="handleStartAction('/')"
            />
            <NotepadWindow 
              v-else-if="win.component === 'Notepad'"
            />
            <CardfileWindow 
              v-else-if="win.component === 'Cardfile'"
            />
            <AboutWindow 
              v-else-if="win.component === 'About'"
              @close="closeWindow(win.id)"
            />
            <BlogPostWindow 
              v-else-if="win.component === 'BlogPost'"
              :slug="win.data?.slug"
              @back="handleBackToFileManager"
            />
          </template>
        </WindowManager>
      </div>
    </Transition>
  </div>
</template>

<style>
@import './assets/styles/main.css';
</style>

<style scoped>
.app {
  min-height: 100vh;
  background: #000;
}

.bios-screen {
  position: fixed;
  inset: 0;
  background: #000;
  padding: 20px;
  z-index: 9999;
}

.bios-content {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
}

.bios-line { white-space: pre; }

.bios-cursor {
  animation: blink 0.5s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.loading-screen {
  position: fixed;
  inset: 0;
  background: #008080;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content { text-align: center; }

.windows-logo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.logo-red { background: #FF0000; }
.logo-green { background: #00FF00; }
.logo-blue { background: #0000FF; }
.logo-yellow { background: #FFFF00; }

.loading-text {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.loading-version {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  color: #fff;
  margin-bottom: 20px;
}

.loading-progress {
  width: 200px;
  height: 20px;
  background: #000;
  border: 2px solid #808080;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: #000080;
  animation: progress 2s ease-out forwards;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.desktop-container {
  min-height: 100vh;
}

.fade-enter-active { transition: opacity 0.3s; }
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
