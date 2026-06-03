<script setup lang="ts">
interface Props {
  status: string
  progress: number
  log: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="boot-splash">
    <div class="boot-splash__viewport">
      <div class="boot-splash__stage">
        <div class="boot-splash__mark">LARMAX <span>3.0</span></div>
        <div class="boot-splash__tagline">Desktop Shell in Motion</div>

        <div class="boot-splash__status">{{ status }}...</div>

        <div class="boot-splash__footer">
          <div class="boot-splash__copyright">Copyright (C) 2026 LARMAX. All rights reserved.</div>
          <div class="boot-splash__progress">{{ progress }}% complete</div>
          <div v-if="log.length > 0" class="boot-splash__log">{{ log.at(-1) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boot-splash {
  position: fixed;
  inset: 0;
  background: var(--splash-blue);
  z-index: var(--z-loading);
  overflow: hidden;
}

.boot-splash__viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.boot-splash__stage {
  width: min(100%, calc((100vh - 2rem) * 1.6));
  max-width: 100%;
  aspect-ratio: 284 / 177;
  color: var(--splash-white);
  display: grid;
  grid-template-rows: 1fr auto auto 1fr auto;
  justify-items: center;
  padding: clamp(18px, 4vw, 30px) clamp(14px, 4vw, 24px) clamp(16px, 4vw, 24px);
}

.boot-splash__mark {
  align-self: center;
  font-family: var(--font-boot-wordmark);
  font-size: clamp(34px, 7.5vw, 68px);
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.9;
  text-align: center;
  transform: skewX(-8deg) scaleX(1.04);
}

.boot-splash__mark span {
  display: inline-block;
  margin-left: 0.18em;
  font-size: 0.78em;
}

.boot-splash__tagline {
  font-family: var(--font-boot-ui);
  font-size: clamp(10px, 1.6vw, 14px);
  margin-top: clamp(4px, 1vw, 8px);
}

.boot-splash__status {
  align-self: start;
  font-family: var(--font-boot-terminal);
  font-size: clamp(10px, 1.7vw, 14px);
  text-align: center;
  margin-top: clamp(12px, 3vw, 24px);
}

.boot-splash__footer {
  align-self: end;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  font-family: var(--font-boot-ui);
  font-size: clamp(8px, 1.3vw, 11px);
  line-height: 1.25;
}

.boot-splash__progress,
.boot-splash__log {
  opacity: 0.92;
}

@media (max-width: 640px) {
  .boot-splash__stage {
    width: 100%;
    min-height: 100%;
    padding-top: 18vh;
    padding-bottom: 10vh;
  }
}
</style>
