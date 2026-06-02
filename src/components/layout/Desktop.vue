<script setup lang="ts">
interface Props {
  showIcons?: boolean
}

withDefaults(defineProps<Props>(), {
  showIcons: true,
})
</script>

<template>
  <div class="win31-desktop">
    <!-- Desktop Icons -->
    <div v-if="showIcons" class="desktop-icons">
      <slot name="icons" />
    </div>
    
    <!-- Windows Container -->
    <div class="desktop-windows">
      <slot />
    </div>
    
    <!-- Taskbar -->
    <div class="win31-taskbar">
      <div class="taskbar-left">
        <slot name="taskbar-left" />
      </div>
      <div class="taskbar-right">
        <div class="taskbar-time">
          {{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win31-desktop {
  background: var(--win31-desktop);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.desktop-icons {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: var(--z-desktop);
}

.desktop-windows {
  flex: 1;
  padding: 8px;
  padding-bottom: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.win31-taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--win31-gray);
  border-top: 2px solid var(--win31-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  z-index: var(--z-window);
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.taskbar-time {
  font-family: var(--font-system);
  font-size: var(--text-sm);
  padding: 2px 8px;
  box-shadow: var(--bevel-inset);
}

/* Desktop Icon */
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  cursor: pointer;
  width: 64px;
  text-align: center;
}

.desktop-icon:hover {
  background: var(--win31-selection);
}

.desktop-icon:active {
  background: var(--win31-selection);
}

.desktop-icon-image {
  width: 32px;
  height: 32px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-icon-label {
  font-family: var(--font-system);
  font-size: var(--text-xs);
  color: var(--win31-white);
  text-shadow: 1px 1px 0 var(--win31-black);
  word-break: break-word;
  line-height: 1.2;
}

.desktop-icon:hover .desktop-icon-label {
  background: var(--win31-selection);
  color: var(--win31-selection-text);
  text-shadow: none;
  padding: 0 2px;
}

/* Taskbar Button */
.taskbar-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-family: var(--font-system);
  font-size: var(--text-sm);
  background: var(--win31-gray);
  border: none;
  cursor: pointer;
  box-shadow:
    inset -1px -1px 0 var(--win31-black),
    inset 1px 1px 0 var(--win31-white),
    inset -2px -2px 0 var(--win31-dark-gray),
    inset 2px 2px 0 var(--win31-light-gray);
  min-width: 100px;
  height: 22px;
}

.taskbar-button:active,
.taskbar-button--active {
  box-shadow:
    inset 1px 1px 0 var(--win31-black),
    inset -1px -1px 0 var(--win31-white);
}

.taskbar-button-icon {
  font-size: 14px;
}

.taskbar-button-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>