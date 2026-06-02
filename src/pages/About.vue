<script setup lang="ts">
import { useRouter } from 'vue-router'
import TerminalWindow from '../components/layout/TerminalWindow.vue'

const router = useRouter()

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

const handleOk = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-page">
    <TerminalWindow 
      title="About Program" 
      icon="ℹ️"
      width="100%"
      :maxWidth="500"
    >
      <div class="about-content">
        <!-- Program Icon -->
        <div class="about-header">
          <div class="program-icon">💻</div>
          <div class="program-info">
            <div class="program-name">LARMAX Blog</div>
            <div class="program-version">Version 1.0</div>
            <div class="program-copyright">Copyright © 2024</div>
          </div>
        </div>
        
        <!-- System Info -->
        <div class="win31-groupbox">
          <div class="win31-groupbox-title">System Information</div>
          <div class="system-info">
            <div class="info-row">
              <span class="info-label">Owner:</span>
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
              <span class="info-label">Blog:</span>
              <span class="info-value">Terminal Style</span>
            </div>
          </div>
        </div>
        
        <!-- Skills -->
        <div class="win31-groupbox">
          <div class="win31-groupbox-title">Skills</div>
          <div class="skills-list">
            <div v-for="skill in skills" :key="skill.name" class="skill-row">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-bar">
                <div 
                  class="skill-fill" 
                  :style="{ width: `${skill.level}%` }"
                ></div>
              </div>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
          </div>
        </div>
        
        <!-- Contact -->
        <div class="win31-groupbox">
          <div class="win31-groupbox-title">Contact</div>
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
        
        <!-- Memory Info -->
        <div class="memory-info">
          <div class="memory-text">
            Physical Memory: 640K OK
          </div>
          <div class="memory-bar">
            <div class="memory-fill" style="width: 45%"></div>
          </div>
        </div>
        
        <!-- OK Button -->
        <div class="about-footer">
          <button class="win31-button win31-button--default" @click="handleOk">
            OK
          </button>
        </div>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 36px);
  padding: 16px;
}

.about-content {
  padding: 16px;
}

.about-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--win31-dark-gray);
}

.program-icon {
  width: 48px;
  height: 48px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-info {
  flex: 1;
}

.program-name {
  font-family: var(--font-system);
  font-weight: bold;
  font-size: var(--text-xl);
  margin-bottom: 4px;
}

.program-version,
.program-copyright {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  color: var(--win31-dark-gray);
}

.win31-groupbox {
  border: 2px solid;
  border-color: var(--win31-dark-gray) var(--win31-white) 
                var(--win31-white) var(--win31-dark-gray);
  padding: 12px 8px 8px;
  margin: 12px 0;
  position: relative;
}

.win31-groupbox-title {
  position: absolute;
  top: -8px;
  left: 8px;
  background: var(--win31-gray);
  padding: 0 4px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  font-weight: bold;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
}

.info-label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
}

.skill-name {
  width: 80px;
  flex-shrink: 0;
}

.skill-bar {
  flex: 1;
  height: 16px;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--win31-selection);
  transition: width 0.5s;
}

.skill-level {
  width: 40px;
  text-align: right;
  flex-shrink: 0;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  gap: 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  color: var(--win31-black);
  text-decoration: none;
}

.contact-item:hover {
  color: var(--win31-navy);
}

.contact-label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0;
}

.contact-value {
  color: var(--win31-navy);
  text-decoration: underline;
}

.memory-info {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--win31-dark-gray);
}

.memory-text {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  margin-bottom: 4px;
}

.memory-bar {
  height: 16px;
  background: var(--win31-white);
  box-shadow: var(--bevel-inset);
  overflow: hidden;
}

.memory-fill {
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--win31-selection) 0px,
    var(--win31-selection) 8px,
    transparent 8px,
    transparent 10px
  );
}

.about-footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--win31-dark-gray);
}

@media (max-width: 480px) {
  .about-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-row,
  .skill-row,
  .contact-item {
    flex-direction: column;
    gap: 2px;
  }
  
  .info-label,
  .skill-name,
  .contact-label {
    width: auto;
  }
  
  .skill-bar {
    width: 100%;
  }
}
</style>