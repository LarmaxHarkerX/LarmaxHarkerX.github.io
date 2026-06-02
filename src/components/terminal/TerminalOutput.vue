<script setup lang="ts">
interface Props {
  lines: string[]
  maxHeight?: string
}

withDefaults(defineProps<Props>(), {
  maxHeight: '400px',
})
</script>

<template>
  <div class="terminal-output" :style="{ maxHeight }">
    <div v-for="(line, index) in lines" :key="index" class="output-line">
      {{ line }}
    </div>
  </div>
</template>

<style scoped>
.terminal-output {
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.8;
}

.output-line {
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--terminal-fg);
}

.output-line::before {
  content: '> ';
  color: var(--terminal-fg-muted);
}
</style>