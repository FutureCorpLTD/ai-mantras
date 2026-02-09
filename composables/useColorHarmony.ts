import { colord, extend } from 'colord'
import harmoniesPlugin from 'colord/plugins/harmonies'
import a11yPlugin from 'colord/plugins/a11y'

extend([harmoniesPlugin, a11yPlugin])

type HarmonyType = 'complementary' | 'triadic' | 'split-complementary' | 'analogous' | 'tetradic'

const HARMONY_TYPES: HarmonyType[] = [
  'complementary',
  'triadic',
  'split-complementary',
  'analogous',
  'tetradic',
]

/**
 * Generate a harmonious bg + fg color pair with guaranteed WCAG AA contrast.
 * Produces bold, poster-worthy color combinations.
 */
export function generateHarmonicPair(): { bg: string; fg: string } {
  const hue = Math.random() * 360
  const saturation = 65 + Math.random() * 35 // 65–100: vibrant
  const lightness = 35 + Math.random() * 25 // 35–60: mid-range

  const base = colord({ h: hue, s: saturation, l: lightness })

  // Pick a random harmony type
  const harmonyType = HARMONY_TYPES[Math.floor(Math.random() * HARMONY_TYPES.length)]
  const harmonies = base.harmonies(harmonyType)

  // Randomly decide if base is bg or fg
  const swap = Math.random() > 0.5
  let bg = swap ? harmonies[1] || harmonies[0] : base
  let fg = swap ? base : harmonies[1] || harmonies[0]

  // Ensure strong contrast — push fg to be very light or very dark
  if (bg.isDark()) {
    fg = fg.lighten(0.3).saturate(0.2)
  } else {
    fg = fg.darken(0.3).saturate(0.2)
  }

  // Iteratively adjust until readable
  let attempts = 0
  while (!fg.isReadable(bg, { level: 'AA', size: 'large' }) && attempts < 30) {
    if (bg.isDark()) {
      fg = fg.lighten(0.04)
    } else {
      fg = fg.darken(0.04)
    }
    attempts++
  }

  // Final fallback: pure black or white
  if (!fg.isReadable(bg, { level: 'AA', size: 'large' })) {
    fg = bg.isDark() ? colord('#ffffff') : colord('#000000')
  }

  return { bg: bg.toHex(), fg: fg.toHex() }
}

/**
 * Generate a batch of harmonious color pairs.
 */
export function generateHarmonicPairs(count: number): { bg: string; fg: string }[] {
  return Array.from({ length: count }, () => generateHarmonicPair())
}
