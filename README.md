# AI MANTRAS

Typographic poster generator for the AI age.

Bold, punchy slogans about AI, creativity, and the future of work — displayed as a grid gallery of posters you can browse, generate, and curate. Inspired by Jenny Holzer's *Truisms*, Douglas Coupland's "I Miss My Pre-Internet Brain", and Anthony Burrill's typographic prints.

## Live

**https://ai-mantras-theta.vercel.app/**

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

To test on your phone (connected via USB tether):
```bash
npm run dev -- --host
```
Then open `http://<your-mac-ip>:3000` on your phone.

## Stack

- **Nuxt 3** + Vue 3 + TypeScript
- **Tailwind CSS** — Styling
- **Pinia** — State management + localStorage persistence
- **Claude API** — AI-powered mantra generation (claude-sonnet-4-5-20250929)
- **colord** — Harmonious color generation
- **Local WOFF2 Fonts** — 29 open-source families

## How It Works

1. Browse a grid gallery of AI-themed typographic posters
2. Use the bottom slider to change grid columns (1–20)
3. Tap any poster to see it full-screen
4. Thumbs up to keep, thumbs down to delete — your feedback trains the AI
5. Hit ⊕ to generate new mantras — swipe/tap to accept or reject
6. Adjust tone from dystopian to utopian with a slider
7. Open ☰ to customize typography, colors, layout, and glass effects

## Data & Privacy

All poster data lives in your browser's localStorage. There is no shared database — each visitor gets their own independent collection. Nobody can see or modify your posters.

## Context

Built for an ESMOD Paris masterclass on "AI's Impact on Fashion Recruitment" — a live vibe-coding demo that is also the artwork itself.

## Docs

Full specifications in `/docs/`:
- SPEC.md — Feature specification
- TECH-STACK.md — Technology decisions
- DATA-MODELS.md — TypeScript interfaces
- COMPONENTS.md — Component specs
- PAGES.md — Page/route specs

Mantra seed content in `/content/mantra-source.md`

## Links

- **Live:** https://ai-mantras-theta.vercel.app/
- **Repo:** https://github.com/FutureCorpLTD/ai-mantras
- **Author:** Marc Kremers — [@marckremers](https://instagram.com/marckremers)
