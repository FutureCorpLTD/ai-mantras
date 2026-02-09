# Tech Stack Specification

## Core Stack

### Framework
- **Nuxt 3.21** — Vue meta-framework with SSR, file-based routing, API routes
- **Vue 3.5** — Composition API, reactive UI components
- **TypeScript** — Type safety throughout

### Styling
- **Tailwind CSS** — Utility-first CSS
- **@nuxtjs/tailwindcss** — Nuxt integration
- Scoped CSS within components (BEM-style class naming)

### State Management
- **Pinia 2** — Settings persistence, mantra collection
- **@pinia/nuxt 0.9** — Nuxt integration
- **pinia-plugin-persistedstate 3.x** — localStorage persistence (registered via manual plugin, not Nuxt module)
- Settings versioning: `SETTINGS_VERSION` constant auto-resets stale localStorage

### Color
- **colord** — Harmonious color pair generation (~3.2KB)
- Plugins: harmonies, a11y (WCAG contrast checking)

### AI Generation
- **@anthropic-ai/sdk** — Claude API for mantra generation (server-side only)
- Model: claude-sonnet-4-5-20250929, temperature 1.0
- Source material bundled as TS string constant in `server/utils/` (serverless-safe)

### Swipe UX
- Custom implementation using touch events + mouse events + CSS transforms
- No external gesture library needed

### Grid Gallery
- CSS Grid with `grid-template-columns: repeat(N, 1fr)` dynamic columns
- Desktop: range slider for column count (1–20)

### Glass UI
- Apple Liquid Glass effect — custom composable (`useLiquidGlass`)
- SVG displacement map for refraction (Chrome)
- `backdrop-filter: blur()` for frost (all browsers)
- CSS gradients for depth + rim light
- Box-shadow for chromatic dispersion
- Fully configurable: refraction, depth, dispersion, frost, tint

---

## Dependencies (package.json)

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@pinia/nuxt": "^0.9.0",
    "colord": "^2.9.3",
    "nuxt": "^3.21.0",
    "pinia-plugin-persistedstate": "^3.2.3",
    "vue": "^3.5.0"
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
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
      ],
    },
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

1. **Material Symbols** — Google Material Symbols Outlined for UI icons
2. **Poster Display Fonts** — 29 WOFF2 families from `/assets/fonts/` for poster typography

### Font Loading Strategy

- All 29 font-faces declared in `/assets/css/fonts.css`
- All fonts loaded at page load (WOFF2 files are small)
- Font catalog in `/data/font-catalog.ts` maps slugs to CSS names
- `document.fonts.load()` called before text measurement in auto-sizer

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

- **Vercel** — https://ai-mantras-theta.vercel.app/
- **GitHub** — FutureCorpLTD/ai-mantras (main branch)

### Vercel Config

Nuxt framework auto-detected. Key points:
1. Build command: `nuxt build` (auto-detected)
2. Output directory: `.output` (auto-detected)
3. `ANTHROPIC_API_KEY` set in Vercel environment variables
4. Source material bundled as TS string (not filesystem reads — `readFileSync` and `?raw` imports don't work in Nitro serverless)

### Dev Server

```bash
npm run dev            # localhost:3000
npm run dev -- --host  # 0.0.0.0:3000 (phone testing via USB tether)
```
