<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import Desktop from './components/layout/Desktop.vue'

const router = useRouter()
const route = useRoute()

const bootPhase = ref<'bios' | 'loading' | 'desktop'>('bios')
const biosLines = ref<string[]>([])
const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

// BIOS self-test messages
const biosMessages = [
  'Award Modular BIOS v4.51PG',
  'Copyright (C) 1984-93, Award Software, Inc.',
  '',
  'LARMAX BLOG BIOS v1.0',
  'Intel(R) Pentium(R) Processor 60MHz',
  '',
  'Memory Test:    16384K OK',
  '',
  'Award Plug and Play BIOS Extension v1.0A',
  'Copyright (C) 1993, Award Software, Inc.',
  '',
  'Detecting Primary Master  ... WDC AC2850F',
  'Detecting Primary Slave   ... None',
  'Detecting Secondary Master... ATAPI CD-ROM',
  'Detecting Secondary Slave ... None',
  '',
  'Starting Windows 3.1...',
]

onMounted(() => {
  // BIOS self-test animation
  let lineIndex = 0
  const biosInterval = setInterval(() => {
    if (lineIndex < biosMessages.length) {
      biosLines.value.push(biosMessages[lineIndex])
      lineIndex++
    } else {
      clearInterval(biosInterval)
      // Transition to Windows loading
      setTimeout(() => {
        bootPhase.value = 'loading'
        // Transition to desktop
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
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

const openWindow = (path: string) => {
  router.push(path)
}

const showStartMenu = ref(false)

const toggleStartMenu = () => {
  showStartMenu.value = !showStartMenu.value
}

const handleStartAction = (action: string) => {
  showStartMenu.value = false
  if (action === 'shutdown') {
    bootPhase.value = 'bios'
    biosLines.value = []
    router.push('/')
  } else {
    router.push(action)
  }
}
</script>

<template>
  <div class="app">
    <!-- BIOS Screen -->
    <Transition name="fade">
      <div v-if="bootPhase === 'bios'" class="bios-screen">
        <div class="bios-content">
          <div v-for="(line, index) in biosLines" :key="index" class="bios-line">
            {{ line }}
          </div>
          <span class="bios-cursor">_</span>
        </div>
      </div>
    </Transition>
    
    <!-- Windows Loading Screen -->
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
          @open="openWindow"
          @toggle-start="toggleStartMenu"
          @start-action="handleStartAction"
        >
          <!-- Desktop Icons -->
          <template #icons>
            <div class="desktop-icon" @dblclick="openWindow('/')">
              <div class="icon-image">📁</div>
              <div class="icon-label">Program<br>Manager</div>
            </div>
            <div class="desktop-icon" @dblclick="openWindow('/blog')">
              <div class="icon-image">📝</div>
              <div class="icon-label">File<br>Manager</div>
            </div>
            <div class="desktop-icon" @dblclick="openWindow('/shuoshuo')">
              <div class="icon-image">📋</div>
              <div class="icon-label">Notepad</div>
            </div>
            <div class="desktop-icon" @dblclick="openWindow('/friends')">
              <div class="icon-image">📇</div>
              <div class="icon-label">Cardfile</div>
            </div>
            <div class="desktop-icon" @dblclick="openWindow('/about')">
              <div class="icon-image">ℹ️</div>
              <div class="icon-label">About</div>
            </div>
          </template>
          
          <!-- Main Content (Windows) -->
          <RouterView v-slot="{ Component }">
            <Transition name="window" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
          
          <!-- Taskbar Windows -->
          <template #taskbar-windows>
            <button 
              v-if="route.path !== '/'" 
              class="taskbar-window-btn"
              @click="openWindow(route.path)"
            >
              <span class="window-icon">📝</span>
              <span class="window-title">{{ route.name }}</span>
            </button>
          </template>
        </Desktop>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  z-index: 9999;
}

.bios-content {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
}

.bios-line {
  white-space: pre;
}

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #008080;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

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
  margin-bottom: 4px;
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
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #000080;
  width: 0%;
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

/* Desktop Icons */
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

.desktop-icon:active {
  background: rgba(0, 0, 128, 0.5);
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
  color: #fff;
  text-shadow: none;
  padding: 2px 4px;
}

/* Taskbar Window Button */
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
  min-width: 120px;
  height: 22px;
}

.taskbar-window-btn:active {
  box-shadow:
    inset 1px 1px 0 #000,
    inset -1px -1px 0 #fff;
}

.window-icon {
  font-size: 14px;
}

.window-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transitions */
.fade-enter-active {
  transition: opacity 0.3s;
}

.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.window-enter-active {
  transition: all 0.2s ease-out;
}

.window-leave-active {
  transition: all 0.15s ease-in;
}

.window-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.window-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
