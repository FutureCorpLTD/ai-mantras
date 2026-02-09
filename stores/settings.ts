import { defineStore } from 'pinia'
import type { Settings, TextCase, PosterFormat, DisplayMode, ColorScheme } from '~/types'

// Bump this whenever you change defaults below.
// On next load, localStorage will auto-clear and pick up the new defaults.
// No more manual localStorage.clear()!
const SETTINGS_VERSION = 2

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    // Typography
    font: 'random',
    fontWeight: '900',
    fontStyle: 'normal',
    letterSpacing: 0,
    lineHeight: 0.95,
    textCase: 'uppercase',
    emojiReplace: false,

    // Poster size
    posterFormat: 'a4-portrait',

    // Color
    colorMode: 'auto',

    // Poster inner padding
    posterPadding: 8,

    // Layout
    viewportMargin: 0,
    gridGap: 4,
    singlePosterMargin: 40,
    backgroundColor: '#888888',

    // Nav
    navMargin: 20,
    navPadding: 12,
    navScale: 1,

    // Display — renderer-agnostic
    displayMode: 'poster',
    liteMode: true, // flat CSS for now
    paperCurl: 0,
    paperAngle: 0,
    paperCrumple: 0,
    paperTexture: 'none',

    // Poster style
    borderRadius: 16,

    // Glass effect
    glassRefraction: 71,
    glassDepth: 74,
    glassDispersion: 88,
    glassFrost: 0,
    glassTint: '#000000',
    glassTintOpacity: 58,

    // Grid
    columns: 3,
  }),

  actions: {
    updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
      this[key] = value
    },

    resetToDefaults() {
      this.$reset()
    },
  },

  persist: true,
})

// Export version for the plugin to check
export const CURRENT_SETTINGS_VERSION = SETTINGS_VERSION
