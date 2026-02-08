# AI Mantras — Full Specification

## Overview

A single-page web app that displays AI-themed typographic poster slogans in a responsive grid gallery. Users can browse, generate new mantras via AI, and download posters as images. Mobile-first design modeled after the Apple Photos library UX.

---

## Views & Interactions

### 1. Grid Gallery (Main View)

The primary view. A responsive CSS grid of poster thumbnails.

**Grid behavior:**
- Default: 3 columns
- Pinch-to-zoom (mobile) changes column count
- Desktop: slider at bottom of viewport for zoom level
- Range: 1 column (full-width) to 20+ columns (mosaic)
- At 1 column: download (⬇) and print (🖨) icons visible below each poster
- Posters ordered reverse-chronologically (newest top-left)
- Grid gap is proportional to column count (fewer columns = more gap)

**Header:**
- Center: "AI MANTRAS" title
- Top-left: ⓘ info button
- Top-right: ⊕ create new button

**Poster thumbnails:**
- Pure CSS/font rendering (no images until download)
- Aspect ratio determined by poster size setting (A4 portrait or 9:16)
- Color scheme applied per poster (black/white, white/black, or #BBFF00 combos)
- Click/tap opens single poster view

### 2. Single Poster View

Full-screen display of one poster.

- Poster centered, respecting margin settings
- Swipe left/right or arrow keys to navigate between posters
- Close button (✕) returns to grid
- Actions: download, print, delete
- Background: site background color setting

### 3. Info Overlay (ⓘ)

Triggered by top-left info icon.

Content:
- Brief project description (2-3 sentences)
- Artistic references (Holzer, Coupland, Burrill)
- "Made by Marc Kremers"
- Links: Instagram, GitHub repo
- Close button

### 4. Create New Overlay (⊕)

Triggered by top-right plus icon. Tinder-style card swipe experience.

**Card display:**
- Shows one freshly AI-generated mantra as a poster card
- Card is styled with current typography/color settings

**Controls below card:**
- ✕ Reject (swipe left) — discard and generate next
- ♥ Accept (swipe right) — add to grid collection
- 🖨 Print/save as PDF
- ⬇ Download as hi-res JPG

**Tone slider:**
- Horizontal slider: "DYSTOPIAN" ← → "UTOPIAN"
- Affects the prompt sent to Claude API
- 0 = dystopian, 0.5 = neutral, 1 = utopian

**Generation:**
- Calls `/api/generate-mantra` server route
- Server route sends `mantra-source.md` as context to Claude API
- Tone slider value included in prompt
- Returns a single mantra string

### 5. Control Panel (Shift+X)

Hidden panel toggled by `Shift+X` keyboard shortcut.

**Typography section:**
- Font: dropdown populated from `/assets/fonts/` directory
- Font options: weight, style, variable axes (dynamic per selected font)
- Letter-spacing: slider, default center (0), range negative to positive
- Line-height: slider, default center (0/auto), range tight to loose
- Font-size: AUTO by default — calculates maximum size that fits poster dimensions. Short text = huge type. Long text = smaller type. Always fills the space.
- Case: dropdown — UPPERCASE (default), lowercase, Title Case, Sentence case, Small Caps
- Emoji replacement: toggle ON/OFF — replaces words with emoji equivalents where possible

**Poster size section:**
- Dropdown: A4 Portrait (210×297mm ratio) / Social Story (9:16 ratio)
- Applies to all posters in grid

**Color section:**
- For now: random alternation between 3 schemes:
  - Black text on white background
  - White text on black background
  - #BBFF00 (neon yellow-green) — either as text or background
- Future: full color picker per scheme

**Layout section:**
- Viewport margins (all sides)
- Grid gap (auto-adjusts with column count)
- Single poster margins (presentation view)
- Site background color picker

**Poster style section:**
- "Lite mode" toggle (default OFF) — flat CSS divs, no effects
- 3D paper controls (when lite mode OFF):
  - Curl amount (0–100)
  - Angle/tilt (0–360)
  - Crumple intensity (0–100)
  - Paper texture (none / light / heavy)
- These controls are baked in for future development — placeholder values OK initially

**Persistence:**
- All settings save to localStorage via Pinia store
- Restored on next visit

---

## API Routes

### `POST /api/generate-mantra`

**Request body:**
```json
{
  "tone": 0.5
}
```

**Server behavior:**
1. Read `/content/mantra-source.md`
2. Construct prompt with tone value
3. Call Claude API (claude-sonnet-4-5-20250929)
4. Return single mantra string

**Response:**
```json
{
  "text": "VIBE CODING IS THE NEW LITERACY"
}
```

**Environment:** Requires `ANTHROPIC_API_KEY` in `.env`

---

## Data Persistence

### `data/mantras.json`

Array of saved mantra objects. No database — flat JSON file (or localStorage for client-only mode).

```json
[
  {
    "id": "uuid-v4",
    "text": "PROTECT ME FROM WHAT I PROMPT",
    "createdAt": "2026-02-08T20:00:00Z",
    "tone": 0.3,
    "font": "cooper-hewitt",
    "fontWeight": "heavy",
    "colorScheme": "white-on-black"
  }
]
```

### Settings persistence

All control panel values stored in Pinia with `localStorage` persistence plugin.

---

## Poster Rendering

### Display (screen)
- Pure CSS + web fonts
- `<div>` with text, styled via inline styles from settings
- Auto-sizing: use CSS `clamp()` or JS calculation to maximize font size within poster dimensions

### Export (download)
- Use `html2canvas` or `dom-to-image-more` to render poster div to canvas
- Export as:
  - PNG (transparent background option)
  - JPG (hi-res, 300dpi equivalent)
  - PDF (for print)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Shift+X` | Toggle control panel |
| `Escape` | Close any overlay |
| `←` `→` | Navigate posters in single view |
| `Shift+N` | Open create new overlay |

---

## Mobile Considerations

- Touch: pinch-to-zoom for grid columns
- Swipe: left/right in create new overlay and single poster view
- No hover states — all interactions are tap-based
- Control panel: slide up from bottom on mobile
- Test via USB: `npm run dev -- --host` → access via `http://<mac-ip>:3000`

---

## Performance

- No images loaded until export — everything is CSS text
- Poster grid uses virtual scrolling if collection exceeds ~100 items
- Font loading: subset WOFF2 files, preload active font
- Lazy render: only visible grid cells render full poster styling
