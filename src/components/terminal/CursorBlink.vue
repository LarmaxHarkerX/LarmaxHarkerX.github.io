<script setup lang="ts">
interface Props {
  char?: string
  color?: string
  speed?: number
}

withDefaults(defineProps<Props>(), {
  char: '█',
  color: 'var(--terminal-accent)',
  speed: 1000,
})
</script>

<template>
  <span class="cursor-blink" :style="{ color, animationDuration: `${speed}ms` }">{{ char }}</span>
</template>

<style scoped>
.cursor-blink {
  animation: blink 1s step-end infinite;
  user-select: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>