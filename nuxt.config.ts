// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        { name: 'theme-color', content: '#BBFF00' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  // Bind to all interfaces so phone can reach dev server via Mac's IP
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  css: [
    'material-symbols/outlined.css',
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    // Server-only (not exposed to client)
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://ai-mantras-theta.vercel.app',
    },
  },
})
