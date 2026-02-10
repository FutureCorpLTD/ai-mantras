import { defineStore } from 'pinia'
import type { Settings, TextCase, PosterFormat, DisplayMode, ColorScheme } from '~/types'
import defaults from '~/data/default-settings.json'

// Bump this whenever you change defaults below.
// On next load, localStorage will auto-clear and pick up the new defaults.
// No more manual localStorage.clear()!
const SETTINGS_VERSION = 3

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({ ...defaults } as Settings),

  actions: {
    updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
      this[key] = value
    },

    resetToDefaults() {
      this.$reset()
    },

    /** Randomize global style settings (called by shuffle) */
    randomizeStyle() {
      this.letterSpacing = Math.round((Math.random() * 0.17 - 0.02) * 100) / 100 // -0.02 to 0.15
      this.lineHeight = Math.round((Math.random() * 0.5 + 0.8) * 100) / 100      // 0.8 to 1.3
      this.posterPadding = Math.floor(Math.random() * 11) + 4                      // 4 to 14
      this.borderRadius = Math.floor(Math.random() * 25)                           // 0 to 24
    },
  },

  persist: true,
})

// Export version for the plugin to check
export const CURRENT_SETTINGS_VERSION = SETTINGS_VERSION
