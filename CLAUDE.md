# AI Mantras

Typographic poster generator for AI-era slogans. "Jenny Holzer meets Douglas Coupland for the AI age."

## Tech Stack
- Nuxt 3 / Vue 3 / TypeScript
- Tailwind CSS
- Pinia (state + persistence)
- Claude API (mantra generation via server route)
- Local WOFF2 fonts (29 families in `/assets/fonts/`)

## Project Structure
```
/assets/fonts/       → 29 WOFF2 font families (poster typography)
/assets/css/         → Tailwind + global styles + font-face declarations
/components/         → Vue components
/composables/        → Composition functions
/content/            → mantra-source.md (seed content for AI generation)
/data/               → mantras.json (saved poster collection)
/docs/               → Specifications
/layouts/            → Page layouts
/pages/              → File-based routing
/server/api/         → Claude API route for mantra generation
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
29 open-source WOFF2 fonts in `/assets/fonts/`. These are the poster display fonts.
Key poster fonts: Cooper Hewitt (heavy), League Gothic, Oswald, Nimbus Sans (Helvetica-like), Aileron, Poppins.
Variable fonts available: Inter, Work Sans, Roboto, Archivo, Oswald, League Gothic, EB Garamond.

## Routes
```
/                    → Grid gallery (main view)
```

Single page app. Overlays for: info (ⓘ), create new (⊕), single poster view, control panel (Shift+X).

## Key Features
- Apple Photos–style responsive grid (1–20+ columns, pinch-to-zoom on mobile)
- Tinder-style swipe to generate/accept/reject new mantras
- Claude API generates mantras from mantra-source.md context
- Tone slider: dystopian ↔ utopian
- Posters are pure CSS/fonts — only rendered to image on download
- Settings persist via Pinia + localStorage
- 3D paper effect engine (curl, crumple, texture) — toggle-able

## Conventions
- Composition API with `<script setup lang="ts">`
- Tailwind for all styling
- Components: PascalCase (PosterCard.vue)
- Composables: useCamelCase (useSettings.ts)
- Mobile-first responsive design

## Hosting
- GitHub: FutureCorpLTD/ai-mantras
- Vercel: TBD (Nuxt preset)

## Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-...
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```
