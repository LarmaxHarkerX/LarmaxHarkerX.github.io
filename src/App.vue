<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import LoadingScreen from './components/ui/LoadingScreen.vue'

const isLoading = ref(true)

const handleLoadingComplete = () => {
  isLoading.value = false
}
</script>

<template>
  <div class="app">
    <Transition name="loading">
      <LoadingScreen v-if="isLoading" @complete="handleLoadingComplete" />
    </Transition>
    
    <Transition name="page" mode="out-in">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </Transition>
  </div>
</template>

<style>
@import './assets/styles/main.css';
</style>

<style scoped>
.app {
  min-height: 100vh;
}

/* Loading transition */
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.5s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

/* Page transition */
.page-enter-active {
  transition: all 0.3s ease-out;
}

.page-leave-active {
  transition: all 0.2s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
