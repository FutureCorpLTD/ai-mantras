<script setup lang="ts">
import type { Mantra } from '~/types'
import { useMantraStore } from '~/stores/mantras'
import { useSettingsStore } from '~/stores/settings'

const props = defineProps<{
  mantra: Mantra
}>()

const emit = defineEmits<{
  close: []
  navigate: [mantra: Mantra]
}>()

const mantraStore = useMantraStore()
const settings = useSettingsStore()

const currentIndex = computed(() =>
  mantraStore.sorted.findIndex(m => m.id === props.mantra.id)
)

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < mantraStore.sorted.length - 1)

function goPrev() {
  if (hasPrev.value) emit('navigate', mantraStore.sorted[currentIndex.value - 1])
}

function goNext() {
  if (hasNext.value) emit('navigate', mantraStore.sorted[currentIndex.value + 1])
}

function handleDelete() {
  const nextMantra = hasNext.value
    ? mantraStore.sorted[currentIndex.value + 1]
    : hasPrev.value
      ? mantraStore.sorted[currentIndex.value - 1]
      : null
  mantraStore.removeMantra(props.mantra.id)
  nextMantra ? emit('navigate', nextMantra) : emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') goPrev()
  else if (e.key === 'ArrowRight') goNext()
  else if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 60) dx > 0 ? goPrev() : goNext()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="poster-view"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div class="poster-view__header">
        <button class="poster-view__btn poster-view__btn--delete" @click="handleDelete">
          <span class="material-symbols-outlined">delete</span>
        </button>
        <button class="poster-view__btn poster-view__btn--close" @click="emit('close')">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="poster-view__content">
        <button
          v-if="hasPrev"
          class="poster-view__nav poster-view__nav--prev"
          @click="goPrev"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <!-- Give MantraCard a concrete width — it needs this for the reference canvas -->
        <div class="poster-view__card">
          <MantraCard :mantra="mantra" />
        </div>

        <button
          v-if="hasNext"
          class="poster-view__nav poster-view__nav--next"
          @click="goNext"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.poster-view {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.poster-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  flex-shrink: 0;
}

.poster-view__btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  padding: 4px;
}

.poster-view__btn:hover { color: white; }
.poster-view__btn--delete .material-symbols-outlined { color: #ff4444; }

.poster-view__content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px 16px;
  min-height: 0;
}

/* The card wrapper gives MantraCard a concrete width for the reference canvas */
.poster-view__card {
  width: 100%;
  max-width: 500px;
}

.poster-view__nav {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: color 0.15s;
  padding: 16px 8px;
  flex-shrink: 0;
}

.poster-view__nav:hover { color: rgba(255, 255, 255, 0.7); }
.poster-view__nav .material-symbols-outlined { font-size: 36px; }

@media (max-width: 768px) {
  .poster-view__nav { display: none; }
}
</style>
