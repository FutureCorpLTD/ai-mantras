// ── Core Mantra ─────────────────────────────────────────────
// The mantra is the atomic unit — text + metadata.
// How it's *displayed* is up to the renderer (poster, kinetic type, etc.)

export interface Mantra {
  id: string
  text: string
  createdAt: string // ISO 8601
  tone: number // 0 (dystopian) → 1 (utopian)
  font: string // Font family slug
  fontWeight: string // CSS weight value or name
  colorScheme: ColorScheme
  // Taste feedback
  liked?: boolean
}

export type ColorScheme = 'black-on-white' | 'white-on-black' | 'neon-on-black' | 'black-on-neon'

// ── Display / Renderer ──────────────────────────────────────
// The display config is separate from the mantra data.
// A "poster" is one renderer. Kinetic type could be another.

export type DisplayMode = 'poster' | 'kinetic' // extensible

export interface DisplayConfig {
  mode: DisplayMode
  // Poster-specific (for now)
  posterFormat: PosterFormat
  liteMode: boolean
  paperCurl: number
  paperAngle: number
  paperCrumple: number
  paperTexture: 'none' | 'light' | 'heavy'
}

// ── Settings ────────────────────────────────────────────────

export interface Settings {
  // Typography
  font: string
  fontWeight: string
  fontWidth: number // font-stretch / wdth axis (percentage, 100 = normal)
  fontStyle: 'normal' | 'italic'
  letterSpacing: number // em units
  lineHeight: number // multiplier
  textCase: TextCase
  emojiReplace: boolean

  // Poster size
  posterFormat: PosterFormat

  // Poster inner padding
  posterPadding: number // % of poster dimension

  // Layout
  gridGap: number // px (also used as viewport margin)
  singlePosterMargin: number // px
  backgroundColor: string // hex

  // Nav
  navMargin: number // px from viewport edges
  navPadding: number // px inner padding
  navScale: number // 0.5–2 multiplier for nav content size

  // Display
  displayMode: DisplayMode
  liteMode: boolean
  paperCurl: number
  paperAngle: number
  paperCrumple: number
  paperTexture: 'none' | 'light' | 'heavy'

  // Poster style
  borderRadius: number // px

  // Glass effect (nav bar / bottom bar)
  glassRefraction: number  // 0–100
  glassDepth: number       // 0–100
  glassDispersion: number  // 0–100
  glassFrost: number       // 0–100
  glassTint: string        // hex color
  glassTintOpacity: number // 0–100

  // Grid
  columns: number
}

export type TextCase = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'smallcaps'
export type PosterFormat = 'a4-portrait' | 'social-story'

// ── Fonts ───────────────────────────────────────────────────

export interface FontAxis {
  tag: string // e.g. 'wght', 'wdth', 'opsz'
  min: number
  max: number
  default: number
}

export interface FontFamily {
  slug: string
  name: string
  category: 'sans' | 'serif' | 'mono' | 'display'
  variable: boolean
  weights: FontWeight[]
  styles: ('normal' | 'italic')[]
  axes?: FontAxis[]
}

export interface FontWeight {
  name: string
  value: number // CSS 100–900
  file: string // WOFF2 filename
}

// ── API ─────────────────────────────────────────────────────

export interface GenerateMantraRequest {
  tone: number
}

export interface GenerateMantraResponse {
  text: string
}

// ── Color helpers ───────────────────────────────────────────

export const COLOR_SCHEMES: Record<ColorScheme, { bg: string; fg: string }> = {
  'black-on-white': { bg: '#FFFFFF', fg: '#000000' },
  'white-on-black': { bg: '#000000', fg: '#FFFFFF' },
  'neon-on-black': { bg: '#000000', fg: '#BBFF00' },
  'black-on-neon': { bg: '#BBFF00', fg: '#000000' },
}
