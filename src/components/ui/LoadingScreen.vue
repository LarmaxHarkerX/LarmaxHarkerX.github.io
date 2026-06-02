<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

interface Props {
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
})

const emit = defineEmits<{
  complete: []
}>()

const loadingRef = ref<HTMLElement>()
const progress = ref(0)
const bootLines = ref<string[]>([])

const bootMessages = [
  'Initializing system...',
  'Loading kernel modules...',
  'Mounting file systems...',
  'Starting network services...',
  'Loading blog content...',
  'Initializing terminal interface...',
  'System ready.',
]

onMounted(() => {
  const timeline = gsap.timeline({
    onComplete: () => {
      emit('complete')
    },
  })

  // Boot sequence animation
  bootMessages.forEach((message, index) => {
    timeline.call(() => {
      bootLines.value.push(message)
      progress.value = ((index + 1) / bootMessages.length) * 100
    }, [], index * (props.duration / bootMessages.length / 1000))
  })

  // Fade out
  timeline.to(loadingRef.value, {
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
  })
})
</script>

<template>
  <div ref="loadingRef" class="loading-screen">
    <div class="loading-content">
      <div class="boot-sequence">
        <div v-for="(line, index) in bootLines" :key="index" class="boot-line">
          <span class="boot-prefix">&gt;</span>
          {{ line }}
        </div>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      
      <div class="loading-text">
        Loading... {{ Math.round(progress) }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--terminal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-loading);
}

.loading-content {
  max-width: 600px;
  width: 100%;
  padding: var(--space-8);
}

.boot-sequence {
  margin-bottom: var(--space-6);
}

.boot-line {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--terminal-fg);
  line-height: 1.8;
  animation: fadeIn 0.3s ease-out;
}

.boot-prefix {
  color: var(--terminal-accent);
  margin-right: var(--space-2);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--terminal-bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.progress-fill {
  height: 100%;
  background: var(--terminal-accent);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px var(--terminal-glow);
}

.loading-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--terminal-fg-muted);
  text-align: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>