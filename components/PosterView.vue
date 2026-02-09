<script setup lang="ts">
import type { Mantra } from '~/types'
import { useMantraStore } from '~/stores/mantras'

const props = defineProps<{
  mantra: Mantra
}>()

const emit = defineEmits<{
  close: []
  navigate: [mantra: Mantra]
}>()

const mantraStore = useMantraStore()

const currentIndex = computed(() =>
  mantraStore.sorted.findIndex(m => m.id === props.mantra.id)
)

const isLiked = computed(() => props.mantra.liked === true)
const hasNext = computed(() => currentIndex.value < mantraStore.sorted.length - 1)
const hasPrev = computed(() => currentIndex.value > 0)

function goNext() {
  if (hasNext.value) {
    emit('navigate', mantraStore.sorted[currentIndex.value + 1])
  } else if (hasPrev.value) {
    emit('navigate', mantraStore.sorted[currentIndex.value - 1])
  } else {
    emit('close')
  }
}

function handleLike() {
  mantraStore.likeMantra(props.mantra.id)
  goNext()
}

function handleDelete() {
  mantraStore.removeMantra(props.mantra.id)
  // After removal, the sorted list shifted — next poster is now at the same index
  const sorted = mantraStore.sorted
  if (sorted.length === 0) {
    emit('close')
  } else {
    const nextIdx = Math.min(currentIndex.value, sorted.length - 1)
    emit('navigate', sorted[Math.max(0, nextIdx)])
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      class="poster-view"
      @click.self="emit('close')"
    >
      <div class="poster-view__stage">
        <div class="poster-view__card">
          <MantraCard :mantra="mantra" />
        </div>
      </div>

      <!-- Thumbs below poster -->
      <div class="poster-view__actions">
        <button
          class="poster-view__thumb poster-view__thumb--down"
          @click="handleDelete"
        >
          👎
        </button>
        <button
          class="poster-view__thumb poster-view__thumb--up"
          @click="handleLike"
        >
          👍
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
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  overflow: hidden;
}

.poster-view__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  padding: 0 24px;
}

.poster-view__card {
  width: 100%;
}

.poster-view__actions {
  display: flex;
  gap: 32px;
  align-items: center;
}

.poster-view__thumb {
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

.poster-view__thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.poster-view__thumb--down:hover {
  border-color: #ff4444;
}

.poster-view__thumb--up:hover {
  border-color: #BBFF00;
}
</style>
