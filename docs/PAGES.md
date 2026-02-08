# Page Specifications

## Single Page Architecture

AI Mantras is a single-page application. All views are overlays and state changes on the main grid page.

---

## Route: `/` — Main Grid Gallery

### Layout
- Full viewport height
- `AppHeader` sticky top
- `GridSlider` fixed bottom (desktop only)
- Grid of `PosterCard` components filling remaining space

### State
- `columns` — current grid column count (default: 3)
- `mantras` — array of saved Mantra objects (from Pinia store)
- `selectedMantra` — currently selected mantra (null = grid view)
- `activeOverlay` — 'info' | 'create' | 'settings' | null

### Behavior
- On load: read mantras from store, render grid
- If store empty: show seed mantras from `mantra-source.md` (pre-populate with ~20 seed mantras)
- Grid columns controlled by pinch (mobile) or slider (desktop)
- Tap poster → set `selectedMantra` → show `PosterFull`
- ⓘ tap → `activeOverlay = 'info'`
- ⊕ tap → `activeOverlay = 'create'`
- Shift+X → `activeOverlay = 'settings'`
- Escape → close any overlay

### SEO / Meta
```html
<title>AI MANTRAS</title>
<meta name="description" content="Typographic poster generator for the AI age. Inspired by Jenny Holzer, Douglas Coupland, and Anthony Burrill.">
<meta property="og:title" content="AI MANTRAS">
<meta property="og:description" content="Bold slogans about AI, creativity, and the future of work.">
<meta property="og:type" content="website">
```

---

## Overlay: Info (ⓘ)

### Content
```
AI MANTRAS

Short, punchy typographic slogans about AI, creativity, 
and the future of work.

Inspired by Jenny Holzer's Truisms, Douglas Coupland's 
"I Miss My Pre-Internet Brain", and Anthony Burrill's 
typographic prints.

Built by Marc Kremers as a live vibe-coding demo for 
ESMOD Paris.

[Instagram] [GitHub]
```

### Behavior
- Slide in from left
- Backdrop blur
- Close on ✕, click outside, or Escape

---

## Overlay: Create New (⊕)

### Layout
- Full-screen overlay with backdrop blur
- Centered `SwipeCard` showing generated mantra
- `ToneSlider` below card
- Action buttons below slider: ✕ ♥ 🖨 ⬇

### Behavior
1. On open: call `/api/generate-mantra` with current tone
2. Display mantra as styled poster card
3. User swipes right (♥) → save to collection, generate next
4. User swipes left (✕) → discard, generate next
5. User taps 🖨 → print/PDF current card
6. User taps ⬇ → download current card as image
7. Tone slider change → next generation uses new tone value
8. Close on ✕ button or Escape

### Loading State
- While waiting for API: subtle pulse animation on card
- Error state: "GENERATION FAILED. TRY AGAIN." displayed as mantra-style text

---

## Overlay: Control Panel (Shift+X)

### Layout — Desktop
- Slide-in panel from right edge
- Width: 360px
- Full viewport height
- Scrollable content
- Semi-transparent background

### Layout — Mobile
- Slide-up panel from bottom
- Full width
- Max height: 70vh
- Scrollable content
- Handle bar at top for drag-to-close

### Sections (in order)
1. Typography (FontPicker)
2. Poster Size (SizePicker)
3. Color (ColorPicker)
4. Layout (LayoutControls)
5. Poster Style (PaperControls)

### Behavior
- Toggle open/close with Shift+X
- All changes apply immediately (reactive)
- All settings auto-saved to localStorage
- Close on Shift+X or ✕

---

## Pre-populated Content

On first visit (empty store), populate with seed mantras from the "Seed Mantras" section of `mantra-source.md`. This gives the grid an immediate visual impact rather than being empty.

Seed count: ~30 mantras (the hand-written ones from mantra-source.md).

Each gets a random color scheme assignment on first load.
