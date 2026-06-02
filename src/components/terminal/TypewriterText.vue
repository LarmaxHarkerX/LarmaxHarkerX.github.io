<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import gsap from 'gsap'

interface Props {
  text: string
  speed?: number
  delay?: number
  showCursor?: boolean
  onComplete?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  delay: 0,
  showCursor: true,
})

const emit = defineEmits<{
  complete: []
}>()

const displayText = ref('')
const isComplete = ref(false)
const cursorVisible = ref(true)

const startTyping = () => {
  displayText.value = ''
  isComplete.value = false
  
  const timeline = gsap.timeline({
    delay: props.delay,
    onComplete: () => {
      isComplete.value = true
      emit('complete')
      props.onComplete?.()
    },
  })

  // Typing animation
  timeline.to(displayText, {
    duration: props.text.length * (props.speed / 1000),
    value: props.text,
    ease: 'none',
  })

  // Cursor blink
  if (props.showCursor) {
    gsap.to(cursorVisible, {
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      value: false,
    })
  }
}

watch(() => props.text, startTyping)

onMounted(startTyping)
</script>

<template>
  <div class="typewriter">
    <span class="typewriter-text">{{ displayText }}</span>
    <span v-if="showCursor && !isComplete" class="cursor" :class="{ 'visible': cursorVisible }"></span>
  </div>
</template>

<style scoped>
.typewriter {
  display: inline;
  font-family: var(--font-mono);
}

.typewriter-text {
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background: var(--terminal-accent);
  vertical-align: text-bottom;
  margin-left: 2px;
  opacity: 0;
  transition: opacity 0.1s;
}

.cursor.visible {
  opacity: 1;
}
</style>