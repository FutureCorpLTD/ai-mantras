# Data Models

## TypeScript Interfaces

### Mantra

```typescript
interface Mantra {
  id: string              // UUID v4
  text: string            // The mantra text (always stored uppercase)
  createdAt: string       // ISO 8601 datetime
  tone: number            // 0 (dystopian) to 1 (utopian)
  font: string            // Font family slug (e.g., 'cooper-hewitt')
  fontWeight: string      // Font weight (e.g., 'heavy', 'bold', '700')
  colorScheme: ColorScheme
}

type ColorScheme = 'black-on-white' | 'white-on-black' | 'neon-on-black' | 'black-on-neon'
```

### Settings (Control Panel)

```typescript
interface Settings {
  // Typography
  font: string            // Active poster font slug
  fontWeight: string      // Active weight
  fontStyle: string       // 'normal' | 'italic'
  letterSpacing: number   // em units, 0 = default, negative/positive
  lineHeight: number      // multiplier, 1.1 = default
  textCase: TextCase
  emojiReplace: boolean   // Replace words with emoji equivalents

  // Poster size
  posterFormat: PosterFormat

  // Color
  colorMode: 'auto' | 'black-on-white' | 'white-on-black' | 'neon'

  // Layout
  viewportMargin: number  // px
  gridGap: number         // px base (scales with column count)
  singlePosterMargin: number // px
  backgroundColor: string // hex

  // Poster style
  liteMode: boolean       // Flat CSS (default OFF)
  paperCurl: number       // 0–100
  paperAngle: number      // 0–360
  paperCrumple: number    // 0–100
  paperTexture: 'none' | 'light' | 'heavy'

  // Grid
  columns: number         // Current column count (1–20+)
}

type TextCase = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'smallcaps'
type PosterFormat = 'a4-portrait' | 'social-story'
```

### Font Metadata

```typescript
interface FontFamily {
  slug: string            // Folder name (e.g., 'cooper-hewitt')
  name: string            // Display name (e.g., 'Cooper Hewitt')
  category: 'sans' | 'serif' | 'mono' | 'display'
  variable: boolean       // Is it a variable font?
  weights: FontWeight[]   // Available weights
  styles: FontStyle[]     // Available styles
  axes?: VariableAxis[]   // Variable font axes (if variable)
}

interface FontWeight {
  name: string            // e.g., 'Heavy', 'Bold', 'Regular'
  value: number           // CSS weight value (100–900)
  file: string            // WOFF2 filename
}

interface FontStyle {
  name: string            // 'Normal' | 'Italic'
  value: string           // 'normal' | 'italic'
}

interface VariableAxis {
  tag: string             // e.g., 'wght', 'wdth', 'opsz'
  name: string            // e.g., 'Weight', 'Width'
  min: number
  max: number
  default: number
}
```

### API Types

```typescript
// POST /api/generate-mantra
interface GenerateMantraRequest {
  tone: number            // 0–1
}

interface GenerateMantraResponse {
  text: string            // The generated mantra
}
```

## Data Storage

### mantras.json (or localStorage)

```json
{
  "mantras": [
    {
      "id": "a1b2c3d4-...",
      "text": "VIBE CODING IS THE NEW LITERACY",
      "createdAt": "2026-02-08T20:00:00.000Z",
      "tone": 0.5,
      "font": "cooper-hewitt",
      "fontWeight": "heavy",
      "colorScheme": "white-on-black"
    }
  ]
}
```

For the initial build, mantras are stored in Pinia (persisted to localStorage). No server-side JSON file needed unless we want mantras to persist across deployments, in which case we'd add a simple JSON read/write API route or use Vercel KV.
