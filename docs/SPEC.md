# AI Mantras — Full Specification

## Overview

A single-page web app that displays AI-themed typographic poster slogans in a responsive grid gallery. Users can browse, generate new mantras via AI, curate their collection with like/dislike feedback, and customize the visual presentation. The app uses client-side localStorage — each visitor has their own independent collection.

---

## Views & Interactions

### 1. Grid Gallery (Main View)

The primary view. A responsive CSS grid of poster thumbnails.

**Grid behavior:**
- Default: 3 columns
- Desktop: slider at bottom of viewport for column count (1–20)
- Posters ordered reverse-chronologically (newest top-left)
- Grid gap configurable via control panel

**Header (glass pill nav):**
- Left: ⓘ info button
- Center: "AI MANTRAS" title (uses poster font settings, scalable)
- Right: ⊕ create new + ☰ settings hamburger
- Apple Liquid Glass UI effect (refraction, frost, depth, dispersion)

**Bottom bar (glass slider):**
- Grid icon + range slider + column count label
- Same glass effect as header, matched height
- Hidden on mobile (< 768px)

**Poster thumbnails:**
- Pure CSS/font rendering via MantraCard component
- Reference-canvas at 1000px width, scaled to fit grid cell
- Color scheme per poster (4 fixed schemes + harmonic)
- Click/tap opens PosterView overlay

### 2. PosterView (Single Poster)

Full-screen overlay for viewing and curating a single poster.

- Blurred backdrop (tap to close)
- MantraCard centered at large size
- Thumbs up (👍) and thumbs down (👎) centered below poster
- **Thumbs up**: toggles liked status, advances to next poster
- **Thumbs down**: deletes poster (saves text to rejected list for AI feedback), advances to next
- If collection empty after delete, closes overlay
- Escape key closes

### 3. Info Overlay (ⓘ)

Triggered by info icon.

Content:
- Brief project description
- Artistic references (Holzer, Coupland, Burrill)
- "Made by Marc Kremers"
- Links: Instagram, GitHub repo
- Close on Escape or click outside

### 4. Create New Overlay (⊕)

Triggered by plus icon. Tinder-style card generation experience.

**Card display:**
- Shows one freshly AI-generated mantra as a MantraCard
- Random font, weight, and color scheme per generation
- Swipeable via touch drag or mouse drag

**Controls:**
- Thumbs up (👍): accept → add to collection, generate next
- Thumbs down (👎): reject → save text to rejectedTexts, generate next
- Tone slider: DYSTOPIAN ↔ UTOPIAN (affects prompt)

**Taste feedback:**
- Sends `liked` texts (from liked mantras) and `rejected` texts (from deleted/rejected) to API
- AI steers toward liked patterns, away from rejected ones
- Capped at 20 examples each

**Generation:**
- Calls `POST /api/generate-mantra` with tone, liked, rejected
- Server picks random thematic angle + structural constraint for variety
- Temperature: 1.0 for maximum creativity
- Loading: pulse animation, "GENERATING..." text
- Error: "GENERATION FAILED. TRY AGAIN."

### 5. Control Panel (☰ / Shift+X)

Accessible via hamburger menu icon or Shift+X keyboard shortcut.

**Sections:**
1. Typography: font picker, weight, letter-spacing, line-height, text case
2. Poster Size: A4 Portrait / Social Story
3. Color: scheme selector, randomize (fixed or harmonic)
4. Layout: viewport margins, grid gap, poster padding, background color
5. Nav: margin, padding, content scale
6. Poster Style: border radius, lite mode, paper effect placeholders
7. Glass Effect: refraction, depth, dispersion, frost, tint color + opacity

**Behavior:**
- All changes apply immediately (reactive)
- All settings auto-saved to localStorage
- Settings versioning: when defaults change, stale localStorage auto-resets

---

## API Routes

### `POST /api/generate-mantra`

**Request body:**
```json
{
  "tone": 0.5,
  "liked": ["VIBE CODING IS THE NEW LITERACY", "THE TOOL CHANGED. THE TASTE DIDN'T."],
  "rejected": ["SOME BAD MANTRA"]
}
```

**Server behavior:**
1. Import mantra source material (TS string constant, serverless-safe)
2. Pick random thematic angle (20 options) and structural constraint (10 options)
3. Build prompt with tone description, angle, structure, and taste feedback
4. Call Claude API (claude-sonnet-4-5-20250929, temperature 1.0, max_tokens 100)
5. Return single mantra string

**Response:**
```json
{
  "text": "VIBE CODING IS THE NEW LITERACY"
}
```

**Environment:** Requires `ANTHROPIC_API_KEY` in runtime config.

---

## Data Persistence

### Client-side localStorage (via Pinia)

No shared database. Each visitor has independent data.

**Mantras store:**
- `mantras: Mantra[]` — poster collection
- `rejectedTexts: string[]` — deleted texts for AI feedback (max 20)
- `initialized: boolean` — seed data loaded flag

**Settings store:**
- All control panel values
- Auto-versioned via `SETTINGS_VERSION` constant

### Seed data
58 hand-written mantras in `data/seed-mantras.ts`. Loaded on first visit with random fonts and color schemes.

---

## Poster Rendering

### Reference-canvas approach
- MantraCard renders at fixed 1000px width
- CSS `transform: scale()` fits to actual container size
- Text auto-sized via binary search (useAutoSize composable)
- Font loaded via `document.fonts.load()` before measurement
- Text never breaks words, never hyphenates, never reflows on external changes

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Shift+X` | Toggle control panel |
| `Shift+N` | Open create new overlay |
| `Escape` | Close any overlay |
| `→` | Accept mantra (CreateOverlay) |
| `←` | Reject mantra (CreateOverlay) |

---

## Mobile Considerations

- Bottom grid slider hidden on mobile
- Swipe gestures in CreateOverlay (touch drag)
- No hover states — all interactions are tap-based
- Test via USB tether: `npm run dev -- --host` → `http://<mac-ip>:3000`
- crypto.randomUUID fallback for non-HTTPS contexts
