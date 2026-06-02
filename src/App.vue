<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Desktop from './components/layout/Desktop.vue'

const router = useRouter()
const isLoading = ref(true)
const currentTime = ref('')

onMounted(() => {
  // Simulate boot sequence
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
  
  // Update time
  updateTime()
  setInterval(updateTime, 60000)
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="app">
    <!-- Loading Screen -->
    <Transition name="loading">
      <div v-if="isLoading" class="boot-screen">
        <div class="boot-content">
          <div class="boot-logo">
            <pre class="boot-text">
Microsoft Windows
Version 3.1
            </pre>
          </div>
          <div class="boot-progress">
            <div class="boot-progress-bar"></div>
          </div>
          <div class="boot-status">Starting Windows...</div>
        </div>
      </div>
    </Transition>
    
    <!-- Desktop -->
    <Desktop v-if="!isLoading">
      <!-- Desktop Icons -->
      <template #icons>
        <div class="desktop-icon" @dblclick="navigateTo('/')">
          <div class="desktop-icon-image">📁</div>
          <div class="desktop-icon-label">Program Manager</div>
        </div>
        <div class="desktop-icon" @dblclick="navigateTo('/blog')">
          <div class="desktop-icon-image">📝</div>
          <div class="desktop-icon-label">File Manager</div>
        </div>
        <div class="desktop-icon" @dblclick="navigateTo('/about')">
          <div class="desktop-icon-image">ℹ️</div>
          <div class="desktop-icon-label">About</div>
        </div>
      </template>
      
      <!-- Main Content -->
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      
      <!-- Taskbar -->
      <template #taskbar-left>
        <button class="taskbar-button" @click="navigateTo('/')">
          <span class="taskbar-button-icon">📁</span>
          <span class="taskbar-button-label">Program Manager</span>
        </button>
        <button 
          v-if="$route.path !== '/'" 
          class="taskbar-button"
          @click="navigateTo($route.path)"
        >
          <span class="taskbar-button-icon">📝</span>
          <span class="taskbar-button-label">{{ $route.name }}</span>
        </button>
      </template>
    </Desktop>
  </div>
</template>

<style>
@import './assets/styles/main.css';
</style>

<style scoped>
.app {
  min-height: 100vh;
}

/* Boot Screen */
.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--win31-desktop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-loading);
}

.boot-content {
  text-align: center;
}

.boot-logo {
  margin-bottom: 24px;
}

.boot-text {
  font-family: var(--font-pixel);
  font-size: 24px;
  color: var(--win31-white);
  text-shadow: 2px 2px 0 var(--win31-black);
  line-height: 1.4;
  white-space: pre;
}

.boot-progress {
  width: 200px;
  height: 16px;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  margin: 0 auto 8px;
  overflow: hidden;
}

.boot-progress-bar {
  height: 100%;
  background: var(--win31-selection);
  width: 0%;
  animation: bootProgress 1.5s ease-out forwards;
}

@keyframes bootProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.boot-status {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  color: var(--win31-white);
  text-shadow: 1px 1px 0 var(--win31-black);
}

/* Page Transition */
.page-enter-active {
  transition: opacity 0.2s;
}

.page-leave-active {
  transition: opacity 0.1s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Loading Transition */
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.3s;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>
