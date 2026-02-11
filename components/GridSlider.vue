<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { useLiquidGlass } from '~/composables/useLiquidGlass'
import type { GlassSettings } from '~/composables/useLiquidGlass'

const settings = useSettingsStore()

// ── Liquid Glass (applied to the track, not a background pill) ───
const trackRef = ref<HTMLElement | null>(null)

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
} = useLiquidGlass(trackRef, glassSettings, 'glass-slider')

// Track the thumb position as a percentage for the glass track fill
const thumbPercent = computed(() => {
  return ((settings.columns - 1) / 19) * 100
})
</script>

<template>
  <!-- SVG filter for this glass instance -->
  <div v-html="svgMarkup" class="glass-svg" aria-hidden="true"></div>

  <div
    class="grid-slider"
    :style="{
      margin: `${settings.navMargin}px`,
      padding: `${settings.navPadding}px ${settings.navPadding + 4}px`,
    }"
  >
    <!-- The glass track — a thin bar with the glass effect -->
    <div ref="trackRef" class="grid-slider__track">
      <div
        class="grid-slider__track-refract"
        :style="{ backdropFilter: glassBackdropFilter.full, WebkitBackdropFilter: glassBackdropFilter.fallback }"
      ></div>
      <div
        class="grid-slider__track-frost"
        :style="{
          backdropFilter: glassBackdropFilter.frost,
          WebkitBackdropFilter: glassBackdropFilter.frost,
          backgroundColor: settings.glassTint + Math.round(settings.glassTintOpacity * 2.55).toString(16).padStart(2, '0'),
        }"
      ></div>
      <div class="grid-slider__track-depth"></div>
      <div class="grid-slider__track-dispersion" :style="dispersionStyle"></div>
      <div class="grid-slider__track-rim"></div>
    </div>

    <!-- Native range input overlaid on the glass track -->
    <input
      type="range"
      :min="1"
      :max="20"
      :value="settings.columns"
      @input="settings.updateSetting('columns', Number(($event.target as HTMLInputElement).value))"
      class="grid-slider__input"
    />
  </div>
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

.grid-slider {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  align-items: center;

  /* Centered, constrained width */
  max-width: 480px;
  margin-left: auto !important;
  margin-right: auto !important;

  /* No background — the track itself is the glass element */
  -webkit-transform: translateZ(0);
}

/* ── Glass track — thin bar with full glass effect ──────────── */
.grid-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 6px;
  border-radius: 100px;
  isolation: isolate;
  overflow: hidden;
  pointer-events: none;

  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.3),
    0 0 0 0.5px rgba(255, 255, 255, 0.15);
}

.grid-slider__track-refract {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -6;
}
.grid-slider__track-frost {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -5;
}
.grid-slider__track-depth {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -4;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.22) 100%
  );
}
.grid-slider__track-dispersion {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -3;
  pointer-events: none;
}
.grid-slider__track-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.12);
}

/* ── Range input (overlaid on top of glass track) ───────────── */
.grid-slider__input {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 6px;
  background: transparent;
  cursor: pointer;
  outline: none;
  position: relative;
  z-index: 1;
  margin: 0;
}

/* Remove default track so the glass track shows through */
.grid-slider__input::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border-radius: 100px;
}

.grid-slider__input::-moz-range-track {
  height: 6px;
  background: transparent;
  border-radius: 100px;
  border: none;
}

/* ── Thumb — white, small by default, larger on hover/active (YouTube style) ── */
.grid-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  transition: width 0.15s ease, height 0.15s ease, margin-top 0.15s ease;
  margin-top: -2px; /* center on track */
}

.grid-slider__input:hover::-webkit-slider-thumb,
.grid-slider__input:active::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  margin-top: -5px;
}

.grid-slider__input::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  transition: width 0.15s ease, height 0.15s ease;
}

.grid-slider__input:hover::-moz-range-thumb,
.grid-slider__input:active::-moz-range-thumb {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .grid-slider {
    max-width: none;
    margin-left: 16px !important;
    margin-right: 16px !important;
    margin-bottom: calc(8px + env(safe-area-inset-bottom)) !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  /* Bigger default thumb on mobile for touch targets */
  .grid-slider__input::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    margin-top: -4px;
  }

  .grid-slider__input:hover::-webkit-slider-thumb,
  .grid-slider__input:active::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
    margin-top: -8px;
  }

  .grid-slider__input::-moz-range-thumb {
    width: 14px;
    height: 14px;
  }

  .grid-slider__input:hover::-moz-range-thumb,
  .grid-slider__input:active::-moz-range-thumb {
    width: 22px;
    height: 22px;
  }
}
</style>
