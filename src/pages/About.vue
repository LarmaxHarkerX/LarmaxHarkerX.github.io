<script setup lang="ts">
import TerminalWindow from '../components/layout/TerminalWindow.vue'
import TerminalPrompt from '../components/terminal/TerminalPrompt.vue'

const skills = [
  { name: 'Vue.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'Python', level: 75 },
  { name: 'Docker', level: 70 },
  { name: 'Git', level: 95 },
]

const contacts = [
  { label: 'GitHub', value: 'github.com/larmax', url: 'https://github.com/larmax' },
  { label: 'Email', value: 'hello@larmax.dev', url: 'mailto:hello@larmax.dev' },
  { label: 'Twitter', value: '@larmax', url: 'https://twitter.com/larmax' },
]
</script>

<template>
  <div class="about-page">
    <TerminalWindow title="~/about">
      <!-- Header -->
      <div class="about-header">
        <TerminalPrompt path="~/about" />
        <span class="command">whoami</span>
      </div>
      
      <!-- User Info -->
      <div class="user-info">
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">LARMAX</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role:</span>
          <span class="info-value">Full Stack Developer</span>
        </div>
        <div class="info-row">
          <span class="info-label">Location:</span>
          <span class="info-value">Earth</span>
        </div>
        <div class="info-row">
          <span class="info-label">Bio:</span>
          <span class="info-value">Passionate developer who loves clean code and terminal aesthetics.</span>
        </div>
      </div>
      
      <!-- Skills -->
      <div class="skills-section">
        <TerminalPrompt path="~/about" />
        <span class="command">cat skills.json | jq</span>
        
        <div class="skills-list">
          <div v-for="skill in skills" :key="skill.name" class="skill-item">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div 
                class="skill-progress" 
                :style="{ width: `${skill.level}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact -->
      <div class="contact-section">
        <TerminalPrompt path="~/about" />
        <span class="command">cat contact.md</span>
        
        <div class="contact-list">
          <a 
            v-for="contact in contacts" 
            :key="contact.label"
            :href="contact.url"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
          >
            <span class="contact-label">{{ contact.label }}:</span>
            <span class="contact-value">{{ contact.value }}</span>
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="about-footer">
        <TerminalPrompt path="~/about" />
        <span class="command">echo "Thanks for visiting!"</span>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.about-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.command {
  color: var(--terminal-fg);
}

.user-info {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.info-row {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--terminal-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--terminal-accent);
  font-weight: 600;
  min-width: 80px;
}

.info-value {
  color: var(--terminal-fg);
}

.skills-section,
.contact-section {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--terminal-border);
}

.skills-list {
  margin-top: var(--space-4);
  padding-left: var(--space-6);
}

.skill-item {
  margin-bottom: var(--space-4);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.skill-name {
  color: var(--terminal-fg);
  font-weight: 500;
}

.skill-level {
  color: var(--terminal-accent);
  font-size: var(--text-sm);
}

.skill-bar {
  height: 8px;
  background: var(--terminal-bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--terminal-accent);
  border-radius: var(--radius-sm);
  transition: width 1s ease-out;
  box-shadow: 0 0 10px var(--terminal-glow);
}

.contact-list {
  margin-top: var(--space-4);
  padding-left: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  gap: var(--space-4);
  color: var(--terminal-fg);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-item:hover {
  color: var(--terminal-accent);
}

.contact-label {
  color: var(--terminal-accent);
  font-weight: 600;
  min-width: 80px;
}

.contact-value {
  color: var(--terminal-fg);
}

.about-footer {
  margin-top: var(--space-8);
  padding-top: var(--space-4);
  border-top: 1px solid var(--terminal-border);
}
</style>