<script setup lang="ts">
import { useRouter } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'

const router = useRouter()

const handleOk = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <TerminalWindow 
      title="Error" 
      icon="⚠️"
      width="100%"
      :maxWidth="400"
    >
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-message">
          <p class="error-title">File Not Found</p>
          <p class="error-description">
            The page you are looking for does not exist or has been moved.
          </p>
          <p class="error-path">
            Path: {{ $route.path }}
          </p>
        </div>
        <div class="error-actions">
          <button class="win31-button win31-button--default" @click="handleOk">
            OK
          </button>
          <button class="win31-button" @click="router.back()">
            Cancel
          </button>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 36px);
  padding: 16px;
}

.error-content {
  padding: 16px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-message {
  margin-bottom: 16px;
}

.error-title {
  font-family: var(--font-system);
  font-weight: bold;
  font-size: var(--text-lg);
  margin-bottom: 8px;
}

.error-description {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  margin-bottom: 8px;
}

.error-path {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--win31-dark-gray);
  background: var(--win31-white);
  padding: 4px 8px;
  box-shadow: var(--bevel-inset);
  display: inline-block;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>