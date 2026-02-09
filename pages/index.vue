<script setup lang="ts">
import type { Mantra } from '~/types'
import { useMantraStore } from '~/stores/mantras'
import { useSettingsStore } from '~/stores/settings'

useHead({
  title: 'AI MANTRAS',
  meta: [
    { name: 'description', content: 'Typographic poster generator for the AI age. Inspired by Jenny Holzer, Douglas Coupland, and Anthony Burrill.' },
    { property: 'og:title', content: 'AI MANTRAS' },
    { property: 'og:description', content: 'Bold slogans about AI, creativity, and the future of work.' },
    { property: 'og:type', content: 'website' },
  ],
})

const mantraStore = useMantraStore()
const settings = useSettingsStore()

// Wait for client-side Pinia hydration before rendering the grid.
// This prevents the flash from SSR defaults (columns=3) to persisted values.
const hydrated = ref(false)

onMounted(() => {
  mantraStore.initialize()
  // Pinia persisted state has loaded by the time onMounted fires
  hydrated.value = true
})

// Overlay state
type OverlayType = 'info' | 'create' | 'settings' | null
const activeOverlay = ref<OverlayType>(null)
const selectedMantra = ref<Mantra | null>(null)

function openPoster(mantra: Mantra) {
  selectedMantra.value = mantra
}

function closePoster() {
  selectedMantra.value = null
}

function navigatePoster(mantra: Mantra) {
  selectedMantra.value = mantra
}

// Keyboard shortcuts
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (selectedMantra.value) {
      closePoster()
    } else if (activeOverlay.value) {
      activeOverlay.value = null
    }
    return
  }

  if (e.shiftKey && e.key === 'X') {
    activeOverlay.value = activeOverlay.value === 'settings' ? null : 'settings'
    return
  }

  if (e.shiftKey && e.key === 'N') {
    activeOverlay.value = 'create'
    return
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Dynamic grid styles
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
  gap: `${settings.gridGap}px`,
  padding: `${settings.viewportMargin}px`,
}))
</script>

<template>
  <div
    class="app"
    :style="{ backgroundColor: settings.backgroundColor }"
  >
    <AppHeader
      @info="activeOverlay = 'info'"
      @create="activeOverlay = 'create'"
    />

    <main v-if="hydrated" class="grid" :style="gridStyle">
      <MantraCard
        v-for="(mantra, i) in mantraStore.sorted"
        :key="mantra.id"
        :mantra="mantra"
        :interactive="true"
        :index="i"
        @select="openPoster"
      />
    </main>

    <GridSlider />

    <!-- Overlays -->
    <PosterView
      v-if="selectedMantra"
      :mantra="selectedMantra"
      @close="closePoster"
      @navigate="navigatePoster"
    />

    <InfoOverlay
      v-if="activeOverlay === 'info'"
      @close="activeOverlay = null"
    />

    <CreateOverlay
      v-if="activeOverlay === 'create'"
      @close="activeOverlay = null"
    />

    <ControlPanel
      v-if="activeOverlay === 'settings'"
      @close="activeOverlay = null"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  transition: background-color 0.3s;
}

.grid {
  padding-bottom: 48px; /* space for grid slider */
}
</style>
