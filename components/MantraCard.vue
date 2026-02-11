<script setup lang="ts">
import type { Mantra } from '~/types'
import { COLOR_SCHEMES } from '~/types'
import { useAutoSize } from '~/composables/useAutoSize'
import { useFonts } from '~/composables/useFonts'
import { useSettingsStore } from '~/stores/settings'

const props = defineProps<{
  mantra: Mantra
  interactive?: boolean
  index?: number
}>()

const emit = defineEmits<{
  select: [mantra: Mantra]
}>()

const settings = useSettingsStore()
const { getFontFamily } = useFonts()

// ── Reference canvas ────────────────────────────────────────
// Poster content is ALWAYS rendered at this fixed width.
// CSS transform: scale() maps it to the actual display size.
// This means text layout is computed ONCE and is IMMUNE to
// grid gap, viewport, or any external size changes.
const REFERENCE_WIDTH = 1000

const referenceHeight = computed(() => {
  return settings.posterFormat === 'a4-portrait'
    ? Math.round(REFERENCE_WIDTH * 297 / 210)
    : Math.round(REFERENCE_WIDTH * 16 / 9)
})

// Poster padding in PIXELS at reference scale (not %, to avoid CSS % resolution issues)
const posterPaddingPx = computed(() =>
  Math.round((settings.posterPadding / 100) * REFERENCE_WIDTH)
)

// ── Scale factor ────────────────────────────────────────────
// Maps the 1000px canvas to the actual visible poster size
const outerRef = ref<HTMLElement | null>(null)
const scaleFactor = ref(0.3)

function updateScale() {
  if (outerRef.value) {
    scaleFactor.value = outerRef.value.clientWidth / REFERENCE_WIDTH
  }
}

// ── Font / color logic ──────────────────────────────────────
const fontFamily = computed(() => {
  if (settings.font === 'random') return getFontFamily(props.mantra.font)
  return getFontFamily(settings.font)
})

const fontWeight = computed(() => {
  if (settings.font === 'random') return props.mantra.fontWeight
  return settings.fontWeight
})

const letterSpacing = computed(() => settings.letterSpacing)
const lineHeight = computed(() => settings.lineHeight)

const displayText = computed(() => {
  const text = props.mantra.text
  switch (settings.textCase) {
    case 'lowercase': return text.toLowerCase()
    case 'titlecase': return text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    case 'sentencecase': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'smallcaps': return text
    case 'uppercase':
    default: return text.toUpperCase()
  }
})

const colors = computed(() => {
  return COLOR_SCHEMES[props.mantra.colorScheme] || COLOR_SCHEMES['black-on-white']
})

const aspectRatio = computed(() =>
  settings.posterFormat === 'a4-portrait' ? '210 / 297' : '9 / 16'
)

// ── Auto-size on the fixed reference canvas ─────────────────
const canvasRef = ref<HTMLElement | null>(null)

const { fontSize } = useAutoSize(
  canvasRef,
  displayText,
  fontFamily,
  fontWeight,
  letterSpacing,
  lineHeight,
  posterPaddingPx,
)

// ── Sequential fade-in ──────────────────────────────────────
const visible = ref(false)
onMounted(() => {
  const delay = (props.index ?? 0) * 30
  setTimeout(() => { visible.value = true }, delay)

  // Set initial scale + observe for resize
  updateScale()
  if (outerRef.value) {
    new ResizeObserver(updateScale).observe(outerRef.value)
  }
})
</script>

<template>
  <div
    ref="outerRef"
    class="mantra-card"
    :class="{ 'cursor-pointer': interactive, 'mantra-card--visible': visible }"
    :style="{
      aspectRatio,
      backgroundColor: colors.bg,
      color: colors.fg,
      borderRadius: `${settings.borderRadius}px`,
    }"
    @click="interactive && emit('select', mantra)"
  >
    <div
      ref="canvasRef"
      class="mantra-card__canvas"
      :style="{
        width: `${REFERENCE_WIDTH}px`,
        height: `${referenceHeight}px`,
        transform: `scale(${scaleFactor})`,
        padding: `${posterPaddingPx}px`,
        fontFamily,
        fontWeight,
        fontStretch: `${settings.fontWidth}%`,
        fontSize: `${fontSize}px`,
        letterSpacing: `${settings.letterSpacing}em`,
        lineHeight: settings.lineHeight,
        fontVariant: settings.textCase === 'smallcaps' ? 'small-caps' : 'normal',
      }"
    >
      {{ displayText }}
    </div>
  </div>
</template>

<style scoped>
.mantra-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.mantra-card--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fixed-size canvas, scaled via CSS transform to fit the outer container.
   Text layout is computed once at 1000px and NEVER changes on resize. */
.mantra-card__canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  /* NEVER break words or hyphenate */
  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
  -webkit-hyphens: none;
}
</style>
