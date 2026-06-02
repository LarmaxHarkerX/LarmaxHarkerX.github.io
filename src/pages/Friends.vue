<script setup lang="ts">
import { ref } from 'vue'
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TerminalPrompt from '../components/terminal/TerminalPrompt.vue'
import friendsData from '../data/friends.json'

interface Friend {
  name: string
  avatar: string
  description: string
  url: string
  color: string
}

const friends = ref<Friend[]>(friendsData)
</script>

<template>
  <div class="friends-page">
    <TerminalWindow title="~/friends">
      <!-- Header -->
      <div class="friends-header">
        <TerminalPrompt path="~/friends" />
        <span class="command">ls -la friends/</span>
      </div>
      
      <!-- Friends Grid -->
      <div class="friends-grid">
        <a 
          v-for="friend in friends" 
          :key="friend.name"
          :href="friend.url"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-card"
          :style="{ '--card-color': friend.color }"
        >
          <div class="card-avatar">
            <img :src="friend.avatar" :alt="friend.name" />
          </div>
          
          <div class="card-content">
            <h3 class="card-name">{{ friend.name }}</h3>
            <p class="card-description">{{ friend.description }}</p>
          </div>
          
          <div class="card-action">
            <span class="action-text">visit</span>
            <span class="action-arrow">→</span>
          </div>
        </a>
      </div>
      
      <!-- Summary -->
      <div class="friends-summary">
        <TerminalPrompt path="~/friends" />
        <span class="command">echo "共 {{ friends.length }} 个友情链接"</span>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.friends-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.friends-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.command {
  color: var(--terminal-fg);
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.friend-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--terminal-fg);
  transition: all var(--transition-fast);
}

.friend-card:hover {
  border-color: var(--card-color, var(--terminal-accent));
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--card-color, var(--terminal-border));
  flex-shrink: 0;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--terminal-fg);
  margin-bottom: var(--space-1);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--terminal-fg-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--card-color, var(--terminal-accent));
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.action-arrow {
  transition: transform var(--transition-fast);
}

.friend-card:hover .action-arrow {
  transform: translateX(4px);
}

.friends-summary {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--terminal-border);
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
  }
}
</style>