<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="info-overlay" @click="onBackdrop">
      <div class="info-overlay__panel">
        <button class="info-overlay__close" @click="emit('close')">&times;</button>

        <h2 class="info-overlay__title">AI MANTRAS</h2>

        <p class="info-overlay__text">
          Short, punchy typographic slogans about AI, creativity,
          and the future of work.
        </p>

        <p class="info-overlay__text">
          Inspired by Jenny Holzer's Truisms, Douglas Coupland's
          slogans, and Anthony Burrill's typographic prints.
        </p>

        <p class="info-overlay__text">
          Your collection and design changes are saved in your
          browser and not visible to anyone else.
        </p>

        <p class="info-overlay__text">
          Liking and disliking mantras helps the AI learn your
          taste and generate better results.
        </p>

        <p class="info-overlay__credit">
          Built by <a href="https://www.instagram.com/marckremers/" target="_blank" rel="noopener">Marc Kremers</a>
        </p>

        <div class="info-overlay__links">
          <a href="https://github.com/FutureCorpLTD/ai-mantras" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.info-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.info-overlay__panel {
  background: rgba(20, 20, 20, 0.95);
  color: white;
  width: 100%;
  max-width: 400px;
  height: 100%;
  padding: 48px 32px;
  animation: slideInLeft 0.3s ease;
  overflow-y: auto;
}

.info-overlay__close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.info-overlay__close:hover { opacity: 1; }

.info-overlay__title {
  font-family: 'Cooper Hewitt', sans-serif;
  font-weight: 900;
  font-size: 28px;
  letter-spacing: 0.1em;
  margin: 0 0 24px;
}

.info-overlay__text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 16px;
}

.info-overlay__credit {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 32px 0 16px;
}

.info-overlay__credit a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: underline;
}

.info-overlay__credit a:hover {
  color: white;
}

.info-overlay__links {
  display: flex;
  gap: 16px;
}

.info-overlay__links a {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #BBFF00;
  text-decoration: none;
}

.info-overlay__links a:hover {
  text-decoration: underline;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
</style>
