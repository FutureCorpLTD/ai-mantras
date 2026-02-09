# Data Models

## TypeScript Interfaces

### Mantra

```typescript
interface Mantra {
  id: string              // UUID or random hex (fallback for non-HTTPS)
  text: string            // The mantra text (always stored uppercase)
  createdAt: string       // ISO 8601 datetime
  tone: number            // 0 (dystopian) to 1 (utopian)
  font: string            // Font family slug (e.g., 'cooper-hewitt')
  fontWeight: string      // Font weight (e.g., '700', '800', '900')
  colorScheme: ColorScheme
  // Custom colors for 'harmonic' scheme
  harmonicBg?: string     // Hex background color
  harmonicFg?: string     // Hex foreground color
  // Taste feedback
  liked?: boolean         // User explicitly liked this mantra
}

type ColorScheme = 'black-on-white' | 'white-on-black' | 'neon-on-black' | 'black-on-neon' | 'harmonic'
```

### Settings (Control Panel)

```typescript
interface Settings {
  // Typography
  font: string            // Active poster font slug (or 'random')
  fontWeight: string      // Active weight
  fontStyle: 'normal' | 'italic'
  letterSpacing: number   // em units, 0 = default
  lineHeight: number      // multiplier, 1.1 = default
  textCase: TextCase
  emojiReplace: boolean

  // Poster size
  posterFormat: PosterFormat

  // Color
  colorMode: 'auto' | ColorScheme

  // Poster inner padding
  posterPadding: number   // % of poster dimension

  // Layout
  viewportMargin: number  // px
  gridGap: number         // px base
  singlePosterMargin: number // px
  backgroundColor: string // hex

  // Nav
  navMargin: number       // px from viewport edges
  navPadding: number      // px inner padding
  navScale: number        // 0.5–2 multiplier for nav content size

  // Display
  displayMode: DisplayMode
  liteMode: boolean
  paperCurl: number       // 0–100
  paperAngle: number      // 0–360
  paperCrumple: number    // 0–100
  paperTexture: 'none' | 'light' | 'heavy'

  // Poster style
  borderRadius: number    // px

  // Glass effect (nav bar / bottom bar)
  glassRefraction: number  // 0–100
  glassDepth: number       // 0–100
  glassDispersion: number  // 0–100
  glassFrost: number       // 0–100
  glassTint: string        // hex color
  glassTintOpacity: number // 0–100

  // Grid
  columns: number         // Current column count (1–20)
}

type TextCase = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'smallcaps'
type PosterFormat = 'a4-portrait' | 'social-story'
type DisplayMode = 'poster' | 'kinetic'
```

### Font Metadata

```typescript
interface FontFamily {
  slug: string
  name: string
  category: 'sans' | 'serif' | 'mono' | 'display'
  variable: boolean
  weights: FontWeight[]
  styles: ('normal' | 'italic')[]
}

interface FontWeight {
  name: string
  value: number           // CSS 100–900
  file: string            // WOFF2 filename
}
```

### API Types

```typescript
// POST /api/generate-mantra
interface GenerateMantraRequest {
  tone: number            // 0–1
  liked?: string[]        // Texts user loved (positive examples, max 20)
  rejected?: string[]     // Texts user deleted (negative examples, max 20)
}

interface GenerateMantraResponse {
  text: string            // The generated mantra
}
```

## Data Storage

### Client-side only (localStorage via Pinia)

All data persists in the browser's localStorage. No shared database. Each visitor has an independent collection.

**Mantras store:**
- `mantras: Mantra[]` — the poster collection
- `initialized: boolean` — whether seed mantras have been loaded
- `rejectedTexts: string[]` — deleted mantra texts for AI feedback (capped at 20)

**Settings store:**
- All Settings interface fields
- Auto-versioned: `SETTINGS_VERSION` constant triggers reset when defaults change

### Seed data

On first visit (empty store), 58 seed mantras from `data/seed-mantras.ts` populate the grid with random fonts and color schemes.
