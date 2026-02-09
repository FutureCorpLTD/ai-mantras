import { defineStore } from 'pinia'
import type { Mantra, ColorScheme } from '~/types'
import { SEED_MANTRAS } from '~/data/seed-mantras'
import { POSTER_FONTS } from '~/data/font-catalog'
import { generateHarmonicPair } from '~/composables/useColorHarmony'

const FIXED_SCHEMES: ColorScheme[] = ['black-on-white', 'white-on-black', 'neon-on-black', 'black-on-neon']

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateId(): string {
  return crypto.randomUUID()
}

function createMantraFromSeed(seed: { text: string; tone: number }, index: number): Mantra {
  return {
    id: generateId(),
    text: seed.text,
    createdAt: new Date(Date.now() - index * 60000).toISOString(),
    tone: seed.tone,
    font: randomFrom(POSTER_FONTS),
    fontWeight: randomFrom(['700', '800', '900']),
    colorScheme: randomFrom(FIXED_SCHEMES),
  }
}

export const useMantraStore = defineStore('mantras', {
  state: () => ({
    mantras: [] as Mantra[],
    initialized: false,
  }),

  getters: {
    sorted: (state) => [...state.mantras].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),

    count: (state) => state.mantras.length,
  },

  actions: {
    initialize() {
      if (this.initialized && this.mantras.length > 0) return
      this.mantras = SEED_MANTRAS.map((seed, i) => createMantraFromSeed(seed, i))
      this.initialized = true
    },

    addMantra(text: string, tone: number, font?: string, fontWeight?: string, colorScheme?: ColorScheme) {
      this.mantras.unshift({
        id: generateId(),
        text,
        createdAt: new Date().toISOString(),
        tone,
        font: font || randomFrom(POSTER_FONTS),
        fontWeight: fontWeight || randomFrom(['700', '800', '900']),
        colorScheme: colorScheme || randomFrom(FIXED_SCHEMES),
      })
    },

    removeMantra(id: string) {
      this.mantras = this.mantras.filter(m => m.id !== id)
    },

    randomizeFonts() {
      this.mantras = this.mantras.map(m => ({
        ...m,
        font: randomFrom(POSTER_FONTS),
        fontWeight: randomFrom(['700', '800', '900']),
      }))
    },

    /** Re-roll using the fixed 4 color schemes */
    randomizeColors() {
      this.mantras = this.mantras.map(m => ({
        ...m,
        colorScheme: randomFrom(FIXED_SCHEMES),
        harmonicBg: undefined,
        harmonicFg: undefined,
      }))
    },

    /** Re-roll using harmonious generated color pairs */
    randomizeHarmonicColors() {
      this.mantras = this.mantras.map(m => {
        const pair = generateHarmonicPair()
        return {
          ...m,
          colorScheme: 'harmonic' as ColorScheme,
          harmonicBg: pair.bg,
          harmonicFg: pair.fg,
        }
      })
    },
  },

  persist: true,
})
