<script setup lang="ts">
import { computed } from 'vue'
import { win3xIcons } from '../../modules/windows/icons'
import type { Win3xIconColor, Win3xIconKey } from '../../modules/windows/icons'

interface Props {
  name: Win3xIconKey
  size?: 'small' | 'medium' | 'large' | 'desktop' | 'splash'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  label: '',
})

const definition = computed(() => win3xIcons[props.name])

const palette: Record<Win3xIconColor, string> = {
  black: 'var(--win31-black)',
  white: 'var(--win31-white)',
  gray: 'var(--win31-gray)',
  lightGray: 'var(--win31-light-gray)',
  darkGray: 'var(--win31-dark-gray)',
  navy: 'var(--win31-navy)',
  red: 'var(--win31-red)',
  green: 'var(--win31-green)',
  blue: 'var(--win31-blue)',
  yellow: 'var(--win31-yellow)',
}

const sizeClass = computed(() => `win3x-icon--${props.size}`)

const ariaHidden = computed(() => (props.label ? 'false' : 'true'))
</script>

<template>
  <span class="win3x-icon" :class="sizeClass" :role="label ? 'img' : undefined" :aria-label="label || undefined" :aria-hidden="ariaHidden">
    <svg :viewBox="definition.viewBox" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <rect
        v-for="(rect, index) in definition.rects"
        :key="index"
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        :fill="palette[rect.color]"
      />
    </svg>
  </span>
</template>

<style scoped>
.win3x-icon {
  --win3x-icon-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--win3x-icon-size);
  height: var(--win3x-icon-size);
  flex-shrink: 0;
}

.win3x-icon svg {
  width: 100%;
  height: 100%;
}

.win3x-icon--small {
  --win3x-icon-size: 16px;
}

.win3x-icon--medium {
  --win3x-icon-size: 24px;
}

.win3x-icon--large {
  --win3x-icon-size: 32px;
}

.win3x-icon--desktop {
  --win3x-icon-size: 40px;
}

.win3x-icon--splash {
  --win3x-icon-size: 84px;
}
</style>
