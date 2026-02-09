<script setup lang="ts">
import type { Mantra } from '~/types'
import { COLOR_SCHEMES } from '~/types'
import { useMantraStore } from '~/stores/mantras'
import { useSettingsStore } from '~/stores/settings'
import { useFonts } from '~/composables/useFonts'
import { POSTER_FONTS } from '~/data/font-catalog'

const emit = defineEmits<{ close: [] }>()

const mantraStore = useMantraStore()
const settings = useSettingsStore()
const { getFontFamily } = useFonts()

const tone = ref(0.5)
const currentText = ref('')
const loading = ref(false)
const error = ref('')

// Generate a preview mantra with random styling
const colorSchemes = Object.keys(COLOR_SCHEMES) as (keyof typeof COLOR_SCHEMES)[]
const previewFont = ref(POSTER_FONTS[Math.floor(Math.random() * POSTER_FONTS.length)])
const previewWeight = ref('900')
const previewColorScheme = ref(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])

const previewMantra = computed<Mantra>(() => ({
  id: 'preview',
  text: currentText.value || 'GENERATING...',
  createdAt: new Date().toISOString(),
  tone: tone.value,
  font: previewFont.value,
  fontWeight: previewWeight.value,
  colorScheme: previewColorScheme.value,
}))

function randomizeStyle() {
  previewFont.value = POSTER_FONTS[Math.floor(Math.random() * POSTER_FONTS.length)]
  previewWeight.value = ['700', '800', '900'][Math.floor(Math.random() * 3)]
  previewColorScheme.value = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
}

async function generateMantra() {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/generate-mantra', {
      method: 'POST',
      body: {
        tone: tone.value,
        liked: mantraStore.likedTexts,
        rejected: mantraStore.rejectedTexts,
      },
    })
    currentText.value = response.text
    randomizeStyle()
  } catch (e) {
    error.value = 'GENERATION FAILED. TRY AGAIN.'
    currentText.value = error.value
  } finally {
    loading.value = false
  }
}

function accept() {
  if (!currentText.value || currentText.value === error.value) return
  mantraStore.addMantra(
    currentText.value,
    tone.value,
    previewFont.value,
    previewWeight.value,
    previewColorScheme.value,
  )
  // Clear immediately so user sees loading state
  currentText.value = ''
  generateMantra()
}

function reject() {
  if (currentText.value && currentText.value !== error.value) {
    mantraStore.rejectText(currentText.value)
  }
  // Clear immediately so user sees loading state
  currentText.value = ''
  generateMantra()
}

// Swipe handling
let touchStartX = 0
let cardTranslateX = ref(0)
let cardRotation = ref(0)

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}

function onTouchMove(e: TouchEvent) {
  const dx = e.touches[0].clientX - touchStartX
  cardTranslateX.value = dx
  cardRotation.value = dx * 0.05
}

function onTouchEnd() {
  if (cardTranslateX.value > 80) {
    accept()
  } else if (cardTranslateX.value < -80) {
    reject()
  }
  cardTranslateX.value = 0
  cardRotation.value = 0
}

// Mouse drag for desktop
let dragging = false
let mouseStartX = 0

function onMouseDown(e: MouseEvent) {
  dragging = true
  mouseStartX = e.clientX
}

function onMouseMove(e: MouseEvent) {
  if (!dragging) return
  const dx = e.clientX - mouseStartX
  cardTranslateX.value = dx
  cardRotation.value = dx * 0.05
}

function onMouseUp() {
  if (!dragging) return
  dragging = false
  if (cardTranslateX.value > 80) {
    accept()
  } else if (cardTranslateX.value < -80) {
    reject()
  }
  cardTranslateX.value = 0
  cardRotation.value = 0
}

// Generate first mantra on mount
onMounted(() => {
  generateMantra()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

// Keyboard
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') accept()
  else if (e.key === 'ArrowLeft') reject()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="create-overlay" @click.self="emit('close')">
      <div class="create-overlay__content">
        <!-- Swipe card -->
        <div
          class="create-overlay__card-wrapper"
          :style="{
            transform: `translateX(${cardTranslateX}px) rotate(${cardRotation}deg)`,
            transition: cardTranslateX === 0 ? 'transform 0.3s ease' : 'none',
          }"
          @touchstart="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
        >
          <div class="create-overlay__card" :class="{ 'create-overlay__card--loading': loading }">
            <MantraCard :mantra="previewMantra" />
          </div>
        </div>

        <!-- Tone slider -->
        <div class="create-overlay__tone">
          <span class="create-overlay__tone-label">DYSTOPIAN</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="tone"
            class="create-overlay__tone-input"
          />
          <span class="create-overlay__tone-label">UTOPIAN</span>
        </div>

        <!-- Thumbs — same as PosterView -->
        <div class="create-overlay__actions">
          <button class="create-overlay__thumb create-overlay__thumb--down" @click="reject">
            👎
          </button>
          <button class="create-overlay__thumb create-overlay__thumb--up" @click="accept">
            👍
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.create-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.create-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 380px;
  padding: 16px;
}

.create-overlay__card-wrapper {
  width: 100%;
  cursor: grab;
  user-select: none;
}

.create-overlay__card-wrapper:active {
  cursor: grabbing;
}

.create-overlay__card {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.create-overlay__card--loading {
  animation: pulse 1.5s ease-in-out infinite;
}

.create-overlay__tone {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.create-overlay__tone-label {
  font-family: 'Cooper Hewitt', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

.create-overlay__tone-input {
  flex: 1;
  accent-color: #BBFF00;
}

.create-overlay__actions {
  display: flex;
  gap: 32px;
}

.create-overlay__thumb {
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-overlay__thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.create-overlay__thumb--down:hover {
  border-color: #ff4444;
}

.create-overlay__thumb--up:hover {
  border-color: #BBFF00;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
