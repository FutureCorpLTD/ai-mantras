<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { useMantraStore } from '~/stores/mantras'
import { useFonts } from '~/composables/useFonts'
import type { TextCase, PosterFormat } from '~/types'

const emit = defineEmits<{ close: [] }>()
const settings = useSettingsStore()
const mantraStore = useMantraStore()
const { fontCatalog, getFontBySlug } = useFonts()

const currentFont = computed(() => getFontBySlug(settings.font))

const wghtAxis = computed(() => currentFont.value?.axes?.find(a => a.tag === 'wght'))
const wdthAxis = computed(() => currentFont.value?.axes?.find(a => a.tag === 'wdth'))

const textCaseOptions: { value: TextCase; label: string }[] = [
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'titlecase', label: 'Title Case' },
  { value: 'sentencecase', label: 'Sentence case' },
  { value: 'smallcaps', label: 'Small Caps' },
]

const formatOptions: { value: PosterFormat; label: string }[] = [
  { value: 'a4-portrait', label: 'A4 Portrait' },
  { value: 'social-story', label: 'Social Story (9:16)' },
]
</script>

<template>
  <Teleport to="body">
    <div class="poster-panel" @click.self="emit('close')">
      <div class="poster-panel__inner">
        <div class="poster-panel__header">
          <h2 class="poster-panel__title">POSTER DESIGN</h2>
          <div class="poster-panel__header-right">
            <span class="poster-panel__shortcut">C</span>
            <button class="poster-panel__close" @click="emit('close')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div class="poster-panel__sections">
          <!-- Typography -->
          <section class="cp-section">
            <h3 class="cp-section__title">Typography</h3>

            <label class="cp-field">
              <span class="cp-field__label">Font</span>
              <select
                :value="settings.font"
                @change="settings.updateSetting('font', ($event.target as HTMLSelectElement).value)"
                class="cp-field__select"
              >
                <option value="random">Random (per poster)</option>
                <optgroup label="Sans">
                  <option v-for="f in fontCatalog.filter(f => f.category === 'sans')" :key="f.slug" :value="f.slug">
                    {{ f.name }}{{ f.variable ? ' (var)' : '' }}
                  </option>
                </optgroup>
                <optgroup label="Serif">
                  <option v-for="f in fontCatalog.filter(f => f.category === 'serif')" :key="f.slug" :value="f.slug">
                    {{ f.name }}{{ f.variable ? ' (var)' : '' }}
                  </option>
                </optgroup>
                <optgroup label="Display">
                  <option v-for="f in fontCatalog.filter(f => f.category === 'display')" :key="f.slug" :value="f.slug">
                    {{ f.name }}
                  </option>
                </optgroup>
                <optgroup label="Mono">
                  <option v-for="f in fontCatalog.filter(f => f.category === 'mono')" :key="f.slug" :value="f.slug">
                    {{ f.name }}
                  </option>
                </optgroup>
              </select>
            </label>

            <button
              v-if="settings.font === 'random'"
              class="cp-btn"
              @click="mantraStore.randomizeFonts()"
            >
              Re-roll fonts
            </button>

            <!-- Weight: dropdown for static fonts, slider for variable fonts with wght axis -->
            <label v-if="currentFont && !currentFont.variable && currentFont.weights.length > 1" class="cp-field">
              <span class="cp-field__label">Weight</span>
              <select
                :value="settings.fontWeight"
                @change="settings.updateSetting('fontWeight', ($event.target as HTMLSelectElement).value)"
                class="cp-field__select"
              >
                <option v-for="w in currentFont.weights" :key="w.value" :value="String(w.value)">
                  {{ w.name }} ({{ w.value }})
                </option>
              </select>
            </label>

            <label v-if="wghtAxis" class="cp-field">
              <span class="cp-field__label">Weight {{ settings.fontWeight }}</span>
              <input
                type="range"
                :min="wghtAxis.min"
                :max="wghtAxis.max"
                step="1"
                :value="settings.fontWeight"
                @input="settings.updateSetting('fontWeight', ($event.target as HTMLInputElement).value)"
                class="cp-field__range"
              />
            </label>

            <!-- Width: only shown for fonts with wdth axis -->
            <label v-if="wdthAxis" class="cp-field">
              <span class="cp-field__label">Width {{ settings.fontWidth }}%</span>
              <input
                type="range"
                :min="wdthAxis.min"
                :max="wdthAxis.max"
                step="1"
                :value="settings.fontWidth"
                @input="settings.updateSetting('fontWidth', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Letter Spacing {{ settings.letterSpacing.toFixed(2) }}em</span>
              <input
                type="range"
                min="-0.1"
                max="0.5"
                step="0.01"
                :value="settings.letterSpacing"
                @input="settings.updateSetting('letterSpacing', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Line Height {{ settings.lineHeight.toFixed(2) }}</span>
              <input
                type="range"
                min="0.7"
                max="1.8"
                step="0.01"
                :value="settings.lineHeight"
                @input="settings.updateSetting('lineHeight', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Text Case</span>
              <select
                :value="settings.textCase"
                @change="settings.updateSetting('textCase', ($event.target as HTMLSelectElement).value as TextCase)"
                class="cp-field__select"
              >
                <option v-for="o in textCaseOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </label>
          </section>

          <!-- Poster -->
          <section class="cp-section">
            <h3 class="cp-section__title">Poster</h3>

            <label class="cp-field">
              <span class="cp-field__label">Format</span>
              <select
                :value="settings.posterFormat"
                @change="settings.updateSetting('posterFormat', ($event.target as HTMLSelectElement).value as PosterFormat)"
                class="cp-field__select"
              >
                <option v-for="o in formatOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Inner Padding {{ settings.posterPadding }}%</span>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                :value="settings.posterPadding"
                @input="settings.updateSetting('posterPadding', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>
          </section>

          <!-- Color -->
          <section class="cp-section">
            <h3 class="cp-section__title">Color</h3>

            <button class="cp-btn" @click="mantraStore.randomizeColors()">
              Re-roll colors
            </button>

            <label class="cp-field">
              <span class="cp-field__label">Site Background</span>
              <input
                type="color"
                :value="settings.backgroundColor"
                @input="settings.updateSetting('backgroundColor', ($event.target as HTMLInputElement).value)"
                class="cp-field__color"
              />
            </label>
          </section>

          <!-- Poster Style -->
          <section class="cp-section">
            <h3 class="cp-section__title">Poster Style</h3>

            <label class="cp-field">
              <span class="cp-field__label">Border Radius {{ settings.borderRadius }}px</span>
              <input
                type="range" min="0" max="32" step="1"
                :value="settings.borderRadius"
                @input="settings.updateSetting('borderRadius', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field cp-field--toggle">
              <span class="cp-field__label">Lite Mode</span>
              <input
                type="checkbox"
                :checked="settings.liteMode"
                @change="settings.updateSetting('liteMode', ($event.target as HTMLInputElement).checked)"
              />
            </label>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.poster-panel {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.poster-panel__inner {
  width: 320px;
  max-width: 100vw;
  height: 100%;
  background: rgba(15, 15, 15, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
  overflow-y: auto;
  animation: slideInRight 0.25s ease;
}

.poster-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.poster-panel__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.poster-panel__shortcut {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(187, 255, 0, 0.5);
  text-transform: uppercase;
  background: rgba(187, 255, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(187, 255, 0, 0.2);
}

.poster-panel__title {
  font-family: 'Cooper Hewitt', sans-serif;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.15em;
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
}

.poster-panel__close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.poster-panel__close:hover { color: white; }
.poster-panel__close .material-symbols-outlined { font-size: 20px; }

.poster-panel__sections {
  padding: 8px 0;
}

.cp-section {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cp-section__title {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 12px;
}

.cp-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.cp-field--toggle {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.cp-field__label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.cp-field__select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  width: 100%;
}

.cp-field__range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
}

.cp-field__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #BBFF00;
  cursor: pointer;
  border: none;
}

.cp-field__range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #BBFF00;
  cursor: pointer;
  border: none;
}

.cp-field__color {
  width: 100%;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  background: none;
}

.cp-btn {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: rgba(187, 255, 0, 0.1);
  border: 1px solid rgba(187, 255, 0, 0.3);
  border-radius: 6px;
  color: #BBFF00;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}

.cp-btn:hover {
  background: rgba(187, 255, 0, 0.2);
  border-color: #BBFF00;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@media (max-width: 768px) {
  .poster-panel {
    align-items: flex-end;
    justify-content: stretch;
  }

  .poster-panel__inner {
    width: 100%;
    height: auto;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
    animation: slideInUp 0.25s ease;
  }

  @keyframes slideInUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}
</style>
