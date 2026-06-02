<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TerminalPrompt from '../components/terminal/TerminalPrompt.vue'
import TypewriterText from '../components/terminal/TypewriterText.vue'
import CursorBlink from '../components/terminal/CursorBlink.vue'
import SearchBar from '../components/ui/SearchBar.vue'
import { useSEO } from '../composables/useSEO'

useSEO({
  title: 'LARMAX Blog',
  description: 'A terminal-style blog for developers - Welcome to my digital space',
})

const welcomeText = 'Welcome to LARMAX Blog'
const subtitleText = 'A terminal-style blog for developers'
const isLoaded = ref(false)
const showNav = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 500)
  
  setTimeout(() => {
    showNav.value = true
  }, 1500)
})

const handleTypingComplete = () => {
  // Typing animation completed
}
</script>

<template>
  <div class="home-page">
    <TerminalWindow title="~/home">
      <div class="welcome-section">
        <!-- ASCII Art Logo -->
        <pre class="ascii-logo">
 _     _____ ____  __  __   _    ____   ___  
| |   |  _  |  _ \|  \/  | / \  | __ ) / _ \ 
| |   | | | | |_) | |\/| |/ _ \ |  _ \| | | |
| |___| |_| |  _ <| |  | / ___ \| |_) | |_| |
|_____|_____|_| \_\_|  |_/_/   \_\____/ \___/ 
        </pre>
        
        <!-- Welcome Message -->
        <div class="welcome-message">
          <TerminalPrompt path="~" />
          <TypewriterText 
            :text="welcomeText" 
            :speed="50" 
            @complete="handleTypingComplete"
          />
        </div>
        
        <!-- Subtitle -->
        <div class="subtitle">
          <TerminalPrompt path="~" />
          <span class="text-muted">{{ subtitleText }}</span>
          <CursorBlink />
        </div>
        
        <!-- Search Bar -->
        <div class="search-section">
          <SearchBar />
        </div>
        
        <!-- Navigation Commands -->
        <Transition name="fade-up">
          <nav v-if="showNav" class="quick-nav">
            <router-link to="/blog" class="nav-command">
              <span class="command-icon">📁</span>
              <span class="prompt">ls</span> blog/
              <span class="description">// View blog posts</span>
            </router-link>
            
            <router-link to="/shuoshuo" class="nav-command">
              <span class="command-icon">💬</span>
              <span class="prompt">cat</span> shuoshuo.md
              <span class="description">// Read my thoughts</span>
            </router-link>
            
            <router-link to="/friends" class="nav-command">
              <span class="command-icon">👥</span>
              <span class="prompt">ls</span> friends/
              <span class="description">// Check friend links</span>
            </router-link>
            
            <router-link to="/about" class="nav-command">
              <span class="command-icon">👤</span>
              <span class="prompt">whoami</span>
              <span class="description">// Learn about me</span>
            </router-link>
          </nav>
        </Transition>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.welcome-section {
  padding: var(--space-6) 0;
}

.ascii-logo {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--terminal-accent);
  text-align: center;
  margin-bottom: var(--space-8);
  line-height: 1.2;
  white-space: pre;
  overflow-x: auto;
}

.welcome-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: var(--text-lg);
}

.subtitle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  color: var(--terminal-fg-muted);
}

.search-section {
  margin-bottom: var(--space-6);
}

.quick-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.nav-command {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--terminal-fg);
  text-decoration: none;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-command:hover {
  border-color: var(--terminal-accent);
  background: var(--terminal-bg-secondary);
  transform: translateX(5px);
}

.command-icon {
  font-size: var(--text-lg);
}

.nav-command .prompt {
  color: var(--terminal-accent);
  font-weight: 600;
}

.description {
  color: var(--terminal-fg-muted);
  font-size: var(--text-sm);
  margin-left: auto;
}

/* Fade up transition */
.fade-up-enter-active {
  transition: all 0.5s ease-out;
}

.fade-up-leave-active {
  transition: all 0.3s ease-in;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .ascii-logo {
    font-size: 0.6rem;
  }
  
  .description {
    display: none;
  }
}
</style>