# Component Specifications

## Layout Components

### AppHeader.vue
Glass-effect navigation pill, fixed top.
- Left: Info button (ⓘ Material Symbol)
- Center: "AI MANTRAS" title (uses poster font settings)
- Right: Create button (⊕) + Settings hamburger (☰)
- Apple Liquid Glass effect (refraction, frost, depth, dispersion, rim light)
- Scales content with `navScale` setting
- Emits: `info`, `create`, `settings`

### GridSlider.vue
Glass-effect column slider, fixed bottom (desktop only).
- Grid icon + range input (1–20 columns) + count label
- Same liquid glass effect as AppHeader
- Hidden on mobile (< 768px)
- Height matches AppHeader via shared padding/icon size

## Poster Components

### MantraCard.vue
The core poster renderer — used everywhere (grid, overlays, poster view).
- Props: `mantra: Mantra`, `interactive?: boolean`, `index?: number`
- Reference-canvas rendering: renders at fixed 1000px width, CSS `transform: scale()` fits container
- Auto-sizes text via binary search (useAutoSize composable)
- Waits for font loading before measuring (`document.fonts.load()`)
- Color scheme applied from mantra data (including harmonic custom colors)
- Text never breaks words, never hyphenates
- Click emits `select` when `interactive` is true

### PosterView.vue
Full-screen single poster overlay with taste feedback.
- Blurred backdrop, tap background to close
- Centered MantraCard
- Thumbs up (👍) and thumbs down (👎) below poster
- Thumbs up: likes mantra, advances to next
- Thumbs down: deletes mantra (saves text as rejected), advances to next
- Keyboard: Escape to close
- Emits: `close`, `navigate`

### CreateOverlay.vue
Tinder-style mantra generation overlay.
- Blurred backdrop, tap background to close
- Swipeable MantraCard (touch drag + mouse drag)
- Swipe right (> 80px) = accept, swipe left = reject
- Tone slider: DYSTOPIAN ↔ UTOPIAN (0–1)
- Thumbs up (👍) accepts → adds to collection, generates next
- Thumbs down (👎) rejects → saves to rejectedTexts, generates next
- Pulse animation during loading
- Sends liked/rejected texts to API for taste-based generation
- Keyboard: Escape to close, Arrow keys to accept/reject

## Overlay Components

### InfoOverlay.vue
Project information panel.
- Project description, artistic references, credits
- Links: Instagram, GitHub
- Close on Escape or click outside

### ControlPanel.vue
Full settings panel with all controls.
- Opened via hamburger menu (☰) or Shift+X
- Sections: Typography, Poster Size, Color, Layout, Nav, Poster Style, Glass Effect
- All changes apply immediately (reactive)
- All settings auto-saved to localStorage

## Composables

### useAutoSize.ts
Calculates optimal font size for text within poster dimensions.
- Binary search algorithm measuring with a hidden DOM element
- Async: waits for `document.fonts.load()` before measuring
- Returns reactive `fontSize` ref

### useLiquidGlass.ts
Apple Liquid Glass effect engine.
- SVG displacement map for refraction (Chrome)
- Backdrop-filter blur for frost (all browsers)
- CSS gradient for depth (convex lens)
- Box-shadow for chromatic aberration (dispersion)
- Rim light gradient
- Returns: `svgMarkup`, `glassBackdropFilter`, `dispersionStyle`

### useColorHarmony.ts
Harmonious color pair generation using colord.
- `generateHarmonicPair()` — random harmony (complementary, triadic, analogous, etc.)
- Ensures WCAG AA contrast (4.5:1 minimum)
- Falls back to high-contrast if harmony doesn't meet threshold

### useFonts.ts
Font family resolution from the font catalog.
- `getFontFamily(slug)` — returns CSS font-family string
- Maps slugs to their proper CSS names
