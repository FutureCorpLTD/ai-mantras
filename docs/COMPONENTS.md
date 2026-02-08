# Component Specifications

## Layout Components

### AppHeader.vue
Top bar with title and action buttons.
- Center: "AI MANTRAS" in site UI font
- Left: `<InfoButton />` (ⓘ icon)
- Right: `<CreateButton />` (⊕ icon)
- Sticky top, translucent background (glass effect if enabled)

### GridSlider.vue
Desktop zoom slider at bottom of viewport.
- Horizontal slider controlling column count (1–20+)
- Shows current column count label
- Fixed bottom, subtle design
- Hidden on mobile (replaced by pinch-to-zoom)

## Poster Components

### PosterCard.vue
Single poster thumbnail in the grid.
- Props: `mantra: Mantra`, `settings: Settings`
- Renders text with applied font, color, case settings
- Auto-sizes text to fill poster dimensions
- Click emits `select` event
- At 1-column view: shows download/print action bar below

### PosterFull.vue
Full-screen single poster view.
- Props: `mantra: Mantra`, `settings: Settings`
- Centered poster with margins from settings
- Navigation: prev/next arrows, swipe support
- Action bar: download, print, delete, close
- Escape key closes

### PosterRenderer.vue
Invisible component for export rendering.
- Takes a mantra and settings, renders a poster div at export resolution
- Used by `dom-to-image` to generate downloadable image
- Not visible to user

## Overlay Components

### InfoOverlay.vue
Project information panel.
- Triggered by ⓘ button
- Content: project description, artistic references, credits
- Links: Instagram, GitHub
- Slide-in animation from left
- Close on click outside or ✕ button

### CreateOverlay.vue
Mantra generation and swiping interface.
- Triggered by ⊕ button
- Contains: `<SwipeCard />`, tone slider, action buttons
- Full-screen overlay with backdrop blur
- Close on escape or ✕

### SwipeCard.vue
Tinder-style swipeable card displaying a generated mantra.
- Touch/drag to swipe left (reject) or right (accept)
- Spring animation on release
- Stacked card illusion (next card visible behind)
- Emits: `accept`, `reject`, `print`, `download`

### ToneSlider.vue
Dystopian ↔ Utopian slider.
- Range input 0–1
- Labels: "DYSTOPIAN" left, "UTOPIAN" right
- Emits `change` with tone value
- Affects next generated mantra

## Control Panel Components

### ControlPanel.vue
Settings panel toggled by Shift+X.
- Desktop: slide-in from right
- Mobile: slide-up from bottom
- Contains all settings sections as child components
- Close on Shift+X or ✕

### FontPicker.vue
Font selection and typography controls.
- Dropdown populated from font catalog
- Dynamic weight/style options per font
- Variable axis sliders (if variable font)
- Letter-spacing slider (centered at 0)
- Line-height slider (centered at auto)
- Text case dropdown
- Emoji replacement toggle

### SizePicker.vue
Poster format selector.
- Dropdown: A4 Portrait / Social Story (9:16)

### ColorPicker.vue
Color scheme controls.
- Mode selector: Auto (random), Black on White, White on Black, Neon
- Background color picker for site

### LayoutControls.vue
Spacing and margin controls.
- Viewport margins slider
- Grid gap slider
- Single poster margins slider

### PaperControls.vue
3D paper effect settings.
- Lite mode toggle
- Curl, angle, crumple sliders
- Texture dropdown

## Composables

### useAutoSize.ts
Calculates optimal font size for a given text, poster dimensions, and font.
- Takes: text string, container width/height, font family, font weight
- Returns: computed font-size in px
- Strategy: binary search or iterative measurement

### usePinchZoom.ts
Touch pinch gesture to control grid columns.
- Uses @vueuse/gesture or custom touch events
- Maps pinch scale to column count
- Emits column count changes

### useSwipeGesture.ts
Swipe gesture handler for cards and navigation.
- Touch start/move/end tracking
- Velocity calculation for fling detection
- Direction detection (left/right/up/down)

### useExport.ts
Poster export to image/PDF.
- `exportAsImage(element, format, quality)` → Blob
- `downloadImage(blob, filename)`
- `printPoster(element)`

### useFonts.ts
Font catalog management.
- Reads font directory metadata
- Provides font list for dropdown
- Handles dynamic font loading
- Detects variable font axes

### useMantraStore.ts
Pinia store for mantra collection.
- State: mantras array, loading flag
- Actions: add, remove, reorder
- Persisted to localStorage

### useSettingsStore.ts
Pinia store for all settings.
- State: full Settings interface
- Actions: update individual settings, reset to defaults
- Persisted to localStorage
