<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  lines: string[]
}

const props = defineProps<Props>()

const promptLine = computed(() => {
  const lastLine = props.lines.at(-1) ?? ''
  return lastLine.includes('>') ? lastLine : 'C:\\>WIN'
})

const logLines = computed(() => {
  if (props.lines.length === 0) {
    return []
  }

  return promptLine.value === props.lines.at(-1)
    ? props.lines.slice(0, -1)
    : props.lines
})
</script>

<template>
  <div class="boot-bios">
    <div class="boot-bios__viewport">
      <div class="boot-bios__stage">
        <header class="boot-bios__header">
          <div class="boot-bios__brand">LARMAX</div>
          <div class="boot-bios__subtitle">System Initialization Utility</div>
          <div class="boot-bios__badge">486 BIOS ROM</div>
        </header>

        <div class="boot-bios__rule"></div>

        <section class="boot-bios__log" aria-label="BIOS boot log">
          <div v-for="(line, index) in logLines" :key="`${line}-${index}`" class="boot-bios__line">{{ line }}</div>
        </section>

        <div class="boot-bios__spacer"></div>

        <footer class="boot-bios__prompt" aria-label="BIOS prompt">
          <span class="boot-bios__prompt-text">{{ promptLine }}</span>
          <span class="boot-bios__cursor">_</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boot-bios {
  position: fixed;
  inset: 0;
  background: var(--boot-black);
  z-index: var(--z-loading);
  overflow: hidden;
}

.boot-bios__viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: clamp(12px, 2vw, 20px);
}

.boot-bios__stage {
  position: relative;
  width: min(100%, calc((100vh - 2rem) * 1.68));
  max-width: 100%;
  aspect-ratio: 734 / 437;
  color: var(--boot-amber);
  font-family: var(--font-boot-terminal);
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 3.2vw, 30px) clamp(18px, 3.6vw, 32px);
}

.boot-bios__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: end;
  gap: clamp(8px, 2vw, 16px);
  color: var(--boot-amber-bright);
}

.boot-bios__brand {
  font-size: clamp(26px, 5.2vw, 44px);
  font-family: var(--font-boot-ui);
  font-weight: 400;
  letter-spacing: 0.18em;
  line-height: 0.95;
}

.boot-bios__subtitle,
.boot-bios__badge {
  font-size: clamp(9px, 1.4vw, 13px);
  font-family: var(--font-boot-ui);
  line-height: 1.2;
  white-space: nowrap;
}

.boot-bios__subtitle {
  justify-self: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.boot-bios__badge {
  justify-self: end;
}

.boot-bios__rule {
  height: 1px;
  background: var(--boot-amber-dim);
  margin: clamp(10px, 1.8vw, 14px) 0 clamp(16px, 2.4vw, 20px);
}

.boot-bios__log {
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.55vw, 4px);
  font-size: clamp(11px, 1.45vw, 14px);
  line-height: 1.22;
  white-space: pre;
  letter-spacing: 0.02em;
  text-shadow: 0 0 2px rgba(255, 188, 64, 0.12);
}

.boot-bios__line {
  min-height: 1.2em;
}

.boot-bios__spacer {
  flex: 1;
}

.boot-bios__prompt {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: clamp(12px, 1.6vw, 16px);
  font-family: var(--font-boot-terminal);
  white-space: pre;
  color: var(--boot-amber-bright);
}

.boot-bios__cursor {
  animation: boot-bios-blink 0.65s step-end infinite;
}

@keyframes boot-bios-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 640px) {
  .boot-bios__header {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .boot-bios__subtitle,
  .boot-bios__badge {
    justify-self: start;
  }

  .boot-bios__stage {
    width: 100%;
  }
}
</style>
