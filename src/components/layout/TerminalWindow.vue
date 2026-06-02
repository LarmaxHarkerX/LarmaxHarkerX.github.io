<script setup lang="ts">
interface Props {
  title?: string
  showDots?: boolean
  showScanlines?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '~/terminal',
  showDots: true,
  showScanlines: false,
})
</script>

<template>
  <div class="terminal-window" :class="{ 'scanlines': showScanlines }">
    <div class="terminal-header">
      <div v-if="showDots" class="terminal-dots">
        <span class="terminal-dot terminal-dot--red"></span>
        <span class="terminal-dot terminal-dot--yellow"></span>
        <span class="terminal-dot terminal-dot--green"></span>
      </div>
      <span class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.terminal-window {
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--terminal-shadow);
}

.terminal-header {
  background: var(--terminal-bg-secondary);
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--terminal-border);
  user-select: none;
}

.terminal-dots {
  display: flex;
  gap: var(--space-2);
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: opacity var(--transition-fast);
}

.terminal-dot:hover {
  opacity: 0.8;
}

.terminal-dot--red { background: var(--terminal-red); }
.terminal-dot--yellow { background: var(--terminal-yellow); }
.terminal-dot--green { background: var(--terminal-green); }

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--terminal-fg-muted);
}

.terminal-body {
  padding: var(--space-4);
  min-height: 200px;
}
</style>