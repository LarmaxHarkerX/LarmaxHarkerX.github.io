<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
</script>

<template>
  <div class="friends-page">
    <TerminalWindow title="~/friends">
      <h1>Friends</h1>
      <p>Friends page will be implemented here.</p>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.friends-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>