import type { FontFamily } from '~/types'

export const fontCatalog: FontFamily[] = [
  // ── Heavy hitters (poster display) ──────────────────────
  {
    slug: 'cooper-hewitt',
    name: 'Cooper Hewitt',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Thin', value: 100, file: 'cooperhewitt-thin.woff2' },
      { name: 'Light', value: 300, file: 'cooperhewitt-light.woff2' },
      { name: 'Book', value: 400, file: 'cooperhewitt-book.woff2' },
      { name: 'Medium', value: 500, file: 'cooperhewitt-medium.woff2' },
      { name: 'Semibold', value: 600, file: 'cooperhewitt-semibold.woff2' },
      { name: 'Bold', value: 700, file: 'cooperhewitt-bold.woff2' },
      { name: 'Heavy', value: 900, file: 'cooperhewitt-heavy.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'league-gothic',
    name: 'League Gothic',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'league-gothic-variable.woff2' },
    ],
    styles: ['normal'],
    axes: [
      { tag: 'wdth', min: 75, max: 100, default: 100 },
    ],
  },
  {
    slug: 'oswald',
    name: 'Oswald',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'oswald-variable.woff2' },
    ],
    styles: ['normal'],
    axes: [
      { tag: 'wght', min: 200, max: 700, default: 400 },
    ],
  },
  {
    slug: 'aileron',
    name: 'Aileron',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Thin', value: 100, file: 'aileron-thin.woff2' },
      { name: 'UltraLight', value: 200, file: 'aileron-ultralight.woff2' },
      { name: 'Light', value: 300, file: 'aileron-light.woff2' },
      { name: 'Regular', value: 400, file: 'aileron-regular.woff2' },
      { name: 'Semibold', value: 600, file: 'aileron-semibold.woff2' },
      { name: 'Bold', value: 700, file: 'aileron-bold.woff2' },
      { name: 'Heavy', value: 800, file: 'aileron-heavy.woff2' },
      { name: 'Black', value: 900, file: 'aileron-black.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'poppins',
    name: 'Poppins',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Thin', value: 100, file: 'poppins-thin.woff2' },
      { name: 'ExtraLight', value: 200, file: 'poppins-extralight.woff2' },
      { name: 'Light', value: 300, file: 'poppins-light.woff2' },
      { name: 'Regular', value: 400, file: 'poppins-regular.woff2' },
      { name: 'Medium', value: 500, file: 'poppins-medium.woff2' },
      { name: 'Semibold', value: 600, file: 'poppins-semibold.woff2' },
      { name: 'Bold', value: 700, file: 'poppins-bold.woff2' },
      { name: 'ExtraBold', value: 800, file: 'poppins-extrabold.woff2' },
      { name: 'Black', value: 900, file: 'poppins-black.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'nimbus-sans',
    name: 'Nimbus Sans',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'nimbus-sans-regular.woff2' },
      { name: 'Bold', value: 700, file: 'nimbus-sans-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'inter',
    name: 'Inter',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'inter-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
      { tag: 'opsz', min: 14, max: 32, default: 14 },
    ],
  },
  {
    slug: 'work-sans',
    name: 'Work Sans',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'work-sans-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
    ],
  },
  {
    slug: 'archivo',
    name: 'Archivo',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'archivo-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
      { tag: 'wdth', min: 62, max: 125, default: 100 },
    ],
  },
  {
    slug: 'roboto',
    name: 'Roboto',
    category: 'sans',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'roboto-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
      { tag: 'wdth', min: 75, max: 100, default: 100 },
    ],
  },
  {
    slug: 'liberation-sans',
    name: 'Liberation Sans',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'liberation-sans-regular.woff2' },
      { name: 'Bold', value: 700, file: 'liberation-sans-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'tex-gyre-heros',
    name: 'TeX Gyre Heros',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'tex-gyre-heros-regular.woff2' },
      { name: 'Bold', value: 700, file: 'tex-gyre-heros-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'gap-sans',
    name: 'Gap Sans',
    category: 'sans',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'gap-sans-regular.woff2' },
      { name: 'Bold', value: 700, file: 'gap-sans-bold.woff2' },
      { name: 'Black', value: 900, file: 'gap-sans-black.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'ostrich-sans',
    name: 'Ostrich Sans',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Light', value: 300, file: 'ostrich-sans-light.woff2' },
      { name: 'Regular', value: 400, file: 'ostrich-sans-regular.woff2' },
      { name: 'Bold', value: 700, file: 'ostrich-sans-bold.woff2' },
      { name: 'Black', value: 900, file: 'ostrich-sans-black.woff2' },
    ],
    styles: ['normal'],
  },

  // ── Serifs ──────────────────────────────────────────────
  {
    slug: 'eb-garamond',
    name: 'EB Garamond',
    category: 'serif',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'eb-garamond-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 400, max: 800, default: 400 },
    ],
  },
  {
    slug: 'libre-baskerville',
    name: 'Libre Baskerville',
    category: 'serif',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'libre-baskerville-variable.woff2' },
    ],
    styles: ['normal', 'italic'],
    axes: [
      { tag: 'wght', min: 400, max: 700, default: 400 },
    ],
  },
  {
    slug: 'young-serif',
    name: 'Young Serif',
    category: 'serif',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'young-serif-regular.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'liberation-serif',
    name: 'Liberation Serif',
    category: 'serif',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'liberation-serif-regular.woff2' },
      { name: 'Bold', value: 700, file: 'liberation-serif-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },

  // ── Display / Decorative ────────────────────────────────
  {
    slug: 'bluu-next',
    name: 'Bluu Next',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Bold', value: 700, file: 'bluu-next-bold.woff2' },
      { name: 'Titling', value: 800, file: 'bluu-next-titling.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'terminal-grotesque',
    name: 'Terminal Grotesque',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'terminal-grotesque-regular.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'anthony',
    name: 'Anthony',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'anthony-regular.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'bagnard',
    name: 'Bagnard',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'bagnard-regular.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'basteleur',
    name: 'Basteleur',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Moonlight', value: 400, file: 'basteleur-moonlight.woff2' },
      { name: 'Bold', value: 700, file: 'basteleur-bold.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'cotham-sans',
    name: 'Cotham Sans',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'cotham-sans-regular.woff2' },
    ],
    styles: ['normal'],
  },
  {
    slug: 'reglo',
    name: 'Reglo',
    category: 'display',
    variable: false,
    weights: [
      { name: 'Bold', value: 700, file: 'reglo-bold.woff2' },
    ],
    styles: ['normal'],
  },

  // ── Monospace ───────────────────────────────────────────
  {
    slug: 'liberation-mono',
    name: 'Liberation Mono',
    category: 'mono',
    variable: false,
    weights: [
      { name: 'Regular', value: 400, file: 'liberation-mono-regular.woff2' },
      { name: 'Bold', value: 700, file: 'liberation-mono-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'office-code-pro',
    name: 'Office Code Pro',
    category: 'mono',
    variable: false,
    weights: [
      { name: 'Light', value: 300, file: 'office-code-pro-light.woff2' },
      { name: 'Regular', value: 400, file: 'office-code-pro-regular.woff2' },
      { name: 'Medium', value: 500, file: 'office-code-pro-medium.woff2' },
      { name: 'Bold', value: 700, file: 'office-code-pro-bold.woff2' },
    ],
    styles: ['normal', 'italic'],
  },
  {
    slug: 'mplus',
    name: 'M PLUS',
    category: 'mono',
    variable: true,
    weights: [
      { name: 'Variable', value: 400, file: 'mplus1-variable.woff2' },
    ],
    styles: ['normal'],
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
    ],
  },
]

// Quick lookup for poster font randomization — the best display fonts
export const POSTER_FONTS = [
  'cooper-hewitt',
  'league-gothic',
  'oswald',
  'aileron',
  'poppins',
  'nimbus-sans',
  'bluu-next',
  'terminal-grotesque',
  'gap-sans',
  'ostrich-sans',
  'archivo',
  'work-sans',
  'basteleur',
  'reglo',
] as const
