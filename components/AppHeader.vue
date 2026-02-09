<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { useFonts } from '~/composables/useFonts'
import { useLiquidGlass } from '~/composables/useLiquidGlass'
import type { GlassSettings } from '~/composables/useLiquidGlass'

const settings = useSettingsStore()
const { getFontFamily } = useFonts()

const emit = defineEmits<{
  info: []
  create: []
  settings: []
}>()

// Title uses the same font settings as posters
const titleFont = computed(() => {
  if (settings.font === 'random') return "'Cooper Hewitt', sans-serif"
  return getFontFamily(settings.font)
})
const titleWeight = computed(() => settings.fontWeight)
const titleLetterSpacing = computed(() => `${0.12 + settings.letterSpacing}em`)

// ── Liquid Glass ────────────────────────────────────────────
const pillRef = ref<HTMLElement | null>(null)

const glassSettings = computed<GlassSettings>(() => ({
  refraction: settings.glassRefraction,
  depth: settings.glassDepth,
  dispersion: settings.glassDispersion,
  frost: settings.glassFrost,
}))

const {
  svgMarkup,
  glassBackdropFilter,
  dispersionStyle,
} = useLiquidGlass(pillRef, glassSettings, 'glass-nav')
</script>

<template>
  <!-- SVG filter injected into DOM — contains the displacement map -->
  <div v-html="svgMarkup" class="glass-svg" aria-hidden="true"></div>

  <header
    ref="pillRef"
    class="glass-pill"
    :style="{
      margin: `${settings.navMargin}px`,
      padding: `${settings.navPadding}px ${settings.navPadding + 4}px`,
    }"
  >
    <!-- Layer 1: Refraction — real displacement distortion (Chrome) -->
    <div
      class="glass-pill__refract"
      :style="{ backdropFilter: glassBackdropFilter.full, WebkitBackdropFilter: glassBackdropFilter.fallback }"
    ></div>

    <!-- Layer 2: Frost fallback — blur+saturation (all browsers) -->
    <div
      class="glass-pill__frost"
      :style="{
        backdropFilter: glassBackdropFilter.frost,
        WebkitBackdropFilter: glassBackdropFilter.frost,
        backgroundColor: settings.glassTint + Math.round(settings.glassTintOpacity * 2.55).toString(16).padStart(2, '0'),
      }"
    ></div>

    <!-- Layer 3: Depth — convex lens gradient -->
    <div class="glass-pill__depth"></div>

    <!-- Layer 4: Dispersion — chromatic aberration -->
    <div class="glass-pill__dispersion" :style="dispersionStyle"></div>

    <!-- Layer 5: Rim light -->
    <div class="glass-pill__rim"></div>

    <!-- Content -->
    <button class="glass-pill__btn" aria-label="Info" @click="emit('info')">
      <span class="material-symbols-outlined" :style="{ fontSize: `${Math.round(22 * settings.navScale)}px` }">info</span>
    </button>
    <h1
      class="glass-pill__title"
      :style="{
        fontFamily: titleFont,
        fontWeight: titleWeight,
        letterSpacing: titleLetterSpacing,
        fontSize: `${Math.round(13 * settings.navScale)}px`,
      }"
    >AI MANTRAS</h1>
    <div class="glass-pill__right">
      <button class="glass-pill__btn" aria-label="Create new" @click="emit('create')">
        <span class="material-symbols-outlined" :style="{ fontSize: `${Math.round(22 * settings.navScale)}px` }">add_circle</span>
      </button>
      <button class="glass-pill__btn" aria-label="Settings" @click="emit('settings')">
        <span class="material-symbols-outlined" :style="{ fontSize: `${Math.round(22 * settings.navScale)}px` }">menu</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.glass-svg {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}
.glass-svg :deep(svg) {
  position: absolute;
  width: 0;
  height: 0;
}

/* ── Pill container ──────────────────────────────────────── */
.glass-pill {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;

  max-width: 480px;
  margin-left: auto !important;
  margin-right: auto !important;
  border-radius: 100px;

  isolation: isolate;
  overflow: hidden;

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.35),
    0 2px 10px rgba(0, 0, 0, 0.2);
}

/* ── Refraction layer — real distortion (Chrome only) ──── */
.glass-pill__refract {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -6;
  /* backdrop-filter set dynamically via :style */
}

/* ── Frost layer — blur fallback (all browsers) ────────── */
.glass-pill__frost {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -5;
  /* backdrop-filter and backgroundColor set dynamically via :style */
}

/* ── Depth — convex lens gradient ────────────────────────── */
.glass-pill__depth {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -4;
  background: linear-gradient(
    175deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(0, 0, 0, 0.04) 80%,
    rgba(0, 0, 0, 0.10) 100%
  );
}

/* ── Dispersion — chromatic aberration ───────────────────── */
.glass-pill__dispersion {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -3;
  pointer-events: none;
  /* box-shadow set dynamically */
}

/* ── Rim light ───────────────────────────────────────────── */
.glass-pill__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, transparent 45%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.18),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.15);
}

/* ── Content ─────────────────────────────────────────────── */

.glass-pill__title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.93);
  margin: 0;
  user-select: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.glass-pill__btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  padding: 2px;
  transition: color 0.15s;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-pill__right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.glass-pill__btn:hover { color: white; }

.glass-pill__btn .material-symbols-outlined {
  font-size: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

@media (max-width: 768px) {
  .glass-pill {
    max-width: none;
    border-radius: 100px;
  }
}
</style>
