<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
</script>

<template>
  <div class="shuoshuo-page">
    <TerminalWindow title="~/shuoshuo">
      <h1>说说</h1>
      <p>Shuoshuo (tweet-like) page will be implemented here.</p>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.shuoshuo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>