<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { useLiquidGlass } from '~/composables/useLiquidGlass'
import type { GlassSettings } from '~/composables/useLiquidGlass'

const settings = useSettingsStore()

// ── Liquid Glass ────────────────────────────────────────────
const barRef = ref<HTMLElement | null>(null)

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
} = useLiquidGlass(barRef, glassSettings, 'glass-slider')
</script>

<template>
  <!-- SVG filter for this glass instance -->
  <div v-html="svgMarkup" class="glass-svg" aria-hidden="true"></div>

  <div
    ref="barRef"
    class="grid-slider"
    :style="{
      margin: `${settings.navMargin}px`,
      padding: `${settings.navPadding}px ${settings.navPadding + 4}px`,
    }"
  >
    <!-- Glass layers -->
    <div
      class="grid-slider__refract"
      :style="{ backdropFilter: glassBackdropFilter.full, WebkitBackdropFilter: glassBackdropFilter.fallback }"
    ></div>
    <div
      class="grid-slider__frost"
      :style="{
        backdropFilter: glassBackdropFilter.frost,
        WebkitBackdropFilter: glassBackdropFilter.frost,
        backgroundColor: settings.glassTint + Math.round(settings.glassTintOpacity * 2.55).toString(16).padStart(2, '0'),
      }"
    ></div>
    <div class="grid-slider__depth"></div>
    <div class="grid-slider__dispersion" :style="dispersionStyle"></div>
    <div class="grid-slider__rim"></div>

    <!-- Content -->
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
  gap: 12px;

  /* Match nav pill styling */
  max-width: 480px;
  margin-left: auto !important;
  margin-right: auto !important;
  border-radius: 100px;

  isolation: isolate;
  overflow: hidden;
  -webkit-transform: translateZ(0); /* Force GPU layer — fixes iOS fixed positioning */

  box-shadow:
    0 -6px 32px rgba(0, 0, 0, 0.25),
    0 -2px 8px rgba(0, 0, 0, 0.15);
}

/* Glass layers — same structure as AppHeader */
.grid-slider__refract {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -6;
}
.grid-slider__frost {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -5;
}
.grid-slider__depth {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -4;
  background: linear-gradient(
    5deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(0, 0, 0, 0.04) 80%,
    rgba(0, 0, 0, 0.10) 100%
  );
}
.grid-slider__dispersion {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -3;
  pointer-events: none;
}
.grid-slider__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.22) 0%, transparent 45%);
  box-shadow:
    inset 0 -1px 0 rgba(255, 255, 255, 0.45),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.18),
    inset 0 0.5px 0 rgba(0, 0, 0, 0.15);
}

/* Content */
.grid-slider__input {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  outline: none;
}

.grid-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #BBFF00;
  border: none;
  cursor: pointer;
}

.grid-slider__input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #BBFF00;
  border: none;
  cursor: pointer;
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

  .grid-slider__input::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
  }

  .grid-slider__input::-moz-range-thumb {
    width: 22px;
    height: 22px;
  }
}
</style>
