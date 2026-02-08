# AI MANTRAS

Typographic poster generator for the AI age.

Bold, punchy slogans about AI, creativity, and the future of work — displayed as a grid gallery of posters you can browse, generate, and download. Inspired by Jenny Holzer's *Truisms*, Douglas Coupland's "I Miss My Pre-Internet Brain", and Anthony Burrill's typographic prints.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

To test on your phone (connected via USB), use:
```bash
npm run dev -- --host
```

Then open `http://<your-mac-ip>:3000` on your phone.

## Stack

- **Nuxt 3** + Vue 3 + TypeScript
- **Tailwind CSS** — Styling
- **Pinia** — State management + persistence
- **Claude API** — AI-powered mantra generation
- **Local WOFF2 Fonts** — 29 open-source families

## How It Works

1. Browse a grid gallery of AI-themed typographic posters
2. Pinch/zoom to change grid columns (1–20+), like Apple Photos
3. Tap any poster to see it full-screen
4. Hit ⊕ to generate new mantras via Claude API — swipe right to keep, left to reject
5. Adjust tone from dystopian to utopian with a slider
6. Download any poster as a hi-res image
7. Customize typography, colors, and poster style via the control panel (Shift+X)

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

- **Repo:** https://github.com/FutureCorpLTD/ai-mantras
- **Live:** TBD (Vercel)
- **Author:** Marc Kremers — [@marckremers](https://instagram.com/marckremers)
