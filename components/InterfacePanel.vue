<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const emit = defineEmits<{ close: [] }>()
const settings = useSettingsStore()

const isLocal = computed(() => {
  if (import.meta.server) return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0'
})

const saveStatus = ref('Save as Default')

async function saveAsDefault() {
  saveStatus.value = 'Saving…'
  try {
    await $fetch('/api/save-defaults', {
      method: 'POST',
      body: settings.$state,
    })
    saveStatus.value = 'Saved!'
    setTimeout(() => { saveStatus.value = 'Save as Default' }, 2000)
  } catch {
    saveStatus.value = 'Error saving'
    setTimeout(() => { saveStatus.value = 'Save as Default' }, 2000)
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="interface-panel" @click.self="emit('close')">
      <div class="interface-panel__inner">
        <div class="interface-panel__header">
          <h2 class="interface-panel__title">INTERFACE</h2>
          <div class="interface-panel__header-right">
            <span class="interface-panel__shortcut">Shift+X</span>
            <button class="interface-panel__close" @click="emit('close')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div class="interface-panel__sections">
          <!-- Grid -->
          <section class="cp-section">
            <h3 class="cp-section__title">Grid</h3>

            <label class="cp-field">
              <span class="cp-field__label">Columns {{ settings.columns }}</span>
              <input
                type="range" min="1" max="20" step="1"
                :value="settings.columns"
                @input="settings.updateSetting('columns', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Grid Gap {{ settings.gridGap }}px</span>
              <input
                type="range" min="0" max="24" step="1"
                :value="settings.gridGap"
                @input="settings.updateSetting('gridGap', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>
          </section>

          <!-- Nav (dev only) -->
          <section v-if="isLocal" class="cp-section">
            <h3 class="cp-section__title">Nav Bar</h3>

            <label class="cp-field">
              <span class="cp-field__label">Nav Margin {{ settings.navMargin }}px</span>
              <input
                type="range" min="0" max="32" step="1"
                :value="settings.navMargin"
                @input="settings.updateSetting('navMargin', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Nav Padding {{ settings.navPadding }}px</span>
              <input
                type="range" min="4" max="24" step="1"
                :value="settings.navPadding"
                @input="settings.updateSetting('navPadding', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Nav Content Scale {{ settings.navScale.toFixed(1) }}x</span>
              <input
                type="range" min="0.5" max="2" step="0.1"
                :value="settings.navScale"
                @input="settings.updateSetting('navScale', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>
          </section>

          <!-- Glass Effect (dev only) -->
          <section v-if="isLocal" class="cp-section">
            <h3 class="cp-section__title">Glass Effect</h3>
            <p class="cp-section__note">Refraction distortion: Chrome/Edge only</p>

            <label class="cp-field">
              <span class="cp-field__label">Refraction {{ settings.glassRefraction }}</span>
              <input
                type="range" min="0" max="100" step="1"
                :value="settings.glassRefraction"
                @input="settings.updateSetting('glassRefraction', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Depth {{ settings.glassDepth }}</span>
              <input
                type="range" min="0" max="100" step="1"
                :value="settings.glassDepth"
                @input="settings.updateSetting('glassDepth', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Dispersion {{ settings.glassDispersion }}</span>
              <input
                type="range" min="0" max="100" step="1"
                :value="settings.glassDispersion"
                @input="settings.updateSetting('glassDispersion', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Frost {{ settings.glassFrost }}</span>
              <input
                type="range" min="0" max="100" step="1"
                :value="settings.glassFrost"
                @input="settings.updateSetting('glassFrost', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Tint Color</span>
              <input
                type="color"
                :value="settings.glassTint"
                @input="settings.updateSetting('glassTint', ($event.target as HTMLInputElement).value)"
                class="cp-field__color"
              />
            </label>

            <label class="cp-field">
              <span class="cp-field__label">Tint Opacity {{ settings.glassTintOpacity }}%</span>
              <input
                type="range" min="0" max="100" step="1"
                :value="settings.glassTintOpacity"
                @input="settings.updateSetting('glassTintOpacity', Number(($event.target as HTMLInputElement).value))"
                class="cp-field__range"
              />
            </label>
          </section>

          <!-- Save as Default (dev only) -->
          <section v-if="isLocal" class="cp-section">
            <button class="cp-btn" @click="saveAsDefault">
              {{ saveStatus }}
            </button>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.interface-panel {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.interface-panel__inner {
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

.interface-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.interface-panel__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.interface-panel__shortcut {
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

.interface-panel__title {
  font-family: 'Cooper Hewitt', sans-serif;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.15em;
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
}

.interface-panel__close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.interface-panel__close:hover { color: white; }
.interface-panel__close .material-symbols-outlined { font-size: 20px; }

.interface-panel__sections {
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

.cp-section__note {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  color: rgba(187, 255, 0, 0.4);
  margin: -8px 0 12px;
}

.cp-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
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
  .interface-panel {
    align-items: flex-end;
    justify-content: stretch;
  }

  .interface-panel__inner {
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
