<script setup lang="ts">
interface Props {
  user?: string
  host?: string
  path?: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  user: 'guest',
  host: 'blog',
  path: '~',
  color: 'var(--terminal-accent)',
})
</script>

<template>
  <span class="terminal-prompt">
    <span class="prompt-user" :style="{ color }">{{ user }}</span>
    <span class="prompt-separator">@</span>
    <span class="prompt-host" :style="{ color }">{{ host }}</span>
    <span class="prompt-separator">:</span>
    <span class="prompt-path">{{ path }}</span>
    <span class="prompt-symbol">$</span>
  </span>
</template>

<style scoped>
.terminal-prompt {
  font-family: var(--font-mono);
  user-select: none;
}

.prompt-user {
  font-weight: 600;
}

.prompt-separator {
  color: var(--terminal-fg-muted);
}

.prompt-host {
  font-weight: 600;
}

.prompt-path {
  color: var(--terminal-blue);
}

.prompt-symbol {
  color: var(--terminal-fg);
  margin-left: var(--space-1);
  margin-right: var(--space-2);
}
</style>