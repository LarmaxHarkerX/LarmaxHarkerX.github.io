<script setup lang="ts">
import Win3xIcon from '../shared/Win3xIcon.vue'
import { desktopPrograms } from '../../modules/windows/registry'

const emit = defineEmits<{
  open: [action: string]
}>()
</script>

<template>
  <div class="program-manager">
    <div class="pm-grid">
      <div 
        v-for="program in desktopPrograms.filter((entry) => entry.action !== '/')" 
        :key="program.id"
        class="pm-icon"
        @dblclick="emit('open', program.action)"
      >
        <div class="pm-icon-img">
          <Win3xIcon :name="program.icon" size="large" :label="program.menuLabel" />
        </div>
        <div class="pm-icon-label">{{ program.menuLabel }}</div>
      </div>
    </div>
    <div class="pm-status">
      <span>Double-click an icon to open</span>
    </div>
  </div>
</template>

<style scoped>
.program-manager {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.pm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #c0c0c0;
}

.pm-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  cursor: pointer;
  user-select: none;
}

.pm-icon:hover {
  background: #000080;
}

.pm-icon-img {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pm-icon-label {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  text-align: center;
  padding: 2px 4px;
}

.pm-icon:hover .pm-icon-label {
  color: #fff;
}

.pm-status {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #808080;
  margin-top: auto;
}
</style>
