<script setup lang="ts">
import Win3xIcon from '../shared/Win3xIcon.vue'

const emit = defineEmits<{
  close: []
}>()

const skills = [
  { name: 'Blender', level: 85 },
  { name: 'After Effects', level: 80 },
  { name: 'Reaper', level: 75 },
  { name: 'Photoshop', level: 90 },
  { name: 'Vegas', level: 70 },
]
</script>

<template>
  <div class="about-content">
    <!-- Header -->
    <div class="about-header">
      <div class="about-icon">
        <Win3xIcon name="computer" size="large" label="LARMAX Blog" />
      </div>
      <div class="about-info">
        <div class="about-name">LARMAX Desktop Blog</div>
        <div class="about-version">Shell Version 3.1</div>
        <div class="about-copyright">Built for GitHub Pages</div>
      </div>
    </div>
    
    <!-- System Info -->
    <div class="about-group">
      <div class="about-group-title">System Information</div>
      <div class="about-row">
        <span class="about-label">Owner:</span>
        <span>LARMAX</span>
      </div>
      <div class="about-row">
        <span class="about-label">Role:</span>
        <span>Writer / Tinkerer</span>
      </div>
      <div class="about-row">
        <span class="about-label">Location:</span>
        <span>Web Desktop</span>
      </div>
    </div>
    
    <!-- Skills -->
    <div class="about-group">
      <div class="about-group-title">Skills</div>
      <div v-for="skill in skills" :key="skill.name" class="skill-row">
        <span class="skill-name">{{ skill.name }}</span>
        <div class="skill-bar">
          <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
        </div>
        <span class="skill-level">{{ skill.level }}%</span>
      </div>
    </div>
    
    <!-- Memory -->
    <div class="about-group">
      <div class="about-group-title">Memory</div>
      <div class="memory-text">Physical Memory: 640K OK</div>
      <div class="memory-bar">
        <div class="memory-fill"></div>
      </div>
    </div>
    
    <!-- OK Button -->
    <div class="about-footer">
      <button type="button" class="about-btn win31-button win31-button--default" @click="emit('close')">OK</button>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.about-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #808080;
}

.about-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #fff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.about-name {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-weight: bold;
  font-size: 18px;
}

.about-version,
.about-copyright {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
}

.about-group {
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  padding: 12px 8px 8px;
  margin: 12px 0;
  position: relative;
}

.about-group-title {
  position: absolute;
  top: -8px;
  left: 8px;
  background: #c0c0c0;
  padding: 0 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
}

.about-row {
  display: flex;
  gap: 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  margin-bottom: 4px;
}

.about-label {
  font-weight: bold;
  width: 80px;
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.skill-name {
  width: 100px;
}

.skill-bar {
  flex: 1;
  height: 16px;
  background: #fff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.skill-fill {
  height: 100%;
  background: #000080;
}

.skill-level {
  width: 40px;
  text-align: right;
}

.memory-text {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  margin-bottom: 4px;
}

.memory-bar {
  height: 16px;
  background: #fff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;
}

.memory-fill {
  height: 100%;
  width: 45%;
  background: repeating-linear-gradient(
    90deg,
    #000080 0px,
    #000080 8px,
    transparent 8px,
    transparent 10px
  );
}

.about-footer {
  text-align: center;
  margin-top: 16px;
}

.about-btn {
  min-width: 84px;
}
</style>
