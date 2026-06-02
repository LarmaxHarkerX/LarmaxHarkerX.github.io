<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
</script>

<template>
  <div class="blog-list-page">
    <TerminalWindow title="~/blog">
      <h1>Blog Posts</h1>
      <p>Blog list will be implemented here.</p>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.blog-list-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>