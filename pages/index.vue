<script setup lang="ts">
import type { Mantra } from '~/types'
import { useMantraStore } from '~/stores/mantras'
import { useSettingsStore } from '~/stores/settings'
import { usePinchZoom } from '~/composables/usePinchZoom'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl as string

useHead({
  title: 'AI MANTRAS',
  meta: [
    { name: 'description', content: 'Short, punchy typographic slogans about AI, creativity, and the future of work. Inspired by Jenny Holzer, Douglas Coupland, and Anthony Burrill.' },
    { property: 'og:title', content: 'AI MANTRAS' },
    { property: 'og:description', content: 'Short, punchy typographic slogans about AI, creativity, and the future of work.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:site_name', content: 'AI MANTRAS' },
    { property: 'og:image', content: `${siteUrl}/og-image.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'AI MANTRAS' },
    { name: 'twitter:description', content: 'Short, punchy typographic slogans about AI, creativity, and the future of work.' },
    { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
  ],
})

const mantraStore = useMantraStore()
const settings = useSettingsStore()

// Wait for client-side Pinia hydration before rendering the grid.
// This prevents the flash from SSR defaults to persisted values.
const hydrated = ref(false)
const gridRef = ref<HTMLElement | null>(null)

// ── Column intro animation ────────────────────────────────────
// On page load: start at max columns, ease down to target over ~4s.
// The animating column count drives both grid and slider needle.
const animatingColumns = ref<number | null>(null)
const displayColumns = computed(() => animatingColumns.value ?? settings.columns)
const introAnimating = ref(false)

function runIntroAnimation(targetColumns: number) {
  const maxCols = 20
  if (targetColumns >= maxCols) return // nothing to animate

  introAnimating.value = true
  animatingColumns.value = maxCols
  settings.updateSetting('columns', maxCols)

  const totalDuration = 4000
  const steps = maxCols - targetColumns
  const stepDuration = totalDuration / steps

  let current = maxCols
  function step() {
    if (current <= targetColumns) {
      animatingColumns.value = null
      settings.updateSetting('columns', targetColumns)
      introAnimating.value = false
      return
    }
    current--
    animatingColumns.value = current
    settings.updateSetting('columns', current)
    setTimeout(step, stepDuration)
  }

  // Start after a brief delay for the grid to render
  setTimeout(step, 300)
}

onMounted(() => {
  mantraStore.initialize()
  hydrated.value = true

  // Mobile: default to 1 column for first-time visitors
  let targetColumns = settings.columns
  if (window.innerWidth <= 768 && !localStorage.getItem('settings')) {
    targetColumns = 1
  }

  // Run the intro animation from max columns → target
  runIntroAnimation(targetColumns)
})

// Pinch-to-zoom on grid: spread = fewer columns, pinch = more
const columnsRef = computed(() => settings.columns)
usePinchZoom(gridRef, columnsRef, {
  min: 1,
  max: 10,
  onUpdate: (v) => settings.updateSetting('columns', v),
})

function handleShuffle() {
  mantraStore.shuffleStyles()
  settings.randomizeStyle()
}

// Overlay state
type OverlayType = 'info' | 'create' | 'poster' | 'interface' | null
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
  // Don't intercept when typing in inputs
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

  if (e.key === 'Escape') {
    if (selectedMantra.value) {
      closePoster()
    } else if (activeOverlay.value) {
      activeOverlay.value = null
    }
    return
  }

  // Shift+X → Interface panel
  if (e.shiftKey && e.key === 'X') {
    activeOverlay.value = activeOverlay.value === 'interface' ? null : 'interface'
    return
  }

  // X (no shift) → Poster design panel
  if (!e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === 'x') {
    activeOverlay.value = activeOverlay.value === 'poster' ? null : 'poster'
    return
  }

  if (e.shiftKey && e.key === 'N') {
    activeOverlay.value = 'create'
    return
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Dynamic grid styles — gridGap is used for both gap and viewport margin
// CSS transition on grid-template-columns for smooth column changes
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${displayColumns.value}, 1fr)`,
  gap: `${settings.gridGap}px`,
  padding: `${settings.gridGap}px`,
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
      @shuffle="handleShuffle"
      @settings="activeOverlay = activeOverlay === 'poster' ? null : 'poster'"
    />

    <main v-if="hydrated" ref="gridRef" class="grid" :class="{ 'grid--animating': introAnimating }" :style="gridStyle">
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

    <PosterPanel
      v-if="activeOverlay === 'poster'"
      @close="activeOverlay = null"
    />

    <InterfacePanel
      v-if="activeOverlay === 'interface'"
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
  touch-action: pan-y; /* allow vertical scroll, intercept pinch */
  transition: grid-template-columns 0.35s ease;
}

.grid--animating {
  transition: grid-template-columns 0.15s ease;
}
</style>
