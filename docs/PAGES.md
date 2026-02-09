# Page Specifications

## Single Page Architecture

AI Mantras is a single-page application. All views are overlays on the main grid page.

---

## Route: `/` — Main Grid Gallery

### Layout
- Full viewport height
- `AppHeader` fixed top (glass pill: ⓘ | AI MANTRAS | ⊕ ☰)
- `GridSlider` fixed bottom (glass bar with column slider, desktop only)
- Grid of `MantraCard` components filling remaining space

### State
- `columns` — current grid column count (default: 3)
- `mantras` — array of Mantra objects (from Pinia store)
- `selectedMantra` — currently viewed poster (null = grid view)
- `activeOverlay` — 'info' | 'create' | 'settings' | null
- `hydrated` — guards grid rendering until client-side Pinia hydration completes

### Behavior
- On mount: initialize mantra store (seeds 58 mantras if empty), set `hydrated = true`
- Grid columns controlled by bottom slider (desktop)
- Tap poster → open PosterView overlay
- ⓘ tap → open InfoOverlay
- ⊕ tap → open CreateOverlay
- ☰ tap → toggle ControlPanel
- Shift+X → toggle ControlPanel
- Shift+N → open CreateOverlay
- Escape → close any overlay

### SEO / Meta
```html
<title>AI MANTRAS</title>
<meta name="description" content="Typographic poster generator for the AI age...">
<meta property="og:title" content="AI MANTRAS">
<meta property="og:description" content="Bold slogans about AI, creativity, and the future of work.">
```

---

## Overlay: PosterView (tap any poster)

Single poster with taste feedback.
- Blurred backdrop overlay
- Centered MantraCard at full size
- Thumbs up (👍): likes mantra, advances to next poster
- Thumbs down (👎): deletes mantra, saves text as rejected, advances to next
- If no posters remain, closes overlay
- Tap backdrop or press Escape to close

---

## Overlay: Info (ⓘ)

Project information.
- Brief description, artistic references, credits
- Links: Instagram, GitHub
- Close on Escape or click outside

---

## Overlay: Create New (⊕)

Tinder-style mantra generation.
- Calls `/api/generate-mantra` with tone + liked/rejected feedback
- Displays generated mantra as a styled MantraCard
- Swipe or tap thumbs up to accept (adds to collection)
- Swipe or tap thumbs down to reject (saves text, generates next)
- Tone slider (DYSTOPIAN ↔ UTOPIAN) controls generation mood
- Loading state: pulse animation, "GENERATING..." placeholder
- Error state: "GENERATION FAILED. TRY AGAIN."

---

## Overlay: Control Panel (☰ or Shift+X)

Settings panel with live-updating controls.
- Toggle open/close via hamburger icon or Shift+X
- All changes apply immediately
- All settings persisted to localStorage

### Sections
1. **Typography**: Font picker, weight, letter-spacing, line-height, text case
2. **Poster Size**: A4 Portrait / Social Story (9:16)
3. **Color**: Scheme selector + randomize buttons (fixed schemes or harmonic)
4. **Layout**: Viewport margins, grid gap, poster padding, background color
5. **Nav**: Margin, padding, content scale
6. **Poster Style**: Border radius, lite mode toggle, paper effect placeholders
7. **Glass Effect**: Refraction, depth, dispersion, frost, tint color + opacity

---

## Pre-populated Content

On first visit (empty store), 58 seed mantras populate the grid with random fonts and color schemes. Seed data lives in `data/seed-mantras.ts`, sourced from `content/mantra-source.md`.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `☰` (hamburger icon) | Toggle control panel |
| `Shift+X` | Toggle control panel |
| `Shift+N` | Open create new overlay |
| `Escape` | Close any overlay |
| `→` | Accept mantra (in CreateOverlay) |
| `←` | Reject mantra (in CreateOverlay) |
