# Tech Stack Specification

## Core Stack

### Framework
- **Nuxt 3** — Vue meta-framework with SSR, file-based routing, API routes
- **Vue 3** — Composition API, reactive UI components
- **TypeScript** — Type safety throughout

### Styling
- **Tailwind CSS** — Utility-first CSS
- **@nuxtjs/tailwindcss** — Nuxt integration

### State Management
- **Pinia** — Settings persistence, mantra collection
- **@pinia/nuxt** — Nuxt integration
- **pinia-plugin-persistedstate** — localStorage persistence for settings

### Utilities
- **@vueuse/nuxt** — Composition utilities (useSwipe, usePinch, useLocalStorage, useKeyboardShortcut)

### AI Generation
- **@anthropic-ai/sdk** — Claude API for mantra generation (server-side only)

### Image Export
- **dom-to-image-more** — Render CSS poster to high-res image for download
- Alternative: **html2canvas** if dom-to-image has issues

### Swipe UX (Create New Overlay)
- Research needed. Candidates:
  - **@vueuse/gesture** — Vue 3 gesture recognition
  - **vue3-card-swiper** — Tinder-style card component
  - Custom implementation using touch events + CSS transforms

### Grid Gallery
- Custom CSS Grid implementation with:
  - **@vueuse/gesture** for pinch-to-zoom (mobile)
  - CSS `grid-template-columns: repeat(var(--cols), 1fr)` dynamic columns
  - Intersection Observer for virtualized rendering

### 3D Paper Effects (Future)
- CSS 3D transforms for basic curl/tilt
- Optional: **Three.js** for advanced paper simulation
- For now: CSS `perspective`, `rotateX/Y`, `box-shadow` for depth

### Glass UI (Optional)
- CSS `backdrop-filter: blur()` + `background: rgba()`
- Apple Liquid Glass aesthetic via layered translucency
- No external library needed — pure CSS

---

## Dependencies (package.json)

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@pinia/nuxt": "^0.11.3",
    "@vueuse/nuxt": "^14.1.0",
    "dom-to-image-more": "^3.4.5",
    "nuxt": "^3.15.0",
    "pinia-plugin-persistedstate": "^4.2.0",
    "uuid": "^11.0.0",
    "vue": "^3.5.0",
    "vue-router": "^4.6.0"
  }
}
```

---

## nuxt.config.ts

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-02-08',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'AI MANTRAS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Typographic poster generator for the AI age' },
      ],
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
})
```

---

## Fonts

### Two Concerns

1. **Site UI Font** — Inter or system-ui for interface elements
2. **Poster Display Fonts** — 29 WOFF2 families from `/assets/fonts/` for poster typography

### Font Loading Strategy

- Declare all font-faces in `/assets/css/fonts.css`
- Only load the currently selected poster font (via dynamic `@font-face` or CSS class)
- Preload the default font (Cooper Hewitt Heavy or Nimbus Sans Bold)

### Key Poster Fonts

| Font | Category | Vibe | Variable |
|------|----------|------|----------|
| Cooper Hewitt Heavy | Sans | Museum/institutional | No |
| Nimbus Sans Bold | Sans | Helvetica-like, Holzer energy | No |
| League Gothic | Sans condensed | Burrill letterpress feel | Yes |
| Oswald | Sans condensed | Bold display | Yes |
| Poppins Black | Sans | Modern geometric | No |
| Aileron Heavy | Sans | Clean Swiss | No |
| Bluu Next Bold | Serif | Editorial | No |
| Terminal Grotesque | Display | Edgy/experimental | No |

---

## Environment Variables

```env
# Claude API (server-side only)
ANTHROPIC_API_KEY=sk-ant-...

# App
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Hosting

- **Vercel** — Nuxt 3 preset, automatic deployment from GitHub
- **GitHub** — FutureCorpLTD/ai-mantras

### Vercel Config

The Vercel import detected Nuxt framework. Ensure:
1. `package.json` exists with dependencies
2. `nuxt.config.ts` exists
3. Build command: `nuxt build` (auto-detected)
4. Output directory: `.output` (auto-detected)
5. Add `ANTHROPIC_API_KEY` to Vercel environment variables
