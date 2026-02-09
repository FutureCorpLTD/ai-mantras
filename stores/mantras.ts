import { defineStore } from 'pinia'
import type { Mantra, ColorScheme } from '~/types'
import { SEED_MANTRAS } from '~/data/seed-mantras'
import { POSTER_FONTS } from '~/data/font-catalog'
import { generateHarmonicPair } from '~/composables/useColorHarmony'

const FIXED_SCHEMES: ColorScheme[] = ['black-on-white', 'white-on-black', 'neon-on-black', 'black-on-neon']
const MAX_FEEDBACK = 20

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateId(): string {
  // crypto.randomUUID() requires secure context (HTTPS) — not available on HTTP over USB tether
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: random hex string
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
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
    // Taste feedback: keeps deleted mantra texts to steer AI away from them
    rejectedTexts: [] as string[],
  }),

  getters: {
    sorted: (state) => [...state.mantras].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),

    count: (state) => state.mantras.length,

    /** Most recent liked mantra texts (capped) — used as positive examples for AI */
    likedTexts: (state): string[] =>
      state.mantras
        .filter(m => m.liked)
        .slice(0, MAX_FEEDBACK)
        .map(m => m.text),
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
      const mantra = this.mantras.find(m => m.id === id)
      if (mantra) {
        // Save rejected text for AI feedback (cap at MAX_FEEDBACK)
        this.rejectedTexts = [mantra.text, ...this.rejectedTexts].slice(0, MAX_FEEDBACK)
      }
      this.mantras = this.mantras.filter(m => m.id !== id)
    },

    /** Toggle liked status on a mantra */
    likeMantra(id: string) {
      const mantra = this.mantras.find(m => m.id === id)
      if (mantra) {
        mantra.liked = !mantra.liked
      }
    },

    /** Save a rejected text (from CreateOverlay swipe-left) */
    rejectText(text: string) {
      this.rejectedTexts = [text, ...this.rejectedTexts].slice(0, MAX_FEEDBACK)
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
