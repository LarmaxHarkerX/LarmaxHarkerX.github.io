<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
</script>

<template>
  <div class="not-found-page">
    <TerminalWindow title="~/404">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <router-link to="/" class="back-link">
        <span class="prompt">cd</span> ~
      </router-link>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.not-found-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: var(--space-4);
  font-family: var(--font-mono);
  color: var(--terminal-accent);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.back-link .prompt {
  color: var(--terminal-accent);
  margin-right: var(--space-2);
}
</style>