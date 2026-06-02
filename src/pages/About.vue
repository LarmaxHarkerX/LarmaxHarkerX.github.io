<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
</script>

<template>
  <div class="about-page">
    <TerminalWindow title="~/about">
      <h1>About</h1>
      <p>About page will be implemented here.</p>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>