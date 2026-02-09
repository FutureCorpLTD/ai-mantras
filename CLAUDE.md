# AI Mantras

Typographic poster generator for AI-era slogans. "Jenny Holzer meets Douglas Coupland for the AI age."

## Tech Stack
- Nuxt 3.21 / Vue 3.5 / TypeScript
- Tailwind CSS
- Pinia 2 (state + localStorage persistence via pinia-plugin-persistedstate v3)
- Claude API (mantra generation via server route, claude-sonnet-4-5-20250929)
- colord (harmonious color generation with a11y plugin)
- Local WOFF2 fonts (29 families in `/assets/fonts/`)

## Project Structure
```
/assets/fonts/       → 29 WOFF2 font families (poster typography)
/assets/css/         → Tailwind + global styles + font-face declarations
/components/         → Vue components (AppHeader, MantraCard, PosterView, etc.)
/composables/        → Composition functions (useAutoSize, useLiquidGlass, etc.)
/content/            → mantra-source.md (seed content for AI generation)
/data/               → font-catalog.ts, seed-mantras.ts
/docs/               → Specifications
/pages/              → File-based routing (single page: index.vue)
/plugins/            → Pinia persistence plugin with versioned settings
/server/api/         → Claude API route for mantra generation
/server/utils/       → mantra-source.ts (bundled source material for serverless)
/stores/             → Pinia stores (settings, mantras)
/types/              → TypeScript interfaces
```

## Key Documentation
- `/docs/SPEC.md` — Full feature specification
- `/docs/TECH-STACK.md` — Technology decisions
- `/docs/DATA-MODELS.md` — TypeScript interfaces
- `/docs/COMPONENTS.md` — Component specs
- `/docs/PAGES.md` — Page/route specs
- `/content/mantra-source.md` — Seed mantras + generation rules

## Font Catalog
29 open-source WOFF2 fonts in `/assets/fonts/`, catalogued in `/data/font-catalog.ts`.
Key poster fonts: Cooper Hewitt (heavy), League Gothic, Oswald, Nimbus Sans (Helvetica-like), Aileron, Poppins.
Variable fonts: Inter, Work Sans, Roboto, Archivo, Oswald, League Gothic, EB Garamond.

## Routes
```
/                    → Grid gallery (main view, single-page app)
POST /api/generate-mantra → AI mantra generation endpoint
```

## Key Features
- Responsive grid gallery (1–20 columns, desktop slider)
- Tinder-style swipe to generate/accept/reject new mantras with thumbs up/down
- Taste feedback: liked/deleted mantras steer AI generation via few-shot prompting
- Claude API generates mantras with random thematic angles + structural constraints
- Tone slider: dystopian ↔ utopian
- Apple Liquid Glass UI effect on nav bar and grid slider
- Posters are pure CSS/fonts — reference-canvas rendering at 1000px width
- Settings persist via Pinia + localStorage with auto-versioning
- 58 seed mantras from mantra-source.md
- Harmonic color generation via colord

## Architecture Decisions
- **Renderer-agnostic**: Mantra is the data, poster is one renderer. `DisplayMode` type for future renderers.
- **Reference-canvas rendering**: MantraCard renders at fixed 1000px width, CSS `transform: scale()` fits to display. Text layout computed ONCE, immune to grid gap/resize.
- **Client-side persistence only**: All data in localStorage. No shared database. Each visitor has independent collection.
- **Serverless-safe source material**: Mantra source exported as TS string constant in `server/utils/` (not filesystem reads).
- **Settings versioning**: `SETTINGS_VERSION` constant — when bumped, plugin auto-wipes stale localStorage.

## Nav & Controls
- **Top nav**: Info (ⓘ) | "AI MANTRAS" title | Create (⊕) + Settings (☰)
- **Bottom bar**: Grid column slider (desktop only)
- **Control Panel**: opened via ☰ hamburger or Shift+X
- Both bars use liquid glass effect with configurable refraction, depth, dispersion, frost, tint

## Conventions
- Composition API with `<script setup lang="ts">`
- Scoped CSS (not Tailwind utilities in templates)
- Components: PascalCase (MantraCard.vue)
- Composables: useCamelCase (useAutoSize.ts)
- BEM-style class naming within components

## Hosting
- GitHub: FutureCorpLTD/ai-mantras (main branch)
- Vercel: https://ai-mantras-theta.vercel.app/

## Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-...
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Dev Server
```bash
npm run dev          # localhost:3000
npm run dev -- --host # 0.0.0.0:3000 (for phone testing via USB tether)
```
