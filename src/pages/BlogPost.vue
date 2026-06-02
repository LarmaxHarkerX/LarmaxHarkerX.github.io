<script setup lang="ts">
import { useRoute } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'

const route = useRoute()
</script>

<template>
  <div class="blog-post-page">
    <TerminalWindow :title="`~/blog/${route.params.slug}`">
      <h1>Blog Post: {{ route.params.slug }}</h1>
      <p>Blog post detail will be implemented here.</p>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.blog-post-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>