<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Desktop from './components/layout/Desktop.vue'
import WindowManager from './components/layout/WindowManager.vue'

// Window state interface

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

// Open a new window
const openWindow = (id: string, title: string, icon: string, component: string) => {
  // Check if window already exists
  const existing = windows.value.find(w => w.id === id)
  if (existing) {
    existing.isOpen = true
    existing.isMinimized = false
    activeWindowId.value = id
    existing.zIndex = nextZIndex++
    return
  }
  
  // Create new window
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
    component
  })
  
  activeWindowId.value = id
}

// Close window
const closeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.isOpen = false
  }
  if (activeWindowId.value === id) {
    const openWindows = windows.value.filter(w => w.isOpen && !w.isMinimized)
    activeWindowId.value = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null
  }
}

// Focus window
const focusWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.zIndex = nextZIndex++
    activeWindowId.value = id
  }
}

// Move window
const moveWindow = (id: string, x: number, y: number) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.x = x
    win.y = y
  }
}

// Resize window
const resizeWindow = (id: string, width: number, height: number) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.width = width
    win.height = height
  }
}

// Maximize/restore window
const maximizeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.isMaximized = !win.isMaximized
  }
}

// Minimize window
const minimizeWindow = (id: string) => {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.isMinimized = true
  }
  if (activeWindowId.value === id) {
    const openWindows = windows.value.filter(w => w.isOpen && !w.isMinimized)
    activeWindowId.value = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null
  }
}

// Show start menu
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

