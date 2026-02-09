import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { CURRENT_SETTINGS_VERSION } from '~/stores/settings'

const SETTINGS_VERSION_KEY = 'settings_version'

export default defineNuxtPlugin((nuxtApp) => {
  // On the client, check if the stored settings version matches the current one.
  // If not, wipe the old settings so fresh defaults take effect automatically.
  // This means: change defaults in code → bump SETTINGS_VERSION → done.
  // No more manual localStorage.clear().
  if (import.meta.client) {
    const storedVersion = localStorage.getItem(SETTINGS_VERSION_KEY)
    if (storedVersion !== String(CURRENT_SETTINGS_VERSION)) {
      localStorage.removeItem('settings')
      localStorage.setItem(SETTINGS_VERSION_KEY, String(CURRENT_SETTINGS_VERSION))
    }
  }

  nuxtApp.$pinia.use(piniaPluginPersistedstate)

  // Force restore persisted state after client-side hydration.
  // Without this, Nuxt SSR hydration overwrites localStorage values
  // with server-rendered defaults, so user changes appear lost on refresh.
  if (import.meta.client) {
    nuxtApp.hook('app:suspense:resolve', () => {
      const pinia = nuxtApp.$pinia
      for (const id of Object.keys(pinia.state.value)) {
        const saved = localStorage.getItem(id)
        if (saved) {
          try {
            Object.assign(pinia.state.value[id], JSON.parse(saved))
          } catch {}
        }
      }
    })
  }
})
