<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TypewriterText from '../components/terminal/TypewriterText.vue'

const welcomeText = 'Welcome to LARMAX Blog'
const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <div class="home-page">
    <TerminalWindow title="~/home">
      <div class="welcome-section">
        <TypewriterText :text="welcomeText" :speed="50" />
        
        <nav class="quick-nav">
          <router-link to="/blog" class="nav-command">
            <span class="prompt">ls</span> blog/
          </router-link>
          <router-link to="/shuoshuo" class="nav-command">
            <span class="prompt">cat</span> shuoshuo.md
          </router-link>
          <router-link to="/friends" class="nav-command">
            <span class="prompt">ls</span> friends/
          </router-link>
          <router-link to="/about" class="nav-command">
            <span class="prompt">whoami</span>
          </router-link>
        </nav>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.welcome-section {
  text-align: center;
  padding: var(--space-8) 0;
}

.quick-nav {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.nav-command {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--terminal-fg);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-command:hover {
  border-color: var(--terminal-accent);
  background: var(--terminal-bg-secondary);
}

.nav-command .prompt {
  color: var(--terminal-accent);
  margin-right: var(--space-2);
}
</style>