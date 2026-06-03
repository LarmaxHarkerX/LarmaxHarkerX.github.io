<script setup lang="ts">
interface Props {
  lines: string[]
  prompt: string
}

defineProps<Props>()
</script>

<template>
  <div class="boot-bsod">
    <div class="boot-bsod__viewport">
      <div class="boot-bsod__stage" aria-label="Blue screen of death">
        <div class="boot-bsod__badge">Windows</div>

        <div class="boot-bsod__body">
          <div v-for="(line, index) in lines" :key="`${index}-${line}`" class="boot-bsod__line">{{ line }}</div>
        </div>

        <div class="boot-bsod__prompt">{{ prompt }}<span class="boot-bsod__cursor">_</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boot-bsod {
  position: fixed;
  inset: 0;
  background: var(--bsod-blue);
  z-index: var(--z-loading);
  overflow: hidden;
}

.boot-bsod__viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(18px, 3vw, 28px);
}

.boot-bsod__stage {
  width: min(92vw, 68ch);
  color: var(--bsod-white);
  font-family: var(--font-boot-terminal);
  font-size: clamp(16px, 1.8vw, 22px);
  line-height: 1.12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(18px, 3vw, 28px);
  text-rendering: geometricPrecision;
}

.boot-bsod__badge {
  align-self: center;
  background: var(--bsod-chip);
  color: var(--bsod-blue);
  font-family: var(--font-boot-ui);
  font-size: clamp(14px, 1.35vw, 18px);
  padding: 2px 10px;
}

.boot-bsod__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.05em;
  white-space: pre-wrap;
}

.boot-bsod__line {
  text-align: left;
}

.boot-bsod__prompt {
  align-self: center;
  white-space: pre;
}

.boot-bsod__cursor {
  animation: boot-bsod-blink 0.7s step-end infinite;
}

@keyframes boot-bsod-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 640px) {
  .boot-bsod__stage {
    width: 88vw;
    font-size: clamp(14px, 3.8vw, 18px);
  }
}
</style>