// Handle desktop icon double click
const handleIconDblClick = (action: string) => {
  handleStartAction(action)
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
            <div class="window-page-content">
              <!-- Dynamic component based on window type -->
              <div v-if="win.component === 'ProgramManager'" class="program-manager-content">
                <div class="pm-group">
                  <div class="pm-group-title">📁 Main</div>
                  <div class="pm-grid">
                    <div class="pm-icon" @dblclick="handleStartAction('/blog')">
                      <div class="pm-icon-img">📝</div>
                      <div class="pm-icon-label">File Manager</div>
                    </div>
                    <div class="pm-icon" @dblclick="handleStartAction('/shuoshuo')">
                      <div class="pm-icon-img">📋</div>
                      <div class="pm-icon-label">Notepad</div>
                    </div>
                    <div class="pm-icon" @dblclick="handleStartAction('/friends')">
                      <div class="pm-icon-img">📇</div>
                      <div class="pm-icon-label">Cardfile</div>
                    </div>
                    <div class="pm-icon" @dblclick="handleStartAction('/about')">
                      <div class="pm-icon-img">ℹ️</div>
                      <div class="pm-icon-label">About</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="win.component === 'FileManager'" class="file-manager-content">
                <div class="fm-toolbar">
                  <button class="fm-btn">⬅️</button>
                  <button class="fm-btn">➡️</button>
                  <div class="fm-separator"></div>
                  <button class="fm-btn">📋</button>
                  <button class="fm-btn">📦</button>
                </div>
                <div class="fm-address">
                  <span>Directory:</span>
                  <input class="fm-input" value="C:\BLOG\POSTS" readonly />
                </div>
                <div class="fm-content">
                  <div class="fm-header">
                    <span class="fm-col-icon"></span>
                    <span class="fm-col-name">Name</span>
                    <span class="fm-col-size">Size</span>
                    <span class="fm-col-date">Date</span>
                  </div>
                  <div class="fm-list">
                    <div class="fm-item" @dblclick="handleStartAction('/')">
                      <span>📁</span>
                      <span>..</span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="fm-item">
                      <span>📁</span>
                      <span>Tutorial</span>
                      <span>&lt;DIR&gt;</span>
                      <span></span>
                    </div>
                    <div class="fm-item">
                      <span>📁</span>
                      <span>Development</span>
                      <span>&lt;DIR&gt;</span>
                      <span></span>
                    </div>
                    <div class="fm-item">
                      <span>📄</span>
                      <span>Getting Started with Vue</span>
                      <span>4 KB</span>
                      <span>01/01/24</span>
                    </div>
                    <div class="fm-item">
                      <span>📄</span>
                      <span>Vue 3 Composition API</span>
                      <span>5 KB</span>
                      <span>01/15/24</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="win.component === 'Notepad'" class="notepad-content">
                <div class="np-toolbar">
                  <button class="np-btn">📄</button>
                  <button class="np-btn">📂</button>
                  <button class="np-btn">💾</button>
                  <div class="np-separator"></div>
                  <button class="np-btn">✂️</button>
                  <button class="np-btn">📋</button>
                  <button class="np-btn">📌</button>
                </div>
                <textarea class="np-textarea" placeholder="Type your notes here..."></textarea>
              </div>
              
              <div v-else-if="win.component === 'Cardfile'" class="cardfile-content">
                <div class="cf-toolbar">
                  <button class="cf-btn">➕</button>
                  <button class="cf-btn">➖</button>
                  <div class="cf-separator"></div>
                  <button class="cf-btn">⬆️</button>
                  <button class="cf-btn">⬇️</button>
                </div>
                <div class="cf-content">
                  <div class="cf-index">
                    <div class="cf-index-header">Index</div>
                    <div class="cf-index-list">
                      <div class="cf-index-item active">Vue.js</div>
                      <div class="cf-index-item">Vite</div>
                      <div class="cf-index-item">GitHub</div>
                    </div>
                  </div>
                  <div class="cf-detail">
                    <div class="cf-avatar">🟢</div>
                    <div class="cf-info">
                      <div class="cf-name">Vue.js</div>
                      <div class="cf-desc">The Progressive JavaScript Framework</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="win.component === 'About'" class="about-content">
                <div class="about-header">
                  <div class="about-icon">💻</div>
                  <div class="about-info">
                    <div class="about-name">LARMAX Blog</div>
                    <div class="about-version">Version 1.0</div>
                    <div class="about-copyright">Copyright © 2024</div>
                  </div>
                </div>
                <div class="about-group">
                  <div class="about-group-title">System Information</div>
                  <div class="about-row">
                    <span class="about-label">Owner:</span>
                    <span>LARMAX</span>
                  </div>
                  <div class="about-row">
                    <span class="about-label">Role:</span>
                    <span>Full Stack Developer</span>
                  </div>
                </div>
                <div class="about-footer">
                  <button class="win31-button" @click="closeWindow(win.id)">OK</button>
                </div>
              </div>
            </div>
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

/* BIOS Screen */
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

/* Loading Screen */
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

/* Desktop Container */
.desktop-container {
  min-height: 100vh;
}

/* Window Page Content */
.window-page-content {
  height: 100%;
  overflow: auto;
}

/* Program Manager Content */
.program-manager-content {
  padding: 8px;
  height: 100%;
}

.pm-group {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #000 #000 #fff;
  height: 100%;
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

/* File Manager Content */
.file-manager-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fm-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.fm-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.fm-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.fm-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.fm-address {
  background: #c0c0c0;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
}

.fm-input {
  flex: 1;
  background: #fff;
  border: none;
  padding: 2px 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.fm-content {
  flex: 1;
  background: #fff;
  margin: 2px;
  overflow: auto;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.fm-header {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px;
  padding: 4px 8px;
  background: #c0c0c0;
  border-bottom: 2px solid;
  border-color: #fff #000 #000 #fff;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  position: sticky;
  top: 0;
}

.fm-list {
  padding: 4px;
}

.fm-item {
  display: grid;
  grid-template-columns: 24px 1fr 60px 80px;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.fm-item:hover {
  background: #000080;
  color: #fff;
}

/* Notepad Content */
.notepad-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.np-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.np-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.np-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.np-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.np-textarea {
  flex: 1;
  background: #fff;
  border: none;
  padding: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  resize: none;
  margin: 2px;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

/* Cardfile Content */
.cardfile-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cf-toolbar {
  background: #c0c0c0;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #808080;
}

.cf-btn {
  width: 24px;
  height: 22px;
  background: #c0c0c0;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.cf-btn:hover {
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #000;
}

.cf-separator {
  width: 2px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
  margin: 0 2px;
}

.cf-content {
  flex: 1;
  display: flex;
  background: #fff;
  margin: 2px;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.cf-index {
  width: 120px;
  border-right: 2px solid;
  border-color: #808080 #fff #fff #808080;
}

.cf-index-header {
  background: #c0c0c0;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
}

.cf-index-list {
  padding: 4px;
  overflow-y: auto;
}

.cf-index-item {
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.cf-index-item:hover,
.cf-index-item.active {
  background: #000080;
  color: #fff;
}

.cf-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
}

.cf-avatar {
  font-size: 48px;
}

.cf-info {
  text-align: center;
}

.cf-name {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.cf-desc {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
}

/* About Content */
.about-content {
  padding: 16px;
}

.about-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #808080;
}

.about-icon {
  font-size: 48px;
}

.about-name {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 18px;
}

.about-version,
.about-copyright {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
}

.about-group {
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  padding: 12px 8px 8px;
  margin: 12px 0;
  position: relative;
}

.about-group-title {
  position: absolute;
  top: -8px;
  left: 8px;
  background: #c0c0c0;
  padding: 0 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
}

.about-row {
  display: flex;
  gap: 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  margin-bottom: 4px;
}

.about-label {
  font-weight: bold;
  width: 80px;
}

.about-footer {
  text-align: center;
  margin-top: 16px;
}

.win31-button {
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  padding: 4px 16px;
  border: none;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 #000,
    inset 1px 1px 0 #fff,
    inset -2px -2px 0 #808080,
    inset 2px 2px 0 #dfdfdf;
}

.win31-button:active {
  box-shadow:
    inset 1px 1px 0 #000,
    inset -1px -1px 0 #fff;
}

/* Transitions */
.fade-enter-active { transition: opacity 0.3s; }
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
