<script setup lang="ts">
import { ref } from 'vue'
import TerminalPrompt from './TerminalPrompt.vue'

interface Props {
  user?: string
  host?: string
  path?: string
  commands?: string[]
  onSubmit?: (command: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  user: 'guest',
  host: 'blog',
  path: '~',
  commands: () => [],
})

const emit = defineEmits<{
  submit: [command: string]
}>()

const input = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)

const handleSubmit = () => {
  const command = input.value.trim()
  if (command) {
    history.value.push(command)
    historyIndex.value = history.value.length
    emit('submit', command)
    props.onSubmit?.(command)
    input.value = ''
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      input.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      input.value = history.value[historyIndex.value]
    } else {
      historyIndex.value = history.value.length
      input.value = ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const match = props.commands.find(cmd => cmd.startsWith(input.value))
    if (match) {
      input.value = match
    }
  }
}
</script>

<template>
  <div class="command-line">
    <TerminalPrompt :user="user" :host="host" :path="path" />
    <input
      v-model="input"
      type="text"
      class="command-input"
      autofocus
      spellcheck="false"
      autocomplete="off"
      @keydown.enter="handleSubmit"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style scoped>
.command-line {
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--terminal-fg);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  outline: none;
  caret-color: var(--terminal-accent);
}

.command-input::placeholder {
  color: var(--terminal-fg-muted);
}
</style>